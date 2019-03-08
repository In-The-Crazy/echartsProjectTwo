/** ----------------加载整体表格-------------------------* */
var channels=[];
$(function() {
	// 初始化页面角色
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
	$('#sellStartTime').datebox({
		label : '销售开始时间：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		editable : false,
		required : false,
	});
	$('#sellEndTime').datebox({
		label : '销售结束时间：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		editable : false,
		required : false
	});
	$('#add_sellStartTime').datebox({
		label : '',
		labelWidth : 100,
		labelAlign : 'right',
		width : 172,
		editable : false,
		required : false,
	});
	$('#add_sellEndTime').datebox({
		label : '',
		labelWidth : 100,
		labelAlign : 'right',
		width : 172,
		editable : false,
		required : false
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	$("#channel").combobox({
		label : '渠道类型：',
		labelWidth : 100,
		labelAlign : 'right'
	});
	$("#add_allChannelRefundDesc,#edit_allChannelRefundDesc").textbox({
		label: '全渠道退票说明：',
		labelWidth: 145,
		labelAlign: "right",
		required: false,
		multiline: true,
		width: 325,
		height: 100
	});
	$("#add_upgradRemark,#edit_upgradRemark").textbox({
		label: '备注：',
		labelWidth: 145,
		labelAlign: "right",
		required: false,
		multiline: true,
		width: 325,
		height: 100
	});
	$("#upgradCode").textbox({
		label : '产品编码：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#upgradName").textbox({
		label : '产品名称：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#upgradStatus").combobox({
		label : '启用/禁用：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	
	var dialog_add = {
		id : "upgradProductAdd",
		title : "增加升舱产品信息"
	}
	var dialog_edit = {
		id : "upgradProductEdit",
		title : "修改升舱产品信息"
	}
	// 新增窗口
	initDialog(dialog_add);
	$('#upgradProductAdd').dialog('close');
	// 编缉窗口
	initDialog(dialog_edit);
	$('#upgradProductEdit').dialog('close');

}

/** --------加载表格数据 ------ */
function ajaxTable() {
	// 验证时间
	var sellStartTime = $('#sellStartTime').datebox('getValue');
	var sellEndTime = $('#sellEndTime').datebox('getValue');
	if (sellStartTime != null && sellStartTime != "" && sellEndTime != null && sellEndTime != "") {
		sellStartTime = sellStartTime.replace(/-/g, '');
		sellEndTime = sellEndTime.replace(/-/g, '');
		if (parseInt(sellStartTime) > parseInt(sellEndTime)) {
			$.messager.alert('错误提示', '销售起始时间不能大于销售结束时间', 'error');
			return false;
		}
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#upgradProductTable').datagrid({
		url : root + '/upgradProduct/queryUpgradProductList',
		toolbar : '#toolbar',
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : true,// 定义是否设置基于该行内容的行高度
		pageNumber : 1,
		pageSize : 20,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : false,// 是否只能选中一条
		queryParams : params,
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
			alert('数据加载失败!');
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
			field : 'upgradId',
			checkbox : 'true',
			align : 'center',
			width : 20
		}, {
			field : 'upgradCode',
			title : '产品编码',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'upgradName',
			title : '产品名称',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field: 'channel',
			title: '渠道类型',
			align: 'center',
			formatter: function (value, row, index) {
				if (value == "") {
					return "全渠道";
				} else {
					var valueArr = value.split(",");
					var channelArr = [];
					for (var i = 0; i < channels.length; i++) {
						for (var j = 0; j < valueArr.length; j++) {
							if (channels[i].chalCode == valueArr[j]) {
								channelArr.push(channels[i].chalName);
								continue;
							}
						}

					}
					return channelArr.join(",");
				}

			},
			width: 200
		}, {
			field : 'upgradCabin',
			title : '升舱舱位',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'upgradContentDesc',
			title : '升舱产品内容说明',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'upgradRefundDesc',
			title : '升舱产品退改签说明',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'allChannelRefundDesc',
			title : '全渠道退票说明',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'sellStartTime',
			title : '销售开始时间',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'sellEndTime',
			title : '销售结束时间',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'upgradStatus',
			title : '启用/禁用',
			align : 'center',
			formatter : optFormater,
			width : 100
		}, {
			field : 'upgradRemark',
			title : '备注',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}] ]
	})

}

/**
 * 加载树型
 */
function ajaxTree() {

	var queryChannel={
		url : root+'/common/channels',
		callBackFun : function(data) {
			channels = data.rows;
			var treeList = rowsListAddAll(data.rows, {
				"checked" : true,
				"children" : null,
				"chalCode" : "",
				"chalName" : "全部"
			});
			$('#channel').combobox({
				width : 250,
				data:treeList,
				valueField:'chalCode',
				textField:'chalName',
				required : true
			});
		}
	};
	sendAjaxRequest(queryChannel);

	var channel={
		url : root+'/common/channels',
		callBackFun : function(data) {
			channels = data.rows;
			$('#add_channel,#edit_channel').combobox({
				width : 172,
				data:data.rows,
				valueField:'chalCode',
				textField:'chalName',
				required : true,
				onLoadSuccess : function() {
					$('#add_channel').combobox("setValue",data.rows[0].chalCode);
					$('#edit_channel').combobox("setValue",data.rows[0].chalCode);
				}
			});
		}
	};
	sendAjaxRequest(channel);
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#upgradProductTable').datagrid('resize');
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

function getInfo(flag) {
	if(flag == 'edit'){
		var selecteds = $('#upgradProductTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#upgradProductTable').datagrid('getSelected');
		var options = {
			url : root + '/upgradProduct/viewUpgradProductInfo',
			data : {
				'upgradId' : selected.upgradId
			},
			callBackFun : function(data) {
				// 加载定义信息
				$("#edit_upgradId").val(data.obj.upgradId);
				$("#edit_upgradCode").val(data.obj.upgradCode);
				$("#edit_upgradName").val(data.obj.upgradName);
				$('#edit_channel').combobox('setValues',(data.obj.channel).split(','));
				$("#edit_sellStartTime").datetimebox("setValue",data.obj.sellStartTime);
				$("#edit_sellEndTime").datetimebox("setValue",data.obj.sellEndTime);
				$('#edit_upgradCabin').combobox('setValues',(data.obj.upgradCabin).split(','));
				$('#edit_upgradStatus').combobox('select',data.obj.upgradStatus);
				CKEDITOR.instances.edit_upgradRefundDesc.setData(data.obj.upgradRefundDesc);
				CKEDITOR.instances.edit_upgradContentDesc.setData(data.obj.upgradContentDesc);
				$("#edit_allChannelRefundDesc").textbox("setValue",data.obj.allChannelRefundDesc);
				$("#edit_upgradRemark").textbox("setValue",data.obj.upgradRemark);
				// 打开编缉页面
				$('#upgradProductEdit').dialog('open');
			}
		}
		sendAjaxRequest(options);
	}
}

/** -------- 删除 ------ */
function deleteUpgradProduct() {
	var selecteds = $('#upgradProductTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#upgradProductTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#upgradProductTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].upgradId);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除?', function(r) {
			if (r) {
				var options = {
					url : root + '/upgradProduct/deleteUpgradProduct',// 请求的action路径
					data : {
						"upgradIds" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							resetAddForm();
							reloadTable("upgradProductTable");
						}
						showMessage(data);
					}
				};
				sendAjaxRequest(options);
			}
		});
	}
}

