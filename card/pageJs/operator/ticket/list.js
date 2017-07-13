var queryselectTicket = function() {
	var obj={};
	var pageBar = $("#pageBar");
	var tableBody = $("#dataList");
	var queryPageUtil = new PageUtils(pageBar, tableBody);
	obj.status = '';
	obj.data = [];
	obj.loadQuery = function(page, removeIfEmpty) {
		queryPageUtil.loadPage(page, '/ticket/selectTicket', {
				'status'     : obj.status,
				'operatorsId': operatorsId,
				'searchText': $("#searchText").val(),
			},
			function(jsonResponse) {
				var pagination = jsonResponse['jbody']['pageInfo'];
				tableBody.html('');
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
					}
					//pagination['list'].reverse();
				$(pagination['list']).each(function(index, item) {
					var html = '<tr>';
					html += '<td>' + item.ticketName + '</td>';
					html += '<td>' + item.ticketAliasName + '</td>';
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
					} else {
						html += '<span style="color:red;margin-left:9px;">—</span>';
					}
					html += '</td>';
					
					if(item.maxUse==-1){
						html += '<td>无限制</td>';
					}else{
						html += '<td>'+item.maxUse+'</td>';
					}
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
					html += '   <a class="icon-only text-warning" data-toggle="modal" href="./operator/ticket/add.html" data-target="#ticket-add" onclick="ticketLinkmerchant(' + item.id + ')">';
					html += '		<i class="fa fa-link"></i>';
					html += '   </a>';
					html += '</td>';
					
					html += '<td>';
					html += '   <a class="icon-only ticket-details" data-toggle="modal" href="./operator/ticket/add.html" data-target="#ticket-add" onclick="editticket('+index+')" title="编辑">';
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
	}
	return obj;
}();

function editticket(id){
	var dataInfo = queryselectTicket.data[id];
	editProjectsmodal($("#ticket-add"),function(){
		$("input[name='ticketName']").val(dataInfo.ticketName).attr("readonly","readonly");
		$("input[name='ticketAliasName']").val(dataInfo.ticketAliasName).attr("readonly","readonly");
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
		$("input[name='maxUse']").val(dataInfo.maxUse).attr("readonly","readonly");
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
		var url = '/ticket/updateTicket';
		var data = {
			'id': dataInfo.id,
			'permanent': permanent,
			'beginDate': beginDate,
			'endDate': endDate,
			'period': period,
			'description': description,
		};
		http.post(url, data, function(jsonResponse) {
			ticketId = jsonResponse.jbody.Ticket.id;
		}, null, false);
		if(ticketId || ticketId == 0) {
			return true;
		}
	},
	function(){
		queryselectTicket.loadQuery(1);
	});
};

function ticketLinkmerchant(ticketId) {
	addProjectsmodal($("#ticket-add"), 1, null,
	function(){
		linkMerchants.submitMerchants('ticketId',ticketId,'/ticket/insertTicketScenic',$(".modal-body #dataList_1"));
	},
	function(merchantId,merchantName){
		linkMerchants.submitMerchantsSingle('ticketId',ticketId,'/ticket/insertTicketScenic', merchantId, merchantName);
	},
	function(){
		queryselectTicket.loadQuery(1);
	});
}

$(document).ready(function() {
	var userinfo = JSON.parse(getCookie('card.userinfo'));
	operatorsId = userinfo.operatorsId;
	
	$("#ticketAdd").click(function() {
		var ticketId;
		addProjectsmodal($("#ticket-add"), 0, function() {
				var ticketName = $("input[name='ticketName']").val();
				var ticketAliasName = $("input[name='ticketAliasName']").val();
				var ticketValue = $("input[name='ticketValue']").val();
				var maxUse = $("input[name='maxUse']").val();
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
				var url = '/ticket/insertTicket';
				var data = {
					'operatorsId': operatorsId,
					'ticketName': ticketName,
					'ticketAliasName': ticketAliasName,
					'ticketValue': 0,
					'permanent': permanent,
					'beginDate': beginDate,
					'endDate': endDate,
					'period': period,
					'minimum': 0,
					'maxTicket': -1,
					'description': description,
					'maxUse': maxUse,
					'dayMaxUse': -1,
					'ticketType': 2,
					'status': 1
				};
				http.post(url, data, function(jsonResponse) {
					ticketId = jsonResponse.jbody.Ticket.id;
				}, null, false);
				if(ticketId || ticketId == 0) {
					return true;
				}
			},
			function(){
				linkMerchants.submitMerchants('ticketId',ticketId,'/ticket/insertTicketScenic',$(".modal-body #dataList_1"));
			},
			function(merchantId,merchantName){
				linkMerchants.submitMerchantsSingle('ticketId',ticketId,'/ticket/insertTicketScenic', merchantId, merchantName);
			},
			function(){
				queryselectTicket.loadQuery(1);
			});
	});
	queryselectTicket.loadQuery(1);
	$("#searchBtn").click(function(){
		queryselectTicket.loadQuery(1);
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
	var url = '/ticket/deleteTicketScenicById';
	var data = {"id":id}
    http.post(url, data, function( res ){
        if( res.statusCode == 0 ){
            $("#spn_"+id).html("已删除");
            $("#spn_"+id).css("color","red");
            queryselectTicket.loadQuery(1);
        }else{
            swal( '操作失败请重试', '', 'error' );
        }
    });
	
}
