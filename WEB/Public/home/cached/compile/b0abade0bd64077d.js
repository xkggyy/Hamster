/*
  This is a combined version of VeryIDE 
  Last Updated:: 2017/01/04 16:20:37.
  Files include::  /static/js/report.js
*/
var Report = {
	wrap: null,
	data: {},
	opts: {},
	gid: null,
	init: function(selector, wrap, option) {
		Report.wrap = document.querySelector(wrap);
		Report.opts = option;
		var ipt = document.querySelectorAll(selector);
		for (var i = 0; i < ipt.length; i++) {
			ipt[i].onmouseenter = function() {
				Report.click(this);
			};
		}
               
		//Report.wrap.querySelector('.masks').onclick = Report.layer;
		//Report.wrap.querySelector('.present').onclick = Report.present;
	},
	click: function(ele) {
		var info = ele.getAttribute('data-info');
		Report.gid = info;
		var inform = ele.querySelector('.inform');
		inform.onclick = function() {
			Report.inform(ele);
		};
		var official = ele.querySelector('.official');
		official.onmouseenter = function() {
			Report.display(ele);
		};
		official.onmouseleave = function() {
			Report.hidden(ele);
		};
//		var official = ele.querySelector('.official');
//		official.onclick = function() {
//			Report.official(ele);
//		};
	},
	inform: function(ele) {
		Report.layer();
	},
	display: function(ele) {
		var intro = ele.querySelector('.intro');
		intro.style.display = "block";
	},
	hidden: function(ele) {
		var intro = ele.querySelector('.intro');
		intro.style.display = "none";
	},
	present: function() {
		var info_reason = document.getElementById("info_reason").value;
		var info_qq = document.getElementById("info_qq").value;
		if (info_reason == '' && info_qq == '') {
			alert("举报理由不能为空和联系QQ不能为空");
		}
		if (isNaN(info_qq)) {
			alert("QQ号码只能为数字！");
		}
		Report.data.gid = Report.gid;
		Report.data.info_reason = info_reason;
		Report.data.info_qq = info_qq;
		if (Report.data.info_reason && Report.data.info_qq) {
			Report.data.gid && R.jsonp('/blacklist/apply/?gid=' + Report.data.gid + '&info_reason=' + Report.data.info_reason + '&info_qq=' + Report.data.info_qq + '&ajax=?', {
				'charset': 'utf-8'
			}, function(data) {
				R.toast("success", data.result, 3, {
					'unique': 'toast'
				});
				Report.layer();
				document.getElementById("info_reason").value = '';
				document.getElementById("info_qq").value = '';
			});
		}
	},
	official: function(ele,url,img) {
		var info = ele.getAttribute('data-info');
		var clipboard = new Clipboard('[data-clipboard-target]', {
			target: function(trigger) {
				var goods = trigger.getAttribute('data-clipboard-goods');
                                alert(goods)
				var target = trigger.getAttribute('data-clipboard-target');
				var elemet = document.querySelector(target);
				if (goods && elemet) {
					var first =elemet.querySelector('img');
                                        //alert(img)
					$(first).attr("src",img);
                                       // alert($(first).attr("src"));
                                        var second=elemet.querySelector('span');
                                        //var url=  trigger.getAttribute('data-clipboard-url');
                                        second.innerText=url;
				}
				return elemet;
			}
		});
		clipboard.on('success', function(e) {
			console.info('Action:', e.action);
			console.info('Text:', e.text);
			console.info('Trigger:', e.trigger);
			e.clearSelection();
			R.toast("success", '成功复制到剪贴板', 3, {
				'unique': 'toast'
			});
		});
		clipboard.on('error', function(e) {
			console.error('Action:', e.action);
			console.error('Trigger:', e.trigger);
		});
	},
	layer: function() {
		var masks = Report.wrap.querySelector('.masks');
		var layer = Report.wrap.querySelector('.layer');
		if (masks.className == 'masks') {
			masks.className = 'masks show';
			layer.className = 'layer show';
			Report.wrap.setAttribute('masks', 'show');
		} else {
			masks.className = 'masks';
			layer.className = 'layer';
			Report.wrap.setAttribute('masks', 'hide');
		}
	}
};
Report.init('[data-info]', '.denounce');