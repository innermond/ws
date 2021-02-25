"use strict";
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
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
function scale(v, in_min, in_max, out_min, out_max) {
    var out = ((v - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
    return out;
}
var ErrQuotation;
(function (ErrQuotation) {
    ErrQuotation[ErrQuotation["NotPositive"] = 1] = "NotPositive";
    ErrQuotation[ErrQuotation["NotInteger"] = 2] = "NotInteger";
})(ErrQuotation || (ErrQuotation = {}));
function is_err(err) {
    return err.length > 0;
}
function quota() {
    var _a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _a[_i] = arguments[_i];
    }
    var _b = __read(_a, 6), num = _b[0], peak = _b[1], span = _b[2], hours = _b[3], price = _b[4], tr = _b[5];
    var errs = [];
    if (num < 0)
        errs.push(ErrQuotation.NotPositive);
    if (Math.floor(num) != num)
        errs.push(ErrQuotation.NotInteger);
    if (errs.length)
        return errs;
    if (num === 0)
        return { num: 0, time: dh(0), price: 0 };
    var ratio = peak / num;
    var atenuation = scale.apply(void 0, __spread([ratio], tr));
    price = (num / span) * price * atenuation;
    var d = Math.ceil((hours / ratio) * atenuation);
    var time = dh(d);
    return { num: num, time: time, price: price };
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
var sections = ['text', 'pictures', 'lists', 'tables'];
function is_section(k) {
    return sections.includes(k);
}
function is_quotation_summary(r) {
    var q = r;
    return q.price !== undefined && q.time !== undefined;
}
function price(txt_num, img_num, lst_num, tbl_num) {
    if (txt_num === void 0) { txt_num = 0; }
    if (img_num === void 0) { img_num = 0; }
    if (lst_num === void 0) { lst_num = 0; }
    if (tbl_num === void 0) { tbl_num = 0; }
    var errs = new Map();
    var text = txt(txt_num);
    if (is_err(text))
        errs.set('text', text);
    var pictures = img(img_num);
    if (is_err(pictures))
        errs.set('pictures', pictures);
    var lists = lst(lst_num);
    if (is_err(lists))
        errs.set('lists', lists);
    var tables = tbl(tbl_num);
    if (is_err(tables))
        errs.set('tables', tables);
    if (errs.size)
        return errs;
    var price = 0.0;
    var time = 0.0;
    var out = {};
    var qq = {
        text: text,
        pictures: pictures,
        lists: lists,
        tables: tables
    };
    for (var k in qq) {
        var s = k;
        var q = qq[s];
        var tm = undh(q.time);
        price += q.price;
        time += tm;
        out[s] = q;
    }
    return __assign(__assign({}, out), { price: price, time: dh(time) });
}
var twin_summary = new Map([
    ['price-txt', 'text'],
    ['price-img', 'pictures'],
    ['price-lst', 'lists'],
    ['price-tbl', 'tables'],
]);
var CURRENCY = 'EUR';
var $txt = document.getElementById('price-txt');
var $img = document.getElementById('price-img');
var $lst = document.getElementById('price-lst');
var $tbl = document.getElementById('price-tbl');
var $total = document.getElementById('price-total');
var $time = document.getElementById('time-total');
[$txt, $img, $lst, $tbl].forEach(function ($input) {
    $input.addEventListener('input', price_calculate);
});
function price_calculate() {
    var result = price(parseFloat($txt.value), parseFloat($img.value), parseFloat($lst.value), parseFloat($tbl.value));
    if (!is_quotation_summary(result))
        return;
    var $twins = document.querySelectorAll('p[data-twin]');
    $twins.forEach(function ($twin) {
        var _a;
        var twin = (_a = $twin.dataset) === null || _a === void 0 ? void 0 : _a.twin;
        if (typeof twin === 'undefined')
            return;
        if (!twin_summary.has(twin))
            return;
        var s = twin_summary.get(twin);
        if (!is_section(s))
            return;
        var ss = result[s];
        $twin.innerHTML = "pre\u021B " + ss.price.toFixed(2) + " " + CURRENCY + "/timp: " + ss.time.days + " zile " + ss.time.hours + " ore";
    });
    $total.innerHTML = result.price.toFixed(2) + " " + CURRENCY;
    $time.innerHTML = result.time.days + " zile " + result.time.hours + " ore";
}
price_calculate();
//# sourceMappingURL=pret.js.map