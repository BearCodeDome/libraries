(function () {
    function bind(curEle, eventType, eventFn) {
        // 给元素绑定方法
        if ("addEventListener" in document) {
            curEle.addEventListener(eventType, eventFn, false);
            return;
        }
        var tempFn = function () {
            eventFn.call(curEle);
        };
        tempFn.photo = eventFn;
        if (!curEle["myBind" + eventType]) {
            curEle["myBind" + eventType] = [];
        }
        var ary = curEle["myBind" + eventType];
        for (var i = 0; i < ary.length; i++) {
            if (ary[i].photo === eventFn) {
                return;
            }
        }
        ary.push(tempFn);
        curEle.attachEvent("on" + eventType, tempFn);

    }

    function unBind(curEle, eventType, eventFn) {
        // 给元素移除方法
        if ("removeEventListener" in document) {
            curEle.removeEventListener(eventType, eventFn, false);
            return;
        }
        var ary = curEle["myBind" + eventType];
        if (ary && ary instanceof Array) {
            for (var i = 0; i < ary.length; i++) {
                var element = ary[i];
                if (element.photo === eventFn) {
                    curEle.detachEvent("on" + eventType, element);
                    ary[i] = null;
                    break;
                }
            }
        }
    }

    function on(curEle, eventType, eventFn) {
        // 依次添加到自定义事件池中
        if (!curEle["myEvent" + eventType]) {
            curEle["myEvent" + eventType] = [];
        }
        var ary = curEle["myEvent" + eventType];
        for (var i = 0; i < ary.length; i++) {
            if (ary[i] === eventFn) {
                return;
            }
        }
        ary.push(eventFn);

        // 绑定到浏览器事件池中
        bind(curEle, eventType, run);
    }

    function off(curEle, eventType, eventFn) {
        // 删除自定义事件池中
        var ary = curEle["myEvent" + eventType];
        if (ary && ary instanceof Array) {
            for (var i = 0; i < ary.length; i++) {
                var element = ary[i];
                if (element === eventFn) {
                    ary.splice(i, 1);
                    break;
                }
            }
        }
    }

    function run(e) {
        // 执行自定义事件池中的方法
        e = e || window.event;
        var flag = e.target ? true : false;
        if (!flag) {
            e.target = e.srcElement;
            e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
            e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
            e.preventDefault = function () {
                e.returnValue = false;
            };
            e.stopPropagation = function () {
                e.cancelBubble = true;
            }
        }
        var ary = this["myEvent" + e.type];
        for (var i = 0; i < ary.length; i++) {
            var element = ary[i];
            if (typeof element === "function") {
                element.call(this, e);
            } else {
                ary.splice(i, 1);
                i--;
            }
        }
    }

    window.myEventt = {
        on: on,
        off: off
        // 用法1：myEventt.on(curEle, eventType, eventFn);
        // 用法2：myEventt.off(curEle, eventType, eventFn);
    }
})()