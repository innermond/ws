"use strict";
// view
const info = document.getElementById('info');
const rules = document.getElementById('rules');
const hairy = document.getElementById('hairy');
const lightnext = document.getElementById('lightnext');
const lightprev = document.getElementById('lightprev');
const sel = document.getSelection();
const commaSpaceBefore = /\s+,/mg;
const commaNoSpaceAfter = /,[^\s\n]/mg;
const commaNoSpaceAfterAllowDigit = /,[^\s\n\d]/mg;
const rx = [];
rx.push(commaSpaceBefore, commaNoSpaceAfter, commaNoSpaceAfterAllowDigit);
// detect pain spots
function spots(txt, rx) {
    //TODO handle null cases
    if (txt === null)
        return [];
    if (sel === null)
        return [];
    sel.removeAllRanges();
    const ff = [];
    ff.push(...mistakes(rx, txt).filter(x => x.length));
    return ff;
}
function mistakes(rx, txt) {
    if (hairy.firstChild === null)
        [];
    let ff = [];
    let found;
    while ((found = rx.exec(txt)) != null) {
        ff.push(found);
    }
    return ff;
}
//TODO asign a type
let mistakes_one_by_one;
const make_mistakes_one_by_one = (ff) => {
    mistakes_one_by_one = ({
        curr: -1,
        ff,
        next() {
            this.curr++;
            if (this.curr >= this.ff.length)
                this.curr = 0;
            return this.ff[this.curr];
        },
        prev() {
            this.curr--;
            if (this.curr <= -1)
                this.curr = this.ff.length - 1;
            return this.ff[this.curr];
        },
        len() {
            return this.ff.length;
        },
    });
};
function scrollhighlight(dir = 'next') {
    if (!mistakes_one_by_one || mistakes_one_by_one.len() === 0)
        return;
    console.log(mistakes_one_by_one.len(), mistakes_one_by_one.curr);
    const found = dir === 'next' ? mistakes_one_by_one.next() : mistakes_one_by_one.prev();
    if (found === undefined)
        return;
    if (hairy === null)
        return;
    info.textContent = `s-au găsit ${mistakes_one_by_one.len()} erori - te afli la #${mistakes_one_by_one.curr + 1}`;
    hairy.focus();
    sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
    hairy.scrollTop = 0;
    const fulltext = hairy.value;
    const indexend = found.index + found[0].length;
    // the trick
    hairy.value = fulltext.substring(0, indexend);
    const scrollTop = hairy.scrollHeight;
    hairy.scrollTop = scrollTop;
    hairy.value = fulltext;
    hairy.setSelectionRange(found.index, indexend);
}
function runtext() {
    var _a;
    const sel = document.getSelection();
    if (sel === null)
        return;
    sel.removeAllRanges();
    const rx_key = (_a = parseInt(rules.value)) !== null && _a !== void 0 ? _a : -1;
    if (rx_key === -1)
        return;
    if (!(rx_key in rx))
        return;
    make_mistakes_one_by_one(spots(hairy.value, rx[rx_key]));
    info.textContent = `s-au găsit ${mistakes_one_by_one.len()} erori`;
}
rules.addEventListener('change', (evt) => {
    evt.preventDefault();
    if (rules.value === '-1')
        return;
    runtext();
});
lightnext.addEventListener('click', (evt) => {
    evt.preventDefault();
    scrollhighlight('next');
});
lightprev.addEventListener('click', (evt) => {
    evt.preventDefault();
    scrollhighlight('prev');
});
hairy.spellcheck = false;
hairy.addEventListener('change', () => {
    if (rules.value === '-1')
        return;
    runtext();
});
