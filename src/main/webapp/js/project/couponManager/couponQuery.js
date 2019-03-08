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
	$('#createStartDate').datebox({
		editable : false,
		required : false
	});
	$('#createEndDate').datebox({
		editable : false,
		required : false
	});
	$('#startDate').datebox({
		editable : false,
		required : false
	});
	$('#endDate').datebox({
		editable : false,
		required : false
	});
	$('#useDate').datebox({
		editable : false,
		required : false
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_info = {
		id : "orderInfo",
		title : "机票订单详细信息"
	};
	var dialog_upload = {
		id : "couponUpload",
		title : "导入优惠券"
	};

	// 查看窗口
	initDialog(dialog_info);
	$('#orderInfo').dialog('close');
	//导入窗口
	initDialog(dialog_upload);
	$('#couponUpload').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable(flag) {
	//验证表单参数
	var sflag = $("#conditionForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#couponQueryTable').datagrid({
		url : 'couponQueryList.action',
		toolbar : "#toolbar",
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : true,// 定义是否设置基于该行内容的行高度
		showHeader : true,
		pageNumber : 1,
		pageSize : 20,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		queryParams : params,
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
			$.messager.alert('错误提示', '数据加载失败!', 'error');
		},
		onBeforeLoad : function(){
			return !flag;
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
			field : 'orderId',
			checkbox : 'true',
			hidden : true,
			align : 'center',
			width : 25
		}, {
			field : 'name',
			title : '优惠券名称',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'code',
			title : '优惠券代码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'price',
			title : '优惠券金额',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'aircode',
			title : '航空公司',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'afrom',
			title : '出发城市',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'ato',
			title : '到达城市',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'fnumber',
			title : '航班限定',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'seatcode',
			title : '舱位限定',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'type',
			title : '有效期',
			align : 'center',
			formatter : templetTypeFormater,
			width : 100
		}, {
			field : 'allotDate',
			title : '发放日期',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'userName',
			title : '使用者姓名',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'userMobile',
			title : '使用者手机',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'status',
			title : '使用状态',
			align : 'center',
			formatter : function(value, row, index){
				var text = couponStastusFormater(value, row, index);
				var mobile = row.userMobile;
				if(value=='1'){
					if(!isEmpty(mobile)){
						text = "已领取";
					}else{
						text = "未领取";
					}
				}
				return text;
			},
			width : 75
		}, {
			field : 'ibeOrderCode',
			title : '使用订单号',
			align : 'center',
			formatter : orderCodeFormater,
			width : 150
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	//优惠券模板
	var query = {
		url : 'queryCouponTempletTree.action',
		callBackFun : function(data) {
			$('#templetId').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 155
			});
		}
	}
	sendAjaxRequest(query);
	
	$('#status').combobox({
		data : [{
			"id" : "",
			"text" : "全部"
		},{
			"id" : "01",
			"text" : "未领取"
		},{
			"id" : "11",
			"text" : "已领取"
		},{
			"id" : "3",
			"text" : "已使用"
		}],
		valueField:'id',
		textField:'text',
		width : 155
	});
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#couponQueryTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function orderCodeFormater(value, row, index) {
	var detail = '--';
	if(!isEmpty(value)){
		var _id = "'" + row.orderId + "'";
		var _orderDate = "'" + dateFormater(row.useDate, null, null).replace(/-/g, '') + "'";
		detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',' + _orderDate + ')>' + value + '</a>';
	}
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

/** -------- 导出 ------ */
function exportCoupon() {
	var data = $('#couponQueryTable').datagrid('getData');
	var paper = $('#couponQueryTable').datagrid('getPager').pagination("options");
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
	var exportSize = 65000;
	
	if(parseInt(total) > exportSize){
		var page = (parseInt(total) + exportSize - 1) / exportSize;
		$.messager.prompt('提示', '当前数据量超过65000条，请输入要导出的页数：', function(r){
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
				openWindowWithJson('exportCouponInfoList.action',params);
			}
		});
	}else{
		params["start"] = 1;
		params["end"] = paper.total;
		openWindowWithJson('exportCouponInfoList.action',params);
	}
}

/** -------- 导入开关 ------ */
var upload = false;

/** -------- 导入 ------ */
function uploadCoupon() {
	if(!upload){
		$.messager.alert('提示信息','请选择文件！','info');
		return false;
	}
	//进度条归0
	$('#progressNumber').progressbar('setValue', '0');
	//获取文件参数
	var fd = new FormData();
	fd.append("couponExcel", document.getElementById('fileToUpload').files[0]);
	fd.append("path", "/images/upload/excel");
	//AJAX请求
	var xhr = new XMLHttpRequest();
	xhr.upload.addEventListener("progress", uploadProgress, false);
	xhr.open("POST", "uploadCouponExcel.action");
	xhr.onreadystatechange = function () {
		//4: 请求已完成，且响应已就绪
		if(xhr.readyState==4){
			var data = xhr.responseText;
			data = eval('(' + data + ')');
			if(data.isSuccessOrfail=="SUCCESS"){
				$.messager.show({title:'提示信息', msg:'上传成功！'});
				$.messager.confirm('上传成功','确认导入？',function(r){
					if(r){
						var options = {
							url : 'importCouponExcel.action',
							callBackFun : function(data) {
								showMessage(data);
							}
						}
						sendAjaxRequest(options);
					}
				});
			}else{
				$.messager.alert('错误提示','上传失败！','error');
			}
			$('#couponUpload').dialog('close');
		}
	}
	xhr.send(fd);
}

/** -------- 选择文件 ------ */
function fileSelected() {
	//进度条归0
	$('#progressNumber').progressbar('setValue', '0');
	var file = document.getElementById('fileToUpload').files[0];
	var fileName = file.name;
	var file_typename = fileName.substring(fileName.lastIndexOf('.'), fileName.length);
	
	$('#fileName').val(fileName);
	
	if (file_typename == '.xls') {//这里限定上传文件文件类型
		if (file.size <= 104857600){//这里限定上传文件文件大小
			if (file) {
				var fileSize = 0;
				if (file.size > 1024 * 1024){
					fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
				}
				else{
					fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
				}
				upload = true;
			}
		} else {
			$.messager.alert('错误提示',"文件大小要小于100M！",'error');
			upload = false;
		}
	}else{
		$.messager.alert('错误提示',"文件格式必须是xls！",'error');
		upload = false;
	}
}

/** -------- 导入进度条 ------ */
function uploadProgress(evt) {
	if (evt.lengthComputable) {
		var percentComplete = Math.round(evt.loaded * 100 / evt.total);
		$('#progressNumber').progressbar('setValue', percentComplete);
	}
	else {
		document.getElementById('progressNumber').innerHTML = '无法计算';
	}
}


/** -------- 重置查询条件 ------ */
function couponQueryReset() {
	$("#conditionForm").form("clear");
	$('#templetId').combobox('setValue','');
	$('#status').combobox('setValue','');
	initDatebox();
}
