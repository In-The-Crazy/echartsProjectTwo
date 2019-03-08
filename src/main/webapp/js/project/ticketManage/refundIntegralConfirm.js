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
	var today = new Date();
	var first = new Date();
	first.setDate(1);
	today = today.pattern("yyyy-MM-dd");
	first = first.pattern("yyyy-MM-dd");
	
	$('#startdate').datebox({
		label : '申请开始日期：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		value : first,
		editable : false,
		required : false,
		onSelect : function(beginDate) {
			$('#enddate').datebox().datebox('calendar').calendar({
				validator : function(date) {
					return beginDate <= date;
				}
			});
		}
	});
	$('#enddate').datebox({
		label : '申请截止日期：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		value : today,
		editable : false,
		required : false
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	$("#passenger").textbox({
		label : '旅客姓名：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#pnr").textbox({
		label : 'PNR：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#fnumber").textbox({
		label : '航班号：',
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
	$("#paybillno").textbox({
		label : '银行订单号：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#eticketno").textbox({
		label : '机票号：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#refundNo").textbox({
		label : '退票单号：',
		labelWidth : 100,
		labelAlign : 'right',
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
	
	var dialog_info = {
		id : "refundInfo",
		title : "退款确认"
	};
	var dialog_logger = {
		id : "loggerInfo",
		title : "审核记录"
	};

	// 查看窗口
	initDialog(dialog_info);
	$('#refundInfo').dialog('close');
	initDialog(dialog_logger);
	$('#loggerInfo').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var sdate = $('#startdate').datebox('getValue');
	var edate = $('#enddate').datebox('getValue');
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		sdate = sdate.replace(/-/g, '');
		edate = edate.replace(/-/g, '');
		if (parseInt(sdate) > parseInt(edate)) {
			$.messager.alert('错误提示', '申请开始日期不能大于申请截止日期', 'error');
			return false;
		}
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#refundCheckTable').datagrid({
		url : root + '/refund/queryAchangeList',
		toolbar : '#toolbar',
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		pageNumber : 1,
		pageSize : 20,
		fitColumns : false,// 列自适应表格宽度
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
			width : 25
		}, {
			field : 'id',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'orderdate',
			title : '订单日期',
			align : 'center',
			formatter : dateTimeFormater,
			width : 150
		}, {
			field : 'ordercode',
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
			field : 'eticketno',
			title : '票号',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'name',
			title : '旅客姓名',
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
			field : 'unexpInsr',
			title : '航意险',
			align : 'center',
			formatter : baseNumFormater,
			width : 50
		}, {
			field : 'delayInsr',
			title : '航延险',
			align : 'center',
			formatter : baseNumFormater,
			width : 50
		}, {
			field : 'paymoney',
			title : '支付金额',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'integralFare',
			title : '支付积分',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		}, {
			field : 'paybillno',
			title : '银行订单号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'refundNo',
			title : '退票单号',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'nature',
			title : '退票性质',
			align : 'center',
			formatter : natureFormater,
			width : 75
		}, {
			field : 'status',
			title : '退票状态',
			align : 'center',
			formatter : cstatusFormater,
			width : 100
		}, {
			field : 'failReason',
			title : '退款失败原因',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'isinter',
			title : '国内/国际',
			align : 'center',
			formatter : isInterFormater,
			width : 75
		}, {
			field : 'happendate',
			title : '退票申请时间',
			align : 'center',
			formatter : dateTimeFormater,
			width : 150
		}, {
			field : 'cresdatetime',
			title : '退票审核时间',
			align : 'center',
			formatter : dateTimeFormater,
			width : 150
		}, {
			field : 'creqdatetime',
			title : '退款时间',
			align : 'center',
			formatter : dateTimeFormater,
			width : 150
		}, {
			field : 'returnIntegralStatus',
			title : '退积分状态',
			align : 'center',
			formatter : function(value, row, index) {
				if (value == '0' && row.isIntegral == '1') {
					return '未退';
				}else if (value == '1' && row.isIntegral == '1') {
					return '已退';
				}else {
					return '--';
				}
			},
			width : 150
		}, {
			field : 'opt',
			title : '操作',
			align : 'center',
			formatter : optFormater,
			width : 150
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	$('#nature').combobox({
		label : '自愿/非自愿：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data: [{
			"id" : "",
			"text" : "全部",
			"selected": true
		},{
			"id" : "0",
			"text" : "非自愿"
		},{
			"id" : "1",
			"text" : "自愿"
		}],
		valueField:'id',
		textField:'text'
	});
	
	$('#isInter').combobox({
		label : '国内/国际：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data: [{
			"id" : "",
			"text" : "全部",
			"selected": true
		},{
			"id" : "0",
			"text" : "国内"
		},{
			"id" : "1",
			"text" : "国际"
		}],
		valueField:'id',
		textField:'text'
	});
	
	$('#status').combobox({
		label : '退票状态：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data: [{
			"id" : "",
			"text" : "全部"
		},{
			"id" : "4",
			"text" : "二审通过",
			"selected": true
		},{
			"id" : "6",
			"text" : "退票完成"
		},{
			"id" : "7",
			"text" : "线下退票完成"
		},{
			"id" : "8",
			"text" : "退款失败"
		}],
		valueField:'id',
		textField:'text'
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
	
	$('#returnIntegralStatus').combobox({
		label : '退积分状态：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		data : [{
			"id" : "",
			"text" : "全部",
			'selected':true
		},{
			'id':'0',
			'text':'未退'
		},{
			'id':'1',
			'text':'已退'
		}],
		valueField : 'id',
		textField:'text',
		editable : false
	});
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#refundCheckTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function optFormater(value, row, index) {
	var _id = "'" + row.id + "'";
	var _ticketid = "'" + row.ticketid + "'";
	var detail = "";
	if (row.returnIntegralStatus == '0' && row.status == "4") {
		detail = '<a href="javascript:void(0);" onclick=comfirmReturnIntegral(' + _id + ')>退积分确认</a>';
	}else{
		detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"info")>查看详情</a>';
	}
	logger = ' | <a href="javascript:void(0);" onclick=getInfo(' + _ticketid + ',"logger")>审核记录</a>';
	return detail + logger;
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
			+ "filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffffff,endColorstr=#F2F2F2,GradientType=0);";
};
function remarkSytler(value, row, index) {
	if (isEmpty(row.refund_remark)) {
		return "color: red;"
	}
	return "";
};

