//查询通行权益链接
var userInfo = JSON.parse( getCookie("card.userinfo") );
var query = (function() {
	var obj = {};
	var pageBar = $("#pageBar");
	var tableBody = $("#dataList");
	var queryPageUtil = new PageUtils(pageBar, tableBody);
	//品牌id相同的行合并
	obj.rowspan = function(table_id,table_colnum){
		var table_firsttd = "";
	    var table_currenttd = "";
	    var table_SpanNum = 0;
	    var table_Obj = table_id.find("tr td:nth-child(" + table_colnum + ")");
	    table_Obj.each(function(i){
	        if(i==0){
	            table_firsttd = $(this);
	            table_SpanNum = 1;
	        }else{
	            table_currenttd = $(this);
	            if(table_firsttd.attr("data-id")==table_currenttd.attr("data-id")){
	                table_SpanNum++;
	                table_currenttd.hide(); //remove();
	                table_firsttd.attr("rowspan",table_SpanNum);
	            }else{
	                table_firsttd = $(this);
	                table_SpanNum = 1;
	            }
	        }
	    });
	};
	obj.loadQuery = function(page, removeIfEmpty) {
		queryPageUtil.loadPage(page, '/operators/selectUnionCardBuyURL', {
				'operatorsId': userInfo.operatorsId,
				'searchText': $("#searchText").val(),
			},
			function(jsonResponse) {
				var pagination = jsonResponse['jbody']['pageInfo'];
				//tableBody.html('');
				if(!pagination['list'] || pagination['list'].length == 0) {
					//tools.toastr("无符合的搜索内容", "提示信息", 'warning');
					return;
				}
				var brand = '';
				$(pagination['list']).each(function(index, item) {
					var html='';
					if(brand!=item.brandId){
						html+= '<tr>';
						html+= '<td data-id='+item.brandId+'>'+item.brandName+'</td>';
						html+= '<td rowspan="2">品牌</td>';
						html+= '<td>通行权益购买链接</td>';
						var url = http.getFullUrl() + '/cd/cdcurrencycard.html?appid='+item.brandId+'&mid='+item.brandId+'&operatorsId='+userInfo.operatorsId;
						html+= '<td><a class="link" data-clipboard-text='+url+'>'+url+'</a></td>';
						
						html += '</tr>';
						html += '<tr>';
						html+= '<td data-id='+item.brandId+'>'+item.brandName+'</td>';
						html+= '<td>我的通行权益链接</td>';
						var url = 'http://'+window.location.host+'/cd/cdmycurrencycard.html?appid='+item.brandId+'&mid='+item.brandId+'&operatorsId='+userInfo.operatorsId;
						html+= '<td><a class="link" data-clipboard-text='+url+'>'+url+'</a></td>';
						html += '</tr>';
					}
						html+= '<tr>';
						html+= '<td data-id='+item.brandId+'>'+item.brandName+'</td>';
						html+= '<td rowspan="3">'+item.merchantName+'</td>';
						html+= '<td>通行权益购买链接</td>';
						var url = 'http://'+window.location.host+'/cd/cdcurrencycard.html?appid='+item.brandId+'&mid='+item.brandId+'&submid='+item.merchantId+'&operatorsId='+userInfo.operatorsId;
						html+= '<td><a class="link" data-clipboard-text='+url+'>'+url+'</a></td>';
						
						html += '</tr>';
						html += '<tr>';
						html+= '<td data-id='+item.brandId+'>'+item.brandName+'</td>';
						html+= '<td>我的通行权益链接</td>';
						var url = 'http://'+window.location.host+'/cd/cdmycurrencycard.html?appid='+item.brandId+'&mid='+item.brandId+'&submid='+item.merchantId+'&operatorsId='+userInfo.operatorsId;
						html+= '<td><a class="link" data-clipboard-text='+url+'>'+url+'</a></td>';
						html += '</tr>';
						html += '<tr>';
						html+= '<td data-id='+item.brandId+'>'+item.brandName+'</td>';
						html+= '<td>门店信息展示链接</td>';
						var url = 'http://'+window.location.host+'/cd/cdcooperativebranddetail.html?brandid='+item.id;
						html+= '<td><a class="link" data-clipboard-text='+url+'>'+url+'</a></td>';
						html += '</tr>';
					$(html).appendTo(tableBody);
					brand = item.brandId;
				});
				query.rowspan(tableBody,1);
				tableBody.parent().trimTextLength();
				tools.tooltipInit();
			},
			null,
			removeIfEmpty
		);
	};
	
	return obj;
})();

$(document).ready(function(){
	var url_1 = 'http://'+window.location.host+'/cd/cdcurrencycard.html?operatorsId='+userInfo.operatorsId;
	var url_2 = 'http://'+window.location.host+'/cd/cdindex.html?operatorsId='+userInfo.operatorsId;
	var url_3 = 'http://'+window.location.host+'/cd/cdmycurrencycard.html?operatorsId='+userInfo.operatorsId;
	var url_4 = 'http://'+window.location.host+'/cd/cdoperatormain.html?operatorsId='+userInfo.operatorsId;
	var url_5 = 'http://'+window.location.host+'/cd/cdcooperativebrand.html?operatorsId='+userInfo.operatorsId;
	$("#operatorsBuy").html(url_1);
	$("#operatorsShow").html(url_2);
	$("#myCard").html(url_3);
	$("#operatormain").html(url_4);
	$("#operativebrand").html(url_5);
	$("#operatorsBuy").attr("data-clipboard-text",url_1);
	$("#operatorsShow").attr("data-clipboard-text",url_2);
	$("#myCard").attr("data-clipboard-text",url_3);
	$("#operatormain").attr("data-clipboard-text",url_4);
	$("#operativebrand").attr("data-clipboard-text",url_5);
    $("#search").click(function(){
        query.loadQuery(1);
    });

    query.loadQuery(1);

    var clipboard = new Clipboard('.link');
//  clipboard.destroy();
console.log(clipboard);
    clipboard.on('success', function(e) {
	    tools.toastr( '复制成功！',null, 'success' );
	    
	});
	clipboard.on('error', function(e) {
	    tools.toastr( '复制失败！',null, 'error' );
	});
    console.log(clipboard);
});