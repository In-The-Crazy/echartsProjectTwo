var myChart;
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
		url : 'querySeatSelect.action',
		data : "startdate="+sdate+"&enddate="+edate,
		callBackFun : function(data) {
			myChart.hideLoading();
			if(data.isSuccessOrfail='SUCCESS'){
				result = data.rows;
				var seats = new Array();
				var seatCounts = new Array();
				$.each(result, function(i, value){
					seats[i] = value.seat;
					seatCounts[i] = value.seatCount;
				});
				
				
				// 指定图表的配置项和数据
				var option = {
					title: {
						text: '舱位选择倾向性分析'
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
							dataZoom : {
								show : true,
								title : {
									dataZoom : '区域缩放',
									dataZoomReset : '区域缩放-后退'
								}
							},
							dataView : {
								show : true,
								title : '数据视图',
								readOnly: true,
								lang : ['数据视图', '关闭', '刷新'],
								optionToContent: function(opt) {
									var axisData = opt.xAxis[0].data;
									var series = opt.series;
									var table = '<div style="height:100%;overflow-y: scroll;"><table style="width:100%;text-align:center;"><tbody><tr>'
												+ '<td>航线名称</td>'
												+ '<td>' + series[0].name + '</td>'
												+ '</tr>';
									for (var i = 0, l = axisData.length; i < l; i++) {
										table += '<tr><td>' + axisData[i] + '</td>'
												+ '<td>' + series[0].data[i] + '</td>'
												+ '</tr>';
									}
									table += '</tbody></table></div>';
									return table;
								}
							},
							magicType: {
								show : true,
								title : {
									line : '动态类型切换-折线图',
									bar : '动态类型切换-柱形图',
								},
								type : ['line', 'bar']
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
						trigger: 'axis',
						axisPointer : {            // 坐标轴指示器，坐标轴触发有效
							type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					legend: {
						data:['预订次数']
					},
					grid: {
						left: '2%',
						right: '2%',
						bottom: '5%',
						containLabel: true
					},
					xAxis: {
						type : 'category',
						data: seats
					},
					yAxis: {
						type : 'value'
					},
					series: [{
						name: '预订次数',
						type: 'bar',
						barWidth: 20,
						itemStyle:{
							normal: {
								color: '#1E90FF'
							}
						},
						data: seatCounts
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
	$('#seatSelectStatsTable').datagrid({
		url : 'querySeatSelect.action',
		checkOnSelect : true,// 是否选中/取消复选框
		pagination : true,// 是否分页
		autoRowHeight : false,// 定义是否设置基于该行内容的行高度
		showHeader : true,
		pageNumber : 1,
		pageSize : 20,
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
			field : 'seat',
			title : '舱位',
			align : 'center',
			formatter : baseFormater,
			width : 100
		}, {
			field : 'seatCount',
			title : '预订次数',
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
	$('#seatSelectStatsTable').datagrid('resize');
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
function exportSeatSelect() {
	var data = $('#seatSelectStatsTable').datagrid('getData');
	var sdate = $('#startdate').datebox('getValue');
	var edate = $('#enddate').datebox('getValue');
	var keys = ['startdate','enddate'];
	var values = [sdate,edate];
	var count = data.rows.length;
	if(count>0){
		openWindowWithPost('exportSeatSelect.action',keys,values);
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
