///<jscompress sourcefile="tabCtrl.js" />
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


;
///<jscompress sourcefile="filedView.js" />

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
});;
///<jscompress sourcefile="btsPanel.js" />

function btsPanel(){
}
defCls(btsPanel,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.sct='md';
		this.autoRow=true;
	},
	onInit:function(opt){
		takView.prototype.onInit.call(this,opt);
		var tv=this.getPro('sct');
		if(tv)this.sct=tv;
		tv=this.getPro('autoRow');
		if(tv)this.autoRow=tv=='1';
	},
	getCellLenght:function(v){
		var l=v.getPro("cl");
		if(!tak.iNum(l)||l>12||l<=0)l=6;
		return l;
	},
	getRowView:function(iCol,hFill){
		var cv=this.cv;
		if(!this.rowVs)this.rowVs=[];
		if(this.rowVs.length>0&&iCol<12){
			var i=0;
			if(!this.autoRow)i=this.rowVs.length-1;
			for(;i<this.rowVs.length;i++){
				if(this.rowVs[i].cv+iCol<=12)return this.rowVs[i];
			}
		}
		var name="row"+(this.rowVs.length+1).toString();
		var rV;
		if(!hFill){
			rV=this.crtJQO("div",name,"row");
			this.baseJqo.append(rV);
		}
		var rowV={rv:rV,cv:0,subs:[],name:name};
		this.rowVs.push(rowV);
		return rowV;
	},
	onRmSubed:function(s){
		takView.prototype.onRmSubed.call(this,s);
		if(this.rowVs){
			var r;
			for(var i=0;i<this.rowVs.length;i++){
				r=this.rowVs[i];
				for(var j=0;j<r.subs.length;j++){
					if(r.subs[j].v==s){
						r.cv-=r.subs[j].c;
						r.subs.splice(j,1);
						break;
					}
				}
				if(r.subs.length==0){
					this.rmJQO(r.name);
					this.rowVs.splice(i,1);
					break;
				}
			}
		}
	},
	rendSub:function(v){
		var sct=v.getPro('sct');
		if(!tak.hStr(sct))sct=this.sct;
		var vv=this.getCellLenght(v);
		var rv=this.getRowView(vv,v.getPro('hFill')=='1');
		rv.subs.push({v:v,c:vv});
		rv.cv+=vv;
		if(rv.rv){
			v.rend(rv.rv);
			v.addJQClass('col-'+sct+'-'+vv.toString());
		}
		else {
			v.rend(this.baseJqo);
			v.addJQClass('tak-col-fill');
		}
	},
	
	
});
;
///<jscompress sourcefile="rangeView.js" />

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
});
///<jscompress sourcefile="image.js" />

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
;
///<jscompress sourcefile="input.js" />
function InputV(){
}
defCls(InputV,takView,{
	getInputAtt:function(){
		return {type:'text'};
	},
	genInput:function(){
		return this.crtJQO('input',this.getIptJId(),this.getInputAtt());
	},
	create:function(){
		return this.genInput()
	}
});

//文本框控件
function TextV(){
}
defCls(TextV,InputV,{
	getType:function(){
		return 'text'
	},
	getInputAtt:function(){
		var att={type:this.getType()};
		var c=this.getPro("maxL");
		if(!tak.iNum(c)||c<=0||c>100)c=100;
		att.maxLength=c;
		c=this.getPro("placeholder");
		if(tak.hStr(c))att.placeholder=c;
		return att;
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		var v=InputV.prototype.create.call(this);
		var t=this.getPro("maskAlias");
		if(tak.hStr(t)&&tak.iFun(v.inputmask)){
			v.attr("data-inputmask","'alias': '"+t+"'");
			v.inputmask();
		}
		return v;
	}
});


//密码控件
function PwdV(){
}
defCls(PwdV,TextV,{
	getType:function(){
		return 'password'
	}
});

;
///<jscompress sourcefile="textArea.js" />

