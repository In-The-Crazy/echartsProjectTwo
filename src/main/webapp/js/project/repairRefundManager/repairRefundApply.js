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
	$('#startDate').datebox({
		required : false
	});
	$('#endDate').datebox({
		required : false
	});

	var today = new Date();
	var first = new Date();
	first.setDate(1);
	today = today.pattern("yyyy-MM-dd");
	first = first.pattern("yyyy-MM-dd");
	$('#startDate').datebox('setValue',first);
	$('#endDate').datebox('setValue',today);
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
	$('#refundsApply').dialog('close')
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var sdate = $('#startDate').datebox('getValue');
	var edate = $('#endDate').datebox('getValue');
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		sdate = sdate.replace(/-/g, '');
		edate = edate.replace(/-/g, '');
		if (parseInt(sdate) > parseInt(edate)) {
			$.messager.alert('错误提示', '订单开始日期不能大于订单截止日期', 'error');
			return false;
		}
	}

	var params = serializeJson("conditionForm");

	// 加载表格
	$('#mistakeApplyTable').datagrid({
		url : root + '/repairRefund/queryRefundList',
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
			field : 'id',
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
				console.log(channels);
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
			width : 200
		}, {
			field : 'order_code',
			title : '订单编号',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'apply_no',
			title : '退款申请单号',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'create_datetime',
			title : '订单日期',
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
			field : 'bank_code',
			title : '银行订单号',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'pay_type',
			title : '支付方式',
			align : 'center',
			formatter : payTypeFormater,
			width : 100
		}, {
			field : 'pay_amounts',
			title : '支付金额',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'refundable',
			title : '可退金额',
			align : 'center',
			formatter : refundFormater,
			width : 100
		}, {
			field : 'passenger',
			title : '联系人姓名',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'phone',
			title : '联系人电话',
			align : 'center',
			formatter : baseFormater,
			width : 120
		}, {
			field : 'order_status',
			title : '订单状态',
			align : 'center',
			formatter : function(value,rows,index){
				if(value=='1'){
	   				stext='已订座';
	   			}else if(value=='2'){
	   				stext='已出票';
	   			}else if(value=='0'){
	   				stext='预订失败';
	   			}else if(value=='4'){
	   				stext='已取消';
	   			}
	   			return stext;
			},
			width : 75
		}, {
			field : 'paystatus',
			title : '支付状态',
			align : 'center',
			formatter :function (value, row, index) {
				if (value == "1") {
					return "支付中";
				}
				if (value == "2") {
					return "支付成功";
				}
				if (value == "3") {
					return "支付失败";
				}
			},
			width : 75
		}, {
			field : 'refund_status',
			title : '退款状态',
			align : 'center',
			formatter : function(value, row, index) {
				if (value == 1) {
					return '已申请'
				} else if (value == 2) {
					return '一审通过'
				} else if (value == 3) {
					return '一审拒绝'
				} else if (value == 4) {
					return '二审通过'
				} else if (value == 5) {
					return '二审拒绝'
				} else if (value == 6) {
					return '退款完成'
				}
			},
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
	var _id = "'" + row.refund_id + "'";
	var _tableName = "'" + row.table_name + "'";
	var detail = "";
	detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ','+_tableName+',"info")>查看详情</a>';
	return detail;
};

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
function remarkSytler(value, row, index) {
	if (isEmpty(row.refund_remark)) {
		return "color: red;"
	}
	return "";
};
/** --------查看详情 ------ */
function getInfo(id, tableName, flag) {
	var url = root+'/repairRefund/refundInfo';
	var data = {'refundId' : id,'tableName':tableName};
	var options = {
		url : url,
		data : data,
		callBackFun : function(data) {
			console.log(data);
			if (flag == 'info') {
				$("#refundId").val(id);
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
								field : 'paystatus',
								title : '支付状态',
								align : 'center',
								formatter : paystatusFormater,
								width : 75
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
								title : '退款申请单号',
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
								formatter : baseFormater,
								width : 100
							}, {
								field : 'refund_amounts_actual',
								title : '退款金额',
								align : 'center',
								formatter : baseFormater,
								width : 150
							},{
								field : 'refundable',
								title : '可退款金额',
								align : 'center',
								formatter : baseNumFormater,
								width : 150
							} ] ]
						});
				}
			}
	}
	sendAjaxRequest(options);
}

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

/** -------- 差错退款申请 ------ */
function apply() {
	var selecteds = $('#mistakeApplyTable').datagrid('getSelections');
	if (selecteds.length == 0) {
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	var selectedRow = $('#mistakeApplyTable').datagrid('getSelections')[0];
	console.log("可退金额===="+selectedRow.refundable);
	var money = selectedRow.refundable;
	$('#refundsApplyForm').form('clear');
	$('#set_money').val(money);
	$('#refundsApply').dialog('open');
}

function refundsApply() {
	var selectedRow = $('#mistakeApplyTable').datagrid('getSelections')[0];
	var params = serializeJson("refundsApplyForm");
	var pmoney = params.refundsMoney;
	var money = params.set_money;
	console.log("可退金额===="+params.set_money);
	var regPos = /^\d+(\.\d+)?$/; // 非负浮点数
	var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
	if (!regPos.test(pmoney) || regNeg.test(pmoney)) {
		$.messager.alert('错误提示', '请输入正确退补款金额!', 'error');
		return false;
	}
	if (money <= 0) {
		$.messager.alert('错误提示', '可退款金额为0!', 'error');
		return false;
	}
	if (pmoney * 1 > money) {
		$.messager.alert('错误提示', '请填写小于可退补款金额的数!', 'error');
		return false;
	}

	var add = {
		url : root + '/repairRefund/apply',
		type : 'POST',
		data : {
			ticketid : selectedRow.ticketid,
			payid : selectedRow.payid,
			applyOp : selectedRow.apply_op,
			channel : selectedRow.channel,
			applyNo : selectedRow.apply_no,
			orderCode : selectedRow.order_code,
			pnr : selectedRow.pnr,
			bankCode : selectedRow.bank_code,
			payType : selectedRow.pay_type,
			payAmounts : selectedRow.pay_amounts,
			refundAmounts : selectedRow.refundable,
			passenger : selectedRow.passenger,
			phone : selectedRow.phone,
			applyRemark : selectedRow.apply_remark,
			refundAmountsActual : pmoney,
			eticketno : selectedRow.eticketno,
			applyRemark : params.applyRemark,
			orderid : selectedRow.orderid
		},
		callBackFun : function(data) {
			console.log(data)
			if (data.isSuccessOrfail == "SUCCESS") {
				$('#refundsApply').dialog('close');
				$('#refundInfo').dialog('close');
				reloadTable("mistakeApplyTable");
				console.log("申请成功");
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
