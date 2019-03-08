<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>河北航空电商管理系统</title>
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
    	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<%@ include file="../common/js_cs.jsp"%>
		<script src="<%=root%>/js/project/common/login.js" type="text/javascript"></script>
		<style>
			body {
				font: 12px "宋体";
				color: #000;
			}
			
			* {
				padding: 0;
				margin: 0;
			}
			
			.main {
				width:890px;
				height:353px;
				margin:0 auto;
				background:url(../images/login/sdal/background.png);
				position:absolute;
				left:0;
				right:0;
				margin-top: 60px; 
			}
			
			.logo {
				float: right;
				padding: 18px 50px 0 0;
				clear: both;
			}
			
			.loginDiv {
				width: 100%;
				margin-top: 175px;
				margin-left: 20px;
			}
			
			.loginDiv fieldset {
				margin-bottom: 10px;
			}
			
			.loginDiv input{
				width: 120px;
				height: 22px;
			}
			
			.login {
				width: 100%;
			}
			
			.login .img {
				width: 97px;
				height: 27px;
				margin-left: 38%;
				background:url(../images/login/log1.png);
			}
			.login .img:hover {
				background:url(../images/login/log2.png);
			}
			.login .img:active {
				background:url(../images/login/log3.png);
			}
		</style>
	</head>

	<body>
		<div class="main">
			<form id="loginForm" name="loginForm" method="post">
			<input type="hidden" id="msg" value="${requestScope.msg }" />
				<input type="reset" id ="addReset"></input>
				<div class="loginDiv">
					<fieldset>
						<label>
							用户名：
						</label>
						<input name="opAccount" id="username" type="text" autocomplete="on"  />
					</fieldset>
					<fieldset>
						<label>
							密&emsp;码：
						</label>
						<input id="password" name="opPwd" type="password" autocomplete="on" />
					</fieldset>
				</div>
				<div class="login">
					<div class="img" onclick="javascript:login();"></div>
				</div>
			</form>
		</div>
	</body>
</html>
