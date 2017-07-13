

var dataSell = (function() {
    var obj = {};

    //数据存储
    obj.data = [];

    //累计数据初始化
    obj.sellAllCnt = 0;
    obj.sellAllMoney = 0;
    obj.sellOnlineCnt = 0;
    obj.sellOfflineCnt = 0;
    obj.sellOnlineMoney = 0;
    obj.sellOfflineMoney = 0;

    //图表数据初始化
    obj.chart = {};


    /**
     * 页面数据加载
     */
    obj.loadData = function() {

        //累计数据初始化
        obj.sellAllCnt = 0;
        obj.sellAllMoney = 0;
        obj.sellOnlineCnt = 0;
        obj.sellOfflineCnt = 0;
        obj.sellOnlineMoney = 0;
        obj.sellOfflineMoney = 0;

        //图表数据初始化
        obj.chart = {
            xAxis : [],
            legend  : [
                ['售出总数(张)', '在线售出总数(张)', '线下转账售出总数(张)'],
                ['售出总额(元)', '在线售出总额(元)', '线下转账售出总额(元)']
            ],
            yAxis : [
                [
                    {
                        'name'  : '售出总数(张)',
                        'type'  : 'line',
                        'data'  : []
                    },
                    {
                        'name'  : '在线售出总数(张)',
                        'type'  : 'line',
                        'data'  : []
                    },
                    {
                        'name'  : '线下转账售出总数(张)',
                        'type'  : 'line',
                        'data'  : []
                    }
                ],
                [
                    {
                        'name'  : '售出总额(元)',
                        'type'  : 'line',
                        'data'  : []
                    },
                    {
                        'name'  : '在线售出总额(元)',
                        'type'  : 'line',
                        'data'  : []
                    },
                    {
                        'name'  : '线下转账售出总额(元)',
                        'type'  : 'line',
                        'data'  : []
                    }
                ]
            ]
        };


        var url = '/report/selectGetCard';
        var data = {
            operatorsId: JSON.parse( getCookie('card.userinfo')).operatorsId,
            beginDate: $("#beginDate").val(),
            endDate: $("#endDate").val()
        };
        if( data.beginDate == '' || data.endDate == '' ){
            tools.toastr( '请选择时间', '', 'error' );
            return false;
        };
        
        
        http.post(url, data, function( res ){
            $("#tableData").html( '' );
            if( res.statusCode == 0 ){
                //组装table数据
                if( res.jbody.pageInfo && tools.isArray( res.jbody.pageInfo ) && res.jbody.pageInfo.length > 0 ){

                    obj.data = res.jbody.pageInfo;

                    var html = '';
                    html += '<table class="table table-bordered table-hover" id="footable">';
                    html += '   <thead>';
                    html += '        <tr>';
                    html += '           <th rowspan="2">日期</th>';
                    html += '           <th colspan="2" style="text-align: center;">售出总数(张)</th>';
                    html += '           <th colspan="2" style="text-align: center;">售出总金额(元)</th>';
                    html += '           <th rowspan="2">操作</th>';
                    html += '       </tr>';
                    html += '       <tr>';
                    html += '           <th>在线售出总数(张)</th>';
                    html += '           <th>线下转账售出总数(张)</th>';
                    html += '           <th>在线售出总额(元)</th>';
                    html += '           <th>线下转账售出总额(元)</th>';
                    html += '       </tr>';
                    html += '   </thead>';
                    html += '   <tbody>';

                    $(obj.data).each(function( index, item ){

                        html += '<tr>';
                        html += '   <td>' + item.reportDateStr          + '</td>';
                        html += '   <td>' + item.sellOnlineCnt          + '</td>';
                        html += '   <td>' + item.sellOfflineCnt         + '</td>';
                        html += '   <td>' + item.sellOnlineMoney/100.0  + '</td>';
                        html += '   <td>' + item.sellOfflineMoney/100.0 + '</td>';
                        html += '   <td>';
                        html += '       <a class="icon-only text-info" data-toggle="tooltip" title="下载记录明细" onclick="dataSell.download(' + index + ')"><i class="fa fa-download"></i></a>';
                        html += '   </td>';
                        html += '</tr>';

                        //组装累计数据
                        obj.sellOnlineCnt    += item.sellOnlineCnt;
                        obj.sellOfflineCnt   += item.sellOfflineCnt;
                        obj.sellOnlineMoney  += item.sellOnlineMoney;
                        obj.sellOfflineMoney += item.sellOfflineMoney;

                        //生成图表数据
                        obj.chart.xAxis.push( item.reportDateStr );
                        obj.chart.yAxis[0][0].data.push( item.sellOnlineCnt + item.sellOfflineCnt );
                        obj.chart.yAxis[0][1].data.push( item.sellOnlineCnt );
                        obj.chart.yAxis[0][2].data.push( item.sellOfflineCnt );
                        obj.chart.yAxis[1][0].data.push( (item.sellOnlineMoney + item.sellOfflineMoney)/100.0 );
                        obj.chart.yAxis[1][1].data.push( item.sellOnlineMoney/100.0 );
                        obj.chart.yAxis[1][2].data.push( item.sellOfflineMoney/100.0 );

                    });

                    html += '   </tbody>';
                    html += '   <tfoot><tr><td colspan="6"><ul class="pagination pull-right"></ul></td></tr></tfoot>';
                    html += '</table>';
                    $(html).appendTo( $("#tableData") );
                    $('#footable').footable();
                    tools.tooltipInit();

                    //组装累计数据
                    obj.sellAllCnt   = (obj.sellOnlineCnt   + obj.sellOfflineCnt);
                    obj.sellAllMoney = (obj.sellOnlineMoney + obj.sellOfflineMoney);

                    //显示累计数据
                    $("#sellAllCnt"      ).html( obj.sellAllCnt             );
                    $("#sellAllMoney"    ).html( obj.sellAllMoney/100.0     );
                    $("#sellOnlineCnt"   ).html( obj.sellOnlineCnt          );
                    $("#sellOfflineCnt"  ).html( obj.sellOfflineCnt         );
                    $("#sellOnlineMoney" ).html( obj.sellOnlineMoney/100.0  );
                    $("#sellOfflineMoney").html( obj.sellOfflineMoney/100.0 );

                    var panelList = $(".panel-list-1");

                    //第一个框选中
                    panelList.removeClass( 'panel-primary' );
                    panelList.addClass( 'panel-default' );
                    $(panelList[0]).removeClass( 'panel-default' );
                    $(panelList[0]).addClass( 'panel-primary' );

                    //显示第一个图表
                    chartFunc.generate( document.getElementById('lineChart'), obj.chart.legend[0], obj.chart.xAxis , obj.chart.yAxis[0] );
                    //切换图表显示
                    panelList.each(function( index, item ){
                        $(item).click(function(){
                            if( !$(this).hasClass( 'panel-primary' ) ){
                                panelList.removeClass( 'panel-primary' );
                                panelList.addClass( 'panel-default' );

                                $(this).removeClass( 'panel-default' );
                                $(this).addClass( 'panel-primary' );

                                chartFunc.generate( document.getElementById('lineChart'), obj.chart.legend[index], obj.chart.xAxis , obj.chart.yAxis[index] );
                            }
                        });
                    });
                }
            }else{
                tools.toastr( res.msg, '', 'error' );
            }


        });

    };

    /**
     * 下载记录
     * @param index
     */
    obj.download = function( index ){
        if( !obj.data[index] ){
            return false;
        }
        var info = obj.data[index];
        var operatorsId = JSON.parse( getCookie("card.userinfo") ).operatorsId;
        location.href = http.getFullUrl() + '/rest/report/exportGetCard?operatorsId=' + operatorsId + '&beginDate=' + info.reportDateStr + '&endDate=' + info.reportDateStr;
    };




    return obj;
})();


