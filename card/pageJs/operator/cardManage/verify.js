
/**
 * 分页加载器
 */
var verifyQuery = (function() {
    var obj = {};

    obj.getUser = function(){

        $("#dataList").html('');

        var checkPass = true;
        var checkInfo = [
            {
                'id' : 'phone',
                'errMsg' : '手机号'
            }
        ];
        if( !tools.checkInputNull( checkInfo ) ){
            checkPass = false;
            return false;
        }
        if( checkPass ){
            var url = '/userRealNameAuth/selectUserRealNameAuthByPhone';
            var data = { 'phone' : $("#phone").val() };
            http.post(url, data, function( res ){
                if( res.statusCode == 0 ){

                    if( res.jbody.userRealNameAuthList && res.jbody.userRealNameAuthList.length > 0 ){

                        var user = res.jbody.user;
                        var list = res.jbody.userRealNameAuthList;

                        $( list ).each(function( index, item ){
                            var html = '<tr class="animated fadeIn">';
                            html += '<td>' + ( item.phone || '' ) + '</td>';
                            html += '<td>' + user.nickName + '</td>';
                            html += '<td>' + tools.getFormatTime(item.createTime,"yyyy-MM-dd hh:mm:ss") + '</td>';
                            html += '<td>';
                            if( item.status == 1 ){
                                html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="重新认证" onclick="verifyQuery.certifiy(\'' + item.userUid + '\', \'' + item.id + '\' )"><i class="fa fa-circle-o-notch whirl-h"></i></a>'
                            }
                            html += '</td>';
                            html += '</tr>';
                            $(html).appendTo( $("#dataList") );
                        });
                        tools.tooltipInit();
                    }

               }else{

               }
            });
        }

    };

    /**
     * 重新认证流程
     * @param userUid   用户唯一userUid
     * @param id
     */
    obj.certifiy = function( userUid, id ){

        swal({
            title: "确定重新认证吗?",
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
                var url = '/userRealNameAuth/resetUserRealNameAuth';
                var data = {
                    'userUid' : userUid,
                    'id'      : id
                };

                http.post(url, data, function( res ){
                    if( res.statusCode == 0 ){
                        swal( res.msg, '', 'success' );
                        verifyQuery.getUser();
                    }else{
                        swal( res.msg, '', 'error' );
                    }
                });

            } else {
                swal("已取消", "", "error");
            }
        });
    };

    return obj;
})();

$(document).ready(function(){

    tools.tooltipInit();
});