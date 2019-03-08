/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面模块
	initPage();
	// 加载日历选择
	initForm();
	// 加载树型
	ajaxTree();
	// 加载表格数据
	ajaxTable();
});

/** --------加载日历选择 ------ */
function initForm() {
	var today = new Date();
	today = today.pattern("yyyy-MM-dd");
	$('#startdate').datebox({
		label : '支付起始日期：',
		labelWidth : 100,
		labelAlign : "right",
		editable : false,
		value : today,
		width : 250,
		onSelect : function(beginDate) {
			$('#enddate').datebox().datebox('calendar').calendar({
				validator : function(date) {
					return beginDate <= date;
				}
			});
		}
	});
	$('#enddate').datebox({
		label : '支付截止日期：',
		labelWidth : 100,
		labelAlign : "right",
		editable : false,
		value : today,
		width : 250
	});
	$('#name').textbox({
		label : '旅客姓名：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#fnumber').textbox({
		label : '航班号：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#ordercode').textbox({
		label : '订单号：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#paybillno').textbox({
		label : '支付订单号：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#pnr').textbox({
		label : 'PNR：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#airways').textbox({
		label : '市场方：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#airline').textbox({
		label : '承运方：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_info = {
		id : "passengerInfo",
		title : "旅客信息详情"
	};
	var dialog_outTicket = {
		id : "outTicketInfo",
		title : "人工出票"
	};

	// 查看窗口
	initDialog(dialog_info);
	$('#passengerInfo').dialog('close');
	initDialog(dialog_outTicket);
	$('#outTicketInfo').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var sdate = $('#startdate').datebox('getValue');
	var edate = $('#enddate').datebox('getValue');
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		sdate = sdate.replace(/-/g, '');
		edate = edate.replace(/-/g, '');
		if (parseInt(sdate) > parseInt(edate)) {
			$.messager.alert('错误提示', '支付开始日期不能大于支付截止日期', 'error');
			return false;
		}
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#outTicketTable').datagrid({
		url : root + '/refund/outTicketList',
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
		onLoadError : function() {
			$.messager.alert('错误提示', '数据加载失败!', 'error');
		},
		onLoadSuccess : function(data) {
		},
		columns : [ [ {
			field : 'orderId',
			checkbox : 'true',
			align : 'center',
			hidden : true,
			width : 25
		}, {
			field : 'orderDate',
			title : '订单时间',
			align : 'center',
			formatter : dateFormater,
			width : 75
		}, {
			field : 'orderCode',
			title : '订单号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'pnr',
			title : 'PNR',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'airways',
			title : '市场方',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'airline',
			title : '承运方',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'contactName',
			title : '联系人',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'contactMobile',
			title : '联系号码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'payChannelName',
			title : '支付通道',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'paybillno',
			title : '支付订单号',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'orderStatus',
			title : '订座状态',
			align : 'center',
			formatter : statusFormater,
			width : 75
		}, {
			field : 'payStatus',
			title : '支付状态',
			align : 'center',
			formatter : paystatusFormater,
			width : 75
		}, {
			field : 'isInter',
			title : '国内/国际',
			align : 'center',
			formatter : isInterFormater,
			width : 50
		}, {
			field : 'opt',
			title : '操作',
			align : 'center',
			formatter : optFormater,
			width : 75
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	$('#orderStatus').combobox({
		label : '订单状态：',
		labelWidth : 100,
		labelAlign : "right",
		data : [{
			"id": "",
			"text": "全部"
		},{
			"id": "1",
			"text": "已支付,未出票",
			"selected": true
		},{
			"id": "10",
			"text": "已人工出票"
		}],
		valueField: 'id',
		textField: 'text',
		editable : false,
		width : 250
	});
	$('#isInter').combobox({
		label : '国内/国际：',
		labelWidth : 100,
		labelAlign : "right",
		data : [{
			"id": "",
			"text": "全部",
			"selected": true
		},{
			"id": "0",
			"text": "国内"
		},{
			"id": "1",
			"text": "国际"
		}],
		valueField: 'id',
		textField: 'text',
		editable : false,
		width : 250
	});
	var channels = {
		url : root + '/common/channels',
		callBackFun : function(data) {
			var treeList = rowsListAddAll(data.rows, {
				"selected" : true,
				"children" : null,
				"chalCode" : "",
				"chalName" : "全部"
			});
			$('#channel').combobox({
				label : '渠道：',
				labelWidth : 100,
				labelAlign : "right",
				data : treeList,
				valueField: 'chalCode',
				textField: 'chalName',
				editable : false,
				width : 250
			});
		}
	}
	sendAjaxRequest(channels);
	
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
	
	$('#passerType').combobox({
		label : '乘机人类型：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		data : [{
			"id" : "",
			"text" : "全部",
			'selected':true
		},{
			'id':'0',
			'text':'成人'
		},{
			'id':'1',
			'text':'儿童'
		},{
			'id':'2',
			'text':'婴儿'
		}],
		valueField : 'id',
		textField:'text',
		editable : false
	});
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#outTicketTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function optFormater(value, row, index) {
	var _id = "'" + row.orderId + "'";
	var _isHandIssue = row.isHandIssue;
	var _orderStatus = row.orderStatus;
	var detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ')>人工出票</a>';
	if(_orderStatus == "2"){
		detail = "已出票"
	}
	if(_isHandIssue == "1"){
		detail = "已人工出票"
	}
	return detail;
};
function ticketFormater(value, row, index) {
	if (isEmpty(value)) {
		return "双击录入票号"
	}
	return value;
};
function pnrFormater(value, row, index) {
	if (isEmpty(value)) {
		return "双击录入PNR"
	}
	return value;
};

/** --------自定义单元格样式 ------ */
function editorSytler(value, row, index) {
	if (isEmpty(value)) {
		return "color: red;"
	}
	return "";
};

/** --------查看详情 ------ */
function getInfo(id) {
	var options = {
		url : root + '/refund/queryOutTicketByOrderId',
		data : {
			'orderid' : id
		},
		callBackFun : function(data) {
			$("#outTicketId").val(id);
			// 打开详情页面
			$('#outTicketInfo').dialog('open');
			var IsCheckFlag = true; // 标示是否选中行的，true - 是 , false - 否
			// 加载订单详情表格
			$('#outTicketInfoTable').datagrid({
				data : data.rows,
				checkOnSelect : false,// 是否选中/取消复选框
				pagination : false,// 是否分页
				autoRowHeight : false,// 定义是否设置基于该行内容的行高度
				fitColumns : true,// 列自适应表格宽度
				striped : false,// 当true时，单元格显示条纹
				rownumbers : false,// 是否显示行号
				singleSelect : true,// 是否只能选中一条
				onLoadSuccess : function(data) {
				},
				onClickCell : function(rowIndex, rowData) {
					IsCheckFlag = false;
				},
				onDblClickCell : editTicket,
				onSelect : function(rowIndex, rowData) {
					if (!IsCheckFlag) {
						IsCheckFlag = true;
						$("#outTicketInfoTable").datagrid("unselectRow", rowIndex);
					}
				},
				onUnselect : function(rowIndex, rowData) {
					if (!IsCheckFlag) {
						IsCheckFlag = true;
						$("#outTicketInfoTable").datagrid("selectRow", rowIndex);
					}
				},
				columns : [ [ {
					field : 'ticketid',
					checkbox : 'true',
					align : 'center',
					hidden : true,
					width : 25
				}, {
					field : 'name',
					title : '旅客名',
					align : 'center',
					formatter : baseFormater,
					width : 75
				}, {
					field : 'fnumber',
					title : '航班号',
					align : 'center',
					formatter : baseFormater,
					width : 75
				}, {
					field : 'sail',
					title : '航段',
					align : 'center',
					formatter : baseFormater,
					width : 75
				}, {
					field : 'fdate',
					title : '起飞日期',
					align : 'center',
					formatter : baseFormater,
					width : 75
				}, {
					field : 'ftime',
					title : '起飞时间',
					align : 'center',
					formatter : baseFormater,
					width : 75
				}, {
					field : 'seat',
					title : '舱位',
					align : 'center',
					formatter : baseFormater,
					width : 75
				}, {
					field : 'money',
					title : '票面价',
					align : 'center',
					formatter : baseFormater,
					width : 75
				}, {
					field : 'airportTax',
					title : '机建税',
					align : 'center',
					formatter : baseFormater,
					width : 75
				}, {
					field : 'fuelTax',
					title : '燃油税',
					align : 'center',
					formatter : baseFormater,
					width : 75
				}, {
					field : 'fmoney',
					title : '优惠金额',
					align : 'center',
					formatter : baseFormater,
					width : 75
				}, {
					field : 'paymoney',
					title : '支付金额',
					align : 'center',
					formatter : baseFormater,
					width : 75
				}, {
					field : 'status',
					title : '订单状态',
					align : 'center',
					formatter : statusFormater,
					width : 75
				}, {
					field : 'paystatus',
					title : '支付状态',
					align : 'center',
					formatter : paystatusFormater,
					width : 75
				}, {
					field : 'pnr',
					title : 'PNR',
					align : 'center',
					styler : editorSytler,
					formatter : pnrFormater,
					editor : 'text',
					width : 100
				}, {
					field : 'eticketno',
					title : '票号',
					align : 'center',
					styler : editorSytler,
					formatter : ticketFormater,
					editor : 'text',
					width : 100
				} ] ]
			});
		}
	}
	sendAjaxRequest(options);
}

/** -------- 人工出票 ------ */
function outTicketByHand() {
	$.messager.confirm('人工出票提示', '是否确认人工出票?', function(r) {
		if (r) {
			var id = $("#outTicketId").val();
			var rows = $('#outTicketInfoTable').datagrid('getData').rows;
			var para = id+";";
			$.each(rows, function(i, field){
				if (field.pnr == "双击录入PNR" || isEmpty(field.pnr)) {
					$.messager.alert('错误提示', 'PNR不能为空!', 'error');
					return false;
				}
				if (field.eticketno == "双击录入票号" || isEmpty(field.eticketno)) {
					$.messager.alert('错误提示', '票号不能为空!', 'error');
					return false;
				}
				var pnrReg = /^[a-zA-Z0-9]{6}$/;
				if(!pnrReg.test(field.pnr)){
					$.messager.alert('错误提示', 'PNR不符合规范！', 'error');
				}
				para += field.ticketid + "," + field.eticketno + "," + field.pnr + ":";
			});
			var data = {
				'idPara' : para
			};
			var options = {
				url : root + '/refund/outTicketByHand',// 请求的action路径
				data : data,
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						$('#outTicketInfo').dialog('close');
						reloadTable("outTicketTable");
					}
					showMessage(data);
				}
			};
			sendAjaxRequest(options);
		}
	});
}

/** -------- 导出 ------ */
function exportOutticket() {
	var data = $('#outTicketTable').datagrid('getData');
	var paper = $('#outTicketTable').datagrid('getPager').pagination("options");
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
				openWindowWithJson(root +'/refund/exportOutTicketList',params);
			}
		});
	}else{
		params["start"] = 1;
		params["end"] = paper.total;
		//return false;
		openWindowWithJson(root +'/refund/exportOutTicketList',params);
	}
}

/** -------- 重置查询条件 ------ */
function outTicketReset() {
	$("#conditionForm").form("reset");
}

/** -------- 编辑单元格 ------ */
$.extend($.fn.datagrid.methods, {
	editCell : function(cell, param) {
		return cell.each(function() {
			var opts = $(this).datagrid('options');
			var fields = $(this).datagrid('getColumnFields', true).concat(
					$(this).datagrid('getColumnFields'));
			for (var i = 0; i < fields.length; i++) {
				var col = $(this).datagrid('getColumnOption', fields[i]);
				col.editor1 = col.editor;
				if (fields[i] != param.field) {
					col.editor = null;
				}
			}
			$(this).datagrid('beginEdit', param.index);
			for (var i = 0; i < fields.length; i++) {
				var col = $(this).datagrid('getColumnOption', fields[i]);
				col.editor = col.editor1;
			}
		});
	}
});

var editIndex = undefined;
function endEditing() {// 结束编辑
	if (editIndex == undefined) {
		return true
	}
	if ($('#outTicketInfoTable').datagrid('validateRow', editIndex)) {
		$('#outTicketInfoTable').datagrid('endEdit', editIndex);
		editIndex = undefined;
		return true;
	} else {
		return false;
	}
}

// 双击单元格开始编辑
function editTicket(index, field, value) {
	if (endEditing()) {
		$('#outTicketInfoTable').datagrid('selectRow', index).datagrid('editCell', {
			index : index,
			field : field
		});
		var ed = $(this).datagrid('getEditor', {
			index : index,
			field : field
		});
		if (ed) {
			$(ed.target).focus();
		}
		editIndex = index;
	}
}
