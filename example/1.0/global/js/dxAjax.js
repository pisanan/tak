
function dxAjax(url,requestType,contentType,data,complateHandle){
	$.ajax({
		type:requestType,
		url:url,
		async:true,
		contentType:contentType,
		data:JSON.stringify(data),
		error:function(xhr,status,e){
			console.log(url+'=======>error status:'+status+' error:'+e);
			//success,result, code, msg
			var msg="无";
			if(typeof(e)=="string")msg=e;
			else if(typeof(e)=="object")msg=e.message;
			complateHandle(false,null,"9999",msg);
		},
		success:function(result,status,xhr){
			console.log(url+'=======>success result:'+JSON.stringify(result)+' status:'+status);
			if(result==null)
				complateHandle(false,null,"9998","响应结果格式错误，请联系技术人员。");
			else if(!result.success){
				var msg=result.msg;
				var code=result.code;
				if(strIsEmpt(msg))
					msg="未知错误";
				if(strIsEmpt(code))
					code="9997";
				complateHandle(false,null,code,msg);
			} else {
				complateHandle(true,result.data,result.code,result.msg);
			}
		}
	});
}

function dxGet(url,complateHandle){
	dxAjax(url,"GET","text/json",null,complateHandle);
}

function dxPost(url,contentType,data,complateHandle){
	dxAjax(url,"POST",contentType,data,complateHandle);
}

function dxPostNoCT(url,data,complateHandle){
	dxAjax(url,"POST","text/json",data,complateHandle)
}



