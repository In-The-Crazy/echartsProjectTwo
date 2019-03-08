/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面模块
	initPage();
	// 加载日历选择
	initDatebox();
	// 加载表格数据
	ajaxTable();
	// 加载树型
	ajaxTree();
});

/** --------加载日历选择 ------ */
function initDatebox() {
	$('#add_startSdate').datebox({
		required : false,
		width : 155
	});
	$('#add_endSdate').datebox({
		required : false,
		width : 155
	});
	$('#add_startFdate').datebox({
		required : false,
		width : 155
	});
	$('#add_endFdate').datebox({
		required : false,
		width : 155
	});
	$('#edit_startSdate').datebox({
		required : false,
		width : 155
	});
	$('#edit_endSdate').datebox({
		required : false,
		width : 155
	});
	$('#edit_startFdate').datebox({
		required : false,
		width : 155
	});
	$('#edit_endFdate').datebox({
		required : false,
		width : 155
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_add = {
		id : "couponConditionAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "couponConditionEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#couponConditionAdd').dialog('close');
	// 添加窗口
	initDialog(dialog_edit);
	$('#couponConditionEdit').dialog('close');
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
	$('#couponConditionTable').datagrid({
		url : 'couponConditionList.action',
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
			field : 'templetname',
			title : '对应模板',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'afrom',
			title : '出发城市',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'ato',
			title : '到达城市',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'fnumber',
			title : '航班号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'seatcode',
			title : '舱位',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'fare',
			title : '票面价',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'bankname',
			title : '支付银行',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'startSdate',
			title : '购买起始日期',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'endSdate',
			title : '购买截止日期',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'startFdate',
			title : '起飞起始日期',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'endFdate',
			title : '起飞截止日期',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'type',
			title : '使用种类',
			align : 'center',
			formatter : couponTypeFormater,
			width : 75
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	//优惠券模板
	var query = {
		url : 'queryCouponTempletTree.action',
		callBackFun : function(data) {
			$('#templetid').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 155
			});
		}
	}
	sendAjaxRequest(query);
	
	//添加优惠券模板
	var add = {
		url : 'queryCouponTempletTree.action',
		callBackFun : function(data) {
			$('#add_templetid').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 155
			});
		}
	}
	sendAjaxRequest(add);
	
	//修改优惠券模板
	var edit = {
		url : 'queryCouponTempletTree.action',
		callBackFun : function(data) {
			$('#edit_templetid').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 155
			});
		}
	}
	sendAjaxRequest(edit);
	
	$('#add_type').combobox({
		data: [{
			"id" : "register",
			"text" : "注册"
		},{
			"id" : "buy",
			"text" : "购票"
		},{
			"id" : "recommend",
			"text" : "推荐"
		},{
			"id" : "jsyl",
			"text" : "机上有礼"
		}],
		valueField:'id',
		textField:'text',
		width : 155
	});
	$('#edit_type').combobox({
		data: [{
			"id" : "register",
			"text" : "注册"
		},{
			"id" : "buy",
			"text" : "购票"
		},{
			"id" : "recommend",
			"text" : "推荐"
		},{
			"id" : "jsyl",
			"text" : "机上有礼"
		}],
		valueField:'id',
		textField:'text',
		width : 155
	});
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#couponConditionTable').datagrid('resize');
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
		var selecteds = $('#couponConditionTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#couponConditionTable').datagrid('getSelected')
		$("#edit_id").val(selected.id);
		$("#edit_templetid").combobox('select', selected.templetname);
		$("#edit_afrom").val(selected.afrom);
		$("#edit_ato").val(selected.ato);
		$("#edit_fnumber").val(selected.fnumber);
		$("#edit_seatcode").val(selected.seatcode);
		$("#edit_fare").val(selected.fare);
		$("#edit_bankname").val(selected.bankname);
		$("#edit_startSdate").datebox('setValue',selected.startSdate);
		$("#edit_endSdate").datebox('setValue',selected.endSdate);
		$("#edit_startFdate").datebox('setValue',selected.startFdate);
		$('#edit_endFdate').datebox('setValue',selected.endFdate);
		$('#edit_type').combobox('select', selected.type);
		
		$('#couponConditionEdit').dialog('open');
	}
}

/** -------- 添加 ------ */
function addCouponCondition(){
	var params = serializeJson("couponConditionAddForm");
	var add = {
		url : 'addCouponCondition.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("couponConditionTable");
			}
			$('#couponConditionAdd').dialog('close');
			showMessage(data);
			couponConditionAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editCouponCondition(){
	var params = serializeJson("couponConditionEditForm");
	var add = {
		url : 'modifyCouponCondition.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("couponConditionTable");
			}
			$('#couponConditionEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}

/** -------- 批量删除 ------ */
function delcouponCondition() {
	var selecteds = $('#couponConditionTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#couponConditionTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#couponConditionTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].id);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = 'deleteCouponCondition.action';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("couponConditionTable");
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
function couponConditionReset() {
	$("#conditionForm").form("clear");
	$('#sourceid').val('sdal');
}
function couponConditionAddReset() {
	$('#couponConditionAddForm').form('clear');
	$('#add_souceid').val('sdal');
}
