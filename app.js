const express = require('express');
const ExpressError = require('./ExpressError');

const app = express();

app.get('/mean', (request, response, next) => {
	handleResponse(request, response, 'mean', next);
});

app.get('/median', (request, response, next) => {
	handleResponse(request, response, 'median', next);
});

app.get('/mode', (request, response, next) => {
	handleResponse(request, response, 'mode', next);
});

app.get('/all', (request, response, next) => {
	handleResponse(request, response, 'all', next);
});

function validateNumbers(nums = undefined) {
	if (nums === undefined) return { valid: false, error: 'You must provide a number' };
	if (nums.some(val => isNaN(val))) return { valid: false, error: `${nums} is not a number` };

	return { valid: true };
}

function getMean(nums) {
	const sum = nums.reduce((value, total) => {
		return total + value;
	});
	return Math.round(sum / nums.length);
}

function getMedian(nums) {
	nums.sort(function (a, b) {
		return a - b;
	});

	const half = Math.floor(nums.length / 2);

	if (nums.length % 2) return nums[half];

	return (nums[half - 1] + nums[half]) / 2.0;
}

function getMode(nums) {
	nums.sort(function (a, b) {
		return a - b;
	});
	const occurrences = {};
	for (let i = 0; i < nums.length; i++) {
		let val = nums[i];
		occurrences[val] = occurrences[val] === undefined ? 1 : occurrences[val] + 1;
	}
	let mode = 'There is no mode for this set of numbers';
	for (const [key, val] of Object.entries(occurrences)) {
		if (val > 1) mode = key;
	}
	return mode;
}

function convertInputToInt(nums) {
	if (nums === undefined || nums.length === 0) return undefined;
	nums = nums.split(',');
	for (let i = 0; i < nums.length; i++) {
		nums[i] = parseInt(nums[i]);
	}
	return nums;
}

function handleResponse(request, response, routeType, next) {
	let nums = convertInputToInt(request.query.nums);
	const validityCheck = validateNumbers(nums);
	try {
		if (validityCheck['valid'] === false) throw new ExpressError(validityCheck['error'], 404);
		if (routeType === 'all') {
			const mean = getMean(nums).toString();
			const median = getMedian(nums).toString();
			const mode = getMode(nums).toString();
			response.send({
				operation: 'all',
				mean,
				median,
				mode
			});
		}
		if (routeType === 'mean') {
			const mean = getMean(nums);
			response.send(mean.toString());
		}
		if (routeType === 'median') {
			const median = getMedian(nums);
			response.send(median.toString());
		}
		if (routeType === 'mode') {
			const mode = getMode(nums);
			response.send(mode.toString());
		}
	} catch (err) {
		return next(err);
	}
}

//error handler
app.use((err, req, res, next) => {
	res.status(err.status).send(err.message);
});

module.exports = { getMean, getMode, getMedian, validateNumbers, app };
