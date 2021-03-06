'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _magisterThing = require('./magisterThing');

var _magisterThing2 = _interopRequireDefault(_magisterThing);

var _addressInfo = require('./addressInfo');

var _addressInfo2 = _interopRequireDefault(_addressInfo);

var _profileSettings = require('./profileSettings');

var _profileSettings2 = _interopRequireDefault(_profileSettings);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @extends MagisterThing
 * @private
 */
class ProfileInfo extends _magisterThing2.default {
	/**
  * @param {Magister} magister
  * @param {Object} raw
  */
	constructor(magister, raw) {
		super(magister);

		/**
   * @readonly
   * @type String
   */
		this.id = (0, _util.toString)(raw.Id);
		/**
   * @readonly
   * @type String
   */
		this.officialFirstNames = raw.OfficieleVoornamen;
		/**
   * @readonly
   * @type String
   */
		this.initials = raw.Voorletters;
		/**
   * @readonly
   * @type String
   */
		this.namePrefix = raw.Tussenvoegsel;
		/**
   * @readonly
   * @type String
   */
		this.officialSurname = raw.OfficieleAchternaam;
		/**
   * @readonly
   * @type String
   */
		this.birthSurname = raw.GeboorteAchternaam;
		/**
   * @readonly
   * @type String
   */
		this.birthNamePrefix = raw.GeboortenaamTussenvoegsel;
		/**
   * @readonly
   * @type Boolean
   */
		this.useBirthname = raw.GebruikGeboortenaam;
		/**
   * @readonly
   * @type String
   */
		this.firstName = raw.Roepnaam;
		/**
   * @readonly
   * @type String
   */
		this.lastName = raw.Achternaam;
		/**
   * @readonly
   * @type Date
   */
		this.birthDate = (0, _util.parseDate)(raw.Geboortedatum);

		/**
   * @readonly
   * @type Boolean
   */
		this.isChild = raw.ZichtbaarVoorOuder != null;
		/**
   * `undefined` when `this.isChild` is `false`.
   * @readonly
   * @type Boolean|undefined
   */
		this.isVisibleForParent = raw.ZichtbaarVoorOuder;
	}

	/**
  * @param {Boolean} [useBirthname=this.useBirthname]
  * @return String
  */
	getFullName() {
		var useBirthname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.useBirthname;

		return (0, _lodash2.default)(useBirthname ? [this.officialFirstNames, this.birthNamePrefix, this.birthSurname] : [this.firstName, this.namePrefix, this.lastName]).compact().join(' ');
	}

	/**
  * Opens a stream to the profile picture of the current user with the given
  * options.
  *
  * @param {Number} [width=640] The width of the picture.
  * @param {Number} [height=640] The height of the picture.
  * @param {Boolean} [crop=false] Whether or not to crop the image.
  * @return {Promise<Stream>}
  */
	getProfilePicture() {
		var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 640;
		var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 640;
		var crop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

		var url = `${this._magister._personUrl}/foto?width=${width}&height=${height}&crop=${crop}`;
		return this._magister.http.get(url).then(function (res) {
			return res.body;
		});
	}

	/**
  * @return {Promise<Error|AddressInfo>}
  */
	address() {
		var _this = this;

		var url = `${this._magister._personUrl}/adresprofiel`;

		return this._magister._privileges.needs('profiel', 'read').then(function () {
			return _this._magister.http.get(url);
		}).then(function (res) {
			return res.json();
		}).then(function (raw) {
			return new _addressInfo2.default(_this._magister, raw);
		});
	}

	/**
  * @return {Promise<Error|ProfileSettings>}
  */
	settings() {
		var _this2 = this;

		var url = `${this._magister._personUrl}/profiel`;

		return this._magister._privileges.needs('profiel', 'read').then(function () {
			return _this2._magister.http.get(url);
		}).then(function (res) {
			return res.json();
		}).then(function (raw) {
			return new _profileSettings2.default(_this2._magister, raw);
		});
	}
}

exports.default = ProfileInfo;