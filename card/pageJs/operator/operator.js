$(".btn-radio").click(function() {
	$(".btn-radio").addClass("btn-outline");
	$(this).removeClass("btn-outline");
});
$(".discount-details").click(function() {
	$("#discount-details").modal();
});
$('[data-toggle="tooltip"]').tooltip({
	'placement': 'top'
});

var linkMerchants = (function(){
	var obj={};
	
	//关联选中的门店
	obj.submitMerchants = function(name,id,url,checkDiv){
		var merchantArray = [];
		checkDiv.find(".table-child input[name='brand-store']:checked").each(function(){
			var key = name;
			var merchantInfo = {
				'merchantId' : $(this).attr("data-merchantId"),
				'merchantName' : $(this).attr("data-merchantName"),
			};
			merchantInfo[key] = id;
			merchantArray.push(merchantInfo);
		});
		merchantString = JSON.stringify(merchantArray);
		var data = {
			'merchantArray':merchantString
		}
		http.post( url, data, function (jsonResponse) {
			tools.toastr( '关联成功', '', 'success' );
	    },null,false);
	}
	//单个关联门店
	obj.submitMerchantsSingle = function(name,id,url,merchantId,merchantName){
		var key = name;
		var merchantArray = [{
			'merchantId' :merchantId,
			'merchantName' : merchantName,
			name:id
		}];
		merchantArray[0][key] = id;
		merchantString = JSON.stringify(merchantArray);
		var data = {
			'merchantArray':merchantString
		}
		http.post( url, data, function (jsonResponse) {
			tools.toastr( '关联成功', '', 'success' );
	    },null,false);
	}
	
	return obj;
})();
function addProjectsmodal(modalDiv,step,dataSubmit,linkMerchant,linkMerchantSingle,end) {
	modalDiv.off().on({
		'loaded.bs.modal': function(e) {
			var form = $("#wizard");
			form.validate({
				errorPlacement: function errorPlacement(error, element) {
					error.addClass("m-n");
					error.appendTo(element.parent().parent());
				},
				rules: {

				}
			});
			form.steps({
				startIndex: step,
				bodyTag: "fieldset",
				enableCancelButton: 1,
				forceMoveForward: 1,
				labels: {
					cancel: "取消",
					finish: "完成",
					next: "下一步",
					previous: "上一步",
				},
				onInit: function(event, currentIndex, newIndex) {
					var loadBrand = new queryOperatorBrand($("#pageBar_1"),$("#dataList_1"));
					if(currentIndex==1){
						loadBrand.loadQuery(1);
					}
					industry.loadData();
					area.loadData();
					//富文本初始化
//					$('.summernote').summernote();
					//日期选择器初始化
					
					var date = new Date();
					var minDate = date.getTime();
					$('#wizard #data .input-daterange').datepicker({
						keyboardNavigation: false,
						forceParse: false,
						autoclose: true,
						format: "yyyy-mm-dd",
						startDate: tools.getFormatTime( minDate, 'yyyy-MM-dd' )
					});
					$("#wizard #industry").change(function(){
						loadBrand.loadQuery(1);
					});
					$("#wizard #area_province").change(function(){
						loadBrand.loadQuery(1);
					});
					$("#wizard #area_city").change(function(){
						loadBrand.loadQuery(1);
					});
					$("#wizard #area").change(function(){
						loadBrand.loadQuery(1);
					});
					$("#wizard #searchBtn").click(function(){
						loadBrand.loadQuery(1);
					});
					
					$("#wizard #timerange-type").change(function() {
						var c = $(this).val();
						if(c == 0) {
							$("#wizard #data").removeClass("hide");
							$("#wizard #period").addClass("hide");
							$("#wizard input[name='period']").val('');
						} else if(c == 1) {
							$("#wizard #period").removeClass("hide");
							$("#wizard #data").addClass("hide");
							$("#wizard #start").val('');
							$("#wizard #end").val('');
						}else{
							$("#wizard #data").addClass("hide").val('');
							$("#wizard #period").addClass("hide").val('');
							$("#wizard input[name='period']").val('');
							$("#wizard #start").val('');
							$("#wizard #end").val('');
						}
					});
					$('#wizard .i-checks').iCheck({
						checkboxClass: 'icheckbox_square-green',
						radioClass: 'iradio_square-green',
					});
					$(".discountType .i-checks").on('ifChecked',function(){
						discountTypeChange();
					});
					check($("input[name='applyScene']"), $("#checkAllapplyScene"));
					if(typeof linkMerchant == 'function') {
						$("#insertDiscountScenic").on('click',function(){
							if(typeof linkMerchant == 'function') {
								linkMerchant();
							}
						});
						$("#dataList_1").on('click','.operator-brand',function(){
							if(typeof linkMerchantSingle == 'function') {
								var merchantId = $(this).attr("data-merchantId");
								var merchantName = $(this).attr("data-merchantName");
								linkMerchantSingle(merchantId,merchantName);
							}
						});
					};
					
				},
				onStepChanging: function(event, currentIndex, newIndex) {
					form.validate().settings.ignore = ":disabled,:hidden";
					if(form.valid()) {
						if(currentIndex === 0) {
							if(typeof dataSubmit == 'function') {
								return dataSubmit();
							}
						} else {
							return true;
						}
					}
				},
				onStepChanged: function(event, currentIndex, priorIndex) {
					var loadBrand = new queryOperatorBrand($("#pageBar_1"),$("#dataList_1"));
					loadBrand.loadQuery(1);
				},
				onCanceled: function() {
					$(e.target).modal('hide');
				},
				onFinishing: function(event, currentIndex) {
					return true;
				},
				onFinished: function(event, currentIndex) {
					$(e.target).modal('hide');
				}
			})
		},
		'hidden.bs.modal': function(e) {
			$(this).removeData("bs.modal");
			if(typeof end == 'function') {
				end();
			}
		}
	});
};


