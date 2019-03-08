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
	$("#msgKeys").textbox({
		label : '关键字：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#templetCode").textbox({
		label : '模板代码：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#templetName").textbox({
		label : '模板名称：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	
	var dialog_add = {
		id : "messageTemplateAdd",
		title : "添加"
	}
	var dialog_edit = {
		id : "messageTemplateEdit",
		title : "修改"
	}
	
	// 添加窗口
	initDialog(dialog_add);
	$('#messageTemplateAdd').dialog('close');
	// 编缉窗口
	initDialog(dialog_edit);
	$('#messageTemplateEdit').dialog('close');
}

/** -------- 初始化表单 ------ */
function initForm(){
	$('#add_msgKeys,#edit_msgKeys').textbox({
		label : '关键字：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : true
	});
	$('#add_formId,#edit_formId').textbox({
		label : 'formId：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : true
	});
	$('#add_toPage,#edit_toPage').textbox({
		label : '跳转页面：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : true
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
	$('#add_templetStatus,#edit_templetStatus').textbox({
		label : '模板状态：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#add_remark,#edit_remark').textbox({
		label : '备注：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		height: 100,
		multiline: true,
		required : false
	});
}

/** -------- 加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#messageTemplateTable').datagrid({
		url : root + '/messageTemplate/queryMessageTemplates',
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
			field : 'msgTempletId',
			checkbox : 'true',
			hidden: true,
			width : 20
		}, {
			field : 'msgKeys',
			title : '关键字',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'templetCode',
			title : '模板代码',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'templetName',
			title : '模板名称',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'remark',
			title : '备注',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'toPage',
			title : '跳转页面',
			align : 'center',
			formatter : baseFormater,
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
	$('#messageTemplateTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/**
 * 设置操作列的信息 row 当前行的数据 index 当前行的索引 从0 开始
 */
function optFormater(value, row, index) {
	var _id = "'" + row.msgTempletId + "'";
	var del = '';
	if(row.opAccount != 'admin'){
		del = '<a href="javascript:void(0);" onclick=deleteMessageTemplate(' + _id + ')>删除</a>';
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
	var selecteds = $('#messageTemplateTable').datagrid('getSelections');
	if(selecteds.length!=1){
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	var selected = $('#messageTemplateTable').datagrid('getSelected');
	$("#messageTemplateEditForm").form("load", selected);
	// 打开操作员编缉页面
	$('#messageTemplateEdit').dialog('open');
}

/** -------- 添加 ------ */
function addMessageTemplate() {
	//验证表单参数
	var sflag = $("#messageTemplateAddForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("messageTemplateAddForm");
	var add = {
		url : root + '/messageTemplate/addMessageTemplate',// 请求的action路径
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				resetAddForm();
				reloadTable("messageTemplateTable");
				$('#messageTemplateAdd').dialog('close');
			}
			showMessage(data);
		}
	};
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editMessageTemplate() {
	//验证表单参数
	var sflag = $("#messageTemplateEditForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("messageTemplateEditForm");
	var add = {
		url : root + '/messageTemplate/updateMessageTemplate',// 请求的action路径
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("messageTemplateTable");
				$('#messageTemplateEdit').dialog('close');
			}
			showMessage(data);
		}
	};
	sendAjaxRequest(add);
}

/** -------- 删除 ------ */
function deleteMessageTemplate(id) {
	$.messager.confirm('删除提示', '是否确认删除?', function(r) {
		if (r) {
			var options = {
				url : root + '/messageTemplate/deleteMessageTemplate',// 请求的action路径
				data : {
					"msgTempletId" : id
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("messageTemplateTable");
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
				url : root + '/messageTemplate/updateStatus',// 请求的action路径
				data : {
					"msgTempletId" : id,
					"templetStatus" : '0'
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("messageTemplateTable");
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
				url : root + '/messageTemplate/updateStatus',// 请求的action路径
				data : {
					"msgTempletId" : id,
					"templetStatus" : '1'
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("messageTemplateTable");
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
	//$("#templetStatus").val('');
	$('#sourceid').val('sdal');
}
function resetAddForm() {
	$("#messageTemplateAddForm").form("clear");
}