'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.VersionInfo = exports.SchoolUtility = exports.School = exports.ProfileSettings = exports.ProfileInfo = exports.Privileges = exports.Person = exports.MessageFolder = exports.Message = exports.Magister = exports.GradeType = exports.GradePeriod = exports.Grade = exports.FileFolder = exports.File = exports.Course = exports.Class = exports.AuthError = exports.AssignmentVersion = exports.Assignment = exports.Appointment = exports.AddressInfo = exports.ActivityElement = exports.Activity = exports.AbsenceInfo = exports.VERSION = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = magister;
exports.getSchools = getSchools;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _absenceInfo = require('./absenceInfo');

var _absenceInfo2 = _interopRequireDefault(_absenceInfo);

var _activity = require('./activity');

var _activity2 = _interopRequireDefault(_activity);

var _activityElement = require('./activityElement');

var _activityElement2 = _interopRequireDefault(_activityElement);

var _appointment = require('./appointment');

var _appointment2 = _interopRequireDefault(_appointment);

var _assignment = require('./assignment');

var _assignment2 = _interopRequireDefault(_assignment);

var _assignmentVersion = require('./assignmentVersion');

var _assignmentVersion2 = _interopRequireDefault(_assignmentVersion);

var _authError = require('./authError');

var _authError2 = _interopRequireDefault(_authError);

var _class = require('./class');

var _class2 = _interopRequireDefault(_class);

var _course = require('./course');

var _course2 = _interopRequireDefault(_course);

var _file = require('./file');

var _file2 = _interopRequireDefault(_file);

var _fileFolder = require('./fileFolder');

var _fileFolder2 = _interopRequireDefault(_fileFolder);

var _grade = require('./grade');

var _grade2 = _interopRequireDefault(_grade);

var _gradePeriod = require('./gradePeriod');

var _gradePeriod2 = _interopRequireDefault(_gradePeriod);

var _gradeType = require('./gradeType');

var _gradeType2 = _interopRequireDefault(_gradeType);

var _http = require('./http');

var _http2 = _interopRequireDefault(_http);

var _message = require('./message');

var _message2 = _interopRequireDefault(_message);

var _messageFolder = require('./messageFolder');

var _messageFolder2 = _interopRequireDefault(_messageFolder);

var _person = require('./person');

var _person2 = _interopRequireDefault(_person);

var _privileges = require('./privileges');

var _privileges2 = _interopRequireDefault(_privileges);

var _profileInfo = require('./profileInfo');

var _profileInfo2 = _interopRequireDefault(_profileInfo);

var _school = require('./school');

var _school2 = _interopRequireDefault(_school);

var _schoolUtility = require('./schoolUtility');

var _schoolUtility2 = _interopRequireDefault(_schoolUtility);

var _versionInfo = require('./versionInfo');

var _versionInfo2 = _interopRequireDefault(_versionInfo);

var _util = require('./util');

var util = _interopRequireWildcard(_util);

var _addressInfo = require('./addressInfo');

var _addressInfo2 = _interopRequireDefault(_addressInfo);

var _profileSettings = require('./profileSettings');

var _profileSettings2 = _interopRequireDefault(_profileSettings);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: add nice warnings when trying to do stuff while not logged in yet

/**
 * Class to communicate with Magister.
 * @private
 */
class Magister {
	/**
  * @param {Object} options
  * @param {School} school
  * @param {Http} http
  */
	constructor(options, school, http) {
		var info = _url2.default.parse(school.url);
		if (!/^[a-z]+\.magister\.net$/.test(info.host)) {
			throw new Error('`school.url` is not a correct magister url');
		}
		school.url = `https://${info.host}`;

		/**
   * @type Object
   * @readonly
   * @private
   */
		this._options = options;
		/**
   * @type School
   * @readonly
   */
		this.school = _lodash2.default.extend(new _school2.default({}), school);
		/**
   * @type Http
   * @readonly
   */
		this.http = http;
		/**
   * @type ProfileInfo
   * @readonly
   */
		this.profileInfo = null;
	}

	/**
  * @return {Promise<Activity[]>}
  */
	activities() {
		var _this = this;

		return this._privileges.needs('activiteiten', 'read').then(function () {
			return _this.http.get(`${_this._personUrl}/activiteiten`);
		}).then(function (res) {
			return res.json();
		}).then(function (res) {
			return res.Items.map(function (a) {
				return new _activity2.default(_this, a);
			});
		});
	}

