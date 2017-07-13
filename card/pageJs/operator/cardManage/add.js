/**
 * 页面状态参数
 */
var pageStatus = (function(){
    var obj = {};

    obj.isEdit = false;
    obj.data = {};

    /**
     *
     * @param cardId
     */
    obj.setData = function( cardId ){
        http.post( '/unionCardAudit/selectUnionCardAuditById', {'id' : cardId}, function( res ){
            if( res.statusCode == 0 ){
                obj.data = res.jbody.UnionCardAudit;

                //console.log( obj.data );


                fileUploadUnit.setDefault();//图片地址初始化
                addCard.setDefault();//通行权益信息初始化
            }
        });
    };


    return obj;
})();

//文件上传
var fileUploadUnit = (function(){
    var obj = {};
    obj.host = JSON.parse(getCookie('card.host'));
    obj.filePath = {
        'Image'   : '',
        'Logo'    : '',
        'Detail'  : '',
        'Voucher' : ''
    };
    obj.setPath = function( key, value ){
        obj.filePath[key] = value;
    };
    obj.getPath = function( key, value ){
        return obj.filePath[key];
    };
    obj.checkPath = function(){

        if( obj.filePath.Image == '' ){
            tools.toastr( '请先上传通行权益卡面图片', '警告', 'error' );
            return false;
        }
        //if( obj.filePath.Logo == '' ){
        //    tools.toastr( '请先上通行权益卡面LOGO图片', '警告', 'error' );
        //    return false;
        //}
        if( obj.filePath.Detail == '' ){
            tools.toastr( '请先上传通行权益详情图片', '警告', 'error' );
            return false;
        }
        if( obj.filePath.Voucher == '' ){
            tools.toastr( '请先上传审核凭证', '警告', 'error' );
            return false;
        }
        return true;
    };

    obj.containers = [
        {
            'name' : 'Image',
            'type' : 'image'
        },
        {
            'name' : 'Logo',
            'type' : 'image'
        },
        {
            'name' : 'Detail',
            'type' : 'image'
        },
        {
            'name' : 'Voucher',
            'type' : 'file'
        }
    ];

    obj.fileName = '';//临时存储文件名
    obj.fileType = '';//临时存储文件类型

    $(document).ready(function(){

        //初始化控件
        $(obj.containers).each(function( index, item ){

            $('#fileupload' + item.name).fileupload({
                dataType: 'json',
                maxFileSize : 1, // 2 MB
                add: function (e, data) {
                    //检验图片
                    var size = data['files'][0]['size'];
                    var type = data['files'][0]['type'];

                    //form数据整理
                    $("#name" + item.name ).attr('value', 'file' + item.name);
                    if( item.type == 'file' ){
                        $("#prefix" + item.name ).attr('value', 'Temp/Private/Bucket/unionCard');
                    }else{
                        $("#prefix" + item.name ).attr('value', 'Temp/unionCard');
                    }

                    $("#fileName" + item.name ).attr('value', '');

                    if( item.name == 'Detail' ){
                        $("#longEdge" + item.name ).attr('value', '');
                    }else{
                        $("#longEdge" + item.name ).attr('value', '1000');
                    }

                    obj.fileName = data['files'][0]['name'];//临时文件名称存储
                    obj.fileType = data['files'][0]['type'];//临时文件类型存储

                    //文件类型校验
                    if( item.type == 'image' ){
                        if( !tools.isImage( data['files'][0]['type'], true ) ){
                            return false;
                        }
                    }
                    else if( item.type == 'file' ){
                        if( !tools.isFile(data, true ) ){
                            return false;
                        }
                    }

                    //检查文件大小
                    if( !tools.checkaddfile(size) ){
                        return false;
                    }

                    $("#progressBarDiv" + item.name ).show();
                    data.submit();
                },
                progress: function (e, data) {
                    //上传进度
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $("#progressBar" + item.name).attr("style", "width:" + progress + "%;");
                },
                done: function (e, data) {

                    if( data.result.statusCode == 0 ){

                        obj.setPath( item.name, data.result.jbody.path );

                        $("#progressBar"  + item.name ).attr("style", "width:0%;");
                        $("#progressBarDiv"  + item.name ).hide();


                        if( item.type == 'image' ){
                            //是图片，展示图片
                            $("#addPreviewImagePreview" + item.name ).attr("src", getCookie('card.host.public') + data.result.jbody.path);
                        }else{
                            //是普通文件，展示图标
                            //$("#fileDiv" + item.name ).html( '<i class="fa fa-file-zip-o m-r"></i>' + obj.fileName );
                            $("#fileDiv" + item.name ).html( '<i class="fa fa-file-zip-o m-r"></i>' + obj.fileName+'<a class="icon-only text-info" data-toggle="tooltip" data-original-title="下载附件" href="' + getCookie('card.host.public') + data.result.jbody.path + '"><i class="fa fa-download"></i></a>' );
                            tools.tooltipInit();
                        }
                    }else{
                        //处理上传异常
                        tools.toastr( '上传 异常', '', 'error' );

                        $("#progressBar" + item.name ).attr("style", "width:0%;");
                        $("#progressBarDiv"  + item.name ).hide();
                        return false;
                    }
                }
            });
        });
    });

    /**
     * 编辑时初始化图片参数和DOM
     */
    obj.setDefault = function(){
        obj.filePath = {
            'Image'   : pageStatus.data.image || '',
            'Logo'    : pageStatus.data.logo || '',
            'Detail'  : pageStatus.data.detailImage || '',
            'Voucher' : pageStatus.data.auditVoucher.split('?')[0] || ''
        };

        $(obj.containers).each(function( index, item ){
            if( obj.getPath( item.name ) != '' ){
                if( item.type == 'image' ){
                    $("#addPreviewImagePreview" + item.name ).attr("src", obj.host.public + obj.getPath(item.name));
                }else{
                    $("#fileDiv" + item.name ).html( '<i class="fa fa-file-zip-o m-r"></i><a class="icon-only text-info" data-toggle="tooltip" data-original-title="下载附件" href="' + getCookie('card.host.private') + pageStatus.data.auditVoucher + '"><i class="fa fa-download"></i></a>' );
                    tools.tooltipInit();
                }

            }
        })

    };

    return obj;
})();

