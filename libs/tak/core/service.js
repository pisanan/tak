
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
