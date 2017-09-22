var tools = (function() {

	var object = {};
	object.init = function(){
		$( '.btn-w-m.btn-danger' ).ladda( 'bind', { timeout: 1000 } );
	}
	//  模态框居中
	object.centerModals = function() {　　
		$('.modal').each(function(i) {
			$(this).css('display', 'block');　　　　
			var top = Math.round(($(this).height() - $(this).find('.modal-content').height()) / 2);　　　　
			top = top > 0 ? top : 0;　　　　
			$(this).find('.modal-content').css("margin-top", top);
			$(this).css('display', 'none');　
		});
	}

	//  红框多选和单选
	object.redTriangleFrame = function() {　
		var redTriangleFrame = $(".red-triangle-frame");
		redTriangleFrame.each(function() {
			$(this).find("label input").each(function() {
				if($(this).is(':checked')) {
					$(this).parent().addClass("active");
				}
			});
			$(this).find("label input").change(function() {
				if($(this).is(':checked')) {
					var btn = $(this).parent();
					$(btn).addClass("active");
					if($(btn).hasClass("no-fit")){
						$(btn).siblings(".active").each(function(){
							$(this).find("input").removeAttr("checked");
							$(this).removeClass("active");
						})
					}else{
						$(btn).siblings(".no-fit").find("input").removeAttr("checked");
						$(btn).siblings(".no-fit").removeClass("active");
					}
					if($(this).attr("type") == "radio") {
						$(this).parent().siblings().removeClass("active");
					}
				} else {
					$(this).parent().removeClass("active");
				}
			})
		})
	}
	
	
	//  textarea框随内容展开
	object.textArea = function() {
		$("textarea").each(function() {
			$(this).on("propertychange", function() {
				var height = this.scrollHeight;
				$(this).css("height", height + 'px');
			});
			$("textarea").on("input", function() {
				var height = this.scrollHeight;
				$(this).css("height", height + 'px');
			});
		});
	}
	
	//  不符合时填写更多信息
	object.moreEvaluate = function(e) {
		var moreEvaluateBtn = $(e).parent();
		var moreEvaluate = $(moreEvaluateBtn).closest("tr").next('.more-evaluate').find(".action");
		if($(moreEvaluateBtn).hasClass("bad")){
			$(moreEvaluate).slideDown();
		}else{
			$(moreEvaluate).slideUp();
		}
	}
	
	//	认证评价
	object.evaluate = function() {
		$(".evaluate input").each(function() {
			if($(this).is(':checked')) {
				$(this).parent().addClass("active");
				object.moreEvaluate($(this));
			}
			$(this).change(function(){
				object.moreEvaluate($(this));
			})
		});
	}
	
	//	弹窗提示
	object.prop= function( type , msg , title , action ){
		switch( type ){
            case 'success':
                var html = '<div class="modal fade prop" id="prop-success" tabindex="-1" role="dialog" aria-hidden="true">';
					html +='	<div class="modal-dialog">';
					html +='		<div class="modal-content">';
					html +='			<div class="modal-header">';
					html +='				<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
					html +='				<h4>'+title+'</h4>';
					html +='			</div>';
					html +='			<div class="modal-body">';
					html +='				<div class="success">';
					html +='					<span><i class="iconfont icon-shenqingchenggong"></i></span>';
					html +='					<p class="m-t-sm">'+msg+'</p>';
					html +=action;
					html +='				</div>';
					html +='			</div>';
					html +='		</div>';
					html +='	</div>';
					html +='</div>';
				$("body").append(html);
				object.centerModals();
				$('#prop-success').modal('show');
				$('#prop-success').on('hidden.bs.modal', function () {
				  	$('#prop-success').remove();
				});
                break;
            case 'info':
                 var html = '<div class="modal fade prop" id="prop-info" tabindex="-1" role="dialog" aria-hidden="true">';
					html +='	<div class="modal-dialog">';
					html +='		<div class="modal-content">';
					html +='			<div class="modal-header">';
					html +='				<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
					html +='				<h4>'+title+'</h4>';
					html +='			</div>';
					html +='			<div class="modal-body">';
					html +='				<div class="info">';
					html +='					<p class="m-t-xl">'+msg+'</p>';
					html +=action;
					html +='				</div>';
					html +='			</div>';
					html +='		</div>';
					html +='	</div>';
					html +='</div>';
				$("body").append(html);
				object.centerModals();
				$('#prop-info').modal('show');
				$('#prop-info').on('hidden.bs.modal', function () {
				  	$('#prop-info').remove();
				});
                break;
        }
	}
//	时间戳指定返回
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

	return object;
})();

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

$(document).ready(function(){
	tools.init();
})
