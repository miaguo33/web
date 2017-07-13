/*
 * 分页脚本
 */

/**
 * 分页加载工具类
 *
 * @param pageBarContainer
 *            分页条容器 div
 * @param tableRowHead
 *            表格头
 * @param isNoTip
 *            不显示遮蔽提示
 */
function PageUtils(pageBarContainer, tableRowHead, isNoTip, pageSize) {
	this.pageHolder = {
		"currentPage" : 1,
		"pages" : 1,
		'pageSize' : pageBarContainer.find("#size_bar option:selected").val() || (pageSize || 10),
		'total' : '0'
	};
	this.pageBarContainer = pageBarContainer || $("div .page_num")[0];
	this.tableRowHead = tableRowHead;
	this.isNoTip = isNoTip || false;
}

/**
 * 获取当前页
 *
 * @returns {Number}
 */
PageUtils.prototype.currentPage = function() {
	return this.pageHolder['currentPage'] || 1;
};

/**
 * 获取总共页数
 *
 * @returns {Number}
 */
PageUtils.prototype.pages = function() {
	return this.pageHolder['pages'] || 1;
};

/**
 * 获取总记录数
 *
 * @returns {Number}
 */
PageUtils.prototype.totalRecords = function() {
	return this.pageHolder['total'] || 0;
};

/**
 * 获取一页显示的数据的条数
 *
 * @returns {Number}
 */
PageUtils.prototype.pageSize = function() {
	return this.pageHolder['pageSize'] || 10;
};

/**
 * 刷新操作
 */
PageUtils.prototype.refresh = function() {
	PageUtils.prototype.loadPage.apply(this, this.refreshFunctArgs);
};

/**
 * 更新分页条信息
 *
 * 分页条必须是 <div class="page_num"><\/div>
 *
 * @param pagination 参考 Pagination.java
 * @param pageBarContainer 用以输出分页条信息
 * @param pageFunction 点击分页条后调用的函数
 * @param thisArg pageFunction 所属的对象
 * @param params 参数数组
 */
