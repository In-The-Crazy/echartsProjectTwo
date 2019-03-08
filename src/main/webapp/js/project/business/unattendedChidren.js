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
	$('#add_fdate').datebox({
		required : true,
		width : 155
	});
	$('#edit_fdate').datebox({
		required : true,
		width : 155
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_add = {
		id : "chidrenAdd",
		title : "添加无陪儿童"
	};
	var dialog_edit = {
		id : "chidrenEdit",
		title : "修改无陪儿童"
	};
	var dialog_info = {
		id : "chidrenInfo",
		title : "无陪儿童图片"
	};

	// 添加窗口
	initDialog(dialog_add);
	$('#chidrenAdd').dialog('close');
	// 修改窗口
	initDialog(dialog_edit);
	$('#chidrenEdit').dialog('close');
	// 详情窗口
	initDialog(dialog_info);
	$('#chidrenInfo').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#unattendedChidrenTable').datagrid({
		url : 'unattendedChidrenList.action',
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
			field : 'id',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'fnumber',
			title : '航班号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'fdate',
			title : '航班日期',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'childName',
			title : '儿童姓名',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'receiverName',
			title : '接机人姓名',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'receiverMobile',
			title : '接机人手机',
			align : 'center',
			width : 75
		}, {
			field : 'receiverAddress',
			title : '接机人地址',
			align : 'center',
			width : 150
		}, {
			field : 'senderName',
			title : '送机人姓名',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'senderMobile',
			title : '送机人手机',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'senderAddress',
			title : '送机人地址',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'onPic',
			title : '图片',
			align : 'center',
			formatter : onPicFormater,
			width : 75
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#unattendedChidrenTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function onPicFormater(value, row, index) {
	var _index = "'" + index + "'";
	return '<a href="javascript:void(0);" onclick=getInfo(' + _index + ',"info")>查看</a>';
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
function getInfo(index, flag) {
	if(flag == 'edit'){
		var selecteds = $('#unattendedChidrenTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#unattendedChidrenTable').datagrid('getSelected');
		// 加载角色信息
		$("#edit_id").val(selected.id);
		$("#edit_fnumber").val(selected.fnumber);
		$('#edit_fdate').datebox('setValue',selected.fdate);
		$("#edit_childName").val(selected.childName);
		$("#edit_receiverName").val(selected.receiverName);
		$("#edit_receiverMobile").val(selected.receiverMobile);
		$("#edit_receiverAddress").val(selected.receiverAddress);
		$("#edit_senderName").val(selected.senderName);
		$("#edit_senderMobile").val(selected.senderMobile);
		$("#edit_senderAddress").val(selected.senderAddress);
		// 打开角色编缉页面
		$('#chidrenEdit').dialog('open');
	}
	if(flag == 'info'){
		$("#unattendedChidrenTable").datagrid('selectRow',index);
		var selected = $('#unattendedChidrenTable').datagrid('getSelected');
		$("#chidrenInfoAccordion").accordion('select','候机');
		// 加载角色信息
		$("#info_seatPic").attr('src',selected.seatPic);
		$("#info_onPic").attr('src',selected.onPic);
		$("#info_stopPic").attr('src',selected.stopPic);
		$("#info_offPic").attr('src',selected.offPic);
		// 打开角色编缉页面
		$('#chidrenInfo').dialog('open');
	}
}

/** -------- 添加 ------ */
function addChidren(){
	//验证表单参数
	var sflag = $("#chidrenAddForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("chidrenAddForm");
	var add = {
		url : 'addUnattendedChildren.action',// 请求的action路径
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				resetAddForm();
				reloadTable("unattendedChidrenTable");
				$('#chidrenAdd').dialog('close');
			}
			showMessage(data);
		}
	};
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editChidren(){
	//验证表单参数
	var sflag = $("#chidrenEditForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("chidrenEditForm");
	var edit = {
		url : 'updateUnattendedChildren.action',// 请求的action路径
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("unattendedChidrenTable");
				$('#chidrenEdit').dialog('close');
			}
			showMessage(data);
		}
	};
	sendAjaxRequest(edit);
}

/** -------- 删除 ------ */
function delChidren() {
	var selecteds = $('#unattendedChidrenTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#unattendedChidrenTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#unattendedChidrenTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].id);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除?', function(r) {
			if (r) {
				var options = {
					url : 'deleteUnattendedChildren.action',// 请求的action路径
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("unattendedChidrenTable");
						}
						showMessage(data);
					}
				};
				sendAjaxRequest(options);
			}
		});
	}
}

/** -------- 导出 ------ */
function exportChidren() {

	var data = $('#unattendedChidrenTable').datagrid('getData');
	var receiverName = $('#receiverName').val();
	var childName = $('#childName').val();
	var senderName = $('#senderName').val();
	var keys = ['start','end','childName','receiverName','senderName'];
	var values = ['0','60000',childName,receiverName,senderName];
	var count = data.rows.length;
	if(count>0){
		openWindowWithPost('exportChildList.action',keys,values);
	}else{
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
	}
}

/** -------- 重置查询条件 ------ */
function chidrenReset() {
	$("#conditionForm").form("reset");
	$('#sourceid').val('sdal');
}
function resetAddForm() {
	$("#chidrenAddForm").form("reset");
	$('#add_status').val('1');
}
