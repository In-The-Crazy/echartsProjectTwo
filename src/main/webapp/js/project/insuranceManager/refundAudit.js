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
	var today = new Date();
	var first = new Date();
	first.setDate(1);
	today = today.pattern("yyyy-MM-dd");
	first = first.pattern("yyyy-MM-dd");
	$('#startDate').datebox({
		label : '保险起始日期：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		value: first,
		editable : false,
		required : false
	});
	$('#endDate').datebox({
		label : '保险截止日期：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		value: today,
		editable : false,
		required : false
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	$("#insuredName").textbox({
		label : '购保人名称：',
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
	$("#ticketNo").textbox({
		label : '票号：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	
	var dialog_info = {
		id : "passengerInfo",
		title : "旅客信息详情"
	};
	var dialog_logger = {
		id : "loggerInfo",
		title : "审核记录"
	};

	// 查看窗口
	initDialog(dialog_info);
	$('#passengerInfo').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
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
			$.messager.alert('错误提示', '保险起始日期不能大于保险截止日期', 'error');
			return false;
		}
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#refundCheckTable').datagrid({
		url : root + '/insurance/queryInsuranceInfoList',
		toolbar : '#toolbar',
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		pageNumber : 1,
		pageSize : 20,
		fitColumns : false,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : true,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		queryParams : params,
		loadMsg : '数据加载中,请稍后...',
		onBeforeLoad : function() {
		},
		onLoadError : function() {
			$.messager.alert('错误提示', '数据加载失败!', 'error');
		},
		onLoadSuccess : function(data) {
		},
		columns : [ [ {
			field : 'insuraId',
			hidden : true
		}, {
			field : 'ticketId',
			hidden : true
		}, {
			field : 'insType',
			hidden : true
		}, {
			field : 'orderId',
			hidden : true
		}, {
			field : 'ordercode',
			title : '订单编号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'ticketNo',
			title : '票号',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'buyUnitPrice',
			title : '单价',
			align : 'center',
			formatter : baseNumFormater,
			width : 50
		}, {
			field : 'status',
			title : '保险状态',
			align : 'center',
			formatter : insuranceStatusFormater,
			width : 75
		}, {
			field : 'insuredName',
			title : '购保人姓名',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'insuredMobile',
			title : '购保人手机',
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
			field : 'insuranceProductName',
			title : '保险产品',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'insNo',
			title : '保单号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'createDate',
			title : '保险日期',
			align : 'center',
			formatter : dateTimeFormater,
			width : 150
		}, {
			field : 'opt',
			title : '操作',
			align : 'center',
			formatter : optFormater
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	$('#insStatus').combobox({
		label : '保险状态：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data: [{
			"id" : "",
			"text" : "全部"
		},{
			"id" : "2",
			"text" : "退保拒绝"
		},{
			"id" : "3",
			"text" : "退保申请中",
			"selected": true
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
function passengerFormater(value, row, index) {
	var _id = "'" + row.ticketid + "'";
	var _name = "'" + row.name + "'";
	var _gmobile = "'" + row.gmobile + "'";
	var _idtype = "'" + idtypeFormatter(row.idtype, row, index) + "'";
	var _idnumber = "'" + row.idnumber + "'";
	var detail = '<a href="javascript:void(0);" onclick="getPassengerInfo(' + _id + ',' + _name + ','
		+ _gmobile + ',' + _idtype + ',' + _idnumber + ')">'
		+ row.name + '</a>';
	return detail;
};
function optFormater(value, row, index) {
	var _id = "'" + row.insuraId + "'",
	_no = "'" + row.ticketNo + "'",
	detail = "",
	refuse="";
	if(row.status == "2" || row.status == "3"){
		detail = '<a href="javascript:void(0);" onclick=refundCheck(' + _id + ')>退保审核</a> | ';
		refuse = '<a href="javascript:void(0);" onclick=refundRefuse(' + _id + ')>退保拒绝</a> | ';
	}
	logger = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ','+_no+')>审核记录</a>';
	return detail+refuse+logger;
};

/** --------自定义单元格样式 ------ */
function remarkSytler(value, row, index) {
	if (isEmpty(value)) {
		return "color: red;"
	}
	return "";
};

/** --------查看详情 ------ */
function getInfo(id,no) {
	var options = {
		url : root + "/refund/queryOrderProcessingList",
		data : {
			'ticketid' : id,
			'eticketno' : no
		},
		callBackFun : function(data) {
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
				columns : [ [ {
					field : 'creatime',
					title : '处理时间',
					align : 'center',
					formatter : dateTimeFormater,
					width : 150
				}, {
					field : 'type',
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
	sendAjaxRequest(options);
}
function getPassengerInfo(id, name, gmobile, idtype, idnumber) {
	$("#info_name").html(name);
	$("#info_mobile").html(gmobile);
	$("#info_idtype").html(idtype);
	$("#info_idnum").html(idnumber);
	$('#passengerInfo').dialog('open');
}

/** -------- 导出 ------ */
function exportRefundaudit() {
	var data = $('#refundCheckTable').datagrid('getData');
	var paper = $('#refundCheckTable').datagrid('getPager').pagination("options");
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
				openWindowWithJson(root +'/refund/exportAchangeList',params);
			}
		});
	}else{
		params["start"] = 1;
		params["end"] = paper.total;
		//return false;
		openWindowWithJson(root +'/refund/exportAchangeList',params);
	}
}

/** -------- 退票审核 ------ */
function refundCheck(insuraId) {
	$.messager.confirm('退保审核提示', '是否确认提交审核?', function(r) {
		if (r) {
			var options = {
				url : root + '/insurance/firstInsuracePass',// 请求的action路径
				data : {
					"insrId": insuraId
				},
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

/** -------- 退票拒绝 ------ */
function refundRefuse(insuraId) {
	$.messager.confirm('退保拒绝提示', '是否确认拒绝?', function(r) {
		if (r) {
			var options = {
				url : root + '/insurance/firstInsuraceRefuse',// 请求的action路径
				data : {
					"insrId": insuraId
				},
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

/** -------- 重置查询条件 ------ */
function refundReset() {
	$("#conditionForm").form("reset");
}
