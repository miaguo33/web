var queryselectCoupon = function() {
	var obj = {};
	var pageBar = $("#pageBar");
	var tableBody = $("#dataList");
	var queryPageUtil = new PageUtils(pageBar, tableBody);
	obj.status = '';
	obj.data = [];
	obj.loadQuery = function(page, removeIfEmpty) {
		queryPageUtil.loadPage(page, '/coupon/selectCoupon', {
				'status' : obj.status,
				'operatorsId': operatorsId,
				'searchText': $("#searchText").val(),
			},
			function(jsonResponse) {
				var pagination = jsonResponse['jbody']['pageInfo'];
				//tableBody.html('');
				if(!pagination['list'] || pagination['list'].length == 0) {
					//tools.toastr("无符合的搜索内容", "提示信息", 'warning');
					return;
				};
				obj.data = pagination['list'];
				var status = {
			        '1' : '有效',
			        '2' : '失效',
			        '3' : '删除',
			        '4' : '过期'
				};
				
				var applySceneArray = {
					"all": "全部",
					"1": "会员卡在线支付",
					"2": "序列号直接消券"
				};
				
					//pagination['list'].reverse();
				$(pagination['list']).each(function(index, item) {
					var html = '<tr>';
					html += '<td>' + item.couponName + '</td>';
					html += '<td>' + item.couponAliasName + '</td>';
					if(item.discountType==1){
						if(item.maxDiscount==item.discountValue){
							html += '<td>' + item.discountValue/100.0+'元抵扣(消费满'+item.minimum/100.0+'元使用';
						}else{
							html += '<td>' + item.discountValue/100.0+'元抵扣(消费每满'+item.minimum/100.0+'元使用';
						}
					}else{
						html += '<td>' + item.discountValue/10.0+'折(消费满'+item.minimum/100.0+'元使用';
					}
					
					
					if(item.maxDiscount!=-1&&item.maxDiscount!=item.discountValue){
						html += ',最高抵扣'+item.maxDiscount/100.0+'元';
					};
					
					html += ')</td>';
					html += '<td style="word-break: break-all;">';
					var extendData = '';
					var extendData2 = '';
					if(item.extendData.length > 0) {
						for(i = 0; i < item.extendData.length; i++) {
							extendData = extendData + item.extendData[i].merchantName + '<br>';
							extendData2 = extendData2 + item.extendData[i].id+'&'+item.extendData[i].merchantName + '<br>';
						}
						//html += extendData;
						html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="查看可用门店" onclick="tools.merchantView(\'' + extendData + '\')">';
						html += '		<i class="fa fa-eye"></i>';
						html += '   </a>';
					}else{
						html += '<span style="color:red;margin-left:9px;">—</span>';
					}
					html += '</td>';
					if(!item.permanent){
						if(item.period){
							html += '<td>' + item.period + '天</td>';
						}else if(item.beginDate||item.endDate){
							var beginDate = new Date(item.beginDate).format("yyyy.MM.dd");
							var endDate = new Date(item.endDate).format("yyyy.MM.dd");
							html += '<td>' + beginDate + '-'+ endDate+'</td>';
						}else{
							html += '<td></td>';
						}
					}else{
						html += '<td>永久有效</td>';
					}
					
					if(item.discountType==1){
						if(item.maxDiscount==item.discountValue){
							html += '<td>满减</td>';
						}else{
							html += '<td>每满减</td>';
						}
					}else{
						html += '<td>打折</td>';
					}
					
					html += '<td>' + applySceneArray[item.applyScene] + '</td>';
//					html += '<td>' + status[item.status] + '</td>';
					html += '<td  style="word-break: break-all;">';
						if( item.notice ){
							html +=  item.notice;
						}
					html += '</td>';
					
					html += '<td style="word-break: break-all;">';
					if(item.extendData.length>0){
						html += '   <a class="icon-only text-warning" data-toggle="modal" title="删除可用门店" onclick="merchantDelView(\'' + extendData2 + '\')">';
						html += '		<i class="fa fa-unlink"></i>';
						html += '   </a>';
					}else{
						html +='<span style="margin-left:9px;">—</span>';
					}
					html += '</td>'; // 删除关联门店
					
					html += '<td>';
					html += '   <a class="icon-only text-warning" data-toggle="modal" href="./operator/coupon/add.html" data-target="#coupon-add" onclick="couponLinkmerchant(' + item.id + ')">';
					html += '		<i class="fa fa-link"></i>';
					html += '   </a>';
					html += '</td>';
					
					html += '<td>';
					html += '   <a class="icon-only coupon-details" data-toggle="modal" href="./operator/coupon/add.html" data-target="#coupon-add" onclick="editcoupon('+index+')" title="编辑">';
					html += '		<i class="fa fa-edit"></i>';
					html += '   </a>';
//					html += '   <a class="icon-only text-warning" data-toggle="tooltip" title="下线">';
//					html += '		<i class="fa fa-cloud-download" data-toggle="modal" data-target="#modalShow"></i>';
//					html += '   </a>';
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
	 *
	 * @param status
	 */
	obj.statusSwitch = function( status ){
		obj.status = status;
		obj.loadQuery(1);
	};
	
	return obj;
}();

function editcoupon(id){
	var dataInfo = queryselectCoupon.data[id];
	editProjectsmodal($("#coupon-add"),function(){
		$("input[name='couponName']").val(dataInfo.couponName).attr("readonly","readonly");
		$("input[name='couponAliasName']").val(dataInfo.couponAliasName).attr("readonly","readonly");
		$("input[name='allCnt']").val(dataInfo.allCnt).attr("readonly","readonly");
		if(dataInfo.permanent){
			$("#timerange-type").val("2");
			$("#timerange-type").trigger("change");
		}else if(dataInfo.period){
			$("#timerange-type").val("1");
			$("#timerange-type").trigger("change");
			$("input[name='period']").val(dataInfo.period);
		}else if(dataInfo.beginDate&&dataInfo.endDate){
			$("#timerange-type").val("0");
			$("#timerange-type").trigger("change");
			$("input[name='start']").val(new Date(dataInfo.beginDate).format("yyyy-MM-dd"));
			$("input[name='end']").val(new Date(dataInfo.endDate).format("yyyy-MM-dd"));
		};
		
		
		$("input[name='discountType']").iCheck("disable");
		if(dataInfo.discountType==2){
			$("input[name='discountType'][value=2]").iCheck('check'); 
			$(".discountValueShow1").hide();
			$(".discountValueShow2").show();
			$("#maxDiscount").show();
			$(".discountValueShow4").hide();
			$("input[name='discountValue2']").val(dataInfo.discountValue).attr("readonly","readonly");
		}else if(dataInfo.discountType==1){
			if(dataInfo.discountValue==dataInfo.maxDiscount){
				$("input[name='discountType'][value=3]").iCheck('check');
				$("#maxDiscount").hide();
				$(".discountValueShow4").hide();
			}else{
				$("input[name='discountType'][value=4]").iCheck('check');
				$("#maxDiscount").show();
				$(".discountValueShow4").show();
			}
			$(".discountValueShow2").hide();
			$(".discountValueShow1").show();
			$("input[name='discountValue1']").val(dataInfo.discountValue/100).attr("readonly","readonly");
		};
		
		
		$("input[name='minimum']").val(dataInfo.minimum/100).attr("readonly","readonly");
		if(dataInfo.maxDiscount>0){
			$("input[name='maxDiscount']").val(dataInfo.maxDiscount/100);
		}
		$("input[name='maxDiscount']").attr("readonly","readonly");
		$("#checkAllapplyScene").iCheck('disable');
		$("input[name='applyScene']").iCheck("disable");
		if(dataInfo.applyScene=='all'){
			
		}else{
			$("input[name='applyScene']").iCheck("uncheck");
			$("#checkAllapplyScene").iCheck('uncheck');
			var applySceneArry = dataInfo.applyScene.split(",");
			for(i=0;i<applySceneArry.length;i++){
				$("input[name='applyScene'][value="+applySceneArry[i]+"]").iCheck('check');
			}
		};
		$("#description").val(dataInfo.notice);
	},
	function(){
		var timetype = $("#timerange-type").val();
		var permanent = false;
		var beginDate, endDate, period;
		if(timetype == 0) {
			beginDate = $("#start").val();
			endDate = $("#end").val();
			if(!beginDate){
				tools.toastr( '请填写开始时间', '', 'error' );
                return false;
			}
			if(!endDate){
				tools.toastr( '请填写结束时间', '', 'error' );
				return false;
			}
		} else if(timetype==1){
			period = $("input[name='period']").val();
			if(!period){
				tools.toastr( '请填写时间段', '', 'error' );
				return false;
			}
		}else{
			permanent = true;
		};
		var description = $('#description').val();
		var url = '/coupon/updateCoupon';
		var data = {
			'ID': dataInfo.id,
			'permanent': permanent,
			'beginDate': beginDate,
			'endDate': endDate,
			'period': period,
			'notice': description,
		};
		http.post(url, data, function(jsonResponse) {
			couponId = jsonResponse.jbody.Coupon.id;
		}, null, false);
		if(couponId || couponId == 0) {
			return true;
		}
	},
	function(){
		queryselectCoupon.loadQuery(1);
	});
};



function couponLinkmerchant(couponId) {
	addProjectsmodal($("#coupon-add"), 1, null,
	function(){
		linkMerchants.submitMerchants('couponId',couponId,'/coupon/insertCouponScenic',$(".modal-body #dataList_1"));
	},
	function(merchantId,merchantName){
		linkMerchants.submitMerchantsSingle('couponId',couponId,'/coupon/insertCouponScenic', merchantId, merchantName);
	},
	function(){
		queryselectCoupon.loadQuery(1);
	});
}




$(document).ready(function() {
	var userinfo = JSON.parse(getCookie('card.userinfo'));
	operatorsId = userinfo.operatorsId;
	$("#couponAdd").click(function() {
		var couponId;
		addProjectsmodal($("#coupon-add"), 0, function() {
				var couponName = $("input[name='couponName']").val();
				var couponAliasName = $("input[name='couponAliasName']").val();
				var couponPitUrl = '';
				//抵扣、折扣状态切换
				var discountValue,maxDiscount;
				var discountType = $("input[name='discountType']:checked").val();
				if(discountType==2){
					discountValue = $("input[name='discountValue2']").val();
					maxDiscount =  $("input[name='maxDiscount']").val()*100||-1;
				}else if(discountType==3||discountType==4){
					discountValue = $("input[name='discountValue1']").val()*100;
					if(discountType==3){
						maxDiscount =  discountValue;
					}else if(discountType==4){
						maxDiscount =  $("input[name='maxDiscount']").val()*100||-1;
					};
					discountType = 1;
				}
				
				var applyScene='';
				if($('#checkAllapplyScene').is(':checked')) {
					applyScene = $('#checkAllapplyScene').val();
				}else{
					$('input[name="applyScene"]:checked').each(function(){ 
						if(!applyScene){
							applyScene=$(this).val();
						}else{
							applyScene += (","+$(this).val());
						}
					}); 
				}
				if(!applyScene){
					tools.toastr( '请选择适用场景', '', 'error' );
	                return false;
				}
				
				var timetype = $("#timerange-type").val();
				var permanent = false;
				var beginDate, endDate, period;
				if(timetype == 0) {
					beginDate = $("#start").val();
					endDate = $("#end").val();
					if(!beginDate){
						tools.toastr( '请填写开始时间', '', 'error' );
		                return false;
					}
					if(!endDate){
						tools.toastr( '请填写结束时间', '', 'error' );
						return false;
					}
				} else if(timetype==1){
					period = $("input[name='period']").val();
					if(!period){
						tools.toastr( '请填写时间段', '', 'error' );
						return false;
					}
				}else{
					permanent = true;
				};
				
				var minimum = $("input[name='minimum']").val()*100||0;
				var allCnt = $("input[name='allCnt']").val();
				var description = $('#description').val();
				var url = '/coupon/insertCoupon';
				var data = {
					'operatorsId': operatorsId,
					'couponName': couponName,
					'couponAliasName': couponAliasName,
					'couponPitUrl':couponPitUrl,
					'discountValue': discountValue,
					'permanent': permanent,
					'beginDate': beginDate,
					'endDate': endDate,
					'period': period,
					'allCnt':allCnt,
					'minimum': minimum,
					'maxDiscount': maxDiscount,
					'notice': description,
					'discountType': discountType,
					'status': 1,
					'applyScene': applyScene
				};
				http.post(url, data, function(jsonResponse) {
					couponId = jsonResponse.jbody.Coupon.id;
				}, null, false);
				if(couponId || couponId == 0) {
					return true;
				}
			},
			function(){
				linkMerchants.submitMerchants('couponId',couponId,'/coupon/insertCouponScenic',$(".modal-body #dataList_1"));
			},
			function(merchantId,merchantName){
				linkMerchants.submitMerchantsSingle('couponId',couponId,'/coupon/insertCouponScenic', merchantId, merchantName);
			},
			function(){
				queryselectCoupon.loadQuery(1);
			});
	});
	queryselectCoupon.loadQuery(1);
	$("#searchBtn").click(function(){
		queryselectCoupon.loadQuery(1);
	})
});


/**
 * 删除可使用门店modal
 * @param content
 * @param type 类型
 */
 function merchantDelView( content ){
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
    //如果是String，从String中拆分成数组
    var separator = '';
    var spearatorArr = ['<br>'];//分隔符判断
    $(spearatorArr).each(function( index, item ){
        if( content.indexOf( item ) > -1 ){
            separator = item;
            return false;
        }
    });
    content = content.split( separator );//拆分成数组
    $(content).each(function(index, item){
        if( item != '' ){
        	var itemInfo = item.split('&');
            html += '<tr class="animated fadeIn">';
            html += ' <td style="text-align: left;">';
            html += ' <span style="width:20px" id="spn_'+itemInfo[0]+'">';
			html += '   <a class="icon-only text-warning" data-toggle="modal" title="删除关联门店【'+itemInfo[1]+'】" onclick="delMerchantById(' + itemInfo[0] + ')">';
			html += '		<i class="fa fa-unlink"></i>';
			html += '   </a>';
			html += ' </span>';
            html += '<span> '+itemInfo[1] + ' </span></td>';
            html += '</tr>';
        }
    });
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

function delMerchantById(id){
	var url = '/coupon/deleteCouponScenicById';
	var data = {"id":id}
    http.post(url, data, function( res ){
        if( res.statusCode == 0 ){
            $("#spn_"+id).html("已删除");
            $("#spn_"+id).css("color","red");
            queryselectCoupon.loadQuery(1);
        }else{
            swal( '操作失败请重试', '', 'error' );
        }
    });
	
}

