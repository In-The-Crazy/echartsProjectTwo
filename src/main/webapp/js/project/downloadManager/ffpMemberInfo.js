/** ----------------加载整体表格-------------------------* */
$(function() {
	// 初始化页面模块
	initPage();
	// 加载日历选择
	initForm();
	// 加载表格数据
	ajaxTable();
	// 加载树型
	ajaxTree();
});

/** --------加载日历选择 ------ */
function initForm() {
	$('#beginDate').datebox({
		editable : false,
		required : false,
		validType : "startDate['#endDate']",
		onChange : function(newValue, oldValue){
			if(isEmpty($('#endDate').datebox("getValue"))){
				$('#endDate').datebox("setValue",newValue);
			}
			$("#conditionForm").form('validate');
		}
	});
	$('#endDate').datebox({
		editable : false,
		required : false,
		validType : "endDate['#beginDate']",
		onChange : function(newValue, oldValue){
			if(isEmpty($('#beginDate').datebox("getValue"))){
				$('#beginDate').datebox("setValue",newValue);
			}
			$("#conditionForm").form('validate');
		}
	});
}

/** --------初始化页面模块 ------ */
function initPage() {
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
	$('#ffpMemberTable').datagrid({
		url : 'queryFfpMemLoginList.action',
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
		singleSelect : true,// 是否只能选中一条
		queryParams : params,
		loadMsg : '数据加载中,请稍后...',
		onLoadError : function() {
			$.messager.alert('错误提示', '数据加载失败!', 'error');
		},
		onLoadSuccess : function(data) {
		},
		onBeforeLoad : function(){
		},
		onSelect : function(rowIndex, rowData){
			$('#userid').val(rowData.userid);
		},
		columns : [ [ {
			field : 'id',
			checkbox : 'true',
			hidden : true,
			align : 'center',
			width : 25
		}, {
			field : 'cnlastName',
			title : '中文姓',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'cnfirstName',
			title : '中文名',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'lastName',
			title : '英文姓',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'firstName',
			title : '英文名',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'pidType',
			title : '证件类型',
			align : 'center',
			formatter : function(value, row, index){
				var text = "未知";
				if(value == "1"){
					text = "居民身份证";
				}
				if(value == "4"){
					text = "有效护照";
				}
				if(value == "5"){
					text = "其他";
				}
				return text;
			},
			width : 75
		}, {
			field : 'pidNumber',
			title : '证件号码',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'mobile',
			title : '手机号码',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'success',
			title : '是否成功',
			align : 'center',
			formatter : function(value, row, index){
				var text = "--";
				if(value == "0"){
					text = "是";
				}else{
					text = "否";
				}
				return text;
			},
			width : 50
		}, {
			field : 'createDate',
			title : '注册日期',
			align : 'center',
			formatter : dateTimeFormater,
			width : 150
		} ] ],
		view: detailview,
		detailFormatter:function(index,row){
			return '<div class="ddv" style="padding:5px 0"></div>';
		},
		onExpandRow: function(index,row){
			var ddv = $(this).datagrid('getRowDetail',index).find('div.ddv');
			ddv.html("<span style='color:#15428B;font-weight:bold;'></span>原因说明："+row.message);
			ddv.panel({
				border : false,
 				cache : false,
				onLoad:function(){
					$('#ffpMemberTable').datagrid('fixDetailRowHeight',index);
				}
			});
			$('#ffpMemberTable').datagrid('fixDetailRowHeight',index);
		}
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#ffpMemberTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function realNameFormater(value, row, index) {
	var _id = "'" + row.userid + "'";
	if(isEmpty(value)){
		return '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"info")>--</a>';
	}
	return '<a href="javascript:void(0);" onclick=getInfo(' + _id + ',"info")>' + value + '</a>';
};
function mobileCheckFormater(value, row, index) {
	var result = baseFormater(value, row, index);
	if(row.mobileCheck != '2'){
		result = '--';
	}
	return result;
};

/** --------自定义单元格样式 ------ */

/** -------- 重置查询条件 ------ */
function queryOrderReset() {
	$('#conditionForm').form('clear');
}
