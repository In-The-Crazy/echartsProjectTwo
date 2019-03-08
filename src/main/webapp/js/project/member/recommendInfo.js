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
	$('#startdate').datebox({
		required : false
	});
	$('#enddate').datebox({
		required : false
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
			$.messager.alert('错误提示', '获取积分起始日期不能大于获取积分截止日期', 'error');
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
	// 加载表格
	$('#recommendTable').datagrid({
		url : 'recommendList.action',
		toolbar : "#toolbar",
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		showHeader : true,
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
		},
		columns : [ [ {
			field : 'rownumbers',
			title : '',
			align : 'center',
			styler : rownumSytler,
			formatter : rownumFormater,
			width : 25
		}, {
			field : 'recommendUserId',
			checkbox : 'true',
			hidden : true,
			align : 'center',
			width : 25
		}, {
			field : 'recommendName',
			title : '推荐人',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'recommendMobile',
			title : '推荐人手机号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'recommendCode',
			title : '推荐注册码',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'registerName',
			title : '被邀请人',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'registerMobile',
			title : '被邀请人手机号',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'recommendPoints',
			title : '获取积分',
			align : 'center',
			formatter : baseFormater,
			width : 100
		},  {
			field : 'createDate',
			title : '获取时间',
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
	$('#recommendTable').datagrid('resize');
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

/** --------查看会员详情 ------ */
function getInfo(id, flag) {
}

/** -------- 导出 ------ */
function exportMember() {
	var data = $('#recommendTable').datagrid('getData');
	var sdate = $('#startdate').datebox('getValue');
	var edate = $('#enddate').datebox('getValue');
	var keys = ['start','end','startdate','enddate','recommendInfoPara.name','recommendInfoPara.mobile','realName','mobile'];
	var values = ['0','100000',sdate,edate,$('#recommendName').val(),$('#recommendNumber').val(),$('#recommend').val(),$('#recommendMobile').val()];
	var count = data.rows.length;
	if(count>0){
		openWindowWithPost('exportRecommendList.action',keys,values);
	}else{
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
	}
}

/** -------- 重置查询条件 ------ */
function queryOrderReset() {
	$('#conditionForm').form('clear');
	$('#sourceid').val('sdal');
	initDatebox();
}
