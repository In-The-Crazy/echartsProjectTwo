var channels;
/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面角色
	initPage();
	// 加载树型
	ajaxTree();
	// 加载表格数据
	ajaxTable();

});

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_add = {
		id : "roleAdd",
		title : "增加"
	}
	var dialog_edit = {
		id : "roleEdit",
		title : "修改"
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
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#roleTable').datagrid({
		url : root + '/flightDelayProve/queryFlightDelayChannelList',
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
			field : 'dealyChnlId',
			checkbox : 'true',
			align : 'center',
			width : 20
		}, {
			field : 'channel',
			title : '渠道编号',
			align : 'center',
			formatter : function(value, row, index){
				console.log(value);
				var valueArr=value.split(",");
				console.log(valueArr);
				var channelArr=[];
				for (var i = 0; i < channels.length; i++) {
					console.log(channels);
					for(var j=0;j<valueArr.length;j++){
						if(channels[i].chalId == valueArr[j]){
							channelArr.push(channels[i].chalName);
							continue;
						}
					}
					
				}
				return channelArr.join(",");
			},
			width : 200
		}, {
			field : 'limitTime',
			title : '客票有效期内',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'maxTime',
			title : '航班日期有效期内',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'chnlStatus',
			title : '操作',
			align : 'center',
			formatter : optFormater,
			width : 150
		} ] ]
	})

}

function optFormater(value, row, index) {
	var _id = "'" + row.dealyChnlId + "'";
	var lock = '';
	if(row.chnlStatus == '0'){
		lock = ' <a href="javascript:void(0);" onclick=lockChnl(' + _id + ')>禁用</a>';
	}
	if(row.chnlStatus == '1'){
		lock = ' <a href="javascript:void(0);" onclick=unlockChnl(' + _id + ')>启用</a>';
	}
	return lock;
};

/**
 * 加载树型
 */
function ajaxTree() {
	//渠道设置
	var channel={
		url : root+'/common/channels',
		callBackFun : function(data) {
			channels = data.rows;
			console.log("pindao");
			var treeList = rowsListAddAll(data.rows, {
				"checked" : true,
				"children" : null,
				"chalId" : "",
				"chalName" : ""
			});
			//渠道设置
			$('#add_channel').combobox({
				data:treeList,
				valueField:'chalId',
				editable : false,
				textField:'chalName'
			});
			$('#channel').combobox({
				data:treeList,
				valueField:'chalId',
				editable : false,
				textField:'chalName'
			});
		}
	};
	sendAjaxRequest(channel);
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

/** -------- 启用 ------ */
function unlockChnl(id) {
	$.messager.confirm('启用提示', '是否确认启用?', function(r) {
		if (r) {
			var options = {
				url : root + '/flightDelayProve/updateFlightDelayChannel',// 请求的action路径
				data : {
					"dealyChnlId" : id,
					"chnlStatus" : "0"
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("roleTable");
					}
					showMessage(data);
				}
			};
			sendAjaxRequest(options);
		}
	});
}
/** -------- 禁用 ------ */
function lockChnl(id) {
	$.messager.confirm('禁用提示', '是否确认禁用?', function(r) {
		if (r) {
			var options = {
				url : root + '/flightDelayProve/updateFlightDelayChannel',// 请求的action路径
				data : {
					"dealyChnlId" : id,
					"chnlStatus" : "1"
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("roleTable");
					}
					showMessage(data);
				}
			};
			sendAjaxRequest(options);
		}
	});
}

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
		url : root + '/flightDelayProve/addFlightDelayChannel',// 请求的action路径
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
		list += "'" + field.name + "':'" + result + "',";
	});
	list = list.substring(0,list.length-1);
	list += "}";
	console.log("list======"+list);
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

function openAddWindow() {
	resetAddForm();
	$('#roleAdd').dialog('open');
}
