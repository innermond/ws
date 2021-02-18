const words_peaks: number = 45000;
const dtp_hours: number = 7*24;
const dtp_price: number = 0.65;

interface Quotation {
	time: DtpTime,
	price: number,
}

interface DtpTime {
	days: number,
	hours: number,
}

function dtp(words_num: number): Quotation {
	const ratio: number = words_peaks/words_num;
	const atenuation = Math.min(Math.max(ratio, 0.9), 1);
	const price: number = (words_num/300)*dtp_price*atenuation;
	const d: number = Math.ceil((dtp_hours/ratio*atenuation));
	
	let hours: number = d%24;
	let days: number = (d - hours)/24;
	days += Math.floor(hours/8);
	hours = hours%8;
	
	const time: DtpTime = {days, hours}
	return {time, price};
}

function quotation(words_num, images_num: number, tables_num: number, lists_num: number): Quotation {

}

function dh(hours: number): DtpTime {
	let hours: number = d%24;
	let days: number = (d - hours)/24;
	days += Math.floor(hours/8);
	hours = hours%8;
}

function testprice(vv:number[]) {
	vv.forEach(v => console.log('words: ', v, 'got: ', dtp(v), ' is: ', v ==  dtp(v).price));
}

testprice([45000, 70000,  80000, 90000, 120000]);
