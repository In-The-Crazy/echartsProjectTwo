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
	$('#startDate').datebox({
		editable : false,
		required : false,
		onSelect : function(data) {
			$("#conditionForm").form('validate');
		},
		width : 150
	});
	$('#endDate').datebox({
		editable : false,
		required : false,
		onSelect : function(data) {
			$("#conditionForm").form('validate');
		},
		width : 150
	});
	$('#startHappendateDate').datebox({
		editable : false,
		required : false,
		onSelect : function(data) {
			$("#conditionForm").form('validate');
		},
		width : 150
	});
	$('#endHappendateDate').datebox({
		editable : false,
		required : false,
		onSelect : function(data) {
			$("#conditionForm").form('validate');
		},
		width : 150
	});

	var today = new Date();
	today = today.pattern("yyyy-MM-dd");
	var first = (new Date((new Date()).getTime() - (30 * 24 * 60 * 60 * 1000)))
			.pattern("yyyy-MM-dd")
	$('#startDate').datebox('setValue', first);
	$('#endDate').datebox('setValue', today);
}

/** -------- 限制日期选择范围 ------ */
function dateBoxValidator() {
	$('#startDate').datebox().datebox('calendar').calendar(
			{
				validator : function(date) {
					var end = $('#endDate').datebox('getValue');
					var now = new Date();
					if (!isEmpty(end)) {
						now = new Date(end);
					}
					var d1 = new Date(now.getFullYear(), now.getMonth(), now
							.getDate());
					var temp = new Date(now.getTime() - 30 * 24 * 60 * 60
							* 1000);
					var d2 = new Date(temp.getFullYear(), temp.getMonth(), temp
							.getDate());
					return d2 <= date && date <= d1;
				}
			});
	$('#endDate').datebox().datebox('calendar').calendar(
			{
				validator : function(date) {
					var now = new Date();
					var d1 = new Date(now.getFullYear(), now.getMonth(), now
							.getDate());
					return date <= d1;
				}
			});
}

/** -------- 初始化页面模块 ------ */
function initPage() {
	var dialog_info = {
		id : "metOrderInfo",
		title : "机票订单详细信息"
	};

	// 查看窗口
	initDialog(dialog_info);
	$('#metOrderInfo').dialog('close');

	var dialog_order = {
		id : "orderInfo",
		title : "接送机订单详细信息"
	};

	// 查看窗口
	initDialog(dialog_order);
	$('#orderInfo').dialog('close');
}

/** -------- 验证查询表单 ------ */
function validateForm() {
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
			$.messager.alert('错误提示', '订单开始日期不能大于订单截止日期', 'error');
			return false;
		}
	}
	// 验证表单参数
	var sflag = $("#conditionForm").form('validate');
	if (!sflag) {
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}

	var params = serializeJson("conditionForm");
	return params;
}

