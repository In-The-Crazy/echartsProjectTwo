/** ----------------加载整体表格-------------------------* */
$(function() {
    // 初始化页面角色
    initPage();
    // 加载日历选择
    initDatebox();
    // 加载树型
    ajaxTree();
    // 加载图表数据
    ajaxTableAndCharts(1,false);
});


/** --------初始化页面模块 ------ */
function initPage() {

    $("#fromCity").textbox({
        label : '出发城市：',
        labelWidth : 100,
        labelAlign : 'right',
        width : 250
    });
    $("#arriveCity").textbox({
        label : '到达城市：',
        labelWidth : 100,
        labelAlign : 'right',
        width : 250
    });



}

/** --------加载日历选择 ------ */
function initDatebox() {
    var today = new Date();
    today = today.pattern("yyyy-MM-dd");
    var todayTwo = new Date();
    var daysAgo = new Date(todayTwo.getTime()+60*24*60*60*1000);
    var daysAgoTemp = daysAgo.pattern("yyyy-MM-dd");

    $('#takeOffTimeStart').datebox({
        label : '航班开始时间：',
        labelWidth : 100,
        labelAlign : 'right',
        width : 250,
        value : today,
        editable : false,
        required : false
    });

    $('#takeOffTimeStart').datebox().datebox('calendar').calendar({
        validator: function(date){
            var now = new Date();
            var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            var temp = new Date(now.getTime()+60*24*60*60*1000);
            var d2 = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());
            return d2>=date && date>=d1;
        }
    });

    $('#takeOffTimeEnd').datebox({
        label : '航班截止时间：',
        labelWidth : 100,
        labelAlign : 'right',
        width : 250,
        value : daysAgoTemp,
        editable : false,
        required : false
    });

    $('#takeOffTimeEnd').datebox().datebox('calendar').calendar({
        validator: function(date){
            var d1 = new Date(daysAgo.getFullYear(), daysAgo.getMonth(), daysAgo.getDate());
            var temp = new Date(daysAgo.getTime()-60*24*60*60*1000);
            var d2 = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());
            return d2<=date && date<=d1;
        }
    });







}

/**
 * 加载树型
 */
function ajaxTree() {
    $('#schedule').combobox({
        label : '班期：',
        labelWidth : 100,
        labelAlign : "right",
        data : [{
            "id" : "1",
            "text" : "星期一",
            "selected" : true
        },{
            "id" : "2",
            "text" : "星期二"
        },{
            "id" : "3",
            "text" : "星期三"
        },{
            "id" : "4",
            "text" : "星期四"
        },{
            "id" : "5",
            "text" : "星期五"
        },{
            "id" : "6",
            "text" : "星期六"
        },{
            "id" : "7",
            "text" : "星期日"
        }],
        valueField : 'id',
        textField:'text',
        width : 250,
        required : true,
        editable : false,
        multiple : true,
        limitToList : false
    });
}