/** --------查看详情 ------ */
function getInfo(id, flag) {
	var url = root + '/refund/queryAchangeInfo';
	var data = {'idPara' : id};
	if(flag == 'logger'){
		url = root + "/refund/queryOrderProcessingList";
		data = {'ticketid' : id};
	}
	var options = {
		url : url,
		data : data,
		callBackFun : function(data) {
			if (flag == 'refund' || flag == "info") {
				$("#refundId").val(id);
				// 打开订单详情页面
				$('#refundInfo').dialog('open');
				var IsCheckFlag = true; // 标示是否选中行的，true - 是 , false - 否
				// 加载订单详情表格
				$('#orderInfoTable').datagrid({
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
					onSelect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#orderInfoTable").datagrid(
									"unselectRow", rowIndex);
						}
					},
					onUnselect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#orderInfoTable").datagrid("selectRow",
									rowIndex);
						}
					},
					columns : [ [ {
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
						width : 100
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
						field : 'fare',
						title : '票面价',
						align : 'center',
						formatter : baseNumFormater,
						width : 75
					}, {
						field : 'airporttax',
						title : '机建',
						align : 'center',
						formatter : baseNumFormater,
						width : 50
					}, {
						field : 'fueltax',
						title : '燃油',
						align : 'center',
						formatter : baseNumFormater,
						width : 50
					}, {
						field : 'unexoInsr',
						title : '航意险',
						align : 'center',
						formatter : baseNumFormater,
						width : 50
					}, {
						field : 'delayInsr',
						title : '航延险',
						align : 'center',
						formatter : baseNumFormater,
						width : 50
					}, {
						field : 'fmoney',
						title : '优惠金额',
						align : 'center',
						formatter : baseNumFormater,
						width : 50
					}, {
						field : 'paymoney',
						title : '支付金额',
						align : 'center',
						formatter : baseNumFormater,
						width : 75
					}, {
						field : 'integralFare',
						title : '支付积分',
						align : 'center',
						formatter : baseNumFormater,
						width : 75
					} ] ]
				});
	
				$('#chgroledescTable').datagrid({
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
					onSelect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#chgroledescTable").datagrid(
									"unselectRow", rowIndex);
						}
					},
					onUnselect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#chgroledescTable").datagrid(
									"selectRow", rowIndex);
						}
					},
					columns : [ [ {
						field : 'chgroledesc',
						title : '退改签描述',
						align : 'center',
						formatter : baseFormater,
						width : 100
					} ] ]
				});
	
				$('#refundTicketTable').datagrid({
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
					onSelect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#refundTicketTable").datagrid(
									"unselectRow", rowIndex);
						}
					},
					onUnselect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#refundTicketTable").datagrid(
									"selectRow", rowIndex);
						}
					},
					columns : [ [ {
						field : 'orderdate',
						title : '订单日期',
						align : 'center',
						formatter : baseFormater,
						width : 100
					}, {
						field : 'ordercode',
						title : '订单号',
						align : 'center',
						formatter : baseFormater,
						width : 150
					}, {
						field : 'pnr',
						title : 'PNR',
						align : 'center',
						formatter : baseFormater,
						width : 100
					}, {
						field : 'eticketno',
						title : '票号',
						align : 'center',
						formatter : baseFormater,
						width : 150
					}, {
						field : 'name',
						title : '旅客姓名',
						align : 'center',
						formatter : baseFormater,
						width : 100
					}, {
						field : 'status',
						title : '退票状态',
						align : 'center',
						formatter : cstatusFormater,
						width : 100
					} ] ]
				});
	
				$('#refundPayTable').datagrid({
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
					onSelect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#refundPayTable").datagrid(
									"unselectRow", rowIndex);
						}
					},
					onUnselect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#refundPayTable").datagrid("selectRow",
									rowIndex);
						}
					},
					columns : [ [ {
						field : 'paytypename',
						title : '支付通道',
						align : 'center',
						formatter : payTypeFormater,
						width : 100
					}, {
						field : 'paymethodname',
						title : '支付方式',
						align : 'center',
						formatter : baseFormater,
						width : 100
					}, {
						field : 'bankname',
						title : '支付银行',
						align : 'center',
						formatter : baseFormater,
						width : 100
					}, {
						field : 'accno',
						title : '支付卡号',
						align : 'center',
						formatter : baseFormater,
						width : 100
					}, {
						field : 'paybillno',
						title : '支付订单号',
						align : 'center',
						formatter : baseFormater,
						width : 150
					}, {
						field : 'refundCharge',
						title : '退票手续费',
						align : 'center',
						formatter : baseNumFormater,
						width : 100
					}, {
						field : 'actualRefundMoney',
						title : '实际退款',
						align : 'center',
						formatter : baseNumFormater,
						width : 100
					}, {
						field : 'refundChargeIntegral',
						title : '退票手续费(积分)',
						align : 'center',
						formatter : baseNumFormater,
						width : 100
					}, {
						field : 'actualRefundIntegral',
						title : '实际退款(积分)',
						align : 'center',
						formatter : baseNumFormater,
						width : 100
					} ] ]
				});
	
				$('#refundInfoTable').datagrid({
					data : data.rows,
					checkOnSelect : false,// 是否选中/取消复选框
					pagination : false,// 是否分页
					autoRowHeight : true,// 定义是否设置基于该行内容的行高度
					nowrap : false,
					fitColumns : true,// 列自适应表格宽度
					striped : false,// 当true时，单元格显示条纹
					rownumbers : false,// 是否显示行号
					singleSelect : true,// 是否只能选中一条
					onLoadSuccess : function(data) {
					},
					onClickCell : function(rowIndex, rowData) {
						IsCheckFlag = false;
					},
					onDblClickCell : editRemark,
					onSelect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#refundInfoTable").datagrid(
									"unselectRow", rowIndex);
						}
					},
					onUnselect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#refundInfoTable").datagrid("selectRow",
									rowIndex);
						}
					},
					columns : [ [ {
						field : 'happendate',
						title : '退票申请时间',
						align : 'center',
						formatter : dateFormater,
						width : 150
					}, {
						field : 'username',
						title : '联系人',
						align : 'center',
						formatter : baseFormater,
						width : 75
					}, {
						field : 'mobile',
						title : '联系电话',
						align : 'center',
						formatter : baseFormater,
						width : 100
					}, {
						field : 'nature',
						title : '退票性质',
						align : 'center',
						formatter : natureFormater,
						width : 75
					}, {
						field : 'reason',
						title : '退票原因',
						align : 'center',
						formatter : baseFormater,
						width : 150
					}, {
						field : 'refundRemark',
						title : '退款备注',
						align : 'center',
						styler : remarkSytler,
						formatter : remarkFormater,
						editor : 'text',
						width : 100
					} ] ]
				});
				
				$('#wxrefundInfoTable').datagrid({
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
					onSelect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#wxrefundInfoTable").datagrid(
									"unselectRow", rowIndex);
						}
					},
					onUnselect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#wxrefundInfoTable").datagrid(
									"selectRow", rowIndex);
						}
					},
					columns : [ [ {
						field : 'wxrefundNo',
						title : '微信退款单号',
						align : 'center',
						formatter : baseFormater,
						width : 100
					},{
						field : 'failReason',
						title : '微信退款失败原因',
						align : 'center',
						formatter : baseFormater,
						width : 100
					} ] ]
				});
			}
			if(flag == 'logger'){
				// 打开订单详情页面
				$('#loggerInfo').dialog('open');
				var IsCheckFlag = true; // 标示是否选中行的，true - 是 , false - 否
				// 加载订单详情表格
				$('#loggerInfoTable').datagrid({
					data : data.rows,
					checkOnSelect : false,// 是否选中/取消复选框
					pagination : false,// 是否分页
					autoRowHeight : true,// 定义是否设置基于该行内容的行高度
					fitColumns : true,// 列自适应表格宽度
					striped : false,// 当true时，单元格显示条纹
					rownumbers : false,// 是否显示行号
					singleSelect : true,// 是否只能选中一条
					onLoadSuccess : function(data) {
					},
					onClickCell : function(rowIndex, rowData) {
						IsCheckFlag = false;
					},
					onSelect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#orderInfoTable").datagrid(
									"unselectRow", rowIndex);
						}
					},
					onUnselect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#orderInfoTable").datagrid("selectRow",
									rowIndex);
						}
					},
					columns : [ [ {
						field : 'creatime',
						title : '处理时间',
						align : 'center',
						formatter : dateTimeFormater,
						width : 150
					}, {
						field : 'prcsType',
						title : '处理类型',
						align : 'center',
						formatter : changOrderProcessRecordTypeForText,
						width : 100
					}, {
						field : 'prcsContent',
						title : '记录内容',
						align : 'center',
						formatter : function(value, row, index){
							var text="--";
							if(value!=null){
								if(value.length>14){
									text=value.substr(0,14);
									for(var i=14;i<value.length;i+=14){
										text+="</br>"+value.substr(i,14);
									}
								}else{
									text=value;
								}
							}
							return text;
						},
						width : 300
					} ] ]
				});
			}
		}
	}
	sendAjaxRequest(options);
}

