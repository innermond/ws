import {ParamsQuota, ErrQuotation, quota} from './pret';

describe('quota.errors', function() {
	const valid_params: ParamsQuota = [-1, 45000, 300, 7*8, 0.65, [0, 1, 0.75, 1]];
  it('check negative num', function() {
		let pp = valid_params.slice(0);
		pp.unshift(-1);
    let err = quota(...pp as ParamsQuota);
    expect(err as ErrQuotation[]).toStrictEqual([ErrQuotation.NotPositive]);   
	})
  it('check integer num', function() {
		let pp = valid_params.slice(0);
		pp.unshift(3.14);
    let err = quota(...pp as ParamsQuota);
    expect(err as ErrQuotation[]).toStrictEqual([ErrQuotation.NotInteger]);   
	})
  
	it('check negative + integer num', function() {
		let pp = valid_params.slice(0);
		pp.unshift(-3.14);
    let err = quota(...pp as ParamsQuota);
		err = err as ErrQuotation[];
    expect(err).toEqual(expect.arrayContaining([ErrQuotation.NotInteger, ErrQuotation.NotPositive]));   
    expect(err).toHaveLength(2);   
	})
});
