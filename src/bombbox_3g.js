/*
 * @File Name:     bombbox_3g.js
 * @Create By:     zhouzuchuan
 * @Create Time:   2016-06-06 09:34:37
 * @Modified By:   zhouzuchuan
 * @Modified Time: 2016-06-27 16:02:53
 */

"usr strict"

;(function (window, document) {

    function Bombbox (options) {
        if (this === window) return new Bombbox(options);
        this.options = {
            selector: 'zzc-bomb',
            currentClass: 'current',
            bgClose: false
        };
        this.info = []; /* 储存主题数据 */
        this.backArr = []; /* 储存上一个弹框的 回退数组 */
        for (var props in options) this.options[props] = options[props];
        this.init();
    }

    Bombbox.prototype = {
        version: '0.0.1',
        init: function () {
            var self = this,
                opt = self.options,
                boxList = nodeListToArray(self._dealSelector().box);

            // 获取数据
            boxList.forEach(function (item, index) {
                var trace = item.getAttribute(opt.selector);
                self.info[index] = {
                    trace: trace,
                    selector: self._dealSelector(trace),
                    current: false
                };
            });

            // 绑定处理事件
            var ds = self._dealSelector();
            for (var props in ds) {
                eventType(ds[props]);
            }
            function eventType (a) {
                nodeListToArray(a).forEach(function (item, index) {
                    item.addEventListener('click', self, false);
                });
            }
        },
        // 事件句柄
        handleEvent: function (event) {
            var self = this,
                opt = self.options,
                e = event || window.event,
                et = e.target || e.srcElement;
            e.stopPropagation();
            self.info.forEach(function (item, index) {
                for (var props in item.selector) {
                    showOrHide(item.selector[props], props, index);
                }
            });
            function showOrHide (a, i, idx) {
                nodeListToArray(a).forEach(function (item) {
                    if (item === et) {
                        switch (i) {
                            case 'open':
                                self._show(idx);
                                break;
                            case 'close':
                                self._hide(idx);
                                break;
                            case 'back':
                                self._hide(idx, 'back');
                                break;
                            default:
                                if (!opt.bgClose) return;
                                self._hide(idx);
                                break;
                        }
                    }
                });
            }
        },
        // 处理选择器
        _dealSelector: function () {
            var self = this,
                opt = self.options,
                trace = arguments[0] ? ('="' + arguments[0] + '"') : '';
            return {
                box: $('[' + opt.selector + trace + ']'),
                close: $('[' + opt.selector + '-close ' + trace + ']'),
                back: $('[' + opt.selector + '-back ' + trace + ']'),
                open: $('[' + opt.selector + '-open' + trace +']')
            };
            function $ () {
                return document.querySelectorAll(arguments[0]);
            }
        },
        // 弹框隐藏
        _hide: function (n) {
            var self = this,
                opt = this.options,
                infoItem = self.info[n],
                boxDom = infoItem.selector.box[0];

            // 隐藏之前事件
            if (getType(opt.hideWill) === 'function') {
                opt.hideWill.call(self, cleanEmpty(infoItem.selector));
            }

            removeClass(opt.currentClass, boxDom);
            infoItem.current = false;

            // 判断是否显示上一个弹框
            if (arguments[1] === 'back' && self.backArr.length !== 0) {
                self._show(self.backArr.pop());
            }

            // 隐藏之后事件
            if (getType(opt.hideDid) === 'function') {
                opt.hideDid.call(self, cleanEmpty(infoItem.selector));
            }
        },
        // 弹框显示
        _show: function (n) {
            var self = this,
                opt = this.options,
                infoItem = self.info[n],
                boxDom = infoItem.selector.box[0];

            // 在显示之前 处理是否有上一个弹框显示
            self.info.forEach(function (item, index) {
                if (item.current) {

                    // 处理 回退数组 相同的子项
                    self.backArr.forEach(function (item2, index2) {
                        if (item2 === index) {
                            self.backArr.splice(index2, 1);
                        }
                    });
                    // 添加上个一个显示的弹框 到储存路径上
                    self.backArr.push(index);
                    item.current = false;
                    self._hide(index);
                }
            });

            // 显示之前事件
            if (getType(opt.showWill) === 'function') {
                opt.showWill.call(self, cleanEmpty(infoItem.selector));
            }

            addClass(opt.currentClass, boxDom);
            infoItem.current = true;

            // 显示之后事件
            if (getType(opt.showDid) === 'function') {
                opt.showDid.call(self, cleanEmpty(infoItem.selector));
            }
        }
    };

    function hasClass (str, node) {
        return new RegExp('(^|\\s)' + str + '(\\s|$)').test(node.className);
    }

    // 在当前指定的上下文添加selector
    function addClass (selector, context) {
        if (hasClass(selector, context)) return;
        var newClass = context.className.split(' ');
        newClass.push(dealSelector(selector));
        context.className = newClass.join(' ');
    }

    // 在当前指定的上下文删除selector
    function removeClass (selector, context) {
        if (!hasClass(selector, context)) return ;
        var re = new RegExp('(^|\\s)' + dealSelector(selector) + '(\\s|$)' , 'g');
        context.className = context.className.replace(re , ' ');
    }
    function dealSelector (selector) {
        var reg = /^\#|^\./;
        var newSelector = selector;
        if (reg.test(selector)) {
            newSelector = selector.slice(1);
        }
        return newSelector;
    }

    // 将DOM节点结合转化成数组
    function nodeListToArray (nodes) {
        var arr;
        try {
            arr = Array.prototype.slice.call(nodes);
        } catch (err) {
            arr = [];
            for (var i = 0 , length = nodes.length ; i < length ; i += 1) {
                arr.push(nodes[i]);
            }
        } finally {
            return arr;
        }
    }
    function cleanEmpty(param) {
        var returnObject;
        if (getType(param) === 'object') {
            returnObject = {};
            for (var props in param) {
                if (!param[props].length) continue;
                returnObject[props] = param[props];
            }
        }
        return returnObject;
    }
    function isUndefined (a) {
        return (a === null || typeof a == 'undefined' || a === '' || a === 'undefined');
    }
    function getType (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    }

    window.Bombbox = Bombbox;

} (window, document));