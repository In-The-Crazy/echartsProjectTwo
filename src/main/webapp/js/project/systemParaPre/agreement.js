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
	$('#startdate').datebox({
		required : false
	});
	$('#enddate').datebox({
		required : false
	});
	var today = new Date();
	var first = new Date();
	first.setDate(1);
	today = today.pattern("yyyy-MM-dd");
	first = first.pattern("yyyy-MM-dd");
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_add = {
		id : "airMailAdd",
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
	$('#airMailAdd').dialog('close');
	// 添加窗口
	initDialog(dialog_edit);
	$('#airMailEdit').dialog('close');
	// 添加窗口
	initDialog(dialog_set);
	$('#setChannel').dialog('close');
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
			$.messager.alert('错误提示', '参数有效起始日期不能大于参数有效截止日期', 'error');
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
	console.log(params);
//	return false;
	// 加载表格
	$('#mailPreTable').datagrid({
		url : root+'/agreeContent/queryAgreeContent',
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
			field : 'agreeId',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'channel',
			title : '渠道编号',
			align : 'center',
			formatter : function(value, row, index){
//				console.log(value);
				var valueArr=value.split(",");
//				console.log(valueArr);
				var channelArr=[];
				for (var i = 0; i < channels.length; i++) {
//					console.log(channels);
					for(var j=0;j<valueArr.length;j++){
						if(channels[i].chalCode == valueArr[j]){
							channelArr.push(channels[i].chalName);
							continue;
						}
					}
					
				}
				return channelArr.join(",");
			},
			width : 100
		},{
			field : 'agreeCode',
			title : '协议编号',
			align : 'center',
			formatter : baseFormater,
			width : 100
		},  {
			field : 'agreeTitel',
			title : '协议标题',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'agreeType',
			title : '协议类型',
			align : 'center',
			formatter : baseFormater,
			width : 50
		},
		{
			field : 'agreeContent',
			title : '协议内容',
			align : 'center',
			formatter : baseFormater,
			width : 200
		},  {
			field : 'createDate',
			title : '协议创建日期',
			align : 'center',
			formatter : baseFormater,
			width :100
		}, {
			field : 'agreeGroup',
			title : '协议组',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'agreeStatus',
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
	var flag=row.agreeStatus;
	var _id="'"+row.agreeId+"'";
	var start,stop;
	if(flag=="1"){
//		console.log("00000000");
		start='<a href="javascript:void(0)" onclick="startUse(' + _id + ',0)">禁用</a>'
	}else{
		start='<a href="javascript:void(0)" onclick="startUse(' + _id + ',1)">启用</a>'
	}
	return start;
};
/** --------加载树形 ------ */
function ajaxTree() {
	//添加省份
	var add = {
		url :root+'/cityAirport/queryProvinceTree',
		callBackFun : function(data) {
			$('#add_sf').combobox({
				data : data.treeList,
				required : true,
				valueField:'id',
				textField:'text'
			});
		}
	}
	sendAjaxRequest(add);
	//渠道设置
	var channel={
			url : root+'/common/channels',
			callBackFun : function(data) {
				channels = data.rows;
				console.log("pindao");
				console.log(channels);
				var treeList = rowsListAddAll(data.rows, {
					"checked" : true,
					"children" : null,
					"chalCode" : "",
					"chalName" : "全部"
				});
				//渠道设置
				$('#channel').combobox({
					data:treeList,
					valueField:'chalCode',
					editable : false,
					limitToList:true,
					textField:'chalName'
				});
				//渠道设置
				$('#add_channel,#set_channel,#edit_channel').combobox({
					data:data.rows,
					valueField:'chalCode',
					editable : false,
					required : true,
					checkbox : true,
					limitToList:true,
					multiple:true,
					textField:'chalName'
				});
			}
		};
	sendAjaxRequest(channel);
	//协议类型
	$('#add_agreeType,#edit_agreeType').combobox({
		data: [{
			"id" : "text",
			"text" : "text"
		},{
			"id" : "html",
			"text" : "html"
		}],
		valueField:'id',
		editable : false,
		required : true,
		textField:'text'
	});
	
	
	//启用禁用
	$('#add_agreeStatus,#edit_agreeStatus').combobox({
		data: [{
			"id" : "1",
			"text" : "是"
		},{
			"id" : "0",
			"text" : "否"
		}],
		valueField:'id',
		editable : false,
		required : true,
		textField:'text'
	});
//	$('#add_mailStatus').combobox('select', '1');
//	$('#add_channel').combobox('select', '1');
//	$('#add_mailStatus').combobox('select', '1');
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
		$("#edit_id").val(selected.agreeId);
		$('#edit_channel').combobox('setValues', arr);
		$("#edit_agreeCode").textbox('setValue',selected.agreeCode);
		$("#edit_agreeType").combobox('setValues',selected.agreeType);
		$("#edit_agreeStatus").combobox('setValues',selected.agreeStatus);
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
		    ids.push(selecteds[i].agreeId);
//			deleteJob1(selecteds[i].id);
		}  
		console.log(ids);
		$("#set_channelId").val(ids);
		$('#setChannel').dialog('open');
		
	}
}
/** -------- 修改 ------ */
function eidtMail(){
	var eidtflag = $("#airMailEditForm").form('validate');
	if(!eidtflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("airMailEditForm");
	params["channel"] = $("#edit_channel").combobox("getValues").join(",");
	console.log(params);
	var midchannel=$("#edit_channel").combobox("getValues").join(",");
	if(midchannel.indexOf(",")==0){
		params["channel"] =midchannel.substring(1);
	}else{
		params["channel"] =midchannel;
	}
	var add = {
		url :root+'/agreeContent/updateAgreeContent',
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
	console.log("qi");
	var re = {
			url :root+'/agreeContent/validityAgreeContent',
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
	var set = {
		url :root+'/agreeContent/modifyAgreeContentChannel',
		data :params ,
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
/** -------- 添加 ------ */
function addAirCity(){
	var addflag = $("#airMailAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("airMailAddForm");
	var subchannel=$("#add_channel").combobox("getValues").join(",");
	if(subchannel.indexOf(",")==0){
		params["channel"] =subchannel.substring(1);
	}else{
		params["channel"] =subchannel;
	}
	console.log(params);
//	return false;
	var add = {
		url : root+'/agreeContent/addAgreeContent',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("mailPreTable");
			}
			$('#airMailAdd').dialog('close');
			showMessage(data);
			airMailAddReset();
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
			ids.push(selectedRow[i].agreeId);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root+'/agreeContent/deleteAgreeContent';
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
				openWindowWithJson(root +'/agreeContent/ExportAgreeContent',params);
			}
		});
	}else{
		params["start"] = 1;
		params["end"] = paper.total;
		//return false;
		openWindowWithJson(root +'/agreeContent/ExportAgreeContent',params);
	}
}
/** -------- 重置查询条件 ------ */
function mailPreReset() {
	$('#conditionForm').form('reset');

}
function airMailAddReset() {
	$('#airMailAddForm').form('reset');
//	$('#add_mailStatus').combobox('select', '1');
//	$('#add_channel').combobox('select', '1');
//	$('#add_mailStatus').combobox('select', '1');
}