/** --------加载表格数据 ------ */
function ajaxTable() {
	var params = validateForm();
	if (!params) {
		return false;
	}
	// 加载表格
	$('#queryOrderTable').datagrid({
		url : 'queryUcarOrderList.action',
		toolbar : "#toolbar",
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		pageNumber : 1,
		pageSize : 20,
		fitColumns : false,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		queryParams : params,
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
			$.messager.alert('错误提示', '数据加载失败!', 'error');
		},
		onLoadSuccess : function(data) {
			if (data.isSuccessOrfail == 'FAIL') {
				$.messager.alert('错误提示', data.message, 'error');
			}
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
			field : 'metordercode',
			title : '机票订单编号',
			align : 'center',
			formatter : metorderCodeFormater,
			width : 120
		}, {
			field : 'ordercode',
			title : '接送机订单编号',
			align : 'center',
			formatter : orderCodeFormater,
			width : 120
		}, {
			field : 'serviceid',
			title : '接送机类型',
			align : 'center',
			formatter : function(value, row, index) {
				var text = baseFormater(value, row, index);
				if (text == "7") {
					text = "接机";
				}
				if (text == "8") {
					text = "送机";
				}
				if (text == "11") {
					text = "包车（4小时）";
				}
				if (text == "12") {
					text = "包车（8小时）";
				}
				if (text == "13") {
					text = "预约用车";
				}
				if (text == "14") {
					text = "立即叫车";
				}
				return text;
			},
			width : 75
		}, {
			field : 'tname',
			title : '接送机城市',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'paymoney',
			title : '订单金额',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		}, {
			field : 'needPay',
			title : '违约金',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'actualRefundMoney',
			title : '退款金额',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		}, {
			field : 'paymoney',
			title : '订单金额',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		}, {
			field : 'passengerName',
			title : '乘客姓名',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'passengerMobile',
			title : '乘客电话',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'startTime',
			title : '出发时间',
			align : 'center',
			formatter : baseFormater,
			width : 120
		}, {
			field : 'status',
			title : '订单状态',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'paystatus',
			title : '支付状态',
			align : 'center',
			formatter : paystatusFormater,
			width : 75
		}, {
			field : 'codeName',
			title : '支付方式',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'paybillno',
			title : '银行订单号',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'cstatus',
			title : '退款状态',
			align : 'center',
			formatter : function(value, row, index){
				var text = "--";
				if (isEmpty(value)) {
					text = "未申请";
				}
				if(value == "1"){
					text = "已申请";
				}
				if(value == "4"){
					text = "退款成功";
				}
				return text;
			},
			width : 100
		}, {
			field : 'createDatetime',
			title : '订单时间',
			align : 'center',
			formatter : dateTimeFormater,
			width : 120
		}, {
			field : 'happendate',
			title : '退款提交时间',
			align : 'center',
			formatter : dateTimeFormater,
			width : 120
		}, {
			field : 'type',
			title : '来源',
			align : 'center',
			formatter : function(value, row, index) {
				var text = baseFormater(value, row, index);
				if (text == "ucar") {
					text = "神州";
				} else {
					text = "未知";
				}
				return text;
			},
			width : 75
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	$("#airCode").textbox(
			{
				validType : 'cityCode["#airCode"]',
				width : 150,
				onChange : function(newValue, oldValue) {
					$(this).textbox("setValue",
							$(this).textbox("getValue").toUpperCase());
				}
			});
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#queryOrderTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function metorderCodeFormater(value, row, index) {
	var _flag = "'metorder'";
	var _id = "'" + row.orderid + "'";
	var _orderDate = "'" + row.creadate.split(' ')[0].replace(/-/g, '') + "'";
	var _secondaryorderid = "'" + row.secondaryorderid + "'";
	var _text = baseFormater(value, row, index);
	var detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',' + _orderDate
			+ ',' + _secondaryorderid + ')>' + _text + '</a>';
	return detail;
};
function orderCodeFormater(value, row, index) {
	var _flag = "'order'";
	var text = baseFormater(value, row, index);
	if (!isEmpty(row.ucarOrdercode)) {
		text = row.ucarOrdercode;
	}
	var detail = '<a href="javascript:void(0);" onclick=getOrderInfo(' + index + ');>' + text
			+ '</a>';
	return detail;
};
function moneyFormater(value, row, index) {
	return parseInt(row.fare) + parseInt(row.airport_Tax)
			+ parseInt(row.fuel_Tax);
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

/** --------查看订单详情 ------ */
function getOrderInfo(index) {
	$('#queryOrderTable').datagrid('unselectAll');
	$('#queryOrderTable').datagrid('selectRow', index);
	var rows = $('#queryOrderTable').datagrid('getSelected');
	// 打开订单详情页面
	$('#orderInfo').dialog('open');
	// 设置滚动条的垂直偏移为0
	$("#orderInfo").scrollTop(0);
	$('#transferInfoTable').datagrid({
		data : [ rows ],
		pagination : false,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
		},
		onLoadSuccess : function(data) {
		},
		columns : [ [ {
			field : 'ordercode',
			title : '接送机订单编号',
			align : 'center',
			formatter : function(value, row, index) {
				var text = baseFormater(value, row, index);
				if (!isEmpty(row.ucarOrdercode)) {
					text = row.ucarOrdercode;
				}
				return text;
			},
			width : 150
		}, {
			field : 'serviceid',
			title : '接送机类型',
			align : 'center',
			formatter : function(value, row, index) {
				var text = baseFormater(value, row, index);
				if (text == "7") {
					text = "接机";
				}
				if (text == "8") {
					text = "送机";
				}
				if (text == "11") {
					text = "包车（4小时）";
				}
				if (text == "12") {
					text = "包车（8小时）";
				}
				if (text == "13") {
					text = "预约用车";
				}
				if (text == "14") {
					text = "立即叫车";
				}
				return text;
			},
			width : 75
		}, {
			field : 'airCode',
			title : '接送机城市',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'startName',
			title : '出发地',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'endName',
			title : '目的地',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'startTime',
			title : '出发时间',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'flightDelayTime',
			title : '免费等待时间',
			align : 'center',
			formatter : function(value, row, index) {
				var text = baseNumFormater(value, row, index);
				return text + "分钟";
			},
			width : 150
		} ] ]
	});
	$('#statusTable').datagrid({
		data : [ rows ],
		pagination : false,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
		},
		onLoadSuccess : function(data) {
		},
		columns : [ [ {
			field : 'status',
			title : '订单状态',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'paystatus',
			title : '支付状态',
			align : 'center',
			formatter : paystatusFormater,
			width : 50
		}, {
			field : 'createDatetime',
			title : '订单时间',
			align : 'center',
			formatter : dateTimeFormater,
			width : 75
		}, {
			field : 'type',
			title : '来源',
			align : 'center',
			formatter : function(value, row, index) {
				var text = baseFormater(value, row, index);
				if (text == "ucar") {
					text = "神州";
				} else {
					text = "未知";
				}
				return text;
			},
			width : 50
		}, {
			field : 'ucarStatus',
			title : '神州状态',
			align : 'center',
			formatter : baseFormater,
			width : 50
		} ] ]
	});
	$('#flightTable').datagrid({
		data : [ rows ],
		pagination : false,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
		},
		onLoadSuccess : function(data) {
		},
		columns : [ [ {
			field : 'metordercode',
			title : '机票订单号',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'flightNo',
			title : '航班号',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'flightDate',
			title : '航班日期',
			align : 'center',
			formatter : dateTimeFormater,
			width : 75
		}, {
			field : 'ftime',
			title : '起飞时间',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'ttime',
			title : '到达时间',
			align : 'center',
			formatter : baseFormater,
			width : 50
		} ] ]
	});
	$('#payTable').datagrid({
		data : [ rows ],
		pagination : false,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
		},
		onLoadSuccess : function(data) {
		},
		columns : [ [ {
			field : 'paymoney',
			title : '支付金额',
			align : 'center',
			formatter : baseNumFormater,
			width : 50
		}, {
			field : 'codeName',
			title : '支付方式',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'paybillno',
			title : '银行订单号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'payserial',
			title : '流水号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'remark',
			title : '备注',
			align : 'center',
			formatter : baseFormater,
			width : 150
		} ] ]
	});
	$('#passengerTable').datagrid({
		data : [ rows ],
		pagination : false,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
		},
		onLoadSuccess : function(data) {
		},
		columns : [ [ {
			field : 'passengerMobile',
			title : '乘客手机号',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'passengerName',
			title : '乘客姓名',
			align : 'center',
			formatter : baseFormater,
			width : 50
		} ] ]
	});
	$('#carInfoTable').datagrid({
		data : [ rows ],
		pagination : false,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
		},
		onLoadSuccess : function(data) {
		},
		columns : [ [ {
			field : 'carGroupid',
			title : '订单状态',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'drivername',
			title : '司机姓名',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'virtualPhone4Passenge',
			title : '司机电话',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'vehicleModel',
			title : '车型名称',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'vehicleno',
			title : '车牌号',
			align : 'center',
			formatter : baseFormater,
			width : 50
		} ] ]
	});
};

