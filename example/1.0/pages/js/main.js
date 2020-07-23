$(function() {
	$.dxtabs({
		loading: function(contentObj) {
			$('.dxtab-content').showDXLoading({tag:contentObj.attr('id')});
		},
		actived: function(contentObj, isloading) {
			if(isloading){
				$('.dxtab-content').showDXLoading({tag:contentObj.attr('id')});
			} else {
				$('.dxtab-content').closeDXLoading();
			}
		},
		loaded: function(contentObj) {
			if(contentObj.attr('id')==$('.dxtab-content').getDXLoadingTag()){
				$('.dxtab-content').closeDXLoading();
			}
		}
	});
	//注册窗口大小变化事件
	App.addResizeHandler($.dxtabs.resize);
})


