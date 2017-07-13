/**
 * 页面状态
 * @type {Function}
 */
var pageStatus = (function(){
    var obj = {};
    obj.isEdit = false;

    return obj;
});

//上传基本信息
var uploadInfo = (function(){
    var obj = {};
    obj.fileUrl = '';
    obj.fileName = '';
    obj.fileType = '';
    obj.isUploaded = false;
    obj.operatorInfo = {};


    obj.fileUrlLogo = '';
    obj.fileNameLogo = '';
    obj.fileTypeLogo = '';
    $(document).ready(function(){
        //上传附件
        $('#fileupload').fileupload({
            dataType: 'json',
            maxFileSize : 1, // 2 MB
            add: function (e, data) {
                //检验图片
                var size = data['files'][0]['size'];
                var type = data['files'][0]['type'];
                var name = data['files'][0]['name'];
                

                //form数据整理
                $("#name").attr('value', 'file');
                $("#prefix").attr('value', 'Temp/Private/Bucket/operators');
                $("#fileName").attr('value', '');
                $("#longEdge").attr('value', '200');

                obj.fileName = data['files'][0]['name'];
                obj.fileType = data['files'][0]['type'];

                //console.log( data['files'][0] );

                //文件类型校验
                if( tools.isFile( data, true ) ){
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
                    $("#fileDiv").html( '<i class="fa fa-file-zip-o m-r"></i>' + obj.fileName+'<a class="icon-only text-info" data-toggle="tooltip" data-original-title="下载附件" href="' + getCookie('card.host.public') +  obj.fileUrl + '"><i class="fa fa-download"></i></a>' );
                    tools.tooltipInit();
                }else{
                    tools.toastr( '上传 异常', '', 'error' );

                    $("#progressBar").attr("style", "width:0%;");
                    $("#progressBarDiv").hide();
                    return false;
                }

                //data.context.text('Upload finished.');

                //if( tools.isImage( obj.fileType) ){
                //    //是图片
                //    obj.fileUrl = getCookie('card.host') + data.result.jbody.path;
                //    $("#addPreviewImagePreview").attr("src", obj.fileUrl);
                //    $("#addPreviewImagePreview").show();
                //}else if( tools.isFile( obj.fileType) ){
                //    //是文件
                //    if( !/.(xls)$/i.test( obj.fileType) ){
                //        $("#fileDiv").html( '<i class="fa fa-file-excel-o"></i>' + obj.fileName );
                //    }else if( !/.(pdf)$/i.test( obj.fileType) ){
                //        $("#fileDiv").html( '<i class="fa fa-file-pdf-o"></i>' + obj.fileName );
                //    }else if( !/.(doc)$/i.test( obj.fileType) ){
                //        $("#fileDiv").html( '<i class="fa fa-file-word-o"></i>' + obj.fileName );
                //    }else if( !/.(docx)$/i.test( obj.fileType) ){
                //        $("#fileDiv").html( '<i class="fa fa-file-word-o"></i>' + obj.fileName );
                //    }else if( !/.(x-zip-compressed)$/i.test( obj.fileType) ){
                //        $("#fileDiv").html( '<i class="fa fa-file-zip-o"></i>' + obj.fileName );
                //    }
                //}


            }
        });


        $('#fileuploadLogo').fileupload({
            dataType: 'json',
            maxFileSize : 1, // 2 MB
            add: function (e, data) {
                //检验图片
                var size = data['files'][0]['size'];
                var type = data['files'][0]['type'];

                //form数据整理
                $("#nameLogo").attr('value', 'file');
                $("#prefixLogo").attr('value', 'Temp/operators');
                $("#fileNameLogo").attr('value', '');
                $("#longEdgeLogo").attr('value', '200');

                obj.fileNameLogo = data['files'][0]['name'];
                obj.fileTypeLogo = data['files'][0]['type'];

                //文件类型校验
                if( tools.isImage( data['files'][0]['type'], true ) ){
                    if( !tools.checkaddfile(size,type) ){
                        return false;
                    }
                }else{
                    return false;
                }

                $("#progressBarDivLogo").show();
                data.submit();
            },
            progress: function (e, data) {
                //上传进度
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $("#progressBarLogo").attr("style", "width:"+progress+"%;");
            },
            done: function (e, data) {

                if( data.result.statusCode == 0 ){
                    $("#progressBarDivLogo").hide();
                    $("#progressBarLogo").attr("style", "width:0%;");
                    obj.fileUrlLogo = data.result.jbody.path;
                    $("#addPreviewImagePreviewLogo").attr('src', getCookie('card.host.public') + obj.fileUrlLogo);
                }else{
                    tools.toastr( '上传 异常', '', 'error' );

                    $("#progressBarLogo").attr("style", "width:0%;");
                    $("#progressBarDivLogo").hide();
                    return false;
                }
            }
        });
    });

    /**
     * 提交数据
     */
    obj.submitForm = function(){

        var checkInfo = [
            {
                'name' : 'operatorsName',
                'exp'  : '运营商名称'
            },
            {
                'name' : 'companyName',
                'exp'  : '公司名称'
            },
            {
                'name' : 'address',
                'exp'  : '公司地址'
            },
            //{
            //    'name' : 'contact',
            //    'exp'  : '联系人'
            //},
            //{
            //    'name' : 'tel',
            //    'exp'  : '联系电话'
            //},
            {
                'name' : 'fileUrl',
            }
            
        ];
        var checkPass = true;
        $(checkInfo).each(function( index, item ){
            $("#" + item.name).parent().parent().removeClass( 'has-error' );
            if( item.name != 'fileUrl' ){
                if( tools.isNull( $("#" + item.name ).val() ) ){
                    tools.toastr( '请填写' + item.exp, '', 'error' );
                    $("#" + item.name).parent().parent().addClass( 'has-error' );
                    checkPass = false;
                    return false;
                }else{
                    $("#" + item.name).parent().parent().removeClass( 'has-error' );
                }
            }else{
                if( obj.fileUrl == '' ){
                    tools.toastr( '请上传运营资质', '', 'error' );
                    checkPass = false;
                    return false;
                }
                //if( obj.fileUrlLogo == '' ){
                //    tools.toastr( '请上传文件', '', 'error' );
                //    checkPass = false;
                //    return false;
                //}
            }
        });
        
        //组装客服电话
        var csTel = [];
        $("input[name='csTel_name']").each(function( index, item ){
        	var cs={};
        	cs["name"]=$(item).val();
        	if(cs["name"]){
        		csTel.push(cs);
        	}
        });
        $("input[name='csTel_phone']").each(function( index, item ){
        	if(csTel[index]){
        		csTel[index]["tel"]=$(item).val();
        	}
        });
                     
        if( checkPass ){
             
            if( pageStatus.isEdit ){
                var url = '/operators/updateOperators'
                var data = {
                    'id'            : obj.operatorInfo.id,
                    //运营商名称
                    'operatorsName' : $("#operatorsName").val(),
                    //公司名称
                    'companyName'   : $("#companyName").val(),
                    //公司地址
                    'address'       : $("#address").val(),
                    //联系人
                    'contact'       : $("#contact").val(),
                    //联系电话
                    'tel'           : $("#tel").val(),
                    //客服电话
                    "csTel"     : JSON.stringify( csTel ),
                    //状态 1-正常，2-锁定，3-注销
                    'status'        : 1,
                    //运营资质 ，此处保存文件uri
                    'credentials'   : obj.fileUrl.split('?')[0] || '',
                    //运营商logo图片地址
                    'logo'          : obj.fileUrlLogo || ''
                };
            }else{
                var url = '/operators/insertOperators';
                var data = {
                    //运营商名称
                    'operatorsName' : $("#operatorsName").val(),
                    //公司名称
                    'companyName'   : $("#companyName").val(),
                    //公司地址
                    'address'       : $("#address").val(),
                    //联系人
                    'contact'       : $("#contact").val(),
                    //联系电话
                    'tel'           : $("#tel").val(),
                    //客服电话
                    "csTel"     : JSON.stringify( csTel ),
                    //状态 1-正常，2-锁定，3-注销
                    'status'        : 1,
                    //运营资质 ，此处保存文件uri
                    'credentials'   : obj.fileUrl.split('?')[0] || '',
                    //运营商logo图片地址
                    'logo'          : obj.fileUrlLogo || ''
                };
            }

            http.post(url, data, function( res ){
                if( res.statusCode == 0 ){
                    if( pageStatus.isEdit ){
                        swal( res.msg, '' );
                    }else{
                        obj.isUploaded = true;
                        obj.operatorInfo = res.jbody.Operators;
                        //开放后三菜单
                        $(".nav-controller").find('li').each(function( index, item ){
                            if( index != 0 ){
                                $(item).attr('class', '');
                            }
                        });
						$("#operatorsName_1").val(obj.operatorInfo.operatorsName);
                        //加载已关联商户列表数据
                        queryOperatorBrand.loadQuery(1);
                        
                        //加载该运营商下的用户帐号
                        operatorUserList.loadQuery(1);
                        
                        //加载业态和地区
                        industry.loadData();
                        area.loadData();

                        swal( res.msg, '', 'success' );
                    }
                    $("#title").html( $("#operatorsName").val() );
                }else{
                    tools.toastr( res.msg, '', 'error' );
                }
            });
        }

    };

    /**
     * 基本信息初始化
     * @param id
     */
    obj.setDefault = function( id ){

        var url = '/operators/selectOperatorsById';
        var data = {'id' : parseInt(id)};
        http.post(url, data, function( res ){
            if( res.statusCode == 0 ){
                obj.operatorInfo = res.jbody.Operators;

                
                //页面元素数据初始化
                obj.isUploaded = true;
                $("#title"        ).html( obj.operatorInfo.operatorsName || '' );
                $("#operatorsName").val( obj.operatorInfo.operatorsName || '' );
                $("#operatorsName_1").val( obj.operatorInfo.operatorsName || '' );
                $("#companyName"  ).val( obj.operatorInfo.companyName   || '' );
                $("#address"      ).val( obj.operatorInfo.address       || '' );
                $("#contact"      ).val( obj.operatorInfo.contact       || '' );
                $("#tel"          ).val( obj.operatorInfo.tel           || '' );

                var csTelArray = [];
                if( obj.operatorInfo.csTel ){
                    csTelArray=JSON.parse(obj.operatorInfo.csTel);
                }


//                $("#csTelArray").html("");
                var csTelHtml="";
                $(csTelArray).each(function(index,item){
//                	var csTelHtml="";
                	csTelHtml +='<div class="hr-line-dashed animated fadeInDown"></div>';
                	csTelHtml +='<div class="form-group"><label class="col-sm-3 control-label">';
                	csTelHtml +='<small class="text-danger">*&nbsp;&nbsp;</small>客服姓名</label>';
                	csTelHtml +='<div class="col-sm-5"><input type="text" class="form-control" name="csTel_name" value="'+item.name+'"></div>';
                	csTelHtml +='</div>';
                	csTelHtml +='<div class="form-group"><label class="col-sm-3 control-label">';
                	csTelHtml +='<small class="text-danger">*&nbsp;&nbsp;</small>客服电话</label>';
                	csTelHtml +='<div class="col-sm-5"><input type="text" class="form-control" name="csTel_phone" value="'+item.tel+'"></div>';
                	csTelHtml +='</div>'
//                	$("#csTelArray").append(csTelHtml);
                });
                $("#csTelArray").html(csTelHtml);

                obj.fileUrlLogo = obj.operatorInfo.logo  || '';
                obj.fileUrl = obj.operatorInfo.credentials  || '';

                if( obj.operatorInfo.logo ){
                    $("#addPreviewImagePreviewLogo").attr('src', getCookie('card.host.public') + obj.fileUrlLogo);
                }

                if( obj.operatorInfo.credentials && obj.operatorInfo.credentials != '' ){
                    $("#fileDiv").html( '<i class="fa fa-file-zip-o m-r"></i><a class="icon-only text-info" data-toggle="tooltip" data-original-title="下载附件" href="' + getCookie('card.host.private') +  obj.operatorInfo.credentials + '"><i class="fa fa-download"></i></a>' );
                    tools.tooltipInit();
                }


                //开放后三菜单
                $(".nav-controller").find('li').each(function( index, item ){
                    if( index != 0 ){
                        $(item).attr('class', '');
                    }
                });

                //加载已关联商户列表数据
                queryOperatorBrand.loadQuery(1);
                
                //加载该运营商下的用户帐号
                operatorUserList.loadQuery(1);
                
                //加载业态和地区
                industry.loadData();
                area.loadData();

                //人工转帐帐号配置初始化
                if( obj.operatorInfo.tsAccount && obj.operatorInfo.wxPublicUrlImg != '' ){
                    transferConfig.setDefault( obj.operatorInfo.tsAccount, obj.operatorInfo.wxPublicUrlImg );
                }
            }

        });
    };

    //检查是否先提交基本信息
    obj.check = function(){
        if( !obj.isUploaded ){

            tools.toastr('未填写基本信息','', 'warning');

            return false;
        }
    };

    return obj;
})();
/**
 * 商户列表，未关联列表
 */
