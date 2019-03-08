var payMethods = [];
var i = 0;
var j = 0;
var contextAdd = [];
var contextEdit = [];
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
		label: '起始日期：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		required : false,
		onSelect : function(beginDate) {
			$('#enddate').datebox().datebox('calendar').calendar({
				validator : function(date) {
					return beginDate <= date;
				}
			});
		}
	});
	$('#enddate').datebox({
		label: '截止日期：',
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
	$("#cabin").textbox({
		label: '舱位：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250
	})
	
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
		label : '免票折扣率：',
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
	
	$('#add_upperLimit,#edit_upperLimit').numberbox({
		label : '至：',
		labelWidth : 100,
		labelAlign : "right",
		required: false,
		width: 150
	})
	$('#add_lowerLimit,#edit_lowerLimit').numberbox({
		label : '时限从：',
		labelWidth : 100,
		labelAlign : "right",
		required: false,
		width: 150
	})
	$('#add_changerate,#edit_changerate').numberbox({
		label : '改期费率：',
		labelWidth : 100,
		labelAlign : "right",
		required: true,
		width: 250
	})
	$('#add_refundrate,#edit_refundrate').numberbox({
		label : '退票费率：',
		labelWidth : 100,
		labelAlign : "right",
		required: true,
		width: 250
	})
	$('#add_freeChangeTime,#edit_freeChangeTime').numberbox({
		label : '免费改期次数：',
		labelWidth : 100,
		labelAlign : "right",
		required: false,
		width: 250
	})
	$('#add_basecabin,#edit_basecabin').combobox({
		label : '基准舱位：',
		labelWidth : 100,
		labelAlign : "right",
		multiline:false,
		data: [{
			id: 'Y',
			text: 'Y'
		},{
			id: 'J',
			text: 'J'
		}],
		valueField : 'id',
		textField : 'text',
		width: 150,
		height : 24,
		panelHeight : 50,
		required : true
	})
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
		url : root + '/refundfeeRule/queryRefundfeeRuleList',
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
			title : '免票折扣率',
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
			field : 'createDate',
			title : '创建时间',
			align : 'center',
			formatter : dateTimeFormater,
			width : 150
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
				textField:'dincName',
				onChange: function(newValue,oldValue) {
					console.log(newValue);
					if (newValue.length != 0) {
						for (var int = 0; int < newValue.length; int++) {
							if (newValue[int] == "integral") {
								$("#add_discountRate").combobox({
									required : true
								})
							}else if (newValue.length == 1 && newValue[int] == "cash") {
								$("#add_discountRate").combobox({
									required : false
								})
							}
						}
					}
				}
			});
			$('#edit_payMethod').combobox({
				label: '支付方式：',
				labelWidth: 100,
				labelAlign: "right",
				width: 250,
				data:data.rows,
				valueField:'dincCode',
				required : true,
				editable : false,
				multiple:true,
				textField:'dincName',
				onChange: function(newValue,oldValue) {
					console.log(newValue);
					if (newValue.length != 0) {
						for (var int = 0; int < newValue.length; int++) {
							if (newValue[int] == "integral") {
								$("#edit_discountRate").combobox({
									required : true
								})
							}else if (newValue.length == 1 && newValue[int] == "cash") {
								$("#edit_discountRate").combobox({
									required : false
								})
							}
						}
					}
				}
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
		var edit = {
			url : root + '/refundfeeRule/queryRefundfeeRuleInfo',
			data : {'refeeId':selected.refeeId},
			callBackFun : function(data) {
				$("#fefundRuleEditForm").form("load", data.obj);
				var list = data.obj.list;
				if (list.length != 0) {
					$("#edit_basecabin").combobox("setValue", list[0].basecabin);
					$("#edit_freeChangeTime").numberbox("setValue", list[0].freeChangeTime);
					if (list[0].lowerContain == '1') {
						$("#edit_lowerContain").prop("checked",true);
					}else {
						$("#edit_lowerContain").prop("checked",false);
					}
					$("#edit_lowerLimit").numberbox("setValue", list[0].lowerLimit);
					$("#edit_refundrate").numberbox("setValue", list[0].refundrate);
					$("#edit_changerate").numberbox("setValue", list[0].changerate);
					if (list[0].upperContain == '1') {
						$("#edit_upperContain").prop("checked",true);
					}else {
						$("#edit_upperContain").prop("checked",false);
					}
					$("#edit_upperLimit").numberbox("setValue", list[0].upperLimit);
					list.shift();
					contextEdit = list;
					
					// 抓取模板数据
					var editTemplet = $("#editTemplet").html();
					// 编译模板
					var theEditTemplate = Handlebars.compile(editTemplet);
					// 把数据传送到模板
					var theEditCompiledHtml = theEditTemplate(contextEdit);
					// 更新到模板
					$('.edit-placeholder').html(theEditCompiledHtml);
					initEditPacks();
					
					j = list.length;
				}
				$('#fefundRuleEdit').dialog('open');
			}
		}
		sendAjaxRequest(edit);
	}
	if(flag == 'info'){
		$('#fefundRulePreTable').datagrid('selectRow',index);
		var selected = $('#fefundRulePreTable').datagrid('getSelected')
		
		var selected = $('#fefundRulePreTable').datagrid('getSelected');
		var info = {
			url : root + '/refundfeeRule/queryRuleText',
			data : {'refeeId':selected.refeeId},
			callBackFun : function(data) {
				var refundRuleDescs = data.obj.refundRuleDesc.split("&&");
				var refundRuleDesc = "";
				for (var int = 0; int < refundRuleDescs.length; int++) {
					refundRuleDesc += refundRuleDescs[int];
					refundRuleDesc += "<br/>";
				}
				var changeRuleDescs = data.obj.changeRuleDesc.split("&&");
				var changeRuleDesc = "";
				for (var int = 0; int < changeRuleDescs.length; int++) {
					changeRuleDesc += changeRuleDescs[int];
					changeRuleDesc += "<br/>";
				}
				$("#info_ruleDescription").html("退票规则<br/>"+refundRuleDesc+"改期规则<br/>"+changeRuleDesc);
				$('#fefundRuleInfo').dialog('open');
			}
		}
		sendAjaxRequest(info);
	}
}

