'use strict';

Object.defineProperty(exports, "__esModule", {
		value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _magisterThing = require('./magisterThing');

var _magisterThing2 = _interopRequireDefault(_magisterThing);

var _util = require('./util');

var _gradeType = require('./gradeType');

var _gradeType2 = _interopRequireDefault(_gradeType);

var _gradePeriod = require('./gradePeriod');

var _gradePeriod2 = _interopRequireDefault(_gradePeriod);

var _class = require('./class');

var _class2 = _interopRequireDefault(_class);

var _person = require('./person');

var _person2 = _interopRequireDefault(_person);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @extends MagisterThing
 * @private
 */
class Grade extends _magisterThing2.default {
		/**
   * @param {Magister} magister
   * @param {Object} raw
   */
		constructor(magister, raw) {
				super(magister);

				/**
     * Should be set by `Course#grades`!
     * @type String
     * @private
     */
				this._fillUrl = undefined;

				/**
     * @type String
     * @readonly
     */
				this.id = (0, _util.toString)(raw.CijferId);
				/**
     * @type String
     * @readonly
     */
				this.grade = raw.CijferStr;
				/**
     * @type Boolean
     * @readonly
     */
				this.passed = raw.IsVoldoende;
				/**
     * @type Date
     * @readonly
     */
				this.dateFilledIn = (0, _util.parseDate)(raw.DatumIngevoerd);

				/**
     * @type Class
     * @readonly
     */
				this.class = new _class2.default(magister, raw.Vak);

				/**
     * @type Boolean
     * @readonly
     */
				this.atLaterDate = raw.Inhalen;
				/**
     * @type Boolean
     * @readonly
     */
				this.exemption = raw.Vrijstelling;
				/**
     * @type Boolean
     * @readonly
     */
				this.counts = raw.TeltMee;

				/**
     * @type GradePeriod
     * @readonly
     * @default null
     */
				this.period = raw.Periode == null ? null : new _gradePeriod2.default(magister, raw.Periode);

				/**
     * @type GradeType
     * @readonly
     * @default null
     */
				this.type = raw.CijferKolom == null ? null : new _gradeType2.default(magister, raw.CijferKolom);

				/**
     * @type String
     * @readonly
     */
				this.assignmentId = (0, _util.toString)(raw.CijferKolomIdEloOpdracht);

				/**
     * @type Person
     * @readonly
     */
				this.teacher = new _person2.default(magister, { Docentcode: raw.Docent }, 3);

				/**
     * @type Boolean
     * @readonly
     */
				this.classExemption = raw.VakDispensatie || raw.VakVrijstelling;

				/**
     * Value will be set by `Grade#fill`
     * @type String
     * @default ''
     */
				this.description = '';
				/**
     * Value will be set by `Grade#fill`
     * @type String
     * @default 0
     */
				this.weight = 0;
				/**
     * Value will be set by `Grade#fill`
     * @type Date
     * @default undefined
     */
				this.testDate = undefined;
		}

		// TODO: add ability to fill persons
		/**
   * @return {Promise<Grade>}
   */
		fill() {
				var _this = this;

				if (this._filled) {
						return Promise.resolve(this);
				}
				(0, _assert2.default)(this._fillUrl != null, 'this._fillUrl not set');

				return this._magister.http.get(this._fillUrl).then(function (res) {
						return res.json();
				}).then(function (res) {
						_this.testDate = (0, _util.parseDate)(res.WerkinformatieDatumIngevoerd);
						_this.description = _lodash2.default.trim(res.WerkInformatieOmschrijving);
						_this.weight = Number.parseInt(res.Weging, 10) || 0;

						_this.type.level = res.KolomNiveau;
						_this.type.description = _lodash2.default.trim(res.KolomOmschrijving);

						_this.filled = true;
						return _this;
				});
		}
}

exports.default = Grade;