///<jscompress sourcefile="util.js" />

var tak={
	/**
	 * 打印错误日志
	 * @param {String}m 错误消息
	 * @param {Error}e 错误对象
	 * */
	logErr:function(m, e){
		if(e)console.error(m+"  错误消息:"+e+"\r\n调用堆栈："+e.stack);
		else console.error(m);
	},
	xhrRequest:function(url,data,opt){
		if(arguments.length==2){opt=data;data=null;}
		if(!opt)opt={};
		var xhr = null;
    	if(window.XMLHttpRequest)xhr = new XMLHttpRequest();
    	else xhr = new ActiveXObject("Microsoft.XMLHTTP");
    	xhr.open(opt.method, url, true);   //open(方法, url, 是否异步)
    	if(tak.iObj(opt.header)){
    		for(var i in opt.header){
    			xhr.setRequestHeader(i,opt.header[i]);
    		}
    	}
    	if(tak.iNum(opt.timeout)&&opt.timeout>=0)xhr.timeout=opt.timeout;//15秒超时
    	else xhr.timeout=15000;
    	var respType;
    	if(tak.hStr(opt.respType))respType=opt.respType;
    	else respType='';
    	xhr.responseType=respType;
    	//注册相关事件回调处理函数
		xhr.onload = function(e) { //请求完成
			if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
				if(opt.success){
					var data;
					if(respType=='text')data=xhr.responseText;
					else if(respType=='document')data=xhr.responseXML;
					else data=xhr.response;
					opt.success.call(opt.on,data,opt.token);
				}
            }else if(opt.err)opt.err.call(opt.on,xhr.status,'服务器响应失败',opt.token);
		};
		xhr.onprogress = function(e){//下载进度
			if(opt.dprogress)opt.dProgress.call(opt.on,e.loaded / e.total,opt.token);
		};
		xhr.upload.onprogress = function(e) {//上传进度
			if(opt.dprogress)opt.uProgress.call(opt.on,e.loaded / e.total,opt.token);
 		};
		xhr.ontimeout = function(e) {//请求超时
			if(opt.err)opt.err.call(opt.on,'9997','请求处理超时',opt.token);
		};
		xhr.onerror = function(e) { //请求处理错误
			if(opt.err)opt.err.call(opt.on,'9998','请求处理失败',opt.token);
		};
    	
    	xhr.onreadystatechange = function(){//状态改变
        	if(opt.stateChange)opt.stateChange.call(opt.on,xhr.readyState,opt.token);
    	};
    	try{
    		xhr.send(data);
    	}catch(err){
    		if(opt.err)opt.err.call(opt.on,'9999','请求发送失败，请求检查本地网络。',opt.token);
    	}
	},
	createFun:function(name,args,cmd){
		try{
			if(arguments.length==2){cmd=args,args=undefined;}
			else if(arguments.length==1){cmd=name;args=undefined;name="";}
			var fun=new Function(args,cmd);
			return fun;
		}catch(err){
			tak.logErr("自定义函数创建失败 ,函数名称:"+name,err);
		}
	},
	/**
	 * 空格分开
	 * */
	splStrSp:function(str){
		return str.trim().split(/\s+/);
	},
	/**
	 * 空格分开
	 * */
	splStrDot:function(str){
		return str.trim().split(/\.+/);
	},
	/**
	 * 读取函数名称
	 * */
	gfn:function(f){
		return f.name||f.toString().match(/function\s*([^(]*)\(/)[1];
	},
	/**
	 * 获取对象类型名称
	 * */
	gtn:function(o){
		var a= Object.prototype.toString.call(o);
		return a.substr(8,a.length-9);
	},
	/**
	 * 获取对象类型名称
	 * */
	gstn:function(o){
		var a= Object.prototype.toString.call(o);
		a=a.substr(8,a.length-9);
		switch(a){
			case"Function":return'fun';
			case"String":return'str';
			case"Number":return'num';
			case"Boolean":return'bool';
			default:return a;
		}
	},
	/**
	 * 检查对象类型是否匹配
	 * */
	ckT:function(o,n){
		return tak.gtn(o)==n;
	},
	/**
	 * 判断是否是某类型的实例
	 * */
	ckTN:function(o,tn){
		if(tak.iObj(o))return o instanceof tn;
		else if(tak.iFun(o)) return (o.prototype instanceof tn)||(o==tn);
		else return false;
	},
	/**
	 * 是否是对象类型
	 * */
	iObj:function(o){
		return Object.prototype.toString.call(o)=='[object Object]';
	},
	/**
	 * 是否是函数
	 * */
	iFun:function(o){
		return Object.prototype.toString.call(o)=='[object Function]';
	},
	/**
	 * 是否是对象类型
	 * */
	iAry:function(o){
		return Object.prototype.toString.call(o)=='[object Array]';
	},
	/**
	 * 是否是Map
	 * */
	iMap:function(o){
		return Object.prototype.toString.call(o)=='[object Map]';
	},
	/**
	 * 是否是对象类型
	 * */
	iStr:function(o){
		return Object.prototype.toString.call(o)=='[object String]';
	},
	/**
	 * 是否是数值
	 * */
	iNum:function(o){
		return Object.prototype.toString.call(o)=='[object Number]';
	},
	/**
	 * 是否是布尔
	 * */
	iBool:function(o){
		return Object.prototype.toString.call(o)=='[object Boolean]';
	},
	/**
	 * 是否是字符串且有值
	 * */
	hStr:function(o){
		return tak.iStr(o)&& o.trim().length>0;
	},
	/**
	 * 是否是空字符串
	 * */
	eStr:function(o){
		return tak.iStr(o)&& o.trim().length==0;
	},
	/**
	 * 链接字符串
	 * */
	strJoin:function(s1,s2,c){
		if(tak.hStr(s1)&&tak.hStr(s2))return s1+c+s2;
		else return tak.hStr(s1)?s1:s2;
	},
	/**
	 * 判断是否是数组且有值
	 * */
	hAry:function(o){
		return tak.iAry(o)&& o.length>0;
	},
	/**
	 * 判断是否是空数组
	 * */
	eAry:function(o){
		return tak.iAry(o)&& o.length==0;
	},
	/**
	 * 遍历数组，如果不是数组，则直接执行f
	 * @param {Object}t 在f中的this指针
	 * @param {Array}a 要遍历的数组
	 * @param {Function}f 遍历处理函数
	 * @param {Boolean}d 是否是倒序
	 * */
	eachAry:function(t,a,f,d){
		if(!tak.iFun(f))return;
		if(tak.iAry(a)){
			if(d==true){
				for(var i=a.length-1;i>=0;i--){
					f.call(t,a[i]);
				}
			}else{
				for(var i=0;i<a.length;i++){
					f.call(t,a[i]);
				}
			}
		}else if(!isNull(a)) f.call(t,a);
	},
	/**
	 * 深度拷贝
	 * */
	copy:function(o){
		if(isNull(o))return o;
		var item,t;
		t=tak.gtn(o);
		if(t=="Object"){
			if(tak.ckTN(o,takObj))return o;
			item={};
			for(var i in o){
				 item[i]=tak.copy(o[i]);
			}
		} else if(t=="Array"){
			item=[];
			for(var i=0;i<o.length;i++){
				item.push(tak.copy(o[i]));
			}
		} else if(t=="Map"){
			item=new Map();
			for(var i in o){
				item.set(tak.copy(i[0]),tak.copy(i[1]));
			}
		} else item=o;
		return item;
	},
	/**
 	* 为框架对象创建属性
 	* @param {Object}obj 目标对象
 	* @param {String}pName 属性名称
 	* @param {Any}def 默认值(如果是Function则直接调用该方法获取返回值当做是参数)
 	* @param {Function}evHandle 属性改变时，执行方法。如果返回false将取消赋值操作。
 	* */
 	genPro:function(obj,pName,dv,evHandle){
 		var val;
 		if(tak.iFun(dv))val=dv.call(obj);
		else val=dv;
		Object.defineProperty(obj,pName,{
			configurable:true,
			enumerable:true,
			get:function(){
				return val;
			},
			set:function(nv){
				if(nv===undefined){
					if(tak.iFun(dv))nv=dv.call(this);
					else nv=dv;
				}
				if(nv!=val){
					var oV=val;
					val=nv;
					if(tak.iFun(evHandle)&&evHandle.call(this,oV,nv)==false)val=oV;
				}
			}
		});
	},
	defTmp:function(tmp,dpName){
		if(isNull(tmp)||!dpName)return tmp;
		if(!tak.iObj(tmp)||tmp[dpName]===undefined){var t={};t[dpName]=tmp;tmp=t;}
		return tmp;
	},
	unTmp:function(o1,o2){
		if(!o1)return o2;
		if(!o2)return o1;
		var sn=tak.gtn(o1);
		var dsn=tak.gtn(o2);
		switch(sn){
			case "Object":
				switch(dsn){
					case "Object":
						o1=tak.copy(o1)
						for(var i in o2){
							o1[i]=tak.unTmp(o1[i],o2[i]);
						}
						return o1;
					case "Array":o2.push(o1);return o2;
					default:return o2;
				}
				break;
			case "Array":
				switch(dsn){
					case "Object":o1=tak.copy(o1);o1.push(o2);return o1;
					case "Array":o1=o1.concat(o2);return o1;
					default:return o2;
				}
				break;
			default:
				switch(dsn){
					case "Object":
					case "Array":
						return o2;
					default:return o2;
				}
				break;
		}
	},
	plgs:{},
	getPlg:function(obj,name){
		var p=tak.plgs[name];
		if(p&&p.type&&!tak.ckTN(obj,p.type))p=null;
		if(p)return p.pType;
	},
	uuid:function(){
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits[Math.floor(Math.random() * 0x10)];
		}
		s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits[(s[19] & 0x3) | 0x8];  // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";
    	var uuid = s.join("");
    	return uuid;
	},
	//读取页面对象的值
	jQValr:function(jq){
		var v;
		var tn=jq[0].tagName;
		if(tak.hStr(tn)){
			switch(tn.toLowerCase()){
				case 'input':
					var t=jq.attr('type');
					switch(t.toLowerCase()){
						case 'checkbox':
						case 'radio':
							v=(jq.attr("checked")==undefined?true:false);
							break;
						default:
							v=jq.val();
							break;
					}
					break;
				case 'select':
				case 'textarea':
					v=jq.val();
					break;
				default:
					v=jq.html();
					break;
			}
		}
		return v;
	},
	//值写入html
	jQValw:function(v,jq){
		var tn=jq[0].tagName;
		if(isNull(v))v='';
		if(tak.hStr(tn)){
			switch(tn.toLowerCase()){
				case 'input':
					var t=jq.attr('type');
					switch(t.toLowerCase()){
						case 'checkbox':
						case 'radio':
							if(v==true)jq.attr("checked","checked");
							else jq.removeAttr("checked");
							break;
						default:
							jq.val(v);
							break;
					}
					break;
				case 'select':
				case 'textarea':
					jq.val(v);
					break;
				default:
					jq.html(v);
					break;
			}
		}
	},
	/**
	 * 设置JQ对象属性
	 * */
	jQAtt:function(jq,n,v){
		if(!isNull(v))jq.attr(n,v);
		else jq.removeAttr(n);
	},
	/**
 	* 设置html可用状态
 	* */
	jQEnable:function(en,jq){
		var tn=jq[0].tagName;
		if(tak.hStr(tn)){
			switch(tn.toLowerCase()){
				case 'a':
				case 'button':
					if(en){
						tak.jQAtt(jq,"disabled");
						jq.removeClass('disable');
					}else{
						tak.jQAtt(jq,'disabled','true');
						jq.addClass('disable');
					}
					break;
				case 'textarea':
				case 'input':
					if(en){
						tak.jQAtt(jq,"readonly");
						jq.removeClass('disable');
					}else{
						tak.jQAtt(jq,"readonly",'true');
						jq.addClass('disable');
					}
					break;
				default:
					if(en)tak.jQAtt(jq,"disabled");
					else tak.jQAtt(jq,'disabled','true');
					break;
			}
		}
	},
}
/**
* 判断对象是否为空
* */
function isNull(o){
	return o==undefined||o==null;
}

/**
 * 类继承处理  至少3个参数  ip和ep可以不传
 * @param {Function}c 子类类型
 * @param {Function}b 父类类型
 * @param {Object}f 自定义的属性和方法
 * */
function defCls(c,b,f){
	var on=c.prototype.__proto__.constructor.name;
	if(!isNull(on)&&on!="Object")
	throw new Error(c.prototype.constructor.name+ "对象继承定义重复。");
	if(!tak.iFun(c))return;
	if(arguments.length==2){f=b;b=null;}
	if(tak.iFun(b)){
		c.prototype=new b();
		c.prototype.constructor=c;
	}
	if(tak.iObj(f)){
		for(var i in f){
			c.prototype[i]=f[i];
		}
	}
}

function defPlg(c,b,ei,f){
	if(!tak.ckTN(b,takTmpObj)||arguments.length!=4)return;
	if(tak.hStr(ei))ei={en:ei};
	if(!tak.iObj(ei))return;
	defCls(c,b,f);
	if(ei.single==true){
		ei.obj=new c();
		ei.obj.init();
	}
	if(tak.hStr(ei.en)){
		ei.pType=c;
		tak.plgs[ei.en]=ei;
	}
}


function defSvr(n,c,f){
	var on=c.prototype.__proto__.constructor.name;
	if(!isNull(on)&&on!="Object")
	throw new Error(c.prototype.constructor.name+ "对象继承定义重复。");
	if(!tak.iFun(c))return;
	if(tak.iObj(f)){
		for(var i in f){
			c.prototype[i]=f[i];
		}
	}
	if(tak.hStr(n))$.takApp.setUpService(n,new c());
}

;
///<jscompress sourcefile="obj.js" />
/**
 * 所有对象基类
 * */