function getInfo(id, orderDate, secondaryorderid) {
	// 打开订单详情页面
	$('#metOrderInfo').dialog('open');
	// 设置滚动条的垂直偏移为0
	$("#metOrderInfo").scrollTop(0);
	// 标示是否选中行的，true - 是 , false - 否
	var IsCheckFlag = true;
	var options = {
		url : 'queryOrderInfoByOrderId.action',
		data : "orderId=" + id + "&orderDate=" + orderDate,
		callBackFun : function(data) {
			// 加载订单详情表格
			$('#orderInfoTable').datagrid({
				data : data,
				checkOnSelect : false,// 是否选中/取消复选框
				pagination : false,// 是否分页
				autoRowHeight : false,// 定义是否设置基于该行内容的行高度
				fitColumns : true,// 列自适应表格宽度
				striped : false,// 当true时，单元格显示条纹
				rownumbers : false,// 是否显示行号
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
						$("#orderInfoTable").datagrid("unselectRow", rowIndex);
					}
				},
				onUnselect : function(rowIndex, rowData) {
					if (!IsCheckFlag) {
						IsCheckFlag = true;
						$("#orderInfoTable").datagrid("selectRow", rowIndex);
					}
				},
				columns : [ [ {
					field : 'orderCode',
					title : '订单编号',
					align : 'center',
					formatter : baseFormater,
					width : 180
				}, {
					field : 'creadate',
					title : '订单时间',
					formatter : dateTimeFormater,
					align : 'center',
					width : 180
				}, {
					field : 'ticketmoney',
					title : '票款金额',
					align : 'center',
					formatter : baseNumFormater,
					width : 100
				}, {
					field : 'insmoney',
					title : '保险金额',
					align : 'center',
					formatter : baseNumFormater,
					width : 75
				}, {
					field : 'busmoney',
					title : '巴士金额',
					align : 'center',
					formatter : baseNumFormater,
					width : 75
				}, {
					field : 'coupon',
					title : '优惠券',
					align : 'center',
					formatter : baseNumFormater,
					width : 75
				}, {
					field : 'paymoney',
					title : '订单金额',
					align : 'center',
					formatter : baseNumFormater,
					width : 100
				}, {
					field : 'orderStatus',
					title : '订单状态',
					align : 'center',
					formatter : statusFormater,
					width : 75
				}, {
					field : 'orderPayStatus',
					title : '支付状态',
					align : 'center',
					formatter : paystatusFormater,
					width : 75
				}, {
					field : 'endpaytime',
					title : '支付时限',
					align : 'center',
					formatter : baseFormater,
					width : 150
				} ] ]
			});

			// 加载优惠券巴士表格
			$('#busInfoTable').datagrid({
				data : data,
				checkOnSelect : false,// 是否选中/取消复选框
				pagination : false,// 是否分页
				autoRowHeight : false,// 定义是否设置基于该行内容的行高度
				fitColumns : true,// 列自适应表格宽度
				striped : false,// 当true时，单元格显示条纹
				rownumbers : false,// 是否显示行号
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
						$("#busInfoTable").datagrid("unselectRow", rowIndex);
					}
				},
				onUnselect : function(rowIndex, rowData) {
					if (!IsCheckFlag) {
						IsCheckFlag = true;
						$("#busInfoTable").datagrid("selectRow", rowIndex);
					}
				},
				columns : [ [ {
					field : 'couponcode',
					title : '优惠劵编码',
					align : 'center',
					formatter : baseFormater,
					width : 50
				}, {
					field : 'goBusAddress',
					title : '去程巴士地址',
					align : 'center',
					formatter : baseFormater,
					width : 200
				}, {
					field : 'backBusAddress',
					title : '返程巴士地址',
					align : 'center',
					formatter : baseFormater,
					width : 200
				} ] ]
			});

			// 加载支付信息表格
			$('#payinfoTable').datagrid({
				data : data,
				checkOnSelect : false,// 是否选中/取消复选框
				pagination : false,// 是否分页
				autoRowHeight : true,// 定义是否设置基于该行内容的行高度
				fitColumns : true,// 列自适应表格宽度
				striped : false,// 当true时，单元格显示条纹
				rownumbers : false,// 是否显示行号
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
						$("#payinfoTable").datagrid("unselectRow", rowIndex);
					}
				},
				onUnselect : function(rowIndex, rowData) {
					if (!IsCheckFlag) {
						IsCheckFlag = true;
						$("#payinfoTable").datagrid("selectRow", rowIndex);
					}
				},
				columns : [ [ {
					field : 'paytypename',
					title : '支付通道',
					align : 'center',
					formatter : baseFormater,
					width : 60
				}, {
					field : 'paymethodname',
					title : '支付方式',
					align : 'center',
					formatter : baseFormater,
					width : 60
				}, {
					field : 'bankName',
					title : '支付银行',
					align : 'center',
					formatter : baseFormater,
					width : 60
				}, {
					field : 'payBankCardNo',
					title : '支付卡号',
					align : 'center',
					formatter : baseFormater,
					width : 60
				}, {
					field : 'paymoney',
					title : '支付金额',
					align : 'center',
					formatter : baseFormater,
					width : 60
				}, {
					field : 'paybillno',
					title : '银行订单号',
					align : 'center',
					formatter : baseFormater,
					width : 120
				}, {
					field : 'payserial',
					title : '交易流水号',
					align : 'center',
					formatter : baseFormater,
					width : 120
				}, {
					field : 'payCommitTime',
					title : '交易提交/确认时间',
					align : 'center',
					formatter : function(value, rows, index) {
						var text = value;
						if (isEmpty(text)) {
							return "--";
						} else {
							if (!isEmpty(rows.payCheckTime)) {
								text = text + "<br/>" + rows.payCheckTime;
							}
							return text;
						}
					},
					width : 150
				}, {
					field : 'orderPayStatus',
					title : '支付状态',
					align : 'center',
					formatter : paystatusFormater,
					width : 60
				} ] ]
			});

			// 加载联系人信息表格
			$('#contactinfoTable').datagrid(
					{
						data : data,
						checkOnSelect : false,// 是否选中/取消复选框
						pagination : false,// 是否分页
						autoRowHeight : false,// 定义是否设置基于该行内容的行高度
						fitColumns : true,// 列自适应表格宽度
						striped : false,// 当true时，单元格显示条纹
						rownumbers : false,// 是否显示行号
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
								$("#contactinfoTable").datagrid("unselectRow",
										rowIndex);
							}
						},
						onUnselect : function(rowIndex, rowData) {
							if (!IsCheckFlag) {
								IsCheckFlag = true;
								$("#contactinfoTable").datagrid("selectRow",
										rowIndex);
							}
						},
						columns : [ [ {
							field : 'userType',
							title : '是否会员',
							align : 'center',
							formatter : isMenberFormater,
							width : 50
						}, {
							field : 'userName',
							title : '联系姓名',
							align : 'center',
							formatter : baseFormater,
							width : 75
						}, {
							field : 'mobile',
							title : '联系手机',
							align : 'center',
							formatter : baseFormater,
							width : 100
						}, {
							field : 'realName',
							title : '会员姓名',
							align : 'center',
							formatter : baseFormater,
							width : 75
						}, {
							field : 'phone',
							title : '会员手机',
							align : 'center',
							formatter : baseFormater,
							width : 100
						}, {
							field : 'bigCustomerCode',
							title : '大客户编码',
							align : 'center',
							formatter : baseFormater,
							width : 100
						} ] ]
					});
		}
	}
	sendAjaxRequest(options);

	// 加载第一航段信息表格
	$('#firstMetTable').datagrid(
			{
				url : 'queryTicketSementInfoBySidAndorderId.action',
				checkOnSelect : false,// 是否选中/取消复选框
				pagination : false,// 是否分页
				autoRowHeight : false,// 定义是否设置基于该行内容的行高度
				fitColumns : true,// 列自适应表格宽度
				striped : false,// 当true时，单元格显示条纹
				rownumbers : false,// 是否显示行号
				singleSelect : true,// 是否只能选中一条
				queryParams : {
					'segid' : '1',
					'orderId' : id,
					'orderDate' : orderDate
				},
				loadMsg : '数据加载中,请稍后...',
				onLoadSuccess : function(data) {
					var firstMetTable = $("#firstMetTable")
							.datagrid("getPanel");// 先获取panel对象
					firstMetTable.panel('setTitle', "第一航段:"
							+ data.rows[0].flightSegment);// 再通过panel对象去修改title
				},
				onClickCell : function(rowIndex, rowData) {
					IsCheckFlag = false;
				},
				onSelect : function(rowIndex, rowData) {
					if (!IsCheckFlag) {
						IsCheckFlag = true;
						$("#firstMetTable").datagrid("unselectRow", rowIndex);
					}
				},
				onUnselect : function(rowIndex, rowData) {
					if (!IsCheckFlag) {
						IsCheckFlag = true;
						$("#firstMetTable").datagrid("selectRow", rowIndex);
					}
				},
				columns : [ [ {
					field : 'fnumber',
					title : '航班号',
					align : 'center',
					formatter : baseFormater,
					width : 50
				}, {
					field : 'fdate',
					title : '航班日期',
					align : 'center',
					formatter : dateTimeFormater,
					width : 100
				}, {
					field : 'ftime',
					title : '起飞时间',
					align : 'center',
					formatter : baseFormater,
					width : 50
				}, {
					field : 'ttime',
					title : '到达时间',
					align : 'center',
					formatter : baseFormater,
					width : 50
				}, {
					field : 'seat',
					title : '舱位',
					align : 'center',
					formatter : baseFormater,
					width : 50
				}, {
					field : 'productName',
					title : '产品名称',
					align : 'center',
					formatter : baseFormater,
					width : 100
				}, {
					field : 'fare',
					title : '票面价',
					align : 'center',
					formatter : baseNumFormater,
					width : 50
				}, {
					field : 'airportTax',
					title : '机建',
					align : 'center',
					formatter : baseNumFormater,
					width : 50
				}, {
					field : 'fuelTax',
					title : '燃油',
					align : 'center',
					formatter : baseNumFormater,
					width : 50
				}, {
					field : 'money',
					title : '票款总价',
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
					title : '实际票款',
					align : 'center',
					formatter : baseNumFormater,
					width : 50
				} ] ]
			});

	// 加载第一航段乘客表格
	$('#firstMetTicketTable').datagrid({
		url : 'queryTicketPassengerInfoBySidAndorderId.action',
		checkOnSelect : false,// 是否选中/取消复选框
		pagination : false,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		fitColumns : true,// 列自适应表格宽度
		striped : false,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		queryParams : {
			'segid' : '1',
			'orderId' : id,
			'orderDate' : orderDate
		},
		loadMsg : '数据加载中,请稍后...',
		onLoadSuccess : function(data) {
		},
		onClickCell : function(rowIndex, rowData) {
			IsCheckFlag = false;
		},
		onSelect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#firstMetTicketTable").datagrid("unselectRow", rowIndex);
			}
		},
		onUnselect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#firstMetTicketTable").datagrid("selectRow", rowIndex);
			}
		},
		columns : [ [ {
			field : 'name',
			title : '姓名',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'sex',
			title : '性别',
			align : 'center',
			formatter : genderFormater,
			width : 50
		}, {
			field : 'birthday',
			title : '生日',
			align : 'center',
			formatter : baseFormater,
			width : 110
		}, {
			field : 'country',
			title : '国籍',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'idtype',
			title : '证件类型',
			align : 'center',
			formatter : idtypeFormatter,
			width : 100
		}, {
			field : 'idnumber',
			title : '证件号码',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'passportCountry',
			title : '护照签发国',
			align : 'center',
			formatter : baseFormater,
			width : 110
		}, {
			field : 'passportValid',
			title : '护照有效期',
			align : 'center',
			formatter : baseFormater,
			width : 110
		}, {
			field : 'pnr',
			title : 'PNR',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'eticketno',
			title : '机票号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'status',
			title : '客票状态',
			align : 'center',
			formatter : statusFormater,
			width : 100
		}, {
			field : 'cstatus',
			title : '退改状态',
			align : 'center',
			formatter : cstatusFormater,
			width : 100
		} ] ]
	});

	// 加载第二航段表格
	$('#secondMetTable').datagrid(
			{
				url : 'queryTicketSementInfoBySidAndorderId.action',
				checkOnSelect : false,// 是否选中/取消复选框
				pagination : false,// 是否分页
				autoRowHeight : false,// 定义是否设置基于该行内容的行高度
				fitColumns : true,// 列自适应表格宽度
				striped : false,// 当true时，单元格显示条纹
				rownumbers : false,// 是否显示行号
				singleSelect : true,// 是否只能选中一条
				queryParams : {
					'segid' : '2',
					'orderId' : id,
					'orderDate' : orderDate
				},
				loadMsg : '数据加载中,请稍后...',
				onLoadSuccess : function(data) {
					var secondMetTable = $("#secondMetTable").datagrid(
							"getPanel");// 先获取panel对象
					secondMetTable.panel('setTitle', "第二航段:"
							+ data.rows[0].flightSegment);// 再通过panel对象去修改title
				},
				onClickCell : function(rowIndex, rowData) {
					IsCheckFlag = false;
				},
				onSelect : function(rowIndex, rowData) {
					if (!IsCheckFlag) {
						IsCheckFlag = true;
						$("#secondMetTable").datagrid("unselectRow", rowIndex);
					}
				},
				onUnselect : function(rowIndex, rowData) {
					if (!IsCheckFlag) {
						IsCheckFlag = true;
						$("#secondMetTable").datagrid("selectRow", rowIndex);
					}
				},
				columns : [ [ {
					field : 'fnumber',
					title : '航班号',
					align : 'center',
					formatter : baseFormater,
					width : 50
				}, {
					field : 'fdate',
					title : '航班日期',
					align : 'center',
					formatter : dateTimeFormater,
					width : 100
				}, {
					field : 'ftime',
					title : '起飞时间',
					align : 'center',
					formatter : baseFormater,
					width : 50
				}, {
					field : 'ttime',
					title : '到达时间',
					align : 'center',
					formatter : baseFormater,
					width : 50
				}, {
					field : 'seat',
					title : '舱位',
					align : 'center',
					formatter : baseFormater,
					width : 50
				}, {
					field : 'productName',
					title : '产品名称',
					align : 'center',
					formatter : baseFormater,
					width : 100
				}, {
					field : 'fare',
					title : '票面价',
					align : 'center',
					formatter : baseNumFormater,
					width : 50
				}, {
					field : 'airportTax',
					title : '机建',
					align : 'center',
					formatter : baseNumFormater,
					width : 50
				}, {
					field : 'fuelTax',
					title : '燃油',
					align : 'center',
					formatter : baseNumFormater,
					width : 50
				}, {
					field : 'money',
					title : '票款总价',
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
					title : '实际票款',
					align : 'center',
					formatter : baseNumFormater,
					width : 50
				} ] ]
			});
	// 默认不显示第二航段信息
	var secondMetTable = $("#secondMetTable").datagrid("getPanel");
	secondMetTable.panel('close');

	// 加载第二航段乘客表格
	$('#secondMetTicketTable').datagrid({
		url : 'queryTicketPassengerInfoBySidAndorderId.action',
		checkOnSelect : false,// 是否选中/取消复选框
		pagination : false,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		fitColumns : true,// 列自适应表格宽度
		striped : false,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		queryParams : {
			'segid' : '2',
			'orderId' : id,
			'orderDate' : orderDate
		},
		loadMsg : '数据加载中,请稍后...',
		onLoadSuccess : function(data) {
		},
		onClickCell : function(rowIndex, rowData) {
			IsCheckFlag = false;
		},
		onSelect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#secondMetTicketTable").datagrid("unselectRow", rowIndex);
			}
		},
		onUnselect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#secondMetTicketTable").datagrid("selectRow", rowIndex);
			}
		},
		columns : [ [ {
			field : 'name',
			title : '姓名',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'sex',
			title : '性别',
			align : 'center',
			formatter : genderFormater,
			width : 50
		}, {
			field : 'birthday',
			title : '生日',
			align : 'center',
			formatter : baseFormater,
			width : 110
		}, {
			field : 'country',
			title : '国籍',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'idtype',
			title : '证件类型',
			align : 'center',
			formatter : idtypeFormatter,
			width : 100
		}, {
			field : 'idnumber',
			title : '证件号码',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'passportCountry',
			title : '护照签发国',
			align : 'center',
			formatter : baseFormater,
			width : 110
		}, {
			field : 'passportValid',
			title : '护照有效期',
			align : 'center',
			formatter : baseFormater,
			width : 110
		}, {
			field : 'pnr',
			title : 'PNR',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'eticketno',
			title : '机票号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'status',
			title : '客票状态',
			align : 'center',
			formatter : statusFormater,
			width : 100
		}, {
			field : 'cstatus',
			title : '退改状态',
			align : 'center',
			formatter : cstatusFormater,
			width : 100
		} ] ]
	});
	// 默认不显示第二航段信息
	var secondMetTicketTable = $("#secondMetTicketTable").datagrid("getPanel");
	secondMetTicketTable.panel('close');

	// 判断是否有第二航段，如果有则显示
	var segmentFlag = false;
	var segmentOptions = {
		url : 'checkFlightSegment.action',
		data : "orderId=" + id + "&orderDate=" + orderDate,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				segmentFlag = data.obj.segmentFlag;
				if (segmentFlag) {
					var secondMetTable = $("#secondMetTable").datagrid(
							"getPanel");
					var secondMetTicketTable = $("#secondMetTicketTable")
							.datagrid("getPanel");
					secondMetTable.panel('open');
					secondMetTicketTable.panel('open');
				}
			}
		}
	}
	sendAjaxRequest(segmentOptions);

	// 加载改期信息表
	$('#changeTable').datagrid({
		url : 'queryReOrderList.action',
		checkOnSelect : false,// 是否选中/取消复选框
		pagination : false,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		fitColumns : true,// 列自适应表格宽度
		striped : false,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		queryParams : {
			'orderId' : secondaryorderid
		},
		loadMsg : '数据加载中,请稍后...',
		onLoadSuccess : function(data) {
			if (data.rows == null || data.rows.length == 0) {
				var changeTable = $("#changeTable").datagrid("getPanel");
				changeTable.panel('close');
			}
		},
		onClickCell : function(rowIndex, rowData) {
			IsCheckFlag = false;
		},
		onSelect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#secondMetTicketTable").datagrid("unselectRow", rowIndex);
			}
		},
		onUnselect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#secondMetTicketTable").datagrid("selectRow", rowIndex);
			}
		},
		columns : [ [ {
			field : 'orderCode',
			title : '订单编号',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'orderStatus',
			title : '订单状态',
			align : 'center',
			formatter : statusFormater,
			width : 50
		}, {
			field : 'paymoney',
			title : '支付金额',
			align : 'center',
			formatter : baseNumFormater,
			width : 50
		}, {
			field : 'creadate',
			title : '订单时间',
			align : 'center',
			formatter : dateTimeFormater,
			width : 100
		}, {
			field : 'pnr',
			title : 'PNR',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'seat',
			title : '舱位',
			align : 'center',
			formatter : baseFormater,
			width : 50
		} ] ]
	});

	// 加载订单操作日志表格
	$('#logInsertTable').datagrid({
		url : 'queryOrderProcessingList.action',
		checkOnSelect : false,// 是否选中/取消复选框
		pagination : false,// 是否分页
		autoRowHeight : true,// 定义是否设置基于该行内容的行高度
		fitColumns : true,// 列自适应表格宽度
		striped : false,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		nowrap : false,// 是否在一行内显示
		queryParams : {
			'orderid' : id
		},
		onLoadSuccess : function(data) {
		},
		onClickCell : function(rowIndex, rowData) {
			IsCheckFlag = false;
		},
		onSelect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#logInsertTable").datagrid("unselectRow", rowIndex);
			}
		},
		onUnselect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#logInsertTable").datagrid("selectRow", rowIndex);
			}
		},
		columns : [ [ {
			field : 'rownumbers',
			title : '',
			align : 'center',
			styler : rownumSytler,
			formatter : rownumFormater,
			width : 50
		}, {
			field : 'creatime',
			title : '处理时间',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'type',
			title : '处理类型',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'content',
			title : '记录内容',
			align : 'center',
			width : 300,
			formatter : function(value, row, index) {
				var text = "--";
				if (!isEmpty(value)) {
					if (value.length > 14) {
						text = value.substr(0, 14);
						for (var i = 14; i < value.length; i += 14) {
							text += "</br>" + value.substr(i, 14);
						}
					} else {
						text = value;
					}
				}
				return text;
			},
		} ] ]
	});
}

/** -------- 重置查询条件 ------ */
function queryOrderReset() {
	$('#conditionForm').form('reset');
	var today = new Date();
	today = today.pattern("yyyy-MM-dd");
	var first = (new Date((new Date()).getTime() - (30 * 24 * 60 * 60 * 1000)))
			.pattern("yyyy-MM-dd")
	$('#startDate').datebox('setValue', first);
	$('#endDate').datebox('setValue', today);
}