	/**
  * @param {Date} from Time is ignored.
  * @param {Date} [to=from] Time is ignored
  * @param {Object} [options={}]
  * 	@param {Boolean} [options.fillPersons=false]
  * 	@param {Boolean} [options.fetchAbsences=true]
  * 	@param {Boolean} [options.ignoreAbsenceErrors=true]
  * @return {Promise<Appointment[]>}
  */
	appointments() {
		var _this2 = this;

		// extract options
		var _ref = _lodash2.default.find(arguments, _lodash2.default.isPlainObject) || {},
		    _ref$fillPersons = _ref.fillPersons,
		    fillPersons = _ref$fillPersons === undefined ? false : _ref$fillPersons,
		    _ref$fetchAbsences = _ref.fetchAbsences,
		    fetchAbsences = _ref$fetchAbsences === undefined ? true : _ref$fetchAbsences,
		    _ref$ignoreAbsenceErr = _ref.ignoreAbsenceErrors,
		    ignoreAbsenceErrors = _ref$ignoreAbsenceErr === undefined ? true : _ref$ignoreAbsenceErr;

		// extract dates


		var dates = (0, _lodash2.default)(arguments).filter(_lodash2.default.isDate).sortBy().value();
		var from = dates[0];
		var to = dates[1] || dates[0];

		var fromUrl = util.urlDateConvert(from);
		var toUrl = util.urlDateConvert(to);

		// fetch appointments
		var appointmentsUrl = `${this._personUrl}/afspraken?van=${fromUrl}&tot=${toUrl}`;
		var appointmentsPromise = this._privileges.needs('afspraken', 'read').then(function () {
			return _this2.http.get(appointmentsUrl);
		}).then(function (res) {
			return res.json();
		}).then(function (res) {
			return res.Items.map(function (a) {
				return new _appointment2.default(_this2, a);
			});
		}).then(function (appointments) {
			if (!fillPersons) {
				return appointments;
			}

			var promises = appointments.map(function (a) {
				return Promise.all(a.teachers.map(function (t) {
					return t.getFilled('teacher');
				})).then(function (teachers) {
					return a.teachers = teachers;
				}).then(function () {
					return a;
				});
			});
			return Promise.all(promises);
		});

		// fetch absences
		var absencesPromise = Promise.resolve([]);
		if (fetchAbsences) {
			var absencesUrl = `${this._personUrl}/absenties?van=${fromUrl}&tot=${toUrl}`;
			absencesPromise = this._privileges.needs('Absenties', 'read').then(function () {
				return _this2.http.get(absencesUrl);
			}).then(function (res) {
				return res.json();
			}).then(function (res) {
				return res.Items.map(function (a) {
					return new _absenceInfo2.default(_this2, a);
				});
			});

			if (ignoreAbsenceErrors) {
				absencesPromise = absencesPromise.catch(function () {
					return [];
				});
			}
		}

		return Promise.all([appointmentsPromise, absencesPromise]).then(function (_ref2) {
			var _ref3 = _slicedToArray(_ref2, 2),
			    appointments = _ref3[0],
			    absences = _ref3[1];

			var _loop = function _loop(a) {
				a.absenceInfo = absences.find(function (i) {
					return i.appointment.id === a.id;
				});
			};

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = appointments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var a = _step.value;

					_loop(a);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return appointments;
		}).then(function (appointments) {
			return _lodash2.default.sortBy(appointments, 'start');
		});
	}

