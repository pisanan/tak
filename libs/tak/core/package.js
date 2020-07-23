

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
