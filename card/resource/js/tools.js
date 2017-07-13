/**
 * Created by Administrator on 2017/2/10.
 */

/**
 * 工具类方法
 */
var tools = (function() {

    var object = {};

    object.bytesToSize = function( bytes ) {
        if (bytes === 0) return '0 B';
        var k = 1024, // or 1024
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i];
    }

    /**
     * pjax跳转封装
     * @param url
     */
    object.href = function( url ){
        $.pjax({
            url: url,
            container: '.pjax-container',
            maxCacheLength:0,
            cache: false,
            fragment: ".pjax-container",
            timeout: 8000
        })
    };

    /**
     * 定义首页默认加载页
     */
    object.firstPage = function(){
        $("#side-menu>li").each(function( index, item ){
            if( index == 0 ){
                $(this).addClass('active');
                tools.href( $(this).find('a').attr('href') );
            }
        });
    };
    /**
     * 是否是JSON
     * @param obj
     * @returns {boolean}
     */
    object.isJson = function(obj) {
        if ((typeof (obj) == "object")
            && (Object.prototype.toString.call(obj).toLowerCase() == "[object object]")
            && !obj.length) {
            return true;
        }
        return false;
    }

    /**
     * 是否为空
     * @param string
     * @returns {boolean}
     */
    object.isNull = function(string) {
        if(typeof(string) == 'undefined'){
            return true;
        }
        else{
            if(string == null || string == ""){
                return true;
            }
        }

        return false;
    }

    /**
     * 处理超时重定向
     */
    object.processTimeout = function(response)
    {
        try{
            if (response.indexOf('<script type=\"text/javascript\">') == 0)
            {
                index = response.indexOf("window.location.href='");
                var endIndex = response.indexOf("';", index);
                if (endIndex < 0)
                {
                    endIndex = response.length;
                }
                var redirectUrl = response.substring(index + "window.location.href='".length, endIndex);
                window.location.href = redirectUrl;
                return true;
            }
        }
        catch(e){
            //alert(">>>>>>"+JSON.stringify(response));
        }

        return false;
    };

    /**
     * toastr自定义符合当前系统的提示框
     * @param msg
     * @param title
     * @param type
     * @returns {boolean}
     */
    object.toastr = function( msg, title, type ){

        toastr.options = {
            "closeButton": true,
            "debug": false,
            "progressBar": true,
            "preventDuplicates": false,
            "positionClass": "toast-bottom-center",
            "onclick": null,
            "showDuration": "400",
            "hideDuration": "1000",
            "timeOut": "2000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        switch( type ){
            case 'success':
                toastr.success( msg, title || '提示' );
                break;
            case 'info':
                toastr.info(    msg, title || '提示' );
                break;
            case 'warning':
                toastr.warning( msg, title || '警告');
                break;
            case 'error':
                toastr.error(   msg, title || '错误' );
                break;
            default :
                toastr.success( msg, title || '提示' );
                break;
        }

    };

    /**
     * sweetAlert方法封装
     * @param title
     * @param text
     * @param type  无参、'success'、'warning'、'error'
     * @param successFn
     * @param errorFn
     */
    object.swal = function( title, text, type, successFn, errorFn ){

    };

    /**
     * 页面初始化tooltip
     */
    object.tooltipInit = function(){
        $('[data-toggle="tooltip"]').tooltip({
            'placement':'top'
        });
    };

    /**
     * checkbox样式初始化
     */
    object.icheckInit = function(){
        $('.i-checks').iCheck({
            checkboxClass: 'icheckbox_square-green',
            radioClass: 'iradio_square-green',
        });
    };


    /**
     * 验证图片或表格格式
     * @param size
     * @param type
     * @param limitsize
     * @returns {boolean}
     */
    object.checkaddfile = function(size,type,limitsize){
        //文件大小限制2M
        limitsize = limitsize || 2097152;
        if( size > limitsize ){
            var limitsizeFormat = object.bytesToSize(limitsize);
            tools.toastr( "请上传小于"+limitsizeFormat+"的图片！", "错误信息", "error" );
            return false;
        }
        return true;
    };

    /**
     * 判断是图片
     * @param fileType
     * @param showToastr
     * @returns {boolean}
     */
    object.isImage = function( fileType, showToastr ){
        if(/.(gif|jpg|jpeg|png)$/i.test( fileType )){
            return true;
        }else{
            if( showToastr ){
                tools.toastr('文件格式错误，请选择图片!', '提示', 'error');
            }
        }
        return false;
    };

    /**
     * 判断是文件
     * @param fileType
     * @param showToastr
     * @returns {boolean}
     */
    object.isFile = function( file, showToastr ){
    	
    	 var fileName = file['files'][0]['name'];
         var fileType = file['files'][0]['type'];
         var ldot = fileName.lastIndexOf(".");
         var type = fileName.substring(ldot + 1).toLowerCase();
         
        //if(/.(xls|pdf|doc|docx|zip|rar)$/i.test( fileType )){
        if((/.(x-zip-compressed|rar)$/i.test( fileType ))||type=='zip'){
            return true;
        }else{
            if( showToastr ){
                tools.toastr('文件格式错误，请选择压缩包文件!', '提示', 'error');
            }
        }
        return false;
    };

    /**
     * 判断是EXCEL文件
     * @param fileType
     * @param showToastr
     * @returns {boolean}
     */
    object.isExcel = function( file, showToastr ){

        var fileName = file['files'][0]['name'];
        var fileType = file['files'][0]['type'];
        var ldot = fileName.lastIndexOf(".");
        var type = fileName.substring(ldot + 1).toLowerCase();

        if( /.(xls|excel|sheet)$/i.test( fileType ) ){
            return true;
        }else{
            if( showToastr ){
                tools.toastr('文件格式错误，请选择EXCEL文件!', '提示', 'error');
            }
        }
        return false;
    };

    /**
     * 自定义空判断
     * @param domIdArr JSON  [{"id":"id1","errMsg":"str1"},{"id":"id2","errMsg":"str2"}]
     * @returns {boolean}
     */
    object.checkInputNull = function( domIdArr ){
    	var checkPass = true;
        $(domIdArr).each(function( index, item ){
            $("#" + item.id).parent().parent().removeClass( 'has-error' );
            if( tools.isNull( $("#" + item.id ).val() ) ){
                console.log( item.id );
                tools.toastr( '请填写' + item.errMsg, '', 'error' );
                $("#" + item.id).parent().parent().addClass( 'has-error' );
                checkPass =  false;
                return false;
            }else{
                $("#" + item.id).parent().parent().removeClass( 'has-error' );
            }
        });
        return checkPass;
    };

    /**
     * 判断是否为数组类型
     * @param obj
     * @returns {boolean}
     */
    object.isArray = function( obj ){
        return (typeof obj == 'object') && obj.constructor == Array;
    };

    /**
     * 判断是否为字符串类型
     * @param str
     * @returns {boolean}
     */
    object.isString = function(str){
        return (typeof str == 'string') && str.constructor == String;
    };

    /**
     * 判断是否为数值类型
     */
    object.isNumber = function(obj){
        return (typeof obj == 'number') && obj.constructor == Number;
    };

    /**
     * 判断是否为日期类型
     */
    object.isDate = function(obj){
        return (typeof obj == 'object') && obj.constructor == Date;
    };

    /**
     * 判断是否为函数
     */
    object.isFunction = function(obj){
        return (typeof obj == 'function') && obj.constructor == Function;
    };

    /**
     * 判断是否为对象
     */
    object.isObject = function(obj){
        return (typeof obj == 'object') && obj.constructor == Object;
    };

    /**
     * 时间戳指定返回
     * @param timestamp
     * @param format
     * @returns {boolean}
     */
    object.getFormatTime = function( timestamp, format ){
        var data = new Date();
        data.setTime( parseInt(timestamp) );

        switch( format ){
            case 'yyyy-MM-dd':
                return data.format('yyyy-MM-dd');
                break;
            case 'yyyy-MM-dd hh:mm':
                return data.format('yyyy-MM-dd hh:mm');
                break;
            case 'yyyy-MM-dd hh:mm:ss':
                return data.format('yyyy-MM-dd hh:mm:ss');
                break;
        }
        return false;
    };
    
    //  获取所有区域
	object.areaData = '';

    object.getArea = function(successCallBack){
        object.areaData = JSON.stringify( citys );
        if( typeof successCallBack == 'function') {
            successCallBack();
        }
    };
    
    //  获取所有业态
    object.industryData = '';
    
    object.getIndustry = function(successCallBack){
    	http.post( '/industry/selectIndustry', {
			'searchText':'',
			'pageSize':100000,
			'pageNum':1
		}, function (jsonResponse) {
			object.industryData =  JSON.stringify(jsonResponse['jbody']['pageInfo']); 
			if( typeof successCallBack == 'function') {
                successCallBack();
            }
	    });
    };
    
    /**
     * 查看可使用门店modal
     * @param content
     */
    object.merchantView = function( content ){
        //新增/编辑通行权益查看，关闭后需要打开原有模态窗
        var modalId = '';
        if( $("#modalShow_1").css("display")=='block' ){
            modalId = 'modalShow_1';
        }else if( $("#modalShow_2").css("display")=='block' ){
            modalId = 'modalShow_2';
        }else if( $("#modalShow_3").css("display")=='block' ){
            modalId = 'modalShow_3';
        }
        $("#" + modalId).modal('hide');
        if( modalId != '' ){
            //打开之前的弹框
            $('#merchantView').on('hidden.bs.modal', function (e) {
                $("#" + modalId).modal('show');
                $('#merchantView').unbind('hidden.bs.modal')
            });
        }
        //组装表格数据
        var html = '';
        if( content && object.isString( content ) ){
            //如果是String，从String中拆分成数组
            var separator = '';
            var spearatorArr = ['<br>', ',', '、', ';'];//分隔符判断
            $(spearatorArr).each(function( index, item ){
                if( content.indexOf( item ) > -1 ){
                    separator = item;
                    return false;
                }
            });
            if( separator != '' ){
                content = content.split( separator );//拆分成数组
                $(content).each(function( index, item ){
                    if( item != '' ){
                        html += '<tr class="animated fadeIn">';
                        html += '   <td style="text-align: center;">' + item + '</td>';
                        html += '</tr>';
                    }
                });
            }else{
            	html += '<tr class="animated fadeIn">';
                html += '   <td style="text-align: center;">' + content + '</td>';
                html += '</tr>';
            }
        }else if( content && object.isArray( content ) ){
            $(content).each(function( index, item ){
                if( item != '' ){
                    html += '<tr class="animated fadeIn">';
                    html += '   <td>' + item + '</td>';
                    html += '</tr>';
                }
            });
        }else{
            html += '<tr class="animated fadeIn">';
            html += '   <td>' + item + '</td>';
            html += '</tr>';
        }
        var htmlDiv = '';
        htmlDiv += '<style>.footable-odd{background-color:transparent;}</style>';
        htmlDiv += '       <input type="text" class="form-control input-sm m-b-xs" id="filter" placeholder="搜索">';
        htmlDiv += '       <table class="footable table table-hover" data-page-size="10" data-filter=#filter>';
        htmlDiv += '           <thead><tr><th style="text-align: center;">商户名</th></tr></thead>';
        htmlDiv += '           <tbody id="merchantViewData">';
        htmlDiv += html;
        htmlDiv += '           </tbody>';
        htmlDiv += '            <tfoot><tr><td><ul class="pagination pull-right"></ul></td></tr></tfoot>';
        htmlDiv += '        </table>';
        var modalBody = $("#merchantViewBody");
        $(modalBody).html( '' );
        $(htmlDiv).appendTo( $(modalBody) );
        $('.footable').footable();
        $("#merchantView").modal('show');
    };
    return object;
})();

