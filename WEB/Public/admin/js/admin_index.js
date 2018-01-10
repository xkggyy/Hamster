/**
 * Created by wdy
 * on 15-1-29.
 * 后台首页js
 */

BUI.use('common/main', function() {
    var config = [{
        id: 'index',
        homePage: 'quick_start',
        menu: [{
            text: '常用操作',
            items: [
                { id: 'quick_start', text: '快速开始', href: "/index.php/Admin/Index/quick_start", closeable: false },
                { id: 'goods_list', text: '商品列表', href: '/index.php/Admin/Goods/index' },
                { id: 'category_list', text: '所有分类', href: '/index.php/Admin/Category/index' },
                { id: 'schedule_list', text: '日程列表', href: '/index.php/Admin/Schedule/index' }
            ]
        }]
    }, {
        id: 'item',
        homePage: 'list',
        menu: [{
            text: '商品管理',
            items: [
                { id: 'list', text: '商品列表', href: '/index.php/Admin/Goods/goods_list' }
            ]
        }]
    }, {
        id: 'category',
        homePage: 'list',
        menu: [{
            text: '分类管理',
            items: [
                { id: 'list', text: '所有分类', href: '/index.php/Admin/Category/category_list' }
            ]
        }]
    }, {
        id: 'schedule',
        homePage: 'list1',
        menu: [{
            text: '日程管理',
            items: [
                { id: 'list1', text: '兑换日程管理', href: '/index.php/Admin/Schedule/schedule_list' },
                { id: 'list2', text: '夺宝日程管理', href: '/index.php/Admin/Indiana/indiana_list' }
            ]
        }]
    }, {
        id: 'user',
        homePage: 'members',
        menu: [{
            text: '用户中心',
            items: [
                { id: 'members', text: '用户管理', href: '/index.php/Admin/members/members_list' }
            ]
        }]
    }, {
        id: 'rule',
        homePage: 'rules',
        menu: [{
            id: 'rules',
            text: '权限管理',
            href: '/index.php/Admin/manager/rules'
        }]
    }];
    new PageUtil.MainPage({
        modulesConfig: config
    });
});