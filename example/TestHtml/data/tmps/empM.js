
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