/** -------- 添加 ------ */
function addfefundRule(){
	var addflag = $("#fefundRuleAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = $("#fefundRuleAddForm").serializeObject();
	console.log(params);
	var subpayMethod=$("#add_payMethod").combobox("getValues").join(",");
	if(subpayMethod.indexOf(",")==0){
		params["payMethod"] =subpayMethod.substring(1);
	}else{
		params["payMethod"] =subpayMethod;
	}
	var add = {
		url : root + '/refundfeeRule/addRefundfeeRule',
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
	//var params = $("#fefundRuleEditForm").serializeObject();
	var subpayMethod=$("#edit_payMethod").combobox("getValues").join(",");
	if(subpayMethod.indexOf(",")==0){
		params["payMethod"] =subpayMethod.substring(1);
	}else{
		params["payMethod"] =subpayMethod;
	}
	var add = {
		url : root + '/refundfeeRule/updateRefundfeeRule',
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
				var url = root + '/refundfeeRule/deleteRefundfeeRule';
				var options = {
					url : url,
					data : {
						"ids" : dpid
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

/** --------循环添加窗口处理start-------- */
function addPacks(){
	initAddPacksData();
	
	// 抓取模板数据
	var addTemplet = $("#addTemplet").html();
	// 编译模板
	var theTemplate = Handlebars.compile(addTemplet);

	// 定义数据
	i++;
	contextAdd.push({
		"i" : i,
		'lowerLimit' : '',
		'lowerContain' : '',
		'changerate' : '',
		'refundrate' : '',
		'upperLimit' : '',
		'upperContain' : '',
		'freeChangeTime' : '',
		'basecabin' : ''
	});
	
	// 把数据传送到模板
	var theCompiledHtml = theTemplate(contextAdd);

	// 更新到模板
	$('.add-placeholder').html(theCompiledHtml);
	
	initAddPacks();
}

function initAddPacksData() {
	$(".add_lowerLimit").each(function(index) {
		contextAdd[index].lowerLimit = $(this).val();
	})
	$(".add_lowerContain").each(function(index) {
		if ($(this).is(':checked')) {
			contextAdd[index].lowerContain = '1';
		}else {
			contextAdd[index].lowerContain = '0'
		}
	})
	$(".add_changerate").each(function(index) {
		contextAdd[index].changerate = $(this).val();
	})
	$(".add_refundrate").each(function(index) {
		contextAdd[index].refundrate = $(this).val();
	})
	$(".add_upperLimit").each(function(index) {
		contextAdd[index].upperLimit = $(this).val();
	})
	$(".add_upperContain").each(function(index) {
		if ($(this).is(':checked')) {
			contextAdd[index].upperContain = '1';
		}else {
			contextAdd[index].upperContain = '0'
		}
	})
	$(".add_freeChangeTime").each(function(index) {
		contextAdd[index].freeChangeTime = $(this).val();
	})
	$(".add_basecabin").each(function(index) {
		contextAdd[index].basecabin = $(this).val();
	})
}

function initAddPacks() {
	$('.add_upperLimit').numberbox({
		label : '至：',
		labelWidth : 100,
		labelAlign : "right",
		required: false,
		width: 150
	})
	$('.add_lowerLimit').numberbox({
		label : '时限从：',
		labelWidth : 100,
		labelAlign : "right",
		required: false,
		width: 150
	})
	$('.add_changerate').numberbox({
		label : '改期费率：',
		labelWidth : 100,
		labelAlign : "right",
		required: false,
		width: 250
	})
	$('.add_refundrate').numberbox({
		label : '退票费率：',
		labelWidth : 100,
		labelAlign : "right",
		required: false,
		width: 250
	})
	$('.add_freeChangeTime').numberbox({
		label : '免费改期次数：',
		labelWidth : 100,
		labelAlign : "right",
		required: false,
		width: 250
	})
	$('.add_basecabin').combobox({
		label : '基准舱位：',
		labelWidth : 100,
		labelAlign : "right",
		multiline:false,
		data: [{
			id: 'Y',
			text: 'Y'
		},{
			id: 'J',
			text: 'J'
		}],
		valueField : 'id',
		textField : 'text',
		width: 150,
		height : 24,
		panelHeight : 50,
		required : false
	})
	
	$('.add_basecabin').each(function(index) {
		$(this).combobox("setValue", contextAdd[index].basecabin);
	})
	$('.add_upperContain').each(function(index) {
		if (contextAdd[index].upperContain == '1') {
			$(this).prop("checked",true);
		}else {
			$(this).prop("checked",false);
		}
	})
	$('.add_lowerContain').each(function(index) {
		if (contextAdd[index].lowerContain == '1') {
			$(this).prop("checked",true);
		}else {
			$(this).prop("checked",false);
		}
	})

	$(".easyui-linkbutton").linkbutton();
}

function delAddPacks(sort){
	initAddPacksData();
	console.log(contextAdd);
	contextAdd.splice(sort - 1, 1);
	i--;
	for (var int = 0; int < contextAdd.length; int++) {
		contextAdd[int].i = int + 1;
	}
	
	 // 抓取模板数据
	var addTemplet = $("#addTemplet").html();
	// 编译模板
	var theTemplate = Handlebars.compile(addTemplet);

	// 把数据传送到模板
	var theCompiledHtml = theTemplate(contextAdd);

	// 更新到模板
	$('.add-placeholder').html(theCompiledHtml);
	
	initAddPacks();
}
/** --------循环添加窗口处理end-------- */

/** --------循环修改窗口处理start-------- */
function editPacks(){
	 // 抓取模板数据
	var editTemplet = $("#editTemplet").html();
	// 编译模板
	var theEditTemplate = Handlebars.compile(editTemplet);
	
	j++;
	contextEdit.push({
		'ruleSort' : j
	});

	// 把数据传送到模板
	var theEditCompiledHtml = theEditTemplate(contextEdit);

	// 更新到模板
	$('.edit-placeholder').html(theEditCompiledHtml);
	
	initEditPacks();
	
}

function initEditPacks() {
	$('.edit_upperLimit').numberbox({
		label : '至：',
		labelWidth : 100,
		labelAlign : "right",
		required: false,
		width: 150
	})
	$('.edit_lowerLimit').numberbox({
		label : '时限从：',
		labelWidth : 100,
		labelAlign : "right",
		required: false,
		width: 150
	})
	$('.edit_changerate').numberbox({
		label : '改期费率：',
		labelWidth : 100,
		labelAlign : "right",
		required: false,
		width: 250
	})
	$('.edit_refundrate').numberbox({
		label : '退票费率：',
		labelWidth : 100,
		labelAlign : "right",
		required: false,
		width: 250
	})
	$('.edit_freeChangeTime').numberbox({
		label : '免费改期次数：',
		labelWidth : 100,
		labelAlign : "right",
		required: false,
		width: 250
	})
	$('.edit_basecabin').combobox({
		label : '基准舱位：',
		labelWidth : 100,
		labelAlign : "right",
		multiline:false,
		data: [{
			id: 'Y',
			text: 'Y'
		},{
			id: 'J',
			text: 'J'
		}],
		valueField : 'id',
		textField : 'text',
		width: 150,
		height : 24,
		panelHeight : 50,
		required : false
	})
	$('.edit_basecabin').each(function(index) {
		$(this).combobox("setValue", contextEdit[index].basecabin);
	})
	$('.edit_upperContain').each(function(index) {
		if (contextEdit[index].upperContain == '1') {
			$(this).prop("checked",true);
		}else {
			$(this).prop("checked",false);
		}
	})
	$('.edit_lowerContain').each(function(index) {
		if (contextEdit[index].lowerContain == '1') {
			$(this).prop("checked",true);
		}else {
			$(this).prop("checked",false);
		}
	})

	$(".easyui-linkbutton").linkbutton();
}

function delEditPacks(sort){
	contextEdit.splice(sort - 1, 1);
	j--;
	for (var int = 0; int < contextEdit.length; int++) {
		contextEdit[int].ruleSort = int + 1;
	}
	
	 // 抓取模板数据
	var editTemplet = $("#editTemplet").html();
	// 编译模板
	var theEditTemplate = Handlebars.compile(editTemplet);

	// 把数据传送到模板
	var theEditCompiledHtml = theEditTemplate(contextEdit);

	// 更新到模板
	$('.edit-placeholder').html(theEditCompiledHtml);
	
	initEditPacks()
}
/** --------循环修改窗口处理end-------- */

/** -------- 重置查询条件 ------ */
function fefundRulePreReset() {
	$('#conditionForm').form('reset');
}
function fefundRuleAddReset() {
	$('#fefundRuleAddForm').form('reset');
	i = 0;
	$("#add_payMethod").combobox('setValues','cash');
	contextAdd = [];
	 // 抓取模板数据
	var addTemplet = $("#addTemplet").html();
	// 编译模板
	var theTemplate = Handlebars.compile(addTemplet);

	// 把数据传送到模板
	var theCompiledHtml = theTemplate(contextAdd);

	// 更新到模板
	$('.add-placeholder').html(theCompiledHtml);
}