var dataUse = (function(){
    var obj = {};

    obj.data = [];

    //累计数据初始化
    obj.actualBalanceMoney = 0;
    obj.discountCTimes = 0;
    obj.discountCMoney = 0;
    obj.discountDTimes = 0;
    obj.discountDMoney = 0;
    obj.discountTTimes = 0;

    obj.chart = {};

    /**
     * 页面数据加载
     */
    obj.loadData = function(){
        //累计数据初始化
        obj.actualBalanceMoney = 0;
        obj.discountCTimes = 0;
        obj.discountCMoney = 0;
        obj.discountDTimes = 0;
        obj.discountDMoney = 0;
        obj.discountTTimes = 0;

        //图表数据初始化
        obj.chart = {
            xAxis : [],
            legend  : [
                ['余额使用总额(元)'],
                ['折扣券使用总数(张)', '折扣券抵扣总额(元)'],
                ['折扣使用总次数(次)', '折扣抵扣总金额(元)'],
                ['门票使用总次数(次)']
            ],
            yAxis : [
                [
                    {
                        'name'  : '余额使用总额(元)',
                        'type'  : 'line',
                        'data'  : []
                    }
                ],
                [
                    {
                        'name'  : '折扣券使用总数(张)',
                        'type'  : 'line',
                        'data'  : []
                    },
                    {
                        'name'  : '折扣券抵扣总额(元)',
                        'type'  : 'line',
                        'data'  : []
                    }
                ],
                [
                    {
                        'name'  : '折扣使用总次数(次)',
                        'type'  : 'line',
                        'data'  : []
                    },
                    {
                        'name'  : '折扣抵扣总金额(元)',
                        'type'  : 'line',
                        'data'  : []
                    }
                ],
                [
                    {
                        'name'  : '门票使用总次数(次)',
                        'type'  : 'line',
                        'data'  : []
                    }
                ]
            ]
        };


        var url = '/report/selectUseCard';
        var data = {
            operatorsId: JSON.parse( getCookie('card.userinfo')).operatorsId,
            beginDate: $("#beginDate2").val(),
            endDate: $("#endDate2").val()
        };
        http.post(url, data, function( res ){
            $("#tableData2").html( '' );
            if( res.jbody.pageInfo && tools.isArray( res.jbody.pageInfo ) && res.jbody.pageInfo.length > 0 ) {

                obj.data = res.jbody.pageInfo;

                var html = '';


                html += '<table class="table table-bordered table-hover" id="footable2">';
                html += '   <thead>';
                html += '       <tr>';
                html += '           <th rowspan="2">日期</th>';
                html += '           <th rowspan="2">余额使用总额</th>';
                html += '           <th colspan="2" style="text-align: center;">折扣券</th>';
                html += '           <th colspan="2" style="text-align: center;">折扣</th>';
                html += '           <th rowspan="2">门票使用总次数</th>';
                html += '           <th rowspan="2">操作</th>';
                html += '       </tr>';
                html += '       <tr>';
                html += '           <th>使用总数(张)</th>';
                html += '           <th>抵扣总额(元)</th>';
                html += '           <th>使用总次数(次)</th>';
                html += '           <th>抵扣总额(元)</th>';
                html += '       </tr>';
                html += '   </thead>';
                html += '   <tbody>';

                $(obj.data).each(function( index, item ){

                    html += '<tr>';
                    html += '   <td>' + item.reportDateStr               + '</td>';
                    html += '   <td>' + item.actualBalanceMoney/100.0 + '</td>';
                    html += '   <td>' + item.discountCTimes           + '</td>';
                    html += '   <td>' + item.discountCMoney/100.0     + '</td>';
                    html += '   <td>' + item.discountDTimes           + '</td>';
                    html += '   <td>' + item.discountDMoney/100.0     + '</td>';
                    html += '   <td>' + item.discountTTimes           + '</td>';
                    html += '   <td>';
                    html += '       <a class="icon-only text-info" data-toggle="tooltip" title="下载记录明细" onclick="dataUse.download(' + index + ')"><i class="fa fa-download"></i></a>';
                    html += '   </td>';
                    html += '</tr>';

                    //组装累计数据
                    obj.actualBalanceMoney += item.actualBalanceMoney;
                    obj.discountCTimes     += item.discountCTimes;
                    obj.discountCMoney     += item.discountCMoney;
                    obj.discountDTimes     += item.discountDTimes;
                    obj.discountDMoney     += item.discountDMoney;
                    obj.discountTTimes     += item.discountTTimes;

                    ////生成图表数据
                    obj.chart.xAxis.push( item.reportDateStr );
                    obj.chart.yAxis[0][0].data.push( item.actualBalanceMoney/100.0 );
                    obj.chart.yAxis[1][0].data.push( item.discountCTimes           );
                    obj.chart.yAxis[1][1].data.push( item.discountCMoney/100.0     );
                    obj.chart.yAxis[2][0].data.push( item.discountDTimes           );
                    obj.chart.yAxis[2][1].data.push( item.discountDMoney/100.0     );
                    obj.chart.yAxis[3][0].data.push( item.discountTTimes           );

                });
                html += '   </tbody>';
                html += '   <tfoot><tr><td colspan="8"><ul class="pagination pull-right"></ul></td></tr></tfoot>';
                html += '</table>';



                $(html).appendTo( $("#tableData2") );
                $('#footable2').footable();
                tools.tooltipInit();

                //显示累计数据
                $("#actualBalanceMoney").html( obj.actualBalanceMoney/100.0 );
                $("#discountCTimes"    ).html( obj.discountCTimes           );
                $("#discountCMoney"    ).html( obj.discountCMoney/100.0     );
                $("#discountDTimes"    ).html( obj.discountDTimes           );
                $("#discountDMoney"    ).html( obj.discountDMoney/100.0     );
                $("#discountTTimes"    ).html( obj.discountTTimes           );


                var panelList = $(".panel-list-2");
                //第一个框选中
                panelList.removeClass( 'panel-primary' );
                panelList.addClass( 'panel-default' );
                $(panelList[0]).removeClass( 'panel-default' );
                $(panelList[0]).addClass( 'panel-primary' );
                //显示第一个图表
                chartFunc.generate( document.getElementById('lineChart2'), obj.chart.legend[0], obj.chart.xAxis , obj.chart.yAxis[0] );

                //切换图表显示
                $(panelList).each(function( index, item ){
                    $(item).click(function(){
                        if( !$(this).hasClass( 'panel-primary' ) ){
                            $(panelList).removeClass( 'panel-primary' );
                            $(panelList).addClass( 'panel-default' );

                            $(this).removeClass( 'panel-default' );
                            $(this).addClass( 'panel-primary' );

                            chartFunc.generate( document.getElementById('lineChart2'), obj.chart.legend[index], obj.chart.xAxis , obj.chart.yAxis[index] );
                        }
                    });
                });

            }
        });
    };

    /**
     * 下载记录
     * @param index
     */
    obj.download = function( index ){
        if( !obj.data[index] ){
            return false;
        }
        var info = obj.data[index];
        var operatorsId = JSON.parse( getCookie("card.userinfo") ).operatorsId;
        location.href = http.getFullUrl() + '/rest/report/exportUseCard?operatorsId=' + operatorsId + '&beginDate=' + info.reportDateStr + '&endDate=' + info.reportDateStr;
    };

    return obj;
})();

