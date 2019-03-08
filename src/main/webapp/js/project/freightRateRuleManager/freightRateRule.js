var channels=[];
var discountDirections=[];
var applyFreightTypes=[];
var discountTypes=[];
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
	$('#add_saleBeginTime,#edit_saleBeginTime').datetimebox({
		label: '销售开始日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
	$('#add_saleEndTime,#edit_saleEndTime').datetimebox({
		label: '销售截止日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
	$('#add_flightBeginDate,#edit_flightBeginDate').datebox({
		label: '航班开始日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
	$('#add_flightEndDate,#edit_flightEndDate').datebox({
		label: '航班截止日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	$("#add_ruleName,#edit_ruleName").textbox({
		label: '规则名称：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$("#add_flightno,#edit_flightno").textbox({
		label: '航班号：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$("#add_cabin,#edit_cabin").textbox({
		label: '舱位：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$("#add_departureAirport,#edit_departureAirport").textbox({
		label: '出发城市三字码：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$("#add_arrivalAirport,#edit_arrivalAirport").textbox({
		label: '到达城市三字码：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$("#add_operatingcarrier,#edit_operatingcarrier").textbox({
		label: '承运方代码：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250,
		value: 'NS'
	});
	$("#add_marketcarrier,#edit_marketcarrier").textbox({
		label: '市场方代码：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250,
		value: 'NS'
	});
	$("#add_discountValue,#edit_discountValue").textbox({
		label: '加减具体值：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$("#add_remark,#edit_remark").textbox({
		label: '备注：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		multiline: true,
		width: 250,
		height: 100
	});
	
	var dialog_add = {
		id : "freightRateAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "freightRateEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#freightRateAdd').dialog('close');
	// 修改窗口
	initDialog(dialog_edit);
	$('#freightRateEdit').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	// 加载表格
	$('#freightRateTable').datagrid({
		url : root+'/freightRateRule/queryFreightRates',
		toolbar : "#toolbar",
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		showHeader : true,
		pageNumber : 1,
		pageSize : 20,
		fitColumns : false,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : false,// 是否只能选中一条
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
			field : 'ruleId',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'ruleName',
			title : '规则名称',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'flightno',
			title : '航班号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'departureAirport',
			title : '出发城市三字码',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'arrivalAirport',
			title : '到达城市三子码',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'operatingcarrier',
			title : '承运方代码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'marketcarrier',
			title : '市场方代码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'saleBeginTime',
			title : '销售开始日期',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'saleEndTime',
			title : '销售截止日期',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'flightBeginDate',
			title : '航班开始日期',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'flightEndDate',
			title : '航班截止日期',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'cabin',
			title : '舱位',
			align : 'center',
			formatter : baseFormater,
			width : 50
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
			width : 75
		},{
			field : 'discountType',
			title : '折扣类型',
			align : 'center',
			formatter : function(value, row, index){
				var valueArr=value.split(",");
				var discountTypeArr=[];
				for (var i = 0; i < discountTypes.length; i++) {
					for(var j=0;j<valueArr.length;j++){
						if(discountTypes[i].dincCode == valueArr[j]){
							discountTypeArr.push(discountTypes[i].dincName);
							continue;
						}
					}
					
				}
				return discountTypeArr.join(",");
			},
			width : 150
		}, {
			field : 'discountDirection',
			title : '折扣方向',
			align : 'center',
			formatter : function(value, row, index){
				var valueArr=value.split(",");
				var discountDirectionArr=[];
				for (var i = 0; i < discountDirections.length; i++) {
					for(var j=0;j<valueArr.length;j++){
						if(discountDirections[i].dincCode == valueArr[j]){
							discountDirectionArr.push(discountDirections[i].dincName);
							continue;
						}
					}
					
				}
				return discountDirectionArr.join(",");
			},
			width : 75
		}, {
			field : 'discountValue',
			title : '加减具体值',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},{
			field : 'applyFreightType',
			title : '适用运价类型',
			align : 'center',
			formatter : function(value, row, index){
				var valueArr=value.split(",");
				var applyFreightTypeArr=[];
				for (var i = 0; i < applyFreightTypes.length; i++) {
					for(var j=0;j<valueArr.length;j++){
						if(applyFreightTypes[i].dincCode == valueArr[j]){
							applyFreightTypeArr.push(applyFreightTypes[i].dincName);
							continue;
						}
					}
					
				}
				return applyFreightTypeArr.join(",");
			},
			width : 100
		}, {
			field : 'ruleStatus',
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
	var flag=row.ruleStatus;
	var _id="'"+row.ruleId+"'";
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
	//渠道设置
	var channel={
		url : root+'/common/channels',
		callBackFun : function(data) {
			channels = data.rows;
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
				multiple:true,
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
	
	//折扣方向
	var discountDirection = {
		url : root+'/common/querydictsByType',
		data : {'type':'discountDirection'},
		callBackFun : function(data) {
			discountDirections = data.rows;
			//权限名称设置
			$('#add_discountDirection,#edit_discountDirection').combobox({
				label: '折扣方向：',
				labelWidth: 100,
				labelAlign: "right",
				width: 250,
				data:data.rows,
				valueField:'dincCode',
				required : true,
				editable : false,
				multiple:false,
				textField:'dincName',
			});
		}
	};
	sendAjaxRequest(discountDirection)
	
	//适用运价类型
	var applyFreightType = {
		url : root+'/common/querydictsByType',
		data : {'type':'applyFreightType'},
		callBackFun : function(data) {
			applyFreightTypes = data.rows;
			//权限名称设置
			$('#add_applyFreightType,#edit_applyFreightType').combobox({
				label: '适用运价类型：',
				labelWidth: 100,
				labelAlign: "right",
				width: 250,
				data:data.rows,
				valueField:'dincCode',
				required : true,
				editable : false,
				multiple:false,
				textField:'dincName',
			});
		}
	};
	sendAjaxRequest(applyFreightType)
	
	//折扣类型
	var discountType = {
		url : root+'/common/querydictsByType',
		data : {'type':'discountType'},
		callBackFun : function(data) {
			discountTypes = data.rows;
			//权限名称设置
			$('#add_discountType,#edit_discountType').combobox({
				label: '折扣类型：',
				labelWidth: 100,
				labelAlign: "right",
				width: 250,
				data:data.rows,
				valueField:'dincCode',
				required : true,
				editable : false,
				multiple:false,
				textField:'dincName',
			});
		}
	};
	sendAjaxRequest(discountType)
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#freightRateTable').datagrid('resize');
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
		var selecteds = $('#freightRateTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		
		var selected = $('#freightRateTable').datagrid('getSelected');
		console.log(selected);
		$('#freightRateEditForm').form('load',selected);
		$("#edit_ruleId").val(selected.ruleId);
		
		$('#freightRateEdit').dialog('open');
	}else{
		var selecteds = $('#freightRateTable').datagrid('getSelections');
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
		    ids.push(selecteds[i].id);
//			deleteJob1(selecteds[i].id);
		}  
		console.log(ids);
		$("#set_channelId").val(ids);
		$('#setChannel').dialog('open');
		
	}
}

/** -------- 启用禁用------ */
function startUse(id,flag){
	var re = {
		url :root+'/freightRateRule/updateRuleStatus',
		data : {
			ruleStatus:flag,
			ruleId:id
		},
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("freightRateTable");
			}
			showMessage(data);
		}
	}
	sendAjaxRequest(re);
}

/** -------- 添加 ------ */
function addFreightRate(){
	var addflag = $("#freightRateAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("freightRateAddForm");
	var subchannel=$("#add_channel").combobox("getValues").join(",");
	if(subchannel.indexOf(",")==0){
		params["channel"] =subchannel.substring(1);
	}else{
		params["channel"] =subchannel;
	}
	console.log(params);
	var add = {
		url : root+'/freightRateRule/addFreightRate',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("freightRateTable");
			}
			$('#freightRateAdd').dialog('close');
			showMessage(data);
			freightRateAddReset();
		}
	}
	sendAjaxRequest(add);
}
/** -------- 修改------ */
function editFreightRate(){
	var editflag = $("#freightRateEditForm").form('validate');
	if(!editflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("freightRateEditForm");
	
	var subchannel=$("#edit_channel").combobox("getValues").join(",");
	if(subchannel.indexOf(",")==0){
		params["channel"] =subchannel.substring(1);
	}else{
		params["channel"] =subchannel;
	}
	console.log(params);
	var edit = {
		url : root+'/freightRateRule/updateFreightRate',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("freightRateTable");
			}
			$('#freightRateEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(edit);
}

/** -------- 批量删除 ------ */
function deleteFreightRate() {
	var selecteds = $('#freightRateTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#freightRateTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#freightRateTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].ruleId);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root+'/freightRateRule/deleteFreightRate';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("freightRateTable");
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
function freightRateAddReset() {
	$('#freightRateAddForm').form('reset');
}