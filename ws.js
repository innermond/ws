"use strict";
// view
const info = document.getElementById('info');
const rules = document.getElementById('rules');
const hairy = document.getElementById('hairy');
const lightnext = document.getElementById('lightnext');
const lightprev = document.getElementById('lightprev');
const sel = document.getSelection();
//TODO check the need for min regex //mg
const commaSpaceBefore = /\s+(?=,)/g;
const commaNoSpaceAfterNoDigit = /,(?=[^\s\n\d])|(?<=[^\d]),(?=\d)/g;
const commaSpaceBeforeInsideDigit = /(?<=\d)\s+,(?=\d)/g;
const paranthesisSpaceInternal = /[\(\[]\s+|\s+[\)\]]/g;
const paranthesisSpaceExternal = /(?<=\S)[\(\[]|[\)\]](?=[a-zA-Z0-9îÎăĂâÂșȘțȚ])/g;
const exclamationQuestionWithSpaces = /\s+[\?\!]/g;
const exclamationQuestionMoreThanTwo = /[\?\!]{3,}/g;
const pointSeparated = /\s+\./g;
const pointWithLetter = /\.[a-zA-ZîÎăĂâÂșȘțȚ]/g;
const pointSpacedAtEnd = /\.\s+\n/mg;
const pointDecimalMustBeComma = /(?<=\d)\.(?=\d)/g;
const pointDecimalSpacedInsideDigit = /(?<=\d)\s+\.(?=\d)|(?<=\d)\.\s+(?=\d)|(?<=\d)\s+\.\s+(?=\d)/g;
const twopointsSpacedBefore = /\s+\:/g;
const twopointsSpacedAfter = /\:\s{2,}|\:\s+$/g;
const twopointsNoSpace = /(?<=[^\s])\:(?=[^\s])/g;
const suspensionSpaceBefore = /\s+(?=\.{3})/g;
const suspensionSpaceAfterMissing = /(?<=\.{2})\.(?!\s)[^$]/g;
const suspensionNumber = /(?<!\.)\.{2}(?!\.)|\.{4,}/g;
const suspensionSpaceInside = /(?<=\.)\s+(?=\.)/g;
const suspensionSpaceAfter = /(?<=[^\s]|^)(?<=\.{3})(\s+$|\s{2,}(?=[^$]))/g;
// here, multiline flag is needed
const dialogSpaceBefore = /^\s+(?=[\u002d\u2010\u2011\u2012\u2013\u2014\u2015])/mg;
const dialogSpaceAfter = /(?<=^\s*[\u002d\u2010\u2011\u2012\u2013\u2014\u2015])\s{2,}/mg;
const dialogNoSpaceAfter = /(?<=^\s*)[\u002d\u2010\u2011\u2012\u2013\u2014\u2015](?=\S)/mg;
const dialogIllegalSign = /(?<=^\s*)[\u002d\u2010\u2011\u2012\u2013\u2014]/mg;
const obliqueBar = /\s+\/|\/\s+/g;
const apostropheWithSpace = /\s+\'\s+|\s+\'|\'\s+/g;
const apostropheMultiple = /\'{2,}/g;
const quotationMarkStraight = /"/g;
const quotationMarkSimulated = /,{2,}/g;
const quotationMarkBeginUpper = /\u201C(?=[^\u201D]+\u201D)/g;
const spaceStartParagraph = /^\s+/mg;
const spaceEndParagraph = /(?<!\n)\s+$/mg;
const spaceMultiple = /[^\S\r\n]{2,}/g;
const emptyParagraph = /^\n/mg;
const rx = [];
// order matters, it mirrors those existent on html source
rx.push(commaSpaceBefore, commaNoSpaceAfterNoDigit, commaSpaceBeforeInsideDigit, paranthesisSpaceInternal, paranthesisSpaceExternal, exclamationQuestionWithSpaces, exclamationQuestionMoreThanTwo, pointSeparated, pointWithLetter, pointSpacedAtEnd, pointDecimalMustBeComma, pointDecimalSpacedInsideDigit, twopointsSpacedBefore, twopointsSpacedAfter, twopointsNoSpace, suspensionSpaceBefore, suspensionSpaceAfterMissing, suspensionNumber, suspensionSpaceInside, suspensionSpaceAfter, dialogSpaceBefore, dialogSpaceAfter, dialogNoSpaceAfter, dialogIllegalSign, obliqueBar, apostropheWithSpace, apostropheMultiple, quotationMarkStraight, quotationMarkSimulated, quotationMarkBeginUpper, spaceStartParagraph, spaceEndParagraph, spaceMultiple, emptyParagraph);
// detect pain spots
function spots(txt, rx) {
    //TODO handle null cases
    if (txt === null)
        return [];
    if (sel === null)
        return [];
    //sel.removeAllRanges();
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
function showerr() {
    let numerr = mistakes_one_by_one.len();
    const curr = mistakes_one_by_one.curr + 1;
    switch (numerr) {
        case 0:
            numerr = '<strong>arată bine</strong>—alege acum altă verificare';
            break;
        case 1:
            numerr = '<strong>o atenționare</strong>';
            break;
        default:
            numerr = `<strong>${numerr} atenționări</strong>`;
            if (curr > 0) {
                numerr += ` -  te afli la <strong>#${curr}</strong>`;
            }
    }
    info.innerHTML = numerr;
}
function scrollhighlight(dir = 'next') {
    if (!mistakes_one_by_one || mistakes_one_by_one.len() === 0)
        return;
    const found = dir === 'next' ? mistakes_one_by_one.next() : mistakes_one_by_one.prev();
    showerr();
    if (found === undefined)
        return;
    if (hairy === null)
        return;
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
function runtext(clearRanges = true) {
    var _a;
    const sel = document.getSelection();
    if (sel === null)
        return 0;
    if (clearRanges)
        sel.removeAllRanges();
    const rx_key = (_a = parseInt(rules.value)) !== null && _a !== void 0 ? _a : -1;
    if (rx_key === -1)
        return 0;
    if (!(rx_key in rx))
        return 0;
    make_mistakes_one_by_one(spots(hairy.value, rx[rx_key]));
    const num = mistakes_one_by_one.len();
    return num;
}
function usable(mode = true, inx = -1) {
    let xx = [lightprev, lightnext];
    if (0 <= inx && inx < xx.length) {
        xx = [xx[inx]];
    }
    xx.forEach((el) => {
        el.disabled = !mode;
    });
}
rules.addEventListener('change', (evt) => {
    evt.preventDefault();
    usable(false);
    if (rules.value === '-1') {
        info.textContent = '';
        return;
    }
    const found = runtext();
    if (found > 0) {
        usable(true);
        lightnext.click();
    }
    else {
        showerr();
    }
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
hairy.addEventListener('keyup', (evt) => {
    if (evt.target !== hairy)
        return;
    if (rules.value === '-1')
        return;
    usable(false);
    const found = runtext(false);
    if (found > 0)
        usable(true);
    showerr();
});
usable(false);
//# sourceMappingURL=ws.js.map