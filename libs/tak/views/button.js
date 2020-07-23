
//按钮视图
function Button(){
}
defCls(Button,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.tag='button';
		this.namePn='name';
		this.iconPn='icon';
	},
	/**
	 * 初始化配置
	 * 该方法在创建html之前调用
	 * */
	onInit:function(opt){
		takView.prototype.onInit.call(this,opt);
		if(opt.tag=='a')this.tag='a';
		if(tak.hStr(opt.namePn))this.namePn=opt.namePn;
		if(tak.hStr(opt.iconPn))this.iconPn=opt.iconPn;
	},
	getIptJId:function(){
		return 'txt';
	},
	addTxtTag:function(t){
		this.baseJqo.append(t);
	},
	addIconTag:function(t){
		this.baseJqo.prepend(t);
	},
	setTxtVal:function(v){
		if(tak.hStr(v)){
			var t=this.getJQO('txt',function(b){
				b.html(v);
			});
			if(!t){
				t=this.crtJQO('span','txt').html(v);
				this.addTxtTag(t);
			}
		}else this.rmJQO('txt');
		this.doEv('textChanged',v);
	},
	setIconVal:function(ic){
		if(tak.hStr(ic)){
			var i=this.getJQO('icon',function(v){
				v.attr("class",ic);
			});
			if(!i&&tak.hStr(ic)){
				i=this.crtJQO('i','icon');
				i.attr("class",ic);
				this.addIconTag(i);
			}
		}else this.rmJQO('icon');
	},
	setHVal:function(v){
		var t,i;
		if(tak.hStr(v)){
			t=v;i=null;
		}else if(tak.iObj(v)){
			t=v[this.namePn];
			i=v[this.iconPn];
		}
		if(tak.hStr(t))this.setTxtVal(t);
		if(!tak.hStr(i))i=this.getPro('icon');
		this.setIconVal(i);
	},
	onRended:function(){
		var v=this.getName();
		if(tak.hStr(v))this.setTxtVal(v);
		takView.prototype.onRended.call(this);
		v=this.val();
		if(!v)this.setIconVal(this.getPro('icon'));
	},
});


function TabBtnV(){
}
defCls(TabBtnV,Button,{
	onCrtPro:function(opt){
		Button.prototype.onCrtPro.call(this,opt);
		this.tag='div';
		this.closePn='close';
	},
	onInit:function(opt){
		Button.prototype.onInit.call(this,opt);
		this.tag='div';
		if(tak.hStr(opt.closePn))this.closePn=opt.closePn;
	},
	addTxtTag:function(t){
		var j=this.getJQO('icon');
		if(j)t.insertAfter(j);
		else{
			j=this.getJQO('btn');
			if(j)j.append(t);
		}
	},
	addIconTag:function(t){
		this.getJQO('btn',function(b){
			b.prepend(t);
		});
	},
	setHVal:function(v){
		Button.prototype.setHVal.call(this,v);
		if(tak.iObj(v)){
			if(v[this.closePn]=='0'){
				this.rmJQO('cIcon');
				this.rmJQO('close');
			}
		}
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		var bv= this.crtJQO(this.tag);
		var btn=this.crtJQO('a','btn');
		bv.append(btn);
		btn=this.crtJQO('a','close');
		var ci= this.crtJQO('i','cIcon');
		btn.append(ci);
		bv.append(btn);
		return bv;
	},
	onRended:function(){
		Button.prototype.onRended.call(this);
		this.bindJQEvF('click','close',function(e){
			this.doEv('closeClick');
		},this);
	}
})

function BtnListV(){
	
}
defCls(BtnListV,Button,{
	onCrtPro:function(opt){
		Button.prototype.onCrtPro.call(this,opt);
		this.subDef={type:'Button',tag:'a'};
		this.tag='div';
		this.btnTag='a';
		this.subLiId=0;
	},
	addTxtTag:function(t){
		var j=this.getJQO('icon');
		if(j)t.insertAfter(j);
		else{
			j=this.getJQO('arrow');
			if(j)t.insertBefore(j);
			else{
				j=this.getJQO('btn');
				if(j)j.append(t);
			}
		}
	},
	addIconTag:function(t){
		this.getJQO('btn',function(b){
			b.prepend(t);
		});
	},
	//获取对象容器，如果没有定义vMap,则直接添加到自身下级
	getConObj:function(o){
		return this;
	},
	defEvenJqo:function(){
		return 'btn;'
	},
	getDropUl:function(){
		var jq=this.getJQO('dropUl');
		if(!jq){
			jq=this.crtJQO('ul','dropUl');
			this.baseJqo.append(jq);
		}
		return jq;
	},
	getDropLi:function(v){
		if(this.btnCons){
			var c;
			for(var i in this.btnCons){
				c=this.btnCons[i];
				if(c.view==v)return c;
			}
		}
	},
	crtDropLi:function(v){
		if(!this.btnCons)this.btnCons={};
		var ul=this.getDropUl();
		var liId='li_'+this.subLiId;
		this.subLiId++;
		var li=this.crtJQO('li',liId,'dropLi');
		ul.append(li);
		li={id:liId,li:li,view:v}
		this.btnCons[liId]=li;
		return li;
	},
	checkArrow:function(){
		var a=this.getJQO('arrow');
		if(!a){
			this.getJQO('btn',function(b){
				b.prepend(this.crtJQO('i','arrow'));
			});
		}
	},
	rmArrow:function(){
		this.rmJQO('arrow');
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		var bv= this.crtJQO(this.tag);
		var btn=this.crtJQO(this.btnTag,'btn');
		bv.append(btn);
		return bv;
	},
	getJqoCon:function(v){
		var li= this.getDropLi(v);
		if(!li)li=this.crtDropLi(v);
		return li.li;
	},
	rendSub:function(v){
		if(v)v.rend(this);
		this.checkArrow();
	},
	onRmSubed:function(o){
		Button.prototype.onRmSubed.call(this,o);
		var li=this.getDropLi(o);
		if(li){
			this.rmJQO(li.id);
			delete this.btnCons[li.id];
			if(!this.subs||this.subs.length==0)this.rmArrow();
		}
	},
})