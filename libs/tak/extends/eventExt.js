
/**
 * 容器路径事件处理绑定
 * */
function takEventExt(){
	
}
defPlg(takEventExt,takTmpObj,'eves',{
	onInit:function(opt){
		this.bindOwnerEv("subAddedId",this.bindSubTmp);
		this.bindOwnerEv("childCreatedId",this.bindChildTmp);
		this.loadEvent(opt);
	},
	loadEvent:function(eves){
		if(!eves)return;
		if(tak.iObj(eves))eves=[eves];
		if(!this.evesSubTmp)this.evesSubTmp=[];
		if(!this.evesChildTmp)this.evesChildTmp=[];
		var t,tn;
		for(var i=0;i<eves.length;i++){
			t=eves[i];
			tn=tak.gtn(t.on);
			if(tn=='String')t.on=[t.on];
			else if(tn!='Array')t.on=null;
			if(!t.on)this.bindEvFunc(t.en,t.func,this.owner);
			else{
				var idl,o;
				for(var j=0;j<t.on.length;j++){
					idl=t.on[j];
					if(idl=='this'){
						this.bindEvFunc(t.en,t.func,this.owner);
						t.on.splice(j,1);
						j--;
					}
				}
				if(t.on.length>0){
					if(t.isSub=='1')this.evesSubTmp.push(t);
					else this.evesChildTmp.push(t);
				}
			}
		}
	},
	bindSubTmp:function(s,arg){
		if(!this.evesSubTmp||!tak.hStr(arg.path))return;
		var t;
		for(var i=0;i<this.evesSubTmp.length;i++){
			t=this.evesSubTmp[i];
			if(t.on.indexOf(arg.path)>=0)this.bindEvFunc(t.en,t.func,arg.obj);
		}
	},
	bindChildTmp:function(s,arg){
		if(!this.evesChildTmp||!tak.hStr(arg.path))return;
		var t;
		for(var i=0;i<this.evesChildTmp.length;i++){
			t=this.evesChildTmp[i];
			if(t.on.indexOf(arg.path)>=0)this.bindEvFunc(t.en,t.func,arg.obj);
		}
	},
	bindEvFunc:function(en,fn,src,f){
		if(!f)f=this.owner.getFunc(fn);
		if(tak.iFun(f)){
			src.bindEv(en,f,this.owner);
			src.bindEv('removed',function(s){
				this.owner.unBindEv(null,null,this);
			},this);
		}
	},
});