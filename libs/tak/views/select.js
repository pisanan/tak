
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
