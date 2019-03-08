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
	var payLimitReg = /^[1-9]\d*$/
	$.extend($.fn.validatebox.defaults.rules, {
		timeReg : {
			validator: function(value,param){
				return payLimitReg.test(value);
			},
			message: '时间输入有误！'
		}
	});


});

/** --------加载日历选择 ------ */
function initDatebox() {


}

/** --------初始化页面模块 ------ */
function initPage() {
	$('#add_payLimit').val(10);//默认支付时间
	$("#add_timeRemark,#edit_timeRemark").textbox({
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
	$("#channel").combobox({
		label : '渠道类型：',
		labelWidth : 100,
		labelAlign : 'right'
	});
	$("#timeStatus").combobox({
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
		id : "upgradTimeAdd",
		title : "增加升舱时间维护信息"
	}
	var dialog_edit = {
		id : "upgradTimeEdit",
		title : "修改升舱时间维护信息"
	}
	// 新增窗口
	initDialog(dialog_add);
	$('#upgradTimeAdd').dialog('close');
	// 编缉窗口
	initDialog(dialog_edit);
	$('#upgradTimeEdit').dialog('close');

}

/** --------加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#upgradTimeTable').datagrid({
		url : root + '/upgradTime/queryUpgradTimeList',
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
			field : 'timeid',
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
			field : 'timetype',
			title : '时间类型',
			align : 'center',
			formatter : timeTypeFormater,
			width : 200
		}, {
			field : 'timestart',
			title : '时间起',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'timeend',
			title : '时间止',
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
			field : 'paylimit',
			title : '支付时间',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'timeremark',
			title : '备注',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'timestatus',
			title : '启用/禁用',
			align : 'center',
			formatter : optFormater,
			width : 100
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
	$('#upgradTimeTable').datagrid('resize');
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
		var selecteds = $('#upgradTimeTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#upgradTimeTable').datagrid('getSelected');
		var options = {
			url : root + '/upgradTime/viewUpgradTimeInfo',
			data : {
				'timeId' : selected.timeid
			},
			callBackFun : function(data) {
				// 加载定义信息
				$("#edit_timeId").val(data.obj.timeId);
				$('#edit_upgradId').combobox('select',data.obj.upgradId);
				$('#edit_timeType').combobox('select',data.obj.timeType);
				var timeStart1=parseInt((data.obj.timeStart)/60/24);
				var timeStart2=parseInt((data.obj.timeStart)/60%24);
				var timeStart3=parseInt((data.obj.timeStart)%60);
				$('#edit_timeStart1').val(timeStart1==0?'':timeStart1);
				$('#edit_timeStart2').val(timeStart2==0?'':timeStart2);
				$('#edit_timeStart3').val(timeStart3==0?'':timeStart3);
				var timeEnd1=parseInt((data.obj.timeEnd)/60/24);
				var timeEnd2=parseInt((data.obj.timeEnd)/60%24);
				var timeEnd3=parseInt((data.obj.timeEnd)%60);
				$('#edit_timeEnd1').val(timeEnd1==0?'':timeEnd1);
				$('#edit_timeEnd2').val(timeEnd2==0?'':timeEnd2);
				$('#edit_timeEnd3').val(timeEnd3==0?'':timeEnd3);
				$('#edit_channel').combobox('setValues',(data.obj.channel).split(','));
				$('#edit_payLimit').val(data.obj.payLimit);
				$('#edit_timeStatus').combobox('select',data.obj.timeStatus);
				$('#edit_timeRemark').textbox('setValue',data.obj.timeRemark);

				// 打开编缉页面
				$('#upgradTimeEdit').dialog('open');
			}
		}
		sendAjaxRequest(options);
	}
}

/** -------- 删除 ------ */
function deleteUpgradTime() {
	var selecteds = $('#upgradTimeTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#upgradTimeTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#upgradTimeTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].timeid);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除?', function(r) {
			if (r) {
				var options = {
					url : root + '/upgradTime/deleteUpgradTime',// 请求的action路径
					data : {
						"timeIds" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							resetAddForm();
							reloadTable("upgradTimeTable");
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
function addUpgradTime() {
	//验证表单参数

	var sflag = $("#upgradTimeAddForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}

	var timeStartfalg=false;
	$("#upgradTimeAddForm").find('[name=timeStart]').each(
		function(){
			if($(this).val()!='' && $(this).val()!=null){
				timeStartfalg = true;
				return false;
			}
		}
	);
	var timeEndfalg=false;
	$("#upgradTimeAddForm").find('[name=timeEnd]').each(
		function(){
			if($(this).val()!='' && $(this).val()!=null){
				timeEndfalg = true;
				return false;
			}
		}
	);
	if(timeStartfalg==false){
		$.messager.alert('错误提示', '时间起至少填写一项！', 'error');
		return false;
	}
	if(timeEndfalg==false){
		$.messager.alert('错误提示', '时间止至少填写一项！', 'error');
		return false;
	}
	var timeStartMin = Number($('#add_timeStart1').val())*24*60 +Number($('#add_timeStart2').val())*60 +Number($('#add_timeStart3').val());
	var timeEndMin = Number($('#add_timeEnd1').val())*24*60 +Number($('#add_timeEnd2').val())*60 +Number($('#add_timeEnd3').val());
	if (timeStartMin >= timeEndMin){
		$.messager.alert('错误提示', '时间起不能大于等于时间止！', 'error');
		return false;
	}

	var params = serializeJsonForUpgradProduct("upgradTimeAddForm","add");
	var add = {
		url : root + '/upgradTime/saveUpgradTime',// 请求的action路径
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				resetAddForm();
				reloadTable("upgradTimeTable");
				$('#upgradTimeAdd').dialog('close');
			}
			showMessage(data);
		}
	};
	sendAjaxRequest(add);
}

// 执行角色编辑操作
function editUpgradTime() {
	//验证表单参数
	var sflag = $("#upgradTimeEditForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var timeStartfalg=false;
	$("#upgradTimeEditForm").find('[name=timeStart]').each(
		function(){
			if($(this).val()!='' && $(this).val()!=null){
				timeStartfalg = true;
				return false;
			}
		}
	);
	var timeEndfalg=false;
	$("#upgradTimeEditForm").find('[name=timeEnd]').each(
		function(){
			if($(this).val()!='' && $(this).val()!=null){
				timeEndfalg = true;
				return false;
			}
		}
	);
	if(timeStartfalg==false){
		$.messager.alert('错误提示', '时间起至少填写一项！', 'error');
		return false;
	}
	if(timeEndfalg==false){
		$.messager.alert('错误提示', '时间止至少填写一项！', 'error');
		return false;
	}
	var timeStartMin = Number($('#edit_timeStart1').val())*24*60 +Number($('#edit_timeStart2').val())*60 +Number($('#edit_timeStart3').val());
	var timeEndMin = Number($('#edit_timeEnd1').val())*24*60 +Number($('#edit_timeEnd2').val())*60 +Number($('#edit_timeEnd3').val());
	if (timeStartMin >= timeEndMin){
		$.messager.alert('错误提示', '时间起不能大于等于时间止！', 'error');
		return false;
	}
	var params = serializeJsonForUpgradProduct("upgradTimeEditForm","edit");
	var edit = {
		url : root + '/upgradTime/updateUpgradTime',// 请求的action路径
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("upgradTimeTable");
				$('#upgradTimeEdit').dialog('close');
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
	var timeRemark ='';
	var channel ='';
	$.each(params, function(i, field){
		var result =  iGetInnerText(field.value);
		if(field.name == 'channel'){
			if (channel!='' && channel!=null){
				channel +=',';
			}
			channel += result;
		}
		if(field.name == 'timeRemark'){
			timeRemark=field.value;
		}

		list[field.name] = result;
	});
	list['timeRemark'] = timeRemark;
	if(flag=='add') {
		var timeStartMin = Number($('#add_timeStart1').val())*24*60 +Number($('#add_timeStart2').val())*60 +Number($('#add_timeStart3').val());
		var timeEndMin = Number($('#add_timeEnd1').val())*24*60 +Number($('#add_timeEnd2').val())*60 +Number($('#add_timeEnd3').val());
		list['timeStart'] = timeStartMin;
		list['timeEnd'] = timeEndMin;
	} else if(flag=='edit') {
		var timeStartMin = Number($('#edit_timeStart1').val())*24*60 +Number($('#edit_timeStart2').val())*60 +Number($('#edit_timeStart3').val());
		var timeEndMin = Number($('#edit_timeEnd1').val())*24*60 +Number($('#edit_timeEnd2').val())*60 +Number($('#edit_timeEnd3').val());
		list['timeStart'] = timeStartMin;
		list['timeEnd'] = timeEndMin;
	}
	list['channel'] = channel;
	return list;
}

function upgradTimeReset() {
	$("#conditionForm").form("clear");
	$('#timeStatus').combobox('select','-1');
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
}

function resetAddForm() {
	$("#upgradTimeAddForm").form("clear");
	$('#add_timeStatus').combobox('select','1');
	$('#add_timeType').combobox('select','0');
	$('#add_payLimit').val(10);
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
	var flag=row.timestatus;
	var _id="'"+row.timeid+"'";
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
		url :root+'/upgradTime/updateStatus',
		data : {
			status:flag,
			id:id
		},
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("upgradTimeTable");
			}
			showMessage(data);
		}
	}
	sendAjaxRequest(re);
}

/**
 * 时间类型
 */
function timeTypeFormater(value, row, index) {
	var timetype=row.timetype;
	var returnType='';
	if(timetype=="0"){
		returnType='航班计划离站时间前'
	}
	return returnType;
}


