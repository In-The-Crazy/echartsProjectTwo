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
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_add = {
		id : "SoftwareVersionAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "SoftwareVersionEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#SoftwareVersionAdd').dialog('close');
	// 添加窗口
	initDialog(dialog_edit);
	$('#SoftwareVersionEdit').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#softwareVersionPreTable').datagrid({
		url : 'softwareVersionPreList.action',
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
			width : 10
		}, {
			field : 'id',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'softwareVersion',
			title : '软件版本号',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'upgradeDesc',
			title : '升级提示',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'upgradeUrl',
			title : '升级路径',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'status',
			title : '状态',
			align : 'center',
			formatter : function(value, row, index){
				var text = "--";
				if(value=="0"){
					text = "升级提醒";
				}
				if(value=="1"){
					text = "必须升级";
				}
				return text;
			},
			width : 50
		}, {
			field : 'createDate',
			title : '创建时间',
			align : 'center',
			formatter : dateTimeFormater,
			width : 75
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	//状态
	$('#add_status').combobox({
		data: [{
			"id" : "0",
			"text" : "升级提醒"
		},{
			"id" : "1",
			"text" : "必须升级"
		}],
		valueField:'id',
		textField:'text'
	});
	$('#add_status').combobox('select', '0');
	
	$('#edit_status').combobox({
		data: [{
			"id" : "0",
			"text" : "升级提醒"
		},{
			"id" : "1",
			"text" : "必须升级"
		}],
		valueField:'id',
		textField:'text'
	});
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#softwareVersionPreTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function optFormater(value, row, index) {
	var _id = "'" + row.id + "'";
	return '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"info")>详情</a>';
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
		var selecteds = $('#softwareVersionPreTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#softwareVersionPreTable').datagrid('getSelected');
		$("#edit_id").val(selected.id);
		$("#edit_softwareVersion").val(selected.softwareVersion);
		$("#edit_upgradeDesc").val(selected.upgradeDesc);
		$("#edit_upgradeUrl").val(selected.upgradeUrl);
		$('#edit_status').combobox('select', selected.status);
		
		$('#SoftwareVersionEdit').dialog('open');
	}
}

/** -------- 添加 ------ */
function addSoftwareVersion(){
	var params = serializeJson("SoftwareVersionAddForm");
	var add = {
		url : 'addVersion.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("softwareVersionPreTable");
			}
			$('#SoftwareVersionAdd').dialog('close');
			showMessage(data);
			SoftwareVersionAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editSoftwareVersion(){
	var params = serializeJson("SoftwareVersionEditForm");
	var add = {
		url : 'modifyVersion.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("softwareVersionPreTable");
			}
			$('#SoftwareVersionEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}

/** -------- 批量删除 ------ */
function delsoftwareVersion() {
	var selecteds = $('#softwareVersionPreTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#softwareVersionPreTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#softwareVersionPreTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].id);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = 'deleteVersion.action';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("softwareVersionPreTable");
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
function SoftwareVersionAddReset() {
	$('#SoftwareVersionAddForm').form('clear');
	$('#add_status').combobox('select', '0');
}
