var myChart;
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
	var today = new Date();
	var first = new Date();
	first.setDate(1);
	today = today.pattern("yyyy-MM-dd");
	first = first.pattern("yyyy-MM-dd");
	$('#startdate').datebox('setValue',first);
	$('#enddate').datebox('setValue',today);
}

/** --------初始化页面模块 ------ */
function initPage() {
}

/** --------加载表格数据 ------ */
function ajaxTable() {
	// 验证时间
	var sdate = $('#startdate').datebox('getValue');
	var edate = $('#enddate').datebox('getValue');
	if (sdate != null && sdate != "" && edate != null && edate != "") {
		var tempSdate = sdate.replace(/-/g, '');
		var tempSdate = edate.replace(/-/g, '');
		if (parseInt(tempSdate) > parseInt(tempSdate)) {
			$.messager.alert('错误提示', '起始日期不能大于截止日期', 'error');
			return false;
		}
	}
	// 基于准备好的dom，初始化echarts实例
	myChart = echarts.init(document.getElementById('main'));
	myChart.showLoading();
	var result;
	var options = {
		url : 'queryOperatorByTicketCount.action',
		data : "startdate="+sdate+"&enddate="+edate,
		callBackFun : function(data) {
			myChart.hideLoading();
			if(data.isSuccessOrfail='SUCCESS'){
				result = data.rows;
				var serviceproviders = new Array();
				var countserviceproviders = new Array();
				$.each(result, function(i, value){
					serviceproviders[i] = value.serviceprovider;
					countserviceproviders[i] = eval('({value:'+value.countserviceprovider+','+'name:"'+value.serviceprovider+'"})');
				});
				
				
				// 指定图表的配置项和数据
				var option = {
					title: {
						text: '运营商购票分析',
						x:'center'
					},
					toolbox: {
						show : true,
						orient: 'horizontal',		// 布局方式，默认为水平布局，可选为：
													// 'horizontal' ¦ 'vertical'
						x: 'right',					// 水平安放位置，默认为全图右对齐，可选为：
													// 'center' ¦ 'left' ¦ 'right'
													// ¦ {number}（x坐标，单位px）
						y: 'top',					// 垂直安放位置，默认为全图顶端，可选为：
													// 'top' ¦ 'bottom' ¦ 'center'
													// ¦ {number}（y坐标，单位px）
						color : ['#1E90FF','#22BB22','#4B0082','#D2691E'],
						backgroundColor: 'rgba(0,0,0,0)',	// 工具箱背景颜色
						borderColor: '#CCC',		// 工具箱边框颜色
						borderWidth: 0,				// 工具箱边框线宽，单位px，默认为0（无边框）
						padding: 5,					// 工具箱内边距，单位px，默认各方向内边距为5，
						showTitle: true,
						feature : {
							dataView : {
								show : true,
								title : '数据视图',
								readOnly: true,
								lang : ['数据视图', '关闭', '刷新'],
								optionToContent: function(opt) {
									var series = opt.series;
									var seriesData = opt.series[0].data;
									var table = '<div style="height:100%;overflow-y: scroll;"><table style="width:100%;text-align:center;"><tbody><tr>'
												+ '<td>时间</td>'
												+ '<td>运营商</td>'
												+ '<td>' + series[0].name + '</td>'
												+ '</tr>';
									for (var i = 0, l = seriesData.length; i < l; i++) {
										table += '<tr><td>' + result[i].time + '</td>'
												+ '<td>' + seriesData[i].name + '</td>'
												+ '<td>' + series[0].data[i].value + '</td>'
												+ '</tr>';
									}
									table += '</tbody></table></div>';
									return table;
								}
							},
							magicType: {
								show : true,
								title : {
									pie : '动态类型切换-饼图',
									funnel : '动态类型切换-漏斗图'
								},
								type : ['pie', 'funnel'],
								option: {
									funnel: {
										x: '25%',
										width: '50%',
										funnelAlign: 'left',
										max: 1548
									}
								}
							},
							restore : {
								show : true,
								title : '还原',
								color : 'black'
							},
							saveAsImage : {
								show : true,
								title : '保存为图片',
								type : 'jpeg',
								lang : ['点击本地保存']
							}
						}
					},
					tooltip: {
						trigger: 'item',
						formatter: function(value){
							return value.name +
								"<br/><span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:"
								+ value.color + "'></span>" + value.seriesName + " : " + value.value + " (" + value.percent + "%)"
						}
					},
					legend: {
						orient : 'vertical',
						x : 'left',
						data: serviceproviders
					},
					calculable : true,
					grid: {
						left: '2%',
						right: '2%',
						bottom: '5%',
						containLabel: true
					},
					series: [{
						name: '购票次数',
						type: 'pie',
						radius : '55%',
						center: ['50%', '60%'],
						data: countserviceproviders	,
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]
				};
			
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
			}else{
				$.messager.alert('错误提示', '数据查询失败！', 'error');
			}
		}
	}
	sendAjaxRequest(options);
	
	var params = serializeJson("conditionForm");
	// 加载表格
	$('#OperatorsByTicketTable').datagrid({
		url : 'queryOperatorByTicketCount.action',
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : false,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		showHeader : true,
		fitColumns : true,// 列自适应表格宽度
		striped : true,// 当true时，单元格显示条纹
		rownumbers : false,// 是否显示行号
		singleSelect : true,// 是否只能选中一条
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
			width : 5
		}, {
			field : 'time',
			title : '时间',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'serviceprovider',
			title : '运营商',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'countserviceprovider',
			title : '购票次数',
			align : 'center',
			formatter : baseFormater,
			width : 100
		} ] ]
	});
}

/** --------加载树形 ------ */
function ajaxTree() {
}

/** --------根据页面宽度重置表格宽度 ------ */
window.onresize = function() {
	setTimeout("myChart.resize()",100);
	$('#OperatorsByTicketTable').datagrid('resize');
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

/** -------- 导出 ------ */
function exportOperatorByTicketCount() {
	var data = $('#OperatorsByTicketTable').datagrid('getData');
	var sdate = $('#startdate').datebox('getValue');
	var edate = $('#enddate').datebox('getValue');
	var keys = ['startdate','enddate'];
	var values = [sdate,edate];
	var count = data.rows.length;
	if(count>0){
		openWindowWithPost('exportOperatorByTicketCount.action',keys,values);
	}else{
		$.messager.alert('错误提示', '请查询出记录再导出', 'error');
	}
}

/** -------- 重置查询条件 ------ */
function queryOrderReset() {
	$('#conditionForm').form('clear');
	$('#sourceid').val('sdal');
	initDatebox();
}
