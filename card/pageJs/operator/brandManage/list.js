var queryMerchant = function() {
	var obj = {};
	var pageBar = $("#pageBar");
	var tableBody = $("#dataList");
	var queryPageUtil = new PageUtils(pageBar, tableBody);
	obj.data = [];
	obj.loadQuery = function(page, removeIfEmpty) {
		queryPageUtil.loadPage(page, '/operators/operatorsBrands', {
				'operatorsId': operatorsId,
				'merchantName': $("#searchText").val(),
				'areaId':$("#area").val()
			},
			function(jsonResponse) {
				var pagination = jsonResponse['jbody']['pageInfo'];
				//tableBody.html('');
				if(!pagination['list'] || pagination['list'].length == 0) {
					//tools.toastr("无符合的搜索内容", "提示信息", 'warning');
					return;
				};
				obj.data = pagination['list'];
				
					//pagination['list'].reverse();
				$(pagination['list']).each(function(index, item) {
					var html = '<tr>';
					html += '<td>'+item.merchantName+'</td>';
                    html += '<td>'+item.industryName+'</td>';
                    html += '<td>'+item.areaName+'</td>';
                    html += '<td>';
                    if(item.configItem){
                    	if(JSON.parse(item.configItem).CATEGORY){
                    		if(JSON.parse(item.configItem).CATEGORY.category){
	                    		$(JSON.parse(item.configItem).CATEGORY.category).each(function(index,item){
		                    		if(index==0){
		                    			html += item.name;
		                    		}else{
		                    			html += '、'+item.name;
		                    		}
		                    	})	
                    		}
	                    }
                    }
                    html += '</td>';
                    html += '<td>';
                    if(item.configItem){
                    	if(JSON.parse(item.configItem).TAG){
                    		if(JSON.parse(item.configItem).TAG.tags){
	                    		$(JSON.parse(item.configItem).TAG.tags).each(function(index,item){
		                    		if(index==0){
		                    			html += item.name;
		                    		}else{
		                    			html += '、'+item.name;
		                    		}
		                    	})	
                    		}
	                    }
                    }
                    
                    html += '</td>';
                    html += '<td>';
                    html += '	<a class="icon-only text-muted" data-toggle="tooltip" title="编辑" data-pjax onclick = "queryMerchant.edit('+index+')"><i class="fa fa-edit"></i></a>';
                    html += '	<a class="icon-only text-muted" data-toggle="tooltip" title="预览" onclick="queryMerchant.preview('+index+')"><i class="fa fa-qrcode"></i></a>';
//                  html += '	<a class="icon-only text-muted" data-toggle="tooltip" title="下移"><i class="fa fa-arrow-down"></i></a>';
//                  html += '	<a class="icon-only text-muted" data-toggle="tooltip" title="显示"><i class="fa fa-eye"></i></a>';
//                  html += '	<a class="icon-only text-muted" data-toggle="tooltip" title="隐藏"><i class="fa fa-eye-slash"></i></a>';
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
	obj.edit = function( i ){
		var merchantinfo = JSON.stringify(obj.data[i]);
        setCookie( 'operators.merchantinfo', merchantinfo );
        tools.href( './operator/brandManage/edit.html' );
	};
	
	obj.preview = function( id ){
        var merchantinfo = obj.data[id];
        console.log(merchantinfo);
        $("#modalTitle").html('预览');
        var str = http.getFullUrl( '/cd/cdcooperativebranddetail.html?brandid=' + merchantinfo.id);
        $("#modalQR").html( '' );
        $("#modalQR").qrcode({
            render: "canvas",//canvas or table
            width: 200,
            height:200,
            text: str
        });

        $("#modalLink").html( str );

        $("#modalShow").modal('show');

    };
	
	return obj;
}();


var area = (function() {
	var obj = {};
	obj.loadData = function() {
		if(tools.areaData) {
			$("#city").citySelect({
				url: JSON.parse(tools.areaData),
				nodata: "none",
				prov: "",
				city: "",
				dist: "",
				required: false
			});
		} else {
			tools.getArea(function() {
				obj.loadData();
			});
		}
	}
	return obj;
})();
$(document).ready(function() {
	area.loadData();
	var userinfo = JSON.parse(getCookie('card.userinfo'));
	operatorsId = userinfo.operatorsId;
	queryMerchant.loadQuery(1);
	$("#searchBtn").click(function(){
		queryMerchant.loadQuery(1);
	})
});