//标签和值视图
function TextArea(){
}
defCls(TextArea,takView,{
	getHtmlAtt:function(){
		var att={};
		var c=this.getPro("rows");
		if(!tak.iNum(c)||c<=0||c>50)c=2;
		att.rows=c;
		c=this.getPro("maxL");
		if(!tak.iNum(c)||c<=0||c>100)c=100;
		att.maxLength=c;
		c=this.getPro("placeholder");
		if(tak.hStr(c))c.placeholder=c;
		return att;
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		return this.crtJQO('textarea',this.getIptJId(),this.getHtmlAtt());
	},
});;
///<jscompress sourcefile="select.js" />

function SelectV(){
}
defCls(SelectV,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.items=[];
		this.rvp;
		this.rtp;
		this.autoSel=true;
	},
	onInit:function(opt){
		takView.prototype.onInit.call(this,opt);
		if(opt.autoSel=='0')this.autoSel=false;
	},
	onCvtOptsChange:function(opts){
		if(this.dCvt)this.resetOpts(opts,this.dCvt.valPn,this.dCvt.txtPn);
		takView.prototype.onCvtOptsChange.call(this,opts);
	},
	onRended:function(){
		takView.prototype.onRended.call(this);
		var opts=this.getCvtOpts();
		if(opts)this.onCvtOptsChange(opts);
	},
	selDef:function(){
		this.setJQVal('');
	},
	resetOpts:function(opts,valPn,txtPn){
		this.clearOpt();
		this.rvp=valPn;
		this.rtp=txtPn;
		var opt,v,jid;
		for(var i=0;i<opts.length;i++){
			opt=opts[i];
			if(!tak.iObj(opt)){var t={};t[valPn]=opt;opt=t;}
			if(!tak.hStr(opt[txtPn]))opt[txtPn]=opt[valPn];
			jid='opt_'+i;
			v=this.genOptV(opt,'opt_'+i,valPn,txtPn);
			if(v)this.items.push({id:i,view:v,jid:jid,val:opt[valPn],opt:opt});
		}
	},
	clearOpt:function(){
		if(this.items){
			var i=0;
			while(i<this.items.length){
				this.rmJQO(this.items[i].jid);
				i++;
			}
			this.items.splice(0,this.items.length);
		}
	},
	genOptV:function(opt,jid,valPn,txtPn){
		var jq=this.getJQO(this.getIptJId());
		if(jq){
			var i=this.crtJQO('option',jid,'opt',{value:opt[valPn]});
			i.html(opt[txtPn]);
			jq.append(i);
			return i;
		}
	},
	findItem:function(f){
		var it;
		for(var i=0;i<this.items.length;i++){
			it=this.items[i];
			if(f(it))return it;
		}
	},
	findItems:function(f){
		var it,its=[];
		for(var i=0;i<this.items.length;i++){
			it=this.items[i];
			if(f(it))its.push(it);
		}
		return its;
	},
	checkOpt:function(opt,v){
		if(tak.hStr(this.rvp))return tak.iObj(opt)&&opt[this.rvp]==v;
		else return false;
	},
	selOpt:function(opt){
		if(tak.iObj(opt))this.setVal(opt[this.rvp]);
		else{
			var v=this.getHVal();
			v= this.findItem(function(i){return i.val==v});
			if(v)return v.opt;
		}
	},
	/**
 	* 设置html中控件的值
 	* */
	setJQVal:function(v,jId){
		HtmlV.prototype.setJQVal.call(this,v,jId);
	},
	/**
 	* 读取html中控件的值
 	* */
	getJQVal:function(jId){
		return HtmlV.prototype.getJQVal.call(this,jId);
	},
	/**
 	* 将HTML中的值写入Val
 	* */
	getHVal:function(){
		if(this.dCvt&&this.dCvt.loading)return this.__val__;
		return this.getJQVal();
	},
	//将数据显示到视图中
	setHVal:function(v){
		var h=false,dv;
		if(this.items){
			for(var i=0;i<this.items.length;i++){
				if(this.items[i].val==v){h=true;break;}
				else if(!dv)dv=this.items[i].val;
			}
		}
		if(!h&&this.autoSel)v=dv;
		this.setJQVal(v,this.getIptJId());
	},
	create:function(){
		return this.crtJQO('select');
	}
});
;
///<jscompress sourcefile="button.js" />

