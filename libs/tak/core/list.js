/**
 * 视图容器控件
 * */
function ListV(){
}
defCls(ListV,takView,{
	defDlg:{
		/**
		 * 删除项，未实现默认释放视图控件
		 * @param {ListV} lv 当前列表控件
		 * @param {TakView} iView 要删除的item显示控件
		 * */
		listVRmItem:function(lv,iv){
			iv.dispose();
		},
		/**
		 * 获取项目数量
		 * @param {ListV} lv 当前列表控件
		 * */
		listVItemCount:function(lv){
			var v=lv.val();
			return tak.iAry(v)?v.length:0;
		},
		/**
		 * 获取项目数量
		 * @param {ListV} lv 当前列表控件
		 * @param {Number} id item的索引
		 * @param {Object} tmp 默认配置的item控件模板
		 * */
		listVNewItem:function(lv,index,tmp){
			var iv=this.addTObj({id:'item_'+index.toString()});
			if(iv){
				var v=lv.val();
				if(tak.iAry(v)&&v.length>index)iv.val(v[index]);
			}
			return iv;
		},
		/**
		 * 创建当前控件值，并初始化（如果需要，也可以直接返回当前控件的val）
		 * @param {ListV} lv 当前列表控件
		 * */
		listVGenVal:function(lv){
			return [];
		},
		/**
		 * 获取项目数量
		 * @param {ListV} lv 当前列表控件
		 * @param {Array} val 当前列表控件要返回的数据
		 * @param {Object} iv item控件
		 * */
		listVItemVal:function(lv,val,iv){
			if(!val)val=[];
			else if(!tak.iAry(val))val=[val];
			val.push(iv.getHVal());
			return val;
		}
	},
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.subDef={type:"SpanV"};
		this.rowId=0;//当前行id 和总行数并不一一对应，如果做了删除操作，rowId会比rowcount大。
		this.items=[];
	},
	onDlgChanged:function(){
		takView.prototype.onDlgChanged.call(this);
		this.reVal();
	},
	willDlgChanged:function(){
		takView.prototype.willDlgChanged.call(this);
		this.clearItems();
	},
	
	genVal:function(){
		return this.doDlgFun('listVGenVal',[this]);
	},
	execItemVal:function(mv,iv){
		return this.doDlgFun('listVItemVal',[this,mv,iv]);
	},
	rmItemView:function(iv){
		this.doDlgFun('listVRmItem',[this,iv]);
	},
	getItemCount:function(){
		return this.doDlgFun('listVItemCount',[this]);
	},
	genItemView:function(index){
		return this.doDlgFun('listVNewItem',[this,index,this.subDef]);
	},
	/**
	 * 读取值
	 * */
	getHVal:function(){
		var item,v=this.genVal();
		for(var i=0;i<this.items.length;i++){
			item=this.items[i];
			v=this.execItemVal(v,item.view);
		}
		return v;
	},
	/**
	 * 通过id读取子项
	 * */
	getItem:function(index){
		var item;
		for(var i=0;i<this.items.length;i++){
			item=this.items[i];
			if(item.id==id)return item;
		}
	},
	/**
	 * 通过id移除项目
	 * */
	removeId:function(index){
		return this.removeItem(this.getItem(index));
	},
	/**
	 * 移除项目
	 * */
	removeItem:function(item){
		if(item){
			this.rmItemView(item.view);
			var i=this.items.indexOf(item);
			if(i>=0){
				this.items.splice(i,1);
				return true;
			}
		}
		return false;
	},
	//清空
	clearItems:function(){
		var item,r;
		for(var i=0;i<this.items.length;i++){
			item=this.items[i];
			if(this.removeItem(this.items[i]))i--;
		}
		this.rowId=0;
	},
	setHVal:function(v){
		this.reSetItems();
	},
	reSetItems:function(){
		this.clearItems();
		var c=this.getItemCount();
		for(var i=0;i<c;i++){
			this.newItem();
		}
	},
	newItem:function(){
		var iv=this.genItemView(this.rowId);
		if(iv){
			this.addSub(iv);
			this.items.push({id:this.rowId,view:iv});
			this.rowId++;
		}
	},
	eachItems:function(f,o){
		if(tak.iFun(f)){
			for(var i=0;i<this.items.length;i++){
				f.call(o,this.items[i]);
			}
		}
	},
})