function takObj(){
}
defCls(takObj,{
	//初始化
	init:function(owner,id){
		tak.genPro(this,"id",id,function(){return false});//不可修改
		tak.genPro(this,"event",function(){
			return new takEvent(this);
		},function(){return false});//不可修改
		if(!tak.ckTN(owner,takObj))owner=null;//持有者只能是takObj对象，否则为空。
		tak.genPro(this,"owner",owner,function(ov,nv){
			if(nv==null&&ov){
				ov.removeChild(this);
				return true;
			}
			return false;
		});//不可修改
		if(this.owner)this.owner.addChild(this.id,this);
		return this;
	},
	getPage:function(){
		if(tak.ckTN(this,takPage))return this;
		if(this.owner)return this.owner.getPage();
	},
	getCtrl:function(){
		if(tak.ckTN(this,takCtrl))return this;
		if(this.owner)return this.owner.getCtrl();
	},
	//在body中打开窗口
	openPage:function(opt){
		$.takApp.openPage(opt);
	},
	/**
 	* 附加属性
 	* */
	addChild:function(id,data){
		if(isNull(data))return;
		if(!this.childs)this.childs=[];
		if(this.childs.indexOf(data)>=0)throw new Error("ID为 "+id+" 的对象已经是"+this.id+"的子对象。");
		this.childs.push(data);
		if(!tak.hStr(id))return;
		var pn="$"+id;
		if(this[pn]!=undefined)throw new Error("ID为 "+id+" 的对象已经存在。");
		this[pn]=data;
		this.doEv("childAdded",{id:id,obj:data});
	},
	/**
 	* 移除属性
 	* */
	removeChild:function(o){
		if(o){
			if(tak.hStr(o.id))delete this["$"+o.id];
			var oi=this.childs.indexOf(o);
			if(oi>=0)this.childs.splice(oi,1);
			if(o)this.doEv("childRemoved",o);
		}
	},
	/**
 	* 遍历子对象
 	* */
	eachChild:function(f,o,fl){
		if(!tak.iFun(f)||!this.childs)return;
		var c,to;
		if(tak.iFun(o)){fl=o;o=null};
		for(var i=0;i<this.childs.length;i++){
			c=this.childs[i];
			if(fl&&fl.call(this,c)==false)continue;
			to=(!o)?c:o;
			f.call(to,c);
		}
	},
	/**
	 * 是否有子对象，包括自定义函数
	 * */
	hasChild:function(id){
		if(!tak.hStr(id))return false;
		return !isNull(this["$"+id]);
	},
	/**
 	* 获取附加属性
 	* */
	getChild:function(id,f,to){
		if(!tak.hStr(id))return;
		var o= this["$"+id];
		if(o&&tak.iFun(f)){
			if(!to)to=o;
			f.call(to,o);
		}
		return o;
	},
	/**
	 * 路径查找
	 * */
	findChild:function(ids,f,to){
		if(!tak.hStr(ids))return this;
		var idl=tak.splStrDot(ids);
		var id,o=this;
		var i=0;
		if(idl[0]=='this')i=1;
		for(;i<idl.length;i++){
			id=idl[i];
			o=o.getChild(id);
			if(!o)return;
		}
		if(o&&tak.iFun(f)){
			if(!to)to=o;
			f.call(to,o);
		}
		return o; 
	},
	/**
 	* 绑定事件处理方法
 	* @param {String}n 事件名称
 	* @param {Function}f 处理函数 参数：e 事件参数 s 事件发送者
 	* @param {Object}o 处理函数被触发时，函数中的this指向，如果不传默认为当前所在对象
 	* */
	bindEv:function(n,f,o){
		this.event.bindEv(n,f,o);
	},
	/**
 	* 绑定持有者事件处理方法
 	* @param {String}n 事件名称
 	* @param {Function}f 处理函数 参数：e 事件参数 s 事件发送者
 	* */
	bindOwnerEv:function(n,f){
		if(this.owner)this.owner.bindEv(n,f,this);
	},
	/**
	 * 绑定子对象(owner为当前对象的对象)
 	* @param {String}id 视图ID
 	* @param {String}eN 事件名称
 	* @param {Function}fun 绑定控件事件
 	* */
	bindChildEv:function(id,eN,f){
		var v=this.getChild(id);
		if(v)v.bindEv(eN,f,this);
	},
	/**
 	* 解除事件绑定
 	* 参数为解除条件选择，传入多个参数为且模式判定
 	* @param {String}n 事件名称
 	* @param {Function}f 处理函数 参数：e 事件参数 s 事件发送者
 	* @param {Object}o 绑定对象
 	* */
	unBindEv:function(n,f,o){
		this.event.unEvh(n,f,o);
	},
	/**
 	* 触发控制器事件
 	* @param {String}n 事件名称
 	* @param {Array}e 事件参数
 	* */
	doEv:function(n,e){
		return this.event.doEve(n,e);
	},
	/**
 	* 数据读取失败，显示错误消息
 	* */
	alertError:function(code,msg,err){
		if(arguments.length==1){msg=code;code=null;}
		else if(tak.iObj(msg)){err=msg;msg=code;code=null;}
		else if(tak.hStr(code))msg=msg+"("+code+")";
		tak.logErr("处理失败："+msg,err);
		this.alert("处理失败",msg,'error');
	},
	/**
	* 弹框方法
	* @title {String} 消息框标题
	* @msg {String} 消息内容
	* @iconType {String} 图标类型  不传或传空表示不显示图标 info（绿色叹号），warning（黄色叹号） ，question（灰色问号）,success(绿色钩子)，error(红色叉叉)
	*/
	alert:function(t,m,i){
		var sender=this;
		$.takApp.alertF()(i,t,m);
	},
	/**
	* 确认弹框方法
	* @title {String} 消息框标题
	* @msg {String} 消息内容
	* @iconType {String} 图标类型  不传或传空表示不显示图标 info（绿色叹号），warning（黄色叹号） ，question（灰色问号）,success(绿色钩子)，error(红色叉叉)
	* @then {Function} 点击确定后的处理函数
	*/
	confirm:function(t,n,i,f,a,on){
		if(!on)on=this;
		$.takApp.confirmF()(i,t,n,function(){
			if(tak.hStr(f))f=on.getChild(f);
			if(tak.iFun(f))f.call(on,a);
		});
	},
	showPage:function(opt){
		$.takApp.crtPage(opt);
	},
	showDialog:function(opt,on){
		$.takApp.showDialog(opt,on);
	},
	/**
 	* 释放资源
 	* */
	dispose:function(){
		if(this.disposed)return false;
		this.disposed=true;
		this.doEv('disposed');
		this.event.dispose();
		this.owner=null;
		var c;
		if(this.childs){
			for(var i=0;i<this.childs.length;i++){
				c=this.childs[i];
				if(tak.ckTN(c,takObj)&&c.disposed!=true){
					c.dispose();
					i--;
				}
			}
		}
		
		for(var i in this){
			if(i!="disposed"){
				delete this[i];
			}
		}
		return true;
	}
});

/**
 * 插件对象基类
 * */
function takTmpObj(){
}
defCls(takTmpObj,takObj,{
	//初始化 最好不要重写该函数。 重复执行会报错
	init:function(owner,opt){
		if(this.inited)return;
		this.inited=true;
		takObj.prototype.init.call(this,owner,opt.id);
		if(opt.func)this.loadFunc(opt.func);
		if(opt&&opt.exts){
			for(var i in opt.exts){
				this.genPlugin(i,opt.exts[i]);
			}
		}
		this.onInit(opt);
		this.doEv("inited",opt);
		return this;
	},
	/**
	 * 只能执行一次 执行多次会出问题
	 * 一般在这里做事件绑定 或其他只能初始化一次的操作
	 * */
	onInit:function(opt){
		if(tak.iObj(opt.refTmps))this.refTmps=opt.refTmps;//引用模板
	},
	//更新子集对象配置引用
	updTmp:function(tmp){
		if(this.refTmps&&tak.hStr(tmp.fid)){
			var mt=this.refTmps[tmp.fid];
			//如果成功使用了引用文件中的内容，则该对象下的子对象也使用当前的引用声明
			//否则使用创建者的引用声明
			if(tak.iObj(mt)&&tak.hStr(tmp.rid))mt=mt[tmp.rid]
			if(tak.iObj(mt)){
				tmp=tak.unTmp(mt,tmp);
				tmp.refTmps=mt.refTmps;
			}else if(!tmp.refTmps) tmp.refTmps=this.refTmps;
		}
		return tmp;
	},
	loadFunc:function(opt){
		if(tak.iObj(opt)){
			for(var i in opt){
				this.addFunc(i,opt[i]);
			}
		}
	},
	/**
 	* 创建自定义函数
 	* */
	addFunc:function(n,tmp){
		if(tak.hStr(tmp))tmp={cmd:tmp};
		if(tak.hStr(n)){
			var f;
			if(tak.iObj(tmp)&&tak.hStr(tmp.cmd))f=tak.createFun(n,tmp.args,tmp.cmd);
			else if(tak.iFun(tmp))f=tmp;
			if(f)this.addChild(n,f);
			return f;
		}
	},
	/**
 	* 获取自定义函数
 	* */
	getFunc:function(n,callOn,args){
		var f;
		if(tak.iFun(n))f=n;
		else f=this.getChild(n);
		if(f){
			if(callOn){
				if(!isNull(args)&&!tak.iAry(args))args=[args];
				f.apply(callOn,args);
			}
			return f;
		}
	},
	/**
	 * 循环子对象执行方法
	 * */
	actChild:function(act,args,ot){
		var f;
		if(tak.iFun(act))f=n;
		else f=this.getChild(act);
		if(args&&!tak.iAry(args))args=[args];
		if(tak.iFun(f)){
			var v;
			for(var i=0;i<this.childs.length;i++){
				v=this.childs[i];
				if(!ot||tak.ckTN(v,ot))f.apply(v,args);
			}
		}
	},
	getPlugin:function(name,crt,opt){
		var p=this.getChild(name);
		if(!p&&crt)p=this.genPlugin(name,opt);
		return p;
	},
	genPlugin:function(name,opt){
		var tf;
		if(tak.iObj(opt)){
			if(tak.iFun(opt.type))tf=opt.type;
			else tf=eval(opt.type);
		}
		if(!tf){
			tf=tak.getPlg(this,name);
			if(tak.hStr(tf))tf=eval(tf);
		}
		if(tak.iFun(tf)){
			if(!this.__takExts__)this.__takExts__={};
			var o=new tf();
			o.init(this,opt,name);
			this.__takExts__[name]=o;
			return o;
		}else tak.logErr("无法加载插件["+name+"],找不到插件类型。");
	},
});

/**
 * 视图对象基类
 * */
function takMoObj(){
}
defCls(takMoObj,takTmpObj,{
	onCrtPro:function(opt){
		//用户标签属性只是一个存储属性，没有啥用。实际使用过程中可以用于对象的分组，标记等功能
		tak.genPro(this,"userTag",opt.uTag,this.userTagChange);
		this.pro=tak.copy(opt.pro);
	},
	//初始化 最好不要重写该函数。 重复执行会报错
	init:function(owner,opt){
		this.onCrtPro(opt);
		takTmpObj.prototype.init.call(this,owner,opt,opt.id);
		return this;
	},
	onInit:function(opt){
		takTmpObj.prototype.onInit.call(this,opt);
		this.pro=opt.pro;
		if(tak.hStr(opt.title))this.setName(opt.title);
	},
	getName:function(){
		return this.getPro('name');
	},
	setName:function(n){
		if(!this.pro)this.pro={};
		this.pro.name=n;
	},
	/**
	 * 标签改变处理方法
	 * */
	userTagChange:function(ov,nv){
		this.onUserTagChange(nv);
	},
	//标签改变
	onUserTagChange:function(nv){},
	/**
	 * 读取模板属性定义
	 * */
	getPro:function(pn){
		if(pn=='id')return this.id;
		if(this.pro&&tak.hStr(pn)){
			if(!isNull(this.pro[pn]))return this.pro[pn];
		}
	},
	
	//通过属性值查找创建父级对象
	getProObj:function(pn,val,f,o){
		var p,v=this.getPro(pn);
		if(v==val)p=this;
		else if(this.owner)p=this.owner.getProObj(pn,val,f,o);
		if(p&&tak.iFun(f)){
			if(!o)o=this;
			f.call(this,p);
		}
		return p;
	},
	/**
 	* 通过属性查找子对象
 	* */
	getChildByPV:function(pn,val,f,to){
		var c,o;
		if(isNull(this.pn)||!tak.hStr(pn))o=this.getChild(val,f,to);
		else if(pn=='id')o=this.getChild(val,f,to);
		else {
			var c,o;
			for(var i=0;i<this.childs.length;i++){
				c=this.childs[i];
				if(c.getPro(pn)==val){
					o=c;break;
				}
			}
		}
		if(o&&tak.iFun(f)){
			if(!to)to=o;
			f.call(to,o);
		}
		return o;
	},
	/**
	 * 校验属性是否相等
	 * */
	checkPro:function(pn,v,dv){
		var pv=this.getDPro(pn,dv);
		return pv==v;
	},
	/**
	 * 读取模板属性定义
	 * */
	getDPro:function(pn,def){
		var v=this.getPro(pn);
		if(v===undefined)v=def;
		return v;
	},
	newObjs:function(tmps,def){
		var vs=[],t,v;
		if(tak.iObj(tmps)){
			for(var i in tmps){
				t=tmps[i];
				t.id=i;
				v=this.newObj(t,def);
				if(v)vs.push(v);
			}
		}else if(tak.iAry(tmps)){
			for(var i=0;i<tmps.length;i++){
				t=tmps[i];
				v=this.newObj(t,def);
				if(v)vs.push(v);
			}
		}
		return vs;
	},
	newObj:function(tmp,def){
		if(tak.iObj(tmp)){
			if(!tmp)return;
			try{
				if(def)tmp=tak.unTmp(def,tmp);
				tmp=this.updTmp(tmp);
				var tf;
				if(tak.iFun(tmp.type))tf=tmp.type;
				else tf=eval(tmp.type);
				this.onWillCrt(tf,tmp);
				if(!tak.iFun(tf))return;
				var o=new tf();
				o.init(this,tmp);
				this.onChildCrt(o);
				return o;
			}catch(err){
				tak.logErr("["+this.id+"]创建对象["+tmp.id+"]失败 type:"+tmp.type,err);
			}
		}
	},
	onWillCrt:function(type,tmp){
		
	},
	onChildCrt:function(c){
		this.doEv("childCreated",c);
		if(tak.hStr(c.id))this.onCrtChildId(c.id,c);
	},
	onCrtChildId:function(id,obj){
		this.doEv("childCreatedId",{path:'this.'+id,obj:obj});
		if(this.owner&&tak.hStr(this.id))this.owner.onCrtChildId(this.id+'.'+id,obj);
	},
	
});;
///<jscompress sourcefile="collect.js" />

//jq元素容器
function takColObj(){
}
defCls(takColObj,takMoObj,{
	onCrtPro:function(opt){
		takMoObj.prototype.onCrtPro.call(this,opt);
		this.subDef=null;
	},
	onInit:function(opt){
		takMoObj.prototype.onInit.call(this,opt);
		if(opt.oMap)this.oMap=this.initMap(opt.oMap);
		if(opt.subDef)this.subDef=tak.unTmp(this.subDef,opt.subDef);
		if(tak.iObj(opt.subs))this.genSubs(opt.subs);
	},
	genSubs:function(subs){
		this.addSubs(this.newObjs(subs,this.subDef));
	},
	initMap:function(opt){
		var map=this.newObj(opt,{type:'takObjMap'});
		return map;
	},
	//获取对象容器，如果没有定义vMap,则直接添加到自身下级
	getConObj:function(o){
		if(this.oMap){
			var cid=this.oMap.getCon(o);
			if(cid)return this.findChild(cid);
		}
		else return this;
	},
	addTObjs:function(tmps,def){
		var vs=this.newObjs(tmps,def);
		if(vs)this.addObjs(vs);
		return vs;
	},
	addTObj:function(tmp,def){
		if(!def&&tmp!=this.subDef)def=this.subDef;
		var v=this.newObj(tmp,def);
		if(v)this.addObj(v);
		return v;
	},
	objPkg:function(o){
		return o;
	},
	addObjs:function(os){
		tak.eachAry(this,os,function(o){
			this.addObj(o);
		});
	},
	addObj:function(o){
		if(o){
			var c=this.getConObj(o);
			if(c)c.addSub(o);
		}
	},
	hasSub:function(){
		return this.subs&&this.subs.length>0;
	},
	//添加子视图集合
	addSubs:function(os,d){
		if(!os)return;
		tak.eachAry(this,os,this.addSub,d);
	},
	//添加子视图
	addSub:function(o){
		if(o&&tak.ckTN(o,takMoObj)){
			o=this.objPkg(o);
			if(o){
				if(!this.subs)this.subs=[];
				if(this.subs.indexOf(o)>=0)return;
				this.doEv("subWillAdd",o);
				this.subs.push(o);
				this.onAdSubed(o);
				this.doEv("subAdded",o);
				return true;
			}
		}
		return false;
	},
	getCount:function(){
		if(this.subs)return this.subs.length;
		else return 0;
	},
	//移除子视图
	removeSub:function(v){
		if(!this.subs)return;
		this.removeSubAt(this.subs.indexOf(v));
	},
	getSubByIndex:function(index){
		if(this.subs&&this.subs.length>index)return this.subs[index];
	},
	getSubIndex:function(o){
		return this.subs.indexOf(o);
	},
	//移除子视图
	removeId:function(id){
		this.getSub(id,function(b){
			this.removeSub(b);
		},this)
	},
	//移除子视图
	removeSubAt:function(i){
		if(i<0||i>=this.subs.length||!this.subs)return;
		var a=this.subs[i];
		this.subs.splice(i,1);
		this.onRmSubed(a);
		if(this.subs.length==0)this.subs=null;
		this.doEv("subRemoved",a);
	},
	//清空子视图
	clearSubs:function(f,o){
		if(!this.subs)return;
		var a;
		if(!o)o=this;
		var subs=this.subs;
		while(subs.length>0){
			a=subs[0];
			if(f)f.call(o,a);
			a.parent=null;
		}
	},
	onRmSubed:function(o){
		o.parent=null;
	},
	onAdSubed:function(o){
		o.parent=this;
		if(tak.hStr(o.id))this.onAddSubId(o.id,o);
	},
	onAddSubId:function(id,obj){
		this.doEv("subAddedId",{path:'this.'+id,obj:obj});
		if(this.parent&&tak.hStr(this.id))this.parent.onAddSubId(this.id+'.'+id,obj);
	},
	eachSub:function(f,o,k){
		if(!this.subs||!tak.iFun(f))return;
		var to,v;
		for(var i=0;i<this.subs.length;i++){
			v=this.subs[i];
			to=(o)?o:v;
			f.call(to,v);
			if(k)v.eachSub(f,o,k);
		}
	},
	actSub:function(act,args,k){
		var f=this.getFunc(act);
		if(args&&!tak.iAry(args))args=[args];
		if(tak.iFun(f)){
			var v;
			for(var i=0;i<this.subs.length;i++){
				v=this.subs[i];
				f.apply(v,args);
				if(k)v.actSub(act,args,k);
			}
		}
	},
	getSubPath:function(ids,f,o){
		if(!tak.hStr(ids))return this;
		var idl=tak.splStrDot(ids);
		var id,o=this;
		var i=0;
		if(idl[0]=='this')i=1;
		for(;i<idl.length;i++){
			id=idl[i];
			o=o.getSub(id);
			if(!o)return;
		}
		if(o&&tak.iFun(f)){
			if(!to)to=o;
			f.call(to,o);
		}
		return o;
	},
	
	getSub:function(id,f,o){
		var rv;
		if(isNull(id)||id=='')return this;
		else if(this.subs){
			var v;
			for(var i=0;i<this.subs.length;i++){
				v=this.subs[i];
				if(v.id==id){
					rv=v;
					break;
				}
			}
		}
		if(rv&&tak.iFun(f)){
			var to=(o)?o:v;
			f.call(to,v);
		}
		return rv;
	},
})


