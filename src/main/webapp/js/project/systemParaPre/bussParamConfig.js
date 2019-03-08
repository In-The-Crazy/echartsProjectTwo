/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面模块
	initPage();
	// 加载树型
	//ajaxTree();
	// 加载表格数据
	ajaxTable();
	
});

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_add = {
		id : "bussParamAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "bussParamEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#bussParamAdd').dialog('close');
	// 修改窗口
	initDialog(dialog_edit);
	$('#bussParamEdit').dialog('close');
	
}

/** --------加载表格数据 ------ */
function ajaxTable() {
	//验证表单参数
	var sflag = $("#conditionForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("conditionForm");
	
	// 加载表格
	$('#bussParamConfigTable').datagrid({
		url : root+'/bussParamConfig/queryBussParamConfig',
		toolbar : "#toolbar",
		checkOnSelect : false,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		showHeader : true,
		pageNumber : 1,
		pageSize : 20,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : false,// 是否只能选中一条
		queryParams : params,
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
			$.messager.alert('错误提示', '数据加载失败!', 'error');
		},
		onLoadSuccess : function(data) {},
		columns : [ [ {
			field : 'rownumbers',
			title : '',
			align : 'center',
			styler : rownumSytler,
			formatter : rownumFormater,
			width : 20
		}, {
			field : 'paramCode',
			title : '参数代码',
			align : 'center',
			formatter : baseFormater,
			width : 70
		}, {
			field : 'paramName',
			title : '参数名称',
			align : 'center',
			formatter : baseFormater,
			width : 70
		}, {
			field : 'paramValue',
			title : '参数值',
			align : 'center',
			formatter : baseFormater,
			width : 70
		},{
			field : 'remark',
			title : '说明',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'status',
			title : '操作',
			align : 'center',
			formatter : optFormater,
			width : 50
		} ] ]
	});
}

function optFormater(value, row, index) {
	var _id = "'"+row.paramId+"'";
	return '<a href="javascript:void(0)" onclick="optEdit(' + _id + ')">修改</a>';
};

function optEdit(paramId){
	$('#bussParamEdit').dialog('open');
	var bussParamConfigData;
	var re = {
		url :root+'/bussParamConfig/getBussParamConfigDetail',
		data : {
			paramId:paramId
		},
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				bussParamConfigData = data.obj;
			}
		}
	}
	sendAjaxRequest(re);
	$('#bussParamEdit').form('load',bussParamConfigData);
}

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

function bussParamReset(){
	$('#conditionForm').form('reset');
}

function bussParamAddReset(){
	$('#bussParamAddForm').form('reset');
}

//添加
function addBussParam(){
	//验证表单参数
	var sflag = $("#bussParamAddForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("bussParamAddForm");
	var re = {
		url :root+'/bussParamConfig/addBussParamConfig',
		data :params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				$('#bussParamConfigTable').datagrid('reload');
			}
			$('#bussParamAdd').dialog('close');
			showMessage(data);
			$('#bussParamAddForm').form('reset');
		}
	}
	sendAjaxRequest(re);
}

//修改
function eidtbussParam(){
	//验证表单参数
	var sflag = $("#bussParamEditForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("bussParamEditForm");
	var re = {
		url :root+'/bussParamConfig/editBussParamConfig',
		data :params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				$('#bussParamConfigTable').datagrid('reload');
			}
			$('#bussParamEdit').dialog('close');
			showMessage(data);
			$('#bussParamEditForm').form('reset');
		}
	}
	sendAjaxRequest(re);
}




