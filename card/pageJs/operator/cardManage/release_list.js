
/**
 * 分页加载器
 */
var releaseList = (function() {
    var obj = {};
    var pageBar = $("#pageTab");
    var tableBody = $("#dataList");
    var queryPageUtil = new PageUtils( pageBar, tableBody);
    obj.data = [];//当前列数据
    obj.loadQuery = function(page, removeIfEmpty) {
        queryPageUtil.loadPage(page,
            '/operators/selectOperators',
            {
                'beginDate'  : $("#beginDate").val(),
                'endDate'    : $("#endDate").val(),
                'brand'      : $("#brand option:selected").val(),
                'searchText' : $("#searchText").val(),
                'type'       : $("#type option:selected").val()
            },
            function(jsonResponse) {

                var pagination = jsonResponse['jbody']['pageInfo'];
                tableBody.html('');
                if (!pagination['list'] || pagination['list'].length == 0){
                    //tools.toastr("无符合的搜索内容","提示信息", 'warning')
                    return;
                }
                //pagination['list'].reverse();
                obj.data = pagination['list'];
                $(pagination['list']).each(function(index, item){
                    var html = '<tr class="animated fadeIn">';

                    html += '</tr>';
                    $(html).appendTo(tableBody);
                });
                tableBody.parent().trimTextLength();
                tools.tooltipInit();
            },
            null,
            removeIfEmpty
        );
    };

    /**
     * 下载记录
     * @param id
     */
    obj.download = function( id ){
        if( obj.data[id] ){
            return false;
        }
        var info = obj.data[id];


    };

    return obj;
})();

$(document).ready(function(){

    tools.tooltipInit();


    //日期选择变更
    $("#dateRange").on('change', function(){
        var type = $("#dateRange option:selected").val();

        switch( type ){
            case '1':
                //今天
                $("#beginDate").val( new Date().format('yyyy-MM-dd') );
                $("#endDate"  ).val( new Date().format('yyyy-MM-dd') );
                break;
            case '2':
                //昨天
                var date = new Date();
                date.setDate(date.getDate() - 1);
                $("#beginDate").val( date.format('yyyy-MM-dd') );
                $("#endDate"  ).val( date.format('yyyy-MM-dd') );
                break;
            case '3':
                //本月

                //本月第1天
                var date = new Date();
                date.setDate(1);
                $("#beginDate").val( date.format('yyyy-MM-dd') );

                //本月最后一天
                var date = new Date();
                var currentMonth = date.getMonth();
                var nextMonth =++ currentMonth;
                var nextMonthFirstDay = new Date(date.getFullYear(),nextMonth,1);
                var oneDay=1000*60*60*24;
                $("#endDate").val( new Date(nextMonthFirstDay-oneDay).format('yyyy-MM-dd') );

                break;
            case '4':
                //过去7天
                var date = new Date();
                date.setDate(date.getDate() - 7);
                $("#beginDate").val( date.format('yyyy-MM-dd') );
                $("#endDate"  ).val( new Date().format('yyyy-MM-dd') );
                break;
            case '5':
                //过去30天
                var date = new Date();
                date.setDate(date.getDate() - 30);
                $("#beginDate").val( date.format('yyyy-MM-dd') );
                $("#endDate"  ).val( new Date().format('yyyy-MM-dd') );
                break;
        }

        //obj.loadQuery(1);//加载新数据
    });

    //releaseList.loadQuery(1);
    $("#search").click(function(){
        releaseList.loadQuery(1);
    });

    $("#type").on('change', function(){
        console.log( $("#type option:selected").val() );
        //releaseList.loadQuery(1);
    });


    //日期初始化
    $('.input-group.date').datepicker({
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        format: "yyyy-mm-dd"
    });
});