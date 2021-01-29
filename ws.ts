// view
const wiper = document.getElementById('wiper') as HTMLButtonElement;
const hairy = document.getElementById('hairy') as HTMLTextAreaElement;
const lightnext = document.getElementById('lightnext') as HTMLButtonElement;
const lightprev = document.getElementById('lightprev') as HTMLButtonElement;

const sel: Selection | null = document.getSelection();
// engine
// detect pain spots
function spots(txt: string | null): Array<RegExpExecArray> {
//TODO handle null cases
    if (txt === null) return [];
    if (sel === null) return [];

    sel.removeAllRanges();

    const ff: Array<RegExpExecArray> = [];
    const commaSpaceBefore: RegExp = /\s+,/mg;
    ff.push(...mistakes(commaSpaceBefore, txt).filter(x => x.length));
    const commaNoSpaceAfter: RegExp = /[^\s\n],[^\s\n]/mg;
    ff.push(...mistakes(commaNoSpaceAfter, txt).filter(x => x.length));

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
})};

function scrollhighlight(dir='next') {
    if (mistakes_one_by_one.length === 0) return;

    const found = dir === 'next' ? mistakes_one_by_one.next() : mistakes_one_by_one.prev();
    if (found === undefined) return;
    if (hairy === null) return;

    const fulltext = hairy.value;
    const indexend = found.index + found[0].length;
    // the trick
    hairy.focus();
    sel?.removeAllRanges();
    hairy.value = fulltext.substring(0, indexend);
    const scrollTop = hairy.scrollHeight;
    hairy.scrollTop = scrollTop;
    hairy.value = fulltext;

    hairy.setSelectionRange(found.index, indexend);
}

wiper.addEventListener('click', (evt) => {
    evt.preventDefault();
    const sel = document.getSelection();
    if (sel === null) return;
    sel.removeAllRanges();
    make_mistakes_one_by_one(spots(hairy.value));
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
hairy.value = ` Cum m-am vindecat de cancer prin metoda Detox Nutri Fit      !!!!!!!( sa apara pe toate paginile cartii cu acest font nu Arial)  

                              
                          

   
                  Capitolul  4 
                  Onco-Fitoterapia



  Cum ne facem ,propriul protocol   ,  anticancer dup,ă ce am terminat chimioterapia  (titlu!!!)

După ce am terminat, chimioterapia , nu trebuie să ne considerăm vindecați. Ca și pe parcursul celorlalte etape anterioare, nutriția reprezintă un factor extrem de important, dar acum devine deja un factor de vindecare.
   ,   ,
Celulele tumorale sunt slăbite, sunt deja înfometate, pentru că ați avut o nutriție fără carne, zahăr și lactate, iar în acest moment, orice poftă alimentară, indiferent că este vorba de o simplă linguriță din produsele interzise, va fi direct hrană pentru celulele tumorale. Nu trebuie să lăsăm nici o ușă deschisă cancerului.

Într-o singură , zi puteți da înapoi progresele,făcute în,. ultimele 6 luni sau chiar în ultimele 12 luni.

Acum este nevoie de minimum 3-5 mese zilnic, cu minimum 100.000 de unități ORAC, polenul crud se va lua totdeauna după masă, dar nu seara, deoarece vă va oferi o senzație de sațietate.

Dintre suplimentele de chimioterapie vegetală de la punc,tul 2,000  sau 3,din acest modul vor fi folosite minimum 4-5 plante în mod concomitent, iar acestea vor fi rulate la o perioadă de 60 de zile cu alte 4-5 suplimente din listă.

Graviola și năpraznicul vor rămâne constante până la vindecarea pacientului. Luați zilnic suplimente cu melatonină, 10-30 mg seara, cu 30 de minute înainte de culcare. Dacă observați somnolență pe perioada zilei, reduceți doza la 10 mg.
Luați probiotice și polen crud de trandafir sălbatic Apiland pentru refacerea florei intestinale după chimioterapie.
Luați extracte de ienupăr, brusture sau echinaceea pentru a elimina substanțele toxice din s ,istemul limfatic. 
`;