/** --------加载图表数据 ------ */
function ajaxTableAndCharts(queryType,flag) {
    var date = getAll($('#takeOffTimeStart').datebox('getValue'),$('#takeOffTimeEnd').datebox('getValue'));

    var firstChart = echarts.init(document.getElementById('firstChart'),'roma');
    var firstOption;
    var start =0;
    var end =100;
    var sendData = {};
    sendData.fromCity=$('#fromCity').val();
    sendData.arriveCity=$('#arriveCity').val();
    sendData.takeOffTimeStart=$('#takeOffTimeStart').datebox('getValue');
    sendData.takeOffTimeEnd=$('#takeOffTimeEnd').datebox('getValue');
    sendData.schedule=$('#schedule').combobox('getValues').join(',');

    var params = {"fromCity":"TAO","arriveCity":"XMN","takeOffTime":"2019-03-07","intervalTime":"60"};
    //var params ={"fromCity":sendData.fromCity,"arriveCity":sendData.arriveCity,"takeOffTimeStart":sendData.takeOffTimeStart,"takeOffTimeEnd":sendData.takeOffTimeEnd,"schedule":sendData.schedule,"flightNo":sendData.flightNo};
    //date =["00-00","01-00","02-00","03-00","04-00","05-00","06-00","07-00","08-00","09-00","10-00","11-00","12-00","13-00","14-00","15-00","16-00","17-00","18-00","19-00","20-00","21-00","22-00","23-00"];
    var columns = [];
    var column = [];
    var columnObj = {};
    columnObj.field="rownumbers";
    columnObj.title="";
    columnObj.styler= rownumSytler,
        columnObj.align="center";
    columnObj.formatter=rownumFormater;
    columnObj.width=25;
    column.push(columnObj);
    var columnObj = {};
    columnObj.field="flightNo";
    columnObj.title="航班号";
    columnObj.align="center";
    columnObj.formatter=baseFormater;
    columnObj.width=100;
    column.push(columnObj);
    for(var i=0;i<date.length;i++){
        var columnObj = {};
        columnObj.field=date[i];
        columnObj.title=date[i];
        columnObj.align="center";
        columnObj.formatter=baseNumFormater;
        columnObj.width=120;
        column.push(columnObj);
    }

    columns.push(column);
    $('#queryTable').datagrid({
        checkOnSelect : true,// 是否选中/取消复选框
        pagination : true,// 是否分页
        autoRowHeight : true,// 定义是否设置基于该行内容的行高度
        pageNumber : 1,
        pageSize : 10,
        fitColumns : false,// 列自适应表格宽度
        striped : true,// 当true时，单元格显示条纹
        rownumbers : false,// 是否显示行号
        singleSelect : false,// 是否只能选中一条
        nowrap:true,
        loadMsg : '数据加载中,请稍后...',
        onLoadError : function() {
            alert('数据加载失败!');
        },
        onLoadSuccess : function(data) {
            console.log(data);
        },
        columns : columns
    });
    if(queryType==1){
        sendData.queryType = '1';
        var firstLegendArray = [];
        var firstxArray = [];
        var firstSeriesArray = [];
        if(flag){
            $('#queryTable').datagrid({
                url : root + '/mainSrv/flightPriceAnalysisFuture',
                checkOnSelect : true,// 是否选中/取消复选框
                pagination : true,// 是否分页
                autoRowHeight : true,// 定义是否设置基于该行内容的行高度
                pageNumber : 1,
                pageSize : 10,
                fitColumns : false,// 列自适应表格宽度
                striped : true,// 当true时，单元格显示条纹
                rownumbers : false,// 是否显示行号
                singleSelect : false,// 是否只能选中一条
                queryParams : params,
                nowrap:true,
                loadMsg : '数据加载中,请稍后...',
                onLoadError : function() {
                    alert('数据加载失败!');
                },
                onLoadSuccess : function(data) {
                    console.log(data);
                },
                columns : columns
            });

            $.ajax({
                type : 'post',
                async : false,
                url : root + '/mainSrv/queryChartOne',
                dataType :'json',
                data: {"fromCity":"TAO","arriveCity":"XMN","takeOffTime":"2019-03-07","intervalTime":"60","queryType":1},
                success : function(data) {
                    if (data != "-1") {
                        var num = 0;
                        for (var key in data) {
                            firstLegendArray.push(key);
                            var dataList = data[key];
                            var showData = {};
                            showData.name = key;
                            showData.type = 'line';
                            showData.data = [];
                            showData.zws = [];
                            for (var i = 0; i < dataList.length; i++) {
                                var item = dataList[i].split(",");
                                if(num==0){
                                    firstxArray.push(item[0]);
                                }
                                showData.data.push(item[2]);
                                showData.zws.push(item[0]+'-'+item[3])
                            }
                            firstSeriesArray.push(showData);
                            num++;
                        }
                    }
                }
            });
        }
        firstOption = {
            dataZoom : [
                {
                    type: 'slider',
                    show: true,
                    start: start,
                    end: end,
                    handleSize: 8
                },
                {
                    type: 'inside',
                    start: start,
                    end: end
                }
            ],
            title: {
                text: '远期航班运价分析',
                left: '15%',
            },
            tooltip: {
                /*trigger: 'axis',*/
                trigger: 'item',
                formatter:function(params){//数据格式
                    var info =params.name+"</br>";
                    info +="航班号："+params.seriesName+"&nbsp;&nbsp;价格："+params.value;
                    for(var k=0;k<firstSeriesArray.length;k++){
                        if(params.seriesName == firstSeriesArray[k].name){
                            for(var j=0;j<firstSeriesArray[k].zws.length;j++){
                                var item = firstSeriesArray[k].zws[j].split("-");
                                if(item[0] == params.name) {
                                    info +="&nbsp;&nbsp;座位数："+ item[1];
                                }

                            }
                        }

                    }
                    info+="</br>";
                    //排序显示所有信息
                    /*params.sort(compare("value"));
                     var info =params[0].name+"</br>";
                     for (var i=0;i<params.length;i++){
                     info +="航班号："+params[i].seriesName+"&nbsp;&nbsp;价格："+params[i].value;
                     for(var k=0;k<firstSeriesArray.length;k++){
                     if(params[i].seriesName == firstSeriesArray[k].name){
                     for(var j=0;j<firstSeriesArray[k].zws.length;j++){
                     var item = firstSeriesArray[k].zws[j].split("-");
                     if(item[0] == params[i].name) {
                     info +="&nbsp;&nbsp;座位数："+ item[1];
                     }

                     }
                     }

                     }

                     info+="</br>";
                     }*/
                    return info;
                }
            },
            legend: {
                orient: 'vertical',
                x: 'left',

                data:firstLegendArray
            },
            grid: {
                left: '15%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                },
                right:20
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: firstxArray
            },
            yAxis: {
                type: 'value',
                min: function(value) {
                    return value.min/2;
                },
                max: function(value) {
                    return value.max + value.min/2;
                }
            },
            series: firstSeriesArray
        };
        firstChart.setOption(firstOption);
    }

    window.onresize = function () {
        firstChart.resize();

    }
}

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

