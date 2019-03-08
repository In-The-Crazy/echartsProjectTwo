//判空
function isEmpty(str){
	if(str == null || typeof(str)=='undefined' || str == 'null' || str == '(null)' || str == 'undefined' || str=='NULL' || str=='0' || str.length==0 || str == undefined){
		return true;
	}
	if(typeof(str)=='string' && str.replace(/(^s*)|(s*$)/g, "").length == 0){
		return true;
	}
	if(typeof(str)=='number' && str == 0){
		return true;
	}
	return false;
}

$.extend($.fn.validatebox.defaults.rules, {
	cityCode: {
		validator: function(value,param){
			var flag = false;
			reg = /^[a-zA-Z]{3}$/;
			zhreg = /^[\u4E00-\u9FA5]+$/;
			flag1 = reg.test(value);
			flag2 = zhreg.test(value);
			return flag1||flag2;
		},
		message: '请输入正确的城市三字码或城市名！'
	},mobile: {
		validator: function(value,param){
			var flag = false;
			reg = /^1[3|4|5|6|7|8|9]\d{9}$/;
			flag = reg.test(value);
			return flag;
		},
		message: '请输入正确的手机号码！'
	},
	fnumber: {
		validator: function(value,param){
			var flag = false;
			reg = /^\d{4}$/;
			flag = reg.test(value);
			return flag;
		},
		message: '请输入正确的航班号,如"3250"！'
	},
	airways: {
		validator: function(value,param){
			var flag = false;
			reg = /^[a-zA-Z]{3}-[a-zA-Z]{3}(,[a-zA-Z]{3}-[a-zA-Z]{3})*$/;
			flag = reg.test(value);
			return flag;
		},
		message: '请输入正确的航段,如"XIY-TAO,TAO-XIY"！'
	},
	cabin: {
		validator: function(value,param){
			var flag = false;
			reg = /^[A-Z]{1}$/;
			flag = reg.test(value);
			return flag;
		},
		message: '请输入正确的舱位,如"T,W"！'
	},
	startDate: {
		validator: function(value,param){
			if(param.length>1&&!isEmpty($(param[1]).val())){
				return true;
			}
			if(param.length>2&&!isEmpty($(param[2]).val())){
				return true;
			}
			var now = new Date();
			if(!isEmpty($(param[0]).datebox("getValue"))){
				now = new Date($(param[0]).datebox("getValue"));
			}
			var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			var temp = new Date(now.getTime()-30*24*60*60*1000);
			var d2 = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());
			value = value.replace(/-/g,"");
			d1 = d1.pattern("yyyyMMdd");
			d2 = d2.pattern("yyyyMMdd");
			return d2<=value && value<=d1;
		},
		message: '开始时间与结束时间间隔不能超过31天！'
	},
	endDate: {
		validator: function(value,param){
			if(param.length>1&&!isEmpty($(param[1]).val())){
				return true;
			}
			if(param.length>2&&!isEmpty($(param[2]).val())){
				return true;
			}
			var now = new Date();
			if(!isEmpty($(param[0]).datebox("getValue"))){
				now = new Date($(param[0]).datebox("getValue"));
			}
			var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			var temp = new Date(now.getTime()+30*24*60*60*1000);
			var d2 = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());
			value = value.replace(/-/g,"");
			d1 = d1.pattern("yyyyMMdd");
			d2 = d2.pattern("yyyyMMdd");
			return d2>=value && value>=d1;
		},
		message: '开始时间与结束时间间隔不能超过31天！'
	}
});
