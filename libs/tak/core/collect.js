
//jq元素容器
function takColObj(){
}
defCls(takColObj,takMoObj,{
	onCrtPro:function(opt){
		takMoObj.prototype.onCrtPro.call(this,opt);
		this.subDef=null;
	},
	onInit:function(opt){
		takMoObj.prototype.onInit.call(this,opt);
		if(opt.oMap)this.oMap=this.initMap(opt.oMap);
		if(opt.subDef)this.subDef=tak.unTmp(this.subDef,opt.subDef);
		if(tak.iObj(opt.subs))this.genSubs(opt.subs);
	},
	genSubs:function(subs){
		this.addSubs(this.newObjs(subs,this.subDef));
	},
	initMap:function(opt){
		var map=this.newObj(opt,{type:'takObjMap'});
		return map;
	},
	//获取对象容器，如果没有定义vMap,则直接添加到自身下级
	getConObj:function(o){
		if(this.oMap){
			var cid=this.oMap.getCon(o);
			if(cid)return this.findChild(cid);
		}
		else return this;
	},
	addTObjs:function(tmps,def){
		var vs=this.newObjs(tmps,def);
		if(vs)this.addObjs(vs);
		return vs;
	},
	addTObj:function(tmp,def){
		if(!def&&tmp!=this.subDef)def=this.subDef;
		var v=this.newObj(tmp,def);
		if(v)this.addObj(v);
		return v;
	},
	objPkg:function(o){
		return o;
	},
	addObjs:function(os){
		tak.eachAry(this,os,function(o){
			this.addObj(o);
		});
	},
	addObj:function(o){
		if(o){
			var c=this.getConObj(o);
			if(c)c.addSub(o);
		}
	},
	hasSub:function(){
		return this.subs&&this.subs.length>0;
	},
	//添加子视图集合
	addSubs:function(os,d){
		if(!os)return;
		tak.eachAry(this,os,this.addSub,d);
	},
	//添加子视图
	addSub:function(o){
		if(o&&tak.ckTN(o,takMoObj)){
			o=this.objPkg(o);
			if(o){
				if(!this.subs)this.subs=[];
				if(this.subs.indexOf(o)>=0)return;
				this.doEv("subWillAdd",o);
				this.subs.push(o);
				this.onAdSubed(o);
				this.doEv("subAdded",o);
				return true;
			}
		}
		return false;
	},
	getCount:function(){
		if(this.subs)return this.subs.length;
		else return 0;
	},
	//移除子视图
	removeSub:function(v){
		if(!this.subs)return;
		this.removeSubAt(this.subs.indexOf(v));
	},
	getSubByIndex:function(index){
		if(this.subs&&this.subs.length>index)return this.subs[index];
	},
	getSubIndex:function(o){
		return this.subs.indexOf(o);
	},
	//移除子视图
	removeId:function(id){
		this.getSub(id,function(b){
			this.removeSub(b);
		},this)
	},
	//移除子视图
	removeSubAt:function(i){
		if(i<0||i>=this.subs.length||!this.subs)return;
		var a=this.subs[i];
		this.subs.splice(i,1);
		this.onRmSubed(a);
		if(this.subs.length==0)this.subs=null;
		this.doEv("subRemoved",a);
	},
	//清空子视图
	clearSubs:function(f,o){
		if(!this.subs)return;
		var a;
		if(!o)o=this;
		var subs=this.subs;
		while(subs.length>0){
			a=subs[0];
			if(f)f.call(o,a);
			a.parent=null;
		}
	},
	onRmSubed:function(o){
		o.parent=null;
	},
	onAdSubed:function(o){
		o.parent=this;
		if(tak.hStr(o.id))this.onAddSubId(o.id,o);
	},
	onAddSubId:function(id,obj){
		this.doEv("subAddedId",{path:'this.'+id,obj:obj});
		if(this.parent&&tak.hStr(this.id))this.parent.onAddSubId(this.id+'.'+id,obj);
	},
	eachSub:function(f,o,k){
		if(!this.subs||!tak.iFun(f))return;
		var to,v;
		for(var i=0;i<this.subs.length;i++){
			v=this.subs[i];
			to=(o)?o:v;
			f.call(to,v);
			if(k)v.eachSub(f,o,k);
		}
	},
	actSub:function(act,args,k){
		var f=this.getFunc(act);
		if(args&&!tak.iAry(args))args=[args];
		if(tak.iFun(f)){
			var v;
			for(var i=0;i<this.subs.length;i++){
				v=this.subs[i];
				f.apply(v,args);
				if(k)v.actSub(act,args,k);
			}
		}
	},
	getSubPath:function(ids,f,o){
		if(!tak.hStr(ids))return this;
		var idl=tak.splStrDot(ids);
		var id,o=this;
		var i=0;
		if(idl[0]=='this')i=1;
		for(;i<idl.length;i++){
			id=idl[i];
			o=o.getSub(id);
			if(!o)return;
		}
		if(o&&tak.iFun(f)){
			if(!to)to=o;
			f.call(to,o);
		}
		return o;
	},
	
	getSub:function(id,f,o){
		var rv;
		if(isNull(id)||id=='')return this;
		else if(this.subs){
			var v;
			for(var i=0;i<this.subs.length;i++){
				v=this.subs[i];
				if(v.id==id){
					rv=v;
					break;
				}
			}
		}
		if(rv&&tak.iFun(f)){
			var to=(o)?o:v;
			f.call(to,v);
		}
		return rv;
	},
})


/**
 * 容器映射
 * */
function takObjMap(){
}
defCls(takObjMap,takTmpObj,{
	onInit:function(opt){
		takTmpObj.prototype.onInit.call(this,opt);
		this.pn='alias';
		if(tak.hStr(opt))this.def=opt;
		else if(tak.iObj(opt)){
			opt=tak.defTmp(opt,'map');
			this.def=opt.map.def;
			this.map=opt.map;
			if(tak.hStr(opt.pn))this.pn=opt.pn;
		}
	},
	getPNCon:function(pn){
		if(this.map)return this.map[pn];
		return this.def;
	},
	getCon:function(o){
		if(tak.iObj(o)){
			var c;
			if(this.map){
				var pv;
				if(this.pn=='id')pv=o.id;
				else if(o.pro)pv=o.pro[this.pn];
				if(pv)c=this.map[pv];
			}
			if(!c)c=this.def;
			return c;
		}
		return this.def;
	}
})