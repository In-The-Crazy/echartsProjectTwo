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
	$('#startDate').datebox({
		required : false,
		width : 155
	});
	$('#endDate').datebox({
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
	$('#add_endDate').datebox({
		required : true,
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
	$('#edit_endDate').datebox({
		required : true,
		width : 155
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_add = {
		id : "couponTempletAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "couponTempletEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#couponTempletAdd').dialog('close');
	// 添加窗口
	initDialog(dialog_edit);
	$('#couponTempletEdit').dialog('close');
}

/** -------- 验证查询表单 ------ */
function validateForm() {
	var sdate = $('#startDate').datebox('getValue');
	var edate = $('#endDate').datebox('getValue');
	if (!isEmpty(sdate)) {
		sdate1 = sdate.replace(/-/g, '');
	}
	if (!isEmpty(edate)) {
		edate1 = edate.replace(/-/g, '');
	}
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		if (parseInt(sdate) > parseInt(edate)) {
			$.messager.alert('错误提示', '创建开始日期不能大于创建截止日期', 'error');
			return false;
		}
	}
	//验证表单参数
	var sflag = $("#conditionForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	return serializeJson("conditionForm");
}

/** --------加载表格数据 ------ */
function ajaxTable() {
	var params = validateForm();
	if(!params){
		return false;
	}
	// 加载表格
	$('#couponTempletTable').datagrid({
		url : 'couponTempletList.action',
		toolbar : "#toolbar",
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : true,// 定义是否设置基于该行内容的行高度
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
			field : 'templetId',
			title : '模板ID',
			align : 'center',
			formatter : templetIdFormater,
			width : 75
		}, {
			field : 'name',
			title : '模板名称',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'price',
			title : '优惠金额',
			align : 'center',
			formatter : baseFormater,
			width : 75
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
			title : '航班限定',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'seatcode',
			title : '舱位限定',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'startFdate',
			title : '起飞日期限定',
			align : 'center',
			formatter : startFdateFormater,
			width : 100
		}, {
			field : 'nonSail',
			title : '不允许航段',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'type',
			title : '有效期',
			align : 'center',
			formatter : templetTypeFormater,
			width : 100
		}, {
			field : 'total',
			title : '发行量',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'residue',
			title : '剩余量',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'payMethodName',
			title : '支付方式限制',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'condition',
			title : '使用者类型',
			align : 'center',
			formatter : conditionFormater,
			width : 75
		}, {
			field : 'memEffectMin',
			title : '生效时间',
			align : 'center',
			formatter : function(value, row, index){
				if(isEmpty(value)){
					return "--";
				}
				var text = value;
				if(text == "0"){
					text = "即时生效";
				}else{
					text += "小时";
				}
				return text;
			},
			width : 75
		}, {
			field : 'createDate',
			title : '创建时间',
			align : 'center',
			formatter : baseFormater,
			width : 100
		} ] ]
	});
	
	/** -------- 自定义表格视图 ------ */
	$('#couponTempletTable').datagrid({
		view: detailview,
		detailFormatter:function(index,row){
			return '<div class="ddv" style="padding:5px 0"></div>';
		},
		onExpandRow: function(index,row){
			var ddv = $(this).datagrid('getRowDetail',index).find('div.ddv');
			ddv.html("<span style='color:#15428B;font-weight:bold;'>使用规则：</span>"+row.remark);
			ddv.panel({
				height : 25,
				border : false,
 				cache : false,
				onLoad:function(){
					$('#couponTempletTable').datagrid('fixDetailRowHeight',index);
				}
			});
			$('#couponTempletTable').datagrid('fixDetailRowHeight',index);
		}
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	$('#add_type,#edit_type').combobox({
		data: [{
			"id" : "1",
			"text" : "按生效时间计算"
		},{
			"id" : "2",
			"text" : "指定有效截止日期"
		}],
		valueField:'id',
		textField:'text',
		width : 155
	});
	$('#add_type').combobox('select','2');
	
	$('#add_condition,#edit_condition').combobox({
		data: [{
			"id" : "1",
			"text" : "所有人使用"
		},{
			"id" : "2",
			"text" : "指定人使用"
		}],
		valueField:'id',
		textField:'text',
		width : 155
	});
	$('#add_condition').combobox('select','1');
	
	$('#add_memEffectMin,#edit_memEffectMin').combobox({
		data: [{
			"id" : "0",
			"text" : "即时生效"
		},{
			"id" : "2",
			"text" : "2小时"
		},{
			"id" : "4",
			"text" : "4小时"
		},{
			"id" : "12",
			"text" : "12小时"
		},{
			"id" : "24",
			"text" : "24小时"
		},{
			"id" : "48",
			"text" : "48小时"
		}],
		valueField:'id',
		textField:'text',
		width : 155
	});
	$('#add_memEffectMin').combobox('select','48');
	
	//查询-支付方式名称
	var payMethod = {
		url : 'queryConditionPayMethod.action',
		callBackFun : function(data) {
			$('#payMethod,#add_payMethod,#edit_payMethod').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 155
			});
		}
	}
	sendAjaxRequest(payMethod);
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#couponTempletTable').datagrid('resize');
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
		var selecteds = $('#couponTempletTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#couponTempletTable').datagrid('getSelected')
		$("#couponTempletEditForm").form("load",selected);
		$("#edit_remark").val(selected.remark);
		
		$('#couponTempletEdit').dialog('open');
	}
}
/** -------- 添加 ------ */
function addcouponTemplet(){
	var addflag = $("#couponTempletAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("couponTempletAddForm");
	var add = {
		url : 'addCouponTemplet.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("couponTempletTable");
			}
			$('#couponTempletAdd').dialog('close');
			showMessage(data);
			couponTempletAddReset();
		}
	}
	sendAjaxRequest(add);
}
/** -------- 修改 ------ */
function editcouponTemplet(){
	var params = serializeJson("couponTempletEditForm");
	var add = {
		url : 'modifyCouponTemplet.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("couponTempletTable");
			}
			$('#couponTempletEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}

/** -------- 批量删除 ------ */
function delcouponTemplet() {
	var selecteds = $('#couponTempletTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#couponTempletTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#couponTempletTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].id);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = 'deleteCouponTemplet.action';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("couponTempletTable");
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
	var data = $('#couponTempletTable').datagrid('getData');
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
function couponTempletReset() {
	$("#conditionForm").form("clear");
	$("#status").val("1");
	$('#sourceid').val('sdal');
}
function couponTempletAddReset() {
	$('#couponTempletAddForm').form('clear');
	$('#add_type').combobox('select','2');
	$('#add_condition').combobox('select','1');
	$('#add_sourceid').val('sdal');
	$('#add_memEffectMin').combobox('select','48');
}
