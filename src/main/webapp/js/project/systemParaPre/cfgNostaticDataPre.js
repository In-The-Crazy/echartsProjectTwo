/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面模块
	initPage();
	// 加载日历选择
	initDatebox();
	// 加载树型
	ajaxTree();
	// 加载表格数据
	ajaxTable();
});

/** --------加载日历选择 ------ */
function initDatebox() {
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_add = {
		id : "cfgNostaticAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "cfgNostaticEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#cfgNostaticAdd').dialog('close');
	// 添加窗口
	initDialog(dialog_edit);
	$('#cfgNostaticEdit').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#cfgNostaticDataPreTable').datagrid({
		url : 'cfgNostaticDataPreList.action',
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
			field : 'id',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'codeType',
			title : '参数类型',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'codeDesc',
			title : '参数描述',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'codeValue',
			title : '参数源',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'codeName',
			title : '参数值',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'cfgPerson',
			title : '创建人',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'cfgDate',
			title : '创建时间',
			align : 'center',
			formatter : dateTimeFormater,
			width : 100
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	//状态
	$('#add_codeType').combobox({
		data: [{
			"id" : "LOADING_TEXT",
			"text" : "加载显示文字内容"
		},{
			"id" : "INSURANCE_INSTRUCTION",
			"text" : "保险说明"
		},{
			"id" : "PUSHMSG_JUMPMODULE",
			"text" : "消息推送跳转模板"
		},{
			"id" : "FRIENDS_SHARE",
			"text" : "好友分享"
		},{
			"id" : "PAYMENT_TIME_LIMIT",
			"text" : "支付时限"
		},{
			"id" : "TICKET_MANAGER_PHONE",
			"text" : "出票人管理手机号码"
		}],
		valueField:'id',
		textField:'text'
	});
	
	$('#edit_codeType').combobox({
		data: [{
			"id" : "LOADING_TEXT",
			"text" : "加载显示文字内容"
		},{
			"id" : "INSURANCE_INSTRUCTION",
			"text" : "保险说明"
		},{
			"id" : "PUSHMSG_JUMPMODULE",
			"text" : "消息推送跳转模板"
		},{
			"id" : "FRIENDS_SHARE",
			"text" : "好友分享"
		},{
			"id" : "PAYMENT_TIME_LIMIT",
			"text" : "支付时限"
		},{
			"id" : "TICKET_MANAGER_PHONE",
			"text" : "出票人管理手机号码"
		}],
		valueField:'id',
		textField:'text'
	});
	$('#add_codeType').combobox('select', 'LOADING_TEXT');
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#cfgNostaticDataPreTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function optFormater(value, row, index) {
	var _id = "'" + row.id + "'";
	return '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"info")>详情</a>';
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

/** --------查看详情 ------ */
function getInfo(flag) {
	if(flag == 'edit'){
		var selecteds = $('#cfgNostaticDataPreTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#cfgNostaticDataPreTable').datagrid('getSelected')
		$('#edit_codeType').combobox('select', selected.codeType);
		$("#edit_codeValue").val(selected.codeValue);
		$("#edit_codeName").val(selected.codeName);
		$("#edit_codeDesc").val(selected.codeDesc);
		
		$('#cfgNostaticEdit').dialog('open');
	}
}

/** -------- 添加 ------ */
function addcfgNostatic(){
	var params = serializeJson("cfgNostaticAddForm");
	var add = {
		url : 'addCfgNostaticData.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("cfgNostaticDataPreTable");
			}
			$('#cfgNostaticAdd').dialog('close');
			showMessage(data);
			SoftwareVersionAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editcfgNostatic(){
	var params = serializeJson("cfgNostaticEditForm");
	var add = {
		url : 'modifyCfgNostaticData.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("cfgNostaticDataPreTable");
			}
			$('#cfgNostaticEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}

/** -------- 批量删除 ------ */
function delcfgNostatic() {
	var selecteds = $('#cfgNostaticDataPreTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#cfgNostaticDataPreTable').datagrid('getSelected')) {
		var ids = [];
		var codes = [];
		var selectedRow = $('#cfgNostaticDataPreTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].codeType);//记得改ID
			codes.push(selectedRow[i].codeValue);//记得改ID
		}
		var dpid = ids.join(',');
		var code = codes.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = 'deleteCfgNostaticData.action';
				var options = {
					url : url,
					data : {
						"ids" : dpid,
						"code" : code
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("cfgNostaticDataPreTable");
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
function cfgNostaticAddReset() {
	$('#cfgNostaticAddForm').form('clear');
	
	$('#add_codeType').combobox('select', 'LOADING_TEXT');
}