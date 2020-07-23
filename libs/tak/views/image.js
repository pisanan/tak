
function ImgV(){
}
defCls(ImgV,takView,{
	/**
	 * 值改变处理方法
	 * */
	getHVal:function(){
		return this.url;
	},
	setHVal:function(v){
		this.url=v;
		if(!tak.hStr(v))this.rmJQO('imgv');
		else{
			if(this.loadingOn){
				var img = new Image();
				this.showLoading();
				var t=this;
				img.onload = function(){
					if(t.rended&&t.url==v)t.createImg();
    			};
    			img.src=v;
			}else this.createImg();
		}
	},
	createImg:function(){
		if(!this.getJQO('imgv',this.serImgUrl,this)){
			var imgv=this.crtJQO('img','imgv');
			this.baseJqo.append(imgv);
			this.serImgUrl(imgv);
		}
	},
	serImgUrl:function(j){
		j.attr("src",this.url);
		if(this.loadingOn)this.hideLoading();
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		return this.crtJQO('div');
	}
});