var compare = function (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (Number(val1) < Number(val2)) {
            return 1;
        } else if (Number(val1) > Number(val2)) {
            return -1;
        } else {
            return 0;
        }
    }
}

var compareDate = function (x,y) {
    x = x.replace(/-/g,'/');
    var xtimestamp = new Date(x).getTime();
    y = y.replace(/-/g,'/');
    var ytimestamp = new Date(y).getTime();
    if (Number(xtimestamp) < Number(ytimestamp)) {
        return -1;
    } else if (Number(xtimestamp) > Number(ytimestamp)) {
        return 1;
    } else {
        return 0;
    }
}

var compareNum = function (x, y) {
    if (Number(x) < Number(y)) {
        return 1;
    } else if (Number(x) > Number(y)) {
        return -1;
    } else {
        return 0;
    }
}

Date.prototype.format = function() {
    var s = '';		        　　　　　
    var mouth = (this.getMonth() + 1)>=10?(this.getMonth() + 1):('0'+(this.getMonth() + 1));
    var day = this.getDate()>=10?this.getDate():('0'+this.getDate());		        　　　　　
    s += this.getFullYear() + '-'; // 获取年份。		        　　　　　
    s += mouth + "-"; // 获取月份。		        　　　　　
    s += day; // 获取日。		        　　　　　
    return (s); // 返回日期。		    　　
};

function getAll(begin, end) {		    	　　　　
    var arr = [];		        　　　　
    var ab = begin.split("-");		        　　　　
    var ae = end.split("-");		        　　　　
    var db = new Date();		        　　　　
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);		        　　　　
    var de = new Date();		        　　　　
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);		        　　　　
    var unixDb = db.getTime() - 24 * 60 * 60 * 1000;		        　　　　
    var unixDe = de.getTime() - 24 * 60 * 60 * 1000;		        　　　　
    for (var k = unixDb; k <= unixDe;) {		            　　　　　　
        //console.log((new Date(parseInt(k))).format());		            　　　　　　
        k = k + 24 * 60 * 60 * 1000;		            　　　　　　
        arr.push((new Date(parseInt(k))).format());		        　　　
    }		        　　　　
    return arr;
}





