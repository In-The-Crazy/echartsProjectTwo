var channels=[];
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
	$("#modeName").textbox({
		label : '区域码：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#chargeType").textbox({
		label : '区域名称：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#remark").textbox({
		label : '拼音缩写：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	
	$("#add_channel,#edit_channel").textbox({
		label : '地区序号：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		required : true
	})
	$("#add_modeName,#edit_modeName").textbox({
		label : '区域码：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		required : true
	})
	$("#add_modeCopyName,#edit_modeCopyName").textbox({
		label : '父区域码：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		required : true
	})
	$("#add_mailType,#edit_mailType").textbox({
		label : '区域类型：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		required : true
	})
	$("#add_chargeType,#edit_chargeType").textbox({
		label : '区域名称：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		required : true
	})
	$("#add_amount,#edit_amount").textbox({
		label : '区域简称：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		required : true
	})
	$("#add_remark,#edit_remark").textbox({
		label : '拼音缩写：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		required : true
	})
	$("#add_mailSort,#edit_mailSort").numberbox({
		label : '邮寄费：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		required : true
	})
	
	$('#add_sort,#edit_sort').numberspinner({
	    min: 0,
	});
	
	var dialog_add = {
		id : "mailModeAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "airMailEdit",
		title : "修改"
	};
	var dialog_set = {
		id : "setChannel",
		title : "设置渠道"
	};
	// 添加窗口
	initDialog(dialog_add);
	$('#mailModeAdd').dialog('close');
	// 添加窗口
	initDialog(dialog_edit);
	$('#airMailEdit').dialog('close');
	// 添加窗口
	initDialog(dialog_set);
	$('#setChannel').dialog('close');
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
	$('#mailPreTable').datagrid({
		url : root+'/mailMode/queryMailMode',
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
		}, {
			field : 'mailId',
			checkbox : 'true',
			align : 'center',
			width : 25
		},{
			field : 'channel',
			title : '地区序号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},  {
			field : 'modeName',
			title : '区域码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'modeCopyName',
			title : '父区域码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'mailType',
			title : '区域类型',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'chargeType',
			title : '区域名称',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'amount',
			title : '区域简称',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'remark',
			title : '拼音缩写',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'mailSort',
			title : '邮寄费',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'mailStatus',
			title : '可用状态',
			align : 'center',
			formatter : mailStatusFormater,
			width : 100
		},{
			field : 'opt',
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
//	console.log(row);
	var flag=row.mailStatus;
	var _id="'"+row.mailId+"'";
	var start;
	if(flag=="0"){
		start='<a href="javascript:void(0)" onclick="startUse(' + _id + ',1)">禁用</a>'
	}else{
		start='<a href="javascript:void(0)" onclick="startUse(' + _id + ',0)">启用</a>'
	}
	return start;
};

function sortFormater(value, row, index) {
	return value;
};

function mailStatusFormater(value, row, index) {
	var flag=row.mailStatus;
	if (flag == '0') {
		return '可以邮寄';
	}else {
		return '不可邮寄';
	}
};
/** --------加载树形 ------ */
function ajaxTree() {
	//启用禁用
	$('#add_mailStatus,#edit_mailStatus').combobox({
		label : '可用状态：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data: [{
			"id" : "1",
			"text" : "禁用"
		},{
			"id" : "0",
			"text" : "启用"
		}],
		valueField:'id',
		editable : true,
		required : true,
		textField:'text'
	});
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#mailPreTable').datagrid('resize');
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
	if(flag == 'edit'){
		var selecteds = $('#mailPreTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var arr= selecteds[0].channel.split(",");
		console.log(arr);
		var selected = $('#mailPreTable').datagrid('getSelected');
		$('#airMailEditForm').form('load',selected);
		$("#edit_id").val(selected.mailId);
		$('#airMailEdit').dialog('open');
	}else{
		var selecteds = $('#mailPreTable').datagrid('getSelections');
		console.log("xuanze");
		console.log(selecteds);
		if(selecteds.length==0){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		if(selecteds.length==1){
			 var selected= selecteds[0].channel.split(",");
			console.log(selected);
			$('#set_channel').combobox('setValues', selected);
		}else{
			$('#set_channel').combobox('setValues', "");
		}
		var ids=[];
		for(var i=0; i<selecteds.length; i++){  
		    ids.push(selecteds[i].mailId);	//记得修改ID
//			deleteJob1(selecteds[i].id);
		}  
		console.log(ids);
		$("#set_channelId").val(ids);
		$('#setChannel').dialog('open');
		
	}
}
/** -------- 设置渠道------ */
function setChannel(){
	console.log("qi");
	var addflag = $("#setChannelForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("setChannelForm");
	var subchannel=$("#set_channel").combobox("getValues").join(",");
	if(subchannel.indexOf(",")==0){
		params["channel"] =subchannel.substring(1);
	}else{
		params["channel"] =subchannel;
	}
	console.log(params);
	var set = {
		url :root+'/mailMode/modifyMailModeChannel',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("mailPreTable");
			}
			showMessage(data);
			$('#set_channel').combobox('select', '');
			$('#setChannel').dialog('close');
		}
	}
	sendAjaxRequest(set);
}
/** -------- 修改 ------ */
function eidtMail(){
	var addflag = $("#airMailEditForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("airMailEditForm");
	var add = {
		url :root+'/mailMode/updateMailMode',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("mailPreTable");
			}
			$('#airMailEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}
/** -------- 启用禁用------ */
function startUse(id,flag){
	var re = {
		url :root+'/mailMode/validityMailMode',
		data : {
			validity:flag,
			ids:id
		},
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("mailPreTable");
			}
			showMessage(data);
		}
	}
	sendAjaxRequest(re);
}
/** -------- 添加 ------ */
function addMailModeCity(){
	var addflag = $("#mailModeAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("mailModeAddForm");
	var add = {
		url : root+'/mailMode/addMailMode',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("mailPreTable");
			}
			$('#mailModeAdd').dialog('close');
			showMessage(data);
			mailModeAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 批量删除 ------ */
function delairMail() {
	var selecteds = $('#mailPreTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#mailPreTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#mailPreTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].mailId);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root+'/mailMode/deleteMailMode';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("mailPreTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}
/** -------- 导出 ------ */
function exportList() {
	var data = $('#mailPreTable').datagrid('getData');
	var paper = $('#mailPreTable').datagrid('getPager').pagination("options");
	var params = serializeJson("conditionForm");
	if(!params){
		return false;
	}
	
	var count = data.rows.length;
	if(count<=0){
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
		return false;
	}
	
	var total = paper.total;
	//alert(total);
	var exportSize = 65000;
	
	if(parseInt(total) > exportSize){
		var page = (parseInt(total) + exportSize - 1) / exportSize;
		$.messager.prompt('提示', '每页导出数据65000条，当前数据量超过65000条，请输入要导出的页数：', function(r){
			if (r){
				var re =  /^[1-9]+[0-9]*]*$/;
				
				if (!re.test(r) || parseInt(r)<=0 || parseInt(r)>=page) {
					$.messager.alert('错误提示', '请输入正确的页数', 'error');
					return false;
				}
				
				var end = r * exportSize;
				if(end > total){
					end = total;
				}
				params["start"] = (r - 1) * exportSize + 1;
				params["end"] = end;
				//return false;
				openWindowWithJson(root +'/mailMode/ExportMailMode',params);
			}
		});
	}else{
		params["start"] = 1;
		params["end"] = paper.total;
		//return false;
		openWindowWithJson(root +'/mailMode/ExportMailMode',params);
	}
}

function closeAdd() {
	$('#mailModeAddForm').form('reset');
	$('#mailModeAdd').dialog('close');
}

/** -------- 重置查询条件 ------ */
function mailPreReset() {
	$('#conditionForm').form('reset');

}
function mailModeAddReset() {
	$('#mailModeAddForm').form('reset');
}