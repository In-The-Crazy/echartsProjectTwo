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
		id : "aircraftTypeAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "aircraftTypeEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#aircraftTypeAdd').dialog('close');
	// 添加窗口
	initDialog(dialog_edit);
	$('#aircraftTypeEdit').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#aircraftTypeTable').datagrid({
		url : 'aircraftTypeList.action',
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
			width : 15
		}, {
			field : 'id',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'aircraftTypeName',
			title : '机型名称',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'type',
			title : '类型',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'maxSeatCount',
			title : '最大座位数',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'minSeatCount',
			title : '最小座位数',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		}, {
			field : 'aircraftTypeCode',
			title : '机型code',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		}, {
			field : 'picturePath',
			title : '图片路径',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'webviewPath',
			title : 'webview路径',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'prompt',
			title : '提示',
			align : 'center',
			formatter : baseFormater,
			width : 75
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#aircraftTypeTable').datagrid('resize');
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
function getInfo(flag) {
	if(flag == 'edit'){
		var selecteds = $('#aircraftTypeTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#aircraftTypeTable').datagrid('getSelected')
		$("#edit_id").val(selected.id);
		$("#edit_aircraftTypeName").val(selected.aircraftTypeName);
		$("#edit_type").val(selected.type);
		$("#edit_maxSeatCount").val(selected.maxSeatCount);
		$("#edit_minSeatCount").val(selected.minSeatCount);
		$("#edit_picturePath").val(selected.picturePath);
		$("#edit_aircraftTypeCode").val(selected.aircraftTypeCode);
		$("#edit_prompt").val(selected.prompt);
		$("#edit_webviewPath").val(selected.webviewPath);
		
		$('#aircraftTypeEdit').dialog('open');
	}
}

/** -------- 添加 ------ */
function addaircraftType(){
	var addflag = $("#aircraftTypeAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("aircraftTypeAddForm");
	var add = {
		url : 'addAircraftType.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("aircraftTypeTable");
			}
			$('#aircraftTypeAdd').dialog('close');
			showMessage(data);
			SoftwareVersionAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editaircraftType(){
	var editflag = $("#aircraftTypeEditForm").form('validate');
	if(!editflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("aircraftTypeEditForm");
	var add = {
		url : 'modifyAircraftType.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("aircraftTypeTable");
			}
			$('#aircraftTypeEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}

/** -------- 批量删除 ------ */
function delaircraftType() {
	var selecteds = $('#aircraftTypeTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#aircraftTypeTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#aircraftTypeTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].id);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = 'deleteAircraftType.action';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("aircraftTypeTable");
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
function aircraftTypeReset() {
	$('#queryReset').click();
	$('#sourceid').val('sdal');
	initDatebox();
}
function aircraftTypeAddReset() {
	$('#addReset').click();
}
