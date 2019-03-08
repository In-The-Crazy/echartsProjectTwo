var channels=[];
/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面模块
	initPage();
	//树形
	ajaxTree();
	// 加载表格数据
	ajaxTable();
	
});

/** --------初始化页面模块 ------ */
function initPage() {
	$("#seat").textbox({
		label : '舱位：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#seatRule").textbox({
		label : '舱位规则：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#isInter").combobox({
		label : '国内/国际：',
		labelWidth : 100,
		labelAlign : 'right',
		data : [{
			"id": "",
			"text": "全部",
			"selected": true
		},{
			"id": "0",
			"text": "国内"
		},{
			"id": "1",
			"text": "国际"
		}],
		valueField: 'id',
		textField: 'text',
		editable : false,
		width : 250
	});
	$("#shareCode").combobox({
		label : '是否共享航班：',
		labelWidth : 100,
		labelAlign : 'right',
		data : [{
			"id": "",
			"text": "全部",
			"selected": true
		},{
			"id": "0",
			"text": "否"
		},{
			"id": "1",
			"text": "是"
		}],
		valueField: 'id',
		textField: 'text',
		editable : false,
		width : 250
	});
	
	$("#add_seat,#edit_seat").textbox({
		label : '舱位：',
		labelWidth : 100,
		labelAlign : 'right',
		required : true,
		width : 250
	});
	$("#add_seatRule,#edit_seatRule").textbox({
		label : '舱位规则:',
		labelWidth : 100,
		labelAlign : 'right',
		required : true,
		width : 250
	});
	$("#add_baggageAmount,#edit_baggageAmount").textbox({
		label : '行李额：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#add_refundFeeContent,#edit_refundFeeContent").textbox({
		label : '退票费内容：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$('#add_seatRemark,#edit_seatRemark').textbox({
		label : '舱位备注：',
		labelWidth : 100,
		labelAlign : 'right',
		required : false,
		width : 250,
		height: '75px',
		multiline:true
	});
	$('#add_seatTag,#edit_seatTag').textbox({
		label : '舱位标签：',
		labelWidth : 100,
		labelAlign : 'right',
		required : false,
		width : 250,
		height: '75px',
		multiline:true
	});
	$('#add_memberBenefits,#edit_memberBenefits').textbox({
		label : '会员权益：',
		labelWidth : 100,
		labelAlign : 'right',
		required : false,
		width : 250,
		height: '75px',
		multiline:true
	});
	$("#add_seatLabel,#edit_seatLabel").combobox({
		label : '舱位标识：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data : [{
			"id" : "0",
			"text" : "关闭"
		},{
			"id" : "1",
			"text" : "开启",
			"selected" : true
		}],
		valueField:'id',
		editable : false,
		required : true,
		textField:'text'
	});
	$("#add_seatFlag,#edit_seatFlag").combobox({
		label : '舱位类型：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data : [{
			"id" : "0",
			"text" : "禁用"
		},{
			"id" : "1",
			"text" : "启用",
			"selected" : true
		}],
		valueField:'id',
		editable : false,
		required : true,
		textField:'text'
	});
	$("#add_shareCode,#edit_shareCode").combobox({
		label : '是否共享航班：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data : [{
			"id" : "0",
			"text" : "否"
		},{
			"id" : "1",
			"text" : "是",
			"selected" : true
		}],
		valueField:'id',
		editable : false,
		required : true,
		textField:'text'
	});
	$("#add_isinter").combobox({
		label : '国内/国际：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data : [{
			"id" : "0",
			"text" : "国内",
			"selected" : true
		},{
			"id" : "1",
			"text" : "国际"
		}],
		valueField:'id',
		editable : false,
		required : true,
		textField:'text',
		onChange:function(newValue,oldValue){
			var addIsinter = $("#add_isinter").combobox('getText');
			if (addIsinter == '国际') {
				$('#add_baggageAmount').textbox({
					required : false
				});
				$('#add_refundFeeContent').textbox({
					required : false
				});
				$('#add_seatRule').textbox({
					required : false
				});
			}else {
				$('#add_baggageAmount').textbox({
					required : true
				});
				$('#add_refundFeeContent').textbox({
					required : true
				});
				$('#add_seatRule').textbox({
					required : true
				});
			}
		}
	});
	$("#edit_isinter").combobox({
		label : '国内/国际：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data : [{
			"id" : "0",
			"text" : "国内",
			"selected" : true
		},{
			"id" : "1",
			"text" : "国际"
		}],
		valueField:'id',
		editable : false,
		required : true,
		textField:'text',
		onChange:function(newValue,oldValue){
			var editIsinter = $("#edit_isinter").combobox('getText');
			if (editIsinter == '国际') {
				$('#edit_baggageAmount').textbox({
					required : false
				});
				$('#edit_refundFeeContent').textbox({
					required : false
				});
				$('#add_seatRule').textbox({
					required : false
				});
			}else {
				$('#edit_baggageAmount').textbox({
					required : true
				});
				$('#edit_refundFeeContent').textbox({
					required : true
				});
				$('#add_seatRule').textbox({
					required : true
				});
			}
		}
	});
	
	$('#add_discountRate,#edit_discountRate').combobox({
		label : '免票折扣率：',
		labelWidth : 100,
		labelAlign : "right",
		multiline:false,
		data: [{
			"id": "",
			"text": "--",
			"selected": true
		},{
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
	
	var dialog_add = {
		id : "cabinNameAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "cabinNameEdit",
		title : "修改"
	};
	// 添加窗口
	initDialog(dialog_add);
	$('#cabinNameAdd').dialog('close');
	// 添加窗口
	initDialog(dialog_edit);
	$('#cabinNameEdit').dialog('close');
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
	$('#cabinNameTable').datagrid({
		url : root+'/cabinName/queryCabinNameList',
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
			width : 10
		}, {
			field : 'seatid',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'isinter',
			title : '国内/国际',
			align : 'center',
			formatter : function(value, row, index) {
				if (value == 0) {
					return '国内';
				}else if (value == 1) {
					return '国际';
				}
			},
			width : 75
		}, {
			field : 'seat',
			title : '舱位',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'seatLabel',
			title : '舱位标识',
			align : 'center',
			formatter : function(value, row, index) {
				if (value == 0) {
					return '关闭';
				}else if (value == 1) {
					return '开启';
				}
			},
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
			field : 'seatRule',
			title : '舱位规则',
			align : 'center',
			formatter : baseFormater,
			width : 100
		},{
			field : 'baggageAmount',
			title : '行李额',
			align : 'center',
			formatter : baseFormater,
			width : 100
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
		},{
			field : 'refundFeeContent',
			title : '退票费内容',
			align : 'center',
			formatter : refundFeeContentFormater,
			width : 100
		},{
			field : 'memberBenefits',
			title : '会员权益',
			align : 'center',
			formatter : memberBenefitsFormater,
			width : 200
		},{
			field : 'seatRemark',
			title : '舱位备注',
			align : 'center',
			formatter : seatRemarkFormater,
			width : 200
		},{
			field : 'seatTag',
			title : '舱位标签',
			align : 'center',
			formatter : seatTagFormater,
			width : 200
		},{
			field : 'shareCode',
			title : '是否共享航班',
			align : 'center',
			formatter : shareCodeFormater,
			width : 200
		},{
			field : 'createDate',
			title : '创建时间',
			align : 'center',
			formatter : baseFormater,
			width : 100
		},{
			field : 'seatFlag',
			title : '操作',
			align : 'center',
			formatter : optFormater,
			width : 50
		}  ] ]
	});
}

