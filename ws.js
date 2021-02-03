// view
var info = document.getElementById('info');
var rules = document.getElementById('rules');
var hairy = document.getElementById('hairy');
var lightnext = document.getElementById('lightnext');
var lightprev = document.getElementById('lightprev');
var sel = document.getSelection();
var commaSpaceBefore = /\s+,/mg;
var commaNoSpaceAfterNoDigit = /,[^\s\n\d]|(?<=[^\d]),(?=\d)/mg;
var commaSpaceBeforeInsideDigit = /(?<=\d)\s+,(?=\d)/mg;
var paranthesisWithSpace = /[\(\[]\s+|\s+[\)\]]/mg;
var exclamationQuestionWithSpaces = /\s+[\?\!]/mg;
var exclamationQuestionMoreThanTwo = /[\?\!]{3,}/mg;
var pointSeparated = /\s+\./mg;
var pointWithLetter = /\.[a-zA-ZîÎăĂâÂșȘțȚ]/g;
var pointSpacedAtEnd = /\.\s+\n/mg;
var pointDecimalMustBeComma = /(?<=\d)\.(?=\d)/g;
var pointDecimalSpacedInsideDigit = /(?<=\d)\s+\.(?=\d)|(?<=\d)\.\s+(?=\d)|(?<=\d)\s+\.\s+(?=\d)/mg;
var twopointsSpacedBefore = /\s+\:/g;
var twopointsSpacedAfter = /\:\s{2,}|\:\s+$/g;
var twopointsNoSpace = /(?<=[^\s])\:(?=[^\s])/g;
var apostropheWithSpace = /\s+\'\s+|\s+\'|\'\s+/g;
var apostropheMultiple = /\'{2,}/g;
var quotationMarkStraight = /"/mg;
var quotationMarkSimulated = /,{2,}/g;
var quotationMarkBeginUpper = /\u201C(?=[^\u201D]+\u201D)/mg;
var spaceStartParagraph = /^\s+/mg;
var spaceEndParagraph = /\s+$/mg;
var spaceMultiple = /[^\S\r\n]{2,}/g;
var emptyParagraph = /^\n/mg;
var rx = [];
// order matters, it mirrors those existent on html source
rx.push(commaSpaceBefore, commaNoSpaceAfterNoDigit, commaSpaceBeforeInsideDigit, paranthesisWithSpace, exclamationQuestionWithSpaces, exclamationQuestionMoreThanTwo, pointSeparated, pointWithLetter, pointSpacedAtEnd, pointDecimalMustBeComma, pointDecimalSpacedInsideDigit, twopointsSpacedBefore, twopointsSpacedAfter, twopointsNoSpace, apostropheWithSpace, apostropheMultiple, quotationMarkStraight, quotationMarkSimulated, quotationMarkBeginUpper, spaceStartParagraph, spaceEndParagraph, spaceMultiple, emptyParagraph);
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
    info.textContent = mistakes_one_by_one.len() + " erori - te afli la #" + (mistakes_one_by_one.curr + 1);
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
        return 0;
    sel.removeAllRanges();
    var rx_key = (_a = parseInt(rules.value)) !== null && _a !== void 0 ? _a : -1;
    if (rx_key === -1)
        return 0;
    if (!(rx_key in rx))
        return 0;
    make_mistakes_one_by_one(spots(hairy.value, rx[rx_key]));
    var num = mistakes_one_by_one.len();
    info.textContent = "s-au g\u0103sit " + num + " erori";
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
    if (rules.value === '-1')
        return;
    var found = runtext();
    if (found > 0) {
        usable(true);
        lightnext.click();
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
hairy.addEventListener('change', function () {
    if (rules.value === '-1')
        return;
    usable(false);
    var found = runtext();
    if (found > 0)
        usable(true);
});
usable(false);
