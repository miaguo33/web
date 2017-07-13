var queryBranch = (function() {
	var obj = {};
	var pageBar = $("#pageBar");
	var tableBody = $("#dataList");
	var queryPageUtil = new PageUtils(pageBar, tableBody);
	obj.data = [];
	obj.loadQuery = function(page, removeIfEmpty) {
		queryPageUtil.loadPage(page, '/operators/customCategorys', {
				'operatorsId': operatorsId,
				'categoryName': $("#searchText").val(),
				'areaId':$("#areaSearch").val()
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
					html += '<td>' + item.areaName + '</td>';
					html += '<td>' + item.categoryName + '</td>';
					html += '<td>' + item.description + '</td>';
					html += '<td>';
					html += '   <a class="icon-only text-muted" data-toggle="tooltip" title="编辑" onclick="queryBranch.edit('+index+')"><i class="fa fa-edit"></i></a>';
					html += '	<a class="icon-only text-muted" data-toggle="tooltip" title="删除" onclick="queryBranch.submitContentDelete('+item.id+')"><i class="fa fa-trash-o"></i></a>';
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

	obj.edit = function(i) {
		$('#add-edit-bc .modal-title span').html('编辑');
		$("#submitContent").attr("onclick","queryBranch.submitContentUpdate("+obj.data[i].id+")");
		$("#cityBox").hide();
		$("#categoryName").val(obj.data[i].categoryName);
		$("#description").val(obj.data[i].description);
		$('#add-edit-bc').modal();
	}
	obj.add = function() {
		$('#add-edit-bc .modal-title span').html('新增');
		$("#cityBox").show();
		$("#categoryName").val('');
		$("#description").val('');
		$("#submitContent").attr("onclick","queryBranch.submitContentAdd()");
		$('#add-edit-bc').modal();
	}

	/**
	 * 上传内容-新增
	 */
	obj.submitContentAdd = function() {

		var checkPass = true;
		//检查数据
		var checkInfo = [{
			'id': 'area',
			'errMsg': '地区'
		}, {
			'id': 'categoryName',
			'errMsg': '名称'
		}];


		checkPass = tools.checkInputNull(checkInfo);

		if(checkPass == true) {

			//组装数据
			var url = "/operators/customCategoryAdd";
			var data = {
				'operatorsId': (JSON.parse(getCookie('card.userinfo'))).operatorsId,
				'areaId': $("#area").val(),
				'areaName': $("#area").find("option:selected").text(),
				'categoryName': $("#categoryName").val(),
				'description': $("#description").val()
			};

			http.post(url, data, function(res) {
				if(res.statusCode == 0) {
					$('#add-edit-bc').modal('hide');
					queryBranch.loadQuery(1);
					swal(res.msg, '', 'success');
				} else {
					swal(res.msg, '', 'error');
				}
			});
		}

	};

	/**
	 * 上传内容-编辑
	 */
	obj.submitContentUpdate = function(id) {

		var checkPass = true;
		//检查数据
		var checkInfo = [{
			'id': 'categoryName',
			'errMsg': '名称'
		}];


		checkPass = tools.checkInputNull(checkInfo);

		if(checkPass == true) {

			//组装数据

			var url = "/operators/customCategoryUpdate";
			var data = {
				'id': id,
				'categoryName': $("#categoryName").val(),
				'description': $("#description").val()
			};

			http.post(url, data, function(res) {
				if(res.statusCode == 0) {
					$('#add-edit-bc').modal('hide');
					queryBranch.loadQuery(1);
					swal(res.msg, '', 'success');
				} else {
					swal(res.msg, '', 'error');
				}
			});
		}

	};
	/**
	 * 删除
	 */
	obj.submitContentDelete = function(id) {
		
		swal({
            title: "确定删除吗?",
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "是",
            cancelButtonText: "否",
        }, function (isConfirm) {
            if (isConfirm) {
		    	//组装数据

				var url = "/operators/customCategoryDelete";
				var data = {
					'id': id,
				};
		
				http.post(url, data, function(res) {
					if(res.statusCode == 0) {
						queryBranch.loadQuery(1);
						swal(res.msg, '', 'success');
					} else {
						swal(res.msg, '', 'error');
					}
				});
            };
        });
		
	};
	return obj;
})();

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
			$("#citySearch").citySelect({
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
	tools.tooltipInit();

	area.loadData();
	var userinfo = JSON.parse(getCookie('card.userinfo'));
	operatorsId = userinfo.operatorsId;
	queryBranch.loadQuery(1);
	$("#searchBtn").click(function() {
		queryBranch.loadQuery(1);
	})
});