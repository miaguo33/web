var queryselectDiscount = function() {
	var obj = {};
	var pageBar = $("#pageBar");
	var tableBody = $("#dataList");
	var queryPageUtil = new PageUtils(pageBar, tableBody);
	obj.status = '';
	obj.data = [];
	obj.loadQuery = function(page, removeIfEmpty) {
		queryPageUtil.loadPage(page, '/discount/selectDiscount', {
				'status'    : obj.status,
				'operatorsId': operatorsId,
				'searchText': $("#searchText").val(),
			},
			function(jsonResponse) {
				var pagination = jsonResponse['jbody']['pageInfo'];
				if(!pagination['list'] || pagination['list'].length == 0) {
					return;
				};
				obj.data = pagination['list'];
				var status={
				        '1' : '有效',
				        '2' : '失效',
				        '3' : '删除',
				        '4' : '过期'
				};
				$(pagination['list']).each(function(index, item) {
					var html = '<tr>';
					html += '<td>'+item.discountName+'</td>'; // 折扣名称
					html += '<td>'+item.discountAliasName+'</td>'; // 折扣别名
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
					}
					html += ')</td>'; // 折扣详情
					html += '<td style="word-break: break-all;">';
					var extendData = '';
					var extendData2 = '';
					if(item.extendData.length>0){
						for(i=0;i<item.extendData.length;i++){
							extendData = extendData + item.extendData[i].merchantName + '<br>';
							extendData2 = extendData2 + item.extendData[i].id+'&'+item.extendData[i].merchantName + '<br>';
						}
						html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="查看可用门店" onclick="tools.merchantView(\'' + extendData + '\')">';
						html += '		<i class="fa fa-eye"></i>';
						html += '   </a>';
					}else{
						html += '<span style="color:red;margin-left:9px;">—</span>';
					}
					html += '</td>'; // 查看关联门店
					
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
					};
					html += '<td style="word-break: break-all;">';
						if( item.description ){
							html += item.description;
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
					html += '   <a class="icon-only text-warning" data-toggle="modal" title="新增关联门店"  href="./operator/discount/add.html" data-target="#discount-add" onclick="discountLinkmerchant('+item.id+')">';
					html += '		<i class="fa fa-link"></i>';
					html += '   </a>';
					html += '</td>'; // 新增关联门店
					
					html += '<td>';
					html += '   <a class="icon-only discount-details" data-toggle="modal" href="./operator/discount/add.html" data-target="#discount-add" onclick="editdiscount('+index+')" title="编辑">';
					html += '		<i class="fa fa-edit"></i>';
					html += '   </a>';
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

function editdiscount(id){
	var dataInfo = queryselectDiscount.data[id];
	editProjectsmodal($("#discount-add"),function(){
		$("input[name='discountName']").val(dataInfo.discountName).attr("readonly","readonly");
		$("input[name='discountAliasName']").val(dataInfo.discountAliasName).attr("readonly","readonly");
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
		$("#description").val(dataInfo.description);
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
		var url = '/discount/updateDiscount';
		var data = {
			'id': dataInfo.id,
			'permanent': permanent,
			'beginDate': beginDate,
			'endDate': endDate,
			'period': period,
			'description': description,
		};
		http.post(url, data, function(jsonResponse) {
			discountId = jsonResponse.jbody.Discount.id;
        },null,false);
        if(discountId||discountId==0){
        	return true;
        }
	},
	function(){
		queryselectDiscount.loadQuery(1);
	});
};

function discountLinkmerchant(discountId){
	addProjectsmodal($("#discount-add"),1,null,
	function(){
		linkMerchants.submitMerchants('discountId',discountId,'/discount/insertDiscountScenic',$(".modal-body #dataList_1"));
	},
	function(merchantId,merchantName){
		linkMerchants.submitMerchantsSingle('discountId',discountId,'/discount/insertDiscountScenic', merchantId, merchantName);
	},
	function(){
		queryselectDiscount.loadQuery(1);
	});
}


$(document).ready(function(){
	var userinfo = JSON.parse(getCookie('card.userinfo'));
	operatorsId = userinfo.operatorsId;
	$("#discountAdd").click(function(){
		var discountId;
		addProjectsmodal($("#discount-add"),0,function () {
	        var discountName = $("input[name='discountName']").val();
			var discountAliasName = $("input[name='discountAliasName']").val();
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
			var timetype = $("#timerange-type").val();
			var permanent = false;
			var beginDate,endDate,period;
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
			var description = $('#description').val();
			var url = '/discount/insertDiscount';
			var data = {
				'operatorsId':operatorsId,
				'discountName':discountName,
				'discountAliasName':discountAliasName,
				'discountType': discountType,
				'discountValue':discountValue,
				'permanent':permanent,
				'beginDate':beginDate,
				'endDate':endDate,
				'period':period,
				'minimum':minimum,
				'maxDiscount':maxDiscount,
				'description':description,
				'maxUse':-1,
				'dayMaxUse':-1,
				'status':1,
			};
	        http.post( url, data, function (jsonResponse) {
	        	discountId = jsonResponse.jbody.Discount.id;
	        },null,false);
	        if(discountId||discountId==0){
	        	return true;
	        }
	    },
		function(){
			linkMerchants.submitMerchants('discountId',discountId,'/discount/insertDiscountScenic',$(".modal-body #dataList_1"));
		},
		function(merchantId,merchantName){
			linkMerchants.submitMerchantsSingle('discountId',discountId,'/discount/insertDiscountScenic', merchantId, merchantName);
		},
		function(){
			queryselectDiscount.loadQuery(1);
		});
	});
	queryselectDiscount.loadQuery(1);
	$("#searchBtn").click(function(){
		queryselectDiscount.loadQuery(1);
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
	var url = '/discount/deleteDiscountScenicById';
	var data = {"id":id}
    http.post(url, data, function( res ){
        if( res.statusCode == 0 ){
            $("#spn_"+id).html("已删除");
            $("#spn_"+id).css("color","red");
            queryselectDiscount.loadQuery(1);
        }else{
            swal( '操作失败请重试', '', 'error' );
        }
    });
	
}
