"use strict";
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
var info = document.getElementById('info');
var rules = document.getElementById('rules');
var hairy = document.getElementById('hairy');
var lightnext = document.getElementById('lightnext');
var lightprev = document.getElementById('lightprev');
var sel = document.getSelection();
var commaSpaceBefore = /\s+(?=,)/g;
var commaNoSpaceAfterNoDigit = /,(?=[^\s\n\d])|(?<=[^\d]),(?=\d)/g;
var commaSpaceBeforeInsideDigit = /(?<=\d)\s+,(?=\d)/g;
var paranthesisSpaceInternal = /[\(\[]\s+|\s+[\)\]]/g;
var paranthesisSpaceExternal = /(?<=\S)[\(\[]|[\)\]](?=[a-zA-Z0-9îÎăĂâÂșȘțȚ])/g;
var exclamationQuestionWithSpaces = /\s+[\?\!]/g;
var exclamationQuestionMoreThanTwo = /[\?\!]{3,}/g;
var pointSeparated = /\s+\./g;
var pointWithLetter = /\.[a-zA-ZîÎăĂâÂșȘțȚ]/g;
var pointSpacedAtEnd = /\.\s+\n/mg;
var pointDecimalMustBeComma = /(?<=\d)\.(?=\d)/g;
var pointDecimalSpacedInsideDigit = /(?<=\d)\s+\.(?=\d)|(?<=\d)\.\s+(?=\d)|(?<=\d)\s+\.\s+(?=\d)/g;
var twopointsSpacedBefore = /\s+\:/g;
var twopointsSpacedAfter = /\:\s{2,}|\:\s+$/g;
var twopointsNoSpace = /(?<=[^\s])\:(?=[^\s])/g;
var suspensionSpaceBefore = /\s+(?=\.{3})/g;
var suspensionSpaceAfterMissing = /(?<=\.{2})\.(?!\s)[^$]/g;
var suspensionNumber = /(?<!\.)\.{2}(?!\.)|\.{4,}/g;
var suspensionSpaceInside = /(?<=\.)\s+(?=\.)/g;
var suspensionSpaceAfter = /(?<=[^\s]|^)(?<=\.{3})(\s+$|\s{2,}(?=[^$]))/g;
var dialogSpaceBefore = /^\s+(?=[\u002d\u2010\u2011\u2012\u2013\u2014\u2015])/mg;
var dialogSpaceAfter = /(?<=^\s*[\u002d\u2010\u2011\u2012\u2013\u2014\u2015])\s{2,}/mg;
var dialogNoSpaceAfter = /(?<=^\s*)[\u002d\u2010\u2011\u2012\u2013\u2014\u2015](?=\S)/mg;
var dialogIllegalSign = /(?<=^\s*)[\u002d\u2010\u2011\u2012\u2013\u2014]/mg;
var obliqueBar = /\s+\/|\/\s+/g;
var apostropheWithSpace = /\s+\'\s+|\s+\'|\'\s+/g;
var apostropheMultiple = /\'{2,}/g;
var quotationMarkStraight = /"/g;
var quotationMarkSimulated = /,{2,}/g;
var quotationMarkBeginUpper = /\u201C(?=[^\u201D]+\u201D)/g;
var spaceStartParagraph = /^\s+/mg;
var spaceEndParagraph = /(?<!\n)\s+$/mg;
var spaceMultiple = /[^\S\r\n]{2,}/g;
var emptyParagraph = /^\n/mg;
var rx = [];
rx.push(commaSpaceBefore, commaNoSpaceAfterNoDigit, commaSpaceBeforeInsideDigit, paranthesisSpaceInternal, paranthesisSpaceExternal, exclamationQuestionWithSpaces, exclamationQuestionMoreThanTwo, pointSeparated, pointWithLetter, pointSpacedAtEnd, pointDecimalMustBeComma, pointDecimalSpacedInsideDigit, twopointsSpacedBefore, twopointsSpacedAfter, twopointsNoSpace, suspensionSpaceBefore, suspensionSpaceAfterMissing, suspensionNumber, suspensionSpaceInside, suspensionSpaceAfter, dialogSpaceBefore, dialogSpaceAfter, dialogNoSpaceAfter, dialogIllegalSign, obliqueBar, apostropheWithSpace, apostropheMultiple, quotationMarkStraight, quotationMarkSimulated, quotationMarkBeginUpper, spaceStartParagraph, spaceEndParagraph, spaceMultiple, emptyParagraph);
function spots(txt, rx) {
    if (txt === null)
        return [];
    if (sel === null)
        return [];
    var ff = [];
    ff.push.apply(ff, __spread(mistakes(rx, txt).filter(function (x) { return x.length; })));
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
function showerr() {
    var numerr = mistakes_one_by_one.len();
    var curr = mistakes_one_by_one.curr + 1;
    switch (numerr) {
        case 0:
            numerr = '<strong>arată bine</strong>—alege acum altă verificare';
            break;
        case 1:
            numerr = '<strong>o atenționare</strong>';
            break;
        default:
            numerr = "<strong>" + numerr + " aten\u021Bion\u0103ri</strong>";
            if (curr > 0) {
                numerr += " -  te afli la <strong>#" + curr + "</strong>";
            }
    }
    info.innerHTML = numerr;
}
function scrollhighlight(dir) {
    if (dir === void 0) { dir = 'next'; }
    if (!mistakes_one_by_one || mistakes_one_by_one.len() === 0)
        return;
    var found = dir === 'next' ? mistakes_one_by_one.next() : mistakes_one_by_one.prev();
    showerr();
    if (found === undefined)
        return;
    if (hairy === null)
        return;
    hairy.focus();
    sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
    hairy.scrollTop = 0;
    var fulltext = hairy.value;
    var indexend = found.index + found[0].length;
    hairy.value = fulltext.substring(0, indexend);
    var scrollTop = hairy.scrollHeight;
    hairy.scrollTop = scrollTop;
    hairy.value = fulltext;
    hairy.setSelectionRange(found.index, indexend);
}
function runtext(clearRanges) {
    var _a;
    if (clearRanges === void 0) { clearRanges = true; }
    var sel = document.getSelection();
    if (sel === null)
        return 0;
    if (clearRanges)
        sel.removeAllRanges();
    var rx_key = (_a = parseInt(rules.value)) !== null && _a !== void 0 ? _a : -1;
    if (rx_key === -1)
        return 0;
    if (!(rx_key in rx))
        return 0;
    make_mistakes_one_by_one(spots(hairy.value, rx[rx_key]));
    var num = mistakes_one_by_one.len();
    return num;
}
function usable(mode, inx) {
    if (mode === void 0) { mode = true; }
    if (inx === void 0) { inx = -1; }
    var xx = [lightprev, lightnext];
    if (0 <= inx && inx < xx.length) {
        xx = [xx[inx]];
    }
    xx.forEach(function (el) {
        el.disabled = !mode;
    });
}
rules.addEventListener('change', function (evt) {
    evt.preventDefault();
    usable(false);
    if (rules.value === '-1') {
        info.textContent = '';
        return;
    }
    var found = runtext();
    if (found > 0) {
        usable(true);
        lightnext.click();
    }
    else {
        showerr();
    }
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
hairy.addEventListener('keyup', function (evt) {
    if (evt.target !== hairy)
        return;
    if (rules.value === '-1')
        return;
    usable(false);
    var found = runtext(false);
    if (found > 0)
        usable(true);
    showerr();
});
usable(false);
//# sourceMappingURL=ws.js.map