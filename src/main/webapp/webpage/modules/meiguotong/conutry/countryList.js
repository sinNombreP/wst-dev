<%@ page contentType="text/html;charset=UTF-8" %>
<script>
$(document).ready(function() {
	$('#countryTable').bootstrapTable({
		 
		  //请求方法
               method: 'get',
               //类型json
               dataType: "json",
               //显示刷新按钮
               showRefresh: true,
               //显示切换手机试图按钮
               showToggle: true,
               //显示 内容列下拉框
    	       showColumns: true,
    	       //显示到处按钮
    	       showExport: true,
    	       //显示切换分页按钮
    	       showPaginationSwitch: true,
    	       //最低显示2行
    	       minimumCountColumns: 2,
               //是否显示行间隔色
               striped: true,
               //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）     
               cache: false,    
               //是否显示分页（*）  
               pagination: true,   
                //排序方式 
               sortOrder: "asc",  
               //初始化加载第一页，默认第一页
               pageNumber:1,   
               //每页的记录行数（*）   
               pageSize: 10,  
               //可供选择的每页的行数（*）    
               pageList: [10, 25, 50, 100],
               //这个接口需要处理bootstrap table传递的固定参数,并返回特定格式的json数据  
               url: "${ctx}/meiguotong/conutry/country/data",
               //默认值为 'limit',传给服务端的参数为：limit, offset, search, sort, order Else
               //queryParamsType:'',   
               ////查询参数,每次调用是会带上这个参数，可自定义                         
               queryParams : function(params) {
               	var searchParam = $("#searchForm").serializeJSON();
               	searchParam.pageNo = params.limit === undefined? "1" :params.offset/params.limit+1;
               	searchParam.pageSize = params.limit === undefined? -1 : params.limit;
               	searchParam.orderBy = params.sort === undefined? "" : params.sort+ " "+  params.order;
                   return searchParam;
               },
               //分页方式：client客户端分页，server服务端分页（*）
               sidePagination: "server",
               contextMenuTrigger:"right",//pc端 按右键弹出菜单
               contextMenuTriggerMobile:"press",//手机端 弹出菜单，click：单击， press：长按。
               contextMenu: '#context-menu',
               onContextMenuItem: function(row, $el){
                   if($el.data("item") == "edit"){
                   	window.location = "${ctx}/meiguotong/conutry/country/form?id=" + row.id;
                   } else if($el.data("item") == "delete"){
                        jp.confirm('确认要删除该国家表记录吗？', function(){
                       	jp.loading();
                       	jp.get("${ctx}/meiguotong/conutry/country/delete?id="+row.id, function(data){
                   	  		if(data.success){
                   	  			$('#countryTable').bootstrapTable('refresh');
                   	  			jp.success(data.msg);
                   	  		}else{
                   	  			jp.error(data.msg);
                   	  		}
                   	  	})
                   	   
                   	});
                      
                   } 
               },
              
               onClickRow: function(row, $el){
               },
               columns: [{
		        checkbox: true
		       
		    }
               ,{
   		        field: 'id',
   		        title: 'ID',
   		        sortable: true
   		    }
			,{
		        field: 'updateDate',
		        title: '等级',
		        sortable: true,
		        formatter:function(value,row,index){
		        	return "国家";
		        }
		    }
			,{
		        field: 'title',
		        title: '国家名称',
		        sortable: true
		    }
			,{
		        field: 'languageName',
		        title: '语言',
		        sortable: true
		    }
			,{
		        field: 'status',
		        title: '显示',
		        sortable: true,
		        formatter:function(value,row,index){
		        	if(value==1){
		        		return "显示";
		        	}else if(value==2){
		        		return "禁止";
		        	}
		        }
		    }
		    , {
                field: 'operate',
                title: '操作',
                align: 'center',
                events: {
    		         'click .status': function (e, value, row, index) { 
    		        	jp.confirm('确认更改状态吗？', function(){
                           	jp.loading();
                           	jp.get("${ctx}/meiguotong/conutry/country/status?id="+row.id, function(data){
                       	  		if(data.success){
                       	  			$('#countryTable').bootstrapTable('refresh');
                       	  			jp.success(data.msg);
                       	  		}else{
                       	  			jp.error(data.msg);
                       	  		}
                       	  	})
                       	   
                       	});
    		        }
    		    },
                formatter:  function operateFormatter(value, row, index) {
    		        return [
    		        	<shiro:hasPermission name="meiguotong:conutry:country:view"> 
							'<a id="view" class="view" onclick="view('+row.id+')"><i class="fa fa-eye btn btn-success btn-xs">查看</i> </a>',
						</shiro:hasPermission>
						<shiro:hasPermission name="meiguotong:conutry:country:edit"> 
							'<a id="edit" class="edit" onclick="edit('+row.id+')"><i class="fa fa-edit btn btn-primary btn-xs">编辑</i> </a>',
						</shiro:hasPermission>
					(row.status==1?'<a href="#" class="status" title="禁止"><i class="fa fa-edit btn btn-warning btn-xs">禁止</i> </a>':
					(row.status==2?'<a href="#"  class="status" title="显示"><i class="fa fa-edit btn btn-success btn-xs">显示</i> </a>':'')),
					

    		        ].join('');
    		    }
            }
		     ]
		
		});
		
	  
	  if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){//如果是移动端

		 
		  $('#countryTable').bootstrapTable("toggleView");
		}
	  
	  $('#countryTable').on('check.bs.table uncheck.bs.table load-success.bs.table ' +
                'check-all.bs.table uncheck-all.bs.table', function () {
            $('#remove').prop('disabled', ! $('#countryTable').bootstrapTable('getSelections').length);
            $('#edit').prop('disabled', $('#countryTable').bootstrapTable('getSelections').length!=1);
        });
		  
		$("#btnImport").click(function(){
			jp.open({
			    type: 1, 
			    area: [500, 300],
			    title:"导入数据",
			    content:$("#importBox").html() ,
			    btn: ['下载模板','确定', '关闭'],
				    btn1: function(index, layero){
					  window.location='${ctx}/meiguotong/conutry/country/import/template';
				  },
			    btn2: function(index, layero){
				        var inputForm =top.$("#importForm");
				        var top_iframe = top.getActiveTab().attr("name");//获取当前active的tab的iframe 
				        inputForm.attr("target",top_iframe);//表单提交成功后，从服务器返回的url在当前tab中展示
				        inputForm.onsubmit = function(){
				        	jp.loading('  正在导入，请稍等...');
				        }
				        inputForm.submit();
					    jp.close(index);
				  },
				 
				  btn3: function(index){ 
					  jp.close(index);
	    	       }
			}); 
		});
		    
	  $("#search").click("click", function() {// 绑定查询按扭
		  $('#countryTable').bootstrapTable('refresh');
		});
	 
	 $("#reset").click("click", function() {// 绑定查询按扭
		  $("#searchForm  input").val("");
		  $("#searchForm  select").val("");
		  $("#searchForm  .select-item").html("");
		  $('#countryTable').bootstrapTable('refresh');
		});
		
		
	});
		
  function getIdSelections() {
        return $.map($("#countryTable").bootstrapTable('getSelections'), function (row) {
            return row.id
        });
    }
  
  function deleteAll(){

		jp.confirm('确认要删除该国家表记录吗？', function(){
			jp.loading();  	
			jp.get("${ctx}/meiguotong/conutry/country/deleteAll?ids=" + getIdSelections(), function(data){
         	  		if(data.success){
         	  			$('#countryTable').bootstrapTable('refresh');
         	  			jp.success(data.msg);
         	  		}else{
         	  			jp.error(data.msg);
         	  		}
         	  	})
          	   
		})
  }
  function edit(){
	  window.location = "${ctx}/meiguotong/conutry/country/form?id=" + getIdSelections();
  }
  function edit(id){
	  jp.openDialog('编辑国家', "${ctx}/meiguotong/conutry/country/form?id=" +id,'600px', '400px', $('#countryTable'));
  }
  function add(){
	  jp.openDialog('添加国家', "${ctx}/meiguotong/conutry/country/AddForm?id=",'600px', '400px', $('#countryTable'));
  }
  function view(id){
	  window.location = "${ctx}/meiguotong/comcity/comCity/list?provinceId=" + id;
  }

</script>