/**
 * 导出运营数据
 */
var exportData = (function(){
    var obj = {};
    obj.type = 1;  //1:售卖数据, 0:使用数据

    obj.export = function(){
        var operatorsId = JSON.parse( getCookie("card.userinfo") ).operatorsId;
        var beginDate = $("#beginDateExport").val();
        var endDate = $("#endDateExport").val();
		var cardSelect = $("#cardSelect").val();
        obj.type = $("input[name='dataType']:checked").val();

        if( beginDate == '' || endDate == '' ){
            tools.toastr( '请选择时间', '', 'error' );
        }else{
            var url = '';
            if( obj.type == 1 ){
                url = '/rest/report/exportGetCard';
            }else{
                url = '/rest/report/exportUseCard';
            }

            location.href = http.getFullUrl() + url + '?operatorsId=' + operatorsId + '&cardId=' + cardSelect  + '&beginDate=' + beginDate  + '&endDate=' + endDate;

        }
    };

    /**
     * 获取可发放通行权益列表
     */
    obj.getCardList = function(){
        var url = '/unionCard/selectUnionCard';
        var data = {
            'status'     : 2,//-已上线售卖（前端可见，可购买）
            'operatorsId': JSON.parse( getCookie("card.userinfo") ).operatorsId,
            'pageSize'   : 1000,
            'pageNum'    : 1
        };
        http.post( url, data, function( res ){
            if( res.statusCode == 0 ){
                if( res.jbody.pageInfo.list && res.jbody.pageInfo.list.length > 0 ){
                    var cardList = res.jbody.pageInfo.list;
                    var html = '';
                    $(cardList).each(function( index, item ){
                        html += '<option value="' + item.id + '">';
                        html += item.cardName;
                        html += '</option>';
                    });
                    $(html).appendTo( $("#cardSelect") );
                }
            }else{
                tools.toastr( res.msg, '', 'error' );
            }
        });

    };

    return obj;
})();

