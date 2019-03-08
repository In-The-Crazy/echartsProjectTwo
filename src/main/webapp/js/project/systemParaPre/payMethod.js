var versions = [];
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
}

/** --------初始化页面模块 ------ */
function initPage() {
	$("#codeName").textbox({
		label: '支付方式：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250
	});
	
	$("#isRecomend").combobox({
		label: '是否推荐：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		valueField: 'label',
		textField: 'value',
		data: [{
			'label': '0',
			'value': '是'
		},{
			'label': '1',
			'value': '否'
		},{
			'label': '',
			'value': '全部',
			'selected': true
		}],
		editable : false
	});
	
	$("#payStatus").combobox({
		label: '状态：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		valueField: 'label',
		textField: 'value',
		data: [{
			'label': '0',
			'value': '启用'
		},{
			'label': '1',
			'value': '禁用'
		},{
			'label': '',
			'value': '全部',
			'selected': true
		}],
		editable : false
	});
	
	$("#add_codeName,#edit_codeName").textbox({
		label: '权限名称：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		required : true
	});
	$("#add_sortId,#edit_sortId").textbox({
		label: '排序：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		required : true
	});
	$("#add_isRecomend,#edit_isRecomend").combobox({
		label: '是否推荐：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		required : true,
		editable : false,
		valueField: 'label',
		textField: 'value',
		data: [{
			'label': '0',
			'value': '是',
		},{
			'label': '1',
			'value': '否'
		}]
	});
	$("#add_payStatus,#edit_payStatus").combobox({
		label: '状态：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		required : true,
		editable : false,
		valueField: 'label',
		textField: 'value',
		data: [{
			'label': '0',
			'value': '启用',
		},{
			'label': '1',
			'value': '禁用'
		}]
	});
	$("#add_remark,#edit_remark").textbox({
		label: '备注：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		multiline: true,
		height: 100
	});
	
	var dialog_add = {
		id : "payParamAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "payParamEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#payParamAdd').dialog('close');
	// 修改窗口
	initDialog(dialog_edit);
	$('#payParamEdit').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#payMethodTable').datagrid({
		url : root+'/payMethod/queryPayMethods',
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
			width : 5
		}, {
			field : 'methodId',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'methodName',
			title : '支付方式',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'version',
			title : '版本号',
			align : 'center',
			formatter : function(value, row, index){
				var valueArr=value.split(",");
				var versionArr=[];
				for (var i = 0; i < versions.length; i++) {
					for(var j=0;j<valueArr.length;j++){
						if(versions[i].dincCode == valueArr[j]){
							versionArr.push(versions[i].dincName);
							continue;
						}
					}
					
				}
				return versionArr.join(",");
			},
			width : 75
		}, {
			field : 'isRecomend',
			title : '是否推荐',
			align : 'center',
			formatter : function(value, row, index){
				var text = "不推荐";
				if(value == "0"){
					text = "推荐";
				}
				return text;
			},
			width : 75
		}, {
			field : 'sortId',
			title : '排序',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'remark',
			title : '备注',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},{
			field : 'payStatus',
			title : '操作',
			align : 'center',
			formatter : optFormater,
			width : 50
		} ] ]
	});
}

/**
 * 设置启用禁用列的信息 row 当前行的数据 index 当前行的索引 从0 开始
 */
function optFormater(value, row, index) {
	var flag=row.payStatus;
	var _id="'"+row.payId+"'";
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
	var version = {
			url : root+'/common/querydictsByType',
			data : {'type':'VERSION'},
			callBackFun : function(data) {
				versions = data.rows;
				var treeList = rowsListAddAll(data.rows, {
					"checked" : true,
					"children" : null,
					"dincCode" : "",
					"dincName" : "全部"
				});
				$("#version").combobox({
					label: '使用版本：',
					labelWidth: 100,
					labelAlign: "right",
					width: 250,
					data:treeList,
					valueField:'dincCode',
					editable : false,
					multiple:false,
					textField:'dincName',
				});
				//适用版本号设置
				$('#add_version,#edit_version').combobox({
					label: '使用版本：',
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
		sendAjaxRequest(version)
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#payMethodTable').datagrid('resize');
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
	var selecteds = $('#payMethodTable').datagrid('getSelections');
	if(selecteds.length!=1){
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	var selected = $('#payMethodTable').datagrid('getSelected')
	$("#add_id").val(selected.id);
	$('#payParamEditForm').form('load',selected);
	
	$('#payParamEdit').dialog('open');
}

/** -------- 添加 ------ */
function addpayParam(){
	var addflag = $("#payParamAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("payParamAddForm");
	var add = {
		url : root+'/payMethod/addPayMethod',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("payMethodTable");
			}
			$('#payParamAdd').dialog('close');
			showMessage(data);
			payParamAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function updatepayParam(){
	var editflag = $("#payParamEditForm").form('validate');
	if(!editflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("payParamEditForm");
	var edit = {
		url : root+'/payMethod/updatePayMethod',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("payMethodTable");
			}
			$('#payParamEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(edit);
}

/** -------- 批量删除 ------ */
function deletePayParam() {
	var selecteds = $('#payMethodTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#payMethodTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#payMethodTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].payId);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root+'/payMethod/deletePayMethod';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("payMethodTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}

/** -------- 启用禁用------ */
function startUse(id,flag){
	var re = {
		url :root+'/payMethod/updatePayStatus',
		data : {
			payStatus:flag,
			payId:id
		},
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("payMethodTable");
			}
			showMessage(data);
		}
	}
	sendAjaxRequest(re);
}

/** -------- 重置查询条件 ------ */
function queryParamPreReset() {
	$('#conditionForm').form('reset');
}
function payParamAddReset() {
	$('#payParamAddForm').form('reset');
}
