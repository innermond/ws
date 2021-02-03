// view
const info = document.getElementById('info') as HTMLDivElement;
const rules = document.getElementById('rules') as HTMLSelectElement;
const hairy = document.getElementById('hairy') as HTMLTextAreaElement;
const lightnext = document.getElementById('lightnext') as HTMLButtonElement;
const lightprev = document.getElementById('lightprev') as HTMLButtonElement;

const sel: Selection | null = document.getSelection();

const commaSpaceBefore: RegExp = /\s+,/mg;
const commaNoSpaceAfterNoDigit: RegExp = /,[^\s\n\d]|(?<=[^\d]),(?=\d)/mg;
const commaSpaceBeforeInsideDigit: RegExp = /(?<=\d)\s+,(?=\d)/mg;

const paranthesisWithSpace: RegExp = /[\(\[]\s+|\s+[\)\]]/mg;

const exclamationQuestionWithSpaces: RegExp = /\s+[\?\!]/mg;
const exclamationQuestionMoreThanTwo: RegExp = /[\?\!]{3,}/mg;

const pointSeparated: RegExp = /\s+\./mg;
const pointWithLetter: RegExp = /\.[a-zA-ZîÎăĂâÂșȘțȚ]/g;
const pointSpacedAtEnd: RegExp = /\.\s+\n/mg;
const pointDecimalMustBeComma: RegExp = /(?<=\d)\.(?=\d)/g;
const pointDecimalSpacedInsideDigit: RegExp = /(?<=\d)\s+\.(?=\d)|(?<=\d)\.\s+(?=\d)|(?<=\d)\s+\.\s+(?=\d)/mg;

const twopointsSpacedBefore: RegExp = /\s+\:/g;
const twopointsSpacedAfter: RegExp = /\:\s{2,}|\:\s+$/g;
const twopointsNoSpace: RegExp = /(?<=[^\s])\:(?=[^\s])/g;

const apostropheWithSpace: RegExp = /\s+\'\s+|\s+\'|\'\s+/g;
const apostropheMultiple: RegExp = /\'{2,}/g;

const quotationMarkStraight: RegExp = /"/mg;
const quotationMarkSimulated: RegExp = /,{2,}/g;
const quotationMarkBeginUpper: RegExp = /\u201C(?=[^\u201D]+\u201D)/mg;

const spaceStartParagraph: RegExp = /^\s+/mg;
const spaceEndParagraph: RegExp = /\s+$/mg;
const spaceMultiple: RegExp = /[^\S\r\n]{2,}/g;
const emptyParagraph: RegExp = /^\n/mg;

const rx: Array<RegExp> = [];
// order matters, it mirrors those existent on html source
rx.push(
	commaSpaceBefore, commaNoSpaceAfterNoDigit, commaSpaceBeforeInsideDigit,
	paranthesisWithSpace,
	exclamationQuestionWithSpaces, exclamationQuestionMoreThanTwo,
	pointSeparated, pointWithLetter, pointSpacedAtEnd, pointDecimalMustBeComma,pointDecimalSpacedInsideDigit,
	twopointsSpacedBefore, twopointsSpacedAfter, twopointsNoSpace,
	apostropheWithSpace, apostropheMultiple,
	quotationMarkStraight, quotationMarkSimulated, quotationMarkBeginUpper,
	spaceStartParagraph, spaceEndParagraph, spaceMultiple, emptyParagraph,
);
// detect pain spots
function spots(txt: string | null, rx: RegExp): Array<RegExpExecArray> {
//TODO handle null cases
    if (txt === null) return [];
    if (sel === null) return [];

    sel.removeAllRanges();

    const ff: Array<RegExpExecArray> = [];
    ff.push(...mistakes(rx, txt).filter(x => x.length));

    return ff;
}

function mistakes(rx: RegExp, txt: string): Array<RegExpExecArray> {
    if (hairy.firstChild === null) [];
    let ff: Array<RegExpExecArray> = [];
    let found: RegExpExecArray | null;
    while ((found = rx.exec(txt)) != null) {
        ff.push(found);
    }

    return ff;
}

//TODO asign a type
let mistakes_one_by_one: any;
const make_mistakes_one_by_one = (ff: Array<RegExpExecArray>) => {
    mistakes_one_by_one = ({
    curr: -1,
    ff,
    next() {
        this.curr++;
        if (this.curr >= this.ff.length) this.curr = 0;
        return this.ff[this.curr];
    },
    prev() {
        this.curr--;
        if (this.curr <= -1) this.curr = this.ff.length -1;
        return this.ff[this.curr];
    },    
    len() {
        return this.ff.length;
    },
})};

function scrollhighlight(dir='next') {
    if (!mistakes_one_by_one || mistakes_one_by_one.len() === 0) return;

    const found = dir === 'next' ? mistakes_one_by_one.next() : mistakes_one_by_one.prev();
    if (found === undefined) return;
    if (hairy === null) return;
    info.textContent = `${mistakes_one_by_one.len()} erori - te afli la #${mistakes_one_by_one.curr + 1}`;
    hairy.focus();
    sel?.removeAllRanges();
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

function runtext(): number {
    const sel = document.getSelection();
    if (sel === null) return 0;
    sel.removeAllRanges();
    const rx_key: number = parseInt(rules.value) ?? -1;
    if (rx_key === -1) return 0;
    if (!(rx_key in rx)) return 0;
    make_mistakes_one_by_one(spots(hairy.value, rx[rx_key]));
    const num: number = mistakes_one_by_one.len();
    info.textContent = `s-au găsit ${num} erori`;
    return num;
} 

function usable (mode: boolean = true, inx: number = -1) { 
    let xx: Array<HTMLButtonElement> = [lightprev, lightnext];
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
    if (rules.value === '-1') return;
    const found = runtext();
    if (found > 0) {
        usable(true);
        lightnext.click();
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
hairy.addEventListener('change', () => {
    if (rules.value === '-1') return;
    usable(false);
    const found = runtext();
    if (found > 0) usable(true); 
});


usable(false);