/**
 * 图表封装
 */
var chartFunc = (function(){
    var obj = {};

    /**
     * 生成图表
     * @param domObj
     * @param legend
     * @param xAxis
     * @param yAxis
     */
    obj.generate = function( domObj, legend ,xAxis, yAxis ){
        var myChart = echarts.init( domObj );

        var option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                //data : ['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
                data : legend
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                //data: ['周一','周二','周三','周四','周五','周六','周日']
                data : xAxis
            },
            yAxis: {
                type: 'value'
            },
            //series: [
            //    {
            //        name:'邮件营销',
            //        type:'line',
            //        data:[120, 132, 101, 134, 90, 230, 210]
            //    },
            //    {
            //        name:'联盟广告',
            //        type:'line',
            //        data:[220, 182, 191, 234, 290, 330, 310]
            //    },
            //    {
            //        name:'视频广告',
            //        type:'line',
            //        data:[150, 232, 201, 154, 190, 330, 410]
            //    },
            //    {
            //        name:'直接访问',
            //        type:'line',
            //        data:[320, 332, 301, 334, 390, 330, 320]
            //    },
            //    {
            //        name:'搜索引擎',
            //        type:'line',
            //        data:[820, 932, 901, 934, 1290, 1330, 1320]
            //    }
            //]
            series: yAxis
        };

        myChart.setOption(option);
    };

    return obj;
})();