/**
 * 容器映射
 * */
function takObjMap(){
}
defCls(takObjMap,takTmpObj,{
	onInit:function(opt){
		takTmpObj.prototype.onInit.call(this,opt);
		this.pn='alias';
		if(tak.hStr(opt))this.def=opt;
		else if(tak.iObj(opt)){
			opt=tak.defTmp(opt,'map');
			this.def=opt.map.def;
			this.map=opt.map;
			if(tak.hStr(opt.pn))this.pn=opt.pn;
		}
	},
	getPNCon:function(pn){
		if(this.map)return this.map[pn];
		return this.def;
	},
	getCon:function(o){
		if(tak.iObj(o)){
			var c;
			if(this.map){
				var pv;
				if(this.pn=='id')pv=o.id;
				else if(o.pro)pv=o.pro[this.pn];
				if(pv)c=this.map[pv];
			}
			if(!c)c=this.def;
			return c;
		}
		return this.def;
	}
});
///<jscompress sourcefile="event.js" />

function takEvent(pa){
	this.owner=pa;
}
defCls(takEvent,{
	
	/**
 	* 添加事件监听处理
 	* */
	bindEv:function(n,f,on){
		if(tak.iStr(f))f=this.getAct(f);
		if(!tak.iStr(n)||!tak.iFun(f))return;
		if(!tak.iObj(on))on=this.owner;
		if(!this.eves)this.eves={};
		if(!this.eves[n])this.eves[n]=[];
		var el=this.eves[n];
		//不做重复绑定
		var oh;
		for(var i=0;i<el.length;i++){
			oh=el[i];
			if(oh.t==on&&oh.fun==f)return;
		}
		el.push({fun:f,t:on});
	},
	
	/**
	 * 解除事件绑定
	 * */
	unEvh:function(n,f,on){
		if(!this.eves)return;
		if(tak.iStr(f))f=this.getAct(f);
		if(isNull(on)&&isNull(f)&&tak.hStr(n)){
			delete this.eves[n];
			return;
		}
		var rmF=function(el,o,f){
			if(el){
				var h;
				for(var i=0;i<el.length;i++){
					h=el[i];
					if((!f||h.fun==f)&&(!o||h.t==o)){
						el.splice(i,1);
						i--;
					}
				}
			}
		}
		if(tak.hStr(n))rmF(this.eves[n],on,f);
		else{
			for(var i in this.eves){
				rmF(this.eves[i],on,f);
			}
		}
	},
	/**
 	* 触发事件
 	* */
	doEve:function(n,e){
		var fs=this.getEvhs(n);
		if(fs){
			for(var i=0;i<fs.length;i++){
				try{
					if(fs[i].t.disposed==true)continue
					if(fs[i].fun.call(fs[i].t,this.owner,e)==false)return false;
				}catch(err){
					tak.logErr(this.owner.id+"事件["+n+"]执行失败",err);
				}
			}
		}
		return true;
	},
	/**
 	* 获取事件监听接口列表
	* */
	getEvhs:function(n){
		if(!tak.hStr(n))return;
		if(!this.eves)return;
		return this.eves[n];
	},
	/**
 	* 释放资源
 	* */
	dispose:function(){
		for(var i in this){
			delete this[i];
		}
	}
});;
///<jscompress sourcefile="filter.js" />

//模板过滤器
function takFilter(opt,isSel){
	this.fn="id";
	this.isSel=false;
	opt=tak.unTmp({fn:'id',isSel:'0'},tak.defTmp(opt,'vals'));
	
	if(tak.hStr(opt.vals))this.vals=[opt.vals];
	else if(tak.iAry(opt.vals))this.vals=opt.vals;
	this.isSel=opt.isSel=="1"?true:false;
	this.fn=opt.fn;
}
defCls(takFilter,{
	getObjs:function(objs){
		if(!this.vals||this.vals.length==0){
			if(this.isSel)return [];
			else return objs;
		}
		var r=[];
		tak.eachAry(this,objs,function(t){
			if(this.check(t))r.push(t);
		});
		return r;
	},
	check:function(obj){
		if(!obj)return false;
		if(!this.vals||this.vals.length==0){
			if(this.isSel)return false;
			else return true;
		}
		var v;
		if(this.fn=='id')v=obj[this.fn];
		else if(obj.pro)v=obj.pro[this.fn];
		var i=this.vals.indexOf(v);
		if(this.isSel&&i>=0)return true;
		else if(!this.isSel&&i<0) return true;
		else return false;
	}
})
;
///<jscompress sourcefile="convert.js" />

function takCvt(){
}
defCls(takCvt,takTmpObj,{
	initVar:function(opt){
		this.loading=false;
	},
	onInit:function(opt){
		takTmpObj.prototype.onInit.call(this,opt);
		this.initVar(opt);
		if(tak.iObj(opt.ldOpt)){
			this.ldOpt=opt.ldOpt;
			this.ldOpt.ldOpt=true;
		}
		
		if(opt.lder)this.initLoader(tak.defTmp(opt.lder,'param'));
		else if(tak.iAry(opt.opts))this.setOpts(opt.opts);
		else this.setOpts(null);
	},
	initLoader:function(opt){
		this.ldSvn="cvtSv";
		if(tak.hStr(opt.sn))this.ldSvn=opt.sn;
		this.ldSfn="loadOpt";
		if(tak.hStr(opt.sf))this.ldSfn=opt.sf;
		this.ldParam=opt.param;
		this.loadOpts(this.ldParam,false,this.setOpts);
	},
	setParam:function(p){
		if(p){
			this.ldParam=p;
			this.loadOpts(this.ldParam,false,this.setOpts);
		}
	},
	/**
 	* 刷新数据
 	* */
	refrash:function(){
		this.loadOpts(this.ldParam,true,this.setOpts);
	},
	getLoadingOpt:function(){
		var o=this.owner.getPro('ldOpt');
		if(o)o.ldOpt=true;
		else o=this.ldOpt;
		return o;
	},
	loadOpts:function(param,isRef,f){
		if(this.loading==true)return;
		this.setOpts(null);
		this.loading=true;
		var srv=$.takApp.getSrv(this.ldSvn);
		if(srv){
			this.owner.doEv("beginLoadOpts");
			srv.doAct(this.ldSfn,{param:param,isRef:isRef},function(isc,data,code,msg){
				this.loading=false;
				if(this.owner&&!this.owner.disposed){
					if(isc){
						f.call(this,data);
						this.owner.doEv("optsLoaded",data);
					}else this.owner.doEv("optsLoaderr",data);
				}
			},this);
		}else{
			this.loading=false;
			this.alertError('错误',"无法获取服务对象 服务名称:"+this.ldSvn);
		}
	},
	getOpts:function(){
		return this.opts;
	},
	setOpts:function(os){
		if(!this.loading){
			if(!os)os=this.getLoadingOpt();
			this.opts=os;
			this.onOptChange(os);
		}
	},
	onOptChange:function(os){
		this.doEv('optsChange',os);
	},
	getVal:function(txt){
		return txt;
	},
	getTxt:function(val){
		return val;
	}
});


function FuncCvt(){
}
defCls(FuncCvt,takCvt,{
	initVar:function(opt){
		takCvt.prototype.initVar.call(this,opt);
		this.tfn='getTxt';
		this.vfn='getVal';
		if(tak.hStr(opt.txtFun))this.tfn=opt.txtFun;
		if(tak.hStr(opt.valFun))this.vfn=opt.valFun;
	},
	getVal:function(txt){
		var f= this.owner.getFunc(this.vfn);
		if(f)f.call(this.owner,txt,this.opts);
		else return txt;
	},
	getTxt:function(val){
		var f= this.owner.getFunc(this.tfn);
		if(f)f.call(this.owner,val,this.opts);
		else return val;
	}
});


function SvCvt(){
}
defCls(SvCvt,takCvt,{
	initVar:function(opt){
		takCvt.prototype.initVar.call(this,opt);
		this.sn='converter';
		this.tfn='getTxt';
		this.vfn='getVal';
		if(tak.hStr(opt.txtFun))this.tfn=opt.txtFun;
		if(tak.hStr(opt.valFun))this.vfn=opt.valFun;
	},
	getVal:function(txt){
		var srv=$.takApp.getSrv(this.sn);
		if(srv&&tak.iFun(srv[this.vfn]))return srv[this.vfn].call(srv,txt,this.opts);
		else return txt;
	},
	getTxt:function(val){
		var srv=$.takApp.getSrv(this.sn);
		if(srv&&tak.iFun(srv[this.tfn]))return srv[this.tfn].call(srv,txt,this.opts);
		else return val;
	}
});

function ListCvt(){
}
defCls(ListCvt,takCvt,{
	initVar:function(opt){
		takCvt.prototype.initVar.call(this,opt);
		this.valPn='val';
		this.txtPn='txt';
		if(tak.hStr(opt.valPn))this.valPn=opt.valPn;
		if(tak.hStr(opt.txtPn))this.txtPn=opt.txtPn;
	},
	getLoadingOpt:function(){
		var o=takCvt.prototype.getLoadingOpt.call(this);
		if(!isNull(o)&&!tak.iAry(o))o=[o];
		return o;
	},
	setOpts:function(os){
		if(os&&!tak.iAry(os))os=[os];
		if(tak.iAry(os)){
			var o,nos=[],t;
			for(var i=0;i<os.length;i++){
				o=os[i];
				if(tak.hStr(o)){
					var t={};
					t[this.valPn]=o;
					t[this.txtPn]=o;
					nos.push(t);
				}else if(tak.iObj(o)) nos.push(o);
			}
			os=nos;
		}
		takCvt.prototype.setOpts.call(this,os);
	},
	getVal:function(txt){
		var opt=this.getOpt(this.opts,txt,this.txtPn);
		if(opt)return opt[this.valPn];
		else return txt;
	},
	getTxt:function(val){
		var opt=this.getOpt(this.opts,val,this.valPn);
		if(opt)return opt[this.txtPn];
		else return val;
	},
	getOpt:function(os,v,pn){
		if(!tak.hStr(pn))pn=this.valPn;
		if(tak.iAry(os)){
			var o,dt;
			for(var i=0;i<os.length;i++){
				o=os[i];
				if(tak.iObj(o)){
					if(o[pn]==v)return o;
					else if(o.ldOpt)dt=o;
				}
			}
			return dt;
		}
	}
});


function treeCvt(){
}
defCls(treeCvt,ListCvt,{
	initVar:function(opt){
		ListCvt.prototype.initVar.call(this,opt);
		this.items=[];
		this.subPn='subs';
		if(tak.hStr(opt.subPn))this.subPn=opt.subPn;
		if(opt.lazyLoad=='1')this.lazyLoad=true;
		this.lazyLoad=false;
	},
	setItem:function(vs){
		if(tak.iAry(vs)){
			if(this.itemss){
				for(var i=0;i<this.items.length;i++){
					this.items[i].unBindEv(null,null,this);
				}
			}
			this.items=vs;
			for(var i=0;i<vs.length;i++){
				this.bindVEv(vs[i]);	
			}
			if(vs.length>0)this.pnItem(vs[0]);
		}
		else if(tak.ckTN(vs,takView)){
			this.items.push(vs);
			this.bindVEv(vs);
			this.pnItem(vs);
		}
	},
	bindVEv:function(v){
		//绑定后会触发 hValChange 事件持续重置下级控件
		v.bindEv('hValChange',function(s,val){
			var j=this.items.indexOf(s);
			if(j>=0&&j<this.items.length-1)this.setItOpts(s,val,this.items[j+1]);//重置下级选项列表
		},this);
	},
	pnItem:function(v){
		var p,pv,i=this.items.indexOf(v);
		if(i>0){
			p=this.items[i-1];
			pv=p.getHVal();
		}
		this.setItOpts(p,pv,v);
	},
	subTmp:function(){
		return {valPn:this.valPn,txtPn:this.txtPn};
	},
	onOptChange:function(os){
		if(this.items.length>0)this.setItOpts(null,null,this.items[0]);
		ListCvt.prototype.onOptChange.call(this,os);
	},
	/**
	 * 设置控件选项列表
	 * @param {takView} p 上级控件
	 * @param {Object} pv 上级控件当前值
	 * @param {takView} v 要设置选项的控件
	 * */
	setItOpts:function(p,pv,v){
		var tmp=this.subTmp();
		if(!p)v.setCvtOpts(this.opts,tmp);
		else if(pv){
			var opt=this.getOpt(p.getCvtOpts(),pv,this.valPn);
			if(this.lazyLoad){
				v.setCvtOpts(this.getLoadingOpt(),tmp);//置空
				var lf=function(d){v.setCvtOpts(os,tmp);};//加载完成后设置新值
				var f=this.owner.getFunc('treeCvtSubParam'),t=this;
				if(f)f.call(this.owner,this,opt,lf);
				else this.loadOpts(opt,false,lf);
			}else if(opt) v.setCvtOpts(opt[this.subPn],tmp);
		}else v.setCvtOpts(this.getLoadingOpt(),tmp);
	},
	
	setVal:function(v){
		if(!this.lazyLoad){
			var vpn=this.valPn;
			var items=this.items;
			this.findOpt(0,this.opts,
			function(o){
				return o[vpn]==v;
			},
			function(i,o){
				items[i].setVal(o[vpn]);
			});
		}
	},
	findOpt:function(i,os,c,f,u){
		if(tak.iAry(os)&&this.items.length>i){
			var o,to;
			for(var j=0;j<os.length;j++){
				o=os[j];
				if(c(o)){
					if(u)u()
					f(i,o);
					return o;
				}
				else if(this.findOpt(i+1,o[this.subPn],c,f,function(){
					if(u)u()
					f(i,o);
				}))return o;
			}
		}
	}
});;
///<jscompress sourcefile="service.js" />

/**
 * 服务管理中心
 * */
function takSrvMag(){
	this.srvs=new Map();//服务集合
}
defCls(takSrvMag,{
	/**
 	* @method 添加服务配置
 	* @param {Object}s 服务类型名称（构造函数名称）
 	* */
	addSrv:function(sN,s){
		if(this.srvs.get(sN))throw new Error("服务"+sN+"已存在，请勿重复注册。");
		var sp=new takSrv(sN,s);
		this.srvs.set(sN,sp);
	},
	/**
 	* @method 获取服务
 	* @param{String}sN 服务名称
 	* */
	getSrvBySN:function(sN){
		return this.srvs.get(sN);
	}
});

/**
 * 服务描述对象
 * 管理服务的新增，修改，读取，查询和删除方法等配置。
 * */
function takSrv(name,srv){
	this.name=name;
	this.srv=srv;
}
defCls(takSrv,{
	getObj:function(){
		if(tak.iFun(this.srv))this.srv=new this.srv();
		return this.srv;
	},
	/**
 	* @method 执行服务方法
 	* @param{String}act 访问接口名称
 	* @param{Array}args 请求参数
 	* */
	doAct:function(act,data,cb,on,tk){
		try{
			if(tak.iFun(this.srv))this.srv=new this.srv();
			if(tak.iFun(this.srv[act],"Function"))this.srv[act].call(this.srv,data,function(isOk,resp,code,msg){
				cb.call(on,isOk,resp,code,msg,tk);
			});
			else cb.call(on,false,null,null,"服务["+this.name+"]中不存在方法："+act,tk);
		}catch(err){
			tak.logErr('服务['+this.name+']执行['+act+']失败',err);
			cb.call(on,false,null,null,'服务['+this.name+']执行['+act+']时出错',tk);
		}
		
	}
});




