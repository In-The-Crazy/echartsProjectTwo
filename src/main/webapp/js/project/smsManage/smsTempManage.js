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
	var dialog_add = {
		id : "addSmsTemp",
		title : "添加短信模板"
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
	//添加窗口
	initDialog(dialog_add);
	$('#addSmsTemp').dialog('close');
	//编辑窗口
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
			$.messager.alert('错误提示', '创建开始日期不能大于创建截止日期', 'error');
			return false;
		}
	}
	// 加载表格
	$('#smsTempTable').datagrid({
		url : root + '/querySmsTempList',
		method : 'GET',
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		pageNumber : 1,
		pageSize : 20,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : false,// 是否只能选中一条
		queryParams : {
			'key' : $("#key").val(),
			'status' : $("#status").val(),
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
			field : 'key',
			title : '模板名称',
			align : 'center',
			width : 75
		}, {
			field : 'message',
			title : '模板内容',
			align : 'center',
			width : 300
		}, {
			field : 'status',
			title : '模板状态',
			align : 'center',
			formatter : tempStatusFormater,
			width : 75
		}, {
			field : 'create_time',
			title : '创建时间',
			align : 'center',
			width : 150
		}, {
			field : 'modify_time',
			title : '修改时间',
			align : 'center',
			width : 150
		}, {
			field : 'opt',
			title : '操作',
			align : 'center',
			formatter : optFormater,
			width : 100
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#queryOrderTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function optFormater(value, row, index) {
	var _id = "'" + row.id + "'";
	var detail = '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"info")>详细</a>';
	var modify = ' | <a href="javascript:void(0);" onclick=getInfo(' + _id + ',"edit")>修改</a>';
	return detail + modify;
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

/** --------查看订单详情 ------ */
function getInfo(id, flag) {
	var url = root + '/querySmsTempList';
	var options = {
		url : url,
		data : "id=" + id,
		callBackFun : function(data) {
			if (flag == 'info') {
				$("#info_key").val(data.rows[0].key);
				$("#info_message").val(data.rows[0].message);
				$("#info_status").val(data.rows[0].status);
				$('#infoSmsTemp').dialog('open');
			}
			if (flag == 'edit') {
				$("#edit_id").val(data.rows[0].id);
				$("#edit_key").val(data.rows[0].key);
				$("#edit_message").val(data.rows[0].message);
				$("#edit_status").val(data.rows[0].status);
				$('#editSmsTemp').dialog('open');
			}
		}
	}
	sendAjaxRequest(options);
}

/** -------- 添加短信模板 ------ */
function addSmsTemp(){
	var options = {
			url: root + '/addSmsTemp',//请求的action路径
			data :$("#addSmsTempForm").serialize(),
			callBackFun:function(data){
				if(data.isSuccessOrfail=="SUCCESS"){
					smsTempReset();
					reloadTable("smsTempTable");
    			}
				showMessage(data);
				$('#addSmsTemp').dialog('close');
			}
	};
	sendAjaxRequest(options);
}

/** -------- 编辑短信模板 ------ */
function editSmsTemp(){
	var options = {
			url: root + '/updateSmsTemp',//请求的action路径
			data :$("#editSmsTempForm").serialize(),
			callBackFun:function(data){
				if(data.isSuccessOrfail=="SUCCESS"){
					smsTempReset();
					reloadTable("smsTempTable");
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
	if ($('#smsTempTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#smsTempTable').datagrid('getSelections');
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
							reloadTable("smsTempTable");
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
function smsTempReset() {
	$("#addReset").click();
	$("input").val("");
	$("select").val("");
	$("textarea").val("");
	initDatebox();
}