//加载树形
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
}

//退票费内容显示格式
function refundFeeContentFormater(value, row, index) {
	var _refundFeeContent = row.refundFeeContent;
	/*if(_refundFeeContent != '' && typeof(_refundFeeContent) != undefined){
		if(_refundFeeContent == 'Y' || _refundFeeContent == 'W' || _refundFeeContent == 'J'){
			_refundFeeContent = '退改费用低';
		}else if(_refundFeeContent == 'A' || _refundFeeContent == 'U' || _refundFeeContent == 'P' 
			|| _refundFeeContent == 'Z' || _refundFeeContent == 'R' || _refundFeeContent == 'C' || _refundFeeContent == 'D' || _refundFeeContent == 'I'){
			_refundFeeContent = '退改费用高';
		}else{
			_refundFeeContent = '改费用适中';
		}
	}*/
	return _refundFeeContent;
};

//舱位备注显示格式
function seatRemarkFormater(value, row, index) {
	var _seatRemark = row.seatRemark;
	_seatRemark = _seatRemark.replace(/[|]/g, "\r\n");
	return _seatRemark;
};
function seatTagFormater(value, row, index) {
	var _seatTag = row.seatTag;
	_seatTag = _seatTag.replace(/[|]/g, "\r\n");
	return _seatTag;
};
function memberBenefitsFormater(value, row, index) {
	var _memberBenefits = row.memberBenefits;
	_memberBenefits = _memberBenefits.replace(/[|]/g, "\r\n");
	return _memberBenefits;
};
function shareCodeFormater(value, row, index) {
	if (value == 1) {
		return "是";
	}else {
		return "否";
	}
};

