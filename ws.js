// view
var info = document.getElementById('info');
var rules = document.getElementById('rules');
var hairy = document.getElementById('hairy');
var lightnext = document.getElementById('lightnext');
var lightprev = document.getElementById('lightprev');
var sel = document.getSelection();
var commaSpaceBefore = /\s+,/mg;
var commaNoSpaceAfter = /,[^\s\n]/mg;
var commaNoSpaceAfterAllowDigit = /,[^\s\n\d]/mg;
var rx = [];
rx.push(commaSpaceBefore, commaNoSpaceAfter, commaNoSpaceAfterAllowDigit);
// detect pain spots
function spots(txt, rx) {
    //TODO handle null cases
    if (txt === null)
        return [];
    if (sel === null)
        return [];
    sel.removeAllRanges();
    var ff = [];
    ff.push.apply(ff, mistakes(rx, txt).filter(function (x) { return x.length; }));
    return ff;
}
function mistakes(rx, txt) {
    if (hairy.firstChild === null)
        [];
    var ff = [];
    var found;
    while ((found = rx.exec(txt)) != null) {
        ff.push(found);
    }
    return ff;
}
//TODO asign a type
var mistakes_one_by_one;
var make_mistakes_one_by_one = function (ff) {
    mistakes_one_by_one = ({
        curr: -1,
        ff: ff,
        next: function () {
            this.curr++;
            if (this.curr >= this.ff.length)
                this.curr = 0;
            return this.ff[this.curr];
        },
        prev: function () {
            this.curr--;
            if (this.curr <= -1)
                this.curr = this.ff.length - 1;
            return this.ff[this.curr];
        },
        len: function () {
            return this.ff.length;
        }
    });
};
function scrollhighlight(dir) {
    if (dir === void 0) { dir = 'next'; }
    if (!mistakes_one_by_one || mistakes_one_by_one.len() === 0)
        return;
    var found = dir === 'next' ? mistakes_one_by_one.next() : mistakes_one_by_one.prev();
    if (found === undefined)
        return;
    if (hairy === null)
        return;
    hairy.focus();
    sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
    hairy.scrollTop = 0;
    var fulltext = hairy.value;
    var indexend = found.index + found[0].length;
    // the trick
    hairy.value = fulltext.substring(0, indexend);
    var scrollTop = hairy.scrollHeight;
    hairy.scrollTop = scrollTop;
    hairy.value = fulltext;
    hairy.setSelectionRange(found.index, indexend);
}
function runtext() {
    var _a;
    var sel = document.getSelection();
    if (sel === null)
        return;
    sel.removeAllRanges();
    var rx_key = (_a = parseInt(rules.value)) !== null && _a !== void 0 ? _a : -1;
    if (rx_key === -1)
        return;
    if (!(rx_key in rx))
        return;
    make_mistakes_one_by_one(spots(hairy.value, rx[rx_key]));
}
rules.addEventListener('change', function (evt) {
    evt.preventDefault();
    if (rules.value === '-1')
        return;
    runtext();
});
lightnext.addEventListener('click', function (evt) {
    evt.preventDefault();
    scrollhighlight('next');
});
lightprev.addEventListener('click', function (evt) {
    evt.preventDefault();
    scrollhighlight('prev');
});
hairy.spellcheck = false;
hairy.addEventListener('change', function () {
    if (rules.value === '-1')
        return;
    runtext();
});
