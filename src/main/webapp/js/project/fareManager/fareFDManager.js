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
	//查询
	$('#beginTime').datebox({
		required : false
	});
	$('#endTime').datebox({
		required : false
	});
	$('#beginDate').datebox({
		required : false
	});
	$('#endDate').datebox({
		required : false
	});
	//添加
	$('#add_beginTime').datebox({
		required : true,
		width : 180
	});
	$('#add_endTime').datebox({
		required : true,
		width : 180
	});
	$('#add_beginDate').datebox({
		required : true,
		width : 180
	});
	$('#add_endDate').datebox({
		required : true,
		width : 180
	});
	//修改
	$('#edit_beginTime').datebox({
		required : true,
		width : 180
	});
	$('#edit_endTime').datebox({
		required : true,
		width : 180
	});
	$('#edit_beginDate').datebox({
		required : true,
		width : 180
	});
	$('#edit_endDate').datebox({
		required : true,
		width : 180
	});
	//详情
	$('#info_beginTime').datebox({
		required : false,
		width : 180
	});
	$('#info_endTime').datebox({
		required : false,
		width : 180
	});
	$('#info_beginDate').datebox({
		required : false,
		width : 180
	});
	$('#info_endDate').datebox({
		required : false,
		width : 180
	});
	//添加库存
	$('#add_stock_beginDate').datebox({
		required : true,
		width : 155
	});
	$('#add_stock_endDate').datebox({
		required : true,
		width : 155
	});
}

