var channels=[];
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
	today = today.pattern("yyyy-MM-dd");
	$('#startdate').datebox({
		label : '支付起始日期：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		value : today,
		editable : false,
		required : false
	});
	$('#enddate').datebox({
		label : '支付截止日期：',
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
	$("#ordercode").textbox({
		label : '订单编号：',
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
	$("#payserial").textbox({
		label : '交易流水号：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#username").textbox({
		label : '联系人姓名：',
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
	$("#pnr").textbox({
		label : 'PNR：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	
	var order_info = {
		id : "orderInfo",
		title : "机票订单详细信息"
	};
	var pay_info = {
		id : "paymentDetailInfo",
		title : "支付明细详情"
	};

	var dialog_info_upgrad = {
		id : "orderInfoUpgrad",
		title : "机票订单详细信息"
	};

	initDialog(dialog_info_upgrad);
	$('#orderInfoUpgrad').dialog('close');

	// 查看窗口
	initDialog(order_info);
	$('#orderInfo').dialog('close');
	initDialog(pay_info);
	$('#paymentDetailInfo').dialog('close');
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
	$('#paymentDetailTable').datagrid({
		url : root + '/pay/paymentDetailList',
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
			field : 'payid',
			checkbox : 'true',
			align : 'center',
			hidden : true,
			width : 25
		}, {
			field : 'accid',
			checkbox : 'true',
			align : 'center',
			hidden : true,
			width : 25
		}, {
			field : 'username',
			title : '联系姓名',
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
			field : 'ordercode',
			title : '订单号',
			align : 'center',
			formatter : orderCodeFormater,
			width : 150
		}, {
			field : 'isInter',
			title : '国内/国际',
			align : 'center',
			formatter : isInterFormater,
			width : 80
		}, {
			field : 'paytype',
			title : '支付通道',
			align : 'center',
			formatter : function(value, row, index){
				var text = "--";
				if(value == "weixin"){
					text = "微信";
				}
				if(value == "alipay"){
					text = "支付宝";
				}
				return text;
			},
			width : 75
		}, {
			field : 'paymethod',
			title : '支付方式',
			align : 'center',
			formatter : function(value, row, index){
				var text = "--";
				if(row.paytype == "weixin"){
					text = "微信支付";
				}
				if(row.paytype == "alipay"){
					text = "支付宝支付";
				}
				return text;
			},
			width : 100
		}, {
			field : 'paybillno',
			title : '银行订单号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'payserial',
			title : '交易流水号',
			align : 'center',
			formatter : baseFormater,
			width : 250
		}, {
			field : 'bankName',
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
			field : 'paymoney',
			title : '支付金额',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'paydate',
			title : '支付时间',
			align : 'center',
			formatter : baseFormater,
			width : 160
		}, {
			field : 'paytime',
			title : '支付返回时间',
			align : 'center',
			hidden : true,
			formatter : baseFormater,
			width : 160
		}, {
			field : 'paystatus',
			title : '支付结果',
			align : 'center',
			formatter : paystatusFormater,
			width : 100
		}, {
			field : 'remark',
			title : '备注',
			align : 'center',
			hidden : true,
			formatter : baseFormater,
			width : 100
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
	$('#paystatus').combobox({
		label : '支付提交结果：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data: [{
			"id" : "",
			"text" : "全部",
			"selected": true
		},{
			"id" : "0",
			"text" : "未支付"
		},{
			"id" : "1",
			"text" : "支付中"
		},{
			"id" : "2",
			"text" : "支付成功"
		},{
			"id" : "3",
			"text" : "支付失败"
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
		},{
			'id':'2',
			'text':'升舱订单'
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
	
	//渠道设置
	var channel={
		url : root+'/common/channels',
		callBackFun : function(data) {
			channels = data.rows;
		}
	};
	sendAjaxRequest(channel);
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#paymentDetailTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function orderCodeFormater(value, row, index) {
	var _id = "'" + row.accid + "'";
	var _code = "'" + row.ordercode + "'";
	var _date = "'" + row.paydate.split(' ')[0].replace(/-/g, '') + "'";
	var detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',' + _date +  ',' + _code + ',"orderInfo")>'
			+ row.ordercode + '</a>';
	return detail;
};
function upgradOrderCodeFormater(value, row, index) {
	var _id = "'" + row.orderid + "'";
	var _code = "'" + row.ordercode + "'";
	var _orderDate = "'" + row.creadate.split(' ')[0].replace(/-/g, '') + "'";
	var detail = '<a href="javascript:void(0);" onclick=getInfoUpgrad(' + _id + ',' + _orderDate + ',' + _code + ')>' + value + '</a>';
	return detail;
};
function optFormater(value, row, index) {
	var _id = "'" + index + "'";
	var detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"","","payInfo")>详情</a>';
	return detail;
};
function remarkFormater(value, row, index) {
	if (isEmpty(value)) {
		return "双击录入流水号";
	}
	return value;
};

/** --------自定义单元格样式 ------ */
function remarkSytler(value, row, index) {
	if (isEmpty(value)) {
		return "color: red;"
	}
	return "";
};

/** --------查看订单详情 ------ */
function getInfo(id, orderDate, orderCode, flag) {
	// 标示是否选中行的，true - 是 , false - 否
	var IsCheckFlag = true;
	if(flag=='orderInfo'){
		// 打开订单详情页面
		$('#orderInfo').dialog('open');
		// 设置滚动条的垂直偏移为0
		$("#orderInfo").scrollTop(0);
		$('#upgradOrderInfo').datagrid({
			url : root + '/order/queryUpgradOrderInfo',
			checkOnSelect : false,// 是否选中/取消复选框
			pagination : false,// 是否分页
			autoRowHeight : true,// 定义是否设置基于该行内容的行高度
			fitColumns : true,// 列自适应表格宽度
			striped : false,// 当true时，单元格显示条纹
			rownumbers : false,// 是否显示行号
			singleSelect : true,// 是否只能选中一条
			nowrap : false,// 是否在一行内显示
			queryParams : {
				'orderId' : id
			},
			onLoadSuccess : function(data) {
				var upgradOrderInfo = $("#upgradOrderInfo").datagrid("getPanel");
				if (data.rows.length == 0) {
					upgradOrderInfo.panel('close');
				}else {
					upgradOrderInfo.panel('open');
				}
			},
			onClickCell : function(rowIndex, rowData) {
				IsCheckFlag = false;
			},
			onSelect : function(rowIndex, rowData) {
				if (!IsCheckFlag) {
					IsCheckFlag = true;
					$("#upgradOrderInfo").datagrid("unselectRow", rowIndex);
				}
			},
			onUnselect : function(rowIndex, rowData) {
				if (!IsCheckFlag) {
					IsCheckFlag = true;
					$("#upgradOrderInfo").datagrid("selectRow", rowIndex);
				}
			},
			columns : [ [ {
				field : 'ordercode',
				title : '订单编号',
				align : 'center',
				formatter : upgradOrderCodeFormater,
				width : 100
			}, {
				field : 'productname',
				title : '产品名称',
				align : 'center',
				formatter : baseFormater,
				width : 100
			}, {
				field : 'order_status',
				title : '订单状态',
				align : 'center',
				formatter : statusFormater,
				width : 100
			}, {
				field : 'paystatus',
				title : '支付状态',
				align : 'center',
				formatter : paystatusFormater,
				width : 100
			}, {
				field : 'paymoney',
				title : '订单金额',
				align : 'center',
				formatter : baseNumFormater,
				width : 100
			}, {
				field : 'creadate',
				title : '订单时间',
				align : 'center',
				formatter : baseFormater,
				width : 100
			}] ]
		});
		var options = {
			url : root + '/order/queryOrderInfoByOrderId',
			data : {
				"orderId" : id,
				"orderDate" : orderDate
			},
			callBackFun : function(data) {
				// 加载订单详情表格
				$('#orderInfoTable').datagrid({
					data : data,
					checkOnSelect : false,// 是否选中/取消复选框
					pagination : false,// 是否分页
					autoRowHeight : false,// 定义是否设置基于该行内容的行高度
					fitColumns : false,// 列自适应表格宽度
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
						field : 'isInter',
						title : '国内国际',
						align : 'center',
						formatter : isInterFormater,
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
						field : 'integralValue',
						title : '积分值',
						align : 'center',
						formatter : baseNumFormater,
						width : 75
					}, {
						field : 'channel',
						title : '订单来源',
						align : 'center',
						formatter : function(value, row, index){
							var valueArr=value.split(",");
							var channelArr=[];
							for (var i = 0; i < channels.length; i++) {
								for(var j=0;j<valueArr.length;j++){
									if(channels[i].chalCode == valueArr[j]){
										channelArr.push(channels[i].chalName);
										continue;
									}
								}
								
							}
							return channelArr.join(",");
						},
						width : 75
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
						field : 'paytype',
						title : '支付通道',
						align : 'center',
						formatter : payTypeFormater,
						width : 60
					}, {
						field : 'paymethod',
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
						title : '是否冀鹰会员',
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
						title : '常旅客卡号',
						align : 'center',
						formatter : baseFormater,
						width : 100
					} ] ]
				});
			}
		}
		sendAjaxRequest(options);

		var queryType = {
			url : root + '/order/queryTicketPassengerInfoBySidAndorderId',
			data : {
				'segid' : '1',
				'orderId' : id,
				'orderDate' : orderDate
			},
			callBackFun : function(data) {
				if(data.rows[0].ticketType =='upgrad' && (data.rows[0].initialTicketid==null || data.rows[0].initialTicketid=='' || data.rows
						[0].initialTicketid=='null')){
					// 加载第一航段信息表格
					$('#firstMetTable').datagrid({
						url : root + '/order/queryTicketSementInfoBySidAndorderId',
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
							width : 75
						}, {
							field : 'ttime',
							title : '到达时间',
							align : 'center',
							formatter : baseFormater,
							width : 75
						}, {
							field : 'seat',
							title : '舱位',
							align : 'center',
							formatter : baseFormater,
							width : 50
						}, {
							field : 'initialSeat',
							title : '原舱位',
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
							field : 'fmoney',
							title : '优惠金额',
							align : 'center',
							formatter : baseNumFormater,
							width : 75
						}, {
							field : 'integralDiscount',
							title : '折扣率',
							align : 'center',
							formatter : baseNumFormater,
							width : 75
						} ] ]
					});
					// 加载第一航段乘客表格
					$('#firstMetTicketTable').datagrid({
						url : root + '/order/queryTicketPassengerInfoBySidAndorderId',
						checkOnSelect : false,// 是否选中/取消复选框
						pagination : false,// 是否分页
						autoRowHeight : false,// 定义是否设置基于该行内容的行高度
						fitColumns : false,// 列自适应表格宽度
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
						}, {
							field : 'gender',
							title : '性别',
							align : 'center',
							formatter : genderFormater,
						}, {
							field : 'birthday',
							title : '生日',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'country',
							title : '国籍',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'idtype',
							title : '证件类型',
							align : 'center',
							formatter : idtypeFormatter,
						}, {
							field : 'idnumber',
							title : '证件号码',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'passportCountry',
							title : '护照签发国',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'passportValid',
							title : '护照有效期',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'upgradMoney',
							title : '升舱金额',
							align : 'center',
							formatter : baseNumFormater,
						}, {
							field : 'paymoney',
							title : '支付金额',
							align : 'center',
							formatter : baseNumFormater,
						}, {
							field : 'pnr',
							title : 'PNR',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'pnr',
							title : '原PNR',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'eticketno',
							title : '机票号',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'initialTktno',
							title : '原机票号',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'status',
							title : '客票状态',
							align : 'center',
							formatter : statusFormater,
						}, {
							field : 'cstatus',
							title : '退改状态',
							align : 'center',
							formatter : cstatusFormater,
						} ] ]
					});


				} else if(data.rows[0].ticketType =='upgrad' && data.rows[0].initialTicketid!=null && data.rows[0].initialTicketid!='' && data.rows[0].initialTicketid!='null') {
					// 加载第一航段信息表格
					$('#firstMetTable').datagrid({
						url : root + '/order/queryTicketSementInfoBySidAndorderId',
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
							width : 75
						}, {
							field : 'ttime',
							title : '到达时间',
							align : 'center',
							formatter : baseFormater,
							width : 75
						}, {
							field : 'seat',
							title : '舱位',
							align : 'center',
							formatter : baseFormater,
							width : 50
						}, {
							field : 'initialSeat',
							title : '原舱位',
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
							field : 'fmoney',
							title : '优惠金额',
							align : 'center',
							formatter : baseNumFormater,
							width : 75
						}, {
							field : 'integralDiscount',
							title : '折扣率',
							align : 'center',
							formatter : baseNumFormater,
							width : 75
						} ] ]
					});
					// 加载第一航段乘客表格
					$('#firstMetTicketTable').datagrid({
						url : root + '/order/queryTicketPassengerInfoBySidAndorderId',
						checkOnSelect : false,// 是否选中/取消复选框
						pagination : false,// 是否分页
						autoRowHeight : false,// 定义是否设置基于该行内容的行高度
						fitColumns : false,// 列自适应表格宽度
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
						}, {
							field : 'gender',
							title : '性别',
							align : 'center',
							formatter : genderFormater,
						}, {
							field : 'birthday',
							title : '生日',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'country',
							title : '国籍',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'idtype',
							title : '证件类型',
							align : 'center',
							formatter : idtypeFormatter,
						}, {
							field : 'idnumber',
							title : '证件号码',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'passportCountry',
							title : '护照签发国',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'passportValid',
							title : '护照有效期',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'initialFare',
							title : '票面价',
							align : 'center',
							formatter : baseNumFormater,
						}, {
							field : 'initialAirport',
							title : '机建',
							align : 'center',
							formatter : baseNumFormater,
						}, {
							field : 'initialFuel',
							title : '燃油',
							align : 'center',
							formatter : baseNumFormater,
						}, {
							field : 'initialTax',
							title : '国际票总税',
							align : 'center',
							formatter : baseNumFormater,
						}, {
							field : 'upgradMoney',
							title : '升舱金额',
							align : 'center',
							formatter : baseNumFormater,
						}, {
							field : 'money',
							title : '票款总价',
							align : 'center',
							formatter : baseNumFormater,
						}, {
							field : 'paymoney',
							title : '实际票款',
							align : 'center',
							formatter : baseNumFormater,
						}, {
							field : 'pnr',
							title : 'PNR',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'pnr',
							title : '原PNR',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'eticketno',
							title : '机票号',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'initialTktno',
							title : '原机票号',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'status',
							title : '客票状态',
							align : 'center',
							formatter : statusFormater,
						}, {
							field : 'cstatus',
							title : '退改状态',
							align : 'center',
							formatter : cstatusFormater,
						} ] ]
					});

				} else {
					// 加载第一航段信息表格
					$('#firstMetTable').datagrid({
						url : root + '/order/queryTicketSementInfoBySidAndorderId',
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
							width : 75
						}, {
							field : 'ttime',
							title : '到达时间',
							align : 'center',
							formatter : baseFormater,
							width : 75
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
							field : 'fmoney',
							title : '优惠金额',
							align : 'center',
							formatter : baseNumFormater,
							width : 75
						}, {
							field : 'integralDiscount',
							title : '折扣率',
							align : 'center',
							formatter : baseNumFormater,
							width : 75
						} ] ]
					});
					// 加载第一航段乘客表格
					$('#firstMetTicketTable').datagrid({
						url : root + '/order/queryTicketPassengerInfoBySidAndorderId',
						checkOnSelect : false,// 是否选中/取消复选框
						pagination : false,// 是否分页
						autoRowHeight : false,// 定义是否设置基于该行内容的行高度
						fitColumns : false,// 列自适应表格宽度
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
						}, {
							field : 'gender',
							title : '性别',
							align : 'center',
							formatter : genderFormater,
						}, {
							field : 'birthday',
							title : '生日',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'country',
							title : '国籍',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'idtype',
							title : '证件类型',
							align : 'center',
							formatter : idtypeFormatter,
						}, {
							field : 'idnumber',
							title : '证件号码',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'passportCountry',
							title : '护照签发国',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'passportValid',
							title : '护照有效期',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'fare',
							title : '票面价',
							align : 'center',
							formatter : baseNumFormater,
						}, {
							field : 'airportTax',
							title : '机建',
							align : 'center',
							formatter : baseNumFormater,
						}, {
							field : 'fuelTax',
							title : '燃油',
							align : 'center',
							formatter : baseNumFormater,
						}, {
							field : 'taxPrice',
							title : '国际票总税',
							align : 'center',
							formatter : baseNumFormater,
						}, {
							field : 'money',
							title : '票款总价',
							align : 'center',
							formatter : baseNumFormater,
						}, {
							field : 'paymoney',
							title : '实际票款',
							align : 'center',
							formatter : baseNumFormater,
						}, {
							field : 'pnr',
							title : 'PNR',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'eticketno',
							title : '机票号',
							align : 'center',
							formatter : baseFormater,
						}, {
							field : 'status',
							title : '客票状态',
							align : 'center',
							formatter : statusFormater,
						}, {
							field : 'cstatus',
							title : '退改状态',
							align : 'center',
							formatter : cstatusFormater,
						} ] ]
					});

				}
			}
		}
		sendAjaxRequest(queryType);

		//判断是否有第二航段，如果有则显示
		var segmentFlag = false;
		try {
			var secondMetTable = $("#secondMetTable").datagrid("getPanel");
			var secondMetTicketTable = $("#secondMetTicketTable").datagrid("getPanel");
			secondMetTable.panel('close');
			secondMetTicketTable.panel('close');
		} catch (e) {
		}
		var queryTypeTwo = {
			url : root + '/order/queryTicketPassengerInfoBySidAndorderId',
			data : {
				'segid' : '2',
				'orderId' : id,
				'orderDate' : orderDate
			},
			callBackFun : function(data) {
				if(data.rows[0].ticketType =='upgrad' && (data.rows[0].initialTicketid==null || data.rows[0].initialTicketid==''  || data.rows
						[0].initialTicketid=='null')){

					var segmentOptions = {
						url : root + '/order/checkFlightSegment',
						data : "orderId=" + id + "&orderDate=" + orderDate,
						callBackFun : function(data) {
							if (data.isSuccessOrfail == "SUCCESS") {
								segmentFlag = data.obj.segmentFlag;
								if(segmentFlag){
									// 加载第二航段表格
									$('#secondMetTable').datagrid({
										url : root + '/order/queryTicketSementInfoBySidAndorderId',
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
											secondMetTable.panel('setTitle', "第二航段:" + data.rows[0].flightSegment);//再通过panel对象去修
											改title
											secondMetTable.panel('open');
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
											width : 75
										}, {
											field : 'ttime',
											title : '到达时间',
											align : 'center',
											formatter : baseFormater,
											width : 75
										}, {
											field : 'seat',
											title : '舱位',
											align : 'center',
											formatter : baseFormater,
											width : 50
										}, {
											field : 'initialSeat',
											title : '原舱位',
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
											field : 'fmoney',
											title : '优惠金额',
											align : 'center',
											formatter : baseNumFormater,
											width : 75
										}, {
											field : 'integralDiscount',
											title : '折扣率',
											align : 'center',
											formatter : baseNumFormater,
											width : 75
										} ] ]
									});

									// 加载第二航段乘客表格
									$('#secondMetTicketTable').datagrid({
										url : root + '/order/queryTicketPassengerInfoBySidAndorderId',
										checkOnSelect : false,// 是否选中/取消复选框
										pagination : false,// 是否分页
										autoRowHeight : false,// 定义是否设置基于该行内容的行高度
										fitColumns : false,// 列自适应表格宽度
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
											var secondMetTicketTable = $("#secondMetTicketTable").datagrid("getPanel");
											secondMetTicketTable.panel('open');
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
										}, {
											field : 'sex',
											title : '性别',
											align : 'center',
											formatter : genderFormater,
										}, {
											field : 'birthday',
											title : '生日',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'country',
											title : '国籍',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'idtype',
											title : '证件类型',
											align : 'center',
											formatter : idtypeFormatter,
										}, {
											field : 'idnumber',
											title : '证件号码',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'passportCountry',
											title : '护照签发国',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'passportValid',
											title : '护照有效期',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'upgradMoney',
											title : '升舱金额',
											align : 'center',
											formatter : baseNumFormater,
										}, {
											field : 'paymoney',
											title : '支付金额',
											align : 'center',
											formatter : baseNumFormater,
										}, {
											field : 'pnr',
											title : 'PNR',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'pnr',
											title : '原PNR',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'eticketno',
											title : '机票号',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'initialTktno',
											title : '原机票号',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'status',
											title : '客票状态',
											align : 'center',
											formatter : statusFormater,
										}, {
											field : 'cstatus',
											title : '退改状态',
											align : 'center',
											formatter : cstatusFormater,
										} ] ]
									});
								}
							}
						}
					}
					sendAjaxRequest(segmentOptions);
				} else if (data.rows[0].ticketType =='upgrad' && data.rows[0].initialTicketid!=null && data.rows[0].initialTicketid!=''  && data.rows
						[0].initialTicketid!='null'){

					var segmentOptions = {
						url : root + '/order/checkFlightSegment',
						data : "orderId=" + id + "&orderDate=" + orderDate,
						callBackFun : function(data) {
							if (data.isSuccessOrfail == "SUCCESS") {
								segmentFlag = data.obj.segmentFlag;
								if(segmentFlag){
									// 加载第二航段表格
									$('#secondMetTable').datagrid({
										url : root + '/order/queryTicketSementInfoBySidAndorderId',
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
											secondMetTable.panel('setTitle', "第二航段:" + data.rows[0].flightSegment);//再通过panel对象去修
											改title
											secondMetTable.panel('open');
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
											width : 75
										}, {
											field : 'ttime',
											title : '到达时间',
											align : 'center',
											formatter : baseFormater,
											width : 75
										}, {
											field : 'seat',
											title : '舱位',
											align : 'center',
											formatter : baseFormater,
											width : 50
										}, {
											field : 'initialSeat',
											title : '原舱位',
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
											field : 'fmoney',
											title : '优惠金额',
											align : 'center',
											formatter : baseNumFormater,
											width : 75
										}, {
											field : 'integralDiscount',
											title : '折扣率',
											align : 'center',
											formatter : baseNumFormater,
											width : 75
										} ] ]
									});

									// 加载第二航段乘客表格
									$('#secondMetTicketTable').datagrid({
										url : root + '/order/queryTicketPassengerInfoBySidAndorderId',
										checkOnSelect : false,// 是否选中/取消复选框
										pagination : false,// 是否分页
										autoRowHeight : false,// 定义是否设置基于该行内容的行高度
										fitColumns : false,// 列自适应表格宽度
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
											var secondMetTicketTable = $("#secondMetTicketTable").datagrid("getPanel");
											secondMetTicketTable.panel('open');
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
										}, {
											field : 'gender',
											title : '性别',
											align : 'center',
											formatter : genderFormater,
										}, {
											field : 'birthday',
											title : '生日',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'country',
											title : '国籍',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'idtype',
											title : '证件类型',
											align : 'center',
											formatter : idtypeFormatter,
										}, {
											field : 'idnumber',
											title : '证件号码',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'passportCountry',
											title : '护照签发国',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'passportValid',
											title : '护照有效期',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'initialFare',
											title : '票面价',
											align : 'center',
											formatter : baseNumFormater,
										}, {
											field : 'initialAirport',
											title : '机建',
											align : 'center',
											formatter : baseNumFormater,
										}, {
											field : 'initialFuel',
											title : '燃油',
											align : 'center',
											formatter : baseNumFormater,
										}, {
											field : 'initialTax',
											title : '国际票总税',
											align : 'center',
											formatter : baseNumFormater,
										}, {
											field : 'upgradMoney',
											title : '升舱金额',
											align : 'center',
											formatter : baseNumFormater,
										}, {
											field : 'money',
											title : '票款总价',
											align : 'center',
											formatter : baseNumFormater,
										}, {
											field : 'paymoney',
											title : '实际票款',
											align : 'center',
											formatter : baseNumFormater,
										}, {
											field : 'pnr',
											title : 'PNR',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'pnr',
											title : '原PNR',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'eticketno',
											title : '机票号',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'initialTktno',
											title : '原机票号',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'status',
											title : '客票状态',
											align : 'center',
											formatter : statusFormater,
										}, {
											field : 'cstatus',
											title : '退改状态',
											align : 'center',
											formatter : cstatusFormater,
										} ] ]
									});
								}
							}
						}
					}
					sendAjaxRequest(segmentOptions);
				} else {

					var segmentOptions = {
						url : root + '/order/checkFlightSegment',
						data : "orderId=" + id + "&orderDate=" + orderDate,
						callBackFun : function(data) {
							if (data.isSuccessOrfail == "SUCCESS") {
								segmentFlag = data.obj.segmentFlag;
								if(segmentFlag){
									// 加载第二航段表格
									$('#secondMetTable').datagrid({
										url : root + '/order/queryTicketSementInfoBySidAndorderId',
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
											secondMetTable.panel('setTitle', "第二航段:" + data.rows[0].flightSegment);//再通过panel对象去修
											改title
											secondMetTable.panel('open');
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
											width : 75
										}, {
											field : 'ttime',
											title : '到达时间',
											align : 'center',
											formatter : baseFormater,
											width : 75
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
											field : 'fmoney',
											title : '优惠金额',
											align : 'center',
											formatter : baseNumFormater,
											width : 75
										}, {
											field : 'integralDiscount',
											title : '折扣率',
											align : 'center',
											formatter : baseNumFormater,
											width : 75
										} ] ]
									});

									// 加载第二航段乘客表格
									$('#secondMetTicketTable').datagrid({
										url : root + '/order/queryTicketPassengerInfoBySidAndorderId',
										checkOnSelect : false,// 是否选中/取消复选框
										pagination : false,// 是否分页
										autoRowHeight : false,// 定义是否设置基于该行内容的行高度
										fitColumns : false,// 列自适应表格宽度
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
											var secondMetTicketTable = $("#secondMetTicketTable").datagrid("getPanel");
											secondMetTicketTable.panel('open');
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
										}, {
											field : 'gender',
											title : '性别',
											align : 'center',
											formatter : genderFormater,
										}, {
											field : 'birthday',
											title : '生日',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'country',
											title : '国籍',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'idtype',
											title : '证件类型',
											align : 'center',
											formatter : idtypeFormatter,
										}, {
											field : 'idnumber',
											title : '证件号码',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'passportCountry',
											title : '护照签发国',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'passportValid',
											title : '护照有效期',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'fare',
											title : '票面价',
											align : 'center',
											formatter : baseNumFormater,
										}, {
											field : 'airportTax',
											title : '机建',
											align : 'center',
											formatter : baseNumFormater,
										}, {
											field : 'fuelTax',
											title : '燃油',
											align : 'center',
											formatter : baseNumFormater,
										}, {
											field : 'taxPrice',
											title : '国际票总税',
											align : 'center',
											formatter : baseNumFormater,
										}, {
											field : 'money',
											title : '票款总价',
											align : 'center',
											formatter : baseNumFormater,
										}, {
											field : 'paymoney',
											title : '实际票款',
											align : 'center',
											formatter : baseNumFormater,
										}, {
											field : 'pnr',
											title : 'PNR',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'eticketno',
											title : '机票号',
											align : 'center',
											formatter : baseFormater,
										}, {
											field : 'status',
											title : '客票状态',
											align : 'center',
											formatter : statusFormater,
										}, {
											field : 'cstatus',
											title : '退改状态',
											align : 'center',
											formatter : cstatusFormater,
										} ] ]
									});
								}
							}
						}
					}
					sendAjaxRequest(segmentOptions);
				}

			}
		}
		sendAjaxRequest(queryTypeTwo);

		
		// 加载保险表格
		$('#insuranceTable').datagrid({
			url : root + '/insurance/queryInsuranceInfoList',
			checkOnSelect : false,// 是否选中/取消复选框
			pagination : false,// 是否分页
			autoRowHeight : true,// 定义是否设置基于该行内容的行高度
			fitColumns : false,// 列自适应表格宽度
			striped : false,// 当true时，单元格显示条纹
			rownumbers : true,// 是否显示行号
			singleSelect : true,// 是否只能选中一条
			nowrap : false,// 是否在一行内显示
			queryParams : {
				'ordercode' : orderCode,
				"startdate" : $("#startDate").datebox("getValue"),
				"enddate" : $("#endDate").datebox("getValue")
			},
			onLoadSuccess : function(data) {
				var insuranceTable = $("#insuranceTable").datagrid("getPanel");
				if (data.rows.length == 0) {
					insuranceTable.panel('close');
				}else {
					insuranceTable.panel('open');
				}
			},
			onClickCell : function(rowIndex, rowData) {
				IsCheckFlag = false;
			},
			onSelect : function(rowIndex, rowData) {
				if (!IsCheckFlag) {
					IsCheckFlag = true;
					$("#insuranceTable").datagrid("unselectRow", rowIndex);
				}
			},
			onUnselect : function(rowIndex, rowData) {
				if (!IsCheckFlag) {
					IsCheckFlag = true;
					$("#insuranceTable").datagrid("selectRow", rowIndex);
				}
			},
			columns : [ [ {
				field : 'buyTotalPrice',
				title : '保费',
				align : 'center',
				formatter : baseNumFormater,
				width : 50
			}, {
				field : 'repay',
				title : '保额',
				align : 'center',
				formatter : baseFormater,
				width : 100
			}, {
				field : 'insNo',
				title : '保单号',
				align : 'center',
				formatter : baseFormater,
				width : 150
			}, {
				field : 'status',
				title : '购保状态',
				align : 'center',
				formatter : insuranceStatusFormater,
				width : 75
			}, {
				field : 'insuranceProductName',
				title : '保险产品',
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
				field : 'insuredName',
				title : '受益人姓名',
				align : 'center',
				formatter : baseFormater,
				width : 75
			}, {
				field : 'insuredMobile',
				title : '受益人手机',
				align : 'center',
				formatter : baseFormater,
				width : 75
			}, {
				field : 'createDate',
				title : '购保日期',
				align : 'center',
				formatter : dateTimeFormater,
				width : 150
			} ] ]
		});
		
		// 加载行程单表格
		$('#travelMailTable').datagrid({
			url : root + '/delivery/queryTravelMailList',
			checkOnSelect : false,// 是否选中/取消复选框
			pagination : false,// 是否分页
			autoRowHeight : true,// 定义是否设置基于该行内容的行高度
			fitColumns : false,// 列自适应表格宽度
			striped : false,// 当true时，单元格显示条纹
			rownumbers : false,// 是否显示行号
			singleSelect : true,// 是否只能选中一条
			nowrap : false,// 是否在一行内显示
			queryParams : {
				"orderCode" : orderCode,
				"page" : 1,
				"rows" : 20
			},
			onLoadSuccess : function(data) {
				var travelMailTable = $("#travelMailTable").datagrid("getPanel");
				if (data.rows.length == 0) {
					travelMailTable.panel('close');
				}else {
					travelMailTable.panel('open');
				}
			},
			onClickCell : function(rowIndex, rowData) {
				IsCheckFlag = false;
			},
			onSelect : function(rowIndex, rowData) {
				if (!IsCheckFlag) {
					IsCheckFlag = true;
					$("#travelMailTable").datagrid("unselectRow", rowIndex);
				}
			},
			onUnselect : function(rowIndex, rowData) {
				if (!IsCheckFlag) {
					IsCheckFlag = true;
					$("#travelMailTable").datagrid("selectRow", rowIndex);
				}
			},
			columns : [ [ {
				field : 'addressee',
				title : '收件人',
				align : 'center',
				formatter : baseFormater,
				width : 75
			}, {
				field : 'phone',
				title : '电话',
				align : 'center',
				formatter : baseFormater,
				width : 100
			}, {
				field : 'address',
				title : '地址',
				align : 'center',
				formatter : baseFormater,
				width : 300
			}, {
				field : 'applyDate',
				title : '申请日期',
				align : 'center',
				formatter : baseFormater,
				width : 100
			}, {
				field : 'applyType',
				title : '邮寄方式',
				align : 'center',
				formatter : function(value, row, index) {
					if (value == 1) {
						return '自取';
					} else if (value == 2) {
						return '邮寄';
					}
				},
				width : 100
			}, {
				field : 'emailStatus',
				title : '邮寄状态',
				align : 'center',
				formatter : function(value, row, index) {
					if (value == 1) {
						return '未邮寄';
					} else if (value == 2) {
						return '已邮寄';
					}
				},
				width : 100
			}, {
				field : 'dcDate',
				title : '邮寄日期',
				align : 'center',
				formatter : baseFormater,
				width : 100
			} ] ]
		});
		
		// 加载订单操作日志表格
		$('#logInsertTable').datagrid({
			url : root + '/refund/queryOrderProcessingList',
			checkOnSelect : false,// 是否选中/取消复选框
			pagination : false,// 是否分页
			autoRowHeight : true,// 定义是否设置基于该行内容的行高度
			fitColumns : true,// 列自适应表格宽度
			striped : false,// 当true时，单元格显示条纹
			rownumbers : true,// 是否显示行号
			singleSelect : true,// 是否只能选中一条
			nowrap : false,// 是否在一行内显示
			queryParams : {
				'orderid' : id
			},
			onLoadSuccess : function(data) {
				var logInsertTable = $("#logInsertTable").datagrid("getPanel");
				if (data.rows.length == 0) {
					logInsertTable.panel('close');
				}else {
					logInsertTable.panel('open');
				}
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
				field : 'creatime',
				title : '处理时间',
				align : 'center',
				formatter : baseFormater,
				width : 100
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
	if(flag=='payInfo'){
		$("#paymentDetailTable").datagrid('selectRow',id);
		var selected = $('#paymentDetailTable').datagrid('getSelected');
		
		$("#info_username").html(selected.username);
		$("#info_mobile").html(selected.mobile);
		$("#info_ordercode").html(selected.ordercode);
		var isInter = isInterFormater(selected.isInter,'','');
		$("#info_isInter").html(isInter);
		$("#info_paymoney").html(selected.paymoney);
		if (selected.paytype == 'alipay') {
			$("#info_paytype").html("支付宝");
			$("#info_payMethod").html("支付宝支付");
		}else if (selected.paytype == 'weixin') {
			$("#info_paytype").html("微信");
			$("#info_payMethod").html("微信支付");
		}else {
			$("#info_paytype").html("--");
			$("#info_payMethod").html("--");
		}
		$("#info_bankName").html(selected.bankName);
		$("#info_paybillno").html(selected.paybillno);
		$("#info_payserial").html(selected.payserial);
		$("#info_paydate").html(selected.paydate);
		$("#info_paytime").html(selected.paytime);
		var paystatus = paystatusFormater(selected.paystatus, '', '');
		$("#info_paystatus").html(paystatus);
		$("#info_remark").html(selected.remark);
		
		$('#paymentDetailInfo').dialog('open');
	}
}

/** -------- 导出 ------ */
function exportAccountPayList() {
	var data = $('#paymentDetailTable').datagrid('getData');
	var paper = $('#paymentDetailTable').datagrid('getPager').pagination("options");
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
				openWindowWithJson(root +'/pay/exportAccountPayList',params);
			}
		});
	}else{
		params["start"] = 1;
		params["end"] = paper.total;
		//return false;
		openWindowWithJson(root +'/pay/exportAccountPayList',params);
	}
}

