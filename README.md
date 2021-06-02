# tak
前端web自研开源框架
学习前端，自己研究开发。
自己开发的框架因为没有ide的支持，使用起来狠费劲。再加上是个人作品，有些东西思考得还不够周全。

框架使用js作为页面开发语言。
svrs：用于申明要用到的接口服务
state：申明当前视图或页面的状态
lder：页面初始化时自动调用的数据初始化方法。
baseV：用于申明界面控件和布局结构，其中包括控件的属性设置。
func：用于定义当前视图所的方法。
exts：扩展声明，主要用于事件绑定。

可以自由无限扩展各种自定义控件和容器。

具体效果 看 example.png
直接打开  example\TestHtml\index.html

主页面源码
```
  {
	svrs:['data/services/empService.js'],
	state:'view',lder:{sn:"empSvr",fn:"getModel"},
	baseV:{type:"takView",loadingOn:"1",scene:["con","main"],
		subs:{
			tView:{type:"takView",scene:'title',
				subs:{
					logoV:{type:"ImgV",scene:"logo",val:"/example/config/images/logo.png"},
					mClose:{type:"Button",scene:"menuBtn",pro:{alias:"btn",icon:"icon-arrow-left"},jEven:"click",exts:{tip:'关闭/打开菜单'}},
					topV:{type:"takView",scene:"topTool"},
					userV:{type:"takView",scene:"topUser",
						subs:{
							user:{type:"BtnListV",scene:"topBtn",pro:{alias:"btn",icon:"icon-user"},
								subs:{
									cPwd:{type:"Button",val:'修改密码',scene:"menuBtn",pro:{alias:"btn",icon:"icon-note"},jEven:"click"},
									logOut:{type:"Button",val:'退出',scene:"menuBtn",pro:{alias:"btn",icon:"icon-logout"},jEven:"click"}
								}
							},
							logOut:{type:"Button",scene:"menuBtn",pro:{alias:"btn",icon:"icon-logout"},jEven:"click",exts:{tip:'退出'}}
						}
					}
				}
			},
			conV:{type:"takView",scene:["con","main-con"],
				subs:{
					mView:{type:"MenuV",loadingOn:"1"}
				}
			}
		},
		oMap:{def:"this.conV",tab:"this.tView.topV"}
	},
	subs:{
		conTab:{type:'tabCtrl',baseV:{type:"takView",scene:["con","listCtrl"]},
			conView:{type:"takView",loadingOn:"1",scene:"con"},
			tabTmp:{exts:{tip:'$setTip'},func:{
				setTip:function(f){
					this.bindEv('textChanged',function(s,v){
						f(v,s);
					});
				}
			}}
		}
	},
	exts:{
		eves:[{en:'loaded',func:'loaded'},{en:'valChanged',func:'valChanged'},
		{en:'click',func:'mCloseClick',on:'this.baseV.tView.mClose'},
		{en:'click',func:'logoutClick',on:'this.baseV.tView.userV.logOut'},
		{en:'doAction',func:'doAction',on:'this.baseV.conV.mView'},
		{en:'showCtrled',func:'showCtrled',on:'this.conTab'},
		{en:'hideCtrled',func:'hideCtrled',on:'this.conTab'},
		{en:'beginLoadData',func:'beginLoadData'},{en:'endLoadData',func:'endLoadData'}]
	},
	func:{
		loaded:function(){
			this.loadData("menu.json");
			this.$conTab.setTabBar(this.baseV.$tView.$topV);
		},
		doAction:function(s,n){
			var m=n.val();
			if(tak.iObj(m)&&m.ctrl){
				m.mv=n;
				this.$conTab.addCtrl(m);
			}
		},
		hideCtrled:function(s,c){
			if(tak.iObj(c)&&tak.ckTN(c.mv,MenuV))c.mv.active=false;
		},
		showCtrled:function(s,c){
			if(tak.iObj(c)&&tak.ckTN(c.mv,MenuV))c.mv.active=true;
		},
		loadParam:function(){
			return "menu.json";
		},
		valChanged:function(){
			var v=this.val();
			this.baseV.$conV.$mView.val(v.menu);
			this.baseV.$tView.$userV.$user.val(v.user.name);
		},
		mCloseClick:function(){
			var nos=!this.baseV.$conV.$mView.openState;
			this.baseV.$conV.$mView.openState=nos;
			this.baseV.$tView.$logoV.visible=nos;
			if(nos)this.baseV.$tView.$mClose.setIconVal('icon-arrow-left');
			else this.baseV.$tView.$mClose.setIconVal('icon-arrow-right');
		},
		beginLoadData:function(){
			this.baseV.$conV.visible=false;
			$.takApp.loading(null,'正在加载数据...',false);
		},
		endLoadData:function(){
			$.takApp.loaded();
			this.baseV.$conV.visible=true;
		}
	}
}
```