//按钮视图
function Button(){
}
defCls(Button,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.tag='button';
		this.namePn='name';
		this.iconPn='icon';
	},
	/**
	 * 初始化配置
	 * 该方法在创建html之前调用
	 * */
	onInit:function(opt){
		takView.prototype.onInit.call(this,opt);
		if(opt.tag=='a')this.tag='a';
		if(tak.hStr(opt.namePn))this.namePn=opt.namePn;
		if(tak.hStr(opt.iconPn))this.iconPn=opt.iconPn;
	},
	getIptJId:function(){
		return 'txt';
	},
	addTxtTag:function(t){
		this.baseJqo.append(t);
	},
	addIconTag:function(t){
		this.baseJqo.prepend(t);
	},
	setTxtVal:function(v){
		if(tak.hStr(v)){
			var t=this.getJQO('txt',function(b){
				b.html(v);
			});
			if(!t){
				t=this.crtJQO('span','txt').html(v);
				this.addTxtTag(t);
			}
		}else this.rmJQO('txt');
		this.doEv('textChanged',v);
	},
	setIconVal:function(ic){
		if(tak.hStr(ic)){
			var i=this.getJQO('icon',function(v){
				v.attr("class",ic);
			});
			if(!i&&tak.hStr(ic)){
				i=this.crtJQO('i','icon');
				i.attr("class",ic);
				this.addIconTag(i);
			}
		}else this.rmJQO('icon');
	},
	setHVal:function(v){
		var t,i;
		if(tak.hStr(v)){
			t=v;i=null;
		}else if(tak.iObj(v)){
			t=v[this.namePn];
			i=v[this.iconPn];
		}
		if(tak.hStr(t))this.setTxtVal(t);
		if(!tak.hStr(i))i=this.getPro('icon');
		this.setIconVal(i);
	},
	onRended:function(){
		var v=this.getName();
		if(tak.hStr(v))this.setTxtVal(v);
		takView.prototype.onRended.call(this);
		v=this.val();
		if(!v)this.setIconVal(this.getPro('icon'));
	},
});


function TabBtnV(){
}
defCls(TabBtnV,Button,{
	onCrtPro:function(opt){
		Button.prototype.onCrtPro.call(this,opt);
		this.tag='div';
		this.closePn='close';
	},
	onInit:function(opt){
		Button.prototype.onInit.call(this,opt);
		this.tag='div';
		if(tak.hStr(opt.closePn))this.closePn=opt.closePn;
	},
	addTxtTag:function(t){
		var j=this.getJQO('icon');
		if(j)t.insertAfter(j);
		else{
			j=this.getJQO('btn');
			if(j)j.append(t);
		}
	},
	addIconTag:function(t){
		this.getJQO('btn',function(b){
			b.prepend(t);
		});
	},
	setHVal:function(v){
		Button.prototype.setHVal.call(this,v);
		if(tak.iObj(v)){
			if(v[this.closePn]=='0'){
				this.rmJQO('cIcon');
				this.rmJQO('close');
			}
		}
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		var bv= this.crtJQO(this.tag);
		var btn=this.crtJQO('a','btn');
		bv.append(btn);
		btn=this.crtJQO('a','close');
		var ci= this.crtJQO('i','cIcon');
		btn.append(ci);
		bv.append(btn);
		return bv;
	},
	onRended:function(){
		Button.prototype.onRended.call(this);
		this.bindJQEvF('click','close',function(e){
			this.doEv('closeClick');
		},this);
	}
})

