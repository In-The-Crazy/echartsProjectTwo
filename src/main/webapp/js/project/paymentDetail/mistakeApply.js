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

	// 查看窗口
	initDialog(dialog_info);
	$('#orderInfo').dialog('close');
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
		url :root+ '/errorRefunds/queryOrdersForRefund',
		toolbar : "#toolbar",
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
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
		onLoadSuccess : function(data) {
			console.log(data);
			if(data.isSuccessOrfail == 'FAIL'){
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
			field : 'orderid',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, 
		{
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
			field : 'ordercode',
			title : '订单编号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'creadate',
			title : '订单日期',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'pnr',
			title : 'PNR',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},{
			field : 'conts_name',
			title : '联系人姓名',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'conts_mobile',
			title : '联系人电话',
			align : 'center',
			formatter : baseFormater,
			width : 150
		},
		{
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
			field : 'paytype',
			title : '支付方式',
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
		},  {
			field : 'paystatus',
			title : '支付状态',
			align : 'center',
			formatter : paystatusFormater,
			width : 75
		},{
			field : 'paybillno',
			title : '银行订单号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'paymoney',
			title : '支付金额',
			align : 'center',
			formatter : baseFormater,
			width : 100
		},{
			field : 'refund_money',
			title : '可退金额',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'refund_status',
			title : '差错退款状态',
			align : 'center',
			formatter : function(value,rows,index){
				if(value=='1'){
	   				atext='已申请';
	   			}else if(value=='2'){
	   				atext='一审通过';
	   			}else if(value=='3'){
	   				atext='一审拒绝';
	   			}else if(value=='4'){
	   				atext='二审通过';
	   			}else if(value=='5'){
	   				atext='二审拒绝';
	   			}else if(value=='6'){
	   				atext='退款完成';
	   			}else if(value==""){
	   				atext='--';
	   			}
	   			return atext;
			},
			width : 100
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
}
/** -------- 打开差错退款申请 ------ */
function setPass(){
	var addflag = $("#airMailAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var paymoney= parseInt($("#ordeprice").val());
	var refmoney=parseInt($("#refundAmounts").val());
	console.log(paymoney);
	console.log(refmoney);
	if(refmoney>paymoney){
		$.messager.alert('错误提示', '退款金额不能大于支付金额！', 'error');
		return false;
	}
	var params = serializeJson("setPassForm");
	console.log(params);
	$.messager.confirm('差错退款申请提示', '是否确认提交差错退款申请?', function(r) {
		// 首先如果用户选择了数据，则获取选择的数据集合
		if (r) {
			var url = root+ '/errorRefunds/applyErrorRefund';
			var options = {
				url : url,
				data : params,
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("mistakeApplyTable");
						$('#setPass').dialog('close');
					}
					showMessage(data);
				}
			}
			sendAjaxRequest(options);
		}
	});
}
/** -------- 差错退款申请 ------ */
function errorApply() {
	var selecteds = $('#mistakeApplyTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#mistakeApplyTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#mistakeApplyTable').datagrid('getSelections');
		console.log(selectedRow);
		for (var i = 0; i < selectedRow.length; i++) {
			if(selectedRow[i].order_status==2&&selectedRow[i].paystatus!=2){
				$.messager.alert('错误提示', '请确认所选订单的支付状态为"支付成功"!', 'error');
				return false;
			}
			ids.push(selectedRow[i].orderid);//记得改ID
		}
		var dpid = ids.join(',');
		$("#orderid").val(dpid);
		$('#setPass').dialog('open');
		$("#ordeprice").val(selecteds[0].paymoney);
		$("#bankCode").val(selecteds[0].paybillno);
		$("#refundAmounts").textbox('setValue', selecteds[0].paymoney);
		$("#apply_remark").textbox('setValue', "");
		
	}
}

/** -------- 重置查询条件 ------ */
function queryOrderReset() {
	$('#conditionForm').form('reset');
	initDatebox();
}
