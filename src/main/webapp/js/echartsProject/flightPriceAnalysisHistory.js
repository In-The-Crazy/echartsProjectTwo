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
    var daysAgo = new Date(todayTwo.getTime()-30*24*60*60*1000);
    var daysAgoTemp = daysAgo.pattern("yyyy-MM-dd");

    $('#takeOffTimeStart').datebox({
        label : '采集开始时间：',
        labelWidth : 100,
        labelAlign : 'right',
        width : 250,
        value : daysAgoTemp,
        editable : false,
        required : false
    });

    $('#takeOffTimeStart').datebox().datebox('calendar').calendar({
        validator: function(date){
            var now = new Date();
            var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            var temp = new Date(now.getTime()-30*24*60*60*1000);
            var d2 = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());
            return d2<=date && date<=d1;
        }
    });


    $('#takeOffTimeEnd').datebox({
        label : '采集结束时间：',
        labelWidth : 100,
        labelAlign : 'right',
        width : 250,
        value : today,
        editable : false,
        required : false
    });

    $('#takeOffTimeEnd').datebox().datebox('calendar').calendar({
        validator: function(date){
            var now = new Date();
            var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            var temp = new Date(now.getTime()-30*24*60*60*1000);
            var d2 = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());
            return d2<=date && date<=d1;
        }
    });

    $('#flightDate').datebox({
        label : '航班起飞时间：',
        labelWidth : 100,
        labelAlign : 'right',
        width : 250,
        value : today,
        editable : false,
        required : false
    });

    $('#flightDate').datebox().datebox('calendar').calendar({
        validator: function(date){
            var now = new Date();
            var temp1 = new Date(now.getTime()-30*24*60*60*1000);
            var d1 = new Date(temp1.getFullYear(), temp1.getMonth(), temp1.getDate());
            var temp = new Date(now.getTime()+30*24*60*60*1000);
            var d2 = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());
            return d2>=date && date>=d1;
        }
    });








}

/**
 * 加载树型
 */
function ajaxTree() {

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
    sendData.flightDate=$('#flightDate').datebox('getValue');
    var title = "历史航班运价分析"+"("+sendData.fromCity+"-"+sendData.arriveCity+")";

    if(queryType==1){
        sendData.queryType = '1';
        var firstLegendArray = [];
        var firstxArray = [];
        var firstSeriesArray = [];
        if(flag){

            $.ajax({
                type : 'post',
                async : false,
                url : root + '/mainSrv/flightPriceHistoryChart',
                dataType :'json',
                data: sendData,
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
                                showData.zws.push(item[0]+'|'+item[3])                            }
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
                text: title,
                left: '45%',
            },
            tooltip: {
                /*trigger: 'axis',*/
                trigger: 'item',
                formatter:function(params){//数据格式
                    var info =params.name+"</br>";
                    //var flightDate ='';
                    var zws ='';
                    for(var k=0;k<firstSeriesArray.length;k++){
                        if(params.seriesName == firstSeriesArray[k].name){
                            for(var j=0;j<firstSeriesArray[k].zws.length;j++){
                                var item = firstSeriesArray[k].zws[j].split("|");
                                if(item[0] == params.name) {
                                    //flightDate = item[2];
                                    zws = item[1];
                                    //info +="&nbsp;&nbsp;座位数："+ item[1];
                                }

                            }
                        }

                    }
                    info +="航班号："+params.seriesName+"&nbsp;&nbsp;价格："+params.value+"&nbsp;&nbsp;座位数："+ zws;
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
                y: 'middle',
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





