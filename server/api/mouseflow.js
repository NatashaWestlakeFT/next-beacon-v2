module.exports = function (req, res) {

	console.log('req.body')
	console.log(req.body)

	// return new Promise((resolve, reject) => {
	// 	try {
	// 		// const keen = keenIO.configure({
	// 		// 	projectId: window.KEEN_PROJECT_ID,
	// 		// 	readKey: window.KEEN_READ_KEY
	// 		// });
	// 		// keen.run(query, (error, response) => {
	// 		// 	if (error) {
	// 		// 		throw 'Error response from keen API: ' + error;
	// 		// 	}



	// 			// response = '';

	// 			// fetch(PERSEPCTIVE_API_ENDPOINT).then(function (data) {
	// 			// 	buildTable(data)
	// 				resolve(mockMarkup);
	// 			// });

	// 		// });
	// 	} catch (error) {
	// 		reject(error);
	// 	}
	// });

	const mockData = [
	    {
	      "url": "https://eu.mouseflow.com/websites/3d6fc486-2914-4efc-a5ae-35a5eac972f2/recordings/0a91987ce6084b42891f30fef36605a9/play",
	      "spoorId": "ciofi1w6k00003i77u3g8qyg3",
	      "duration": 229837,
	      "pages": 8
	    },
	    {
	      "url": "https://eu.mouseflow.com/websites/3d6fc486-2914-4efc-a5ae-35a5eac972f2/recordings/192b453d711c1f2db7d25395e083e88f/play",
	      "spoorId": "ciofi1w6k00003i77u3g8qyg3",
	      "duration": 2840239,
	      "pages": 34
	    },
	    {
	      "url": "https://eu.mouseflow.com/websites/3d6fc486-2914-4efc-a5ae-35a5eac972f2/recordings/1dea98e19e9ae8af747cb5d4ec2c375f/play",
	      "spoorId": "ciofi1w6k00003i77u3g8qyg3",
	      "duration": 3212525,
	      "pages": 36
	    }
	  ]

	res.render('recordings', mockData);
};
