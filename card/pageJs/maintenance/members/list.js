/**
 * 分页加载器
 */
var membershipQuery = (function() {
    var obj = {};
    var pageBar = $("#pageBar");
    var tableBody = $("#dataList");
    var queryPageUtil = new PageUtils( pageBar, tableBody);
    obj.data = [];//当前列数据
    obj.type = 'phone';//当前搜索条件，默认为phone手机号
    obj.loadQuery = function(page, removeIfEmpty) {
        queryPageUtil.loadPage(page,
            '/userUnionCard/selectUserUnionCard',
            {
                'operatorsId'     : $("#operators option:selected").val(),
                'phone'           : (obj.type == 'phone'      ) ? $("#searchText").val() : '',
                'cardNumber'      : (obj.type == 'cardNumber' ) ? $("#searchText").val() : '',
                'searchStartTime' : $("#searchStartTime" ).val(),
                'searchEndTime'   : $("#searchEndTime"   ).val()
            },
            function (jsonResponse) {

                var pagination = jsonResponse['jbody']['pageInfo'];
                tableBody.html('');
                if (pagination['list'] && pagination['list'].length > 0) {
                    //pagination['list'].reverse();
                    obj.data = pagination['list'];
                    $(pagination['list']).each(function (index, item) {
                        var html = '<tr class="animated fadeIn">';
                        html += '<td>' + item.cardNumber + '</td>';
                        html += '<td>' + item.cardName + '</td>';
                        html += '<td>' + ( item.phone || '' ) + '</td>';
                        html += '<td>' + ( (item.extendData.length > 0 ) ? (item.extendData[0]['nickName'] || '') : '' ) + '</td>';
                        html += '<td>' + tools.getFormatTime( item.createTime, 'yyyy-MM-dd hh:mm' ) + '</td>';
                        html += '<td>';
                        html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="详情" onclick="membershipQuery.toDetail(\'' + index + '\')"><i class="fa fa-tasks"></i></a>'
                        html += '</td>';
                        html += '</tr>';
                        $(html).appendTo(tableBody);
                    });
                    tableBody.parent().trimTextLength();
                    tools.tooltipInit();
                }
            },
            null,
            removeIfEmpty
        );
    };

    /**
     * 获取运营商列表数据
     */
    obj.getOperators = function(){
        var url = '/operators/selectOperators';
        var data = {
            'pageSize' : 1000,
            'pageNum'  : 1
        };
        http.post(url, data, function( res ){
            if( res.statusCode == 0 ){
                if( res.jbody.pageInfo.list && res.jbody.pageInfo.list.length > 0 ){
                    var list = res.jbody.pageInfo.list;
                    var html = ''
                    $(list).each(function( index, item ){
                        html += '<option value="' + item.id + '">' + item.operatorsName + '</option>';
                    });
                    $(html).appendTo( $("#operators") );
                    //$("#operators").select2({
                    //    placeholder: "选择需要发放的通行权益",
                    //    allowClear: true
                    //});
                }
            }else{
                tools.toastr( res.msg, '', 'error' );
            }
        });
    };

    /**
     * 跳转详情页
     * @param index
     */
    obj.toDetail = function( index ){
        var info = obj.data[index];
        setCookie( 'card.membership.id', info.id );
        tools.href( '/pages/operator/membership/detail.html' );
    };

    /**
     * 改变搜索类型
     * @param that
     * @param type
     */
    obj.changeShow = function( that, type ){
        obj.type = type;
        $("#innerShow").html( $(that).html() );
        $("#searchText").val( '').focus();
    };

    return obj;
})();
$(document).ready(function() {

    membershipQuery.loadQuery(1);

    membershipQuery.getOperators();




    $('.input-daterange').datepicker({
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        format: "yyyy-mm-dd"
    });
});