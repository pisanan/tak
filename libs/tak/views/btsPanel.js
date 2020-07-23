
function btsPanel(){
}
defCls(btsPanel,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.sct='md';
		this.autoRow=true;
	},
	onInit:function(opt){
		takView.prototype.onInit.call(this,opt);
		var tv=this.getPro('sct');
		if(tv)this.sct=tv;
		tv=this.getPro('autoRow');
		if(tv)this.autoRow=tv=='1';
	},
	getCellLenght:function(v){
		var l=v.getPro("cl");
		if(!tak.iNum(l)||l>12||l<=0)l=6;
		return l;
	},
	getRowView:function(iCol,hFill){
		var cv=this.cv;
		if(!this.rowVs)this.rowVs=[];
		if(this.rowVs.length>0&&iCol<12){
			var i=0;
			if(!this.autoRow)i=this.rowVs.length-1;
			for(;i<this.rowVs.length;i++){
				if(this.rowVs[i].cv+iCol<=12)return this.rowVs[i];
			}
		}
		var name="row"+(this.rowVs.length+1).toString();
		var rV;
		if(!hFill){
			rV=this.crtJQO("div",name,"row");
			this.baseJqo.append(rV);
		}
		var rowV={rv:rV,cv:0,subs:[],name:name};
		this.rowVs.push(rowV);
		return rowV;
	},
	onRmSubed:function(s){
		takView.prototype.onRmSubed.call(this,s);
		if(this.rowVs){
			var r;
			for(var i=0;i<this.rowVs.length;i++){
				r=this.rowVs[i];
				for(var j=0;j<r.subs.length;j++){
					if(r.subs[j].v==s){
						r.cv-=r.subs[j].c;
						r.subs.splice(j,1);
						break;
					}
				}
				if(r.subs.length==0){
					this.rmJQO(r.name);
					this.rowVs.splice(i,1);
					break;
				}
			}
		}
	},
	rendSub:function(v){
		var sct=v.getPro('sct');
		if(!tak.hStr(sct))sct=this.sct;
		var vv=this.getCellLenght(v);
		var rv=this.getRowView(vv,v.getPro('hFill')=='1');
		rv.subs.push({v:v,c:vv});
		rv.cv+=vv;
		if(rv.rv){
			v.rend(rv.rv);
			v.addJQClass('col-'+sct+'-'+vv.toString());
		}
		else {
			v.rend(this.baseJqo);
			v.addJQClass('tak-col-fill');
		}
	},
	
	
});