function takMLoad(){
}
defCls(takMLoad,takTmpObj,{
	onInit:function(opt){
		takTmpObj.prototype.onInit.call(this,opt);
		if(tak.hStr(opt.sn))this.sn=opt.sn;
		if(tak.hStr(opt.fn))this.fn=opt.fn;
		if(tak.hStr(opt.lpf))this.lpf=opt.lpf;
		return this;
	},
	setParam:function(param,on){
		if(tak.hStr(this.lpf))this.param=this.owner.getLoadParam(this.lpf,param);
		else this.param=param;
		if(on)this.on=on;
	},
	/**
	 * 设置请求参数
	 * */
	doOwnerEv:function(eName,arges){
		if(this.owner&&this.owner.disposed!=true)this.owner.doEv(eName,arges);
	},
	load:function(param,on){
		this.setParam(param,on);
		this.req(false);
	},
	/**
 	* 刷新数据
 	* */
	refrash:function(){
		this.req(true);
	},
	/**
	* 生成请求参数
	* */
	genData:function(isRef){
		return {param:this.param,isRef:isRef};
	},
	req:function(isRef){
		if(this.loading==true)return;
		this.loading=true;
		var srv=$.takApp.getSrv(this.sn);
		if(!srv)throw new Error("无法获取服务对象 服务名称:"+this.sn);
		var on=this.on;
		this.doOwnerEv("beginLoadData",{lder:this,on:on});
		srv.doAct(this.fn,this.genData(isRef),function(isc,data,code,msg,v){
			this.loading=false;
			this.reqCom(isc,data,code,msg,v);
			this.doOwnerEv("endLoadData",{lder:this,isc:isc,data:data,code:code,msg:msg});
		},this,on);
	},
	/**
 	* 加载完成处理函数
 	* */
	reqCom:function(isc,data,code,msg,on){
		if(isc){
			try{
				if(tak.iFun(on))on(data)
				else if(tak.ckTN(on,takRendObj))on.val(data);
			}catch(err){
				this.alertError('处理','数据处理出错',err);
			}
			this.doOwnerEv("dataLoaded",{lder:this,val:data});
		}
		else this.doOwnerEv("dataloadErr",{lder:this,code:code,msg:msg});
	}
});

function takCommiter(){
}
defCls(takCommiter,takMoObj,{
	/**
	 * 设置请求参数
	 * */
	doOwnerEv:function(eName,arges){
		if(this.owner&&this.owner.disposed!=true)this.owner.doEv(eName,arges);
	},
	commit:function(data,sn,an,cb,on){
		var sArg={an:an,data:data};
		if(this.doing==true)return;
		var srv=$.takApp.getSrv(sn);
		if(!srv){
			this.alertError('请求',"无法获取服务对象 服务名称:"+sn);
			return;
		}
		this.doing=true;
		var lv=this.owner;
		if(lv)lv=lv.loading('正在提交请求...',true);
		this.doOwnerEv("beginCommit");
		srv.doAct(an,data,function(isOk,sData,code,msg,tk){
			this.doing=false;
			sArg.sa=sData;
			sArg.code=code;
			sArg.msg=msg;
			var en;
			if(isOk)en='commited';
			else en='commitErr';
			this.doOwnerEv(en,sArg);
			this.doOwnerEv("endCommit");
			if(lv)lv.hideLoading();
			if(isOk&&tak.iFun(cb))cb.call(on,tk,sData);
		},this,data);
	}
})
;
///<jscompress sourcefile="valid.js" />

//包装器
function takValider(){
}
defCls(takValider,{
	init:function(owner,opt){
		this.owner=owner;
		if(tak.hStr(opt)) this.opt={dType:opt};
		else this.opt=opt;
		if(!tak.iObj(this.opt))return;
		this.ec='tak-error';
		if(opt.errCls)this.ec=opt.errCls;
		return this;
	},
	valid:function(){
		var v=this.owner.getHVal();
		if(!this.opt)return {s: true,v: v};
		var cfn,cfv;
		if(tak.hStr(this.opt.cpTo)){
			var cv=this.owner.owner.getChild(this.opt.cpTo);
			if(cv){
				cfn=cv.getName();
				cfv=cv.getHVal();
			}
		}
		var r=takValidF(v,this.opt,this.owner.getName(),cfn,cfv);
		if(this.owner.baseJqo&&tak.hStr(this.ec)){
			if(r.s!=true)this.owner.baseJqo.addClass(this.ec);
			else this.owner.baseJqo.removeClass(this.ec);
		}
		return r;
	}
})
/**
 * 数据校验和数据转换，如果是数值类型，会自动转换。
 * @param {String}v 待校验的值
 * @param {Object}opt 如果直接传字符串则作为dType使用  
 * 					    属性：dType数据类型(takValidF.prototype中的方法名) 
 * 							req 字符串1表示必填
 * 							reg 自定义正则表达式校验
 * 							minL 最小长度
 * 							maxL 最大长度
 * 							minV 最小值
 * 							maxV 最大值
 *	 						minC 最小条数 数组有效
 * 							maxC 最大条数 数组有效
 * 							suf  后缀
 * 							pre  前缀
 * 							cpType 与别的控件值进行比较的比较方式，cpTo有值时有效 -2 小于 -1 小于等于 0等于  1 大于等于 2大于 默认取0
 * 							cpTo 与其他控件比较的控件id（必须是同一个父控件，注意是父控件不是同一个容器）
 * @param {String}fn 当前字段名称
 * @param {String}ct 字段比较方式   配置中的cpType
 * @param {String}efn 比较的字段名称   配置中的cpTo
 * @param {Object}efv 比较的字段的值
 * @return {Object} 属性：s boolean是否检查通过，m String错误消息 v转换过后的值
 * */
function takValidF(v, opt, fn, cfn,cfv) {
	if(v == undefined) v = null;
	var vf,ct=opt.cpType, r = {
		s: true,
		v: v
	};
	if(tak.hStr(opt.dType))vf=takValidF.prototype[opt.dType];
	if(tak.hStr(v)&&tak.iFun(vf)){
		r=vf(r);
		if(!r.s){
			if(r.m.indexOf("为")==0)r.m=fn+r.m;
			else r.m=fn+":请填写正确的"+r.m;
			return r;
		}
	}
	var msg="";
	if(opt.req == "1"){
		msg="必填";
		r.s=(!isNull(v)&&!tak.eStr(v)&&!tak.eAry(v));
	}
	if(tak.hStr(cfn)){
		if(ct=='-2'&&cfv>=v){
			r.s=false;
			msg=tak.strJoin(msg,"必须小于"+cfn,",且");
		}else if(ct=='-1'&&cfv>v){
			r.s=false;
			msg=tak.strJoin(msg,"必须小于等于"+cfn,",且");
		}else if(ct=='2'&&cfv<=v){
			r.s=false;
			msg=tak.strJoin(msg,"必须大于"+cfn,",且");
		}else if(ct=='1'&&cfv<v){
			r.s=false;
			msg=tak.strJoin(msg,"必须大于等于"+cfn,",且");
		}else if(cfv!=v){
			r.s=false;
			msg=tak.strJoin(msg,"必须等于"+cfn,",且");
		}
	}
	if(tak.hStr(opt.pre)){
		msg=tak.strJoin(msg,"以"+opt.pre+"开头","且");
		if(r.s&&tak.hStr(v))r.s=(v>=opt.minV);
	}
	if(tak.hStr(opt.suf)){
		msg=tak.strJoin(msg,"以"+opt.suf+"结尾","且");
		if(r.s&&tak.hStr(v))r.s=(v<=opt.maxV);
	}
	
	if(tak.hStr(opt.minL)&&tak.hStr(opt.maxL)){
		var il=parseInt(opt.minL, 10);
		var al=parseInt(opt.maxL, 10);
		if(il==al)msg=tak.strJoin(msg,"长度为"+il,"且");
		else msg=tak.strJoin(msg,"长度为"+il+"到"+al+"之间",",且");
		if(r.s&&tak.hStr(v))r.s=(v.length>=il&&v.length<=al);
	}else if(tak.hStr(opt.minL)){
		var il=parseInt(opt.minL, 10);
		msg=tak.strJoin(msg,"长度不能小于"+il,",且");
		if(r.s&&tak.hStr(v))r.s=(v.length>=il);
	}else if(tak.hStr(opt.maxL)){
		var al=parseInt(opt.maxL, 10);
		msg=tak.strJoin(msg,"长度不能大于"+al,",且");
		if(r.s&&tak.hStr(v))r.s=(v.length<=al);
	}
	
	if(tak.hStr(opt.minV)&&tak.hStr(opt.maxV)){
		msg=tak.strJoin(msg, opt.minV+"到"+opt.maxV+"之间",",且");
		if(r.s&&tak.hStr(v))r.s=(v>=opt.minV&&v<=opt.maxV);
	}else if(tak.hStr(opt.minV)){
		msg=tak.strJoin(msg,"不能小于"+opt.minV,",且");
		if(r.s&&tak.hStr(v))r.s=(v>=opt.minV);
	}else if(tak.hStr(opt.maxV)){
		msg=tak.strJoin(msg,"不能大于"+opt.maxV,",且");
		if(r.s&&tak.hStr(v))r.s=(v<=opt.maxV);
	}
	
	if(tak.hStr(opt.minC)&&tak.hStr(opt.maxC)){
		var ic=parseInt(opt.minC, 10);
		var ac=parseInt(opt.maxC, 10);
		if(ic==ac)msg=tak.strJoin(msg,"必须为"+ic+'条',"且");
		else msg=tak.strJoin(msg,"最少"+ic+"条,最多"+ac+"条",",且");
		if(r.s&&tak.iAry(v))r.s=(v.length>=ic&&v.length<=ac);
	}else if(tak.hStr(opt.minC)){
		var ic=parseInt(opt.minC, 10);
		msg=tak.strJoin(msg,"最少"+ic+'条',",且");
		if(r.s&&tak.iAry(v))r.s=(v.length>=ic);
	}else if(tak.hStr(opt.maxC)){
		var ac=parseInt(opt.maxC, 10);
		msg=tak.strJoin(msg,"最多"+ac+'条',",且");
		if(r.s&&tak.iAry(v))r.s=(v.length<=ac);
	}
	
	if(r.s==false){
		if(tak.hStr(opt.msg))r.m=opt.msg;
		else r.m=fn+':'+msg;
	}
	return r;
}