function BtnListV(){
	
}
defCls(BtnListV,Button,{
	onCrtPro:function(opt){
		Button.prototype.onCrtPro.call(this,opt);
		this.subDef={type:'Button',tag:'a'};
		this.tag='div';
		this.btnTag='a';
		this.subLiId=0;
	},
	addTxtTag:function(t){
		var j=this.getJQO('icon');
		if(j)t.insertAfter(j);
		else{
			j=this.getJQO('arrow');
			if(j)t.insertBefore(j);
			else{
				j=this.getJQO('btn');
				if(j)j.append(t);
			}
		}
	},
	addIconTag:function(t){
		this.getJQO('btn',function(b){
			b.prepend(t);
		});
	},
	//获取对象容器，如果没有定义vMap,则直接添加到自身下级
	getConObj:function(o){
		return this;
	},
	defEvenJqo:function(){
		return 'btn;'
	},
	getDropUl:function(){
		var jq=this.getJQO('dropUl');
		if(!jq){
			jq=this.crtJQO('ul','dropUl');
			this.baseJqo.append(jq);
		}
		return jq;
	},
	getDropLi:function(v){
		if(this.btnCons){
			var c;
			for(var i in this.btnCons){
				c=this.btnCons[i];
				if(c.view==v)return c;
			}
		}
	},
	crtDropLi:function(v){
		if(!this.btnCons)this.btnCons={};
		var ul=this.getDropUl();
		var liId='li_'+this.subLiId;
		this.subLiId++;
		var li=this.crtJQO('li',liId,'dropLi');
		ul.append(li);
		li={id:liId,li:li,view:v}
		this.btnCons[liId]=li;
		return li;
	},
	checkArrow:function(){
		var a=this.getJQO('arrow');
		if(!a){
			this.getJQO('btn',function(b){
				b.prepend(this.crtJQO('i','arrow'));
			});
		}
	},
	rmArrow:function(){
		this.rmJQO('arrow');
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		var bv= this.crtJQO(this.tag);
		var btn=this.crtJQO(this.btnTag,'btn');
		bv.append(btn);
		return bv;
	},
	getJqoCon:function(v){
		var li= this.getDropLi(v);
		if(!li)li=this.crtDropLi(v);
		return li.li;
	},
	rendSub:function(v){
		if(v)v.rend(this);
		this.checkArrow();
	},
	onRmSubed:function(o){
		Button.prototype.onRmSubed.call(this,o);
		var li=this.getDropLi(o);
		if(li){
			this.rmJQO(li.id);
			delete this.btnCons[li.id];
			if(!this.subs||this.subs.length==0)this.rmArrow();
		}
	},
});
///<jscompress sourcefile="titleView.js" />

function TitleV(){
}
defCls(TitleV,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.defSubTmp={type:"Button"};
	},
	onRended: function() {
		takView.prototype.onRended.call(this);
		this.setIcon(this.getPro("icon"));
	},
	getHVal:function(){
		return this.getJQVal(this.getIptJId());
	},
	setHVal:function(v){
		this.setJQVal(v,this.getIptJId());
	},
	//添加控件到右边
	setTools:function(vs){
		this.clearSubs();
		this.addSubs(vs,true);
	},
	setIcon:function(icon){
		this.getJQO('icon',function(v){
			if(tak.hStr(icon))v.attr("class","fa "+ic);
			else v.removeAttr("class");
		});
	},
	getIptJId:function(){
		return 'subject';
	},
	//获取容器渲染对象，如果没有定义rMap,则直接渲染到baseJqo
	getJqoCon:function(v){
		return this.getJQO('rBtns');
	},
	appendView:function(mJqp,v){
		if(v.baseJqo)mJqp.prepend(v.baseJqo);
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		var bv=this.crtJQO('div');
		var tView=this.crtJQO('div','caption');
		var icon=this.crtJQO('i','icon');
		var subject=this.crtJQO('span','subject');
		var rView=this.crtJQO('div','rBtns');
		tView.append(icon);
		tView.append(subject);
		bv.append(tView);
		bv.append(rView);
		return bv;
	},
});;
///<jscompress sourcefile="menu.js" />

