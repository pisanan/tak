
/**
 * 视图容器控件
 * */
function takMoldel(){
}
defCls(takMoldel,takMoObj,{
	onLoad:function(opt){
		takMoObj.prototype.onLoad.call(this,opt);
		if(tak.iObj(opt.pro))this.pros=this.initPros(opt.pro);
		if(tak.iObj(opt.views))this.views=this.initViews(opt.views);
		if(opt.filter)this.filter=new takFilter(opt.filter,false);
	},
	initPros:function(opt){
		var pros={},p;
		for(var i in opt){
			pros[i]=tak.defTmp(opt[i],'name');
		}
		return pros;
	},
	//解析视图配置
	initViews:function(opt){
		var tmps=[],t,p,mt,f;
		for(var i in opt){
			p=this.pros[i];
			if(p){
				t=tak.defTmp(opt[i],'tmp');
				mt={};
				mt.tmp=tak.defTmp(t.tmp,'type');
				mt.tmp.bind=i;
				mt.tmp.id=i;
				mt.tmp.pro=p;
				if(tak.iObj(t.func)){
					mt.func={};
					for(var j in t.func){
						f=tak.defTmp(t.func,'cmd');
						mt.func[j]=tak.createFun(j,f.args,f.cmd);
					}
				}
				if(tak.hStr(t.onState))mt.onState=[t.onState];
				else if(tak.iAry(t.onState)) mt.onState=t.onState;
				tmps.push(mt);
			}
		}
		return tmps;
	},
	//解析视图配置
	initCells:function(opt){
		var tmps={},t,p;
		for(var i in opt){
			p=this.pros[i];
			if(p){
				t=tak.defTmp(opt[i],'type');
				t.bind=i;
				t.id=i;
				t.pro=p;
				tmps[i]=t;
			}
		}
		return tmps;
	},
	clearViews:function(on){
		if(this.views){
			var v;
			for(var i in this.views){
				v=on.getChild(i);
				if(v)v.dispose();
			}
		}
	},
	//根据模板创建控件
	genViews:function(state){
		if(this.views){
			var ts=[],mt;
			for(var i in this.views){
				mt=this.views[i];
				if(this.checkCon(mt,state))ts.push(mt.tmp);
			}
			if(this.filter)ts=this.filter.getObjs(ts);
			return ts;
		}
	},
	execAct:function(on,act,args){
		if(!on||!this.views)return;
		if(args&&!tak.iAry(args))args=[args];
		var mt,v,f;
		for(var i in this.views){
			mt=this.views[i];
			if(mt.func){
				f=mt.func[act];
				if(f){
					v=on.getChild(i);
					if(v)f.apply(v,args)
				}
			}
		}
	},
	//条件校验
	checkCon:function(mt,state){
		if(!mt.onState)return true;
		return mt.onState.indexOf(state)>=0;
	}
});