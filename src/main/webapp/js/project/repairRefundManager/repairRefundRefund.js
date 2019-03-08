var channels;
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
	$('#applyDateStart').datebox({
		required : false
	});
	$('#applyDateEnd').datebox({
		required : false
	});
	$('#auditDateStart').datebox({
		required : false
	});
	$('#auditDateEnd').datebox({
		required : false
	});
	
	$('#refundDateStart').datebox({
		required : false
	});
	$('#refundDateEnd').datebox({
		required : false
	});
	
	var today = new Date();
	var first = new Date();
	first.setDate(1);
	today = today.pattern("yyyy-MM-dd");
	first = first.pattern("yyyy-MM-dd");
	$('#applyDateStart').datebox('setValue',first);
	$('#applyDateEnd').datebox('setValue',today);
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_info = {
		id : "orderInfo",
		title : "机票订单详细信息"
	};

	var dialog_set = {
		id : "refundsApply",
		title : "申请补退款"
	};

	// 查看窗口
	initDialog(dialog_info);
	initDialog(dialog_set);
	$('#refundPass').dialog('close')
	$('#refundPassUnderLine').dialog('close')
	$('#refundRefuse').dialog('close')
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var applyDateStart = $('#applyDateStart').datebox('getValue');
	var applyDateEnd = $('#applyDateEnd').datebox('getValue');
	if (applyDateStart != null && applyDateStart != "" && applyDateEnd != null && applyDateEnd != "") {
		applyDateStart = applyDateStart.replace(/-/g, '');
		applyDateEnd = applyDateEnd.replace(/-/g, '');
		if (parseInt(applyDateStart) > parseInt(applyDateEnd)) {
			$.messager.alert('错误提示', '申请开始日期不能大于申请截止日期', 'error');
			return false;
		}
	}
	
	var auditDateStart = $('#auditDateStart').datebox('getValue');
	var auditDateEnd = $('#auditDateEnd').datebox('getValue');
	if (auditDateStart != null && auditDateStart != "" && auditDateEnd != null && auditDateEnd != "") {
		auditDateStart = auditDateStart.replace(/-/g, '');
		auditDateEnd = auditDateEnd.replace(/-/g, '');
		if (parseInt(auditDateStart) > parseInt(auditDateEnd)) {
			$.messager.alert('错误提示', '申请开始日期不能大于申请截止日期', 'error');
			return false;
		}
	}
	
	var refundDateStart = $('#refundDateStart').datebox('getValue');
	var refundDateEnd = $('#refundDateEnd').datebox('getValue');
	if (refundDateStart != null && refundDateStart != "" && refundDateEnd != null && refundDateEnd != "") {
		refundDateStart = refundDateStart.replace(/-/g, '');
		refundDateEnd = refundDateEnd.replace(/-/g, '');
		if (parseInt(refundDateStart) > parseInt(refundDateEnd)) {
			$.messager.alert('错误提示', '申请开始日期不能大于申请截止日期', 'error');
			return false;
		}
	}

	var params = serializeJson("conditionForm");

	// 加载表格
	$('#repairApplyTable').datagrid({
		url : root + '/repairRefund/queryRepairRefund',
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
			console.log(data);
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
			field : 'refundId',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'channel',
			title : '渠道编号',
			align : 'center',
			formatter : function(value, row, index){
				console.log(value);
				var valueArr=value.split(",");
				console.log(valueArr);
				var channelArr=[];
				for (var i = 0; i < channels.length; i++) {
					console.log(channels);
					for(var j=0;j<valueArr.length;j++){
						if(channels[i].chalCode == valueArr[j]){
							channelArr.push(channels[i].chalName);
							continue;
						}
					}
					
				}
				return channelArr.join(",");
			},
			width : 100
		}, {
			field : 'orderCode',
			title : '订单编号',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'applyNo',
			title : '补退款申请单号',
			align : 'center',
			formatter : baseFormater,
			width : 220
		}, {
			field : 'pnr',
			title : 'PNR',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'bankCode',
			title : '银行订单号',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'payType',
			title : '支付方式',
			align : 'center',
			formatter : payTypeFormater,
			width : 100
		}, {
			field : 'payAmounts',
			title : '支付金额',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'refundAmounts',
			title : '应退金额',
			align : 'center',
			formatter : refundFormater,
			width : 100
		}, {
			field : 'passenger',
			title : '乘客姓名',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'applyOp',
			title : '申请人',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'phone',
			title : '申请人电话',
			align : 'center',
			formatter : baseFormater,
			width : 120
		}, {
			field : 'applyDate',
			title : '申请时间',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'applyRemark',
			title : '申请备注',
			align : 'center',
			formatter : baseFormater,
			width : 120
		}, {
			field : 'refundStatus',
			title : '退款状态',
			align : 'center',
			formatter : statusFormater,
			width : 120
		},{
			field : 'opt',
			title : '操作',
			align : 'center',
			formatter : optFormater,
			width : 150
		} ] ]
	});
}

