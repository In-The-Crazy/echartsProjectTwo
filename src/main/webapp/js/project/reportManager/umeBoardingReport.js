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
	var today = new Date();
	var first = new Date();
	first.setDate(1);
	today = today.pattern("yyyy-MM-dd");
	first = first.pattern("yyyy-MM-dd");
	$('#startDate').datebox({
		label : '起始日期：',
		labelWidth : 100,
		labelAlign : "right",
		editable : false,
		required : false,
		value : first,
		width : 250,
	});
	$('#endDate').datebox({
		label : '截止日期：',
		labelWidth : 100,
		labelAlign : "right",
		editable : false,
		required : false,
		value : today,
		width : 250,
	});
	dateBoxValidator();
	$('#flightDate').datebox({
		label : '航班日期：',
		labelWidth : 100,
		labelAlign : "right",
		editable : false,
		required : false,
		width : 250,
	});
}

/** -------- 限制日期选择范围 ------ */
function dateBoxValidator() {
	$('#startDate').datebox().datebox('calendar').calendar({
		validator: function(date){
			var end = $('#endDate').datebox('getValue');
			var now = new Date();
			if(!isEmpty(end)){
				now = new Date(end);
			}
			var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			var temp = new Date(now.getTime()-31*24*60*60*1000);
			var d2 = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());
			return d2<=date && date<=d1;
		}
	});
	$('#endDate').datebox().datebox('calendar').calendar({
		validator: function(date){
			var now = new Date();
			var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			return date<=d1;
		}
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_info = {
		id : "picInfo",
		title : "验讫章"
	};

	// 添加窗口
	initDialog(dialog_info);
	$('#picInfo').dialog('close');
	
	$('#flightNo').textbox({
		label : '航班号：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#cnName').textbox({
		label : '姓名：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#mobile').textbox({
		label : '手机号：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#idCard').textbox({
		label : '证件号：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#eticketNo').textbox({
		label : '票号：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	// 验证时间
	var sdate = $('#startDate').datebox('getValue');
	var edate = $('#endDate').datebox('getValue');
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		sdate = sdate.replace(/-/g, '');
		edate = edate.replace(/-/g, '');
		if (parseInt(sdate) > parseInt(edate)) {
			$.messager.alert('错误提示', '起始日期不能大于截止日期', 'error');
			return false;
		}
	}
	
	var params = serializeJson("conditionForm");
//	return false;
	// 加载表格
	$('#umeBoardingReportTable').datagrid({
		url : root+'/report/queryUmeBoardPassList',
		toolbar : "#toolbar",
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		showHeader : true,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : true,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
		queryParams : params,
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
			$.messager.alert('错误提示', '数据加载失败!', 'error');
		},
		onLoadSuccess : function(data) {
			console.log(data);
		},
		columns : [ [ {
			field : 'channel',
			title : '渠道',
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
							if(channels[i].chalCode == valueArr[j]){
								channelArr.push(channels[i].chalName);
								continue;
							}
						}
						
					}
					return channelArr.join(",");
				}
				
			},
			width : 100
		}, {
			field : 'flightDate',
			title : '航班日期',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'flightNo',
			title : '航班号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'flightTime',
			title : '起飞时间',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'deptAirportName',
			title : '出发地',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'arriAirportName',
			title : '到达地',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'cnName',
			title : '姓名',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'mobile',
			title : '手机号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'idCard',
			title : '证件号',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'eticketNo',
			title : '票号',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'chapterUrl',
			title : '验讫章',
			align : 'center',
			formatter : optFormater,
			width : 75
		}] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	//渠道设置
	var channel={
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
				label : '渠道：',
				labelWidth : 100,
				labelAlign : "right",
				width : 250,
				data:treeList,
				valueField:'chalCode',
				textField:'chalName',
				editable : false,
				limitToList: true
			});
		}
	};
	sendAjaxRequest(channel);
	
	//出发城市名称
	var add_afrom = {
		url :root+'/cityAirport/queryAirCitiesTree',
		callBackFun : function(data) {
			$('#deptAirport').combobox({
				label: '出发城市：',
				labelWidth: 100,
				labelAlign: "right",
				width: 250,
				data : data.treeList,
				valueField:'id',
				textField:'text',
				limitToList: true
			});
		}
	}
	sendAjaxRequest(add_afrom);
	
	//到达城市名称
	var add_ato = {
		url : root+'/cityAirport/queryAirCitiesTree',
		callBackFun : function(data) {
			$('#arriAirport').combobox({
				label: '到达城市名称：',
				labelWidth: 100,
				labelAlign: "right",
				width: 250,
				data : data.treeList,
				valueField:'id',
				textField:'text',
				limitToList: true
			});
		}
	}
	sendAjaxRequest(add_ato);
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#umeBoardingReportTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function optFormater(value, row, index){
	var text = "--";
	if(!isEmpty(value)){
		$("#pic").attr("src", value);
		text = '<a href="javascript:void(0);" onclick="javascript:$(\'#picInfo\').dialog(\'open\');">查看</a>';
	}
	return text;
}

/** --------自定义单元格样式 ------ */

/** --------查看详情 ------ */
function getInfo(id, flag) {
}

/** -------- 导出 ------ */
function exportTotalSaleList() {
	var data = $('#umeBoardingReportTable').datagrid('getData');
	var paper = $('#umeBoardingReportTable').datagrid('getPager').pagination("options");
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
				openWindowWithJson(root +'/report/exportUmeBoardPassList',params);
			}
		});
	}else{
		params["start"] = 1;
		params["end"] = paper.total;
		//return false;
		openWindowWithJson(root +'/report/exportUmeBoardPassList',params);
	}
}

/** -------- 重置查询条件 ------ */
function queryReset() {
	$('#conditionForm').form('reset');
}
