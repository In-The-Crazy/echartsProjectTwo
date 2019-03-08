/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面模块
	initPage();
	// 加载表格数据
	ajaxTable();
	// 加载树型
	ajaxTree();
	// 加载日历选择
	initDatebox();
});

/** --------加载日历选择 ------ */
function initDatebox() {
	$('#startdate').datebox({
		required : false
	});
	$('#enddate').datebox({
		required : false
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_send = {
		id : "sendSms",
		title : "发送短信"
	};
	var dialog_info = {
		id : "infoSmsTemp",
		title : "短信模板详情"
	};
	var dialog_edit = {
		id : "editSmsTemp",
		title : "编辑短信模板"
	};

	// 查看窗口
	initDialog(dialog_info);
	$('#infoSmsTemp').dialog('close');
	// 添加窗口
	initDialog(dialog_send);
	$('#sendSms').dialog('close');
	// 编辑窗口
	initDialog(dialog_edit);
	$('#editSmsTemp').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var sdate = $("[name=startdate]").val();
	var edate = $("[name=enddate]").val();
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		sdate = sdate.replace(/-/g, '');
		edate = edate.replace(/-/g, '');
		if (parseInt(sdate) > parseInt(edate)) {
			$.messager.alert('错误提示', '发送开始日期不能大于发送截止日期', 'error');
			return false;
		}
	}
	// 加载表格
	$('#smsTable').datagrid({
		url : root + '/querySmsList',
		method : 'GET',
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		pageNumber : 1,
		pageSize : 20,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		queryParams : {
			'mobile' : $("#mobile").val(),
			'key' : $("#key").val(),
			'startdate' : sdate,
			'enddate' : edate
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
			width : 25
		}, {
			field : 'id',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'mobile',
			title : '手机号',
			align : 'center',
			width : 100
		}, {
			field : 'key',
			title : '模板标签',
			align : 'center',
			width : 75
		}, {
			field : 'message',
			title : '短信内容',
			align : 'center',
			width : 300
		}, {
			field : 'crea_time',
			title : '创建时间',
			align : 'center',
			width : 150
		}, {
			field : 'send_time',
			title : '发送时间',
			align : 'center',
			width : 150
		}, {
			field : 'send_type',
			title : '状态',
			align : 'center',
			formatter : sendtypeFormater,
			width : 75
		}, {
			field : 'send_error',
			title : '失败信息',
			align : 'center',
			width : 100
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	var temp = {
		url : root + '/treeSmsTempList',
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				var a = "<option value=''>全部</option>";
				for (var i = 0; i < data.treeList.length; i++) {
					a += "<option value='" + data.treeList[i].text + "'>"
							+ data.treeList[i].text + "</option>";
				}
				$("#key").html(a);
			}
		}
	}
	sendAjaxRequest(temp);
	var temp2 = {
		url : root + '/treeSmsTempList',
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				var a = "<option value=''>不使用模板</option>";
				for (var i = 0; i < data.treeList.length; i++) {
					a += "<option value='" + data.treeList[i].id + "'>"
							+ data.treeList[i].text + "</option>";
				}
				$("#send_tempid").html(a);
			}
		}
	}
	sendAjaxRequest(temp2);
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#queryOrderTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function sendtypeFormater(value, row, index) {
	if (row.send_type == '0') {
		return "未发送";
	}
	if (row.send_type == '1') {
		return "已发送";
	}
	if (row.send_type == '2') {
		return "发送失败";
	}
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
function getInfo(id, flag) {
}

/** -------- 添加短信模板 ------ */
function sendSms() {
	if (isEmpty($("#send_tempid").val())) {
		var options = {
			url : root + '/addSmsByMsg',// 请求的action路径
			data : $("#sendSmsForm").serialize(),
			callBackFun : function(data) {
				if (data.isSuccessOrfail == "SUCCESS") {
					smsTempReset();
					reloadTable("smsTable");
				}
				showMessage(data);
				$('#sendSms').dialog('close');
			}
		};
		sendAjaxRequest(options);
	} else {
		var options = {
			url : root + '/addSms',// 请求的action路径
			data : $("#sendSmsForm").serialize(),
			callBackFun : function(data) {
				if (data.isSuccessOrfail == "SUCCESS") {
					smsTempReset();
					reloadTable("smsTable");
				}
				showMessage(data);
				$('#sendSms').dialog('close');
			}
		};
		sendAjaxRequest(options);
	}
}

/** -------- 编辑短信模板 ------ */
function editSmsTemp() {
	var options = {
		url : root + '/updateSmsTemp',// 请求的action路径
		data : $("#editSmsTempForm").serialize(),
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				smsTempReset();
				reloadTable("smsTable");
			}
			showMessage(data);
			$('#editSmsTemp').dialog('close');
		}
	};
	sendAjaxRequest(options);
}

/**
 * 批量删除
 * 
 * @return
 */
function deleteSmsTemps() {
	var id = $("[name=id]:checked").val();
	if (id == null || id == '') {
		$.messager.alert('警告提示', '请先选择模板！', 'warning');
		return false;
	}
	if ($('#smsTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#smsTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].id);
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root + '/deleteSmsTemps';
				var options = {
					url : url,
					data : {
						"tempids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("smsTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}

/** -------- 选择短信模板 ------ */
function changeTemp(value) {
	if(!isEmpty(value)){
		$("#send_msg_fiel").hide();
	}else{
		$("#send_msg_fiel").show();
	}
}

/** -------- 重置查询条件 ------ */
function smsTempReset() {
	$("#addReset").click();
	$("input").val("");
	$("select").val("");
	$("textarea").val("");
	initDatebox();
}
