<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
	<head>
		<title>河北航空移动电子客票管理系统</title>
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<script type="text/javascript">
		    $(function(){
		    	initDiv();
		    });
		    function initDiv(){
			    $('#menuTree').tree({
					data: [{id:1,text:"运价管理",attributes:{}}],
					onClick: function(node){
						if(!isEmpty(node.attributes)){
							addTab(node.attributes.id,node.attributes.name,node.attributes.url);
						}
						$('#menuTree').tree('toggle', node.target);
					}
				});
		    }
	    </script>
		<style type="text/css">
			img {
				border: none;
			}
			a{
				color: #000;
			    text-decoration: none;
			}
		</style>
	</head>

<body>
	<div class="easyui-layout" fit="true"
		style="width: 100%; height: 100%;">
		<div region="north" border="false" id="north">
			<a href="logoff">
				<img alt="退出系统" align="right" src="../images/hd_loginout.jpg" />
			</a>
			<a href="goMain">
				<img alt="首页" align="right" src="../images/hd_home.jpg" />
			</a>
		</div>

		<div region="west" split="true" id="west" title="电子客票管理系统">
			<ul id="menuTree">
	        </ul>
		</div>

		<div region="center" split="true" id="center">
			<div class="easyui-tabs" id="centerTab" fit="true" border="false">
				<div title="首页" style="padding: 20px; overflow: hidden;">
					<div style="margin-top: 20px;">
						<h2 id="loginDiv"></h2>
					</div>
				</div>
			</div>
	
			<div region="south" border="false" id="south" style="overflow: hidden;">
				<h3 align="center" style="color: #666; font: 12px arial;">Copyright&nbsp;&copy;&nbsp;2015&nbsp;南京红苹果网络科技有限公司版权所有&nbsp;</h3>
			</div>
		</div>
	</body>
</html>