function editProjectsmodal(modalDiv,updataInfo,submitInfo,end){
	modalDiv.off().on({
		'loaded.bs.modal': function(e) {
			var form = $("#wizard");
			form.children('h1').eq(0).find("span").html("编辑");
			form.children('h1').eq(1).remove();
			form.children('fieldset').eq(1).remove();
			form.steps({
				bodyTag: "fieldset",
				enableCancelButton: 1,
				forceMoveForward: 1,
				labels: {
					cancel: "取消",
					finish: "完成",
				},
				onInit: function(event, currentIndex, newIndex) {
					//日期选择器初始化
					$('#wizard #data .input-daterange').datepicker({
						keyboardNavigation: false,
						forceParse: false,
						autoclose: true,
						format: "yyyy-mm-dd"
					});
					$('#wizard .i-checks').iCheck({
						checkboxClass: 'icheckbox_square-green',
						radioClass: 'iradio_square-green',
					});
					$("#wizard #timerange-type").change(function() {
						var c = $(this).val();
						if(c == 0) {
							$("#wizard #data").removeClass("hide");
							$("#wizard #period").addClass("hide");
							$("#wizard input[name='period']").val('');
						} else if(c == 1) {
							$("#wizard #period").removeClass("hide");
							$("#wizard #data").addClass("hide");
							$("#wizard #start").val('');
							$("#wizard #end").val('');
						}else{
							$("#wizard #data").addClass("hide").val('');
							$("#wizard #period").addClass("hide").val('');
							$("#wizard input[name='period']").val('');
							$("#wizard #start").val('');
							$("#wizard #end").val('');
						}
					});
					check($("input[name='applyScene']"), $("#checkAllapplyScene"));
					if(typeof updataInfo == 'function') {
						updataInfo();
					}
				},
				onCanceled: function() {
					$(e.target).modal('hide');
				},
				onFinishing: function(event, currentIndex) {
					if(typeof submitInfo == 'function') {
						return submitInfo();
					};
				},
				onFinished: function(event, currentIndex) {
					$(e.target).modal('hide');
					if(typeof end == 'function') {
						end();
					};
				}
			})
		},
		'hidden.bs.modal': function(e) {
			$(this).removeData("bs.modal");
		}
	});
}

