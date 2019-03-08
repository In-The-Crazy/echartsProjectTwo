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
	var dialog_add = {
		id : "PayRelationPre",
		title : "添加"
	};
	var dialog_edit = {
		id : "PayRelationPreEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#PayRelationPre').dialog('close');
	// 添加窗口
	initDialog(dialog_edit);
	$('#PayRelationPreEdit').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#payRelationPreTable').datagrid({
		url : 'payRelationPreList.action',
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
			field : 'relId',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'showRelId',
			title : '主键',
			align : 'center',
			formatter : function(value, row, index){
				return row.relId;
			},
			width : 75
		}, {
			field : 'methodCode',
			title : '支付方式代码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'methodName',
			title : '支付方式名称',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'bankCode',
			title : '银行代码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'bankName',
			title : '银行名称',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'payCode',
			title : '支付通道代码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'codeName',
			title : '支付通道名称',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'createDate',
			title : '建立日期',
			align : 'center',
			formatter : baseFormater,
			width : 150
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	//查询-银行名称
	var queryBank = {
		url : 'queryBankTreeList.action',
		callBackFun : function(data) {
			$('#bankName').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 150
			});
		}
	}
	sendAjaxRequest(queryBank);
	
	//添加修改-银行名称
	var addBank = {
		url : 'queryAddBankTreeList.action',
		callBackFun : function(data) {
			$('#add_bankName').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 150,
				onSelect : function(record){
					if(!isEmpty(record)){
						$('#add_bank').val(record.text);
					}
				}
			});
			$('#edit_bankName').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 150,
				onSelect : function(record){
					if(!isEmpty(record)){
						$('#edit_bank').val(record.text);
					}
				}
			});
		}
	}
	sendAjaxRequest(addBank);
	
	//查询-支付方式名称
	var queryMethod = {
		url : 'queryConditionPayMethod.action',
		callBackFun : function(data) {
			$('#methodName').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 150
			});
		}
	}
	sendAjaxRequest(queryMethod);
	
	//添加修改-支付方式名称
	var addMethod = {
		url : 'queryAddPayMethod.action',
		callBackFun : function(data) {
			$('#add_methodName').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 150,
				required : true,
				onSelect : function(record){
					if(!isEmpty(record)){
						$('#add_method').val(record.text);
					}
				}
			});
			$('#edit_methodName').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 150,
				required : true,
				onSelect : function(record){
					if(!isEmpty(record)){
						$('#edit_method').val(record.text);
					}
				}
			});
		}
	}
	sendAjaxRequest(addMethod);
	
	//查询-支付通道名称
	var queryCode = {
		url : 'queryConditionPayCode.action',
		callBackFun : function(data) {
			$('#codeName').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 150
			});
		}
	}
	sendAjaxRequest(queryCode);
	
	//添加修改-支付通道名称
	var addCode = {
		url : 'queryAddPayCode.action',
		callBackFun : function(data) {
			$('#add_payCode').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 150,
				required : true
			});
			$('#edit_payCode').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				width : 150,
				required : true
			});
		}
	}
	sendAjaxRequest(addCode);
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#payRelationPreTable').datagrid('resize');
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
function getInfo(flag) {
	if(flag == 'edit'){
		var selecteds = $('#payRelationPreTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#payRelationPreTable').datagrid('getSelected');
		$('#edit_relId').val(selected.relId);
		$('#edit_bankName').combobox('select', selected.bankCode);
		$('#edit_bank').val(selected.bankName);
		$('#edit_methodName').combobox('select', selected.methodCode);
		$('#edit_method').val(selected.methodName);
		$('#edit_payCode').combobox('select', selected.payCode);
		
		$('#PayRelationPreEdit').dialog('open');
	}
}

/** -------- 添加 ------ */
function addPayRelationPre (){
	var params = serializeJson("PayRelationPreAddForm");
	var add = {
		url : 'addPayRelationInfo.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("payRelationPreTable");
			}
			$('#PayRelationPre').dialog('close');
			showMessage(data);
			PayRelationPreAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editPayRelationPre(){
	var params = serializeJson("PayRelationPreEditForm");
	var add = {
		url : 'modifyPayRelationInfo.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("payRelationPreTable");
			}
			$('#PayRelationPreEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}

/** -------- 批量删除 ------ */
function delPayRelationPre() {
	var selecteds = $('#payRelationPreTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#payRelationPreTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#payRelationPreTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].relId);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = 'deletePayRelationInfo.action';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("payRelationPreTable");
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
function payRelationPreReset() {
	$('#conditionForm').form('clear');
	$('#sourceid').val('sdal');
	$('#bankName').combobox('setValue', '');
	$('#methodName').combobox('setValue', '');
	$('#codeName').combobox('setValue', '');
	initDatebox();
}

function PayRelationPreAddReset() {
	$('#PayRelationPreAddForm').form('clear');
}
