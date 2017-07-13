var statusName={"0":"失败","1":"完全成功","2":"部分成功","3":"发送中"}

var list_tabs = (function(){
    var obj = {};

    //-------------------------------- list1
    var pageBar = $("#pageTab");
    var tableBody = $("#dataList");
    var queryPageUtil = new PageUtils( pageBar, tableBody);
    obj.data = [];//当前列数据
    obj.loadQuery = function(page, removeIfEmpty) {
        queryPageUtil.loadPage(page,
            '/unionCardSendRecord/selectUnionCardSendRecord',
            {
                'searchText': $("#searchText").val()
            },
            function (jsonResponse) {

                var pagination = jsonResponse['jbody']['pageInfo'];
                tableBody.html('');
                if (pagination['list'] && pagination['list'].length > 0) {
                    //pagination['list'].reverse();
                    obj.data = pagination['list'];
                    $(pagination['list']).each(function (index, item) {
                        var html = '<tr class="animated fadeIn">';
                        html += '<td>' + item.unionCardName + '</td>';
                        html += '<td>' + item.allCount + '</td>';
                        html += '<td>' + ( item.allCount - item.failCount ) + '</td>';
                        html += '<td>' + item.failCount + '</td>';
                        html += '<td>' + statusName[item.status] + '</td>';
                        html += '<td>' + item.sysUserName + '</td>';
                        html += '<td>' + tools.getFormatTime( item.createTime , 'yyyy-MM-dd hh:mm' ) + '</td>';
                        html += '<td>';
                        if(3==item.status){
                        	html += '   <a class="icon-only text-info" data-toggle="tooltip" title="发放中" ><i class="fa fa-circle-o-notch whirl-h"></i></a>';
                        }else{
                        	html += '   <a class="icon-only text-info" data-toggle="tooltip" title="下载记录明细" onclick="list_tabs.download(\'' + index + '\', \'success\')"><i class="fa fa-download"></i></a>';
                            html += '   <a class="icon-only text-warning" data-toggle="tooltip" title="下载错误记录明细" onclick="list_tabs.download(\'' + index + '\', \'error\')"><i class="fa fa-download"></i></a>';
                        }
                        
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

    //-------------------------------- list2
    var pageBar2 = $("#pageTab2");
    var tableBody2 = $("#dataList2");
    var queryPageUtil2 = new PageUtils( pageBar2, tableBody2);
    obj.data2 = [];//当前列数据
    obj.loadQuery2 = function(page, removeIfEmpty) {
        queryPageUtil2.loadPage(page,
            '/unionCardActivateCreateLog/selectUnionCardActivateCreateLog',
            {
                'searchText': $("#searchText2").val()
            },
            function (jsonResponse) {

                var pagination = jsonResponse['jbody']['pageInfo'];
                tableBody2.html('');
                if (pagination['list'] && pagination['list'].length > 0) {
                    //pagination['list'].reverse();
                    obj.data2 = pagination['list'];
                    $(pagination['list']).each(function (index, item) {
                        var html = '<tr class="animated fadeIn">';
                        html += '<td>' + item.unionCardName + '</td>';
                        html += '<td>' + (item.count||'') + '</td>';
                        html += '<td>' + item.sysUserName + '</td>';
                        html += '<td>' + tools.getFormatTime( item.createTime , 'yyyy-MM-dd hh:mm' ) + '</td>';
                        html += '<td><a class="icon-only text-info" data-toggle="tooltip" title="下载激活链接" onclick="list_tabs.download2(\'' + index + '\')"><i class="fa fa-download"></i></a></td>';
                        html += '</tr>';

                        html += '</tr>';
                        $(html).appendTo(tableBody2);
                    });
                    tableBody2.parent().trimTextLength();
                    tools.tooltipInit();
                }
            },
            null,
            removeIfEmpty
        );
    };

    /**
     * 表格1下载
     * @param index
     * @param type
     * @returns {boolean}
     */
    obj.download = function( index, type ){
        var info = obj.data[index];

        if( type == 'success' ){
            if( info.phoneDownUrl && info.phoneDownUrl != '' ){
                location.href = getCookie( 'card.host.public' ) + info.phoneDownUrl;
            }else{
                tools.toastr( '无记录', '', 'warning' );
            }
        }else if( type == 'error' ){
            if( info.errorDataUrl && info.errorDataUrl != '' ){
                location.href = getCookie( 'card.host.public' ) + info.errorDataUrl;
            }else{
                tools.toastr( '无记录', '', 'warning' );
            }
        }
    };

    /**
     * 表格2下载
     * @param index
     */
    obj.download2 = function( index ){
        var info = obj.data2[index];
        if( info.activateDownUrl && info.activateDownUrl != '' ){
            location.href = getCookie( 'card.host.public' ) + info.activateDownUrl;
        }else{
            tools.toastr( '无记录', '', 'warning' );
        }
    };

    obj.type = '';
    obj.switch = function( type ){

        obj.type = type;

        $("#release_list" ).addClass( 'hide' );
        $("#release_form").addClass( 'hide' );

        switch( type ){
            case 'list':
                $("#release_list" ).removeClass( 'hide' );
                break;
            case 'phone':
                $("#release_form").removeClass( 'hide' );
                $(".type-0").show();
                $(".type-1").addClass("hide");
                break;
            case 'link':
                $("#release_form" ).removeClass( 'hide' );
                $(".type-0").hide();
                $(".type-1").removeClass("hide");
                break;
        }
    };

    return obj;
})();



var cardRelease = (function(){

    var obj = {};
    obj.fileUrl = '';
    obj.fileName = '';
    obj.fileType = '';

    $(document).ready(function(){
        //上传附件
        $('#fileupload').fileupload({
            dataType: 'json',
            maxFileSize : 1, // 2 MB
            add: function (e, data) {

                console.log( data['files'][0] );

                //form数据整理
                $("#name").attr('value', 'file');
                $("#prefix").attr('value', 'Temp/Private/Bucket/operators');
                $("#fileName").attr('value', '');
                $("#longEdge").attr('value', '200');

                obj.fileName = data['files'][0]['name'];
                obj.fileType = data['files'][0]['type'];

                //文件类型校验
                var size = data['files'][0]['size'];
                var type = data['files'][0]['type'];
                var name = data['files'][0]['name'];
                if( tools.isExcel( data, true ) ){
                    if( !tools.checkaddfile(size,type) ){
                        return false;
                    }
                }else{
                    return false;
                }

                $("#progressBarDiv").show();
                data.submit();
            },
            progress: function (e, data) {
                //上传进度
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $("#progressBar").attr("style", "width:"+progress+"%;");
            },
            done: function (e, data) {

                if( data.result.statusCode == 0 ){
                    $("#progressBarDiv").hide();
                    $("#progressBar").attr("style", "width:0%;");
                    obj.fileUrl = data.result.jbody.path;
                    //$("#fileDiv").html( '<i class="fa fa-file-zip-o m-r"></i>' + obj.fileName );
                    $("#fileDiv").html( '<i class="fa fa-file-excel-o m-r"></i>' + obj.fileName+'<a class="icon-only text-info" data-toggle="tooltip" data-original-title="下载附件" href="' + getCookie('card.host.public') +  obj.fileUrl + '"><i class="fa fa-download"></i></a>' );
                    tools.tooltipInit();
                }else{
                    tools.toastr( '上传 异常', '', 'error' );

                    $("#progressBar").attr("style", "width:0%;");
                    $("#progressBarDiv").hide();
                    return false;
                }

            }
        });
    });


    /**
     * 获取可发放通行权益列表
     */
    obj.getCardList = function(){
        var url = '/unionCard/selectUnionCard';
        var data = {
            'status'     : 2,//-已上线售卖（前端可见，可购买）
            'operatorsId': JSON.parse( getCookie("card.userinfo") ).operatorsId,
            'pageSize'   : 100,
            'pageNum'    : 1
        };
        http.post( url, data, function( res ){
             if( res.statusCode == 0 ){
                 if( res.jbody.pageInfo.list && res.jbody.pageInfo.list.length > 0 ){
                     var cardList = res.jbody.pageInfo.list;
                     var html = '';
                     $(cardList).each(function( index, item ){
                     	 var num =parseInt(item.allCnt)-parseInt(item.sellCnt);
                         html += '<option value="' + item.id + '" data-num ="'+num+'">';
                         html += item.cardName;
                         html += '</option>';
                     });
                     $(html).appendTo( $("#cardSelect") );
                 }
             }else{
                 tools.toastr( res.msg, '', 'error' );
             }
        });

    };

    obj.checkForm = function(){
        var checkPass = true;

        if( tools.isNull( $("#cardSelect option:selected").val() ) ){
            tools.toastr( '请选择通行权益', '', 'error' );
            $("#cardSelect option:selected").parent().parent().addClass( 'has-error' );
            checkPass = false;
            return false;
        }else{
            $("#cardSelect option:selected").parent().parent().removeClass( 'has-error' );
        }


        //通用判断
        if( list_tabs.type == 'phone' ){
            //导入手机号

            if( obj.fileUrl == '' ){
                tools.toastr( '请导入手机号', '' , 'error' );
                checkPass = false;
                return false;
            }

            //需要填写短信内容
            if( $("input[name='smsSendStatus']:checked").val() == 1 ){
                if( tools.isNull( $("#sms").val() ) ){
                    tools.toastr( '请填写短信内容', '', 'error' );
                    $("#sms").parent().parent().addClass( 'has-error' );
                    checkPass = false;
                    return false;
                }else{
                    $("#sms").parent().parent().removeClass( 'has-error' );
                }
            }

            if( checkPass ){
                $("#modalShow").modal('show');
            }
        }else if( list_tabs.type == 'link' ){
            //生成激活链接

            if( $("#link-num").val() == '' ){
                tools.toastr( '请填写链接数量', '', 'error' );
                checkPass = false;
                return false;
            }

            if( checkPass ){
                obj.submitForm2();
            }
        }

    };

    /**
     * 提交数据
     */
    obj.submitForm = function(){

        var url = '/unionCard/sendUnionCard';
        var data = {
            'cardId'        : $("#cardSelect option:selected").val(),
            'path'          : obj.fileUrl,
            'smsSendStatus' : $("input[name='smsSendStatus']:checked").val(),
            'smsContext'    : $('#sms').val(),
            'remark'        : $('#remark').val(),

            'payType'       : $("#payType option:selected").val(),
            'actualMoney'   : $("#actualMoney").val() * 100,
            'tradeSerialNo' : $("#tradeSerialNo").val()
        };

        http.post( url, data, function(res){
            console.log( res );
            if( res.statusCode == 0 ){
            	swal({
                    title: res.msg,
                    text: "",
                    type: "success"
                }, function(){
                	$("#modalShow").modal('hide');
                    tools.href( '/pages/operator/cardManage/release.html' );
                });
                cardRelease.initForm();
            }else{
                tools.toastr( res.msg, '', 'error' )
            }
            
        });

    };


    /**
     * 生成通行权益链接
     */
    obj.submitForm2 = function(){
        var url = '/unionCard/createUnionCardActiveUrl';
        var data = {
            'cardId' : $("#cardSelect option:selected").val(),
            'count'  : $("#link-num").val(),
            'remark' : $('#remark').val()
        };

        $("#release_list" ).removeClass( 'hide' );
        $("#release_form").addClass( 'hide' );

        http.post( url, data, function(res){
            console.log( res );
            if( res.statusCode == 0 ){
                //swal( res.msg, '', 'success' );
                cardRelease.initForm();
                list_tabs.loadQuery2(1);
                location.href = getCookie( 'card.host.public' ) + res.jbody.UnionCardActivateCreateLog.activateDownUrl;
            }else{
                tools.toastr( res.msg, '', 'error' )
            }
        });

    };

    /**
     * 清空历史输入数据
     */
    obj.initForm = function(){

        $("#cardSelect").select2("val", "");
        //--------------------------------------------- init phone

        $("#fileDiv").html( '' );

        obj.fileName = '';
        obj.fileType = '';
        obj.fileUrl = '';

        var smsSendStatus = $("input[name='smsSendStatus']");
        $( smsSendStatus ).eq(0).removeAttr( 'checked' );
        $( smsSendStatus ).eq(1).prop( 'checked', 'checked' );
        $( smsSendStatus ).iCheck('update');

        $("#smsDiv").addClass("hide");
        $("#sms").val( '' );
        $("#remark").val( '' );

        $("#payType option:selected").removeAttr( 'selected' );
        $("#actualMoney").val( '' );
        $("#tradeSerialNo").val( '' );

        //--------------------------------------------- init link
        $("#link-num").val( '' );



    };

    return obj;
})();

$(document).ready(function(){

    list_tabs.loadQuery(1);
    list_tabs.loadQuery2(1);

    cardRelease.getCardList();

    $("#cardSelect").select2({
        placeholder: "选择需要发放的通行权益",
        allowClear: true,
        width: '400'
    });
    $("#cardSelect").change(function(){
		var num=$("#cardSelect").find("option:selected").attr("data-num");  
    	$("#restCnt").html(num);
    });
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
    $("[data-toggle='tooltip']").tooltip();
    $("#link-num").TouchSpin({
        buttondown_class: 'btn btn-white',
        buttonup_class: 'btn btn-white',
        max:1000
    });
    //$("input[name='type']").on('ifChanged',function(){
    //    var value = $("input[name='type']:checked").val();
    //    if( value != undefined ){
    //        //console.log(value);
    //        if(value==1){
    //            $(".type-0").hide();
    //            $(".type-1").removeClass("hide");
    //        }else if(value==0){
    //            $(".type-0").show();
    //            $(".type-1").addClass("hide");
    //        }
    //    }
    //});
    $("input[name='smsSendStatus']").on('ifChanged',function(){
        var value = $("input[name='smsSendStatus']:checked").val();
        if( value != undefined ){
            //console.log(value);
            if(value==1){
                $("#smsDiv").removeClass("hide");
            }else if(value==0){
                $("#smsDiv").addClass("hide");
                $("#sms").val('');//清空内容
            }
        }

    });
});