takValidF.prototype = {
	require: function(r) {
		r.m="必填";
		r.s = (!isNull(r.v)&&!tak.eStr(r.v)&&!tak.eAry(r.v));
		return r;
	},
	chars: function(r) {
		r.m="(字母,数字或特殊字符:_!@#$%^&*[]|.\\/)";
		r.s = (/^[\da-zA-Z_!@#$%^&*\[\]|\.\\/:]*$/).test(r.v);
		return r;
	},
	int: function(r) {
		r.m="整数";
		r.s = (/^-?[0-9]+$/).test(r.v);
		r.v = parseInt(r.v);
		return r;
	},
	uInt: function(r) {
		r.m="正整数";
		r.s = (/^-?[0-9]+$/).test(r.v);
		r.v = parseInt(r.v);
		return r;
	},
	nInt: function(r) {
		r.m="负整数";
		r.s = (/^-[0-9]+$/).test(r.v);
		r.v = parseInt(r.v);
		return r;
	},
	number: function(r) {
		r.m="数字";
		r.s = (/^-?[0-9]+(\.\d+)?$/).test(r.v);
		r.v = parseFloat(r.v);
		return r;
	},
	uNumber: function(r) {
		r.m="正数";
		r.s = (/^[0-9]+(\.\d+)?$/).test(r.v);
		r.v = parseFloat(r.v);
		return r;
	},
	nNumber: function(r) {
		r.m="负数";
		r.s = (/^-?[0-9]+(\.\d+)?$/).test(r.v);
		r.v = parseFloat(r.v);
		return r;
	},
	phone: function(r) {
		r.m="电话号码(座机号(区号用-隔开)，1开头的11位手机号或400开头的10位客服号)";
		r.s = (/(^(\d{3,4}-)?\d{7,8})|(1\d{10})|(400\d{7})$/).test(r.v);
		return r;
	},
	mobile: function(r) {
		r.m="手机号(1开头的11位数字)";
		r.s = (/^1\d{10}$/).test(v);
		return r;
	},
	email: function(r) {
		r.m="邮箱地址";
		r.s = (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).test(r.v);
		return r;
	},
	date: function(r) {
		r.m="日期(年-月-日)";
		r.s = (/^[0-2]?\d{3}-((0?[1-9])|(1[0-2]))-((0?[1-9])|((1|2)[0-9])|30|31)$/).test(r.v);
		return r;
	},
	time: function(r) {
		r.m="时间(时:分:秒)";
		r.s = (/^(([0-1]?[0-9])|(2[0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/).test(r.v);
		return r;
	},
	dateTime: function(r) {
		r.m="日期时间(年-月-日 时:分:秒)";
		r.s = (/^[0-2]?\d{3}-((0?[1-9])|(1[0-2]))-((0?[1-9])|((1|2)[0-9])|30|31)\s(([0-1]?[0-9])|(2[0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/).test(r.v);
		return r;
	},
	//只校验银行卡号
	bankCard: function(r) {
		r.m="银行卡号";
		var v = r.v;
		if(!(/^[0-9]*$/).test(v)){
			r.s = false;
			return r;
		}
		var k, c = 0,
			l = v.length - 1;
		var c = 0;
		for(var i = 0; i < l; i++) {
			k = parseInt(v.substr(i, 1));
			if(i % 2 == 0) { //偶数位处理  
				k *= 2;
				k = k / 10 + k % 10;
			}
			c += k;
		}
		c = c % 10;
		if(c == 0) r.s = (v.substr(l, 1) == '0');
		elser.s = (v.substr(l, 1) == (10 - c).toString());
		return r;
	},
	//银行账号，包括存折等
	bankAccount: function(r) {
		r.m="银行账号";
		var v = r.v;
		var l = v.length;
		if(l < 8) r.s = false;
		else if(!(/^[0-9]*$/).test(v)) r.s = false;
		else if(l < 15){
			//存折之类的老号码
			r.s = true;
			return r; 
		}
		return takValidF.prototype.bankCard(r);
	},
	//身份证号 18位
	zhIDCard18: function(r) {
		r.m="身份证号";
		var v = r.v;
		if(v.length != 18){
			r.s = false;
			return r;
		}
		if(!(/^[0-9]*$/).test(v.substr(0, 17))){
			r.s = false;
			return r;
		}
		var yz = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
		var mc = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
		var c = 0;
		for(var i = 0; i < 17; i++) {
			c += parseInt(v.substr(i, 1)) * yz[i];
		}
		r.s = (v.substr(17, 1) == mc[c % 11]);
		return r;
	},
	//身份证号 15位只校验全数字，18位验证校验码
	zhIDCard: function(r) {
		r.m="身份证号";
		var v = r.v;
		if(v.length == 15){
			r.s = (/^[0-9]*$/).test(v);
			return r;
		}
		else return takValidF.prototype.zhIDCard18(r);
	}
};
///<jscompress sourcefile="bind.js" />

/**
 * 容器控件对象绑定扩展
 * */
function takBindM(o){
	this.owner=o;
	if(o)this.val=o.val();
}
defCls(takBindM,{
	getVal:function(v){
		if(this.bds){
			if(!tak.iObj(v))v={};
			for(var i=0;i<this.bds.length;i++){
				v=this.bds[i].getData(v);
			}
		}
		return v;
	},
	setVal:function(v){
		this.val=v;
		this.setData(v);
	},
	addObj:function(pn,obj){
		if(!obj)return;
		var binder=new takBindp(obj,pn);
		if(!this.bds)this.bds=[];
		this.bds.push(binder);
		var v=this.val;
		if(v)binder.setData(v);
	},
	remove:function(obj){
		if(this.bds){
			var index;
			for(var i=0;i<this.bds.length;i++){
				if(this.bds[i].owner==obj){
					this.bds.splice(i,1);
					i--;
				}
			}
		}
	},
	setData:function(v){
		if(this.bds){
			for(var i=0;i<this.bds.length;i++){
				this.bds[i].setData(v);
			}
		}
	}
})

function takBindp(o,pn){
	this.owner=o;
	this.pn=pn;
}
defCls(takBindp,{
	setData:function(val){
		if(this.owner.bindOn()){
			var v=this.getVal(val,this.pn);
			this.owner.reVal(v);
		}
	},
	getData:function(val){
		if(this.owner.bindOn()&&tak.hStr(this.pn)){
			var v=this.owner.getVal();
			if(!isNull(v)){
				val=this.setVal(val,v,this.pn);
			}
		}
		return val;
	},
	getVal:function(val,pn){
		if(!tak.hStr(pn))return null;
		var idl=tak.splStrDot(pn);
		var id,o=val;
		var i=0;
		if(idl[0]=='this')i=1;
		for(;i<idl.length;i++){
			id=idl[i];
			if(id.length==0)continue;
			if(!tak.iObj(o))return;
			o=o[id];
			if(!o)return;
		}
		return o; 
	},
	setVal:function(val,v,pn){
		if(!tak.hStr(pn))return null;
		if(pn=='this')return v;
		var idl=tak.splStrDot(pn);
		if(!tak.iObj(val))val={};
		var id,o=val;
		var i=0;
		if(idl[0]=='this')i=1;
		for(;i<idl.length-1;i++){
			id=idl[i];
			if(!tak.iObj(o))o[id]={};
			o=o[id];
		}
		o[idl[i]]=v;
		return val; 
	}
})
;
///<jscompress sourcefile="rend.js" />

/**
 * 模板对象基类
 * */
function takRendObj(){
}
defCls(takRendObj,takColObj,{
	onCrtPro:function(opt){
		takColObj.prototype.onCrtPro.call(this,opt);
		tak.genPro(this,"parent",null,this.paChange);
		tak.genPro(this, "visible", opt.visible=="0"?false:true, this.visibleChange);
		tak.genPro(this,"enable",opt.enable=='0'?false:true,this.enableChange);
		this.ldReqCount=0;
		this.loadingOn=false;
		this.rended=false;
		this.baseV=null;
		this.valBindOn=true;
	},
	showPage:function(opt){
		$.takApp.showPage(opt,this);
	},
	bindOn:function(v){
		if(tak.iBool(v))this.valBindOn=v;
		return this.valBindOn;
	},
	onInit:function(opt){
		takColObj.prototype.onInit.call(this,opt);
		if(tak.hStr(opt.bind))this.setBind(opt.bind);//数据绑定配置
		if(opt.loadingOn)this.loadingOn=(opt.loadingOn=="0"?false:true);
		if(!isNull(opt.val))this.__val__=opt.val;
		if(opt.cvt)this.setDCvt(this.newObj(tak.unTmp(this.defCvtTmp(),opt.cvt)))//值转化配置
		this.opt=opt;
	},
	setDCvt:function(cvt){
		this.dCvt=cvt;
		var os;
		if(this.dCvt){
			os=this.dCvt.getOpts();
			this.dCvt.bindEv('optsChange',function(s,os){
				this.onCvtOptsChange(os)
				},this);
		}
		this.onCvtOptsChange(os);
	},
	onCvtOptsChange:function(opts){
		this.setVal(this.__val__);
	},
	loadTmp:function(){
		if(this.opt){
			var opt=this.opt;
			delete this.opt;
			this.onLoad(opt);
			this.doEv("loaded");
		}
	},
	onLoad:function(opt){
		
	},
	defCvtTmp:function(){
		return {type:'ListCvt'};
	},
	//添加绑定
	setBind:function(bid){
		if(tak.ckTN(this.owner,takRendObj)){
			this.owner.rmBind(this);
			if(tak.hStr(bid))this.owner.addBind(this,bid);
		}
	},
	/**
	 * 可用状态改变处理方法
	 * */
	enableChange:function(ov,nv){
		var ok=tak.iBool(nv)
		if(ok!=false){
			this.aplEnable(this.getRealEnable());
			this.doEv("enableChanged",nv);
		}
		return ok;
	},
	//添加绑定控件
	addBind:function(v,pn){
		if(!this.bindm)this.bindm=new takBindM(this);
		this.bindm.addObj(pn,v);
	},
	//移除绑定控件
	rmBind:function(v){
		if(this.bindm)this.bindm.remove(v);
	},
	visibleChange:function(ov,nv){
		var ok=tak.iBool(nv)
		if(ok!=false){
			this.onVisibleChange(nv);
			this.doEv("visibleChanged",nv);
		}
		return ok;
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
 	* 父级对象改变处理方法
 	* @param {Any}ov 旧值
 	* @param {Any}nv 新值
 	* @return {Boolean} 返回false表示取消赋值
 	* */
	paChange:function(ov,nv){
		var ok=this.parentWillchange(ov,nv);
		if(ok!=false){
			if(tak.ckTN(ov,takColObj))ov.removeSub(this);
			if(this.disposed!=true){
				this.onParentChanged(nv);
				this.doEv("parentChanged",nv);
			}
		}
		return ok;
	},
	/**
 	* 父级对象即将改变
 	* @param {Any}ov 旧值
 	* @param {Any}nv 新值
 	* @return {Boolean} 返回false表示取消赋值
 	* */
	parentWillchange:function(ov,nv){return isNull(nv)||tak.ckTN(nv,takRendObj);},
	/**
 	* 显示已改变处理方法
 	* */
	onVisibleChange:function(nv){},
	/**
 	* 父级对象已经改变
 	* @param {Any}ov 旧值
 	* @param {Any}nv 新值
 	* */
	onParentChanged:function(nv){},
	/**
 	* 显示加载页
 	* */
	loading: function(msg,isCmt) {
		if(this.loadingOn){
			this.ldReqCount++;
			if(this.baseV&&this.baseV.rended){
				if(this.ldReqCount>1){
					this.enable=false;
					$.takApp.showMsg(this.baseV.baseJqo,msg);
				}
				else $.takApp.loading(this.baseV.baseJqo,msg,isCmt);
			}
			return this;
		}
	},
	showMsg:function(msg) {
		if(this.rended&&this.ldReqCount>0)$.takApp.showMsg(this.baseV.baseJqo,msg);
	},
	/**
 	* 关闭加载页
 	* */
	hideLoading: function(){
		if(this.ldReqCount>0){
			this.ldReqCount--;
			if(this.rended&&this.ldReqCount==0){
				this.enable=true;
				$.takApp.loaded(this.baseV.baseJqo);
			}
		}
		
	},
	/**
 	* 渲染视图
 	* @param {jQuery} 视图渲染容器
 	* */
	rend: function(to){
		if(this.doRend(to)){
			this.loadTmp();
			this.onRended();
		}
	},
	doRend:function(to){
		return false;
	},
	append:function(jqo){
		
	},
	onRended:function(){
		this.rendSubs();
		this.rendVal();
		this.aplEnable(this.getRealEnable());
		this.doEv("rended");
	},
	rendVal:function(){
		if(isNull(this.__val__))this.__val__=this.getPro('dVal');
		if(this.__val__){
			this.reVal();
			return true;
		}else return false;
	},
	rendSubs:function(){
		tak.eachAry(this,this.subs,function(s){
			this.rendSub(s);
		});
	},
	onRmSubed:function(o){
		takColObj.prototype.onRmSubed.call(this,o);
		o.remove();
	},
	onAdSubed:function(o){
		takColObj.prototype.onAdSubed.call(this,o);
		if(this.rended)this.rendSub(o);
	},
	rendSub:function(v){
		
	},
	//可用状态改变，
	aplEnable: function(nv){
		this.eachSub(function(v){
			v.aplEnable(nv);
		});
	},
	getRealEnable:function(){
		if(!this.enable)return this.enable;
		if(this.parent)return this.enable&&this.parent.getRealEnable();
		else return this.enable;
	},
	/**
	 * 读取或设置控件值
	 * */
	val:function(v){
		if(arguments.length==1){
			if(this.__val__!=v){
				this.reVal(v);
				this.doEv('valChanged',v);
			}
		}
		else return this.__val__;
	},
	/**
	 * 强制刷新页面显示(对象值更新或重置输入内容时使用)
	 * */
	reVal:function(v){
		if(arguments.length==1)this.__val__=v;
		if(this.rended)this.setVal(this.__val__);
	},
	getVal:function(){
		if(this.bindm){
			var v=this.getHVal();
			if(isNull(v))v=this.__val__;
			return this.bindm.getVal(v);
		}
		return this.getHVal();
	},
	setVal:function(v){
		if(this.bindm)this.bindm.setVal(v);
		this.setHVal(v);
		this.doHValChange();
	},
	getHVal:function(){
		return this.__val__;
	},
	setHVal:function(v){
		
	},
	doHValChange:function(){
		this.doEv('hValChange',this.getHVal());
	},
	/**
 	* 移除可见对象
 	* */
	remove: function(){
		if(this.rended){
			this.rended = false;
			this.parent=null;
			if(this.disposed!=true){
				this.onRemove();
				this.doEv('removed');
			}
		}
	},
	onRemove:function(){
	},
	/**
 	* 释放资源
 	* */
	dispose:function(){
		this.remove();
		this.setBind(null);
		takColObj.prototype.dispose.call(this);
	}
});
///<jscompress sourcefile="html.js" />

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
	
});
///<jscompress sourcefile="view.js" />

/**
 * 视图控件
 * */
function takView(){
	
}
defCls(takView,HtmlV,{
	onInit:function(opt){
		HtmlV.prototype.onInit.call(this,opt);
		if(opt.vPkgs)this.vPkgs=this.initVPkgs(opt.vPkgs);
		if(opt.valid)this.setValidTmp(opt.valid);//控件验证配置
	},
	/**
	 * 解析配置模板
	 * 该方法在将基础html元素添加到dom以后执行，避免绑定一些jq操作在添加元素之前不生效的问题
 	* */
	onLoad:function(opt){
		HtmlV.prototype.onLoad.call(this,opt);
		if(tak.iObj(opt.views))this.addTObjs(opt.views);
	},
	
	/**
	 * 读取或设置控件代理对象，list，table，stree等复杂控件使用
	 * */
	viewDlg:function(dlg){
		if(tak.ckTN(dlg,takCtrl)&&this.delegate!=dlg){
			this.willDlgChanged();
			this.delegate=dlg;
			this.onDlgChanged();
		}
		return this.delegate;
	},
	//执行代理方法
	doDlgFun:function(fn,args){
		var dlg=this.delegate;
		if(!tak.iAry(args))args=[args];
		var f;
		if(tak.ckTN(this.delegate,takTmpObj))f=dlg.getFunc(fn);
		if(!f&&this.defDlg){f=this.defDlg[fn];dlg=this;}
		if(f)return f.apply(dlg,args);
	},
	willDlgChanged:function(){
		
	},
	onDlgChanged:function(){
	},
	initVPkgs:function(opt){
		var ps=[];
		tak.eachAry(this,opt,function(p){
			ps.push(this.newObj(tak.defTmp(p,'tmps'),{type:'takPkger'}))
		});
		return ps;
	},
	getCvtOpts:function(){
		if(this.dCvt)return this.dCvt.getOpts();
	},
	setCvtOpts:function(opts,tmp){
		if(!this.dCvt){
			if(tmp)tmp.opts=opts;
			else tmp={opts:opts};
			this.setDCvt(this.newObj(this.defCvtTmp(),tmp));
		}
		else this.dCvt.setOpts(opts);
	},
	objPkg:function(o){
		if(this.vPkgs){
			for(var i=0;i<this.vPkgs.length;i++){
				o=this.vPkgs[i].pkgObj(o);
				if(!o)return;
			}
		}
		return o;
	},
	setValidTmp:function(opt){
		this.valider=new takValider().init(this,opt);
	},
	/**
 	* 读取html中控件的值
 	* */
	getJQVal:function(jId){
		var txt=HtmlV.prototype.getJQVal.call(this,jId);
		if(this.dCvt)
		return this.dCvt.getVal(txt);
		else return txt;
	},
	/**
 	* 设置html中控件的值
 	* */
	setJQVal:function(v,jId){
		if(this.dCvt)v=this.dCvt.getTxt(v);
		HtmlV.prototype.setJQVal.call(this,v,jId);
	},
	onRended:function(){
		HtmlV.prototype.onRended.call(this);
		this.bindJQEvF('change',this.getIptJId(),function(jq){
			this.doHValChange(this.getHVal());
		});
	},
	valid:function(){
		var r;
		if(this.valider)r=this.valider.valid();
		else r={s:true,v:this.getVal()};
		this.eachSub(function(s){
			if(tak.ckTN(s,takView)){
				var nr=s.valid();
				if(nr&&nr.s==false){
					r.s=false;
					if(tak.hStr(nr.m)){
						if(r.m)r.m=r.m+'\n'+nr.m;
						else r.m=nr.m;
					}
				}
			}
			
		},this);
		return r;
	},
	doHValChange:function(){
		HtmlV.prototype.doHValChange.call(this);
		this.valid();//值改变后自动校验
	},
	rendVal:function(){
		if(!HtmlV.prototype.rendVal.call(this)&&this.dCvt)this.reVal();
	},
});;
///<jscompress sourcefile="list.js" />
/**
 * 视图容器控件
 * */
function ListV(){
}
defCls(ListV,takView,{
	defDlg:{
		/**
		 * 删除项，未实现默认释放视图控件
		 * @param {ListV} lv 当前列表控件
		 * @param {TakView} iView 要删除的item显示控件
		 * */
		listVRmItem:function(lv,iv){
			iv.dispose();
		},
		/**
		 * 获取项目数量
		 * @param {ListV} lv 当前列表控件
		 * */
		listVItemCount:function(lv){
			var v=lv.val();
			return tak.iAry(v)?v.length:0;
		},
		/**
		 * 获取项目数量
		 * @param {ListV} lv 当前列表控件
		 * @param {Number} id item的索引
		 * @param {Object} tmp 默认配置的item控件模板
		 * */
		listVNewItem:function(lv,index,tmp){
			var iv=this.addTObj({id:'item_'+index.toString()});
			if(iv){
				var v=lv.val();
				if(tak.iAry(v)&&v.length>index)iv.val(v[index]);
			}
			return iv;
		},
		/**
		 * 创建当前控件值，并初始化（如果需要，也可以直接返回当前控件的val）
		 * @param {ListV} lv 当前列表控件
		 * */
		listVGenVal:function(lv){
			return [];
		},
		/**
		 * 获取项目数量
		 * @param {ListV} lv 当前列表控件
		 * @param {Array} val 当前列表控件要返回的数据
		 * @param {Object} iv item控件
		 * */
		listVItemVal:function(lv,val,iv){
			if(!val)val=[];
			else if(!tak.iAry(val))val=[val];
			val.push(iv.getHVal());
			return val;
		}
	},
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.subDef={type:"SpanV"};
		this.rowId=0;//当前行id 和总行数并不一一对应，如果做了删除操作，rowId会比rowcount大。
		this.items=[];
	},
	onDlgChanged:function(){
		takView.prototype.onDlgChanged.call(this);
		this.reVal();
	},
	willDlgChanged:function(){
		takView.prototype.willDlgChanged.call(this);
		this.clearItems();
	},
	
	genVal:function(){
		return this.doDlgFun('listVGenVal',[this]);
	},
	execItemVal:function(mv,iv){
		return this.doDlgFun('listVItemVal',[this,mv,iv]);
	},
	rmItemView:function(iv){
		this.doDlgFun('listVRmItem',[this,iv]);
	},
	getItemCount:function(){
		return this.doDlgFun('listVItemCount',[this]);
	},
	genItemView:function(index){
		return this.doDlgFun('listVNewItem',[this,index,this.subDef]);
	},
	/**
	 * 读取值
	 * */
	getHVal:function(){
		var item,v=this.genVal();
		for(var i=0;i<this.items.length;i++){
			item=this.items[i];
			v=this.execItemVal(v,item.view);
		}
		return v;
	},
	/**
	 * 通过id读取子项
	 * */
	getItem:function(index){
		var item;
		for(var i=0;i<this.items.length;i++){
			item=this.items[i];
			if(item.id==id)return item;
		}
	},
	/**
	 * 通过id移除项目
	 * */
	removeId:function(index){
		return this.removeItem(this.getItem(index));
	},
	/**
	 * 移除项目
	 * */
	removeItem:function(item){
		if(item){
			this.rmItemView(item.view);
			var i=this.items.indexOf(item);
			if(i>=0){
				this.items.splice(i,1);
				return true;
			}
		}
		return false;
	},
	//清空
	clearItems:function(){
		var item,r;
		for(var i=0;i<this.items.length;i++){
			item=this.items[i];
			if(this.removeItem(this.items[i]))i--;
		}
		this.rowId=0;
	},
	setHVal:function(v){
		this.reSetItems();
	},
	reSetItems:function(){
		this.clearItems();
		var c=this.getItemCount();
		for(var i=0;i<c;i++){
			this.newItem();
		}
	},
	newItem:function(){
		var iv=this.genItemView(this.rowId);
		if(iv){
			this.addSub(iv);
			this.items.push({id:this.rowId,view:iv});
			this.rowId++;
		}
	},
	eachItems:function(f,o){
		if(tak.iFun(f)){
			for(var i=0;i<this.items.length;i++){
				f.call(o,this.items[i]);
			}
		}
	},
});
///<jscompress sourcefile="model.js" />

/**
 * 视图容器控件
 * */
function takMoldel(){
}
defCls(takMoldel,takMoObj,{
	onLoad:function(opt){
		takMoObj.prototype.onLoad.call(this,opt);
		if(tak.iObj(opt.pro))this.pros=this.initPros(opt.pro);
		if(tak.iObj(opt.views))this.views=this.initViews(opt.views);
		if(opt.filter)this.filter=new takFilter(opt.filter,false);
	},
	initPros:function(opt){
		var pros={},p;
		for(var i in opt){
			pros[i]=tak.defTmp(opt[i],'name');
		}
		return pros;
	},
	//解析视图配置
	initViews:function(opt){
		var tmps=[],t,p,mt,f;
		for(var i in opt){
			p=this.pros[i];
			if(p){
				t=tak.defTmp(opt[i],'tmp');
				mt={};
				mt.tmp=tak.defTmp(t.tmp,'type');
				mt.tmp.bind=i;
				mt.tmp.id=i;
				mt.tmp.pro=p;
				if(tak.iObj(t.func)){
					mt.func={};
					for(var j in t.func){
						f=tak.defTmp(t.func,'cmd');
						mt.func[j]=tak.createFun(j,f.args,f.cmd);
					}
				}
				if(tak.hStr(t.onState))mt.onState=[t.onState];
				else if(tak.iAry(t.onState)) mt.onState=t.onState;
				tmps.push(mt);
			}
		}
		return tmps;
	},
	//解析视图配置
	initCells:function(opt){
		var tmps={},t,p;
		for(var i in opt){
			p=this.pros[i];
			if(p){
				t=tak.defTmp(opt[i],'type');
				t.bind=i;
				t.id=i;
				t.pro=p;
				tmps[i]=t;
			}
		}
		return tmps;
	},
	clearViews:function(on){
		if(this.views){
			var v;
			for(var i in this.views){
				v=on.getChild(i);
				if(v)v.dispose();
			}
		}
	},
	//根据模板创建控件
	genViews:function(state){
		if(this.views){
			var ts=[],mt;
			for(var i in this.views){
				mt=this.views[i];
				if(this.checkCon(mt,state))ts.push(mt.tmp);
			}
			if(this.filter)ts=this.filter.getObjs(ts);
			return ts;
		}
	},
	execAct:function(on,act,args){
		if(!on||!this.views)return;
		if(args&&!tak.iAry(args))args=[args];
		var mt,v,f;
		for(var i in this.views){
			mt=this.views[i];
			if(mt.func){
				f=mt.func[act];
				if(f){
					v=on.getChild(i);
					if(v)f.apply(v,args)
				}
			}
		}
	},
	//条件校验
	checkCon:function(mt,state){
		if(!mt.onState)return true;
		return mt.onState.indexOf(state)>=0;
	}
});;
///<jscompress sourcefile="table.js" />
/**
 * 代理方法
 * */
function TableV(){
}
defCls(TableV,ListV,{
	defDlg:{
		/**
		 * 创建表头，如果不显示表头
		 * @param {TableV} tv 当前列表控件
		 * */
		tableVGenHead:function(tv){
			
		},
		/**
		 * 删除行，未实现默认释放视图控件
		 * @param {TableV} tv 当前列表控件
		 * @param {TakView} iv 要删除的行显示控件
		 * */
		tableVRmRow:function(tv,iv){
			iv.dispose();
		},
		/**
		 * 获取行数量
		 * @param {TableV} tv 当前列表控件
		 * */
		tableVRowCount:function(tv){
			var v=tv.val();
			return tak.iAry(v)?v.length:0;
		},
		/**
		 * 获取项目数量
		 * @param {TableV} tv 当前列表控件
		 * @param {Number} index 行的索引
		 * @param {Object} tmp 默认配置的行控件模板
		 * */
		tableVNewRow:function(tv,index,tmp){
			var iv=this.addTObj({id:'item_'+index.toString()});
			if(iv){
				var v=tv.val();
				if(tak.iAry(v)&&v.length>index)iv.val(v[index]);
			}
			return iv;
		},
		/**
		 * 创建当前控件值，并初始化（如果需要，也可以直接返回当前控件的val）
		 * @param {TableV} tv 当前列表控件
		 * */
		tableVGenVal:function(tv){
			return [];
		},
		/**
		 * 获取项目数量
		 * @param {TableV} tv 当前列表控件
		 * @param {Array} val 当前列表控件要返回的数据
		 * @param {Object} rv 当前行控件
		 * */
		tableVRowVal:function(tv,val,rv){
			if(!val)val=[];
			else if(!tak.iAry(val))val=[val];
			val.push(rv.getHVal());
			return val;
		}
	},
	//重写listV的代理调用方法，方便控制器函数区分
	genVal:function(){
		return this.doDlgFun('tableVGenVal',[this]);
	},
	execItemVal:function(mv,iv){
		return this.doDlgFun('tableVRowVal',[this,mv,iv]);
	},
	rmItemView:function(iv){
		this.doDlgFun('tableVRmRow',[this,iv]);
	},
	getItemCount:function(){
		return this.doDlgFun('tableVRowCount',[this]);
	},
	genItemView:function(index){
		return this.doDlgFun('tableVNewRow',[this,index,this.subDef]);
	},
	genHeader:function(){
		this.doDlgFun('tableVGenHead',[this]);
	},
	onCrtPro:function(opt){
		ListV.prototype.onCrtPro.call(this,opt);
		this.subDef={type:"RowV"};
		this.fixHead=false;
	},
	onInit:function(opt){
		ListV.prototype.onInit.call(this,opt);
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		var bv= this.crtJQO(this.tag).append(this.crtTableJQ());
		var mv=this;
		return bv;
	},
	crtTableJQ:function(){
		var table= this.crtJQO('table','table');
		return table;
	},
	//获取容器渲染对象，如果没有定义rMap,则直接渲染到baseJqo
	getJqoCon:function(v){
		var to;
		if(tak.ckTN(v,RowV))to=v.rType;
		var tJq=this.getJQO('table');
		if(!tak.hStr(to))return tJq;
		var jqo=this.getJQO(to);
		if(!jqo){
			var con;
			switch(to){
				case 'head':
					con=this.headJqo;
					if(!con){
						con=this.crtJQO('tHead','head');
						tJq.append(con);
						this.headJqo=con;
					}
					break;
				case 'foot':
					con=this.footJqo;
					if(!con){
						con=this.crtJQO('tFoot','foot');
						tJq.append(con);
						this.footJqo=con;
					}
					break;
				default:
					con=this.bodyJqo;
					if(!con){
						con=this.crtJQO('tBody','body');
						tJq.append(con);
						this.bodyJqo=con;
					}
					break;
			}
			return con;
		}else return jqo;
	},
	viewDlg:function(dlg){
		ListV.prototype.viewDlg.call(this,dlg);
		var hv=this.genHeader();
		if(hv)this.addSub(hv);
	},
	eachRows:function(f,o){
		this.eachItems(f,o);
	},
})


/**
 * 表格行控件
 * */
function RowV(){
}
defCls(RowV,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.subDef={type:'CallV'};
		this.tag='tr';
		this.rType='body';
	},
	onInit:function(opt){
		takView.prototype.onInit.call(this,opt);
		if(tak.hStr(opt.rType)){
			this.rType=opt.rType;
			if(this.rType=='head')this.subDef.tag='th';
		}
	},
	onLoad:function(opt){
		takView.prototype.onLoad.call(this,opt);
		this.genFileds(opt.fileds);
	},
	genFileds:function(opt){
		if(tak.iObj(opt)){
			var f;
			for(var i in opt){
				f=opt[i];
				f.id='c_'+i;
				this.addSub(this.newObj(f,this.subDef));
			}
		}
	},
	//获取对象容器，如果没有定义vMap,则直接添加到自身下级
	getConObj:function(o){
		var oc;
		if(o.pro)oc=o.pro['onCell'];
		if(!tak.hStr(oc))oc=o.id;
		if(oc)return this.getCell(oc);
	},
	//根据id读取单元格
	getCell:function(id){
		return this.getChild('c_'+id);
	}
})

/**
 * 表格单元格控件
 * */
function CallV(){
}
defCls(CallV,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.tag='td';
		this.vhName='base';
	},
	onInit:function(opt){
		takView.prototype.onInit.call(this,opt);
		if(this.tag=='th')this.isHead=true;//如果是行头，加个div？
		if(opt.lView)this.initLV(opt.lView);
		if(opt.rView)this.initRV(opt.rView);
	},
	onLoad:function(opt){
		takView.prototype.onLoad.call(this,opt);
		if(this.isHead)this.val(this.getName());
	},
	initLV:function(tmp){
		var lv=this.newObj(tmp,this.subDef);
		if(lv){
			this.lView=lv;
			this.addSub(lv);
		}
	},
	initRV:function(tmp){
		var rv=this.newObj(tmp,this.subDef);
		if(rv){
			this.rView=rv;
			this.addSub(rv);
		}
	},
	getIptJId:function(){
		return this.vhName;
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		var c=this.crtJQO(this.tag);
		if(this.lView||this.rView){
			this.vhName='valSp';
			c.append(this.crtJQO('span',this.vhName));
		}
		return c;
	},
	getJqoCon:function(v){
		return this.getJQO(this.vhName);
	},
	appendView:function(mJqo,v){
		if(v==this.lView)v.baseJqo.insertBefore(mJqo);
		else if(v==this.rView)v.baseJqo.insertAfter(mJqo);
		else{
			if(!this.cViews){
				mJqo.empty();
				this.cViews=[];
			}
			this.cViews.push(v);
			mJqo.append(v.baseJqo);
		}
	},
	getHVal:function(){
		if(this.rended&&!this.cViews)return this.getJQVal(this.getIptJId());
		else return this.__val__;
	},
	setHVal:function(v){
		if(this.rended&&!this.cViews)this.setJQVal(v,this.getIptJId());
	},
	onRmSubed:function(o){
		takView.prototype.onRmSubed.call(this,o);
		if(this.cViews){
			for(var i=0;i<this.cViews;i++){
				if(this.cViews[i]==o){
					this.cViews.splice(i,1);
					break;
				}
			}
			if(this.cViews.length==0){
				this.cViews=null;
				this.reVal();
			}
		}
	}
})
;
///<jscompress sourcefile="tree.js" />

/**
 * 树型行控件
 * */
function TreeV(){
}
defCls(TreeV,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		tak.genPro(this,'openState',opt.isOpen=='1',this.openStateChange);
		tak.genPro(this,'isRoot',false,function(ov,nv){ 
			if(!ov){
				this.openState=true;//如果是根节点，则自动展开
				return true;
			}
			else return false;
		});
		this.nodeTmp=opt;
		this.subPn='subs';
		this.nodes=[];
		this.subId=0;
	},
	onInit:function(opt){
		takView.prototype.onInit.call(this,opt);
		if(tak.iObj(opt.nodeTmp))this.nodeTmp=opt.nodeTmp;
		if(tak.hStr(opt.subPn))this.subPn=opt.subPn;
	},
	//获取对象容器，如果没有定义vMap,则直接添加到自身下级
	getConObj:function(o){
		return this;
	},
	getRoot:function(){
		if(this.isRoot)return this;
		if(tak.ckTN(this.parent,TreeV))return this.parent.getRoot();
		else return this;
	},
	//往上追溯，执行函数。lv -1表示不限级数
	parentDo:function(on,fun,lv){
		if(isNull(lv))lv=-1;
		if(tak.ckTN(this.parent,TreeV)){
			fun.call(on,this.parent);
			if(lv<0||lv>0){
				lv--;
				this.parent.parentDo(on,fun,lv);
			}
		}
	},
	//查找兄弟节点
	funBrother:function(flt){
		if(tak.ckTN(this.parent,TreeV)){
			return this.parent.findNode(flt,1,this);
		}
	},
	//查找子节点  lv -1表示不限级数,fr 查找来源，因为这里会被递归调用，所以需要排除自己
	findNode:function(flt,lv,fr){
		if(!fr)fr=this;
		if(isNull(lv))lv=-1;
		var t,n;
		for(var i=0;i<this.nodes.length;i++){
			n=this.nodes[i];
			if(n!=fr&&flt.call(fr,n))return n;
		}
		if(lv<0||lv>0){
			lv--;
			for(var i=0;i<this.nodes.length;i++){
				n=this.nodes[i];
				t=n.findNode(flt,lv,fr);
				if(t)return t;
			}
		}
	},
	//从根节点开始查找节点  lv -1表示不限级数,fr 查找来源，用来排除自己
	findNodeFR:function(flt,lv){
		if(isNull(lv))lv=-1;
		var r=this.getRoot();
		if(r)return r.findNode(flt,lv,this);
	},
	getLevel:function(){
		if(this.isRoot)return 0;
		if(tak.ckTN(this.parent,TreeV)){
			var lv=this.parent.getLevel();
			if(lv>=0)return lv+1;
			else return -1;
		}else return -1;
	},
	//父级对象改变检查自身是否是根节点属性
	onParentChanged:function(nv){
		takView.prototype.onParentChanged.call(this,nv);
		var it=tak.ckTN(nv,TreeV);
		this.isRoot=!it;
	},
	openStateChange:function(ov,nv){
		var ok=tak.iBool(nv);
		if(ok){
			this.onOpenStateChange(nv);
			this.getRoot().doEv('openStateChanged',this);
		}
		return ok;
	},
	//展开状态改变
	onOpenStateChange:function(nv){
		this.setSubCon(this.baseJqo,nv);
	},
	setSubCon:function(bj,nv){
		if(bj){
			if(nv){
				bj.removeClass('nClose');
				bj.addClass('nOpen');
			}
			else {
				bj.removeClass('nOpen');
				bj.addClass('nClose');
			}
		}
	},
	//节点数量改变
	onNodeCountChange:function(){
		if(!this.hasSubNode())this.rmJQO('subCon');
	},
	//是否有子节点
	hasSubNode:function(){
		return this.nodes.length>0;
	},
	setOpenState:function(state,lv){
		if(isNull(lv))lv=0;
		this.openState=state;
		if(lv>0||lv<0){
			lv--;
			for(var i=0;i<this.nodes.length;i++){
				this.nodes[i].setOpenState(state,lv);
			}
		}
	},
	open:function(lv){
		this.setOpenState(true,lv);
	},
	close:function(lv){
		this.setOpenState(false,lv);
	},
	/**
	 * 读取值
	 * */
	getHVal:function(){
		var v={};
		if(this.nodes.length>0){
			v[this.subPn]=[];
			var sv;
			for(var i=0;i<this.nodes.length;i++){
				sv=this.nodes[i].getVal();
				if(!isNull(sv))v[this.subPn].push(sv);
			}
		}
		return v;
	},
	setHVal:function(v){
		this.reSetNodes(v);
	},
	rendContent:function(bv){
		
	},
	//渲染下级节点ul标签
	rendSubTag:function(){
		var ul=this.crtJQO('ul','subCon');
		this.baseJqo.append(ul);
		return ul;
	},
	create:function(){
		var c;
		if(tak.ckTN(this.parent,TreeV))c=this.crtJQO('li','base');
		else c=this.crtJQO('div','divCon');
		var lv=this.getLevel();
		c.addClass('leve'+lv.toString());
		this.setSubCon(c,this.openState);
		if(!this.isRoot)this.rendContent(c);
		return c;
	},
	//获取下级控件容器
	getSubCon:function(nc){
		var sc=this.getJQO('subCon');
		if(!sc&&nc!=false)sc=this.rendSubTag();
		return sc;
	},
	//获取当前节点的子视图容器
	getViewCon:function(nc){
		return null;
	},
	//移除节点下的子节点
	clearNodes:function(){
		var n;
		while(this.nodes.length>0){
			n=this.nodes[0];
			if(n.owner==this)n.dispose()
			else n.remove();
		}
	},
	//刷新树结构
	reSetNodes:function(v){
		this.clearNodes();
		if(!this.isRoot)this.setNodeVal(v);
		else this.setRootVal(v);
		this.crtNodes(v);
	},
	setRootVal:function(v){
		
	},
	//设置节点显示内容
	setNodeVal:function(v){
		
	},
	//创建子节点
	crtNodes:function(v){
		if(tak.iObj(v)){
			var sb=v[this.subPn];
			if(sb){
				tak.eachAry(this,sb,function(o){
					this.newNode(o);
				});
			}
		}
	},
	//创建新节点
	newNode:function(v){
		var node=this.newObj({id:'node_'+this.subId.toString()},this.nodeTmp);
		if(node){
			node.val(v);
			this.addSub(node);
			this.subId++;
		}
		return node;
	},
	getJqoCon:function(v){
		if(tak.ckTN(v,TreeV))return this.getSubCon();
		else return this.getViewCon();
	},
	onAdSubed:function(o){
		if(tak.ckTN(o,TreeV)){
			this.nodes.push(o);
			this.onNodeCountChange();
		}
		takView.prototype.onAdSubed.call(this,o);
	},
	onRmSubed:function(o){
		takView.prototype.onRmSubed.call(this,o);
		if(tak.ckTN(o,TreeV)){
			var i=this.nodes.indexOf(o);
			if(i>=0){
				this.nodes.splice(i,1);
				this.onNodeCountChange();
			}
		}
	},
	onRemove:function(){
		this.clearNodes();
		takView.prototype.onRemove.call(this);
	},
})
;
///<jscompress sourcefile="ctrl.js" />

