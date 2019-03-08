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
	var dialog_add = {
		id : "payAttriAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "payAttriEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#payAttriAdd').dialog('close');
	// 添加窗口
	initDialog(dialog_edit);
	$('#payAttriEdit').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#payAttriPreTable').datagrid({
		url : 'payAttriPreList.action',
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
		onSelect : function(rowIndex, rowData){
			$("#edit_attributeId").val(rowData.attributeId);
		},
		columns : [ [ {
			field : 'rownumbers',
			title : '',
			align : 'center',
			styler : rownumSytler,
			formatter : rownumFormater,
			width : 15
		}, {
			field : 'attributeId',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'columnName',
			title : '字段名',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'columnType',
			title : '字段数据类型',
			align : 'center',
			formatter : columnTypeFormater,
			width : 75
		}, {
			field : 'columnLength',
			title : '字段长度',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'columnTemp',
			title : '字段格式化',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'isnull',
			title : '是否允许为空',
			align : 'center',
			formatter : function(value, row, index){
				var text = '--';
				if(value == '0'){
					text = '允许为空';
				}
				if(value == '1'){
					text = '不允许为空';
				}
				return text;
			},
			width : 75
		}, {
			field : 'payMethodCode',
			title : '支付方式代码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'payMethodName',
			title : '支付方式名称',
			align : 'center',
			formatter : baseFormater,
			width : 75
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	//字段数据类型
	$('#add_columnType').combobox({
		data: [{
			"id" : "N",
			"text" : "数字"
		},{
			"id" : "E",
			"text" : "邮件"
		},{
			"id" : "P",
			"text" : "密码"
		},{
			"id" : "T",
			"text" : "电话"
		},{
			"id" : "C",
			"text" : "字符"
		},{
			"id" : "S",
			"text" : "单选框"
		}],
		valueField:'id',
		textField:'text',
		required : true
	});
	$('#edit_columnType').combobox({
		data: [{
			"id" : "N",
			"text" : "数字"
		},{
			"id" : "E",
			"text" : "邮件"
		},{
			"id" : "P",
			"text" : "密码"
		},{
			"id" : "T",
			"text" : "电话"
		},{
			"id" : "C",
			"text" : "字符"
		},{
			"id" : "S",
			"text" : "单选框"
		}],
		valueField:'id',
		textField:'text',
		required : true
	});
	
	//是否允许为空
	$('#add_isnull').combobox({
		data: [{
			"id" : "0",
			"text" : "允许为空"
		},{
			"id" : "1",
			"text" : "不允许为空"
		}],
		valueField:'id',
		textField:'text'
	});
	$('#edit_isnull').combobox({
		data: [{
			"id" : "0",
			"text" : "允许为空"
		},{
			"id" : "1",
			"text" : "不允许为空"
		}],
		valueField:'id',
		textField:'text'
	});
	$('#add_isnull').combobox('select', '1');
	
	//查询-支付方式
	var query = {
		url : 'queryConditionPayMethod.action',
		callBackFun : function(data) {
			$('#query_payMethodCode').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 150
			});
		}
	}
	sendAjaxRequest(query);
	
	//添加-支付方式
	var add = {
		url : 'queryAddPayMethod.action',
		callBackFun : function(data) {
			$('#add_payMethodCode').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 150,
				required : true
			});
		}
	}
	sendAjaxRequest(add);
	
	//修改-支付方式
	var edit = {
		url : 'queryAddPayMethod.action',
		callBackFun : function(data) {
			$('#edit_payMethodCode').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 150,
				required : true
			});
		}
	}
	sendAjaxRequest(edit);
}

/** -------- 根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#payAttriPreTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** -------- 自定义文本 ------ */

/** -------- 自定义单元格样式 ------ */
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

/** -------- 查看会员详情 ------ */
function getInfo(id, flag) {
	if(flag == 'edit'){
		var selecteds = $('#payAttriPreTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		if(isEmpty(id)){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#payAttriPreTable').datagrid('getSelected');
		$("#edit_columnName").val(selected.columnName);
		$('#edit_columnType').combobox('select', selected.columnType);
		$("#edit_columnLength").val(selected.columnLength);
		$("#edit_columnTemp").val(selected.columnTemp);
		$('#edit_isnull').combobox('select', selected.isnull);
		$('#edit_payMethodCode').combobox('select', selected.payMethodCode);
		$('#payAttriEdit').dialog('open');
	}
}

/** -------- 添加 ------ */
function addPayAttri(){
	var params = serializeJson("payAttriAddForm");
	var add = {
		url : 'addPayAttribute.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("payAttriPreTable");
			}
			$('#payAttriAdd').dialog('close');
			showMessage(data);
			payAttriAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editPayAttri(){
	var params = serializeJson("payAttriEditForm");
	var add = {
		url : 'modifyPayAttribute.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("payAttriPreTable");
			}
			$('#payAttriEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}

/** -------- 批量删除 ------ */
function delPayAttriPre() {
	var selecteds = $('#payAttriPreTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#payAttriPreTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#payAttriPreTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].attributeId);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = 'deletePayAttribute.action';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("payAttriPreTable");
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
function payRelationPreReset() {
	$('#conditionForm').form('clear');
	$('#sourceid').val('sdal');
	$('#query_payMethodCode').combobox('setValue', '');
	initDatebox();
}

function payAttriAddReset() {
	$('#payAttriAddForm').form('clear');
	$('#add_bankName').combobox('select', '0');
}