/** -------- 限制日期选择范围 ------ */
function dateBoxValidator(startDate,endDate) {
	$('#add_stock_beginDate').datebox().datebox('calendar').calendar({
		validator: function(date){
			var d1 = new Date(startDate);
			var d2 = new Date(endDate);
			d1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
			d2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
			return d1<=date && date<=d2;
		}
	});
	$('#add_stock_endDate').datebox().datebox('calendar').calendar({
		validator: function(date){
			var d1 = new Date(startDate);
			var d2 = new Date(endDate);
			d1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
			d2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
			return d1<=date && date<=d2;
		}
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_add = {
		id : "fareInfoAdd",
		title : "添加FD运价"
	};
	var dialog_edit = {
		id : "fareInfoEdit",
		title : "修改FD运价"
	};
	var dialog_info = {
		id : "fareInfoInfo",
		title : "FD运价详情"
	};
	var dialog_upload = {
		id : "fareInfoUpload",
		title : "导入FD运价"
	};
	var dialog_stockInfo = {
		id : "fareStockInfo",
		title : "该舱位库存信息列表"
	};
	var dialog_stockAdd = {
		id : "fareStockAdd",
		title : "添加库存"
	};
	var dialog_stockEdit = {
		id : "fareStockEdit",
		title : "修改库存"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#add_price_field').hide();
	$('#fareInfoAdd').dialog('close');
	// 修改窗口
	initDialog(dialog_edit);
	$('#edit_price_field').hide();
	$('#fareInfoEdit').dialog('close');
	// 详情窗口
	initDialog(dialog_info);
	$('#info_price_field').hide();
	$('#fareInfoInfo').dialog('close');
	// 导入窗口
	initDialog(dialog_upload);
	$('#fareInfoUpload').dialog('close');
	// 查询库存窗口
	initDialog(dialog_stockInfo);
	$('#fareStockInfo').dialog('close');
	// 添加库存窗口
	initDialog(dialog_stockAdd);
	$('#fareStockAdd').dialog('close');
	// 修改库存窗口
	initDialog(dialog_stockEdit);
	$('#fareStockEdit').dialog('close');
}

/** --------加载表格数据 ------ */
function ajaxTable() {
	// 验证时间
	var sdate = $('#beginTime').datebox('getValue');
	var edate = $('#endTime').datebox('getValue');
	var fsdate = $('#beginDate').datebox('getValue');
	var fedate = $('#endDate').datebox('getValue');
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		sdate = sdate.replace(/-/g, '');
		edate = edate.replace(/-/g, '');
		if (parseInt(sdate) > parseInt(edate)) {
			$.messager.alert('错误提示', '起售期不能大于止售期', 'error');
			return false;
		}
	}
	if (fsdate != null && fsdate != "" && fedate != null && fedate != "") {
		fsdate = fsdate.replace(/-/g, '');
		fedate = fedate.replace(/-/g, '');
		if (parseInt(fsdate) > parseInt(fedate)) {
			$.messager.alert('错误提示', '票起期不能大于票止期', 'error');
			return false;
		}
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#fareFDTable').datagrid({
		url : 'fareFDManagerList.action',
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
			field : 'fareid',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'aircode',
			title : '二字码',
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
			field : 'basicCabin',
			title : '基础舱位',
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
			field : 'seatname',
			title : '舱位描述',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'discount',
			title : '折扣',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'price',
			title : '价格',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		},
		 {
			field : 'airportTax',
			title : '机建',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		},
		 {
			field : 'fuelTax',
			title : '燃油',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		},
		 {
			field : 'otherTax',
			title : '其他税费',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		},{
			field : 'beginTime',
			title : '起售期',
			align : 'center',
			formatter : function(value, row, index){
				return value.substring(0, 10);
			},
			width : 100	
		}, {
			field : 'endTime',
			title : '止售期',
			align : 'center',
			formatter : function(value, row, index){
				return value.substring(0, 10);
			},
			width : 100
		}, {
			field : 'beginDate',
			title : '票面起期',
			align : 'center',
			formatter : function(value, row, index){
				return value.substring(0, 10);
			},
			width : 100
		}, {
			field : 'endDate',
			title : '票面止期',
			align : 'center',
			formatter : function(value, row, index){
				return value.substring(0, 10);
			},
			width : 100
		}, {
			field : 'status',
			title : '使用情况',
			align : 'center',
			formatter : function(value, row, index){
				var text = "--";
				if(value=="0"){
		  			text = "禁用";
		  		 }
		  		 if(value=="1"){
		  			text = "启用";
		  		 }
		  		 return text;
			},
			width : 75
		}, {
			field : 'stock',
			title : '库存配置',
			align : 'center',
			formatter : stockFormater,
			width : 75
		}, {
			field : 'detail',
			title : '详情',
			align : 'center',
			formatter : detailFormater,
			width : 75
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	//添加库存
	var addStock = {
		url : 'chooseFlightList.action',
		callBackFun : function(data) {
			$('#add_stock_fnumber').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 155
			});
		}
	}
	sendAjaxRequest(addStock);
	
	$('#add_stock_status').combobox({
		data: [{
			"id" : "1",
			"text" : "启用"
		},{
			"id" : "0",
			"text" : "禁用"
		}],
		valueField:'id',
		textField:'text',
		width : 155
	});
	$('#add_stock_status').combobox('select','1');
	
	$('#edit_stock_status').combobox({
		data: [{
			"id" : "1",
			"text" : "启用"
		},{
			"id" : "0",
			"text" : "禁用"
		}],
		valueField:'id',
		textField:'text',
		width : 155
	});
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#fareFDTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function stockFormater(value, row, index) {
	var _index = "'" + index + "'";
	return '<a href="javascript:void(0);" onclick=getInfo(' + _index + ',"stock")>查看</a>';
};
function detailFormater(value, row, index) {
	var _index = "'" + index + "'";
	return '<a href="javascript:void(0);" onclick=getInfo(' + _index + ',"detail")>详情</a>';
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
		var selecteds = $('#fareFDTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#fareFDTable').datagrid('getSelected');
		$('#edit_fareid').val(selected.fareid);
		var params = serializeJson("fareInfoEditForm");
		var query = {
			url : 'viewFareInfo.action',
			data : params,
			callBackFun : function(data) {
				if (data.isSuccessOrfail == "SUCCESS") {
					$('#edit_aircode').val(data.obj.aircode);
					$('#edit_afrom').val(data.obj.afrom);
					$('#edit_ato').val(data.obj.ato);
					$('#edit_fnumber').val(data.obj.fnumber);
					$('#edit_basicCabin').val(data.obj.basicCabin);
					$('#edit_seatcode').val(data.obj.seatcode);
					$('#edit_seatname').val(data.obj.seatname);
					if(!isEmpty(data.obj.discount)){
						$('#edit_priceType').val('0');
						$('#edit_discount').val(data.obj.discount);
						$('#edit_discount_price').val(data.obj.price);
						$('#edit_discount_field').show();
						$('#edit_discount_price_field').show();
						$('#edit_price_field').hide();
						$('#edit_discount').removeAttr('disabled');
						$('#edit_discount_price').removeAttr('disabled');
						$('#edit_price').attr('disabled','disabled');
					}else{
						$('#edit_priceType').val('1');
						$('#edit_price').val(data.obj.price);
						$('#edit_discount_field').hide();
						$('#edit_discount_price_field').hide();
						$('#edit_price_field').show();
						$('#edit_discount').attr('disabled','disabled');
						$('#edit_discount_price').attr('disabled','disabled');
						$('#edit_price').removeAttr('disabled');
					}
					$('#edit_airportTax').val(data.obj.airportTax);
					$('#edit_fuelTax').val(data.obj.fuelTax);
					$('#edit_otherTax').val(data.obj.otherTax);
					$('#edit_beginTime').datebox('setValue',data.obj.beginTime.substring(0, 10));
					$('#edit_endTime').datebox('setValue',data.obj.endTime.substring(0, 10));
					$('#edit_beginDate').datebox('setValue',data.obj.beginDate.substring(0, 10));
					$('#edit_endDate').datebox('setValue',data.obj.endDate.substring(0, 10));
					$('#edit_change').val(data.obj.change);
					$('#edit_refund').val(data.obj.refund);
					$('#edit_status').val(data.obj.status);
					$('#edit_endorsement').val(data.obj.endorsement);
					$('#edit_remark').val(data.obj.remark);
					$('#fareInfoEdit').dialog('open');
				}else{
					showMessage(data);
				}
			}
		}
		sendAjaxRequest(query);
	}
	if(flag == 'detail'){
		$("#fareFDTable").datagrid('selectRow',index);
		var selected = $('#fareFDTable').datagrid('getSelected');
		$('#info_fareid').val(selected.fareid);
		var params = serializeJson("fareInfoInfoForm");
		var query = {
			url : 'viewFareInfo.action',
			data : params,
			callBackFun : function(data) {
				if (data.isSuccessOrfail == "SUCCESS") {
					$('#info_aircode').val(data.obj.aircode);
					$('#info_afrom').val(data.obj.afrom);
					$('#info_ato').val(data.obj.ato);
					$('#info_fnumber').val(data.obj.fnumber);
					$('#info_basicCabin').val(data.obj.basicCabin);
					$('#info_seatcode').val(data.obj.seatcode);
					$('#info_seatname').val(data.obj.seatname);
					if(!isEmpty(data.obj.discount)){
						$('#info_priceType').val('0');
						$('#info_discount').val(data.obj.discount);
						$('#info_discount_price').val(data.obj.price);
						$('#info_discount_field').show();
						$('#info_discount_price_field').show();
						$('#info_price_field').hide();
					}else{
						$('#info_priceType').val('1');
						$('#info_price').val(data.obj.price);
						$('#info_discount_field').hide();
						$('#info_discount_price_field').hide();
						$('#info_price_field').show();
					}
					$('#info_airportTax').val(data.obj.airportTax);
					$('#info_fuelTax').val(data.obj.fuelTax);
					$('#info_otherTax').val(data.obj.otherTax);
					$('#info_beginTime').datebox('setValue',data.obj.beginTime.substring(0, 10));
					$('#info_endTime').datebox('setValue',data.obj.endTime.substring(0, 10));
					$('#info_beginDate').datebox('setValue',data.obj.beginDate.substring(0, 10));
					$('#info_endDate').datebox('setValue',data.obj.endDate.substring(0, 10));
					$('#info_change').val(data.obj.change);
					$('#info_refund').val(data.obj.refund);
					$('#info_status').val(data.obj.status);
					$('#info_endorsement').val(data.obj.endorsement);
					$('#info_remark').val(data.obj.remark);
					$('#fareInfoInfo').dialog('open');
				}else{
					showMessage(data);
				}
			}
		}
		sendAjaxRequest(query);
	}
	if(flag == 'stock'){
		$('#fareFDTable').datagrid('selectRow',index);
		var selected = $('#fareFDTable').datagrid('getSelected');
		$('#add_fareid').val(selected.fareid);
		$('#query_fare_stock').attr('onclick','getInfo("'+index+'","'+flag+'")');
		var startDate = selected.beginDate;
		var endDate = selected.endDate;
		dateBoxValidator(startDate.substring(0,10),endDate.substring(0,10));
		// 加载表格
		$('#fareStockTable').datagrid({
			url : 'queryFareStock.action',
			toolbar : "#fareStocktoolbar",
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
			queryParams : {
				'beginDate' : selected.beginDate,
				'endDate' : selected.endDate,
				'fareid' : selected.fareid,
				'status' : selected.status
			},
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
				width : 15
			}, {
				field : 'id',
				checkbox : 'true',
				align : 'center',
				width : 25
			}, {
				field : 'fareid',
				checkbox : 'true',
				hidden : true,
				align : 'center',
				width : 25
			}, {
				field : 'fnumber',
				title : '航班号',
				align : 'center',
				formatter : baseFormater,
				width : 75
			}, {
				field : 'takeDate',
				title : '承运日期',
				align : 'center',
				formatter : baseFormater,
				width : 75
			}, {
				field : 'stock',
				title : '库存',
				align : 'center',
				formatter : baseFormater,
				width : 75
			}, {
				field : 'status',
				title : '使用状态',
				align : 'center',
				formatter : function(value, row, index){
					var text = "--";
					if(value=="0"){
			  			text = "禁用";
			  		 }
			  		 if(value=="1"){
			  			text = "启用";
			  		 }
			  		 return text;
				},
				width : 75
			}, {
				field : 'createDate',
				title : '创建日期',
				align : 'center',
				formatter : dateFormater,
				width : 75
			}, {
				field : 'createOp',
				title : '创建人',
				align : 'center',
				formatter : baseFormater,
				width : 75
			} ] ]
		});
		$('#fareStockInfo').dialog('open');
	}
	if(flag == 'editStock'){
		var selecteds = $('#fareStockTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#fareStockTable').datagrid('getSelected');
		$('#edit_stock_id').val(selected.id);
		$('#edit_stock_fareid').val(selected.fareid);
		$('#edit_stock_fnumber').val(selected.fnumber);
		$('#edit_stock_takeDate').val(selected.takeDate);
		$('#edit_stock_stock').val(selected.stock);
		$('#edit_stock_status').combobox('select',selected.status);
		$('#fareStockEdit').dialog('open');
	}
}

