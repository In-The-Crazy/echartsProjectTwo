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
	$('#createDates').datebox({
		label : '创建时间开始：',
		labelWidth : 100,
		labelAlign : "right",
		editable : false,
		required : false,
		width : 250,
		onSelect : function(beginDate) {
			$('#createDatee').datebox().datebox('calendar').calendar({
				validator : function(date) {
					return beginDate <= date;
				}
			});
		}
	});
	$('#createDatee').datebox({
		label : '创建时间结束：',
		labelWidth : 100,
		labelAlign : "right",
		editable : false,
		required : false,
		width : 250
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	$('#upgradCode').textbox({
		label : '产品编码：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	})
	$('#upgradName').textbox({
		label : '产品名称：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	})
	$('#createOpName').textbox({
		label : '创建人：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	})
	
	$("#add_policyRemark,#edit_policyRemark").textbox({
		label : '备注：',
		labelWidth : 100,
		labelAlign : "right",
		multiline:true,
		width : 250,
		height : 100,
		required : true
	})
	
	var dialog_add = {
		id : "policyAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "policyEdit",
		title : "修改"
	};
	var dialog_import = {
		id : "freeImprot",
		title : "导入"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#policyAdd').dialog('close');
	// 添加窗口
	initDialog(dialog_edit);
	$('#policyEdit').dialog('close');
	// 导入窗口
	initDialog(dialog_import);
	$('#freeImprot').dialog('close');
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
	$('#policyTable').datagrid({
		url : root+'/upgradFlightPolicy/queryPolicyList',
		toolbar : "#toolbar",
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		showHeader : true,
		pageNumber : 1,
		pageSize : 20,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : true,// 是否显示行号
		singleSelect : false,// 是否只能选中一条
		queryParams : params,
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
			$.messager.alert('错误提示', '数据加载失败!', 'error');
		},
		onLoadSuccess : function(data) {
		},
		columns : [ [ {
			field : 'policyId',
			checkbox : 'true',
			align : 'center',
			width : 25
		},{
			field : 'upgradCode',
			title : '产品编码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},{
			field : 'upgradName',
			title : '产品名称',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},{
			field : 'channel',
			title : '渠道编号',
			align : 'center',
			formatter : function(value, row, index){
				if(value==""){
					return "全渠道";
				}else{
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
				}
				
			}
		}, {
			field : 'isinter',
			title : '国内/国际',
			align : 'center',
			formatter : isInterFormater,
			width : 75
		}, {
			field : 'passengerType',
			title : '乘客类型',
			align : 'center',
			formatter : function(value, row, index) {
				var passengerTypeArr=[];
				var valueArr=value.split(",");
				for (var int = 0; int < valueArr.length; int++) {
					if (valueArr[int] == '0') {
						passengerTypeArr.push('成人');
					}else if (valueArr[int] == '1') {
						passengerTypeArr.push('儿童');
					}else if (valueArr[int] == '2') {
						passengerTypeArr.push('婴儿');
					}
				}
				return passengerTypeArr.join(",");
			},
			width : 75
		}, {
			field : 'policyCabin',
			title : '适用可升舱舱位',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'createDate',
			title : '创建时间',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'createOpName',
			title : '创建人',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'modifyDate',
			title : '修改时间',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'modifyOpName',
			title : '修改人',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'policyRemark',
			title : '备注',
			align : 'center',
			formatter : baseFormater
		},{
			field : 'policyStatus',
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
	var flag=row.policyStatus;
	var _id="'"+row.policyId+"'";
	var start;
	if(flag=="1"){
		start='<a href="javascript:void(0)" onclick="startUse(' + _id + ',0)">禁用</a>'
	}else{
		start='<a href="javascript:void(0)" onclick="startUse(' + _id + ',1)">启用</a>'
	}
	return start;
};

/** --------加载树形 ------ */
function ajaxTree() {
	//机场城市
	var city = {
		url :root+'/upgradFlightPolicy/queryUpgradTree',
		callBackFun : function(data) {
			$('#add_upgradId,#edit_upgradId').combobox({
				label: '升舱产品：',
				labelWidth: 100,
				labelAlign: "right",
				width: 250,
				data : data.treeList,
				valueField:'id',
				textField:'text',
				required : true,
				editable : false,
				multiple : false,
				limitToList : true
			});
		}
	}
	sendAjaxRequest(city);
	//渠道设置
	var channel={
		url : root+'/common/channels',
		callBackFun : function(data) {
			channels = data.rows;
			var treeList = rowsListAddAll(data.rows, {
				"checked" : true,
				"children" : null,
				"chalId" : "",
				"chalName" : "全部"
			});
			//渠道设置
			$('#add_channel,#edit_channel').combobox({
				label: '渠道：',
				labelWidth: 100,
				labelAlign: "right",
				width: 250,
				data:data.rows,
				valueField:'chalCode',
				textField:'chalName',
				required : true,
				editable : false,
				multiple : true,
				limitToList : false
			});
			$('#channel').combobox({
				label : '渠道：',
				labelWidth : 100,
				labelAlign : "right",
				width : 250,
				data:treeList,
				valueField:'chalCode',
				textField:'chalName',
				required : false,
				editable : false,
				multiple : false,
				limitToList : true
			});
		}
	};
	sendAjaxRequest(channel);
	
	$('#add_isinter,#edit_isinter').combobox({
		label : '国际/国内：',
		labelWidth : 100,
		labelAlign : "right",
		data : [{
			"id" : "0",
			"text" : "国内"
		},{
			"id" : "1",
			"text" : "国际"
		}],
		valueField : 'id',
		textField:'text',
		width : 250,
		required : true,
		editable : false,
		multiple : false,
		limitToList : true
	});
	$('#add_policyStatus,#edit_policyStatus').combobox({
		label : '启用/禁用：',
		labelWidth : 100,
		labelAlign : "right",
		data : [{
			"id" : "1",
			"text" : "启用"
		},{
			"id" : "0",
			"text" : "禁用"
		}],
		valueField : 'id',
		textField:'text',
		width : 250,
		required : true,
		editable : false,
		multiple : false,
		limitToList : true
	});
	$('#add_passengerType,#edit_passengerType').combobox({
		label : '乘客类型：',
		labelWidth : 100,
		labelAlign : "right",
		data : [{
			"id" : "0",
			"text" : "成人"
		},{
			"id" : "1",
			"text" : "儿童"
		},{
			"id" : "2",
			"text" : "婴儿"
		}],
		valueField : 'id',
		textField:'text',
		width : 250,
		required : true,
		editable : false,
		multiple : true,
		limitToList : false
	});
	$("#add_policyCabin,#edit_policyCabin").combobox({
		label: '适用可升舱舱位：',
		labelWidth: 100,
		labelAlign: "right",
		data : [{"id" : "A","text" : "A"},{"id" : "B","text" : "B"},{"id" : "C","text" : "C"},{"id" : "D","text" : "D"},{"id" : "E","text" : "E"},{"id" : "F","text" : "F"},{"id" : "G","text" : "G"},
		        {"id" : "H","text" : "H"},{"id" : "I","text" : "I"},{"id" : "J","text" : "J"},{"id" : "K","text" : "K"},{"id" : "L","text" : "L"},{"id" : "M","text" : "M"},{"id" : "N","text" : "N"},
		        {"id" : "O","text" : "O"},{"id" : "P","text" : "P"},{"id" : "Q","text" : "Q"},{"id" : "R","text" : "R"},{"id" : "S","text" : "S"},{"id" : "T","text" : "T"},
		        {"id" : "U","text" : "U"},{"id" : "V","text" : "V"},{"id" : "W","text" : "W"},{"id" : "X","text" : "X"},{"id" : "Y","text" : "Y"},{"id" : "Z","text" : "Z"}
		],
		valueField : 'id',
		textField:'text',
		width : 250,
		required : true,
		editable : false,
		multiple : true,
		limitToList : false
	})
	
	
	$("#policyCabin").combobox({
		label: '适用可升舱舱位：',
		labelWidth: 100,
		labelAlign: "right",
		data : [{"id" : "","text" : "全部"},
		        {"id" : "A","text" : "A"},{"id" : "B","text" : "B"},{"id" : "C","text" : "C"},{"id" : "D","text" : "D"},{"id" : "E","text" : "E"},{"id" : "F","text" : "F"},{"id" : "G","text" : "G"},
		        {"id" : "H","text" : "H"},{"id" : "I","text" : "I"},{"id" : "J","text" : "J"},{"id" : "K","text" : "K"},{"id" : "L","text" : "L"},{"id" : "M","text" : "M"},{"id" : "N","text" : "N"},
		        {"id" : "O","text" : "O"},{"id" : "P","text" : "P"},{"id" : "Q","text" : "Q"},{"id" : "R","text" : "R"},{"id" : "S","text" : "S"},{"id" : "T","text" : "T"},
		        {"id" : "U","text" : "U"},{"id" : "V","text" : "V"},{"id" : "W","text" : "W"},{"id" : "X","text" : "X"},{"id" : "Y","text" : "Y"},{"id" : "Z","text" : "Z"}
        ],
        valueField : 'id',
        textField:'text',
        width : 250,
        required : false,
        editable : false,
        multiple : false,
        limitToList : true
	})
	$('#isinter').combobox({
		label : '国际/国内：',
		labelWidth : 100,
		labelAlign : "right",
		data : [{
			"id" : "",
			"text" : "全部"
		},{
			"id" : "0",
			"text" : "国内"
		},{
			"id" : "1",
			"text" : "国际"
		}],
		valueField : 'id',
		textField:'text',
		width : 250,
		required : false,
		editable : false,
		multiple : false,
		limitToList : true
	});
	
	$('#isPastDue').combobox({
		label : '是否过期：',
		labelWidth : 100,
		labelAlign : "right",
		data : [{
			"id" : "",
			"text" : "全部"
		},{
			"id" : "0",
			"text" : "已过期"
		},{
			"id" : "1",
			"text" : "未过期"
		}],
		valueField : 'id',
		textField:'text',
		editable : false,
		width : 250
	});
	
	$('#policyStatus').combobox({
		label : '启用/禁用：',
		labelWidth : 100,
		labelAlign : "right",
		data : [{
			"id" : "",
			"text" : "全部"
		},{
			"id" : "1",
			"text" : "启用"
		},{
			"id" : "0",
			"text" : "禁用"
		}],
		valueField : 'id',
		textField:'text',
		editable : false,
		width : 250
	});
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#policyTable').datagrid('resize');
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

/** --------查看会员详情 ------ */
function getInfo() {
	var selecteds = $('#policyTable').datagrid('getSelections');
	if(selecteds.length!=1){
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	var selected = $('#policyTable').datagrid('getSelected');
	$("#policyEditForm").form("load", selected);
	$('#policyEdit').dialog('open');
}

/** -------- 添加 ------ */
function addPolicy(){
	var addflag = $("#policyAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("policyAddForm");
	
	var subchannel=$("#add_channel").combobox("getValues").join(",");
	if(subchannel.indexOf(",")==0){
		params["channel"] = subchannel.substring(1);
	}else{
		params["channel"] = subchannel;
	}
	
	var subcabin=$("#add_policyCabin").combobox("getValues").join(",");
	if(subcabin.indexOf(",")==0){
		params["policyCabin"] = subcabin.substring(1);
	}else{
		params["policyCabin"] = subcabin;
	}
	
	var add = {
		url :root+'/upgradFlightPolicy/addPolicy',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("policyTable");
			}
			$('#policyAdd').dialog('close');
			showMessage(data);
			policyAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editPolicy(){
	var editflag = $("#policyEditForm").form('validate');
	if(!editflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("policyEditForm");
	var supchannel=$("#edit_channel").combobox("getValues").join(",");
	if(supchannel.indexOf(",")==0){
		params["channel"] =supchannel.substring(1);
	}else{
		params["channel"] =supchannel;
	}
	
	var subcabin=$("#edit_policyCabin").combobox("getValues").join(",");
	if(subcabin.indexOf(",")==0){
		params["policyCabin"] = subcabin.substring(1);
	}else{
		params["policyCabin"] = subcabin;
	}
	var edit = {
			url :root+'/upgradFlightPolicy/updatePolicy',
			data : params,
			callBackFun : function(data) {
				if (data.isSuccessOrfail == "SUCCESS") {
					reloadTable("policyTable");
				}
				$('#policyEdit').dialog('close');
				showMessage(data);
			}
	}
	sendAjaxRequest(edit);
}

/** -------- 启用禁用------ */
function startUse(id,flag){
	var msg = "";
	if (flag == '1') {
		msg = "是否确认启用？";
	}else if (flag == '0') {
		msg = "是否确认禁用？";
	}
	$.messager.confirm('删除提示', msg, function(r) {
		// 首先如果用户选择了数据，则获取选择的数据集合
		if (r) {
			var re = {
				url :root+'/upgradFlightPolicy/updatePolicyStatus',
				data : {
					policyStatus:flag,
					policyId:id
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("policyTable");
					}
					showMessage(data);
				}
			}
			sendAjaxRequest(re);
		}
	});
	
}

/** -------- 批量删除 ------ */
function delPolicy() {
	var selecteds = $('#policyTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#policyTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#policyTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].policyId);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url =root+'/upgradFlightPolicy/deletePolicy';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("policyTable");
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
function exportPolicyList() {
	var data = $('#policyTable').datagrid('getData');
	var paper = $('#policyTable').datagrid('getPager').pagination("options");
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
				openWindowWithJson(root +'/upgradFlightPolicy/exportUpgradFree',params);
			}
		});
	}else{
		params["start"] = 1;
		params["end"] = paper.total;
		openWindowWithJson(root +'/upgradFlightPolicy/exportUpgradFree',params);
	}
}

function importFreeList() {
	if(isEmpty($('#importExcel').val())){
		$.messager.alert('提示信息','请选择文件！','info');
		return false;
	}
	//获取文件参数
	var fd = new FormData();
	fd.append("importExcel", document.getElementById('importExcel').files[0]);
	//AJAX请求
	var xhr = new XMLHttpRequest();
	xhr.open("POST", root+'/upgradFlightPolicy/importFree');
	xhr.onreadystatechange = function () {
		//4: 请求已完成，且响应已就绪
		if(xhr.readyState==4){
			var data = xhr.responseText;
			data = eval('(' + data + ')');
			if (data.isSuccessOrfail == "SUCCESS") {
				freeImportReset()
				reloadTable("policyTable");
				$('#freeImprot').dialog('close');
				$.messager.alert('提示信息','成功'+data.total+"条",'info');
			}
			showMessage(data);
		}
	}
	xhr.send(fd);
}

/** -------- 重置查询条件 ------ */
function airCityPreReset() {
	$('#conditionForm').form('reset');
}
function policyAddReset() {
	$('#policyAddForm').form('reset');
}
function freeImportReset() {
	$('#freeImprotForm').form('reset');
}