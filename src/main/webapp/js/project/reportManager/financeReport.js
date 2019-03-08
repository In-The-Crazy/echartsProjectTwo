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
	$('#startdate').datebox({
		required : false
	});
	$('#enddate').datebox({
		required : false
	});
	dateBoxValidator();
	var today = new Date();
	var first = new Date();
	first.setDate(1);
	today = today.pattern("yyyy-MM-dd");
	first = first.pattern("yyyy-MM-dd");
	$('#startdate').datebox('setValue',first);
	$('#enddate').datebox('setValue',today);
}

/** -------- 限制日期选择范围 ------ */
function dateBoxValidator() {
	$('#startdate').datebox().datebox('calendar').calendar({
		validator: function(date){
			var end = $('#enddate').datebox('getValue');
			var now = new Date();
			if(!isEmpty(end)){
				now = new Date(end);
			}
			var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//			var temp = new Date(now.getTime()-31*24*60*60*1000);
//			var d2 = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());
//			return d2<=date && date<=d1;
			return date<=d1;
		}
	});
	$('#enddate').datebox().datebox('calendar').calendar({
		validator: function(date){
			var now = new Date();
			var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			return date<=d1;
		}
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	// 验证时间
	var sdate = $('#startdate').datebox('getValue');
	var edate = $('#enddate').datebox('getValue');
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		sdate = sdate.replace(/-/g, '');
		edate = edate.replace(/-/g, '');
		if (parseInt(sdate) > parseInt(edate)) {
			$.messager.alert('错误提示', '起始日期不能大于截止日期', 'error');
			return false;
		}
	}
	
	var params = serializeJson("conditionForm");
	console.log(params);
//	return false;
	// 加载表格
	$('#refundReportTable').datagrid({
		url : root+'/report/reconciliations',
		toolbar : "#toolbar",
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		showHeader : true,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
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
			field : 'rownumbers',
			title : '',
			align : 'center',
			styler : rownumSytler,
			formatter : rownumFormater,
			width : 25
		}, {
			field : 'ordercode',
			title : '订单号',
			align : 'center',
			formatter : baseFormater,
			width : 150
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
							if(channels[i].chalCode == valueArr[j]){
								channelArr.push(channels[i].chalName);
								continue;
							}
						}
						
					}
					return channelArr.join(",");
				}
				
			},
			width : 150
		}, {
			field : 'paytype',
			title : '支付平台',
			align : 'center',
			formatter : function(value, row, index){
				var text = "--";
				if(value == "weixin"){
					text = "微信";
				}
				if(value == "alipay"){
					text = "支付宝";
				}
				return text;
			},
			width : 100
		}, {
			field : 'paymoney',
			title : '支付金额',
			align : 'center',
			formatter : baseFormater,
			width : 100
		},{
			field : 'paymoney2',
			title : '订单金额',
			align : 'center',
			formatter : function(value, row, index){
				var paymoney=baseFormater(row.paymoney,row,index);
					return paymoney;
				
			},
			width : 100
		},{
			field : 'match',
			title : '核对结果',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'paydate',
			title : '支付日期',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}, {
			field : 'paybillno',
			title : '银行订单号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		},{
			field : 'ishasrefund',
			title : '有无退款',
			align : 'center',
			formatter : baseFormater,
			width : 150
		},{
			field : 'refund_money',
			title : '退款金额',
			align : 'center',
			formatter : baseFormater,
			width : 150
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
				console.log("pindao");
				var treeList = rowsListAddAll(data.rows, {
					"checked" : true,
					"children" : null,
					"chalCode" : "",
					"chalName" : "请选择"
				});
				//渠道设置
//				$('#add_channel,#set_channel').combobox({
//					data:data.rows,
//					valueField:'chalCode',
//					required : true,
//					editable : false,
//					multiple:true,
//					textField:'chalName'
//				});
				$('#channel').combobox({
					data:treeList,
					valueField:'chalCode',
					editable : false,
					textField:'chalName'
				});
			}
		};
		sendAjaxRequest(channel);
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#refundReportTable').datagrid('resize');
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
function getInfo(id, flag) {
}

/** -------- 导出 ------ */
function exportTotalSaleList() {
	var data = $('#refundReportTable').datagrid('getData');
	var paper = $('#refundReportTable').datagrid('getPager').pagination("options");
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
				openWindowWithJson(root +'/report/exportReconciliations',params);
			}
		});
	}else{
		params["start"] = 1;
		params["end"] = paper.total;
		//return false;
		openWindowWithJson(root +'/report/exportReconciliations',params);
	}
}

/** -------- 重置查询条件 ------ */
function queryOrderReset() {
	$('#conditionForm').form('reset');
	initDatebox();
	
}
