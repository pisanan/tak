
//包装器
function takValider(){
}
defCls(takValider,{
	init:function(owner,opt){
		this.owner=owner;
		if(tak.hStr(opt)) this.opt={dType:opt};
		else this.opt=opt;
		if(!tak.iObj(this.opt))return;
		this.ec='tak-error';
		if(opt.errCls)this.ec=opt.errCls;
		return this;
	},
	valid:function(){
		var v=this.owner.getHVal();
		if(!this.opt)return {s: true,v: v};
		var cfn,cfv;
		if(tak.hStr(this.opt.cpTo)){
			var cv=this.owner.owner.getChild(this.opt.cpTo);
			if(cv){
				cfn=cv.getName();
				cfv=cv.getHVal();
			}
		}
		var r=takValidF(v,this.opt,this.owner.getName(),cfn,cfv);
		if(this.owner.baseJqo&&tak.hStr(this.ec)){
			if(r.s!=true)this.owner.baseJqo.addClass(this.ec);
			else this.owner.baseJqo.removeClass(this.ec);
		}
		return r;
	}
})
/**
 * 数据校验和数据转换，如果是数值类型，会自动转换。
 * @param {String}v 待校验的值
 * @param {Object}opt 如果直接传字符串则作为dType使用  
 * 					    属性：dType数据类型(takValidF.prototype中的方法名) 
 * 							req 字符串1表示必填
 * 							reg 自定义正则表达式校验
 * 							minL 最小长度
 * 							maxL 最大长度
 * 							minV 最小值
 * 							maxV 最大值
 *	 						minC 最小条数 数组有效
 * 							maxC 最大条数 数组有效
 * 							suf  后缀
 * 							pre  前缀
 * 							cpType 与别的控件值进行比较的比较方式，cpTo有值时有效 -2 小于 -1 小于等于 0等于  1 大于等于 2大于 默认取0
 * 							cpTo 与其他控件比较的控件id（必须是同一个父控件，注意是父控件不是同一个容器）
 * @param {String}fn 当前字段名称
 * @param {String}ct 字段比较方式   配置中的cpType
 * @param {String}efn 比较的字段名称   配置中的cpTo
 * @param {Object}efv 比较的字段的值
 * @return {Object} 属性：s boolean是否检查通过，m String错误消息 v转换过后的值
 * */
