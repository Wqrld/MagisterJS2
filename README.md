[<img src="http://i.imgur.com/Lrg80ax.png" alt="Magister.js" align="left" width="200"/>](https://github.com/Wqrld/MagisterJS2)
<p align="right">
	<a href="https://travis-ci.org/simplyGits/MagisterJS">
		<img src="https://api.travis-ci.org/simplyGits/MagisterJS.png?branch=master" alt="Travis CI Badge"/>
	</a>
</p>

==========





# This package is made by lieuwe. I am just publishing this for easier testing and am planning to take over the project.







[![npm version](https://badge.fury.io/js/magisterjs2.svg)](https://badge.fury.io/js/magisterjs2)
<a href="https://snyk.io/test/github/simplyGits/MagisterJS"><img src="https://snyk.io/test/github/simplyGits/MagisterJS/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/simplyGits/MagisterJS" style="max-width:100%;"></a>

A JavaScript implementation of the [Magister 6](http://magister6.nl/) API.

Quickstart
===
`npm install magisterjs2`

```javascript
const { default: magister, getSchools } = require('magister.js');
// or with es6 modules:
// import magister, { getSchools } from 'magister.js'

// replace every '<thing>' with your credentials:

getSchools('<schoolname>') // get schools matching '<schoolname>'
	.then((schools) => schools[0]) // get the first school
	.then((school) => magister({ // login
		school,
		username: '<username>',
		password: '<password>',
	}))
	.then((m) => { // done logging in, say hi
		console.log(`Hey ${m.profileInfo.firstName}!`);
	}, (err) => { // something went wrong
		console.error('something went wrong:', err);
	});
```
Or with async/await:
```javascript
const { default: magister, getSchools } = require('magister.js');
// or with es6 modules:
// import magister, { getSchools } from 'magister.js'

// replace every '<thing>' with your credentials:
async function printname(){
var m = await getSchools('<schoolname>') // get schools matching '<schoolname>'
	.then((schools) => schools[0]) // get the first school
	.then((school) => magister({ // login
		school,
		username: '<username>',
		password: '<password>',
	}))

		console.log(`Hey ${m.profileInfo.firstName}!`);

}
```

Useful links (old)
===
* [Project page](http://simplyGits.github.io/MagisterJS/) 
* [Documentation](http://simplyGits.github.io/MagisterJS/docs/index.html)

Before creating issues
===
1. Update all your packages with `npm update`
2. Be sure you haven't made a typo and your code is correct (check the [docs (old)](http://simplyGits.github.io/MagisterJS/docs/index.html))

Contributing
===
* Document your code using [jsdoc](http://usejsdoc.org/)
* Respect and follow the current programming style
* Test your changes with `npm test`
* Check your code style with `eslint`
* Only commit the `src/` and `test/` directory

License
===
[LGPLv3](LICENSE)
