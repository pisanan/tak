
//标签和值视图
function FieldV(){
}

defCls(FieldV,takView,{
	getIptJId:function(){
		return 'name';
	},
	/**
 	* 页面创建HTML元素以后执行
 	* @return {Array} Function
 	* */
	onRended:function() {
		takView.prototype.onRended.call(this);
		this.setFName(this.getPro("name"));
		this.setUName(this.getPro("un"));
	},
	setFName:function(fName){
		this.getJQO('name',function(v){
			if(tak.hStr(fName))v.html(fName+':');
			else v.html('');
		});
	},
	setUName:function(uName){
		if(tak.hStr(uName)){
			var uv=this.getJQO('unit',function(v){
				v.html(uName);
			});
			if(!uv&&tak.hStr(uName)&&this.baseJqo){
				uv=this.crtJQO("span","unit");
				this.baseJqo.append(uv);
				uv.html(uName);
			}
		}else{
			this.rmJQO('unit');
		}
	},
	create:function(){
		var panel=this.crtJQO("div");
		this.fName=this.crtJQO("lable","name");
		panel.append(this.fName);
		return panel;
	},
	//获取容器渲染对象，如果没有定义rMap,则直接渲染到baseJqo
	getJqoCon:function(v){
		return this.getJQO('name');
	},
	appendView:function(mJqp,v){
		if(v.baseJqo)v.baseJqo.insertAfter(mJqp);
	},
});