/** -------- 回填流水号 ------ */
function updatePayserial(){
	$.messager.confirm('回填流水号提示', '是否确认回填流水号?', function(r) {
		if (r) {
			var payserial = $('#payinfoTable').datagrid('getData').rows[0].payserial;
			var paybillno = $('#payinfoTable').datagrid('getData').rows[0].paybillno;
			if (payserial == "双击录入流水号" || isEmpty(payserial)) {
				payserial = "";
			}
			var data = {
					'payserial' : payserial,
					'payId' : paybillno
			};
			var options = {
				url : root + '/pay/updatePayserial',// 请求的action路径
				data : data,
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						$('#orderInfo').dialog('close');
						reloadTable("paymentDetailTable");
					}
					showMessage(data);
				}
			};
			sendAjaxRequest(options);
		}
	});

}

function updatePayserialUpgrad(){
	$.messager.confirm('回填流水号提示', '是否确认回填流水号?', function(r) {
		if (r) {
			var payserial = $('#payinfoTableUpgrad').datagrid('getData').rows[0].payserial;
			var paybillno = $('#payinfoTableUpgrad').datagrid('getData').rows[0].paybillno;
			if (payserial == "双击录入流水号" || isEmpty(payserial)) {
				payserial = "";
			}
			var data = {
				'payserial' : payserial,
				'payId' : paybillno
			};
			var options = {
				url : root + '/pay/updatePayserial',// 请求的action路径
				data : data,
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						$('#orderInfoUpgrad').dialog('close');
						reloadTable("paymentDetailTable");
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
	if ($('#payinfoTable').datagrid('validateRow', editIndex)) {
		$('#payinfoTable').datagrid('endEdit', editIndex);
		editIndex = undefined;
		return true;
	} else {
		return false;
	}
}

function EditPayserial(index, field, value) {// 双击单元格开始编辑
	if (endEditing()) {
		$('#payinfoTable').datagrid('selectRow', index).datagrid('editCell', {
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
function paymentDetailReset() {
	$("#conditionForm").form("reset");
}

function getInfoUpgrad(id, orderDate,orderCode) {
	// 打开订单详情页面
	$('#orderInfoUpgrad').dialog('open');
	// 设置滚动条的垂直偏移为0
	$("#orderInfoUpgrad").scrollTop(0);
	// 标示是否选中行的，true - 是 , false - 否
	var IsCheckFlag = true;
	$('#upgradOrderInfoUpgrad').datagrid({
		url : root + '/order/queryUpgradOrderInfo',
		checkOnSelect : false,// 是否选中/取消复选框
		pagination : false,// 是否分页
		autoRowHeight : true,// 定义是否设置基于该行内容的行高度
		fitColumns : true,// 列自适应表格宽度
		striped : false,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		nowrap : false,// 是否在一行内显示
		queryParams : {
			'orderId' : id
		},
		onLoadSuccess : function(data) {
			var upgradOrderInfoUpgrad = $("#upgradOrderInfoUpgrad").datagrid("getPanel");
			if (data.rows.length == 0) {
				upgradOrderInfoUpgrad.panel('close');
			}else {
				upgradOrderInfoUpgrad.panel('open');
			}
		},
		onClickCell : function(rowIndex, rowData) {
			IsCheckFlag = false;
		},
		onSelect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#upgradOrderInfoUpgrad").datagrid("unselectRow", rowIndex);
			}
		},
		onUnselect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#upgradOrderInfoUpgrad").datagrid("selectRow", rowIndex);
			}
		},
		columns : [ [ {
			field : 'ordercode',
			title : '订单编号',
			align : 'center',
			formatter : upgradOrderCodeFormater,
			width : 100
		}, {
			field : 'productname',
			title : '产品名称',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'order_status',
			title : '订单状态',
			align : 'center',
			formatter : statusFormater,
			width : 100
		}, {
			field : 'paystatus',
			title : '支付状态',
			align : 'center',
			formatter : paystatusFormater,
			width : 100
		}, {
			field : 'paymoney',
			title : '订单金额',
			align : 'center',
			formatter : baseNumFormater,
			width : 100
		}, {
			field : 'creadate',
			title : '订单时间',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}] ]
	});
	var options = {
		url : root + '/order/queryOrderInfoByOrderId',
		data : {
			"orderId" : id,
			"orderDate" : orderDate
		},
		callBackFun : function(data) {
			// 加载订单详情表格
			$('#orderInfoTableUpgrad').datagrid({
				data : data,
				checkOnSelect : false,// 是否选中/取消复选框
				pagination : false,// 是否分页
				autoRowHeight : false,// 定义是否设置基于该行内容的行高度
				fitColumns : false,// 列自适应表格宽度
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
						$("#orderInfoTableUpgrad").datagrid("unselectRow", rowIndex);
					}
				},
				onUnselect : function(rowIndex, rowData) {
					if (!IsCheckFlag) {
						IsCheckFlag = true;
						$("#orderInfoTableUpgrad").datagrid("selectRow", rowIndex);
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
					field : 'isInter',
					title : '国内国际',
					align : 'center',
					formatter : isInterFormater,
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
					field : 'integralValue',
					title : '积分值',
					align : 'center',
					formatter : baseNumFormater,
					width : 75
				}, {
					field : 'channel',
					title : '订单来源',
					align : 'center',
					formatter : function(value, row, index){
						var valueArr=value.split(",");
						var channelArr=[];
						for (var i = 0; i < channels.length; i++) {
							for(var j=0;j<valueArr.length;j++){
								if(channels[i].chalCode == valueArr[j]){
									channelArr.push(channels[i].chalName);
									continue;
								}
							}

						}
						return channelArr.join(",");
					},
					width : 75
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

			// 加载支付信息表格
			$('#payinfoTableUpgrad').datagrid({
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
						$("#payinfoTableUpgrad").datagrid("unselectRow", rowIndex);
					}
				},
				onUnselect : function(rowIndex, rowData) {
					if (!IsCheckFlag) {
						IsCheckFlag = true;
						$("#payinfoTableUpgrad").datagrid("selectRow", rowIndex);
					}
				},
				columns : [ [ {
					field : 'paytype',
					title : '支付通道',
					align : 'center',
					formatter : payTypeFormater,
					width : 60
				}, {
					field : 'paymethod',
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
			$('#contactinfoTableUpgrad').datagrid({
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
						$("#contactinfoTableUpgrad").datagrid("unselectRow",
							rowIndex);
					}
				},
				onUnselect : function(rowIndex, rowData) {
					if (!IsCheckFlag) {
						IsCheckFlag = true;
						$("#contactinfoTableUpgrad").datagrid("selectRow",
							rowIndex);
					}
				},
				columns : [ [ {
					field : 'userType',
					title : '是否冀鹰会员',
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
					title : '常旅客卡号',
					align : 'center',
					formatter : baseFormater,
					width : 100
				} ] ]
			});
		}
	}
	sendAjaxRequest(options);

	var queryType = {
		url : root + '/order/queryTicketPassengerInfoBySidAndorderId',
		data : {
			'segid' : '1',
			'orderId' : id,
			'orderDate' : orderDate
		},
		callBackFun : function(data) {
			if(data.rows[0].ticketType =='upgrad' && (data.rows[0].initialTicketid==null || data.rows[0].initialTicketid=='' || data.rows[0].initialTicketid=='null')){
				// 加载第一航段信息表格
				$('#firstMetTableUpgrad').datagrid({
					url : root + '/order/queryTicketSementInfoBySidAndorderId',
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
						var firstMetTableUpgrad = $("#firstMetTableUpgrad").datagrid("getPanel");//先获取panel对象
						firstMetTableUpgrad.panel('setTitle', "第一航段:" + data.rows[0].flightSegment);//再通过panel对象去修改title
					},
					onClickCell : function(rowIndex, rowData) {
						IsCheckFlag = false;
					},
					onSelect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#firstMetTableUpgrad").datagrid("unselectRow", rowIndex);
						}
					},
					onUnselect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#firstMetTableUpgrad").datagrid("selectRow", rowIndex);
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
						width : 75
					}, {
						field : 'ttime',
						title : '到达时间',
						align : 'center',
						formatter : baseFormater,
						width : 75
					}, {
						field : 'seat',
						title : '舱位',
						align : 'center',
						formatter : baseFormater,
						width : 50
					}, {
						field : 'initialSeat',
						title : '原舱位',
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
						field : 'fmoney',
						title : '优惠金额',
						align : 'center',
						formatter : baseNumFormater,
						width : 75
					}, {
						field : 'integralDiscount',
						title : '折扣率',
						align : 'center',
						formatter : baseNumFormater,
						width : 75
					} ] ]
				});
				// 加载第一航段乘客表格
				$('#firstMetTicketTableUpgrad').datagrid({
					url : root + '/order/queryTicketPassengerInfoBySidAndorderId',
					checkOnSelect : false,// 是否选中/取消复选框
					pagination : false,// 是否分页
					autoRowHeight : false,// 定义是否设置基于该行内容的行高度
					fitColumns : false,// 列自适应表格宽度
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
							$("#firstMetTicketTableUpgrad").datagrid("unselectRow", rowIndex);
						}
					},
					onUnselect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#firstMetTicketTableUpgrad").datagrid("selectRow", rowIndex);
						}
					},
					columns : [ [ {
						field : 'name',
						title : '姓名',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'gender',
						title : '性别',
						align : 'center',
						formatter : genderFormater,
					}, {
						field : 'birthday',
						title : '生日',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'country',
						title : '国籍',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'idtype',
						title : '证件类型',
						align : 'center',
						formatter : idtypeFormatter,
					}, {
						field : 'idnumber',
						title : '证件号码',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'passportCountry',
						title : '护照签发国',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'passportValid',
						title : '护照有效期',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'upgradMoney',
						title : '升舱金额',
						align : 'center',
						formatter : baseNumFormater,
					}, {
						field : 'paymoney',
						title : '支付金额',
						align : 'center',
						formatter : baseNumFormater,
					}, {
						field : 'pnr',
						title : 'PNR',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'pnr',
						title : '原PNR',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'eticketno',
						title : '机票号',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'initialTktno',
						title : '原机票号',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'status',
						title : '客票状态',
						align : 'center',
						formatter : statusFormater,
					}, {
						field : 'cstatus',
						title : '退改状态',
						align : 'center',
						formatter : cstatusFormater,
					} ] ]
				});


			} else if(data.rows[0].ticketType =='upgrad' && data.rows[0].initialTicketid!=null && data.rows[0].initialTicketid!='' && data.rows[0].initialTicketid!='null') {
				// 加载第一航段信息表格
				$('#firstMetTableUpgrad').datagrid({
					url : root + '/order/queryTicketSementInfoBySidAndorderId',
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
						var firstMetTableUpgrad = $("#firstMetTableUpgrad").datagrid("getPanel");//先获取panel对象
						firstMetTableUpgrad.panel('setTitle', "第一航段:" + data.rows[0].flightSegment);//再通过panel对象去修改title
					},
					onClickCell : function(rowIndex, rowData) {
						IsCheckFlag = false;
					},
					onSelect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#firstMetTableUpgrad").datagrid("unselectRow", rowIndex);
						}
					},
					onUnselect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#firstMetTableUpgrad").datagrid("selectRow", rowIndex);
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
						width : 75
					}, {
						field : 'ttime',
						title : '到达时间',
						align : 'center',
						formatter : baseFormater,
						width : 75
					}, {
						field : 'seat',
						title : '舱位',
						align : 'center',
						formatter : baseFormater,
						width : 50
					}, {
						field : 'initialSeat',
						title : '原舱位',
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
						field : 'fmoney',
						title : '优惠金额',
						align : 'center',
						formatter : baseNumFormater,
						width : 75
					}, {
						field : 'integralDiscount',
						title : '折扣率',
						align : 'center',
						formatter : baseNumFormater,
						width : 75
					} ] ]
				});
				// 加载第一航段乘客表格
				$('#firstMetTicketTableUpgrad').datagrid({
					url : root + '/order/queryTicketPassengerInfoBySidAndorderId',
					checkOnSelect : false,// 是否选中/取消复选框
					pagination : false,// 是否分页
					autoRowHeight : false,// 定义是否设置基于该行内容的行高度
					fitColumns : false,// 列自适应表格宽度
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
							$("#firstMetTicketTableUpgrad").datagrid("unselectRow", rowIndex);
						}
					},
					onUnselect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#firstMetTicketTableUpgrad").datagrid("selectRow", rowIndex);
						}
					},
					columns : [ [ {
						field : 'name',
						title : '姓名',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'gender',
						title : '性别',
						align : 'center',
						formatter : genderFormater,
					}, {
						field : 'birthday',
						title : '生日',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'country',
						title : '国籍',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'idtype',
						title : '证件类型',
						align : 'center',
						formatter : idtypeFormatter,
					}, {
						field : 'idnumber',
						title : '证件号码',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'passportCountry',
						title : '护照签发国',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'passportValid',
						title : '护照有效期',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'initialFare',
						title : '票面价',
						align : 'center',
						formatter : baseNumFormater,
					}, {
						field : 'initialAirport',
						title : '机建',
						align : 'center',
						formatter : baseNumFormater,
					}, {
						field : 'initialFuel',
						title : '燃油',
						align : 'center',
						formatter : baseNumFormater,
					}, {
						field : 'initialTax',
						title : '国际票总税',
						align : 'center',
						formatter : baseNumFormater,
					}, {
						field : 'upgradMoney',
						title : '升舱金额',
						align : 'center',
						formatter : baseNumFormater,
					}, {
						field : 'money',
						title : '票款总价',
						align : 'center',
						formatter : baseNumFormater,
					}, {
						field : 'paymoney',
						title : '实际票款',
						align : 'center',
						formatter : baseNumFormater,
					}, {
						field : 'pnr',
						title : '原PNR',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'eticketno',
						title : '机票号',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'initialTktno',
						title : '原机票号',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'status',
						title : '客票状态',
						align : 'center',
						formatter : statusFormater,
					}, {
						field : 'cstatus',
						title : '退改状态',
						align : 'center',
						formatter : cstatusFormater,
					} ] ]
				});

			} else {
				// 加载第一航段信息表格
				$('#firstMetTableUpgrad').datagrid({
					url : root + '/order/queryTicketSementInfoBySidAndorderId',
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
						var firstMetTableUpgrad = $("#firstMetTableUpgrad").datagrid("getPanel");//先获取panel对象
						firstMetTableUpgrad.panel('setTitle', "第一航段:" + data.rows[0].flightSegment);//再通过panel对象去修改title
					},
					onClickCell : function(rowIndex, rowData) {
						IsCheckFlag = false;
					},
					onSelect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#firstMetTableUpgrad").datagrid("unselectRow", rowIndex);
						}
					},
					onUnselect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#firstMetTableUpgrad").datagrid("selectRow", rowIndex);
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
						width : 75
					}, {
						field : 'ttime',
						title : '到达时间',
						align : 'center',
						formatter : baseFormater,
						width : 75
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
						field : 'fmoney',
						title : '优惠金额',
						align : 'center',
						formatter : baseNumFormater,
						width : 75
					}, {
						field : 'integralDiscount',
						title : '折扣率',
						align : 'center',
						formatter : baseNumFormater,
						width : 75
					} ] ]
				});
				// 加载第一航段乘客表格
				$('#firstMetTicketTableUpgrad').datagrid({
					url : root + '/order/queryTicketPassengerInfoBySidAndorderId',
					checkOnSelect : false,// 是否选中/取消复选框
					pagination : false,// 是否分页
					autoRowHeight : false,// 定义是否设置基于该行内容的行高度
					fitColumns : false,// 列自适应表格宽度
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
							$("#firstMetTicketTableUpgrad").datagrid("unselectRow", rowIndex);
						}
					},
					onUnselect : function(rowIndex, rowData) {
						if (!IsCheckFlag) {
							IsCheckFlag = true;
							$("#firstMetTicketTableUpgrad").datagrid("selectRow", rowIndex);
						}
					},
					columns : [ [ {
						field : 'name',
						title : '姓名',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'gender',
						title : '性别',
						align : 'center',
						formatter : genderFormater,
					}, {
						field : 'birthday',
						title : '生日',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'country',
						title : '国籍',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'idtype',
						title : '证件类型',
						align : 'center',
						formatter : idtypeFormatter,
					}, {
						field : 'idnumber',
						title : '证件号码',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'passportCountry',
						title : '护照签发国',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'passportValid',
						title : '护照有效期',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'fare',
						title : '票面价',
						align : 'center',
						formatter : baseNumFormater,
					}, {
						field : 'airportTax',
						title : '机建',
						align : 'center',
						formatter : baseNumFormater,
					}, {
						field : 'fuelTax',
						title : '燃油',
						align : 'center',
						formatter : baseNumFormater,
					}, {
						field : 'taxPrice',
						title : '国际票总税',
						align : 'center',
						formatter : baseNumFormater,
					}, {
						field : 'money',
						title : '票款总价',
						align : 'center',
						formatter : baseNumFormater,
					}, {
						field : 'paymoney',
						title : '实际票款',
						align : 'center',
						formatter : baseNumFormater,
					}, {
						field : 'pnr',
						title : 'PNR',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'eticketno',
						title : '机票号',
						align : 'center',
						formatter : baseFormater,
					}, {
						field : 'status',
						title : '客票状态',
						align : 'center',
						formatter : statusFormater,
					}, {
						field : 'cstatus',
						title : '退改状态',
						align : 'center',
						formatter : cstatusFormater,
					} ] ]
				});

			}
		}
	}
	sendAjaxRequest(queryType);

	//判断是否有第二航段，如果有则显示
	var segmentFlag = false;
	try {
		var secondMetTableUpgrad = $("#secondMetTableUpgrad").datagrid("getPanel");
		var secondMetTicketTableUpgrad = $("#secondMetTicketTableUpgrad").datagrid("getPanel");
		secondMetTableUpgrad.panel('close');
		secondMetTicketTableUpgrad.panel('close');
	} catch (e) {
	}
	var queryTypeTwo = {
		url : root + '/order/queryTicketPassengerInfoBySidAndorderId',
		data : {
			'segid' : '2',
			'orderId' : id,
			'orderDate' : orderDate
		},
		callBackFun : function(data) {
			if(data.rows[0].ticketType =='upgrad' && (data.rows[0].initialTicketid==null || data.rows[0].initialTicketid=='' || data.rows[0].initialTicketid=='null')){

				var segmentOptions = {
					url : root + '/order/checkFlightSegment',
					data : "orderId=" + id + "&orderDate=" + orderDate,
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							segmentFlag = data.obj.segmentFlag;
							if(segmentFlag){
								// 加载第二航段表格
								$('#secondMetTableUpgrad').datagrid({
									url : root + '/order/queryTicketSementInfoBySidAndorderId',
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
										var secondMetTableUpgrad = $("#secondMetTableUpgrad").datagrid("getPanel");//先获取panel对象
										secondMetTableUpgrad.panel('setTitle', "第二航段:" + data.rows[0].flightSegment);//再通过panel对象去修改title
										secondMetTableUpgrad.panel('open');
									},
									onClickCell : function(rowIndex, rowData) {
										IsCheckFlag = false;
									},
									onSelect : function(rowIndex, rowData) {
										if (!IsCheckFlag) {
											IsCheckFlag = true;
											$("#secondMetTableUpgrad").datagrid("unselectRow", rowIndex);
										}
									},
									onUnselect : function(rowIndex, rowData) {
										if (!IsCheckFlag) {
											IsCheckFlag = true;
											$("#secondMetTableUpgrad").datagrid("selectRow", rowIndex);
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
										width : 75
									}, {
										field : 'ttime',
										title : '到达时间',
										align : 'center',
										formatter : baseFormater,
										width : 75
									}, {
										field : 'seat',
										title : '舱位',
										align : 'center',
										formatter : baseFormater,
										width : 50
									}, {
										field : 'initialSeat',
										title : '原舱位',
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
										field : 'fmoney',
										title : '优惠金额',
										align : 'center',
										formatter : baseNumFormater,
										width : 75
									}, {
										field : 'integralDiscount',
										title : '折扣率',
										align : 'center',
										formatter : baseNumFormater,
										width : 75
									} ] ]
								});

								// 加载第二航段乘客表格
								$('#secondMetTicketTableUpgrad').datagrid({
									url : root + '/order/queryTicketPassengerInfoBySidAndorderId',
									checkOnSelect : false,// 是否选中/取消复选框
									pagination : false,// 是否分页
									autoRowHeight : false,// 定义是否设置基于该行内容的行高度
									fitColumns : false,// 列自适应表格宽度
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
										var secondMetTicketTableUpgrad = $("#secondMetTicketTableUpgrad").datagrid("getPanel");
										secondMetTicketTableUpgrad.panel('open');
									},
									onClickCell : function(rowIndex, rowData) {
										IsCheckFlag = false;
									},
									onSelect : function(rowIndex, rowData) {
										if (!IsCheckFlag) {
											IsCheckFlag = true;
											$("#secondMetTicketTableUpgrad").datagrid("unselectRow",
												rowIndex);
										}
									},
									onUnselect : function(rowIndex, rowData) {
										if (!IsCheckFlag) {
											IsCheckFlag = true;
											$("#secondMetTicketTableUpgrad").datagrid("selectRow",
												rowIndex);
										}
									},
									columns : [ [ {
										field : 'name',
										title : '姓名',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'sex',
										title : '性别',
										align : 'center',
										formatter : genderFormater,
									}, {
										field : 'birthday',
										title : '生日',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'country',
										title : '国籍',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'idtype',
										title : '证件类型',
										align : 'center',
										formatter : idtypeFormatter,
									}, {
										field : 'idnumber',
										title : '证件号码',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'passportCountry',
										title : '护照签发国',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'passportValid',
										title : '护照有效期',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'upgradMoney',
										title : '升舱金额',
										align : 'center',
										formatter : baseNumFormater,
									}, {
										field : 'paymoney',
										title : '支付金额',
										align : 'center',
										formatter : baseNumFormater,
									}, {
										field : 'pnr',
										title : 'PNR',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'pnr',
										title : '原PNR',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'eticketno',
										title : '机票号',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'initialTktno',
										title : '原机票号',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'status',
										title : '客票状态',
										align : 'center',
										formatter : statusFormater,
									}, {
										field : 'cstatus',
										title : '退改状态',
										align : 'center',
										formatter : cstatusFormater,
									} ] ]
								});
							}
						}
					}
				}
				sendAjaxRequest(segmentOptions);
			} else if (data.rows[0].ticketType =='upgrad' && data.rows[0].initialTicketid!=null && data.rows[0].initialTicketid!=''  && data.rows[0].initialTicketid!='null'){

				var segmentOptions = {
					url : root + '/order/checkFlightSegment',
					data : "orderId=" + id + "&orderDate=" + orderDate,
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							segmentFlag = data.obj.segmentFlag;
							if(segmentFlag){
								// 加载第二航段表格
								$('#secondMetTableUpgrad').datagrid({
									url : root + '/order/queryTicketSementInfoBySidAndorderId',
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
										var secondMetTableUpgrad = $("#secondMetTableUpgrad").datagrid("getPanel");//先获取panel对象
										secondMetTableUpgrad.panel('setTitle', "第二航段:" + data.rows[0].flightSegment);//再通过panel对象去修改title
										secondMetTableUpgrad.panel('open');
									},
									onClickCell : function(rowIndex, rowData) {
										IsCheckFlag = false;
									},
									onSelect : function(rowIndex, rowData) {
										if (!IsCheckFlag) {
											IsCheckFlag = true;
											$("#secondMetTableUpgrad").datagrid("unselectRow", rowIndex);
										}
									},
									onUnselect : function(rowIndex, rowData) {
										if (!IsCheckFlag) {
											IsCheckFlag = true;
											$("#secondMetTableUpgrad").datagrid("selectRow", rowIndex);
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
										width : 75
									}, {
										field : 'ttime',
										title : '到达时间',
										align : 'center',
										formatter : baseFormater,
										width : 75
									}, {
										field : 'seat',
										title : '舱位',
										align : 'center',
										formatter : baseFormater,
										width : 50
									}, {
										field : 'initialSeat',
										title : '原舱位',
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
										field : 'fmoney',
										title : '优惠金额',
										align : 'center',
										formatter : baseNumFormater,
										width : 75
									}, {
										field : 'integralDiscount',
										title : '折扣率',
										align : 'center',
										formatter : baseNumFormater,
										width : 75
									} ] ]
								});

								// 加载第二航段乘客表格
								$('#secondMetTicketTableUpgrad').datagrid({
									url : root + '/order/queryTicketPassengerInfoBySidAndorderId',
									checkOnSelect : false,// 是否选中/取消复选框
									pagination : false,// 是否分页
									autoRowHeight : false,// 定义是否设置基于该行内容的行高度
									fitColumns : false,// 列自适应表格宽度
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
										var secondMetTicketTableUpgrad = $("#secondMetTicketTableUpgrad").datagrid("getPanel");
										secondMetTicketTableUpgrad.panel('open');
									},
									onClickCell : function(rowIndex, rowData) {
										IsCheckFlag = false;
									},
									onSelect : function(rowIndex, rowData) {
										if (!IsCheckFlag) {
											IsCheckFlag = true;
											$("#secondMetTicketTableUpgrad").datagrid("unselectRow",
												rowIndex);
										}
									},
									onUnselect : function(rowIndex, rowData) {
										if (!IsCheckFlag) {
											IsCheckFlag = true;
											$("#secondMetTicketTableUpgrad").datagrid("selectRow",
												rowIndex);
										}
									},
									columns : [ [ {
										field : 'name',
										title : '姓名',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'gender',
										title : '性别',
										align : 'center',
										formatter : genderFormater,
									}, {
										field : 'birthday',
										title : '生日',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'country',
										title : '国籍',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'idtype',
										title : '证件类型',
										align : 'center',
										formatter : idtypeFormatter,
									}, {
										field : 'idnumber',
										title : '证件号码',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'passportCountry',
										title : '护照签发国',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'passportValid',
										title : '护照有效期',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'initialFare',
										title : '票面价',
										align : 'center',
										formatter : baseNumFormater,
									}, {
										field : 'initialAirport',
										title : '机建',
										align : 'center',
										formatter : baseNumFormater,
									}, {
										field : 'initialFuel',
										title : '燃油',
										align : 'center',
										formatter : baseNumFormater,
									}, {
										field : 'initialTax',
										title : '国际票总税',
										align : 'center',
										formatter : baseNumFormater,
									}, {
										field : 'upgradMoney',
										title : '升舱金额',
										align : 'center',
										formatter : baseNumFormater,
									}, {
										field : 'money',
										title : '票款总价',
										align : 'center',
										formatter : baseNumFormater,
									}, {
										field : 'paymoney',
										title : '实际票款',
										align : 'center',
										formatter : baseNumFormater,
									}, {
										field : 'pnr',
										title : 'PNR',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'pnr',
										title : '原PNR',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'eticketno',
										title : '机票号',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'initialTktno',
										title : '原机票号',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'status',
										title : '客票状态',
										align : 'center',
										formatter : statusFormater,
									}, {
										field : 'cstatus',
										title : '退改状态',
										align : 'center',
										formatter : cstatusFormater,
									} ] ]
								});
							}
						}
					}
				}
				sendAjaxRequest(segmentOptions);
			} else {

				var segmentOptions = {
					url : root + '/order/checkFlightSegment',
					data : "orderId=" + id + "&orderDate=" + orderDate,
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							segmentFlag = data.obj.segmentFlag;
							if(segmentFlag){
								// 加载第二航段表格
								$('#secondMetTableUpgrad').datagrid({
									url : root + '/order/queryTicketSementInfoBySidAndorderId',
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
										var secondMetTableUpgrad = $("#secondMetTableUpgrad").datagrid("getPanel");//先获取panel对象
										secondMetTableUpgrad.panel('setTitle', "第二航段:" + data.rows[0].flightSegment);//再通过panel对象去修改title
										secondMetTableUpgrad.panel('open');
									},
									onClickCell : function(rowIndex, rowData) {
										IsCheckFlag = false;
									},
									onSelect : function(rowIndex, rowData) {
										if (!IsCheckFlag) {
											IsCheckFlag = true;
											$("#secondMetTableUpgrad").datagrid("unselectRow", rowIndex);
										}
									},
									onUnselect : function(rowIndex, rowData) {
										if (!IsCheckFlag) {
											IsCheckFlag = true;
											$("#secondMetTableUpgrad").datagrid("selectRow", rowIndex);
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
										width : 75
									}, {
										field : 'ttime',
										title : '到达时间',
										align : 'center',
										formatter : baseFormater,
										width : 75
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
										field : 'fmoney',
										title : '优惠金额',
										align : 'center',
										formatter : baseNumFormater,
										width : 75
									}, {
										field : 'integralDiscount',
										title : '折扣率',
										align : 'center',
										formatter : baseNumFormater,
										width : 75
									} ] ]
								});

								// 加载第二航段乘客表格
								$('#secondMetTicketTableUpgrad').datagrid({
									url : root + '/order/queryTicketPassengerInfoBySidAndorderId',
									checkOnSelect : false,// 是否选中/取消复选框
									pagination : false,// 是否分页
									autoRowHeight : false,// 定义是否设置基于该行内容的行高度
									fitColumns : false,// 列自适应表格宽度
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
										var secondMetTicketTableUpgrad = $("#secondMetTicketTableUpgrad").datagrid("getPanel");
										secondMetTicketTableUpgrad.panel('open');
									},
									onClickCell : function(rowIndex, rowData) {
										IsCheckFlag = false;
									},
									onSelect : function(rowIndex, rowData) {
										if (!IsCheckFlag) {
											IsCheckFlag = true;
											$("#secondMetTicketTableUpgrad").datagrid("unselectRow",
												rowIndex);
										}
									},
									onUnselect : function(rowIndex, rowData) {
										if (!IsCheckFlag) {
											IsCheckFlag = true;
											$("#secondMetTicketTableUpgrad").datagrid("selectRow",
												rowIndex);
										}
									},
									columns : [ [ {
										field : 'name',
										title : '姓名',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'gender',
										title : '性别',
										align : 'center',
										formatter : genderFormater,
									}, {
										field : 'birthday',
										title : '生日',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'country',
										title : '国籍',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'idtype',
										title : '证件类型',
										align : 'center',
										formatter : idtypeFormatter,
									}, {
										field : 'idnumber',
										title : '证件号码',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'passportCountry',
										title : '护照签发国',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'passportValid',
										title : '护照有效期',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'fare',
										title : '票面价',
										align : 'center',
										formatter : baseNumFormater,
									}, {
										field : 'airportTax',
										title : '机建',
										align : 'center',
										formatter : baseNumFormater,
									}, {
										field : 'fuelTax',
										title : '燃油',
										align : 'center',
										formatter : baseNumFormater,
									}, {
										field : 'taxPrice',
										title : '国际票总税',
										align : 'center',
										formatter : baseNumFormater,
									}, {
										field : 'money',
										title : '票款总价',
										align : 'center',
										formatter : baseNumFormater,
									}, {
										field : 'paymoney',
										title : '实际票款',
										align : 'center',
										formatter : baseNumFormater,
									}, {
										field : 'pnr',
										title : 'PNR',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'eticketno',
										title : '机票号',
										align : 'center',
										formatter : baseFormater,
									}, {
										field : 'status',
										title : '客票状态',
										align : 'center',
										formatter : statusFormater,
									}, {
										field : 'cstatus',
										title : '退改状态',
										align : 'center',
										formatter : cstatusFormater,
									} ] ]
								});
							}
						}
					}
				}
				sendAjaxRequest(segmentOptions);
			}

		}
	}
	sendAjaxRequest(queryTypeTwo);

	// 加载保险表格
	$('#insuranceTableUpgrad').datagrid({
		url : root + '/insurance/queryInsuranceInfoList',
		checkOnSelect : false,// 是否选中/取消复选框
		pagination : false,// 是否分页
		autoRowHeight : true,// 定义是否设置基于该行内容的行高度
		fitColumns : false,// 列自适应表格宽度
		striped : false,// 当true时，单元格显示条纹
		rownumbers : true,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		nowrap : false,// 是否在一行内显示
		queryParams : {
			'ordercode' : orderCode,
			"startdate" : $("#startDate").datebox("getValue"),
			"enddate" : $("#endDate").datebox("getValue")
		},
		onLoadSuccess : function(data) {
			var insuranceTableUpgrad = $("#insuranceTableUpgrad").datagrid("getPanel");
			if (data.rows.length == 0) {
				insuranceTableUpgrad.panel('close');
			}else {
				insuranceTableUpgrad.panel('open');
			}
		},
		onClickCell : function(rowIndex, rowData) {
			IsCheckFlag = false;
		},
		onSelect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#insuranceTableUpgrad").datagrid("unselectRow", rowIndex);
			}
		},
		onUnselect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#insuranceTableUpgrad").datagrid("selectRow", rowIndex);
			}
		},
		columns : [ [ {
			field : 'buyTotalPrice',
			title : '保费',
			align : 'center',
			formatter : baseNumFormater,
			width : 50
		}, {
			field : 'repay',
			title : '保额',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'insNo',
			title : '保单号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'status',
			title : '购保状态',
			align : 'center',
			formatter : insuranceStatusFormater,
			width : 75
		}, {
			field : 'insuranceProductName',
			title : '保险产品',
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
			field : 'insuredName',
			title : '受益人姓名',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'insuredMobile',
			title : '受益人手机',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'createDate',
			title : '购保日期',
			align : 'center',
			formatter : dateTimeFormater,
			width : 150
		} ] ]
	});

	// 加载行程单表格
	$('#travelMailTableUpgrad').datagrid({
		url : root + '/delivery/queryTravelMailList',
		checkOnSelect : false,// 是否选中/取消复选框
		pagination : false,// 是否分页
		autoRowHeight : true,// 定义是否设置基于该行内容的行高度
		fitColumns : false,// 列自适应表格宽度
		striped : false,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		nowrap : false,// 是否在一行内显示
		queryParams : {
			"orderCode" : orderCode,
			"page" : 1,
			"rows" : 20
		},
		onLoadSuccess : function(data) {
			var travelMailTableUpgrad = $("#travelMailTableUpgrad").datagrid("getPanel");
			if (data.rows.length == 0) {
				travelMailTableUpgrad.panel('close');
			}else {
				travelMailTableUpgrad.panel('open');
			}
		},
		onClickCell : function(rowIndex, rowData) {
			IsCheckFlag = false;
		},
		onSelect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#travelMailTableUpgrad").datagrid("unselectRow", rowIndex);
			}
		},
		onUnselect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#travelMailTableUpgrad").datagrid("selectRow", rowIndex);
			}
		},
		columns : [ [ {
			field : 'addressee',
			title : '收件人',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'phone',
			title : '电话',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'address',
			title : '地址',
			align : 'center',
			formatter : baseFormater,
			width : 300
		}, {
			field : 'applyDate',
			title : '申请日期',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'applyType',
			title : '邮寄方式',
			align : 'center',
			formatter : function(value, row, index) {
				if (value == 1) {
					return '自取';
				} else if (value == 2) {
					return '邮寄';
				}
			},
			width : 100
		}, {
			field : 'emailStatus',
			title : '邮寄状态',
			align : 'center',
			formatter : function(value, row, index) {
				if (value == 1) {
					return '未邮寄';
				} else if (value == 2) {
					return '已邮寄';
				}
			},
			width : 100
		}, {
			field : 'dcDate',
			title : '邮寄日期',
			align : 'center',
			formatter : baseFormater,
			width : 100
		} ] ]
	});

	// 加载订单操作日志表格
	$('#logInsertTableUpgrad').datagrid({
		url : root + '/refund/queryOrderProcessingList',
		checkOnSelect : false,// 是否选中/取消复选框
		pagination : false,// 是否分页
		autoRowHeight : true,// 定义是否设置基于该行内容的行高度
		fitColumns : true,// 列自适应表格宽度
		striped : false,// 当true时，单元格显示条纹
		rownumbers : true,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		nowrap : false,// 是否在一行内显示
		queryParams : {
			'orderid' : id
		},
		onLoadSuccess : function(data) {
			var logInsertTableUpgrad = $("#logInsertTableUpgrad").datagrid("getPanel");
			if (data.rows.length == 0) {
				logInsertTableUpgrad.panel('close');
			}else {
				logInsertTableUpgrad.panel('open');
			}
		},
		onClickCell : function(rowIndex, rowData) {
			IsCheckFlag = false;
		},
		onSelect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#logInsertTableUpgrad").datagrid("unselectRow", rowIndex);
			}
		},
		onUnselect : function(rowIndex, rowData) {
			if (!IsCheckFlag) {
				IsCheckFlag = true;
				$("#logInsertTableUpgrad").datagrid("selectRow", rowIndex);
			}
		},
		columns : [ [ {
			field : 'creatime',
			title : '处理时间',
			align : 'center',
			formatter : baseFormater,
			width : 100
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




