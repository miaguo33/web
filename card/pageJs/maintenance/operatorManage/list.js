/**
 * 分页加载器
 */
var query = (function() {
    var obj = {};
    var pageBar = $("#pageTab");
    var tableBody = $("#dataList");
    var queryPageUtil = new PageUtils( pageBar, tableBody);
    obj.loadQuery = function(page, removeIfEmpty) {
        queryPageUtil.loadPage(page,
            '/operators/selectOperators',
            {
                'searchText' : $("#searchText").val()
            },
            function(jsonResponse) {

                var pagination = jsonResponse['jbody']['pageInfo'];
                tableBody.html('');
                if (!pagination['list'] || pagination['list'].length == 0){
                    //tools.toastr("无符合的搜索内容","提示信息", 'warning')
                    return;
                }
                //pagination['list'].reverse();
                $(pagination['list']).each(function(index, item){
                    var html = '<tr class="animated fadeIn">';
                    html += '<td>' + item.operatorsName + '</td>';
                    html += '<td>';
                    //html += '<a class="icon-only text-muted" data-toggle="tooltip" data-id="' + item.id + '" title="详情"><i class="fa fa-list-alt"></i></a>';
                    html += '<a class="icon-only text-muted" data-toggle="tooltip" data-id="' + item.id + '" title="编辑" onclick="query.toEdit(\'' + item.id + '\');"><i class="fa fa-edit"></i></a>';
                    html += '</td>';
                    html += '</tr>';
                    $(html).appendTo(tableBody);
                });
                tableBody.parent().trimTextLength();
                tools.tooltipInit();
                tools.icheckInit();
            },
            null,
            removeIfEmpty
        );
    };

    /**
     * 跳转详情页
     * @param id
     */
    obj.toEdit = function( id ){
        setCookie( 'card.maintenance.edit.id', id );
        tools.href( '/pages/maintenance/operatorManage/add.html' );
    };

    return obj;
})();



$(document).ready(function(){

    //搜索
    $("#search").click(function(){
        query.loadQuery(1);
    });

    //加载数据
    query.loadQuery(1);


});