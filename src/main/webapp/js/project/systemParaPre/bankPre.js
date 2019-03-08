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
}

/** --------初始化页面模块 ------ */
function initPage() {
	var dialog_add = {
		id : "bankPreAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "bankPreEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#bankPreAdd').dialog('close');
	// 添加窗口
	initDialog(dialog_edit);
	$('#bankPreEdit').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#bankPreTable').datagrid({
		url : 'bankPreList.action',
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
			width : 15
		}, {
			field : 'bankId',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'bankCode',
			title : '银行代码',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'bankName',
			title : '银行名称',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'bankPic',
			title : '银行图标',
			align : 'center',
			formatter : bankPicFormater,
			width : 75
		}, {
			field : 'status',
			title : '状态',
			align : 'center',
			formatter : function(value, row, index){
				var text = '--';
				if(value == '0') {
					text = '无效';
				}
				if(value == '1') {
					text = '有效';
				}
				return text;
			},
			width : 75
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	$('#add_status').combobox({
		data: [{
			"id" : "0",
			"text" : "无效"
		},{
			"id" : "1",
			"text" : "有效"
		}],
		valueField:'id',
		textField:'text',
		required : true
	});
	$('#edit_status').combobox({
		data: [{
			"id" : "0",
			"text" : "无效"
		},{
			"id" : "1",
			"text" : "有效"
		}],
		valueField:'id',
		textField:'text',
		required : true
	});
	$('#add_status').combobox('select', '0');
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#bankPreTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function bankPicFormater(value, row, index){
	if(isEmpty(value)){
		return "<image src='"+root+"/images/upload/"+"nopic.jpg"+"'></image>";
	}
	return "<image src='"+root+"/images/upload/bank/"+value+"'></image>";
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

/** --------查看会员详情 ------ */
function getInfo(flag) {
	if(flag == 'edit'){
		var selecteds = $('#bankPreTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#bankPreTable').datagrid('getSelected')
		$("#edit_bankId").val(selected.bankId);
		$("#edit_bankCode").val(selected.bankCode);
		$("#edit_bankName").val(selected.bankName);
		$('#edit_status').combobox('select', selected.status);
		$('#edit_bankPic').val(selected.bankPic);
		
		$('#bankPreEdit').dialog('open');
	}
}

/** -------- 添加 ------ */
function addbankPre(){
	var addflag = $("#bankPreAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("bankPreAddForm");
	var add = {
		url : 'addBank.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("bankPreTable");
			}
			$('#bankPreAdd').dialog('close');
			showMessage(data);
			SoftwareVersionAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function bankPreEdit(){
	var editflag = $("#bankPreEditForm").form('validate');
	if(!editflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJson("bankPreEditForm");
	var add = {
		url : 'updateBank.action',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("bankPreTable");
			}
			$('#bankPreEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}

/** -------- 批量删除 ------ */
function delbankPre() {
	var selecteds = $('#bankPreTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#bankPreTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#bankPreTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].bankId);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = 'deleteBank.action';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("bankPreTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}

/** -------- 导入 ------ */
function uploadMember(flag) {
	if(flag == 'add' && isEmpty($('#add_bankPicFile').val())){
		$.messager.alert('提示信息','请选择文件！','info');
		return false;
	}
	if(flag == 'edit' && isEmpty($('#edit_bankPicFile').val())){
		$.messager.alert('提示信息','请选择文件！','info');
		return false;
	}
	//进度条归0
	if(flag == 'add'){
		$('#add_progressNumber').progressbar('setValue', '0');
	}
	if(flag == 'edit'){
		$('#edit_progressNumber').progressbar('setValue', '0');
	}
	//获取文件参数
	var fd = new FormData();
	if(flag == 'add'){
		fd.append("picBank", document.getElementById('add_bankPicFile').files[0]);
	}
	if(flag == 'edit'){
		fd.append("picBank", document.getElementById('edit_bankPicFile').files[0]);
	}
	fd.append("path", "/images/upload/bank");
	//AJAX请求
	var xhr = new XMLHttpRequest();
	if(flag == 'add'){
		xhr.upload.addEventListener("progress", addUploadProgress, false);
	}
	if(flag == 'edit'){
		xhr.upload.addEventListener("progress", editUploadProgress, false);
	}
	xhr.open("POST", "uploadBankPic.action");
	xhr.onreadystatechange = function () {
		//4: 请求已完成，且响应已就绪
		if(xhr.readyState==4){
			var data = xhr.responseText;
			data = eval('(' + data + ')');
			if(data.isSuccessOrfail=="SUCCESS"){
				if(flag == 'add'){
					$('#add_bankPic').val(data.message);
				}
				if(flag == 'edit'){
					$('#edit_bankPic').val(data.message);
				}
				$.messager.show({title:'提示信息', msg:'上传成功！'});
			}else{
				$.messager.alert('错误提示','上传失败！','error');
			}
		}
	}
	xhr.send(fd);
}

/** -------- 选择文件 ------ */
function fileSelected(flag) {
	//进度条归0
	if(flag == 'add'){
		$('#add_progressNumber').progressbar('setValue', '0');
		file = document.getElementById('add_bankPicFile').files[0];
	}
	if(flag == 'edit'){
		$('#edit_progressNumber').progressbar('setValue', '0');
		file = document.getElementById('edit_bankPicFile').files[0];
	}
	var fileName = file.name;
	var file_typename = fileName.substring(fileName.lastIndexOf('.'), fileName.length);
	
	if(flag == 'add'){
		$('#add_bankPicFileName').val(fileName);
	}
	if(flag == 'edit'){
		$('#edit_bankPicFileName').val(fileName);
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

/** -------- 导入进度条 ------ */
function addUploadProgress(evt) {
	if (evt.lengthComputable) {
		var percentComplete = Math.round(evt.loaded * 100 / evt.total);
		$('#add_progressNumber').progressbar('setValue', percentComplete);
	}
	else {
		document.getElementById('add_progressNumber').innerHTML = '无法计算';
	}
}
function editUploadProgress(evt) {
	if (evt.lengthComputable) {
		var percentComplete = Math.round(evt.loaded * 100 / evt.total);
		$('#edit_progressNumber').progressbar('setValue', percentComplete);
	}
	else {
		document.getElementById('edit_progressNumber').innerHTML = '无法计算';
	}
}

/** -------- 重置查询条件 ------ */
function bankPreReset() {
	$('#conditionForm').form('reset');
	$('#sourceid').val('sdal');
	initDatebox();
}
function AirCityAddReset() {
	$('#bankPreAddForm').form('reset');
	$('#add_status').combobox('select', '1');
}
