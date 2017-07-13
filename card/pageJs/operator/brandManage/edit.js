/**
 * 页面数据初始化
 */
var brandDetailInit = function(){
    var obj = {};
    obj.initData = function(){
        http.get( '/operators/operatorsBrandDetails', {'id' : JSON.parse(getCookie('operators.merchantinfo')).id }, function(res){
            if( res.statusCode == 0 ){
            	var configItem = {};
            	if(res.jbody.OperatorsBrand.configItem){
            		configItem = JSON.parse(res.jbody.OperatorsBrand.configItem);
            	}
                brandDetailADUpload.setDefault( configItem.AD);
                brandDetailMENUUpload.setDefault( configItem.MENU);
				brandDetailTAGUpload.setDefault(configItem.TAG);
				brandDetailCATEGORYUpload.setDefault(configItem.CATEGORY);
				
            }
        });
    };
    obj.tabSwitch = function(i){
    	switch( i ){
            case 'AD':
                $("#showImg").attr("src","/resource/img/example4.png");
                break;
            case 'MENU':
                $("#showImg").attr("src","/resource/img/example4.png");
                break;
            case 'CATEGORY':
                $("#showImg").attr("src","/resource/img/example5.png");
                break;
            case 'TAG':
                $("#showImg").attr("src","/resource/img/example6.png");
                break;
        }
    }

    return obj;
}();


/**
 * 品牌编辑-广告
 */
