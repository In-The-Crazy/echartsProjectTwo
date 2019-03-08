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
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_add = {
		id : "luyanInfoAdd",
		title : "添加"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#luyanInfoAdd').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#luyanInfoTable').datagrid({
		url : 'queryLuyanInfoList.action',
		toolbar : "#toolbar",
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : true,// 定义是否设置基于该行内容的行高度
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
			width : 3
		}, {
			field : 'id',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'luyanId',
			title : '工号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'url',
			title : '图片地址',
			align : 'center',
			formatter : imgFormater,
			width : 100
		}] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#luyanInfoTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function imgFormater(value, row, index) {
	return "<image src='"+value+"' style='width:100px;height:100px;'></image>";
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
function getInfo() {
}

/** -------- 添加 ------ */
function addluyanInfo(){
	var addflag = $("#luyanInfoAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeFile("luyanInfoAddForm");
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "addLuyanInfo.action");
	xhr.onreadystatechange = function () {
		//4: 请求已完成，且响应已就绪
		if(xhr.readyState==4){
			var data = xhr.responseText;
			data = eval('(' + data + ')');
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("luyanInfoTable");
			}
			$('#luyanInfoAdd').dialog('close');
			luyanInfoAddReset();
			showMessage(data);
		}
	}
	xhr.send(params);
}

/** -------- 批量删除 ------ */
function delluyanInfo() {
	var selecteds = $('#luyanInfoTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#luyanInfoTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#luyanInfoTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].id);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = 'deleteLuyanInfo.action';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("luyanInfoTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}
/** -------- 选择文件 ------ */
function fileSelected(flag) {
	if(flag == 'add'){
		file = document.getElementById('add_noticePic').files[0];
	}
	var fileName = file.name;
	var file_typename = fileName.substring(fileName.lastIndexOf('.'), fileName.length);
	
	if(flag == 'add'){
		$('#add_noticePicFileName').val(fileName);
	}
	
	if (file_typename == '.gif' || '.png' || '.jpg') {//这里限定上传文件文件类型
		if (file.size <= 104857600){//这里限定上传文件文件大小
			if (file) {
				var fileSize = 0;
				if (file.size > 1024 * 1024){
					fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
				}
				else{
					fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
				}
			}
		} else {
			$.messager.alert('错误提示',"文件大小要小于100M！",'error');
		}
	}else{
		$.messager.alert('错误提示',"文件格式必须是gif、png、jpg！",'error');
	}
}

//导出
function exportluyanInfo(){
	
	var data = $('#luyanInfoTable').datagrid('getData');
	var luyanId = $('#luyanId').val();
	
	var keys = ['start','end','luyanId'];
	var values = ['0','60000',luyanId];
	var count = data.rows.length;
	if(count>0){
		openWindowWithPost('exportLuyanInfoList.action',keys,values);
	}else{
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
	}
}


/**
 * 以JSON的形式格式化参数
 */
function serializeFile(formId){
	var fd = new FormData();
	fd.append("noticePic",$('#add_noticePic')[0].files[0]);
	var params = $("#"+formId).serializeArray();
	for(var i=0;i<params.length;i++){
		fd.append(params[i].name,params[i].value);
	}
	return fd;
   }
/** -------- 重置查询条件 ------ */
function luyanInfoReset() {
	$('#conditionForm').form('reset');
	$('#sourceid').val('sdal');
}
function luyanInfoAddReset() {
	$('#luyanInfoAddForm').form('reset');
	$('#add_path').val('/images/upload/trainman');
}