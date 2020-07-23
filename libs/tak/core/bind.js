
/**
 * 容器控件对象绑定扩展
 * */
function takBindM(o){
	this.owner=o;
	if(o)this.val=o.val();
}
defCls(takBindM,{
	getVal:function(v){
		if(this.bds){
			if(!tak.iObj(v))v={};
			for(var i=0;i<this.bds.length;i++){
				v=this.bds[i].getData(v);
			}
		}
		return v;
	},
	setVal:function(v){
		this.val=v;
		this.setData(v);
	},
	addObj:function(pn,obj){
		if(!obj)return;
		var binder=new takBindp(obj,pn);
		if(!this.bds)this.bds=[];
		this.bds.push(binder);
		var v=this.val;
		if(v)binder.setData(v);
	},
	remove:function(obj){
		if(this.bds){
			var index;
			for(var i=0;i<this.bds.length;i++){
				if(this.bds[i].owner==obj){
					this.bds.splice(i,1);
					i--;
				}
			}
		}
	},
	setData:function(v){
		if(this.bds){
			for(var i=0;i<this.bds.length;i++){
				this.bds[i].setData(v);
			}
		}
	}
})

function takBindp(o,pn){
	this.owner=o;
	this.pn=pn;
}
defCls(takBindp,{
	setData:function(val){
		if(this.owner.bindOn()){
			var v=this.getVal(val,this.pn);
			this.owner.reVal(v);
		}
	},
	getData:function(val){
		if(this.owner.bindOn()&&tak.hStr(this.pn)){
			var v=this.owner.getVal();
			if(!isNull(v)){
				val=this.setVal(val,v,this.pn);
			}
		}
		return val;
	},
	getVal:function(val,pn){
		if(!tak.hStr(pn))return null;
		var idl=tak.splStrDot(pn);
		var id,o=val;
		var i=0;
		if(idl[0]=='this')i=1;
		for(;i<idl.length;i++){
			id=idl[i];
			if(id.length==0)continue;
			if(!tak.iObj(o))return;
			o=o[id];
			if(!o)return;
		}
		return o; 
	},
	setVal:function(val,v,pn){
		if(!tak.hStr(pn))return null;
		if(pn=='this')return v;
		var idl=tak.splStrDot(pn);
		if(!tak.iObj(val))val={};
		var id,o=val;
		var i=0;
		if(idl[0]=='this')i=1;
		for(;i<idl.length-1;i++){
			id=idl[i];
			if(!tak.iObj(o))o[id]={};
			o=o[id];
		}
		o[idl[i]]=v;
		return val; 
	}
})
