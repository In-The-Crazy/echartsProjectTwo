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
}

/** --------初始化页面模块 ------ */
function initPage() {
	$('#add_caption,#edit_caption').textbox({
		width : 150
	});
	$('#add_subtitle,#edit_subtitle').textbox({
		width : 150
	});
	
	var dialog_add = {
		id : "infoNoticeAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "infoNoticeEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#infoNoticeAdd').dialog('close');
	// 修改窗口
	initDialog(dialog_edit);
	$('#infoNoticeEdit').dialog('close');
}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var sdate = $('#startdate').datebox('getValue');
	var edate = $('#enddate').datebox('getValue');
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		sdate = sdate.replace(/-/g, '');
		edate = edate.replace(/-/g, '');
		if (parseInt(sdate) > parseInt(edate)) {
			$.messager.alert('错误提示', '开始日期不能大于截止日期', 'error');
			return false;
		}
	}
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#infoNoticeTable').datagrid({
		url : root+'/business/infoNoticeList',
		toolbar : '#toolbar',
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
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
			width : 10
		}, {
			field : 'topicid',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'categoryid',
			hidden : true
		}, {
			field : 'name',
			title : '标题',
			align : 'center',
			formatter : baseFormater,
			width : 200
		}, {
			field : 'subtitle',
			title : '小标题',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'opname',
			title : '发布人',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'creationdate',
			title : '发布日期',
			align : 'center',
			formatter : function(value, row, index){
				return value.substring(0, 10);
			},
			width : 75
		}, {
			field : 'categoryname',
			title : '类型',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'status',
			title : '是否过期',
			align : 'center',
			formatter : overdueFormater,
			width : 75
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	$('#status').combobox({
		data: [{
			"id" : "",
			"text" : "全部"
		},{
			"id" : "0",
			"text" : "已过期"
		},{
			"id" : "1",
			"text" : "未过期"
		}],
		valueField:'id',
		textField:'text',
		width : 150
	});
	$('#status').combobox('select', '1');
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#infoNoticeTable').datagrid('resize');
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
		var selecteds = $('#infoNoticeTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#infoNoticeTable').datagrid('getSelected');
		var edit = {
			url : root+'/business/queryContentInfo',
			data : { topicid : selected.topicid },
			callBackFun : function(data) {
				if (data.isSuccessOrfail == "SUCCESS") {
					$('#edit_topicid').val(data.obj.topicid);
					$("#edit_caption").textbox('setValue',data.obj.subject);
					$("#edit_subtitle").textbox('setValue',selected.subtitle);
					CKEDITOR.instances.edit_context.setData(data.obj.contentBody);
					$('#infoNoticeEdit').dialog('open');
					$('#edit_path').html(data.obj.filepath);
					$('#edit_header').val(data.obj.filepath);
				}else{
					$.messager.alert('错误提示', '数据加载失败!', 'error');
				}
			}
		}
		sendAjaxRequest(edit);
	}
}