// 执行用户添加操作
function addUpgradProduct() {
	//验证表单参数
	var sflag = $("#upgradProductAddForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var sellStartTime = $('#add_sellStartTime').datebox('getValue');
	var sellEndTime = $('#add_sellEndTime').datebox('getValue');
	if (sellStartTime != null && sellStartTime != "" && sellEndTime != null && sellEndTime != "") {
		sellStartTime = sellStartTime.replace(/-/g, '');
		sellEndTime = sellEndTime.replace(/-/g, '');
		if (parseInt(sellStartTime) > parseInt(sellEndTime)) {
			$.messager.alert('错误提示', '销售起始时间不能大于销售结束时间', 'error');
			return false;
		}
	}
	var params = serializeJsonForUpgradProduct("upgradProductAddForm","add");
	var add = {
		url : root + '/upgradProduct/saveUpgradProduct',// 请求的action路径
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				resetAddForm();
				reloadTable("upgradProductTable");
				$('#upgradProductAdd').dialog('close');
			}
			showMessage(data);
		}
	};
	sendAjaxRequest(add);
}

// 执行角色编辑操作
function editUpgradProduct() {
	//验证表单参数
	var sflag = $("#upgradProductEditForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var sellStartTime = $('#edit_sellStartTime').datebox('getValue');
	var sellEndTime = $('#edit_sellEndTime').datebox('getValue');
	if (sellStartTime != null && sellStartTime != "" && sellEndTime != null && sellEndTime != "") {
		sellStartTime = sellStartTime.replace(/-/g, '');
		sellEndTime = sellEndTime.replace(/-/g, '');
		if (parseInt(sellStartTime) > parseInt(sellEndTime)) {
			$.messager.alert('错误提示', '销售起始时间不能大于销售结束时间', 'error');
			return false;
		}
	}
	var params = serializeJsonForUpgradProduct("upgradProductEditForm","edit");
	var edit = {
		url : root + '/upgradProduct/updateUpgradProduct',// 请求的action路径
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("upgradProductTable");
				$('#upgradProductEdit').dialog('close');
			}
			showMessage(data);
		}
	};
	sendAjaxRequest(edit);
}

