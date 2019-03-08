/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面模块
	initPage();
	// 加载日历选择
	initDatebox();
	// 加载表格数据
	ajaxTable(false);
	// 加载树型
	ajaxTree();
});

/** --------加载日历选择 ------ */
function initDatebox() {
	$('#startdate').datebox({
		editable : false,
		required : false,
		onChange : function(newValue, oldValue){
			if(isEmpty($('#enddate').datebox("getValue"))){
				$('#enddate').datebox("setValue",newValue);
			}
			$("#conditionForm").form('validate');
		}
	});
	$('#enddate').datebox({
		editable : false,
		required : false,
		onChange : function(newValue, oldValue){
			if(isEmpty($('#startdate').datebox("getValue"))){
				$('#startdate').datebox("setValue",newValue);
			}
			$("#conditionForm").form('validate');
		}
	});
	var today = new Date();
	var first = new Date();
	first.setDate(1);
	today = today.pattern("yyyy-MM-dd");
	first = first.pattern("yyyy-MM-dd");
	$('#startdate').datebox('setValue',today);
	$('#enddate').datebox('setValue',today);
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_info = {
		id : "memberInfo",
		title : "会员信息"
	};
	var dialog_upload = {
		id : "memberUpload",
		title : "导入推荐会员"
	};

	// 查看窗口
	initDialog(dialog_info);
	$('#memberInfo').dialog('close');
	// 导入窗口
	initDialog(dialog_upload);
	$('#memberUpload').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable(flag) {
	// 验证时间
	var sdate = $('#startdate').datebox('getValue');
	var edate = $('#enddate').datebox('getValue');
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		sdate = sdate.replace(/-/g, '');
		edate = edate.replace(/-/g, '');
		if (parseInt(sdate) > parseInt(edate)) {
			$.messager.alert('错误提示', '注册起始日期不能大于注册截止日期', 'error');
			return false;
		}
	}
	
	//验证表单是否为空
/*	var eflag = isFormEmpty("conditionForm");
	if(!flag&&eflag){
		$.messager.alert('错误提示', '请最少填写一个参数！', 'error');
		return false;
	}*/
	
	
	//验证表单参数
	var sflag = $("#conditionForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#memberTable').datagrid({
		url : root + '/member/queryMemberInfoList',
		toolbar : "#toolbar",
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		showHeader : true,
		pageNumber : 1,
		pageSize : 20,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : true,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		queryParams : params,
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
			$.messager.alert('错误提示', '数据加载失败!', 'error');
		},
		onLoadSuccess : function(data) {
		},
		onBeforeLoad : function(){
			return !flag;
		},
		onSelect : function(rowIndex, rowData){
			$('#userid').val(rowData.userid);
		},
		columns : [ [ {
			field : 'userid',
			checkbox : 'true',
			hidden : true,
			align : 'center',
			width : 25
		}, {
			field : 'realName',
			title : '姓名',
			align : 'center',
			formatter : realNameFormater,
			width : 100
		}, {
			field : 'ffpCard',
			title : '常旅客卡号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'pidNumber',
			title : '证件号码',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'mobile',
			title : '手机号码',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'ordercount',
			title : '订单数',
			align : 'center',
			formatter : baseNumFormater,
			width : 50
		}, {
			field : 'ticketcount',
			title : '出票数',
			align : 'center',
			formatter : baseNumFormater,
			width : 50
		}, {
			field : 'createDate',
			title : '注册日期',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'modifyDate',
			title : '认证日期',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'isMobileMember',
			title : '是否绑定手机',
			align : 'center',
			formatter : function(value, row, index){
				var text = "否";
				if(value == "1"){
					text = "是"
				}
				return text;
			},
			width : 75
		}, {
			field : 'ffpBindingType',
			title : '常旅客绑定类型',
			align : 'center',
			formatter : function(value, row, index){
				var text = "";
				if(value == "1"){
					text = "注册"
				}
				if(value == "2"){
					text = "登录"
				}
				return text;
			},
			width : 75
		}, {
			field : 'isFfpMember',
			title : '是否绑定常旅客',
			align : 'center',
			formatter : function(value, row, index){
				var text = "否";
				if(value == "1"){
					text = "是"
				}
				return text;
			},
			width : 75
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#memberTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function realNameFormater(value, row, index) {
	var _id = "'" + row.userid + "'";
	if(isEmpty(value)){
		return '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"info")>--</a>';
	}
	return '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"info")>' + value + '</a>';
};
function mobileCheckFormater(value, row, index) {
	var result = baseFormater(value, row, index);
	if(row.mobileCheck != '2'){
		result = '--';
	}
	return result;
};

/** --------自定义单元格样式 ------ */
function rownumSytler(value, row, index) {
	return "background-color: #F2F2F2;"
			+ "color: #333;"
			+ "background: -webkit-linear-gradient(top,#ffffff 0,#F2F2F2 100%);"
			+ "background: -moz-linear-gradient(top,#ffffff 0,#F2F2F2 100%);"
			+ "background: -o-linear-gradient(top,#ffffff 0,#F2F2F2 100%);"
			+ "background: linear-gradient(to bottom,#ffffff 0,#F2F2F2 100%);"
			+ "background-repeat: repeat-x;"
			+ "filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffffff,endColorstr=#F2F2F2,GradientType=0);"
};

/** --------查看会员详情 ------ */
function getInfo(id, flag) {
	var url = root + '/member/queryMemberInfoById';
	var options = {
		url : url,
		data : {
			"id": id
		},
		callBackFun : function(data) {
			if (flag == 'info') {
				//加载会员信息
				$("#info_realName").html(data.obj.realName);
				var idType = data.obj.pidType;
				if(idType=="0"){
					idType = "居民身份证";
				}
				if(idType=="4"){
					idType = "护照";
				}
				if(idType=="5"){
					idType = "其他";
				}
				$("#info_pidType").html(idType);
				$("#info_pidNumber").html(data.obj.pidNumber);
				$("#info_mobile").html(data.obj.mobile);
				$("#info_cityName").html(data.obj.cityName);
				$("#info_address").html(data.obj.address);
				$("#info_postCode").html(data.obj.postCode);
				$("#info_email").html(data.obj.email);
				var ffpCard = data.obj.ffpCard;
				if(isEmpty(ffpCard)){
					ffpCard = "";
				}
				$("#info_ffpCard").html(ffpCard);
				$("#info_ordercount").html(baseNumFormater(data.obj.ordercount,"","") + "张");
				$("#info_ticketcount").html(baseNumFormater(data.obj.ticketcount,"","") + "张");
				$("#info_fare").html(baseNumFormater(data.obj.fare,"","") + "元");
				// 打开会员详情页面
				$('#memberInfo').dialog('open');
			}
		}
	}
	sendAjaxRequest(options);
}

/** -------- 手机解绑 ------ */
function untieMobile() {
	var select = $("#memberTable").datagrid('getSelected');
	if(select == null){
		$.messager.alert('错误提示', '请选择一个会员', 'error');
		return false;
	}
	var _id = select.userid;
	var isMobileMember = select .isMobileMember;
	var isFfpMember = select.isFfpMember;
	if (isMobileMember == '0' || isFfpMember == '1') {
		$.messager.alert('错误提示', '只有手机绑定的非常旅客会员才可解绑', 'error');
		return false;
	}
	$.messager.confirm("操作提示", "您确定要执行操作吗？", function (data) {
        if (data) {
        	var options = {
    			url : root + '/member/untieMobile',
    			data : "userid=" + _id,
    			callBackFun : function(data) {
    				showMessage(data);
    				ajaxTable()
    			}
    		}
    		sendAjaxRequest(options);
        }
        else {
        	return false;
        }
    });
}

/** -------- 常旅客解绑 ------ */
function untieFfpMember() {
	var select = $("#memberTable").datagrid('getSelected');
	if(select == null){
		$.messager.alert('错误提示', '请选择一个会员', 'error');
		return false;
	}
	var _id = select.userid;
	var isFfpMember = select.isFfpMember;
	if (isFfpMember != '1') {
		$.messager.alert('错误提示', '只有常旅客会员才可解绑', 'error');
		return false;
	}
	$.messager.confirm("操作提示", "您确定要执行操作吗？", function (data) {
		if (data) {
			var options = {
					url : root + '/member/untieFfpMember',
					data : "userid=" + _id,
					callBackFun : function(data) {
						showMessage(data);
						ajaxTable()
					}
			}
			sendAjaxRequest(options);
		}
		else {
			return false;
		}
	});
}


/** -------- 会员信息列表导出 ------ */
function exportMember() {
	var data = $('#memberTable').datagrid('getData');
	var paper = $('#memberTable').datagrid('getPager').pagination("options");
	var params = serializeJson("conditionForm");
	if(!params){
		return false;
	}
	
	var count = data.rows.length;
	if(count<=0){
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
		return false;
	}
	
	var total = paper.total;
	//alert(total);
	var exportSize = 65000;
	
	if(parseInt(total) > exportSize){
		var page = (parseInt(total) + exportSize - 1) / exportSize;
		$.messager.prompt('提示', '每页导出数据65000条，当前数据量超过65000条，请输入要导出的页数：', function(r){
			if (r){
				var re =  /^[1-9]+[0-9]*]*$/;
				
				if (!re.test(r) || parseInt(r)<=0 || parseInt(r)>=page) {
					$.messager.alert('错误提示', '请输入正确的页数', 'error');
					return false;
				}
				
				var end = r * exportSize;
				if(end > total){
					end = total;
				}
				params["start"] = (r - 1) * exportSize + 1;
				params["end"] = end;
				//return false;
				openWindowWithJson(root +'/member/exportMemberList',params);
			}
		});
	}else{
		params["start"] = 1;
		params["end"] = paper.total;
		openWindowWithJson(root +'/member/exportMemberList',params);
	}
}

/** -------- 导入开关 ------ */
var upload = false;

/** -------- 导入 ------ */
function uploadMember() {
	if(!upload){
		$.messager.alert('提示信息','请选择文件！','info');
		return false;
	}
	//进度条归0
	$('#progressNumber').progressbar('setValue', '0');
	//获取文件参数
	var fd = new FormData();
	fd.append("memberExcel", document.getElementById('fileToUpload').files[0]);
	fd.append("path", "/images/upload/excel");
	//AJAX请求
	var xhr = new XMLHttpRequest();
	xhr.upload.addEventListener("progress", uploadProgress, false);
	xhr.open("POST", root + "/member/uploadMember");
	xhr.onreadystatechange = function () {
		//4: 请求已完成，且响应已就绪
		if(xhr.readyState==4){
			var data = xhr.responseText;
			data = eval('(' + data + ')');
			if(data.isSuccessOrfail=="SUCCESS"){
				$.messager.show({title:'提示信息', msg:'上传成功！'});
				$.messager.confirm('上传成功','确认导入？',function(r){
					if(r){
						var options = {
							url : root + '/member/importRecommendMember',
							callBackFun : function(data) {
								showMessage(data);
							}
						}
						sendAjaxRequest(options);
					}
				});
			}else{
				$.messager.alert('错误提示','上传失败！','error');
			}
			$('#memberUpload').dialog('close');
		}
	}
	xhr.send(fd);
}

/** -------- 选择文件 ------ */
function fileSelected() {
	//进度条归0
	$('#progressNumber').progressbar('setValue', '0');
	var file = document.getElementById('fileToUpload').files[0];
	var fileName = file.name;
	var file_typename = fileName.substring(fileName.lastIndexOf('.'), fileName.length);
	
	$('#fileName').val(fileName);
	
	if (file_typename == '.xls') {//这里限定上传文件文件类型
		if (file.size <= 104857600){//这里限定上传文件文件大小
			if (file) {
				var fileSize = 0;
				if (file.size > 1024 * 1024){
					fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
				}
				else{
					fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
				}
				upload = true;
			}
		} else {
			$.messager.alert('错误提示',"文件大小要小于100M！",'error');
			upload = false;
		}
	}else{
		$.messager.alert('错误提示',"文件格式必须是xls！",'error');
		upload = false;
	}
}

/** -------- 导入进度条 ------ */
function uploadProgress(evt) {
	if (evt.lengthComputable) {
		var percentComplete = Math.round(evt.loaded * 100 / evt.total);
		$('#progressNumber').progressbar('setValue', percentComplete);
	}
	else {
		document.getElementById('progressNumber').innerHTML = '无法计算';
	}
}

/** -------- 重置查询条件 ------ */
function queryOrderReset() {
	$('#conditionForm').form('reset');
	initDatebox()
}
