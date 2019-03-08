$(function() {
	document.onkeydown = keyDown;
	var _parent = window.parent;
	var _iframe = _parent.document.getElementsByTagName("iframe");
	if (!isEmpty(_iframe)) {
		_parent.location.href = "goLogin";
	}
});

function keyDown(e) {
	var keycode = e.which;
	if (keycode == 13) {
		login();
	}
}

function login() {
	if ($("#username").val() == "") {
		$.messager.alert("错误提示", "用户名不能为空！", "error");
		return false;
	}
	if ($("#password").val() == "") {
		$.messager.alert("错误提示", "密码不能为空！", "error");
		return false;
	}
	$.ajax({
		url : root + '/operator/login',
		type : "post",
		dataType : 'json',
		data : serializeJson("loginForm"),
		success : function(data) {
			console.log(data);
			if (data.isSuccessOrfail == "SUCCESS") {
				window.location.href = "goMain";
			} else {
				$.messager.alert('错误提示', data.message, 'error');
			}
		},
		error : function() {
			$.messager.alert('错误提示', "服务器连接失败！", 'error');
		}
	});
}