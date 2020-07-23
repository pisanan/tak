

(function ($) {
	var doubleRing={
		css:'@keyframes tak-double-ring{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-webkit-keyframes tak-double-ring{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes tak-double-ring_reverse{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(-360deg);transform:rotate(-360deg)}}@-webkit-keyframes tak-double-ring_reverse{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(-360deg);transform:rotate(-360deg)}}.tak-double-ring{position:relative}.tak-double-ring div{position:absolute;width:pm_outSize;height:pm_outSize;top:pm_outMargin;left:pm_outMargin;border-radius:50% !important;border:pm_strokeWidth solid #000;border-color:pm_outColor transparent pm_outColor transparent;-webkit-animation:tak-double-ring pm_speed linear infinite;animation:tak-double-ring pm_speed linear infinite}.tak-double-ring div:nth-child(2){width:pm_inSize;height:pm_inSize;top:pm_inMargin;left:pm_inMargin;border-color:transparent pm_inColor transparent pm_inColor;-webkit-animation:tak-double-ring_reverse pm_speed linear infinite;animation:tak-double-ring_reverse pm_speed linear infinite}.tak-double-ring{width:pm_boxSize !important;height:pm_boxSize !important;-webkit-transform:translate(-100px, -100px) scale(1) translate(100px, 100px);transform:translate(-100px, -100px) scale(1) translate(100px, 100px)}',
		html:'<div style="width:100%;height:100%;" class="tak-double-ring"><div></div><div></div></div>'
	};
	
	var doubleRingSet={
		/**
		 * 外环颜色
		 * @type {String}
		 */
		outRingColor:'#7173de',
		/**
		 * 内环颜色
		 * @type {String}
		 */
		inRingColor:'#76d972',
		/**
		 * 背景颜色
		 * @type {String}
		 */
		backColor:'#fff',
		/**
		 * 背景颜色
		 * @type {String}
		 */
		boxColor:'#fff',
		boxClass:'',
		/**
		 * 正方形画布大小
		 * @type {Intl}
		 */
		panelSize:120,
		/**
		 * 外环半径
		 * @type {Intl}
		 */
		RingRadius:10,
		/**
		 * 线条宽度
		 * @type {Intl}
		 */
		StrokeWidth:2,
		/**
		 * 两个环之间的间隔
		 * @type {Intl}
		 */
		interval:4,
		/**
		 * 动画速度
		 * @type {String}
		 */
		speed:'1.5s'
	};
	var panelcss='tak-loading-panel';
	_showDoubleRing=function(opt){
		if(opt.target&&opt.target.length>0){
			var oldPanel=opt.target.children('div[class="'+panelcss+'"]');
			if(oldPanel.length>0){
				return oldPanel.first();
			}
			opt.target.addClass('tak-isLoading');
			var cssStr=doubleRing.css;
			var htmlStr=doubleRing.html;
			var targetSize=opt.target.innerWidth()<opt.target.innerHeight()?opt.target.innerWidth():opt.target.innerHeight();
			opt.panelSize=opt.panelSize>targetSize?targetSize:opt.panelSize;
			//opt.RingRadius=opt.panelSize*0.3;
			opt.RingRadius=(opt.RingRadius*2+opt.StrokeWidth*2)>opt.panelSize?(opt.panelSize-opt.StrokeWidth*2)/3:opt.RingRadius;
			//当内圈变成一个小点时，则不进行绘制
			if((opt.RingRadius-opt.interval-opt.StrokeWidth*2)<(opt.StrokeWidth*2)+opt.interval+opt.StrokeWidth){
				return;
			}
			//opt.panelSize
			cssStr=cssStr.replace(/pm_outColor/g,opt.outRingColor);
			cssStr=cssStr.replace(/pm_inColor/g,opt.inRingColor);
			cssStr=cssStr.replace(/pm_speed/g,opt.speed);
			cssStr=cssStr.replace(/pm_boxSize/g,opt.panelSize+'px');
			cssStr=cssStr.replace(/pm_strokeWidth/g,opt.StrokeWidth+'px');
			cssStr=cssStr.replace(/pm_outSize/g,(opt.RingRadius*2)+'px');
			cssStr=cssStr.replace(/pm_outMargin/g,((opt.panelSize-(opt.RingRadius*2)-opt.StrokeWidth*2)/2)+'px');
			cssStr=cssStr.replace(/pm_inSize/g,((opt.RingRadius*2)-opt.StrokeWidth*2-opt.interval*2)+'px');
			cssStr=cssStr.replace(/pm_inMargin/g,(((opt.panelSize-(opt.RingRadius*2)-opt.StrokeWidth*2)/2)+opt.StrokeWidth+opt.interval)+'px');
			var loading = $('<div>',{
				'class':panelcss,
				'style':'position:absolute;top:0px;left:0px;buttom:0px;z-index:9998;display:flex;justify-content:center;align-items:center;width:100%;height:100%;background-color:'+opt.backColor
			});
			var md='column';
			if(opt.msgRight=='1')md='row';
			var box=$('<div>',{'class':opt.boxClass,'style':'display:flex;flex-flow:'+md+' nowrap;justify-content:center;align-items:center;background-color:'+opt.boxColor});
			var styleTag=$('<style>',{
					'type':'text/css'
				}).html(cssStr);
			box.html(htmlStr).append(styleTag);
			box.append($('<span>',{'class':opt.msgClass,'name':'msgSpan'}).html(opt.msg));
			loading.append(box);
			opt.target.addClass('tak-isLoading');
			opt.target.append(loading);
			return loading;
		}
	};
	
	$.takLoading = function () {
    };
	$.takLoading.msg = function (msg,target) {
		var oldPanel=target.children('div[class="'+panelcss+'"]');
		if(oldPanel.length>0){
			var box=oldPanel.children('div');
			var mv=box.children('span[name="msgSpan"]');
			mv.html(msg);
		}
    };
	$.takLoading.show = function(loadingOpt,target){
		loadingOpt=$.extend(true,{},doubleRingSet,loadingOpt);
		loadingOpt.target=target;
		target.data("tak-loading-ved","1");
		var f=function(){
			if(target.data("tak-loading-ved")=="1"){
				var loading = _showDoubleRing(loadingOpt);
				if(loading&&loading.length>0){
					loading.data('tag',loadingOpt.tag);
					target.data("tak-loading-ved","0");
				}
			}
		}
		f();
		if(target.data("tak-loading-ved")=="1"){
			target.resize(f);
		}
	};
	
	$.takLoading.hide = function(toObj){
		toObj.removeClass('tak-isLoading')
		toObj.data("tak-loading-ved","0");
		var panel=toObj.children('div[class="'+panelcss+'"]').first();
		if(panel&&panel.length>0){
			panel.remove();
		}
		
	};
	
	$.takLoading.tag = function(toObj){
		var panel=toObj.children('div[class="'+panelcss+'"]').first();
		if(panel&&panel.length>0){
			return panel.data('tag');
		}
		
	};
})(jQuery);

$.fn.extend({
	///<summary>
	///显示加载动画
	///<summary>
    showTakLoading: function (opt) {
        $.takLoading.show(opt,$(this));
        return this;
    },
    ///<summary>
	///显示加载动画
	///<summary>
    msgTakLoading: function (msg) {
        $.takLoading.msg(msg,$(this));
        return this;
    },
    ///<summary>
    ///关闭加载动画
	///<summary>
    closeTakLoading: function () {
        $.takLoading.hide($(this));
        return this;
    },
    
    ///<summary>
    ///获取标签值
	///<summary>
    getTakLoadingTag: function(){
        return $.takLoading.tag($(this));
    }
});

