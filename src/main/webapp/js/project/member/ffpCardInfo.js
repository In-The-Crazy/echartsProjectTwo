var cardTypes=[];
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
	$('#startdate').datebox({
		label : '起始日期：',
		labelWidth : 100,
		labelAlign : "right",
		editable : false,
		required : false,
		value : first,
		width : 250,
	});
	$('#enddate').datebox({
		label : '截止日期：',
		labelWidth : 100,
		labelAlign : "right",
		editable : false,
		required : false,
		value : today,
		width : 250,
	});
	dateBoxValidator();
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
	$("#ffpCardNo").textbox({
		label : '卡号：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
	})
	
	$("#receiveMode").combobox({
		label : '领取方式：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		data: [{
			"id" : "",
			"text" : "全部",
			"selected" : true
		},{
			"id" : "download",
			"text" : "本地"
		},{
			"id" : "wallet",
			"text" : "钱包"
		}],
		valueField:'id',
		editable : false,
		required : true,
		textField:'text'
	})
	$("#mobileType").combobox({
		label : '手机类型：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250,
		data: [{
			"id" : "",
			"text" : "全部",
			"selected" : true
		},{
			"id" : "iOS",
			"text" : "iOS"
		},{
			"id" : "Android",
			"text" : "Android"
		}],
		valueField:'id',
		editable : false,
		required : true,
		textField:'text'
	})
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
	$('#cardInfoTable').datagrid({
		url : root+'/member/ffpCardsInfo',
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
			field : 'ffpCardNo',
			title : '卡号',
			align : 'center',
			formatter : baseNumFormater,
			width : 150
		}, {
			field : 'ffpCardType',
			title : '卡别',
			align : 'center',
			formatter : function(value, row, index){
				var cardType="";
				for (var i = 0; i < cardTypes.length; i++) {
					if(cardTypes[i].dincCode == value){
						cardType = cardTypes[i].dincName;
					}
				}
				return cardType;
			},
			width : 150
		},{
			field : 'receiveMode',
			title : '领取方式',
			align : 'center',
			formatter : baseFormater,
			width : 150
		},{
			field : 'createTime',
			title : '领取时间',
			align : 'center',
			formatter : baseFormater,
			width : 150
		}] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	//卡别
	var cardType={
		url : root+'/common/querydictsByType',
		data : {'type':'CARDTYPE'},
		callBackFun : function(data) {
			cardTypes = data.rows;
			console.log("pindao");
			var treeList = rowsListAddAll(data.rows, {
				"checked" : true,
				"children" : null,
				"dincCode" : "",
				"dincName" : "全部"
			});
			$('#ffpCardType').combobox({
				label : '卡别：',
				labelWidth : 100,
				labelAlign : "right",
				width : 250,
				data:treeList,
				valueField:'dincCode',
				editable : false,
				textField:'dincName'
			});
		}
	};
	sendAjaxRequest(cardType);
	
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#cardInfoTable').datagrid('resize');
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
	
}

/** -------- 重置查询条件 ------ */
function queryOrderReset() {
	$('#conditionForm').form('reset');
	initDatebox();
}
