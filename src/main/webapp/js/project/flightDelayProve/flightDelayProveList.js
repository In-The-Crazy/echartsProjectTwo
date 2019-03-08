var channels;
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
	
	$('#startDate').datebox({
		label : '开具开始日期：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		value : first,
		editable : false,
		required : false
	});
	$('#endDate').datebox({
		label : '开具截止日期：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		value : today,
		editable : false,
		required : false
	});
	
	$('#startflightDate').datebox({
		label : '航班开始时间：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		editable : false,
		required : false
	});
	$('#endflightDate').datebox({
		label : '航班截止时间：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		editable : false,
		required : false
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	$("#proveCode").textbox({
		label : '航延证明编号：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#memMobile").textbox({
		label : '会员号码：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#contName").textbox({
		label : '联系人姓名：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#contMmobile").textbox({
		label : '联系人号码：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#passger").textbox({
		label : '旅客姓名：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#cardno").textbox({
		label : '证件号：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#ticketno").textbox({
		label : '票号：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#flightNo").textbox({
		label : '航班号：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#dept").textbox({
		label : '起飞地：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#arrive").textbox({
		label : '目的地：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	
	var dialog_info = {
		id : "refundInfo",
		title : "航延证明详细信息"
	};

	// 查看窗口
	initDialog(dialog_info);
	
	var dialog_email = {
		id : "emailDialog",
		title : "发送邮件"
	}
	initDialog(dialog_email);
	$('#emailDialog').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var startDate = $('#startDate').datebox('getValue');
	var endDate = $('#endDate').datebox('getValue');
	if (startDate != null && startDate != "" && endDate != null && endDate != "") {
		startDate = startDate.replace(/-/g, '');
		endDate = endDate.replace(/-/g, '');
		if (parseInt(startDate) > parseInt(endDate)) {
			$.messager.alert('错误提示', '申请开始日期不能大于申请截止日期', 'error');
			return false;
		}
	}
	
	var startflightDate = $('#startflightDate').datebox('getValue');
	var endflightDate = $('#endflightDate').datebox('getValue');
	if (startflightDate != null && startflightDate != "" && endflightDate != null && endflightDate != "") {
		startflightDate = startflightDate.replace(/-/g, '');
		endflightDate = endflightDate.replace(/-/g, '');
		if (parseInt(startflightDate) > parseInt(endflightDate)) {
			$.messager.alert('错误提示', '申请开始日期不能大于申请截止日期', 'error');
			return false;
		}
	}

	var params = serializeJson("conditionForm");

	// 加载表格
	$('#flightDelayProveTable').datagrid({
		url : root + '/flightDelayProve/queryFlightDelayProveList',
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
			field : 'proveId',
			checkbox : 'true',
			align : 'center',
			width : 25
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
			}
		}, {
			field : 'proveCode',
			title : '航延证明编号',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'delayStatus',
			title : '开具状态',
			align : 'center',
			formatter : function(value, row, index) {
				var text = "--";
				if (value == 1) {
					text = "成功";
				}else if (value == 0) {
					text = "失败";
				}
				return text;
			}
		}, {
			field : 'delayType',
			title : '延误类型',
			align : 'center',
			formatter : delayTypeFormater
		}, {
			field : 'memType',
			title : '会员类别',
			align : 'center',
			formatter : memTypeFormater
		}, {
			field : 'memMobile',
			title : '会员号码',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'contName',
			title : '联系人姓名',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'contMmobile',
			title : '联系人号码',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'passger',
			title : '旅客姓名',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'cardno',
			title : '证件号',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'ticketno',
			title : '票号',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'flightNo',
			title : '航班号',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'flightDate',
			title : '航班日期',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'dept',
			title : '起飞地',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'arrive',
			title : '目的地',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'spareLand',
			title : '备降地',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'planDtime',
			title : '计划起飞时间',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'actDtime',
			title : '实际起飞时间',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'planDtime',
			title : '计划到达时间',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'actAtime',
			title : '实际到达时间',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'delayReason',
			title : '延误原因',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'email',
			title : '邮箱地址',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'clctNotice',
			title : '呼叫中心是否通知',
			align : 'center',
			formatter : function(value, row, index) {
				if (value == 1) {
					return "是";
				}else if (value == 2) {
					return "否";
				}
			}
		}, {
			field : 'clctNoticeType',
			title : '呼叫中心通知类型',
			align : 'center',
			formatter : function(value, row, index) {
				var text = "--"
				if (value == 1) {
					text = "时刻调整";
				}else if (value == 2) {
					text = "取消调整";
				}
				return text;
			}
		}, {
			field : 'createTime',
			title : '开具时间',
			align : 'center',
			formatter : baseFormater
		}, {
			field : 'delayFailReason',
			title : '失败原因',
			align : 'center',
			formatter : baseFormater
		},{
			field : 'opt',
			title : '操作',
			align : 'center',
			formatter : optFormater
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
//延误类型：1延误、2取消、3备降
function delayTypeFormater(value, row, index) {
	var text = "--";
	if (value == 1) {
		text = "延误";
	}else if (value == 2) {
		text = "取消";
	}else if (value == 3) {
		text = "备降";
	}else if (value == 4) {
		text = "返航";
	}
	return text;
};
//会员类型：1 手机登录会员  2 常旅客会员
function memTypeFormater(value, row, index) {
	var text = "--";
	if (value == 1) {
		text = "手机登录会员";
	}else if (value == 2) {
		text = "常旅客会员";
	}
	return text;
};
function optFormater(value, row, index) {
	var _id = "'" + row.proveId + "'";
	var detail = "";
	detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"info")>查看详情</a>';
	return detail;
};

/** --------查看详情 ------ */
function getInfo(id, flag) {
	var url = root+'/flightDelayProve/queryFlightDelayProveInfo';
	var data = {'proveId' : id};
	var options = {
		url : url,
		data : data,
		callBackFun : function(data) {
			if (flag == 'info') {
				// 打开订单详情页面
				$('#flightDelayProveInfo').dialog('open');
				var IsCheckFlag = true; // 标示是否选中行的，true - 是 , false - 否
				// 加载订单详情表格
				$('#fdpInfoTableA').datagrid(
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
							},
							onSelect : function(rowIndex, rowData) {
							},
							onUnselect : function(rowIndex, rowData) {
							},
							columns : [ [ {
								field : 'proveCode',
								title : '航延证明编号',
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
								field : 'delayType',
								title : '延误类型',
								align : 'center',
								formatter : delayTypeFormater,
								width : 100
							}, {
								field : 'memType',
								title : '会员类别',
								align : 'center',
								formatter : memTypeFormater,
								width : 75
							}, {
								field : 'memMobile',
								title : '会员号码',
								align : 'center',
								formatter : baseFormater,
								width : 75
							} ] ]
						});

				$('#fdpInfoTableB').datagrid(
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
							},
							onSelect : function(rowIndex, rowData) {
							},
							onUnselect : function(rowIndex, rowData) {
							},
							columns : [ [ {
								field : 'contName',
								title : '联系人姓名',
								align : 'center',
								formatter : baseFormater,
								width : 75
							}, {
								field : 'contMmobile',
								title : '联系人号码',
								align : 'center',
								formatter : baseFormater,
								width : 75
							}, {
								field : 'passger',
								title : '旅客姓名',
								align : 'center',
								formatter : refundFormater,
								width : 100
							}, {
								field : 'cardno',
								title : '证件号',
								align : 'center',
								formatter : baseFormater,
								width : 150
							}] ]
						});

				$('#fdpInfoTableC').datagrid(
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
								field : 'ticketno',
								title : '票号',
								align : 'center',
								formatter : baseFormater,
								width : 75
							},{
								field : 'flightNo',
								title : '航班号',
								align : 'center',
								formatter : baseFormater,
								width : 75
							},  {
								field : 'flightDate',
								title : '航班日期',
								align : 'center',
								formatter : baseFormater,
								width : 100
							}, {
								field : 'dept',
								title : '起飞地',
								align : 'center',
								formatter : baseFormater,
								width : 75
							},  {
								field : 'arrive',
								title : '目的地',
								align : 'center',
								formatter : baseFormater,
								width : 75
							} ] ]
						});
				$('#fdpInfoTableD').datagrid(
						{
							data : data.rows,
							checkOnSelect : false,// 是否选中/取消复选框
							pagination : false,// 是否分页
							autoRowHeight : false,// 定义是否设置基于该行内容的行高度
							fitColumns : false,// 列自适应表格宽度
							striped : false,// 当true时，单元格显示条纹
							rownumbers : false,// 是否显示行号
							singleSelect : true,// 是否只能选中一条
							onLoadSuccess : function(data) {
							},
							onClickCell : function(rowIndex, rowData) {
							},
							onSelect : function(rowIndex, rowData) {
							},
							onUnselect : function(rowIndex, rowData) {
							},
							columns : [ [{
								field : 'planDtime',
								title : '计划起飞时间',
								align : 'center',
								formatter : dateTimeFormater,
								width : 195
							}, {
								field : 'actDtime',
								title : '实际起飞时间',
								align : 'center',
								formatter : dateTimeFormater,
								width : 195
							} ,{
								field : 'planDtime',
								title : '计划到达时间',
								align : 'center',
								formatter : dateTimeFormater,
								width : 195
							},{
								field : 'actAtime',
								title : '实际到达时间',
								align : 'center',
								formatter : dateTimeFormater,
								width : 195
							} ] ]
						});
				$('#fdpInfoTableE').datagrid(
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
							},
							onSelect : function(rowIndex, rowData) {
							},
							onUnselect : function(rowIndex, rowData) {
							},
							columns : [ [{
								field : 'email',
								title : '邮箱地址',
								align : 'center',
								formatter : baseFormater,
								width : 100
							} ,{
								field : 'delayReason',
								title : '延误原因',
								align : 'center',
								formatter : baseFormater,
								width : 100
							},{
								field : 'clctNotice',
								title : '呼叫中心是否通知',
								align : 'center',
								formatter : function(value, row, index) {
									if (value == 1) {
										return "是";
									}else if (value == 2) {
										return "否";
									}
								},
								width : 75
							},{
								field : 'clctNoticeType',
								title : '呼叫中心通知类型',
								align : 'center',
								formatter : function(value, row, index) {
									var text = "--"
									if (value == 1) {
										text = "时刻调整";
									}else if (value == 2) {
										text = "取消调整";
									}
									return text;
								},
								width : 100
							},{
								field : 'createTime',
								title : '开具时间',
								align : 'center',
								formatter : baseFormater,
								width : 100
							} ] ]
						});
				}
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
			var treeList = rowsListAddAll(data.rows, {
				"checked" : true,
				"children" : null,
				"chalId" : "",
				"chalName" : "全部"
			});
			//渠道设置
			$('#channel').combobox({
				label : '渠道编号：',
				labelWidth : 100,
				labelAlign : 'right',
				width : 250,
				data:treeList,
				valueField:'chalCode',
				editable : false,
				textField:'chalName'
			});
		}
	};
	sendAjaxRequest(channel);
	
	$('#delayType').combobox({
		label : '延误类型：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data: [{
			"id" : "",
			"text" : "全部",
			"selected": true
		},{
			"id" : "1",
			"text" : "延误"
		},{
			"id" : "2",
			"text" : "取消"
		},{
			"id" : "3",
			"text" : "备降"
		},{
			"id" : "4",
			"text" : "返航"
		}],
		valueField:'id',
		textField:'text'
	});
	
	$('#delayStatus').combobox({
		label : '开具状态：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data: [{
			"id" : "",
			"text" : "全部",
			"selected": true
		},{
			"id" : "1",
			"text" : "成功"
		},{
			"id" : "0",
			"text" : "失败"
		}],
		valueField:'id',
		textField:'text'
	});
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

