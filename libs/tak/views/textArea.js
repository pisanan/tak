
//标签和值视图
function TextArea(){
}
defCls(TextArea,takView,{
	getHtmlAtt:function(){
		var att={};
		var c=this.getPro("rows");
		if(!tak.iNum(c)||c<=0||c>50)c=2;
		att.rows=c;
		c=this.getPro("maxL");
		if(!tak.iNum(c)||c<=0||c>100)c=100;
		att.maxLength=c;
		c=this.getPro("placeholder");
		if(tak.hStr(c))c.placeholder=c;
		return att;
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		return this.crtJQO('textarea',this.getIptJId(),this.getHtmlAtt());
	},
});