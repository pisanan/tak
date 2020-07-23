
/**
 * 模板对象基类
 * */
function takRendObj(){
}
defCls(takRendObj,takColObj,{
	onCrtPro:function(opt){
		takColObj.prototype.onCrtPro.call(this,opt);
		tak.genPro(this,"parent",null,this.paChange);
		tak.genPro(this, "visible", opt.visible=="0"?false:true, this.visibleChange);
		tak.genPro(this,"enable",opt.enable=='0'?false:true,this.enableChange);
		this.ldReqCount=0;
		this.loadingOn=false;
		this.rended=false;
		this.baseV=null;
		this.valBindOn=true;
	},
	showPage:function(opt){
		$.takApp.showPage(opt,this);
	},
	bindOn:function(v){
		if(tak.iBool(v))this.valBindOn=v;
		return this.valBindOn;
	},
	onInit:function(opt){
		takColObj.prototype.onInit.call(this,opt);
		if(tak.hStr(opt.bind))this.setBind(opt.bind);//数据绑定配置
		if(opt.loadingOn)this.loadingOn=(opt.loadingOn=="0"?false:true);
		if(!isNull(opt.val))this.__val__=opt.val;
		if(opt.cvt)this.setDCvt(this.newObj(tak.unTmp(this.defCvtTmp(),opt.cvt)))//值转化配置
		this.opt=opt;
	},
	setDCvt:function(cvt){
		this.dCvt=cvt;
		var os;
		if(this.dCvt){
			os=this.dCvt.getOpts();
			this.dCvt.bindEv('optsChange',function(s,os){
				this.onCvtOptsChange(os)
				},this);
		}
		this.onCvtOptsChange(os);
	},
	onCvtOptsChange:function(opts){
		this.setVal(this.__val__);
	},
	loadTmp:function(){
		if(this.opt){
			var opt=this.opt;
			delete this.opt;
			this.onLoad(opt);
			this.doEv("loaded");
		}
	},
	onLoad:function(opt){
		
	},
	defCvtTmp:function(){
		return {type:'ListCvt'};
	},
	//添加绑定
	setBind:function(bid){
		if(tak.ckTN(this.owner,takRendObj)){
			this.owner.rmBind(this);
			if(tak.hStr(bid))this.owner.addBind(this,bid);
		}
	},
	/**
	 * 可用状态改变处理方法
	 * */
	enableChange:function(ov,nv){
		var ok=tak.iBool(nv)
		if(ok!=false){
			this.aplEnable(this.getRealEnable());
			this.doEv("enableChanged",nv);
		}
		return ok;
	},
	//添加绑定控件
	addBind:function(v,pn){
		if(!this.bindm)this.bindm=new takBindM(this);
		this.bindm.addObj(pn,v);
	},
	//移除绑定控件
	rmBind:function(v){
		if(this.bindm)this.bindm.remove(v);
	},
	visibleChange:function(ov,nv){
		var ok=tak.iBool(nv)
		if(ok!=false){
			this.onVisibleChange(nv);
			this.doEv("visibleChanged",nv);
		}
		return ok;
	},
	/**
 	* 绑定父级对象事件处理方法
 	* @param {String}n 事件名称
 	* @param {Function}f 处理函数 参数：e 事件参数 s 事件发送者
 	* */
	bindPaEv:function(n,f){
		if(this.parent)this.parent.bindEv(n,f,this);
	},
	/**
 	* 父级对象改变处理方法
 	* @param {Any}ov 旧值
 	* @param {Any}nv 新值
 	* @return {Boolean} 返回false表示取消赋值
 	* */
	paChange:function(ov,nv){
		var ok=this.parentWillchange(ov,nv);
		if(ok!=false){
			if(tak.ckTN(ov,takColObj))ov.removeSub(this);
			if(this.disposed!=true){
				this.onParentChanged(nv);
				this.doEv("parentChanged",nv);
			}
		}
		return ok;
	},
	/**
 	* 父级对象即将改变
 	* @param {Any}ov 旧值
 	* @param {Any}nv 新值
 	* @return {Boolean} 返回false表示取消赋值
 	* */
	parentWillchange:function(ov,nv){return isNull(nv)||tak.ckTN(nv,takRendObj);},
	/**
 	* 显示已改变处理方法
 	* */
	onVisibleChange:function(nv){},
	/**
 	* 父级对象已经改变
 	* @param {Any}ov 旧值
 	* @param {Any}nv 新值
 	* */
	onParentChanged:function(nv){},
	/**
 	* 显示加载页
 	* */
	loading: function(msg,isCmt) {
		if(this.loadingOn){
			this.ldReqCount++;
			if(this.baseV&&this.baseV.rended){
				if(this.ldReqCount>1){
					this.enable=false;
					$.takApp.showMsg(this.baseV.baseJqo,msg);
				}
				else $.takApp.loading(this.baseV.baseJqo,msg,isCmt);
			}
			return this;
		}
	},
	showMsg:function(msg) {
		if(this.rended&&this.ldReqCount>0)$.takApp.showMsg(this.baseV.baseJqo,msg);
	},
	/**
 	* 关闭加载页
 	* */
	hideLoading: function(){
		if(this.ldReqCount>0){
			this.ldReqCount--;
			if(this.rended&&this.ldReqCount==0){
				this.enable=true;
				$.takApp.loaded(this.baseV.baseJqo);
			}
		}
		
	},
	/**
 	* 渲染视图
 	* @param {jQuery} 视图渲染容器
 	* */
	rend: function(to){
		if(this.doRend(to)){
			this.loadTmp();
			this.onRended();
		}
	},
	doRend:function(to){
		return false;
	},
	append:function(jqo){
		
	},
	onRended:function(){
		this.rendSubs();
		this.rendVal();
		this.aplEnable(this.getRealEnable());
		this.doEv("rended");
	},
	rendVal:function(){
		if(isNull(this.__val__))this.__val__=this.getPro('dVal');
		if(this.__val__){
			this.reVal();
			return true;
		}else return false;
	},
	rendSubs:function(){
		tak.eachAry(this,this.subs,function(s){
			this.rendSub(s);
		});
	},
	onRmSubed:function(o){
		takColObj.prototype.onRmSubed.call(this,o);
		o.remove();
	},
	onAdSubed:function(o){
		takColObj.prototype.onAdSubed.call(this,o);
		if(this.rended)this.rendSub(o);
	},
	rendSub:function(v){
		
	},
	//可用状态改变，
	aplEnable: function(nv){
		this.eachSub(function(v){
			v.aplEnable(nv);
		});
	},
	getRealEnable:function(){
		if(!this.enable)return this.enable;
		if(this.parent)return this.enable&&this.parent.getRealEnable();
		else return this.enable;
	},
	/**
	 * 读取或设置控件值
	 * */
	val:function(v){
		if(arguments.length==1){
			if(this.__val__!=v){
				this.reVal(v);
				this.doEv('valChanged',v);
			}
		}
		else return this.__val__;
	},
	/**
	 * 强制刷新页面显示(对象值更新或重置输入内容时使用)
	 * */
	reVal:function(v){
		if(arguments.length==1)this.__val__=v;
		if(this.rended)this.setVal(this.__val__);
	},
	getVal:function(){
		if(this.bindm){
			var v=this.getHVal();
			if(isNull(v))v=this.__val__;
			return this.bindm.getVal(v);
		}
		return this.getHVal();
	},
	setVal:function(v){
		if(this.bindm)this.bindm.setVal(v);
		this.setHVal(v);
		this.doHValChange();
	},
	getHVal:function(){
		return this.__val__;
	},
	setHVal:function(v){
		
	},
	doHValChange:function(){
		this.doEv('hValChange',this.getHVal());
	},
	/**
 	* 移除可见对象
 	* */
	remove: function(){
		if(this.rended){
			this.rended = false;
			this.parent=null;
			if(this.disposed!=true){
				this.onRemove();
				this.doEv('removed');
			}
		}
	},
	onRemove:function(){
	},
	/**
 	* 释放资源
 	* */
	dispose:function(){
		this.remove();
		this.setBind(null);
		takColObj.prototype.dispose.call(this);
	}
})