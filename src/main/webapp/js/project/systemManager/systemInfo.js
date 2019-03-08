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
}

/** --------初始化页面模块 ------ */
function initPage() {
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	// 加载表格     数据库信息查询
	$('#systemspaceTable').datagrid({
		url : 'queryTableSpaceInfo.action',
		checkOnSelect : true,// 是否选中/取消复选框
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		showHeader : true,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		singleSelect : true,// 是否只能选中一条
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
			$.messager.alert('错误提示', '数据加载失败!', 'error');
		},
		onLoadSuccess : function(data) {
		},
		columns : [ [ {
			field : 'physicalFilename',
			title : '物理文件名',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'tableSpaceName',
			title : '表空间名称',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'type',
			title : '类型',
			align : 'center',
			formatter : baseFormater,
			width : 50
		},  {
			field : 'tableSpaceSize',
			title : '区管理',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'tableSpaceSize',
			title : '表空间大小',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'usedM',
			title : '已使用',
			align : 'center',
			formatter : baseFormater,
			width : 50
		},{
			field : 'useRatio',
			title : '利用率',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}] ]
	});
	// 加载表格   数据库目前的进程数和最大里程数  
	$('#systemprocessTable').datagrid({
		url : 'queryProcessCount.action',
		checkOnSelect : true,// 是否选中/取消复选框
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		showHeader : true,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		singleSelect : true,// 是否只能选中一条
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
			$.messager.alert('错误提示', '数据加载失败!', 'error');
		},
		onLoadSuccess : function(data) {
		},
		columns : [ [  {
			field : 'currentProcess',
			title : '数据库目前的进程数',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'maxProcess',
			title : '进程数的上限',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}] ]
	});
	// 加载表格   当前用户正在使用的数据
	$('#systemuserdataTable').datagrid({
		url : 'queryUserDataInfo.action',
		checkOnSelect : true,// 是否选中/取消复选框
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		showHeader : true,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		singleSelect : true,// 是否只能选中一条
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
			$.messager.alert('错误提示', '数据加载失败!', 'error');
		},
		onLoadSuccess : function(data) {
		},
		columns : [ [ {
			field : 'osuser',
			title : 'osuser',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'username',
			title : 'username',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'time',
			title : 'time',
			align : 'center',
			formatter : baseFormater,
			width : 100
		},  {
			field : 'sqlFulltext',
			title : 'sqlFulltext',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'machine',
			title : 'machine',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}] ]
	});
	// 加载表格   数据库session使用情况
	$('#systemlicenseTable').datagrid({
		url : 'queryResourceLimit.action',
		checkOnSelect : true,// 是否选中/取消复选框
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		showHeader : true,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		singleSelect : true,// 是否只能选中一条
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
			$.messager.alert('错误提示', '数据加载失败!', 'error');
		},
		onLoadSuccess : function(data) {
		},
		columns : [ [ {
			field : 'resourceName',
			title : 'resourceName',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'limitValue',
			title : 'limitValue',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}] ]
	});
	// 加载表格 数据库session使用情况详细
	$('#systemlicense').datagrid({
		url : 'queryResourceLimit.action',
		checkOnSelect : true,// 是否选中/取消复选框
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		showHeader : true,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		singleSelect : true,// 是否只能选中一条
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
			$.messager.alert('错误提示', '数据加载失败!', 'error');
		},
		onLoadSuccess : function(data) {
		},
		columns : [ [ {
			field : 'sessionsMax',
			title : 'sessionsMax',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'sessionsWarning',
			title : 'sessionsWarning',
			align : 'center',
			formatter : baseFormater,
			width : 50
		},{
			field : 'sessionsCurrent',
			title : 'sessionsWarning',
			align : 'center',
			formatter : baseFormater,
			width : 50
		},{
			field : 'sessionsHighwater',
			title : 'sessionsWarning',
			align : 'center',
			formatter : baseFormater,
			width : 50
		},{
			field : 'usersMax',
			title : 'usersMax',
			align : 'center',
			formatter : baseFormater,
			width : 50
		},{
			field : 'cpuCoreCountCurrent',
			title : 'cpuCoreCountCurrent',
			align : 'center',
			formatter : baseFormater,
			width : 50
		},{
			field : 'cpuSocketCountCurrent',
			title : 'cpuSocketCountCurrent',
			align : 'center',
			formatter : baseFormater,
			width : 50
		},{
			field : 'cpuCountHighwater',
			title : 'cpuCountHighwater',
			align : 'center',
			formatter : baseFormater,
			width : 50
		},{
			field : 'cpuCoreCountHighwater',
			title : 'cpuCoreCountHighwater',
			align : 'center',
			formatter : baseFormater,
			width : 50
		},{
			field : 'cpuSocketCountHighwater',
			title : 'cpuSocketCountHighwater',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}] ]
	});
}

	
	
function ajaxTablesystemlicense() {
	
}
/** --------加载树形 ------ */
function ajaxTree() {
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#systemspaceTable').datagrid('resize');
	$('#systemprocessTable').datagrid('resize');
	$('#systemuserdataTable').datagrid('resize');
	$('#systemlicenseTable').datagrid('resize');
	$('#systemlicense').datagrid('resize');
	$('.easyui-panel').panel('resize');
};
/** --------查看详情 ------ */
function getInfo(index,flag) {
}
