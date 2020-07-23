function takApp(){
	this.srvMng=new takSrvMag();
	this.pages=[];
	this.viewPros=new Map();
	takInitOpt(this);
}
defCls(takApp,takMoObj,{
	setOpt:function(opt){
		this.initOpt=$.extend(true,{},this.initOpt, opt);
	},
	/**
 	* 注册视图样式
	* @param {String}tn 视图视图样式名称 匹配type
	* @param {String}vg 视图状态
 	* @param {Function}pros 视图视图样式
 	* */
	regVAtts:function(tn,vg,att){
		if(!tak.iObj(att))att=vg;//参数前滚处理
		if(!tak.iStr(vg))vg="def";
		if(!att.base)att={base:att};
		var src=this.viewPros.get(tn);
		if(!src){
			src={};
			this.viewPros.set(tn,src);
		}
		src[vg]=att;
	},
	getDefOpt:function(){
		return this.initOpt.defOpt;
	},
	/**
	 * 读取视图样式
	 * */
	getVAtts:function(tn){
		return this.viewPros.get(tn);
	},
	alertF:function(){
		return this.initOpt.alert;
	},
	confirmF:function(){
		return this.initOpt.confirm;
	},
	//读取或设置模板文件读取设备
	tmpLoader:function(lder){
		if(lder)this.initOpt.tmpLoader=lder;
		return this.initOpt.tmpLoader;
	},
	loadFile:function(tmp,sm,cb,on){
		return this.initOpt.tmpLoader.loadFile(tmp,sm,cb,on);
	},
	getModelLoader:function(){
		return this.initOpt.modelLoader;
	},
	pageTmp:function(pType,tmp){
		if(!tak.hStr(pType))return;
		if(this.initOpt){
			if(tmp)this.initOpt.pageTmp[pType]=tmp;
			return this.initOpt.pageTmp[pType];
		}
	},
	getSrv:function(tn){
		return this.srvMng.getSrvBySN(tn);
	},
	loading:function(target,msg,isCmt){
		if(!target)target=$('body');
		this.initOpt.loading(target,msg,isCmt);
	},
	showMsg:function(target,msg){
		if(!target)target=$('body');
		this.initOpt.showMsg(target,msg);
	},
	loaded:function(target){
		if(!target)target=$('body');
		this.initOpt.loaded(target);
	},
	/**
 	* 安装服务
 	* @param{String}mName 服务名称
 	* @param{Object}srv 服务对象或服务构造方法
	* */
	setUpService:function(mName,srv){
		this.srvMng.addSrv(mName,srv);
	},
	resizePage:function(p,css){
		var bW=$('body').outerWidth(),bH=$('body').outerHeight();
		
		var ms=0.4,hs=0.8;
		if(bW<=768)ms=1;
		else if(bW<= 992)ms=0.8;
		else if(bW<= 1400)ms=0.6;
		
		if(bH<= 662)hs=1;
		else if(bH<= 818)hs=0.9;
		
		if(!tak.iObj(css))css={width:bW*ms,height:bH*hs};
		else{
			if(!css.width)css.width=bW*ms;
			if(!css.height)css.height=bH*hs;
		}
		p.baseV.baseJqo.css(css);
	},
	openPage:function(opt,css){
		var on=$('body');
		var page=this.showPage(opt,on);
		this.resizePage(page,css);
		this.pushPage(page);
	},
	showDialog:function(opt,on,css){
		if(!on)on=$('body');
		var bl=$('<div>',{"class":"tak-dialog-back"});
		on.append(bl);
		var p=this.showPage(opt,bl);
		if(p){
			this.resizePage(p,css);
			var jq=p.baseV.baseJqo;
			jq.css({top:(bl.innerHeight()-jq.outerHeight())/2,
			left:(bl.innerWidth()-jq.outerWidth())/2})
			p.bindEv('disposed',function(s){
				bl.remove();
			},this);
		}else bl.remove();
	},
	showPage:function(opt,on){
		if(!on)on=$('body');
		if(!tak.hStr(opt.pType))opt.pType='None';
		var tmp=tak.unTmp({type:'takPage'},this.pageTmp(opt.pType));
		try{
			var start= (new Date).getTime();
			var page=this.newObj(tmp);
			if(page){
				page.id=tak.uuid();
				page.rend(on);
				if(page.rended)page.addCtrl(opt);
				else this.alertError('错误','页面渲染失败');
			}else this.alertError('错误','页面生成失败');
			var end=(new Date).getTime();
			console.log("页面加载耗时："+(end-start)+"ms");
			return page;
		}catch(err){
			this.alertError('错误','页面生成失败',err);
		}
	},
	pushPage:function(p){
		if(tak.ckTN(p,takCtrl)&&p.baseV&&p.baseV.baseJqo){
			this.pages.push(p);
			var index=this.pages.length;
			p.baseV.baseJqo.css({"z-index":index+10000});
			p.baseV.baseJqo.css({top:20*index,left:20*index});
			p.bindEv('disposed',function(s){
				var i=this.pages.indexOf(s);
				if(i>=0){
					this.pages.splice(i,1);
					this.resetIndex(i);
				}
			},this);
		}
	},
	bringToFront:function(p){
		var i=this.pages.indexOf(p);
		if(i>=0){
			this.pages.splice(i,1);
			this.pages.push(p);
			this.resetIndex(i);
		}
	},
	resetIndex:function(index){
		if(!tak.iNum(index))index=0;
		var p;
		for(var i=index;i<this.pages.length;i++){
			p=this.pages[i];
			p.baseV.baseJqo.css({"z-index":i+10000+1});
		}
	}
});