function MenuV(){
}
defCls(MenuV,TreeV,{
	onCrtPro:function(opt){
		TreeV.prototype.onCrtPro.call(this,opt);
		tak.genPro(this,'active',false,this.activeChange);
		this.namePn='name';
		this.iconPn='icon';
	},
	onInit:function(opt){
		TreeV.prototype.onInit.call(this,opt);
		if(tak.hStr(opt.namePn))this.namePn=opt.namePn;
		if(tak.hStr(opt.iconPn))this.iconPn=opt.iconPn;
	},
	onRended:function(){
		TreeV.prototype.onRended.call(this);
		if(!this.isRoot){
			this.bindJQEvF('click',this.getOpenTgtName(),function(){
				if(this.hasSubNode())this.openState=!this.openState;
				else this.active=true;
			},this);
		}
		if(this.hasSubNode())this.getArrow();
	},
	activeChange:function(ov,nv){
		var ok=tak.iBool(nv)&&!this.isRoot;
		if(ok){
			this.onActiveChange(nv);
			this.getRoot().doEv('activeChanged',this);
		}
		return ok;
	},
	onActiveChange:function(nv){
		if(nv){
			this.getRoot().doEv('doAction',this);
			this.baseJqo.addClass('active');
			if(tak.ckTN(this.parent,MenuV))this.parent.active=true;
		}else {
			this.baseJqo.removeClass('active');
			if(tak.ckTN(this.parent,MenuV))this.parent.active=false;
		}
	},
	//展开状态改变
	onOpenStateChange:function(nv){
		TreeV.prototype.onOpenStateChange.call(this,nv);
		if(nv){//关闭同级节点
			var an=this.funBrother(function(n){if(n.openState)return true;});
			if(an)an.openState=false;
		}
		if(this.hasSubNode()){
			if(nv)this.setOpenAw(1);
			else this.setOpenAw(-1);
		}else this.setOpenAw(0);
	},
	//节点数量改变
	onNodeCountChange:function(){
		if(this.hasSubNode()){
			if(this.openState)this.setOpenAw(1);
			else this.setOpenAw(-1);
		}else this.setOpenAw(0);
	},
	//渲染标题
	rendContent:function(bv){
		var a=this.crtJQO('a','item');
		a.append(this.crtJQO('span','title'));
		var ul=this.getJQO('subCon');
		if(ul)a.insertBefore(ul);
		else bv.append(a);
		return a;
	},
	//渲染箭头
	rendArrow:function(bv){
		var ar;
		this.getJQO('item',function(t){
			ar=this.crtJQO('span','arrow');
			t.append(ar);
		});
		return ar;
	},
	//获取当前节点的子视图容器
	getViewCon:function(nc){
		var vc=this.getJQO('item');
		if(!vc&&nc!=false)vc=this.rendContent(this.baseJqo);
		return vc;
	},
	//获取箭头视图
	getArrow:function(){
		var vc=this.getJQO('arrow');
		if(!vc)vc=this.rendArrow();
		return vc;
	},
	getOpenTgtName:function(){
		return 'item';
	},
	setRootVal:function(v){
		if(tak.iObj(v)){
			var t=v[this.namePn];
			if(tak.hStr(t))document.title = t;
		}
	},
	//设置节点显示内容
	setNodeVal:function(v){
		if(tak.iObj(v)){
			this.setIcon(v[this.iconPn]);
			this.setName(v[this.namePn]);
		}
	},
	setIcon:function(ic){
		var ico=this.getJQO('icon');
		if(ico){
			if(tak.hStr(ic))ico.addClass(ic);
			else this.rmJQO('icon');
		}else if(tak.hStr(ic)){
			this.getJQO('item',function(t){
				t.prepend(this.crtJQO('i','icon',{'class':ic}));
			});
		}
	},
	setName:function(name){
		this.setJQVal(name,'title');
	},
	//设置开启状态状态 -1 表示关闭，0表示没有子集，1表示打开
	setOpenAw:function(ss){
		if(ss!=0)this.getArrow();
		else this.rmJQO('arrow');
	},
});

;
///<jscompress sourcefile="frame.js" />
function FrameV(){
}
defCls(FrameV,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.tag='iFrame';
	},
	/**
	 * 值改变处理方法
	 * */
	getHVal:function(v){
		return this.baseJqo.attr("src");
	},
	setHVal:function(v){
		this.baseJqo.attr("src",v);
	},
});
///<jscompress sourcefile="checkBox.js" />