//扩展 jQuery剪贴板事件
$.fn.pasteEvents = function( delay ) {
    if (delay == undefined) delay = 20;
    return $(this).each(function() {
        var $el = $(this);
        $el.on("paste", function() {
            $el.trigger("prepaste");
            setTimeout(function() {
                $el.trigger("postpaste");
            }, delay);
        });
    });
};

// 扩展jQuery自动截取文本长度
$.fn.trimTextLength = function( attr ) {
    var attr = attr || 'data-length';
    $(this).find('[' + attr + ']').each(function() {
        var text = $(this).text(), len = $(this).attr(attr);
        if(text && text.length > len) {
            $(this).attr('title', text);
            $(this).text(text.substring(0, len) + '...');
        }
    });
};

// string扩展
String.prototype.endWith = function(str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length) {
        return false;
    }
    if (this.substring(this.length - str.length) == str) {
        return true;
    } else {
        return false;
    }
    return true;
};

String.prototype.startWith = function(str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length) {
        return false;
    }
    if (this.substr(0, str.length) == str) {
        return true;
    } else {
        return false;
    }

    return true;
};

String.prototype.replaceAll = function(s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
};

String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

String.prototype.ltrim = function() {
    return this.replace(/(^\s*)/g, "");
};

String.prototype.rtrim = function() {
    return this.replace(/(\s*$)/g, "");
};


/** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
 Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 *
 * var timestamp3 = 1403058804;
 * var newDate = new Date();
 * newDate.setTime(timestamp3 * 1000);
 */
Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};

/**
 * 数组扩展
 * 当前index位置和前一内容交换
 * @param index
 */
Array.prototype.switchBefore = function( index ){

    if( index >= 1 ){
        var temp = this[index];
        this.splice( index , 1 );
        this.splice( index - 1 , 0, temp );
    }
    return this;
};

/**
 * 数组扩展
 * 当前index位置和后一内容交换
 * @param index
 */
Array.prototype.switchAfter = function( index ){
    if( index >= 0 && index < ( this.length ) ){
        var temp = this[index];
        this.splice( index , 1 );
        this.splice( index + 1 , 0, temp );
    }
    return this;
};