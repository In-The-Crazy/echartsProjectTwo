/** -------- 初始化 ------ */
$(function() {
	// 初始化页面角色
	initPage();
	// 初始化表单
	initForm();
	// 加载树型
	ajaxTree();
	// 加载表格数据
	ajaxTable();

});

/** -------- 初始化页面角色 ------ */
function initPage() {
	var dialog_add = {
		id : "operatorAdd",
		title : "添加操作员"
	}
	var dialog_editPWD = {
			id : "eidtPWD",
			title : "修改密码"
	}
	var dialog_edit = {
		id : "operatorEdit",
		title : "修改操作员"
	}
	var dialog_info = {
		id : "operatorInfo",
		title : "操作员详情"
	}
	
	// 添加窗口
	initDialog(dialog_add);
	$('#operatorAdd').dialog('close');
	// 编缉窗口
	initDialog(dialog_edit);
	$('#operatorEdit').dialog('close');
	// 详情窗口
	initDialog(dialog_info);
	$('#operatorInfo').dialog('close');
	// 修改密码窗口
	initDialog(dialog_editPWD);
	$('#eidtPWD').dialog('close');
}

/** -------- 初始化表单 ------ */
function initForm(){
	$('#roleName').textbox({
		label : '操作员账号：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#comments').textbox({
		label : '操作员姓名：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#add_opAccount,#edit_opAccount').textbox({
		label : '操作员账号：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : true
	});
	$('#add_opPwd,#password').passwordbox({
		label : '操作员密码：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : true
	});
	$('#add_opName,#edit_opName').textbox({
		label : '操作员姓名：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : true
	});
	$('#add_phone,#edit_phone').textbox({
		label : '联系电话：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#add_mobile,#edit_mobile').textbox({
		label : '手机号码：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#add_email,#edit_email').textbox({
		label : '电子邮箱：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#add_remark,#edit_remark').textbox({
		label : '备注：',
		labelWidth : 100,
		labelAlign : "right",
		multiline:true,
		width : 300,
		height : 100,
		required : true
	});
}

/** -------- 加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#operatorTable').datagrid({
		url : root + '/operator/queryOperatorList',
		toolbar : '#toolbar',
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度jobpedia
		pageNumber : 1,
		pageSize : 20,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
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
			field : 'opId',
			checkbox : 'true',
			hidden: true,
			width : 20
		}, {
			field : 'roleId',
			checkbox : 'true',
			hidden: true,
			width : 20
		}, {
			field : 'opAccount',
			title : '操作员账户',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'opName',
			title : '操作员名称',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'lastLoginIp',
			title : '最后登录IP',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'lastLoginTime',
			title : '最后登录时间',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'loginCount',
			title : '登录次数',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'remark',
			title : '备注',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'roleName',
			title : '所属角色',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'opt',
			title : '操作',
			align : 'center',
			formatter : optFormater,
			width : 150
		} ] ]
	})

}

/**
 * 加载树型
 */
function ajaxTree() {
	var add = {
		url : root + '/role/queryRoleTree',
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				$('#add_roleId,#edit_roleId').combobox({
					label : '角色：',
					labelWidth : 100,
					labelAlign : "right",
					data : data.treeList,
					valueField:'id',
					textField:'text',
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
	$('#operatorTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/**
 * 设置操作列的信息 row 当前行的数据 index 当前行的索引 从0 开始
 */
function optFormater(value, row, index) {
	var _id = "'" + row.opId + "'";
	var info = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"info")>详情</a>';
	var del = '';
	if(row.opAccount != 'admin'){
		del = ' | <a href="javascript:void(0);" onclick=deleteRole(' + _id + ')>删除</a>';
	}
	var lock = '';
	if(row.state == '1' && row.opAccount != 'admin'){
		lock = ' | <a href="javascript:void(0);" onclick=unlockOperator(' + _id + ')>解除</a>';
	}
	if(row.state == '0' && row.opAccount != 'admin'){
		lock = ' | <a href="javascript:void(0);" onclick=lockOperator(' + _id + ')>锁定</a>';
	}
	return info+del+lock;
};
function sourceFormater(value, row, index) {
	if(isEmpty(value)){
		return "红苹果";
	}
	return value;
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

function getInfo(id,flag) {
	if(flag == 'edit'){
		var selecteds = $('#operatorTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#operatorTable').datagrid('getSelected');
		var options = {
			url : root + '/operator/queryOperatorById',
			data : {
				'opId' : selected.opId
			},
			callBackFun : function(data) {
				// 加载操作员信息
				$("#operatorEditForm").form("load", data.obj);
				$('#edit_roleId').combobox('select', selected.roleId);
				// 打开操作员编缉页面
				$('#operatorEdit').dialog('open');
			}
		}
		sendAjaxRequest(options);
	}
	if(flag == 'info'){
		$('#operatorInfoAccordion').accordion('select','操作员详情');
		var info = {
			url : root + '/operator/queryOperatorById',
			data : {
				'opId' : id
			},
			callBackFun : function(data) {
				// 加载操作员信息
				$("#info_opId").html(data.obj.opId);
				$("#info_opAccount").html(data.obj.opAccount);
				$("#info_opName").html(data.obj.opName);
				$("#info_phone").html(data.obj.phone);
				$("#info_mobile").html(data.obj.mobile);
				$("#info_email").html(data.obj.email);
				$("#info_remark").html(data.obj.remark);
				
			}
		}
		sendAjaxRequest(info);
		var role = {
			url : root + '/menu/listMenu',
			data : {
				'operId' : id
			},
			callBackFun : function(data) {
				if (data.isSuccessOrfail == "SUCCESS") {
					$('#info_role').tree({
						data : data.treeList
					});
					// 打开操作员详情页面
					$('#operatorInfo').dialog('open');
				}
			}
		}
		sendAjaxRequest(role);
	}
}

/** -------- 添加 ------ */
function addOperator() {
	//验证表单参数
	var sflag = $("#operatorAddForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("operatorAddForm");
	var add = {
		url : root + '/operator/saveOperator',// 请求的action路径
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				resetAddForm();
				reloadTable("operatorTable");
				$('#operatorAdd').dialog('close');
			}
			showMessage(data);
		}
	};
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editOperator() {
	//验证表单参数
	var sflag = $("#operatorEditForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("operatorEditForm");
	var add = {
		url : root + '/operator/updateOperator',// 请求的action路径
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("operatorTable");
				$('#operatorEdit').dialog('close');
			}
			showMessage(data);
		}
	};
	sendAjaxRequest(add);
}

/** -------- 删除 ------ */
function deleteRole(id) {
	$.messager.confirm('删除提示', '是否确认删除?', function(r) {
		if (r) {
			var options = {
				url : root + '/operator/deleteOperator',// 请求的action路径
				data : {
					"opId" : id
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("operatorTable");
					}
					showMessage(data);
				}
			};
			sendAjaxRequest(options);
		}
	});
}

/** -------- 锁定 ------ */
function lockOperator(id) {
	$.messager.confirm('锁定提示', '是否确认锁定?', function(r) {
		if (r) {
			var options = {
				url : root + '/operator/lockOperator',// 请求的action路径
				data : {
					"opId" : id
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("operatorTable");
					}
					showMessage(data);
				}
			};
			sendAjaxRequest(options);
		}
	});
}

/** -------- 解除锁定 ------ */
function unlockOperator(id) {
	$.messager.confirm('锁定提示', '是否确认解除锁定?', function(r) {
		if (r) {
			var options = {
				url : root + '/operator/unlockOperator',// 请求的action路径
				data : {
					"opId" : id
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("operatorTable");
					}
					showMessage(data);
				}
			};
			sendAjaxRequest(options);
		}
	});
}

/** -------- 修改密码 ------ */
function eidtPassword() {
	var selecteds = $('#operatorTable').datagrid('getSelections');
	if(selecteds.length!=1){
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	var selected = $('#operatorTable').datagrid('getSelected');
	//验证表单参数
	var sflag = $("#eidtPWDForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("eidtPWDForm");
	params["opId"] = selected.opId;
	var add = {
		url : root + '/operator/eidtPassword',// 请求的action路径
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("operatorTable");
				$('#eidtPWD').dialog('close');
			}
			showMessage(data);
		}
	};
	sendAjaxRequest(add);
}


function operatorReset() {
	$("#conditionForm").form("clear");
	$('#sourceid').val('sdal');
}
function resetAddForm() {
	$("#operatorAddForm").form("clear");
}
function resetEditForm() {
	$("#eidtPWDForm").form("clear");
}