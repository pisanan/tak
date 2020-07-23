
function employeeService(url){
	this.url=url;
}

employeeService.prototype.login=function(req,complateHandle){
	dxPostNoCT("data/model/employee.json",req,complateHandle);
}

employeeService.prototype.find=function(req,isRef,complateHandle){
	dxGet("data/model/employee.json",function(complate,data,code,msg){
			if(complate){
				if(!data){
					complateHandle(false,null,code,"服务器响应数据无效");
				} else {
					setTimeout(function(){
						complateHandle(true,data,null,null);
					},1000);
				}
				
			} else {
				complateHandle(complate,null,code,msg);
			}
	});
}

employeeService.prototype.select=function(req,isPage,pIndex,pSize,isRef,complateHandle){
	dxGet("data/model/employee.json",function(complate,data,code,msg){
			if(complate){
				if(!data){
					complateHandle(false,null,code,"服务器响应数据无效");
				} else {
					setTimeout(function(){
						complateHandle(true,data,null,null);
					},2000);
				}
				
			} else {
				complateHandle(complate,null,code,msg);
			}
	});
}