/** -------- 导出 ------ */
function exportRefundconfirm() {
	var data = $('#refundCheckTable').datagrid('getData');
	var paper = $('#refundCheckTable').datagrid('getPager').pagination("options");
	var params = serializeJson("conditionForm");
	if(!params){
		return false;
	}
	params["flag"] = "退款确认";
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
				openWindowWithJson(root +'/refund/exportRefundConfirmData',params);
			}
		});
	}else{
		params["start"] = 1;
		params["end"] = paper.total;
		//return false;
		openWindowWithJson(root +'/refund/exportRefundConfirmData',params);
	}
}

/** -------- 重新审核 ------ */
function reAudit() {
	var params=new Object();
	var rows = $('#refundInfoTable').datagrid('getData').rows;
	var id = $("#refundId").val();
	params.idPara = id;
	var data = {
		'idPara' : id
	};
	var remark = $('#refundInfoTable').datagrid('getData').rows[0].refundRemark;
	if (remark == "双击录入" || isEmpty(remark)) {
		remark = "";
	}
	params.refundRemark = remark;
	/*$.each(rows, function(i, field){
		if (field.refundRemark == "双击录入" || isEmpty(field.refundRemark)) {
			$.messager.alert('错误提示', '退款备注不能为空!', 'error');
			return false;
		}else{
			params.refundRemark=field.refundRemark;
		}
	});*/
	$.messager.confirm('重新审核提示', '是否确认重新审核?', function(r) {
		if (r) {
			var options = {
					url : root + '/refund/redoRefundPass',// 请求的action路径
					data : params,
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							$('#refundInfo').dialog('close');
							reloadTable("refundCheckTable");
						}
						showMessage(data);
					}
			};
			sendAjaxRequest(options);
		}
	});
}

