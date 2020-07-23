
/**
 * 视图容器控件
 * */
function RangeV(){
}
defCls(RangeV,takView,{
	onRended:function(){
		takView.prototype.onRended.call(this);
		this.setAddName(this.getPro('an'));
	},
	onInit:function(opt){
		takView.prototype.onInit.call(this,opt);
		this.cPN="alias";
		if(tak.hStr(opt.cPN))this.cPN=opt.cPN;
	},
	setAddName:function(an){
		this.getJQO('addon',function(v){
			if(tak.hStr(an))v.html(an);
			else v.html('');
		});
	},
	//获取容器渲染对象，如果没有定义rMap,则直接渲染到baseJqo
	getJqoCon:function(v){
		return this.getJQO('addon');
	},
	appendView:function(mJqp,v){
		if(v.baseJqo){
			var p=v.getPro(this.cPN);
			if(p=='start')v.baseJqo.insertBefore(mJqp);
			else if(p=='end')v.baseJqo.insertAfter(mJqp);
		}
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		var bv= this.crtJQO('div');
		bv.append(this.crtJQO('span','addon'));
		return bv;
	}
})