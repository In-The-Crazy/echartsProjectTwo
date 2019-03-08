/** 如果值为空则返回-- */
function baseFormater(value, row, index) {
	if(isEmpty(value)){
		return "--";
	}
	return value;
};

/** 如果值为空则返回0 */
function baseNumFormater(value, row, index) {
	if(isEmpty(value)){
		return "0";
	}
	return value;
};

/** 按“,”分割并返回第一个字符串，且如果值为空则返回-- */
function splitFormater(value, row, index) {
	if(isEmpty(value)){
		return "--";
	}
	return value.split(',')[0];
};

/** 返回行数 */
function rownumFormater(value, row, index) {
	return index + 1;
};

/** 模板使用者 */
function genderFormater(value, row, index) {
	var text = baseFormater(value, row, index);
	if(value=='2'){
		text = "女";
	}else {
		text = "男";
	}
	return text;
};

/** 日期格式化 */
function dateFormater(value, row, index){
	var creadate = value;
	if(isEmpty(creadate)){
		return "--";
	}
	if(creadate.length >= 10){
		var temp = "";
		if(creadate.split(' ').length>1){
			temp = creadate.split(' ')[0];
		}else if(creadate.split(',').length>1){
			temp = creadate.split(',')[0];
		}else if(creadate.split('T').length>1){
			temp = creadate.split('T')[0];
		}
		if(temp.length == 8){
			var year = "";
			var mou = "";
			var day = "";
			year = temp.substring(0, 4);
			mou = temp.substring(4, 6);
			day = temp.substring(6, 8);
			return year + "-" + mou + "-" + day;
		}
		if(temp.length == 10){
			return temp;
		}
	}
	if(creadate.length == 8){
		var year = "";
		var mou = "";
		var day = "";
		year = creadate.substring(0, 4);
		mou = creadate.substring(4, 6);
		day = creadate.substring(6, 8);
		return year + "-" + mou + "-" + day;
	}
};

/** 日期时间格式化 */
function dateTimeFormater(value, row, index) {
	var creadate = value;
	if(isEmpty(creadate)){
		return "--";
	}
	if(creadate.length == 8){
		var year = "";
		var mou = "";
		var day = "";
		year = creadate.substring(0, 4);
		mou = creadate.substring(4, 6);
		day = creadate.substring(6, 8);
		return year + "-" + mou + "-" + day;
	}
	if(creadate.length > 10){
		var temp = "";
		var time = "";
		if(creadate.split(' ').length>1){
			temp = creadate.split(' ')[0];
			time = creadate.split(' ')[1];
		}else if(creadate.split(',').length>1){
			temp = creadate.split(',')[0];
			time = creadate.split(',')[1];
		}else if(creadate.split('T').length>1){
			temp = creadate.split('T')[0];
			time = creadate.split('T')[1];
		}
		if(time.split('.').length>1){
			time = time.split('.')[0];
		}
		if(temp.length == 8){
			var year = "";
			var mou = "";
			var day = "";
			year = temp.substring(0, 4);
			mou = temp.substring(4, 6);
			day = temp.substring(6, 8);
			return year + "-" + mou + "-" + day + " " + time;
		}
		if(temp.length == 10){
			return temp + " " + time;
		}
	}
	return value;
};

/** 时间格式化 */
function timeFormater(value, row, index){
	var time = "--"
	if(value.length == 4){
		time = value.substring(0,2) + ":" + value.substring(2,4);
	}
	return time
}

/** 订单状态 */
function statusFormater(value, row, index) {
	if (value == "0") {
		return "等待提交";
	}
	if (value == "1") {
		return "已订座";
	}
	if (value == "2") {
		return "已出票";
	}
	if (value == "3") {
		return "出票失败";
	}
	if (value == "4") {
		return "已取消";
	}
	if (value == "5") {
		return "已升舱";
	}
//	if (value == "5") {
//		return "订座失败";
//	}
	if (value == "6") {
		return "航信防占座";
	}
};

/** 支付状态 */
function paystatusFormater(value, row, index) {
	if (value == "0") {
		return "未支付";
	}
	if (value == "1") {
		return "支付中";
	}
	if (value == "2") {
		return "支付成功";
	}
	if (value == "3") {
		return "支付失败";
	}
	return "未支付";
};

