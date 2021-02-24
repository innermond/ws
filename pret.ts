type Currency = 'EUR|USD|RON';

interface WorkTime {
  days: number; // 8 hour = 1 day
  hours: number;
}

function dh(d: number): WorkTime {
  let hours: number = d % 8;
  let days: number = (d - hours) / 8;
  days += Math.floor(hours / 8);
  hours = hours % 8;

  return { days, hours };
}

function undh(dt: WorkTime): number {
  let { days: d, hours: h } = dt;
  return d * 8 + h;
}

// scale val between intervals
function scale(
  v: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
): number {
  const out =
    ((v - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return out;
}

// express how much some work costs, both money and time
interface Quotation {
  num: number;
  time: WorkTime;
  price: number;
}
// quotation errors
enum ErrQuotation {
  NotPositive = 1,
  NotInteger = 2,
}
// failable Quotation
type TryQuotation = Quotation | ErrQuotation[];
// check if a TryQuotation has failed and is, actually an error
function is_err(err: TryQuotation): err is ErrQuotation[] {
  return (err as ErrQuotation[]).length > 0;
}

// calculating price use a mapping between two ranges
// as price will decrease slowly to upper end of the ranges
// [0, 1] maps to [0.75, 1] the price will end as 0.75 of its defined value
// express two ranges as [range1start, range1end, range2start, range2end]
type Atenuation = [number, number, number, number];
// sugar type for calculating price function's parameters
type ParamsQuota = [number, number, number, number, number, Atenuation];
// calculating price
// modelated to accept spreading array of parameters
function quota(
  ...[num, peak, span, hours, price, tr]: ParamsQuota
): TryQuotation {
  const errs: ErrQuotation[] = [];
  if (num < 0) errs.push(ErrQuotation.NotPositive);
  if (Math.floor(num) != num) errs.push(ErrQuotation.NotInteger);
  //  TryQuotation as it's ErrQuotation[] side
  if (errs.length) return errs;

  // zero case
  if (num === 0) return { num: 0, time: dh(0), price: 0 };

  // happy path onward
  const ratio: number = peak / num;
  const atenuation = scale(ratio, ...tr);
  price = (num / span) * price * atenuation;
  const d: number = Math.ceil((hours / ratio) * atenuation);

  const time: WorkTime = dh(d);
  // TryQuotation as it's Quotation side
  return { num, time, price };
}

// utility functions to shape price calculation
// for various type of works

// text only
function txt(num: number): TryQuotation {
  return quota(num, 45000, 300, 7 * 8, 0.65, [0, 1, 0.75, 1]);
}
// images
function img(num: number): TryQuotation {
  return quota(num, 10, 5, 2, 5, [0, 1, 0.8, 1]);
}
// lists
function lst(num: number): TryQuotation {
  return quota(num, 10, 5, 2, 5, [0, 1, 0.9, 1]);
}
// tables
function tbl(num: number): TryQuotation {
  return quota(num, 4, 2, 2, 4, [0, 1, 1, 1]);
}

//type Section = 'text',  'pictures' | 'lists' | 'tables';
const sections = ['text', 'pictures', 'lists', 'tables'] as const;
type Section = typeof sections[number];
function is_section(k: string): k is Section {
	return sections.includes(k as Section);
}
type QuotationSummary = Record<Section, Quotation> & {
  price: number;
  time: WorkTime;
};
type ErrQuotationSummary = Map<Section, ErrQuotation[]>;
type PriceResult = QuotationSummary | ErrQuotationSummary;
function is_quotation_summary(r: PriceResult): r is QuotationSummary {
  const q = r as QuotationSummary;
  return q.price !== undefined && q.time !== undefined;
}

// it gives a PriceResult either a ErrQuotationSummary
// or a complete QuotationSummary
function price(
  txt_num: number = 0,
  img_num: number = 0,
  lst_num: number = 0,
  tbl_num: number = 0
): PriceResult {
  // errors to happend on validation
  const errs: ErrQuotationSummary = new Map();
  // start calculation/validation
  const text = txt(txt_num);
  if (is_err(text)) errs.set('text' as Section, text as ErrQuotation[]);
  const pictures = img(img_num);
  if (is_err(pictures))
    errs.set('pictures' as Section, pictures as ErrQuotation[]);
  const lists = lst(lst_num);
  if (is_err(lists)) errs.set('lists' as Section, lists as ErrQuotation[]);
  const tables = tbl(tbl_num);
  if (is_err(tables)) errs.set('tables' as Section, tables as ErrQuotation[]);
  // end calculation/validation

  // PriceResult as ErrQuotationSummary
  if (errs.size) return errs;

  // initial state for calculation
  let price = 0.0;
  let time = 0.0;
  const out: QuotationSummary = {} as QuotationSummary;

  // grab all interested calculations as a map of done TryQuotations
  // turned Quotations
  const qq: Record<Section, Quotation> = {
    text: text as Quotation,
    pictures: pictures as Quotation,
    lists: lists as Quotation,
    tables: tables as Quotation,
  };
  // calculate total and collect all TryQuotation turned valid Quotation
  // to return a PriceResult as QuotationSummary
  for (let k in qq) {
    let s = k as Section;
    let q: Quotation = qq[s];
    const tm = undh(q.time);
    price += q.price;
    time += tm;
    out[s] = q;
  }
  return { ...out, price, time: dh(time) };
}

// UI
const twin_summary: Map<string, string> = new Map([
	['price-txt', 'text'],
	['price-img', 'pictures'],
	['price-lst', 'lists'],
	['price-tbl', 'tables'],
]);

const CURRENCY = 'EUR' as Currency;
const $txt = <HTMLInputElement>document.getElementById('price-txt');
const $img = <HTMLInputElement>document.getElementById('price-img');
const $lst = <HTMLInputElement>document.getElementById('price-lst');
const $tbl = <HTMLInputElement>document.getElementById('price-tbl');
const $total = <HTMLInputElement>document.getElementById('price-total');
const $time = <HTMLInputElement>document.getElementById('time-total');
[$txt, $img, $lst, $tbl].forEach(($input) => {
  $input.addEventListener('input', price_calculate);
});

function  price_calculate() {
	let result = price(
		parseFloat($txt.value),
		parseFloat($img.value),
		parseFloat($lst.value),
		parseFloat($tbl.value)
	);
	// ok branch
	if (!is_quotation_summary(result)) return;
	const $twins: NodeListOf<HTMLElement> = document.querySelectorAll('p[data-twin]');
	$twins.forEach($twin => {
		const twin: string|undefined = $twin.dataset?.twin;
		if (typeof twin === 'undefined') return;
		if(!twin_summary.has(twin)) return;
		let s:string = twin_summary.get(twin) as string;
		if (!is_section(s)) return;
		const ss = (result as QuotationSummary)[(s as Section)];
		$twin.innerHTML = `preț ${ss.price.toFixed(2)} ${CURRENCY}/timp: ${ss.time.days} zile ${ss.time.hours} ore`;
	});
	// total
	$total.innerHTML = `${result.price.toFixed(2)} ${CURRENCY}`;
	$time.innerHTML = `${result.time.days} zile ${result.time.hours} ore`;

}
price_calculate();
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
