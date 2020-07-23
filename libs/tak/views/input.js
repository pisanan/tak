function InputV(){
}
defCls(InputV,takView,{
	getInputAtt:function(){
		return {type:'text'};
	},
	genInput:function(){
		return this.crtJQO('input',this.getIptJId(),this.getInputAtt());
	},
	create:function(){
		return this.genInput()
	}
});

//文本框控件
function TextV(){
}
defCls(TextV,InputV,{
	getType:function(){
		return 'text'
	},
	getInputAtt:function(){
		var att={type:this.getType()};
		var c=this.getPro("maxL");
		if(!tak.iNum(c)||c<=0||c>100)c=100;
		att.maxLength=c;
		c=this.getPro("placeholder");
		if(tak.hStr(c))att.placeholder=c;
		return att;
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		var v=InputV.prototype.create.call(this);
		var t=this.getPro("maskAlias");
		if(tak.hStr(t)&&tak.iFun(v.inputmask)){
			v.attr("data-inputmask","'alias': '"+t+"'");
			v.inputmask();
		}
		return v;
	}
});


//密码控件
function PwdV(){
}
defCls(PwdV,TextV,{
	getType:function(){
		return 'password'
	}
});

