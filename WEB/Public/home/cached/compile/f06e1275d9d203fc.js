var Pub = {
	port: null,
	goods: {},
	coupon: {},
	init: function() {
		$('#goods_url').bind('input propertychange', function() {
			if (url = Pub.makeurl($(this).val())) {
				if (!/(taobao|tmall)\.com/gi.test(url)) {
					$(this).val('');
					return
				}
				$(this).val(url);
				Pub.goods()
			}
		}).trigger('input');
		$('#coupon_url').bind('input propertychange', function() {
			if (url = Pub.makeurl($(this).val())) {
				$(this).val(url);
				Pub.coupon()
			}
		}).trigger('input');
		$('#notes').bind('change', function() {
			Pub.notes()
		});
		$('#kw').bind('change', function() {
			if (url = Pub.makeurl($(this).val())) {
				$(this).val(url)
			}
		});
		$('[data=panel]').bind('click', function() {
			$('[data=intro]').toggle();
			$('[data=detail]').toggle()
		});
		window['_callback'] = Pub.func
	},
	func: function(data) {
		if (data['return'] == 0) {
			Pub[data['format']] = data['detail'];
			for (var k in data['detail']) {
				if (k == 'coupon_money') $('.intro-coupon-money').html(data['detail']['coupon_money']);
				if (k != 'thumb') {
					R('[name=' + k + ']').value(data['detail'][k])
				}
			}
			if (data['detail']['multi'] && data['detail']['multi'].length) {
				R('.product-pics').show();
				R('.multi img').remove();
				var index = 0;
				var thumb = R("input[name=thumb]").value();
				for (var w in data['detail']['multi']) {
					var max = data['detail']['multi'][w];
					var min = max.replace('400x400', '100x100');
					if (thumb && thumb == max) {
						index = parseInt(w)
					}
					R(".multi").append("img", {
						"src": min,
						'onclick': 'Pub.select(' + w + ')'
					})
				}
				Pub.select(index)
			}
		}
	},
	select: function(index) {
		var img = Pub.goods.multi[index];
		R(".multi img").remove("class");
		R('.multi img:nth-child(' + (index + 1) + ')').attr('class', "current");
		R("input[name=thumb]").value(img);
		if (txt = R("textarea[name=intro]").value()) {
			R("textarea[name=intro]").value(txt.replace(/src="(.+?)"/ig, 'src="' + img + '"'))
		}
		R(".intro-data-image").attr('src', img)
	},
	trydir: function() {
		if (typeof rundir == 'undefined') {
			Pub.port = '/publish/verify/'
		} else {
			Pub.port = rundir + 'goods/verify/'
		}
	},
	coupon: function() {
		Pub.trydir();
		var url = R('[name=coupon_url]').value();
		url && R.jsonp(Pub.port + '?cat=coupon&url=' + encodeURIComponent(url) + '&ajax=?', {}, function(data) {
			window['_process'](data, this, '_callback');
			if (data['return'] == 0) {
				$('[data=coupon]').show();
				$('a[rel=coupon]').html(url)
			} else {
				$('[data=coupon]').hide()
			}
		})
	},
	goods: function() {
		Pub.trydir();
		var url = R('[name=url]').value();
		url && R.jsonp(Pub.port + '?cat=goods&url=' + encodeURIComponent(url) + '&ajax=?', {}, function(data) {
			window['_process'](data, this, '_callback');
			if (data['return'] == 0) {
				$('[data=goods]').show();
				$('[data=intro]').show();
				$('a[rel=goods]').html(url)
			} else {
				$('[data=goods]').hide();
				$('[data=intro]').hide()
			}
		})
	},
	notes: function() {
		var txt = R('[name=notes]').value();
		var gid = R('[name=notes]').attr('goods-id');
		gid && R.jsonp('/publish/notes/' + gid + '/?notes=' + encodeURIComponent(txt) + '&ajax=?', {}, function(data) {
			window['_process'](data, this, '_callback')
		})
	},
	makeurl: function(url) {
		url = url.replace('taoquan.taobao.com/coupon/unify_apply_result_tmall.htm', 'shop.m.taobao.com/shop/coupon.htm');
		url = url.replace('taoquan.taobao.com/coupon/unify_apply_result.htm', 'shop.m.taobao.com/shop/coupon.htm');
		url = url.replace('taoquan.taobao.com/coupon/unify_apply.htm', 'shop.m.taobao.com/shop/coupon.htm');
		index = url.indexOf('#');
		if (index > 0) {
			url = url.substring(0, index)
		}
		var arr = url.split(/(&|\?)/);
		var ret = arr.filter(function(val, idx) {
			if (idx == 0 || /^(id|seller_id|sellerId|activity_id|activityId)=/.test(val)) {
				return true
			}
		});
		var url = '';
		for (var k in ret) {
			if (k == 0) {
				url += ret[k]
			} else if (k == 1) {
				url += '?' + ret[k]
			} else {
				url += '&' + ret[k]
			}
		}
		return url
	},
	tinyurl: function(url, obj) {
		url && url.indexOf('dwz.cn') == -1 && R.jsonp("/fn/tinyurl?url=" + encodeURIComponent(url) + "&ajax=?", function(data) {
			obj.value = data.short
		})
	}
};
Pub.init();