var dateFunc = (function(){
    var obj = {};

    /**
     * 日期变更事件
     * @param type
     * @param beginDate
     * @param endDate
     */
    obj.switchDate = function( type, beginDate, endDate ,loadData){
		console.log(type);
        var date = new Date();
        switch( type ){
            case '1':
                //昨天
                date = new Date();
                date.setDate(date.getDate() - 1);
                $(beginDate).val( date.format('yyyy-MM-dd') );
                $(endDate  ).val( date.format('yyyy-MM-dd') );
                
                if(typeof loadData == 'function' ){
                	loadData();
                }
                break;
            case '2':
                //过去3天
                date = new Date();
                date.setDate(date.getDate() - 1);
                $(endDate  ).val( date.format('yyyy-MM-dd') );

                date.setDate(date.getDate() - 2);
                $(beginDate).val( date.format('yyyy-MM-dd') );
                
                if(typeof loadData == 'function' ){
                	loadData();
                }
                
                break;
            case '3':
                //过去7天
                date = new Date();
                date.setDate(date.getDate() - 1);
                $(endDate  ).val( date.format('yyyy-MM-dd') );

                date.setDate(date.getDate() - 6);
                $(beginDate).val( date.format('yyyy-MM-dd') );
                
                if(typeof loadData == 'function' ){
                	loadData();
                }
                break;
            case '4':
                //本月

                //本月第1天
                date = new Date();
                date.setDate(1);
                $(beginDate).val( date.format('yyyy-MM-dd') );

                //本月最后一天
//              date = new Date();
//              var currentMonth = date.getMonth();
//              var nextMonth =++ currentMonth;
//              var nextMonthFirstDay = new Date(date.getFullYear(),nextMonth,1);
//              var oneDay=1000*60*60*24;
//              $(endDate).val( new Date(nextMonthFirstDay-oneDay).format('yyyy-MM-dd') );
                
                date = new Date();
                date.setDate(date.getDate() - 1);
                $(endDate  ).val( date.format('yyyy-MM-dd') );
                
                if(typeof loadData == 'function' ){
                	loadData();
                }
                break;
            case '5':
                //过去30天
				date = new Date();
                date.setDate(date.getDate() - 1);
                $(endDate  ).val( date.format('yyyy-MM-dd') );

                date.setDate(date.getDate() - 29);
                $(beginDate).val( date.format('yyyy-MM-dd') );
                
                if(typeof loadData == 'function' ){
                	loadData();
                }
                break;
        }
    };

    return obj;
})();


