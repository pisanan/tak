
/**
 * 树型行控件
 * */
function TreeV(){
}
defCls(TreeV,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		tak.genPro(this,'openState',opt.isOpen=='1',this.openStateChange);
		tak.genPro(this,'isRoot',false,function(ov,nv){ 
			if(!ov){
				this.openState=true;//如果是根节点，则自动展开
				return true;
			}
			else return false;
		});
		this.nodeTmp=opt;
		this.subPn='subs';
		this.nodes=[];
		this.subId=0;
	},
	onInit:function(opt){
		takView.prototype.onInit.call(this,opt);
		if(tak.iObj(opt.nodeTmp))this.nodeTmp=opt.nodeTmp;
		if(tak.hStr(opt.subPn))this.subPn=opt.subPn;
	},
	//获取对象容器，如果没有定义vMap,则直接添加到自身下级
	getConObj:function(o){
		return this;
	},
	getRoot:function(){
		if(this.isRoot)return this;
		if(tak.ckTN(this.parent,TreeV))return this.parent.getRoot();
		else return this;
	},
	//往上追溯，执行函数。lv -1表示不限级数
	parentDo:function(on,fun,lv){
		if(isNull(lv))lv=-1;
		if(tak.ckTN(this.parent,TreeV)){
			fun.call(on,this.parent);
			if(lv<0||lv>0){
				lv--;
				this.parent.parentDo(on,fun,lv);
			}
		}
	},
	//查找兄弟节点
	funBrother:function(flt){
		if(tak.ckTN(this.parent,TreeV)){
			return this.parent.findNode(flt,1,this);
		}
	},
	//查找子节点  lv -1表示不限级数,fr 查找来源，因为这里会被递归调用，所以需要排除自己
	findNode:function(flt,lv,fr){
		if(!fr)fr=this;
		if(isNull(lv))lv=-1;
		var t,n;
		for(var i=0;i<this.nodes.length;i++){
			n=this.nodes[i];
			if(n!=fr&&flt.call(fr,n))return n;
		}
		if(lv<0||lv>0){
			lv--;
			for(var i=0;i<this.nodes.length;i++){
				n=this.nodes[i];
				t=n.findNode(flt,lv,fr);
				if(t)return t;
			}
		}
	},
	//从根节点开始查找节点  lv -1表示不限级数,fr 查找来源，用来排除自己
	findNodeFR:function(flt,lv){
		if(isNull(lv))lv=-1;
		var r=this.getRoot();
		if(r)return r.findNode(flt,lv,this);
	},
	getLevel:function(){
		if(this.isRoot)return 0;
		if(tak.ckTN(this.parent,TreeV)){
			var lv=this.parent.getLevel();
			if(lv>=0)return lv+1;
			else return -1;
		}else return -1;
	},
	//父级对象改变检查自身是否是根节点属性
	onParentChanged:function(nv){
		takView.prototype.onParentChanged.call(this,nv);
		var it=tak.ckTN(nv,TreeV);
		this.isRoot=!it;
	},
	openStateChange:function(ov,nv){
		var ok=tak.iBool(nv);
		if(ok){
			this.onOpenStateChange(nv);
			this.getRoot().doEv('openStateChanged',this);
		}
		return ok;
	},
	//展开状态改变
	onOpenStateChange:function(nv){
		this.setSubCon(this.baseJqo,nv);
	},
	setSubCon:function(bj,nv){
		if(bj){
			if(nv){
				bj.removeClass('nClose');
				bj.addClass('nOpen');
			}
			else {
				bj.removeClass('nOpen');
				bj.addClass('nClose');
			}
		}
	},
	//节点数量改变
	onNodeCountChange:function(){
		if(!this.hasSubNode())this.rmJQO('subCon');
	},
	//是否有子节点
	hasSubNode:function(){
		return this.nodes.length>0;
	},
	setOpenState:function(state,lv){
		if(isNull(lv))lv=0;
		this.openState=state;
		if(lv>0||lv<0){
			lv--;
			for(var i=0;i<this.nodes.length;i++){
				this.nodes[i].setOpenState(state,lv);
			}
		}
	},
	open:function(lv){
		this.setOpenState(true,lv);
	},
	close:function(lv){
		this.setOpenState(false,lv);
	},
	/**
	 * 读取值
	 * */
	getHVal:function(){
		var v={};
		if(this.nodes.length>0){
			v[this.subPn]=[];
			var sv;
			for(var i=0;i<this.nodes.length;i++){
				sv=this.nodes[i].getVal();
				if(!isNull(sv))v[this.subPn].push(sv);
			}
		}
		return v;
	},
	setHVal:function(v){
		this.reSetNodes(v);
	},
	rendContent:function(bv){
		
	},
	//渲染下级节点ul标签
	rendSubTag:function(){
		var ul=this.crtJQO('ul','subCon');
		this.baseJqo.append(ul);
		return ul;
	},
	create:function(){
		var c;
		if(tak.ckTN(this.parent,TreeV))c=this.crtJQO('li','base');
		else c=this.crtJQO('div','divCon');
		var lv=this.getLevel();
		c.addClass('leve'+lv.toString());
		this.setSubCon(c,this.openState);
		if(!this.isRoot)this.rendContent(c);
		return c;
	},
	//获取下级控件容器
	getSubCon:function(nc){
		var sc=this.getJQO('subCon');
		if(!sc&&nc!=false)sc=this.rendSubTag();
		return sc;
	},
	//获取当前节点的子视图容器
	getViewCon:function(nc){
		return null;
	},
	//移除节点下的子节点
	clearNodes:function(){
		var n;
		while(this.nodes.length>0){
			n=this.nodes[0];
			if(n.owner==this)n.dispose()
			else n.remove();
		}
	},
	//刷新树结构
	reSetNodes:function(v){
		this.clearNodes();
		if(!this.isRoot)this.setNodeVal(v);
		else this.setRootVal(v);
		this.crtNodes(v);
	},
	setRootVal:function(v){
		
	},
	//设置节点显示内容
	setNodeVal:function(v){
		
	},
	//创建子节点
	crtNodes:function(v){
		if(tak.iObj(v)){
			var sb=v[this.subPn];
			if(sb){
				tak.eachAry(this,sb,function(o){
					this.newNode(o);
				});
			}
		}
	},
	//创建新节点
	newNode:function(v){
		var node=this.newObj({id:'node_'+this.subId.toString()},this.nodeTmp);
		if(node){
			node.val(v);
			this.addSub(node);
			this.subId++;
		}
		return node;
	},
	getJqoCon:function(v){
		if(tak.ckTN(v,TreeV))return this.getSubCon();
		else return this.getViewCon();
	},
	onAdSubed:function(o){
		if(tak.ckTN(o,TreeV)){
			this.nodes.push(o);
			this.onNodeCountChange();
		}
		takView.prototype.onAdSubed.call(this,o);
	},
	onRmSubed:function(o){
		takView.prototype.onRmSubed.call(this,o);
		if(tak.ckTN(o,TreeV)){
			var i=this.nodes.indexOf(o);
			if(i>=0){
				this.nodes.splice(i,1);
				this.onNodeCountChange();
			}
		}
	},
	onRemove:function(){
		this.clearNodes();
		takView.prototype.onRemove.call(this);
	},
})
