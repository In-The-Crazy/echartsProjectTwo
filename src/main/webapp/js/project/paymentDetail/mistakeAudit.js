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
	ajaxTable(true);
	
});

/** --------加载日历选择 ------ */
function initDatebox() {
	$('#applyDateBegin').datebox({
		required : true
	});
	$('#applyDateEnd').datebox({
		required : true
	});
	$('#refundDateBegin').datebox({
		required : false
	});
	$('#refundDateEnd').datebox({
		required : false
	});
	$('#auditDateBegin').datebox({
		required : false
	});
	$('#auditDateEnd').datebox({
		required : false
	});
	var today = new Date();
	var first = new Date();
	first.setDate(1);
	today = today.pattern("yyyy-MM-dd");
	first = first.pattern("yyyy-MM-dd");
	$('#applyDateBegin').datebox('setValue',first);
	$('#applyDateEnd').datebox('setValue',today);
}

/** --------初始化页面模块 ------ */
function initPage() {
}

/** -------- 验证表单 ------ */
function validateForm(){
	var sdate = $('#applyDateBegin').datebox('getValue');
	var edate = $('#applyDateEnd').datebox('getValue');
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		sdate = sdate.replace(/-/g, '');
		edate = edate.replace(/-/g, '');
		if (parseInt(sdate) > parseInt(edate)) {
			$.messager.alert('错误提示', '申请开始日期不能大于申请结束日期', 'error');
			return false;
		}
	}
	var asdate = $('#auditDateBegin').datebox('getValue');
	var aedate = $('#auditDateEnd').datebox('getValue');
	if (asdate != null && asdate != "" && aedate != null && aedate != "") {
		asdate = asdate.replace(/-/g, '');
		aedate = aedate.replace(/-/g, '');
		if (parseInt(asdate) > parseInt(aedate)) {
			$.messager.alert('错误提示', '审核开始日期不能大于审核结束日期', 'error');
			return false;
		}
	}
	var bsdate = $('#refundDateBegin').datebox('getValue');
	var bedate = $('#refundDateEnd').datebox('getValue');
	if (bsdate != null && bsdate != "" && bedate != null && bedate != "") {
		bsdate = bsdate.replace(/-/g, '');
		bedate = aedate.replace(/-/g, '');
		if (parseInt(bsdate) > parseInt(bedate)) {
			$.messager.alert('错误提示', '退款开始日期不能大于退款结束日期', 'error');
			return false;
		}
	}
	
	//验证表单参数
	var sflag = $("#conditionForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("conditionForm");
	return params;
}

