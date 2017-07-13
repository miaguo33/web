var pageFunc = (function () {

    var obj = {};

    /**
     * 运营商菜单
     * @type {*[]}
     */
    obj.operator = [
        {
            'name': '通行权益管理',
            'url': '/pages/operator/cardManage/index.html',
            'icon': 'fa fa-credit-card'
        },
        {
            'name': '优惠券管理',
            'url': '/pages/operator/coupon/list.html',
            'icon': 'fa fa-money'
        },
        {
            'name': '折扣管理',
            'url': '/pages/operator/discount/list.html',
            'icon': 'fa fa-dropbox'
        },
        {
            'name': '门票管理',
            'url': '/pages/operator/ticket/list.html',
            'icon': 'fa fa-ticket'
        },
        {
            'name': '渠道管理',
            'url': '/pages/operator/channel/list.html',
            'icon': 'fa fa-joomla'
        },
        {
            'name': '品牌管理',
            'url': '/pages/operator/brandManage/list.html',
            'icon': 'fa fa-trophy'
        }
    ];

    /**
     * 商户菜单
     * @type {*[]}
     */
    obj.merchant = [
        {
            'name': '通行权益管理',
            'url': '/pages/merchant/cardManage/list.html',
            'icon': 'fa fa-th-large'
        }
    ];

    /**
     * 运维菜单
     * @type {*[]}
     */
    obj.maintenance = [
        {
            'name': '运营商管理',
            'url': '/pages/maintenance/operatorManage/list.html',
            'icon': 'fa fa-users'
        },
        {
            'name': '通行权益审核',
            'url': '/pages/maintenance/cardReview/list.html',
            'icon': 'fa fa-tasks'
        },
        {
            'name': '通行权益会员管理',
            'url': '/pages/maintenance/members/list.html',
            'icon': 'fa fa-tasks'
        }
    ];

    /**
     * 面包屑数据
     * @type {*[]}
     */
    obj.breadCrumbsArr = [
        {
            'name' : '通行权益管理',
            'url'  : '/pages/operator/cardManage/index.html',
            'child': [
                {
                    'name' : '通行权益列表',
                    'url'  : '/pages/operator/cardManage/list.html',
                    'child': [
                        {
                            'name' : '新增通行权益',
                            'url'  : '/pages/operator/cardManage/add.html'
                        }
                    ]
                },
                {
                    'name' : '通行权益发放',
                    'url'  : '/pages/operator/cardManage/release.html'
                },
                {
                    'name' : '通行权益实名认证',
                    'url'  : '/pages/operator/cardManage/verify.html'
                },
                {
                    'name' : '通行权益链接管理',
                    'url'  : '/pages/operator/cardManage/link.html'
                },
                {
                    'name' : 'C端界面展示配置',
                    'url'  : '/pages/operator/cardManage/recommend.html'
                },
                {
                    'name' : '通行权益会员管理',
                    'url'  : '/pages/operator/membership/list.html',
                    'child': [
                        {
                            'name' : '通行权益会员详情',
                            'url'  : '/pages/operator/membership/detail.html'
                        }
                    ]
                },
                {
                    'name' : '运营数据',
                    'url'  : '/pages/operator/cardManage/data_operator.html'
                },
                {
                    'name' : '优惠券管理',
                    'url'  : '/pages/operator/coupon/list.html'
                },
                {
                    'name' : '折扣管理',
                    'url'  : '/pages/operator/discount/list.html'
                },
                {
                    'name' : '门票管理',
                    'url'  : '/pages/operator/ticket/list.html'
                },
                {
                    'name' : '渠道管理',
                    'url'  : '/pages/operator/channel/list.html'
                },
                {
		            'name': '品牌管理',
		            'url': '/pages/operator/brandManage/list.html',
		            'child': [
                        {
                            'name' : '编辑',
                            'url'  : '/pages/operator/brandManage/edit.html'
                        }
                    ]
		        }

            ]
        },
        {
            'name' : '运维管理',
            'url'  : '',
            'child': [
                {
                    'name' : '运营商管理',
                    'url'  : '/pages/maintenance/operatorManage/list.html'
                },
                {
                    'name' : '新增运营商',
                    'url'  : '/pages/maintenance/operatorManage/add.html'
                },
                {
                    'name' : '通行权益管理',
                    'url'  : '/pages/maintenance/cardReview/list.html',
                    'child': [
                        {
                            'name' : '通行权益审核',
                            'url'  : '/pages/maintenance/cardReview/review.html'
                        }
                    ]
                },
                {
                    'name' : '通行权益会员管理',
                    'url'  : '/pages/maintenance/members/list.html'
                }
            ]
        }
    ];

    /**
     * 菜单动态修改
     */
    obj.menuInit = function () {
        $("#side-menu").find('li').click(function () {
            if (!$(this).hasClass('active')) {
                $("#side-menu").find('li').removeClass('active');
                $(this).addClass('active');
            }
        });
    };

    /**
     * pjax路由初始化,页面初始化
     */
    obj.pjaxInit = function () {
        //pjax事件绑定
        $(document).pjax('a[data-pjax]', '.pjax-container', {
            maxCacheLength: 0,
            cache: false,
            fragment: ".pjax-container",
            timeout: 8000
        });

        //返回首页方法
        $('.pjax-container').delegate('#goIndex', 'click', function () {
            tools.href('main.html');
        });

        //pjax事件发送
        $(document).on('pjax:send', function () {
            //no login
            if (!getCookie('card.userinfo') || getCookie('card.userinfo') == '') {
                window.location.href = "/index.html";
                return false;
            }
        });
        //pjax事件完成
        $(document).on('pjax:complete', function (xhr, textStatus, options) {

            //点击事件对象,生成面包屑
            if (xhr.relatedTarget) {
                //组装面包屑
                obj.breadCrumbs( $(xhr.relatedTarget).attr('href') );
            }

            //添加loading按钮样式
            $('.ladda-button').attr('data-style', 'zoom-out');
            var l = $('.ladda-button').ladda();

            l.click(function () {
                var that = $(this);
                // Start loading
                that.ladda('start');

                // Timeout
                // Do something in backend and then stop ladda
                setTimeout(function () {
                    //捕获异常，不处理
                    try {
                        that.ladda('stop');
                    } catch (e) {
                        //console.log( e );
                    }

                }, 1000)
            });
        });
    };

    /**
     * 定义首页默认加载页
     */
    obj.firstPage = function () {

        $("#side-menu").html('');

        var menuList;
        switch (JSON.parse(getCookie('card.userinfo')).category) {
            case 1://运维
                menuList = obj.maintenance;
                break;
            case 2://运营商
                menuList = obj.operator;
                break;
            case 3://普通商户
                menuList = obj.merchant;
                break;
            case 8://通行权益用户

                break;
            case 9://游客

                break;
        }

        if (menuList.length > 0) {
            var html = '';
            $(menuList).each(function (index, item) {
                html += '<li>';
                html += '   <a data-pjax href="' + item.url + '">';
                html += '       <i class="' + item.icon + '"></i><span class="nav-label">' + item.name + '</span><span class="fa arrow"></span>';
                html += '   </a>';
                html += '</li>';
            });
            $(html).appendTo($("#side-menu"));
        }

        $("#side-menu>li").each(function (index, item) {
            if (index == 0) {
                $(this).addClass('active');
                tools.href($(this).find('a').attr('href'));
            }
        });
    };

    /**
     * 生成面包屑
     * @param url
     */
    obj.breadCrumbs = function ( url ) {

        var breadCrumbsArr, lv1, lv2, lv3, crumbs=[];

        switch (JSON.parse(getCookie('card.userinfo')).category) {
            case 1://运维
                breadCrumbsArr = obj.breadCrumbsArr[1];
                break;
            case 2://运营商
                breadCrumbsArr = obj.breadCrumbsArr[0];
                break;
            case 3://普通商户
                breadCrumbsArr = [];
                break;
            case 8://通行权益用户

                break;
            case 9://游客

                break;
        }

        if( breadCrumbsArr.child && breadCrumbsArr.child.length > 0 ){
            //平台级
            $( breadCrumbsArr).each(function( i1, t1 ){

                //菜单级
                if( t1.child && t1.child.length > 0 ){
                    lv1 = t1;
                    $(t1.child).each(function( i2, t2 ){
                        if( url == t2.url ){
                            lv2 = t2;
                            return false;
                        }

                        //事件级
                        if( t2.child && t2.child.length > 0 ){
                            lv2 = t2;
                            $(t2.child).each(function( i3, t3 ){
                                if( url == t3.url ){
                                    lv3 = t3;
                                    return false;
                                }
                            });
                        }
                    });
                }
            });
            if( lv1 != undefined ){
                crumbs.push( lv1 );
            }
            if( lv2 != undefined ){
                crumbs.push( lv2 );
            }
            if( lv3 != undefined ){
                crumbs.push( lv3 );
            }

            var html = '<ol class="breadcrumb">';
            $(crumbs).each(function( index, item ){
                var active = '', href = '';
                if( crumbs.length == (index + 1) ){
                    active = 'class="active"';
                }
                if( item.url != '' ){
                    href = 'data-pjax href="' + item.url + '"';
                }else{
                    href= 'href="#"';
                }
                html += '<li ' + active + '> <a ' + href + '>' + item.name + '</a> </li>';

            });
            html += '</ol>';

            if( $(".page-heading h2") ){
                $(".page-heading h2").after( $(html) );
            }
        }
    };

    /**
     * 基本设置等
     */
    obj.settingInit = function () {
        //禁止刷新，利用pjax不需要刷新，可能会导致问题
        //document.onkeydown = function()
        //{
        //    if(event.keyCode==116) {
        //        event.keyCode=0;
        //        event.returnValue = false;
        //    }
        //};

        //屏蔽鼠标右键
        document.oncontextmenu = function () {
            return false;
        };
    };

    /**
     * 退出操作
     */
    obj.logOut = function () {
        $("a[name='logout']").click(function () {

            swal({
                title: "确定退出吗?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "是",
                cancelButtonText: "否",
                closeOnConfirm: false
            }, function () {

                http.post('/system/user/logout', '', function (res) {
                    if (res.statusCode == 0) {
                        removeCookie('presetcode');
                        removeCookie('card.userinfo');

                        setTimeout('window.location.href = "/index.html";', 3000);

                        swal({
                            title: "退出成功",
                            text: "",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonText: "是",
                            closeOnConfirm: false
                        }, function () {
                            window.location.href = "/index.html";
                        });

                    } else {
                        swal(res.msg, '', 'error');
                    }
                });

            });


        });
    };

    /**
     * 定时器监控当前帐号情况
     */
    obj.logOutInterval = function () {

        //no login
        if (!getCookie('card.userinfo') || getCookie('card.userinfo') == '') {
            window.location.href = "/index.html";
            return false;
        }

    };

    /**
     * 初始化文件域名
     */
    obj.getFileHost = function () {
        var url = '/file/host';
        var data = {};
        http.get(url, data, function (res) {
            setCookie('card.host', JSON.stringify(res.jbody.host));
            setCookie('card.host.private', res.jbody.host.private);
            setCookie('card.host.public', res.jbody.host.public);
        });
    };

    return obj;

})();


$(document).ready(function () {

    //未登录，跳转登录页
    if (!getCookie('card.userinfo') || getCookie('card.userinfo') == '') {
        window.location.href = "/index.html";
        return false;
    } else {
        pageFunc.firstPage();
        pageFunc.menuInit();
        pageFunc.pjaxInit();
        pageFunc.settingInit();
        pageFunc.logOut();
        pageFunc.getFileHost();

        $("#userName").html(JSON.parse(getCookie('card.userinfo')).userName);

        //定时器开始 5秒刷新
        //setInterval( 'pageFunc.logOutInterval()', 5000 );
    }

});