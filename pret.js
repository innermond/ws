var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
function dh(d) {
    var hours = d % 8;
    var days = (d - hours) / 8;
    days += Math.floor(hours / 8);
    hours = hours % 8;
    return { days: days, hours: hours };
}
function undh(dt) {
    var d = dt.days, h = dt.hours;
    return d * 8 + h;
}
// scale val between intervals
function scale(v, in_min, in_max, out_min, out_max) {
    var out = (v - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    return out;
}
function quota(num, peak, span, hours, price, tr) {
    // only positives
    if (num <= 0)
        return new Error('only positive numbers');
    var ratio = peak / num;
    var atenuation = scale.apply(void 0, __spreadArrays([ratio], tr));
    price = (num / span) * price * atenuation;
    var d = Math.ceil((hours / ratio * atenuation));
    var time = dh(d);
    return { time: time, price: price };
}
function txt(num) {
    return quota(num, 45000, 300, 7 * 8, 0.65, [0, 1, 0.75, 1]);
}
function img(num) {
    return quota(num, 10, 5, 2, 5, [0, 1, 0.8, 1]);
}
function lst(num) {
    return quota(num, 10, 5, 2, 5, [0, 1, 0.9, 1]);
}
function tbl(num) {
    return quota(num, 4, 2, 2, 4, [0, 1, 1, 1]);
}
function price(txt_num, img_num, lst_num, tbl_num) {
    var qq = {
        text: {},
        pictures: {},
        lists: {},
        tables: {}
    };
    if (txt_num)
        qq.text = txt(txt_num);
    if (img_num)
        qq.pictures = img(img_num);
    if (lst_num)
        qq.lists = lst(lst_num);
    if (tbl_num)
        qq.tables = tbl(tbl_num);
    var price = 0.0;
    var time = 0.0;
    var out = {};
    for (var k in qq) {
        var s = k;
        var q = qq[s];
        var err = q;
        if (err) {
            continue;
        }
        ;
        q = q;
        var tm = undh(q.time);
        price += q.price;
        time += tm;
        out[s] = q;
    }
    ;
    return __assign(__assign({}, out), { price: price, time: dh(time) });
}
function testprice(vv, fnfn) {
    vv.forEach(function (v) {
        fnfn.forEach(function (fn) {
            var q = fn(v);
            if (q) {
                console.log(q);
                return;
            }
            console.log('words: ', v, 'quotation: ', q);
        });
    });
}
testprice([45000, 0, 1, 100, 1000, 5000, 22500, 45000, 90000], [txt]);
//testprice([1, 5, 10, 15, 30], [img]);
//testprice([1, 5, 10, 15, 30], [lst]);
//testprice([1, 5, 10, 15, 30], [tbl]);
