var utils = (function () {
    var flag = "getComputedStyle" in window;

    /**
     * @param {element} ele 元素
     * @param {attr} attr 属性
     * @returns 
     */
    function getCss(ele, attr) {
        var val = null,
            reg = null;
        if (flag) {
            val = window.getComputedStyle(ele, null)[attr];
        } else {
            if (attr == 'opacity') {
                val = ele.currentStyle.filter;
                reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val = reg.test(val) ? reg.exec(val)[1] : 1;
            } else {
                val = ele.currentStyle[attr];
            }
        }
        reg = /^-?\d+(?:\.\d+)?(?:px|pt|rem|em|deg)?$/;
        if (reg.test(val)) {
            val = parseFloat(val);
        }
        return val;
    }

    /**
     * @param {document} attr document属性
     * @param {value} val document值（可选）
     * @returns 
     */
    function win(attr, val) {
        if (typeof val !== 'undefined') {
            document.documentElement[attr] = val;
            document.body[attr] = val;
        }
        return document.documentElement[attr] || document.body[attr];
    }

    /**
     * @param {element} element 元素
     * @returns 获取元素距离body的偏移量
     */
    function offset(element) {
        var parent = element.offsetParent;
        var l = null;
        var t = null;
        l += element.offsetLeft;
        t += element.offsetTop;
        while (parent) {
            if (!flag) {
                l += parent.clientWidth;
                t += parent.clientHeight;
            }
            l += parent.offsetWidth;
            t += parent.offsetTop;
            parent = parent.offsetParent;
        }
        return {
            left: l,
            top: t
        };
    }

    /**
     * @param {Array} listArray 类数组
     * @returns 类数组数转换为数组
     */
    function listToArray(listArray) {
        if (flag) {
            return Array.prototype.slice.call(listArray, 0);
        }
        var arr = [];
        for (var i = 0; i < listArray.length; i++) {
            var element = listArray[i];
            arr[arr.length] = element;
        }
        return arr;
    }

    /**
     * @param {string} jsonString JSON格式的字符串
     * @returns JSON格式的字符串转换为JSON格式的对象
     */
    function formatJson(jsonString) {
        return "JSON" in window ? JSON.parse(jsonString) : eval("(" + jsonString + ")");
    }

    /**
     * @param {element} ele HTML元素
     * @param {tagName} tag HTML元素的标签名（可选）
     * @returns 获取所有元素子节点，可以指定元素的标签名
     */
    function children(ele, tag) {
        var arr = [];
        if (!flag) {
            var nodeList = ele.childNodes;
            for (var i = 0, len = nodeList.length; i < len; i++) {
                var element = nodeList[i];
                element.nodeType === 1 ? arr[arr.length] = element : null;
            }
            nodeList = null;
        } else {
            arr = this.listToArray(ele.children)
        }
        if (typeof tag === "string") {
            for (var k = 0; k < arr.length; k++) {
                var elementName = arr[k];
                if (elementName.nodeName.toLowerCase() !== tag.toLowerCase()) {
                    arr.splice(k, 1);
                    k--;
                }
            }
        }
        return arr;
    }

    /**
     * @param {element} ele HTML元素
     * @returns 获取上一个哥哥元素节点
     */
    function prev(ele) {
        if (flag) {
            return ele.previousElementSibling;
        }
        var pre = ele.previousSibling;
        while (pre && pre.nodeType !== 1) {
            pre = pre.previousSibling;
        }
        return pre;
    }

    /**
     * @param {element} ele HTML元素
     * @returns 获取下一个弟弟节点
     */
    function next(ele) {
        if (flag) {
            return ele.nextElementSibling;
        }
        var nex = ele.nextSibling;
        while (nex && nex.nodeType !== 1) {
            nex = nex.nextSibling;
        }
        return nex;
    }

    /**
     * @param {element} ele HTML元素
     * @returns 获取所有的哥哥节点
     */
    function prevAll(ele) {
        var arr = [];
        var pre = this.prev(ele);
        while (pre) {
            arr.unshift(pre);
            pre = this.prev(pre);
        }
        return arr;
    }

    /**
     * @param {element} ele HTML元素
     * @returns 获取所有的弟弟节点
     */
    function nextAll(ele) {
        var arr = [];
        var nex = this.next(ele);
        while (nex) {
            arr.push(nex);
            nex = this.next(nex);
        }
        return arr;
    }

    /**
     * @param {element} ele HTML元素
     * @returns 获取兄弟节点
     */
    function sibling(ele) {
        var arr = [];
        var pre = this.prev(ele)
        var nex = this.next(ele);
        pre ? arr.push(pre) : null;
        nex ? arr.push(nex) : null;
        return arr;
    }

    /**
     * @param {element} ele HTML元素
     * @returns 获取所有兄弟节点
     */
    function siblingAll(ele) {
        return this.prevAll(ele).concat(this.nextAll(ele));
    }

    /**
     * @param {element} ele HTML元素
     * @returns 获取节点的索引
     */
    function index(ele) {
        return this.prevAll(ele).length;
    }

    /**
     * @param {element} ele HTML元素
     * @returns 第一个元素子节点
     */
    function firstChild(ele) {
        var childNodes = this.children(ele);
        return childNodes.length > 0 ? childNodes[0] : null;
    }

    /**
     * @param ele HTML元素
     * @returns 最后一个元素子节点
     */
    function lastchild(ele) {
        var childNodes = this.children(ele);
        return childNodes.length > 0 ? childNodes[childNodes.length - 1] : null;
    }

    /**
     * @param {element} ele 元素
     * @param {container} container 向容器的末尾追加元素
     */
    function append(ele, container) {
        container.appendChild(ele);
    }

    /**
     * @param {element} newEle 元素
     * @param {element} oldEle 在元素的前面追加元素
     */
    function insertBefore(newEle, oldEle) {
        oldEle.parentNode.insertBefore(newEle, oldEle)
    }

    /**
     * @param {element} newEle 新元素
     * @param {element} oldEle 老元素
     * @returns 在元素的后面追加元素（重点）
     */
    function insertAfter(newEle, oldEle) {
        var nextElement = this.next(oldEle)
        if (nextElement) {
            this.insertBefore(newEle, oldEle);
            return;
        }
        oldEle.parentNode.appendChild(newEle)
    }

    /**
     * @param {element} ele 元素
     * @param {container} container 容器
     * @returns 向容器的开头追加元素（重点）
     */
    function prepend(ele, container) {
        var firstElement = this.firstChild(ele);
        if (firstElement) {
            container.insertBefore(firstElement);
            return;
        }
        this.append(ele, container);
    }

    /**
     * @param {element} ele 元素
     * @param {class} name 类名
     * @returns 检测是否有指定的样式类名
     */
    function hasClass(ele, name) {
        var reg = new RegExp("(^| +)" + name + "( +|$)");
        return reg.test(ele.className);
    }

    /**
     * @param {element} ele 元素
     * @param {class} name 增加类名（支持增加多个）
     */
    function addClass(ele, name) {
        var arr = name.replace(/(^ +| +$)/g, "").split(/ +/g);
        for (var i = 0; i < arr.length; i++) {
            var curName = arr[i];
            if (!this.hasClass(ele, curName)) {
                ele.className += " " + curName;
            }
        }
    }

    /**
     * @param {element} ele 元素
     * @param {class} name 删除类名（支持删除多个）
     */
    function removeClass(ele, name) {
        var arr = name.replace(/(^ +| +$)/g, "").split(/ +/g);
        for (var i = 0; i < arr.length; i++) {
            var curName = arr[i];
            if (this.hasClass(ele, curName)) {
                var reg = new RegExp("(^| +)" + curName + "( +|$)", "g");
                ele.className = ele.className.replace(reg, " ");
            }
        }
    }

    /**
     * @param {class} name 类名
     * @param {context} container 上下文
     * @returns 通过元素的样式类名来获取元素
     */
    function byClass(name, container) {
        container = container || document;
        if (flag) {
            return this.listToArray(container.getElementsByClassName(name));
        }
        var arr = [];
        var nameArray = name.replace(/(^ +| +$)/g, "").split(/ +/g);
        var allTag = container.getElementsByTagName("*");
        for (var i = 0; i < allTag.length; i++) {
            var elementTag = allTag[i];
            var isOk = true;
            for (var k = 0; k < nameArray.length; k++) {
                var reg = new RegExp("(^| +)" + nameArray[k] + "( +|$)");
                if (!reg.test(elementTag.className)) {
                    isOk = false;
                    break;
                }
            }
            if (isOk) {
                arr[arr.length] = elementTag;
            }
        }
        return arr;
    }

    /**
     * @param {element} ele 元素
     * @param {style} attr 元素的样式名
     * @param {value} value 元素的样式值
     * @returns 设置样式
     */
    function setCss(ele, attr, value) {
        if (attr === "float") {
            ele.style.cssFloat = value;
            ele.style.styleFloat = value;
            return;
        }
        if (attr === "opacity") {
            ele.style.opacity = value;
            ele.style.filter = "alpha(opacity=" + value * 100 + ")"
            return;
        }
        // 加单位
        var reg = /^(width|height|top|bottom|left|right|((margin|padding)(top|bottom|left|right)?))$/;
        if (reg.test(attr)) {
            if (!isNaN(value)) {
                value += "px";
            }
        }
        ele.style[attr] = value;
    }

    /**
     * @param {element} ele 元素
     * @param {object} obj 对象
     * @returns 批量设置元素的样式
     */
    function setGroupCss(ele, options) {
        if (Object.prototype.toString.call(options) !== "[object Object]") {
            return;
        }
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                this.setCss(ele, key, options[key])
            }
        }
    }

    /**
     * @param {element} ele 元素
     * @returns 如果二个参数是字符串表示获取，如果第二个参数是对象表示设置多个，传递三个参数是设置单个，
     */
    function css(ele) {
        var argTwo = arguments[1];
        if (typeof argTwo === "string") {
            var argThree = arguments[2];
            if (typeof argThree === "undefined") {
                return this.getCss(ele, argTwo);
            }
            this.setCss(ele, argTwo, argThree)
        }
        if (Object.prototype.toString.call(argTwo) === "[object Object]") {
            this.setGroupCss(ele, argTwo);
        }
    }
    return {
        getCss: getCss,
        win: win,
        offset: offset,
        listToArray: listToArray,
        formatJson: formatJson,
        children: children,
        prev: prev,
        next: next,
        prevAll: prevAll,
        nextAll: nextAll,
        sibling: sibling,
        siblingAll: siblingAll,
        index: index,
        firstChild: firstChild,
        lastchild: lastchild,
        append: append,
        insertBefore: insertBefore,
        insertAfter: insertAfter,
        prepend: prepend,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        byClass: byClass,
        setCss: setCss,
        setGroupCss: setGroupCss,
        css: css
    }
})()