PageUtils.prototype.updatePagebar = function(pagination, pageFunction, thisArg, params) {
	pageFunction = pageFunction || function() {};
	this.pageBarContainer.children("span").remove();
	var startPage = pagination['firstPage'];
	var endPage = pagination['pages'] || Math.ceil( pagination['total'] / pagination['pageSize'] );
	var currentPage = pagination['pageNum'];
	this.pageHolder['currentPage'] = pagination['pageNum'];
	this.pageHolder['total'] = pagination['total'];
	var removeIfEmpty = params[params.length - 1] || false;
	var thisPageUtil = this;
	var pageSize = this.pageHolder['pageSize'];

	// fix for 含有搜索条件的情况下 pages 更新会有问题
	if (pagination['results'] && pagination['results'].length > 0) {
		this.pageHolder['pages'] = endPage;
	} else {
		this.pageHolder['pages'] = 2147483647;
		if (this.currentPage() == 1 && this.totalRecords() <= 1 && removeIfEmpty) {
			if (this.tableRowHead) {
				this.tableRowHead.empty();
				this.pageBarContainer.children().remove();
				return;
			}
		}
	}

	var bar = '<option value="10">10</option>';
	bar += '<option value="15">15</option>';
	bar += '<option value="20">20</option>';
	bar += '<option value="30">30</option>';
	bar += '<option value="40">40</option>';
	bar += '<option value="50">50</option>';

	var paginationHtml = '<div class="row">';
	paginationHtml += '<div class="col-sm-4"><div id="total_span" style="font-size:14px;">总数：' + this.totalRecords() + ' 条</div></div>';
	paginationHtml += '<div class="col-sm-8">';
	paginationHtml += '	<div class="btn-group" style="float: right; margin: 0;" id="pagination_btn">';
	paginationHtml += '		<button page="1" type="button" class="btn btn-sm btn-white">首页</button>';
	paginationHtml += '		<button page="' + (pagination['pageNum'] - 1) + '" type="button" class="btn btn-sm btn-white"><i class="fa fa-angle-left"></i></button>';

	var showPageNum = 10;
	var sPage = (currentPage > showPageNum / 2) ? currentPage - showPageNum / 2 : 1;
	var ePage = (currentPage + showPageNum / 2) > endPage ? endPage : currentPage + showPageNum / 2;

	// 最多显示10个页码
	if (sPage == 1 && ePage < endPage) {
		ePage = showPageNum + sPage - 1;
		ePage = ePage > endPage ? endPage : ePage;
	} else if (sPage > 1 && ePage == endPage) {
		sPage = ePage - showPageNum + 1;
		sPage = sPage < 1 ? 1 : sPage;
	}
	for (var i = sPage; i <= ePage; i++) {
		if (i == currentPage) {
			paginationHtml += '		<button page="' + i + '" type="button" class="btn btn-sm btn-white  active">' + i + '</button>';

		} else {
			paginationHtml += '		<button page="' + i + '" type="button" class="btn btn-sm btn-white">' + i + '</button>';
		}
	}

	if( pagination['pageNum'] == endPage ){
		paginationHtml += '		<button page="0" type="button" class="btn btn-sm btn-white"><i class="fa fa-angle-right"></i></button>';
	}else{
		paginationHtml += '		<button page="' + (pagination['pageNum'] + 1) + '" type="button" class="btn btn-sm btn-white"><i class="fa fa-angle-right"></i></button>';
	}

	paginationHtml += '		<button page="' + endPage + '" type="button" class="btn btn-sm btn-white">尾页</button>';
	paginationHtml += '	</div>';
	paginationHtml += '<div style="float: right;">';
	paginationHtml += '<span style="height: 30px; line-height: 30px; vertical-align: top; font-size:14px;">每页&nbsp;</span><select class="form-control input-sm m-b" style="width: 55px !important; padding: 0 0 0 10px; display:inline;" id="size_bar">';
	paginationHtml += bar;
	paginationHtml += '</select><span style="height: 30px; line-height: 30px; vertical-align: top; font-size:14px;">&nbsp;条&nbsp;&nbsp;</span></div>';
	paginationHtml += '</div>';
	paginationHtml += '</div>';

	this.pageBarContainer.empty().append(paginationHtml).find("#size_bar").val(pageSize);

	if (currentPage == 1) {
		$(".next").removeClass("disabled");
		$(".prev").addClass("disabled");
	} else if (currentPage == ePage) {
		$(".prev").removeClass("disabled");
		$(".next").addClass("disabled");
	} else {
		$(".prev").removeClass("disabled");
		$(".next").removeClass("disabled");
	}

	// 每页多少条事件
	this.pageBarContainer.unbind().bind("change", "#size_bar", function() {
		var pageSize_new = $(this).find("#size_bar option:selected").val();
		thisPageUtil.pageHolder['pageSize'] = pageSize_new;
		var loadParams = [];
		loadParams.push(1);
		$(params).each(function() {
			loadParams.push(this);
		});
		pageFunction.apply(thisArg || this, loadParams);
	});

	// 给分页条赋予点击事件
	// this.pageBarContainer.find("li a").each(function (index) {
	this.pageBarContainer.find("button").each(function(index) {
		$(this).css("cursor", "pointer");
		this.onclick = function() {
			var clickPage = $(this).attr('page');
			if (currentPage == clickPage) {
				return;
			}

			var loadParams = [];
			loadParams.push(clickPage);
			$(params).each(function() {
				loadParams.push(this);
			});

			pageFunction.apply(thisArg || this, loadParams);
		};
	});
};

/**
 * 加载分页数据
 *
 * @param page 加载第几页, 索引从 1 开始
 * @param loadUrl 加载数据的 url 地址
 * @param paramData 可选的参数
 * @param successCalback 执行成功后的回调函数
 * @param errorCallback 执行失败后的回调函数
 */
