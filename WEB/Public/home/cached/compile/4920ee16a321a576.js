/*
 This is a combined version of VeryIDE 
 Last Updated:: 2017/01/19 11:10:08.
 Files include::  /static/js/app.js
 /static/js/choice.js
 /static/js/adsview.js
 */
(function (win, doc) {
    $(function () {
        var offset = $('.badge').offset();
        $(".addcar").click(function (event) {
            var addcar = $(this);
            var img = addcar.parent().parent().find('img').attr('src');
            var flyer = $('<img class="flyer" src="' + img + '">');
            flyer.fly({
                start: {
                    left: event.clientX,
                    top: event.clientY
                },
                end: {
                    left: offset.left + 10,
                    top: offset.top + 10,
                    width: 0,
                    height: 0
                },
                onEnd: function () {
                    addcar.css("cursor", "default").removeClass('orange').unbind('click');
                    this.destory();
                }
            });
        });
    });
    if (typeof o != 'undefined') {
        var s = doc.createElement("script"),
            h = doc.getElementsByTagName("head")[0];
        if (!win.alimamatk_show) {
                s.charset = "gbk";
                s.async = true;
                s.src = "http://a.alimama.cn/tkapi.js";
                h.insertBefore(s, h.firstChild);
            };
        win.alimamatk_onload = win.alimamatk_onload || [];
        win.alimamatk_onload.push(o);
    }
    R('.purchase-numb-list li').bind('click', function () {
        R('.purchase-numb-list li').attr('class', '');
        R(this).attr('class', 'inner');
        var price = parseInt(this.getAttribute('data-price'));
        var present = parseInt(this.getAttribute('data-present'));
        document.getElementById("price").value = price;
        document.getElementById("price1").innerHTML = price + present;
        document.getElementById("price2").innerHTML = price;
    }).event('click');
    $("#floatTools").mousemove(function () {
        $('#divFloatToolsView').show();
    });
    $("#floatTools").mouseout(function () {
        $('#divFloatToolsView').hide();
    });

    function SetHome(homes, url) {
        try {
            homes.style.behavior = 'url(#default#homepage)';
            homes.setHomePage(url);
        } catch (e) {
            if (window.netscape) {
                try {
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                } catch (e) {
                    alert("\u62b1\u6b49\uff0c\u6b64\u64cd\u4f5c\u88ab\u6d4f\u89c8\u5668\u62d2\u7edd\uff01\n\n\u8bf7\u5728\u6d4f\u89c8\u5668\u5730\u5740\u680f\u8f93\u5165\u201cabout:config\u201d\u5e76\u56de\u8f66\u7136\u540e\u5c06[signed.applets.codebase_principal_support]\u8bbe\u7f6e\u4e3a'true'");
                }
            } else {
                alert("\u62b1\u6b49\uff0c\u60a8\u6240\u4f7f\u7528\u7684\u6d4f\u89c8\u5668\u65e0\u6cd5\u5b8c\u6210\u6b64\u64cd\u4f5c\u3002\n\n\u60a8\u9700\u8981\u624b\u52a8\u5c06\u3010" + url + "\u3011\u8bbe\u7f6e\u4e3a\u9996\u9875\u3002");
            }
        }
    }
    function AddFavorite(title, url) {
        try {
            window.external.addFavorite(url, title);
        } catch (e) {
            try {
                window.sidebar.addPanel(title, url, "");
            } catch (e) {
                alert("\u62b1\u6b49\uff0c\u60a8\u6240\u4f7f\u7528\u7684\u6d4f\u89c8\u5668\u65e0\u6cd5\u5b8c\u6210\u6b64\u64cd\u4f5c\u3002\n\n\u52a0\u5165\u6536\u85cf\u5931\u8d25\uff0c\u8bf7\u4f7f\u7528Ctrl+D\u8fdb\u884c\u6dfb\u52a0");
            }
        }
    }
    R('img[rel=captcha]').bind('click', function () {
        this.src = this.src + '?r=' + Math.random();
    });
    R('a[rel=favorite]').bind('click', function () {
        AddFavorite(document.domain, location.href);
    });
    R('a[rel=sethome]').bind('click', function () {
        SetHome(this, document.domain);
    });
    R("a[href='#openModal']").bind('click', function () {
        R('#openModal iframe').attr('src', 'auth/login');
    });
    window['_process'] = function (data, node, func) {
        var times = 3;
        if (data['credit']) {
            var credit = parseInt(data['credit']);
            var extras = credit > 0 ? '\uff0c\u83b7\u5f97 ' + credit + ' \u79ef\u5206' : '\uff0c\u82b1\u8d39 ' + Math.abs(credit) + ' \u79ef\u5206';
            var notice = data['credit'] > 0 ? '<h1>\u83b7\u5f97\u79ef\u5206</h1><strong class="profit"> +' + data['credit'] + '</strong>' : '<h1>\u82b1\u8d39\u79ef\u5206</h1><strong class="expend"> ' + data['credit'] + '</strong>';
            data['result'] += extras;
            var stamps = R(document.body).append('div', {
                'innerHTML': '<div class="coin">' + notice + '</div>',
                'className': 'dialog cheer'
            }).change();
            window.setTimeout(function () {
                stamps.remove();
            }, 2000);
        } else {
            if (data['signin']) {
                data['result'] += '<a href="' + data['signin'] + '" class="button default">\u7acb\u5373\u767b\u5f55</a>';
                times = 6;
            }
            if (parseInt(data['return'])) {
                R.toast("failure", data['result'], times, {
                    'unique': 'toast'
                });
            } else {
                R.toast("success", data['result'], times, {
                    'unique': 'toast'
                });
            }
        }
        func && window[func].call(node, data);
        if (data['reload']) {
            window.setTimeout(function () {
                location.reload();
            }, 1500);
        }
        if (data['target']) {
            window.setTimeout(function () {
                location.href = data['target'];
            }, 1500);
        }
        if (data['direct']) {
            window.setTimeout(function () {
                location.replace(data['direct']);
            }, 1500);
        }
        if (data['captcha']) {
            R('img[rel=captcha]').event('click');
        }
    };
    R(document).live('click', '*[data-type="ajax"]', function (idx, e) {
        R.Event(e).stop();
        var func = this.getAttribute('data-func');
        var node = this;
        var url = (this.getAttribute('data-href') || this.getAttribute('href'));
        if (this.getAttribute('data-sure') && !confirm(this.getAttribute('data-sure'))) {
            return;
        }
        if (this.getAttribute('data-note')) {
            R.toast('', this.getAttribute('data-note'), 3, {
                'unique': 'toast'
            });
            return;
        }
        R.jsonp(url + (url.indexOf('?') > -1 ? '&' : '?') + 'ajax=?', {}, function (data) {
            window['_process'](data, node, func);
        });
    });
    R("form[method=post]").bind('keyup', function () {
        this.setAttribute('changed', 'changed');
    }).bind('submit', function (idx, e) {
        R.Event(e).stop();
        var form = this;
        if (R('[display=hide]', form).size()) {
            R('[display=hide]', form).attr({
                'display': 'show'
            });
            return;
        }
        var result = R.Form(form).Validate(function (i) {
            R.toast('failure', i, 3, {
                "unique": "toast"
            });
        });
        form.setAttribute('submit', 'submit');
        var size = typeof wx != 'undefined' && wx.ImgMap ? Object.keys(wx.ImgMap).length : 0;
        var func = function (form) {
            if (form.getAttribute('target') != 'ajax') {
                form.submit();
                return;
            }
            R('button[type=submit]', form).disabled();
            var url = (form.action ? form.action : location.pathname);
            var data = {};
            var ajax = new R.Ajax(url + (url.indexOf('?') > -1 ? '&' : '?') + 'ajax=ajax');
            ajax.method = "POST";
            var data = R.Form(form).Serialize(true, false, '&');
            ajax.setVar(data);
            ajax.onCompletion = function () {
                var xmls = ajax.responseXML.documentElement;
                var attr = xmls.attributes;
                var data = {};
                for (var i = 0; i < attr.length; i++) {
                    data[attr[i].nodeName] = attr[i].nodeValue;
                }
                window['_process'](data, form);
                R('button[type=submit]', form).enabled();
            };
            ajax.send();
        };
        if (size) {
            wx.uploadBatch(function () {
                result && func(form);
            });
        } else {
            result && func(form);
        };
    });
    if (/\/item\//.test(location.pathname)) {
        var clipboard = new Clipboard('[data-clipboard-target]', {
            target: function (trigger) {
                var goods = trigger.getAttribute('data-clipboard-goods');
                var target = trigger.getAttribute('data-clipboard-target');
                var elemet = document.querySelector(target);
                if (goods && elemet) {
                    var first = elemet.querySelector('img');
                    first.src = '//s2.zhfile.com/goods/' + goods + '.jpg';
                }
                return elemet;
            }
        });
        clipboard.on('success', function (e) {
            console.info('Action:', e.action);
            console.info('Text:', e.text);
            console.info('Trigger:', e.trigger);
            e.clearSelection();
            R.toast("success", '\u6210\u529f\u590d\u5236\u5230\u526a\u8d34\u677f', 3, {
                'unique': 'toast'
            });
        });
        clipboard.on('error', function (e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });
    } else {
        var ipt = document.querySelectorAll('[data-value]');
        for (var i = 0; i < ipt.length; i++) {
            ipt[i].onclick = function () {
                var sorts = this.getAttribute('data-value');
                document.getElementById('sorts').value = sorts;
                document.getElementById("filterform").submit()
            }
        }
        var screen = document.querySelectorAll('[data-screen]');
        for (var i = 0; i < screen.length; i++) {
            screen[i].onclick = function () {
                document.getElementById("filterform").submit()
            }
        }
    }
    R.Lazy.init();
    R.Lazy.run();
})(window, document, undefined);
var Choice = {
    wrap: null,
    data: {},
    opts: {},
    cate: {},
    storage: null,
    init: function (selector, wrap, option) {
        Choice.storage = window.localStorage;
        Choice.wrap = document.querySelector(wrap);
        Choice.opts = option;
        if (!Choice.wrap) return;
        Choice.live('click', selector, Choice.click);
        Choice.live('click', wrap + ' .badge', Choice.layer);
        Choice.live('click', wrap + ' .masks', Choice.layer);
        Choice.live('click', wrap + ' .putin', Choice.putin);
        Choice.live('click', wrap + ' .clear', Choice.clear);
        Choice.live('click', wrap + ' .report', Choice.report);
        window.setInterval(Choice.query, 1000);
        Choice.scroll();
    },
    login: function (redirect) {
        if (Choice.cookie('master')) {
            return true;
        } else if (redirect) {
            location.href = '/auth/login/';
            return false;
        }
    },
    bind: function (ele, evt, fn) {
        var self = ele;
        var call = function (e) {
            return fn.call(self, e);
        };
        if (self.addEventListener) self.addEventListener(evt, call, false);
        else if (self.attachEvent) self.attachEvent('on' + evt, call);
        else self['on' + evt] = call;
    },
    live: function (eventType, elementQuerySelector, cb) {
        document.addEventListener(eventType, function (event) {
            var qs = document.querySelectorAll(elementQuerySelector);
            if (qs) {
                var el = event.target,
                    index = -1;
                while (el && ((index = Array.prototype.indexOf.call(qs, el)) === -1)) {
                        el = el.parentElement;
                    }
                if (index > -1) {
                        cb.call(el, index, event);
                    }
            }
        });
    },
    cookie: function (key) {
        var userauth = Choice.opts.prefix + key;
        var reg = new RegExp("(^| )" + userauth + "=([^;]*)(;|$)");
        var arr = document.cookie.match(reg);
        var val = null;
        if (arr && arr[2]) {
            val = unescape(arr[2]);
        }
        return val;
    },
    scroll: function () {
        var btn = Choice.wrap.querySelector('.gotop');
        Choice.bind(window, 'scroll', function () {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop > 200) {
                btn.style.display = 'block';
            } else {
                btn.style.display = 'none';
            }
        });
        Choice.bind(btn, 'click', function () {
            window.scrollTo(0, 0);
        });
    },
    query: function (fetch) {
        var key = Choice.opts.cookie;
        var arr = Choice.storage.getItem(key);
        var ids = arr ? arr.split(',') : [];
        Choice.data = {};
        for (var k in ids) {
            Choice.append(ids[k]);
        }
        Choice.badge();
        if (fetch && ids.length) {
            var script = document.createElement('script');
            script.setAttribute('src', Choice.opts.query + ids.join(',') + '&ajax=Choice.fn');
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    },
    fn: function (data) {
        if (data['return'] || !data['result']) return;
        Choice.wrap.querySelector('.goods').innerHTML = '';
        for (var k in data['result']) {
            var good = data['result'][k];
            var html = document.createElement('div');
            html.className = 'deal';
            html.setAttribute('gid', good.id);
            html.innerHTML = '<time onclick="Choice.remove(' + good.id + ', this.parentNode);">&times;</time>' + '<a href="/detail?id=' + good.id + '" target="_blank">' + '<img src="' + good.img + '" />' 
                    + good.title + '<em>' + good.rates + '% / &yen; ' + good.price + '</em>' + '</a>';
            Choice.wrap.querySelector('.goods').appendChild(html);
        }
        Choice.wrap.querySelector('.lists').innerHTML = '';
        if (Object.keys(Choice.cate).length) {
            Choice.wrap.querySelector('.cates').style.display = "block";
            for (var k in Choice.cate) {
                var cate = Choice.cate[k];
                var html = document.createElement('li');
                html.setAttribute('cid', cate.id);
                html.innerHTML = '<label>' + '<input type="checkbox" class="clist" name="cate[]" value="' + cate.id + '" />' + cate.cate + '</label>';
                Choice.wrap.querySelector('.lists').appendChild(html);
            }
        }
    },
    append: function (gid, anim) {
        if (Choice.data[gid] || Object.keys(Choice.data).length >= 300) {
            var badge = Choice.wrap.querySelector('.badge');
            badge.className = 'badge shake';
            badge.addEventListener("animationend", function () {
                badge.className = 'badge';
            }, false);
            return;
        } else {
            Choice.data[gid] = {};
        }
        anim && Choice.badge(1, true);
    },
    remove: function (gid) {
        if (Choice.data[gid]) {
            delete Choice.data[gid];
            var ele = Choice.wrap.querySelector('.deal[gid=\'' + gid + '\']');
            ele.parentNode.removeChild(ele);
            Choice.badge(-1, true);
        }
    },
    setall: function () {
        var goods = document.querySelectorAll('[data-gid][data-action=choice]');
        for (var k = 0; k < goods.length; k++) {
            Choice.append(goods[k].getAttribute('data-gid'), true);
        }
    },
    badge: function (num, anim) {
        var key = Choice.opts.cookie;
        var ids = Object.keys(Choice.data);
        if (num && anim) {
            Choice.wrap.querySelector('.badge').innerHTML = ids.length + '<i>' + (num > 0 ? '+' : '') + num + '</i>';
            Choice.storage.setItem(key, ids.join(','));
        } else {
            Choice.wrap.querySelector('.badge').innerHTML = ids.length;
        }
        Choice.wrap.setAttribute('stats', ids.length);
    },
    clear: function () {
        var list = Choice.wrap.querySelectorAll('.deal');
        for (var k = 0; k < list.length; k++) {
            Choice.remove(list[k].getAttribute('gid'), list[k]);
        }
        Choice.layer();
    },
    click: function () {
        var act = this.getAttribute('data-action');
        switch (act) {
        case 'expand':
            Choice.expand(this.getAttribute('data-gid'));
            break;
        case 'choice':
            Choice.append(this.getAttribute('data-gid'), true);
            break;
        }
    },
    putin: function () {
        var ids = Object.keys(Choice.data);
        //location.href = 'shihuizhu://1&' + ids.join('&');
    },
    expand: function (gid) {
        //location.href = 'shihuizhu://2&' + gid;
    },
    report: function () {
        var clist = document.getElementsByClassName("clist");
        var cid = [];
        for (var i = 0; i < clist.length; i++) {
            if (clist[i].checked == true) {
                cid.push(clist[i].value);
            }
        }
        cid.length && R.jsonp('/choice/apply/' + cid.join(',') + '/' + Object.keys(Choice.data).join(',') + '/?ajax=?', {
            'charset': 'utf-8'
        }, function (data) {
            R.toast("success", data.result, 3, {
                'unique': 'toast'
            });
        });
    },
    layer: function () {
        var masks = Choice.wrap.querySelector('.masks');
        var layer = Choice.wrap.querySelector('.layer');
        if (masks.className == 'masks') {
            masks.className = 'masks show';
            layer.className = 'layer show';
            Choice.wrap.setAttribute('masks', 'show');
            Choice.catalog();
            Choice.sorts();
            Choice.query(true);
        } else {
            masks.className = 'masks';
            layer.className = 'layer';
            Choice.wrap.setAttribute('masks', 'hide');
        }
    },
    catalog: function (fn) {
        Choice.login() && R.jsonp('/choice/cate/?ajax=?', {
            'charset': 'utf-8'
        }, function (data) {
            if (data['return'] == 0 && data['result']) {
                Choice.cate = data['result'];
            }
        });
        fn && fn();
    },
    sorts: function (fn) {
        Choice.login() && R.jsonp('/member/seesele/?ajax=?', {
            'charset': 'utf-8'
        }, function (data) {});
        fn && fn();
    },
};
var Adsview = {
    gate: null,
    zone: {},
    init: function (gate) {
        Adsview.compat();
        Adsview.gate = gate;
        var zone = document.getElementsByTagName('xmp');
        for (var i = 0; i < zone.length; i++) {
            if (id = zone[i].getAttribute('zone')) {
                Adsview.zone[id] = zone[i];
            }
        }
        Adsview.fetch(Object.keys(Adsview.zone));
    },
    fetch: function (ids) {
        if (ids.length == 0) return;
        var script = document.createElement('script');
        script.setAttribute('src', Adsview.gate + '/fetch/' + ids.join(',') + '?ajax=Adsview.render');
        document.getElementsByTagName('head')[0].appendChild(script);
    },
    render: function (data) {
        if (data['return'] || !data['result']) return;
        for (var k in data['result']) {
            var zone = data['result'][k];
            for (var z in zone) {
                zone[z].url = Adsview.gate + '/click?' + 'bid=' + zone[z].banner_id + '&url=' + encodeURIComponent(zone[z].link);
            }
            var html = Adsview.template(Adsview.zone[k], {
                'zone': zone
            });
            Adsview.zone[k].outerHTML = html;
        }
    },
    decode: function (str) {
        str = str.replace(/&amp;/g, '&');
        str = str.replace(/&lt;/g, '<');
        str = str.replace(/&gt;/g, '>');
        str = str.replace(/&quot;/g, "''");
        str = str.replace(/&#039;/g, "'");
        return str;
    },
    compat: function () {
        if (!Object.keys) {
            Object.keys = function (obj) {
                var keys = [];
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        keys.push(i);
                    }
                }
                return keys;
            };
        }
    },
    template: function (tmpl, data) {
        try {
            if (typeof tmpl == 'object') {
                var tmpl = Adsview.decode(tmpl.innerHTML);
            }
            var fn = new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + tmpl.replace(/[\r\t\n]/g, " ").replace(/'(?=[^%]*%>)/g, "\t").split("'").join("\\'").split("\t").join("'").replace(/<%=(.+?)%>/g, "',$1,'").split("<%").join("');").split("%>").join("p.push('") + "');}return p.join('');");
            return fn(data);
        } catch (e) {
            console.log(e.message);
        }
    }
}