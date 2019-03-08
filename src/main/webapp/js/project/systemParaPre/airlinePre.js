var channels=[];
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
		id : "airLineAdd",
		title : "添加"
	};
	var dialog_edit = {
			id : "airLineEdit",
			title : "修改"
	};
	var dialog_set = {
		id : "setChannel",
		title : "设置渠道"
	};
	// 添加窗口
	initDialog(dialog_add);
	$('#airLineAdd').dialog('close');
	// 修改窗口
	initDialog(dialog_edit);
	$('#airLineEdit').dialog('close');
	// 修改渠道窗口
	initDialog(dialog_set);
	$('#setChannel').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	console.log(JSON.stringify(params));
	// 加载表格
	$('#airlinePreTable').datagrid({
		url : root+'/cityAirport/queryAirlineList',
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
			console.log(data);
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
			field : 'sail',
			title : '航线',
			align : 'center',
			formatter : function(value, row, index){
				return row.id;
			},
			width : 75
		}, {
			field : 'afromcode',
			title : '出发城市代码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'afromname',
			title : '出发城市名称',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'atocode',
			title : '到达城市代码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},{
			field : 'atoname',
			title : '到达城市名称',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},{
			field : 'channel',
			title : '渠道编号',
			align : 'center',
			formatter : function(value, row, index){
				console.log(value);
				var valueArr=value.split(",");
				console.log(valueArr);
				var channelArr=[];
				for (var i = 0; i < channels.length; i++) {
					console.log(channels);
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
		}, {
			field : 'isRetro',
			title : '积分补登',
			align : 'center',
			formatter : function(value, row, index){
				var text = baseFormater(value, row, index);
				if(value == "0"){
					text = '否';
				}
				if(value == "1"){
					text = '是';
				}
				return text;
				
			},
			width : 50
		}, {
			field : 'forTicket',
			title : '机票查询',
			align : 'center',
			formatter : function(value, row, index){
				var text = baseFormater(value, row, index);
				if(value == "1"){
					text = '是';
				}else{
					text = '否';
				}
				return text;
			},
			width : 75
		}, {
			field : 'forFlight',
			title : '航班动态',
			align : 'center',
			formatter : function(value, row, index){
				var text = baseFormater(value, row, index);
				if(value == "1"){
					text = '是';
				}else{
					text = '否';
				}
				return text;
			},
			width : 75
		}, {
			field : 'shareCode',
			title : '是否共享航班',
			align : 'center',
			formatter : function(value, row, index){
				var text = baseFormater(value, row, index);
				if(value == "true"){
					text = '是';
				}else{
					text = '否';
				}
				return text;
			},
			width : 75
		},{
			field : 'validity',
			title : '操作',
			align : 'center',
			formatter : optFormater,
			width : 50
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	//航空公司名称
	$('#airway').combobox({
		data: [{
			"id" : "NS",
			"text" : "河北航空"
		}],
		valueField:'id',
		textField:'text',
		width: 150
	});
	$('#add_airway,#edit_airway').combobox({
		label: '航空公司名称：',
		labelWidth: 100,
		labelAlign: "right",
		data: [{
			"id" : "NS",
			"text" : "河北航空"
		}],
		valueField:'id',
		textField:'text',
		required: true,
		width: 250
	});
	//渠道设置
	var channel={
			url : root+'/common/channels',
			callBackFun : function(data) {
				channels = data.rows;
				console.log("pindao");
				var treeList = rowsListAddAll(data.rows, {
					"checked" : true,
					"children" : null,
					"chalCode" : "",
					"chalName" : "全部"
				});
				//渠道设置
				$('#channel').combobox({
					data:treeList,
					valueField:'chalCode',
					editable : false,
					textField:'chalName'
				});
				$('#add_channel,#set_channel,#edit_channel').combobox({
					label: '渠道设置：',
					labelWidth: 100,
					labelAlign: "right",
					width: 250,
					data:data.rows,
					valueField:'chalCode',
					editable : false,
					multiple:true,
					required : true,
					textField:'chalName'
				});
				
			}
		};
		sendAjaxRequest(channel);
	//出发城市名称
	var add_afrom = {
		url :root+'/cityAirport/queryAirCitiesTree',
		callBackFun : function(data) {
			$('#afrom').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				limitToList : true,
				width: 150
			});
			$('#add_afrom,#edit_afrom').combobox({
				label: '出发城市名称：',
				labelWidth: 100,
				labelAlign: "right",
				width: 250,
				data : data.treeList,
				limitToList : true,
				valueField:'id',
				textField:'text',
				required : true
			});
		}
	}
	sendAjaxRequest(add_afrom);
	
	//到达城市名称
	var add_ato = {
		url : root+'/cityAirport/queryAirCitiesTree',
		callBackFun : function(data) {
			$('#ato').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				limitToList : true,
				width: 150
			});
			$('#add_ato,#edit_ato').combobox({
				label: '到达城市名称：',
				labelWidth: 100,
				labelAlign: "right",
				width: 250,
				data : data.treeList,
				limitToList : true,
				valueField:'id',
				textField:'text',
				required : true
			});
		}
	}
	sendAjaxRequest(add_ato);
	
	//城市用于
	$('#forCity').combobox({
		data: [{
			"id" : "",
			"text" : "全部"
		},{
			"id" : "0",
			"text" : "机票查询"
		},{
			"id" : "1",
			"text" : "航班动态"
		},{
			"id" : "2",
			"text" : "积分补登"
		}],
		valueField:'id',
		textField:'text',
		width: 150
	});
	
	//机票查询
	$('#add_forTicket,#edit_forTicket').combobox({
		label: '机票查询：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		data: [{
			"id" : "1",
			"text" : "是"
		},{
			"id" : "0",
			"text" : "否"
		}],
		valueField:'id',
		required : true,
		textField:'text'
	});
	//积分补登
	$('#add_isRetro,#edit_isRetro').combobox({
		label: '积分补登：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		data: [{
			"id" : "1",
			"text" : "是"
		},{
			"id" : "0",
			"text" : "否"
		}],
		valueField:'id',
		required : true,
		editable : false,
		textField:'text'
	});
	//航班动态
	$('#add_forFlight,#edit_forFlight').combobox({
		label: '航班动态：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		data: [{
			"id" : "1",
			"text" : "是"
		},{
			"id" : "0",
			"text" : "否"
		}],
		valueField:'id',
		required : true,
		textField:'text'
	});
	
	//启用禁用
	$('#add_status,#edit_status').combobox({
		label: '启用/禁用：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		data: [{
			"id" : "0",
			"text" : "启用"
		},{
			"id" : "1",
			"text" : "禁用"
		}],
		valueField:'id',
		editable : false,
		required : true,
		textField:'text'
	});
	
	//是否共享航班
	$('#add_shareCode,#edit_shareCode').combobox({
		label: '是否共享航班：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		data: [{
			"id" : "true",
			"text" : "是"
		},{
			"id" : "false",
			"text" : "否"
		}],
		valueField:'id',
		editable : false,
		required : true,
		textField:'text'
	});
	
	$('#forCity').combobox('select', '');
	$('#airway').combobox('select', 'NS');
	$('#add_airway').combobox('select', 'NS');
	$('#add_forTicket').combobox('select', '1');
	$('#add_forFlight').combobox('select', '1');
	$('#add_isRetro').combobox('select', '1');
	$('#add_channel').combobox('setValues', ["mini"]);
	$('#add_status').combobox('select', '1');
	$('#add_shareCode').combobox('select', 'false');
}
/**
 * 设置启用禁用列的信息 row 当前行的数据 index 当前行的索引 从0 开始
 */