/**
 * 容器控件
 * */
function takCtrl(){
}
defCls(takCtrl,takRendObj,{
	onCrtPro:function(opt){
		takRendObj.prototype.onCrtPro.call(this,opt);
		tak.genPro(this,'state',opt.state,this.stateChange);
		this.loadingOn=true;
	},
	onInit:function(opt){
		takRendObj.prototype.onInit.call(this,opt);
		this.baseV=this.newObj(opt.baseV,{type:'takView',id:'baseV'});
		if(tak.iObj(opt.lder))this.initLoader(opt.lder);
		if(tak.iObj(opt.cmter))this.cmter(opt.cmter);
		if(opt.param)this.param=opt.param;//请求参数定义
		if(tak.hStr(opt.loadParam))this.loadParam=opt.loadParam;
		if(opt.varDef)this.varDef=opt.varDef;
	},
	defCvtTmp:function(){
		return {type:'treeCvt'};
	},
	myVar:function(name,val){
		if(tak.hStr(name)){
			if(arguments.length==1&&this.varDef){
				var t=this.varDef[name];
				return tak.copy(t);
			}else if(arguments.length==2){
				if(!this.varDef)this.varDef={};
				this.varDef[name]=val;
			}
		}
	},
	initLoader:function(opt){
		if(tak.iObj(opt)){
			opt=tak.defTmp(opt,'def');
			var lds={},ld;
			for(var i in opt){
				ld=this.newObj(opt[i],this.defLoader());
				if(ld)lds[i]=ld;
			}
			this.loaders=lds;
		}
	},
	//默认加载器，不同控制器生成不同的加载器
	defLoader:function(){
		return {type:'takMLoad'};
	},
	//默认提交器，不同控制器生成不同的提交器
	defCommiter:function(){
		return {type:'takCommiter'};
	},
	/**
 	* 显示已改变处理方法
 	* */
	onVisibleChange:function(nv){
		this.eachChild(function(v){
			if(tak.ckTN(v,HtmlV)){
				v.visible=v;
			}
		});
	},
	rendSub:function(c){
		c.rend(this.baseV);
	},
	doRend:function(to){
		if(tak.ckTN(to,jQuery))this.baseV.rend(to);
		else if(tak.ckTN(to,takView))to.addObj(this.baseV);
		else if(tak.ckTN(to,takCtrl)&&to.baseV)to.baseV.addObj(this.baseV);
		this.rended=this.baseV.rended;
		return true;
	},
	rendTakView:function(obj){
		this.baseV.rendTakView(obj);
	},
	//可用状态改变，
	aplEnable: function(nv){
		takRendObj.prototype.aplEnable.call(this,nv);
		if(this.baseV)this.baseV.aplJQEnable(nv);
	},
	onRemove:function(){
		this.baseV.remove();
	},
	//读取或设置加载控制器
	lder:function(name){
		if(!tak.hStr(name))name='def';
		if(this.loaders){
			var ld=this.loaders[name];
			if(!ld)tak.logErr('控制器['+this.id+']下，未配置读取设备:'+name);
			return ld;
		}
		else tak.logErr('控制器['+this.id+']下，未配置读取设备。');
	},
	//读取或设置提交控制器
	cmter:function(opt){
		var cmt=this.commiter;
		if(!cmt||opt){
			var def=this.defCommiter();
			if(!opt){opt=def;def=null;}
			cmt=this.newObj(opt,def);
			this.commiter=cmt;
		}
		return cmt;
	},
	/**
 	* 状态改变
 	* */
	stateChange:function(ov,nv){
		var ok=tak.hStr(nv)
		if(ok){
			this.onStateChange(nv);
			this.doEv("stateChanged",nv);
		}
		return ok;
	},
	onStateChange:function(nv){
	},
	getLoadParam:function(fn,p){
		if(tak.hStr(fn)){
			var pf=this.getFunc(fn);
			if(pf)p=pf.call(this,this.param,p);
		}
		return p;
	},
	//提交服务请求
	commitData:function(sn,an,data){
		var cmt=this.cmter();
		if(cmt)cmt.commit(data,sn,an);
	},
	//从后台服务加载页面数据
	loadData:function(p,name,on){
		if(arguments.length==2&&tak.iObj(name)){
			on=name;
			name=null;
		}else if(arguments.length==1){
			on=this;name=null;
		}
		var lder=this.lder(name);
		if(lder)lder.load(p,on);
	},
	/**
 	* 刷新数据
 	* */
	refData:function(name){
		var lder=this.lder(name);
		if(lder)lder.refrash();
	},
	onWillCrt:function(type,tmp){
		takRendObj.prototype.onWillCrt.call(this,type,tmp);
		if(tak.ckTN(type,takCtrl)&&!tak.hStr(tmp.state))tmp.state=this.state;
	},
});

