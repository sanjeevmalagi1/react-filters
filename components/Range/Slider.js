import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import { isWithinRange, suppress, isArrayEqual } from './utils';
import getNearestValue from './helpers/getNearestValue';
import Control from './Control';
import Steps from './Steps';
import autoBind from '../utils/autoBind';

export default class Slider extends Component {
  constructor (props) {
    super(props);

    this.state = {
      trackOffset: {}
    };

    autoBind([
      'onChange',
      'onControlChange',
      'handleClick',
      'updatePosition'
    ], this);
  }

  componentDidMount () {
    this.updatePosition();
    window.addEventListener('resize', this.updatePosition);
  }

  componentWillReceiveProps () {
    this.updatePosition();
  }

  shouldComponentUpdate (newProps, newState) {
    return isWithinRange(newProps, newProps.value) &&
      (!isArrayEqual(this.props.value, newProps.value) || !!this.isRerenderRequired ||
      this.state.trackOffset.width !== newState.trackOffset.width);
  }

  componentDidUpdate () {
    this.isRerenderRequired = false;
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updatePosition);
  }

  onChange (value, changed) {
    this.props.onChange({
      name: this.props.name,
      value,
      changed
    });
  }

  onControlChange (data, isRerenderRequired) {
    const value = data.name === 'lower' ? [data.value, this.props.value[1]] :
      [this.props.value[0], data.value];

    // only trigger on first onChange trigger
    this.isRerenderRequired = isRerenderRequired;

    if (isWithinRange(this.props, value) && !isArrayEqual(this.props.value, value)) {
      this.onChange(value, data.name);
    }
  }

  getTrackOffset () {
    return this.state.trackOffset;
  }

  getTrackWidth () {
    return this.state.trackOffset ? this.state.trackOffset.width : 0;
  }

  updatePosition () {
    const track = this.refs.track;
    this.setState({
      trackOffset: track ? track.getBoundingClientRect() : {}
    });
  }

  handleClick (e) {
    suppress(e);
    const newData = getNearestValue(e, this.props, this.getTrackWidth(), this.getTrackOffset());
    this.onChange(newData.value, newData.changed);
  }

  render () {
    const {
      name,
      disabled,
      step,
      orientation,
      min,
      max,
      precision,
      value,
      rangeTemplate,
      readOnly,
      showSteps
    } = this.props;

    const mainClass = classNames('react-filters', 'rf-range', name, {
      'rng-disabled': disabled
    });

    const railStyle = {
      left: `${Math.round((value[0] / max - min) * 100)}%`,
      width: `${((value[1] - value[0]) / (max - min)) * 100}%`
    };

    return (
      <div className={mainClass}>
        <div className='rng-wrapper'>
          <div
            className='rng-track'
            ref='track'
            onClick={!disabled && !showSteps && this.handleClick}
          >
            <div className='rng-rail' style={railStyle} />
          </div>
             {
               showSteps && <Steps
                 step={step}
                 min={min}
                 max={max}
                 value={value}
                 onClick={this.handleClick}
               />
             }
          <Control
            value={value[0]}
            name={'lower'}
            step={step}
            orientation={orientation}
            trackOffset={this.getTrackOffset()}
            onChange={this.onControlChange}
            min={min}
            max={max}
            precision={precision}
            readOnly={readOnly}
            disabled={disabled}
          />
          <Control
            value={value[1]}
            name={'upper'}
            step={step}
            orientation={orientation}
            trackOffset={this.getTrackOffset()}
            onChange={this.onControlChange}
            min={min}
            max={max}
            precision={precision}
            readOnly={readOnly}
            disabled={disabled}
          />
        </div>
           {rangeTemplate(min, max)}
      </div>
    );
  }
}

Slider.propTypes = {
  disabled: PropTypes.bool,
  max: PropTypes.number,
  min: PropTypes.number,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  orientation: PropTypes.string,
  precision: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.array,
  rangeTemplate: PropTypes.func,
  readOnly: PropTypes.bool,
  showSteps: PropTypes.bool
};

Slider.defaultProps = {
  disabled: false,
  max: 20,
  min: 0,
  orientation: 'horizontal',
  precision: 0,
  step: 1,
  value: [5, 10],
  readOnly: false,
  showSteps: false,
  rangeTemplate (min, max) {
    return (
      <div className='rng-range'>
        <div className='rng-range-min'>{min}</div>
        <div className='rng-range-max'>{max}</div>
      </div>
    );
  }
};
