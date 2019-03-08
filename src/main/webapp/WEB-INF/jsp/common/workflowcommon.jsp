<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%> 
<% String rootflow = request.getContextPath(); %>

<script type="text/javascript">
 var root = "<%=rootflow%>"; //js中存放当前页面的root路径方便调用
</script>
<link href="<%=rootflow%>/jquery/qtip/jquery.qtip.min.css" type="text/css" rel="stylesheet" />
<script src="<%=rootflow%>/jquery/qtip/jquery.qtip.pack.js" type="text/javascript"></script>
<script src="<%=rootflow%>/jquery/html/jquery.outerhtml.js" type="text/javascript"></script>
<script src="<%=rootflow%>/js/workflow.js" type="text/javascript"></script>

