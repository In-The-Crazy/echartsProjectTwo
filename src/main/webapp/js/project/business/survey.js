/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面模块
	initPage();
	// 加载日历选择
	initDatebox();
	// 加载表格数据
	ajaxTable();
	// 加载树型
	ajaxTree();
});

/** --------加载日历选择 ------ */
function initDatebox() {
}

/** --------初始化页面模块 ------ */
function initPage() {
	$("#name").textbox({
		label : '名称：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#add_name,#edit_name").textbox({
		label : '名称：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#add_url,#edit_url").textbox({
		label : '地址：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		height : 100
	});
	
	var dialog_add = {
		id : "surveryAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "surveryEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#surveryAdd').dialog('close');
	// 修改窗口
	initDialog(dialog_edit);
	$('#surveryEdit').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#surveyTable').datagrid({
		url : root+'/business/querySurveyList',
		toolbar : '#toolbar',
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
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
			field : 'surId',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'surName',
			title : '名称',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'surUrl',
			title : '地址',
			align : 'center',
			formatter : baseFormater,
			width : 200
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#surveyTable').datagrid('resize');
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
function getInfo(flag) {
	if(flag == 'edit'){
		var selecteds = $('#surveyTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#surveyTable').datagrid('getSelected')
		$("#edit_id").val(selected.surId);
		$("#surveryEditForm").form("load",selected);
		
		$('#surveryEdit').dialog('open');
	}
}
/** -------- 添加 ------ */
function addsurvery(){
	var params = serializeJson("surveryAddForm");
	var add = {
		url : root+'/business/addSurvey',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("surveyTable");
			}
			$('#surveryAdd').dialog('close');
			showMessage(data);
			surveryAddReset();
		}
	}
	sendAjaxRequest(add);
}
/** -------- 修改 ------ */
function editsurvery(){
	var params = serializeJson("surveryEditForm");
	var add = {
		url : root+'/business/updateSurvey',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("surveyTable");
			}
			$('#surveryEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}

/** -------- 批量删除 ------ */
function delsurvery() {
	var selecteds = $('#surveyTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#surveyTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#surveyTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].surId);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root+'/business/deleteSurvey';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("surveyTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}

/** -------- 重置查询条件 ------ */
function surveyReset() {
	$('#conditionForm').form('reset');
	$('#sourceid').val('sdal');
}
function surveryAddReset() {
	$('#surveryAddForm').form('reset');
}