	/**
  * @param {Object} [options={}]
  * 	@param {Number} [options.count=50]
  * 	@param {Number} [options.skip=0]]
  * 	@param {Boolean} [options.fillPersons=false]
  * @return {Promise<Assignment[]>}
  */
	assignments() {
		var _this3 = this;

		var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref4$count = _ref4.count,
		    count = _ref4$count === undefined ? 50 : _ref4$count,
		    _ref4$skip = _ref4.skip,
		    skip = _ref4$skip === undefined ? 0 : _ref4$skip,
		    _ref4$fillPersons = _ref4.fillPersons,
		    fillPersons = _ref4$fillPersons === undefined ? false : _ref4$fillPersons;

		var url = `${this._personUrl}/opdrachten?top=${count}&skip=${skip}&status=alle`;

		return this._privileges.needs('eloopdracht', 'read').then(function () {
			return _this3.http.get(url);
		}).then(function (res) {
			return res.json();
		}).then(function (res) {
			return res.Items.map(function (i) {
				return i.Id;
			});
		}).then(function (ids) {
			var promises = ids.map(function (id) {
				return _this3.http.get(`${_this3._personUrl}/opdrachten/${id}`).then(function (res) {
					return res.json();
				});
			});
			return Promise.all(promises);
		}).then(function (items) {
			var promises = items.map(function (item) {
				var assignment = new _assignment2.default(_this3, item);
				if (!fillPersons) {
					return assignment;
				}

				return Promise.all(assignment.teachers.map(function (p) {
					return p.getFilled('teacher');
				})).then(function (teachers) {
					return assignment.teachers = teachers;
				}).then(function () {
					return assignment;
				});
			});
			return Promise.all(promises);
		});
	}

	/**
  * @return {Promise<Magister[]>}
  */
	children() {
		var _this4 = this;

		if (this.profileInfo.isChild) {
			return Promise.reject(new Error('User is not a parent'));
		}

		return this.http.get(`${this._personUrl}/kinderen`).then(function (res) {
			return res.json();
		}).then(function (res) {
			return res.Items;
		}).then(function (items) {
			return items.map(function (raw) {
				var m = Object.create(_this4);

				m.school = _this4.school;
				m.http = _this4.http;

				m._personUrl = `${_this4.school.url}/api/personen/${raw.Id}`;
				m._pupilUrl = `${_this4.school.url}/api/leerlingen/${raw.Id}`;
				m.profileInfo = new _profileInfo2.default(_this4, raw);

				return m;
			});
		});
	}

	/**
  * @return {Promise<Course>}
  */
	courses() {
		var _this5 = this;

		return this._privileges.needs('aanmeldingen', 'read').then(function () {
			return _this5.http.get(`${_this5._personUrl}/aanmeldingen`);
		}).then(function (res) {
			return res.json();
		}).then(function (res) {
			return res.Items.map(function (c) {
				return new _course2.default(_this5, c);
			});
		}).then(function (items) {
			return _lodash2.default.sortBy(items, 'start');
		});
	}

	/**
  * @param {Object} options
  * 	@param {String} options.description The description of the appointment.
  * 	@param {Date} options.start The start of the appointment, time is
  * 	ignored when `options.fullDay` is set to true.
  * 	@param {Date} options.end The end of the appointment, this is ignored
  * 	when `options.fullDay` is set to true.
  * 	@param {Boolean} [options.fullDay=false] When this is true,
  * 	`options.end` is ignored and only `options.start` is used to set the
  * 	begin and the end for the appointment.
  * 	@param {String} [options.location] The location (classroom for example)
  * 	for the appointment.
  * 	@param {String} [options.content] Some arbitrary string you want to
  * 	save.
  * 	@param {Number} [options.type=1] The type of the appointment: 1 for
  * 	personal or 16 for planning
  * @return {Promise}
  */
	createAppointment(options) {
		var _this6 = this;

		var required = ['description', 'start', 'end'];
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = required[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var key = _step2.value;

				if (options[key] == null) {
					var err = new Error(`Not all required fields for \`options\` are given, required are: [ ${required.join(', ')} ]`);
					return Promise.reject(err);
				}
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}

		if (options.fullDay) {
			options.start = util.date(options.start);
			options.end = new Date(options.start.getTime()) + 1000 * 60 * 60 * 24;
		}

		var payload = {
			Omschrijving: options.description,
			Start: options.start.toJSON(),
			Einde: options.end.toJSON(),

			Lokatie: _lodash2.default.trim(options.location),
			Inhoud: function () {
				var content = _lodash2.default.trim(options.content);
				return content.length > 0 ? _lodash2.default.escape(content) : null;
			}(),
			Type: options.type || 1,
			DuurtHeleDag: options.fullDay || false,

			// Static non-configurable stuff.
			InfoType: 0,
			WeergaveType: 1,
			Status: 2,
			HeeftBijlagen: false,
			Bijlagen: null,
			LesuurVan: null,
			LesuurTotMet: null,
			Aantekening: null,
			Afgerond: false,
			Vakken: null,
			Docenten: null,
			Links: null,
			Id: 0,
			Lokalen: null,
			Groepen: null,
			OpdrachtId: 0
		};

		return this._privileges.needs('afspraken', 'create').then(function () {
			return _this6.http.post(`${_this6._personUrl}/afspraken`, payload);
		});
	}

