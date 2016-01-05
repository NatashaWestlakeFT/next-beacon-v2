'use strict';

const KeenQuery = require('n-keen-query');

[].slice.call(document.querySelectorAll('[data-keen-query]')).forEach(el => {
	KeenQuery.execute(el.getAttribute('data-keen-query'))
		.then(res => {
			if (typeof res === 'string') {
				el.innerHTML = res;
			} else if (typeof res === 'function') {
				res(el);
			} else {
				throw 'What the hell kind of printout is this!?'
			}
		});
});

require('./components/feature-search').init();
