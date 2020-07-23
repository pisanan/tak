
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
});