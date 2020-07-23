
function TitleV(){
}
defCls(TitleV,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.defSubTmp={type:"Button"};
	},
	onRended: function() {
		takView.prototype.onRended.call(this);
		this.setIcon(this.getPro("icon"));
	},
	getHVal:function(){
		return this.getJQVal(this.getIptJId());
	},
	setHVal:function(v){
		this.setJQVal(v,this.getIptJId());
	},
	//添加控件到右边
	setTools:function(vs){
		this.clearSubs();
		this.addSubs(vs,true);
	},
	setIcon:function(icon){
		this.getJQO('icon',function(v){
			if(tak.hStr(icon))v.attr("class","fa "+ic);
			else v.removeAttr("class");
		});
	},
	getIptJId:function(){
		return 'subject';
	},
	//获取容器渲染对象，如果没有定义rMap,则直接渲染到baseJqo
	getJqoCon:function(v){
		return this.getJQO('rBtns');
	},
	appendView:function(mJqp,v){
		if(v.baseJqo)mJqp.prepend(v.baseJqo);
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		var bv=this.crtJQO('div');
		var tView=this.crtJQO('div','caption');
		var icon=this.crtJQO('i','icon');
		var subject=this.crtJQO('span','subject');
		var rView=this.crtJQO('div','rBtns');
		tView.append(icon);
		tView.append(subject);
		bv.append(tView);
		bv.append(rView);
		return bv;
	},
});