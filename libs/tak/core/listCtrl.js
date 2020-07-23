

function listCtrl(){
}
defCls(listCtrl,takCtrl,{
	onCrtPro:function(opt){
		takCtrl.prototype.onCrtPro.call(this,opt);
		this.subDef={type:"vCtrl"};
		this.subid=0;
	},
	onInit:function(opt){
		takCtrl.prototype.onInit.call(this,opt);
		if(tak.iObj(opt.conView)){
			this.conView=opt.conView;
			this.conView.id=null;
		}
		if(tak.iObj(opt.ctrls))this.initCtrls(opt.ctrls);
	},
	genSubs:function(subs){
		//这里是在渲染之前执行，所以直接添加
		if(tak.iObj(subs)){
			var c;
			for(var i in subs){
				c=subs[i];
				if(tak.iObj(c)){
					c.id=i;
					c=this.newObj(c,this.subDef);
					this.addCtrl(c);
				}
			}
		}
	},
	//初始化控制器配置集合。不同于subs配置在于该配置可以在激活时自动加载
	initCtrls:function(opt){
		var o;
		for(var i in opt){
			o=tak.defTmp(opt[i],'ctrl');
			o.id=i;
			this.addCtrl(o);
		}
	},
	//渲染完成后，如果没有指定要打开的控制器，则默认打开最后一个
	rendSubs:function(){
		if(this.ctrls&&this.ctrls.length>0){
			if(a)this.openCtrl(this.ctrls[0].id);
		}
	},
	//新的控制器被添加进来
	rendSub:function(c){
		if(c){
			var co;
			if(tak.hStr(c.id))co=this.openCtrl(c.id);
			else c.id=this.getCtrlId();
			if(!co)this.addCtrl(c);
			else {
				if(co.view==this.baseV)c.visible=co.active;
				c.rend(co.view);
			}
		}
	},
	onRmSubed:function(o){
		takCtrl.prototype.onRmSubed.call(this,o);
		if(tak.ckTN(o,takCtrl)&&tak.hStr(o.id))this.rmCtrl(o.id);
	},
	getCtrlId:function(){
		var id='at_ctrl_'+this.subid.toString();
		this.subid++;
		return id;
	},
	getCtrlById:function(id,fun,on){
		var c,a;
		if(this.ctrls){
			for(var i=0;i<this.ctrls.length;i++){
				c=this.ctrls[i];
				if(c.id==id)a=c;
			}
			if(a&&tak.iFun(fun))fun.call(on,a);
		}
		return a;
	},
	//循环当前控制器集合下的所有控制器
	eachCtrl:function(f,o){
		if(this.ctrls){
			var c;
			for(var i=0;i<this.ctrls.length;i++){
				c=this.ctrls[i];
				f.call(o,c);
			}
		}
	},
	//通过过滤函数查找控制器
	findCtrl:function(flt,on){
		var cs=[];
		if(this.ctrls){
			var c;
			for(var i=0;i<this.ctrls.length;i++){
				c=this.ctrls[i];
				if(flt.call(on,c)==true)cs.push(c);
			}
		}
		return cs;
	},
	//通过过滤函数查找控制器
	findCtrlF:function(flt,on){
		if(this.ctrls){
			var c;
			for(var i=0;i<this.ctrls.length;i++){
				c=this.ctrls[i];
				if(flt.call(on,c)==true)return c;
			}
		}
	},
	//添加控制器配置对象
	addCtrl:function(opt){
		if(tak.ckTN(opt,takCtrl))return this.addCtrl(this.crtCtrlOpt(opt));
		if(!tak.hStr(opt.id))opt.id=this.getCtrlId();
		var oc=this.getCtrlById(opt.id);
		if(oc){
			this.openCtrl(opt.id);
			return oc;
		}
		else {
			if(!this.ctrls)this.ctrls=[];
			opt.active=false;
			this.ctrls.push(opt);
			this.onAddOpted(opt);
			return opt;
		}
	},
	//新增控制器配置后的处理函数
	onAddOpted:function(opt){
		if(this.rended)this.openCtrl(opt.id);
	},
	crtCtrlOpt:function(c){
		return {id:c.id,obj:c};
	},
	//通过制定控制器id激活控制器
	openCtrl:function(id){
		if(this.ctrls)return this.activeCtrl(this.getCtrlById(id));
	},
	//移除控制器
	rmCtrl:function(ctrl){
		if(tak.ckTN(ctrl,takCtrl)){
			if(tak.hStr(ctrl.id))ctrl=this.getCtrlById(ctrl.id);
			else return;
		}else if(tak.hStr(ctrl))ctrl=this.getCtrlById(ctrl);
		if(ctrl.obj){
			var o=ctrl.obj;
			delete ctrl.obj;
			if(o.owner==this)o.dispose();
			else o.remove();
		}
		this.onRmCtrled(ctrl);
	},
	onRmCtrled:function(ctrl){
		if(ctrl.view&&ctrl.view!=this.baseV)ctrl.view.dispose();
		delete ctrl.view;
		this.onHideCtrled(ctrl);
		var c,nc;
		for(var i=0;i<this.ctrls.length;i++){
			c=this.ctrls[i];
			if(c.id==ctrl.id){
				this.ctrls.splice(i,1);
				if(c.active){
					if(i<this.ctrls.length)nc=this.ctrls[i];
					else if(i>0&&this.ctrls.length>0)nc=this.ctrls[i-1];
					if(nc)this.showCtrl(nc);
				}
				break;
			}
		}
	},
	//激活控制器处理函数
	activeCtrl:function(nc){
		if(nc){
			var oc=this.findCtrlF(function(c){
				return c!=nc&&c.active;
			},this);
			if(oc)this.hideCtrl(oc);
			if(nc)this.showCtrl(nc);
			return nc;
		}
	},
	//隐藏控制器处理
	hideCtrl:function(ctrl){
		ctrl.active=false;
		if(ctrl.view!=this.baseV)ctrl.view.visible=false;
		else if(ctrl.obj)ctrl.obj.visible=false;
		this.onHideCtrled(ctrl);
	},
	//被隐藏后触发事件
	onHideCtrled:function(ctrl){
		this.doEv('hideCtrled',ctrl);
	},
	//激活控制器处理
	showCtrl:function(ctrl){
		if(!ctrl.view){
			if(this.conView)ctrl.view=this.newObj(this.conView);
			if(!ctrl.view)ctrl.view=this.baseV;
			else this.baseV.addObj(ctrl.view);
		}
		if(!ctrl.obj)this.reqCtrl(ctrl);
		if(!ctrl.active){
			ctrl.active=true;
			if(ctrl.view!=this.baseV)ctrl.view.visible=true;
			else if(ctrl.obj)ctrl.obj.visible=true;
			this.onShowCtrled(ctrl);
		}
	},
	//被激活后触发事件
	onShowCtrled:function(ctrl){
		this.doEv('showCtrled',ctrl);
	},
	reqCtrl:function(ctrl){
		if(ctrl&&ctrl.ctrl){
			this.loadCtrl(ctrl,function(tmp){
				this.genCtrl(ctrl,tmp);
				ctrl.view.hideLoading();
			},this)
		}
	},
	//根据模板生成控制器
	genCtrl:function(ctrl,tmp){
		if(ctrl.view){//没有表示已经被关掉了
			if(tak.iObj(tmp)&&tak.hStr(ctrl.rid))tmp=tmp[ctrl.rid];
			if(tak.iObj(tmp)){
				tmp=tak.unTmp(tmp,ctrl);
				ctrl.obj=this.newObj(tmp,this.subDef);
				if(!ctrl.obj){
					this.alertError('控制器','控制器配置无效');
					this.rmCtrl(ctrl);
				}
				else {
					try{
						this.addObj(ctrl.obj);
					}catch(err){
						this.alertError('控制器','控制器配置错误，加载失败。',err);
						this.rmCtrl(ctrl);
					}
				}
			}
		}
	},
	//加载控制器
	loadCtrl:function(ctrl,cb,on){
		this.doEv('beginLoadCtrl',ctrl);
		$.takApp.loadFile(ctrl.ctrl,function(msg){
			this.doEv('loadCtrlMsg',{ctrl:ctrl,msg:msg});
		},function(isOk,data,code,msg){
			if(isOk){
				if(tak.iObj(data)){
					data=tak.copy(data);
					cb.call(on,data);
				}else{
					this.alertError('配置','控制器无配置参数，或格式错误。');
					this.rmCtrl(ctrl);
				}
			}
			else{
				this.alertError(code,msg);
				this.rmCtrl(ctrl);
			}
			this.doEv('ctrlLoadComplate',ctrl);
		},this)
	}
});