var queryBrand = (function() {
    var obj = {};
    var pageBar = $("#pageTabBrand");
    var tableBody = $("#dataListBrand");
    var queryPageUtil = new PageUtils( pageBar, tableBody);

    obj.merchant = [];

    obj.loadQuery = function(page, removeIfEmpty) {
        queryPageUtil.loadPage(page,
            '/operators/selectMerchant',
            {
                'operatorsId' : uploadInfo.operatorInfo.id,
                'searchText' : $("#searchTextBrand").val(),
                'industryId': $("#industry_2").val(),
				'areaId': $("#area_2").val()||''
            },
            function(jsonResponse) {
                var pagination = jsonResponse['jbody']['pageInfo'];
                //tableBody.html('');
                if (!pagination['list'] || pagination['list'].length == 0){
                    //tools.toastr("无符合的搜索内容","提示信息", 'warning');
                    return;
                }
                //pagination['list'].reverse();
                obj.merchant = pagination['list'];
                $(pagination['list']).each(function(index, item){
                    var html = '<tr class="animated fadeIn">';
                    html += '<td class="text-center"><input type="checkbox" class="i-checks" name="brand-store" data-id="' + index + '"></td>';
                    html += '<td>' + (item.parentName||'') + '</td>';
                    html += '<td>' + (item.merchantName||'') + '</td>';
                    html += '<td>' + (item.industryName||'') + '</td>';
                    html += '<td>' + (item.areaName||'') + '</td>';
                    html += '<td>';
                    html += '   <button type="button" class="btn btn-primary btn-sm" onclick="operatorBrand.start(this)" id="merchant_'+ item.merchantId +'" data-id="' + index + '">关联</button>';
                    html += '</td>';
                    html += '</tr>';
                    $(html).appendTo(tableBody);
                });
                tableBody.parent().trimTextLength();
                tools.tooltipInit();

                $("input[name=brand-store]").iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'
                });

                check($("input[name='brand-store']:not(.check-all)"),$("input[name='brand-store'].check-all"));
                function check(checkboxes,checkAll) {

                    checkboxes.on('ifChanged', function(event) {
                        if(checkboxes.filter(':checked').length == checkboxes.length) {
                            checkAll.prop('checked', 'checked');
                        } else {
                            checkAll.removeAttr('checked');
                        }
                        checkAll.iCheck('update');
                    });
                    checkAll.on('ifChecked ifUnchecked', function(event) {
                        if(event.type == 'ifChecked') {
                            checkboxes.iCheck('check');
                        } else {
                            checkboxes.iCheck('uncheck');
                        }
                    });
                }


            },
            null,
            removeIfEmpty
        );
    };
    return obj;
})();