var brandDetailADUpload = function(){
	var obj = {};
	obj.httpPrefix = 'http://';
	obj.contentListNum = 1;
    obj.containers = [{//默认数据有一条
        'name' : 1,
        'type' : 'image',
        'path' : ''
    }];
    
	obj.addElement = function(){
		if(obj.contentListNum<5){
			obj.contentListNum++;
	        var html = '';
	        html += '<div class="col-sm-12 animated fadeInDown" id="elementAD'+obj.contentListNum+'">';
			html += '	<h3>广告'+obj.contentListNum+'</h3>';
			html += '	<div class="form-group">';
			html += '		<label class="col-sm-3 control-label">广告图</label>';
			html += '		<div class="col-sm-9">';
			html += '			<form class="m-b" id="fileuploadAD'+obj.contentListNum+'" action="/rest/file/upload" method="POST" enctype="multipart/form-data">';
			html += '				<div>';
			html += '					<span class="btn btn-white fileinput-button">';
	        html += '                <i class="fa fa-file-text-o icon-white"></i> <span>上传</span>';
			html += '					<input type="file" name="fileAD'+obj.contentListNum+'" id="fileAD'+obj.contentListNum+'" multiple>';
			html += '					</span>';
			html += '				</div>';
			html += '				<input type="hidden" name="name" id="nameAD'+obj.contentListNum+'" value="" />';
			html += '				<input type="hidden" name="prefix" id="prefixAD'+obj.contentListNum+'" value="" />';
			html += '				<input type="hidden" name="fileName" id="fileNameAD'+obj.contentListNum+'" value="" />';
			html += '				<input type="hidden" name="longEdge" id="longEdgeAD'+obj.contentListNum+'" value="" />';
			html += '			</form>';
			html += '			<span class="help-block text-danger m-b">（图片建议尺寸750*450像素，比例5:3，大小500KB以内）</span>';
			html += '			<div class="progress progress-striped active" id="progressBarDivAD'+obj.contentListNum+'" style="width: 300px; display: none;">';
			html += '				<div id="progressBarAD'+obj.contentListNum+'" style="width: 0%" aria-valuemax="100" aria-valuemin="0" aria-valuenow="75" role="progressbar" class="progress-bar progress-bar-default">';
			html += '					<span class="sr-only"></span>';
			html += '				</div>';
			html += '			</div>';
			html += '			<div id="fileDivAD'+obj.contentListNum+'"></div>';
			html += '			<div>';
			html += '				<img id="addPreviewImagePreviewAD'+obj.contentListNum+'" />';
			html += '			</div>';
			html += '		</div>';
			html += '	</div>';
			html += '	<div class="form-group">';
			html += '		<label class="col-sm-3 control-label">跳转链接</label>';
			html += '		<div class="col-sm-9">';
			html += '			<div class="input-group">';
			html += '				<span class="input-group-addon">http://</span>';
			html += '				<input type="text" placeholder="输入跳转链接" class="form-control" id="linkAD'+obj.contentListNum+'">';
			html += '			</div>';
			html += '		</div>';
			html += '	</div>';
			html += '	<div class="form-group">';
			html += '		<div class="col-sm-offset-3 col-sm-9">';
			html += '			<button class="ladda-button btn btn-sm btn-w-m btn-danger" type="button" onclick="brandDetailADUpload.deleteElement('+obj.contentListNum+');" data-style="zoom-out">';
			html += '		<span class="ladda-label">删除</span><span class="ladda-spinner"></span>';
			html += '	</button>';
			html += '		</div>';
			html += '	</div>';
			html += '	<div class="hr-line-dashed"></div>';
			html += '</div>';
	
	        $(html).insertBefore( $("#addAD") );
	
	
	        obj.containers.push({
	            'name' : obj.contentListNum,
	            'type' : 'image',
	            'path' : ''
	        });
	
	        obj.uploadFileInit();
		}else{
			tools.toastr( '最对可配置5张广告图!' ,'', "error" );
		}
        

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
    	
		    	$("#elementAD"+num).remove();
		    	
		    	obj.containers.splice(num-1,1);
		    	
		    	for(var i = num; i <= obj.contentListNum; i++ ){
		    		var n = i+1;
		    		$("#elementAD" + n).attr("id","elementAD" + i);
		    		$("#elementAD" + i +" h3").html("广告" + i);
		    		$("#elementAD" + i +" .btn-danger").attr("onclick","brandDetailADUpload.deleteElement("+i+");");
		    		$("#fileuploadAD" + n).attr("id","fileuploadAD" + i);
		    		$("#fileAD" + n).attr("id","fileAD" + i);
		    		$("input[name='fileAD"+n+"']").attr("name","fileAD" + i);
		    		$("#nameAD" + n).attr("id","nameAD" + i);
		    		$("#prefixAD" + n).attr("id","prefixAD" + i);
		    		$("#fileNameAD" + n).attr("id","fileNameAD" + i);
		    		$("#longEdgeAD" + n).attr("id","longEdgeAD" + i);
		    		$("#progressBarDivAD" + n).attr("id","progressBarDivAD" + i);
		    		$("#progressBarAD" + n).attr("id","progressBarAD" + i);
		    		$("#fileDivAD" + n).attr("id","fileDivAD" + i);
		    		$("#addPreviewImagePreviewAD" + n).attr("id","addPreviewImagePreviewAD" + i);
		    		$("#linkAD" + n).attr("id","linkAD" + i);
		    	};
		    	
		    	obj.uploadFileInit();
		    	
            };
        });
    }
    
    obj.uploadFileInit = function(){

        $(document).ready(function(){
            $(obj.containers).each(function( index, item ){
                $('#fileuploadAD' + item.name).fileupload({
                    dataType: 'json',
                    maxFileSize : 1, // 2 MB
                    add: function (e, data) {
                        //检验图片
                        var size = data['files'][0]['size'];
                        var type = data['files'][0]['type'];

                        //form数据整理
                        $("#nameAD" + item.name ).attr('value', 'fileAD' + item.name);
                        $("#prefixAD" + item.name ).attr('value', 'Temp/unionCard');
                        $("#fileNameAD" + item.name ).attr('value', '');
                        $("#longEdgeAD" + item.name ).attr('value', '1000');

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

                        $("#progressBarDivAD" + item.name ).show();
                        data.submit();
                    },
                    progress: function (e, data) {
                        //上传进度
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $("#progressBarAD" + item.name).attr("style", "width:" + progress + "%;");
                    },
                    done: function (e, data) {

                        //console.log( data.result );

                        if( data.result.statusCode == 0 ){

                            //obj.setPath( item.name, data.result.jbody.path );

                            obj.containers[index].path = data.result.jbody.path;

                            $("#progressBarAD"  + item.name ).attr("style", "width:0%;");
                            $("#progressBarDivAD"  + item.name ).hide();

                            if( item.type == 'image' ){
                                //是图片，展示图片
                                $("#addPreviewImagePreviewAD" + item.name ).attr("src", getCookie('card.host.public') + data.result.jbody.path);
                            }else{
                                //是普通文件，展示图标
                                $("#fileDivAD" + item.name ).html( '<i class="fa fa-file-zip-o m-r"></i>' + obj.fileName );
                            }
                        }else{
                            //处理上传异常
                            tools.toastr( '上传 异常', '', 'error' );

                            $("#progressBarAD" + item.name ).attr("style", "width:0%;");
                            $("#progressBarDivAD"  + item.name ).hide();
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

            /*var checkInfo = [
                {
                    'id' : ('linkAD' + i ),
                    'errMsg' : '跳转链接'
                }
            ];*/

            if( !checkPass ){//如果之前检查有错误，中止循环
                break;
            }

            /*checkPass = tools.checkInputNull( checkInfo );*/


            //检查是否上传图片
            if( obj.containers[i-1].path == '' ){
                tools.toastr( '请上传广告' + i + '的广告图!', '', 'error' );
                checkPass = false;
            }
        }

        if( checkPass == true ){

            //组装数据
            var formData = [];
            for( var i = 1; i <= obj.contentListNum; i++  ){
                var o = {
                    'photo': obj.containers[i-1].path,
                    'link': obj.httpPrefix + $("#linkAD1" + i).val(),
                    'sort':i		
                };

                formData.push( o );
            }
			formData = {
				'AD':formData
			};
            //console.log( formData );

            var url = "/operators/operatorsBrandDetailModify";
            var data = {
            	'operatorsId':(JSON.parse(getCookie('card.userinfo'))).operatorsId,
            	'merchantId':JSON.parse(getCookie('operators.merchantinfo')).merchantId,
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
                $("#addPreviewImagePreviewAD" + ( index + 1)).attr( 'src', getCookie('card.host.public') + item.photo );
                
                var link = item.link.replaceAll(obj.httpPrefix,'');
                if(link!='undefined'){
                	$("#linkAD" + ( index + 1)).val( link );
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
}();


/**
 * 品牌编辑-菜单配置
 */
var brandDetailMENUUpload = function(){
	var obj = {};
	obj.imgUrl = getCookie('card.host.public');
	obj.httpPrefix = 'http://';
	obj.contentListNum = 4;
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
	    {
	        'name' : 4,
	        'type' : 'image',
	    },
	    
    ];
    
    obj.deleteImg = function(e){
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
		    	$(e).parent().remove();
            };
        });
    }
    
    obj.uploadFileInit = function(){

        $(document).ready(function(){
            $(obj.containers).each(function(index,item){
                $('#fileuploadMENU' + item.name).fileupload({
                    dataType: 'json',
                    maxFileSize : 1, // 2 MB
                    add: function (e, data) {
                        //检验图片
                        var size = data['files'][0]['size'];
                        var type = data['files'][0]['type'];

                        //form数据整理
                        $("#nameMENU" + item.name ).attr('value', 'fileMENU' + item.name);
                        $("#prefixMENU" + item.name ).attr('value', 'Temp/unionCard');
                        $("#fileNameMENU" + item.name ).attr('value', '');
                        $("#longEdgeMENU" + item.name ).attr('value', '1000');

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

                        $("#progressBarDivMENU" + item.name ).show();
                        data.submit();
                    },
                    progress: function (e, data) {
                        //上传进度
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $("#progressBarMENU" + item.name).attr("style", "width:" + progress + "%;");
                    },
                    done: function (e, data) {

                        //console.log( data.result );

                        if( data.result.statusCode == 0 ){



                            $("#progressBarMENU"  + item.name ).attr("style", "width:0%;");
                            $("#progressBarDivMENU"  + item.name ).hide();

                            if( item.type == 'image' ){
                                //是图片，展示图片
                                var html = '<div class="addPreviewImagePreviewMENU">';
								 	html+= '	<img src="'+obj.imgUrl + data.result.jbody.path+'"/>';
									html+= '	<span class="icon-only text-danger" onclick="brandDetailMENUUpload.deleteImg(this)"><i class="fa fa-times"></i></span>';
									html+= '</div>';
                                $("#addPreviewImagePreviewMENU" + item.name ).append(html);
                            }else{
                                //是普通文件，展示图标
                                $("#fileDivMENU" + item.name ).html( '<i class="fa fa-file-zip-o m-r"></i>' + obj.fileName );
                            }
                        }else{
                            //处理上传异常
                            tools.toastr( '上传 异常', '', 'error' );

                            $("#progressBarMENU" + item.name ).attr("style", "width:0%;");
                            $("#progressBarDivMENU"  + item.name ).hide();
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

        //组装数据
        var formData = [];
        for( var i = 1; i <= obj.contentListNum; i++  ){
        	var photos=[];
        	$("#addPreviewImagePreviewMENU"+i+" .addPreviewImagePreviewMENU").each(function(index,item){
        		photos.push({
        			'photo': $(item).find("img").attr("src").replaceAll(obj.imgUrl,''),
                    'sort': index+1
        		})
        	})
            var o = {
                'title': $("#menuName"+i).val(),
	            'photos': photos,
	            'show': $("#menuIsShow"+i).is(':checked')		
            };

            formData.push( o );
        }
		formData = {
			'MENU':formData
		};
        //console.log( formData );

        var url = "/operators/operatorsBrandDetailModify";
        var data = {
        	'operatorsId':(JSON.parse(getCookie('card.userinfo'))).operatorsId,
        	'merchantId':JSON.parse(getCookie('operators.merchantinfo')).merchantId,
            'configItem' : JSON.stringify( formData )
        };

        http.post(url, data, function( res ){
            if( res.statusCode == 0 ){
                swal( res.msg, '', 'success' );
            }else{
                swal( res.msg, '', 'error' );
            }
        });
    };

    /**
     * 默认值初始化
     * @param data
     */
    obj.setDefault = function( menu ){

        //set content
        if( menu ){

            //数据初始化
            $(menu).each(function( index, item ){
            	var n=index+1;
            	if( item.show ){
		    		$("#menuIsShow"+n).iCheck('check');
			    }else{
			    	$("#menuIsShow"+n).iCheck('uncheck');
			    }
			    if(item.title){
			    	$("#menuName"+n).val(item.title);
			    }
			    if(item.photos.length>0){
			    	$(item.photos).each(function(i,o){
			    		var html = '<div class="addPreviewImagePreviewMENU">';
						 	html+= '	<img src="'+obj.imgUrl + o.photo+'"/>';
							html+= '	<span class="icon-only text-danger" onclick="brandDetailMENUUpload.deleteImg(this)"><i class="fa fa-times"></i></span>';
							html+= '</div>';
                        $("#addPreviewImagePreviewMENU" + n ).append(html);
			    	})
			    }
            });

            
        }
        obj.uploadFileInit();
        $(".connectList").sortable({
			connectWith: ".connectList",
			update: function(event, ui) {
				
			}
			
		}).disableSelection();	
    };
    
	return obj;
}();


/**
 * 品牌编辑-地域/商圈/其他
 */
var brandDetailCATEGORYUpload = function(){
    var obj = {};
    obj.contentListNum = 4;
    
	/**
     * 上传内容
     */
    obj.submitContent = function(){
    	var formData = [];
    	$("input[name='categorys']:checkbox").each(function(){
    		if(true == $(this).is(':checked')){
    			var o = {
					'id':$(this).val(),
					'name':$(this).attr("data-text")
				}
				formData.push(o);
    		}
				
		});
    	formData = {
    		'CATEGORY':{
    			'show': $("#categoryIsShow").is(':checked'),
	        	'category': formData
    		}
    	}
    	var url = "/operators/operatorsBrandDetailModify";
        var data = {
        	'operatorsId':(JSON.parse(getCookie('card.userinfo'))).operatorsId,
        	'merchantId':JSON.parse(getCookie('operators.merchantinfo')).merchantId,
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
    
    /**
     * 默认值初始化
     * @param data
     */
    obj.setDefault = function( data ){
    	var categorys = [];
    	if(data){
			if(!data.show){
				$("#categoryIsShow").iCheck('uncheck');
			};
			if(data.category){
				$(data.category).each(function(index,item){
					categorys.push(item.id);
				})
			}
		}
    	if(JSON.parse(getCookie('operators.merchantinfo')).areaId){
    		http.post( '/operators/customCategorys', {
	    		'operatorsId' : JSON.parse(getCookie('card.userinfo')).operatorsId,
	    		'areaId':JSON.parse(getCookie('operators.merchantinfo')).areaId,
	    		'pageSize':1000,
	    		'pageNum':1
	    	}, function(res){
	            if( res.statusCode == 0 ){
	            	var jsonResponse = res['jbody']['pageInfo'];
	            	if(jsonResponse['list']){
	            		$("#categorys").html('');
	            		$(jsonResponse['list']).each(function(index, item){
	            			var html = '';
	            			if(categorys.length>0){
								if($.inArray(JSON.stringify(item.id), categorys)!=-1){
									html+='<div class="i-checks"><label> <input type="checkbox" checked="checked" name = "categorys" value="'+item.id+'" data-text="'+item.categoryName+'"> <i></i> '+item.categoryName+' </label></div>'
								}else{
									html+='<div class="i-checks"><label> <input type="checkbox" name = "categorys" value="'+item.id+'" data-text="'+item.categoryName+'"> <i></i> '+item.categoryName+' </label></div>'
								}
							}else{
								html+='<div class="i-checks"><label> <input type="checkbox" name = "categorys" value="'+item.id+'" data-text="'+item.categoryName+'"> <i></i> '+item.categoryName+' </label></div>'
							}
	            			
	            			$("#categorys").append(html);
	            		});
	            		tools.icheckInit();
	            	}
	                
	            }
	        });
    	}else{
    		var html = '<label class="col-sm-3 control-label text-danger" style="text-align:left;padding-left: 0;">请先配置门店所属地区</label>';
    		$("#categorys").append(html);
    	}
    	
    };
    return obj;
}();

/**
 * 品牌编辑-标签
 */
var brandDetailTAGUpload = function(){
    var obj = {};
    obj.contentListNum = 4;
    
	/**
     * 上传内容
     */
    obj.submitContent = function(){
    	var formData = [];
    	for( var i = 1; i <= obj.contentListNum; i++  ){
    		var o = {
                'name': $("#tag"+i).val()
            }
    		formData.push( o );
    	}
    	formData = {
    		'TAG':{
    			'show': $("#tagIsShow").is(':checked'),
	        	'tags': formData
    		}
    	}
    	var url = "/operators/operatorsBrandDetailModify";
        var data = {
        	'operatorsId':(JSON.parse(getCookie('card.userinfo'))).operatorsId,
        	'merchantId':JSON.parse(getCookie('operators.merchantinfo')).merchantId,
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
    
    /**
     * 默认值初始化
     * @param data
     */
    obj.setDefault = function( tag ){
		if(tag){
			if( tag.show ){
		    	$("#tagIsShow").iCheck('check');
		    }else{
		    	$("#tagIsShow").iCheck('uncheck');
		    }
		    
		    if(tag.tags){
		    	$(tag.tags).each(function( index, item ){
		    		var n = index+1;
		            $("#tag"+n).val(item.name);
		        });
		    }
		}
    };
    return obj;
}();


$(document).ready(function() {
	
	tools.icheckInit();
	
	brandDetailInit.initData();
	var userinfo = JSON.parse(getCookie('card.userinfo'));
	operatorsId = userinfo.operatorsId;
});