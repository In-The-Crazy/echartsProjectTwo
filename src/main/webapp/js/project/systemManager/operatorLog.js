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
	
	$('#startdate').datebox({
		label : '起始日期：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		value : first,
		editable : false,
		required : false
	});
	$('#enddate').datebox({
		label : '截止日期：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		value : today,
		editable : false,
		required : false
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	$("#accountCondition").textbox({
		label : '帐号：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
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
			$.messager.alert('错误提示', '参数有效起始日期不能大于参数有效截止日期', 'error');
			return false;
		}
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#operatorLogTable').datagrid({
		url : root + '/common/queryOperatorLogList',
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
			hidden : true,
			align : 'center',
			width : 25
		}, {
			field : 'opaccount',
			title : '帐号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'opname',
			title : '姓名',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'createTime',
			title : '时间',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'logData',
			title : '操作类型',
			align : 'center',
			formatter : function(value, row, index){
				var text = "--";
				if(value == "1"){
					text = "退出系统";
				}
				if(value == "2"){
					text = "添加";
				}
				if(value == "3"){
					text = "修改";
				}
				if(value == "4"){
					text = "删除";
				}
				if(value == "5"){
					text = "查询";
				}
				if(value == "0"){
					text = "登录系统";
				}
				return text;
			},
			width : 75
		}, {
			field : 'logContent',
			title : '内容',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	$('#data').combobox({
		label : '类型：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data: [{
			"id" : "",
			"text" : "全部",
			"selected": true
		},{
			"id" : "0",
			"text" : "登录系统"
		},{
			"id" : "1",
			"text" : "退出系统"
		},{
			"id" : "2",
			"text" : "添加"
		},{
			"id" : "3",
			"text" : "修改"
		},{
			"id" : "4",
			"text" : "删除"
		},{
			"id" : "5",
			"text" : "查询"
		}],
		valueField:'id',
		textField:'text'
	});
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#operatorLogTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function optFormater(value, row, index) {
	var _index = "'" + index + "'";
	return '<a href="javascript:void(0);" onclick=getInfo('+_index+',"info")>详情</a>';
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

/** --------查看详情 ------ */
function getInfo(index,flag) {
}


function exportOperatorLog(){
	var data = $('#operatorLogTable').datagrid('getData');
	var sdate = $('#startdate').datebox('getValue');
	var edate = $('#enddate').datebox('getValue');
	var accountCondition = $('#accountCondition').val();
	var type = $('#data').val();
	
	var keys = ['start','end','startdate',"enddate",'accountCondition','data'];
	var values = ['0','60000',sdate,edate,accountCondition,type];
	var count = data.rows.length;
	if(count>0){
		openWindowWithPost('exportOperatorLogList.action',keys,values);
	}else{
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
	}
}

/** -------- 重置查询条件 ------ */
function operatorLogReset() {
	$('#conditionForm').form('reset');
	initDatebox()
	$("#sourceid").val("sdal");
	$('#data').val("");
}

/** -------- 导出 ------ */
function exportOperatorLog() {
	var data = $('#operatorLogTable').datagrid('getData');
	var paper = $('#operatorLogTable').datagrid('getPager').pagination("options");
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
				openWindowWithJson(root +'/common/exportOperatorLog',params);
			}
		});
	}else{
		params["start"] = 1;
		params["end"] = paper.total;
		//return false;
		openWindowWithJson(root +'/common/exportOperatorLog',params);
	}
}