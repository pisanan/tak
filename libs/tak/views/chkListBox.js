
function chkListBox(){
}
defCls(chkListBox,SelectV,{
	onCrtPro:function(opt){
		SelectV.prototype.onCrtPro.call(this,opt);
		this.subDef={type:'CheckBoxV'};
		this.multi=false;
	},
	onInit:function(opt){
		SelectV.prototype.onInit.call(this,opt);
		if(opt.multiSel=='1')this.multi=true;
	},
	clearOpt:function(){
		while(this.items.length>0){
			this.items[0].view.remove();
		}
	},
	onRmSubed:function(o){
		SelectV.prototype.onRmSubed.call(this,o);
		for(var i=0;i<this.items.length;i++){
			if(this.items[i].view==o){
				this.items.splice(i,1);
				break;
			}
		}
	},
	subCheckedChange:function(s,v){
		if(!this.multi&&v){
			var it;
			for(var i=0;i<this.items.length;i++){
				it=this.items[i];
				if(it.view!=s)it.view.checked(false);
			}
		}
		this.doHValChange(this.getHVal());
	},
	genOptV:function(opt,index,valPn,txtPn){
		if(opt){
			var i=this.addTObj({title:opt[txtPn]});
			if(tak.ckTN(i,CheckBoxV)){
				i.bindEv('hValChange',this.subCheckedChange,this);
				return i;
			}
		}
	},
	selOpts:function(){
		return this.findItems(function(i){i.view.checked()});
	},
	selOpt:function(){
		return this.findItem(function(i){i.view.checked()});
	},
	/**
 	* 将HTML中的值写入Val
 	* */
	getHVal:function(){
		if(this.dCvt&&this.dCvt.loading)return this.__val__;
		if(!this.multi){
			var it=this.selOpt();
			if(it)return it.val;
		}else{
			var its=this.selOpts();
			var vs=[];
			for(var i=0;i<its.length;i++){
				vs.push(its[i].val);
			}
			return vs;
		}
	},
	//将数据显示到视图中
	setHVal:function(v){
		if(!tak.iAry(v))v=[v];
		var it;
		for(var i=0;i<this.items.length;i++){
			it=this.items[i];
			if(v.indexOf(it.val)>=0)it.view.checked(true);
			else it.view.checked(false);
		}
	},
	selDef:function(){
		
	},
	create:function(){
		return this.crtJQO('div');
	}
});
