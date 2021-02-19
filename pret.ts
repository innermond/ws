interface DtpTime {
	days: number,
	hours: number,
}

function dh(d: number): DtpTime {
	let hours: number = d%8;
	let days: number = (d - hours)/8;
	days += Math.floor(hours/8);
	hours = hours%8;

	return {days, hours};
}

function undh(dt: DtpTime): number {
	let {days: d, hours: h} = dt;
	return d*8 + h;
}

// scale val between intervals
function scale(v: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
  let out = (v - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	return out;
}

interface Quotation {
    num: number,
	time: DtpTime,
	price: number,
}
enum ErrQuotation {
    NotPositive = 1,
    NotInteger = 2,
}
type TryQuotation = Quotation|ErrQuotation[]; 

function is_err(err: TryQuotation): err is ErrQuotation[] {
    return (err as ErrQuotation[]).length > 0;
}

function quota(num: number, peak: number, span: number, hours: number, price: number, tr:[number, number, number, number]): TryQuotation{
    const errs: ErrQuotation[] = [];
	if (num <= 0) errs.push(ErrQuotation.NotPositive);
	if (Math.floor(num) != num) errs.push(ErrQuotation.NotInteger)
    if (errs.length) return errs;

	const ratio: number = peak/num;
	const atenuation = scale(ratio, ...tr);
	price = (num/span)*price*atenuation;
	const d: number = Math.ceil((hours/ratio*atenuation));
	
	const time: DtpTime = dh(d);
	return {num, time, price};
}

function txt(num: number): TryQuotation {
	return quota(num, 45000, 300, 7*8, 0.65, [0, 1, 0.75, 1]);
}

function img(num: number):TryQuotation {
	return quota(num, 10, 5, 2, 5, [0, 1, 0.8, 1]);
}

function lst(num: number): TryQuotation {
	return quota(num, 10, 5, 2, 5, [0, 1, 0.9, 1]);
}

function tbl(num: number): TryQuotation {
	return quota(num, 4, 2, 2, 4, [0, 1, 1, 1]);
}


type Section = 'text'|'pictures'|'lists'|'tables';
type QuotationSummary = Record<Section, Quotation> & {price: number, time: DtpTime};
type PriceResult = QuotationSummary | Map<Section, ErrQuotation[]>;

function price(txt_num: number = 0, img_num: number = 0, lst_num: number = 0, tbl_num: number = 0): PriceResult {
	const errs: Map<Section, ErrQuotation[]> = new Map();
    const text = txt(txt_num);
    if (is_err(text)) errs.set('text' as Section, text as ErrQuotation[]);
	const pictures = img(img_num);
    if (is_err(pictures)) errs.set('pictures' as Section, pictures as ErrQuotation[]);
	const lists = lst(lst_num);
    if (is_err(lists)) errs.set('lists' as Section, lists as ErrQuotation[]);
	const tables = tbl(tbl_num);
    if (is_err(tables)) errs.set('tables' as Section, tables as ErrQuotation[]);
    if (errs.size) return errs;

	const qq: Record<Section, TryQuotation> = {
		text,
		pictures,
		lists,
		tables,
	};

	let price = 0.0;
	let time = 0.0;
	const out: QuotationSummary = {} as QuotationSummary;
	for (let k in qq) {
		const s: Section = k as Section;
		let q: TryQuotation = qq[s];
		if (is_err(q)) continue;

		q = q as Quotation; 
		const tm = undh(q.time);
		price += q.price;
		time += tm;
		out[s] = q;
	};
	return {...out, price, time: dh(time)};
}

[[-10, 0, 10, 3], [25000, 10, 5, 10]].forEach((pp) => {
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
}

//testprice([45000, 0, 1, 100, 1000, 5000, 22500, 45000, 90000], [txt]);
//testprice([1, 5, 10, 15, 30], [img]);
//testprice([1, 5, 10, 15, 30], [lst]);
//testprice([1, 5, 10, 15, 30], [tbl]);
