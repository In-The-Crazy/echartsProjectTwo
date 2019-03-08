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
	$('#flightDate').datebox({
		required : false
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
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
			$.messager.alert('错误提示', '值机起始日期不能大于值机截止日期', 'error');
			return false;
		}
	}
	//验证表单参数
	var sflag = $("#conditionForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请输入正确的城市三字码！', 'error');
		return false;
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#boardPassTable').datagrid({
		url : 'boardPassList.action',
		toolbar : '#toolbar',
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
		onBeforeLoad : function() {
		},
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
			field : 'psrName',
			title : '旅客姓名',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'mobile',
			title : '手机号码',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'flightNo',
			title : '航班号',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'flightDate',
			title : '起飞日期',
			align : 'center',
			formatter : dateTimeFormater,
			width : 100
		}, {
			field : 'flightTime',
			title : '起飞时间',
			align : 'center',
			formatter : timeFormater,
			width : 100
		}, {
			field : 'deptAirport',
			title : '起飞城市',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'arriAirport',
			title : '到达城市',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'cabin',
			title : '舱位',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'seatNo',
			title : '座位号',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'createDate',
			title : '值机时间',
			align : 'center',
			formatter : dateTimeFormater,
			width : 150
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#boardPassTable').datagrid('resize');
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

/** --------查看订单详情 ------ */
function getInfo(id, orderDate) {
}

/** -------- 导出 ------ */
function exportBoardpass() {
	var sdate = $('#startDate').datebox('getValue');
	var edate = $('#endDate').datebox('getValue');
	var data = $('#boardPassTable').datagrid('getData');
	var keys = ['start','end','startdate','enddate','psrName','flightDate','flightNo','deptAirport','rriAirport','cabin'];
	var values = ['0','100000',sdate,edate,$('#psrName').val(),$('#flightDate').val(),$('#flightNo').val(),$('#deptAirport').val(),$('#rriAirport').val(),$('#cabin').val()];
	var count = data.rows.length;
	if(count>0){
		openWindowWithPost('exportBoardPassInfoList.action',keys,values);
	}else{
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
	}
}


/** -------- 重置查询条件 ------ */
function queryBoardPass() {
	$('#conditionForm').form('clear');
	$('#sourceid').val('sdal');
	initDatebox();
}
