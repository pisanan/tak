
function takEmpService(){
	this.tmpUrl='data/model/';
}
defSvr('empSvr',takEmpService,{
	getModel:function(data,cb){
		if(!data||!data.param){
			cb(false,null,null,"模板类型为空");
			return;
		}
		var req=data.param;
		if(req.indexOf('/')==0)req=req.substr(1,req.length-1);
		dxGet(this.tmpUrl+req,function(complate,data,code,msg){
			if(complate){
				if(!data){
					cb(false,null,code,"服务器响应数据无效");
				} else {
					setTimeout(function(){
						cb(true,data,null,null);
					},2000);//为了展示加载效果做了延迟处理
				}
			} else cb(complate,null,code,msg);
		});
	},
	add:function(data,cb){
		setTimeout(function(){
			console.log('add_Complate:'+JSON.stringify(data));
			cb(true,data,null,null);
		},1000);//为了展示加载效果做了延迟处理
	},
	del:function(data,cb){
		setTimeout(function(){
			console.log('del_Complate:'+JSON.stringify(data));
			cb(true,data,null,null);
		},1000);//为了展示加载效果做了延迟处理
	},
	upd:function(data,cb){
		setTimeout(function(){
			console.log('upd_Complate:'+JSON.stringify(data));
			cb(true,data,null,null);
		},1000);//为了展示加载效果做了延迟处理
	}
});