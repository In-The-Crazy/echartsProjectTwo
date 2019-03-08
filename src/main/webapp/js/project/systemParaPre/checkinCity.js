var channels=[];
/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面模块
	initPage();
	// 加载日历选择
	initDatebox();
	// 加载表格数据
	ajaxTable();
	// 加载树型
	ajaxTree();
});

/** --------加载日历选择 ------ */
function initDatebox() {
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_add = {
		id : "airCityAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "airCityEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#airCityAdd').dialog('close');
	// 添加窗口
	initDialog(dialog_edit);
	$('#airCityEdit').dialog('close');
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
	$('#airCityPreTable').datagrid({
		url : root+'/cityAirport/queryCheckInCityList',
		toolbar : "#toolbar",
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		showHeader : true,
		pageNumber : 1,
		pageSize : 20,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : true,// 是否显示行号
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
			field : 'cityId',
			checkbox : 'true',
			align : 'center',
			width : 25
		},{
			field : 'channel',
			title : '渠道编号',
			align : 'center',
			formatter : function(value, row, index){
				if(value==""){
					return "全渠道";
				}else{
					console.log(value);
					var valueArr=value.split(",");
					console.log(valueArr);
					var channelArr=[];
					for (var i = 0; i < channels.length; i++) {
						console.log(channels);
						for(var j=0;j<valueArr.length;j++){
							if(channels[i].chalId == valueArr[j]){
								channelArr.push(channels[i].chalName);
								continue;
							}
						}
						
					}
					return channelArr.join(",");
				}
				
			},
			width : 75
		},{
			field : 'cityName',
			title : '城市名称',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'cityCode',
			title : '城市三字码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'openHour',
			title : '开放时间',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		}, {
			field : 'umeFlag',
			title : '二维码通关',
			align : 'center',
			formatter : function (value, row, index){
				var text = "--";
				if(value == "0"){
					text = "关闭";
				}
				if(value == "1"){
					text = "开启";
				}
				return text;
			},
			width : 75
		},{
			field : 'cityStatus',
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
	var flag=row.cityStatus;
	var _id="'"+row.cityId+"'";
	var start;
	if(flag=="1"){
		start='<a href="javascript:void(0)" onclick="startUse(' + _id + ',9)">禁用</a>'
	}else{
		start='<a href="javascript:void(0)" onclick="startUse(' + _id + ',1)">启用</a>'
	}
	return start;
};
/** -------- 启用禁用------ */
function startUse(id,flag){
	console.log("qi");
	console.log(id);
	var re = {
		url :root+'/cityAirport/updateCheckInCity',
		data : {
			cityStatus:flag,
			cityId:id
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
/** --------加载树形 ------ */
function ajaxTree() {
	//机场城市
	var city = {
		url :root+'/cityAirport/queryAirCitiesTree',
		callBackFun : function(data) {
			console.log("机场城市");
			console.log(data);
			$('#add_name,#edit_name').combobox({
				data : data.treeList,
				valueField:'id',
				textField:'text',
				required : true,
				width : 155
			});
		}
	}
	sendAjaxRequest(city);
	//渠道设置
	var channel={
		url : root+'/common/channels',
		callBackFun : function(data) {
			channels = data.rows;
			console.log("pindao");
			var treeList = rowsListAddAll(data.rows, {
				"checked" : true,
				"children" : null,
				"chalId" : "",
				"chalName" : "全部"
			});
			//渠道设置
			$('#add_channel,#edit_channel').combobox({
				data:data.rows,
				valueField:'chalId',
				required : true,
				editable : false,
				multiple:true,
				textField:'chalName',
				width : 155
			});
			$('#channel').combobox({
				data:treeList,
				valueField:'chalId',
				editable : false,
				textField:'chalName'
			});
		}
	};
	sendAjaxRequest(channel);
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

/** --------查看会员详情 ------ */
function getInfo() {
	var selecteds = $('#airCityPreTable').datagrid('getSelections');
	if(selecteds.length!=1){
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	var selected = $('#airCityPreTable').datagrid('getSelected');
	$("#airCityEditForm").form("load", selected);
	$('#airCityEdit').dialog('open');
}

/** -------- 添加 ------ */
function addAirCity(){
	var addflag = $("#airCityAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("airCityAddForm");
	params["cityName"] = $("#add_name").textbox("getText");
	var subchannel=$("#add_channel").combobox("getValues").join(",");
	if(subchannel.indexOf(",")==0){
		params["channel"] = subchannel.substring(1);
	}else{
		params["channel"] = subchannel;
	}
	var add = {
		url :root+'/cityAirport/addCheckInCity',
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

/** -------- 修改 ------ */
function editAirCity(){
	var editflag = $("#airCityEditForm").form('validate');
	if(!editflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("airCityEditForm");
	params["cityName"] = $("#edit_name").textbox("getText");
	var supchannel=$("#edit_channel").combobox("getValues").join(",");
	if(supchannel.indexOf(",")==0){
		params["channel"] =supchannel.substring(1);
	}else{
		params["channel"] =supchannel;
	}
	var edit = {
			url :root+'/cityAirport/updateCheckInCity',
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
			ids.push(selectedRow[i].cityId);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url =root+'/cityAirport/delCheckInCity';
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

/** -------- 重置查询条件 ------ */
function airCityPreReset() {
	$('#conditionForm').form('reset');
}
function AirCityAddReset() {
	$('#airCityAddForm').form('reset');
}