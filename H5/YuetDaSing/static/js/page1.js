define(function(require,exports,module){
	var $ = require('jquery');
    var easing = require('easing');
    var jweixin_=require('jweixin');
    var store_=require('store_');
    var quicksand=require('quickSand');

	var airplaneTpl = require("../../app/airplane.html");
	var ruleTpl = require("../../app/rule.html");
	var formTpl = require("../../app/form.html");
	var cloudTpl = require("../../app/cloud.html");
	var cardsTpl = require("../../app/cards.html");
	var awardsTpl = require("../../app/awards.html");
	
	var width=$(window).width();
    var height=$(window).height();
    if(width>=320&&width<360&&height<480) {
        var cardWidth=(width*0.68)/3-1;
    }else{
        var cardWidth=(width*0.82)/3-1;
    }
    
    var hasClickPlay=0;
}