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
	$('#startdate').datebox({
		required : false
	});
	$('#enddate').datebox({
		required : false
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_add = {
		id : "addChannel",
		title : "渠道推广"
	};
	var dialog_create = {
		id : "createQrcode",
		title : "生成二维码"
	};
	var dialog_show = {
		id : "showQrcode",
		title : "二维码图片"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#addChannel').dialog('close');
	// 生成二维码
	initDialog(dialog_create);
	$('#createQrcode').dialog('close');
	// 展示二维码
	initDialog(dialog_show);
	$('#showQrcode').dialog('close');
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
	$('#channelPromotionTable').datagrid({
		url : 'channelPromotionList.action',
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
		},
		columns : [ [ {
			field : 'rownumbers',
			title : '',
			align : 'center',
			styler : rownumSytler,
			formatter : rownumFormater,
			width : 8
		}, {
			field : 'id',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'meida',
			title : '渠道名称',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'code',
			title : '渠道代码',
			align : 'center',
			formatter : function(value, row, index){
				return row.id;
			},
			width : 75
		}, {
			field : 'ipa',
			title : '苹果下载',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		}, {
			field : 'apk',
			title : '安卓下载',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		}, {
			field : 'total',
			title : '总下载',
			align : 'center',
			formatter : baseNumFormater,
			width : 75
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#channelPromotionTable').datagrid('resize');
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

function openQrcode(){
	var selecteds = $('#channelPromotionTable').datagrid('getSelections');
	if(selecteds.length!=1){
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	$('#createQrcode').dialog('open');
}

/** -------- 二维码 ------ */
function createQrcode(){
	var selecteds = $('#channelPromotionTable').datagrid('getSelections');
	if(selecteds.length!=1){
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	var selectedRow = $('#channelPromotionTable').datagrid('getSelections');
	$('#id').val(selectedRow[0].id);
	var params = serializeJson("createQrcodeForm");
	var add = {
		url : 'createQRCodeForMedia.action',
		data : params,
		callBackFun : function(data) {
			$('#showQrcodeImg').attr('src','../../images/upload/media/'+data.message);
			$('#createQrcode').dialog('close');
			$('#showQrcode').dialog('open');
		}
	}
	sendAjaxRequest(add);
}

/** -------- 添加 ------ */
function addChannel(){
	var addflag = $("#addChannelForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("addChannelForm");
	var add = {
		url : 'addDownAddr.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("channelPromotionTable");
			}
			$('#addChannel').dialog('close');
			showMessage(data);
			addChannelReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 批量删除 ------ */
function delChannel() {
	var selecteds = $('#channelPromotionTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#channelPromotionTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#channelPromotionTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].id);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = 'deleteDownAddr.action';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("channelPromotionTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}

function exportChannel(){
	
	var data = $('#channelPromotionTable').datagrid('getData');
	
	var sdate = $('#startdate').datebox('getValue');
	var edate = $('#enddate').datebox('getValue');
	var media = $('#media').val();
	
	var keys = ['start','end','startdate',"enddate",'media'];
	var values = ['0','60000',sdate,edate,media];
	var count = data.rows.length;
	if(count>0){
		openWindowWithPost('exportPromotionList.action',keys,values);
	}else{
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
	}
}

/** -------- 重置查询条件 ------ */
function channelPromotionReset() {
	$("#conditionForm").form("clear");
	$('#sourceid').val('sdal');
	initDatebox();
}

function addChannelReset() {
	$("#addChannelForm").form("clear");
	$('#url').val('http://m.shandongair.com/');
}
