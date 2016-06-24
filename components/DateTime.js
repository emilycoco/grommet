'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _KeyboardAccelerators = require('../utils/KeyboardAccelerators');

var _KeyboardAccelerators2 = _interopRequireDefault(_KeyboardAccelerators);

var _Drop = require('../utils/Drop');

var _Drop2 = _interopRequireDefault(_Drop);

var _DOM = require('../utils/DOM');

var _Button = require('./Button');

var _Button2 = _interopRequireDefault(_Button);

var _Clock = require('./icons/base/Clock');

var _Clock2 = _interopRequireDefault(_Clock);

var _Calendar = require('./icons/base/Calendar');

var _Calendar2 = _interopRequireDefault(_Calendar);

var _DateTimeDrop = require('./DateTimeDrop');

var _DateTimeDrop2 = _interopRequireDefault(_DateTimeDrop);

var _CSSClassnames = require('../utils/CSSClassnames');

var _CSSClassnames2 = _interopRequireDefault(_CSSClassnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

var CLASS_ROOT = _CSSClassnames2.default.DATE_TIME;
var FORM_FIELD = _CSSClassnames2.default.FORM_FIELD;
var FORMATS = {
  M: 'months',
  D: 'days',
  Y: 'years',
  H: 'hours',
  h: 'hours',
  m: 'minutes',
  s: 'seconds'
};
var TIME_REGEXP = new RegExp('[hmsa]');

var DateTime = function (_Component) {
  _inherits(DateTime, _Component);

  function DateTime(props) {
    _classCallCheck(this, DateTime);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DateTime).call(this, props));

    _this._onInputChange = _this._onInputChange.bind(_this);
    _this._onOpen = _this._onOpen.bind(_this);
    _this._onClose = _this._onClose.bind(_this);
    _this._onNext = _this._onNext.bind(_this);
    _this._onPrevious = _this._onPrevious.bind(_this);
    _this._cursorScope = _this._cursorScope.bind(_this);
    _this._notify = _this._notify.bind(_this);

    _this.state = _this._stateFromProps(props);
    _this.state.cursor = -1;
    _this.state.dropActive = false;
    return _this;
  }

  _createClass(DateTime, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._activation(this.state.dropActive);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      this.setState(this._stateFromProps(newProps));
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      // Set up keyboard listeners appropriate to the current state.
      if (prevState.dropActive !== this.state.dropActive) {
        this._activation(this.state.dropActive);
      }

      if (this.state.dropActive) {
        this._drop.render(this._renderDrop());
      }

      if (this.state.cursor >= 0) {
        this.refs.input.setSelectionRange(this.state.cursor, this.state.cursor);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._activation(false);
    }
  }, {
    key: '_stateFromProps',
    value: function _stateFromProps(props) {
      var value = props.value;
      var format = props.format;

      var result = { current: undefined };
      var date = (0, _moment2.default)(value, format);
      if (date.isValid()) {
        result.current = date;
      } else {
        result.current = (0, _moment2.default)().startOf('hour').add(1, 'hour');
      }
      // figure out which scope the step should apply to
      if (format.indexOf('s') !== -1) {
        result.stepScope = 'second';
      } else if (format.indexOf('m') !== -1) {
        result.stepScope = 'minute';
      } else if (format.indexOf('h') !== -1) {
        result.stepScope = 'hour';
      }
      return result;
    }
  }, {
    key: '_onInputChange',
    value: function _onInputChange(event) {
      var _props = this.props;
      var format = _props.format;
      var onChange = _props.onChange;

      var value = event.target.value;
      if (value.length > 0) {
        var date = (0, _moment2.default)(value, format);
        // Only notify if the value looks valid
        if (date.isValid() && !date.parsingFlags().charsLeftOver) {
          if (onChange) {
            onChange(value);
          }
        } else if (typeof this.props.value === 'string' && value.length < this.props.value.length) {
          // or if the user is removing characters
          if (onChange) {
            onChange(value);
          }
        }
      } else {
        if (onChange) {
          onChange(value);
        }
      }
    }
  }, {
    key: '_notify',
    value: function _notify(date) {
      if (this.props.onChange) {
        this.props.onChange(date);
      }
    }
  }, {
    key: '_onOpen',
    value: function _onOpen(event) {
      event.preventDefault();
      this.setState({ dropActive: true });
    }
  }, {
    key: '_onClose',
    value: function _onClose(event) {
      var drop = document.getElementById('date-time-drop');
      if (!(0, _DOM.isDescendant)(this.refs.component, event.target) && !(0, _DOM.isDescendant)(drop, event.target)) {
        this.setState({ dropActive: false, cursor: -1 });
      }
    }
  }, {
    key: '_onNext',
    value: function _onNext(event) {
      event.preventDefault();
      var date = this.state.current.clone();
      var scope = this._cursorScope();
      if ('a' === scope) {
        if (date.hours() < 12) {
          date.add(12, 'hours');
        }
      } else if ('m' === scope) {
        date.add(this.props.step, FORMATS[scope]);
      } else {
        date.add(1, FORMATS[scope]);
      }
      this.setState({ current: date }, this._notify(date));
    }
  }, {
    key: '_onPrevious',
    value: function _onPrevious(event) {
      event.preventDefault();
      var date = this.state.current.clone();
      var scope = this._cursorScope();
      if ('a' === scope) {
        if (date.hours() >= 12) {
          date.subtract(12, 'hours');
        }
      } else if ('m' === scope) {
        date.subtract(this.props.step, FORMATS[scope]);
      } else {
        date.subtract(1, FORMATS[scope]);
      }
      this.setState({ current: date }, this._notify(date));
    }
  }, {
    key: '_cursorScope',
    value: function _cursorScope() {
      var format = this.props.format;

      var input = this.refs.input;
      var value = input.value;
      var end = input.selectionEnd;
      this.setState({ cursor: end });
      // Figure out which aspect of the date the cursor is on, so we know what
      // to change.
      var preDate = (0, _moment2.default)(value.slice(0, end + 1), format);
      var formatTokens = format.split(/[^A-Za-z]/);
      var unusedTokens = preDate.parsingFlags().unusedTokens;
      var index = -1;
      while (formatTokens[index + 1] !== unusedTokens[0]) {
        index += 1;
      }
      return formatTokens[index][0];
    }
  }, {
    key: '_activation',
    value: function _activation(dropActive) {

      var listeners = {
        esc: this._onClose,
        tab: this._onClose,
        enter: this._onSelectDate,
        up: this._onPrevious,
        down: this._onNext
      };

      if (dropActive) {

        document.addEventListener('click', this._onClose);
        _KeyboardAccelerators2.default.startListeningToKeyboard(this, listeners);

        // If this is inside a FormField, place the drop in reference to it.
        var control = (0, _DOM.findAncestor)(this.refs.component, '.' + FORM_FIELD) || this.refs.component;
        this._drop = _Drop2.default.add(control, this._renderDrop(), { align: { top: 'bottom', left: 'left' } });
      } else {

        document.removeEventListener('click', this._onClose);
        _KeyboardAccelerators2.default.stopListeningToKeyboard(this, listeners);

        if (this._drop) {
          this._drop.remove();
          this._drop = null;
        }
      }
    }
  }, {
    key: '_renderDrop',
    value: function _renderDrop() {
      return _react2.default.createElement(_DateTimeDrop2.default, { format: this.props.format, value: this.state.current,
        step: this.props.step, onChange: this._notify });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var className = _props2.className;
      var format = _props2.format;
      var id = _props2.id;
      var name = _props2.name;
      var dropActive = this.state.dropActive;
      var value = this.props.value;

      var classes = [CLASS_ROOT];
      if (dropActive) {
        classes.push(CLASS_ROOT + '--active');
      }
      if (className) {
        classes.push(className);
      }
      if (value instanceof Date) {
        value = (0, _moment2.default)(value).format(format);
      } else if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        value = value.format(format);
      }
      var Icon = TIME_REGEXP.test(format) ? _Clock2.default : _Calendar2.default;

      return _react2.default.createElement(
        'div',
        { ref: 'component', className: classes.join(' ') },
        _react2.default.createElement('input', { ref: 'input', className: CLASS_ROOT + '__input',
          id: id, placeholder: format, name: name, value: value,
          onChange: this._onInputChange, onFocus: this._onOpen }),
        _react2.default.createElement(_Button2.default, { className: CLASS_ROOT + '__control', icon: _react2.default.createElement(Icon, null),
          onClick: this._onOpen })
      );
    }
  }]);

  return DateTime;
}(_react.Component);

exports.default = DateTime;


DateTime.propTypes = {
  format: _react.PropTypes.string,
  id: _react.PropTypes.string,
  name: _react.PropTypes.string,
  onChange: _react.PropTypes.func,
  step: _react.PropTypes.number,
  value: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object])
};

DateTime.defaultProps = {
  format: 'M/D/YYYY h:mm a',
  step: 1
};
module.exports = exports['default'];