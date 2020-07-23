
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
