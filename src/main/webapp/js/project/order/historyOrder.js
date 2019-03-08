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
	$('#startDate1').datebox({
		editable : false,
		required : false,
		onSelect : function(data){
			validateDate()
		}
	});
	$('#endDate1').datebox({
		editable : false,
		required : false,
		onSelect : function(data){
			validateDate()
		}
	});
	$('#startDate2').datebox({
		editable : false,
		required : false,
		onSelect : function(data){
			validateDate()
		}
	});
	$('#endDate2').datebox({
		editable : false,
		required : false,
		onSelect : function(data){
			validateDate()
		}
	});
	$('#startDate3').datebox({
		editable : false,
		required : false,
		onSelect : function(data){
			validateDate()
		}
	});
	$('#endDate3').datebox({
		editable : false,
		required : false,
		onSelect : function(data){
			validateDate()
		}
	});
	$('#flightQsrq').datebox({
		editable : false,
		required : false,
		onSelect : function(data){
			validateDate()
		}
	});
	$('#flightZzrq').datebox({
		editable : false,
		required : false,
		onSelect : function(data){
			validateDate()
		}
	});
	//dateBoxValidator();
	var startDate1 = $('#startDate1').datebox('options');
	$('#startDate2').datebox('resize',startDate1.width);
	$('#endDate2').datebox('resize',startDate1.width);
	$('#startDate3').datebox('resize',startDate1.width);
	$('#endDate3').datebox('resize',startDate1.width);
	$('#flightQsrq').datebox('resize',startDate1.width);
	$('#flightZzrq').datebox('resize',startDate1.width);
	
	var today = new Date();
	today = today.pattern("yyyy-MM-dd");
	$('#startDate1').datebox('setValue',today);
	$('#endDate1').datebox('setValue',today);
	$('#startDate2').datebox('setValue',today);
	$('#endDate2').datebox('setValue',today);
	$('#startDate3').datebox('setValue',today);
	$('#endDate3').datebox('setValue',today);
}

/** -------- 限制日期选择范围 ------ */
function dateBoxValidator() {
	$('#startDate1').datebox().datebox('calendar').calendar({
		validator: function(date){
			var now = new Date();
			var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			return date<=d1;
		}
	});
	$('#endDate1').datebox().datebox('calendar').calendar({
		validator: function(date){
			var now = new Date();
			var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			return date<=d1;
		}
	});
	$('#startDate2').datebox().datebox('calendar').calendar({
		validator: function(date){
			var now = new Date();
			var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			return date<=d1;
		}
	});
	$('#endDate2').datebox().datebox('calendar').calendar({
		validator: function(date){
			var now = new Date();
			var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			return date<=d1;
		}
	});
	$('#startDate3').datebox().datebox('calendar').calendar({
		validator: function(date){
			var now = new Date();
			var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			return date<=d1;
		}
	});
	$('#endDate3').datebox().datebox('calendar').calendar({
		validator: function(date){
			var now = new Date();
			var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			return date<=d1;
		}
	});
	$('#flightQsrq').datebox().datebox('calendar').calendar({
		validator: function(date){
			var now = new Date();
			var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			return date<=d1;
		}
	});
	$('#flightZzrq').datebox().datebox('calendar').calendar({
		validator: function(date){
			var now = new Date();
			var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			return date<=d1;
		}
	});
}