/** 证件类型 */
function idtypeFormatter(value, row, index) {
	if(value=='0'){
		return '居民身份证';
	}
	if(value=='1'){
		return '军官证';
	}
	if(value=='2'){
		return '警官证';
	}
	if(value=='3'){
		return '士兵证';
	}
	if(value=='4'){
		return '有效护照';
	}
	if(value=='5'){
		return '其他';
	}
	if(value=='03'){
		return '港澳通行证';
	}
	if(value=='04'){
		return '台湾通行证';
	}
	if(value=='05'){
		return '回乡证';
	}
	if(value=='06'){
		return '台胞证';
	}
	if(value=='07'){
		return '港澳居民居住证';
	}
	if(value=='08'){
		return '台湾居民居住证';
	}
};

/** 退票申请审核状态 */
function cstatusFormater(value, row, index) {
	if (value == "0") {
		return "未申请";
	}
	if (value == "1") {
		return "退票申请中";
	}
	if (value == "2") {
		return "一审通过";
	}
	if (value == "3") {
		return "一审拒绝";
	}
	if (value == "4") {
		return "二审通过";
	}
	if (value == "5") {
		return "二审拒绝";
	}
	if (value == "6") {
		return "退票完成";
	}
	if (value == "7") {
		return "线下退票完成";
	}
	if (value == "8") {
		return "退款失败";
	}
	if (value == "9") {
		return "退票申请失败";
	}
};

/** 是否自愿退票 */
function natureFormater(value, row, index) {
	if (value == "0") {
		return "非自愿";
	}
	if (value == "1") {
		return "自愿";
	}
};

/** 短信模板启用状态 */
function tempStatusFormater(value, row, index) {
	if (value == "0") {
		return "禁用";
	}
	if (value == "1") {
		return "启用";
	}
};

/** 邮寄行程单类型 */
function postTypeFormater(value, row, index) {
	if (value == "1") {
		return "免费快递";
	}
	if (value == "2") {
		return "快递到付";
	}
	if (value == "3") {
		return "挂号信";
	}
};

/** 订单来源 */
function channelFormater(value, row, index) {
	var text = "手机客户端";
	if (value == "WANGZHAN") {
		text = "手机M网站";
	}
	return text;
};

/** 国内国际 */
function isInterFormater(value, row, index) {
	var text = '国内';
	if(value=='1') {
		text = '国际';
	}
	return text;
};

/** 是否是会员 */
function isMenberFormater(value, row, index) {
	var text = '否';
	if(value == '1') {
		text = '是';
	}
	return text;
};

/** 保险状态 */
function insuranceStatusFormater(value, row, index) {
	var text = '--';
	if(value == '0') {
		text = '购买失败';
	}
	if(value == '1') {
		text = '购买成功';
	}
	if(value == '2') {
		text = '退保拒绝';
	}
	if(value == '3') {
		text = '退保申请中';
	}
	if(value == '4') {
		text = '退保审核中';
	}
	if(value == '5') {
		text = '退保完成';
	}
	if(value == '6') {
		text = '线下退保完成';
	}
	return text;
};

/** 申请方式 */
function applyTypeFormater(value, row, index) {
	var text = '--';
	if(value == '1') {
		text = '挂号';
	}
	if(value == '2') {
		text = '快递';
	}
	return text;
};

/** 是否过期 */
function overdueFormater(value, row, index) {
	var text = '--';
	if(value == '0') {
		text = '已过期';
	}
	if(value == '1') {
		text = '未过期';
	}
	return text;
};

/** 图片状态 */
function imgStatusFormater(value, row, index) {
	var text = '--';
	if(value == '0') {
		text = '无效';
	}
	if(value == '1') {
		text = '有效';
	}
	return text;
};

/** 图片使用 */
function imgTypeFormater(value, row, index) {
	var text = '--';
	if(value == '1') {
		text = '启动页';
	}
	if(value == '2') {
		text = '购票后';
	}
	return text;
};

/** 优惠券使用种类 */
function couponTypeFormater(value, row, index) {
	var text = '--';
	if(value == 'register'){
		text = '注册';
	}else if(value == 'buy'){
		text = '购票';
	}else if(value == 'jsyl'){
		text = '机上有礼';
	}else if(value == 'recommend'){
		text = '推荐';
	}
	return text;
};

/** 模板有效期 */
function templetTypeFormater(value, row, index) {
	var text = "--";
	if(value=='1'){
		text = row.days;
	}
	if(value=='2'){
		text = row.endDate;
	}
	return text;
};

/** 模板使用者 */
function conditionFormater(value, row, index) {
	var text = baseFormater(value, row, index);
	if(value=='1'){
		text = "所有人使用";
	}
	if(value=='2'){
		text = "指定人使用";
	}
	return text;
};

