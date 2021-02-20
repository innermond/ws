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
    var out = ((v - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
    return out;
}
// quotation errors
var ErrQuotation;
(function (ErrQuotation) {
    ErrQuotation[ErrQuotation["NotPositive"] = 1] = "NotPositive";
    ErrQuotation[ErrQuotation["NotInteger"] = 2] = "NotInteger";
})(ErrQuotation || (ErrQuotation = {}));
// check if a TryQuotation has failed and is, actually an error
function is_err(err) {
    return err.length > 0;
}
// calculating price
// modelated to accept spreading array of parameters
function quota() {
    var _a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _a[_i] = arguments[_i];
    }
    var num = _a[0], peak = _a[1], span = _a[2], hours = _a[3], price = _a[4], tr = _a[5];
    var errs = [];
    if (num < 0)
        errs.push(ErrQuotation.NotPositive);
    if (Math.floor(num) != num)
        errs.push(ErrQuotation.NotInteger);
    //  TryQuotation as it's ErrQuotation[] side
    if (errs.length)
        return errs;
    // zero case
    if (num === 0)
        return { num: 0, time: dh(0), price: 0 };
    // happy path onward
    var ratio = peak / num;
    var atenuation = scale.apply(void 0, __spreadArrays([ratio], tr));
    price = (num / span) * price * atenuation;
    var d = Math.ceil((hours / ratio) * atenuation);
    var time = dh(d);
    // TryQuotation as it's Quotation side
    return { num: num, time: time, price: price };
}
// utility functions to shape price calculation
// for various type of works
// text only
function txt(num) {
    return quota(num, 45000, 300, 7 * 8, 0.65, [0, 1, 0.75, 1]);
}
// images
function img(num) {
    return quota(num, 10, 5, 2, 5, [0, 1, 0.8, 1]);
}
// lists
function lst(num) {
    return quota(num, 10, 5, 2, 5, [0, 1, 0.9, 1]);
}
// tables
function tbl(num) {
    return quota(num, 4, 2, 2, 4, [0, 1, 1, 1]);
}
//type Section = 'text',  'pictures' | 'lists' | 'tables';
var sections = ['text', 'pictures', 'lists', 'tables'];
function is_section(k) {
    return sections.includes(k);
}
function is_quotation_summary(r) {
    var q = r;
    return q.price !== undefined && q.time !== undefined;
}
// it gives a PriceResult either a ErrQuotationSummary
// or a complete QuotationSummary
function price(txt_num, img_num, lst_num, tbl_num) {
    if (txt_num === void 0) { txt_num = 0; }
    if (img_num === void 0) { img_num = 0; }
    if (lst_num === void 0) { lst_num = 0; }
    if (tbl_num === void 0) { tbl_num = 0; }
    // errors to happend on validation
    var errs = new Map();
    // start calculation/validation
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
    // end calculation/validation
    // PriceResult as ErrQuotationSummary
    if (errs.size)
        return errs;
    // initial state for calculation
    var price = 0.0;
    var time = 0.0;
    var out = {};
    // grab all interested calculations as a map of done TryQuotations
    // turned Quotations
    var qq = {
        text: text,
        pictures: pictures,
        lists: lists,
        tables: tables
    };
    // calculate total and collect all TryQuotation turned valid Quotation
    // to return a PriceResult as QuotationSummary
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
// UI
var $txt = document.getElementById('price-txt');
var $img = document.getElementById('price-img');
var $lst = document.getElementById('price-lst');
var $tbl = document.getElementById('price-tbl');
[$txt, $img, $lst, $tbl].forEach(function ($input) {
    $input.addEventListener('input', function () {
        var result = price(parseFloat($txt.value), parseFloat($img.value), parseFloat($lst.value), parseFloat($tbl.value));
        // ok branch
        if (is_quotation_summary(result)) {
            //result = (result as QuotationSummary);
            for (var k in result) {
                if (!is_section(k))
                    continue;
                console.log(result[k]);
            }
        }
        else {
            // error happened
        }
        console.log(result);
    });
});
/*[[-10, 0, 10, 3], [25000, 10, 5, 10]].forEach((pp) => {
    const p = price(...pp);
    console.log(p);
});

interface QuotationFunc {
    (num: number): TryQuotation;
}
function testprice(vv:number[], fnfn: QuotationFunc[]): void {
    vv.forEach(v => {
        fnfn.forEach(fn => {
            const q: TryQuotation = fn(v);
            if (is_err(q)) {
                console.log(q);
                return;
            }
            console.log('words: ', v, 'quotation: ', q);
        })
    })
}*/
//testprice([45000, 0, 1, 100, 1000, 5000, 22500, 45000, 90000], [txt]);
//testprice([1, 5, 10, 15, 30], [img]);
//testprice([1, 5, 10, 15, 30], [lst]);
//testprice([1, 5, 10, 15, 30], [tbl]);
