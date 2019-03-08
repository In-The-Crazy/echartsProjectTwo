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
	$('#add_endDate').datebox({
		required : false,
		width : '155'
	});
	$('#add_startDate').datebox({
		required : false,
		width : '155'
	});
	$('#edit_startDate').datebox({
		required : false,
		width : '155'
	});
	$('#edit_endDate').datebox({
		required : false,
		width : '155'
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_add = {
		id : "etermParamAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "etermParamEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#etermParamAdd').dialog('close');
	// 添加窗口
	initDialog(dialog_edit);
	$('#etermParamEdit').dialog('close');
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
	var codeValu1 = $('#add_paramValue').val();
	var codeValu2 = $('#add_paramStartValue').val();
	var codeValu3 = $('#add_paramEndValue').val();
	function checkEmpty(value){
		if(value !== null || value !== undefined || value !== ''){
			return true;
		}else{
			return false;
		}																				
	}
	if(!(checkEmpty(codeValu1)&&checkEmpty(codeValu2)&&checkEmpty(codeValu3))){
	 	$.messager.alert('错误提示', '“参数值”与“参数开始、参数结束值”必须填一项', 'error');
		return false;
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#etermParamPreTable').datagrid({
		url : 'etermParamPreList.action',
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
		singleSelect : false,// 是否只能选中一条
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
			field : 'paramId',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'paramType',
			title : '参数类型',
			align : 'center',
			formatter : function(value, row, index){
				var text = "";
				if(value == 'AIRPORT_TAX'){
					text = "机建税";
				}else if(value == 'FUEL_TAX'){
					text = "燃油税";
				}
				return text;
			},
			width : 75
		}, {
			field : 'paramValue',
			title : '参数值',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'paramStartValue',
			title : '参数开始值',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'paramEndValue',
			title : '参数结束值',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'returnValue',
			title : '配置返回值',
			align : 'center',
			width : 75
		}, {
			field : 'startDate',
			title : '参数有效开始日期',
			align : 'center',
			formatter : dateFormater,
			width : 100
		}, {
			field : 'endDate',
			title : '参数有效结束日期',
			align : 'center',
			formatter : dateFormater,
			width : 100
		}, {
			field : 'paramDesc',
			title : '参数描述',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'sourceid',
			title : '航空公司',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'state',
			title : '状态',
			align : 'center',
			formatter : imgStatusFormater,
			width : 75
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	$('#add_paramType').combobox({
		data: [{
			"id" : "AIRPORT_TAX",
			"text" : "机建税"
		},{
			"id" : "FUEL_TAX",
			"text" : "燃油税"
		}],
		valueField:'id',
		textField:'text'
	});
	$('#edit_paramType').combobox({
		data: [{
			"id" : "AIRPORT_TAX",
			"text" : "机建税"
		},{
			"id" : "FUEL_TAX",
			"text" : "燃油税"
		}],
		valueField:'id',
		textField:'text'
	});
	$('#add_state').combobox({
		data: [{
			"id" : "0",
			"text" : "无效"
		},{
			"id" : "1",
			"text" : "有效"
		}],
		valueField:'id',
		textField:'text'
	});
	$('#edit_state').combobox({
		data: [{
			"id" : "0",
			"text" : "无效"
		},{
			"id" : "1",
			"text" : "有效"
		}],
		valueField:'id',
		textField:'text'
	});
	$('#add_state').combobox('select', '1');
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#etermParamPreTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function realNameFormater(value, row, index) {
	var _id = "'" + row.userid + "'";
	if(isEmpty(value)){
		return '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"info")>--</a>';
	}
	return '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"info")>' + value + '</a>';
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
function getInfo(flag) {
	if(flag == 'edit'){
		var selecteds = $('#etermParamPreTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#etermParamPreTable').datagrid('getSelected')
		$("#edit_paramId").val(selected.paramId);
		$("#edit_paramType").combobox('select', selected.paramType);
		$("#edit_paramValue").val(selected.paramValue);
		$("#edit_paramStartValue").val(selected.paramStartValue);
		$("#edit_paramEndValue").val(selected.paramEndValue);
		$("#edit_returnValue").val(selected.returnValue);
		$("#edit_paramDesc").val(selected.paramDesc);
		$("#edit_startDate").datebox('setValue',selected.startDate);
		$("#edit_endDate").datebox('setValue',selected.endDate);
		$('#edit_state').combobox('select', selected.state);
		$("#edit_cfgRemark").val(selected.cfgRemark);
		
		$('#etermParamEdit').dialog('open');
	}
}

/** -------- 添加 ------ */
function addetermParam(){
	var params = serializeJson("etermParamAddForm");
	var add = {
		url : 'addEtermParam.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("etermParamPreTable");
			}
			$('#etermParamAdd').dialog('close');
			showMessage(data);
			SoftwareVersionAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editetermParam(){
	var params = serializeJson("etermParamEditForm");
	var add = {
		url : 'modifyEtermParam.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("etermParamPreTable");
			}
			$('#etermParamEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}

/** -------- 批量删除 ------ */
function deletermParam() {
	var selecteds = $('#etermParamPreTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#etermParamPreTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#etermParamPreTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].paramId);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = 'deleteEtermParam.action';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("etermParamPreTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}

/** -------- 重置查询条件 ------ */
function etermParamPreReset() {
	$('#conditionForm').form('clear');
	$('#codeType').val("");
	$('#state').val("");
	$('#sourceid').val('sdal');
}
function etermParamAddReset() {
	$('#etermParamAddForm').form('clear');
	$("#add_state").combobox('select','1');
}
