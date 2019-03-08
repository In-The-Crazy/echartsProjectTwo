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
	$('#saleStartTimeStart').datebox({
		label: '销售起始日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250,
		onSelect : function(beginDate){  
	        $('#saleStartTimeEnd').datebox().datebox('calendar').calendar({  
	            validator: function(date){  
	                return beginDate<=date;
	            }  
	        });
	    }
	})
	$('#saleStartTimeEnd').datebox({
		label: '至：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	})
	$('#saleEndTimeStart').datebox({
		label: '销售截止日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250,
		onSelect : function(beginDate){  
	        $('#saleEndTimeEnd').datebox().datebox('calendar').calendar({  
	            validator: function(date){  
	                return beginDate<=date;
	            }  
	        });
	    }
	})
	$('#saleEndTimeEnd').datebox({
		label: '至：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	})
	$('#flightStartTimeStart').datebox({
		label: '航班起始日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250,
		onSelect : function(beginDate){  
	        $('#flightStartTimeEnd').datebox().datebox('calendar').calendar({  
	            validator: function(date){  
	                return beginDate<=date;
	            }  
	        });
	    }
	})
	$('#flightStartTimeEnd').datebox({
		label: '至：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	})
	$('#flightEndTimeStart').datebox({
		label: '航班截止日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250,
		onSelect : function(beginDate){  
	        $('#flightEndTimeEnd').datebox().datebox('calendar').calendar({  
	            validator: function(date){  
	                return beginDate<=date;
	            }  
	        });
	    }
	})
	$('#flightEndTimeEnd').datebox({
		label: '至：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	})
	
	$('#add_flightStartTime,#edit_flightStartTime').datebox({
		label: '航班起始日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250,
		onSelect : function(beginDate){  
	        $('#add_flightEndTime').datebox().datebox('calendar').calendar({  
	            validator: function(date){  
	                return beginDate<=date;
	            }  
	        });
	        $('#edit_flightEndTime').datebox().datebox('calendar').calendar({  
	            validator: function(date){  
	                return beginDate<=date;
	            }  
	        });  
	    }
	});
	$('#add_flightEndTime,#edit_flightEndTime').datebox({
		label: '航班截止日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$('#add_saleStartTime,#edit_saleStartTime').datebox({
		label: '销售起始日：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250,
		onSelect : function(beginDate){  
	        $('#add_saleEndTime').datebox().datebox('calendar').calendar({  
	            validator: function(date){  
	                return beginDate<=date;
	            }  
	        });
	        $('#edit_saleEndTime').datebox().datebox('calendar').calendar({  
	            validator: function(date){  
	                return beginDate<=date;
	            }  
	        });  
	    }
	});
	$('#add_saleEndTime,#edit_saleEndTime').datebox({
		label: '销售截止日：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	$("#route").textbox({
		label: '航线：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250
	});
	$('#cabin').textbox({
		label: '舱位：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
	$('#fbc').textbox({
		label: '票价级别：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
	$("#status").combobox({
		label : '启用/禁用：',
		labelWidth: 100,
		labelAlign: "right",
		data : [{"id":"2","text":"全部","selected":true},{"id":1,"text":"启用"},{"id":0,"text":"禁用"}],
		valueField:'id',
		textField:'text',
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
	$('#add_isrefundtax,#edit_isrefundtax').combobox({
		label : '是否退燃油：',
		labelWidth: 100,
		labelAlign: "right",
		data : [{"id":1,"text":"是","selected":true},{"id":0,"text":"否"}],
		valueField:'id',
		textField:'text',
		width: 250,
		required : true,
	});
	$('#add_airtype,#edit_airtype').combobox({
		label : '航程类型：',
		labelWidth: 100,
		labelAlign: "right",
		data : [{"id":'OW',"text":"单程","selected":true},{"id":'RT',"text":"往返"}],
		valueField:'id',
		textField:'text',
		width: 250,
		required : true,
	});
	$('#add_cabin,#edit_cabin').textbox({
		label: '舱位：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250,
		validType : 'cabin["#add_cabin,#edit_cabin"]'
	});
	$('#add_fbc,#edit_fbc').textbox({
		label: '票价级别：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$('#add_timeLimit,#edit_timeLimit').numberbox({
		label: '起飞前几小时以内：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$('#add_befreFee,#edit_befreFee').numberbox({
		label : '起飞前退票手续费：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : false
	});
	$('#add_afterFee,#edit_afterFee').numberbox({
		label : '起飞后退票手续费：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : false
	});
	$('#add_noshowfee,#edit_noshowfee').numberbox({
		label : '误机费：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : true
	});
	$('#add_partsusefee,#edit_partsusefee').numberbox({
		label : '部分使用退票费：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : false
	});
	$('#add_currency,#edit_currency').textbox({
		label : '币种：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : true,
		value : 'CNY'
	});
	$('#add_standard,#edit_standard').numberbox({
		label : '舱位标准价：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : false,
		validType : ""
	});
	$('#add_route,#edit_route').textbox({
		label : '航线：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		required : true
	});
	$('#add_remark,#edit_remark').textbox({
		label : '退票说明：',
		labelWidth : 100,
		labelAlign : "right",
		multiline:true,
		width : 300,
		height : 120,
		required : false
	});
	$('#add_changeRemark,#edit_changeRemark').textbox({
		label : '改期说明：',
		labelWidth : 100,
		labelAlign : "right",
		multiline:true,
		width : 300,
		height : 120,
		required : false
	});
	$('#add_baggageAmountRemark,#edit_baggageAmountRemark').textbox({
		label : '行李额说明：',
		labelWidth : 100,
		labelAlign : "right",
		multiline:true,
		width : 300,
		height : 120,
		required : false
	});

}

/** -------- 验证查询表单 ------ */
function validateForm() {
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
	$('#fefundRulePreTable').datagrid({
		url : root + '/refund/queryInterRefundRule',
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
			field : 'feeId',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'route',
			title : '航线',
			formatter : baseFormater,
			align : 'center',
			width : 80
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
		}, {
			field : 'fbc',
			title : '票价级别',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'airtype',
			title : '航程类型 ',
			formatter : function(value, row, index) {
				if (value == 'OW') {
					return "单程";
				}
				return "往返";
			},
			align : 'center',
			width : 100
		}, {
			field : 'cabin',
			title : '舱位',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'timeLimit',
			title : '起飞前几小时以内',
			align : 'center',
			formatter : baseFormater,
			width : 120
		}, {
			field : 'saleStartTime',
			title : '销售起始日',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'saleEndTime',
			title : '销售截止日',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'flightStartTime',
			title : '航班起始日期',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'flightEndTime',
			title : '航班截止日期',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'currency',
			title : '币种',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'befreFee',
			title : '起飞前退票手续费',
			formatter : baseNumFormater,
			align : 'center',
			width : 120
		}, {
			field : 'afterFee',
			title : '起飞后退票手续费',
			formatter : baseNumFormater,
			align : 'center',
			width : 120
		}, {
			field : 'noshowfee',
			title : '误机费',
			formatter : baseNumFormater,
			align : 'center',
			width : 50
		}, {
			field : 'partsusefee',
			title : '部分使用退票费',
			formatter : baseNumFormater,
			align : 'center',
			width : 100
		}, {
			field : 'standard',
			title : '舱位标准价',
			formatter : baseNumFormater,
			align : 'center',
			width : 80
		}, {
			field : 'isrefundtax',
			title : '是否退燃油',
			formatter : function(value, row, index) {
				if (value == '1') {
					return "是";
				}
				return "否";
			},
			align : 'center',
			width : 100
		}, {
			field : 'remark',
			title : '说明',
			hidden : true,
			align : 'center',
			width : 100
		}, {
			field : 'baggageAmountRemark',
			title : '行李额说明',
			hidden : true,
			align : 'center',
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
	
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#fefundRulePreTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function optFormater(value, row, index) {
	var _index = "'" + index + "'";
	var info = '<a href="javascript:void(0);" onclick=getInfo('+_index+',"info")>详情</a>';
	
	var flag=row.status;
	var _id="'"+row.feeId+"'";
	var start,stop;
	if(flag=="1"){
		start='<a href="javascript:void(0)" onclick="startUse(' + _id + ',0)">禁用</a>'
	}
	if(flag=="0"){
		start='<a href="javascript:void(0)" onclick="startUse(' + _id + ',1)">启用</a>'
	}
	return info + "|" + start;
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
		$("#info_ruleDescription").html("退票规则："+selected.remark+"<br/>改期规则："+selected.changeRemark);
		
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
	var add = {
		url : root + '/refund/addInterRefundRule',
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
	var add = {
		url : root + '/refund/updateInterRefundRule',
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
			ids.push(selectedRow[i].feeId);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root + '/refund/delInterRefundRule';
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

/** -------- 启用禁用------ */
function startUse(id,flag){
	var re = {
		url :root+'/refund/validityInterRefund',
		data : {
			status:flag,
			id:id
		},
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("fefundRulePreTable");
			}
			showMessage(data);
		}
	}
	sendAjaxRequest(re);
}

/** -------- 重置查询条件 ------ */
function fefundRulePreReset() {
	$('#conditionForm').form('reset');
	$('#status').combobox("setValue","2")
}
function fefundRuleAddReset() {
	$('#fefundRuleAddForm').form('reset');
}