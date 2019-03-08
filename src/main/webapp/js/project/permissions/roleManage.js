/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面角色
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
	$("#roleName").textbox({
		label : '角色名称：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#comments").textbox({
		label : '角色备注：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	
	var dialog_add = {
		id : "roleAdd",
		title : "增加角色信息"
	}
	var dialog_edit = {
		id : "roleEdit",
		title : "修改角色信息"
	}
	// 新增窗口
	initDialog(dialog_add);
	$('#roleAdd').dialog('close');
	// 编缉窗口
	initDialog(dialog_edit);
	$('#roleEdit').dialog('close');

}

/** --------加载表格数据 ------ */
function ajaxTable() {
	var sdate = $('#startdate').datebox('getValue');
	var edate = $('#enddate').datebox('getValue');
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		sdate = sdate.replace(/-/g, '');
		edate = edate.replace(/-/g, '');
		if (parseInt(sdate) > parseInt(edate)) {
			$.messager.alert('错误提示', '支付开始日期不能大于支付截止日期', 'error');
			return false;
		}
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#roleTable').datagrid({
		url : root + '/role/queryRoleList',
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
			alert('数据加载失败!');
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
			field : 'roleId',
			checkbox : 'true',
			align : 'center',
			width : 20
		}, {
			field : 'roleName',
			title : '角色名称',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'createTime',
			title : '创建时间',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'createPerson',
			title : '创建人',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'comments',
			title : '角色注释',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'sourceName',
			title : '所属机构',
			align : 'center',
			formatter : baseFormater,
			width : 100
		} ] ]
	})

}

/**
 * 加载树型
 */
function ajaxTree() {
	$('#add_sourceId').combobox({
		data: [{
			'id' : 'sdal',
			'text' : '河北航空'
		}],
		valueField:'id',
		textField:'text',
		required : true
	});
	$('#add_sourceId').combobox('select','sdal');
	
	$('#edit_sourceId').combobox({
		data: [{
			'id' : 'sdal',
			'text' : '河北航空'
		}],
		valueField:'id',
		textField:'text',
		required : true
	});
	$('#edit_sourceId').combobox('select','sdal');
	
	var add = {
		url : root + '/menu/listAllMenu',
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				$('#add_optypeIds').combotree({
					checkbox : true,
					multiple : true,
					data : data.treeList,
					width : 250,
					required : true
				});
				$('#edit_optypeIds').combotree({
					checkbox : true,
					multiple : true,
					data : data.treeList,
					width : 250,
					required : true
				});
			}
		}
	}
	sendAjaxRequest(add);
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#roleTable').datagrid('resize');
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

function getInfo(flag) {
	if(flag == 'edit'){
		var selecteds = $('#roleTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#roleTable').datagrid('getSelected');
		var options = {
			url : root + '/role/viewRoleInfo',
			data : {
				'roleId' : selected.roleId
			},
			callBackFun : function(data) {
				// 加载角色信息
				$("#edit_roleId").val(data.obj.roleId);
				$("#edit_roleName").val(data.obj.roleName);
				$("#edit_comments").val(data.obj.comments);
				var list = data.message.split(",");
				$('#edit_optypeIds').combotree('setValues',list);
				// 打开角色编缉页面
				$('#roleEdit').dialog('open');
			}
		}
		sendAjaxRequest(options);
	}
}

/** -------- 删除 ------ */
function deleteRole() {
	var selecteds = $('#roleTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#roleTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#roleTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].roleId);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除?', function(r) {
			if (r) {
				var options = {
					url : root + '/role/deleteRole',// 请求的action路径
					data : {
						"roleIds" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							resetAddForm();
							reloadTable("roleTable");
							ajaxTree();
						}
						showMessage(data);
					}
				};
				sendAjaxRequest(options);
			}
		});
	}
}

// 执行用户添加操作
function addRole() {
	//验证表单参数
	var sflag = $("#roleAddForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJsonForRole("roleAddForm","add");
	var add = {
		url : root + '/role/saveRole',// 请求的action路径
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				resetAddForm();
				reloadTable("roleTable");
				$('#roleAdd').dialog('close');
				ajaxTree();
			}
			showMessage(data);
		}
	};
	sendAjaxRequest(add);
}

// 执行角色编辑操作
function editRole() {
	//验证表单参数
	var sflag = $("#roleEditForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJsonForRole("roleEditForm","edit");
	var edit = {
		url : root + '/role/updateRole',// 请求的action路径
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("roleTable");
				$('#roleEdit').dialog('close');
				ajaxTree();
			}
			showMessage(data);
		}
	};
	sendAjaxRequest(edit);
}

/**
 * 以JSON的形式格式化参数
 */
function serializeJsonForRole(formId,flag){
	var params = $("#"+formId).serializeArray();
	var list = "{";
	$.each(params, function(i, field){
		var result =  iGetInnerText(field.value);
		if(field.name != 'optypeIds'){
			list += "'" + field.name + "':'" + result + "',";
		}
	});
	var t;
	if(flag == "add"){
		t = $('#add_optypeIds').combotree('tree');
	}
	if(flag == "edit"){
		t = $('#edit_optypeIds').combotree('tree');
	}
	var a = t.tree('getChecked',['checked', 'indeterminate']);
	list += "'optypeIds':'";
	$.each(a, function(i, field){
		list += field.id + ",";
	});
	list = list.substring(0,list.length-1);
	list += "'}";
	var result = eval('('+ list +')');
	return result;
}

function roleReset() {
	$("#conditionForm").form("clear");
	$('#sourceid').val('sdal');
}

function resetAddForm() {
	$("#roleAddForm").form("clear");
	$('#add_sourceId').combobox('select','sdal');
}
