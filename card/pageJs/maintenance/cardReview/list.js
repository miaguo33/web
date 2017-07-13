

var queryCard = (function() {
    var obj = {};
    var pageBar = $("#pageTab");
    var tableBody = $("#dataList");
    obj.data = [];
    var queryPageUtil = new PageUtils( pageBar, tableBody);
    obj.loadQuery = function(page, removeIfEmpty) {
        var searchText = $("#searchText").val();
        var auditStatus = $("#auditStatus option:selected").val();
        var url = '/unionCardAudit/selectUnionCardAuditListForAudit';
        var data = {
            'searchText' : searchText,
            'auditStatus': auditStatus
        };
        queryPageUtil.loadPage(page, url, data, function(jsonResponse) {
                var pagination = jsonResponse['jbody']['pageInfo'];
                tableBody.html('');
                if (!pagination['list'] || pagination['list'].length == 0){
                    //tools.toastr("无符合的搜索内容","提示信息", 'warning')
                    return;
                }
                //pagination['list'].reverse();
                obj.data = pagination['list'];//存储页面数据，待调用
                $(pagination['list']).each(function(index, item){
                    var html = '<tr class="animated fadeIn">';
                    html += '<td>' + item.operatorsName + '</td>';
                    html += '<td>' + item.cardName + '</td>';
                    html += '<td>' + item.price /100.0  + '</td>';
                    html += '<td>' + item.allCnt + '</td>';
                    html += '<td>';
                    var newDate = new Date();
                    newDate.setTime( item.commitTime );
                    html+= newDate.format('yyyy-MM-dd');
                    html += '</td>';
                    html += '<td>';
                    if(item.auditTime){
                        var newDate = new Date();
                        newDate.setTime( item.auditTime );
                        html+= newDate.format('yyyy-MM-dd');
                    }
                    html += '</td>';
                    html += '<td>';
                    switch( item.auditStatus ){
                        case 2:
                            html += '待审核'
                            break;
                        case 4:
                            html += '<span class="text-danger">审核不通过</span>';
                            break;
                        case 5:
                            html += '<span class="text-info">审核通过</span>'
                            break;
                    }
                    html += '</td>';
                    html += '<td>';
                    html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="预览" onclick="operation.overview(\'' + index + '\')"><i class="fa fa-qrcode"></i></a>';
                    html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="审核" onclick="operation.review(\'' + index + '\')"><i class="fa fa-tasks"></i></a>';
                    html += '</td>';
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
    return obj;

})();


/**
 * 操作类
 */
var operation = (function(){
    var obj = {};

    /**
     * 打开模态窗展示二维码
     * @param index
     */
    obj.overview = function( index ){

        var cardInfo = queryCard.data[index];


        $("#modalTitle").html('预览');
        //$("#modalContent").html( 'http://XXX.XXX.XXX/?' + 'operatorId=' + cardInfo.operatorId + '&cardId=' + cardInfo.id );
        var str = http.getFullUrl( '/cd/cdcurrencycardDetail.html?cardNumber=' + cardInfo.id );
        $("#modalQR").html( '' );
        $("#modalQR").qrcode({
            render: "canvas",//canvas or table
            width: 200,
            height:200,
            text: str
        });

        $("#modalLink").html( str );

        $("#modalShow").modal('show');
    };

    /**
     * 跳转审核
     * @param id
     */
    obj.review = function( index ){
        var cardInfo = queryCard.data[index];
        
        setCookie( 'card.review.cardInfo.id', JSON.stringify(cardInfo.id));
        tools.href( '/pages/maintenance/cardReview/review.html' );
    };

    return obj;
})();


$(document).ready(function(){

    queryCard.loadQuery(1);
    //搜索
    $("#search").click(function(){
        queryCard.loadQuery(1);
    });



});