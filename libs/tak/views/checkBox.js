
//多选按钮控件
function CheckBoxV(){
}
defCls(CheckBoxV,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.checkState=false;
	},
	
	onRended:function(){
		takView.prototype.onRended.call(this);
		var v=this.getName();
		if(tak.hStr(v))this.setTxtVal(v);
		this.bindJQEvF('click','base',function(){
			if(this.getRealEnable())this.setVal(!this.checkState);
		},this);
	},
	setTxtVal:function(v){
		if(tak.hStr(v)){
			var t=this.getJQO('txt',function(b){b.html(v);});
			if(!t)this.baseJqo.append(this.crtJQO('span','txt').html(v));
		}else this.rmJQO('txt');
		this.doEv('textChanged',v);
	},
	checked:function(v){
		if(tak.iBool(v)&&this.checkState!=v){
			this.checkState=v;
			this.onCheckedChange(v);
		}
		return this.checkState;
	},
	onCheckedChange:function(v){
		if(this.baseJqo){
			if(v)this.baseJqo.addClass('checked');
			else this.baseJqo.removeClass('checked');
		}
	},
	getHVal:function(){
		return this.checked();
	},
	setHVal:function(v){
		this.checked(v);
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		var v=this.crtJQO('lable');
		var sb=this.crtJQO('span','icon');
		v.append(sb);
		return v;
	}
});