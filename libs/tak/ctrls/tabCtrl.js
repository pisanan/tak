/**
 * tab页控制器
 * */
function tabCtrl(){
	
}
defCls(tabCtrl,listCtrl,{
	onCrtPro:function(opt){
		listCtrl.prototype.onCrtPro.call(this,opt);
		this.tabTmp={type:"TabBtnV",jEven:'click'};
	},
	onInit:function(opt){
		listCtrl.prototype.onInit.call(this,opt);
		if(tak.iObj(opt.tabTmp))this.tabTmp=tak.unTmp(this.tabTmp,opt.tabTmp);
		if(tak.hStr(opt.tabBar))this.setTabBar(opt.tabBar);
	},
	//设置tab标签容器控件
	setTabBar:function(val){
		if(tak.hStr(val))this.findChild(val,this.setTabBarV,this);
		else if(tak.ckTN(val,takView))this.setTabBarV(val);
		else if(tak.iObj(val)){
			var v=this.newObj(val);
			if(tak.ckTN(v,takView)){
				this.addObj(v);
				this.setTabBarV(v);
			}
		}
	},
	setTabBarV:function(v){
		if(this.willBarChange(this.tabBar,v)!=false){
			this.tabBar=v;
			this.barChanged(v);
			this.doEv('tabBarChanged');
		}
	},
	initCtrls:function(opt){
		listCtrl.prototype.initCtrls.call(this,opt);
		if(this.tabBar)this.showTabs();
	},
	willBarChange:function(ov,nv){
		if(ov){
			this.eachCtrl(function(c){
				var t=ov.findChild(c.id);
				if(t)t.dispose();
			},this);
		}
	},
	barChanged:function(nv){
		this.showTabs();
	},
	showTabs:function(){
		this.eachCtrl(function(c){
			this.addTab(c);
		},this);
	},
	crtCtrlOpt:function(c){
		var o=listCtrl.prototype.crtCtrlOpt.call(this,c);
		o.name=c.getName();
		o.icon=c.getPro('icon');
		return o;
	},
	addTab:function(ctrl){
		if(this.tabBar){
			var o=this.tabTmp;
			o.id=ctrl.id;
			o=this.tabBar.addTObj(o);
			if(o){
				o.val(ctrl);
				ctrl.tabView=o;
				this.bindTabEv(o);
			}
		}
	},
	//创建tab控件后，绑定激活事件
	bindTabEv:function(tv){
		tv.bindEv('click',function(s){
			this.openCtrl(s.id);
		},this);
		tv.bindEv('closeClick',function(s){
			this.rmCtrl(s.id);
		},this);
	},
	//控制器被激活后激活对应的tab控件
	activeTab:function(v){
		v.addJQClass('active');
	},
	//控制器被关闭后关闭对应的tab控件
	closeTab:function(v){
		v.rmJQClass('active');
	},
	onAddOpted:function(opt){
		this.addTab(opt.tab?opt.tab:opt);
		listCtrl.prototype.onAddOpted.call(this,opt);
	},
	//被激活后触发事件
	onShowCtrled:function(ctrl){
		listCtrl.prototype.onShowCtrled.call(this,ctrl);
		if(ctrl.tabView)this.activeTab(ctrl.tabView);
	},
	//被隐藏后触发事件
	onHideCtrled:function(ctrl){
		listCtrl.prototype.onHideCtrled.call(this,ctrl);
		if(ctrl.tabView)this.closeTab(ctrl.tabView);
	},
	//控制器移除后处理函数
	onRmCtrled:function(ctrl){
		listCtrl.prototype.onRmCtrled.call(this,ctrl);
		if(ctrl.tabView){
			ctrl.tabView.dispose();
			delete ctrl.tabView;
		}
	},
	openOpt:function(opt){
		var cc;
		if(tak.hStr(opt.id))cc=this.openCtrl(opt.id);
		if(!cc)cc=this.addOpt(opt);
		return cc;
	},
})


