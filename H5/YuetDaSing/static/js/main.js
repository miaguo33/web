/**
 * Created by caraline on 15/8/7.
 */
define(function(require) {
    var jquery_=require('jquery');
    var page = require('./page');

    var myPage = new page('.page');
    myPage.init();
    //myPage.weixinInit();
    //myPage.eventBind();
});

