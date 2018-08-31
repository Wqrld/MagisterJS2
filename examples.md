# examples
```javascript

import magister, { getSchools } from 'magister.js'

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
