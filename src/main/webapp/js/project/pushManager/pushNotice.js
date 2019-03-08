var jumpList = [];
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
		labelAlign : "right",
		width : 250,
		required : false,
		editable : false
	});
	$('#enddate').datebox({
		label : '截止日期：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : false,
		editable : false
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	$("#title").textbox({
		label : '标题：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : false
	})
	$("#add_title,#edit_title").textbox({
		label : '标题：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : true
	})
	$("#add_message,#edit_message").textbox({
		label : '内容：',
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
		id : "pushNoticeAdd",
		title : "添加"
	};

	var dialog_edit = {
		id : "pushNoticeEdit",
		title : "修改"
	};

	// 添加窗口
	initDialog(dialog_add);
	$('#pushNoticeAdd').dialog('close');
	// 添加窗口
	initDialog(dialog_edit);
	$('#pushNoticeEdit').dialog('close');

	// 查看窗口
	initDialog(dialog_info);
	$('#memberInfo').dialog('close');
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
			$.messager.alert('错误提示', '起始日期不能大于截止日期', 'error');
			return false;
		}
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#pushNoticeTable').datagrid({
		url : root + '/pushNotice/queryPushNoticeList',
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
			field : 'noticeId',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'jump',
			title : '消息类型',
			align : 'center',
			formatter : function(value, row, index) {
				if (value == "7501") {
					return "信息公告";
				}else if (value == "7601") {
					return "优惠活动";
				}else if (value == "7602") {
					return "首页公告";
				}else if (value == "7603") {
					return "首页促销";
				}else {
					return "--";
				}
			},
			width : 75
		}, {
			field : 'title',
			title : '标题',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'message',
			title : '内容',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'createDate',
			title : '创建时间',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'createOp',
			title : '创建人',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'pushDate',
			title : '推送时间',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'pushOp',
			title : '推送人',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'pushSuccess',
			title : '是否成功推送',
			align : 'center',
			formatter : function(value, row, index) {
				if (value == '1') {
					return '成功';
				}else if (value == '0') {
					return '失败';
				}else {
					return '未推送';
				}
			},
			width : 150
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	// 添加-类型
	$('#add_jump').combobox({
		label : '消息类型：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		data : [ {
			"id" : "7501",
			"text" : "信息公告"
		}, {
			"id" : "7601",
			"text" : "优惠活动"
		}, {
			"id" : "7602",
			"text" : "首页公告"
		}, {
			"id" : "7603",
			"text" : "首页促销"
		} ],
		valueField : 'id',
		textField : 'text',
		onChange : function(newValue, oldValue) {
			var add_tblId = {
				data : {
					"typecode" : newValue
				},
				url : root + '/business/querySystemInfoTree',
				callBackFun : function(data) {
					$('#add_tblId').combobox({
						data : data.treeList,
						valueField : 'id',
						textField : 'text',
						width : 250
					});
				}
			}
			sendAjaxRequest(add_tblId);
		}
	});
	$('#edit_jump').combobox({
		label : '消息类型：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		data : [ {
			"id" : "7501",
			"text" : "信息公告"
		}, {
			"id" : "7601",
			"text" : "优惠活动"
		}, {
			"id" : "7602",
			"text" : "首页公告"
		}, {
			"id" : "7603",
			"text" : "首页促销"
		} ],
		valueField : 'id',
		textField : 'text',
		onChange : function(newValue, oldValue) {
			var edit_tblId = {
				data : {
					"typecode" : newValue
				},
				url : root + '/business/querySystemInfoTree',
				callBackFun : function(data) {
					$('#edit_tblId').combobox({
						data : data.treeList,
						valueField : 'id',
						textField : 'text',
						width : 250
					});
				}
			}
			sendAjaxRequest(edit_tblId);
		}
	});
	
	$('#add_tblId').combobox({
		label : '请选择：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#edit_tblId').combobox({
		label : '请选择：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});

}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#pushNoticeTable').datagrid('resize');
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
		var selecteds = $('#pushNoticeTable').datagrid('getSelections');
		if (selecteds.length != 1) {
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#pushNoticeTable').datagrid('getSelected')
		if (selected.pushSuccess == '1') {
			$.messager.alert('错误提示', '请选择一条未推送成功的记录!', 'error');
			return false;
		}
		console.log(selected);
		$("#edit_id").val(selected.noticeId);
		$("#edit_jump").combobox('setValue', selected.jump);
		$("#edit_title").textbox("setValue",selected.title);
		$("#edit_message").textbox("setValue",selected.message);
		$("#edit_tblId").combobox('setValue', selected.tblId);

		$('#pushNoticeEdit').dialog('open');
	}
}

/** -------- 添加 ------ */
function addpushNotice() {
	var addflag = $("#pushNoticeAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("pushNoticeAddForm");
	var add = {
		url : root+'/pushNotice/addPushNotice',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("pushNoticeTable");
			}
			$('#pushNoticeAdd').dialog('close');
			showMessage(data);
			pushNoticeAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editpushNotice() {
	var editflag = $("#pushNoticeEditForm").form('validate');
	if(!editflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("pushNoticeEditForm");
	var edit = {
		url : root+'/pushNotice/updatePushNotice',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("pushNoticeTable");
			}
			$('#pushNoticeEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(edit);
}

/** -------- 批量删除 ------ */
function delpushNotice() {
	var selecteds = $('#pushNoticeTable').datagrid('getSelections');
	if (selecteds.length == 0) {
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#pushNoticeTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#pushNoticeTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].noticeId);// 记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root + '/pushNotice/deletePushNotice';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("pushNoticeTable");
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
	var selecteds = $('#pushNoticeTable').datagrid('getSelections');
	if (selecteds.length != 1) {
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	var selected = $('#pushNoticeTable').datagrid('getSelected');
	$.messager.confirm('推送提示', '是否确认推送? ', function(r) {
		if (r) {
			var push = {
				url : root + '/pushNotice/pushNoticeInfo',
				data : {
					'id' : selected.noticeId
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
					}
					reloadTable("pushNoticeTable");
					showMessage(data);
				}
			}
			sendAjaxRequest(push);
		}
	});
}

/** -------- 重置查询条件 ------ */
function pushNoticeReset() {
	$('#conditionForm').form('reset');
	$('#sourceid').val('hbal');
	initDatebox();
}
function pushNoticeAddReset() {
	$('#pushNoticeAddForm').form('reset');
}
