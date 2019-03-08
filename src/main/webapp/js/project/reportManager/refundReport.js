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
	$('#startdate').datebox({
		required : false
	});
	$('#enddate').datebox({
		required : false
	});
	dateBoxValidator();
	var today = new Date();
	var first = new Date();
	first.setDate(1);
	today = today.pattern("yyyy-MM-dd");
	first = first.pattern("yyyy-MM-dd");
	$('#startdate').datebox('setValue',first);
	$('#enddate').datebox('setValue',today);
}

/** -------- 限制日期选择范围 ------ */
function dateBoxValidator() {
	$('#startdate').datebox().datebox('calendar').calendar({
		validator: function(date){
			var end = $('#enddate').datebox('getValue');
			var now = new Date();
			if(!isEmpty(end)){
				now = new Date(end);
			}
			var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			var temp = new Date(now.getTime()-31*24*60*60*1000);
			var d2 = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());
			return d2<=date && date<=d1;
		}
	});
	$('#enddate').datebox().datebox('calendar').calendar({
		validator: function(date){
			var now = new Date();
			var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			return date<=d1;
		}
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	// 验证时间
	var sdate = $('#startdate').datebox('getValue');
	var edate = $('#enddate').datebox('getValue');
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		sdate = sdate.replace(/-/g, '');
		edate = edate.replace(/-/g, '');
		if (parseInt(sdate) > parseInt(edate)) {
			$.messager.alert('错误提示', '起始日期不能大于截止日期', 'error');
			return false;
		}
	}
	
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#refundReportTable').datagrid({
		url : 'queryRefundInfoList.action',
		toolbar : "#toolbar",
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : false,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		showHeader : true,
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
			field : 'ordercode',
			title : '订单号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'pnr',
			title : 'PNR',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'eticketno',
			title : '票号',
			align : 'center',
			formatter : baseFormater,
			width : 120
		}, {
			field : 'fdate',
			title : '航班日期',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'fnumber',
			title : '航班号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'sail',
			title : '航段',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},  {
			field : 'seat',
			title : '舱位',
			align : 'center',
			formatter : baseFormater,
			width : 50
		},  {
			field : 'fare',
			title : '票面价',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},  {
			field : 'airportTax',
			title : '机建税',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},  {
			field : 'fuelTax',
			title : '燃油税',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},  {
			field : 'fmoney',
			title : '优惠金额',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},  {
			field : 'paymoney',
			title : '支付金额',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},  {
			field : 'refundCharge',
			title : '退票费',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},  {
			field : 'actualRefundMoney',
			title : '实际退款',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},  {
			field : 'payChannel',
			title : '支付通道',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},  {
			field : 'payMethod',
			title : '支付方式',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},  {
			field : 'paybillno',
			title : '支付订单号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		},  {
			field : 'outdatetime',
			title : '出票时间',
			align : 'center',
			formatter : baseFormater,
			width : 150
		},  {
			field : 'cresdatetime',
			title : '退款时间',
			align : 'center',
			formatter : baseFormater,
			width : 150
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#refundReportTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */


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
function getInfo(id, flag) {
}

/** -------- 导出 ------ */
function exportTotalSaleList() {
	var data = $('#refundReportTable').datagrid('getData');
	var sdate = $('#startdate').datebox('getValue');
	var edate = $('#enddate').datebox('getValue');
	var keys = ['start','end','startdate','enddate'];
	var values = ['0','100000',sdate,edate];
	var count = data.rows.length;
	if(count>0){
		openWindowWithPost('exportRefundInfoList.action',keys,values);
	}else{
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
	}
}

/** -------- 重置查询条件 ------ */
function queryOrderReset() {
	initDatebox();
}