/**
 * 以JSON的形式格式化参数
 */
function serializeJsonForUpgradProduct(formId,flag){
	var params = $("#"+formId).serializeArray();
	var list = {};
	var upgradCabin ='';
	var allChannelRefundDesc ='';
	var upgradRemark ='';
	var channel ='';
	$.each(params, function(i, field){
		var result =  iGetInnerText(field.value);
		if(field.name == 'channel'){
			if (channel!='' && channel!=null){
				channel +=',';
			}
			channel += result;
		}
		if(field.name == 'allChannelRefundDesc'){
			allChannelRefundDesc=field.value;
		}
		if(field.name == 'upgradRemark'){
			upgradRemark=field.value;
		}
		if(field.name == 'upgradCabin'){
			if (upgradCabin!='' && upgradCabin!=null){
				upgradCabin +=',';
			}
			upgradCabin += result;
		}
		if(field.name == 'upgradRefundDesc'){
			if(flag == 'add'){
				result = iGetInnerText(CKEDITOR.instances.add_upgradRefundDesc.getData());
			}
			if(flag == 'edit'){
				result = iGetInnerText(CKEDITOR.instances.edit_upgradRefundDesc.getData());
			}
		}
		if(field.name == 'upgradContentDesc'){
			if(flag == 'add'){
				result = iGetInnerText(CKEDITOR.instances.add_upgradContentDesc.getData());
			}
			if(flag == 'edit'){
				result = iGetInnerText(CKEDITOR.instances.edit_upgradContentDesc.getData());
			}
		}
		list[field.name] = result;
	});
	list['upgradCabin'] = upgradCabin;
	list['allChannelRefundDesc'] = allChannelRefundDesc;
	list['upgradRemark'] = upgradRemark;
	list['channel'] = channel;
	return list;
}

function upgradProductReset() {
	$("#conditionForm").form("clear");
	$('#upgradStatus').combobox('select','-1');
	var queryChannel={
		url : root+'/common/channels',
		callBackFun : function(data) {
			channels = data.rows;
			var treeList = rowsListAddAll(data.rows, {
				"checked" : true,
				"children" : null,
				"chalCode" : "",
				"chalName" : "全部"
			});
			$('#channel').combobox({
				width : 250,
				data:treeList,
				valueField:'chalCode',
				textField:'chalName',
				required : true
			});
		}
	};
	sendAjaxRequest(queryChannel);}

function resetAddForm() {
	$("#upgradProductAddForm").form("clear");
	$('#add_upgradCabin').combobox('select','W');
	$('#add_upgradStatus').combobox('select','1');
	CKEDITOR.instances.add_upgradRefundDesc.setData("");
	CKEDITOR.instances.add_upgradContentDesc.setData("");
	var channel={
		url : root+'/common/channels',
		callBackFun : function(data) {
			channels = data.rows;
			$('#add_channel').combobox({
				width : 172,
				data:data.rows,
				valueField:'chalCode',
				textField:'chalName',
				required : true,
				onLoadSuccess : function() {
					$('#add_channel').combobox("setValue",data.rows[0].chalCode);
				}
			});
		}
	};
	sendAjaxRequest(channel);

}

/**
 * 设置启用禁用列的信息 row 当前行的数据 index 当前行的索引 从0 开始
 */
function optFormater(value, row, index) {
	var flag=row.upgradStatus;
	var _id="'"+row.upgradId+"'";
	var start,stop;
	if(flag=="1"){
		start='<a href="javascript:void(0)" onclick="startUse(' + _id + ',0)">禁用</a>'
	}
	if(flag=="0"){
		start='<a href="javascript:void(0)" onclick="startUse(' + _id + ',1)">启用</a>'
	}
	return start;
}

/** -------- 启用禁用------ */
function startUse(id,flag){
	var re = {
		url :root+'/upgradProduct/updateStatus',
		data : {
			status:flag,
			id:id
		},
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("upgradProductTable");
			}
			showMessage(data);
		}
	}
	sendAjaxRequest(re);
}
