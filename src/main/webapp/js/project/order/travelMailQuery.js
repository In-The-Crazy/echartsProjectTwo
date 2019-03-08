var channels = [];
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
	$('#startDate').datebox({
		label : '申请起始日期：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		editable : false,
		required : false
	});
	$('#endDate').datebox({
		label : '申请截止日期：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		editable : false,
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
	$("#mailNo").textbox({
		label : '快递单号：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#orderCode").textbox({
		label : '订单编号：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#addressee").textbox({
		label : '收件人：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#phone").textbox({
		label : '电话：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	
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
			$.messager.alert('错误提示', '申请起始日期不能大于申请截止日期', 'error');
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
	console.log(params);
//	return false;
	// 加载表格
	$('#travelMailTable')
		.datagrid(
		{
			url : root + '/delivery/queryTravelMailList',
			toolbar : '#toolbar',
			checkOnSelect : true,// 是否选中/取消复选框
			pagination : true,// 是否分页
			autoRowHeight : true,// 定义是否设置基于该行内容的行高度
			pageNumber : 1,
			pageSize : 20,
			fitColumns : true,// 列自适应表格宽度
			striped : true,// 当true时，单元格显示条纹
			rownumbers : false,// 是否显示行号
			singleSelect : true,// 是否只能选中一条
			queryParams : params,
			loadMsg : '数据加载中,请稍后...',
			onBeforeLoad : function() {
			},
			onLoadError : function() {
				$.messager.alert('错误提示', '数据加载失败!', 'error');
			},
			onLoadSuccess : function(data) {
				console.log(data);
			},
			columns : [ [
				{
					field : 'rownumbers',
					title : '',
					align : 'center',
					styler : rownumSytler,
					formatter : rownumFormater,
					width : 25
				},
				{
					field : 'mailNo',
					title : '快递单号',
					align : 'center',
					formatter : baseFormater,
					width : 150
				},
				{
					field : 'orderCode',
					title : '订单编号',
					align : 'center',
					formatter : baseFormater,
					width : 150
				},
				/*
				 * { field : 'ticketNo', title : '票号', align :
				 * 'center', formatter : baseFormater, width :
				 * 50 },
				 */
				{
					field : 'addressee',
					title : '收件人',
					align : 'center',
					formatter : baseFormater,
					width : 75
				},
				{
					field : 'phone',
					title : '电话',
					align : 'center',
					formatter : baseFormater,
					width : 100
				},
				/*
				 * { field : 'postCode', title : '邮编', align :
				 * 'center', formatter : baseFormater, width :
				 * 100 },
				 */
				{
					field : 'address',
					title : '地址',
					align : 'center',
					formatter : baseFormater,
					width : 300
				},
				{
					field : 'applyDate',
					title : '申请日期',
					align : 'center',
					formatter : baseFormater,
					width : 100
				},
				{
					field : 'emailStatus',
					title : '邮寄状态',
					align : 'center',
					formatter : function(value, row, index) {
						if (value == 1) {
							return '未邮寄';
						} else if (value == 2) {
							return '已邮寄';
						} else if (value == 3) {
							return '已回收';
						}
					},
					width : 100
				},
				{
					field : 'dcDate',
					title : '邮寄日期',
					align : 'center',
					formatter : baseFormater,
					width : 100
				},
				/*
				 * { field : 'conformDate', title : '确认时间',
				 * align : 'center', formatter : baseFormater,
				 * width : 200 },
				 */
				{
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
					width : 100
				},
				{
					field : 'recoveryStatus',
					title : '是否通知回收',
					align : 'center',
					formatter : function(value, row, index) {
						if (value == 0) {
							return '未发送';
						} else if (value == 1) {
							return '已发送';
						}
					},
					width : 100
				},
				{
					field : 'aaa',
					title : '操作',
					align : 'center',
					formatter : optFormater,
					width : 180
				} ] ]
			});
}

function optFormater(value, row, index) {
	var emailStatus = row.emailStatus;
	var recoveryStatus = row.recoveryStatus;
	var opt = '--';
	var del = '';
	var lock = '';
	if(emailStatus == '1'){
		del = '<a href="javascript:void(0);" onclick=openPostWin(' + row.ticketid + ')>配送</a>';
		opt = del;
	}else if (emailStatus == '2') {
		del = '<a href="javascript:void(0);" onclick=sendMessge(' + row.orderid + ',' + row.ticketid + ')>发送回收信息</a>';
		lock = ' | <a href="javascript:void(0);" onclick=completeSend(' + row.ticketid + ')>回收确认</a>';
		opt = del+lock;
	}
	return opt;
};

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
				"chalCode" : "",
				"chalName" : "全部"
			});
			//渠道设置
			$('#add_channel,#set_channel').combobox({
				data:data.rows,
				valueField:'chalCode',
				required : true,
				editable : false,
				multiple:true,
				textField:'chalName'
			});
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
	
	$('#emailStatus').combobox({
		label : '邮寄状态：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data: [{
			"id" : "0",
			"text" : "全部",
			"selected": true
		},{
			"id" : "1",
			"text" : "未邮寄"
		},{
			"id" : "2",
			"text" : "已邮寄"
		}],
		valueField:'id',
		textField:'text'
	});
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#travelMailTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function orderCodeFormater(value, row, index) {
	var _id = "'" + row.orderid + "'";
	var _orderDate = "'" + row.creadate.split(' ')[0].replace(/-/g, '') + "'";
	var detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',' + _orderDate + ')>'
			+ value + '</a>';
	return detail;
};
function addressFormater(value, row, index) {
	result = baseFormater(value, row, index).replace(/[\r\n]/g, ","); // 去掉回车换行
	return result;
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


/** -------- 导出 ------ */
function exportTravelmail() {
	var data = $('#travelMailTable').datagrid('getData');
	var sdate = $('#startDate').datebox('getValue');
	var edate = $('#endDate').datebox('getValue');
	var keys = [ 'start', 'end', 'startdate', 'enddate', 'addressee',
			'orderCode', 'ticketNo', 'phone', 'applyType' ];
	var values = [ '0', '100000', sdate, edate, $('#addressee').val(),
			$('#orderCode').val(), $('#ticketNo').val(), $('#phone').val(),
			$('#applyType').val() ];
	var count = data.rows.length;
	var params = serializeJson("conditionForm");
	if (count > 0) {
		openWindowWithJson(root + '/delivery/exportTravelMail',params);
	} else {
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
	}
}

/** -------- 重置查询条件 ------ */
function queryTravelMail() {
	$('#conditionForm').form('reset');
	$('#emailStatus').combobox('select',0);
	initDatebox();
}

/*
 * 完成邮寄
 */
function completeSend(id) {
	var add = {
		url : root + '/delivery/confirmCompletion',
		data : {
			ticketid : id
		},
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				ajaxTable();
			} else {
				$.messager.alert('错误提示', res.message, 'error');
			}
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}
/*
 * 发送消息
 */
function sendMessge(orderid,ticketid) {
	var add = {
			url : root + '/delivery/sendMessge',
			data : {
				orderid : orderid,
				ticketid : ticketid
			},
			callBackFun : function(data) {
				if (data.isSuccessOrfail == "SUCCESS") {
					ajaxTable();
				} else {
					$.messager.alert('错误提示', res.message, 'error');
				}
				showMessage(data);
			}
	}
	sendAjaxRequest(add);
}

/*
 * 打开邮寄
 */
function openPostWin(id) {
	$('#completeSend').dialog('open');
	$("#ticketid").val(id);
}
function startSend(){
	var addflag = $("#completeSendFrom").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("completeSendFrom");
	console.log(params);
//	return false;
	var add = {
			url : root + '/delivery/distribution',
			data : params,
			callBackFun : function(data) {
				if (data.isSuccessOrfail == "SUCCESS") {
					ajaxTable();
					$('#completeSend').dialog('close');
//					重置表单
					completeSendFromReset();
				} else {
					$.messager.alert('错误提示', res.message, 'error');
				}
				showMessage(data);
			}
		}
		sendAjaxRequest(add);
}
//重置表单
function completeSendFromReset(){
	$("#completeSendFrom").form('reset');
	initDatebox();
}