/** --------退款金额处理 ------ */
function refundFormater(value, row, index) {
	if (isEmpty(value)) {
		return "0";
	}
	return value;
};
function optFormater(value, row, index) {
	var _id = "'" + row.refundId + "'";
	var detail = "";
	if(row.refundStatus == "2" || row.refundStatus == "8"){
		detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"refund")>补退款退款</a>';
	}else{
		detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"info")>查看详情</a>';
	}
	return detail;
};
function statusFormater(value, row, index) {
	if (value == 1) {
		return '已申请'
	} else if (value == 2) {
		return '已审核'
	} else if (value == 3) {
		return '已拒绝'
	} else if (value == 4) {
		return '二审通过'
	} else if (value == 5) {
		return '二审拒绝'
	} else if (value == 6) {
		return '已退款'
	}
};

/** --------查看详情 ------ */
function getInfo(id, flag) {
	var url = root+'/repairRefund/repairRefundInfo';
	var data = {'refundId' : id};
	if(flag == "refund"){
		$('#buttons').show();
	}
	if(flag == "info"){
		$('#buttons').hide();
	}
	var options = {
		url : url,
		data : data,
		callBackFun : function(data) {
			console.log("=========="+data);
				$("#refundId").val(id);
				$("#roderPrice").val(data.rows[0].refund_amounts);
				// 打开订单详情页面
				$('#refundInfo').dialog('open');
				var IsCheckFlag = true; // 标示是否选中行的，true - 是 , false - 否
				// 加载订单详情表格
				$('#orderInfoTable').datagrid(
						{
							data : data.rows,
							checkOnSelect : false,// 是否选中/取消复选框
							pagination : false,// 是否分页
							autoRowHeight : false,// 定义是否设置基于该行内容的行高度
							fitColumns : true,// 列自适应表格宽度
							striped : false,// 当true时，单元格显示条纹
							rownumbers : false,// 是否显示行号
							singleSelect : true,// 是否只能选中一条
							onLoadSuccess : function(data) {
								console.log("0000");
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
								field : 'order_code',
								title : '订单编号',
								align : 'center',
								formatter : baseFormater,
								width : 75
							}, {
								field : 'channel',
								title : '渠道编号',
								align : 'center',
								formatter : function(value, row, index){
									console.log(value);
									var valueArr=value.split(",");
									console.log(valueArr);
									var channelArr=[];
									for (var i = 0; i < channels.length; i++) {
										console.log(channels);
										for(var j=0;j<valueArr.length;j++){
											if(channels[i].chalId == valueArr[j]){
												channelArr.push(channels[i].chalName);
												continue;
											}
										}
										
									}
									return channelArr.join(",");
								},
								width : 75
							}, {
								field : 'pnr',
								title : 'PNR',
								align : 'center',
								formatter : baseFormater,
								width : 100
							}, {
								field : 'passenger',
								title : '乘客姓名',
								align : 'center',
								formatter : baseFormater,
								width : 75
							}, {
								field : 'phone',
								title : '乘客电话',
								align : 'center',
								formatter : baseFormater,
								width : 75
							} ] ]
						});

				$('#paymentTable').datagrid(
						{
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
									$("#paymentTable").datagrid(
											"unselectRow", rowIndex);
								}
							},
							onUnselect : function(rowIndex, rowData) {
								if (!IsCheckFlag) {
									IsCheckFlag = true;
									$("#paymentTable").datagrid(
											"selectRow", rowIndex);
								}
							},
							columns : [ [ {
								field : 'bank_code',
								title : '银行订单编号',
								align : 'center',
								formatter : baseFormater,
								width : 75
							}, {
								field : 'pay_type',
								title : '支付方式',
								align : 'center',
								formatter : payTypeFormater,
								width : 75
							}, {
								field : 'pay_amounts',
								title : '支付金额',
								align : 'center',
								formatter : baseFormater,
								width : 100
							}, {
								field : 'payStatus',
								title : '支付状态',
								align : 'center',
								formatter : function(value, row, index) {
									return "支付成功";
								},
								width : 100
							}] ]
						});

				$('#refundTable').datagrid(
						{
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
									$("#refundTable").datagrid(
											"unselectRow", rowIndex);
								}
							},
							onUnselect : function(rowIndex, rowData) {
								if (!IsCheckFlag) {
									IsCheckFlag = true;
									$("#refundTable").datagrid(
											"selectRow", rowIndex);
								}
							},
							columns : [ [ {
								field : 'apply_no',
								title : '补退款申请单号',
								align : 'center',
								formatter : baseFormater,
								width : 150
							},{
								field : 'apply_date',
								title : '申请时间',
								align : 'center',
								formatter : dateFormater,
								width : 100
							},  {
								field : 'apply_remark',
								title : '退款原因',
								align : 'center',
								formatter : baseFormater,
								width : 100
							}, {
								field : 'refund_amounts',
								title : '应退金额',
								align : 'center',
								formatter : baseFormater,
								width : 150
							},  {
								field : 'apply_op',
								title : '申请人',
								align : 'center',
								formatter : baseFormater,
								width : 100
							} ] ]
						});
				$('#auditTable').datagrid(
						{
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
							onDblClickCell : EditCounterFee,
							onDblClickCell : editRemark,
							onSelect : function(rowIndex, rowData) {
								if (!IsCheckFlag) {
									IsCheckFlag = true;
									$("#auditTable").datagrid(
											"unselectRow", rowIndex);
								}
							},
							onUnselect : function(rowIndex, rowData) {
								if (!IsCheckFlag) {
									IsCheckFlag = true;
									$("#auditTable").datagrid("selectRow",
											rowIndex);
								}
							},
							columns : [ [{
								field : 'audit_date',
								title : '审核时间',
								align : 'center',
								formatter : dateTimeFormater,
								width : 150
							}, {
								field : 'audit_op',
								title : '审核人',
								align : 'center',
								formatter : baseFormater,
								width : 75
							} ,{
								field : 'audit_remark',
								title : '审核备注',
								align : 'center',
								formatter : dateTimeFormater,
								width : 75
							},{
								field : 'refund_amounts_op',
								title : '退款人',
								align : 'center',
								formatter : baseFormater,
								width : 100
							},{
								field : 'refund_amounts_remark',
								title : '退款备注',
								align : 'center',
								styler : remarkSytler,
								formatter : remarkFormater,
								editor : 'text',
								width : 100
							}, {
								field : 'refund_amounts_actual',
								title : '退款金额',
								align : 'center',
								styler : remarkSytler,
								formatter : function(value, row, index){
									if (isEmpty(value)&&!isEmpty(row.refund_amounts)) {
										return row.refund_amounts;
									}else{
										if(isEmpty(row.refund_amounts)){
											return "双击录入"
										}
										return value;
									}
								},
								editor : 'text',
								width : 150
							} ] ]
						});
				$('#refundInfoTable').datagrid(
						{
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
									$("#auditTable").datagrid(
											"unselectRow", rowIndex);
								}
							},
							onUnselect : function(rowIndex, rowData) {
								if (!IsCheckFlag) {
									IsCheckFlag = true;
									$("#auditTable").datagrid("selectRow",
											rowIndex);
								}
							},
							columns : [ [{
								field : 'apply_no_t',
								title : '退款申请单号',
								align : 'center',
								formatter : dateTimeFormater,
								width : 150
							},{
								field : 'apply_date_t',
								title : '申请时间',
								align : 'center',
								formatter : dateTimeFormater,
								width : 75
							},{
								field : 'apply_remark_t',
								title : '申请备注',
								align : 'center',
								formatter : baseFormater,
								width : 100
							},{
								field : 'refund_amounts_t',
								title : '应退金额',
								align : 'center',
								formatter : remarkFormater,
								width : 100
							}, {
								field : 'refund_amounts_actual_t',
								title : '退款金额',
								align : 'center',
								formatter : remarkFormater,
								width : 150
							}, {
								field : 'refund_status_t',
								title : '退款状态',
								align : 'center',
								formatter : statusFormater,
								width : 75
							} ] ]
						});
				}
			}
	sendAjaxRequest(options);
}

