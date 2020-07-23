
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
});