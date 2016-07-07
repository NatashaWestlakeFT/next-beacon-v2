const nPerspective = require('@financial-times/n-perspective');

module.exports = function (req, res) {

	nPerspective.fetchRecordings(req.body)
		.then((result) => {
			res.render('recordings', result);
		})
};