function takValidF(v, opt, fn, cfn,cfv) {
	if(v == undefined) v = null;
	var vf,ct=opt.cpType, r = {
		s: true,
		v: v
	};
	if(tak.hStr(opt.dType))vf=takValidF.prototype[opt.dType];
	if(tak.hStr(v)&&tak.iFun(vf)){
		r=vf(r);
		if(!r.s){
			if(r.m.indexOf("为")==0)r.m=fn+r.m;
			else r.m=fn+":请填写正确的"+r.m;
			return r;
		}
	}
	var msg="";
	if(opt.req == "1"){
		msg="必填";
		r.s=(!isNull(v)&&!tak.eStr(v)&&!tak.eAry(v));
	}
	if(tak.hStr(cfn)){
		if(ct=='-2'&&cfv>=v){
			r.s=false;
			msg=tak.strJoin(msg,"必须小于"+cfn,",且");
		}else if(ct=='-1'&&cfv>v){
			r.s=false;
			msg=tak.strJoin(msg,"必须小于等于"+cfn,",且");
		}else if(ct=='2'&&cfv<=v){
			r.s=false;
			msg=tak.strJoin(msg,"必须大于"+cfn,",且");
		}else if(ct=='1'&&cfv<v){
			r.s=false;
			msg=tak.strJoin(msg,"必须大于等于"+cfn,",且");
		}else if(cfv!=v){
			r.s=false;
			msg=tak.strJoin(msg,"必须等于"+cfn,",且");
		}
	}
	if(tak.hStr(opt.pre)){
		msg=tak.strJoin(msg,"以"+opt.pre+"开头","且");
		if(r.s&&tak.hStr(v))r.s=(v>=opt.minV);
	}
	if(tak.hStr(opt.suf)){
		msg=tak.strJoin(msg,"以"+opt.suf+"结尾","且");
		if(r.s&&tak.hStr(v))r.s=(v<=opt.maxV);
	}
	
	if(tak.hStr(opt.minL)&&tak.hStr(opt.maxL)){
		var il=parseInt(opt.minL, 10);
		var al=parseInt(opt.maxL, 10);
		if(il==al)msg=tak.strJoin(msg,"长度为"+il,"且");
		else msg=tak.strJoin(msg,"长度为"+il+"到"+al+"之间",",且");
		if(r.s&&tak.hStr(v))r.s=(v.length>=il&&v.length<=al);
	}else if(tak.hStr(opt.minL)){
		var il=parseInt(opt.minL, 10);
		msg=tak.strJoin(msg,"长度不能小于"+il,",且");
		if(r.s&&tak.hStr(v))r.s=(v.length>=il);
	}else if(tak.hStr(opt.maxL)){
		var al=parseInt(opt.maxL, 10);
		msg=tak.strJoin(msg,"长度不能大于"+al,",且");
		if(r.s&&tak.hStr(v))r.s=(v.length<=al);
	}
	
	if(tak.hStr(opt.minV)&&tak.hStr(opt.maxV)){
		msg=tak.strJoin(msg, opt.minV+"到"+opt.maxV+"之间",",且");
		if(r.s&&tak.hStr(v))r.s=(v>=opt.minV&&v<=opt.maxV);
	}else if(tak.hStr(opt.minV)){
		msg=tak.strJoin(msg,"不能小于"+opt.minV,",且");
		if(r.s&&tak.hStr(v))r.s=(v>=opt.minV);
	}else if(tak.hStr(opt.maxV)){
		msg=tak.strJoin(msg,"不能大于"+opt.maxV,",且");
		if(r.s&&tak.hStr(v))r.s=(v<=opt.maxV);
	}
	
	if(tak.hStr(opt.minC)&&tak.hStr(opt.maxC)){
		var ic=parseInt(opt.minC, 10);
		var ac=parseInt(opt.maxC, 10);
		if(ic==ac)msg=tak.strJoin(msg,"必须为"+ic+'条',"且");
		else msg=tak.strJoin(msg,"最少"+ic+"条,最多"+ac+"条",",且");
		if(r.s&&tak.iAry(v))r.s=(v.length>=ic&&v.length<=ac);
	}else if(tak.hStr(opt.minC)){
		var ic=parseInt(opt.minC, 10);
		msg=tak.strJoin(msg,"最少"+ic+'条',",且");
		if(r.s&&tak.iAry(v))r.s=(v.length>=ic);
	}else if(tak.hStr(opt.maxC)){
		var ac=parseInt(opt.maxC, 10);
		msg=tak.strJoin(msg,"最多"+ac+'条',",且");
		if(r.s&&tak.iAry(v))r.s=(v.length<=ac);
	}
	
	if(r.s==false){
		if(tak.hStr(opt.msg))r.m=opt.msg;
		else r.m=fn+':'+msg;
	}
	return r;
}

