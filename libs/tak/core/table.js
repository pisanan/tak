/**
 * 代理方法
 * */
function TableV(){
}
defCls(TableV,ListV,{
	defDlg:{
		/**
		 * 创建表头，如果不显示表头
		 * @param {TableV} tv 当前列表控件
		 * */
		tableVGenHead:function(tv){
			
		},
		/**
		 * 删除行，未实现默认释放视图控件
		 * @param {TableV} tv 当前列表控件
		 * @param {TakView} iv 要删除的行显示控件
		 * */
		tableVRmRow:function(tv,iv){
			iv.dispose();
		},
		/**
		 * 获取行数量
		 * @param {TableV} tv 当前列表控件
		 * */
		tableVRowCount:function(tv){
			var v=tv.val();
			return tak.iAry(v)?v.length:0;
		},
		/**
		 * 获取项目数量
		 * @param {TableV} tv 当前列表控件
		 * @param {Number} index 行的索引
		 * @param {Object} tmp 默认配置的行控件模板
		 * */
		tableVNewRow:function(tv,index,tmp){
			var iv=this.addTObj({id:'item_'+index.toString()});
			if(iv){
				var v=tv.val();
				if(tak.iAry(v)&&v.length>index)iv.val(v[index]);
			}
			return iv;
		},
		/**
		 * 创建当前控件值，并初始化（如果需要，也可以直接返回当前控件的val）
		 * @param {TableV} tv 当前列表控件
		 * */
		tableVGenVal:function(tv){
			return [];
		},
		/**
		 * 获取项目数量
		 * @param {TableV} tv 当前列表控件
		 * @param {Array} val 当前列表控件要返回的数据
		 * @param {Object} rv 当前行控件
		 * */
		tableVRowVal:function(tv,val,rv){
			if(!val)val=[];
			else if(!tak.iAry(val))val=[val];
			val.push(rv.getHVal());
			return val;
		}
	},
	//重写listV的代理调用方法，方便控制器函数区分
	genVal:function(){
		return this.doDlgFun('tableVGenVal',[this]);
	},
	execItemVal:function(mv,iv){
		return this.doDlgFun('tableVRowVal',[this,mv,iv]);
	},
	rmItemView:function(iv){
		this.doDlgFun('tableVRmRow',[this,iv]);
	},
	getItemCount:function(){
		return this.doDlgFun('tableVRowCount',[this]);
	},
	genItemView:function(index){
		return this.doDlgFun('tableVNewRow',[this,index,this.subDef]);
	},
	genHeader:function(){
		this.doDlgFun('tableVGenHead',[this]);
	},
	onCrtPro:function(opt){
		ListV.prototype.onCrtPro.call(this,opt);
		this.subDef={type:"RowV"};
		this.fixHead=false;
	},
	onInit:function(opt){
		ListV.prototype.onInit.call(this,opt);
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		var bv= this.crtJQO(this.tag).append(this.crtTableJQ());
		var mv=this;
		return bv;
	},
	crtTableJQ:function(){
		var table= this.crtJQO('table','table');
		return table;
	},
	//获取容器渲染对象，如果没有定义rMap,则直接渲染到baseJqo
	getJqoCon:function(v){
		var to;
		if(tak.ckTN(v,RowV))to=v.rType;
		var tJq=this.getJQO('table');
		if(!tak.hStr(to))return tJq;
		var jqo=this.getJQO(to);
		if(!jqo){
			var con;
			switch(to){
				case 'head':
					con=this.headJqo;
					if(!con){
						con=this.crtJQO('tHead','head');
						tJq.append(con);
						this.headJqo=con;
					}
					break;
				case 'foot':
					con=this.footJqo;
					if(!con){
						con=this.crtJQO('tFoot','foot');
						tJq.append(con);
						this.footJqo=con;
					}
					break;
				default:
					con=this.bodyJqo;
					if(!con){
						con=this.crtJQO('tBody','body');
						tJq.append(con);
						this.bodyJqo=con;
					}
					break;
			}
			return con;
		}else return jqo;
	},
	viewDlg:function(dlg){
		ListV.prototype.viewDlg.call(this,dlg);
		var hv=this.genHeader();
		if(hv)this.addSub(hv);
	},
	eachRows:function(f,o){
		this.eachItems(f,o);
	},
})