function optFormater(value, row, index) {
	console.log(row);
	var flag=row.validity;
	var _id="'"+row.id+"'";
	var start,stop;
	if(flag=="0"){
		start='<a href="javascript:void(0)" onclick="startUse(' + _id + ',1)">禁用</a>'
	}
	if(flag=="1"){
		start='<a href="javascript:void(0)" onclick="startUse(' + _id + ',0)">启用</a>'
	}
	return start;
};
/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#airlinePreTable').datagrid('resize');
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
	if(flag == 'edit'){
		var selecteds = $('#airlinePreTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		
		var selected = $('#airlinePreTable').datagrid('getSelected');
		console.log(selected);
		var edit = {
			url : root + '/cityAirport/queryAirlineInfo',
			data : {'id':selected.id},
			callBackFun : function(data) {
				$("#airLineEditForm").form("load", data.obj);
				$("#edit_airCityId").val(selected.id);
			}
		}
		sendAjaxRequest(edit);
		$('#airLineEdit').dialog('open');
	}else{
		var selecteds = $('#airlinePreTable').datagrid('getSelections');
		console.log("xuanze");
		console.log(selecteds);
		if(selecteds.length==0){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		if(selecteds.length==1){
			 var selected= selecteds[0].channel.split(",");
			console.log(selected);
			$('#set_channel').combobox('setValues', selected);
		}else{
			$('#set_channel').combobox('setValues', "");
		}
		var ids=[];
		for(var i=0; i<selecteds.length; i++){  
		    ids.push(selecteds[i].id);
//			deleteJob1(selecteds[i].id);
		}  
		console.log(ids);
		$("#set_channelId").val(ids);
		$('#setChannel').dialog('open');
		
	}
}

/** -------- 启用禁用------ */
function startUse(id,flag){
	var re = {
		url :root+'/cityAirport/validityAirline',
		data : {
			validity:flag,
			ids:id
		},
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("airlinePreTable");
			}
			showMessage(data);
		}
	}
	sendAjaxRequest(re);
}
/** -------- 设置渠道------ */
function setChannel(){
	console.log("qi");
	var addflag = $("#setChannelForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("setChannelForm");
	var subchannel=$("#set_channel").combobox("getValues").join(",");
	if(subchannel.indexOf(",")==0){
		params["channel"] =subchannel.substring(1);
	}else{
		params["channel"] =subchannel;
	}
	console.log(params);
	var set = {
		url :root+'/cityAirport/modifyAirlineChannel',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("airlinePreTable");
			}
			showMessage(data);
			$('#set_channel').combobox('select', '');
			$('#setChannel').dialog('close');
		}
	}
	sendAjaxRequest(set);
}
/** -------- 添加 ------ */
function addAirLine(){
	var addflag = $("#airLineAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("airLineAddForm");
	var subchannel=$("#add_channel").combobox("getValues").join(",");
	if(subchannel.indexOf(",")==0){
		params["channel"] =subchannel.substring(1);
	}else{
		params["channel"] =subchannel;
	}
	console.log(params);
	var add = {
		url : root+'/cityAirport/addAirline',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("airlinePreTable");
			}
			$('#airLineAdd').dialog('close');
			showMessage(data);
			AirLineAddReset();
		}
	}
	sendAjaxRequest(add);
}
/** -------- 修改 ------ */
function editAirLine(){
	var addflag = $("#airLineEditForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("airLineEditForm");
	var subchannel=$("#edit_channel").combobox("getValues").join(",");
	if(subchannel.indexOf(",")==0){
		params["channel"] =subchannel.substring(1);
	}else{
		params["channel"] =subchannel;
	}
	console.log(params);
	var edit = {
			url : root+'/cityAirport/updateAirline',
			data : params,
			callBackFun : function(data) {
				if (data.isSuccessOrfail == "SUCCESS") {
					reloadTable("airlinePreTable");
				}
				$('#airLineEdit').dialog('close');
				showMessage(data);
			}
	}
	sendAjaxRequest(edit);
}
/** -------- 批量删除 ------ */
function deleteAirline() {
	var selecteds = $('#airlinePreTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#airlinePreTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#airlinePreTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].id);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root+'/cityAirport/deleteAirline';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("airlinePreTable");
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
function exportList() {
	var data = $('#airlinePreTable').datagrid('getData');
	var paper = $('#airlinePreTable').datagrid('getPager').pagination("options");
	var params = serializeJson("conditionForm");
	if(!params){
		return false;
	}
	
	var count = data.rows.length;
	if(count<=0){
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
		return false;
	}
	
	var total = paper.total;
	//alert(total);
	var exportSize = 65000;
	
	if(parseInt(total) > exportSize){
		var page = (parseInt(total) + exportSize - 1) / exportSize;
		$.messager.prompt('提示', '每页导出数据65000条，当前数据量超过65000条，请输入要导出的页数：', function(r){
			if (r){
				var re =  /^[1-9]+[0-9]*]*$/;
				
				if (!re.test(r) || parseInt(r)<=0 || parseInt(r)>=page) {
					$.messager.alert('错误提示', '请输入正确的页数', 'error');
					return false;
				}
				
				var end = r * exportSize;
				if(end > total){
					end = total;
				}
				params["start"] = (r - 1) * exportSize + 1;
				params["end"] = end;
				//return false;
				openWindowWithJson(root +'/cityAirport/ExportAirline',params);
			}
		});
	}else{
		params["start"] = 1;
		params["end"] = paper.total;
		//return false;
		openWindowWithJson(root +'/cityAirport/ExportAirline',params);
	}
}
/** -------- 重置查询条件 ------ */
function airlinePreReset() {
	$('#conditionForm').form('reset');
	$('#sourceid').val('sdal');
	$('#airway').combobox('select', 'NS');
	$('#forCity').combobox('setValue', '');
	initDatebox();
}
function AirLineAddReset() {
	$('#airLineAddForm').form('reset');
	$('#add_airway').combobox('select', 'NS');
	$('#add_forTicket').combobox('select', '1');
	$('#add_forFlight').combobox('select', '1');
	$('#add_isRetro').combobox('select', '1');
	$('#add_channel').combobox('setValues', ["mini"]);
	$('#add_status').combobox('select', '1');
	$('#add_shareCode').combobox('select', 'false');
}
function AirLineEditReset() {
	$('#airLineEditForm').form('reset');
}