
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
