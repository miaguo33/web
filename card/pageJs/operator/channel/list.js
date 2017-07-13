/**
 * 分页加载器
 */
var channelQuery = (function() {
    var obj = {};

    obj.data = [];//当前页面数据列表 array
    obj.type = '';//当前操作类型 add edit
    obj.info = {};//当前操作数据 object
    obj.userInfo = JSON.parse( getCookie('card.userinfo'));

    var pageBar = $("#pageTab");
    var tableBody = $("#dataList");
    var queryPageUtil = new PageUtils( pageBar, tableBody);
    obj.loadQuery = function(page, removeIfEmpty) {
        queryPageUtil.loadPage(page,
                '/operators/selectOperatorsChannelList',
                {
                    'operatorsId' : obj.userInfo.operatorsId,
                    'channelName' : $("#searchText").val(),
                    'status'      : 1
                },
                function(jsonResponse) {

                var pagination = jsonResponse['jbody']['pageInfo'];
                tableBody.html('');
                if (!pagination['list'] || pagination['list'].length == 0){
                    //tools.toastr("无符合的搜索内容","提示信息", 'warning')
                    return;
                }
                obj.data = pagination['list'];
                //pagination['list'].reverse();
                $(pagination['list']).each(function(index, item){
                    var html = '<tr class="animated fadeIn">';
                    html += '<td>' + item.channelName + '</td>';
                    html += '<td style="word-break: break-all;">' + http.getFullUrl() + '/cd/cdcurrencycard.html?operatorsId=' + obj.userInfo.operatorsId + '&channelId=' + item.channelId + '</td>';
                    html += '<td>' + item.remark + '</td>';
                    html += '<td>';
                    //html += '<a class="icon-only text-muted" data-toggle="tooltip" title="详情"><i class="fa fa-list-alt"></i></a>';
                    html += '<a class="icon-only text-muted" data-toggle="tooltip" title="编辑" onclick="channelQuery.toEdit(  \'' + index + '\');"><i class="fa fa-edit   "></i></a>';
                    html += '<a class="icon-only text-muted" data-toggle="tooltip" title="删除" onclick="channelQuery.toDelete(\'' + index + '\');"><i class="fa fa-trash-o"></i></a>';
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

    /**
     * 添加
     */
    obj.toAdd = function(){
        obj.type = 'add';
        $("#modalShow").modal('show');
    };

    /**
     * 编辑
     * @param index
     */
    obj.toEdit = function( index ){
        obj.type = 'edit';
        obj.info = obj.data[ index ];
        obj.initForm( obj.info );
        $("#modalShow").modal('show');

    };
    
    /**
     * 删除
     * @param index
     */
    obj.toDelete = function( index ){
        obj.type = 'delete';
        obj.info = obj.data[ index ];

        var url = '/operators/saveOrUpdateOperatorsChannel';
        var data = {
            'channelId'   : obj.info.channelId,
            'operatorsId' : obj.userInfo.operatorsId,
            'channelName' : obj.info.channelName,
            'status'      : 3,
            'remark'      : obj.info.remark
        };

        swal({
            title: "确定删除吗?",
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: false,
            closeOnCancel: false
        }, function (isConfirm) {
            if (isConfirm) {
                http.post(url, data, function( res ){
                    if( res.statusCode == 0 ){
                        swal( res.msg, '', 'success' );
                        channelQuery.loadQuery(1);
                    }else{
                        swal( res.msg, '', 'error' );
                    }
                });
            } else {
                swal("已取消", "", "error");
            }
        });


    };

    /**
     * 初始化表单数据
     * @param info
     */
    obj.initForm = function( info ){

        if( info && info.channelName != ''  ){
            $("#channelName").val( info.channelName );
        }else{
            $("#channelName").val( '' );
        }

        if( info && info.remark != ''  ){
            $("#remark").val( info.remark );
        }else{
            $("#remark").val( '' );
        }
    };

    /**
     * 提交数据
     * @param info
     * @returns {boolean}
     */
    obj.submit = function(){

        var checkPass = true;
        var checkInfo = [
            {
                'id': 'channelName',
                'errMsg' : '渠道名称'
            },
            {
                'id': 'remark',
                'errMsg' : '描述'
            }
        ];

        $(checkInfo).each(function( index, item ){
            $("#" + item.id).parent().parent().removeClass( 'has-error' );
            if( tools.isNull( $("#" + item.id ).val() ) ){
                tools.toastr( '请填写' + item.errMsg, '', 'error' );
                $("#" + item.id).parent().parent().addClass( 'has-error' );
                checkPass = false;
                return false;
            }else{
                $("#" + item.id).parent().parent().removeClass( 'has-error' );
            }
        });

        if( checkPass ){
            var url = '/operators/saveOrUpdateOperatorsChannel';
            var data = {
                //渠道ID
                'channelId'   : ( obj.type == 'edit' ) ? obj.info.channelId : '' ,
                //运营商Id
                'operatorsId' : obj.userInfo.operatorsId,
                //渠道名称
                'channelName' : $("#channelName").val(),
                //状态 1：正常 2：暂停 3：已删除
                'status'      : 1,
                //渠道的描述说明
                'remark'      : $("#remark").val()
            };

            http.post(url, data, function( res ){
                $("#modalShow").modal('hide');
                if( res.statusCode == 0 ){
                    swal( res.msg, '', 'success' );
                    obj.loadQuery(1);
                    obj.initForm();
                }else{
                    swal( res.msg, '', 'error' );
                }
            });
        }
    };

    return obj;
})();


$(document).ready(function() {

    channelQuery.loadQuery(1);

});