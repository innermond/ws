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

interface Quotation {
	time: DtpTime,
	price: number,
}

// scale val between intervals
function scale(v: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
	// assume in_min < in_max
  let out = (v - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	return out;
}

function quota(num: number, peak: number, span: number, hours: number, price: number, tr:[number, number, number, number]): Quotation {
	const ratio: number = peak/num;
	const atenuation = scale(ratio, ...tr);
	price = (num/span)*price*atenuation;
	const d: number = Math.ceil((hours/ratio*atenuation));
	
	const time: DtpTime = dh(d);
	return {time, price};
}

function txt(num: number): Quotation {
	return quota(num, 45000, 300, 7*8, 0.65, [0, 1, 0.75, 1]);
}

function img(num: number): Quotation {
	return quota(num, 10, 5, 2, 5, [0, 1, 0.8, 1]);
}

function lst(num: number): Quotation {
	return quota(num, 10, 5, 2, 5, [0, 1, 0.9, 1]);
}

function tbl(num: number): Quotation {
	return quota(num, 4, 2, 2, 4, [0, 1, 1, 1]);
}


type Section = 'text'|'pictures'|'lists'|'tables';
type QuotationSummary = Record<Section, Quotation> & {price: number, time: DtpTime};

function price(txt_num?: number, img_num?: number, lst_num?: number, tbl_num?: number): QuotationSummary {
	const qq: Record<Section, Quotation> = {
		text: {} as Quotation,
		pictures: {} as Quotation,
		lists: {} as Quotation,
		tables: {} as Quotation,
	};
	if (txt_num) qq.text = txt(txt_num);
	if (img_num) qq.pictures = img(img_num);
	if (lst_num) qq.lists = lst(lst_num);
	if (tbl_num) qq.tables = tbl(tbl_num);

	let price = 0.0;
	let time = 0.0;
	for (const k in qq) {
		const q: Quotation = qq[k as Section];
		const tm = undh(q.time);
		price += q.price;
		time += tm;
	};
	return {...qq, price, time: dh(time)};
}

[[30000, 20, 10, 3], [45000, 5, 5, 20]].forEach((pp) => console.log(price(...pp)));

interface QuotationFunc {
	(num: number): Quotation;
}
function testprice(vv:number[], fnfn: QuotationFunc[]): void {
	vv.forEach(v => {
		fnfn.forEach(fn => {
			const q: Quotation = fn(v);
			console.log('words: ', v, 'quotation: ', q);
		})
	})
}

//testprice([1, 5000, 30000, 45000, 70000,  80000, 90000, 120000], [txt]);
//testprice([1, 5, 10, 15, 30], [img]);
//testprice([1, 5, 10, 15, 30], [lst]);
//testprice([1, 5, 10, 15, 30], [tbl]);
