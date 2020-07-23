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
	
});