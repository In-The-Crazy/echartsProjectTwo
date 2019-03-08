/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面模块
	initPage();
	// 加载日历选择
	initDatebox();
	// 加载树型
	ajaxTree();
	// 加载表格数据
	ajaxTable(true);
});

/** --------加载日历选择 ------ */
function initDatebox() {
	var today = new Date();
	var first = new Date();
	first.setDate(1);
	today = today.pattern("yyyy-MM-dd");
	first = first.pattern("yyyy-MM-dd");
	$('#startDate').datebox({
		label : '保险起始日期：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		value: first,
		editable : false,
		required : false
	});
	$('#endDate').datebox({
		label : '保险截止日期：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		value: today,
		editable : false,
		required : false
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	$("#insuredName").textbox({
		label : '购保人名称：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#ordercode").textbox({
		label : '订单号：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#ticketNo").textbox({
		label : '票号：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	
	var dialog_info = {
		id : "passengerInfo",
		title : "旅客信息详情"
	};

	// 查看窗口
	initDialog(dialog_info);
	$('#passengerInfo').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var sdate = $('#startDate').datebox('getValue');
	var edate = $('#endDate').datebox('getValue');
	if (!isEmpty(sdate)) {
		sdate = sdate.replace(/-/g, '');
	}
	if (!isEmpty(edate)) {
		edate = edate.replace(/-/g, '');
	}
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		if (parseInt(sdate) > parseInt(edate)) {
			$.messager.alert('错误提示', '保险起始日期不能大于保险截止日期', 'error');
			return false;
		}
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#refundTable').datagrid({
		url : root + '/insurance/queryInsuranceInfoList',
		toolbar : '#toolbar',
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
		onBeforeLoad : function() {
		},
		onLoadError : function() {
			$.messager.alert('错误提示', '数据加载失败!', 'error');
		},
		onLoadSuccess : function(data) {
		},
		columns : [ [ {
			field : 'ticketId',
			hidden : true
		}, {
			field : 'insType',
			hidden : true
		}, {
			field : 'orderId',
			hidden : true
		}, {
			field : 'ordercode',
			title : '订单编号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'ticketNo',
			title : '票号',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'buyUnitPrice',
			title : '单价',
			align : 'center',
			formatter : baseNumFormater,
			width : 50
		}, {
			field : 'status',
			title : '保险状态',
			align : 'center',
			formatter : insuranceStatusFormater,
			width : 75
		}, {
			field : 'insuredName',
			title : '购保人姓名',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'insuredMobile',
			title : '购保人手机',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'insuranceCompanyName',
			title : '保险公司',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'insuranceProductName',
			title : '保险产品',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'insNo',
			title : '保单号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'createDate',
			title : '保险日期',
			align : 'center',
			formatter : dateTimeFormater,
			width : 150
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	$('#insStatus').combobox({
		label : '保险状态：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data: [{
			"id" : "",
			"text" : "全部",
			"selected": true
		},{
			"id" : "0",
			"text" : "购买失败"
		},{
			"id" : "1",
			"text" : "购买成功"
		},{
			"id" : "2",
			"text" : "退保拒绝"
		},{
			"id" : "5",
			"text" : "退保完成"
		}],
		valueField:'id',
		textField:'text'
	});
	
	$('#isFree').combobox({
		label : '订单类型：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		data : [{
			"id" : "",
			"text" : "全部",
			'selected':true
		},{
			'id':'0',
			'text':'现金订单'
		},{
			'id':'1',
			'text':'积分订单'
		}],
		valueField : 'id',
		textField:'text',
		editable : false
	});
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#refundTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function passengerFormater(value, row, index) {
	var _id = "'" + row.ticketid + "'";
	var _name = "'" + row.name + "'";
	var _gmobile = "'" + row.gmobile + "'";
	var _idtype = "'" + idtypeFormatter(row.idtype, row, index) + "'";
	var _idnumber = "'" + row.idnumber + "'";
	var detail = '<a href="javascript:void(0);" onclick="getPassengerInfo(' + _id + ',' + _name + ','
		+ _gmobile + ',' + _idtype + ',' + _idnumber + ')">'
		+ row.name + '</a>';
	return detail;
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
function getPassengerInfo(id, name, gmobile, idtype, idnumber) {
	$("#info_name").html(name);
	$("#info_mobile").html(gmobile);
	$("#info_idtype").html(idtype);
	$("#info_idnum").html(idnumber);
	$('#passengerInfo').dialog('open');
}
function getTicketInfo(id, chgroledesc) {
	$.messager.alert('机票退改签规定', chgroledesc, 'info');
}

/**
 * 批量提交退票
 * 
 * @return
 */
function applyRefund() {
	var selecteds = $('#refundTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#refundTable').datagrid('getSelected')) {
		var ids = [],
		types = [],
		selectedRow = $('#refundTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].ticketId);
			types.push(selectedRow[i].insType);
		}
		var dpid = ids.join(',');
		var dptype = types.join(',');
		$.messager.confirm('提交退保提示', '是否确认提交退保? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root + '/refund/singleCancelInsure';
				var options = {
					url : url,
					data : {
						"ticketId" : dpid,
						"type" : dptype
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("refundTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}

function applyRefundByTicketNo() {
	var selecteds = $('#refundTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#refundTable').datagrid('getSelected')) {
		var ids = [],
		selectedRow = $('#refundTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].ticketNo);
		}
		var dpid = ids.join(',');
		$.messager.confirm('提交退保提示', '是否确认提交退保? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root + '/refund/cancelInsureByTicketNo';
				var options = {
						url : url,
						data : {
							"ticketNo" : dpid
						},
						callBackFun : function(data) {
							if (data.isSuccessOrfail == "SUCCESS") {
								reloadTable("refundTable");
							}
							showMessage(data);
						}
				}
				sendAjaxRequest(options);
			}
		});
	}
}

function planPolicySchedule() {
	var selecteds = $('#refundTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#refundTable').datagrid('getSelected')) {
		var ids = [],
		selectedRow = $('#refundTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].orderId);
		}
		var dpid = ids.join(',');
		$.messager.confirm('重新购保提示', '是否确认重新购保? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root + '/refund/planPolicySchedule';
				var options = {
						url : url,
						data : {
							"orderId" : dpid
						},
						callBackFun : function(data) {
							if (data.isSuccessOrfail == "SUCCESS") {
								reloadTable("refundTable");
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
function refundReset() {
	$("#conditionForm").form("reset");
}
