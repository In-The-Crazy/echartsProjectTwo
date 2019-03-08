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
	//自定义校验规则
	$.extend($.fn.validatebox.defaults.rules, {
		priceReg : {
			validator: function(value,param){
				var flag = false;
				if ($.trim(value)!="" && $.trim(value)!=null && !isNaN(value) && Number(value) >= 0){
					flag = true;
				}
				return flag;
			},
			message: '价格输入有误！'
		}
	});


});

/** --------加载日历选择 ------ */
function initDatebox() {


}

/** --------初始化页面模块 ------ */
function initPage() {
	$("#add_priceRemark,#edit_priceRemark").textbox({
		label: '备注：',
		labelWidth: 130,
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
	$("#createName").textbox({
		label : '创建人：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#priceStatus").combobox({
		label : '启用/禁用：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});

	var upgradProduct = {
		url :root + '/upgradTime/getUpgradProductList',
		callBackFun : function(data) {
			$('#add_upgradId,#edit_upgradId').combobox({
				data : data.obj,
				valueField:'upgradId',
				textField:'upgradName',
				required : true,
				width : 172,
				onLoadSuccess : function() {
					$('#add_upgradId').combobox("setValue",data.obj[0].upgradId);
				}
			});
		}
	}
	sendAjaxRequest(upgradProduct);

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
	
	var dialog_add = {
		id : "upgradLowestPriceAdd",
		title : "增加升舱保底价格政策信息"
	}
	var dialog_edit = {
		id : "upgradLowestPriceEdit",
		title : "修改升舱保底价格政策信息"
	}
	// 新增窗口
	initDialog(dialog_add);
	$('#upgradLowestPriceAdd').dialog('close');
	// 编缉窗口
	initDialog(dialog_edit);
	$('#upgradLowestPriceEdit').dialog('close');

}

/** --------加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#upgradLowestPriceTable').datagrid({
		url : root + '/upgradLowestPrice/queryUpgradLowestPriceList',
		toolbar : '#toolbar',
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
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
			field : 'lowestpriceid',
			checkbox : 'true',
			align : 'center',
			width : 20
		}, {
			field : 'upgradcode',
			title : '产品编码',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'upgradname',
			title : '产品名称',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'channel',
			title : '渠道类型',
			align : 'center',
			formatter : function(value, row, index){
				if(value==""){
					return "全渠道";
				}else{
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
				}

			},
			width : 200
		}, {
			field : 'idtlowestprice',
			title : '成人保底价格',
			align : 'center',
			formatter : priceFormater,
			width : 200
		}, {
			field : 'chdlowestprice',
			title : '儿童保底价格',
			align : 'center',
			formatter : priceFormater,
			width : 200
		}, {
			field : 'inflowestprice',
			title : '婴儿保底价格',
			align : 'center',
			formatter : priceFormater,
			width : 200
		}, {
			field : 'createname',
			title : '创建人',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'createdate',
			title : '创建时间',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'modifyname',
			title : '修改人',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'modifydate',
			title : '修改时间',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'priceremark',
			title : '备注',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'pricestatus',
			title : '启用/禁用',
			align : 'center',
			formatter : optFormater,
			width : 200
		}] ]
	})

}

/**
 * 加载树型
 */
function ajaxTree() {

}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#upgradLowestPriceTable').datagrid('resize');
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
		var selecteds = $('#upgradLowestPriceTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#upgradLowestPriceTable').datagrid('getSelected');
		var options = {
			url : root + '/upgradLowestPrice/viewUpgradLowestPriceInfo',
			data : {
				'lowestPriceId' : selected.lowestpriceid
			},
			callBackFun : function(data) {
				// 加载定义信息
				$("#edit_lowestPriceId").val(data.obj.lowestPriceId);
				$('#edit_upgradId').combobox('select',data.obj.upgradId);
				$('#edit_channel').combobox('setValues',(data.obj.channel).split(','));
				$('#edit_idtLowestPrice').val(data.obj.idtLowestPrice);
				$('#edit_chdLowestPrice').val(data.obj.chdLowestPrice);
				$('#edit_inflowestPrice').val(data.obj.inflowestPrice);
				$('#edit_priceStatus').combobox('select',data.obj.priceStatus);
				$('#edit_priceRemark').textbox('setValue',data.obj.priceRemark);

				// 打开编缉页面
				$('#upgradLowestPriceEdit').dialog('open');
			}
		}
		sendAjaxRequest(options);
	}
}

/** -------- 删除 ------ */
function deleteUpgradLowestPrice() {
	var selecteds = $('#upgradLowestPriceTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#upgradLowestPriceTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#upgradLowestPriceTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].lowestpriceid);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除?', function(r) {
			if (r) {
				var options = {
					url : root + '/upgradLowestPrice/deleteUpgradLowestPrice',// 请求的action路径
					data : {
						"lowestPriceIds" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							resetAddForm();
							reloadTable("upgradLowestPriceTable");
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
function addUpgradLowestPrice() {
	//验证表单参数
	var sflag = $("#upgradLowestPriceAddForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}

	var params = serializeJsonForUpgradProduct("upgradLowestPriceAddForm","add");
	var add = {
		url : root + '/upgradLowestPrice/saveUpgradLowestPrice',// 请求的action路径
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				resetAddForm();
				reloadTable("upgradLowestPriceTable");
				$('#upgradLowestPriceAdd').dialog('close');
			}
			showMessage(data);
		}
	};
	sendAjaxRequest(add);
}

// 执行角色编辑操作
function editUpgradLowestPrice() {
	//验证表单参数
	var sflag = $("#upgradLowestPriceEditForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}

	var params = serializeJsonForUpgradProduct("upgradLowestPriceEditForm","edit");
	var edit = {
		url : root + '/upgradLowestPrice/updateUpgradLowestPrice',// 请求的action路径
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("upgradLowestPriceTable");
				$('#upgradLowestPriceEdit').dialog('close');
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
	var priceRemark ='';
	var channel ='';
	$.each(params, function(i, field){
		var result =  iGetInnerText(field.value);
		if(field.name == 'channel'){
			if (channel!='' && channel!=null){
				channel +=',';
			}
			channel += result;
		}
		if(field.name == 'priceRemark'){
			priceRemark=field.value;
		}

		list[field.name] = result;
	});
	list['priceRemark'] = priceRemark;
	list['channel'] = channel;
	return list;
}

function upgradLowestPriceReset() {
	$("#conditionForm").form("clear");
	$('#priceStatus').combobox('select','-1');

}

function resetAddForm() {
	$("#upgradLowestPriceAddForm").form("clear");
	$('#add_priceStatus').combobox('select','1');
	var upgradProduct = {
		url :root + '/upgradTime/getUpgradProductList',
		callBackFun : function(data) {
			$('#add_upgradId').combobox({
				data : data.obj,
				valueField:'upgradId',
				textField:'upgradName',
				required : true,
				width : 155,
				onLoadSuccess : function() {
					$('#add_upgradId').combobox("setValue",data.obj[0].upgradId);
				}
			});
		}
	}
	sendAjaxRequest(upgradProduct);

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
	var flag=row.pricestatus;
	var _id="'"+row.lowestpriceid+"'";
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
		url :root+'/upgradLowestPrice/updateStatus',
		data : {
			status:flag,
			id:id
		},
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("upgradLowestPriceTable");
			}
			showMessage(data);
		}
	}
	sendAjaxRequest(re);
}

function priceFormater(value, row, index) {
	if(value!='0' && isEmpty(value)){
		return "--";
	}
	return value;
};