/** -------- 添加 ------ */
function addfareInfo(){
	var sdate = $('#add_beginTime').datebox('getValue');
	var edate = $('#add_endTime').datebox('getValue');
	var fsdate = $('#add_beginDate').datebox('getValue');
	var fedate = $('#add_endDate').datebox('getValue');
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		sdate = sdate.replace(/-/g, '');
		edate = edate.replace(/-/g, '');
		if (parseInt(sdate) > parseInt(edate)) {
			$.messager.alert('错误提示', '销售起始日期不能大于销售截止日期', 'error');
			return false;
		}
	}
	if (fsdate != null && fsdate != "" && fedate != null && fedate != "") {
		fsdate = fsdate.replace(/-/g, '');
		fedate = fedate.replace(/-/g, '');
		if (parseInt(fsdate) > parseInt(fedate)) {
			$.messager.alert('错误提示', '承运起始日期不能大于承运截止日期', 'error');
			return false;
		}
	}
	//验证表单参数
	var sflag = $("#fareInfoAddForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("fareInfoAddForm");
	var add = {
		url : 'addFareInfo.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("fareFDTable");
			}
			$('#fareInfoAdd').dialog('close');
			showMessage(data);
			fareInfoAddReset();
		}
	}
	sendAjaxRequest(add);
}
/** -------- 添加库存 ------ */
function addfareStock(){
	var fsdate = $('#add_stock_beginDate').datebox('getValue');
	var fedate = $('#add_stock_endDate').datebox('getValue');
	if (fsdate != null && fsdate != "" && fedate != null && fedate != "") {
		fsdate = fsdate.replace(/-/g, '');
		fedate = fedate.replace(/-/g, '');
		if (parseInt(fsdate) > parseInt(fedate)) {
			$.messager.alert('错误提示', '承运起始日期不能大于承运截止日期', 'error');
			return false;
		}
	}
	//验证表单参数
	var sflag = $("#fareStockAddForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("fareStockAddForm");
	var add = {
		url : 'addFareStock.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("fareStockTable");
			}
			$('#fareStockAdd').dialog('close');
			showMessage(data);
			fareStockAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editfareInfo(){
	var sdate = $('#edit_beginTime').datebox('getValue');
	var edate = $('#edit_endTime').datebox('getValue');
	var fsdate = $('#edit_beginDate').datebox('getValue');
	var fedate = $('#edit_endDate').datebox('getValue');
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		sdate = sdate.replace(/-/g, '');
		edate = edate.replace(/-/g, '');
		if (parseInt(sdate) > parseInt(edate)) {
			$.messager.alert('错误提示', '销售起始日期不能大于销售截止日期', 'error');
			return false;
		}
	}
	if (fsdate != null && fsdate != "" && fedate != null && fedate != "") {
		fsdate = fsdate.replace(/-/g, '');
		fedate = fedate.replace(/-/g, '');
		if (parseInt(fsdate) > parseInt(fedate)) {
			$.messager.alert('错误提示', '承运起始日期不能大于承运截止日期', 'error');
			return false;
		}
	}
	//验证表单参数
	var sflag = $("#fareInfoEditForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("fareInfoEditForm");
	var add = {
		url : 'updateFareInfo.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("fareFDTable");
			}
			$('#fareInfoEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改库存 ------ */
function editfareStock(){
	//验证表单参数
	var sflag = $("#fareStockEditForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("fareStockEditForm");
	var add = {
		url : 'updateFareStock.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("fareStockTable");
			}
			$('#fareStockEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}

/** -------- 批量删除 ------ */
function delFareInfo() {
	var selecteds = $('#fareFDTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#fareFDTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#fareFDTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].fareid);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = 'deleteFareInfo.action';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("fareFDTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}

/** -------- 批量删除库存 ------ */
function delFareStock() {
	var selecteds = $('#fareStockTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#fareStockTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#fareStockTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].id);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = 'deleteFareStock.action';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("fareStockTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}

/** -------- 清空 ------ */
function clearFareInfo(){
	$.messager.confirm('清空提示', '所有运价及库存全部清空? ', function(r) {
		// 首先如果用户选择了数据，则获取选择的数据集合
		if (r) {
			var clear = {
				url : 'clearFareInfo.action',
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("fareFDTable");
					}
					showMessage(data);
				}
			}
			sendAjaxRequest(clear);
		}
	});
}

/** -------- 导出 ------ */
function exportFareInfo() {
	var data = $('#fareFDTable').datagrid('getData');
	var sdate = $('#beginTime').datebox('getValue');
	var edate = $('#endTime').datebox('getValue');
	var fsdate = $('#beginDate').datebox('getValue');
	var fedate = $('#endDate').datebox('getValue');
	var keys = ['start','end','flag','afrom','ato','aircode','status','sourceid','beginTime','endTime','beginDate','endDate','fnumber','seatcode'];
	var values = ['0','60000','1',$('#afrom').val(),$('#ato').val(),$('#aircode').val(),$('#status').val(),$('#sourceid').val(),sdate,edate,fsdate,fedate,$('#fnumber').val(),$('#seatcode').val()];
	var count = data.rows.length;
	if(count>0){
		openWindowWithPost('exportFareInfo.action',keys,values);
	}else{
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
	}
}

/** -------- 导入开关 ------ */
var upload = false;

/** -------- 导入 ------ */
function uploadFareInfo() {
	if(!upload){
		$.messager.alert('提示信息','请选择文件！','info');
		return false;
	}
	//进度条归0
	$('#progressNumber').progressbar('setValue', '0');
	//获取文件参数
	var fd = new FormData();
	fd.append("fareExcel", document.getElementById('fileToUpload').files[0]);
	fd.append("path", "/images/upload/excel");
	//AJAX请求
	var xhr = new XMLHttpRequest();
	xhr.upload.addEventListener("progress", uploadProgress, false);
	xhr.open("POST", "uploadFare.action");
	xhr.onreadystatechange = function () {
		//4: 请求已完成，且响应已就绪
		if(xhr.readyState==4){
			var data = xhr.responseText;
			data = eval('(' + data + ')');
			if(data.isSuccessOrfail=="SUCCESS"){
				$.messager.show({title:'提示信息', msg:'上传成功！'});
				$.messager.confirm('上传成功','确认导入？',function(r){
					if(r){
						var options = {
							url : 'importFdFare.action',
							callBackFun : function(data) {
								showMessage(data);
							}
						}
						sendAjaxRequest(options);
					}
				});
			}else{
				$.messager.alert('错误提示','上传失败！','error');
			}
			$('#fareInfoUpload').dialog('close');
		}
	}
	xhr.send(fd);
}

/** -------- 选择文件 ------ */
function fileSelected() {
	//进度条归0
	$('#progressNumber').progressbar('setValue', '0');
	var file = document.getElementById('fileToUpload').files[0];
	var fileName = file.name;
	var file_typename = fileName.substring(fileName.lastIndexOf('.'), fileName.length);
	
	$('#fileName').val(fileName);
	
	if (file_typename == '.xls') {//这里限定上传文件文件类型
		if (file.size <= 104857600){//这里限定上传文件文件大小
			if (file) {
				var fileSize = 0;
				if (file.size > 1024 * 1024){
					fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
				}
				else{
					fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
				}
				upload = true;
			}
		} else {
			$.messager.alert('错误提示',"文件大小要小于100M！",'error');
			upload = false;
		}
	}else{
		$.messager.alert('错误提示',"文件格式必须是xls！",'error');
		upload = false;
	}
}

/** -------- 导入进度条 ------ */
function uploadProgress(evt) {
	if (evt.lengthComputable) {
		var percentComplete = Math.round(evt.loaded * 100 / evt.total);
		$('#progressNumber').progressbar('setValue', percentComplete);
	}
	else {
		document.getElementById('progressNumber').innerHTML = '无法计算';
	}
}

/** -------- 切换类型 ------ */
function changeType(value,flag){
	if(flag == 'add'){
		if(value == 0){
			$('#add_discount_field').show();
			$('#add_discount_price_field').show();
			$('#add_price_field').hide();
			$('#add_discount').removeAttr('disabled');
			$('#add_discount_price').removeAttr('disabled');
			$('#add_price').attr('disabled','disabled');
		}
		if(value == 1){
			$('#add_discount_field').hide();
			$('#add_discount_price_field').hide();
			$('#add_price_field').show();
			$('#add_discount').attr('disabled','disabled');
			$('#add_discount_price').attr('disabled','disabled');
			$('#add_price').removeAttr('disabled');
		}
	}
	if(flag == 'edit'){
		if(value == 0){
			$('#edit_discount_field').show();
			$('#edit_discount_price_field').show();
			$('#edit_price_field').hide();
			$('#edit_discount').removeAttr('disabled');
			$('#edit_discount_price').removeAttr('disabled');
			$('#edit_price').attr('disabled','disabled');
		}
		if(value == 1){
			$('#edit_discount_field').hide();
			$('#edit_discount_price_field').hide();
			$('#edit_price_field').show();
			$('#edit_discount').attr('disabled','disabled');
			$('#edit_discount_price').attr('disabled','disabled');
			$('#edit_price').removeAttr('disabled');
		}
	}
}

/** -------- 计算价格 ------ */
function countPrice(value,flag){
	if(isEmpty(value)){
		return false;
	}
	var afrom;
	var ato;
	if(flag == 'add'){
		afrom = $('#add_afrom').val();
		ato = $('#add_ato').val();
	}
	if(flag == 'edit'){
		afrom = $('#edit_afrom').val();
		ato = $('#edit_ato').val();
	}
	if(isEmpty(afrom)||isEmpty(ato)){
		$.messager.alert('错误提示', '请先填写出发和到达城市!', 'error');
		return false;
	}
	var count = {
		url : 'discountPrice.action',
		data : {
			'afrom' : afrom,
			'ato' : ato,
			'discount' : value
		},
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				if(flag == 'add'){
					$('#add_discount_price').val(data.message);
				}
				if(flag == 'edit'){
					$('#edit_discount_price').val(data.message);
				}
			}else{
				showMessage(data);
			}
		}
	}
	sendAjaxRequest(count);
}

/** -------- 重置查询条件 ------ */
function fareFDReset() {
	$("#conditionForm").form("clear");
	$('#status').val('1');
	$('#sourceid').val('sdal');
}
function fareInfoAddReset() {
	$("#fareInfoAddForm").form("clear");
	$('#add_basicCabin').val('Y');
	$('#add_seatcode').val('O');
	$('#add_priceType').val('0');
	$('#add_change').val('1');
	$('#add_refund').val('1');
	$('#add_status').val('1');
	$('#add_sourceid').val('sdal');
	$('#add_flag').val('1');
}
function fareStockAddReset() {
	var temp = $('#add_fareid').val();
	$("#fareStockAddForm").form("clear");
	$('#add_fareid').val(temp);
	$('#add_stock_status').combobox('select','1');
}
