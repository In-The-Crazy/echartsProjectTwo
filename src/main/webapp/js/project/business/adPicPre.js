var topicNames = [];
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
		id : "adPicPreAdd",
		title : "添加"
	};
	var dialog_edit = {
			id : "adPicPreEdit",
			title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#adPicPreAdd').dialog('close');
	// 修改窗口
	initDialog(dialog_edit);
	$('#adPicPreEdit').dialog('close');

}
/** --------加载表格数据 ------ */
function ajaxTable() {
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#adPicPreTable').datagrid({
		url : root+'/business/queryAdPicList',
		toolbar : '#toolbar',
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : true,// 定义是否设置基于该行内容的行高度
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
		onDblClickCell : editSort,
		columns : [ [ {
			field : 'rownumbers',
			title : '',
			align : 'center',
			styler : rownumSytler,
			formatter : rownumFormater,
			width : 10
		}, {
			field : 'picId',
			checkbox : 'true',
			align : 'center',
			width : 25
		}, {
			field : 'tblId',
			title : '优惠信息',
			align : 'center',
			formatter : function(value, row, index) {
				for (var int = 0; int < topicNames.length; int++) {
					if (topicNames[int].id == value) {
						return topicNames[int].text;
					}
				}
			},
			width : 75
		}, {
			field : 'picName',
			title : '广告图片',
			align : 'center',
			formatter : baseFormater,
			width : 75
		}, {
			field : 'picUrl',
			title : '图片地址',
			align : 'center',
			formatter : imgFormater,
			width : 180
		}, {
			field : 'picType',
			title : '图片使用',
			align : 'center',
			formatter : imgTypeFormater,
			width : 75
		}, {
			field : 'picSort',
			title : '排序',
			align : 'center',
			formatter : baseFormater,
			editor : 'text',
			width : 75
		}, {
			field : 'picStatus',
			title : '状态',
			align : 'center',
			formatter : picStatusFormater,
			width : 75
		}, {
			field : 'operName',
			title : '最近操作人',
			align : 'center',
			formatter : baseFormater,
			editor : 'text',
			width : 75
		}, {
			field : 'modifyDate',
			title : '最近操作时间',
			align : 'center',
			formatter : baseFormater,
			width : 75
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	//优惠信息
	var add_tblId = {
		url : root+'/business/querySystemInfoTree',
		data : {
			'typecode' : '7601,7603',
			'status' : '1'
		},
		callBackFun : function(data) {
			topicNames = data.treeList;
			$('#add_tblId,#edit_tblId').combobox({
				label : '优惠信息：',
				labelWidth : 100,
				labelAlign : 'right',
				width : 250,
				data : data.treeList,
				valueField:'id',
				textField:'text',
				limitToList : true,
				editable : true,
				required : false,
				multiple : false
			});
		}
	}
	sendAjaxRequest(add_tblId);
	
	$('#add_type,#edit_type').combobox({
		label : '图片使用：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data: [{
			"id" : "1",
			"text" : "启动页"
		},{
			"id" : "2",
			"text" : "购票后"
		}],
		valueField:'id',
		textField:'text',
		limitToList : true,
		editable : false,
		required : false,
		multiple : false
	});
	$('#add_type').combobox('select', '1');
	
	$('#type').combobox({
		label : '图片使用：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data: [{
			"id" : "",
			"text" : "全部",
			"selected": true
		},{
			"id" : "1",
			"text" : "启动页"
		},{
			"id" : "2",
			"text" : "购票后"
		}],
		valueField:'id',
		textField:'text',
		limitToList : true,
		editable : false,
		required : false,
		multiple : false
	});
	
	$('#status').combobox({
		label : '使用状态：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250,
		data: [{
			"id" : "",
			"text" : "全部"
		},{
			"id" : "0",
			"text" : "无效"
		},{
			"id" : "1",
			"text" : "有效",
			"selected": true
		}],
		valueField:'id',
		textField:'text',
		limitToList : true,
		editable : false,
		required : false,
		multiple : false
	});
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#adPicPreTable').datagrid('resize');
	$('.easyui-panel').panel('resize');
};

