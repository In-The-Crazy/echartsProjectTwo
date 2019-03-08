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
		required : false,
		width : 155
	});
	$('#add_endTime').datebox({
		required : false,
		width : 155
	});
	$('#add_beginDate').datebox({
		required : false,
		width : 155
	});
	$('#add_endDate').datebox({
		required : false,
		width : 155
	});
	//修改
	$('#edit_beginTime').datebox({
		required : false,
		width : 155
	});
	$('#edit_endTime').datebox({
		required : false,
		width : 155
	});
	$('#edit_beginDate').datebox({
		required : false,
		width : 155
	});
	$('#edit_endDate').datebox({
		required : false,
		width : 155
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_add = {
		id : "fareBasisAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "fareBasisEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#fareBasisAdd').dialog('close');
	// 修改窗口
	initDialog(dialog_edit);
	$('#fareBasisEdit').dialog('close');
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
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#fareBasisTable').datagrid({
		url : 'fareBasisManagerList.action',
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
			width : 15
		}, {
			field : 'id',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'yid',
			title : 'Y舱运价ID',
			align : 'center',
			formatter : function(value, row, index){
				return row.id;
			},
			width : 75
		}, {
			field : 'afrom',
			title : '起飞城市',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'ato',
			title : '降落城市',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'beginTime',
			title : '销售起始时间',
			align : 'center',
			formatter : function(value, row, index){
				return value.substring(0, 10);
			},
			width : 75
		}, {
			field : 'endTime',
			title : '销售截止时间',
			align : 'center',
			formatter : function(value, row, index){
				return value.substring(0, 10);
			},
			width : 75
		}, {
			field : 'beginDate',
			title : '承运起始时间',
			align : 'center',
			formatter : function(value, row, index){
				return value.substring(0, 10);
			},
			width : 75
		}, {
			field : 'endDate',
			title : '承运截止时间',
			align : 'center',
			formatter : function(value, row, index){
				return value.substring(0, 10);
			},
			width : 75
		}, {
			field : 'price',
			title : 'Y舱运价',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'mileage',
			title : '航线里程',
			align : 'center',
			formatter : baseFormater,
			width : 75
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
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#fareBasisTable').datagrid('resize');
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
	if(flag == 'add'){
		var selecteds = $('#fareBasisTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#fareBasisTable').datagrid('getSelected');
		$("#add_afrom").val(selected.afrom);
		$("#add_ato").val(selected.ato);
		var sdate = selected.beginTime;
		var edate = selected.endTime;
		var fsdate = selected.beginDate;
		var fedate = selected.endDate;
		$("#add_beginTime").datebox('setValue',sdate.substring(0, 10));
		$("#add_endTime").datebox('setValue',edate.substring(0, 10));
		$("#add_beginDate").datebox('setValue',fsdate.substring(0, 10));
		$("#add_endDate").datebox('setValue',fedate.substring(0, 10));
		$("#add_price").val(selected.price);
		$("#add_mileage").val(selected.mileage);
		$("#add_status").val(selected.status);
		$('#fareBasisAdd').dialog('open');
	}
	if(flag == 'edit'){
		var selecteds = $('#fareBasisTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#fareBasisTable').datagrid('getSelected');
		$("#edit_id").val(selected.id);
		$("#edit_afrom").val(selected.afrom);
		$("#edit_ato").val(selected.ato);
		var sdate = selected.beginTime;
		var edate = selected.endTime;
		var fsdate = selected.beginDate;
		var fedate = selected.endDate;
		$("#edit_beginTime").datebox('setValue',sdate.substring(0, 10));
		$("#edit_endTime").datebox('setValue',edate.substring(0, 10));
		$("#edit_beginDate").datebox('setValue',fsdate.substring(0, 10));
		$("#edit_endDate").datebox('setValue',fedate.substring(0, 10));
		$("#edit_price").val(selected.price);
		$("#edit_mileage").val(selected.mileage);
		$("#edit_status").val(selected.status);
		$('#fareBasisEdit').dialog('open');
	}
}

/** -------- 添加 ------ */
function addfareBasis(){
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
	var sflag = $("#fareBasisAddForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("fareBasisAddForm");
	var add = {
		url : 'addFareBasis.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("fareBasisTable");
			}
			$('#fareBasisAdd').dialog('close');
			showMessage(data);
			fareBasisAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editfareBasis(){
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
	var params = serializeJson("fareBasisEditForm");
	var edit = {
		url : 'updateFareBasis.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("fareBasisTable");
			}
			$('#fareBasisEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(edit);
}

/** -------- 批量删除 ------ */
function delFareBasis() {
	var selecteds = $('#fareBasisTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#fareBasisTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#fareBasisTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].id);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = 'deleteFareBasis.action';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("fareBasisTable");
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
function exportFareBasis() {
	var data = $('#fareBasisTable').datagrid('getData');
	var sdate = $('#beginTime').datebox('getValue');
	var edate = $('#endTime').datebox('getValue');
	var fsdate = $('#beginDate').datebox('getValue');
	var fedate = $('#endDate').datebox('getValue');
	var keys = ['start','end','afrom','ato','status','beginTime','endTime','beginDate','endDate','price'];
	var values = ['0','60000',$('#afrom').val(),$('#ato').val(),$('#status').val(),sdate,edate,fsdate,fedate,$('#price').val()];
	var count = data.rows.length;
	if(count>0){
		openWindowWithPost('exportFareBasis.action',keys,values);
	}else{
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
	}
}

/** -------- 重置查询条件 ------ */
function fareBasisReset() {
	$("#conditionForm").form("clear");
	$("#status").val("");
	$('#sourceid').val('sdal');
}
function fareBasisAddReset() {
	$("#fareBasisAddForm").form("clear");
	$("#add_status").val("1");
	$('#add_sourceid').val('sdal');
}
