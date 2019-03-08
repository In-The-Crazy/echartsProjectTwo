/** -------- 常量 ------ */
var _param = {};

/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面模块
	initPage();
	// 初始化表单
	initForm();
	// 加载表格数据
	ajaxTable();
});

/** --------加载日历选择 ------ */
function initForm() {
	var today = new Date();
	var first = new Date();
	first.setDate(1);
	today = today.pattern("yyyy-MM-dd");
	first = first.pattern("yyyy-MM-dd");
	$('#startDate').datebox({
		label : '航班开始日期：',
		labelWidth : 100,
		labelAlign : "right",
		editable : false,
		value : first,
		width : 250
	});
	$('#endDate').datebox({
		label : '航班开始日期：',
		labelWidth : 100,
		labelAlign : "right",
		editable : false,
		value : today,
		width : 250
	});
	
	$('#afrom').textbox({
		label : '出发地：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#ato').textbox({
		label : '到达地：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#ffpNo').textbox({
		label : '常客号：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#mobile').textbox({
		label : '绑定手机：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	var add = {
		url : root + '/common/querydictsByType',
		data : {
			"type" : "blackDate"
		},
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				$('#edit_validate').combobox({
					label : '有效期：',
					labelWidth : 100,
					labelAlign : "right",
					data : data.rows,
					valueField : 'dincCode',
					textField : 'dincName',
					editable : false,
					required : true,
					width : 250
				});
			}
		}
	}
	sendAjaxRequest(add);
}

/** -------- 初始化页面模块 ------ */
function initPage() {
	// 黑名单明细
	var dialog_info = {
		id : "blacklistInfo",
		title : "黑名单详细信息"
	};
	initDialog(dialog_info);
	$('#blacklistInfo').dialog('close');

	
	// 封禁窗口
	var dialog_edit = {
		id : "closureDialog",
		title : "封禁"
	};
	initDialog(dialog_edit);
	$('#closureDialog').dialog('close');
}

/** --------加载表格数据 ------ */
function ajaxTable() {
	var sdate = $('#startDate').datebox('getValue');
	var edate = $('#endDate').datebox('getValue');
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		sdate = sdate.replace(/-/g, '');
		edate = edate.replace(/-/g, '');
		if (parseInt(sdate) > parseInt(edate)) {
			$.messager.alert('错误提示', '航班开始日期不能大于航班截止日期', 'error');
			return false;
		}
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#blacklistTable').datagrid({
		url : root + '/member/queryUnpayOrder',
		toolbar : "#toolbar",
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
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
			_param = data.obj;
			if(data.isSuccessOrfail == 'FAIL'){
				$.messager.alert('错误提示', data.message, 'error');
			}
		},
		columns : [ [ {
			field : 'userid',
			hidden : true
		}, {
			field : 'startDate',
			title : '航班开始日期',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'endDate',
			title : '航班结束日期',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'ordercount',
			title : '占座订单数',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		}, {
			field : 'realName',
			title : '姓名',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'ffpCard',
			title : '常客号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'mobile',
			title : '绑定手机',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'blackFlag',
			title : '黑名单',
			align : 'center',
			formatter : function(value, row, index){
				var text = baseNumFormater(value, row, index);
				if(text == 0){
					text = "否"
				}else{
					text = "是"
				}
				return text;
			},
			width : 75
		}, {
			field : 'opt',
			title : '操作',
			align : 'center',
			formatter : optFormater,
			width : 50
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#blacklistTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function optFormater(value, row, index) {
	var _id = "'" + row.userid + "'";
	var _index = "'" + index + "'";
	var detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',' + _index + ')>查看</a>';
	return detail;
};

/** --------查看订单详情 ------ */
function getInfo(id, index) {
	$('#blacklistTable').datagrid('selectRow', index);
	var select = $('#blacklistTable').datagrid('getSelected');
	$("#closureForm").form("load", select);
	if(select.blackFlag == "0"){
		$("#closure_btn").show();
		$("#unseal_btn").hide();
	}else{
		$("#closure_btn").hide();
		$("#unseal_btn").show();
		
	}
	_param["userid"] = id
	// 打开订单详情页面
	$('#blacklistInfo').dialog('open');
	// 设置滚动条的垂直偏移为0
	$("#blacklistInfo").scrollTop(0);
	// 标示是否选中行的，true - 是 , false - 否
	var IsCheckFlag = true;
	$('#blacklistInfoTable').datagrid({
		url : root + '/member/queryUnpayOrderDetail',
		queryParams : _param,
		checkOnSelect : false,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		pageNumber : 1,
		pageSize : 20,
		fitColumns : true,// 列自适应表格宽度
		striped : false,// 当true时，单元格显示条纹
		rownumbers : true,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		loadMsg : '数据加载中,请稍后...',
		onLoadSuccess : function(data) {
		},
		onClickCell : function(rowIndex, rowData) {
			IsCheckFlag = false;
		},
		onSelect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#blacklistInfoTable").datagrid("unselectRow", rowIndex);
			}
		},
		onUnselect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#blacklistInfoTable").datagrid("selectRow", rowIndex);
			}
		},
		columns : [ [ {
			field : 'afrom',
			title : '出发地',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'ato',
			title : '到达地',
			formatter : baseFormater,
			align : 'center',
			width : 100
		}, {
			field : 'username',
			title : '联系人姓名',
			formatter : baseFormater,
			align : 'center',
			width : 100
		}, {
			field : 'pname',
			title : '乘机人姓名',
			formatter : baseFormater,
			align : 'center',
			width : 100
		}, {
			field : 'pnr',
			title : 'PNR',
			formatter : baseFormater,
			align : 'center',
			width : 100
		}, {
			field : 'fdate',
			title : '航班日期',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'orderdate',
			title : '订单时间',
			align : 'center',
			formatter : function(value, row, index){
					return row.orderdate+" "+row.ordertime;
			},
			width : 100
		} ] ]
	});
}

/** -------- 封禁 ------ */
function closure(){
	//验证表单参数
	var sflag = $("#closureForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请选择有效期！', 'error');
		return false;
	}
	$.messager.confirm('封禁提示', '是否确认封禁?', function(r) {
		if (r) {
			var params = serializeJson("closureForm");
			var edit = {
				url : root + '/member/addToBlack',
				data : params,
				callBackFun : function(data) {
					$('#closureDialog').dialog('close');
					$('#blacklistInfo').dialog('close');
					reloadTable("blacklistTable");
					showMessage(data);
					$('#closureForm').form('reset');
				}
			}
			sendAjaxRequest(edit);
		}
	});
}

/** -------- 解封 ------ */
function unseal(){
	$.messager.confirm('解封提示', '是否确认解封?', function(r) {
		if (r) {
			var params = serializeJson("closureForm");
			var edit = {
				url : root + '/member/outOfBlack',
				data : params,
				callBackFun : function(data) {
					$('#blacklistInfo').dialog('close');
					reloadTable("blacklistTable");
					showMessage(data);
				}
			}
			sendAjaxRequest(edit);
		}
	});
}

/** -------- 重置查询条件 ------ */
function blacklistReset() {
	$('#conditionForm').form('reset');
}
