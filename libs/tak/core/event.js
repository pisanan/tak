
function takEvent(pa){
	this.owner=pa;
}
defCls(takEvent,{
	
	/**
 	* 添加事件监听处理
 	* */
	bindEv:function(n,f,on){
		if(tak.iStr(f))f=this.getAct(f);
		if(!tak.iStr(n)||!tak.iFun(f))return;
		if(!tak.iObj(on))on=this.owner;
		if(!this.eves)this.eves={};
		if(!this.eves[n])this.eves[n]=[];
		var el=this.eves[n];
		//不做重复绑定
		var oh;
		for(var i=0;i<el.length;i++){
			oh=el[i];
			if(oh.t==on&&oh.fun==f)return;
		}
		el.push({fun:f,t:on});
	},
	
	/**
	 * 解除事件绑定
	 * */
	unEvh:function(n,f,on){
		if(!this.eves)return;
		if(tak.iStr(f))f=this.getAct(f);
		if(isNull(on)&&isNull(f)&&tak.hStr(n)){
			delete this.eves[n];
			return;
		}
		var rmF=function(el,o,f){
			if(el){
				var h;
				for(var i=0;i<el.length;i++){
					h=el[i];
					if((!f||h.fun==f)&&(!o||h.t==o)){
						el.splice(i,1);
						i--;
					}
				}
			}
		}
		if(tak.hStr(n))rmF(this.eves[n],on,f);
		else{
			for(var i in this.eves){
				rmF(this.eves[i],on,f);
			}
		}
	},
	/**
 	* 触发事件
 	* */
	doEve:function(n,e){
		var fs=this.getEvhs(n);
		if(fs){
			for(var i=0;i<fs.length;i++){
				try{
					if(fs[i].t.disposed==true)continue
					if(fs[i].fun.call(fs[i].t,this.owner,e)==false)return false;
				}catch(err){
					tak.logErr(this.owner.id+"事件["+n+"]执行失败",err);
				}
			}
		}
		return true;
	},
	/**
 	* 获取事件监听接口列表
	* */
	getEvhs:function(n){
		if(!tak.hStr(n))return;
		if(!this.eves)return;
		return this.eves[n];
	},
	/**
 	* 释放资源
 	* */
	dispose:function(){
		for(var i in this){
			delete this[i];
		}
	}
});