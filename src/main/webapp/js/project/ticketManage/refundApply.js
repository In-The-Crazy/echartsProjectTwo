/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面模块
	initPage();
	// 加载日历选择
	initDatebox();
	// 加载树型
	ajaxTree();
	// 加载表格数据
	ajaxTable(false);
	if("${emp.obj.opAccoun ne 'admin'}"=="false"){
		$('#force').hide();
	}
});

/** --------加载日历选择 ------ */
function initDatebox() {
	$('#fdate').datebox({
		label : '起飞日期：',
		labelWidth : 100,
		labelAlign : "right",
		editable : false,
		required : false,
		width : 250,
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	$('#name').textbox({
		label : '旅客姓名：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#idnumber').textbox({
		label : '证件号码：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#afrom').textbox({
		label : '起飞城市：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#ato').textbox({
		label : '降落城市：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#ordercode').textbox({
		label : '订单号：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#eticketno').textbox({
		label : '机票号：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#refundNo').textbox({
		label : '退票单号：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	// 国内/国际
	$('#isInter').combobox({
		label : '国内/国际：',
		labelWidth : 100,
		labelAlign : "right",
		data : [{
			"id" : "",
			"text" : "全部"
		},{
			"id" : "0",
			"text" : "国内"
		},{
			"id" : "1",
			"text" : "国际"
		}],
		valueField : 'id',
		textField:'text',
		editable : false,
		width : 250
	});
	//是否为积分票
	$('#isintegral').combobox({
		label : '订单类型：',
		labelWidth : 100,
		labelAlign : "right",
		data : [{
			"id" : "",
			"text" : "全部"
		},{
			'id':'0',
			'text':'现金订单'
		},{
			'id':'1',
			'text':'积分订单'
		}],
		valueField : 'id',
		textField:'text',
		editable : false,
		width : 250
	});
	$('#airways').textbox({
		label : '市场方：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	$('#airline').textbox({
		label : '承运方：',
		labelWidth : 100,
		labelAlign : "right",
		width : 250
	});
	
	var dialog_info = {
		id : "passengerInfo",
		title : "旅客信息详情"
	};

	// 查看窗口
	initDialog(dialog_info);
	$('#passengerInfo').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable(flag) {
	var sdate = $('#fdate').datebox('getValue');
	var fromCity = $("#afrom").val();
	var toCity = $("#ato").val();

	var reg = /^[a-zA-Z]{3}$/;
	if ((!isEmpty(fromCity) && !reg.test(fromCity))
			|| (!isEmpty(toCity) && !reg.test(toCity))) {
		$.messager.alert('警告提示', '请填写正确的城市三字码！', 'warning');
		return false;
	}
	if (!isEmpty(fromCity) && isEmpty(toCity)) {
		$.messager.alert('警告提示', '请先填写降落城市！', 'warning');
		return false;
	}
	if (isEmpty(fromCity) && !isEmpty(toCity)) {
		$.messager.alert('警告提示', '请先填写起飞城市！', 'warning');
		return false;
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#refundTable').datagrid({
		url : root + '/refund/queryTicketInfo',
		toolbar : '#toolbar',
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		pageNumber : 1,
		pageSize : 20,
		fitColumns : false,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : false,// 是否只能选中一条
		queryParams : params,
		loadMsg : '数据加载中,请稍后...',
		onBeforeLoad : function() {
			return !flag;// 初始化不加载数据
		},
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
			field : 'ticketid',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'pname',
			title : '乘机人',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'pnr',
			title : 'PNR',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'airways',
			title : '市场方',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'airline',
			title : '承运方',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'eticketno',
			title : '机票号',
			align : 'center',
			formatter : ticketFormater,
			width : 200
		}, {
			field : 'ordercode',
			title : '订单编号',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'flightNo',
			title : '航班号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'flightSegment',
			title : '航段',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'productname',
			title : '产品名称',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'flyDate',
			title : '航班日期',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'flyTime',
			title : '起飞时间',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'arriveTime',
			title : '到达时间',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'cabin',
			title : '舱位',
			align : 'center',
			formatter : baseFormater,
			width : 50
		}, {
			field : 'fare',
			title : '票面价',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		}, {
			field : 'airportTax',
			title : '机建',
			align : 'center',
			formatter : baseNumFormater,
			width : 50
		}, {
			field : 'fuelTax',
			title : '燃油',
			align : 'center',
			formatter : baseNumFormater,
			width : 50
		}, {
			field : 'unexpInsr',
			title : '航意险',
			align : 'center',
			formatter : baseNumFormater,
			width : 50
		}, {
			field : 'delayInsr',
			title : '航延险',
			align : 'center',
			formatter : baseNumFormater,
			width : 50
		}, {
			field : 'allpjrfare',
			title : '票面总款',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		}, {
			field : 'integralFare',
			title : '积分价',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		}, {
			field : 'fmoney',
			title : '优惠金额',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		}, {
			field : 'sjfare',
			title : '实际票款',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		}, {
			field : 'ticStatus',
			title : '客票状态',
			align : 'center',
			formatter : statusFormater,
			width : 75
		}, {
			field : 'refundNo',
			title : '退票单号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'cstatus',
			title : '退改状态',
			align : 'center',
			formatter : cstatusFormater,
			width : 100
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
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
	$('#refundTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function passengerFormater(value, row, index) {
	var _id = "'" + row.ticketid + "'";
	var _name = "'" + row.name + "'";
	var _gmobile = "'" + row.gmobile + "'";
	var _idtype = "'" + idtypeFormatter(row.idtype, row, index) + "'";
	var _idnumber = "'" + row.idnumber + "'";
	var detail = '<a href="javascript:void(0);" onclick="getPassengerInfo(' + _id + ',' + _name + ','
		+ _gmobile + ',' + _idtype + ',' + _idnumber + ')">'
		+ row.name + '</a>';
	return detail;
};
function ticketFormater(value, row, index) {
	var _id = "'" + row.ticketid + "'";
	var _chgroledesc = "'" + row.chgroledesc + "'";
	var ticket = row.eticketno;
	if (ticket == null || ticket == "" || ticket == "null") {
		ticket = "--";
	}
	var detail = '<a href="javascript:void(0);" onclick="getTicketInfo(' + _id + ',' + _chgroledesc + ')">' + ticket + '</a>';
	return detail;
};

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
function getPassengerInfo(id, name, gmobile, idtype, idnumber) {
	$("#info_name").html(name);
	$("#info_mobile").html(gmobile);
	$("#info_idtype").html(idtype);
	$("#info_idnum").html(idnumber);
	$('#passengerInfo').dialog('open');
}
function getTicketInfo(id, chgroledesc) {
	$.messager.alert('机票退改签规定', chgroledesc, 'info');
}

/**
 * 批量提交退票
 * 
 * @return
 */
function applyRefundByhand() {
	var selecteds = $('#refundTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#refundTable').datagrid('getSelected')) {
		var ids = [];
		var userids = [];
		var selectedRow = $('#refundTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].ticketid);
			userids.push(selectedRow[i].userid);
		}
		var dpid = ids.join(',');
		var userid = userids.join(',');
		$.messager.confirm('提交退票提示', '是否确认提交退票? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root + '/refund/applyRefundByhand';
				var options = {
					url : url,
					data : {
						"ticketIds" : dpid,
						"userid": userid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("refundTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}
function applyRefundByforce() {
	var selecteds = $('#refundTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#refundTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#refundTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].ticketid);
		}
		var dpid = ids.join(',');
		$.messager.confirm('提交退票提示', '是否确认提交退票? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root + '/refund/applyRefundByforce';
				var options = {
					url : url,
					data : {
						"ticketIds" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("refundTable");
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
function refundReset() {
	$("#conditionForm").form("clear");
	$("#sourceid").val("sdal");
}
