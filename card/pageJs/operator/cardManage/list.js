

var query = (function() {
    var obj = {};
    obj.data = [];
    var pageBar = $("#pageTab");
    var tableBody = $("#dataList");

    obj.auditStatus = {
        '1' : '未审核',
        '2' : '审核中',
        '3' : '审核中',
        '4' : '<span class="text-danger">审核不通过</span>',
        '5' : '<span class="text-info">审核通过</span>'
    };
    obj.status = {
        '1' : '未上线',
        '2' : '已上线售卖',
        '3' : '暂售',
        '4' : '删除'
    };
    obj.auditStatusIcon = {
        '1' : '<span class="icon-only text-muted"><i data-toggle="tooltip" title="未审核" class="fa fa-circle-thin"></i></span>',
        '2' : '<span class="icon-only text-muted"><i data-toggle="tooltip" title="审核中" class="fa fa-question-circle"></i></span>',
        '3' : '<span class="icon-only text-muted"><i data-toggle="tooltip" title="审核中" class="fa fa-question-circle"></i></span>',
        '4' : '<span class="icon-only text-danger"><i data-toggle="tooltip" title="审核不通过" class="fa fa-times-circle"></i></span>',
        '5' : '<span class="icon-only text-navy"><i data-toggle="tooltip" title="审核通过" class="fa fa-check-circle"></i></span>'
    };

    var queryPageUtil = new PageUtils( pageBar, tableBody);

    var userInfo = JSON.parse( getCookie("card.userinfo") );

    obj.loadQuery = function(page, removeIfEmpty) {
        queryPageUtil.loadPage(page,
            '/unionCardAudit/selectUnionCardAudit',
            {
                'searchText' : $("#searchText").val(),
                //'auditStatus' : $("#auditStatus option:selected").val(),
                //'status'     : $("#status option:selected").val(),
                'operatorsId': userInfo.operatorsId
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
                    //审核通过的只展示一条数据
                    if( item.auditStatus == 5 ){
                        var html = '<tr class="animated fadeIn">';
                        html += '<td>' + obj.auditStatusIcon['' + item.auditStatus ] + '</td>';//审核状态
                        html += '<td>' + item.cardName + '</td>';//通行权益名称
                        html += '<td>' + item.cardAliasName + '</td>';//通行权益别名名称
                        html += '<td>' + parseFloat(item.price) / 100  + '</td>';//标准售价
                        html += '<td>' + item.allCnt + '</td>';//总发行量
                        if( item.extendData2 && item.extendData2.length != 0 ){
                        	html += '<td>' + (item.extendData2[0].sellCnt || 0) + '</td>';//已售卖量
                        }else{
                        	html += '<td>' + 0 + '</td>';//已售卖量
                        }
                        //html += '<td>' + '-' + '</td>';//已激活张数
                        //html += '<td>' + '-' + '</td>';//未激活张数
                        //html += '<td>' + '-' + '</td>';//待激活张数
//                      html += '<td>';//发行日期
//
//                      var date = new Date();
//                      date.setTime(item.createTime );
//                      html += date.format('yyyy-MM-dd');
//
//                      html += '</td>';
                        html += '<td>';//有效期

                        if( !tools.isNull( item.permanent ) && item.permanent == 1 ){
                            html += '永久有效';
                        }else{
                            if( !tools.isNull( item.period )&&item.period>0 ){
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
                        html += '<td>' + obj.auditStatus['' + item.auditStatus ] + '</td>';//审核状态
                        html += '<td>' + obj.status['' + item.status ] + '</td>';//售卖状态

                        html += '<td>';//操作
                        html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="预览"    onclick="operation.preview(\'' + index + '\');"><i class="fa fa-qrcode"></i></a>';
                        html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="编辑"    onclick="operation.edit(\'' + index + '\');"><i class="fa fa-edit"></i></a>';
                        html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="提交审核" onclick="operation.review(\'' + index + '\');"><i class="fa fa-mail-forward"></i></a>';
                        html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="购买链接" onclick="operation.link(\'' + index + '\');"><i class="fa fa-link"></i></a>';
                        if( item.status == 3 ){
                            html += '   <a class="icon-only text-warning" data-toggle="tooltip" title="开始售卖" onclick="operation.setStatus(\'' + index + '\', \'2\');"><i class="fa fa-unlock"></i></a>';
                        }else{
                            html += '   <a class="icon-only text-muted"   data-toggle="tooltip" title="暂停售卖" onclick="operation.setStatus(\'' + index + '\', \'3\');"><i class="fa fa-lock"></i></a>';
                            if( item.status == 1 || item.status == 4 ){
                                html += '   <a class="icon-only text-warning" data-toggle="tooltip" title="上线"    onclick="operation.setStatus(\'' + index + '\', \'2\');"><i class="fa fa-cloud-upload"></i></a>';
                            }else{
                                html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="下线"    onclick="operation.setStatus(\'' + index + '\', \'1\');"><i class="fa fa-cloud-download"></i></a>';
                            }
                        }
                        html += '</td>';
                        html += '</tr>';
                        $(html).appendTo(tableBody);
                    }else{
                        var html = '<tr class="animated fadeIn">';
                        html += '<td>' + obj.auditStatusIcon['' + item.auditStatus ] + '</td>';//审核状态
                        html += '<td>' + item.cardName + '</td>';//通行权益名称
                        html += '<td>' + item.cardAliasName + '</td>';//通行权益别名名称
                        html += '<td>' + parseFloat(item.price) / 100  + '</td>';//标准售价
                        html += '<td>' + item.allCnt + '</td>';//总发行量

                        html += '<td>' + (item.sellCnt || 0) + '</td>';//已售卖量
                        //html += '<td>' + '-' + '</td>';//已激活张数
                        //html += '<td>' + '-' + '</td>';//未激活张数
                        //html += '<td>' + '-' + '</td>';//待激活张数
//                      html += '<td>';//发行日期
//
//                      var date = new Date();
//                      date.setTime(item.createTime );
//                      html += date.format('yyyy-MM-dd');
//
//                      html += '</td>';
                        html += '<td>';//有效期

                        if( !tools.isNull( item.permanent ) && item.permanent == 1 ){
                            html += '永久有效';
                        }else{
                            if( !tools.isNull( item.period ) ){
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
                        html += '<td>' + obj.auditStatus['' + item.auditStatus ] + '</td>';//审核状态
                        html += '<td>' + obj.status['' + item.status ] + '</td>';//售卖状态

                        html += '<td>';//操作
                        html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="预览"    onclick="operation.preview(\'' + index + '\');"><i class="fa fa-qrcode"></i></a>';
                        html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="编辑"    onclick="operation.edit(\'' + index + '\');"><i class="fa fa-edit"></i></a>';
                        if(item.auditStatus!=4){
                        	html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="提交审核" onclick="operation.review(\'' + index + '\');"><i class="fa fa-mail-forward"></i></a>';
                        }
                        //没有审核过的历史记录，隐藏操作按钮
                        if( !item.extendData2 || item.extendData2.length == 0 ){
                            html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="购买链接" onclick="operation.link(\'' + index + '\');"><i class="fa fa-link"></i></a>';
                             if(item.auditStatus!=4){
	                        	if( item.status == 3 ){
	                                html += '   <a class="icon-only text-warning" data-toggle="tooltip" title="开始售卖" onclick="operation.setStatus(\'' + index + '\', \'2\');"><i class="fa fa-unlock"></i></a>';
	                            }else{
	                                html += '   <a class="icon-only text-muted"   data-toggle="tooltip" title="暂停售卖" onclick="operation.setStatus(\'' + index + '\', \'3\');"><i class="fa fa-lock"></i></a>';
	                                if( item.status == 1 || item.status == 4 ){
	                                    html += '   <a class="icon-only text-warning" data-toggle="tooltip" title="上线"    onclick="operation.setStatus(\'' + index + '\', \'2\');"><i class="fa fa-cloud-upload"></i></a>';
	                                }else{
	                                    html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="下线"    onclick="operation.setStatus(\'' + index + '\', \'1\');"><i class="fa fa-cloud-download"></i></a>';
	                                }
	                            }
                            }
                        }

                        html += '</td>';

                        html += '</tr>';
                        $(html).appendTo(tableBody);

                        //有历史记录，展示
                        if( item.extendData2 && item.extendData2.length != 0 ){

                            var itemExtend = item.extendData2[0];

                            var html = '<tr class="animated fadeIn">';
                            html += '<td class="icon-only text-info" style="text-align: right"><i class="fa fa-level-down" style="transform: rotate(180deg)"></i></td>';
                            html += '<td>' + itemExtend.cardName + '</td>';//通行权益名称
                            html += '<td>' + itemExtend.cardAliasName + '</td>';//通行权益别名名称
                            html += '<td>' + parseFloat(itemExtend.price) / 100  + '</td>';//标准售价
                            html += '<td>' + itemExtend.allCnt + '</td>';//总发行量

                            html += '<td>' + (itemExtend.sellCnt || 0) + '</td>';//已售卖量
                            //html += '<td>' + '-' + '</td>';//已激活张数
                            //html += '<td>' + '-' + '</td>';//未激活张数
                            //html += '<td>' + '-' + '</td>';//待激活张数
//                          html += '<td>';//发行日期
//
//                          var date = new Date();
//                          date.setTime(itemExtend.createTime );
//                          html += date.format('yyyy-MM-dd');
//
//                          html += '</td>';
                            html += '<td>';//有效期

                            if( !tools.isNull( itemExtend.permanent ) && itemExtend.permanent == 1 ){
                                html += '永久有效';
                            }else{
                                if( !tools.isNull( itemExtend.period ) ){
                                    html += itemExtend.period + '天';
                                }else{
                                    var beginDate = new Date();
                                    var endDate   = new Date();
                                    beginDate.setTime(itemExtend.beginDate)
                                    endDate.setTime(itemExtend.endDate)

                                    html += beginDate.format('yyyy-MM-dd');
                                    html += '-';
                                    html += endDate.format('yyyy-MM-dd');
                                }
                            }
                            html += '</td>';
                            html += '<td></td>';//审核状态
                            html += '<td>' + obj.status['' + itemExtend.status ] + '</td>';//售卖状态

                            html += '<td>';//操作
                            html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="购买链接" onclick="operation.link(\'' + index + '\');"><i class="fa fa-link"></i></a>';
                            if( itemExtend.status == 3 ){
                                html += '   <a class="icon-only text-warning" data-toggle="tooltip" title="开始售卖" onclick="operation.setStatus(\'' + index + '\', \'2\');"><i class="fa fa-unlock"></i></a>';
                            }else{
                                html += '   <a class="icon-only text-muted"   data-toggle="tooltip" title="暂停售卖" onclick="operation.setStatus(\'' + index + '\', \'3\');"><i class="fa fa-lock"></i></a>';
                                if( itemExtend.status == 1 || itemExtend.status == 4 ){
                                    html += '   <a class="icon-only text-warning" data-toggle="tooltip" title="上线"    onclick="operation.setStatus(\'' + index + '\', \'2\');"><i class="fa fa-cloud-upload"></i></a>';
                                }else{
                                    html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="下线"    onclick="operation.setStatus(\'' + index + '\', \'1\');"><i class="fa fa-cloud-download"></i></a>';
                                }
                            }

                            html += '</td>';

                            html += '</tr>';
                            $(html).appendTo(tableBody);


                        }
                    }




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
        console.log(cardInfo);
        $("#modalTitle").html('预览');
        //$("#modalContent").html( http.getFullUrl( '/cd/cdcurrencycardDetail.html?cardNumber=' + cardInfo.id ) );
        var str = http.getFullUrl( '/cd/cdcurrencycardDetail.html?cardNumber=' + cardInfo.id +'&isShowPay=0');
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
     * 编辑
     * @param id
     */
    obj.edit = function( id ){
        var cardInfo = query.data[id];

        setCookie( 'card.cardId', cardInfo.id );
        tools.href( '/pages/operator/cardManage/add.html' );

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
     * 设置通行权益状态
     * @param id
     * @param status 1-未上线（前端不可见），2-已上线售卖（前端可见，可购买），3-暂售（前端可见，但不可购买），4-删除'
     */
    obj.setStatus = function( id, status ){
        var cardInfo = query.data[id];
        http.post( '/unionCardAudit/upOrDownUnionCardAudit', {'ID' : cardInfo.id, 'status' : status}, function( res ){
            if( res.statusCode == 0 ){
                swal( res.msg, '', 'success' );
                query.loadQuery(1);
            }else{
                swal( res.msg, '', 'error' );
            }
        });
    };

    /**
     * 审核
     * @param id
     */
    obj.review = function( id ){
        var cardInfo = query.data[id];

        switch( cardInfo.auditStatus ){
            case 1:
                var url = '/unionCardAudit/commitUnionCardAudit';
                var data = {
                    'ID' : cardInfo.id,
                    'auditStatus' : 2
                };
                http.post( url, data, function( res ){
                    if( res.statusCode == 0 ){
                        swal( '提交成功', '', 'success' );
                        query.loadQuery( 1 );
                    }else{
                        swal( res.msg, '', 'error' );
                    }
                });
                break;
            default:
                tools.toastr( '当前状态不允许提交审核!', '', 'warning' );
                break;
        }
    };

    return obj;
})();


$(document).ready(function(){
//console.log(  );
    $("#search").click(function(){
        query.loadQuery(1);
    });

    query.loadQuery(1);

    //日期初始化
    $('.input-group.date').datepicker({
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        format: "yyyy-mm-dd"
    });

});