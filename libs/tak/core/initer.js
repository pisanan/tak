
var takInitOpt=function(a){
	a.initOpt={
		pageTmp:{
			None:{baseV:{type:'takView',loadingOn:'1'}}
		},
		//默认数据配置
		defOpt:{
			state:'view',
		},
		/**
		 * 配置读取服务
		 */
		tmpLoader:new defTmpLd(),
		/**
		 * 页面正在加载
		 * @type {Function}
		 * container 正在加载的容器jqurey对象
		 */
		loading:function(container,msg,isCmt){
			if(isCmt==true) container.showTakLoading({panelSize:60,RingRadius:20,StrokeWidth:1,msgRight:'1',backColor:'rgba(1,1,1,0.5)',msg:msg,boxClass:'tak-isLoading-box',msgClass:'tak-isLoading-msg'});
			else container.showTakLoading({RingRadius:40,msg:msg,boxClass:'tak-isLoading-box-n'});
		},
		showMsg:function(container,msg){
			container.msgTakLoading(msg);
		},
		/**
		 * 页面加载完毕
		 * @type {Function}
		 * container 加载完毕的容器jqurey对象
		 */
		loaded:function(container){
			container.closeTakLoading();
		},
		/**
		 * 弹框方法
		 * @title {String} 消息框标题
		 * @msg {String} 消息内容
		 * @iconType {String} 图标类型  不传或传空表示不显示图标 info（绿色叹号），warning（黄色叹号） ，question（灰色问号）,success(绿色钩子)，error(红色叉叉)
		 */
		alert:function(iconType,title,msg){
			alert(title+"\n"+msg);
		},
		/**
		 * 弹框确认方法
		 * @title {String} 消息框标题
		 * @msg {String} 消息内容
		 * @iconType {String} 图标类型  同上
		 * @then {Function} 点击确定后的处理函数 包含一个参数（Boolean） 确定或是取消  
		 */
		confirm:function(iconType,title,msg,then){
			if(confirm(title+"\n"+msg)==true)then();
		},
	};
}

$.takApp = new takApp().init(null,{});

$.fn.extend({
	///<summary>
	///启动Page渲染
	///<summary>
    takPageShow: function (opt) {
        return $.takApp.showPage(opt,$(this));
    },
    rendTakView:function(obj){
    	if(tak.ckTN(obj,HtmlV))this.append(obj.baseJqo);
    	else if(tak.ckTN(obj,takCtrl))this.append(obj.baseV.baseJqo);
    	else if(tak.ckTN(obj,jQuery))this.append(obj);
	},
});
