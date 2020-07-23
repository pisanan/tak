
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
		var xhr = new XMLHttpRequest();//不支持旧版ie
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

