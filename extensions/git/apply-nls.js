const packageNls = require('./package.nls.json');
const package = require('./package.json');
const { writeFileSync } = require('fs');
const path = require('path');

function updateNls(target) {
	for (const key in target) {
		if (Object.hasOwnProperty.call(target, key)) {
			if (typeof target[key] === 'object') {
				updateNls(target[key]);
			}

			if (typeof target[key] === 'string' && /%[^%]+/.test(target[key])) {
				const match = target[key].match(/(%[^%]+)%/g)[0];
				const value = packageNls[match.slice(1, -1)];
				if (typeof value === 'object') target[key] = value;
				if (typeof target[key] === 'string' && value) target[key] = target[key].replace(match, value);
			}
		}
	}
}

updateNls(package);
writeFileSync(path.join(__dirname, './package.json'), JSON.stringify(package, null, 2));