/**
 * 已关联商户列表
 */
var queryOperatorBrand = (function() {
    var obj = {};
    obj.data = {};
    var pageBar = $("#pageTabOperatorBrand");
    var tableBody = $("#dataListOperatorBrand");
    var queryPageUtil = new PageUtils( pageBar, tableBody);
    obj.loadQuery = function(page, removeIfEmpty) {
    	var province = $("#area_province_1").val();
		var city = $("#area_city_1").val();
		var area = $("#area_1").val();
		var areaType ='',areaValue = '';
		if(area){
			areaType = 'area';
			areaValue = area;
		}else if(city){
			areaType = 'city';
			areaValue = city;
		}else if(province){
			areaType = 'province';
			areaValue = province;
		}
        queryPageUtil.loadPage(page,
            '/operators/selectOperatorsBrand',
            {
                'operatorsId' : uploadInfo.operatorInfo.id,
                'status'      :  1,
                'searchText' : $("#searchTextOperatorBrand").val(),
                'industryId': $("#industry_1").val(),
                'extendData': areaType,
				'extendData2':areaValue
            },
            function(jsonResponse) {
                var pagination = jsonResponse['jbody']['pageInfo'];
                //tableBody.html('');
                if (!pagination['list'] || pagination['list'].length == 0){
                    //tools.toastr("无符合的搜索内容","提示信息", 'warning');
                    return;
                }
                //pagination['list'].reverse();
                queryOperatorBrand.data = pagination['list'];
                $(pagination['list']).each(function(index, item){
                    var html = '<tr class="animated fadeIn">';
                    html += '<td>' + (item.brandName||'') + '</td>';
                    html += '<td>' + (item.merchantName||'') + '</td>';
                    html += '<td>' + (item.industryName||'') + '</td>';
                    html += '<td>' + (item.areaName||'') + '</td>';
                    html += '<td>';
                    //html += '   <a class="icon-only text-muted " data-toggle="tooltip" data-merchant-id="'+ item.merchantId +'" data-merchant-code="' + item.merchantCode + '" title="详情"><i class="fa fa-list-alt"></i></a>';
                    html += '   <a class="icon-only text-danger" data-toggle="tooltip" data-merchant-id="'+ item.merchantId +'" data-merchant-code="' + item.merchantCode + '" title="删除" onclick="queryOperatorBrand.delete('+index+');"><i class="fa fa-trash-o"></i></a>';
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
     * 页面index数
     * @param index
     */
    obj.delete = function( index ){
        var url = '/operators/deleteOperatorsBrand';
        var data = {
            'id' : obj.data[index].id,
            'status' : 3
        };
        http.post( url, data, function( res ){
            if( res.statusCode == 0 ){
                swal( res.msg, '', 'success' );
                obj.loadQuery(1);
            }else{
                swal( res.msg, '', 'error' );
            }
        });

    };

    return obj;
})();

/**
 * 单个关联
 * @param obj
 */
var operatorBrand = (function(){
    var obj = {};
    obj.start = function(obj){
        var merchant = queryBrand.merchant[ $(obj).attr('data-id') ];
        var url = '/operators/insertOperatorsBrand';
        var data = {
            //运营商ID
            'operatorsId'   : uploadInfo.operatorInfo.id,
            //品牌ID
            'brandId'       : (merchant.parentId || merchant.merchantId),
            //品牌名称
            'brandName'     : (merchant.parentName || merchant.merchantName),
            //商户ID
            'merchantId'    : merchant.merchantId,
            //商户名称
            'merchantName'  : merchant.merchantName,
            //地区ID
            'areaId'        : (merchant.areaId || ''),
            //地区名
            'areaName'      : (merchant.areaName || ''),
            //类别ID
            'categoryId'    : (merchant.categoryId || ''),
            //类别名称
            'categoryName'  : (merchant.categoryName || ''),
            //类别ID
            'industryId'    : (merchant.industryId || ''),
            //业态名称
            'industryName'  : (merchant.industryName || ''),
            //状态 1-正常，2-锁定，3-注销
            'status'        : 1
        };
        http.post( url, data, function( jsonResponse ){
            if( jsonResponse.statusCode == 0 ){
                swal('关联成功' || jsonResponse.msg, "", "success");

                $("#merchant_" + merchant.merchantId).attr( 'value', '已关联' );
                $("#merchant_" + merchant.merchantId).html( '已关联' );
                $("#merchant_" + merchant.merchantId).attr('disabled', 'disabled');

            }

        });
    };

    return obj;


})();


/**
 * 多个关联
 */
var operatorBrands = (function(){
	debugger;
    var obj = {};
    obj.data = [];

    obj.setData = function(){
        var check = $("input[name='brand-store']:not(.check-all):checked");
        
        if( check.length == 0 ){
            swal('请勾选需要关联的门店', "", "warning");
            return false;
        }
        obj.data = [];
        $($("input[name='brand-store']:not(.check-all):checked")).each(function(index, item){
            var merchant = queryBrand.merchant[ $(item).attr( 'data-id' ) ];
            var data = {
                //运营商ID
                'operatorsId'   : uploadInfo.operatorInfo.id,
                //品牌ID
                'brandId'       : (merchant.parentId || merchant.merchantId),
                //品牌名称
                'brandName'     : (merchant.parentName || merchant.merchantName),
                //商户ID
                'merchantId'    : merchant.merchantId,
                //商户名称
                'merchantName'  : merchant.merchantName,
                //地区ID
                'areaId'        : (merchant.areaId|| ''),
                //地区名
                'areaName'      : (merchant.areaName|| ''),
                //类别ID
                'categoryId'    : (merchant.categoryId || ''),
                //类别名称
                'categoryName'  : (merchant.categoryName || ''),
                //类别ID
                'industryId'    : (merchant.industryId || ''),
                //业态名称
                'industryName'  : (merchant.industryName || ''),
                //状态 1-正常，2-锁定，3-注销
                'status'        : 1
            };
            obj.data.push( data );
        });

        obj.sendData();
    };



    obj.sendData = function(){
        var url = '/operators/insertOperatorsBrandList';
        http.post( url, {'operatorsBrandArray' : JSON.stringify(obj.data)}, function( jsonResponse ){
            if( jsonResponse.statusCode == 0 ){
                swal('关联成功' || jsonResponse.msg, "", "success");
                queryBrand.loadQuery(1);
            }
        });
    };

    return obj;
})();



/**
 * 运营商名下帐号列表
 */
var operatorUserList = (function() {
    var obj = {};
    var pageBar = $("#pageTaboperatorUserList");
    var tableBody = $("#dataListoperatorUserList");
    var queryPageUtil = new PageUtils( pageBar, tableBody);
    obj.loadQuery = function(page, removeIfEmpty) {
        queryPageUtil.loadPage(page,
            '/system/user/list',
            {
                'operatorsId' : uploadInfo.operatorInfo.id,
                'userName' : $("#userName_add").val(),
                'phone' : $("#phone").val(),
            },
            function(jsonResponse) {
                var pagination = jsonResponse['jbody']['pageInfo'];
                //tableBody.html('');
                if (!pagination['list'] || pagination['list'].length == 0){
                    //tools.toastr("无符合的搜索内容","提示信息", 'warning');
                    return;
                }
                //pagination['list'].reverse();
                $(pagination['list']).each(function(index, item){
                    var html = '<tr class="animated fadeIn">';
                    html += '<td>' +item.userName + '</td>';
                    html += '<td>' +item.statusName + '</td>';
                    html += '<td>';
                    if(item.status!=3){
                    	html += '   <a class="icon-only text-muted " data-toggle="tooltip" title="密码重置" onclick="operatorUser.modifyPassword(\'' + item.id + '\',\'' + item.userName + '\',\'' + item.phone + '\')"><i class="fa fa-refresh"></i></a>';
                    	if(item.status==1){
                    		html += '   <a class="icon-only text-danger" data-toggle="tooltip" title="锁定" onclick="operatorUser.lock(\'' + item.id + '\')"><i class="fa fa-lock"></i></a>';
                    	}else{
                    		html += '   <a class="icon-only text-danger" data-toggle="tooltip" title="解锁" onclick="operatorUser.unlock(\'' + item.id + '\')"><i class="fa fa-unlock"></i></a>';
                    	}
                    	html += '   <a class="icon-only text-danger" data-toggle="tooltip" title="删除" onclick="operatorUser.delect(\'' + item.id + '\')"><i class="fa fa-trash-o"></i></a>';
                    }
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

    obj.search = function(){
        operatorUserList.loadQuery(1);
    };

    return obj;
})();

/**
 * 运营商名下帐号
 */
var operatorUser = (function() {
    var obj = {};
    obj.addcheckInfo = [
        {
            'name' : 'insertUsername',
            'exp'  : '用户名不能为空'
        },
        {
            'name' : 'insertUserphone',
            'exp'  : '用户电话不能为空'
        },
        {
            'name' : 'insertPassword',
            'exp'  : '密码不能为空'
        },
        {
            'name' : 'confirmInsertPassword',
            'exp'  : '请确认密码'
        }
    ];
    //新增帐号
    obj.add = function(){
    	$("#insertUser").modal("show");
    	
    	$("#submitUser").click(function(){
    		var checkPass = true;
    	
	    	//空判断
	        $(obj.addcheckInfo).each(function( index, item ){
	            if( tools.isNull( $("input[name="+item.name+"]").val() ) ){
	                tools.toastr( item.exp, '', 'error' );
	                checkPass = false;
	                return false;
	            }
	        });
	        
	        //密码确认
	        if($("input[name=insertPassword]").val()!=$("input[name=confirmInsertPassword]").val()){
	        	tools.toastr( '两次输入密码不一样', '', 'error' );
	        	checkPass = false;
	            return false;
	        }
	        if(checkPass){
	        	var url = '/system/user/add';
	    		var data = {
	    			'operatorsId':uploadInfo.operatorInfo.id,
	    			'userName':$("input[name=insertUsername]").val(),
	    			'phone':$("input[name=insertUserphone]").val(),
	    			'password':$("input[name=insertPassword]").val(),
	    		};
	    		http.post(url, data, function( res ){
                    if( res.statusCode == 0 ){
                        swal({
                            title: res.msg,
                            text: "",
                            type: "success"
                        }, function(){
                            $("#insertUser").modal("hide");
                            $("input[name=insertUsername]").val( '' );
                            $("input[name=insertUserphone]").val( '' );
                            $("input[name=insertPassword]").val( '' );
                            $("input[name=confirmInsertPassword]").val( '' );
                            operatorUserList.loadQuery(1);
                        });
                    }else{
                        tools.toastr( res.smg, '', 'error' );
                    }

	        	});
	        }
    	});
    	
    };
    obj.modifycheckInfo = [
        {
            'name' : 'newPassword',
            'exp'  : '密码不能为空'
        },
        {
            'name' : 'confirmPassword',
            'exp'  : '请确认密码'
        }
    ];
    //弹出修改密码模态框
    obj.modifyPassword = function(id,userName,phone){
    	$("#modifyPassword").modal("show");
    	$("#operatorUsername").html(userName);
//  	$("#operatorPhone").html(phone);
		$("#submitPassword").click(function(){
			var checkPass = true;
    	
	    	//空判断
	        $(obj.modifycheckInfo).each(function( index, item ){
	            if( tools.isNull( $("input[name="+item.name+"]").val() ) ){
	                tools.toastr( item.exp, '', 'error' );
	                checkPass = false;
	                return false;
	            }
	        });
	        //密码确认
	        if($("input[name=newPassword]").val()!=$("input[name=confirmPassword]").val()){
	        	tools.toastr( '两次输入密码不一样', '', 'error' );
	        	checkPass = false;
	            return false;
	        }
	        if(checkPass){
	        	var url = '/system/user/update';
	    		var data = {
	    			'id':id,
	    			'operatorsId':uploadInfo.operatorInfo.id,
	    			'userName':userName,
	    			'phone':phone,
	    			'password':$("input[name=newPassword]").val()
	    		};
	    		http.post(url, data, function( res ){
                    if( res.statusCode == 0 ){
                        swal({
                            title: res.msg,
                            text: "",
                            type: "success"
                        }, function(){
                            $("input[name=newPassword]").val( '' );
                            $("input[name=confirmPassword]").val( '' );

                            $("#modifyPassword").modal("hide");
                        });
                    }else{
                        tools.toastr( res.msg, '', 'error' );
                    }

	        	});
	        }
		})
    };
    obj.lock = function(id){
    	swal({
	        title: "确认锁定吗?",
	        text: "锁定之后可以解锁",
	        type: "warning",
	        showCancelButton: true,
	        confirmButtonColor: "#DD6B55",
	        confirmButtonText: "确认",
	        cancelButtonText: "取消",
	        closeOnConfirm: false
	    }, function () {
	    	var url = '/system/user/status/update';
	    	var data = {
	    		'id':id,
	    		'status':2
	    	}
	    	http.post(url, data, function( res ){
	    		swal({
                    title: res.msg,
                    text: "",
                    type: "success"
                }, function(){
                    operatorUserList.loadQuery(1);
                });
        	});
	        
	    });
    };
    obj.unlock = function(id){
    	swal({
	        title: "确认解锁吗?",
	        type: "warning",
	        showCancelButton: true,
	        confirmButtonColor: "#DD6B55",
	        confirmButtonText: "确认",
	        cancelButtonText: "取消",
	        closeOnConfirm: false
	    }, function () {
	    	var url = '/system/user/status/update';
	    	var data = {
	    		'id':id,
	    		'status':1
	    	}
	    	http.post(url, data, function( res ){
				swal({
                    title: res.msg,
                    text: "",
                    type: "success"
                }, function(){
                    operatorUserList.loadQuery(1);
                });
        	});
	        
	    });
    };
    obj.delect = function(id){
    	swal({
	        title: "确认删除吗?",
	        text: "删除之后不可再恢复！",
	        type: "warning",
	        showCancelButton: true,
	        confirmButtonColor: "#DD6B55",
	        confirmButtonText: "确认",
	        cancelButtonText: "取消",
	        closeOnConfirm: false
	    }, function () {
	    	var url = '/system/user/status/update';
	    	var data = {
	    		'id':id,
	    		'status':3
	    	}
	    	http.post(url, data, function( res ){
				swal({
                    title: res.msg,
                    text: "",
                    type: "success"
                }, function(){
                    operatorUserList.loadQuery(1);
                });
        	});
	    });
    };
    
    return obj;
})();

/**
 * 支付帐号配置
 */
var payConfig = (function(){
    var obj = {};
    obj.id = '';//edit自然主键
    obj.submitForm = function(){

        var payType = $("input[name='serviceMode']:checked").val();

        if( payType == 1 ){
            var checkInfo = [
                {
                    'name' : 'appId',
                    'exp'  : 'APP_ID微信公众号'
                },
                {
                    'name' : 'appSecret',
                    'exp'  : 'APP_SECRET微信公众号密钥'
                },
                {
                    'name' : 'mchId',
                    'exp'  : 'MCH_ID微信支付商户号'
                },
                {
                    'name' : 'mchKey',
                    'exp'  : 'MCH_KEY微信支付商户号密钥'
                }
            ];
        }else if( payType == 2 ){
            var checkInfo = [
                {
                    'name' : 'subMchId',
                    'exp'  : 'MCH_ID微信支付商户号'
                },
            ];
        }
        var checkePass = true;
        $(checkInfo).each(function( index, item ){
            $("#" + item.name).parent().parent().removeClass( 'has-error' );
            if( tools.isNull( $("#" + item.name ).val() ) ){
                tools.toastr( '请填写' + item.exp, '', 'error' );
                $("#" + item.name).parent().parent().addClass( 'has-error' );
                checkePass = false;
                return false;
            }else{
                $("#" + item.name).parent().parent().removeClass( 'has-error' );
            }
        });

        if( checkePass ){

            //console.log( pageStatus.isEdit );
            if( payType == 1 ){
                var data = {
                    //自然主键
                    'id'          : pageStatus.isEdit ? obj.id : '',
                    //运营商ID
                    'operatorsId' : uploadInfo.operatorInfo.id,
                    //微信公众号
                    'appId'       : $("#appId" ).val(),
                    //微信公众号密钥
                    'appSecret'   : $("#appSecret" ).val(),
                    //微信支付商户号
                    'mchId'       : $("#mchId" ).val(),
                    //微信支付商户号密钥
                    'mchKey'      : $("#mchKey" ).val(),
                    //支付类别 1：采用本商户支付 2：服务商代理支付
                    'payType'     : payType
                };
            }else if( payType == 2 ){
                var data = {
                    //自然主键
                    'id'          : pageStatus.isEdit ? obj.id : '',
                    //运营商ID
                    'operatorsId' : uploadInfo.operatorInfo.id,
                    //使用服务商模式支付时的子商户号
                    'subMchId'    : $("#subMchId" ).val(),
                    //支付类别 1：采用本商户支付 2：服务商代理支付
                    'payType'     : payType
                };
            }

            var url = '/operators/saveOrUpdateWxPayCfg';

            http.post( url, data, function( res ){
                if( res.statusCode == 0 ){
                    swal( res.msg || '配置成功', "", "success");
                    obj.configData = data;

                }else{
                    swal( res.msg || '配置失败', "", "error");
                    queryBrand.loadQuery(1);
                }

            });
        }


    };

    /**
     * 支付帐号配置初始化
     */
    obj.setDefault = function( id ){
        var url = '/operators/selectWxPayCfgByOperId';
        var data = {'operatorsId' : parseInt( id )};
        http.post(url, data, function( res ){
            //console.log( res.jbody.OperatorsWxPayCfg );

            if( res.statusCode == 0 ){

                var config = res.jbody.OperatorsWxPayCfg;

                obj.id = config.id;

                $("input[name='serviceMode']").iCheck('update');

                if( config.payType == 1 ){
                    $(".noProvider").show();
                    $(".isProvider").addClass("hide");

                    $("input[name='serviceMode']").eq(0).removeAttr("checked");
                    $("input[name='serviceMode']").eq(1).attr("checked","checked");

                    $("#appId" ).val(     config.appId );
                    $("#appSecret" ).val( config.appSecret );
                    $("#mchId" ).val(     config.mchId );
                    $("#mchKey" ).val(    config.mchKey );

                }else if( config.payType == 2 ){
                    $(".noProvider").hide();
                    $(".isProvider").removeClass("hide");

                    $("input[name='serviceMode']").eq(0).attr("checked","checked");
                    $("input[name='serviceMode']").eq(1).removeAttr("checked");


                    console.log( $("input[name='serviceMode']").eq(0) );

                    $("#subMchId" ).val(   config.subMchId );
                }
                $("input[name='serviceMode']").iCheck('update');

            }else{
                //tools.toastr( res.msg, '', 'warning');
            }


        });

    };

    return obj;
})();

/**
 * 支付宝支付配置
 */
var alipayConfig = (function(){
    var obj = {};

    obj.submitForm = function(){
        var checkePass = true;
        var checkInfo = [
            {
                'id'   : 'alipay_pid',
                'errMsg' : '合作身份(PID)'
            },
            {
                'id'   : 'alipay_appid',
                'errMsg' : 'App ID'
            },
            {
                'id'   : 'alipay_key',
                'errMsg' : '支付宝公钥'
            },
            {
                'id'   : 'alipay_rsa',
                'errMsg' : '商户RSA私钥'
            }
        ];
        if( !tools.checkInputNull( checkInfo ) ){
            checkePass = false;
            return false;
        }

        if( checkePass ){
            var url = '';
            var data = {
                'alipay_pid'   : $("#alipay_pid"  ).val(),
                'alipay_appid' : $("#alipay_appid").val(),
                'alipay_key'   : $("#alipay_key"  ).val(),
                'alipay_rsa'   : $("#alipay_rsa"  ).val()
            };
            http.post( url, data, function( res ){
                if( res.statusCode == 0 ){
                    swal( res.msg, '', 'success' );
                }else{
                    tools.toastr( res.msg, '', 'error' );
                }
            });

        }
    };

    obj.setDefault = function(){

    };

    return obj;
})();

/**
 * 人工转帐帐号配置
 */
var transferConfig = (function(){
    var obj = {};
    obj.fileUrl = '';
    obj.fileName = '';
    obj.fileType = '';
    obj.domNum = 1;
    $(document).ready(function(){
        //上传附件
        $('#fileuploadQR').fileupload({
            dataType: 'json',
            maxFileSize : 1, // 2 MB
            add: function (e, data) {
                //检验图片
                var size = data['files'][0]['size'];
                var type = data['files'][0]['type'];

                //form数据整理
                $("#nameQR").attr('value', 'fileQR');
                $("#prefixQR").attr('value', 'Temp/qrcode');
                $("#fileNameQR").attr('value', '');
                $("#longEdgeQR").attr('value', '200');

                obj.fileName = data['files'][0]['name'];
                obj.fileType = data['files'][0]['type'];

                //console.log( data['files'][0] );

                if( tools.isImage( data['files'][0]['type'], true ) ){
                    if( !tools.checkaddfile(size,type) ){
                        return false;
                    }
                }else{
                    return false;
                }


                $("#progressBarDivQR").show();
                data.submit();
            },
            progress: function (e, data) {
                //上传进度
                var progress = parseInt(data.loaded / data.total * 100, 10);
                //console.log( progress );
                $("#progressBarQR").attr("style", "width:"+progress+"%;");
            },
            done: function (e, data) {
                //console.log( data.result );

                if( data.result.statusCode != 0 ){
                    tools.toastr( '上传 异常', '', 'error' );

                    $("#progressBarQR").attr("style", "width:0%;");
                    $("#progressBarDivQR").hide();
                    return false;
                }

                //data.context.text('Upload finished.');
                $("#progressBarDivQR").hide();
                $("#progressBarQR").attr("style", "width:0%;");

                //展示图片
                obj.fileUrl = data.result.jbody.path;
                $("#addPreviewImagePreviewQR").attr("src", getCookie('card.host.public') + data.result.jbody.path);
                $("#addPreviewImagePreviewQR").show();
            }
        });
    });

    obj.addElement = function(){
        var html = '<div class="hr-line-dashed animated fadeInDown"></div>';
        html += '<div class="form-group animated fadeInDown">';
        html += '   <label class="col-sm-4 control-label">帐号类型</label>';
        html += '   <div class="col-sm-8">';
        html += '       <select class="form-control transfer-title">';
        html += '           <option value="支付宝">支付宝</option>';
        html += '           <option value="微信">微信</option>';
        html += '       </select>';
        html += '   </div>';
        html += '</div>';
        
        html += '<div class="form-group animated fadeInDown">';
        html += '   <label class="col-sm-4 control-label">收款人</label>';
        html += '   <div class="col-sm-8">';
        html += '       <input type="text" placeholder="" class="form-control transfer-name">';
        html += '   </div>';
        html += '</div>';
        
        html += '<div class="form-group animated fadeInDown">';
        html += '   <label class="col-sm-4 control-label">账号</label>';
        html += '   <div class="col-sm-8">';
        html += '       <input type="text" placeholder="" class="form-control transfer-account">';
        html += '   </div>';
        html += '</div>';
        html += '<div class="form-group animated fadeInDown">';
        html += '   <label class="col-sm-4 control-label">账号说明</label>';
        html += '   <div class="col-sm-8">';
        html += '       <textarea type="text" placeholder="" class="form-control transfer-remark"></textarea>';
        html += '   </div>';
        html += '</div>';
        $(html).insertBefore( $("#addNew") );
        obj.domNum ++;
    };

    /**
     * 提交数据
     */
    obj.submitForm = function(){
        var checkInfo = [
            {
                'name' : 'transfer-title',
                'exp'  : '帐号类型'
            },
            {
                'name' : 'transfer-name',
                'exp'  : '收款人'
            },
            {
                'name' : 'transfer-account',
                'exp'  : '账号'
            },
            {
                'name' : 'transfer-remark',
                'exp'  : '账号说明'
            }
        ];
        var checkPass = true;

        var formData = new Array();
        $(checkInfo).each(function( index, item ){
            if( item.name == 'transfer-title' ){//select取值和其它不同
                var multiple = $("." + item.name + " option:selected");
            }
            var multiple = $("." + item.name);

            var data = new Array();
            $(multiple).each(function( i, t ){
                //数据空处理
                $(t).parent().parent().removeClass( 'has-error' );
                if( tools.isNull( $(t).val() ) || $(t).val() == '' ){
                    $(t).parent().parent().addClass( 'has-error' );
                    checkPass = false;
                    return false;
                }
                data.push( $(t).val() );//数据组装
            });
            formData.push( data );//数据组装
        });

        if( obj.fileUrl == '' ){
            tools.toastr( '请上传图片!', '', 'error' );
            checkPass = false;
            return false;
        }

        if( checkPass ){
            var data = [];

            for( var i = 0; i < obj.domNum; i++ ){
                var arr = {
                    'title'   : formData[0][i],
                    'name'   : formData[1][i],
                    'account' : formData[2][i],
                    'remark'  : formData[3][i]
                };
                data.push( arr );
            }

            var postData = {
                //自然主键
                "id"            : uploadInfo.operatorInfo.id || '',
                //运营商名称
                "operatorsName" : uploadInfo.operatorInfo.operatorsName || '',
                //公司名称
                "companyName"   : uploadInfo.operatorInfo.companyName || '',
                //公司地址
                "address"       : uploadInfo.operatorInfo.address || '',
                //联系人
                "contact"       : uploadInfo.operatorInfo.contact || '',
                //联系电话
                "tel"           : uploadInfo.operatorInfo.tel || '',
                //状态 1-正常，2-锁定，3-注销
                "status"        : uploadInfo.operatorInfo.status || 1,
                //运营资质 文件 zip格式，此处保存文件uri
                "credentials"   : uploadInfo.operatorInfo.credentials.split('?')[0] || '',
                //客服电话
                "csTel"         : uploadInfo.operatorInfo.csTel || '',
                //微信二维码
                "wxPublicUrlImg": obj.fileUrl || uploadInfo.operatorInfo.wxPublicUrlImg || '',
                //线下转账帐号
                "tsAccount"     : JSON.stringify( data ),
                //说明
                "description"   : uploadInfo.operatorInfo.description || '',
            };

            var url = '/operators/updateOperators';
            http.post(url, postData, function( res ){
                if( res.statusCode == 0 ){
                    swal( res.msg, '', 'success' );
                }else{
                    tools.toastr( res.msg, '', 'error' );
                }
            });
        }

    };

    /**
     * 人工转帐帐号配置初始化
     * @param tsAccount
     */
    obj.setDefault = function( tsAccount, wxPublicUrlImg ){
        //console.log( JSON.parse(tsAccount) );

        var tsAccount = JSON.parse(tsAccount);

        obj.fileUrl = wxPublicUrlImg;

        $("#addPreviewImagePreviewQR").attr( 'src', getCookie('card.host.public') + wxPublicUrlImg );

        //预生成dom
        $(tsAccount).each(function( index, item ){
            //console.log( item );
            if( index > 0 ){
                obj.addElement();
            }
        });

        //填入数据
        $(tsAccount).each(function( index, item ){
            $(".transfer-title").eq(index).find("option[value='" + item.title + "']").attr("selected",true);
            $(".transfer-name").eq(index).val( item.name );
            $(".transfer-account").eq(index).val( item.account );
            $(".transfer-remark").eq(index).val( item.remark );

        });
    };

    return obj;
})();

//var queryBrand = new queryBrand();
//var queryOperatorBrand = new queryOperatorBrand();

var industry = (function(){
	var obj = {};
	obj.loadData = function(){
		if(tools.industryData){
			$("#industry_1").html("");
			$("#industry_2").html("");
			var pagination = JSON.parse(tools.industryData);
			var html = '<option value="">全部</option>';
			$(pagination['list']).each(function(index, item) {
				html += '<option value='+item.id+'>';
				html += item.industryName;
				html += '</option>';
			});
			$(html).appendTo($("#industry_1"));
			$(html).appendTo($("#industry_2"));
		}else{
			tools.getIndustry(function(){
				obj.loadData();
			});
		}
	}
	return obj;
})();
var area = (function(){
	var obj = {};
	obj.loadData = function(){
		if(tools.areaData){
			var areaInfo = JSON.parse(tools.areaData);
			$("#city_1").citySelect({
				url:areaInfo,
				nodata:"none",
				prov: "",
				city: "",
				dist: "",
				required: false
			});
			$("#city_2").citySelect({
				url:areaInfo,
				nodata:"none",
				prov: "",
				city: "",
				dist: "",
			});
		}else{
			tools.getArea(function(){
				obj.loadData();
			});
		}
	}
	return obj;
})();



$(document).ready(function(){


    if( getCookie('card.maintenance.edit.id') && getCookie('card.maintenance.edit.id') != '' ){
        var operatorId = getCookie('card.maintenance.edit.id');
        pageStatus.isEdit = true;//打开页面编辑项
        removeCookie( 'card.maintenance.edit.id' );
        //console.log( '运营商ID：' + operatorId );
        uploadInfo.setDefault(     operatorId );//基本信息初始化
        payConfig.setDefault(      operatorId );//支付帐号配置初始化

        $(".page-heading h2").html( "编辑运营商" );
    }else{
        $("#title").html( "新增运营商" );
    }

    $("#progressBarDiv").hide();
    $("#progressBarDivQR").hide();

    $("input[name='serviceMode']").iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    //tools.icheckInit();

    //未关联门店搜索
    $("#searchBrand").click(function(){
        queryBrand.loadQuery(1);
    });
    $("#industry_2").change(function(){
		queryBrand.loadQuery(1);
	});
	$("#area_2").change(function(){
		queryBrand.loadQuery(1);
	});
	
	//已关联门店搜索
    $("#searchOperatorBrand").click(function(){
        queryOperatorBrand.loadQuery(1);
    });
    
    $("#industry_1").change(function(){
		queryOperatorBrand.loadQuery(1);
	});
	$("#area_province_1").change(function(){
		queryOperatorBrand.loadQuery(1);
	});
	$("#area_city_1").change(function(){
		queryOperatorBrand.loadQuery(1);
	});
	$("#area_1").change(function(){
		queryOperatorBrand.loadQuery(1);
	});


    //弹出待关联商户列表
    $("#brandStoreLink").click(function(){

        //模态窗关闭刷新已关联数据表
        $('#brand-store-link').on('hidden.bs.modal', function (e) {
            queryOperatorBrand.loadQuery(1);
        });

        //模态窗打开刷新未关联数据表
        $('#brand-store-link').on('shown.bs.modal', function (e) {
            queryBrand.loadQuery(1);
        });

        $('#brand-store-link').modal('show');
    });



    $("input[name='serviceMode']").on('ifChanged',function(){
        var value = $("input[name='serviceMode']:checked").val();
        if( value != undefined ){
            //console.log( value );
            if(value==1){
                $(".noProvider").show();
                $(".isProvider").addClass("hide");
            }else if(value==2){
                $(".noProvider").hide();
                $(".isProvider").removeClass("hide");
            }
        }

    });


});

function addCsTelElement(){

//  $("#csTelArray").html("");
    	var csTelHtml="";
    	csTelHtml +='<div class="hr-line-dashed animated fadeInDown"></div>';
    	csTelHtml +='<div class="form-group"><label class="col-sm-3 control-label">客服姓名</label>';
    	csTelHtml +='<div class="col-sm-5"><input type="text" class="form-control" name="csTel_name" value=""></div>';
    	csTelHtml +='</div>';
    	csTelHtml +='<div class="form-group"><label class="col-sm-3 control-label">客服电话</label>';
    	csTelHtml +='<div class="col-sm-5"><input type="text" class="form-control" name="csTel_phone" value=""></div>';
    	csTelHtml +='</div>'
    	$("#csTelArray").append(csTelHtml);
    
    }