/** --------自定义文本 ------ */
function imgFormater(value, row, index) {
	return "<image src='"+value+"' style='width:180px;height:320px;'></image>";
};
function picStatusFormater(value, row, index) {
	var text = imgStatusFormater(value, row, index);
	var _id = "'" + row.picId + "'";
	var _status = "'" + row.picStatus + "'";
	return '<a href="javascript:void(0);" onclick=changeStatus(' + _id + ',' + _status + ')>'+ text + '</a>';
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
	var selecteds = $('#adPicPreTable').datagrid('getSelections');
	if (selecteds.length != 1) {
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	var selected = $('#adPicPreTable').datagrid('getSelected')
	$("#adPicPreEditForm").form('load',selected);
	$("#edit_picId").val(selected.picId);

	$('#adPicPreEdit').dialog('open');
}

/** -------- 添加 ------ */
function addadPicPre(){
	var fileName = $("#add_adPicFileName").val();
	if (fileName == null || isEmpty(fileName)) {
		$.messager.alert('错误提示',"请选择图片！",'error');
	}
	var params = serializeFileAdd("adPicPreAddForm");
	var xhr = new XMLHttpRequest();
	xhr.open("POST", root+'/business/addAdPic');
	xhr.onreadystatechange = function () {
		//4: 请求已完成，且响应已就绪
		if(xhr.readyState==4){
			var data = xhr.responseText;
			data = eval('(' + data + ')');
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("adPicPreTable");
			}
			$('#adPicPreAdd').dialog('close');
			adPicPreAddReset();
			showMessage(data);
		}
	}
	xhr.send(params);
}

/** -------- 修改 ------ */
function editadPicPre(){
	var fileName = $("#edit_adPicFileName").val();
	if (fileName == null || isEmpty(fileName)) {
		$.messager.alert('错误提示',"请选择图片！",'error');
	}
	
	var params = serializeFileEdit("adPicPreEditForm");
	console.log(params);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", root+'/business/updateAdPic');
	xhr.onreadystatechange = function () {
		//4: 请求已完成，且响应已就绪
		if(xhr.readyState==4){
			var data = xhr.responseText;
			data = eval('(' + data + ')');
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("adPicPreTable");
			}
			$('#adPicPreEdit').dialog('close');
			showMessage(data);
		}
	}
	xhr.send(params);
}

/** -------- 修改图片状态 ------ */
function changeStatus(id,status){
	$.messager.confirm('修改提示', '是否确认修改图片状态? ', function(r) {
		if(r){
			var change = {
				url : root+'/business/changeAdPicStatus',
				data : {
					"id" : id,
					"status" : status
				},
				callBackFun : function(data) {
					reloadTable("adPicPreTable");
					showMessage(data);
				}
			}
			sendAjaxRequest(change);
		}
	});
}

/** -------- 修改图片排序 ------ */
function changeSort() {
	var selecteds = $('#adPicPreTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#adPicPreTable').datagrid('getSelected')) {
		var ids = [];
		var sorts = [];
		var selectedRow = $('#adPicPreTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].picId);//记得改ID
			sorts.push(selectedRow[i].picSort);//记得改ID
		}
		var dpid = ids.join(',');
		var dpsort = sorts.join(',');
		$.messager.confirm('修改提示', '是否确认修改图片排序? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root+'/business/saveAdPicSort';
				var options = {
					url : url,
					data : {
						"ids" : dpid,
						"sorts" : dpsort
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("adPicPreTable");
						}
						showMessage(data);
					}
				}
				sendAjaxRequest(options);
			}
		});
	}
}

