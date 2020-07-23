
function MenuV(){
}
defCls(MenuV,TreeV,{
	onCrtPro:function(opt){
		TreeV.prototype.onCrtPro.call(this,opt);
		tak.genPro(this,'active',false,this.activeChange);
		this.namePn='name';
		this.iconPn='icon';
	},
	onInit:function(opt){
		TreeV.prototype.onInit.call(this,opt);
		if(tak.hStr(opt.namePn))this.namePn=opt.namePn;
		if(tak.hStr(opt.iconPn))this.iconPn=opt.iconPn;
	},
	onRended:function(){
		TreeV.prototype.onRended.call(this);
		if(!this.isRoot){
			this.bindJQEvF('click',this.getOpenTgtName(),function(){
				if(this.hasSubNode())this.openState=!this.openState;
				else this.active=true;
			},this);
		}
		if(this.hasSubNode())this.getArrow();
	},
	activeChange:function(ov,nv){
		var ok=tak.iBool(nv)&&!this.isRoot;
		if(ok){
			this.onActiveChange(nv);
			this.getRoot().doEv('activeChanged',this);
		}
		return ok;
	},
	onActiveChange:function(nv){
		if(nv){
			this.getRoot().doEv('doAction',this);
			this.baseJqo.addClass('active');
			if(tak.ckTN(this.parent,MenuV))this.parent.active=true;
		}else {
			this.baseJqo.removeClass('active');
			if(tak.ckTN(this.parent,MenuV))this.parent.active=false;
		}
	},
	//展开状态改变
	onOpenStateChange:function(nv){
		TreeV.prototype.onOpenStateChange.call(this,nv);
		if(nv){//关闭同级节点
			var an=this.funBrother(function(n){if(n.openState)return true;});
			if(an)an.openState=false;
		}
		if(this.hasSubNode()){
			if(nv)this.setOpenAw(1);
			else this.setOpenAw(-1);
		}else this.setOpenAw(0);
	},
	//节点数量改变
	onNodeCountChange:function(){
		if(this.hasSubNode()){
			if(this.openState)this.setOpenAw(1);
			else this.setOpenAw(-1);
		}else this.setOpenAw(0);
	},
	//渲染标题
	rendContent:function(bv){
		var a=this.crtJQO('a','item');
		a.append(this.crtJQO('span','title'));
		var ul=this.getJQO('subCon');
		if(ul)a.insertBefore(ul);
		else bv.append(a);
		return a;
	},
	//渲染箭头
	rendArrow:function(bv){
		var ar;
		this.getJQO('item',function(t){
			ar=this.crtJQO('span','arrow');
			t.append(ar);
		});
		return ar;
	},
	//获取当前节点的子视图容器
	getViewCon:function(nc){
		var vc=this.getJQO('item');
		if(!vc&&nc!=false)vc=this.rendContent(this.baseJqo);
		return vc;
	},
	//获取箭头视图
	getArrow:function(){
		var vc=this.getJQO('arrow');
		if(!vc)vc=this.rendArrow();
		return vc;
	},
	getOpenTgtName:function(){
		return 'item';
	},
	setRootVal:function(v){
		if(tak.iObj(v)){
			var t=v[this.namePn];
			if(tak.hStr(t))document.title = t;
		}
	},
	//设置节点显示内容
	setNodeVal:function(v){
		if(tak.iObj(v)){
			this.setIcon(v[this.iconPn]);
			this.setName(v[this.namePn]);
		}
	},
	setIcon:function(ic){
		var ico=this.getJQO('icon');
		if(ico){
			if(tak.hStr(ic))ico.addClass(ic);
			else this.rmJQO('icon');
		}else if(tak.hStr(ic)){
			this.getJQO('item',function(t){
				t.prepend(this.crtJQO('i','icon',{'class':ic}));
			});
		}
	},
	setName:function(name){
		this.setJQVal(name,'title');
	},
	//设置开启状态状态 -1 表示关闭，0表示没有子集，1表示打开
	setOpenAw:function(ss){
		if(ss!=0)this.getArrow();
		else this.rmJQO('arrow');
	},
});

