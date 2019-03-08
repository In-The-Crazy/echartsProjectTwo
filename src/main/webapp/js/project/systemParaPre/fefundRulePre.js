var payMethods = [];
/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面模块
	initPage();
	// 初始化表单
	initForm();
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
		label: '有效起始日期：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		required : false
	});
	$('#enddate').datebox({
		label: '有效截止日期：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		required : false
	});
	$('#add_ruleStartDate,#edit_ruleStartDate').datebox({
		label: '航班开始日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$('#add_ruleEndDate,#edit_ruleEndDate').datebox({
		label: '航班结束日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$('#add_startSdate,#edit_startSdate').datebox({
		label: '销售开始日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$('#add_endSdate,#edit_endSdate').datebox({
		label: '销售结束日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_add = {
		id : "fefundRuleAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "fefundRuleEdit",
		title : "修改"
	};
	var dialog_info = {
		id : "fefundRuleInfo",
		title : "详情"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#fefundRuleAdd').dialog('close');
	// 修改窗口
	initDialog(dialog_edit);
	$('#fefundRuleEdit').dialog('close');
	// 详情窗口
	initDialog(dialog_info);
	$('#fefundRuleInfo').dialog('close');
}

/** -------- 初始化表单 ------ */
function initForm(){
	$('#add_seatCode,#edit_seatCode').textbox({
		label: '舱位代码：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$('#add_changerate,#edit_changerate').textbox({
		label: '改期2小时之后：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$('#add_aftChangerate,#edit_aftChangerate').textbox({
		label: '改期12-2小时：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$('#add_tenChangerate,#edit_tenChangerate').textbox({
		label: '改期12小时之前：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$('#add_refundrate,#edit_refundrate').textbox({
		label: '退票2小时之后：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$('#add_aftRefundrate,#edit_aftRefundrate').textbox({
		label: '退票12-2小时：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$('#add_tenRefundrate,#edit_tenRefundrate').textbox({
		label: '退票12小时之前：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$('#add_remark,#edit_remark').textbox({
		label: 'EI项：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250
	});
	$('#add_chgRuleDescrip,#edit_chgRuleDescrip').textbox({
		label : '改期规则描述：',
		labelWidth : 100,
		labelAlign : "right",
		multiline:true,
		width : 300,
		height : 120,
		required : true
	});
	$('#add_refRuleDescrip,#edit_refRuleDescrip').textbox({
		label : '退票规则描述：',
		labelWidth : 100,
		labelAlign : "right",
		multiline:true,
		width : 300,
		height : 120,
		required : true
	});
	$('#add_feeBasic,#edit_feeBasic').combobox({
		label : '退票费计算基数：',
		labelWidth : 100,
		labelAlign : "right",
		multiline:false,
		data: [{
			id: '0',
			text: '基础舱位运价'
		},{
			id: '1',
			text: '票面价'
		}],
		valueField : 'id',
		textField : 'text',
		width: 250,
		height : 24,
		required : true
	});
	$('#add_discountRate,#edit_discountRate').combobox({
		label : '折扣率：',
		labelWidth : 100,
		labelAlign : "right",
		multiline:false,
		data: [{
			id: '0',
			text: '小于1'
		},{
			id: '1',
			text: '等于1'
		}],
		valueField : 'id',
		textField : 'text',
		width: 250,
		height : 24,
		required : false
	});
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
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#fefundRulePreTable').datagrid({
		url : root + '/refund/queryRefundRule',
		toolbar : "#toolbar",
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		showHeader : true,
		pageNumber : 1,
		pageSize : 20,
		fitColumns : false,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : true,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		queryParams : params,
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
			$.messager.alert('错误提示', '数据加载失败!', 'error');
		},
		onLoadSuccess : function(data) {
		},
		columns : [ [ {
			field : 'refeeId',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'aircode',
			title : '航空公司',
			align : 'center',
			formatter : function(value, row, index){
				if(value == "NS"){
					return "河北航空";
				}
				return "--";
			},
			width : 75
		},{
			field : 'payMethod',
			title : '支付方式',
			align : 'center',
			formatter : function(value, row, index){
				var valueArr=value.split(",");
				var payMethodArr=[];
				for (var i = 0; i < payMethods.length; i++) {
					for(var j=0;j<valueArr.length;j++){
						if(payMethods[i].dincCode == valueArr[j]){
							payMethodArr.push(payMethods[i].dincName);
							continue;
						}
					}
					
				}
				return payMethodArr.join(",");
			},
			width : 75
		}, {
			field : 'discountRate',
			title : '折扣率',
			align : 'center',
			formatter : function(value,row,index) {
				if (value == '0') {
					return '小于1';
				}else if (value == '1') {
					return '等于1';
				}else {
					return '--';
				}
			},
			width : 100
		}, {
			field : 'cabin',
			title : '舱位代码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'startFdate',
			title : '航班开始日期',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'endFdate',
			title : '航班结束日期',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'startSdate',
			title : '销售开始日期',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'endSdate',
			title : '销售结束日期',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'feeBasic',
			title : '退票费计算基数',
			align : 'center',
			formatter : function(value,row,index) {
				if (value == '0') {
					return '基础舱位运价';
				}
				return '票面价';
			},
			width : 100
		}, {
			field : 'ei',
			title : 'EI项',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'changerate',
			title : '改期2小时之后',
			formatter : baseFormater,
			align : 'center',
			width : 100
		}, {
			field : 'refundrate',
			title : '退票2小时之后',
			formatter : baseFormater,
			align : 'center',
			width : 100
		}, {
			field : 'aftChangerate',
			title : '改期12-2小时',
			formatter : baseFormater,
			align : 'center',
			width : 100
		}, {
			field : 'aftRefundrate',
			title : '退票12-2小时',
			formatter : baseFormater,
			align : 'center',
			width : 100
		}, {
			field : 'tenChangerate',
			title : '改期12小时之前',
			formatter : baseFormater,
			align : 'center',
			width : 100
		}, {
			field : 'tenRefundrate',
			title : '退票12小时之前',
			formatter : baseFormater,
			align : 'center',
			width : 100
		}, {
			field : 'createDate',
			title : '创建时间',
			align : 'center',
			formatter : dateTimeFormater,
			width : 150
		}, {
			field : 'refRuleDescrip',
			title : '退票规则描述',
			hidden : true,
			align : 'center',
			width : 100
		}, {
			field : 'chgRuleDescrip',
			title : '改期规则描述',
			hidden : true,
			align : 'center',
			width : 100
		}, {
			field : 'opt',
			title : '操作',
			align : 'center',
			formatter : optFormater,
			width : 75
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	var payMethod = {
		url : root+'/common/querydictsByType',
		data : {'type':'PAYMETHOD'},
		callBackFun : function(data) {
			payMethods = data.rows;
			//权限名称设置
			$('#add_payMethod,#edit_payMethod').combobox({
				label: '支付方式：',
				labelWidth: 100,
				labelAlign: "right",
				width: 250,
				data:data.rows,
				valueField:'dincCode',
				required : true,
				editable : false,
				multiple:true,
				textField:'dincName'
			});
		}
	};
	sendAjaxRequest(payMethod)
	$("#add_payMethod").combobox('setValues','cash');
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#fefundRulePreTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function optFormater(value, row, index) {
	var _index = "'" + index + "'";
	return '<a href="javascript:void(0);" onclick=getInfo('+_index+',"info")>详情</a>';
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
function getInfo(index,flag) {
	if(flag == 'edit'){
		var selecteds = $('#fefundRulePreTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#fefundRulePreTable').datagrid('getSelected');
		console.log(selected);
		$("#fefundRuleEditForm").form("load", selected);
		
		$('#fefundRuleEdit').dialog('open');
	}
	if(flag == 'info'){
		$('#fefundRulePreTable').datagrid('selectRow',index);
		var selected = $('#fefundRulePreTable').datagrid('getSelected')
		$("#info_ruleDescription").html("退票规则："+selected.refRuleDescrip+"<br/>改期规则："+selected.chgRuleDescrip);
		
		$('#fefundRuleInfo').dialog('open');
	}
}

/** -------- 添加 ------ */
function addfefundRule(){
	var addflag = $("#fefundRuleAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("fefundRuleAddForm");
	var subpayMethod=$("#add_payMethod").combobox("getValues").join(",");
	if(subpayMethod.indexOf(",")==0){
		params["payMethod"] =subpayMethod.substring(1);
	}else{
		params["payMethod"] =subpayMethod;
	}
	var add = {
		url : root + '/refund/addRefundRule',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("fefundRulePreTable");
			}
			$('#fefundRuleAdd').dialog('close');
			showMessage(data);
			fefundRuleAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editfefundRule(){
	var editflag = $("#fefundRuleEditForm").form('validate');
	if(!editflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("fefundRuleEditForm");
	var subpayMethod=$("#edit_payMethod").combobox("getValues").join(",");
	if(subpayMethod.indexOf(",")==0){
		params["payMethod"] =subpayMethod.substring(1);
	}else{
		params["payMethod"] =subpayMethod;
	}
	var add = {
		url : root + '/refund/updateRefundRule',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("fefundRulePreTable");
			}
			$('#fefundRuleEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}

/** -------- 批量删除 ------ */
function delfefundRule() {
	var selecteds = $('#fefundRulePreTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#fefundRulePreTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#fefundRulePreTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].refeeId);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root + '/refund/delRefundRule';
				var options = {
					url : url,
					data : {
						"refeeId" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("fefundRulePreTable");
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
function fefundRulePreReset() {
	$('#conditionForm').form('reset');
}
function fefundRuleAddReset() {
	$('#fefundRuleAddForm').form('reset');
	$("#add_payMethod").combobox('setValues','cash');
}