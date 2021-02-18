var words_peaks = 45000;
var dtp_hours = 7 * 24;
var dtp_price = 0.65;
function dtp(words_num) {
    var ratio = words_peaks / words_num;
    var atenuation = Math.min(Math.max(ratio, 0.9), 1);
    var price = (words_num / 300) * dtp_price * atenuation;
    var d = Math.ceil((dtp_hours / ratio * atenuation));
    var hours = d % 24;
    var days = (d - hours) / 24;
    days += Math.floor(hours / 8);
    hours = hours % 8;
    var time = { days: days, hours: hours };
    return { time: time, price: price };
}
function quotation(words_num, images_num, tables_num, lists_num) {
}
function dh(hours) {
    var hours = d % 24;
    var days = (d - hours) / 24;
    days += Math.floor(hours / 8);
    hours = hours % 8;
}
function testprice(vv) {
    vv.forEach(function (v) { return console.log('words: ', v, 'got: ', dtp(v), ' is: ', v == dtp(v).price); });
}
testprice([45000, 70000, 80000, 90000, 120000]);