/** -------- 航延证明列表导出 ------ */
function exportForm() {
	var data = $('#flightDelayProveTable').datagrid('getData');
	var paper = $('#flightDelayProveTable').datagrid('getPager').pagination("options");
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
				openWindowWithJson(root +'/flightDelayProve/exportFlightDelayProve',params);
			}
		});
	}else{
		params["start"] = 1;
		params["end"] = paper.total;
		//return false;
		openWindowWithJson(root +'/flightDelayProve/exportFlightDelayProve',params);
	}
}

/** -------- 重置查询条件 ------ */
function queryOrderReset() {
	$('#conditionForm').form('reset');
	initDatebox();
}

//打开邮箱界面
function openEmail(){
	var selecteds = $('#flightDelayProveTable').datagrid('getSelections');
	if(selecteds.length != 1){
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	var selected = $('#flightDelayProveTable').datagrid('getSelected');
	$("#emailAdress").val(selected.email);
	$("#delayCode").val(selected.proveCode);
	$('#emailDialog').dialog('open');
}
//发送邮箱
function sendEmail(){
	var email = $("#emailAdress").val();
	var delayCode = $("#delayCode").val();
	if(email == '' || typeof(email) == undefined){
		$.messager.alert('错误提示', '请输入邮箱地址！', 'error');
		return false;
	}
	
	var url = root+'/flightDelayProve/delaySendEmail';
	var params = {"delayCode" : delayCode,"email" : email};
	var options = {
		url : url,
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				$('#emailDialog').dialog('close');
			}
			showMessage(data);
		}
	}
	sendAjaxRequest(options);

}
