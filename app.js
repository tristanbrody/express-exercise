const express = require('express');

const app = express();

app.get('/mean', (request, response) => {
	handleResponse(request, response, 'mean');
});

app.get('/median', (request, response) => {
	handleResponse(request, response, 'median');
});

app.get('/mode', (request, response) => {
	handleResponse(request, response, 'mode');
});

app.get('/all', (request, response) => {
	handleResponse(request, response, 'all');
});

app.listen('3000', () => {
	console.log('App is now running on port 3000, hopefully');
});

function validateNumber(nums = undefined) {
	console.log(nums);
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
	console.log(occurrences);
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

function handleResponse(request, response, routeType) {
	let nums = convertInputToInt(request.query.nums);
	const validityCheck = validateNumber(nums);
	if (validityCheck['valid']) {
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
	} else {
		response.status(404).send(validityCheck['error']);
	}
}