	/**
  * @return {Promise<FileFolder[]>}
  */
	fileFolders() {
		var _this7 = this;

		return this._privileges.needs('bronnen', 'read').then(function () {
			return _this7.http.get(`${_this7._personUrl}/bronnen?soort=0`);
		}).then(function (res) {
			return res.json();
		}).then(function (res) {
			return res.Items.map(function (f) {
				return new _fileFolder2.default(_this7, f);
			});
		});
	}

	/**
  * @return {Promise<MessageFolder[]>}
  */
	messageFolders() {
		var _this8 = this;

		return this._privileges.needs('berichten', 'read').then(function () {
			return _this8.http.get(`${_this8._personUrl}/berichten/mappen`);
		}).then(function (res) {
			return res.json();
		}).then(function (res) {
			return res.Items.map(function (m) {
				return new _messageFolder2.default(_this8, m);
			});
		});
	}

	/**
  * @param {String} query
  * @param {String} [type]
  * @return {Promise<Person[]>}
  */
	persons(query, type) {
		var _this9 = this;

		query = query != null ? query.trim() : '';

		if (query.length < 3) {
			return Promise.resolve([]);
		} else if (type == null) {
			return Promise.all([this.persons(query, 'teacher'), this.persons(query, 'pupil')]).then(function (_ref5) {
				var _ref6 = _slicedToArray(_ref5, 2),
				    teachers = _ref6[0],
				    pupils = _ref6[1];

				return teachers.concat(pupils);
			});
		}

		type = {
			'teacher': 'Personeel',
			'pupil': 'Leerling',
			'project': 'Project'
		}[type] || 'Overig';
		query = query.replace(/ +/g, '+');

		var url = `${this._personUrl}/contactpersonen?contactPersoonType=${type}&q=${query}`;

		return this._privileges.needs('contactpersonen', 'read').then(function () {
			return _this9.http.get(url);
		}).then(function (res) {
			return res.json();
		}).then(function (res) {
			return res.Items.map(function (p) {
				p = new _person2.default(_this9, p);
				p._filled = true;
				return p;
			});
		});
	}

	schoolUtilities() {
		var _this10 = this;

		var url = `${this._personUrl}/lesmateriaal`;

		return this._privileges.needs('digitaallesmateriaal', 'read').then(function () {
			return _this10.http.get(url);
		}).then(function (res) {
			return res.json();
		}).then(function (res) {
			return res.Items.map(function (u) {
				return new _schoolUtility2.default(_this10, u);
			});
		});
	}

	/**
  * Logins to Magister.
  * @param {Boolean} [forceLogin=false] Force a login, even when a session id
  * is in the options object.
  * @return {Promise<String>} A promise that resolves when done logging in. With the current session ID as parameter.
  */
	login() {
		var _this11 = this;

		var forceLogin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		var setSessionId = function setSessionId(sessionId) {
			var cookie = `SESSION_ID=${sessionId}; M6UserName=${_this11._options.username}`;
			_this11.http._cookie = cookie;
			return sessionId;
		};

		var options = this._options;
		var baseUrl = this.school.url;
		var deleteUrl = `${baseUrl}/api/sessies/huidige`;
		var postUrl = `${baseUrl}/api/sessies`;

		var promise = void 0;
		if (!forceLogin && options.sessionId) {
			promise = Promise.resolve(options.sessionId);
		} else {
			// delete the current session
			promise = this.http.delete(deleteUrl).then(function (r) {
				setSessionId(/[a-z\d-]+/.exec(r.headers.get('set-cookie'))[0]);

				// create a new session
				return _this11.http.post(postUrl, {
					Gebruikersnaam: options.username,
					Wachtwoord: options.password,
					IngelogdBlijven: options.keepLoggedIn
				});
			}).then(function (r) {
				return (/[a-z\d-]+/.exec(r.headers.get('set-cookie'))[0]
				);
			}).catch(function (err) {
				throw ['Ongeldig account of verkeerde combinatie van gebruikersnaam en wachtwoord. Probeer het nog eens of neem contact op met de applicatiebeheerder van de school.', 'Je gebruikersnaam en/of wachtwoord is niet correct.'].includes(err.message) ? new _authError2.default(err.message) : err;
			});
		}

		return promise.then(setSessionId).then(function (sessionId) {
			return _this11.http.get(`${baseUrl}/api/account`).then(function (res) {
				return res.json();
			}).then(function (res) {
				var id = res.Persoon.Id;

				// REVIEW: do we want to make profileInfo a function?
				_this11.profileInfo = new _profileInfo2.default(_this11, res.Persoon);
				_this11._privileges = new _privileges2.default(_this11, res.Groep[0].Privileges);

				_this11._personUrl = `${baseUrl}/api/personen/${id}`;
				_this11._pupilUrl = `${baseUrl}/api/leerlingen/${id}`;

				return sessionId;
			});
		});
	}
}