function optFormater(value, row, index) {
	var _id = "'" + row.seatid + "'";
	var lock = '';
	if(row.seatFlag == '1'){
		lock = ' <a href="javascript:void(0);" onclick=lockSeat(' + _id + ')>禁用</a>';
	}
	if(row.seatFlag == '0'){
		lock = ' <a href="javascript:void(0);" onclick=unlockSeat(' + _id + ')>启用</a>';
	}
	return lock;
};


/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#cabinNameTable').datagrid('resize');
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
function getInfo() {
	var selecteds = $('#cabinNameTable').datagrid('getSelections');
	if(selecteds.length!=1){
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	var selected = $('#cabinNameTable').datagrid('getSelected');
	selected.seatRemark = selected.seatRemark.replace(/[|]/g, "\n");
	selected.seatTag = selected.seatTag.replace(/[|]/g, "\n");
	selected.memberBenefits = selected.memberBenefits.replace(/[|]/g, "\n");
	$('#cabinNameEditForm').form('load',selected);
	$("#edit_id").val(selected.seatid);
	$('#cabinNameEdit').dialog('open');
}

/** -------- 修改 ------ */
function eidtCabinName(){
	var addflag = $("#cabinNameEditForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("cabinNameEditForm");
	var seatRemarkValue = params.seatRemark;
	params.seatRemark = paramProcessing(seatRemarkValue);
	var seatTagValue = params.seatTag;
	params.seatTag = paramProcessing(seatTagValue);
	var memberBenefitsValue = params.memberBenefits;
	params.memberBenefits = paramProcessing(memberBenefitsValue);
	
	var subchannel=$("#edit_channel").combobox("getValues").join(",");
	if(subchannel.indexOf(",")==0){
		params["channel"] =subchannel.substring(1);
	}else{
		params["channel"] =subchannel;
	}
	
	var add = {
		url :root+'/cabinName/updateCabinName',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("cabinNameTable");
			}
			$('#cabinNameEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}

/** -------- 添加 ------ */
function addCabinName(){
	var addflag = $("#cabinNameAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("cabinNameAddForm");
	var seatRemarkValue = params.seatRemark;
	params.seatRemark = paramProcessing(seatRemarkValue);
	var seatTagValue = params.seatTag;
	params.seatTag = paramProcessing(seatTagValue);
	var memberBenefitsValue = params.memberBenefits;
	params.memberBenefits = paramProcessing(memberBenefitsValue);
	
	var subchannel=$("#add_channel").combobox("getValues").join(",");
	if(subchannel.indexOf(",")==0){
		params["channel"] =subchannel.substring(1);
	}else{
		params["channel"] =subchannel;
	}
	
	var add = {
		url : root+'/cabinName/addCabinName',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("cabinNameTable");
			}
			$('#cabinNameAdd').dialog('close');
			showMessage(data);
			cabinNameAddReset();
		}
	}
	sendAjaxRequest(add);
}

function paramProcessing(param) {
	param = param.replace(/[\n]/g, "|");
	param = param.replace(/[\r]/g, "");
	return param;
}

/** -------- 批量删除 ------ */
function deleteCabinName() {
	var selecteds = $('#cabinNameTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#cabinNameTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#cabinNameTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].seatid);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root+'/cabinName/deleteCabinName';
				var options = {
					url : url,
					data : {
						"seatids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("cabinNameTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}

/** -------- 启用 ------ */
function unlockSeat(id) {
	$.messager.confirm('启用提示', '是否确认启用?', function(r) {
		if (r) {
			var options = {
				url : root + '/cabinName/updateSeatLabel',// 请求的action路径
				data : {
					"seatid" : id,
					"seatFlag" : "1"
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("cabinNameTable");
					}
					showMessage(data);
				}
			};
			sendAjaxRequest(options);
		}
	});
}
/** -------- 禁用 ------ */
function lockSeat(id) {
	$.messager.confirm('禁用提示', '是否确认禁用?', function(r) {
		if (r) {
			var options = {
				url : root + '/cabinName/updateSeatLabel',// 请求的action路径
				data : {
					"seatid" : id,
					"seatFlag" : "0"
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("cabinNameTable");
					}
					showMessage(data);
				}
			};
			sendAjaxRequest(options);
		}
	});
}

function closeAdd() {
	$('#cabinNameAddForm').form('reset');
	$('#cabinNameAdd').dialog('close');
}

/** -------- 重置查询条件 ------ */
function cabinNameReset() {
	$('#conditionForm').form('reset');

}
function cabinNameAddReset() {
	$('#cabinNameAddForm').form('reset');
}