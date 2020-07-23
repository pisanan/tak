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
})