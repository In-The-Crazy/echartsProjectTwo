/** -------- 初始化 ------ */
$(function() {
	// 初始化页面角色
	initPage();
	// 初始化表单
	initForm();
	// 加载树型
	ajaxTree();
	// 加载表格数据
	ajaxTable();

});

/** -------- 初始化页面角色 ------ */
function initPage() {
	var dialog_add = {
		id : "smsTemplateAdd",
		title : "添加"
	}
	var dialog_edit = {
		id : "smsTemplateEdit",
		title : "修改"
	}
	
	// 添加窗口
	initDialog(dialog_add);
	$('#smsTemplateAdd').dialog('close');
	// 编缉窗口
	initDialog(dialog_edit);
	$('#smsTemplateEdit').dialog('close');
}

/** -------- 初始化表单 ------ */
function initForm(){
	$("#templetName").textbox({
		label : '模板名称：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	
	$('#add_templetCode,#edit_templetCode').textbox({
		label : '模板代码：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : true
	});
	$('#add_templetName,#edit_templetName').textbox({
		label : '模板名称：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : true
	});
	$('#add_maxTimes,#edit_maxTimes').textbox({
		label : '每日次数：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
	});
	$('#add_validTime,#edit_validTime').textbox({
		label : '有效期：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
	});
	$('#add_mContent,#edit_mContent').textbox({
		label : '内容：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		height: 100,
		multiline: true,
		required : true
	});
	$('#add_checkType,#edit_checkType').combobox({
		label : '模板类型：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		onChange:function(newValue,oldValue){  
	        console.log(newValue)
			if (newValue == '0') {
	        	$('#ad_maxTimes,#ed_maxTimes,#ad_validTime,#ed_validTime').hide();
	        	$('#add_maxTimes,#edit_maxTimes,#add_validTime,#edit_validTime').textbox('setValue','');
			}else if (newValue == '1') {
				$('#ad_maxTimes,#ed_maxTimes,#ad_validTime,#ed_validTime').show();
			}
	    }
	});
	$('#add_sendMode,#edit_sendMode').combobox({
		label : '发送模式：',
		labelWidth : 100,
		labelAlign : "right",
		multiple:true,
		width : 250
	});
	$('#add_templetStatus,#edit_templetStatus').combobox({
		label : '模板状态：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
}

/** -------- 加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#smsTemplateTable').datagrid({
		url : root + '/messageTemplate/querySmsTemplates',
		toolbar : '#toolbar',
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度jobpedia
		pageNumber : 1,
		pageSize : 20,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		queryParams : params,
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
			alert('数据加载失败!');
		},
		onLoadSuccess : function(data) {
		},
		columns : [ [ {
			field : 'rownumbers',
			title : '',
			align : 'center',
			styler : rownumSytler,
			formatter : rownumFormater,
			width : 25
		}, {
			field : 'smsId',
			checkbox : 'true',
			hidden: true,
			width : 20
		}, {
			field : 'templetCode',
			title : '模板代码',
			align : 'center',
			formatter : baseFormater,
			width : 60
		}, {
			field : 'templetName',
			title : '模板名称',
			align : 'center',
			formatter : baseFormater,
			width : 60
		}, {
			field : 'maxTimes',
			title : '每日次数',
			align : 'center',
			formatter : baseFormater,
			width : 60
		}, {
			field : 'validTime',
			title : '有效期',
			align : 'center',
			formatter : baseFormater,
			width : 60
		}, {
			field : 'mcontent',
			title : '内容',
			align : 'center',
			formatter : baseFormater,
			width : 250
		}, {
			field : 'sendMode',
			title : '发送模式',
			align : 'center',
			formatter : baseFormater,
			width : 60
		}, {
			field : 'checkType',
			title : '类型',
			align : 'center',
			formatter : typeFormater,
			width : 60
		}, {
			field : 'templetStatus',
			title : '模板状态',
			align : 'center',
			formatter : statusFormater,
			width : 40
		}, {
			field : 'opt',
			title : '操作',
			align : 'center',
			formatter : optFormater,
			width : 40
		} ] ]
	})

}

/**
 * 加载树型
 */
function ajaxTree() {
	$('#templetStatus').combobox({
		label : '模板状态：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data: [{
			"id" : "",
			"text" : "全部",
			"selected": true
		},{
			"id" : "0",
			"text" : "禁用"
		},{
			"id" : "1",
			"text" : "启用"
		}],
		valueField:'id',
		textField:'text'
	});
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#smsTemplateTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/**
 * 设置操作列的信息 row 当前行的数据 index 当前行的索引 从0 开始
 */
function optFormater(value, row, index) {
	var _id = "'" + row.smsId + "'";
	var del = '';
	if(row.opAccount != 'admin'){
		del = '<a href="javascript:void(0);" onclick=deleteSmsTemplate(' + _id + ')>删除</a>';
	}
	var lock = '';
	if(row.templetStatus == '0' && row.opAccount != 'admin'){
		lock = ' | <a href="javascript:void(0);" onclick=unlock(' + _id + ')>启用</a>';
	}
	if(row.templetStatus == '1' && row.opAccount != 'admin'){
		lock = ' | <a href="javascript:void(0);" onclick=lock(' + _id + ')>禁用</a>';
	}
	return del+lock;
};
function statusFormater(value, row, index) {
	if(value == '1'){
		return "启用";
	}else if (value == '0') {
		return "禁用";
	}
};
function typeFormater(value, row, index) {
	if(value == '1'){
		return "验证码";
	}else if (value == '0') {
		return "消息通知";
	}
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

function getInfo() {
	var selecteds = $('#smsTemplateTable').datagrid('getSelections');
	if(selecteds.length!=1){
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	var selected = $('#smsTemplateTable').datagrid('getSelected');
	$("#smsTemplateEditForm").form("load", selected);
	
	var group = selected.sendMode;
	$('#edit_sendMode').combobox('setValues',group.split(","));
	// 打开操作员编缉页面
	$('#smsTemplateEdit').dialog('open');
}

/** -------- 添加 ------ */
function addSmsTemplate() {
	//验证表单参数
	var sflag = $("#smsTemplateAddForm").form('validate');
	var type = $("#add_checkType").val();
	if (type == '1') {
		var aMaxTimes = $("#add_maxTimes").val();
		var aValidTime = $("#add_validTime").val();
		if (aMaxTimes == "" || aValidTime == "") {
			sflag = false;
		}
	}
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("smsTemplateAddForm");
	var subsendMode=$("#add_sendMode").combobox("getValues").join(",");
	if(subsendMode.indexOf(",")==0){
		params["sendMode"] =subsendMode.substring(1);
	}else{
		params["sendMode"] =subsendMode;
	}
	var add = {
		url : root + '/messageTemplate/addSmsTemplate',// 请求的action路径
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				resetAddForm();
				reloadTable("smsTemplateTable");
				$('#smsTemplateAdd').dialog('close');
			}
			showMessage(data);
		}
	};
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editSmsTemplate() {
	//验证表单参数
	var sflag = $("#smsTemplateEditForm").form('validate');
	var type = $("#edit_checkType").val();
	if (type == '1') {
		var eMaxTimes = $("#edit_maxTimes").val();
		var eValidTime = $("#edit_validTime").val();
		if (eMaxTimes == "" || eValidTime == "") {
			sflag = false;
		}
	}
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("smsTemplateEditForm");
	var subsendMode=$("#edit_sendMode").combobox("getValues").join(",");
	if(subsendMode.indexOf(",")==0){
		params["sendMode"] =subsendMode.substring(1);
	}else{
		params["sendMode"] =subsendMode;
	}
	var add = {
		url : root + '/messageTemplate/updateSmsTemplate',// 请求的action路径
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("smsTemplateTable");
				$('#smsTemplateEdit').dialog('close');
			}
			showMessage(data);
		}
	};
	sendAjaxRequest(add);
}

/** -------- 删除 ------ */
function deleteSmsTemplate(id) {
	$.messager.confirm('删除提示', '是否确认删除?', function(r) {
		if (r) {
			var options = {
				url : root + '/messageTemplate/deleteSmsTemplate',// 请求的action路径
				data : {
					"smsId" : id
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("smsTemplateTable");
					}
					showMessage(data);
				}
			};
			sendAjaxRequest(options);
		}
	});
}

/** -------- 禁用 ------ */
function lock(id) {
	$.messager.confirm('禁用提示', '是否确认禁用?', function(r) {
		if (r) {
			var options = {
				url : root + '/messageTemplate/updateSmsTemplateStatus',// 请求的action路径
				data : {
					"smsId" : id,
					"templetStatus" : '0'
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("smsTemplateTable");
					}
					showMessage(data);
				}
			};
			sendAjaxRequest(options);
		}
	});
}

/** -------- 启用 ------ */
function unlock(id) {
	$.messager.confirm('启用提示', '是否确认启用?', function(r) {
		if (r) {
			var options = {
				url : root + '/messageTemplate/updateSmsTemplateStatus',// 请求的action路径
				data : {
					"smsId" : id,
					"templetStatus" : '1'
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("smsTemplateTable");
					}
					showMessage(data);
				}
			};
			sendAjaxRequest(options);
		}
	});
}

function operatorReset() {
	$("#conditionForm").form("clear");
	$("#templetStatus").find("option[text='全部']").attr("selected",true);
}
function resetAddForm() {
	$("#smsTemplateAddForm").form("clear");
}