/**
 * 容器控件
 * */
function vCtrl(){
	
}
defCls(vCtrl,takCtrl,{
	onCrtPro:function(opt){
		takCtrl.prototype.onCrtPro.call(this,opt);
		this.loadingOn=true;
	},
	onInit:function(opt){
		takCtrl.prototype.onInit.call(this,opt);
		if(opt.filter)this.filter=new takFilter(opt.filter,false);
		if(tak.iObj(opt.views))this.initViews(opt.views);//单独定义主要是为了方便处理权限问题
	},
	initViews:function(opt){
		var views=[],b,t;
		for(var i in opt){
			b=opt[i];
			t=this.genVT(i,b);
			if(t)views.push(t);
		}
		this.views=views;
	},
	genVT:function(id,t){
		t=tak.defTmp(t,'tmp');
		if(t.tmp.jEven){
			t.tmp.jEven=tak.defTmp(t.tmp.jEven,'func');
			if(!t.tmp.jEven.on)t.tmp.jEven.on=this;
		}
		if(!tak.hStr(t.group))t.group='def';
		t.tmp.id=id;
		t.tmp=tak.unTmp(this.defBtn,t.tmp);
		if(!this.filter||this.filter.check(t.tmp)){
			if(tak.hStr(t.onState))t.onState=[t.onState];
			return t;
		}
	},
	//创建内容视图
	setUpViews:function(group,on,owner,mt){
		if(this.views){
			if(!tak.hStr(mt))mt=this.state;
			var vs=[],t,v,dto;
			if(!tak.hStr(group))group='def';
			if(!tak.ckTN(owner,takMoObj))owner=this;
			if(!tak.ckTN(on,takView))on=this.baseV;
			for(var i=0;i<this.views.length;i++){
				t=this.views[i];
				if(group==t.group){
					v=owner.getChild(t.tmp.id);
					if(v)v.dispose();
				}
			}
			for(var i=0;i<this.views.length;i++){
				t=this.views[i];
				if(group==t.group){
					if(!t.onState||t.onState.indexOf(mt)>=0){
						dto=on.getConObj(t.tmp);
						if(dto){
							v=owner.newObj(t.tmp,dto.subDef);
							if(v){
								dto.addObj(v);
								this.doEv('createViewed',v);
							}
						}
					}
				}
			}
		}
	},
	valid:function(view,sf,ef){
		if(view){
			var r=view.valid();
			if(r.s==true&&sf)this.getFunc(sf,this,r.v);
			else if(r.s==false&&ef)this.getFunc(ef,this,r.m);
			return r;
		}
	}
});
///<jscompress sourcefile="package.js" />


//包装器
function takPkger(opt){
}
defCls(takPkger,takTmpObj,{
	onInit:function(opt){
		takTmpObj.prototype.onInit.call(this,opt);
		this.pN="vCate";
		if(tak.hStr(opt.pN))this.pN=opt.pN;
		if(tak.iObj(opt.pros))this.pros=opt.pros;
		this.autoPro=(opt.autoPro=='0')?false:true;
		this.parseTmp(opt.tmps);
	},
	parseTmp:function(tmps){
		var ts={};
		for(var i in tmps){
			ts[i]=tak.defTmp(tmps[i],'type');
		}
		this.tmps=ts;
	},
	genNewTmp:function(tmp,v,vg){
		tmp=tak.copy(tmp);
		if(!tmp.pro&&this.autoPro)tmp.pro=v.pro;
		return tmp;
	},
	getTmp:function(v,vg){
		if(this.tmps){
			var tmp=this.tmps[vg];
			if(tmp)tmp=this.genNewTmp(tmp,v,vg);
			return tmp;
		}
	},
	genPkgV:function(v,vg){
		var tmp=this.getTmp(v,vg);
		if(!tak.iObj(tmp)||(v&&this.filter&&!this.filter.check(v)))return;
		var p= this.owner.newObj(tmp);
		if(p)p.bindEv('subRemoved',function(o){
			if(!o.subs||o.subs.length==0)o.dispose();
		});
		return {o:p,n:true};
	},
	pkgObj:function(v){
		if(v){
			var vg=v.getDPro(this.pN,'def');
			var r=this.genPkgV(v,vg);
			if(r&&r.o){
				if(r.o.addSub(v)&&r.n)v=r.o;
				else v=null;
			}
			return v;
		}
	}
})

//分组包装器
function takGPkger(){
}
defCls(takGPkger,takPkger,{
	genPkgV:function(v,vg){
		if(!tak.hStr(vg))return null;
		if(!this.pkgVs)this.pkgVs={};
		var o=this.pkgVs[vg];//相同的分类名称，使用同一个包装视图进行包装
		if(!o){
			var p=takPkger.prototype.genPkgV.call(this,v,vg);
			if(p&&p.o){
				this.pkgVs[vg]=p.o;
				p.o.bindEv('disposed',function(o){
					delete this.pkgVs[vg];
				},this);
			}
			return p;
		}else return {o:o,n:false};
		
	},
	pkgObjs:function(vs){
		var nvs=[],v;
		for(var i=0;i<vs.length;i++){
			v=vs[i];
			v=this.pkgObj(v);
			if(v)nvs.push(v);
		}
		return nvs;
	}
})
;
///<jscompress sourcefile="TmpLd.js" />

/**
 * 模板加载器
 * */
function defTmpLd(){
	//定义应用仓库
	this.tmpSonre=new Map();
	this.svrs=[];
	this.baseUrl='';
	this.defType='js';
}
defCls(defTmpLd,{
	setBaseUrl:function(bu){
		this.baseUrl=bu;
	},
	setDefType:function(dt){
		if(dt=='json'||dt=='js')this.defType=dt;
	},
	//读取json格式数据
	reqJson:function(url,cb){
		try{
			tak.xhrRequest(url,{
				method:"GET",
				header:{"content-type":'text/json'},
				respType:"json",
				success:function(data){
					cb.call(this,true,data,'0000','加载成功');
				},
				err:function(code,msg){
					cb.call(this,false,null,code,msg);
				},
				on:this
			})
		}catch(err){
			tak.logErr('读取json模板失败',err);
			var msg="无";
			if(typeof(err)=="string")msg=err;
			else if(typeof(err)=="object")msg=err.message;
			cb.call(this,false,null,'9994',msg);
		}
	},
	//读取js格式数据
	reqJs:function(url,cb,tk){
		try{
			tak.xhrRequest(url,{
				method:"GET",
				header:{"content-type":'text/plan'},
				respType:"text",
				success:function(data){
					if(tak.hStr(data)){
						try{
							data=data.trim();
							if(data.indexOf('{')==0)data='('+data+')';
							data=eval(data);
							cb.call(this,true,data,'0000','加载成功',tk);
						}catch(err){
							tak.logErr('js模板解析失败',err);
							cb.call(this,false,null,'9995','js模板解析失败',tk);
						}
					}else cb.call(this,false,null,'9996','请求到空数据',tk);
				},
				err:function(code,msg){
					cb.call(this,false,null,code,msg,tk);
				},
				on:this
			});
		}catch(err){
			tak.logErr('读取json模板失败',err);
			var msg="无";
			if(typeof(err)=="string")msg=err;
			else if(typeof(err)=="object")msg=err.message;
			cb.call(this,false,null,'9994',msg);
		}
	},
	//文件请求处理
	reqTmp:function(param,type,name,cb,tk){
		if(!param)cb.call(this,false,null,'9996',"模板请求参数为空",tk);
		var mySonre=this.tmpSonre;
		var tmp=mySonre.get(param);
		if(tmp)return cb.call(this,true,tmp,null,null,tk);
		var rc=function(isOk,data,code,msg){
			if(isOk){
				if(data){
					mySonre.set(param, data);
					cb.call(this,true,data,null,null,tk);
				}else cb.call(this,false,data,'9991','模板解析失败',tk);
				
			} else cb.call(this,isOk,null,code,msg,tk);
		}
		if(!tak.hStr(type))type=this.defType;
		if(type=='json')this.reqJson(this.baseUrl+param,rc);
		else this.reqJs(this.baseUrl+param,rc);
	},
	//读取文件
	loadFile:function(tmp,sm,cb,on){
		if(tak.iFun(cb)&&tmp){
			tmp=tak.defTmp(tmp,'param');
			if(sm)sm.call(on,'正在读取页面...');
			this.reqTmp(tmp.param,tmp.type,tak.hStr(tmp.rid)?tmp.rid:"",
			function(isOk,data,code,msg){
				if(isOk){
					if(sm)sm.call(on,'正在读取引用...');
					var svrs=data.svrs;
					delete data.svrs;
					this.loadSvrs(svrs,function(lok){
						if(lok){
							var refs=data.refs;
							delete data.refs;
							this.loadRefs(refs,function(rok,rts){
								data.refTmps=rts;
								if(rok)cb.call(on,rok,data,'0000','加载完成');
								else cb.call(on,rok,data,'9993','引用文件加载失败');
							},this);
						}else cb.call(on,lok,data,'9992','依赖脚本加载失败');
					});
				}else cb.call(on,isOk,data,code,msg);
			});
		}
	},
	loadSvrs:function(svrs,cb){
		if(tak.iAry(svrs)){
			var reqs={},l;
			for(var i=0;i<svrs.length;i++){
				l=svrs[i];
				if(tak.hStr(l)&&this.svrs.indexOf(l.toLowerCase())<0)reqs['l_'+i]={req:l};
			}
			//异步同时请求加载所有引用，每个引用完成后检查加载情况
			var ckf=function(){
				var rc=true,ac=true,t;
				for(var i in reqs){
					t=reqs[i];
					if(!t.rc){
						rc=false;
						break;
					}
					if(!t.isOk)ac=false;
				}
				if(rc)cb.call(this,ac);
			}
			var h=false;
			for(var i in reqs){
				h=true;
				t=reqs[i];
				this.reqJs(t.req,function(ok,data,code,msg,tk){
					tk.rc=true;
					tk.isOk=ok;
					if(ok)this.svrs.push(tk.req.toLowerCase());
					ckf.call(this);
				},t)
			}
			if(!h)cb.call(this,true);
		}else cb.call(this,true);
	},
	//读取文件下的相关引用
	loadRefs:function(tmps,cb,on){
		if(tak.iObj(tmps)){
			var reqs={},t;
			for(var i in tmps){
				t=tak.defTmp(tmps[i],'param');
				reqs[i]={param:t.param,type:t.type,rid:i};
			}
			//异步同时请求加载所有引用，每个引用完成后检查加载情况
			var ckf=function(){
				var rc=true,ac=true,t;
				for(var i in reqs){
					t=reqs[i];
					if(!t.rc){
						rc=false;
						break;
					}
					if(!t.isOk)ac=false;
				}
				if(rc)cb.call(this,ac,tmps);
			}
			for(var i in reqs){
				t=reqs[i];
				this.reqTmp(t.param,t.type,tak.hStr(t.rid)?t.rid:"",
					function(isOk,data,code,msg,tk){
						tmps[tk.rid]=data;
						if(isOk&&data.refs){
							this.loadRefs(data.refs,function(ok,rts){
								data.refTmps=rts;
								tk.rc=true;
								tk.isOk=ok;
								ckf.call(this);
							},this);
						}else{
							if(!isOk)tak.logErr('引用文件['+t.rid+']加载失败,code:'+code+',msg:'+msg);
							tk.rc=true;
							tk.isOk=isOk;
							ckf.call(this);
						}
				},t);
			}
		}else cb.call(this,true,null);
	},
})
;
///<jscompress sourcefile="listCtrl.js" />


