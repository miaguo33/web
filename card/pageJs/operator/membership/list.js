/**
 * 分页加载器
 */
var membership = (function() {
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
                'operatorsId'     : JSON.parse(getCookie('card.userinfo')).operatorsId,
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
                        html += '<td>' + ( item['nickName'] || '' ) + '</td>';
                        
                        html += '<td>' + tools.getFormatTime( item.createTime, 'yyyy-MM-dd hh:mm' ) + '</td>';
                        html += '<td>';
                        html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="详情" onclick="membership.toDetail(\'' + index + '\')"><i class="fa fa-tasks"></i></a>'
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

    membership.loadQuery(1);

	$('.input-daterange').datepicker({
		keyboardNavigation: false,
		forceParse: false,
		autoclose: true,
		format: "yyyy-mm-dd"
	});
});