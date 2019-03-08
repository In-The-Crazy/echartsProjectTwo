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
		label : '起始日期：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		editable : false,
		required : false
	});
	$('#enddate').datebox({
		label : '截止日期：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		editable : false,
		required : false
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	$("#title").textbox({
		label : '标题：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	
	var dialog_add = {
		id : "smsListAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "smsListEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#smsListAdd').dialog('close');
	// 修改窗口
	initDialog(dialog_edit);
	$('#smsListEdit').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var sdate = $('#startdate').datebox('getValue');
	var edate = $('#enddate').datebox('getValue');
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		sdate = sdate.replace(/-/g, '');
		edate = edate.replace(/-/g, '');
		if (parseInt(sdate) > parseInt(edate)) {
			$.messager.alert('错误提示', '开始日期不能大于截止日期', 'error');
			return false;
		}
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#smsListTable').datagrid({
		url : root+'/business/querySms',
		toolbar : '#toolbar',
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
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
			field : 'title',
			title : '标题',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'message',
			title : '内容',
			align : 'center',
			formatter : baseFormater,
			width : 250
		}, {
			field : 'createOp',
			title : '发布人',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'createDate',
			title : '发布时间',
			align : 'center',
			formatter : baseFormater,
			width : 100
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#smsListTable').datagrid('resize');
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
function getInfo(flag) {
	if(flag == 'edit'){
		var selecteds = $('#smsListTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#smsListTable').datagrid('getSelected')
		$("#edit_id").val(selected.id);
		$("#edit_title").val(selected.title);
		$("#edit_message").val(selected.message);
		
		$('#smsListEdit').dialog('open');
	}
}

/** -------- 添加 ------ */
function addsmsList(){
	var params = serializeJson("smsListAddForm");
	var add = {
		url : root+'/business/addSms',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("smsListTable");
			}
			$('#smsListAdd').dialog('close');
			showMessage(data);
			smsListAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editsmsList(){
	var params = serializeJson("smsListEditForm");
	var add = {
		url : root+'/business/updateSms',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("smsListTable");
			}
			$('#smsListEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}
/** -------- 批量删除 ------ */
function delsmsList() {
	var selecteds = $('#smsListTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#smsListTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#smsListTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].id);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root+'/business/deleteSms';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("smsListTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}

/** -------- 推送 ------ */
function pushNotice(){
	var selecteds = $('#smsListTable').datagrid('getSelections');
	if(selecteds.length!=1){
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	var selected = $('#smsListTable').datagrid('getSelected');
	$.messager.confirm('推送提示', '是否确认推送? ', function(r) {
		if (r) {
			var push = {
				url : root+'/business/pushSms',
				data : {
					'id' : selected.id
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("smsListTable");
					}
					showMessage(data);
				}
			}
			sendAjaxRequest(push);
		}
	});
}

/** -------- 重置查询条件 ------ */
function smsListReset() {
	$('#conditionForm').form('reset');
	$('#sourceid').val('sdal');
}
function smsListAddReset() {
	$('#smsListAddForm').form('reset');
}