/**
 * Create a new Magister object using `options`.
 * @param {Object} options
 * 	@param {School} options.school The school to login to.
 * 	@param {String} [options.username] The username of the user to login to.
 * 	@param {String} [options.password] The password of the user to login to.
 * 	@param {String} [options.sessionId] The sessionId to use. (instead of the username and password)
 * 	@param {Boolean} [options.keepLoggedIn=true] Whether or not to keep the user logged in.
 * 	@param {Boolean} [options.login=true] Whether or not to call `Magister#login` before returning the object.
 * @return {Promise<Magister>}
 */
function magister(options) {
	_lodash2.default.defaults(options, {
		keepLoggedIn: true,
		login: true
	});
	var rej = function rej(s) {
		return Promise.reject(new Error(s));
	};

	if (!options.sessionId) {
		if (!options.school) {
			return rej('Missing school');
		}
		if (!options.username) {
			return rej('Missing username');
		}
		if (!options.password) {
			return rej('Missing password');
		}
	}
	/*	if (!(
 		options.school &&
 		(options.sessionId || (options.username && options.password))
 	)) {
 		return rej('school and username&password or sessionId are required.')
 	}*/

	if (!_lodash2.default.isObject(options.school)) {
		return rej('school is not an object');
	} else if (!_lodash2.default.isString(options.school.url)) {
		return rej('`school.url` is not a string');
	}

	return Promise.resolve().then(function () {
		var m = new Magister(options, options.school, new _http2.default());
		return options.login ? m.login().then(function () {
			return m;
		}) : m;
	});
}

/**
 * Get the schools matching `query`.
 * @param {String} query
 * @return {Promise<School[]>}
 */
function getSchools(query) {
	query = query.replace(/\d/g, '');
	query = query.trim();
	query = query.replace(/ +/g, '+');

	if (query.length < 3) {
		return Promise.resolve([]);
	}

	return (0, _nodeFetch2.default)(`https://mijn.magister.net/api/schools?filter=${query}`).then(function (res) {
		return res.json();
	}).then(function (schools) {
		return schools.map(function (school) {
			return new _school2.default(school);
		});
	});
}

/**
 * The version of the library.
 * @type String
 * @readonly
 */
var VERSION = exports.VERSION = '2.0.0-alpha1.3';
exports.AbsenceInfo = _absenceInfo2.default;
exports.Activity = _activity2.default;
exports.ActivityElement = _activityElement2.default;
exports.AddressInfo = _addressInfo2.default;
exports.Appointment = _appointment2.default;
exports.Assignment = _assignment2.default;
exports.AssignmentVersion = _assignmentVersion2.default;
exports.AuthError = _authError2.default;
exports.Class = _class2.default;
exports.Course = _course2.default;
exports.File = _file2.default;
exports.FileFolder = _fileFolder2.default;
exports.Grade = _grade2.default;
exports.GradePeriod = _gradePeriod2.default;
exports.GradeType = _gradeType2.default;
exports.Magister = Magister;
exports.Message = _message2.default;
exports.MessageFolder = _messageFolder2.default;
exports.Person = _person2.default;
exports.Privileges = _privileges2.default;
exports.ProfileInfo = _profileInfo2.default;
exports.ProfileSettings = _profileSettings2.default;
exports.School = _school2.default;
exports.SchoolUtility = _schoolUtility2.default;
exports.VersionInfo = _versionInfo2.default;