//选择折扣、优惠券、门票
var selectDCT = (function(){
    var obj = {};
    obj.discountList = [];
    obj.couponList = [];
    obj.ticketList = [];

    obj.selectD = function(){
        var selectedId=[];

        $("#discount-select tr").each(function(){
            var id = $(this).attr("data-id");
            if(id){
                id=JSON.parse(id);
                selectedId.push(id);
            }
        });
        $("#dataList-discount").find(".i-checks input:checked").each(function(){
            var ob = JSON.parse($(this).attr("data-info"));
            //console.log( ob );
            if(selectedId.indexOf(ob.id)==-1){
                obj.discountList.push( ob );
                var html  = '<tr data-id='+ob.id+' data-name='+ob.discountName+'>';
                html += '<td>'+ob.discountName+'</td>';
                html += '<td>'+ob.discountAliasName+'</td>';
                html += '<td style="word-break: break-all;">';
                if(ob.extendData.length > 0){
                	html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="查看可用门店" onclick="tools.merchantView(\'' + ob.extendData + '\')"><i class="fa fa-eye"></i></a>';
                }else{
                	html += '   <span style="color:red">暂无可用门店</span>';
                }
                html += '</td>';
                html += '<td>'+ob.useRule+'</td>';
                html += '<td>'+ob.periodTime+'</td>';
                html += '<td>'+ob.status+'</td>';
                html += '<td style="word-break: break-all;">'+ob.description+'</td>';
                html += '<td>';
                html += '<a class="icon-only text-danger" data-toggle="tooltip" title="" data-original-title="删除" onclick="selectDCT.Delete(event)">';
                html += '<i class="fa fa-trash-o"></i>';
                html += '</a>';
                html += '</td>';
                html += '</tr>';
                $(html).appendTo($("#discount-select"));
            }
        });
    };

    obj.selectC = function(){
        var selectedId=[];

        $("#coupon-select tr").each(function(){
            var id = $(this).attr("data-id");
            var num;
            if(id){
                id=JSON.parse(id);
                selectedId.push(id);
            }
        });

        $("#dataList-coupon").find(".i-checks input:checked").each(function(){
            var ob = JSON.parse($(this).attr("data-info"));
            var num = $(this).parent().parent().parent().parent().parent().find('td:last input').val();
            ob['num'] = num;
            var index = selectedId.indexOf(ob.id);
            if(index ==-1){
                obj.couponList.push( ob );
                var html  = '<tr data-id='+ob.id+' data-name='+ob.couponName+' data-num='+ob.num+'>';
                html += '<td>'+ob.couponName+'</td>';
                html += '<td>'+ob.couponAliasName+'</td>';
                html += '<td style="word-break: break-all;">';
                if(ob.extendData.length > 0){
                	html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="查看可用门店" onclick="tools.merchantView(\'' + ob.extendData + '\')"><i class="fa fa-eye"></i></a>';
                }else{
                	html += '   <span style="color:red">暂无可用门店</span>';
                }
                html += '</td>';
                html += '<td>'+ob.useRule+'</td>';
                html += '<td>'+ob.num+'</td>';
                html += '<td>'+ob.periodTime+'</td>';
                html += '<td>'+ob.status+'</td>';
                html += '<td style="word-break: break-all;">'+ob.notice+'</td>';
                html += '<td>';
                html += '<a class="icon-only text-danger" data-toggle="tooltip" title="" data-original-title="删除" onclick="selectDCT.Delete(event)">';
                html += '<i class="fa fa-trash-o"></i>';
                html += '</a>';
                html += '</td>';
                html += '</tr>';
                $(html).appendTo($("#coupon-select"));
            }else{
                var indexTr = $("#coupon-select tr:nth-child("+(index+1)+")");
                //console.log(indexTr);
                var selectedNum = indexTr.attr("data-num");
                if(num!=selectedNum){
                    indexTr.attr("data-num",num);
                    indexTr.find("td:nth-child(5)").html(num);
                }
            }
        });
    };

    obj.selectT = function(){
        var selectedId=[];
        $("#ticket-select tr").each(function(){
            var id = $(this).attr("data-id");
            if(id){
                id=JSON.parse(id);
                selectedId.push(id);
            }
        });
        $("#dataList-ticket").find(".i-checks input:checked").each(function(){
            var ob = JSON.parse($(this).attr("data-info"));
            if(selectedId.indexOf(ob.id)==-1){
                obj.ticketList.push( ob );
                var html  = '<tr data-id='+ob.id+' data-name='+ob.ticketName+'>';
                html += '<td>'+ob.ticketName+'</td>';
                html += '<td>'+ob.ticketAliasName+'</td>';
                html += '<td style="word-break: break-all;">';
                if(ob.extendData.length > 0){
                	html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="查看可用门店" onclick="tools.merchantView(\'' + ob.extendData + '\')"><i class="fa fa-eye"></i></a>';
                }else{
                	html += '   <span style="color:red">暂无可用门店</span>';
                }
                html += '</td>';
                html += '<td>'+ob.maxUse+'</td>';
                html += '<td>'+ob.periodTime+'</td>';
                html += '<td>'+ob.status+'</td>';
                html += '<td style="word-break: break-all;">'+ob.description+'</td>';
                html += '<td>';
                html += '<a class="icon-only text-danger" data-toggle="tooltip" title="" data-original-title="删除" onclick="selectDCT.Delete(event)">';
                html += '<i class="fa fa-trash-o"></i>';
                html += '</a>';
                html += '</td>';
                html += '</tr>';
                $(html).appendTo($("#ticket-select"));
            }
        });
    };

    obj.Delete = function(e){
        //console.log(e.target);
        if($(e.target).is('i')){
            $(e.target).parent().parent().parent().remove();
        }else{
            $(e.target).parent().parent().remove();
        }
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
                str += t.merchantName + '<br>';
            });
        }
        if(str.length > 0){
        	var html = '   <a class="icon-only text-muted" data-toggle="tooltip" title="查看可用门店" onclick="tools.merchantView(\'' + str + '\')"><i class="fa fa-eye"></i></a>';
        }else{
        	var html = '   <span style="color:red">暂无可用门店</span>';
        }
        return html;
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


    return obj;
})();


/**
 * 上传通行权益信息
 */
