const { getMean, getMode, getMedian, validateNumbers } = require('./app.js');

let validNumbers;
let invalidNumbers;
beforeEach(() => {
	validNumbers = [13, 14, 18, 25, 35, 76];
	invalidNumbers = ['five', 8, 10];
});

describe('get mean function', () => {
	test('valid input should return the correct mean', () => {
		const mean = getMean(validNumbers);
		expect(mean).toEqual(30);
	});
});

describe('get mode function', () => {
	test('return val should specify no mode when applicable', () => {
		const mode = getMode(validNumbers);
		expect(mode).toEqual('There is no mode for this set of numbers');
	});
});

describe('get median function', () => {
	test('valid input should return the correct median', () => {
		const median = getMedian(validNumbers);
		expect(median).toEqual(21.5);
	});
});

describe('blank or invalid input should return error', () => {
	test('blank input for nums should return error', () => {
		const invalid = validateNumbers();
		expect(invalid).toEqual({ valid: false, error: 'You must provide a number' });
	});

	test('invalid input for nums should return error', () => {
		const invalid = validateNumbers(invalidNumbers);
		expect(invalid).toEqual({ valid: false, error: `${invalidNumbers} is not a number` });
	});
});