PageUtils.prototype.loadPage = function(page, loadUrl, paramData, successCalback, errorCallback, removeIfEmpty) {
	page = page || this.pageHolder['currentPage'];
	if (page <= 0 || page > this.pageHolder['pages']) {
		return;
	}

	if (this.totalRecords() > 0 && this.totalRecords() <= (this.currentPage() - 1) * this.pageSize() + 1) {
		if (page === this.currentPage() && this.currentPage() > 1) {
			page--;
		}
	}

	if (page <= 0 || page > this.pageHolder['pages']) {
		return;
	}

	this.refreshFunctArgs = arguments;


	if (paramData == null || paramData == undefined || !tools.isJson(paramData)) {
		paramData = {};
	}

	paramData = paramData || {};
	paramData['pageNum'] = page;
	paramData['pageSize'] = this.pageHolder['pageSize'];

	//设置标识为后台web请求
	paramData['requestFrom'] = "web";

	var requestDataType = paramData['requestDataType'];
	var requestData = paramData;
	var requestContentType = "application/x-www-form-urlencoded;charset=UTF-8";
	if(typeof(requestDataType) != "undefined" && requestDataType != null && requestDataType != "" ){
		// 后台spring controller层采用@RequestBody方式接受JSON格式数据的对象里面必须有requestFrom、requestDataType成员变量
		if("json" == requestDataType.toLowerCase()){
			requestContentType = "application/json; charset=utf-8";
			requestData = JSON.stringify(paramData);
		}
	}else{
		requestDataType = "text";
	}

	paramData['requestDataType'] = requestDataType;


	this.loadData = function() {


		//调用封装ajax
		http.post( loadUrl, requestData, function(response) {
			thisPageUtil.tableRowHead.empty();
			// 处理超时重定向
			if (tools.processTimeout(response)) {
				return;
			}

			if (response['statusCode'] != 0 ) {
				tools.toastr( "加载数据失败！", "提示", "error" );
				return;
			}

			if (successCalback) {
				successCalback.apply(this, [ response ]);
			}

			// 自动截取带 data-length 的文本长度
			thisPageUtil.tableRowHead.trimTextLength();

			// 更新分页条信息
			thisPageUtil.updatePagebar(response['jbody']['pageInfo'], loadPageFunction, thisPageUtil, [ loadUrl, paramData, successCalback, errorCallback, removeIfEmpty ]);
		},function(response) {
			response = response || arguments[0];
			// 处理超时重定向
			if (tools.processTimeout(response)) {
				return;
			}
			//tools.toastr( "加载数据失败！", "提示", "error" );

		});


		//$.ajax({
		//	type : 'POST',
		//	timeout : 60000,
		//	url : '/rest' + loadUrl,
		//	dataType : "text", // 返回结果信息的数据格式
		//	data : requestData, // 提交的参数
		//	contentType : requestContentType, // 提交参数的数据格式
		//	error : errorCallback || (function(response) {
		//		response = response || arguments[0];
		//		// 处理超时重定向
		//		if (tools.processTimeout(response)) {
		//			return;
		//		}
		//		tools.toastr( "加载数据失败！", "提示", "error" );
        //
		//	}),
		//	success : function(response) {
		//		thisPageUtil.tableRowHead.empty();
		//		// 处理超时重定向
		//		if (tools.processTimeout(response)) {
		//			return;
		//		}
        //
		//		var jsonResponse = JSON.parse(response);
		//		//if ( !jsonResponse['success'] ) {
		//		if (jsonResponse['statusCode'] != 0 ) {
		//			tools.toastr( "加载数据失败！", "提示", "error" );
		//			return;
		//		}
        //
		//		if (successCalback) {
		//			successCalback.apply(this, [ jsonResponse ]);
		//		}
        //
		//		// 自动截取带 data-length 的文本长度
		//		thisPageUtil.tableRowHead.trimTextLength();
        //
		//		// 更新分页条信息
		//		thisPageUtil.updatePagebar(jsonResponse['jbody']['pageInfo'], loadPageFunction, thisPageUtil, [ loadUrl, paramData, successCalback, errorCallback, removeIfEmpty ]);
		//	}
		//});
	};

	// 点击分页栏，页面滚动到顶部
	$('body,html').animate({
		scrollTop : 0
	}, 300);
	$('#tabRoot').animate({
		scrollTop : 0
	}, 300);

	var loadPageFunction = this.loadPage;
	var thisPageUtil = this;
	var html = '<tr class="animated fadeIn loading-tr">';
	html += '	<td colspan="20" style="text-align:center; vertical-align:middle; height:0;"  id="td_loading">';
	html += '		<i class="fa fa-spinner whirl"></i>';
	html += '	</td>';
	html += '</tr>';

	if( $(".loading-tr").length == 0 ){
		// 若表格中有子节点，插入到第一个节点之前
		if ($(this.tableRowHead[0]).children().length) {

			var currentPage;
			this.pageBarContainer.find("#pagination_btn").find('button').each(function(index, item){
				if( $(this).hasClass( 'active' ) ){
					currentPage = $(this).attr( "page" );
				}
			});
			if( parseInt( paramData['pageNum'] ) > parseInt( currentPage )  ){
				$(html).insertAfter($(this.tableRowHead[0]).children().last());//loading在后
			}else{
				$(html).insertBefore($(this.tableRowHead[0]).children().first());//loading在前
			}

		} else {// 否则直接替换表格数据
			$(this.tableRowHead[0]).html(html);
		}
//		$("#td_loading").animate({
//			height : "26px"
//		}, 'fast');// 添加过渡动画，更加自然
	}


	setTimeout(this.loadData, 0);// 延迟处理AJAX请求
};