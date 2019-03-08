var types,channels;
/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面模块
	initPage();
	// 初始化表单
	initFrom();
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
	var dialog_add = {
		id : "insuranceTypeAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "insuranceTypeEdit",
		title : "修改"
	};
	var dialog_info = {
			id : "insuranceTypeInfo",
			title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#insuranceTypeAdd').dialog('close');
	// 修改窗口
	initDialog(dialog_edit);
	$('#insuranceTypeEdit').dialog('close');
	// 详情窗口
	initDialog(dialog_info);
	$('#insuranceTypeInfo').dialog('close');
}

/** -------- 初始化表单 ------ */
function initFrom(){
	$('#officeCode').textbox({
		label : 'OFFICE编号：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#insuranceProductName').textbox({
		label : '保险名称：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#add_iataNo,#edit_iataNo').textbox({
		label : 'iata航协号：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#info_iataNo').textbox({
		label : 'iata航协号：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
	$('#add_officeName,#edit_officeName').textbox({
		label : 'OFFICE账号名称：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#info_officeName').textbox({
		label : 'OFFICE账号名称：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
	$('#add_officeCode,#edit_officeCode').textbox({
		label : 'OFFICE编号：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#info_officeCode').textbox({
		label : 'OFFICE编号：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
	$('#add_currencyType,#edit_currencyType').textbox({
		label : '货币类型：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		value : "CNY",
		width : 300
	});
	$('#info_currencyType').textbox({
		label : '货币类型：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
	$('#add_ticketType,#edit_ticketType').textbox({
		label : '电子客票类型：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		value : "ARL",
		width : 300
	});
	$('#info_ticketType').textbox({
		label : '电子客票类型：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
	$('#add_buyNum,#edit_buyNum').numberbox({
		label : '选购份数：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#info_buyNum').numberbox({
		label : '选购份数：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
	$('#add_premium,#edit_premium').numberbox({
		label : '保费：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#info_premium').numberbox({
		label : '保费：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
	$('#add_repay,#edit_repay').numberbox({
		label : '保额：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#info_repay').numberbox({
		label : '保额：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
	$('#add_checkto,#edit_checkto').combobox({
		label : '账单结算归属单位：',
		labelWidth : 150,
		labelAlign : "right",
		editable : false,
		required : true,
		width : 300,
		valueField: 'id',
		textField: 'text',
		data: [{
			"id": 'A',
			"text": '航联'
		},{
			"id": 'AI',
			"text": '航联和航协'
		}]
	});
	$('#info_checkto').combobox({
		label : '账单结算归属单位：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300,
		valueField: 'id',
		textField: 'text',
		data: [{
			"id": 'A',
			"text": '航联'
		},{
			"id": 'AI',
			"text": '航联和航协'
		}]
	});
	$('#add_companyCode,#edit_companyCode').textbox({
		label : '保险公司代码：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#info_companyCode').textbox({
		label : '保险公司代码：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
	$('#add_companyName,#edit_companyName').textbox({
		label : '保险公司名称：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#info_companyName').textbox({
		label : '保险公司名称：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
	$('#add_insuranceProductCode,#edit_insuranceProductCode').textbox({
		label : '保险产品代码：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#info_insuranceProductCode').textbox({
		label : '保险产品代码：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
	$('#add_insuranceProductId,#edit_insuranceProductId').textbox({
		label : '保险产品Id：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#info_insuranceProductId').textbox({
		label : '保险产品Id：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
	$('#add_insuranceProductName,#edit_insuranceProductName').textbox({
		label : '保险产品名称：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#info_insuranceProductName').textbox({
		label : '保险产品名称：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
	$('#add_protocolId,#edit_protocolId').textbox({
		label : '协议id：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#info_protocolId').textbox({
		label : '协议id：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
	$('#add_protocolProductName,#edit_protocolProductName').textbox({
		label : '产品协议名称：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#info_protocolProductName').textbox({
		label : '产品协议名称：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
	$('#add_userName,#edit_userName').textbox({
		label : 'OFFICE配置名称：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#info_userName').textbox({
		label : 'OFFICE配置名称：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
	$('#add_password,#edit_password').passwordbox({
		label : 'OFFICE配置密码：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#info_password').passwordbox({
		label : 'OFFICE配置密码：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
	$('#add_protocolProductId,#edit_protocolProductId').textbox({
		label : '产品协议id：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#info_protocolProductId').textbox({
		label : '产品协议id：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
	$('#add_insuranceTerm,#edit_insuranceTerm').textbox({
		label : '保险条款内容：',
		labelWidth : 150,
		labelAlign : "right",
		multiline : true,
		required : true,
		width : 600,
		height : 200
	});
	$('#info_insuranceTerm').textbox({
		label : '保险条款内容：',
		labelWidth : 150,
		labelAlign : "right",
		multiline : true,
		readonly : true,
		width : 600,
		height : 200
	});
	$('#add_remark,#edit_remark').textbox({
		label : '备注：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#add_commissionRate,#edit_commissionRate').textbox({
		label : '佣金比例：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#add_payCode,#edit_payCode').textbox({
		label : '支付平台代码：',
		labelWidth : 150,
		labelAlign : "right",
		required : true,
		width : 300
	});
	$('#info_payCode').textbox({
		label : '支付平台代码：',
		labelWidth : 150,
		labelAlign : "right",
		readonly : true,
		width : 300
	});
}

/** --------加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#insuranceTypeTable').datagrid({
		url : root + '/insurance/queryInsuraces',
		toolbar : "#toolbar",
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : true,// 定义是否设置基于该行内容的行高度
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
			field : 'insuranceDeployId',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'protocolProductName',
			title : '产品协议名称',
			align : 'center',
			formatter : infoFormater,
			width : 150
		}, {
			field : 'insuranceProductName',
			title : '保险名称',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'buyNum',
			title : '选购份数',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		}, {
			field : 'premium',
			title : '保费',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'repay',
			title : '保额',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'commissionRate',
			title : '佣金比例',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'payCode',
			title : '支付平台代码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'insuranceType',
			title : '保险类型',
			align : 'center',
			formatter : function(value, row, index){
				for (var i = 0; i < types.length; i++) {
					if(types[i].dincCode == value){
						return types[i].dincName;
					}
				}
				return "--";
			},
			width : 75
		}, {
			field : 'buyFlag',
			title : '可够状态',
			align : 'center',
			formatter : function(value, row, index){
				if(0 == value){
					return "不可购";
				}
				if(1 == value){
					return "可购";
				}
				return "--";
			},
			width : 75
		}, {
			field : 'channel',
			title : '渠道',
			align : 'center',
			formatter : function(value, row, index){
				for (var i = 0; i < channels.length; i++) {
					if(channels[i].chalCode == value){
						return channels[i].chalName;
					}
				}
				return "--";
			},
			width : 75
		}, {
			field : 'createDate',
			title : '创建时间',
			align : 'center',
			formatter : baseFormater,
			width : 150
		} ] ]
	});
	
	/** -------- 自定义表格视图 ------ */
	$('#insuranceTypeTable').datagrid({
		view: detailview,
		detailFormatter:function(index,row){
			return '<div class="ddv" style="padding:5px 0"></div>';
		},
		onExpandRow: function(index,row){
			var ddv = $(this).datagrid('getRowDetail',index).find('div.ddv');
			ddv.html("<span style='color:#15428B;font-weight:bold;'>条款明细：</span>"+row.insuranceTerm);
			ddv.panel({
				height : 100,
				border : false,
 				cache : false,
				onLoad:function(){
					$('#insuranceTypeTable').datagrid('fixDetailRowHeight',index);
				}
			});
			$('#insuranceTypeTable').datagrid('fixDetailRowHeight',index);
		}
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	var type = {
		url : root + '/common/querydictsByType',
		data : {
			"type" : "insuranceType"
		},
		callBackFun : function(data) {
			types = data.rows;
			$('#add_insuranceType,#edit_insuranceType').combobox({
				label : '保险类型：',
				labelWidth : 150,
				labelAlign : "right",
				data : types,
				valueField: 'dincCode',
				textField: 'dincName',
				editable : false,
				required : true,
				width : 300
			});
			$('#info_insuranceType').combobox({
				label : '保险类型：',
				labelWidth : 150,
				labelAlign : "right",
				data : types,
				valueField: 'dincCode',
				textField: 'dincName',
				readonly : true,
				width : 300
			});
			var treeList = rowsListAddAll(types, {
				"checked" : true,
				"children" : null,
				"dincCode" : "",
				"dincName" : "全部"
			});
			$('#insuranceType').combobox({
				label : '保险类型：',
				labelWidth : 100,
				labelAlign : "right",
				data : treeList,
				valueField: 'dincCode',
				textField: 'dincName',
				editable : false,
				width : 250
			});
		}
	}
	sendAjaxRequest(type);
	//渠道
	var channel = {
		url : root + '/common/channels',
		callBackFun : function(data) {
			channels = data.rows;
			$('#add_channel,#edit_channel').combobox({
				label : '渠道：',
				labelWidth : 150,
				labelAlign : "right",
				data : channels,
				valueField: 'chalCode',
				textField: 'chalName',
				editable : false,
				multiple : true,
				required : true,
				width : 300
			});
			$('#info_channel').combobox({
				label : '渠道：',
				labelWidth : 150,
				labelAlign : "right",
				data : channels,
				valueField: 'chalCode',
				textField: 'chalName',
				readonly : true,
				width : 300
			});
			var treeList = rowsListAddAll(channels, {
				"checked" : true,
				"children" : null,
				"chalCode" : "",
				"chalName" : "全部"
			});
			$('#channel').combobox({
				label : '渠道：',
				labelWidth : 100,
				labelAlign : "right",
				data : treeList,
				valueField: 'chalCode',
				textField: 'chalName',
				editable : false,
				width : 250
			});
		}
	}
	sendAjaxRequest(channel);
	$('#add_buyFlag,#edit_buyFlag').combobox({
		label : '可购状态：',
		labelWidth : 150,
		labelAlign : "right",
		data : [{
			"id" : "0",
			"text" : "不可购"
		},{
			"id" : "1",
			"text" : "可购"
		}],
		valueField: 'id',
		textField: 'text',
		editable : false,
		required : true,
		width : 300
	});
	$('#info_buyFlag').combobox({
		label : '可购状态：',
		labelWidth : 150,
		labelAlign : "right",
		data : [{
			"id" : "0",
			"text" : "不可购"
		},{
			"id" : "1",
			"text" : "可购"
		}],
		valueField: 'id',
		textField: 'text',
		readonly : true,
		width : 300
	});
	$('#buyFlag').combobox({
		label : '可购状态：',
		labelWidth : 100,
		labelAlign : "right",
		data : [{
			"id" : "",
			"text" : "全部"
		},{
			"id" : "0",
			"text" : "不可购"
		},{
			"id" : "1",
			"text" : "可购"
		}],
		valueField: 'id',
		textField: 'text',
		editable : false,
		width : 250
	});
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#insuranceTypeTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function templetIdFormater(value, row, index) {
	var _id = row.id;
	return _id;
};
function startFdateFormater(value, row, index) {
	var _startFdate = dateTimeFormater(row.startFdate,row,index);
	var _endFdate = dateTimeFormater(row.endFdate,row,index);
	return _startFdate + "<br/>" + _endFdate;
};
function infoFormater(value, row, index) {
	var text = baseFormater(value, row, index);
	var _flag = "'info'";
	var detail = '<a href="javascript:void(0);" onclick="getInfo(' + _flag + ',' + index + ')">' + text + '</a>';
	return detail;
};

/** --------查看详情 ------ */
function getInfo(flag,index) {
	if(flag == 'edit'){
		var selecteds = $('#insuranceTypeTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#insuranceTypeTable').datagrid('getSelected')
		$("#insuranceTypeEditForm").form("load",selected);
		
		$('#insuranceTypeEdit').dialog('open');
	}
	if(flag == 'info'){
		var selected = $('#insuranceTypeTable').datagrid('selectRow',index);
		var selected = $('#insuranceTypeTable').datagrid('getSelected');
		$("#insuranceTypeInfoForm").form("load",selected);
		
		$('#insuranceTypeInfo').dialog('open');
	}
}
/** -------- 添加 ------ */
function addinsuranceType(){
	var addflag = $("#insuranceTypeAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("insuranceTypeAddForm");
	
	var subchannel=$("#add_channel").combobox("getValues").join(",");
	if(subchannel.indexOf(",")==0){
		params["channel"] = subchannel.substring(1);
	}else{
		params["channel"] = subchannel;
	}
	
	var add = {
		url : root + '/insurance/addInsurace',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("insuranceTypeTable");
			}
			$('#insuranceTypeAdd').dialog('close');
			showMessage(data);
			insuranceTypeAddReset();
		}
	}
	sendAjaxRequest(add);
}
/** -------- 修改 ------ */
function editinsuranceType(){
	var addflag = $("#insuranceTypeEditForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("insuranceTypeEditForm");
	
	var subchannel=$("#edit_channel").combobox("getValues").join(",");
	if(subchannel.indexOf(",")==0){
		params["channel"] = subchannel.substring(1);
	}else{
		params["channel"] = subchannel;
	}
	
	var edit = {
		url : root + '/insurance/updateInsurace',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("insuranceTypeTable");
			}
			$('#insuranceTypeEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(edit);
}

/** -------- 批量删除 ------ */
function delinsuranceType() {
	var selecteds = $('#insuranceTypeTable').datagrid('getSelections');
	if(selecteds.length!=1){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#insuranceTypeTable').datagrid('getSelected')) {
		var selectedRow = $('#insuranceTypeTable').datagrid('getSelected');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root + '/insurance/delInsurace';
				var options = {
					url : url,
					data : {
						"insuranceDeployId" : selectedRow.insuranceDeployId,
						"buyFlag" : 1
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("insuranceTypeTable");
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
function exportCouponTemplet() {
	var data = $('#insuranceTypeTable').datagrid('getData');
	var params = validateForm();
	if(!params){
		return false;
	}
	var count = data.rows.length;
	if(count>0){
		openWindowWithJson('exportCouponTemplet.action',params);
	}else{
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
	}
}

/** -------- 重置查询条件 ------ */
function insuranceTypeReset() {
	$("#conditionForm").form("reset");
}
function insuranceTypeAddReset() {
	$('#insuranceTypeAddForm').form('reset');
}