/**
 * 表格行控件
 * */
function RowV(){
}
defCls(RowV,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.subDef={type:'CallV'};
		this.tag='tr';
		this.rType='body';
	},
	onInit:function(opt){
		takView.prototype.onInit.call(this,opt);
		if(tak.hStr(opt.rType)){
			this.rType=opt.rType;
			if(this.rType=='head')this.subDef.tag='th';
		}
	},
	onLoad:function(opt){
		takView.prototype.onLoad.call(this,opt);
		this.genFileds(opt.fileds);
	},
	genFileds:function(opt){
		if(tak.iObj(opt)){
			var f;
			for(var i in opt){
				f=opt[i];
				f.id='c_'+i;
				this.addSub(this.newObj(f,this.subDef));
			}
		}
	},
	//获取对象容器，如果没有定义vMap,则直接添加到自身下级
	getConObj:function(o){
		var oc;
		if(o.pro)oc=o.pro['onCell'];
		if(!tak.hStr(oc))oc=o.id;
		if(oc)return this.getCell(oc);
	},
	//根据id读取单元格
	getCell:function(id){
		return this.getChild('c_'+id);
	}
})

/**
 * 表格单元格控件
 * */
function CallV(){
}
defCls(CallV,takView,{
	onCrtPro:function(opt){
		takView.prototype.onCrtPro.call(this,opt);
		this.tag='td';
		this.vhName='base';
	},
	onInit:function(opt){
		takView.prototype.onInit.call(this,opt);
		if(this.tag=='th')this.isHead=true;//如果是行头，加个div？
		if(opt.lView)this.initLV(opt.lView);
		if(opt.rView)this.initRV(opt.rView);
	},
	onLoad:function(opt){
		takView.prototype.onLoad.call(this,opt);
		if(this.isHead)this.val(this.getName());
	},
	initLV:function(tmp){
		var lv=this.newObj(tmp,this.subDef);
		if(lv){
			this.lView=lv;
			this.addSub(lv);
		}
	},
	initRV:function(tmp){
		var rv=this.newObj(tmp,this.subDef);
		if(rv){
			this.rView=rv;
			this.addSub(rv);
		}
	},
	getIptJId:function(){
		return this.vhName;
	},
	/**
 	* 生成页面对象
 	* */
	create:function(){
		var c=this.crtJQO(this.tag);
		if(this.lView||this.rView){
			this.vhName='valSp';
			c.append(this.crtJQO('span',this.vhName));
		}
		return c;
	},
	getJqoCon:function(v){
		return this.getJQO(this.vhName);
	},
	appendView:function(mJqo,v){
		if(v==this.lView)v.baseJqo.insertBefore(mJqo);
		else if(v==this.rView)v.baseJqo.insertAfter(mJqo);
		else{
			if(!this.cViews){
				mJqo.empty();
				this.cViews=[];
			}
			this.cViews.push(v);
			mJqo.append(v.baseJqo);
		}
	},
	getHVal:function(){
		if(this.rended&&!this.cViews)return this.getJQVal(this.getIptJId());
		else return this.__val__;
	},
	setHVal:function(v){
		if(this.rended&&!this.cViews)this.setJQVal(v,this.getIptJId());
	},
	onRmSubed:function(o){
		takView.prototype.onRmSubed.call(this,o);
		if(this.cViews){
			for(var i=0;i<this.cViews;i++){
				if(this.cViews[i]==o){
					this.cViews.splice(i,1);
					break;
				}
			}
			if(this.cViews.length==0){
				this.cViews=null;
				this.reVal();
			}
		}
	}
})