/** -------- 批量删除 ------ */
function deladPicPre() {
	var selecteds = $('#adPicPreTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#adPicPreTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#adPicPreTable').datagrid('getSelections');
		for (var i = 0; i < selectedRow.length; i++) {
			ids.push(selectedRow[i].picId);//记得改ID
		}
		var dpid = ids.join(',');
		$.messager.confirm('删除提示', '是否确认删除? ', function(r) {
			// 首先如果用户选择了数据，则获取选择的数据集合
			if (r) {
				var url = root+'/business/deleteAdPic';
				var options = {
					url : url,
					data : {
						"ids" : dpid
					},
					callBackFun : function(data) {
						if (data.isSuccessOrfail == "SUCCESS") {
							reloadTable("adPicPreTable");
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
		file = document.getElementById('add_adPicFile').files[0];
	}else if (flag == 'edit') {
		file = document.getElementById('edit_adPicFile').files[0];
	}
	var fileName = file.name;
	var file_typename = fileName.substring(fileName.lastIndexOf('.'), fileName.length);
	
	if(flag == 'add'){
		$('#add_adPicFileName').val(fileName);
	}else if (flag == 'edit') {
		$('#edit_adPicFileName').val(fileName);
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

/**
 * 以JSON的形式格式化参数
 */
function serializeFileAdd(formId){
	var fd = new FormData();
	fd.append("adPic",$('#add_adPicFile')[0].files[0]);
	var params = $("#"+formId).serializeArray();
	for(var i=0;i<params.length;i++){
		fd.append(params[i].name,params[i].value);
	}
	return fd;
}
function serializeFileEdit(formId){
	var fd = new FormData();
	fd.append("adPic",$('#edit_adPicFile')[0].files[0]);
	var params = $("#"+formId).serializeArray();
	for(var i=0;i<params.length;i++){
		fd.append(params[i].name,params[i].value);
	}
	return fd;
}

/** -------- 编辑单元格 ------ */
$.extend($.fn.datagrid.methods, {
	editCell : function(cell, param) {
		return cell.each(function() {
			var opts = $(this).datagrid('options');
			var fields = $(this).datagrid('getColumnFields', true).concat(
					$(this).datagrid('getColumnFields'));
			for (var i = 0; i < fields.length; i++) {
				var col = $(this).datagrid('getColumnOption', fields[i]);
				col.editor1 = col.editor;
				if (fields[i] != param.field) {
					col.editor = null;
				}
			}
			$(this).datagrid('beginEdit', param.index);
			for (var i = 0; i < fields.length; i++) {
				var col = $(this).datagrid('getColumnOption', fields[i]);
				col.editor = col.editor1;
			}
		});
	}
});

var editIndex = undefined;
function endEditing() {// 结束编辑
	if (editIndex == undefined) {
		return true
	}
	if ($('#adPicPreTable').datagrid('validateRow', editIndex)) {
		$('#adPicPreTable').datagrid('endEdit', editIndex);
		editIndex = undefined;
		return true;
	} else {
		return false;
	}
}

function EditCounterFee(index, field, value) {// 双击单元格开始编辑
	if (endEditing()) {
		$('#adPicPreTable').datagrid('selectRow', index).datagrid('editCell',
				{
					index : index,
					field : field
				});
		var ed = $(this).datagrid('getEditor', {
			index : index,
			field : field
		});
		if (ed) {
			$(ed.target).focus();
		}
		editIndex = index;
	}
}

function editSort(index, field, value) {// 双击单元格开始编辑
	if (endEditing()) {
		$('#adPicPreTable').datagrid('selectRow', index).datagrid('editCell',
				{
					index : index,
					field : field
				});
		var ed = $(this).datagrid('getEditor', {
			index : index,
			field : field
		});
		if (ed) {
			$(ed.target).focus();
		}
		editIndex = index;
	}
}

/** -------- 重置查询条件 ------ */
function adPicPreReset() {
	$('#conditionForm').form('reset');
}
function adPicPreAddReset() {
	$('#add_path').val('/images/upload/ad');
	$('#add_type').combobox('select', '1');
	$('#adPicPreAddForm').form('reset');
}
