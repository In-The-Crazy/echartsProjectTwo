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
	$('#startdate').datebox({
		label : '提交起始日期：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		editable : false,
		required : false
	});
	$('#enddate').datebox({
		label : '提交截止日期：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		editable : false,
		required : false
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	$("#caption").textbox({
		label : '主题：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#userName").textbox({
		label : '会员姓名：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#email").textbox({
		label : '电子邮箱：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#mobile").textbox({
		label : '手机号码：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	
	var dialog_info = {
		id : "feedbackInfo",
		title : "意见反馈信息详情"
	};
	var dialog_know = {
		id : "knowledgeInfo",
		title : "知识库"
	};

	// 查看窗口
	initDialog(dialog_info);
	$('#feedbackInfo').dialog('close');
	initDialog(dialog_know);
	$('#knowledgeInfo').dialog('close');
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
	//验证表单参数
	var sflag = $("#conditionForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#feedbackTable').datagrid({
		url : root+'/business/queryMetsuggestList',
		toolbar : '#toolbar',
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
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
			width : 10
		}, {
			field : 'sugId',
			checkbox : 'true',
			align : 'center',
			hidden : true,
			width : 25
		}, {
			field : 'caption',
			title : '意见主题',
			align : 'center',
			formatter : captionFormater,
			width : 75
		}, {
			field : 'sugContent',
			title : '内容',
			align : 'center',
			hidden : true,
			formatter : baseFormater,
			width : 75
		}, {
			field : 'username',
			title : '会员姓名',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'mobile',
			title : '手机号码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'email',
			title : '电子邮箱',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'creadate',
			title : '提交日期',
			align : 'center',
			formatter : function(value, row, index) {
				return value + " " + row.creatime;
			},
			width : 75
		}, {
			field : 'isProcess',
			title : '是否处理',
			align : 'center',
			formatter : function(value, row, index) {
				if (value == '0') {
					return '未处理';
				}else if (value == '1') {
					return '已处理';
				}
			},
			width : 75
		}, {
			field : 'processOpname',
			title : '处理人',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'processDate',
			title : '处理日期',
			align : 'center',
			formatter : baseFormater,
			width : 75
		} ] ]
	});
}

/** -------- 加载知识库表格数据 ------ */
function ajaxKnowledgeTable() {
	var params = serializeJson("knowledgeForm");
	// 加载表格
	$('#knowledgeTable').datagrid({
		url :  root+'/business/queryKnowledgeList',
		toolbar : '#knowledgetoolbar',
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
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
			width : 8
		}, {
			field : 'knowId',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'knowContent',
			title : '内容',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'createDate',
			title : '创建日期',
			align : 'center',
			formatter : dateTimeFormater,
			width : 75
		}, {
			field : 'opt',
			title : '操作',
			align : 'center',
			formatter : optFormater,
			width : 50
		} ] ]
	});
}

/** -------- 加载树形 ------ */
function ajaxTree() {
}

/** -------- 根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#feedbackTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** -------- 自定义文本 ------ */
function captionFormater(value, row, index) {
	var _index = "'" + index + "'";
	return '<a href="javascript:void(0);" onclick=getInfo(' + _index + ')>' + value + '</a>';
};
function optFormater(value, row, index) {
	var _id = "'" + row.knowId + "'";
	return '<a href="javascript:void(0);" onclick=deleteKnowledge(' + _id + ')>删除</a>';
};

/** -------- 自定义单元格样式 ------ */
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
function getInfo(index) {
	$("#feedbackTable").datagrid('selectRow',index);
	var selected = $('#feedbackTable').datagrid('getSelected');
	$("#feedbackInfoAccordion").accordion('select','意见反馈信息');
	$("#info_caption").html(selected.caption);
	$("#info_content").html(selected.sugContent);
	$("#info_creadate").html(selected.creadate);
	$("#info_username").html(selected.username);
	$("#info_mobile").html(selected.mobile);
	$("#info_email").html(selected.email);
	$("#add_metid").val(selected.sugId);
	$("#add_caption").val(selected.caption);
	$("#add_mobile").val(selected.mobile);
	$("#add_email").val(selected.email);
	$('#feedbackInfo').dialog('open');
	
	$('#suggestResultTable').datagrid({
		url : root+'/business/querySuggestResultList',
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : false,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		queryParams : {
			"metid" : selected.sugId
		},
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
			width : 8
		}, {
			field : 'id',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'msdate',
			title : '处理时间',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'msmessage',
			title : '内容',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'opName',
			title : '操作员',
			align : 'center',
			formatter : baseFormater,
			width : 75
		} ] ]
	});
}

/** -------- 选择知识库 ------ */
function selectKnowledge(){
	var selecteds = $('#knowledgeTable').datagrid('getSelections');
	if(selecteds.length!=1){
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	var selected = $('#knowledgeTable').datagrid('getSelected');
	$("#add_msmessage").val(selected.knowContent);
	$('#knowledgeInfo').dialog('close');
}

/** -------- 添加 ------ */
function addSuggestResult(){
	var addflag = $("#feedbackAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("feedbackAddForm");
	var add = {
		url : root+'/business/addSuggestResult',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("suggestResultTable");
				$("#feedbackInfoAccordion").accordion('select','意见处理记录');
			}
			showMessage(data);
			knowledgeAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 删除 ------ */
function deleteKnowledge(id){
	$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
		if (r) {
			var del = {
				url : root+'/business/deleteKnowledge',
				data : {
					"metid" : id
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("knowledgeTable");
					}
					showMessage(data);
				}
			}
			sendAjaxRequest(del);
		}
	});
}

/** -------- 重置查询条件 ------ */
function infoNoticeReset() {
	$('#sourceid').val('sdal');
	$("#conditionForm").form("reset");
}
function knowledgeInfoReset() {
	$("#knowledgeForm").form("reset");
}
function knowledgeAddReset() {
	$("#add_msmessage").val("");
	$('#add_sourceid').val('sdal');
	$("#ischecked").prop("checked",true);
}
