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
		label: '起始日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
	$('#enddate').datebox({
		label: '截止日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
	$('#soutdatetime').datebox({
		label: '出票起始日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
	$('#eoutdatetime').datebox({
		label: '出票截止日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
	$('#sfdate').datebox({
		label: '起飞起始日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
	$('#efdate').datebox({
		label: '起飞截止日期：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
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
			var temp = new Date(now.getTime()-31*24*60*60*1000);
			var d2 = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());
			return d2<=date && date<=d1;
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
	$("#ordercode").textbox({
		label: '订单号：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
	$("#pnr").textbox({
		label: 'pnr：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
	$("#eticketno").textbox({
		label: '机票号：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
	$("#afrom").textbox({
		label: '出发地：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
	$("#ato").textbox({
		label: '到达地：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
	$("#paybillno").textbox({
		label: '银行订单号：',
		labelWidth: 100,
		labelAlign: "right",
		required: false,
		width: 250
	});
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
	// 加载表格
	$('#saleReportTable').datagrid({
		url : root+'/report/saleInfoReport',
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
		singleSelect : true,// 是否只能选中一条
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
			width : 25
		}, {
			field : 'channel',
			title : '渠道来源',
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
		},{
			field : 'ordercode',
			title : '订单号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		},{
			field : 'pnr',
			title : 'pnr',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'airways',
			title : '市场方',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'opcar_airline',
			title : '承运方',
			align : 'center',
			formatter : baseFormater,
			width : 75
		},{
			field : 'eticketno',
			title : '机票号',
			align : 'center',
			formatter : baseFormater,
			width : 120
		},{
			field : 'afrom',
			title : '出发地',
			align : 'center',
			formatter : baseFormater,
			width : 100
		},{
			field : 'ato',
			title : '到达地',
			align : 'center',
			formatter : baseFormater,
			width : 100
		},{
			field : 'paybillno',
			title : '银行订单号',
			align : 'center',
			formatter : baseFormater,
			width : 150
		},{
			field : 'paytype',
			title : '支付平台',
			align : 'center',
			formatter : function(value, row, index) {
				if (value == 'weixin') {
					return '微信';
				}else if (value == 'alipay') {
					return '支付宝';
				}else{
					return value;
				}
			},
			width : 100
		},{
			field : 'outdatetime',
			title : '出票日期',
			align : 'center',
			formatter : baseFormater,
			width : 150
		},{
			field : 'fdate',
			title : '起飞日期',
			align : 'center',
			formatter : baseFormater,
			width : 100
		},{
			field : 'price',
			title : '票面价',
			align : 'center',
			formatter : baseNumFormater,
			width : 100
		},{
			field : 'airport',
			title : '机建税',
			align : 'center',
			formatter : baseNumFormater,
			width : 100
		},{
			field : 'fuel',
			title : '燃油税',
			align : 'center',
			formatter : baseNumFormater,
			width : 100
		},{
			field : 'iatatax',
			title : '杂项税',
			align : 'center',
			formatter : baseNumFormater,
			width : 100
		},{
			field : 'taxprice',
			title : '国际票总税',
			align : 'center',
			formatter : baseNumFormater,
			width : 100
		},{
			field : 'insurance',
			title : '保险总额',
			align : 'center',
			formatter : baseNumFormater,
			width : 100
		},{
			field : 'refpmprice4',
			title : '总收入(不含保)',
			align : 'center',
			formatter : function(value, row, index){
				var airport = baseNumFormater(row.airport, row, index),
				fuel = baseNumFormater(row.fuel, row, index),
				price=baseNumFormater(row.price, row, index);
				return parseInt(airport)+parseInt(fuel)+parseInt(price);
			},
			width : 100
		},{
			field : 'refpmprice3',
			title : '总收入',
			align : 'center',
			formatter : function(value, row, index){
				var airport = baseNumFormater(row.airport, row, index),
				fuel = baseNumFormater(row.fuel, row, index),
				insurance= baseNumFormater(row.insurance, row, index),
				price=baseNumFormater(row.price, row, index);
				return parseInt(airport)+parseInt(fuel)+parseInt(price)+parseInt(insurance);
			},
			width : 100
		},{
			field : 'refAirport',
			title : '退机建税',
			align : 'center',
			formatter : function(value, row, index){
				var refundnum = baseNumFormater(row.refundnum, row, index);
				return parseInt(refundnum)*50;
			},
			width : 100
		},{
			field : 'refFuel',
			title : '退燃油税',
			align : 'center',
			formatter : function(value, row, index){
					return "0";
			},
			width : 100
		},{
			field : 'refpmprice',
			title : '退税总',
			align : 'center',
			formatter : function(value, row, index){
				var refAirport = baseNumFormater(row.refundnum, row, index),
				refFuel = baseNumFormater(row.refFuel, row, index);
				return parseInt(refAirport)*50+parseInt(refFuel);
			},
			width : 100
		},{
			field : 'refinsurance',
			title : '退保险总额',
			align : 'center',
			formatter : baseNumFormater,
			width : 100
		},{
			field : 'charge',
			title : '退票手续费',
			align : 'center',
			formatter : baseNumFormater,
			width : 100
		}, {
			field : 'refundmoney',
			title : '退款总金额',
			align : 'center',
			formatter : baseNumFormater,
			width : 100
		} ] ]
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
			$('#channel').combobox({
				label: '渠道编号：',
				labelWidth: 100,
				labelAlign: "right",
				width: 250,
				data:treeList,
				valueField:'chalCode',
				editable : false,
				textField:'chalName'
			});
		}
	};
	sendAjaxRequest(channel);
	
	$('#passerType').combobox({
		label : '乘机人类型：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		data : [{
			"id" : "",
			"text" : "全部",
			'selected':true
		},{
			'id':'0',
			'text':'成人'
		},{
			'id':'1',
			'text':'儿童'
		},{
			'id':'2',
			'text':'婴儿'
		}],
		valueField : 'id',
		textField:'text',
		editable : false
	});
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#saleReportTable').datagrid('resize');
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
	var data = $('#saleReportTable').datagrid('getData');
	var paper = $('#saleReportTable').datagrid('getPager').pagination("options");
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
				openWindowWithJson(root +'/report/exportSaleInfoReport',params);
			}
		});
	}else{
		params["start"] = 1;
		params["end"] = paper.total;
		//return false;
		openWindowWithJson(root +'/report/exportSaleInfoReport',params);
	}
}

/** -------- 重置查询条件 ------ */
function queryOrderReset() {
	$('#conditionForm').form('reset');
	initDatebox();
}
