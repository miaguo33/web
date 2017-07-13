
/**
 * 通行权益类
 */
var card = (function(){
    var obj = {};

    obj.cardData = {};
    obj.host = JSON.parse(getCookie('card.host'));
    /**
     * 通行权益名称
     */
    obj.setCardName = function(){
        $("#cardName").html( obj.cardData.cardName );
    };
    /**
     * 通行权益别名
     */
    obj.setCardAliasNamee = function(){
        $("#cardAliasName").html( obj.cardData.cardAliasName );
    };
    /**
     * 运营截止日期
     */
    obj.setDisusedDate = function(){
        if( obj.cardData.disusedDate ){
            var disusedDate = new Date();
            disusedDate.setTime( obj.cardData.disusedDate );
            $("#disusedDate").html( disusedDate.format( 'yyyy-MM-dd' ) );
        }
    };
    /**
     * 通行权益有效期
     */
    obj.setPermanent = function(){
        var html = '';
        if( obj.cardData.permanent ){
            html = '永久有效';
        }else{
            if( obj.cardData.period && obj.cardData.period > 0 ){
                html = obj.cardData.period + '天';
            }else{
                var beginDate = new Date(), endDate = new Date();
                beginDate.setTime( obj.cardData.beginDate );
                endDate.setTime( obj.cardData.endDate );
                html = beginDate.format('yyyy-MM-dd') + ' ~ ' + endDate.format('yyyy-MM-dd')
            }
        }
        $("#permanent").html( html );
    };
    /**
     * 通行权益中余额
     */
    obj.setPrestoreMoney = function(){
        $("#prestoreMoney").html( (obj.cardData.prestoreMoney / 100) + ' 元' );
    };
     /**
     * 通行权益中折扣，优惠券，门票
     */
    obj.setDCT = function(){
        //var DCTData = obj.cardData.extendData;
        //var discount='',couponobj={},coupon='',ticket='';
        //for(i=0;i<DCTData.length;i++){
        //	var html = '';
        //	if(DCTData[i].itemType=='D'){
        //		discount += ' ['+DCTData[i].itemName+'] ';
        //	}else if(DCTData[i].itemType=='C'){
        //		if(couponobj[DCTData[i].itemId]){
        //			couponobj[DCTData[i].itemId].push(DCTData[i].itemName);
        //		}else{
        //			couponobj[DCTData[i].itemId] = [];
        //			couponobj[DCTData[i].itemId].push(DCTData[i].itemName);
        //		}
        //	}else if(DCTData[i].itemType=='T'){
        //		ticket += ' ['+DCTData[i].itemName+'] ';
        //	}
        //}
        //for(var key in couponobj){
        //	coupon += ' ['+couponobj[key][0]+'*'+couponobj[key].length+'] ';
        //}
        //$("#discount").html(discount);
        //$("#coupon").html(coupon);
        //$("#ticket").html(ticket);

        $( obj.cardData.extendData).each(function( index, item ){
            switch( item.itemType ){
                case 'D'://折扣
                    var discount = item.extendData;
                    var html  = '<tr data-id="'+discount.id+'" data-name="'+discount.discountName+'">';
                    html += '<td>' + (discount.discountName   || '') + '</td>';
                    html += '<td>' + (discount.discountAliasName   || '') + '</td>';
                    html += '<td>' + discount.discountValue/10.0 + '折' + '</td>';
                    //适用门店
                    html += '<td>' + card.merchantList( discount.extendData ) + '</td>';
                    html += '<td>' + card.getPeriodTime( discount.permanent, discount.beginDate, discount.endDate, discount.period ) + '</td>';
                    html += '<td>' + card.getStatus( discount.status ) + '</td>';
                    html += '<td>' + (discount.description || '') + '</td>';
                    html += '</tr>';
                    $(html).appendTo($("#discount-select"));

                    break;
                case 'C'://优惠券
                    var coupon = item.extendData;
                    var useRule = coupon.discountValue/10.0+'折(消费满'+coupon.minimum/100.0+'元使用';
                    if(coupon.maxDiscount!=-1){
                        useRule += ',最高抵扣'+coupon.maxDiscount/100.0+'元';
                    }
                    useRule += ')';
                    var html  = '<tr data-id="'+coupon.id+'" data-name="'+coupon.couponName+'">';
                    html += '<td>' + (coupon.couponName   || '') + '</td>';
                    html += '<td>' + (coupon.couponAliasName   || '') + '</td>';
                    html += '<td>' + coupon.discountValue/10.0 + '折' + '</td>';
                    //适用门店
                    html += '<td>' + card.merchantList( coupon.extendData ) + '</td>';
                    html += '<td>' + useRule +'</td>';
                    html += '<td>' + card.getPeriodTime( coupon.permanent, coupon.beginDate, coupon.endDate, coupon.period ) + '</td>';
                    html += '<td>' + card.getStatus( coupon.status ) + '</td>';
                    html += '<td>' + ( coupon.notice || '' ) + '</td>';
                    html += '</tr>';
                    $(html).appendTo($("#coupon-select"));
                    break;
                case 'T'://门票
                    var ticket = item.extendData;
                    var html  = '<tr data-id="'+ticket.id+'" data-name="'+ticket.ticketName+'">';
                    html += '<td>' + (ticket.ticketName   || '') + '</td>';
                    html += '<td>' + (ticket.ticketAliasName      || '') + '</td>';
                    //适用门店
                    html += '<td>' + card.merchantList( ticket.extendData ) + '</td>';
                    html += '<td>' + (ticket.maxUse || '') + '</td>';
                    html += '<td>' + card.getPeriodTime( ticket.permanent, ticket.beginDate, ticket.endDate, ticket.period ) + '</td>';
                    html += '<td>' + card.getStatus( ticket.status ) + '</td>';
                    html += '<td>' + ( ticket.description || '' ) + '</td>';
                    html += '</tr>';
                    $(html).appendTo($("#ticket-select"));
                    break;
            }
        });
    };

    obj.status = {
            '1' : '<span style="color:green">有效</span>',
            '2' : '<span style="color:#FF8400">失效</span>',
            '3' : '<span style="color:red">删除</span>',
            '4' : '<span style="color:#8484C6">过期</span>'
    };
    /**
     * 获取状态
     * @param status
     * @returns {*}
     */
    obj.getStatus = function( status ){
        return obj.status[ '' + status ];
    };

    /**
     * 获取门店列表
     * @param arr
     */
    obj.merchantList = function( arr ){
        var str = '';
        if( arr && arr.length > 0 ){
            $( arr ).each(function( i, t ){
                str += '[' + t.merchantName + '] ';
            });

        }
        if(str == ''){
        	str = '	<span style="color:red;margin-left:9px">—</span>';
        }
        return str;
    };

    /**
     * 获取有效期
     * @param permanent 是否永久有效
     * @param beginDate 有效开始日期
     * @param endDate   有效结束日期
     * @param period    有效天数
     * @returns {*}
     */
    obj.getPeriodTime = function( permanent, beginDate, endDate, period ){
        if( permanent ){
            return '永久有效';
        }else{
            if( period && period > 0 ){
                return period + '天';
            }else{
                return ( tools.getFormatTime(beginDate, 'yyyy-MM-dd') + '~' + tools.getFormatTime(endDate, 'yyyy-MM-dd') );
            }

        }
    };

    /**
     * 标准售价
     */
    obj.setPrice = function(){
        $("#price").html( (obj.cardData.price/100.0) + ' 元/张' );
    };
    /**
     * 发行数量
     */
    obj.setAllCnt = function(){
        $("#allCnt").html( obj.cardData.allCnt + ' 张' )
    };
    /**
     * 通行权益说明
     */
    obj.setDescription = function(){
        $("#description").html( obj.cardData.description );
    };
    /**
     * 需要实名认证
     */
    obj.setRealAuth = function(){
        $("#realAuth").html( obj.cardData.realAuth ? '是' : '否' );
    };
    /**
     * 是否展示通卡已售数量
     */
    obj.setShowSellCnt = function(){
        $("#showSellCnt").html( obj.cardData.showSellCnt ? '展示' : '不展示' );
    };
    /**
     * 是否在手机端展示
     */
    obj.setShowInApp = function(){
        $("#showInApp").html( obj.cardData.showInApp ? '是' : '否' );
    };
    /**
     * 客服电话
     */
    obj.setCsTel = function(){
        var html = '';
        if( obj.cardData.csTel && JSON.parse(obj.cardData.csTel).length > 0 ){
            $( JSON.parse(obj.cardData.csTel) ).each(function( index, item ){
                if( item.name && item.tel ){
                    html += '<p>' + item.name + ':' + item.tel + '</p>';
                }
            });
            $("#csTel").html( html );
        }else{
            $("#csTel").html( '暂无' );
        }

    };
    /**
     * 通行权益卡面
     */
    obj.setImage = function(){
        if( obj.cardData.image ){
            $("#image").attr( 'src', obj.host.public + obj.cardData.image );
        }
    };
    /**
     * 通行权益卡面LOGO
     */
    //obj.setLogo = function(){
    //    if( obj.cardData.logo ){
    //        $("#logo").attr( 'src', obj.host.public + obj.cardData.logo );
    //    }
    //};
    /**
     * 通行权益详情图片
     */
    obj.setDetailImage = function(){
        if( obj.cardData.detailImage ){
            $("#detailImage").attr( 'src', obj.host.public + obj.cardData.detailImage );
        }
    };
    /**
     * 审核凭证
     */
    obj.setAuditVoucher= function(){
        if( obj.cardData.auditVoucher ){
        	$("#auditVoucher").attr('href',obj.host.private + obj.cardData.auditVoucher);
            $("#auditVoucher").attr('class', 'icon-only text-info');
            $("#auditVoucher span").html( '<i class="fa fa-download"></i>' );
        }
    };
    /**
     * 审核通过按钮隐藏
     */
    obj.setAuditStatus = function(){
        if( obj.cardData.auditStatus == 5 ){
            $(".btnDiv").hide();
        }
    };

    /**
     * 修改通行权益状态值
     * @param auditStatus
     */
    obj.updateAuditStatus = function( auditStatus ){

        $("#modalShow").modal('hide');

        swal({
            title: "确定审核吗?",
            text: "确定后审核会更改状态!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确 定",
            cancelButtonText: "取 消",
            closeOnConfirm: false,
            closeOnCancel: false
        }, function (isConfirm) {
            if (isConfirm) {
                swal( '已提交', '', "success");

                var url = "/unionCardAudit/auditUnionCardAudit";
                var data = {
                    'id'          : obj.cardData.id,
                    'auditStatus' : auditStatus,
                    'reason'      : ( auditStatus == 4 ) ? $("#reason").val() : ''
                };
                http.post(url, data, function( res ){
                    if( res.statusCode == 0 ){

                        setTimeout(
                            "tools.href( '/pages/maintenance/cardReview/list.html' );"
                            , 1000
                        );

                    }else{
                        swal( res.msg, '', "error");
                    }
                });

            } else {
                swal("已取消!", "", "error");
            }
        });


    };

    /**
     * 获取通行权益信息
     */
    obj.initShow = function(){


        $(".pagination-loading").hide();

        obj.setCardName();
        obj.setCardAliasNamee();
        obj.setDisusedDate();
        obj.setPermanent();
        obj.setPrestoreMoney();
        obj.setDCT();

        //折扣优惠券门卡
        //TODO

        obj.setPrice();
        obj.setAllCnt();
        obj.setDescription();
        obj.setRealAuth();
        obj.setShowSellCnt();
        obj.setShowInApp();
        obj.setCsTel();

        obj.setImage();
        //obj.setLogo();
        obj.setDetailImage();
        obj.setAuditVoucher();

        obj.setAuditStatus();

        tools.tooltipInit();


    };

    return obj;

})();

$(document).ready(function(){

    if( getCookie('card.review.cardInfo.id') && getCookie('card.review.cardInfo.id') != '' ){
        var cardId = JSON.parse( getCookie('card.review.cardInfo.id') );
        removeCookie( 'card.review.cardInfo.id' );

        http.post( '/unionCardAudit/selectUnionCardAuditById', {'id' : cardId}, function( res ){
            if( res.statusCode == 0 ){
                card.cardData = res.jbody.UnionCardAudit;

                //console.log( card.cardData );

                card.initShow();
            }
        });


    }

});