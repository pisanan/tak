
/**
 * 模板对象基类
 * */
function HtmlV(){
}
defCls(HtmlV,takRendObj,{
	onCrtPro:function(opt){
		takRendObj.prototype.onCrtPro.call(this,opt);
		this.tag='div';
	},
	onInit:function(opt){
		takRendObj.prototype.onInit.call(this,opt);
		this.baseV=this;
		if(opt.rMap)this.rMap=this.initMap(opt.rMap);
		if(tak.hStr(opt.tag))this.tag=opt.tag;
		this.setVAtt($.takApp.getVAtts(opt.type));
		if(opt.vAtt)this.setVAtt({def:tak.defTmp(opt.vAtt,'base')});
		if(tak.iAry(opt.scene))this.scene=opt.scene;
		else if(tak.hStr(opt.scene))this.scene=[opt.scene];
	},
	onLoad:function(opt){
		takRendObj.prototype.onLoad.call(this,opt);
		if(opt.jEven)this.initJEvent(opt.jEven);
		if(opt.views)this.addTViews(opt.views);
	},
	initJEvent:function(opt){
		if(tak.hStr(opt))opt=[{en:opt}]
		else if(tak.iObj(opt))opt=[opt];
		var e;
		for(var i=0;i<opt.length;i++){
			e=opt[i];
			if(tak.hStr(e))e={en:e};
			if(!tak.hStr(e.jId))e.jId=this.defEvenJqo();
			if(tak.iObj(e)){
				var jen=e.jen;
				if(!tak.hStr(jen))jen=e.en;
				this.bindJQEvF(jen,e.jId,this.jQEventFun(e));
			}
		}
	},
	defEvenJqo:function(){
		return 'base';
	},
	jQEventFun:function(e){
		var arg={arg:e.arg},en=e.en,func=e.func,on=e.on,pn=e.pn,onParent=(e.onParent=='1');
		return function(je,jqo){
			arg.je=je;
			arg.jqo=jqo;
			if(tak.hStr(en))this.doEv(en,arg);
			if(func){
				var o=this;//这里被触发已经就变成控件对象了
				if(tak.iObj(on))o=on;
				else if(tak.hStr(on))o=o.getProObj(tak.hStr(pn)?pn:'id',on);//创建路径上级满足条件的对象
				if(o)o.getFunc(func,o,[this,arg]);
			}
		};
	},
	/**
 	* 显示已改变处理方法
 	* */
	/**
 	* 显示已改变处理方法
 	* */
	onVisibleChange:function(nv){
		if(nv)this.show();
		else this.hide();
	},
	/**
 	* 隐藏视图
 	* */
	hide: function() {
		if(this.visible == true) {
			this.visible = false;
			return;
		}
		if(this.rended)this.hideJqo();
	},
	/**
	 * 显示视图
 	* */
	show: function() {
		if(this.visible == false) {
			this.visible = true;
			return;
		}
		if(this.rended)this.showJqo();
	},
	showJqo:function(jid){
		this.rmJQClass("hide",jid);
	},
	hideJqo:function(jid){
		this.addJQClass("hide",jid);
	},
	/**
 	* 绑定父级对象事件处理方法
 	* @param {String}n 事件名称
 	* @param {Function}f 处理函数 参数：e 事件参数 s 事件发送者
 	* */
	bindPaEv:function(n,f){
		if(this.parent)this.parent.bindEv(n,f,this);
	},
	/**
	 * 设置HTML属性
	 * */
	setVAtt: function(att) {
		this.vAtt = $.extend(true,{},this.vAtt, att);
	},
	/**
	 * 读取HTMl元素属性
	 * @param {String}sn 子元素元素名称，如果不填则返回完整对象
	 * */
	getAtt: function(gn,sn) {
		var atts = this.vAtt;
		if(!atts) return;
		if(!atts[gn])return;
		if(atts[gn][sn])return atts[gn][sn];
		else if(sn=="base") return atts[gn];
	},
	/**
	 * 创建jquery对象
	 * @param {String}tn 创建的HTMl元素标签名称
	 * @param {String}jId jQuery对象Id 不输入默认为 base
	 * @param {String}sn 应用场景，不输入默认使用jId
	 * @param {Object}att HTMl元素的属性
	 * */
	crtJQO:function(tn,jId,sn,att){
		if(!tak.hStr(tn))return;
		if(arguments.length==3&&tak.iObj(sn)){att=sn;sn=null;}
		if(arguments.length==2&&tak.iObj(jId)){att=jId;sn=null;jId=null;}
		if(!this.jqo)this.jqo={};
		if(!tak.hStr(jId))jId='base';
		var o=this.jqo[jId];
		if(o)return o;
		o=$('<'+tn+'>');
		this.jqo[jId]=o;
		if(!tak.hStr(sn))sn=jId;
		this.newJQAtt(jId,o,sn,att);
		return o;
	},
	setAtt:function(jqo,t){
		for(var i in t) {
			if(i=='class')jqo.addClass(t[i]);
			else jqo.attr(i, t[i]);
		}
	},
	/**
 	* 新建的JQ对象，设置属性
 	* @param {jQuery}jv jquery对象
 	* @param {String}sn 应用场景
 	* */
	newJQAtt: function(jId,jv,sn,att) {
		if(!jv) return;
		var p = this.getAtt('def',sn);
		if(p)this.setAtt(jv,p);
		if(this.scene){
			var vgs=this.scene;
			for(var i=0;i<vgs.length;i++){
				p=this.getAtt(vgs[i],sn);
				if(p)this.setAtt(jv,p);
				else if(jId=='base') jv.addClass(vgs[i]);
			}
		}
		if(att)this.setAtt(jv,att);
	},
	/**
	 * 设置JQ对象属性
	 * */
	setJQAtt:function(jId,n,v){
		this.getJQO(jId,function(j){
			tak.jQAtt(j,n,v);
		});
	},
	rmJQO:function(jId,f,o){
		if(!tak.hStr(jId))jId='base';
		var j;
		for(var i in this.jqo){
			if(i==jId){
				j=this.jqo[i];
				if(tak.iFun(f)){
					var to=(o)?o:this;
					f.call(to,j);
				}
				delete this.jqo[i];
				j.remove();
				return j;
			}
		}
	},
	getJQO:function(jId,f,o){
		if(tak.iFun(jId)){o=f;f=jId;jId=null;}
		if(!tak.hStr(jId))jId='base';
		var j;
		for(var i in this.jqo){
			if(i==jId){
				j=this.jqo[i];
				if(tak.iFun(f)){
					var to=(o)?o:this;
					f.call(to,j);
				}
				return j;
			}
		}
	},
	eachJQO:function(f,o){
		if(!this.jqo||!tak.iFun(f))return;
		var j;
		for(var i in this.jqo){
			j=this.jqo[i];
			var to=(o)?o:this;
			f.call(to,j,i);
		}
	},
	clearJQO:function(){
		if(!this.jqo)return;
		var j;
		for(var i in this.jqo){
			j=this.jqo[i];
			delete this.jqo[i];
			j.remove();
		}
	},
	/**
 	* 绑定JQUERY对象事件到自定义内部事件
 	* @param {Stirng}jE jQuery事件名称
 	* @param {Stirng}eN 绑定到自定义事件名称
 	* @param {Stirng}jId jQuery对象id
 	* @param {Object}eArg 事件触发时的自定义参数
 	* */
	bindJQEv:function(jE,eN,jId,eArg){
		if(!tak.hStr(jE)||!tak.hStr(eN))return;
		var t=this;
		this.getJQO(jId,function(jq){
			jq.on(jE,function(){
		 		t.doEv.call(t,eN,{jqo:jq,sArg:eArg,jArg:arguments});
			});
		});
	},
	/**
 	* 绑定JQUERY对象事件到自定义内部事件
 	* @param {Stirng}jEn jQuery事件名称
 	* @param {Stirng}jId jQuery对象Id 或jQuery对象
 	* @param {Stirng}fun 事件处理方法  参数第一个是jquery对象，后续参数是jquery的事件参数
 	* @param {Object}to 处理方法的this指针，如果不传，则使用当前对象
 	* */
	bindJQEvF:function(jEn,jId,fun,to){
		if(!tak.iFun(fun)){to=fun;fun=jId;jId=null;}
		if(!tak.hStr(jEn)||!tak.iFun(fun))return;
		if(!to)to=this;
		var bf=function(jq){
			jq.on(jEn,function(e){
		 		fun.call(to,e,jq);
			});
		}
		if(tak.ckTN(jId,jQuery))bf(jID);
		else this.getJQO(jId,bf);
	},
	/**
 	* 为HTML控件添加css类
 	* */
	addJQClass:function(cn,jId){
		if(!tak.hStr(cn))return;
		this.getJQO(jId,function(jq){
			jq.addClass(cn);
		});
	},
	/**
 	* 移除HTML元素css类
 	* */
	rmJQClass:function(cn,jId){
		if(!tak.hStr(cn))return;
		this.getJQO(jId,function(jq){
			jq.removeClass(cn);
		});
	},
	/**
	 * 设置HTML元素CSS
	 * */
	setJQCss:function(cn,cv,jId){
		if(!tak.hStr(cn))return;
		this.getJQO(jId,function(jq){
			jq.css(cn,cv);
		});
	},
	
	/**
 	* 读取HTML元素属性
 	* @param {String}an 属性名
 	* @param {String}jId 元素名称 或 jq对象
 	* */
	getJQAtt:function(an,jId) {
		if(!tak.hStr(an))return;
		this.getJQO(jId,function(jq){
			jq.attr(an,av);
		});
	},
	getJQVal:function(jId){
		var v;
		this.getJQO(jId,function(jq){
			v=tak.jQValr(jq);
		});
		return v;
	},
	setJQVal:function(v,jId){
		this.getJQO(jId,function(jq){
			tak.jQValw(v,jq);
		});
	},
	//可用状态改变，
	aplEnable: function(nv){
		this.aplJQEnable(nv);
		takRendObj.prototype.aplEnable.call(this,nv);
	},
	//可用状态改变，
	aplJQEnable: function(nv){
		this.eachJQO(function(jq){
			tak.jQEnable(nv,jq);
		});
	},
	doRend:function(to){
		var r=this.genJqoView();
		if(this.rended)to.rendTakView(this);
		return r;
	},
	//获取容器渲染对象，如果没有定义rMap,则直接渲染到baseJqo
	getJqoCon:function(v){
		if(!v)return;
		var jn;
		if(this.rMap){
			jn=this.rMap.getCon(v);
			if(!jn)return;
		}
		return this.getJQO(jn);
	},
	rendTakView:function(obj){
		var jq=this.getJqoCon(obj);
		if(jq){
			if(tak.ckTN(obj,HtmlV))this.appendView(jq,obj);
			else if(tak.ckTN(obj,takCtrl))this.appendView(jq,obj.baseV);
			else if(tak.ckTN(obj,jQuery))jq.append(obj);
		}
	},
	appendView:function(mJqp,v){
		if(v.baseJqo)mJqp.append(v.baseJqo);
	},
	/**
 	* 获取当前视图的jquery对象
 	* */
	genJqoView: function() {
		if(!this.rended) {
			try {
				this.doEv("beginRend");
				this.baseJqo = this.create();
				this.doEv("createJqoed",this.baseJqo);
				this.rended = tak.ckTN(this.baseJqo,jQuery);
				return this.rended;
			} catch(err) {
				this.baseJqo = null;
				tak.logErr("[" + this.constructor.name + "]渲染HTML视图对象失败 ", err);
			}
		}
	},
	getHVal:function(){
		if(this.rended&&!this.hasSub())return this.getJQVal(this.getIptJId());
		else return this.__val__;
	},
	setHVal:function(v){
		if(this.rended&&!this.hasSub()){
			this.setJQVal(v,this.getIptJId());
			return true;
		}else return false;
	},
	getIptJId:function(){
		return 'base';
	},
	groupPkg:function(os){
		return os;
	},
	objPkg:function(o){
		return o;
	},
	rendSub:function(v){
		if(v)v.rend(this);
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		return this.crtJQO(this.tag);
	},
	onRemove:function(){
		this.clearJQO();
		delete this.jqo;
		takRendObj.prototype.onRemove.call(this);
	},
	
})