
/**
 * 容器控件
 * */
function takCtrl(){
}
defCls(takCtrl,takRendObj,{
	onCrtPro:function(opt){
		takRendObj.prototype.onCrtPro.call(this,opt);
		tak.genPro(this,'state',opt.state,this.stateChange);
		this.loadingOn=true;
	},
	onInit:function(opt){
		takRendObj.prototype.onInit.call(this,opt);
		this.baseV=this.newObj(opt.baseV,{type:'takView',id:'baseV'});
		if(tak.iObj(opt.lder))this.initLoader(opt.lder);
		if(tak.iObj(opt.cmter))this.cmter(opt.cmter);
		if(opt.param)this.param=opt.param;//请求参数定义
		if(tak.hStr(opt.loadParam))this.loadParam=opt.loadParam;
		if(opt.varDef)this.varDef=opt.varDef;
	},
	defCvtTmp:function(){
		return {type:'treeCvt'};
	},
	myVar:function(name,val){
		if(tak.hStr(name)){
			if(arguments.length==1&&this.varDef){
				var t=this.varDef[name];
				return tak.copy(t);
			}else if(arguments.length==2){
				if(!this.varDef)this.varDef={};
				this.varDef[name]=val;
			}
		}
	},
	initLoader:function(opt){
		if(tak.iObj(opt)){
			opt=tak.defTmp(opt,'def');
			var lds={},ld;
			for(var i in opt){
				ld=this.newObj(opt[i],this.defLoader());
				if(ld)lds[i]=ld;
			}
			this.loaders=lds;
		}
	},
	//默认加载器，不同控制器生成不同的加载器
	defLoader:function(){
		return {type:'takMLoad'};
	},
	//默认提交器，不同控制器生成不同的提交器
	defCommiter:function(){
		return {type:'takCommiter'};
	},
	/**
 	* 显示已改变处理方法
 	* */
	onVisibleChange:function(nv){
		this.eachChild(function(v){
			if(tak.ckTN(v,HtmlV)){
				v.visible=v;
			}
		});
	},
	rendSub:function(c){
		c.rend(this.baseV);
	},
	doRend:function(to){
		if(tak.ckTN(to,jQuery))this.baseV.rend(to);
		else if(tak.ckTN(to,takView))to.addObj(this.baseV);
		else if(tak.ckTN(to,takCtrl)&&to.baseV)to.baseV.addObj(this.baseV);
		this.rended=this.baseV.rended;
		return true;
	},
	rendTakView:function(obj){
		this.baseV.rendTakView(obj);
	},
	//可用状态改变，
	aplEnable: function(nv){
		takRendObj.prototype.aplEnable.call(this,nv);
		if(this.baseV)this.baseV.aplJQEnable(nv);
	},
	onRemove:function(){
		this.baseV.remove();
	},
	//读取或设置加载控制器
	lder:function(name){
		if(!tak.hStr(name))name='def';
		if(this.loaders){
			var ld=this.loaders[name];
			if(!ld)tak.logErr('控制器['+this.id+']下，未配置读取设备:'+name);
			return ld;
		}
		else tak.logErr('控制器['+this.id+']下，未配置读取设备。');
	},
	//读取或设置提交控制器
	cmter:function(opt){
		var cmt=this.commiter;
		if(!cmt||opt){
			var def=this.defCommiter();
			if(!opt){opt=def;def=null;}
			cmt=this.newObj(opt,def);
			this.commiter=cmt;
		}
		return cmt;
	},
	/**
 	* 状态改变
 	* */
	stateChange:function(ov,nv){
		var ok=tak.hStr(nv)
		if(ok){
			this.onStateChange(nv);
			this.doEv("stateChanged",nv);
		}
		return ok;
	},
	onStateChange:function(nv){
	},
	getLoadParam:function(fn,p){
		if(tak.hStr(fn)){
			var pf=this.getFunc(fn);
			if(pf)p=pf.call(this,this.param,p);
		}
		return p;
	},
	//提交服务请求
	commitData:function(sn,an,data){
		var cmt=this.cmter();
		if(cmt)cmt.commit(data,sn,an);
	},
	//从后台服务加载页面数据
	loadData:function(p,name,on){
		if(arguments.length==2&&tak.iObj(name)){
			on=name;
			name=null;
		}else if(arguments.length==1){
			on=this;name=null;
		}
		var lder=this.lder(name);
		if(lder)lder.load(p,on);
	},
	/**
 	* 刷新数据
 	* */
	refData:function(name){
		var lder=this.lder(name);
		if(lder)lder.refrash();
	},
	onWillCrt:function(type,tmp){
		takRendObj.prototype.onWillCrt.call(this,type,tmp);
		if(tak.ckTN(type,takCtrl)&&!tak.hStr(tmp.state))tmp.state=this.state;
	},
});

/**
 * 容器控件
 * */
function vCtrl(){
	
}
defCls(vCtrl,takCtrl,{
	onCrtPro:function(opt){
		takCtrl.prototype.onCrtPro.call(this,opt);
		this.loadingOn=true;
	},
	onInit:function(opt){
		takCtrl.prototype.onInit.call(this,opt);
		if(opt.filter)this.filter=new takFilter(opt.filter,false);
		if(tak.iObj(opt.views))this.initViews(opt.views);//单独定义主要是为了方便处理权限问题
	},
	initViews:function(opt){
		var views=[],b,t;
		for(var i in opt){
			b=opt[i];
			t=this.genVT(i,b);
			if(t)views.push(t);
		}
		this.views=views;
	},
	genVT:function(id,t){
		t=tak.defTmp(t,'tmp');
		if(t.tmp.jEven){
			t.tmp.jEven=tak.defTmp(t.tmp.jEven,'func');
			if(!t.tmp.jEven.on)t.tmp.jEven.on=this;
		}
		if(!tak.hStr(t.group))t.group='def';
		t.tmp.id=id;
		t.tmp=tak.unTmp(this.defBtn,t.tmp);
		if(!this.filter||this.filter.check(t.tmp)){
			if(tak.hStr(t.onState))t.onState=[t.onState];
			return t;
		}
	},
	//创建内容视图
	setUpViews:function(group,on,owner,mt){
		if(this.views){
			if(!tak.hStr(mt))mt=this.state;
			var vs=[],t,v,dto;
			if(!tak.hStr(group))group='def';
			if(!tak.ckTN(owner,takMoObj))owner=this;
			if(!tak.ckTN(on,takView))on=this.baseV;
			for(var i=0;i<this.views.length;i++){
				t=this.views[i];
				if(group==t.group){
					v=owner.getChild(t.tmp.id);
					if(v)v.dispose();
				}
			}
			for(var i=0;i<this.views.length;i++){
				t=this.views[i];
				if(group==t.group){
					if(!t.onState||t.onState.indexOf(mt)>=0){
						dto=on.getConObj(t.tmp);
						if(dto){
							v=owner.newObj(t.tmp,dto.subDef);
							if(v){
								dto.addObj(v);
								this.doEv('createViewed',v);
							}
						}
					}
				}
			}
		}
	},
	valid:function(view,sf,ef){
		if(view){
			var r=view.valid();
			if(r.s==true&&sf)this.getFunc(sf,this,r.v);
			else if(r.s==false&&ef)this.getFunc(ef,this,r.m);
			return r;
		}
	}
})