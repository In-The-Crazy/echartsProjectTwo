var msgTypes = [];
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
}

/** --------初始化页面模块 ------ */
function initPage() {
	$("#titel").textbox({
		label : '标题：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : false
	})
	$("#add_titel,#edit_titel").textbox({
		label : '标题：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : true
	})
	$("#add_content,#edit_content").textbox({
		label : '内容：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : true
	})
	$("#add_templetName,#edit_templetName").textbox({
		label : '模板名称：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : true
	})
	$("#add_remark,#edit_remark").textbox({
		label : '说明：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : true
	})

	var dialog_info = {
		id : "memberInfo",
		title : "会员信息"
	};

	var dialog_add = {
		id : "appmsgTempletAdd",
		title : "添加"
	};

	var dialog_edit = {
		id : "appmsgTempletEdit",
		title : "修改"
	};

	// 添加窗口
	initDialog(dialog_add);
	$('#appmsgTempletAdd').dialog('close');
	// 添加窗口
	initDialog(dialog_edit);
	$('#appmsgTempletEdit').dialog('close');

	// 查看窗口
	initDialog(dialog_info);
	$('#memberInfo').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#appmsgTempletTable').datagrid({
		url : root + '/pushNotice/queryAppmsgTempletList',
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
			width : 15
		}, {
			field : 'msgTempletId',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'titel',
			title : '标题',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'content',
			title : '内容',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'templetName',
			title : '模板名称',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'remark',
			title : '说明',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'msgType',
			title : '消息类型',
			align : 'center',
			formatter : function(value, row, index) {
				for (var int = 0; int < msgTypes.length; int++) {
					if (msgTypes[int].dincCode == value) {
						return msgTypes[int].dincName;
					}
				}
			},
			width : 75
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	//消息类型
	var msgType = {
		url : root+'/common/querydictsByType',
		data : {'type':'MSGTYPE'},
		callBackFun : function(data) {
			msgTypes = data.rows;
			//权限名称设置
			$('#add_msgType,#edit_msgType').combobox({
				label: '消息类型：',
				labelWidth: 100,
				labelAlign: "right",
				width: 250,
				data:data.rows,
				valueField:'dincCode',
				required : true,
				editable : false,
				multiple:false,
				textField:'dincName',
			});
		}
	};
	sendAjaxRequest(msgType)

}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#appmsgTempletTable').datagrid('resize');
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
	if (flag == 'edit') {
		var selecteds = $('#appmsgTempletTable').datagrid('getSelections');
		if (selecteds.length != 1) {
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#appmsgTempletTable').datagrid('getSelected')
		console.log(selected);
		$("#edit_msgTempletId").val(selected.msgTempletId);
		$("#appmsgTempletEditForm").form("load",selected);

		$('#appmsgTempletEdit').dialog('open');
	}
}

/** -------- 添加 ------ */
function addAppmsgTemplet() {
	var addflag = $("#appmsgTempletAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("appmsgTempletAddForm");
	var add = {
		url : root+'/pushNotice/addAppmsgTemplet',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("appmsgTempletTable");
			}
			$('#appmsgTempletAdd').dialog('close');
			showMessage(data);
			appmsgTempletAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editpushNotice() {
	var editflag = $("#appmsgTempletEditForm").form('validate');
	if(!editflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("appmsgTempletEditForm");
	var edit = {
		url : root+'/pushNotice/updateAppmsgTemplet',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("appmsgTempletTable");
			}
			$('#appmsgTempletEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(edit);
}

/** -------- 批量删除 ------ */
function delAppmsgTemplet() {
	var selecteds = $('#appmsgTempletTable').datagrid('getSelections');
	if (selecteds.length == 0) {
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#appmsgTempletTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#appmsgTempletTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].msgTempletId);// 记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root + '/pushNotice/deleteAppmsgTemplet';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("appmsgTempletTable");
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
function pushNotice() {
	var selecteds = $('#appmsgTempletTable').datagrid('getSelections');
	if (selecteds.length != 1) {
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	var selected = $('#appmsgTempletTable').datagrid('getSelected');
	$.messager.confirm('推送提示', '是否确认推送? ', function(r) {
		if (r) {
			var push = {
				url : root + '/pushNotice/pushNoticeInfo',
				data : {
					'id' : selected.noticeId
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("appmsgTempletTable");
					}
					showMessage(data);
				}
			}
			sendAjaxRequest(push);
		}
	});
}

/** -------- 重置查询条件 ------ */
function appmsgTempletReset() {
	$('#conditionForm').form('reset');
	$('#sourceid').val('hbal');
	initDatebox();
}
function appmsgTempletAddReset() {
	$('#appmsgTempletAddForm').form('reset');
}
