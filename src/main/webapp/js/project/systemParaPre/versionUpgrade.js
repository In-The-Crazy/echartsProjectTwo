var channels = [];
/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面模块
	initPage();
	// 树形
	ajaxTree();
	// 加载表格数据
	ajaxTable();

});

/** --------初始化页面模块 ------ */
function initPage() {
	$("#outerCode").textbox({
		label : '版本号：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#updateType").combobox({
		label : '状态：',
		labelWidth : 100,
		labelAlign : 'right',
		data : [ {
			"id" : "",
			"text" : "全部",
			"selected" : true
		}, {
			"id" : "0",
			"text" : "升级提醒"
		}, {
			"id" : "1",
			"text" : "必须升级"
		} ],
		valueField : 'id',
		textField : 'text',
		editable : false,
		width : 250
	});

	$("#add_outerCode,#edit_outerCode").textbox({
		label : '版本号：',
		labelWidth : 100,
		labelAlign : 'right',
		required : true,
		width : 250
	});
	$("#add_updateInfo,#edit_updateInfo").textbox({
		label : '升级提示:',
		labelWidth : 100,
		labelAlign : 'right',
		required : false,
		width : 250,
		height : '75px',
		multiline : true
	});
	$("#add_dlAddress,#edit_dlAddress").textbox({
		label : '升级路径：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		height : '75px',
		multiline : true
	});
	$("#add_updateType,#edit_updateType").combobox({
		label : '状态：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data : [ {
			"id" : "0",
			"text" : "升级提醒"
		}, {
			"id" : "1",
			"text" : "必须升级",
			"selected" : true
		} ],
		valueField : 'id',
		editable : false,
		required : true,
		textField : 'text'
	});

	var dialog_add = {
		id : "versionAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "versionEdit",
		title : "修改"
	};
	// 添加窗口
	initDialog(dialog_add);
	$('#versionAdd').dialog('close');
	// 添加窗口
	initDialog(dialog_edit);
	$('#versionEdit').dialog('close');
}

/** --------加载表格数据 ------ */
function ajaxTable() {
	// 验证表单参数
	var sflag = $("#conditionForm").form('validate');
	if (!sflag) {
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#versionTable').datagrid({
		url : root + '/version/queryVersionList',
		toolbar : "#toolbar",
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		showHeader : true,
		pageNumber : 1,
		pageSize : 20,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : false,// 是否只能选中一条
		queryParams : params,
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
			$.messager.alert('错误提示', '数据加载失败!', 'error');
		},
		onLoadSuccess : function(data) {

		},
		columns : [ [ {
			field : 'rownumbers',
			title : '',
			align : 'center',
			styler : rownumSytler,
			formatter : rownumFormater,
			width : 10
		}, {
			field : 'versionId',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'outerCode',
			title : '版本号',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'updateInfo',
			title : '升级提示',
			align : 'center',
			formatter : function(value, row, index) {
				var valueArr = value.split("|");
				var updateInfo = "";
				for (var i = 0; i < valueArr.length; i++) {
					updateInfo = updateInfo + "" + valueArr[i];
				}
				return updateInfo;
			},
			width : 200
		}, {
			field : 'dlAddress',
			title : '升级路径',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'updateType',
			title : '状态',
			align : 'center',
			formatter : function(value, row, index) {
				if (value == 0) {
					return '升级提醒';
				} else if (value == 1) {
					return '必须升级';
				}
			},
			width : 75
		}, {
			field : 'source',
			title : '适用设备',
			align : 'center',
			formatter : baseFormater,
			width : 200
		} ] ]
	});
}

// 加载树形
function ajaxTree() {
	$('#add_source,#edit_source').combobox({
		label : '适用设备：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : true,
		editable : false,
		multiple : false,
		data : [ {
			'id' : 'android',
			'text' : 'android'
		}, {
			'id' : 'iOS',
			'text' : 'iOS'
		} ],
		valueField : 'id',
		textField : 'text',
	})
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#versionTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */

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

/** --------查看详情 ------ */
function getInfo() {
	var selecteds = $('#versionTable').datagrid('getSelections');
	if (selecteds.length != 1) {
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	var selected = $('#versionTable').datagrid('getSelected');
	selected.updateInfo = selected.updateInfo.replace(/[|]/g, "\n");
	$('#versionEditForm').form('load', selected);
	$("#edit_id").val(selected.versionId);
	$('#versionEdit').dialog('open');
}

/** -------- 修改 ------ */
function eidtVersion() {
	var addflag = $("#versionEditForm").form('validate');
	if (!addflag) {
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("versionEditForm");
	var updateInfoValue = params.updateInfo;
	params.updateInfo = paramProcessing(updateInfoValue);

	var edit = {
		url : root + '/version/updateVersion',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("versionTable");
			}
			$('#versionEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(edit);
}

/** -------- 添加 ------ */
function addVersion() {
	var addflag = $("#versionAddForm").form('validate');
	if (!addflag) {
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("versionAddForm");
	var updateInfoValue = params.updateInfo;
	params.updateInfo = paramProcessing(updateInfoValue);

	var add = {
		url : root + '/version/addVersion',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("versionTable");
			}
			$('#versionAdd').dialog('close');
			showMessage(data);
			versionAddReset();
		}
	}
	sendAjaxRequest(add);
}

function paramProcessing(param) {
	param = param.replace(/[\n]/g, "|");
	param = param.replace(/[\r]/g, "");
	return param;
}

/** -------- 批量删除 ------ */
function deleteVersion() {
	var selecteds = $('#versionTable').datagrid('getSelections');
	if (selecteds.length == 0) {
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#versionTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#versionTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].versionId);// 记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root + '/version/deleteVersion';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("versionTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}

function closeAdd() {
	$('#versionAddForm').form('reset');
	$('#versionAdd').dialog('close');
}

/** -------- 重置查询条件 ------ */
function versionReset() {
	$('#conditionForm').form('reset');

}
function versionAddReset() {
	$('#versionAddForm').form('reset');
}