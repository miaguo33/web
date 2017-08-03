/**
 * Created by caraline on 15/8/8.
 */
define(function(require,exports,module){
    var $ = require('jquery');
    var easing = require('easing');
    var jweixin_=require('jweixin');
    var store_=require('store_');
    var quicksand=require('quickSand');

    var awardsTpl = require("../../app/awards.html");
    var cardsTpl = require("../../app/cards.html");
    var formTpl = require("../../app/form.html");
    var ruleTpl = require("../../app/rule.html");
    var HelpTpl = require("../../app/help.html");
	var maskTpl =require("../../app/mask.html");
	var popup_1Tpl =require("../../app/popup_1.html");
	var popup_2Tpl =require("../../app/popup_2.html");



    var width=$(window).width();
    var height=$(window).height();
    if(width>=320&&width<360&&height<480) {
        var cardWidth=(width*0.68)/3-1;
    }else{
        var cardWidth=(width*0.82)/3-1;
    }
    function pageAction(container){//对象方法
        this.container=$(container);
        this.activityId = getUrlParam('aid');
        this.url_phone=getUrlParam('phone');

        this.name=getUrlParam('name');
        //设置类型：参数：openType，值：0:alpha用户；1:好友链接
        if(this.url_phone==''){
            this.openType=0;
        }else{
            this.openType=1;
        }
        //分割结束
        this.token = "";

        var oThis=this;
        var responseData = $.ajax({
            url: "/rest/lightApp/config",
            async: false,
            type : "GET",
            dataType : "json",
            data: {"activityId": oThis.activityId, "hitType":oThis.hitType}
        }).responseText;
        responseData=eval("("+responseData+")");
        if(responseData.msg!='操作成功') {
            alert('获取配置数据失败！');
            return false;
        }
        responseData = responseData.data;
        this.merchantId=responseData.merchantId;
        this.token=responseData.token;
    }
    module.exports=pageAction;

	var zhulichance = 0;
    var playchance = 0;
    var cardchoose;
    pageAction.prototype.init=function(){
        //获取url中的参数
        var oThis=this;
        //图片预加载结束后显示页面
        var timeCount=0;
        setInterval(function(){
            timeCount++;
            if(timeCount>=3){
                $('#loadingTips').show();
            }
        },1000);

        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/sky_Back.jpg',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/back-shanghai.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/back-beijing.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/back-taiguo.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/back-jilongpo.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/back-xianggang.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/back-yuenan.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/back-dongjing.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/back-shaba.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/back-shouer.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/start_1.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/start_2.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/rule.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/shanghai.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/beijing.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/taiguo.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/jilongpo.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/xianggang.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/yuenan.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/dongjing.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/shaba.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/shouer.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/again.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/arrow.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/biaoti.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/getHelp.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/help.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/phone_Back.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/phoneBack.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/playSelf.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/return.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/rule_detail.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/rule_result.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/theme.png',function(){});
        loadImage('http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/yun.png',function(){
            $('.loader1').fadeOut();
            $(document).keypress(function(e) {
				if (e.which == 13){
					e.preventDefault();
					$('#phone').blur();
				}
			})


            oThis.myPhone=store.get(oThis.activityId+'myPhone');//本人手机号
//          alert(oThis.myPhone);
            oThis.isRemain=store.get(oThis.activityId+'remainTimes');//已玩次数
            oThis.isHelpedPhone=store.get(oThis.activityId+oThis.url_phone+'isHelped');//助力号码
            if(oThis.openType==0){
                if(oThis.myPhone==undefined){//自己没有玩过
                    oThis.loadCardPage();
                    oThis.loadForms();//加载电话输入
                    oThis.weixinInit()
                }else{//自己玩过
                    oThis.getMyData();
                    oThis.loadCardPage();//加载玩游戏界面
                    oThis.weixinInitHasPhone();
                }
            }else if(oThis.openType==1){
            	if(oThis.myPhone==undefined){
            		oThis.loadHome();
            		oThis.loadHelp();//加载助力页面
                    oThis.weixinInit()
            	}else if(oThis.isHelpedPhone==undefined){
            		oThis.getMyData();
            		oThis.loadHome();
            		oThis.loadHelp();//加载助力页面
            		$('#isRemain').html(oThis.isRemain);
            		oThis.weixinInitHasPhone();
            	}else{
            		oThis.getMyData();
            		oThis.loadCardPage();
            		oThis.weixinInitHasPhone();
            	}
            }
        });
    };

    pageAction.prototype.loadHome=function(){
        $('.page').empty();
    };

    pageAction.prototype.loadHelp=function(){
    	var oThis=this;
        $('.page').append(HelpTpl);
        if(oThis.url_phone==oThis.myPhone){
        	$('#zhuli').hide();
        }
        $('#playSelf').click(function(){
        	if(oThis.myPhone==undefined){
        		oThis.loadForms();//加载电话输入
        	}else{
        		oThis.loadCardPage();
        	}

        })
        $('#zhuli').click(function(){
        	if(oThis.url_phone!==oThis.myPhone&&oThis.isHelpedPhone==undefined){
        		$.ajax({
		            type: 'POST',
		            async:false,
		            url:"/rest/lightApp/data/submit",
		            dataType:'json',
		            data: {
		                'activityId':oThis.activityId,
		                'phone': oThis.url_phone,
		                'param1': 1
		            },
		            success:function(result) {
		            	if(result.msg=='数据提交成功'){
		            		oThis.isHelpedPhone=1;
		            		store.set(oThis.activityId+oThis.url_phone+'isHelped', '1');
		            		alert("助力成功！");
		            	}else{
		            		alert("提交数据失败");
		            	}
		            }
		        });

        	}else if(oThis.url_phone==oThis.myPhone){
        		alert("自己不可以给自己助力呦！");
        	}else{
        		alert("您已经助力过了！");
        	}

        })
    };
    pageAction.prototype.loadCardPage=function(){
        var oThis=this;
        oThis.loadHome();
        $('.page').append(cardsTpl);
        $('.page .card-container .card').css('width',cardWidth);
        $('#rule').bind('click',function(){
            oThis.loadRules();
        });
        oThis.eventBindStart();
        oThis.clickCard();

    };
    pageAction.prototype.eventBindStart=function(){
        var oThis=this;
        var $filterSort = $('#start');
        $filterSort.click(function(e) {
        	if(oThis.isRemain>0){
        		var $applications = $('#card-container');
	        	var $data = $applications.clone();
	            var cardbox = $("#card-container li");
				var clonebox=cardbox.clone();
				var lis = [];
				clonebox.each(function(i){
					var elem = $(this);
					lis.push(elem);
				});
				function rnd(a,b) {
				    return Math.random() > 0.5 ? -1 : 1;
				}
				var newArray = lis.sort(rnd);
				var ul = $('<ul>',{'class':'hidden','id':'nonecard'});
					$.each(newArray,function(){
						$(this).clone().appendTo(ul);
					});
					ul.appendTo('.card-container');
				$('#card-container').quicksand($('#nonecard').find('li'));
				$("#actions").hide();
				$("ul.hidden").remove();
        	}else{
        		if(zhulichance<5){
        			$('.page').append(popup_1Tpl);
        			$filterSort.unbind();
        			$('#pophelp').click(function(){
        				$('.page').append(maskTpl);
        			})
        		}else{
        			$('.page').append(popup_2Tpl);
        			$filterSort.unbind();
        		}
        	}

        })
    };
    pageAction.prototype.clickCard=function(){
    	var oThis=this;
    	$("#card-container li").click(function(){
    		if($("#actions").css('display')=='none'&&oThis.myPhone!==undefined){
    			$("#card-container li").unbind();
    			var this_card=this;
    			cardchoose = $(this_card).data ( "name" )
    			$(this_card).addClass("fliped");
    			var awardResult = oThis.submitResult();
    			setTimeout(function () {
					oThis.getawards(awardResult);
			    }, 800);
    		}
    	})
    };
    pageAction.prototype.getawards=function(e){
    	var oThis=this;
    	$('.page').empty();
    	$('.page').append(awardsTpl);
    	$('#awardTxt').html(""+e);
    	$('#awardImg').attr('src','http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/'+cardchoose+'.png')
    	$('#again').click(function(){
    		if(oThis.isRemain<=0){
    			var zhuliremain = 5-zhulichance;
    			alert('您的机会已经用完，还能邀请'+zhuliremain+'位好友来助力！');
    			return false;
    		}
    		oThis.loadCardPage();
    	});
    	$('#getHelp').click(function(){
    		$('.page').append(maskTpl);
    	});
    }
    pageAction.prototype.loadForms=function(){
    	$('.actions').hide();
        var oThis=this;
        $('.page').append(formTpl);
        oThis.submitPhone()
    };

    pageAction.prototype.submitPhone=function(){
        var oThis=this;
        $('#phoneSubmit').bind('click',function(){
            oThis.myPhone=$('#phone').val();
            oThis.weixinInitHasPhone();
            if( oThis.myPhone==''){
                alert('请输入手机号领奖！');
                return false;
            }
            if(!validatemobile( oThis.myPhone)){
                return false;
            }else {
                store.set(oThis.activityId+'myPhone',oThis.myPhone);
                $('#phonebox').hide();
                $('.actions').show();
                oThis.getMyData();
                $('#isRemain').html(oThis.isRemain)
            }
        })
    };
    //活动规则
    pageAction.prototype.loadRules=function(){
        var oThis=this;
        $('.page').empty();
        $('.page').append(ruleTpl);
        $('#Return').click(function(){
            oThis.loadCardPage();
        })
    };

	//ajax
    pageAction.prototype.submitResult=function(){
        var oThis=this;
        var awardName;
		var responseAwardData = $.ajax({
            url: "/rest/lightApp/award/lottery",
            async: false,
            type : "POST",
            dataType : "json",
            data: {"activityId": oThis.activityId, "token":oThis.token}
        }).responseText;
        var temp = JSON.parse(responseAwardData);

        if(temp.msg!='操作成功'){
            alert('提交数据失败');
            return false
        };
        awardName=temp.data.name;
        if(awardName=='谢谢参与'){

        }else{
        	$.ajax({
	            type: 'POST',
	            url:"/rest/lightApp/award/submit",
	//              async: false,
	            dataType:'json',
	            data: {
	                'activityId':oThis.activityId,
	                'phone':oThis.myPhone,
	                'token':oThis.token,
	                'prizeName':awardName
	            },
	            success:function(result) {
	                if(result.code!=0){
	                    alert('提交数据失败');
	                    return false;
	                }else{

	                }
	            }
	        });
        }


        $.ajax({
            type: 'POST',
//          async:false,
            url:"/rest/lightApp/data/submit",
            dataType:'json',
            data: {
                'activityId':oThis.activityId,
                'phone':  oThis.myPhone,
                'param1': -1,
                'param2': awardName
            },
            success:function(result) {
	            	if(result.msg=='数据提交成功'){

	            		oThis.isRemain = oThis.isRemain-1;
						store.set(oThis.activityId+'remainTimes',oThis.isRemain);
	            	}else{
	            		alert("提交数据失败");
	            	}
            }
        });
		return awardName;
    };
    pageAction.prototype.getMyData=function(){
        var oThis=this;
        oThis.myPhone=store.get(oThis.activityId+'myPhone');
        $.ajax({
            type:'POST',
            async:false,
            url:"/rest/lightApp/data/list",
            dataType:'json',
            data: {'activityId':oThis.activityId, "merchantId":oThis.merchantId,'phone':oThis.myPhone,'limit':10000},
            success:function(result) {
                resultsList=result.data.results;
                console.log(resultsList);
                for(var i=0;i<resultsList.length;i++){
//              	oThis.isRemain = oThis.isRemain+resultsList[i].param1;
                	var isaward = resultsList[i].param2;
                	if(isaward==''){
                		zhulichance =zhulichance+1;
                	}else{
                		playchance = playchance-1;
                	}
                }
                if(zhulichance>5){
                	zhulichance = 5;
                }
                oThis.isRemain = zhulichance+playchance+1;
				store.set(oThis.activityId+'remainTimes',oThis.isRemain);
            }
        });
    };
    pageAction.prototype.weixinInit=function(){
        var oThis=this;
        //share settings
        var timestamp=new Date().getTime();
        timestamp=parseInt(timestamp/1000);
        var nonceStr='Wm3WZYTPz0wzccmW',
            url=location.href.split('#')[0],
            signature='',appId;
        var url=escape(url);
        console.log(url);
        $.ajax({
            type:'GET',
            async:'false',
            url:'http://www.higoin.com/wechat/getWechatConfig.action?merchantId=173&timestamp='+timestamp+'&nonceStr='+nonceStr+'&url='+url,
            dataType:'jsonp',
            data:'',
            jsonp:'callback',
            success:function(result) {
                console.log(result);
                appId=result.appId;
                signature=result.signature;
                jweixin_.config({
                    debug: false,
                    appId:appId,
                    timestamp: timestamp,
                    nonceStr: nonceStr,
                    signature: signature,
                    jsApiList: [
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'translateVoice',
                        'startRecord',
                        'stopRecord',
                        'onRecordEnd',
                        'playVoice',
                        'pauseVoice',
                        'stopVoice',
                        'uploadVoice',
                        'downloadVoice',
                        'chooseImage',
                        'previewImage',
                        'uploadImage',
                        'downloadImage',
                        'getNetworkType',
                        'openLocation',
                        'getLocation',
                        'hideOptionMenu',
                        'showOptionMenu',
                        'closeWindow',
                        'scanQRCode',
                        'chooseWXPay',
                        'openProductSpecificView',
                        'addCard',
                        'chooseCard',
                        'openCard'
                    ]
                });
                jweixin_.ready(function(){
                    var mix_url='http://liveapp.1paiclub.com:80/rest/lightApp/redirect?aid=55594&hitType=2';
                    var shareData = {
                        title: "新航假期 随“新”之旅",
                        desc: "新航假期 随“新”之旅",
                        link: mix_url,
                        imgUrl: 'http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/biaoti.png',
                        success: function (res) {
                        }
                    };
                    jweixin_.onMenuShareAppMessage(shareData);
                    jweixin_.onMenuShareTimeline(shareData);
                    jweixin_.onMenuShareQQ(shareData);
                    jweixin_.onMenuShareWeibo(shareData);
                });
                jweixin_.error(function (res) {
                    alert(res.errMsg);
                });
            }
        });
    }
    pageAction.prototype.weixinInitHasPhone=function(){
        var oThis=this;
        //share settings
        var timestamp=new Date().getTime();
        timestamp=parseInt(timestamp/1000);
        var nonceStr='Wm3WZYTPz0wzccmW',
            url=location.href.split('#')[0],
            signature='',appId;
        var url=escape(url);
        console.log(url);
        $.ajax({
            type:'GET',
            async:'false',
            url:'http://www.higoin.com/wechat/getWechatConfig.action?merchantId=173&timestamp='+timestamp+'&nonceStr='+nonceStr+'&url='+url,
            dataType:'jsonp',
            data:'',
            jsonp:'callback',
            success:function(result) {
                console.log(result);
                appId=result.appId;
                signature=result.signature;
                jweixin_.config({
                    debug: false,
                    appId:appId,
                    timestamp: timestamp,
                    nonceStr: nonceStr,
                    signature: signature,
                    jsApiList: [
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'translateVoice',
                        'startRecord',
                        'stopRecord',
                        'onRecordEnd',
                        'playVoice',
                        'pauseVoice',
                        'stopVoice',
                        'uploadVoice',
                        'downloadVoice',
                        'chooseImage',
                        'previewImage',
                        'uploadImage',
                        'downloadImage',
                        'getNetworkType',
                        'openLocation',
                        'getLocation',
                        'hideOptionMenu',
                        'showOptionMenu',
                        'closeWindow',
                        'scanQRCode',
                        'chooseWXPay',
                        'openProductSpecificView',
                        'addCard',
                        'chooseCard',
                        'openCard'
                    ]
                });
                jweixin_.ready(function(){
                    var mix_url='http://liveapp.1paiclub.com/rest/lightApp/redirect?aid='+oThis.activityId+'&hitType='+oThis.hitType+'&phone='+oThis.myPhone;
                    var shareData = {
                        title: "新航假期 随“新”之旅",
                        desc: "新航假期 随“新”之旅",
                        link: mix_url,
                        imgUrl: 'http://7xs6g8.com1.z0.glb.clouddn.com/YuetDaSin/static/image/biaoti.png',
                        success: function (res) {
                        }
                    };
                    jweixin_.onMenuShareAppMessage(shareData);
                    jweixin_.onMenuShareTimeline(shareData);
                    jweixin_.onMenuShareQQ(shareData);
                    jweixin_.onMenuShareWeibo(shareData);
                });
                jweixin_.error(function (res) {
                    alert(res.errMsg);
                });
            }
        });
    }

    //function validatemobile(mobile)
    function validatemobile(inputString)
    {
        var partten = /^1[3,5,7,8]\d{9}$/;
        if(partten.test(inputString))
        {
            return true;
        }
        else
        {
            alert('请输入正确的手机号码');
            return false;
        }
    }
    //load img
    function loadImage(url, callback)
    {
        var img = new Image(); //创建一个Image对象，实现图片的预下载
        img.src = url;
        if (img.complete)
        { // 如果图片已经存在于浏览器缓存，直接调用回调函数
            callback.call(img);
            return; // 直接返回，不用再处理onload事件
        }
        img.onload = function ()
        { //图片下载完毕时异步调用callback函数。
            callback.call(img);//将回调函数的this替换为Image对象
        };
    }

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null){
            return unescape(r[2]);
        }
        return "";
    }

});
