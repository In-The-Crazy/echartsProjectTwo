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
	var today = new Date().pattern("yyyy-MM-dd");
	$('#startdate').datebox('setValue',today);

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
	console.log(params);
	//	return false;
	// 加载表格
	$('#cancheTable').datagrid({
		url : root+'/common/queryRedisRoute',
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
		columns : [ [ 
		{
			field : 'id',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'fome',
			title : '出发城市三字码',
			align : 'center',
			formatter : function (value, row, index){
				var text = "--";
				if(row){
					text = row.split("-")[1];
				}
				return text;
			},
			width : 100
		}, {
			field : 'to',
			title : '到达城市三字码',
			align : 'center',
			formatter : function (value, row, index){
				var text = "--";
				if(row){
					text = row.split("-")[2];
				}
				return text;
			},
			width : 50
		},
		{
			field : 'fdate',
			title : '航班日期',
			align : 'center',
			formatter : function (value, row, index){
				var text = "--";
				if(row){
					text = row.split("-")[3];
					text = dateFormater(text, row, index);
				}
				return text;
			},
			width : 200
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#mailPreTable').datagrid('resize');
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


/** -------- 清除多条------ */
function clearRows(flag){
	var selecteds = $('#cancheTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#cancheTable').datagrid('getSelected')) {
		var clearRows = [];
		var selectedRow = $('#cancheTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			clearRows.push(selectedRow[i]);
		}
		clearRows = clearRows.join(',');
		console.log(clearRows);
//		return false;
//		
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var re = {
					url :root+'/common/clearRoute',
					data : {
						key:clearRows
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("cancheTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(re);
			}
		});
	}
}
/** -------- 清除全部------ */
function clearAll(){
	$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
		// 首先如果用户选择了数据，则获取选择的数据集合
		if (r) {
			var all = {
				url :root+'/common/flushRedis',
				data : {
					
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("cancheTable");
					}
					showMessage(data);
				}
			}
			sendAjaxRequest(all);
		}
	});
	
}


/** -------- 重置查询条件 ------ */
function mailPreReset() {
	$('#conditionForm').form('reset');
}