/** 模板使用者 */
function couponStastusFormater(value, row, index) {
	var text = '--';
	if(value == "1"){
		text = "未使用";
	}else if(value == "2"){
		text = "--";
	}else if(value == '3'){
		text = "已使用";
	}else{
		text = "未知状态";
	}
	return text;
};

/** 字段数据类型 */
function columnTypeFormater(value, row, index) {
	var text = '--';
	if(value == 'N'){
		text = '数字';
	}
	if(value == 'E'){
		text = '邮件';
	}
	if(value == 'P'){
		text = '密码';
	}
	if(value == 'T'){
		text ='电话';
	}
	if(value == 'C'){
		text = '字符';
	}
	if(value == 'S'){
		text = '单选框';
	}
	return text;
};

/** 双击录入 */
function remarkFormater(value, row, index) {
	if (isEmpty(value)) {
		return "双击录入";
	}
	return value;
};

/**       
 * 对Date的扩展，将 Date 转化为指定格式的String       
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符       
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)       
 * eg:       
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423       
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04       
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04       
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04       
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18       
 */          
Date.prototype.pattern=function(fmt) {
	var o = {
		"M+" : this.getMonth()+1, //月份
		"d+" : this.getDate(), //日
		"h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
		"H+" : this.getHours(), //小时
		"m+" : this.getMinutes(), //分
		"s+" : this.getSeconds(), //秒
		"q+" : Math.floor((this.getMonth()+3)/3), //季度
		"S" : this.getMilliseconds() //毫秒
	};
	var week = {
		"0" : "/u65e5",
		"1" : "/u4e00",
		"2" : "/u4e8c",
		"3" : "/u4e09",
		"4" : "/u56db",
		"5" : "/u4e94",
		"6" : "/u516d"
	};
	if(/(y+)/.test(fmt)){
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
	if(/(E+)/.test(fmt)){
		fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
	}
	for(var k in o){
		if(new RegExp("("+ k +")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		}
	}
	return fmt;
}

//强制保留小数点后两位
function changeTwoDecimal_f(x) {  
	var f_x = parseFloat(x);  
	if (isNaN(f_x)){  
		alert('function:changeTwoDecimal->parameter error');  
		return false;  
	}  
	var f_x = Math.round(x*100)/100;  
	var s_x = f_x.toString();  
	var pos_decimal = s_x.indexOf('.');  
	if (pos_decimal < 0) {  
		pos_decimal = s_x.length;  
		s_x += '.';  
	}  
	while (s_x.length <= pos_decimal + 2) {  
		s_x += '0';  
	}  
	return s_x;  
}

//转换订单处理类型成中文
function changOrderProcessRecordTypeForText(value, row, index){
	var stext="--";
	if(value=="0"){
		stext="沟通";
	}else if(value=="1"){
		stext="投递";
	}else if(value=="2"){
		stext="退票审核";
	}else if(value=="3"){
		stext="退票完成";
	}else if(value=="4"){
		stext="手工退票";
	}else if(value=="5"){
		stext="手工出票";
	}else if(value=="7"){
		stext="退保";
	}else{
		stext="退票";
	}
	return stext;
}

//转换订单处理类型成中文
function channelFormater(value, row, index){
	var text="--";
	if(value=="app"){
		text="手机客户端";
	}
	if(value=="mini"){
		text="小程序";
	}
	if(value=="wx"){
		text="微信公众号";
	}
	if(value=="web"){
		text="官网";
	}
	return text;
}

//票号格式化
function ticketNoFormater(value, row, index){
	var result = "--";
	if(!isEmpty(result)){
		result = value;
	}
	if(value.indexOf(",")>0){
		result = "";
		var text = value.split(",");
		for(var i=0;i<text.length;i++){
			result += text[i] + "<br/>";
		}
		result = result.substring(0,result.length-5);
	}
	return result;
}

//支付方式格式化
function payTypeFormater(value, row, index){
	var result = "--";
	if(value == "weixin"){
		result = "微信";
	}
	if(value == "alipay"){
		result = "支付宝";
	}
	return result;
}

//格式化金额
function fmoney(s, n){
	n = n > 0 && n <= 20 ? n : 2;
	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	var l = s.split(".")[0].split("").reverse(),
	r = s.split(".")[1];
	t = "";
	for(i = 0; i < l.length; i ++ )
	{
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	return t.split("").reverse().join("") + "." + r;
}