/** --------加载树形 ------ */
function ajaxTree() {
	//渠道设置
	var channel={
		url : root+'/common/channels',
		callBackFun : function(data) {
			channels = data.rows;
			console.log("pindao");
			var treeList = rowsListAddAll(data.rows, {
				"checked" : true,
				"children" : null,
				"chalId" : "",
				"chalName" : "全部"
			});
			//渠道设置
			$('#channel').combobox({
				data:treeList,
				valueField:'chalId',
				editable : false,
				textField:'chalName'
			});
		}
	};
	sendAjaxRequest(channel);
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#queryOrderTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function orderCodeFormater(value, row, index) {
	var _id = "'" + row.orderId + "'";
	var _orderDate = "'" + row.creadate.split(' ')[0].replace(/-/g, '') + "'";
	var detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',' + _orderDate + ')>'
			+ value + '</a>';
	return detail;
};
function remarkSytler(value, row, index) {
	if (isEmpty(row.refund_remark)) {
		return "color: red;"
	}
	return "";
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

/** -------- 补退款退款通过 ------ */
function refundPass(i) {
	var selecteds = $('#repairApplyTable').datagrid('getSelections');
	if (selecteds.length == 0) {
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if(selecteds[0].refundStatus != 2){
		$.messager.alert('错误提示', '请选择已审核审核的记录!', 'error');
		return false;
	}
	$('#refundsRefuseForm').form('clear');
	if (i == '1') {
		$('#refundPass').dialog('open');
	}else {
		$('#refundPassUnderLine').dialog('open');
	}
	
}
///** -------- 差错退款审核 ------ */
function setPass(status){
	endEditing();
	var passFlag=true;
	var params=new Object();
	var rows = $('#auditTable').datagrid('getData').rows;
	params.refundId=$("#refundId").val();
	var price=$("#roderPrice").val();
	var actualPrice;
	if(status=="6"){
		text = "是否确认完成补退款？";
		params.refundStatus="6";
		$.each(rows, function(i, field){
			if (field.refund_amounts_remark == "双击录入" || isEmpty(field.refund_amounts_remark)) {
				params.refundAmountsRemark="";
			}else{
				params.refundAmountsRemark=field.refund_amounts_remark;
			}
			if (field.refund_amounts_actual == "双击录入" || isEmpty(field.refund_amounts_actual)) {
				params.refundAmountsActual="";
			}else{
				actualPrice=field.refund_amounts_actual
				if(parseInt(actualPrice)>parseInt(price)){  
					params.refundAmountsActual=field.refund_amounts;
				}else{
					params.refundAmountsActual=actualPrice;
				} 
			}
		});
		if(!passFlag){
			return false;
		}
		console.log(params);
		$.messager.confirm('补退款退款提示', text, function(r) {
			
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url =root + '/repairRefund/refundPass';
				var options = {
					url : url,
					data : params,
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("repairApplyTable");
							$('#refundInfo').dialog('close');
							
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}else if(status=="1"){
		text = "确认拒绝补退款退款？";
		params.refundStatus="1";
		$.each(rows, function(i, field){
			if (field.refund_amounts_remark == "双击录入" || isEmpty(field.refund_amounts_remark)) {
				$.messager.alert('错误提示', '退款备注不能为空!', 'error');
				passFlag=false;
				return false;
			}else{
				params.refundAmountsRemark=field.refund_amounts_remark;
			}
			
		});
		if(!passFlag){
			return false;
		}
		console.log(params);
		$.messager.confirm('补退款退款提示', text, function(r) {
			
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url =root + '/repairRefund/refundRefuse';
				var options = {
					url : url,
					data : params,
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("repairApplyTable");
							$('#refundInfo').dialog('close');
							
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}else{
		text = "确认拒绝补退款退款？";
		params.refundStatus="7";
		$.each(rows, function(i, field){
			if (field.refund_amounts_remark == "双击录入" || isEmpty(field.refund_amounts_remark)) {
				params.refundAmountsRemark="";
			}else{
				params.refundAmountsRemark=field.refund_amounts_remark;
			}
			
		});
		if(!passFlag){
			return false;
		}
		console.log(params);
		$.messager.confirm('补退款退款提示', text, function(r) {
			
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url =root + '/repairRefund/refundPass';
				var options = {
					url : url,
					data : params,
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("repairApplyTable");
							$('#refundInfo').dialog('close');
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
	
	
}
function refundsPass(i) {
	var selectedRow = $('#repairApplyTable').datagrid('getSelections')[0];
	var params = serializeJson("refundsPassForm");
	var add = {
		url : root + '/repairRefund/refundPass',
		type : 'POST',
		data : {
			refundId : selectedRow.refundId,
			refundAmountsRemark : params.refundAmountsRemark,
			refundStatus:i
		},
		callBackFun : function(data) {
			console.log(data)
			if (data.isSuccessOrfail == "SUCCESS") {
				$('#refundPass').dialog('close');
				ajaxTable();
			} else {

			}
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}

/** -------- 补退款审核拒绝 ------ */
function refundRefuse() {
	var selecteds = $('#repairApplyTable').datagrid('getSelections');
	if (selecteds.length == 0) {
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if(selecteds[0].refundStatus != 2){
		$.messager.alert('错误提示', '请选择已审核审核的记录!', 'error');
		return false;
	}
	$('#refundsRefuseForm').form('clear');
	$('#refundRefuse').dialog('open');
}

function refundsRefuse() {
	var selectedRow = $('#repairApplyTable').datagrid('getSelections')[0];
	var params = serializeJson("refundsRefuseForm");
	var add = {
		url : root + '/repairRefund/refundRefuse',
		type : 'POST',
		data : {
			refundId : selectedRow.refundId,
			refundAmountsRemark : params.refundAmountsRemark,
		},
		callBackFun : function(data) {
			console.log(data)
			if (data.isSuccessOrfail == "SUCCESS") {
				$('#refundRefuse').dialog('close');
				ajaxTable();
			} else {

			}
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
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
function EditCounterFee(index, field, value) {// 双击单元格开始编辑
	if (endEditing()) {
		$('#auditTable').datagrid('selectRow', index).datagrid('editCell',
				{
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
var editIndex = undefined;
function endEditing() {// 结束编辑
	if (editIndex == undefined) {
		return true
	}
	if ($('#auditTable').datagrid('validateRow', editIndex)) {
		$('#auditTable').datagrid('endEdit', editIndex);
		editIndex = undefined;
		return true;
	} else {
		return false;
	}
}

function editRemark(index, field, value) {// 双击单元格开始编辑
	if (endEditing()) {
		$('#auditTable').datagrid('selectRow', index).datagrid('editCell',
				{
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
function queryOrderReset() {
	$('#conditionForm').form('reset');
	$('#status').combobox('select', '已完成');
	$('#sign').val('QUERY_ALL');
	initDatebox();
}
