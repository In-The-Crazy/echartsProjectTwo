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
			$.messager.alert('错误提示', '下载起始日期不能大于下载截止日期', 'error');
			return false;
		}
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#downloadMessageTable').datagrid({
		url : 'downloadMessageList.action',
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
			width : 8
		}, {
			field : 'id',
			checkbox : 'true',
			align : 'center',
			hidden : true,
			width : 25
		}, {
			field : 'version',
			title : '下载格式',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'time',
			title : '下载时间',
			align : 'center',
			formatter : dateTimeFormater,
			width : 75
		}, {
			field : 'ip',
			title : '下载IP',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'froms',
			title : '下载来源',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'media',
			title : '下载渠道',
			align : 'center',
			formatter : baseFormater,
			width : 75
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	//查询-下载渠道
	var queryBank = {
		url : 'queryDownAddrTree.action',
		callBackFun : function(data) {
			$('#data').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 155
			});
		}
	}
	sendAjaxRequest(queryBank);
	
	//下载格式
	$('#version').combobox({
		data : [{
			"id" : "",
			"text" : "全部"
		},{
			"id" : "ipa",
			"text" : "苹果"
		},{
			"id" : "apk",
			"text" : "安卓"
		}],
		valueField:'id',
		textField:'text',
		width : 155
	});
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#downloadMessageTable').datagrid('resize');
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
function exportMetDownmessage() {
	var data = $('#downloadMessageTable').datagrid('getData');
	var sdate = $('#startdate').datebox('getValue');
	var edate = $('#enddate').datebox('getValue');
	var keys = ['start','end','startdate','enddate','data','version'];
	var values = [0,60000,sdate,edate,$('#data').combobox("getValue"),$('#version').combobox("getValue")];
	var count = data.rows.length;
	if(count>0){
		openWindowWithPost('exportMetDownmessage.action',keys,values);
	}else{
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
	}
}

/** -------- 重置查询条件 ------ */	
function downloadReset() {
	$("#conditionForm").form("clear");
	$('#version').combobox('setValue','');
	$('#sourceid').val('sdal');
	initDatebox();
}
