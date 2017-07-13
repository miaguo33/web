/**
 * 页面数据初始化
 */
var roomInit = (function(){
    var obj = {};
    obj.showroomId = 0;
    obj.dataRT = {};
    obj.dataHS = {};
    obj.dataCD = {};
    obj.initData = function(){
        http.post( '/operators/showroom', {'operatorsId' : JSON.parse(getCookie('card.userinfo')).operatorsId }, function(res){
            //console.log( res );
            if( res.statusCode == 0 ){
                var menus = res.jbody.Menus;
                obj.showroomId = menus.showroomId;
                $( menus.menus ).each(function( index, item ){
                    switch( item.title.types ){
                        case 'RT':
                            obj.dataRT = item;
                            roomUploadRT.setDefault( obj.dataRT );
                            break;
                        case 'HS':
                            obj.dataHS = item;
                            roomUploadHS.setDefault( obj.dataHS );
                            break;
                        case 'CD':
                            obj.dataCD = item;
                            roomUploadCD.setDefault( obj.dataCD );
                            break;
                    }
                });
            }
        });
        http.get( '/operators/selectOperatorsCenter', {'operatorsId' : JSON.parse(getCookie('card.userinfo')).operatorsId }, function(res){
            //console.log( res );
            if( res.statusCode == 0 ){
            	var configItem = {};
            	if(res.jbody.OperatorsCenter.configItem){
            		configItem = JSON.parse(res.jbody.OperatorsCenter.configItem);
            	}
                indexUpload.setDefault( configItem.AD );
                indexMenuUpload.setDefault( configItem.MENU , configItem.CONTACT );
            }
        });


    };

    return obj;
})();

/**
 * 今日推荐类
 */
