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
	$("#pwd_original").textbox({
		label : '原始密码：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#pwd_new").textbox({
		label : '新 密 码：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	$("#pwd_confirm").textbox({
		label : '确认密码：',
		labelWidth : 100,
		labelAlign : 'right',
		width : 250
	});
	
	var dialog_add = {
		id : "changePwd",
		title : "操作员个人密码修改",
		closable : false
	};
	// 添加窗口
	initDialog(dialog_add);
}
/** --------加载表格数据 ------ */
function ajaxTable() {
}

/** --------加载树形 ------ */
function ajaxTree() {
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
};

/** --------自定义文本 ------ */

/** --------自定义单元格样式 ------ */

/** --------查看会员详情 ------ */
function getInfo(id, flag) {
}

/** -------- 修改密码 ------ */
function changePassword(){
	//验证表单参数
	var sflag = $("#changePwdForm").form('validate');
	if(!sflag){
		$.messager.alert('错误提示', '请按照规则填写参数！', 'error');
		return false;
	}
	// 验证时间
	var pwd_new = $('#pwd_new').val();
	var pwd_confirm = $('#pwd_confirm').val();
		if (pwd_new != pwd_confirm) {
			$.messager.alert('错误提示', '两次输入新密码不一样', 'error');
			return false;
		}
	var params = serializeJson("changePwdForm");
	var add = {
		url : root + '/operator/updatePwd',
		data : params,
		callBackFun : function(data) {
			$('#changePwd').dialog('close');
			showMessage(data);
			changePwdReset();
		}
	}
	sendAjaxRequest(add);
}

/** -------- 重置查询条件 ------ */
function changePwdReset() {
	$('#changePwdForm').form('clear');
}