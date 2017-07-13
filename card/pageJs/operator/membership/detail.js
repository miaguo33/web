
var memberDetail = (function(){
    var obj = {};
    obj.id = '';//用户id
    obj.data = '';//用户详情数据
    /**
     * 根据用户id获取详情
     */
    obj.getData = function(){
        var url = '/userUnionCard/selectUserUnionCardDetail';
        var data = {
            id: obj.id
        };
        http.post(url, data, function( res ){
            if( res.statusCode == 0 ){

                obj.data = res.jbody;

                //执行以下方法初始化页面数据
                obj.basicInfo();
                obj.storeValue();
                obj.coupon();
                obj.discount();
                obj.ticket();
                obj.purchase(1);

            }else{
                tools.toastr( res.msg, '', 'error' );
            }
        });
    };

    /**
     * 基本信息
     */
    obj.basicInfo = function(){
        var info = obj.data.userUnionCard;

        var html = '<tr class="animated fadeIn">';
            html += '   <td>' + info.cardNumber + '</td>';
            html += '   <td>' + info.cardName + '</td>';
            html += '   <td>' + ( info.phone || '' ) + '</td>';
            html += '   <td>' + ( obj.data.nickName || '' ) + '</td>';
            html += '   <td>' + tools.getFormatTime( info.createTime, 'yyyy-MM-dd hh:mm' ) + '</td>';
            html += '</tr>';
        $(html).appendTo($("#basicInfo"));
    };

    /**
     * 储值
     */
    obj.storeValue = function(){

        var info = obj.data;

        var store = $(".views-number");

        var store1 = info.prestoreMoney / 100.0;
        var store3 = info.userUnionCard.balance / 100.0;
        var store2 = (store1 - store3) >= 0 ? (store1 - store3) : 0;
        store.eq(0).html( store1 );
        store.eq(1).html( store2 );
        store.eq(2).html( store3 );
    };

    /**
     * 优惠券
     */
    obj.coupon = function(){
        if( obj.data.userCouponList && obj.data.userCouponList.length > 0 ){
            var list = obj.data.userCouponList;
            var html = '';
            $(list).each(function(index, item){
                html += '<tr class="animated fadeIn">';

                html += '<td>' + item.userCoupon.couponName + '</td>';

                html += '<td>';
                if( item.couponVersion.discountValue && item.couponVersion.discountValue > 0 ){
                    html += item.couponVersion.discountValue/10.0+'折(消费满'+item.couponVersion.minimum/100.0+'元使用';
                    if(item.couponVersion.maxDiscount!=-1){
                        html += ',最高抵扣'+item.couponVersion.maxDiscount/100.0+'元';
                    }
                    html += ')';
                }
                html += '</td>';

                html += '<td>';
                if(!item.userCoupon.permanent){
                    if(item.userCoupon.period && item.userCoupon.period>0){
                        html +=  item.userCoupon.period + '天';
                    }else if( item.userCoupon.beginDate && item.userCoupon.endDate ){
                        html += tools.getFormatTime( item.userCoupon.beginDate, 'yyyy-MM-dd' ) + '~' + tools.getFormatTime( item.userCoupon.endDate, 'yyyy-MM-dd' );
                    }else{
                        html += '';
                    }
                }else{
                    html += '永久有效';
                }
                html += '</td>';

                html += '<td style="word-break: break-all;">';
                if( item.merchantNames && item.merchantNames != '' ){

                    html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="查看可用门店" onclick="tools.merchantView(\'' + item.merchantNames + '\')"><i class="fa fa-eye"></i></a>';
                }
                html += '</td>';

                html += '<td>';
                if( item.userCoupon.hasUsed ){
                    html += '已消费' + '<br>';
                    html += '消费日期:' + tools.getFormatTime( item.couponUseRecord.createTime, 'yyyy-MM-dd' ) + '<br>';
                    html += '消费门店:' + item.couponUseRecord.merchantName;
                }else{
                    html += '未消费';
                }
                html += '</td>';
                html += '</tr>';
            });
            $(html).appendTo($("#coupon"));
            tools.tooltipInit();
        }else{
            $("#div_coupon").hide();
        }


    };

    /**
     * 折扣
     */
    obj.discount = function(){
        if( obj.data.userDiscountList && obj.data.userDiscountList.length > 0 ){
            var list = obj.data.userDiscountList;
            var html = '';
            $(list).each(function(index, item){
                html += '<tr class="animated fadeIn">';
                html += '<td>'+item.userDiscount.discountName+'</td>';

                html += '<td>';
                if( item.discountVersion.discountValue && item.discountVersion.discountValue > 0 ){
                    html +=  item.discountVersion.discountValue/10.0+'折(消费满'+item.discountVersion.minimum/100.0+'元使用';
                    if(item.discountVersion.maxDiscount!=-1){
                        html += ',最高抵扣'+item.discountVersion.maxDiscount/100.0+'元';
                    }
                    html += ')';
                }
                html += '</td>';

                html += '<td>';
                if(!item.userDiscount.permanent){
                    if( item.userDiscount && item.userDiscount.period >0){
                        html +=  item.userDiscount.period + '天';
                    }else if( item.userDiscount.beginDate && item.userDiscount.endDate ){
                        html += tools.getFormatTime( item.userDiscount.beginDate, 'yyyy-MM-dd' ) + '~' + tools.getFormatTime( item.userDiscount.endDate, 'yyyy-MM-dd' );
                    }else{
                        html += '';
                    }
                }else{
                    html += '永久有效';
                }
                html += '</td>';

                html += '<td style="word-break: break-all;">';
                if( item.merchantNames && item.merchantNames != '' ){
                    html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="查看可用门店" onclick="tools.merchantView(\'' + item.merchantNames + '\')"><i class="fa fa-eye"></i></a>';
                }
                html += '</td>';

                html += '<td>';
                if(item.userDiscount.maxUse==-1){
                    html += '可用次数:不限';
                }else{
                    html += '<span>可用次数:' + item.userDiscount.maxUse + '</span>';
                    html += '<span class="m-l">已用次数:' + item.userDiscount.usedCnt + '</span>';
                    html += '<span class="m-l">剩余次数:' + (item.userDiscount.maxUse - item.userDiscount.usedCnt) + '</span>';
                }
                html += '</td>';

                html += '</tr>';
            });
            $(html).appendTo($("#discount"));
            tools.tooltipInit();
        }else{
            $("#div_discount").hide();
        }

    };

    /**
     * 门票
     */
    obj.ticket = function(){
        if( obj.data.userTicketList && obj.data.userTicketList.length > 0 ){
            var list = obj.data.userTicketList;
            var html = '';
            $(list).each(function(index, item){
                html += '<tr class="animated fadeIn">';

                html += '<td>' + item.userTicket.ticketName + '</td>';

                html += '<td>';
                if(!item.userTicket.permanent){
                    if(item.userTicket.period &&item.userTicket.period>0){
                        html +=  item.userTicket.period + '天';
                    }else if( item.userTicket.beginDate && item.userTicket.endDate ){
                        html += tools.getFormatTime( item.userTicket.beginDate, 'yyyy-MM-dd' ) + '~' + tools.getFormatTime( item.userTicket.endDate, 'yyyy-MM-dd' );
                    }else{
                        html += '';
                    }
                }else{
                    html += '永久有效';
                }
                html += '</td>';

                html += '<td style="word-break: break-all;">';
                if( item.merchantNames && item.merchantNames != '' ){
                    html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="查看可用门店" onclick="tools.merchantView(\'' + item.merchantNames + '\')"><i class="fa fa-eye"></i></a>';
                }
                html += '</td>';

                html += '<td>';
                if(item.userTicket.maxUse==-1){
                    html += '可用次数:不限';
                }else{
                    html += '<span>可用次数:' + item.userTicket.maxUse + '</span>';
                    html += '<span class="m-l">已用次数:' + item.userTicket.usedCnt + '</span>';
                    html += '<span class="m-l">剩余次数:' + (item.userTicket.maxUse - item.userTicket.usedCnt) + '</span>';
                }
                html += '</td>';
                html += '</tr>';
            });
            $(html).appendTo($("#ticket"));
            tools.tooltipInit();
        }else{
            $("#div_ticket").hide();
        }
    };

    /**
     * 消费记录
     */
    var pageBar = $("#pageBar_purchase");
    var tableBody = $("#dataList_purchase");
    var queryPageUtil = new PageUtils( pageBar, tableBody);
//    obj.purchase = function(page, removeIfEmpty) {
        //queryPageUtil.loadPage(page,
        //    '/userUnionCard/selectUserUnionCard',
        //    {
        //
        //    },
        //    function (jsonResponse) {
        //
        //        var pagination = jsonResponse['jbody']['pageInfo'];
        //        tableBody.html('');
        //        if (pagination['list'] && pagination['list'].length > 0) {
        //            $(pagination['list']).each(function(index, item) {
        //                var html = '<tr class="animated fadeIn">';
        //
        //
        //                html += '</tr>';
        //                $(html).appendTo(tableBody);
        //            });
        //            tableBody.parent().trimTextLength();
        //            tools.tooltipInit();
        //        }
        //    },
        //    null,
        //    removeIfEmpty
        //);
//    };

    obj.purchase = function(){
        if( obj.data.repUsecardDetailList && obj.data.repUsecardDetailList.length > 0 ){
            var list = obj.data.repUsecardDetailList;
            var html = '';
            $(list).each(function(index, item){
                html += '<tr class="animated fadeIn">';

                html += '<td>' + item.orderId + '</td>';
                
                html += '<td>' + tools.getFormatTime( item.orderDate, 'yyyy-MM-dd hh:mm' ) + '</td>';
                
                html += '<td>' + item.subMidName + '</td>';
                
                html += '<td>' + item.midName + '</td>';
                
                html += '<td>' + item.discountCTimes + '</td>';
                
                html += '<td>' + item.discountTTimes + '</td>';
                
                html += '<td>' + item.discountDTimes + '</td>';
                
                html += '<td>' + (item.discountCMoney/100.0)+"元" + '</td>';
                
                html += '<td>' + (item.discountDMoney/100.0)+"元" + '</td>';
                
                html += '</tr>';
            });
            $(html).appendTo($("#dataList_purchase"));
            tools.tooltipInit();
        }else{
            $("#div_purchase").hide();
        }
    };
    
    return obj;
})();



$(document).ready(function() {
    if( getCookie('card.membership.id') && getCookie('card.membership.id') != '' ){
        memberDetail.id = getCookie('card.membership.id');
        memberDetail.getData();
        removeCookie('card.membership.id');
    }

});