takValidF.prototype = {
	require: function(r) {
		r.m="必填";
		r.s = (!isNull(r.v)&&!tak.eStr(r.v)&&!tak.eAry(r.v));
		return r;
	},
	chars: function(r) {
		r.m="(字母,数字或特殊字符:_!@#$%^&*[]|.\\/)";
		r.s = (/^[\da-zA-Z_!@#$%^&*\[\]|\.\\/:]*$/).test(r.v);
		return r;
	},
	int: function(r) {
		r.m="整数";
		r.s = (/^-?[0-9]+$/).test(r.v);
		r.v = parseInt(r.v);
		return r;
	},
	uInt: function(r) {
		r.m="正整数";
		r.s = (/^-?[0-9]+$/).test(r.v);
		r.v = parseInt(r.v);
		return r;
	},
	nInt: function(r) {
		r.m="负整数";
		r.s = (/^-[0-9]+$/).test(r.v);
		r.v = parseInt(r.v);
		return r;
	},
	number: function(r) {
		r.m="数字";
		r.s = (/^-?[0-9]+(\.\d+)?$/).test(r.v);
		r.v = parseFloat(r.v);
		return r;
	},
	uNumber: function(r) {
		r.m="正数";
		r.s = (/^[0-9]+(\.\d+)?$/).test(r.v);
		r.v = parseFloat(r.v);
		return r;
	},
	nNumber: function(r) {
		r.m="负数";
		r.s = (/^-?[0-9]+(\.\d+)?$/).test(r.v);
		r.v = parseFloat(r.v);
		return r;
	},
	phone: function(r) {
		r.m="电话号码(座机号(区号用-隔开)，1开头的11位手机号或400开头的10位客服号)";
		r.s = (/(^(\d{3,4}-)?\d{7,8})|(1\d{10})|(400\d{7})$/).test(r.v);
		return r;
	},
	mobile: function(r) {
		r.m="手机号(1开头的11位数字)";
		r.s = (/^1\d{10}$/).test(v);
		return r;
	},
	email: function(r) {
		r.m="邮箱地址";
		r.s = (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).test(r.v);
		return r;
	},
	date: function(r) {
		r.m="日期(年-月-日)";
		r.s = (/^[0-2]?\d{3}-((0?[1-9])|(1[0-2]))-((0?[1-9])|((1|2)[0-9])|30|31)$/).test(r.v);
		return r;
	},
	time: function(r) {
		r.m="时间(时:分:秒)";
		r.s = (/^(([0-1]?[0-9])|(2[0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/).test(r.v);
		return r;
	},
	dateTime: function(r) {
		r.m="日期时间(年-月-日 时:分:秒)";
		r.s = (/^[0-2]?\d{3}-((0?[1-9])|(1[0-2]))-((0?[1-9])|((1|2)[0-9])|30|31)\s(([0-1]?[0-9])|(2[0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/).test(r.v);
		return r;
	},
	//只校验银行卡号
	bankCard: function(r) {
		r.m="银行卡号";
		var v = r.v;
		if(!(/^[0-9]*$/).test(v)){
			r.s = false;
			return r;
		}
		var k, c = 0,
			l = v.length - 1;
		var c = 0;
		for(var i = 0; i < l; i++) {
			k = parseInt(v.substr(i, 1));
			if(i % 2 == 0) { //偶数位处理  
				k *= 2;
				k = k / 10 + k % 10;
			}
			c += k;
		}
		c = c % 10;
		if(c == 0) r.s = (v.substr(l, 1) == '0');
		elser.s = (v.substr(l, 1) == (10 - c).toString());
		return r;
	},
	//银行账号，包括存折等
	bankAccount: function(r) {
		r.m="银行账号";
		var v = r.v;
		var l = v.length;
		if(l < 8) r.s = false;
		else if(!(/^[0-9]*$/).test(v)) r.s = false;
		else if(l < 15){
			//存折之类的老号码
			r.s = true;
			return r; 
		}
		return takValidF.prototype.bankCard(r);
	},
	//身份证号 18位
	zhIDCard18: function(r) {
		r.m="身份证号";
		var v = r.v;
		if(v.length != 18){
			r.s = false;
			return r;
		}
		if(!(/^[0-9]*$/).test(v.substr(0, 17))){
			r.s = false;
			return r;
		}
		var yz = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
		var mc = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
		var c = 0;
		for(var i = 0; i < 17; i++) {
			c += parseInt(v.substr(i, 1)) * yz[i];
		}
		r.s = (v.substr(17, 1) == mc[c % 11]);
		return r;
	},
	//身份证号 15位只校验全数字，18位验证校验码
	zhIDCard: function(r) {
		r.m="身份证号";
		var v = r.v;
		if(v.length == 15){
			r.s = (/^[0-9]*$/).test(v);
			return r;
		}
		else return takValidF.prototype.zhIDCard18(r);
	}
}