测试详情页。
```
{
	svrs:['data/services/empService.js','data/services/emunService.js'],
	lder:{sn:"empSvr",fn:"getModel",lpf:"loadParam"},
	baseV:{type:"takView",loadingOn:"1",scene:"con",
		subs:{
			mView:{type:"btsPanel",loadingOn:"1",
				vPkgs:[
					{type:"takGPkger",tmps:{pwd:{type:"RangeV",pro:{cl:8,an:"至",name:"密码",vCate:"def"}}}},
					{def:"FieldV"}
				]
			},
			bView:{type:"takView",scene:"btnCon",subDef:{type:"Button",jEven:{en:"click"}}}
		}
	},
	views:{
		id:{tmp:{type:"HtmlV",bind:"id",tag:"span",scene:"spanContent",pro:{name:"编号",cl:4}},onState:['edit','view']},
		name:{type:"TextV",bind:"name",pro:{name:"名称",cl:4},valid:{req:"1",minL:"2",maxL:"10"}},
		t2:{type:"TextV",bind:"t2",pro:{name:"测试名称",cl:4,placeholder:"请输入名称"},valid:{req:"1"}},
		t1:{type:"chkListBox",bind:"t1",scene:"horizon",pro:{name:"测试1",cl:4},cvt:{opts:[{txt:"男",val:"1"},{txt:"女",val:"2"},{txt:"未知",val:"0"}]}},
		t3:{type:"TextV",bind:"t3",pro:{name:"测试3",cl:4},valid:"time"},
		t4:{type:"PwdV",bind:"t4",pro:{name:"测试名称",cl:4,vCate:"pwd",alias:"start"},valid:{req:"1",minL:"6",maxL:"16"}},
		t5:{type:"PwdV",bind:"t5",pro:{name:"测试5",cl:4,vCate:"pwd",alias:"end"},valid:{cpTo:"t4",msg:"两次输入密码必须一致"}},
		t6:{type:"TextV",bind:"t6",pro:{name:"测试6",cl:4},valid:"email"},
		t7:{type:"TextV",bind:"t7",pro:{name:"测试7",cl:4,un:"元",dVal:"0.00"},valid:"email"},
		t8:{type:"TextArea",bind:"t8",pro:{name:"测试8",cl:12,rows:3}},
		t9:{type:"ListV",bind:"t9",pro:{name:"合同照片",cl:12},scene:"nowrap",subDef:{type:"ImgV",scene:"dImg"}},
		t12:{type:"multLvV",bind:"t12",scene:'horizon',pro:{name:"住址",cl:12,ldOpt:{txt:'正在加载...',val:''}},cvt:{lder:"zone.json"}},
		
		addBtn:{tmp:{val:"保存",scene:"primary",pro:{alias:"btn",icon:"fa fa-check"},jEven:"addBtnClick"},group:'btn',onState:'new'},
		updBtn:{tmp:{val:"确定",scene:"primary",pro:{alias:"btn",icon:"fa fa-check"},jEven:"updBtnClick"},group:'btn',onState:'edit'},
		ccBtn:{tmp:{val:"取消",scene:"warning",pro:{alias:"btn",icon:"fa fa-reply"},jEven:"canBtnClick"},group:'btn',onState:['edit','new']},
		delBtn:{tmp:{val:"删除",scene:"danger",pro:{alias:"btn",icon:"fa fa-remove"},jEven:"delBtnClick"},group:'btn',onState:'view'},
		
		editBtn:{tmp:{scene:"default",pro:{alias:"btn",icon:"fa fa-retweet"},jEven:"changeState",exts:{tip:'修改'}},group:'tool'},
		refreshBtn:{tmp:{scene:"default",pro:{alias:"btn",icon:"fa fa-refresh"},jEven:"refresh",exts:{tip:'刷新'}},group:'tool'}
	},
	exts:{
		eves:[{en:'loaded',func:'loaded'},{en:'stateChanged',func:'stateChanged'}]
	},
	func:{
		loaded:function(){
			this.$stateChanged();
			if(this.state!='new')this.loadData(null,this.baseV.$mView);
		},
		changeCell:function(s){
			this.setUpViews('cellEdit',s.parent.parent,s.parent.parent);
		},
		loadParam:function(){
			return 'employee.json';
		},
		reqErr:function(s,e){
			this.alertError(e.code,e.msg);
		},
		refresh:function(){
			this.refData();
		},
		stateChanged:function(){
			this.setUpViews('btn',this.baseV.$bView,this);
			this.setUpViews('def',this.baseV.$mView,this.baseV.$mView);
			if(tak.ckTN(this.owner,takCtrl))this.setUpViews('tool',this.owner.baseV,this);
			this.baseV.$mView.enable=this.state!='view';
		},
		changeState:function(){
			var s=this.state;
			if(s=='view')this.state='edit';
			else if(s=='edit')this.state='new';
			else if(s=='new')this.state='view';
		},
		validError:function(m){
			this.alert('错误',m,'error');
		},
		updBtnClick:function(){
			this.valid(this.baseV.$mView,function(v){
				this.commitData('empSvr','upd',v);
			},'validError');
		},
		addBtnClick:function(){
			this.valid(this.baseV.$mView,function(v){
				this.commitData('empSvr','add',v);
			},'validError');
		},
		delBtnClick:function(){
			this.confirm('提示','确定要删除吗?','warning',function(v){
				this.commitData('empSvr','del',v);
			},this.val(),this);
		},
		canBtnClick:function(){
			this.showDialog({
				pType:'Win',
				title:'职员简介',
				state:'edit',
				ctrl:"empL.js"
			})
		}
	}
}
```

