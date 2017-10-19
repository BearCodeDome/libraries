(function () {
    var animation = {
        /**
         * @param {any} t 当前运动时间
         * @param {any} b 起始位置
         * @param {any} c 中距离
         * @param {any} d 总时间
         * @returns 
         */
        linear: function (t, b, c, d) {
            return c * t / d + b
        }
    }

    /**
     * @param {any} ele 元素
     * @param {any} target 目标位置
     * @param {any} duration 动画所需时间
     */
    function move(ele, target, duration, callback) {
        window.clearInterval(ele.animate);
        var change = {};
        var start = {}
        for (var key in target) {
            if (target.hasOwnProperty(key)) {
                var end = target[key];
                start[key] = utils.css(ele, key);
                change[key] = end - start[key];
            }
        }
        var time = 0;
        ele.animate = window.setInterval(function () {
            time += 10;
            if (time >= duration) {
                utils.css(ele, target);
                window.clearInterval(ele.animate);
                callback && callback.call(ele)
                return;
            }
            for (var key in target) {
                if (target.hasOwnProperty(key)) {
                    var element = target[key];
                    var currentAttr = animation.linear(time, start[key], change[key], duration);
                    utils.css(ele, key, currentAttr);
                }
            }
        }, 10)
    }

    window.myanimation = move;
})()