function check(checkboxes, checkAll) {
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
//加载该运营商下的门店列表
function queryOperatorBrand(pageBar, tableBody) {
	var queryPageUtil = new PageUtils(pageBar, tableBody);
	this.loadQuery = function(page, removeIfEmpty) {
		var province = $("#wizard #area_province").val();
		var city = $("#wizard #area_city").val();
		var area = $("#wizard #area").val();
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
		queryPageUtil.loadPage(page, '/operators/selectOperatorsBrand', {
				'operatorsId': operatorsId,
				'searchText': $("#wizard #searchText").val(),
				'industryId': $("#wizard #industry").val(),
				'extendData': areaType,
				'extendData2':areaValue
			},
			function(jsonResponse) {
				var pagination = jsonResponse['jbody']['pageInfo'];
				//tableBody.html('');
				if(!pagination['list'] || pagination['list'].length == 0) {
					//tools.toastr("无符合的搜索内容", "提示信息", 'warning');
					return;
				}
				//pagination['list'].reverse();
				$(pagination['list']).each(function(index, item) {
					var html = '<tr class="table-child">';
					html += '<td><input type="checkbox" class="i-checks" name="brand-store" data-brand=' + item.brandId + ' data-merchantId=' + item.merchantId + ' data-merchantName=' + item.merchantName + '></td>';
					html += '<td>' + (item.brandName||'') + '</td>';
					html += '<td>' + (item.merchantName||'') + '</td>';
					html += '<td>' + (item.industryName||'') + '</td>';
					html += '<td>' + (item.areaName||'') + '</td>';
					html += '<td>';
					html += '   <button type="button" class="btn btn-primary btn-sm operator-brand" data-merchantId=' + item.merchantId + ' data-merchantName=' + item.merchantName + '>关联</button>';
					html += '</td>';
					html += '</tr>';
					$(html).appendTo(tableBody);
				});
				tableBody.parent().trimTextLength();
				tools.tooltipInit();
				$('#wizard .i-checks').iCheck({
					checkboxClass: 'icheckbox_square-green',
					radioClass: 'iradio_square-green',
				});
				$("input[name='brand-store'].check-all").iCheck("uncheck");
				check($("input[name='brand-store']:not(.check-all)"), $("input[name='brand-store'].check-all"));
			},
			null,
			removeIfEmpty
		);
	};
}
var industry = (function(){
	var obj = {};
	obj.loadData = function(){
		if(tools.industryData){
			var pagination = JSON.parse(tools.industryData);
			var html = '<option value="">全部</option>';
			$(pagination['list']).each(function(index, item) {
				html += '<option value='+item.id+'>';
				html += item.industryName;
				html += '</option>';
			});
			$(html).appendTo($("#industry"));
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
			$("#city").citySelect({
				url:JSON.parse(tools.areaData),
				nodata:"none",
				prov: "",
				city: "",
				dist: "",
				required: false
			});
		}else{
			tools.getArea(function(){
				obj.loadData();
			});
		}
	}
	return obj;
})();

/**
 * 抵扣、折扣状态切换事件
 */
function discountTypeChange() {
	var discountType = $("input[name='discountType']:checked").val()
	if(discountType==2){
		$(".discountValueShow1").hide();
		$(".discountValueShow2").show();
		$("#maxDiscount").show();
		$(".discountValueShow4").hide();
	}else if(discountType==3||discountType==4){
		$(".discountValueShow2").hide();
		$(".discountValueShow1").show();
		if(discountType==3){
			$("#maxDiscount").hide();
			$(".discountValueShow4").hide();
		}else if(discountType==4){
			$("#maxDiscount").show();
			$(".discountValueShow4").show();
		}
	}
}