$(document).ready(function(){


    var date = new Date();
    var maxDate2 = date.setDate(date.getDate());
    var maxDate = date.setDate(date.getDate() - 1);
    var minDate = date.setDate(date.getDate() - 89);
    //日期初始化
    $('.input-group1 .input-group.date').datepicker({
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        format: "yyyy-mm-dd",
        startDate: tools.getFormatTime( minDate, 'yyyy-MM-dd' ),
        endDate: tools.getFormatTime( maxDate, 'yyyy-MM-dd' )

    });
    $('.input-group2 .input-group.date').datepicker({
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        format: "yyyy-mm-dd",
        startDate: tools.getFormatTime( minDate, 'yyyy-MM-dd' ),
        endDate: tools.getFormatTime( maxDate2, 'yyyy-MM-dd' )
    });

    tools.icheckInit();
    exportData.getCardList();

    //$("#cardSelect").select2({
    //    placeholder: "选择需要发放的通行权益",
    //    allowClear: true,
    //    width     : 300
    //});

    $(".lastTime").html( tools.getFormatTime( maxDate, 'yyyy-MM-dd' ) );



    //$("input[name='dataType']").on('ifChanged',function(){
    //    var value = $("input[name='smsSendStatus']:checked").val();
    //    if( value != undefined ){
    //        //console.log(value);
    //        exportData.setType( value );
    //        //if(value==1){
    //        //    exportData.type = value;
    //        //}else if(value==0){
    //        //    exportData.type = value;
    //        //}
    //    }
    //
    //});

    //初始化数据
    dateFunc.switchDate( $("input[name='dateRange']:checked").val(), $("#beginDate"), $("#endDate"), function(){dataSell.loadData()} );
    $("#newTab").click(function(){
    	dateFunc.switchDate( $("input[name='dateRange2']:checked").val(), $("#beginDate2"), $("#endDate2"), function(){dataUse.loadData()} );
	});
    
    //日期选择变更
    $("#dateRange label:not([class='active'])").click(function(){
         dateFunc.switchDate( $(this).find("input").val(), $("#beginDate"), $("#endDate"), function(){dataSell.loadData()} );
    });
    //日期选择变更
    $("#dateRange2 label:not([class='active'])").click(function(){
        dateFunc.switchDate( $(this).find("input").val(), $("#beginDate2"), $("#endDate2"), function(){dataUse.loadData()} );
    });

    

});