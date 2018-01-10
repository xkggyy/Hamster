/**
 * Unicorn Admin Template
 * Diablo9983 -> diablo9983@gmail.com
**/
$(document).ready(function(){
	
	$('.data-table').dataTable({
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"sDom": '<""l>t<"F"fp>',
		"bRetrieve": true,
		//表格初始化完成后调用
        "fnInitComplete": function(oSettings, json) {
            // $('select').select2();
            // $('input[type=checkbox],input[type=radio],input[type=file]').uniform();
        },
        //用于在开始绘制之前调用，返回false的话，会阻止draw事件发生；返回其它值，draw可以顺利执行
        "fnPreDrawCallback": function( oSettings ) {
            
        },
        //在每次table被draw完后调用，至于做什么就看着办吧
        "fnDrawCallback": function() {
        	//这句话会影响到框体重复生成
            //$('tbody input[type=checkbox],tbody  input[type=radio],tbody  input[type=file]').uniform();
            var html='<input type="checkbox" id="title-table-checkbox" name="title-table-checkbox" />';
            $("#thead").html(html);
            $('select').select2();
            $('input[type=checkbox]').attr('checked',false);
            // var checkbox1 = $("#title-table-checkbox").parents('.widget-box').find('tr td:first-child input:checkbox');
            // checkbox1.each(function() {
            //     $(this).closest('.checker > span').removeClass('checked');
            // });
        	$("#title-table-checkbox").click(function() {
                var checkedStatus = this.checked;
                var checkbox = $(this).parents('.widget-box').find('tbody tr td:first-child input:checkbox');
                checkbox.each(function() {
                    this.checked = checkedStatus;
                    
                });
            });
            //$('input[type=checkbox],input[type=radio],input[type=file]').uniform();
        }
	});
    // $('input[type=checkbox],input[type=radio],input[type=file]').uniform();
});
