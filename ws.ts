// view
const info = document.getElementById('info') as HTMLDivElement;
const rules = document.getElementById('rules') as HTMLSelectElement;
const hairy = document.getElementById('hairy') as HTMLTextAreaElement;
const lightnext = document.getElementById('lightnext') as HTMLButtonElement;
const lightprev = document.getElementById('lightprev') as HTMLButtonElement;

const sel: Selection | null = document.getSelection();

const commaSpaceBefore: RegExp = /\s+,/mg;
const commaNoSpaceAfter: RegExp = /,[^\s\n]/mg;
const commaNoSpaceAfterAllowDigit: RegExp = /,[^\s\n\d]/mg;
const rx: Array<RegExp> = [];
rx.push(commaSpaceBefore, commaNoSpaceAfter, commaNoSpaceAfterAllowDigit);
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
		console.log(mistakes_one_by_one.len(), mistakes_one_by_one.curr);

    const found = dir === 'next' ? mistakes_one_by_one.next() : mistakes_one_by_one.prev();
    if (found === undefined) return;
    if (hairy === null) return;
		
		info.textContent = `s-au găsit ${mistakes_one_by_one.len()} erori - te afli la #${mistakes_one_by_one.curr + 1}`;

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

function runtext() {
    const sel = document.getSelection();
    if (sel === null) return;
    sel.removeAllRanges();
    const rx_key: number = parseInt(rules.value) ?? -1;
    if (rx_key === -1) return;
    if (!(rx_key in rx)) return;
    make_mistakes_one_by_one(spots(hairy.value, rx[rx_key]));
		info.textContent = `s-au găsit ${mistakes_one_by_one.len()} erori`;
} 

rules.addEventListener('change', (evt) => {
    evt.preventDefault();
    if (rules.value === '-1') return;
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
    if (rules.value === '-1') return;
   runtext(); 
});
