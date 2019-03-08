var protocolScenes = [];
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
		label: '起始日期：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		editable: false,
		required : false
	});
	$('#enddate').datebox({
		label: '截止日期：',
		labelWidth: 100,
		labelAlign: "right",
		width: 250,
		editable: false,
		required: false
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
		id : "protocolAdd",
		title : "添加"
	};
	var dialog_edit = {
		id : "protocolEdit",
		title : "修改"
	};
	
	// 添加窗口
	initDialog(dialog_add);
	$('#protocolAdd').dialog('close');
	// 修改窗口
	initDialog(dialog_edit);
	$('#protocolEdit').dialog('close');
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
	$('#protocolTable').datagrid({
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
			field : 'parenttopicid',
			title : '场景',
			align : 'center',
			formatter : function(value, row, index){
				for (var i = 0; i < protocolScenes.length; i++) {
					if(protocolScenes[i].dincCode == value){
						return protocolScenes[i].dincName;
					}
				}
			},
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
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
	//协议场景
	var protocolScene = {
		url : root+'/common/querydictsByType',
		data : {'type':'PROTOCOLSCENE'},
		callBackFun : function(data) {
			protocolScenes = data.rows;
			var treeList = rowsListAddAll(data.rows, {
				"checked" : true,
				"children" : null,
				"dincCode" : "",
				"dincName" : "全部"
			});
			//场景设置
			$('#protocolScene').combobox({
				label: '协议场景：',
				labelWidth: 100,
				labelAlign: "right",
				width: 250,
				data:treeList,
				valueField:'dincCode',
				required : true,
				editable : false,
				multiple:false,
				textField:'dincName',
			});
			$('#add_parenttopicid,#edit_parenttopicid').combobox({
				width: 150,
				data:protocolScenes,
				valueField:'dincCode',
				required : true,
				editable : false,
				multiple:false,
				textField:'dincName',
			});
		}
	};
	sendAjaxRequest(protocolScene)
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	$('#protocolTable').datagrid('resize');
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
		var selecteds = $('#protocolTable').datagrid('getSelections');
		if(selecteds.length!=1){
			$.messager.alert('错误提示', '请选择一条记录!', 'error');
			return false;
		}
		var selected = $('#protocolTable').datagrid('getSelected');
		var edit = {
			url : root+'/business/queryContentInfo',
			data : { topicid : selected.topicid },
			callBackFun : function(data) {
				if (data.isSuccessOrfail == "SUCCESS") {
					$('#edit_topicid').val(data.obj.topicid);
					$("#edit_caption").textbox('setValue',data.obj.subject);
					$("#edit_parenttopicid").combobox('setValue',selected.parenttopicid);
					CKEDITOR.instances.edit_context.setData(data.obj.contentBody);
					$('#protocolEdit').dialog('open');
				}else{
					$.messager.alert('错误提示', '数据加载失败!', 'error');
				}
			}
		}
		sendAjaxRequest(edit);
	}
}

/** -------- 添加 ------ */
function addProtocol(){
	var addflag = $("#protocolAddForm").form('validate');
	if(!addflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJsonForCKEditor("protocolAddForm",'add');
	var add = {
		url : root+'/business/saveNotice',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("protocolTable");
			}
			$('#protocolAdd').dialog('close');
			showMessage(data);
			protocolAddReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 修改 ------ */
function editProtocol(){
	var editflag = $("#protocolEditForm").form('validate');
	if(!editflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	var params = serializeJsonForCKEditor("protocolEditForm",'edit');
	var add = {
		url : root+'/business/updateNotice',
		data : params,
		callBackFun : function(data) {
			if (data.isSuccessOrfail == "SUCCESS") {
				reloadTable("protocolTable");
			}
			$('#protocolEdit').dialog('close');
			showMessage(data);
		}
	}
	sendAjaxRequest(add);
}

/** -------- 批量删除 ------ */
function delProtocol() {
	var selecteds = $('#protocolTable').datagrid('getSelections');
	if(selecteds.length==0){
		$.messager.alert('错误提示', '请选择记录!', 'error');
		return false;
	}
	if ($('#protocolTable').datagrid('getSelected')) {
		var ids = [];
		var selectedRow = $('#protocolTable').datagrid('getSelections');
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
							reloadTable("protocolTable");
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
function stickProtocol(){
	var selecteds = $('#protocolTable').datagrid('getSelections');
	if(selecteds.length!=1){
		$.messager.alert('错误提示', '请选择一条记录!', 'error');
		return false;
	}
	var selected = $('#protocolTable').datagrid('getSelected');
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
						reloadTable("protocolTable");
					}
					showMessage(data);
				}
			}
			sendAjaxRequest(stick);
		}
	});
}

/** -------- 重置查询条件 ------ */
function protocolReset() {
	$('#conditionForm').form('reset');
	$("#typecode").val("7504");
	$("#webid").val("4");
}
function protocolAddReset() {
	$('#protocolAddForm').form('reset');
	CKEDITOR.instances.add_context.setData("");
	$('#add_progressNumber').progressbar('setValue', '0');
	$("#add_categoryid").val("7504");
	$("#add_webid").val("4");
	$('#add_path').html("");
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
