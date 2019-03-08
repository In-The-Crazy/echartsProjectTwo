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
		id : "flightQueryAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "flightQueryEdit",
		title : "修改"
	};	
	var dialog_upload = {
			id : "flightQueryUpload",
			title : "导入鲁燕航班"
	};
	
	initDialog(dialog_upload);
	$('#flightQueryUpload').dialog('close');
	
	// 添加窗口
	initDialog(dialog_add);
	$('#flightQueryAdd').dialog('close');
	// 修改窗口
	initDialog(dialog_edit);
	$('#flightQueryEdit').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	//参数验证
	var flag = $("#conditionForm").form('validate');
	if(!flag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#flightQueryTable').datagrid({
		url : 'queryFlightQueryList.action',
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
			field : 'limitFnumber',
			title : '航班号',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'orgCity',
			title : '出发城市',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'dstCity',
			title : '到达城市',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'createDate',
			title : '创建日期',
			align : 'center',
			formatter : dateTimeFormater,
			width : 100
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#"flightQueryTable"').datagrid('resize');
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
function getInfo(flag) {
	if(flag == 'edit'){
		var selecteds = $('#flightQueryTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#flightQueryTable').datagrid('getSelected');
		$("#edit_id").val(selected.id);
		$("#edit_limitFnumber").val(selected.limitFnumber);
		$("#edit_orgCity").val(selected.orgCity);
		$("#edit_dstCity").val(selected.dstCity);
		
		$('#flightQueryEdit').dialog('open');
	}
}

/** -------- 添加 ------ */
function addflightQuery(){
	//参数验证
	var flag = $("#flightQueryAddForm").form('validate');
	if(!flag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("flightQueryAddForm");
	var add = {
		url : 'addFlightQuery.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("flightQueryTable");
			}
			$('#flightQueryAdd').dialog('close');
			showMessage(data);
			flightQueryAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editflightQuery(){
	//参数验证
	var flag = $("#flightQueryEditForm").form('validate');
	if(!flag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("flightQueryEditForm");
	var add = {
		url : 'modifyFlightQuery.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("flightQueryTable");
			}
			$('#flightQueryEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}

/** -------- 批量删除 ------ */
function delflightQuery() {
	var selecteds = $('#flightQueryTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#flightQueryTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#flightQueryTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].id);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = 'deleteFlightQuery.action';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("flightQueryTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}


//导出
function exportflightQuery(){
	
	var data = $('#flightQueryTable').datagrid('getData');
	var orgCity = $('#orgCity').val();
	var dstCity = $('#dstCity').val();
	var startAirlineFnumber = $('#limitFnumber').val();
	
	var keys = ['start','end','orgCity','dstCity','startAirlineFnumber'];
	var values = ['0','60000',orgCity,dstCity,startAirlineFnumber];
	var count = data.rows.length;
	if(count>0){
		openWindowWithPost('exportFlightQueryList.action',keys,values);
	}else{
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
	}
}


/** -------- 导入开关 ------ */
var upload = false;

/** -------- 导入 ------ */
function uploadFareInfo() {
	if(!upload){
		$.messager.alert('提示信息','请选择文件！','info');
		return false;
	}
	//进度条归0
	$('#progressNumber').progressbar('setValue', '0');
	//获取文件参数
	var fd = new FormData();
	fd.append("excel", document.getElementById('fileToUpload').files[0]);
	fd.append("path", "/images/upload/excel");
	//AJAX请求
	var xhr = new XMLHttpRequest();
	xhr.upload.addEventListener("progress", uploadProgress, false);
	xhr.open("POST", "uploadFlight.action");
	xhr.onreadystatechange = function () {
		//4: 请求已完成，且响应已就绪
		if(xhr.readyState==4){
			var data = xhr.responseText;
			data = eval('(' + data + ')');
			if(data.isSuccessOrfail=="SUCCESS"){
				$.messager.show({title:'提示信息', msg:'上传成功！'});
				$.messager.confirm('上传成功','确认导入？',function(r){
					if(r){
						var options = {
							url : 'importFlightQuery.action',
							callBackFun : function(data) {
								showMessage(data);
							}
						}
						sendAjaxRequest(options);
					}
				});
			}else{
				$.messager.alert('错误提示','上传失败！','error');
			}
			$('#flightQueryUpload').dialog('close');
		}
	}
	xhr.send(fd);
}

/** -------- 选择文件 ------ */
function fileSelected() {
	//进度条归0
	$('#progressNumber').progressbar('setValue', '0');
	var file = document.getElementById('fileToUpload').files[0];
	var fileName = file.name;
	var file_typename = fileName.substring(fileName.lastIndexOf('.'), fileName.length);
	
	$('#fileName').val(fileName);
	
	if (file_typename == '.xls') {//这里限定上传文件文件类型
		if (file.size <= 104857600){//这里限定上传文件文件大小
			if (file) {
				var fileSize = 0;
				if (file.size > 1024 * 1024){
					fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
				}
				else{
					fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
				}
				upload = true;
			}
		} else {
			$.messager.alert('错误提示',"文件大小要小于100M！",'error');
			upload = false;
		}
	}else{
		$.messager.alert('错误提示',"文件格式必须是xls！",'error');
		upload = false;
	}
}

/** -------- 导入进度条 ------ */
function uploadProgress(evt) {
	if (evt.lengthComputable) {
		var percentComplete = Math.round(evt.loaded * 100 / evt.total);
		$('#progressNumber').progressbar('setValue', percentComplete);
	}
	else {
		document.getElementById('progressNumber').innerHTML = '无法计算';
	}
}


/** -------- 重置查询条件 ------ */
function flightQueryReset() {
	$('#sourceid').val('sdal');
	$('#conditionForm').form('reset');
}
function flightQueryAddReset() {
	$('#flightQueryAddForm').form('reset');
}