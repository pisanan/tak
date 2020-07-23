
/**
 * 多级控件
 * */
function multLvV(){
}
defCls(multLvV,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.subDef={type:"SelectV"};
	},
	onLoad:function(opt){
		takView.prototype.onLoad.call(this,opt);
		this.initSubView((tak.iNum(opt.maxLv)&&opt.maxLv>1)?opt.maxLv:3);
	},
	initSubView:function(ml){
		if(this.dCvt){
			var vs=[];
			for(var i=0;i<ml;i++){
				vs.push(this.addTObj(this.subDef));
			}
			this.items=vs;
			this.dCvt.setItem(vs);
		}
	},
	defCvtTmp:function(){
		return {type:'treeCvt'};
	},
	/**
 	* 将HTML中的值写入Val
 	* */
	getHVal:function(){
		if(this.items&&this.items.length>0)return this.items[this.items.length-1].getHVal();
		else return this.__val__;
	},
	//将数据显示到视图中
	setHVal:function(v){
		if(this.dCvt)this.dCvt.setVal(v);
	},
})