var roomUploadRT = (function(){
    var obj = {};
    obj.name = '今日推荐';
    obj.type = 'RT';
    obj.httpPrefix = 'http://';
    obj.contentListNum = 1;
    obj.containers = [{//默认数据有一条
        'name' : 1,
        'type' : 'image',
        'path' : ''
    }];
    /**
     * 上传菜单
     */
    obj.submitMenu = function(){

        var checkInfo = [
            {
                'id' : 'aliasName' + obj.type,
                'errMsg'  : '菜单名称'
            },
            {
                'id' : 'desc' + obj.type,
                'errMsg'  : '菜单宣传语'
            }
        ];

        var checkPass = tools.checkInputNull( checkInfo );
        if( checkPass ){
            var url = "/operators/showroom/update";
            var jsonData = [{
                'name'      : obj.name,
                'aliasName' : $('#aliasName' + obj.type).val(),
                'desc'      : $('#desc' + obj.type).val(),
                'show'      : $("#show" + obj.type).is(':checked'),
                'types'     : obj.type,
                'sort'      : 1
            }];
            var data = {
                'operatorsId' : (JSON.parse(getCookie('card.userinfo'))).operatorsId,
                'configItem'  : JSON.stringify(jsonData)
            };
            http.post( url, data, function( res ){
                if( res.statusCode == 0 ){
                    swal( res.msg, '', 'success' );
                }else{
                    swal( res.msg, '', 'error' );
                }
            });
        }


    };
    obj.addElement = function(){
        obj.contentListNum++;
        var html = '';
        html += '<div class="col-sm-12 animated fadeInDown" id="element'+ obj.contentListNum +'">';
        html += '   <h3>广告位' + obj.contentListNum + '</h3>';
        html += '   <div class="form-group">';
        html += '       <label class="col-sm-3 control-label">广告图</label>';
        html += '       <div class="col-sm-9">';
        html += '           <form class="m-b" id="fileupload' + obj.contentListNum + '" action="/rest/file/upload" method="POST" enctype="multipart/form-data">';
        html += '               <div>';
        html += '                   <span class="btn btn-white fileinput-button"><i class="fa fa-file-text-o icon-white"></i> <span>上传</span>';
        html += '                       <input type="file" name="file' + obj.contentListNum + '" id="file' + obj.contentListNum + '" multiple>';
        html += '                   </span>';
        html += '               </div>';
        html += '               <input type="hidden" name="name" id="name' + obj.contentListNum + '" value=""/>';
        html += '               <input type="hidden" name="prefix" id="prefix' + obj.contentListNum + '" value=""/>';
        html += '               <input type="hidden" name="fileName" id="fileName' + obj.contentListNum + '" value=""/>';
        html += '               <input type="hidden" name="longEdge" id="longEdge' + obj.contentListNum + '" value=""/>';
        html += '           </form>';
        html += '           <span class="help-block text-danger m-b">（图片建议宽度750像素，高度不限，大小500KB以内）</span>';
        html += '           <div class="progress progress-striped active" id="progressBarDiv' + obj.contentListNum + '" style="display: none;">';
        html += '               <div id="progressBar' + obj.contentListNum + '" style="width: 0%" aria-valuemax="100" aria-valuemin="0" aria-valuenow="75" role="progressbar" class="progress-bar progress-bar-default">';
        html += '                   <span class="sr-only"></span>';
        html += '               </div>';
        html += '           </div>';
        html += '           <div id="fileDiv' + obj.contentListNum + '"></div>';
        html += '           <div>';
        html += '               <img id="addPreviewImagePreview' + obj.contentListNum + '" />';
        html += '           </div>';
        html += '       </div>';
        html += '   </div>';
        html += '   <div class="form-group">';
        html += '       <label class="col-sm-3 control-label">内容标题</label>';
        html += '       <div class="col-sm-9 ecommerce">';
        html += '           <input type="text" placeholder="输入内容标题" class="form-control" id="titleRT' + obj.contentListNum + '">';
        html += '       </div>';
        html += '   </div>';
        html += '   <div class="form-group">';
        html += '       <label class="col-sm-3 control-label">价格</label>';
        html += '       <div class="col-sm-9 ecommerce">';
        html += '           <input type="text" placeholder="输入价格" class="form-control" id="priceRT' + obj.contentListNum + '">';
        html += '       </div>';
        html += '   </div>';
        html += '   <div class="form-group">';
        html += '       <label class="col-sm-3 control-label">内容宣传语</label>';
        html += '       <div class="col-sm-9 ecommerce">';
        html += '           <input type="text" placeholder="输入内容宣传语" class="form-control" id="contentRT' + obj.contentListNum + '">';
        html += '       </div>';
        html += '   </div>';
        html += '   <div class="form-group">';
        html += '       <label class="col-sm-3 control-label">跳转链接</label>';
        html += '       <div class="col-sm-9">';
        html += '           <div class="input-group">';
        html += '               <span class="input-group-addon">http://</span>';
        html += '               <input type="text" placeholder="输入跳转链接" class="form-control" id="linkRT' + obj.contentListNum + '">';
        html += '           </div>';
        html += '       </div>';
        html += '   </div>';
        html += '   <div class="form-group">';
        html += '       <div class="col-sm-offset-3 col-sm-9">';
        html += '       	<button class="ladda-button btn btn-sm btn-w-m btn-danger" type="button" onclick="roomUploadRT.deleteElement('+obj.contentListNum+');" data-style="zoom-out"><span class="ladda-label">删除</span><span class="ladda-spinner"></span></button>';
        html += '       </div>';
        html += '   </div>';
        html += '   <div class="hr-line-dashed"></div>';
        html += '</div>';

        $(html).insertBefore( $("#addBefore") );


        obj.containers.push({
            'name' : obj.contentListNum,
            'type' : 'image',
            'path' : ''
        });

        obj.uploadFileInit();

    };
    
    obj.deleteElement = function(num){
    	
    	swal({
            title: "确定删除吗?",
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "是",
            cancelButtonText: "否",
        }, function (isConfirm) {
            if (isConfirm) {
                obj.contentListNum--;
    	
		    	$("#element"+num).remove();
		    	
		    	obj.containers.splice(num-1,1);
		    	
		    	for(var i = num; i <= obj.contentListNum; i++ ){
		    		var n = i+1;
		    		$("#element" + n).attr("id","element" + i);
		    		$("#element" + i +" h3").html("广告位" + i);
		    		$("#element" + i +" .btn-danger").attr("onclick","roomUploadRT.deleteElement("+i+");");
		    		$("#fileupload" + n).attr("id","fileupload" + i);
		    		$("#file" + n).attr("id","file" + i);
		    		$("input[name='file"+n+"']").attr("name","file" + i);
		    		$("#name" + n).attr("id","name" + i);
		    		$("#prefix" + n).attr("id","prefix" + i);
		    		$("#fileName" + n).attr("id","fileName" + i);
		    		$("#longEdge" + n).attr("id","longEdge" + i);
		    		$("#progressBarDiv" + n).attr("id","progressBarDiv" + i);
		    		$("#progressBar" + n).attr("id","progressBar" + i);
		    		$("#fileDiv" + n).attr("id","fileDiv" + i);
		    		$("#addPreviewImagePreview" + n).attr("id","addPreviewImagePreview" + i);
		    		$("#titleRT" + n).attr("id","titleRT" + i);
		    		$("#priceRT" + n).attr("id","priceRT" + i);
		    		$("#contentRT" + n).attr("id","contentRT" + i);
		    		$("#linkRT" + n).attr("id","linkRT" + i);
		    	};
		    	
		    	obj.uploadFileInit();
		    	
            };
        });
    	
    	
    	
    	
    	
    }


    obj.uploadFileInit = function(){

        $(document).ready(function(){
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
                        $("#prefix" + item.name ).attr('value', 'Temp/unionCard');
                        $("#fileName" + item.name ).attr('value', '');
                        $("#longEdge" + item.name ).attr('value', '1000');

                        //console.log( data['files'][0] );

                        obj.fileName = data['files'][0]['name'];//临时文件名称存储
                        obj.fileType = data['files'][0]['type'];//临时文件类型存储

                        //文件类型校验
                        if( item.type == 'image' ){
                            if( !tools.isImage( data['files'][0]['type'], true ) ){
                                return false;
                            }
                        }
                        else if( item.type == 'file' ){
                            if( !tools.isFile( data, true ) ){
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

                        //console.log( data.result );

                        if( data.result.statusCode == 0 ){

                            //obj.setPath( item.name, data.result.jbody.path );

                            obj.containers[index].path = data.result.jbody.path;

                            $("#progressBar"  + item.name ).attr("style", "width:0%;");
                            $("#progressBarDiv"  + item.name ).hide();

                            if( item.type == 'image' ){
                                //是图片，展示图片
                                $("#addPreviewImagePreview" + item.name ).attr("src", getCookie('card.host.public') + data.result.jbody.path);
                            }else{
                                //是普通文件，展示图标
                                $("#fileDiv" + item.name ).html( '<i class="fa fa-file-zip-o m-r"></i>' + obj.fileName );
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


    };

    /**
     * 上传内容
     */
    obj.submitContent = function(){

        var checkPass = true;
        //检查数据
        for( var i = 1; i <= obj.contentListNum; i++  ){

            var o = {
                'id' : ('titleRT' + i),
                'errMsg' : '内容标题'
            };

            var checkInfo = [
                {
                    'id' : ('titleRT' + i ),
                    'errMsg' : '内容标题'
                },
                {
                    'id' : ('priceRT' + i ),
                    'errMsg' : '价格'
                },
                {
                    'id' : ('contentRT' + i ),
                    'errMsg' : '内容宣传语'
                },
                {
                    'id' : ('linkRT' + i ),
                    'errMsg' : '跳转链接'
                }
            ];

            if( !checkPass ){//如果之前检查有错误，中止循环
                break;
            }

            checkPass = tools.checkInputNull( checkInfo );


            //检查是否上传图片
            if( obj.containers[i-1].path == '' ){
                tools.toastr( '请上传广告位' + i + '的广告图!', '', 'error' );
                checkPass = false;
            }
        }

        if( checkPass == true ){

            //组装数据
            var formData = [];
            for( var i = 1; i <= obj.contentListNum; i++  ){
                var o = {
                    'photo'   : obj.containers[i-1].path,
                    'title'   : $("#titleRT" + i).val(),
                    'price'   : $("#priceRT" + i).val(),
                    'content' : $("#contentRT" + i).val(),
                    'link'    : obj.httpPrefix + $("#linkRT" + i).val(),
                };

                formData.push( o );
            }

            //console.log( formData );

            var url = "/operators/showroom/item/modify";
            var data = {
                'showroomId' : roomInit.showroomId,
                'itemType' : obj.type,
                'itemContent' : JSON.stringify( formData )
            };

            http.post(url, data, function( res ){
                if( res.statusCode == 0 ){
                    swal( res.msg, '', 'success' );
                }else{
                    swal( res.msg, '', 'error' );
                }
            });
        }

    };

    /**
     * 默认值初始化
     * @param data
     */
    obj.setDefault = function( data ){

        //set title
        if( data.title ){
            $("#aliasName" + obj.type).val( data.title.aliasName );
            $("#desc" + obj.type).val(      data.title.desc );
        }


        //set content
        if( data.contents ){
            //生成dom
            $(data.contents).each(function( index, item ){
                if( index > 0 ){
                    obj.addElement();
                }
            });

            obj.containers = [];
            //数据初始化
            $(data.contents).each(function( index, item ){
                $("#addPreviewImagePreview" + ( index + 1)).attr( 'src', getCookie('card.host.public') + item.photo );
                $("#title"       + obj.type + ( index + 1)).val( item.title );
                $("#price"       + obj.type + ( index + 1)).val( item.price );
                $("#content"     + obj.type + ( index + 1)).val( item.content );
                $("#link"        + obj.type + ( index + 1)).val( item.link.replaceAll(obj.httpPrefix,''));

                //containers数据初始化
                obj.containers.push({
                    'name' : (index + 1),
                    'type' : 'image',
                    'path' : item.photo
                });
            });

            obj.uploadFileInit();
        }
    };

    return obj;
})();

/**
 * 热卖类
 */
var roomUploadHS = (function(){
    var obj = {};
    obj.name = '热卖中';
    obj.type = 'HS';
    obj.cardList = [];
    /**
     * 上传菜单
     */
    obj.submitMenu = function(){

        var checkInfo = [
            {
                'id' : 'aliasName' + obj.type,
                'errMsg'  : '菜单名称'
            },
            {
                'id' : 'desc' + obj.type,
                'errMsg'  : '菜单宣传语'
            }
        ];

        var checkPass = tools.checkInputNull( checkInfo );
        if( checkPass ){
            var url = "/operators/showroom/update";
            var jsonData = [{
                'name'      : obj.name,
                'aliasName' : $('#aliasName' + obj.type).val(),
                'desc'      : $('#desc' + obj.type).val(),
                'show'      : $("#show" + obj.type).is(':checked'),
                'types'     : obj.type,
                'sort'      : 1
            }];
            var data = {
                'operatorsId' : (JSON.parse(getCookie('card.userinfo'))).operatorsId,
                'configItem'  : JSON.stringify(jsonData)
            };
            http.post( url, data, function( res ){
                if( res.statusCode == 0 ){
                    swal( res.msg, '', 'success' );
                }else{
                    swal( res.msg, '', 'error' );
                }
            });
        }
    };

    obj.openCardList = function(){
        $("#modalShow").modal('show');
        query.loadQuery(1);
    };

    /**
     *
     * @param index query.data数组下标
     */
    obj.addCardInfo = function( index ){
        var info = query.data[index];
        //console.log( info );

        for( var i=0;i < obj.cardList.length; i++){
            if( obj.cardList[i].id == info.id ){
                tools.toastr('已添加!', '', 'warning');
                return false;
            }
        }

        obj.cardList.push( info );

        obj.showCardInfo();
    };
    /**
     * 列表数据id
     * @param id
     */
    obj.removeCardInfo = function( id ){
        obj.cardList.splice( id, 1 );//从下标为i的元素开始，连续删除1个元素

        obj.showCardInfo();
    };

    /**
     * 数组移动
     * @param index
     * @param type
     */
    obj.switchCardInfo = function( index, type ){
        switch( type ){
            case 'before':
                obj.cardList.switchBefore( index );
                break;
            case 'after':
                obj.cardList.switchAfter( index );
                break;
        }
        obj.showCardInfo();
    };

    /**
     * 组装已售数量数据
     * @param index 数组下标
     * @param that  DOM对象
     */
    obj.setCnt = function( index, that ){
        obj.cardList[index].sellCnt = $(that).val();
    };

    /**
     * 组建DOM并展示
     */
    obj.showCardInfo = function(){

        $('#cardList').html('');

        var html = '';
        $(obj.cardList).each(function( index, item ){
            html += '<tr>';
            html += '<td>' + (item.cardName || '') + '</td>';
            html += '<td><input type="text" class="form-control card-input" onchange="roomUploadHS.setCnt( \'' + index + '\' , this );"" value="' + (item.sellCnt || '') + '"></td>';
            html += '<td>';

            //第一个不显示上调
            if( index != 0 ){
                html += '   <a class="icon-only text-warning" data-toggle="tooltip" title="上调" ><i class="fa fa-arrow-up" onclick="roomUploadHS.switchCardInfo( \'' + index + '\' , \'before\' );"></i></a>';
            }

            //最后一个不显示下调
            if( (index + 1) != obj.cardList.length ){
                html += '   <a class="icon-only text-warning" data-toggle="tooltip" title="下调" ><i class="fa fa-arrow-down" onclick="roomUploadHS.switchCardInfo( \'' + index + '\' , \'after\' );"></i></a>';
            }

            html += '   <a class="icon-only text-danger" data-toggle="tooltip" title="删除" onclick="roomUploadHS.removeCardInfo(\'' + index + '\');" " ><i class="fa fa-trash-o"></i></a>';
            html += '</td>';
            html += '</tr>';
        });

        $(html).appendTo($('#cardList'));

        tools.tooltipInit();
    };

    /**
     * 上传内容
     */
    obj.submitContent = function(){
//        console.log( obj.cardList );
        var checkPass = true;
        if( obj.cardList.length == 0 ){
            tools.toastr( '请先添加通行权益', '', 'error' );
            checkPass = false;
            return false;
        }

        var formData = [];
		
        $(obj.cardList).each(function( index, item ){
            if( !$(".card-input").eq(index).val() || $(".card-input").eq(index).val() == 0 ){
                tools.toastr( '请填写售出数量', '', 'error' );
                checkPass = false;
                return false;
            }
            formData.push({
                "ucId" : item.id,
                "ucName" : item.cardName,
                "sellCnt" : parseInt( $(".card-input").eq(index).val() ),
                "sort" : ( index + 1 )
            });
        });
//        console.log( formData );

        if( checkPass ){
            var url = '/operators/showroom/item/modify';
            var data = {
                showroomId : roomInit.showroomId,
                itemType   : obj.type,
                itemContent : JSON.stringify(formData)
            };
            http.post( url, data, function( res ){
                if( res.statusCode == 0 ){
                    swal( res.msg, '', 'success' );
                }else{
                    swal( res.msg, '', 'error' );
                }
            });
        }

    };

    /**
     * 默认值初始化
     * @param data
     */
    obj.setDefault = function( data ){

        //set title
        if( data.title ){
            $("#aliasName" + obj.type).val( data.title.aliasName );
            $("#desc" + obj.type).val(      data.title.desc );
        }

        //set content
        if( data.contents ){
            //数据初始化

            $(data.contents).each(function( index, item ){
                obj.cardList.push({
                    'id'       : item.id,
                    'cardName' : item.ucName,
                    'sellCnt'  : item.sellCnt,
                    'sort'     : item.sort
                });
            });

            obj.showCardInfo();
        }

    };

    return obj;
})();

/**
 * 自定义内容类
 */
var roomUploadCD = (function(){
    var obj = {};
    obj.name = '自定义设计内容';
    obj.type = 'CD';
    obj.containers = [
        {
            'name' : 'CD',
            'type' : 'image',
            'path' : '',
        }
    ];
    /**
     * 上传菜单
     */
    obj.submitMenu = function(){
        var checkInfo = [
            {
                'id' : 'aliasName' + obj.type,
                'errMsg'  : '菜单名称'
            },
            {
                'id' : 'desc' + obj.type,
                'errMsg'  : '菜单宣传语'
            }
        ];

        var checkPass = tools.checkInputNull( checkInfo );
        if( checkPass ){
            var url = "/operators/showroom/update";
            var jsonData = [{
                'name'      : obj.name,
                'aliasName' : $('#aliasName' + obj.type).val(),
                'desc'      : $('#desc' + obj.type).val(),
                'show'      : $("#show" + obj.type).is(':checked'),
                'types'     : obj.type,
                'sort'      : 1
            }];
            var data = {
                'operatorsId' : (JSON.parse(getCookie('card.userinfo'))).operatorsId,
                'configItem'  : JSON.stringify(jsonData)
            };
            http.post( url, data, function( res ){
                if( res.statusCode == 0 ){
                    swal( res.msg, '', 'success' );
                }else{
                    swal( res.msg, '', 'error' );
                }
            });
        }
    };
    /**
     * 上传内容
     */
    obj.submitContent = function(){
        var checkPass = true;
        var formData = [];
        $(obj.containers).each(function( index, item ){
            if( item.path == '' ){
                tools.toastr( '请上传自定义图片!' ,'', error );
                checkPass = false;
                return false;
            }else{
                formData = [{
                    'photo' : item.path,
                    'sort'  : 1
                }]
            }
        });

        if( checkPass ){
            var url = '/operators/showroom/item/modify';
            var data = {
                showroomId : roomInit.showroomId,
                itemType   : obj.type,
                itemContent : JSON.stringify(formData)
            };
            http.post( url, data, function( res ){
                if( res.statusCode == 0 ){
                    swal( res.msg, '', 'success' );
                }else{
                    swal( res.msg, '', 'error' );
                }
            });


        }

    };

    obj.uploadFileInit = function(){
        $(document).ready(function(){
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
                        $("#prefix" + item.name ).attr('value', 'Temp/unionCard');
                        $("#fileName" + item.name ).attr('value', '');
                        $("#longEdge" + item.name ).attr('value', '1000');

                        //console.log( data['files'][0] );

                        obj.fileName = data['files'][0]['name'];//临时文件名称存储
                        obj.fileType = data['files'][0]['type'];//临时文件类型存储

                        //文件类型校验
                        if( item.type == 'image' ){
                            if( !tools.isImage( data['files'][0]['type'], true ) ){
                                return false;
                            }
                        }
                        else if( item.type == 'file' ){
                            if( !tools.isFile( data, true ) ){
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

                        //console.log( data.result );

                        if( data.result.statusCode == 0 ){

                            //obj.setPath( item.name, data.result.jbody.path );

                            obj.containers[index].path = data.result.jbody.path;

                            $("#progressBar"  + item.name ).attr("style", "width:0%;");
                            $("#progressBarDiv"  + item.name ).hide();


                            if( item.type == 'image' ){
                                //是图片，展示图片
                                $("#addPreviewImagePreview" + item.name ).attr("src", getCookie('card.host.public') + data.result.jbody.path);
                            }else{
                                //是普通文件，展示图标
                                $("#fileDiv" + item.name ).html( '<i class="fa fa-file-zip-o m-r"></i>' + obj.fileName );
                            }

                            obj.submitContent();

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
    };

    /**
     * 默认值初始化
     * @param data
     */
    obj.setDefault = function( data ){

        //set title
        if( data.title ){
            $("#aliasName" + obj.type).val( data.title.aliasName );
            $("#desc" + obj.type).val(      data.title.desc );
        }

        //set content
        if( data.contents ){
            obj.containers = [];
            $( data.contents).each(function( index, item){
                //console.log( getCookie('card.host.public') + item.photo );
                $("#addPreviewImagePreview" + obj.type ).attr( 'src', getCookie('card.host.public') + item.photo );
                obj.containers.push({
                    'name' : obj.type,
                    'type' : 'image',
                    'path' : item.photo
                });
            });

        }



    };

    return obj;
})();

/**
 * 首页-广告
 */
var indexUpload = (function(){
	var obj = {};
	obj.httpPrefix = 'http://';
	obj.contentListNum = 1;
    obj.containers = [{//默认数据有一条
        'name' : 1,
        'type' : 'image',
        'path' : ''
    }];
    
	obj.addElement = function(){
        obj.contentListNum++;
        var html = '';
        html += '<div class="col-sm-12 animated fadeInDown" id="elementIndexBanner'+obj.contentListNum+'">';
		html += '	<h3>广告位'+obj.contentListNum+'</h3>';
		html += '	<div class="form-group">';
		html += '		<label class="col-sm-3 control-label">广告图</label>';
		html += '		<div class="col-sm-9">';
		html += '			<form class="m-b" id="fileuploadIndexBanner'+obj.contentListNum+'" action="/rest/file/upload" method="POST" enctype="multipart/form-data">';
		html += '				<div>';
		html += '					<span class="btn btn-white fileinput-button">';
        html += '                <i class="fa fa-file-text-o icon-white"></i> <span>上传</span>';
		html += '					<input type="file" name="fileIndexBanner'+obj.contentListNum+'" id="fileIndexBanner'+obj.contentListNum+'" multiple>';
		html += '					</span>';
		html += '				</div>';
		html += '				<input type="hidden" name="name" id="nameIndexBanner'+obj.contentListNum+'" value="" />';
		html += '				<input type="hidden" name="prefix" id="prefixIndexBanner'+obj.contentListNum+'" value="" />';
		html += '				<input type="hidden" name="fileName" id="fileNameIndexBanner'+obj.contentListNum+'" value="" />';
		html += '				<input type="hidden" name="longEdge" id="longEdgeIndexBanner'+obj.contentListNum+'" value="" />';
		html += '			</form>';
		html += '			<span class="help-block text-danger m-b">（图片建议宽度750像素，高度不限，大小500KB以内）</span>';
		html += '			<div class="progress progress-striped active" id="progressBarDivIndexBanner'+obj.contentListNum+'" style="width: 300px; display: none;">';
		html += '				<div id="progressBarIndexBanner'+obj.contentListNum+'" style="width: 0%" aria-valuemax="100" aria-valuemin="0" aria-valuenow="75" role="progressbar" class="progress-bar progress-bar-default">';
		html += '					<span class="sr-only"></span>';
		html += '				</div>';
		html += '			</div>';
		html += '			<div id="fileDivIndexBanner'+obj.contentListNum+'"></div>';
		html += '			<div>';
		html += '				<img id="addPreviewImagePreviewIndexBanner'+obj.contentListNum+'" />';
		html += '			</div>';
		html += '		</div>';
		html += '	</div>';
		html += '	<div class="form-group">';
		html += '		<label class="col-sm-3 control-label">跳转链接</label>';
		html += '		<div class="col-sm-9">';
		html += '			<div class="input-group">';
		html += '				<span class="input-group-addon">http://</span>';
		html += '				<input type="text" placeholder="输入跳转链接" class="form-control" id="linkIndexBanner'+obj.contentListNum+'">';
		html += '			</div>';
		html += '		</div>';
		html += '	</div>';
		html += '	<div class="form-group">';
		html += '		<div class="col-sm-offset-3 col-sm-9">';
		html += '			<button class="ladda-button btn btn-sm btn-w-m btn-danger" type="button" onclick="indexUpload.deleteElement('+obj.contentListNum+');" data-style="zoom-out">';
		html += '		<span class="ladda-label">删除</span><span class="ladda-spinner"></span>';
		html += '	</button>';
		html += '		</div>';
		html += '	</div>';
		html += '	<div class="hr-line-dashed"></div>';
		html += '</div>';

        $(html).insertBefore( $("#addIndexBefore") );


        obj.containers.push({
            'name' : obj.contentListNum,
            'type' : 'image',
            'path' : ''
        });

        obj.uploadFileInit();

    };
    
    obj.deleteElement = function(num){
    	
    	swal({
            title: "确定删除吗?",
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "是",
            cancelButtonText: "否",
        }, function (isConfirm) {
            if (isConfirm) {
                obj.contentListNum--;
    	
		    	$("#elementIndexBanner"+num).remove();
		    	
		    	obj.containers.splice(num-1,1);
		    	
		    	for(var i = num; i <= obj.contentListNum; i++ ){
		    		var n = i+1;
		    		$("#elementIndexBanner" + n).attr("id","elementIndexBanner" + i);
		    		$("#elementIndexBanner" + i +" h3").html("广告位" + i);
		    		$("#elementIndexBanner" + i +" .btn-danger").attr("onclick","indexUpload.deleteElement("+i+");");
		    		$("#fileuploadIndexBanner" + n).attr("id","fileuploadIndexBanner" + i);
		    		$("#fileIndexBanner" + n).attr("id","fileIndexBanner" + i);
		    		$("input[name='fileIndexBanner"+n+"']").attr("name","fileIndexBanner" + i);
		    		$("#nameIndexBanner" + n).attr("id","nameIndexBanner" + i);
		    		$("#prefixIndexBanner" + n).attr("id","prefixIndexBanner" + i);
		    		$("#fileNameIndexBanner" + n).attr("id","fileNameIndexBanner" + i);
		    		$("#longEdgeIndexBanner" + n).attr("id","longEdgeIndexBanner" + i);
		    		$("#progressBarDivIndexBanner" + n).attr("id","progressBarDivIndexBanner" + i);
		    		$("#progressBarIndexBanner" + n).attr("id","progressBarIndexBanner" + i);
		    		$("#fileDivIndexBanner" + n).attr("id","fileDivIndexBanner" + i);
		    		$("#addPreviewImagePreviewIndexBanner" + n).attr("id","addPreviewImagePreviewIndexBanner" + i);
		    		$("#linkIndexBanner" + n).attr("id","linkIndexBanner" + i);
		    	};
		    	
		    	obj.uploadFileInit();
		    	
            };
        });
    }
    
    obj.uploadFileInit = function(){

        $(document).ready(function(){
            $(obj.containers).each(function( index, item ){
                $('#fileuploadIndexBanner' + item.name).fileupload({
                    dataType: 'json',
                    maxFileSize : 1, // 2 MB
                    add: function (e, data) {
                        //检验图片
                        var size = data['files'][0]['size'];
                        var type = data['files'][0]['type'];

                        //form数据整理
                        $("#nameIndexBanner" + item.name ).attr('value', 'fileIndexBanner' + item.name);
                        $("#prefixIndexBanner" + item.name ).attr('value', 'Temp/unionCard');
                        $("#fileNameIndexBanner" + item.name ).attr('value', '');
                        $("#longEdgeIndexBanner" + item.name ).attr('value', '1000');

                        //console.log( data['files'][0] );

                        obj.fileName = data['files'][0]['name'];//临时文件名称存储
                        obj.fileType = data['files'][0]['type'];//临时文件类型存储

                        //文件类型校验
                        if( item.type == 'image' ){
                            if( !tools.isImage( data['files'][0]['type'], true ) ){
                                return false;
                            }
                        }
                        else if( item.type == 'file' ){
                            if( !tools.isFile( data, true ) ){
                                return false;
                            }
                        }

                        //检查文件大小
                        if( !tools.checkaddfile(size) ){
                            return false;
                        }

                        $("#progressBarDivIndexBanner" + item.name ).show();
                        data.submit();
                    },
                    progress: function (e, data) {
                        //上传进度
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $("#progressBarIndexBanner" + item.name).attr("style", "width:" + progress + "%;");
                    },
                    done: function (e, data) {

                        //console.log( data.result );

                        if( data.result.statusCode == 0 ){

                            //obj.setPath( item.name, data.result.jbody.path );

                            obj.containers[index].path = data.result.jbody.path;

                            $("#progressBarIndexBanner"  + item.name ).attr("style", "width:0%;");
                            $("#progressBarDivIndexBanner"  + item.name ).hide();

                            if( item.type == 'image' ){
                                //是图片，展示图片
                                $("#addPreviewImagePreviewIndexBanner" + item.name ).attr("src", getCookie('card.host.public') + data.result.jbody.path);
                            }else{
                                //是普通文件，展示图标
                                $("#fileDivIndexBanner" + item.name ).html( '<i class="fa fa-file-zip-o m-r"></i>' + obj.fileName );
                            }
                        }else{
                            //处理上传异常
                            tools.toastr( '上传 异常', '', 'error' );

                            $("#progressBarIndexBanner" + item.name ).attr("style", "width:0%;");
                            $("#progressBarDivIndexBanner"  + item.name ).hide();
                            return false;
                        }
                    }
                });
            });

        });
    };
    
    /**
     * 上传内容
     */
    obj.submitContent = function(){

        var checkPass = true;
        //检查数据
        for( var i = 1; i <= obj.contentListNum; i++  ){

          /*  var o = {
                'id' : ('titleRT' + i),
                'errMsg' : '内容标题'
            };*/

//          var checkInfo = [
//              {
//                  'id' : ('linkIndexBanner' + i ),
//                  'errMsg' : '跳转链接'
//              }
//          ];

//          if( !checkPass ){//如果之前检查有错误，中止循环
//              break;
//          }

//          checkPass = tools.checkInputNull( checkInfo );


            //检查是否上传图片
            if( obj.containers[i-1].path == '' ){
                tools.toastr( '请上传广告位' + i + '的广告图!', '', 'error' );
                checkPass = false;
            }
        }

        if( checkPass == true ){

            //组装数据
            var formData = [];
            for( var i = 1; i <= obj.contentListNum; i++  ){
                var o = {
                    'photo': obj.containers[i-1].path,
                    'link': obj.httpPrefix + $("#linkIndexBanner" + i).val(),
                    'sort':i		
                };

                formData.push( o );
            }
			formData = {
				'AD':formData
			};
            //console.log( formData );

            var url = "/operators/operatorsCenterModify";
            var data = {
            	'operatorsId':(JSON.parse(getCookie('card.userinfo'))).operatorsId,
                'configItem' : JSON.stringify( formData )
            };

            http.post(url, data, function( res ){
                if( res.statusCode == 0 ){
                    swal( res.msg, '', 'success' );
                }else{
                    swal( res.msg, '', 'error' );
                }
            });
        }

    };

    /**
     * 默认值初始化
     * @param data
     */
    obj.setDefault = function( ad ){

        //set content
        if( ad ){
            //生成dom
            $(ad).each(function( index, item ){
                if( index > 0 ){
                    obj.addElement();
                }
            });

            obj.containers = [];
            //数据初始化
            $(ad).each(function( index, item ){
                $("#addPreviewImagePreviewIndexBanner" + ( index + 1)).attr( 'src', getCookie('card.host.public') + item.photo );
                var link = item.link.replaceAll(obj.httpPrefix,'');
                if(link!='undefined'){
                	$("#linkIndexBanner" + ( index + 1)).val( link );
                }
                

                //containers数据初始化
                obj.containers.push({
                    'name' : (index + 1),
                    'type' : 'image',
                    'path' : item.photo
                });
            });

            
        }
        obj.uploadFileInit();
    };
    
	return obj;
})();

/**
 * 首页-菜单
 */
var indexMenuUpload = (function(){
	var obj = {};
	obj.imgUrl = getCookie('card.host.public');
	obj.httpPrefix = 'http://';
	obj.contentListNum = 3;
    obj.containers = [
    	{
	        'name' : 1,
	        'type' : 'image',
    	},
    	{
	        'name' : 2,
	        'type' : 'image',
    	},
    	{
	        'name' : 3,
	        'type' : 'image',
    	},
    	
    ];
    
    obj.reSort = function(){
    	$("#index-menu").sortable({
			connectWith: ".connectList",
			update: function(event, ui) {
				$("#index-menu .col-sm-12").each(function(index,element){
					var n=index+1;
					$(element).find("input[id^=linkMenu]").attr("id","linkMenu"+n);
				    $(element).find("input[id^=indexMenu]").attr("id","indexMenu"+n);
				    $(element).find("input[id^=subtitle]").attr("id","subtitle"+n);
				    $(element).find("form[id^=fileuploadMenu]").attr("id","fileuploadMenu"+n);
				    $(element).find("input[id^=fileMenu]").attr({"id":"fileMenu"+n,"name":"fileMenu"+n});
				    $(element).find("input[name=name]").attr("id","nameMenu"+n);
				    $(element).find("input[name=prefix]").attr("id","prefixMenu"+n);
				    $(element).find("input[name=fileName]").attr("id","fileNameMenu"+n);
				    $(element).find("input[name=longEdge]").attr("id","longEdgeMenu"+n);
				    $(element).find("div[id^=progressBarDivMenu]").attr("id","progressBarDivMenu"+n);
				    $(element).find("div[id^=progressBarMenu]").attr("id","progressBarMenu"+n);
				    $(element).find("div[id^=fileDivMenu]").attr("id","fileDivMenu"+n);
				    $(element).find("img[id^=addPreviewImagePreviewMenu]").attr("id","addPreviewImagePreviewMenu"+n);
				});
				obj.uploadFileInit();
			}
			
		}).disableSelection();
    }
    
    obj.uploadFileInit = function(){

        $(document).ready(function(){
            $(obj.containers).each(function( index, item ){
                $('#fileuploadMenu' + item.name).fileupload({
                    dataType: 'json',
                    maxFileSize : 1, // 2 MB
                    add: function (e, data) {
                        //检验图片
                        var size = data['files'][0]['size'];
                        var type = data['files'][0]['type'];

                        //form数据整理
                        $("#nameMenu" + item.name ).attr('value', 'fileMenu' + item.name);
                        $("#prefixMenu" + item.name ).attr('value', 'Temp/unionCard');
                        $("#fileNameMenu" + item.name ).attr('value', '');
                        $("#longEdgeMenu" + item.name ).attr('value', '1000');

                        //console.log( data['files'][0] );

                        obj.fileName = data['files'][0]['name'];//临时文件名称存储
                        obj.fileType = data['files'][0]['type'];//临时文件类型存储

                        //文件类型校验
                        if( item.type == 'image' ){
                            if( !tools.isImage( data['files'][0]['type'], true ) ){
                                return false;
                            }
                        }
                        else if( item.type == 'file' ){
                            if( !tools.isFile( data, true ) ){
                                return false;
                            }
                        }

                        //检查文件大小
                        if( !tools.checkaddfile(size) ){
                            return false;
                        }

                        $("#progressBarDivMenu" + item.name ).show();
                        data.submit();
                    },
                    progress: function (e, data) {
                        //上传进度
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $("#progressBarMenu" + item.name).attr("style", "width:" + progress + "%;");
                    },
                    done: function (e, data) {

                        //console.log( data.result );

                        if( data.result.statusCode == 0 ){

                            //obj.setPath( item.name, data.result.jbody.path );

//                          obj.containers[index].path = data.result.jbody.path;

                            $("#progressBarMenu"  + item.name ).attr("style", "width:0%;");
                            $("#progressBarDivMenu"  + item.name ).hide();

                            if( item.type == 'image' ){
                                //是图片，展示图片
                                $("#addPreviewImagePreviewMenu" + item.name ).attr("src", getCookie('card.host.public') + data.result.jbody.path);
                            }else{
                                //是普通文件，展示图标
                                $("#fileDivMenu" + item.name ).html( '<i class="fa fa-file-zip-o m-r"></i>' + obj.fileName );
                            }
                        }else{
                            //处理上传异常
                            tools.toastr( '上传 异常', '', 'error' );

                            $("#progressBarMenu" + item.name ).attr("style", "width:0%;");
                            $("#progressBarDivMenu"  + item.name ).hide();
                            return false;
                        }
                    }
                });
            });

        });
    };
    
    /**
     * 上传内容
     */
    obj.submitContent = function(){

        var checkPass = true;
        //检查数据
        for( var i = 1; i <= obj.contentListNum; i++  ){

          /*  var o = {
                'id' : ('titleRT' + i),
                'errMsg' : '内容标题'
            };*/

            var checkInfo = [
                {
                    'id' : ('indexMenu' + i ),
                    'errMsg' : '菜单'+i+'的菜单名称'
                },
                {
                    'id' : ('subtitle' + i ),
                    'errMsg' : '菜单'+i+'的副标题'
                },
            ];

            if( !checkPass ){//如果之前检查有错误，中止循环
                break;
            }

            checkPass = tools.checkInputNull( checkInfo );

            //检查是否上传图片
//          if( obj.containers[i-1].path == '' ){
//              tools.toastr( '请上传菜单' + i + '的图片!', '', 'error' );
//              checkPass = false;
//          }
        }
        if(checkPass == true){
        	var checkInfo = [
	            {
	                'id' : ('contactUs'),
	                'errMsg' : '联系方式'
	            },
	            {
	                'id' : ('address'),
	                'errMsg' : '地址'
	            },
	        ];
			checkPass = tools.checkInputNull( checkInfo );
        }
        
		
		
        if( checkPass == true ){

            //组装数据
            var formData = [];
            for( var i = 1; i <= obj.contentListNum; i++  ){
                var o = {
                	'title': $("#indexMenu" + i).val(),
		            'subtitle': $("#subtitle" + i).val(),
		            'photo': $("#addPreviewImagePreviewMenu"+ i).attr("src").replaceAll(obj.imgUrl,''),
		            'link':$("#linkMenu" + i).val(),
		            'sort': i
                };
                formData.push( o );
            }
			formData = {
				'MENU': formData,
			    'CONTACT': {
			        'tel': $("#contactUs").val(),
			        'addres': $("#address").val()
			    }
			};
            //console.log( formData );

            var url = "/operators/operatorsCenterModify";
            var data = {
            	'operatorsId':(JSON.parse(getCookie('card.userinfo'))).operatorsId,
                'configItem' : JSON.stringify( formData ),
            };

            http.post(url, data, function( res ){
                if( res.statusCode == 0 ){
                    swal( res.msg, '', 'success' );
                }else{
                    swal( res.msg, '', 'error' );
                }
            });
        }

    };

    /**
     * 默认值初始化
     * @param data
     */
    obj.setDefault = function( menu,contact ){

        //set contact
        if( contact ){
            $("#contactUs").val( contact.tel );
            $("#address").val( contact.addres );
        }

        //set content
        if( menu ){
//          obj.containers = [];
            //数据初始化
            var menuTitle = {
            	'cdindex.html':'通行权益',
            	'cdcooperativebrand.html':'合作品牌',
            	'cdmypersonalcenter.html':'个人中心'
            }
            $(menu).each(function( index, item ){
                $("#addPreviewImagePreviewMenu" + ( index + 1)).attr( 'src', getCookie('card.host.public') + item.photo );
                $("#indexMenu" + ( index + 1)).val( item.title );
                $("#subtitle" + ( index + 1)).val( item.subtitle );
                $("#linkMenu" + ( index + 1)).val(item.link);
                var i = item.link.split("?")[0];
                $("#menuTitle" + ( index + 1)).html(menuTitle[i]);
            });
        }else{
        	var operatorsId = JSON.parse(getCookie('card.userinfo')).operatorsId
        	$("#linkMenu1").val( "cdindex.html?operatorsId="+operatorsId );
        	$("#linkMenu2").val( "cdcooperativebrand.html?operatorsId="+operatorsId );
        	$("#linkMenu3").val( "cdmypersonalcenter.html?operatorsId="+operatorsId );
        	$("#addPreviewImagePreviewMenu1").attr("src",getCookie('card.host.public')+"unionCard/operatormain_bg1.png");
        	$("#addPreviewImagePreviewMenu2").attr("src",getCookie('card.host.public')+"unionCard/operatormain_bg2.png");
        	$("#addPreviewImagePreviewMenu3").attr("src",getCookie('card.host.public')+"unionCard/operatormain_bg3.png");
        }
        obj.uploadFileInit();
        obj.reSort();
    };
    
	return obj;
})();


var query = (function() {
    var obj = {};

    obj.data = [];

    obj.status = {
        '1' : '未上线',
        '2' : '已上线售卖',
        '3' : '暂售',
        '4' : '删除'
    };

    var pageBar = $("#pageTab");
    var tableBody = $("#dataList");
    var queryPageUtil = new PageUtils( pageBar, tableBody);

    var userInfo = JSON.parse( getCookie("card.userinfo") );

    obj.loadQuery = function(page, removeIfEmpty) {
        queryPageUtil.loadPage(page,
            '/unionCard/selectUnionCard',
            {
                'status'     : $("#status option:selected").val(),
                'searchText' : $("#searchText").val(),
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
                    var html = '<tr class="animated fadeIn">';
                    html += '<td>' + item.cardName + '</td>';//通行权益名称
                    html += '<td>' + parseFloat(item.price) / 100  + '</td>';//标准售价

                    html += '<td>';//发行日期

                    var date = new Date();
                    date.setTime(item.createTime );
                    html += date.format('yyyy-MM-dd');

                    html += '</td>';
                    html += '<td>';//有效期

                    if( !tools.isNull( item.permanent ) && item.permanent == 1 ){
                        html += '永久有效';
                    }else{
                        if( !tools.isNull( item.period )  && item.period>0){
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
                    html += '   <a class="icon-only text-success" data-toggle="tooltip" title="添加" onclick="roomUploadHS.addCardInfo(\'' + index + '\')"><i class="fa fa-plus"></i></a>';
                    html += '</td>';

                    html += '</tr>';
                    $(html).appendTo(tableBody);
                });
                tableBody.parent().trimTextLength();
                tools.tooltipInit();
                tools.icheckInit();
            },
            null,
            removeIfEmpty
        );
    };

    obj.search = function(){

        query.loadQuery(1);

    };

    return obj;
})();

$(document).ready(function(){

    roomInit.initData();

    roomUploadRT.uploadFileInit();
    roomUploadCD.uploadFileInit();

    //富文本初始化
    $('.summernote').summernote();

    tools.icheckInit();

    tools.tooltipInit();
	
	$("#edit-type label").click(function(){
		if(!$(this).hasClass("active")){
			if($(this).find("input").val()==0){
				$("#Tcard-list").hide();
				$("#c-index").show();
			}else if($(this).find("input").val()==1){
				$("#c-index").hide();
				$("#Tcard-list").show();
			}
		}
         
    });
    //$(".nav-item").click(function(){
    //    var that = this;
    //    $(".example-item").each(function(index, item){
    //
    //        $(item).hide();
    //        if( parseInt( $(that).attr('data-id') ) == index ){
    //            $(item).show();
    //        }
    //    })
    //});


});