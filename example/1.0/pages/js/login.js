var Login = function() {
	var mainUrl;
    var handleLogin = function() {
        $('.login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                }
            },
            messages: {
                username: {
                    required: "请输入用户名."
                },
                password: {
                    required: "请输入密码."
                }
            },
            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },
            submitHandler: function(form) {
                //doLogin();
            }
        });
        $('.login-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    doLogin();
                }
                return false;
            }
        });
        $("input[name='btnLogin']").click(function(e){
        	if ($('.login-form').validate().form()) {
                    doLogin();
               }
        });
    }
    
    var doLogin=function(){
    	empLogin($('.login-form').attr("action"),$("input[name='username']").val(),$("input[name='password']").val(),function(ok,msg){
    		if(ok){
    			window.location.href=mainUrl;
    		} else{
    			showError("登录失败："+msg);
    		}
    	});
    }
    
    var showError=function(msg){
    	console.log(msg);
    	$('#modalMsgP').html(msg);
    	$('#modalMsg').modal();
    }

    return {
        //main function to initiate the module
        init: function(mUrl) {
            handleLogin();
            mainUrl=mUrl;
        }

    };

}();