var addCard = (function(){
    var obj = {};
    obj.checkInfo = [
        {
            'name' : 'cardName',
            'exp'  : '通行权益名称'
        },
        {
            'name' : 'cardAliasName',
            'exp'  : '通行权益别名'
        },
//      {
//          'name' : 'prestoreMoney',
//          'exp'  : '通行权益中余额'
//      },
        {
            'name' : 'price',
            'exp'  : '标准售价'
        },
        {
            'name' : 'allCnt',
            'exp'  : '发行数量'
        },
        {
            'name' : 'csTel',
            'exp'  : '客服电话'
        }
    ];

    obj.submitForm = function( auditStatus ){

        var userInfo = JSON.parse( getCookie('card.userinfo') );

        //console.log( $('.summernote').eq(0).summernote('code')[0].innerHTML );

        var checkPass = true;


        //有效时间判断
        var permanentSelect = $("#permanentSelect option:selected").val();
        //console.log( permanentSelect );
        var permanent = 0;

        if( permanentSelect == 0 ){
            obj.checkInfo.splice( (obj.checkInfo.length - 1), 1 );
            obj.checkInfo = [
                {
                    'id' : 'cardName',
                    'errMsg'  : '通行权益名称'
                },
                {
                    'id' : 'cardAliasName',
                    'errMsg'  : '通行权益别名'
                },
//              {
//                  'id' : 'prestoreMoney',
//                  'errMsg'  : '通行权益中余额'
//              },
                {
                    'id' : 'price',
                    'errMsg'  : '标准售价'
                },
                {
                    'id' : 'allCnt',
                    'errMsg'  : '发行数量'
                },
                //{
                //    'id' : 'csTel',
                //    'errMsg'  : '客服电话'
                //},
                {
                    'id' : 'beginDate',
                    'errMsg'  : '通行权益有效期开始时间'
                },
                {
                    'id' : 'endDate',
                    'errMsg'  : '通行权益有效期结束时间'
                }
            ];
        }else if( permanentSelect == 1 ){
            obj.checkInfo = [
                {
                    'id' : 'cardName',
                    'errMsg'  : '通行权益名称'
                },
                {
                    'id' : 'cardAliasName',
                    'errMsg'  : '通行权益别名'
                },
//              {
//                  'id' : 'prestoreMoney',
//                  'errMsg'  : '通行权益中余额'
//              },
                {
                    'id' : 'price',
                    'errMsg'  : '标准售价'
                },
                {
                    'id' : 'allCnt',
                    'errMsg'  : '发行数量'
                },
                //{
                //    'id' : 'csTel',
                //    'errMsg'  : '客服电话'
                //},
                {
                    'id' : 'period',
                    'errMsg'  : '通行权益有效时间'
                }
            ];
        }else{
            obj.checkInfo = [
                {
                    'id' : 'cardName',
                    'errMsg'  : '通行权益名称'
                },
                {
                    'id' : 'cardAliasName',
                    'errMsg'  : '通行权益别名'
                },
//              {
//                  'id' : 'prestoreMoney',
//                  'errMsg'  : '通行权益中余额'
//              },
                {
                    'id' : 'price',
                    'errMsg'  : '标准售价'
                },
                {
                    'id' : 'allCnt',
                    'errMsg'  : '发行数量'
                },
                //{
                //    'id' : 'csTel',
                //    'errMsg'  : '客服电话'
                //}
            ];
            permanent = 1;
        }

        //空判断
        checkPass = tools.checkInputNull( obj.checkInfo );
        

        //文件URL判断
        if( checkPass ){
            if( !fileUploadUnit.checkPath() ){
                checkPass = false;
                return false;
            }
        }

        if( checkPass ){

            var discountArry=[];
            $("#discount-select tr").each(function(){
                var info={
                    'itemId':$(this).attr('data-id'),
                    'itemName':$(this).attr('data-name'),
                    'itemType':'D'
                };
                discountArry.push(info);
            });

            var couponArry=[];
            $("#coupon-select tr").each(function(){
                var num = $(this).attr('data-num');
                for(i=0;i<num;i++){
                    var info={
                        'itemId':$(this).attr('data-id'),
                        'itemName':$(this).attr('data-name'),
                        'itemType':'C'
                    };
                    couponArry.push(info);
                }
            });

            var ticketArry=[];
            $("#ticket-select tr").each(function(){
                var info={
                    'itemId':$(this).attr('data-id'),
                    'itemName':$(this).attr('data-name'),
                    'itemType':'T'
                };
                ticketArry.push(info);
            });

            var data = {
                //自然主键ID
                'ID'            : ( pageStatus.isEdit ? pageStatus.data.id : '' ),
                //运营商ID
                'operatorsId'   : userInfo.operatorsId,
                //通行权益名称
                'cardName'      : $("#cardName").val(),
                //通行权益别名
                'cardAliasName' : $("#cardAliasName").val(),
                //运营截止日期（精确到日）
                'disusedDate'   : $("#disusedDate").val(),
                //有效开始日期（精确到日）
                'beginDate'     : $("#beginDate").val(),
                //有效结束日期（精确到日）
                'endDate'       : $("#endDate").val(),
                //有效期（天数）
                'period'        : $("#period").val(),
                //是否永久有效 0-否，1-是
                'permanent'     : permanent,
                //储值金额（分）
                'prestoreMoney' : $("#prestoreMoney").val() * 100,
                //售价（分）
                'price'         : parseFloat( $("#price").val() ) * 100,
                //发行量
                'allCnt'        : $("#allCnt").val(),
                //实名认证 0：否 1：是
                'realAuth'      : $("input[name='realAuth']:checked").val(),
                //通行权益优惠券、余额、折扣权限可同时使用的组合（REPEL：不可同时使用, C-券 B-余额 D-折扣 CB：券、余额可同时使用。其它组合类比）
                'combination'   : 'REPEL',
                //背景图
                'image'         : fileUploadUnit.filePath['Image'],
                //logo图
                'logo'          : fileUploadUnit.filePath['Logo'],
                //通行权益详情图片地址
                'detailImage'   :fileUploadUnit.filePath['Detail'],
                //客服电话，支持多个，JSONArray格式 [{'name':'陈进','tel':'18551626285'},{name':'小顾','tel':'18325585166'}]
                'csTel'         : JSON.stringify( [{'name': '客服', 'tel' : $("#csTel").val() }] ),
                //线下转账帐号，支持多个，JSONArray格式 [{'name':'陈进的支付宝','account':'18551626285','remark':'支付宝用户支付到这个账号'},{name':'小顾的微信','account':'18325585166'，,'remark':'微信用户支付到这个账号'}]
                'tsAccount'     : '',
                //审核凭证 上传zip格式文件 ，此字段填文件保存的地址 ）
                'auditVoucher'  : fileUploadUnit.filePath['Voucher'],
                //审核状态 1-未审核，2-提交审核，3-审核中，4-审核不通过，5-审核通过
                'auditStatus'   : auditStatus,
                //是否展示通卡数量：0-不展示，1-展示
                'showSellCnt'   : $("input[name='showSellCnt']:checked").val(),
                //是否在手机端展示：0-否，1-是
                'showInApp'   : $("input[name='showInApp']:checked").val(),
                //说明
                'description'   : $('#description').summernote('code'),
                //关联的折扣ID,JSON格式字符串[{'itemId':'2','itemName':'九八折','itemType':'D'},{'itemId':'3','itemName':'八折','itemType':'D'}]
                'JSONdiscount'  : JSON.stringify(discountArry),
                //关联的优惠券ID，JSON格式字符串[{'itemId':'1','itemName':'现金优惠券','itemType':'C'},{'itemId':'2','itemName':'茶饮券','itemType':'C'}]
                'JSONcoupon'    : JSON.stringify(couponArry),
                //关联的门票ID，JSON格式字符串[{'itemId':'1','itemName':'九寨沟门票','itemType':'T'},{'itemId':'2','itemName':'迪士尼门票','itemType':'T'}]
                'JSONticket'    : JSON.stringify(ticketArry),
            };

            //console.log( $('.summernote').summernote('code') );
            //console.log( $('.summernote').val() );
            //console.log( data );

            var url = pageStatus.isEdit ? '/unionCardAudit/updateUnionCardAudit' : '/unionCardAudit/insertUnionCardAudit';
            http.post( url, data, function( res ){
                if( res.statusCode == 0 ){
                    swal({
                        title: res.msg,
                        text: "",
                        type: "success"
                    }, function(){
                        tools.href( '/pages/operator/cardManage/list.html' );
                    });
                }else{
                    swal( res.msg, '', 'error' );
                }
            });
        }

    };

    /**
     * 编辑时初始化参数和DOM
     */
    obj.setDefault = function(){

        $(obj.checkInfo).each(function( index, item ){
            if( pageStatus.data[ item.name] && pageStatus.data[ item.name] != '' ){
                if( item.name == 'csTel' ){
                    $("#" + item.name).attr( 'value', JSON.parse(pageStatus.data[ item.name])[0].tel );
                }else{
                    $("#" + item.name).attr( 'value', pageStatus.data[ item.name] );
                }
            }
        });
        $("input[name='realAuth'][value=" + pageStatus.data.realAuth + "]").iCheck('check');
        $("input[name='showSellCnt'][value=" + pageStatus.data.showSellCnt + "]").iCheck('check');
        $("input[name='showInApp'][value=" + pageStatus.data.showInApp + "]").iCheck('check');

        
        //日期初始化
        var dateList = ['disusedDate', 'beginDate', 'endDate'];
        $(dateList).each(function(index, item){
            if( pageStatus.data[ item ] && pageStatus.data[ item ] != '' ){
                var newDate = new Date();
                newDate.setTime( parseInt(pageStatus.data[ item ]) );
                $("#" + item).attr( 'value', newDate.format('yyyy-MM-dd') );
            }
        });
        //金额转换
        $("#prestoreMoney").val(pageStatus.data.prestoreMoney);
        $("#prestoreMoney").val( $("#prestoreMoney").val() /100.0 );
        $("#price").val( $("#price").val() /100.0 );



        //说明
        $('#description').summernote('code', pageStatus.data.description);

        //$("input[name='permanent']").eq(0).attr('checked', pageStatus.data.permanent);
        //$("input[name='permanent']").eq(1).attr('checked', !pageStatus.data.permanent);
        //
        //if( pageStatus.data.permanent ) {
        //    $(".permanent").hide();
        //    $("#beginDate").val('');
        //    $("#endDate").val('');
        //    $("#period").val('');
        //}else{
        //    $(".permanent").show();
        //}

        if( pageStatus.data.permanent ){//永久有效
            $("#permanentSelect option").eq(2).attr( 'selected', 'selected' );
        }else{
            //有效期
            if( pageStatus.data.period && pageStatus.data.period != '' && pageStatus.data.period > 0){
                $("#period").val( pageStatus.data.period );
                $("#permanentSelect option").eq(1).attr( 'selected', 'selected' );
            }else{
                $("#permanentSelect option").eq(0).attr( 'selected', 'selected' );
            }
        }

        $(".permanentOption").each(function( index, item ){
            $(item).addClass('hide');
            if( index == parseInt($("#permanentSelect option:selected").val()) ){
                $(item).removeClass('hide');
            }
        });

        var card_updateTime= pageStatus.data.updateTime;
        //折扣、优惠券、门票列表数据初始化
        $( pageStatus.data.extendData).each(function( index, item ){
            switch( item.itemType ){
                case 'D'://折扣
                    var discount = item.extendData;
                    
                    var useRule = '';
                    if(discount.discountType==1){
						if(discount.maxDiscount==discount.discountValue){
							useRule += discount.discountValue/100.0+'元抵扣(消费满'+discount.minimum/100.0+'元使用';
						}else{
							useRule += discount.discountValue/100.0+'元抵扣(消费每满'+discount.minimum/100.0+'元使用';
						}
					}else{
						useRule += discount.discountValue/10.0+'折(消费满'+discount.minimum/100.0+'元使用';
					};
					if(discount.maxDiscount!=-1&&discount.maxDiscount!=discount.discountValue){
                        useRule += ',最高抵扣'+discount.maxDiscount/100.0+'元';
                    }
                    useRule += ')';
                    
                    var html  = '<tr data-id="'+discount.id+'" data-name="'+discount.discountName+'">';
                    html += '<td>' + (discount.discountName   || '') + '</td>';
                    html += '<td>' + (discount.discountAliasName   || '') + '</td>';
                    //适用门店
                    html += '<td style="word-break: break-all;">' + selectDCT.merchantList( discount.extendData ) + '</td>';
                    html += '<td>' + useRule +'</td>';
                    html += '<td>' + selectDCT.getPeriodTime( discount.permanent, discount.beginDate, discount.endDate, discount.period ) + '</td>';
                    html += '<td>' + selectDCT.getStatus( discount.status ) + ((card_updateTime-(discount.updateTime||0))>0?'':'<div style="color:#FF0000;">[该项已被重新编辑，需重新审核后生效！]</div>') + '</td>';

                    html += '<td style="word-break: break-all;">' + (discount.description || '') + '</td>';
                    html += '<td>';
                    html += '   <a class="icon-only text-danger" data-toggle="tooltip" title="" data-original-title="删除" onclick="selectDCT.Delete(event)">';
                    html += '   <i class="fa fa-trash-o"></i>';
                    html += '</a>';
                    html += '</td>';
                    html += '</tr>';
                    $(html).appendTo($("#discount-select"));

                    break;
                case 'C'://优惠券
                    var coupon = item.extendData;

					var selectedId=[];

			        $("#coupon-select tr").each(function(){
			            var id = $(this).attr("data-id");
			            if(id){
			                id=JSON.parse(id);
			                selectedId.push(id);
			            }
			        });
		            var index = selectedId.indexOf(coupon.id);
		            if(index ==-1){
		                var useRule = '';
	                    if(coupon.discountType==1){
							if(coupon.maxDiscount==coupon.discountValue){
								useRule += coupon.discountValue/100.0+'元抵扣(消费满'+coupon.minimum/100.0+'元使用';
							}else{
								useRule += coupon.discountValue/100.0+'元抵扣(消费每满'+coupon.minimum/100.0+'元使用';
							}
						}else{
							useRule += coupon.discountValue/10.0+'折(消费满'+coupon.minimum/100.0+'元使用';
						};
						if(coupon.maxDiscount!=-1&&coupon.maxDiscount!=coupon.discountValue){
	                        useRule += ',最高抵扣'+coupon.maxDiscount/100.0+'元';
	                    }
	                    useRule += ')';
	
	                    var html  = '<tr data-id="'+coupon.id+'" data-name="'+coupon.couponName+'" data-num="1">';
	                    html += '<td>' + (coupon.couponName   || '') + '</td>';
	                    html += '<td>' + (coupon.couponAliasName   || '') + '</td>';
	
	                    //适用门店
	                    html += '<td style="word-break: break-all;">' + selectDCT.merchantList( coupon.extendData ) + '</td>';
	                    html += '<td>' + useRule +'</td>';
	                    
	                    html += '<td>1</td>';
	                    html += '<td>' + selectDCT.getPeriodTime( coupon.permanent, coupon.beginDate, coupon.endDate, coupon.period ) + '</td>';
						html += '<td>' + selectDCT.getStatus( coupon.status ) + ((card_updateTime-(coupon.updateTime||0))>0?'':'<div style="color:#FF0000;">[该项已被重新编辑，需重新审核后生效！]</div>') + '</td>';
	                    html += '<td style="word-break: break-all;">' + ( coupon.notice || '' ) + '</td>';
	                    html += '<td>';
	                    html += '   <a class="icon-only text-danger" data-toggle="tooltip" title="" data-original-title="删除" onclick="selectDCT.Delete(event)">';
	                    html += '   <i class="fa fa-trash-o"></i>';
	                    html += '</a>';
	                    html += '</td>';
	                    html += '</tr>';
	                    $(html).appendTo($("#coupon-select"));
		            }else{
		                var indexTr = $("#coupon-select tr:nth-child("+(index+1)+")");
		                //console.log(indexTr);
		                var selectedNum = JSON.parse(indexTr.attr("data-num"));
		                indexTr.attr("data-num",selectedNum+1);
	                    indexTr.find("td:nth-child(5)").html(selectedNum+1);
		            }
                    break;
                case 'T'://门票
                    var ticket = item.extendData;
                    var html  = '<tr data-id="'+ticket.id+'" data-name="'+ticket.ticketName+'">';
                    html += '<td>' + (ticket.ticketName   || '') + '</td>';
                    html += '<td>' + (ticket.ticketAliasName      || '') + '</td>';
                    //适用门店
                    html += '<td style="word-break: break-all;">' + selectDCT.merchantList( ticket.extendData ) + '</td>';
                    html += '<td>' + (ticket.maxUse || '') + '</td>';
                    html += '<td>' + selectDCT.getPeriodTime( ticket.permanent, ticket.beginDate, ticket.endDate, ticket.period ) + '</td>';

                    html += '<td>' + selectDCT.getStatus( ticket.status ) + ((card_updateTime-(ticket.updateTime||0))>0?'':'<div style="color:#FF0000;">[该项已被重新编辑，需重新审核后生效！]</div>') + '</td>';

                    html += '<td style="word-break: break-all;">' + ( ticket.description || '' ) + '</td>';
                    html += '<td>';
                    html += '   <a class="icon-only text-danger" data-toggle="tooltip" title="" data-original-title="删除" onclick="selectDCT.Delete(event)">';
                    html += '   <i class="fa fa-trash-o"></i>';
                    html += '</a>';
                    html += '</td>';
                    html += '</tr>';
                    $(html).appendTo($("#ticket-select"));
                    break;
            }
        });


        //审核不通过，显示原因
        if( pageStatus.data.auditStatus == 4 ){

            $("#auditStatusContainer").show();
            //console.log( tools.getFormatTime( pageStatus.data.createTime, 'yyyy-MM-dd' ) );
            //console.log( tools.getFormatTime( pageStatus.data.commitTime, 'yyyy-MM-dd' ) );
            //console.log( tools.getFormatTime( pageStatus.data.auditTime,  'yyyy-MM-dd' ) );
            $("#commitTime").html( tools.getFormatTime( pageStatus.data.createTime, 'yyyy-MM-dd' ) );
            $("#auditTime" ).html( tools.getFormatTime( pageStatus.data.createTime, 'yyyy-MM-dd' ) );
            $("#auditReasion").html( '原因： ' + pageStatus.data.reason );
        }
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
        	str = '	<span style="color:red">暂无可用门店</span>';
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

    return obj;

})();

//查询折扣列表
var queryselectDiscount = (function() {
	var obj = {};
	var pageBar = $("#pageBar-discount");
	var tableBody = $("#dataList-discount");
	var queryPageUtil = new PageUtils(pageBar, tableBody);
	obj.loadQuery = function(page, removeIfEmpty) {
        //if( $(tableBody).html().trim() == '' ){
            queryPageUtil.loadPage(page, '/discount/selectDiscount', {
                    'operatorsId': operatorsId,
                    'searchText': $("#searchText_1").val(),
                    'extendData':'mustHaveScenic',
                    'status':1
                },
                function(jsonResponse) {
                    var pagination = jsonResponse['jbody']['pageInfo'];
                    //tableBody.html('');
                    if(!pagination['list'] || pagination['list'].length == 0) {
                        //tools.toastr("无符合的搜索内容", "提示信息", 'warning');
                        return;
                    }
                    $(pagination['list']).each(function(index, item) {
                        var html = '<tr>';
                        var extendData='';
                        var dataInfoextendData='';
                        var useRule='';

                        if(item.extendData.length>0){
                            for(i=0;i<item.extendData.length;i++){
                                extendData=extendData+ item.extendData[i].merchantName+'<br>';
                            }
                            dataInfoextendData = extendData;
                            extendData = '<a class="icon-only text-muted" data-toggle="tooltip" title="查看可用门店" onclick="tools.merchantView(\'' + extendData + '\')"><i class="fa fa-eye"></i></a>';
                        }else{
                            extendData += '   <a class="icon-only text-warning" data-toggle="modal" href="./operator/discount/add.html" data-target="#project-add" onclick="discountLinkmerchant('+item.id+')">';
                            extendData += '		<i class="fa fa-link"></i>';
                            extendData += '   </a>';
                            dataInfoextendData = '无关联门店'
                        };
                        
                        if(item.discountType==1){
							if(item.maxDiscount==item.discountValue){
								useRule += item.discountValue/100.0+'元抵扣(消费满'+item.minimum/100.0+'元使用';
							}else{
								useRule += item.discountValue/100.0+'元抵扣(消费每满'+item.minimum/100.0+'元使用';
							}
						}else{
							useRule += item.discountValue/10.0+'折(消费满'+item.minimum/100.0+'元使用';
						};
						if(item.maxDiscount!=-1&&item.maxDiscount!=item.discountValue){
                            useRule += ',最高抵扣'+item.maxDiscount/100.0+'元';
                        }
                        useRule += ')';

                        var periodTime = selectDCT.getPeriodTime( item.permanent, item.beginDate, item.endDate, item.period );
                        var status = selectDCT.getStatus( item.status );

                        var dataInfo = {
                            'id':item.id,
                            'discountName':item.discountName,
                            'discountAliasName':item.discountAliasName,
                            'useRule':useRule,
                            'periodTime' : periodTime,
                            'status' : status,
                            'description' : (item.description || ''),
                            'extendData':dataInfoextendData
                        };

                        var dataInfoString = JSON.stringify(dataInfo);
                        html += '<td><div class="i-checks"><label><input type="checkbox" value="" data-info=\''+dataInfoString+'\'></label></div></td>';
                        html += '<td>'+item.discountName+'</td>';
                        html += '<td>'+item.discountAliasName+'</td>';
                        html += '<td style="word-break: break-all;">'+extendData+'</td>';
                        html += '<td>'+useRule+'</td>';
                        html += '<td>' + periodTime + '</td>';
//                      html += '<td>' + status + '</td>';
                        html += '<td style="word-break: break-all;">' + (item.description || '') + '</td>';
                        html += '</tr>';
                        $(html).appendTo(tableBody);
                    });
                    tableBody.parent().trimTextLength();
                    tools.tooltipInit();
                    $('.modal-body .i-checks').iCheck({
                        checkboxClass: 'icheckbox_square-green',
                        radioClass: 'iradio_square-green',
                    });
                },
                null,
                removeIfEmpty
            );
        //}
	};
	return obj;
})();



//查询优惠券列表
var queryselectCoupon = (function() {
	var obj = {};
	var pageBar = $("#pageBar-coupon");
	var tableBody = $("#dataList-coupon");
	var queryPageUtil = new PageUtils(pageBar, tableBody);
	obj.loadQuery = function(page, removeIfEmpty) {
        //if( $(tableBody).html().trim() == '' ){
            queryPageUtil.loadPage(page, '/coupon/selectCoupon', {
                    'operatorsId': operatorsId,
                    'searchText': $("#searchText_2").val(),
                    'extendData':'mustHaveScenic',
                    'status':1
                },
                function(jsonResponse) {
                    var pagination = jsonResponse['jbody']['pageInfo'];
                    //tableBody.html('');
                    if(!pagination['list'] || pagination['list'].length == 0) {
                        //tools.toastr("无符合的搜索内容", "提示信息", 'warning');
                        return;
                    }
                    $(pagination['list']).each(function(index, item) {
                        var html = '<tr>';
                        var extendData='';
                        var dataInfoextendData='';
                        var useRule='';

                        if(item.extendData.length>0){
                            for(i=0;i<item.extendData.length;i++){
                                extendData=extendData+item.extendData[i].merchantName+'<br>';
                            }
                            dataInfoextendData = extendData;
                            extendData = '<a class="icon-only text-muted" data-toggle="tooltip" title="查看可用门店" onclick="tools.merchantView(\'' + extendData + '\')"><i class="fa fa-eye"></i></a>';
                        }else{
                            extendData += '   <a class="icon-only text-warning" data-toggle="modal" href="./operator/coupon/add.html" data-target="#project-add" onclick="couponLinkmerchant('+item.id+')">';
                            extendData += '		<i class="fa fa-link"></i>';
                            extendData += '   </a>';
                            dataInfoextendData = '无关联门店'
                        }
                        
						if(item.discountType==1){
							if(item.maxDiscount==item.discountValue){
								useRule += item.discountValue/100.0+'元抵扣(消费满'+item.minimum/100.0+'元使用';
							}else{
								useRule += item.discountValue/100.0+'元抵扣(消费每满'+item.minimum/100.0+'元使用';
							}
						}else{
							useRule += item.discountValue/10.0+'折(消费满'+item.minimum/100.0+'元使用';
						};
                        if(item.maxDiscount!=-1&&item.maxDiscount!=item.discountValue){
                            useRule += ',最高抵扣'+item.maxDiscount/100.0+'元';
                        }
                        useRule += ')';

                        var periodTime = selectDCT.getPeriodTime( item.permanent, item.beginDate, item.endDate, item.period );
                        var status = selectDCT.getStatus( item.status );

                        var dataInfo = {
                            'id':item.id,
                            'couponName':item.couponName,
                            'couponAliasName':item.couponAliasName,
                            'extendData':dataInfoextendData,
                            'useRule':useRule,
                            'periodTime' : periodTime,
                            'status' : status,
                            'notice' : (item.notice || '')
                        };

                        var dataInfoString = JSON.stringify(dataInfo);
                        html += '<td><div class="i-checks"><label><input type="checkbox" value="" data-info=\''+dataInfoString+'\'></label></div></td>';
                        html += '<td>'+item.couponName+'</td>';
                        html += '<td>'+item.couponAliasName+'</td>';
                        html += '<td style="word-break: break-all;">'+extendData+'</td>';
                        html += '<td>'+useRule+'</td>';
                        html += '<td>' + periodTime + '</td>';
//                      html += '<td>' + status + '</td>';
                        html += '<td style="word-break: break-all;">' + (item.notice || '') + '</td>';
                        html += '<td><input type="text" number class="form-control" value="1"></td>';
                        html += '</tr>';
                        $(html).appendTo(tableBody);
                    });
                    tableBody.parent().trimTextLength();
                    tools.tooltipInit();
                    $('.modal-body .i-checks').iCheck({
                        checkboxClass: 'icheckbox_square-green',
                        radioClass: 'iradio_square-green',
                    });
                },
                null,
                removeIfEmpty
            );
        //}

	};
	return obj;
})();

//查询门票列表
var queryselectTicket = (function() {
	var obj = {};
	var pageBar = $("#pageBar-ticket");
	var tableBody = $("#dataList-ticket");
	var queryPageUtil = new PageUtils(pageBar, tableBody);
	obj.loadQuery = function(page, removeIfEmpty) {
        //if( $(tableBody).html().trim() == '' ){
            queryPageUtil.loadPage(page, '/ticket/selectTicket', {
                    'operatorsId': operatorsId,
                    'searchText': $("#searchText_3").val(),
                    'extendData':'mustHaveScenic',
                    'status':1
                },
                function(jsonResponse) {
                    var pagination = jsonResponse['jbody']['pageInfo'];
                    //tableBody.html('');
                    if(!pagination['list'] || pagination['list'].length == 0) {
                        //tools.toastr("无符合的搜索内容", "提示信息", 'warning');
                        return;
                    }
                    $(pagination['list']).each(function(index, item) {
                        var html = '<tr>';
                        var extendData='';
                        var dataInfoextendData='';
                        var maxUse='';

                        if(item.extendData.length>0){
                            for(i=0;i<item.extendData.length;i++){
                                extendData=extendData+item.extendData[i].merchantName+'<br>';
                            }
                            dataInfoextendData = extendData;
                            extendData = '<a class="icon-only text-muted" data-toggle="tooltip" title="查看可用门店" onclick="tools.merchantView(\'' + extendData + '\')"><i class="fa fa-eye"></i></a>';
                        }else{
                            extendData += '   <a class="icon-only text-warning" data-toggle="modal" href="./operator/coupon/add.html" data-target="#project-add" onclick="couponLinkmerchant('+item.id+')">';
                            extendData += '		<i class="fa fa-link"></i>';
                            extendData += '   </a>';
                            dataInfoextendData = '无关联门店'
                        }

                        if(item.maxUse==-1){
                            maxUse += '无限制';
                        }else{
                            maxUse += item.maxUse;
                        }

                        var periodTime = selectDCT.getPeriodTime( item.permanent, item.beginDate, item.endDate, item.period );
                        var status = selectDCT.getStatus( item.status );

                        var dataInfo = {
                            'id':item.id,
                            'ticketName':item.ticketName,
                            'ticketAliasName':item.ticketAliasName,
                            'extendData':dataInfoextendData,
                            'maxUse':maxUse,
                            'periodTime' : periodTime,
                            'status' : status,
                            'description' : (item.description || '')
                        };
                        var dataInfoString = JSON.stringify(dataInfo);
                        html += '<td><div class="i-checks"><label><input type="checkbox" value="" data-info=\''+dataInfoString+'\'></label></div></td>';
                        html += '<td>'+item.ticketName+'</td>';
                        html += '<td>'+item.ticketAliasName+'</td>';
                        html += '<td style="word-break: break-all;">'+extendData+'</td>';
                        html += '<td>'+maxUse+'</td>';
                        html += '<td>' + selectDCT.getPeriodTime( item.permanent, item.beginDate, item.endDate, item.period ) + '</td>';
//                      html += '<td>' + selectDCT.getStatus( item.status ) + '</td>';
                        html += '<td style="word-break: break-all;">' + (item.description || '') + '</td>';
                        html += '</tr>';
                        $(html).appendTo(tableBody);
                    });
                    tableBody.parent().trimTextLength();
                    tools.tooltipInit();
                    $('.modal-body .i-checks').iCheck({
                        checkboxClass: 'icheckbox_square-green',
                        radioClass: 'iradio_square-green',
                    });
                },
                null,
                removeIfEmpty
            );
        //}
	};
	return obj;
})();

//列表入口里的折扣关联门店
function discountLinkmerchant(discountId){
	addProjectsmodal($("#project-add"),1,null,
	function(){
		linkMerchants.submitMerchants('discountId',discountId,'/discount/insertDiscountScenic',$(".modal-body #dataList_1"));
	},
	function(merchantId,merchantName){
		linkMerchants.submitMerchantsSingle('discountId',discountId,'/discount/insertDiscountScenic', merchantId, merchantName);
	},
	function(){
		queryselectDiscount.loadQuery(1);
	});
}
//列表入口里的优惠券关联门店
function couponLinkmerchant(couponId){
	addProjectsmodal($("#project-add"),1,null,
	function(){
		linkMerchants.submitMerchants('couponId',couponId,'/coupon/insertCouponScenic',$(".modal-body #dataList_1"));
	},
	function(merchantId,merchantName){
		linkMerchants.submitMerchantsSingle('couponId',couponId,'/coupon/insertCouponScenic', merchantId, merchantName);
	},
	function(){
		queryselectCoupon.loadQuery(1);
	});
}
//列表入口里的门票关联门店
function ticketLinkmerchant(ticketId){
	addProjectsmodal($("#project-add"),1,null,
	function(){
		linkMerchants.submitMerchants('ticketId',ticketId,'/ticket/insertTicketScenic',$(".modal-body #dataList_1"));
	},
	function(merchantId,merchantName){
		linkMerchants.submitMerchantsSingle('ticketId',ticketId,'/ticket/insertTicketScenic', merchantId, merchantName);
	},
	function(){
		queryselectTicket.loadQuery(1);
	});
}


$(document).ready(function(){

    if( getCookie('card.cardId') && getCookie('card.cardId') != '' ){
        var cardId = getCookie('card.cardId');
        //console.log( cardId );
        removeCookie( 'card.cardId' );
        pageStatus.isEdit = true;

        pageStatus.setData( cardId );

        $(".page-heading h2").html("编辑通行权益");
    }else{
        pageStatus.data = {};
        $(".page-heading h2").html("新增通行权益");
    }

	var userinfo = JSON.parse(getCookie('card.userinfo'));
	operatorsId = userinfo.operatorsId;

    //有效期选择控件
    $("#permanentSelect").change(function(){
        //console.log( $("#permanentSelect option:selected").val() );
        $("#period"   ).val( '' );
        $("#beginDate").val( '' );
        $("#endDate"  ).val( '' );
        $(".permanentOption").each(function( index, item ){
            $(item).addClass('hide');
            if( index == parseInt($("#permanentSelect option:selected").val()) ){
                $(item).removeClass('hide');
            }
        });
    });


    //日期初始化
    $('.input-group.date').datepicker({
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        format: "yyyy-mm-dd"
    });

    //单选框初始化
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    //富文本初始化
    $('.summernote').summernote({
        height: 200
    });

    tools.tooltipInit();
    
    
    $("#modalShow_1").on({
    	'shown.bs.modal':function(){
    		queryselectDiscount.loadQuery(1);
    	}
    });
    $("#modalShow_2").on({
    	'shown.bs.modal':function(){
    		queryselectCoupon.loadQuery(1);
    	}
    });
    
    $("#modalShow_3").on({
    	'shown.bs.modal':function(){
    		queryselectTicket.loadQuery(1);
    	}
    });
    
    $("#search_1").click(function(){
    	queryselectDiscount.loadQuery(1);
    });
    $("#search_2").click(function(){
    	queryselectCoupon.loadQuery(1);
    });
    $("#search_3").click(function(){
    	queryselectTicket.loadQuery(1);
    });
    
    //新增折扣
    $("#discountAdd").click(function(){
        $("#modalShow_1").modal('hide');
		var discountId;
		addProjectsmodal($("#project-add"),0,function () {
	        var discountName = $("#wizard input[name='discountName']").val();
			var discountAliasName = $("#wizard input[name='discountAliasName']").val();
			//抵扣、折扣状态切换
			var discountValue,maxDiscount;
			var discountType = $("input[name='discountType']:checked").val();
			if(discountType==2){
				discountValue = $("input[name='discountValue2']").val();
				maxDiscount =  $("input[name='maxDiscount']").val()*100||-1;
			}else if(discountType==3||discountType==4){
				discountValue = $("input[name='discountValue1']").val()*100;
				if(discountType==3){
					maxDiscount =  discountValue;
				}else if(discountType==4){
					maxDiscount =  $("input[name='maxDiscount']").val()*100||-1;
				};
				discountType = 1;
			}
			var timetype = $("#wizard #timerange-type").val();
			var permanent = false;
			var beginDate,endDate,period;
			if(timetype == 0) {
				beginDate = $("#wizard #start").val();
				endDate = $("#wizard #end").val();
				if(!beginDate){
					tools.toastr( '请填写开始时间', '', 'error' );
	                return false;
				}
				if(!endDate){
					tools.toastr( '请填写结束时间', '', 'error' );
					return false;
				}
			} else if(timetype==1){
				period = $("#wizard input[name='period']").val();
				if(!period){
					tools.toastr( '请填写时间段', '', 'error' );
					return false;
				}
			}else{
				permanent = true;
			};
			var minimum = $("#wizard input[name='minimum']").val() * 100.0 || 0;
			var description = $('#wizard #description').val();
			var url = '/discount/insertDiscount';
			var data = {
				'operatorsId':operatorsId,
				'discountName':discountName,
				'discountAliasName':discountAliasName,
				'discountType': discountType,
				'discountValue':discountValue,
				'permanent':permanent,
				'beginDate':beginDate,
				'endDate':endDate,
				'period':period,
				'minimum':minimum,
				'maxDiscount':maxDiscount,
				'description':description,
				'maxUse':-1,
				'dayMaxUse':-1,
				'status':1,
			};
	        http.post( url, data, function (jsonResponse) {
	        	discountId = jsonResponse.jbody.Discount.id;
	        },null,false);
	        if(discountId||discountId==0){
	        	return true;
	        }
	    },
		function(){
			linkMerchants.submitMerchants('discountId',discountId,'/discount/insertDiscountScenic',$(".modal-body #dataList_1"));
		},
		function(merchantId,merchantName){
			linkMerchants.submitMerchantsSingle('discountId',discountId,'/discount/insertDiscountScenic', merchantId, merchantName);
		},
		function(){
            $("#modalShow_1").modal("show");
			queryselectDiscount.loadQuery(1);
		});
	});
	
	//新增优惠券
	$("#couponAdd").click(function() {
        $("#modalShow_2").modal('hide');
		var couponId;
		addProjectsmodal($("#project-add"), 0, function() {
			var couponName = $("#wizard input[name='couponName']").val();
			var couponAliasName = $("#wizard input[name='couponAliasName']").val();
			var couponPitUrl = '';
			//抵扣、折扣状态切换
			var discountValue,maxDiscount;
			var discountType = $("input[name='discountType']:checked").val();
			if(discountType==2){
				discountValue = $("input[name='discountValue2']").val();
				maxDiscount =  $("input[name='maxDiscount']").val()*100||-1;
			}else if(discountType==3||discountType==4){
				discountValue = $("input[name='discountValue1']").val()*100;
				if(discountType==3){
					maxDiscount =  discountValue;
				}else if(discountType==4){
					maxDiscount =  $("input[name='maxDiscount']").val()*100||-1;
				};
				discountType = 1;
			}
			
			var applyScene='';
			if($('#checkAllapplyScene').is(':checked')) {
				applyScene = $('#checkAllapplyScene').val();
			}else{
				$('input[name="applyScene"]:checked').each(function(){ 
					if(!applyScene){
						applyScene=$(this).val();
					}else{
						applyScene += (","+$(this).val());
					}
				}); 
			}
			if(!applyScene){
				tools.toastr( '请选择适用场景', '', 'error' );
                return false;
			}
			var timetype = $("#wizard #timerange-type").val();
			var permanent = false;
			var beginDate,endDate,period;
			if(timetype == 0) {
				beginDate = $("#wizard #start").val();
				endDate = $("#wizard #end").val();
				if(!beginDate){
					tools.toastr( '请填写开始时间', '', 'error' );
	                return false;
				}
				if(!endDate){
					tools.toastr( '请填写结束时间', '', 'error' );
					return false;
				}
			} else if(timetype==1){
				period = $("#wizard input[name='period']").val();
				if(!period){
					tools.toastr( '请填写时间段', '', 'error' );
					return false;
				}
			}else{
				permanent = true;
			};
			var minimum = $("#wizard input[name='minimum']").val() *100 || 0;
			var allCnt = $("#wizard input[name='allCnt']").val();
			var description = $('#wizard #description').val();
			var url = '/coupon/insertCoupon';
			var data = {
				'operatorsId': operatorsId,
				'couponName': couponName,
				'couponAliasName': couponAliasName,
				'couponPitUrl':couponPitUrl,
				'discountValue': discountValue,
				'permanent': permanent,
				'beginDate': beginDate,
				'endDate': endDate,
				'period': period,
				'allCnt':allCnt,
				'minimum': minimum,
				'maxDiscount': maxDiscount,
				'notice': description,
				'discountType': discountType,
				'status': 1,
				'applyScene': applyScene
			};
			http.post(url, data, function(jsonResponse) {
				couponId = jsonResponse.jbody.Coupon.id;
			}, null, false);
			if(couponId || couponId == 0) {
				return true;
			}
		},
		function(){
			linkMerchants.submitMerchants('couponId',couponId,'/coupon/insertCouponScenic',$(".modal-body #dataList_1"));
		},
		function(merchantId,merchantName){
			linkMerchants.submitMerchantsSingle('couponId',couponId,'/coupon/insertCouponScenic', merchantId, merchantName);
		},
		function(){
            $("#modalShow_2").modal('show');
			queryselectCoupon.loadQuery(1);
		});
	});
	
	//新增门票
	$("#ticketAdd").click(function() {
        $("#modalShow_3").modal("hide");
		var ticketId;
		addProjectsmodal($("#project-add"), 0, function() {
			var ticketName = $("#wizard input[name='ticketName']").val();
			var ticketAliasName = $("#wizard input[name='ticketAliasName']").val();
			var ticketValue = $("#wizard input[name='ticketValue']").val();
			var maxUse = $("#wizard input[name='maxUse']").val();
			var timetype = $("#wizard #timerange-type").val();
			var permanent = false;
			var beginDate,endDate,period;
			if(timetype == 0) {
				beginDate = $("#wizard #start").val();
				endDate = $("#wizard #end").val();
				if(!beginDate){
					tools.toastr( '请填写开始时间', '', 'error' );
	                return false;
				}
				if(!endDate){
					tools.toastr( '请填写结束时间', '', 'error' );
					return false;
				}
			} else if(timetype==1){
				period = $("#wizard input[name='period']").val();
				if(!period){
					tools.toastr( '请填写时间段', '', 'error' );
					return false;
				}
			}else{
				permanent = true;
			};
			var description = $('#wizard #description').val();
			var url = '/ticket/insertTicket';
			var data = {
				'operatorsId': operatorsId,
				'ticketName': ticketName,
				'ticketAliasName': ticketAliasName,
				'ticketValue': 0,
				'permanent': permanent,
				'beginDate': beginDate,
				'endDate': endDate,
				'period': period,
				'minimum': 0,
				'maxTicket': -1,
				'description': description,
				'maxUse': maxUse,
				'dayMaxUse': -1,
				'ticketType': 2,
				'status': 1
			};
			http.post(url, data, function(jsonResponse) {
				ticketId = jsonResponse.jbody.Ticket.id;
			}, null, false);
			if(ticketId || ticketId == 0) {
				return true;
			}
		},
		function(){
			linkMerchants.submitMerchants('ticketId',ticketId,'/ticket/insertTicketScenic',$(".modal-body #dataList_1"));
		},
		function(merchantId,merchantName){
			linkMerchants.submitMerchantsSingle('ticketId',ticketId,'/ticket/insertTicketScenic', merchantId, merchantName);
		},
		function(){
            $("#modalShow_3").modal("show");
			queryselectTicket.loadQuery(1);
		});
	});

});