
function takEmunSv(){
	this.tmpUrl='data/model/';
	//缓存
	this.tmpSonre=new Map();
}
defSvr('cvtSv',takEmunSv,{
	loadOpt:function(data,cb){
		if(!data||!data.param){
			cb(false,null,null,"模板类型为空");
			return;
		}
		var ts=this.tmpSonre;
		
		var req=data.param;
		var r=ts.get(data.param);
		if(r&&data.isRef!=true){
			cb(true,r,null,null);
			return;
		}
		if(req.indexOf('/')==0)req=req.substr(1,req.length-1);
		dxGet(this.tmpUrl+req,function(complate,d,code,msg){
			if(complate){
				if(!d){
					cb(false,null,code,"服务器响应数据无效");
				} else {
					ts.set(req,d);
					setTimeout(function(){
						cb(true,d,null,null);
					},5000);//为了展示加载效果做了延迟处理
				}
			} else cb(complate,null,code,msg);
		});
	}
});



