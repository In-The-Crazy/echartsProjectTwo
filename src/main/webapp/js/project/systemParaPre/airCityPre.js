var channels=[];
var timeZones=[];
/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面模块
	initPage();
	// 加载树型
	ajaxTree();
	// 加载日历选择
	initDatebox();
	// 加载表格数据
	ajaxTable();
	
});

/** --------加载日历选择 ------ */
function initDatebox() {
}

/** --------初始化页面模块 ------ */
function initPage() {
	$('#add_tname,#edit_tname').textbox({
		label: '机场城市名称：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$('#add_cityName,#edit_cityName').textbox({
		label: '机场名称：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$('#add_tval,#edit_tval').textbox({
		label: '机场城市三字码：',
		labelWidth: 100,
		labelAlign: "right",
		required: true,
		width: 250
	});
	$('#add_tcode,#edit_tcode').textbox({
		label: '机场城市四字码：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
	$('#add_qh,#edit_qh').textbox({
		label: '机场城市区号：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
	
	
	var dialog_add = {
		id : "airCityAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "airCityEdit",
		title : "修改"
	};
	var dialog_set = {
		id : "setChannel",
		title : "设置渠道"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#airCityAdd').dialog('close');
	// 添加窗口
	initDialog(dialog_edit);
	$('#airCityEdit').dialog('close');
	// 添加窗口
	initDialog(dialog_set);
	$('#setChannel').dialog('close');
	
	$("#add_tval,#tval,#add_tcode,#edit_tval,#edit_tcode").textbox({
		onChange: function (n,o) {
			var old= $(this).textbox('getValue');	
			var newval=old.toLocaleUpperCase();
			$(this).textbox('setValue',newval);
		}
	})
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
	console.log(params);
	// 加载表格
	$('#airCityPreTable').datagrid({
		url : root+'/cityAirport/airCityPreList',
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
			width : 25
		}, {
			field : 'id',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'tname',
			title : '机场城市名称',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'tval',
			title : '机场城市三字码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'tcode',
			title : '机场城市四字码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'qp',
			title : '机场城市全拼',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'jp',
			title : '机场城市简拼',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'sfName',
			title : '机场城市省份',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'qh',
			title : '机场城市区号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'airPortName',
			title : '机场名称',
			align : 'center',
			formatter : baseFormater,
			width : 75
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
			field : 'fancity',
			title : '热门城市',
			align : 'center',
			formatter : function(value, row, index){
				var text = baseFormater(value, row, index);
				if(value=="1"){
					text = '是';
				}
				if(value=="0"){
					text = '否';
				}
				return text;
			},
			width : 50
		}, {
			field : 'isInter',
			title : '国内/际城市',
			align : 'center',
			formatter : function(value, row, index){
				var text = baseFormater(value, row, index);
				if(value == "0"){
					text = '国内';
				}
				if(value == "1"){
					text = '国际';
				}
				if(value == "2"){
					text = '国内(际)';
				}
				return text;
			},
			width : 50
		},{
			field : 'timeZone',
			title : '时区',
			align : 'center',
			formatter : function(value, row, index){
				var timeZoneArr="--";
				for (var i = 0; i < timeZones.length; i++) {
					if(timeZones[i].dincCode == value){
						timeZoneArr = timeZones[i].dincName;
						break;
					}
				}
				return timeZoneArr;
			},
			width : 75
		},{
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
			width : 50
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
			width : 50
		}, {
			field : 'status',
			title : '操作',
			align : 'center',
			formatter : optFormater,
			width : 50
		}  ] ]
	});
}
/**
 * 设置启用禁用列的信息 row 当前行的数据 index 当前行的索引 从0 开始
 */
function optFormater(value, row, index) {
	var flag=row.status;
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
/** --------加载树形 ------ */
function ajaxTree() {
	//添加省份
	var add = {
		url :root+'/cityAirport/queryProvinceTree',
		callBackFun : function(data) {
			$('#add_sf,#edit_sf').combobox({
				label: '机场城市省份：',
				labelWidth: 100,
				labelAlign: "right",
				width: 250,
				data : data.treeList,
				editable : false,
				required : true,
				valueField:'id',
				textField:'text'
			});
		}
	}
	sendAjaxRequest(add);
	
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
			$('#add_channel,#edit_channel,#set_channel').combobox({
				label: '渠道编号(多选)：',
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
			$('#channel').combobox({
				data:treeList,
				valueField:'chalCode',
				editable : false,
				textField:'chalName'
			});
		}
	};
	sendAjaxRequest(channel);
	
	//是否热门城市
	$('#add_hot,#edit_hot').combobox({
		label: '是否热门城市：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		data: [{
			"id" : "0",
			"text" : "否"
		},{
			"id" : "1",
			"text" : "是"
		}],
		valueField:'id',
		editable : false,
		required : true,
		textField:'text'
	});
	
	//国内/际航班
	$('#add_isinter,#edit_isinter').combobox({
		label: '国内/际城市：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		data: [{
			"id" : "0",
			"text" : "国内"
		},{
			"id" : "1",
			"text" : "国际"
		},{
			"id" : "2",
			"text" : "国内/际"
		}],
		valueField:'id',
		editable : false,
		required : true,
		textField:'text'
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
		editable : false,
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
		editable : false,
		textField:'text'
	});
	
	//禁用
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
	
	//时区
	var timeZone = {
		url : root+'/common/querydictsByType',
		data : {'type':'TIMEZONE'},
		callBackFun : function(data) {
			timeZones = data.rows;
			//权限名称设置
			$('#add_timeZone,#edit_timeZone').combobox({
				label: '时区：',
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
	sendAjaxRequest(timeZone)
	
	$('#add_hot').combobox('select', '1');
	$('#add_isinter').combobox('select', '0');
	$('#add_forTicket').combobox('select', '1');
	$('#add_forFlight').combobox('select', '1');
	$('#add_isRetro').combobox('select', '1');
	$('#add_channel').combobox('setValues', ["mini"]);
	$('#add_status').combobox('select', '1');
	$('#add_timeZone').combobox('setValues', ["GMT +8"]);
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#airCityPreTable').datagrid('resize');
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
		var selecteds = $('#airCityPreTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#airCityPreTable').datagrid('getSelected');
		$('#airCityEditForm').form('load',selected);
		$("#edit_id").val(selected.id);
		$('#edit_cityName').textbox('setValue',selected.airPortName);
		$("#edit_isinter").combobox('setValues',selected.isInter);
		$("#edit_status").combobox('setValues',selected.status);
		$('#airCityEdit').dialog('open');
	}else{
		var selecteds = $('#airCityPreTable').datagrid('getSelections');
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
		}  
		console.log(ids);
		$("#set_channelId").val(ids);
		$('#setChannel').dialog('open');
		
	}
}

/** -------- 启用禁用------ */
function startUse(id,flag){
	var re = {
		url :root+'/cityAirport/validityAirCity',
		data : {
			status:flag,
			ids:id
		},
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("airCityPreTable");
			}
			showMessage(data);
		}
	}
	sendAjaxRequest(re);
}
/** -------- 设置渠道------ */
function setChannel(){
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
		url :root+'/cityAirport/modifyAirCityChannel',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("airCityPreTable");
			}
			showMessage(data);
			$('#setChannel').dialog('close');
		}
	}
	sendAjaxRequest(set);
}
/** -------- 添加 ------ */
function addAirCity(){
	var addflag = $("#airCityAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("airCityAddForm");
	var subchannel=$("#add_channel").combobox("getValues").join(",");
	if(subchannel.indexOf(",")==0){
		params["channel"] =subchannel.substring(1);
	}else{
		params["channel"] =subchannel;
	}
	var add = {
		url : root+'/cityAirport/addAirCityInfo',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("airCityPreTable");
			}
			$('#airCityAdd').dialog('close');
			showMessage(data);
			AirCityAddReset();
		}
	}
	sendAjaxRequest(add);
}
/** -------- 修改------ */
function editAirCity(){
	var editflag = $("#airCityEditForm").form('validate');
	if(!editflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("airCityEditForm");
	
	var subchannel=$("#edit_channel").combobox("getValues").join(",");
	if(subchannel.indexOf(",")==0){
		params["channel"] =subchannel.substring(1);
	}else{
		params["channel"] =subchannel;
	}
	var edit = {
		url : root+'/cityAirport/updateAirCity',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("airCityPreTable");
			}
			$('#airCityEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(edit);
}

/** -------- 批量删除 ------ */
function delairCity() {
	var selecteds = $('#airCityPreTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#airCityPreTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#airCityPreTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].id);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root+'/cityAirport/deleteAirCityInfo';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("airCityPreTable");
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
	var data = $('#airCityPreTable').datagrid('getData');
	var paper = $('#airCityPreTable').datagrid('getPager').pagination("options");
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
				openWindowWithJson(root +'/cityAirport/ExportAirCity',params);
			}
		});
	}else{
		params["start"] = 1;
		params["end"] = paper.total;
		//return false;
		openWindowWithJson(root +'/cityAirport/ExportAirCity',params);
	}
}
/** -------- 重置查询条件 ------ */
function airCityPreReset() {
	$('#conditionForm').form('reset');
}

function AirCityAddReset() {
	$('#airCityAddForm').form('reset');
	$('#add_hot').combobox('select', '1');
	$('#add_isinter').combobox('select', '0');
	$('#add_forTicket').combobox('select', '1');
	$('#add_forFlight').combobox('select', '1');
	$('#add_isRetro').combobox('select', '1');
	$('#add_channel').combobox('setValues', ["mini"]);
	$('#add_timeZone').combobox('setValues', ["GMT +8"]);
	$('#add_status').combobox('select', '1');
}