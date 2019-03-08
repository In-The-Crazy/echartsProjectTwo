/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面菜单
	initPage();
	// 加载表格数据
	ajaxTable();
	// 加载树型
	ajaxTree();

});

function initPage() {
	var dialog_add = {
		id : "menuAdd",
		title : "增加菜单信息"
	}
	var dialog_edit = {
		id : "menuEdit",
		title : "修改菜单信息"
	}
	var dialog_info = {
		id : "menuInfo",
		title : "查看菜单信息"
	}
	// 新增窗口
	initDialog(dialog_add);
	$('#menuAdd').dialog('close');
	// 编缉窗口
	initDialog(dialog_edit);
	$('#menuEdit').dialog('close');
	// 查看窗口
	initDialog(dialog_info);
	$('#menuInfo').dialog('close');

}
/** --------加载表格数据 ------ */
function ajaxTable() {
	// 加载表格
	$('#menuTable').datagrid({
		url : root + '/queryMenuList',
		method : 'GET',
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
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
			alert('数据加载失败!');
		},
		onLoadSuccess : function(data) {
		},
		columns : [ [ {
			field : 'menu_type_id',
			checkbox : 'true',
			width : 20
		}, {
			field : 'menu_name',
			title : '菜单名称',
			width : 200
		}, {
			field : 'resource_url',
			title : '菜单路径',
			width : 200
		}, {
			field : 'parent',
			title : '父菜单',
			width : 100,
			formatter : parentidFormater
		}, {
			field : 'opt',
			formatter : optFormater,
			width : 200
		} ] ]
	})

}

/**
 * 加载树型
 */
function ajaxTree() {
	var options = {
		url : root + '/treeParentMenuList',
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				$('#addTree').combotree({
					data : data.treeList
				});
				$('#infoTree').combotree({
					data : data.treeList
				});
				$('#editTree').combotree({
					data : data.treeList
				});
			}
		}
	}
	sendAjaxRequest(options);
}

/**
 * 设置操作列的信息 row 当前行的数据 index 当前行的索引 从0 开始
 */
function optFormater(value, row, index) {
	var _id = "'" + row.menu_type_id + "'";
	var detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"info")>详细</a> |  ';
	var edit = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"edit")>修改</a>';
	return detail + edit;
};

function parentidFormater(value, row, index) {
	if (!isEmpty(row.parent)) {
		return value;
	} else {
		return "顶层菜单";
	}
};
function getInfo(id, flag) {
	var url = root + '/queryMenu?menuTypeId=' + id;
	var options = {
		url : url,
		callBackFun : function(data) {
			if (flag == 'edit') {
				// 加载菜单信息
				$("#id").val(data.obj.menu_type_id);
				$("#edit_menu_name").val(data.obj.menu_name);
				$("#edit_action_name").val(data.obj.action_name);
				$("#edit_resource_url").val(data.obj.resource_url);
				$("#editTree").combotree("setValue", data.obj.parent_id);
				// 打开菜单编缉页面
				$('#menuEdit').dialog('open');

			} else {
				// 加载菜单信息
				$("#info_menu_name").val(data.obj.menu_name);
				$("#info_action_name").val(data.obj.action_name);
				$("#info_resource_url").val(data.obj.resource_url);
				$("#infoTree").combotree("setValue", data.obj.parent_id);
				// 打开菜单查看页面
				$('#menuInfo').dialog('open');
			}

		}
	}
	sendAjaxRequest(options);
}

// 执行用户添加操作
function openAddMenu() {
	$("#addTree").combotree("setValue", "0");
	$('#menuAdd').dialog('open');
}
// 执行用户添加操作
function addMenu() {
	var pid = $("#addTree").combotree('getValue');
	var options = {
		url : root + '/insertMenu',// 请求的action路径
		data : $("#menuAddForm").serialize(),
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				resetAddForm();
				reloadTable("menuTable");
				$('#menuAdd').dialog('close');
				ajaxTree();
			}
			showMessage(data);
		}
	};
	sendAjaxRequest(options);
}

// 执行用户编辑操作
function editMenu() {
	var pid = $("#editTree").combotree('getValue');
	var id = $("#id").val();
	if (pid == id) {
		$.messager.alert('错误提示', "选父节点不能是自己本身,请重新修改...", 'error');
		return false
	}
	var options = {
		url : root + '/updateMenu',// 请求的action路径
		data : $("#menuEditForm").serialize(),
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("menuTable");
				$('#menuEdit').dialog('close');
				ajaxTree();
			}
			showMessage(data);
		}
	};
	sendAjaxRequest(options);
}

/**
 * 批量操作
 * 
 * @return
 */
function batchDelMenu() {
	if ($('#menuTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#menuTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].menu_type_id);
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '你确定永久删除该数据吗? ',
				function(r) {
					// 首先如果用户选择了数据，则获取选择的数据集合
					if (r) {
						var url = root + '/deleteMenu';
						var options = {
							url : url,
							data : {
								"menuTypeIds" : dpid,
								operid : $("#addOperId").val()
							},
							callBackFun : function(data) {
								if (data.isSuccessOrfail == "SUCCESS") {
									reloadTable("menuTable");
									ajaxTree();
								}
								showMessage(data);
							}
						}
						sendAjaxRequest(options);
					}
				});
	}
}

function resetAddForm() {
	$('#addReset').click();
	$("#addTree").combotree("setValue", "0");
}