/** -------- 添加 ------ */
function addInfoNotice(){
	var addflag = $("#infoNoticeAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJsonForCKEditor("infoNoticeAddForm",'add');
	var add = {
		url : root+'/business/saveNotice',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("infoNoticeTable");
			}
			$('#infoNoticeAdd').dialog('close');
			showMessage(data);
			infoNoticeAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editInfoNotice(){
	var editflag = $("#infoNoticeEditForm").form('validate');
	if(!editflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJsonForCKEditor("infoNoticeEditForm",'edit');
	var add = {
		url : root+'/business/updateNotice',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("infoNoticeTable");
			}
			$('#infoNoticeEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}

/** -------- 批量删除 ------ */
function delInfoNotice() {
	var selecteds = $('#infoNoticeTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#infoNoticeTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#infoNoticeTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].topicid);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root+'/business/deleteNotice';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("infoNoticeTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}

/** -------- 置顶 ------ */
function stickNotice(){
	var selecteds = $('#infoNoticeTable').datagrid('getSelections');
	if(selecteds.length!=1){
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	var selected = $('#infoNoticeTable').datagrid('getSelected');
	$.messager.confirm('置顶提示', '是否确认置顶? ', function(r) {
		if (r) {
			var stick = {
				url : root+'/business/stickNotice',
				data : {
					topicid : selected.topicid,
					categoryid : selected.categoryid
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("infoNoticeTable");
					}
					showMessage(data);
				}
			}
			sendAjaxRequest(stick);
		}
	});
}

/** -------- 过期 ------ */
function outdateNotice() {
	var selecteds = $('#infoNoticeTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#infoNoticeTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#infoNoticeTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].topicid);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('过期提示', '是否确认过期? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root+'/business/outdateNotice';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("infoNoticeTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}

/** -------- 推送 ------ */
function pushNotice(){
	var selecteds = $('#infoNoticeTable').datagrid('getSelections');
	if(selecteds.length!=1){
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	var selected = $('#infoNoticeTable').datagrid('getSelected');
	$.messager.confirm('推送提示', '是否确认推送? ', function(r) {
		if (r) {
			var push = {
				url : root+'/business/pushNotice',
				data : {
					topicid : selected.topicid
				},
				callBackFun : function(data) {
					if (data.isSuccessOrfail == "SUCCESS") {
						reloadTable("infoNoticeTable");
					}
					showMessage(data);
				}
			}
			sendAjaxRequest(push);
		}
	});
}

/** -------- 导入 ------ */
function uploadHeader(flag) {
	if(flag == 'add' && isEmpty($('#add_noticeHeader').val())){
		$.messager.alert('提示信息','请选择文件！','info');
		return false;
	}
	if(flag == 'edit' && isEmpty($('#edit_noticeHeader').val())){
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
		fd.append("noticeHeader", document.getElementById('add_noticeHeader').files[0]);
	}
	if(flag == 'edit'){
		fd.append("noticeHeader", document.getElementById('edit_noticeHeader').files[0]);
	}
	fd.append("path", "/images/upload/notice");//上传路径
	//AJAX请求
	var xhr = new XMLHttpRequest();
	if(flag == 'add'){
		xhr.upload.addEventListener("progress", addUploadProgress, false);
	}
	if(flag == 'edit'){
		xhr.upload.addEventListener("progress", editUploadProgress, false);
	}
	xhr.open("POST", root+'/business/uploadTranslate');
	xhr.onreadystatechange = function () {
		//4: 请求已完成，且响应已就绪
		if(xhr.readyState==4){
			var data = xhr.responseText;
			data = eval('(' + data + ')');
			if(data.isSuccessOrfail=="SUCCESS"){
				if(flag == 'add'){
					$('#add_header').val(data.message);
				}
				if(flag == 'edit'){
					$('#edit_header').val(data.message);
				}
				$.messager.show({title:'提示信息', msg:'上传成功！'});
			}else{
				$.messager.alert('错误提示','上传失败！','error');
			}
		}
	}
	xhr.send(fd);
}
function uploadNotice(flag) {
	if(flag == 'add' && isEmpty($('#add_noticePic').val())){
		$.messager.alert('提示信息','请选择文件！','info');
		return false;
	}
	if(flag == 'edit' && isEmpty($('#edit_noticePic').val())){
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
		fd.append("noticePic", document.getElementById('add_noticePic').files[0]);
	}
	if(flag == 'edit'){
		fd.append("noticePic", document.getElementById('edit_noticePic').files[0]);
	}
	fd.append("path", "/images/upload/notice");//上传路径
	//AJAX请求
	var xhr = new XMLHttpRequest();
	if(flag == 'add'){
		xhr.upload.addEventListener("progress", addUploadProgress, false);
	}
	if(flag == 'edit'){
		xhr.upload.addEventListener("progress", editUploadProgress, false);
	}
	xhr.open("POST", root+'/business/uploadNotice');
	xhr.onreadystatechange = function () {
		//4: 请求已完成，且响应已就绪
		if(xhr.readyState==4){
			var data = xhr.responseText;
			data = eval('(' + data + ')');
			if(data.isSuccessOrfail=="SUCCESS"){
				if(flag == 'add'){
					$('#add_header').val(data.message);
					$('#add_path').html(data.message);
				}
				if(flag == 'edit'){
					$('#edit_header').val(data.message);
					$('#edit_path').html(data.message);
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
	var file;
	if(flag == 'add'){
		$('#add_progressNumber').progressbar('setValue', '0');
		file = document.getElementById('add_noticePic').files[0];
	}
	if(flag == 'edit'){
		$('#edit_progressNumber').progressbar('setValue', '0');
		file = document.getElementById('edit_noticePic').files[0];
	}
	var fileName = file.name;
	var file_typename = fileName.substring(fileName.lastIndexOf('.'), fileName.length);
	
	if(flag == 'add'){
		$('#add_noticePicFileName').val(fileName);
	}
	if(flag == 'edit'){
		$('#edit_noticePicFileName').val(fileName);
	}
	
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
function infoNoticeReset() {
	$('#status').combobox('select', '1');
	$('#sourceid').val('sdal');
	$('#conditionForm').form('reset');
}
function infoNoticeAddReset() {
	CKEDITOR.instances.add_context.setData("");
	$('#add_progressNumber').progressbar('setValue', '0');
	$('#add_path').html("");
	$('#infoNoticeAddForm').form('reset');
}

/** -------- 以JSON的形式格式化参数 ------ */
function serializeJsonForCKEditor(formId,flag){
	var params = $("#"+formId).serializeArray();
	var list = {};
	$.each(params, function(i, field){
		var result =  iGetInnerText(field.value);
		if(field.name == 'context'){
			if(flag == 'add'){
				result = iGetInnerText(CKEDITOR.instances.add_context.getData());
			}
			if(flag == 'edit'){
				result = iGetInnerText(CKEDITOR.instances.edit_context.getData());
			}
		}
		list[field.name] = result;
	});
	return list;
   }
