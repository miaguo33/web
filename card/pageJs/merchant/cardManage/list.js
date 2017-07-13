var query = (function() {
    var obj = {};
    obj.data = [];
    var pageBar = $("#pageTab");
    var tableBody = $("#dataList");
    var queryPageUtil = new PageUtils( pageBar, tableBody);
    obj.status = {
        '1' : '未上线',
        '2' : '已上线售卖',
        '3' : '暂售',
        '4' : '删除'
    };
    obj.loadQuery = function(page, removeIfEmpty) {
        queryPageUtil.loadPage(page,
            '/unionCard/selectUnionCardByMerchantId',
            {
                'searchText' : $("#searchText").val(),
                'status':$("#status").val(),
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
                        html += '<td>' + item.cardName + '</td>';//通行权益名称
                        html += '<td>' + item.cardAliasName + '</td>';//通行权益别名名称
                        html += '<td>' + item.operatorsName + '</td>';//运营商名称
                        html += '<td>' + parseFloat(item.price) / 100  + '</td>';//标准售价
                        html += '<td>' + item.allCnt + '</td>';//总发行量
                        html += '<td>' + (item.sellCnt || 0) + '</td>';//已售卖量
                        //html += '<td>' + '-' + '</td>';//已激活张数
                        //html += '<td>' + '-' + '</td>';//未激活张数
                        //html += '<td>' + '-' + '</td>';//待激活张数
                        html += '<td>';//发行日期

                        var date = new Date();
                        date.setTime(item.createTime );
                        html += date.format('yyyy-MM-dd');

                        html += '</td>';
                        html += '<td>';//有效期

                        if( !tools.isNull( item.permanent ) && item.permanent == 1 ){
                            html += '永久有效';
                        }else{
                            if( !tools.isNull( item.period ) && item.period>0){
                                html += item.period + '天';
                            }else{
                                var beginDate = new Date();
                                var endDate   = new Date();
                                beginDate.setTime(item.beginDate)
                                endDate.setTime(item.endDate)

                                html += beginDate.format('yyyy-MM-dd');
                                html += '-';
                                html += endDate.format('yyyy-MM-dd');
                            }
                        }
                        html += '</td>';
                        html += '<td>' + obj.status['' + item.status ] + '</td>';//售卖状态

                        html += '<td>';//操作
                        html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="预览"    onclick="operation.preview(\'' + index + '\');"><i class="fa fa-qrcode"></i></a>';
                        html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="购买链接" onclick="operation.link(\'' + index + '\');"><i class="fa fa-link"></i></a>';
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

var operation = (function(){
    var obj = {};

    /**
     * 预览
     * @param id
     */
    obj.preview = function( id ){
        var cardInfo = query.data[id];
        $("#modalTitle").html('预览');
        //$("#modalContent").html( http.getFullUrl( '/cd/cdcurrencycardDetail.html?cardNumber=' + cardInfo.id ) );
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
     * 购买链接
     * @param id
     */
    obj.link = function( id ){
        var cardInfo = query.data[id];
        $("#modalTitle").html('购买链接');
        //$("#modalContent").html( http.getFullUrl( '/cd/cdcurrencycardDetail.html?cardNumber=' + cardInfo.id + '&isshowsell=&operatorsId=' + JSON.parse(getCookie('card.userinfo')).operatorsId ) );
        var str =http.getFullUrl( '/cd/cdcurrencycardDetail.html?cardNumber=' + cardInfo.id + '&isshowsell=&operatorsId=' + JSON.parse(getCookie('card.userinfo')).operatorsId);
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
     * 下载通行权益数据
     */
    obj.exportData = function(){
        var url = '/unionCard/exportMerchantUnionCardList';
        var data = {
            'searchText' : $("#searchText").val(),
            'status':$("#status").val(),
        };
        http.post( url, data, function(res){
            console.log( res );
            if( res.statusCode == 0 ){
                location.href = getCookie( 'card.host.public' ) + res.msg;
            }else{
                tools.toastr( res.msg, '', 'error' )
            }
        });

    };

    return obj;
})();



$(document).ready(function(){
	$("#search").click(function(){
        query.loadQuery(1);
    });
	$("#status").change(function(){
		query.loadQuery(1);
	});
    query.loadQuery(1);
});