/** --------加载表格数据 ------ */
function ajaxTable(flag) {
	var params = validateForm();
	if(!params){
		return false;
	}
	
	// 加载表格
	$('#mistakeAuditTable').datagrid({
		url : root+ '/errorRefunds/queryRefunds',
		toolbar : "#toolbar",
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
		onBeforeLoad : function(){
			
		},
		onLoadSuccess : function(data) {
			console.log(data);
		},
		columns : [ [ {
			field : 'rownumbers',
			title : '',
			align : 'center',
			styler : rownumSytler,
			formatter : rownumFormater,
			width : 25
		}, {
			field : 'refund_id',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'payid',
			hidden : true
		}, {
			field : 'order_code',
			title : '订单编号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		},{
			field : 'apply_no',
			title : '差错退款申请单号',
			align : 'center',
			formatter : baseFormater,
			width : 220
		},{
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
			field : 'pnr',
			title : 'PNR',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},{
			field : 'pay_type',
			title : '支付方式',
			align : 'center',
			formatter : payTypeFormater,
			width : 100
		},{
			field : 'refund_amounts',
			title : '应退金额',
			align : 'center',
			formatter : baseFormater,
			width : 100
		},{
			field : 'refund_amounts_actual',
			title : '退款金额',
			align : 'center',
			formatter : baseFormater,
			width : 100
		},{
			field : 'refund_amounts_date',
			title : '退款日期',
			align : 'center',
			formatter : baseFormater,
			width : 150
		},{
			field : 'refund_status',
			title : '退款状态',
			align : 'center',
			formatter : function(value,rows,index){
				if(value=='1'){
	   				stext='已申请';
	   			}else if(value=='2'){
	   				stext='一审通过';
	   			}else if(value=='3'){
	   				stext='一审拒绝';
	   			}else if(value=='4'){
	   				stext='二审通过';
	   			}else if(value=='5'){
	   				stext='二审拒绝';
	   			}else if(value=='6'){
	   				stext='退款完成';
	   			}else if(value=='7'){
	   				stext='线下退款完成';
	   			}
	   			return stext;
			},
			width : 100
		},{
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
			width : 150
		},{
			field : 'paybillno',
			title : '银行订单号',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'paymoney',
			title : '支付金额',
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
			field : 'apply_date',
			title : '申请时间',
			align : 'center',
			formatter : dateTimeFormater,
			width : 150
		}, {
			field : 'apply_op',
			title : '申请人',
			align : 'center',
			formatter : baseFormater,
			width :100
		},  {
			field : 'apply_remark',
			title : '申请备注',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
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
			width : 100
		} ,{
			field : 'audit_remark',
			title : '审核备注',
			align : 'center',
			formatter : dateTimeFormater,
			width : 75
		},{
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
	//渠道设置
	var channel={
			url : root+'/common/channels',
			callBackFun : function(data) {
				channels = data.rows;
				console.log("pindao");
				var treeList = rowsListAddAll(data.rows, {
					"checked" : true,
					"children" : null,
					"chalCode" : "",
					"chalName" : "全部"
				});
				//渠道设置
				$('#channel').combobox({
					data:treeList,
					valueField:'chalCode',
					editable : false,
					textField:'chalName'
				});
			}
		};
		sendAjaxRequest(channel);
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#mistakeAuditTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function orderCodeFormater(value, row, index) {
	var _id = "'" + row.orderId + "'";
	var detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"info")>'
			+ value + '</a>';
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
/** --------自定义文本 ------ */
function optFormater(value, row, index) {
	var _id = "'" + row.refund_id + "'";
	var detail = "";
	if(row.refund_status == "1"){
		detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"refund")>差错退款审核</a>';
	}else{
		detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"info")>查看详情</a>';
	}
	return detail;
};
function remarkSytler(value, row, index) {
	if (isEmpty(row.refund_remark)) {
		return "color: red;"
	}
	return "";
};
/** --------查看详情 ------ */
function getInfo(id, flag) {
	var url = root+'/errorRefunds/getRefundById';
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
			console.log(data);
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
								field : 'paybillno',
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
								field : 'refundable',
								title : '可退金额',
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
								title : '差错退款申请单号',
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
								styler : remarkSytler,
								formatter : remarkFormater,
								editor : 'text',
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
				}
			}
	sendAjaxRequest(options);
}
///** -------- 差错退款审核 ------ */
function setPass(status){
	var passFlag=true;
	var params=new Object();
	var price=$("#roderPrice").val();
	var rows = $('#auditTable').datagrid('getData').rows;
	params.refundId=$("#refundId").val();
	var actualPrice;
	if(status=="2"){
		text = "是否确认通过差错退款审核？";
		params.refundStatus="2";
		$.each(rows, function(i, field){
			if (field.audit_remark == "双击录入" || isEmpty(field.audit_remark)) {
				params.auditRemark="";
			}else{
				params.auditRemark=field.audit_remark;
			}
			if (field.refund_amounts_actual == "双击录入" || isEmpty(field.refund_amounts_actual)) {
//				$.messager.alert('错误提示', '退款金额不能为空!', 'error');
//				passFlag=false;
//				return false;
				params.refundAmountsActual=field.refund_amounts;
			}else{
				actualPrice=field.refund_amounts_actual
				if(parseInt(actualPrice)>parseInt(price)){  
					$.messager.alert('错误提示', '退款金额不能大于应退金额！', 'error');
					passFlag=false;
					return false;  
				}else{
					params.refundAmountsActual=actualPrice;
				} 
			}
			
		});
	}else{
		text = "是否确认拒绝差错退款审核？";
		params.refundStatus="3";
		$.each(rows, function(i, field){
			if (field.audit_remark == "双击录入" || isEmpty(field.audit_remark)) {
				$.messager.alert('错误提示', '退款备注不能为空!', 'error');
				passFlag=false;
				return false;
			}else{
				params.auditRemark=field.audit_remark;
			}
			if (field.refund_amounts_actual == "双击录入" || isEmpty(field.refund_amounts_actual)) {
				params.refundAmountsActual="";
			}else{
				actualPrice=field.refund_amounts_actual
				if(parseInt(actualPrice)>parseInt(price)){  
					$.messager.alert('错误提示', '退款金额不能大于应退金额！', 'error');
					passFlag=false;
					return false;  
				}else{
					params.refundAmountsActual=actualPrice;
				} 
			}
			
		});
	}
	if(!passFlag){
		return false;
	}
	console.log(params);
	$.messager.confirm('差错退款审核提示', text, function(r) {
		
		// 首先如果用户选择了数据，则获取选择的数据集合
		if (r) {
			var url = root+'/errorRefunds/auditErrorRefund';
			var options = {
				url : url,
				data : params,
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("mistakeAuditTable");
						$('#refundInfo').dialog('close');
						resetform();
						
					}
					showMessage(data);
				}
			}
			sendAjaxRequest(options);
		}
	});
	
}

/** -------- 导出 ------ */
function exportErrorRefund() {
	var data = $('#mistakeAuditTable').datagrid('getData');
	var params = validateForm();
	if(!params){
		return false;
	}
	params.start = 1;
	params.end = 60000;
	
	var count = data.rows.length;
	if(count>0){
		openWindowWithJson('exportErrorRefund.action',params);
	}else{
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
	}
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
//重置
function resetform(){
	$('#setPassForm').form('reset');
	$('#setRefuseForm').form('reset');
	$('#setPass').dialog('close');
	$('#setRefuse').dialog('close');
}

/** -------- 重置查询条件 ------ */
function queryOrderReset() {
	$('#conditionForm').form('reset');
	initDatebox();
}