//多选按钮控件
function CheckBoxV(){
}
defCls(CheckBoxV,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.checkState=false;
	},
	
	onRended:function(){
		takView.prototype.onRended.call(this);
		var v=this.getName();
		if(tak.hStr(v))this.setTxtVal(v);
		this.bindJQEvF('click','base',function(){
			if(this.getRealEnable())this.setVal(!this.checkState);
		},this);
	},
	setTxtVal:function(v){
		if(tak.hStr(v)){
			var t=this.getJQO('txt',function(b){b.html(v);});
			if(!t)this.baseJqo.append(this.crtJQO('span','txt').html(v));
		}else this.rmJQO('txt');
		this.doEv('textChanged',v);
	},
	checked:function(v){
		if(tak.iBool(v)&&this.checkState!=v){
			this.checkState=v;
			this.onCheckedChange(v);
		}
		return this.checkState;
	},
	onCheckedChange:function(v){
		if(this.baseJqo){
			if(v)this.baseJqo.addClass('checked');
			else this.baseJqo.removeClass('checked');
		}
	},
	getHVal:function(){
		return this.checked();
	},
	setHVal:function(v){
		this.checked(v);
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		var v=this.crtJQO('lable');
		var sb=this.crtJQO('span','icon');
		v.append(sb);
		return v;
	}
});;
///<jscompress sourcefile="chkListBox.js" />

function chkListBox(){
}
defCls(chkListBox,SelectV,{
	onCrtPro:function(opt){
		SelectV.prototype.onCrtPro.call(this,opt);
		this.subDef={type:'CheckBoxV'};
		this.multi=false;
	},
	onInit:function(opt){
		SelectV.prototype.onInit.call(this,opt);
		if(opt.multiSel=='1')this.multi=true;
	},
	clearOpt:function(){
		while(this.items.length>0){
			this.items[0].view.remove();
		}
	},
	onRmSubed:function(o){
		SelectV.prototype.onRmSubed.call(this,o);
		for(var i=0;i<this.items.length;i++){
			if(this.items[i].view==o){
				this.items.splice(i,1);
				break;
			}
		}
	},
	subCheckedChange:function(s,v){
		if(!this.multi&&v){
			var it;
			for(var i=0;i<this.items.length;i++){
				it=this.items[i];
				if(it.view!=s)it.view.checked(false);
			}
		}
		this.doHValChange(this.getHVal());
	},
	genOptV:function(opt,index,valPn,txtPn){
		if(opt){
			var i=this.addTObj({title:opt[txtPn]});
			if(tak.ckTN(i,CheckBoxV)){
				i.bindEv('hValChange',this.subCheckedChange,this);
				return i;
			}
		}
	},
	selOpts:function(){
		return this.findItems(function(i){i.view.checked()});
	},
	selOpt:function(){
		return this.findItem(function(i){i.view.checked()});
	},
	/**
 	* 将HTML中的值写入Val
 	* */
	getHVal:function(){
		if(this.dCvt&&this.dCvt.loading)return this.__val__;
		if(!this.multi){
			var it=this.selOpt();
			if(it)return it.val;
		}else{
			var its=this.selOpts();
			var vs=[];
			for(var i=0;i<its.length;i++){
				vs.push(its[i].val);
			}
			return vs;
		}
	},
	//将数据显示到视图中
	setHVal:function(v){
		if(!tak.iAry(v))v=[v];
		var it;
		for(var i=0;i<this.items.length;i++){
			it=this.items[i];
			if(v.indexOf(it.val)>=0)it.view.checked(true);
			else it.view.checked(false);
		}
	},
	selDef:function(){
		
	},
	create:function(){
		return this.crtJQO('div');
	}
});
;
///<jscompress sourcefile="multiLevelV.js" />

/**
 * 多级控件
 * */
function multLvV(){
}
defCls(multLvV,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.subDef={type:"SelectV"};
	},
	onLoad:function(opt){
		takView.prototype.onLoad.call(this,opt);
		this.initSubView((tak.iNum(opt.maxLv)&&opt.maxLv>1)?opt.maxLv:3);
	},
	initSubView:function(ml){
		if(this.dCvt){
			var vs=[];
			for(var i=0;i<ml;i++){
				vs.push(this.addTObj(this.subDef));
			}
			this.items=vs;
			this.dCvt.setItem(vs);
		}
	},
	defCvtTmp:function(){
		return {type:'treeCvt'};
	},
	/**
 	* 将HTML中的值写入Val
 	* */
	getHVal:function(){
		if(this.items&&this.items.length>0)return this.items[this.items.length-1].getHVal();
		else return this.__val__;
	},
	//将数据显示到视图中
	setHVal:function(v){
		if(this.dCvt)this.dCvt.setVal(v);
	},
});
