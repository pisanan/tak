function takPage(){
}
defCls(takPage,listCtrl,{
	bringToFront:function(){
		$.takApp.bringToFront(this);
	},
	close:function(){
		return this.dispose();
	},
	/**
 	* 释放资源
 	* */
	dispose:function(){
		if(this.doEv("willClose")==false)return false;
		this.doEv("closed");
		takCtrl.prototype.dispose.call(this);
		return true;
	}
});
