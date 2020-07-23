function FrameV(){
}
defCls(FrameV,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.tag='iFrame';
	},
	/**
	 * 值改变处理方法
	 * */
	getHVal:function(v){
		return this.baseJqo.attr("src");
	},
	setHVal:function(v){
		this.baseJqo.attr("src",v);
	},
})