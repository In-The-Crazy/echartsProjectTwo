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
		label : '购保成功时间：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		editable : false,
		required : false
	});
	$('#endDate').datebox({
		label : '至：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		editable : false,
		required : false
	});
	$('#refStartDate').datebox({
		label : '退保时间：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		editable : false,
		required : false
	});
	$('#refEndDate').datebox({
		label : '至：',
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
	$('#refStartDate').datebox('setValue',first);
	$('#refEndDate').datebox('setValue',today);
}

/** --------初始化页面模块 ------ */
function initPage() {
	$("#ordercode").textbox({
		label : '订单号：',
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
	$("#applicantName").textbox({
		label : '被保人：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#idCard").textbox({
		label : '证件号：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
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
	$('#insuranceTable').datagrid({
		url : root + '/insurance/queryInsuranceInfoList',
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
			console.log("11111");
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
			field : 'ordercode',
			title : '订单编号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'insNo',
			title : '保单号',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'insuredName',
			title : '被保人',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'insuredMobile1',
			title : '证件号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},{
			field : 'insuredMobile',
			title : '航班号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},{
			field : 'insuredMobile2',
			title : '航段序号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},{
			field : 'insuredMobile3',
			title : '航段',
			align : 'center',
			formatter : function(value,row,index){
				return row.afrom+row.ato;
			},
			width : 75
		},{
			field : 'insuredMobile4',
			title : '乘机日期',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},{
			field : 'insuredMobile5',
			title : '承保时间',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},{
			field : 'insuredMobile6',
			title : '退保时间',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},{
			field : 'buyTotalPrice',
			title : '保单费用',
			align : 'center',
			formatter : baseNumFormater,
			width : 50
		}, {
			field : 'insType',
			title : '保险种类',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},{
			field : 'insuranceCompanyName',
			title : '保险公司',
			align : 'center',
			formatter : baseFormater,
			width : 200
		},{
			field : 'status',
			title : '保险状态',
			align : 'center',
			formatter : insuranceStatusFormater,
			width : 75
		},   {
			field : '备注',
			title : '保险日期',
			align : 'center',
			formatter : baseFormater,
			width : 150
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
			"text" : "全部",
			"selected": true
		},{
			"id" : "0",
			"text" : "购买失败"
		},{
			"id" : "1",
			"text" : "购买成功"
		},{
			"id" : "2",
			"text" : "退保拒绝"
		},{
			"id" : "3",
			"text" : "退保申请中"
		},{
			"id" : "4",
			"text" : "退保审核中"
		},{
			"id" : "5",
			"text" : "退保完成"
		},{
			"id" : "6",
			"text" : "线下退保完成"
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
	$('#insuranceTable').datagrid('resize');
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
function exportInsurance() {
	var data = $('#insuranceTable').datagrid('getData');
	var sdate = $('#startDate').datebox('getValue');
	var edate = $('#endDate').datebox('getValue');
	var keys = ['start','end','startdate','enddate','insuredName','ticketNo','status','ordercode'];
	var values = ['0','100000',sdate,edate,$('#insuredName').val(),$('#ticketNo').val(),$('#status').val(),$('#ordercode').val()];
	var count = data.rows.length;
	if(count>0){
		openWindowWithPost(root + '/insurance/exportInsuranceInfoList',keys,values);
	}else{
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
	}
}

/** -------- 重置查询条件 ------ */
function queryInsurance() {
	$('#conditionForm').form('clear');
	$('#sourceid').val('sdal');
	initDatebox();
}