function validateDate(){
	$("#conditionForm1").form('validate');
	$("#conditionForm2").form('validate');
	$("#conditionForm3").form('validate');
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_info = {
		id : "orderInfo",
		title : "机票订单详细信息"
	};

	// 查看窗口
	initDialog(dialog_info);
	$('#orderInfo').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var sdate1 = $('#startDate1').datebox('getValue');
	var edate1 = $('#endDate1').datebox('getValue');
	var sdate2 = $('#startDate2').datebox('getValue');
	var edate2 = $('#endDate2').datebox('getValue');
	var sdate3 = $('#startDate2').datebox('getValue');
	var edate3 = $('#endDate2').datebox('getValue');
	var fsdate = $('#flightQsrq').datebox('getValue');
	var fedate = $('#flightZzrq').datebox('getValue');
	if (!isEmpty(sdate1)) {
		sdate1 = sdate1.replace(/-/g, '');
	}
	if (!isEmpty(edate1)) {
		edate1 = edate1.replace(/-/g, '');
	}
	if (!isEmpty(sdate2)) {
		sdate2 = sdate2.replace(/-/g, '');
	}
	if (!isEmpty(edate2)) {
		edate2 = edate2.replace(/-/g, '');
	}
	if (!isEmpty(sdate3)) {
		sdate3 = sdate3.replace(/-/g, '');
	}
	if (!isEmpty(edate3)) {
		edate3 = edate3.replace(/-/g, '');
	}
	if (!isEmpty(fsdate)) {
		fsdate = fsdate.replace(/-/g, '');
	}
	if (!isEmpty(fedate)) {
		fedate = fedate.replace(/-/g, '');
	}
	if (sdate1 != null && sdate1 != "" && edate1 != null && edate1 != "") {
		if (parseInt(sdate1) > parseInt(edate1)) {
			$.messager.alert('错误提示', '订单开始日期不能大于订单截止日期', 'error');
			return false;
		}
	}
	if (sdate2 != null && sdate2 != "" && edate2 != null && edate2 != "") {
		if (parseInt(sdate2) > parseInt(edate2)) {
			$.messager.alert('错误提示', '订单开始日期不能大于订单截止日期', 'error');
			return false;
		}
	}
	if (sdate3 != null && sdate3 != "" && edate3 != null && edate3 != "") {
		if (parseInt(sdate3) > parseInt(edate3)) {
			$.messager.alert('错误提示', '订单开始日期不能大于订单截止日期', 'error');
			return false;
		}
	}
	if (fsdate != null && fsdate != "" && fedate != null && fedate != "") {
		if (parseInt(fsdate) > parseInt(fedate)) {
			$.messager.alert('错误提示', '航班开始日期不能大于航班截止日期', 'error');
			return false;
		}
	}
	//验证表单参数
	var sflag = $("#conditionForm1").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("conditionForm1");
	if($("#condition").val()=='2'){
		params = serializeJson("conditionForm2");
	}
	if($("#condition").val()=='3'){
		params = serializeJson("conditionForm3");
	}
	// 加载表格
	$('#queryOrderTable').datagrid({
		url : 'historyList.action',
		toolbar : '#toolbar',
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
		},
		columns : [ [ {
			field : 'rownumbers',
			title : '',
			align : 'center',
			styler : rownumSytler,
			formatter : rownumFormater,
			width : 25
		}, {
			field : 'orderId',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'orderCode',
			title : '订单编号',
			align : 'center',
			formatter : orderCodeFormater,
			width : 150
		}, {
			field : 'pnr',
			title : 'PNR',
			align : 'center',
			formatter : splitFormater,
			width : 75
		}, {
			field : 'productName',
			title : '产品名称',
			align : 'center',
			formatter : splitFormater,
			width : 75
		}, {
			field : 'allFnumber',
			title : '航班号',
			align : 'center',
			formatter : splitFormater,
			width : 75
		}, {
			field : 'allSail',
			title : '航段',
			align : 'center',
			formatter : splitFormater,
			width : 75
		}, {
			field : 'seat',
			title : '舱位',
			align : 'center',
			formatter : splitFormater,
			width : 50
		}, {
			field : 'allFare',
			title : '票面价',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		}, {
			field : 'allairportTax',
			title : '机建',
			align : 'center',
			formatter : baseNumFormater,
			width : 50
		}, {
			field : 'allfuelTax',
			title : '燃油',
			align : 'center',
			formatter : baseNumFormater,
			width : 50
		}, {
			field : 'insuranceTotalPrice',
			title : '保险金额',
			align : 'center',
			formatter : baseNumFormater,
			width : 60
		}, {
			field : 'busAmount',
			title : '巴士金额',
			align : 'center',
			formatter : baseNumFormater,
			width : 60
		}, {
			field : 'paymoney',
			title : '订单金额',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		}, {
			field : 'creadate',
			title : '订单时间',
			formatter : dateTimeFormater,
			align : 'center',
			width : 150
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
			field : 'userName',
			title : '联系人',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'channel',
			title : '订单来源',
			align : 'center',
			formatter : channelFormater,
			width : 75
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	//查询-银行名称
	var queryBank = {
		url : 'queryBankTreeList.action',
		callBackFun : function(data) {
			$('#bankCode3').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 150
			});
		}
	}
	sendAjaxRequest(queryBank);
	
	//查询-支付方式名称
	var queryMethod = {
		url : 'queryConditionPayMethod.action',
		callBackFun : function(data) {
			$('#payMethod3').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 150
			});
		}
	}
	sendAjaxRequest(queryMethod);
	
	//查询-支付通道名称
	var queryCode = {
		url : 'queryConditionPayCode.action',
		callBackFun : function(data) {
			$('#payType3').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 150
			});
		}
	}
	sendAjaxRequest(queryCode);
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#queryOrderTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function orderCodeFormater(value, row, index) {
	var _id = "'" + row.orderId + "'";
	var _orderDate = "'" + dateFormater(row.creadate, null, null).replace(/-/g, '') + "'";
	var detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',' + _orderDate + ')>'
			+ value + '</a>';
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
function getInfo(id, orderDate) {
	// 打开订单详情页面
	$('#orderInfo').dialog('open');
	// 设置滚动条的垂直偏移为0
	$("#orderInfo").scrollTop(0);
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
						$("#busInfoTable").datagrid("unselectRow",
								rowIndex);
					}
				},
				onUnselect : function(rowIndex, rowData) {
					if (!IsCheckFlag) {
						IsCheckFlag = true;
						$("#busInfoTable").datagrid("selectRow",
								rowIndex);
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
					formatter : function(value, rows, index){
						var text = value;
						if(isEmpty(text)){
							return "--";
						}else{
							if(!isEmpty(rows.payCheckTime)){
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
			$('#contactinfoTable').datagrid({
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
	$('#firstMetTable').datagrid({
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
			var firstMetTable = $("#firstMetTable").datagrid("getPanel");//先获取panel对象
			firstMetTable.panel('setTitle', "第一航段:" + data.rows[0].flightSegment);//再通过panel对象去修改title
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
			width : 50
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
			width : 200
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
	$('#secondMetTable').datagrid({
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
			var secondMetTable = $("#secondMetTable").datagrid("getPanel");//先获取panel对象 
			secondMetTable.panel('setTitle', "第二航段:" + data.rows[0].flightSegment);//再通过panel对象去修改title
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
	//默认不显示第二航段信息
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
				$("#secondMetTicketTable").datagrid("unselectRow",
						rowIndex);
			}
		},
		onUnselect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#secondMetTicketTable").datagrid("selectRow",
						rowIndex);
			}
		},
		columns : [ [ {
			field : 'name',
			title : '姓名',
			align : 'center',
			formatter : baseFormater,
			width : 50
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
			width : 200
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
	//默认不显示第二航段信息
	var secondMetTicketTable = $("#secondMetTicketTable").datagrid("getPanel");
	secondMetTicketTable.panel('close');

	//判断是否有第二航段，如果有则显示
	var segmentFlag = false;
	var segmentOptions = {
		url : 'checkFlightSegment.action',
		data : "orderId=" + id + "&orderDate=" + orderDate,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				segmentFlag = data.obj.segmentFlag;
				if(segmentFlag){
					var secondMetTable = $("#secondMetTable").datagrid("getPanel");
					var secondMetTicketTable = $("#secondMetTicketTable").datagrid("getPanel");
					secondMetTable.panel('open');
					secondMetTicketTable.panel('open');
				}
			}
		}
	}
	sendAjaxRequest(segmentOptions);
	
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
			formatter : function(value, row, index){
				var text="--";
				if(!isEmpty(value)){
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
		} ] ]
	});
}

function changeCondition(){
	$("#condition1").hide();
	$("#condition2").hide();
	$("#condition3").hide();
	if($("#condition").val()=='1'){
		$("#condition1").show();
	}
	if($("#condition").val()=='2'){
		$("#condition2").show();
	}
	if($("#condition").val()=='3'){
		$("#condition3").show();
	}
	initDatebox();
	$('#queryOrderTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
}

/** -------- 重置查询条件 ------ */
function queryOrderReset() {
	var condition = $("#condition").val();
	$('#conditionForm1').form('clear');
	$('#conditionForm2').form('clear');
	$('#conditionForm3').form('clear');
	$('select').val('');
	$('#payType3').combobox('setValue', '');
	$('#payMethod3').combobox('setValue', '');
	$('#bankCode3').combobox('setValue', '');
	$("#condition").val(condition);
	$("#conditionInput1").val(condition);
	$("#conditionInput2").val(condition);
	$("#conditionInput3").val(condition);
	initDatebox();
}