function listCtrl(){
}
defCls(listCtrl,takCtrl,{
	onCrtPro:function(opt){
		takCtrl.prototype.onCrtPro.call(this,opt);
		this.subDef={type:"vCtrl"};
		this.subid=0;
	},
	onInit:function(opt){
		takCtrl.prototype.onInit.call(this,opt);
		if(tak.iObj(opt.conView)){
			this.conView=opt.conView;
			this.conView.id=null;
		}
		if(tak.iObj(opt.ctrls))this.initCtrls(opt.ctrls);
	},
	genSubs:function(subs){
		//这里是在渲染之前执行，所以直接添加
		if(tak.iObj(subs)){
			var c;
			for(var i in subs){
				c=subs[i];
				if(tak.iObj(c)){
					c.id=i;
					c=this.newObj(c,this.subDef);
					this.addCtrl(c);
				}
			}
		}
	},
	//初始化控制器配置集合。不同于subs配置在于该配置可以在激活时自动加载
	initCtrls:function(opt){
		var o;
		for(var i in opt){
			o=tak.defTmp(opt[i],'ctrl');
			o.id=i;
			this.addCtrl(o);
		}
	},
	//渲染完成后，如果没有指定要打开的控制器，则默认打开最后一个
	rendSubs:function(){
		if(this.ctrls&&this.ctrls.length>0){
			if(a)this.openCtrl(this.ctrls[0].id);
		}
	},
	//新的控制器被添加进来
	rendSub:function(c){
		if(c){
			var co;
			if(tak.hStr(c.id))co=this.openCtrl(c.id);
			else c.id=this.getCtrlId();
			if(!co)this.addCtrl(c);
			else {
				if(co.view==this.baseV)c.visible=co.active;
				c.rend(co.view);
			}
		}
	},
	onRmSubed:function(o){
		takCtrl.prototype.onRmSubed.call(this,o);
		if(tak.ckTN(o,takCtrl)&&tak.hStr(o.id))this.rmCtrl(o.id);
	},
	getCtrlId:function(){
		var id='at_ctrl_'+this.subid.toString();
		this.subid++;
		return id;
	},
	getCtrlById:function(id,fun,on){
		var c,a;
		if(this.ctrls){
			for(var i=0;i<this.ctrls.length;i++){
				c=this.ctrls[i];
				if(c.id==id)a=c;
			}
			if(a&&tak.iFun(fun))fun.call(on,a);
		}
		return a;
	},
	//循环当前控制器集合下的所有控制器
	eachCtrl:function(f,o){
		if(this.ctrls){
			var c;
			for(var i=0;i<this.ctrls.length;i++){
				c=this.ctrls[i];
				f.call(o,c);
			}
		}
	},
	//通过过滤函数查找控制器
	findCtrl:function(flt,on){
		var cs=[];
		if(this.ctrls){
			var c;
			for(var i=0;i<this.ctrls.length;i++){
				c=this.ctrls[i];
				if(flt.call(on,c)==true)cs.push(c);
			}
		}
		return cs;
	},
	//通过过滤函数查找控制器
	findCtrlF:function(flt,on){
		if(this.ctrls){
			var c;
			for(var i=0;i<this.ctrls.length;i++){
				c=this.ctrls[i];
				if(flt.call(on,c)==true)return c;
			}
		}
	},
	//添加控制器配置对象
	addCtrl:function(opt){
		if(tak.ckTN(opt,takCtrl))return this.addCtrl(this.crtCtrlOpt(opt));
		if(!tak.hStr(opt.id))opt.id=this.getCtrlId();
		var oc=this.getCtrlById(opt.id);
		if(oc){
			this.openCtrl(opt.id);
			return oc;
		}
		else {
			if(!this.ctrls)this.ctrls=[];
			opt.active=false;
			this.ctrls.push(opt);
			this.onAddOpted(opt);
			return opt;
		}
	},
	//新增控制器配置后的处理函数
	onAddOpted:function(opt){
		if(this.rended)this.openCtrl(opt.id);
	},
	crtCtrlOpt:function(c){
		return {id:c.id,obj:c};
	},
	//通过制定控制器id激活控制器
	openCtrl:function(id){
		if(this.ctrls)return this.activeCtrl(this.getCtrlById(id));
	},
	//移除控制器
	rmCtrl:function(ctrl){
		if(tak.ckTN(ctrl,takCtrl)){
			if(tak.hStr(ctrl.id))ctrl=this.getCtrlById(ctrl.id);
			else return;
		}else if(tak.hStr(ctrl))ctrl=this.getCtrlById(ctrl);
		if(ctrl.obj){
			var o=ctrl.obj;
			delete ctrl.obj;
			if(o.owner==this)o.dispose();
			else o.remove();
		}
		this.onRmCtrled(ctrl);
	},
	onRmCtrled:function(ctrl){
		if(ctrl.view&&ctrl.view!=this.baseV)ctrl.view.dispose();
		delete ctrl.view;
		this.onHideCtrled(ctrl);
		var c,nc;
		for(var i=0;i<this.ctrls.length;i++){
			c=this.ctrls[i];
			if(c.id==ctrl.id){
				this.ctrls.splice(i,1);
				if(c.active){
					if(i<this.ctrls.length)nc=this.ctrls[i];
					else if(i>0&&this.ctrls.length>0)nc=this.ctrls[i-1];
					if(nc)this.showCtrl(nc);
				}
				break;
			}
		}
	},
	//激活控制器处理函数
	activeCtrl:function(nc){
		if(nc){
			var oc=this.findCtrlF(function(c){
				return c!=nc&&c.active;
			},this);
			if(oc)this.hideCtrl(oc);
			if(nc)this.showCtrl(nc);
			return nc;
		}
	},
	//隐藏控制器处理
	hideCtrl:function(ctrl){
		ctrl.active=false;
		if(ctrl.view!=this.baseV)ctrl.view.visible=false;
		else if(ctrl.obj)ctrl.obj.visible=false;
		this.onHideCtrled(ctrl);
	},
	//被隐藏后触发事件
	onHideCtrled:function(ctrl){
		this.doEv('hideCtrled',ctrl);
	},
	//激活控制器处理
	showCtrl:function(ctrl){
		if(!ctrl.view){
			if(this.conView)ctrl.view=this.newObj(this.conView);
			if(!ctrl.view)ctrl.view=this.baseV;
			else this.baseV.addObj(ctrl.view);
		}
		if(!ctrl.obj)this.reqCtrl(ctrl);
		if(!ctrl.active){
			ctrl.active=true;
			if(ctrl.view!=this.baseV)ctrl.view.visible=true;
			else if(ctrl.obj)ctrl.obj.visible=true;
			this.onShowCtrled(ctrl);
		}
	},
	//被激活后触发事件
	onShowCtrled:function(ctrl){
		this.doEv('showCtrled',ctrl);
	},
	reqCtrl:function(ctrl){
		if(ctrl&&ctrl.ctrl){
			this.loadCtrl(ctrl,function(tmp){
				this.genCtrl(ctrl,tmp);
				ctrl.view.hideLoading();
			},this)
		}
	},
	//根据模板生成控制器
	genCtrl:function(ctrl,tmp){
		if(ctrl.view){//没有表示已经被关掉了
			if(tak.iObj(tmp)&&tak.hStr(ctrl.rid))tmp=tmp[ctrl.rid];
			if(tak.iObj(tmp)){
				tmp=tak.unTmp(tmp,ctrl);
				ctrl.obj=this.newObj(tmp,this.subDef);
				if(!ctrl.obj){
					this.alertError('控制器','控制器配置无效');
					this.rmCtrl(ctrl);
				}
				else {
					try{
						this.addObj(ctrl.obj);
					}catch(err){
						this.alertError('控制器','控制器配置错误，加载失败。',err);
						this.rmCtrl(ctrl);
					}
				}
			}
		}
	},
	//加载控制器
	loadCtrl:function(ctrl,cb,on){
		this.doEv('beginLoadCtrl',ctrl);
		$.takApp.loadFile(ctrl.ctrl,function(msg){
			this.doEv('loadCtrlMsg',{ctrl:ctrl,msg:msg});
		},function(isOk,data,code,msg){
			if(isOk){
				if(tak.iObj(data)){
					data=tak.copy(data);
					cb.call(on,data);
				}else{
					this.alertError('配置','控制器无配置参数，或格式错误。');
					this.rmCtrl(ctrl);
				}
			}
			else{
				this.alertError(code,msg);
				this.rmCtrl(ctrl);
			}
			this.doEv('ctrlLoadComplate',ctrl);
		},this)
	}
});
;
///<jscompress sourcefile="page.js" />
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
;
///<jscompress sourcefile="app.js" />
function takApp(){
	this.srvMng=new takSrvMag();
	this.pages=[];
	this.viewPros=new Map();
	takInitOpt(this);
}
defCls(takApp,takMoObj,{
	setOpt:function(opt){
		this.initOpt=$.extend(true,{},this.initOpt, opt);
	},
	/**
 	* 注册视图样式
	* @param {String}tn 视图视图样式名称 匹配type
	* @param {String}vg 视图状态
 	* @param {Function}pros 视图视图样式
 	* */
	regVAtts:function(tn,vg,att){
		if(!tak.iObj(att))att=vg;//参数前滚处理
		if(!tak.iStr(vg))vg="def";
		if(!att.base)att={base:att};
		var src=this.viewPros.get(tn);
		if(!src){
			src={};
			this.viewPros.set(tn,src);
		}
		src[vg]=att;
	},
	getDefOpt:function(){
		return this.initOpt.defOpt;
	},
	/**
	 * 读取视图样式
	 * */
	getVAtts:function(tn){
		return this.viewPros.get(tn);
	},
	alertF:function(){
		return this.initOpt.alert;
	},
	confirmF:function(){
		return this.initOpt.confirm;
	},
	//读取或设置模板文件读取设备
	tmpLoader:function(lder){
		if(lder)this.initOpt.tmpLoader=lder;
		return this.initOpt.tmpLoader;
	},
	loadFile:function(tmp,sm,cb,on){
		return this.initOpt.tmpLoader.loadFile(tmp,sm,cb,on);
	},
	getModelLoader:function(){
		return this.initOpt.modelLoader;
	},
	pageTmp:function(pType,tmp){
		if(!tak.hStr(pType))return;
		if(this.initOpt){
			if(tmp)this.initOpt.pageTmp[pType]=tmp;
			return this.initOpt.pageTmp[pType];
		}
	},
	getSrv:function(tn){
		return this.srvMng.getSrvBySN(tn);
	},
	loading:function(target,msg,isCmt){
		if(!target)target=$('body');
		this.initOpt.loading(target,msg,isCmt);
	},
	showMsg:function(target,msg){
		if(!target)target=$('body');
		this.initOpt.showMsg(target,msg);
	},
	loaded:function(target){
		if(!target)target=$('body');
		this.initOpt.loaded(target);
	},
	/**
 	* 安装服务
 	* @param{String}mName 服务名称
 	* @param{Object}srv 服务对象或服务构造方法
	* */
	setUpService:function(mName,srv){
		this.srvMng.addSrv(mName,srv);
	},
	resizePage:function(p,css){
		var bW=$('body').outerWidth(),bH=$('body').outerHeight();
		
		var ms=0.4,hs=0.8;
		if(bW<=768)ms=1;
		else if(bW<= 992)ms=0.8;
		else if(bW<= 1400)ms=0.6;
		
		if(bH<= 662)hs=1;
		else if(bH<= 818)hs=0.9;
		
		if(!tak.iObj(css))css={width:bW*ms,height:bH*hs};
		else{
			if(!css.width)css.width=bW*ms;
			if(!css.height)css.height=bH*hs;
		}
		p.baseV.baseJqo.css(css);
	},
	openPage:function(opt,css){
		var on=$('body');
		var page=this.showPage(opt,on);
		this.resizePage(page,css);
		this.pushPage(page);
	},
	showDialog:function(opt,on,css){
		if(!on)on=$('body');
		var bl=$('<div>',{"class":"tak-dialog-back"});
		on.append(bl);
		var p=this.showPage(opt,bl);
		if(p){
			this.resizePage(p,css);
			var jq=p.baseV.baseJqo;
			jq.css({top:(bl.innerHeight()-jq.outerHeight())/2,
			left:(bl.innerWidth()-jq.outerWidth())/2})
			p.bindEv('disposed',function(s){
				bl.remove();
			},this);
		}else bl.remove();
	},
	showPage:function(opt,on){
		if(!on)on=$('body');
		if(!tak.hStr(opt.pType))opt.pType='None';
		var tmp=tak.unTmp({type:'takPage'},this.pageTmp(opt.pType));
		try{
			var start= (new Date).getTime();
			var page=this.newObj(tmp);
			if(page){
				page.id=tak.uuid();
				page.rend(on);
				if(page.rended)page.addCtrl(opt);
				else this.alertError('错误','页面渲染失败');
			}else this.alertError('错误','页面生成失败');
			var end=(new Date).getTime();
			console.log("页面加载耗时："+(end-start)+"ms");
			return page;
		}catch(err){
			this.alertError('错误','页面生成失败',err);
		}
	},
	pushPage:function(p){
		if(tak.ckTN(p,takCtrl)&&p.baseV&&p.baseV.baseJqo){
			this.pages.push(p);
			var index=this.pages.length;
			p.baseV.baseJqo.css({"z-index":index+10000});
			p.baseV.baseJqo.css({top:20*index,left:20*index});
			p.bindEv('disposed',function(s){
				var i=this.pages.indexOf(s);
				if(i>=0){
					this.pages.splice(i,1);
					this.resetIndex(i);
				}
			},this);
		}
	},
	bringToFront:function(p){
		var i=this.pages.indexOf(p);
		if(i>=0){
			this.pages.splice(i,1);
			this.pages.push(p);
			this.resetIndex(i);
		}
	},
	resetIndex:function(index){
		if(!tak.iNum(index))index=0;
		var p;
		for(var i=index;i<this.pages.length;i++){
			p=this.pages[i];
			p.baseV.baseJqo.css({"z-index":i+10000+1});
		}
	}
});
;
///<jscompress sourcefile="loading.js" />


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

;
///<jscompress sourcefile="eventExt.js" />

/**
 * 容器路径事件处理绑定
 * */
function takEventExt(){
	
}
defPlg(takEventExt,takTmpObj,'eves',{
	onInit:function(opt){
		this.bindOwnerEv("subAddedId",this.bindSubTmp);
		this.bindOwnerEv("childCreatedId",this.bindChildTmp);
		this.loadEvent(opt);
	},
	loadEvent:function(eves){
		if(!eves)return;
		if(tak.iObj(eves))eves=[eves];
		if(!this.evesSubTmp)this.evesSubTmp=[];
		if(!this.evesChildTmp)this.evesChildTmp=[];
		var t,tn;
		for(var i=0;i<eves.length;i++){
			t=eves[i];
			tn=tak.gtn(t.on);
			if(tn=='String')t.on=[t.on];
			else if(tn!='Array')t.on=null;
			if(!t.on)this.bindEvFunc(t.en,t.func,this.owner);
			else{
				var idl,o;
				for(var j=0;j<t.on.length;j++){
					idl=t.on[j];
					if(idl=='this'){
						this.bindEvFunc(t.en,t.func,this.owner);
						t.on.splice(j,1);
						j--;
					}
				}
				if(t.on.length>0){
					if(t.isSub=='1')this.evesSubTmp.push(t);
					else this.evesChildTmp.push(t);
				}
			}
		}
	},
	bindSubTmp:function(s,arg){
		if(!this.evesSubTmp||!tak.hStr(arg.path))return;
		var t;
		for(var i=0;i<this.evesSubTmp.length;i++){
			t=this.evesSubTmp[i];
			if(t.on.indexOf(arg.path)>=0)this.bindEvFunc(t.en,t.func,arg.obj);
		}
	},
	bindChildTmp:function(s,arg){
		if(!this.evesChildTmp||!tak.hStr(arg.path))return;
		var t;
		for(var i=0;i<this.evesChildTmp.length;i++){
			t=this.evesChildTmp[i];
			if(t.on.indexOf(arg.path)>=0)this.bindEvFunc(t.en,t.func,arg.obj);
		}
	},
	bindEvFunc:function(en,fn,src,f){
		if(!f)f=this.owner.getFunc(fn);
		if(tak.iFun(f)){
			src.bindEv(en,f,this.owner);
			src.bindEv('removed',function(s){
				this.owner.unBindEv(null,null,this);
			},this);
		}
	},
});;
///<jscompress sourcefile="viewTipExt.js" />
/**
 * 包装配置扩展
 * */
function takTipExt(){
}
defPlg(takTipExt,takTmpObj,'tip',{
	onInit:function(opt){
		if(tak.hStr(opt))this.btsTip=opt;
		this.bindOwnerEv('rended',this.addTip);
	},
	addTip:function(s){
		if(this.btsTip){
			var t=this.btsTip;
			if(tak.hStr(t)){
				if(t.indexOf('$')==0){
					t=t.substr(1,t.length-1);
					t=s.getFunc(t);
					t.call(s,this.setTip);
				}else this.setTip(t,s);
			}
		}
	},
	setTip:function(str,on){
		on.baseJqo.attr("data-toggle","tooltip");
		on.baseJqo.attr("title",str);
	},
});
///<jscompress sourcefile="initer.js" />

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
;
