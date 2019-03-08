var channels=[];
var authoritys=[];
/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面模块
	initPage();
	// 加载树型
	ajaxTree();
	// 加载日历选择
	initDatebox();
	// 加载表格数据
	ajaxTable();
	
});

/** --------加载日历选择 ------ */
function initDatebox() {
	
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_add = {
		id : "channelAuthorityAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "channelAuthorityEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#channelAuthorityAdd').dialog('close');
	// 修改窗口
	initDialog(dialog_edit);
	$('#channelAuthorityEdit').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	//验证表单参数
	var sflag = $("#conditionForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#channelAuthorityTable').datagrid({
		url : root+'/channelAuthority/queryChannelAuthoritys',
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
			console.log(data);
		},
		columns : [ [ {
			field : 'rownumbers',
			title : '',
			align : 'center',
			styler : rownumSytler,
			formatter : rownumFormater,
			width : 25
		},{
			field : 'authId',
			checkbox : 'true',
			align : 'center',
			width : 25
		},{
			field : 'authCode',
			title : '权限名称',
			align : 'center',
			formatter : function(value, row, index){
				var valueArr=value.split(",");
				var authorityArr=[];
				for (var i = 0; i < authoritys.length; i++) {
					for(var j=0;j<valueArr.length;j++){
						if(authoritys[i].dincCode == valueArr[j]){
							authorityArr.push(authoritys[i].dincName);
							continue;
						}
					}
					
				}
				return authorityArr.join(",");
			},
			width : 400
		},{
			field : 'channel',
			title : '渠道编号',
			align : 'center',
			formatter : function(value, row, index){
				var valueArr=value.split(",");
				var channelArr=[];
				for (var i = 0; i < channels.length; i++) {
					for(var j=0;j<valueArr.length;j++){
						if(channels[i].chalCode == valueArr[j]){
							channelArr.push(channels[i].chalName);
							continue;
						}
					}
					
				}
				return channelArr.join(",");
			},
			width : 400
		},{
			field : 'authStatus',
			title : '操作',
			align : 'center',
			formatter : optFormater,
			width : 50
		}  ] ]
	});
}
/**
 * 设置启用禁用列的信息 row 当前行的数据 index 当前行的索引 从0 开始
 */
function optFormater(value, row, index) {
	var flag=row.authStatus;
	var _id="'"+row.authId+"'";
	var start,stop;
	if(flag=="0"){
		start='<a href="javascript:void(0)" onclick="startUse(' + _id + ',1)">禁用</a>'
	}
	if(flag=="1"){
		start='<a href="javascript:void(0)" onclick="startUse(' + _id + ',0)">启用</a>'
	}
	return start;
};

/** --------加载树形 ------ */
function ajaxTree() {
	var authority = {
		url : root+'/common/querydictsByType',
		data : {'type':'AUTHORITY'},
		callBackFun : function(data) {
			authoritys = data.rows;
			//权限名称设置
			$('#add_authCode').combobox({
				label: '权限名称：',
				labelWidth: 100,
				labelAlign: "right",
				width: 250,
				data:data.rows,
				valueField:'dincCode',
				required : true,
				editable : false,
				multiple:false,
				textField:'dincName',
				onChange:function(newValue,oldValue){
					var authCode = $("#add_authCode").combobox('getText');
					$("#add_authority").val(authCode);
				}
			});
			$('#edit_authCode').combobox({
				label: '权限名称：',
				labelWidth: 100,
				labelAlign: "right",
				width: 250,
				data:data.rows,
				valueField:'dincCode',
				required : true,
				editable : false,
				multiple:false,
				textField:'dincName',
				onChange:function(newValue,oldValue){
					var authCode = $("#edit_authCode").combobox('getText');
					$("#edit_authority").val(authCode);
				}
			});
		}
	};
	sendAjaxRequest(authority)
	
	//渠道设置
	var channel={
		url : root+'/common/channels',
		callBackFun : function(data) {
			channels = data.rows;
			var treeList = rowsListAddAll(data.rows, {
				"checked" : true,
				"children" : null,
				"chalCode" : "",
				"chalName" : "全部"
			});
			$('#channel').combobox({
				label: '渠道编号：',
				labelWidth: 100,
				labelAlign: "right",
				data:treeList,
				valueField:'chalCode',
				editable : false,
				textField:'chalName',
				width: 250,
			});
			//渠道设置
			$('#add_channel,#edit_channel').combobox({
				label: '渠道编号：',
				labelWidth: 100,
				labelAlign: "right",
				width: 250,
				data:data.rows,
				valueField:'chalCode',
				required : true,
				editable : false,
				multiple:false,
				textField:'chalName'
			});
		}
	};
	sendAjaxRequest(channel);
	
	//禁用
	$('#add_status,#edit_status').combobox({
		label: '启用/禁用：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		data: [{
			"id" : "0",
			"text" : "启用",
			"selected" : true
		},{
			"id" : "1",
			"text" : "禁用"
		}],
		valueField:'id',
		editable : false,
		required : true,
		textField:'text'
	});
	
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#channelAuthorityTable').datagrid('resize');
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
	var selecteds = $('#channelAuthorityTable').datagrid('getSelections');
	if(selecteds.length!=1){
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	
	var selected = $('#channelAuthorityTable').datagrid('getSelected');
	$('#channelAuthorityEditForm').form('load',selected);
	$("#edit_authId").val(selected.authId);
	$("#edit_authority").val(selected.authority);
	$('#channelAuthorityEdit').dialog('open');
}

/** -------- 启用禁用------ */
function startUse(id,flag){
	var re = {
		url :root+'/channelAuthority/updateStatus',
		data : {
			status:flag,
			id:id
		},
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("channelAuthorityTable");
			}
			showMessage(data);
		}
	}
	sendAjaxRequest(re);
}

/** -------- 添加 ------ */
function addFreightRate(){
	var addflag = $("#channelAuthorityForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("channelAuthorityForm");
	var subchannel=$("#add_channel").combobox("getValues").join(",");
	if(subchannel.indexOf(",")==0){
		params["channel"] =subchannel.substring(1);
	}else{
		params["channel"] =subchannel;
	}
	console.log(params);
	var add = {
		url : root+'/channelAuthority/addChannelAuthority',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("channelAuthorityTable");
			}
			$('#channelAuthorityAdd').dialog('close');
			showMessage(data);
			channelAuthorityReset();
		}
	}
	sendAjaxRequest(add);
}
/** -------- 修改------ */
function editFreightRate(){
	var editflag = $("#channelAuthorityEditForm").form('validate');
	if(!editflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("channelAuthorityEditForm");
	
	var subchannel=$("#edit_channel").combobox("getValues").join(",");
	if(subchannel.indexOf(",")==0){
		params["channel"] =subchannel.substring(1);
	}else{
		params["channel"] =subchannel;
	}
	console.log(params);
	var edit = {
		url : root+'/channelAuthority/updateChannelAuthority',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("channelAuthorityTable");
			}
			$('#channelAuthorityEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(edit);
}

/** -------- 批量删除 ------ */
function deleteChannelAuthority() {
	var selecteds = $('#channelAuthorityTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#channelAuthorityTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#channelAuthorityTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].authId);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root+'/channelAuthority/deleteChannelAuthority';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("channelAuthorityTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}

/** -------- 重置条件 ------ */
function channelAuthorityReset() {
	$('#channelAuthorityForm').form('reset');
}
function queryOrderReset() {
	$('#conditionForm').form('reset');
}