function underLine() {
	var params=new Object();
	var rows = $('#refundInfoTable').datagrid('getData').rows;
	var id = $("#refundId").val();
	params.idPara = id;
	var data = {
		'idPara' : id
	};
	var remark = $('#refundInfoTable').datagrid('getData').rows[0].refundRemark;
	if (remark == "双击录入" || isEmpty(remark)) {
		remark = "";
	}
	params.refundRemark = remark;
	/*$.each(rows, function(i, field){
		if (field.refundRemark == "双击录入" || isEmpty(field.refundRemark)) {
			$.messager.alert('错误提示', '退款备注不能为空!', 'error');
			return false;
		}else{
			params.refundRemark=field.refundRemark;
		}
	});*/
	$.messager.confirm('线下处理提示', '是否确认线下处理?', function(r) {
		if (r) {
			var options = {
				url : root + '/refund/underLineRefund',// 请求的action路径
				data : data,
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						$('#refundInfo').dialog('close');
						reloadTable("refundCheckTable");
					}
					showMessage(data);
				}
			};
			sendAjaxRequest(options);
		}
	});
}

/** -------- 确认退积分 ------ */
function comfirmReturnIntegral(id) {
	$.messager.confirm('退积分提示', '是否确认退积分?', function(r) {
		if (r) {
			var options = {
				url : root + '/refund/comfirmReturnIntegral',
				data : {
					'id' : id
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("refundCheckTable");
					}
					showMessage(data);
				}
			};
			sendAjaxRequest(options);
		}
	});
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
	if ($('#refundInfoTable').datagrid('validateRow', editIndex)) {
		$('#refundInfoTable').datagrid('endEdit', editIndex);
		editIndex = undefined;
		return true;
	} else {
		return false;
	}
}

function editRemark(index, field, value) {// 双击单元格开始编辑
	if (endEditing()) {
		$('#refundInfoTable').datagrid('selectRow', index).datagrid('editCell', {
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

/** -------- 重置查询条件 ------ */
function refundReset() {
	$("#conditionForm").form("reset");
}
