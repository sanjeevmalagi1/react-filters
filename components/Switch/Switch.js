import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

import autoBind from '../utils/autoBind';

export default class Switch extends Component {
  constructor (props) {
    super(props);
    autoBind([
      'handleClick'
    ], this);
  }

  shouldComponentUpdate (nextProps) {
    return (
      (nextProps.value !== this.props.value) ||
      (nextProps.count !== this.props.count)
    );
  }

  handleClick () {
    this.props.onChange({
      name: this.props.name,
      value: !this.props.value
    });
  }

  render () {
    const {
      name,
      label,
      labelPosition,
      value,
      disabled,
      countElem,
      count,
      iconElem
    } = this.props;

    const mainClass = classNames('react-filters', 'rf-switch', name, {
      'sw-disabled': disabled,
      'sw-active': value
    });

    const labelClass = classNames('sw-label', {
      'sw-before': labelPosition === 'before',
      'sw-after': labelPosition === 'after'
    });

    return (
      <div onClick={!disabled && this.handleClick} className={mainClass}>
           {label && <div className={labelClass}>
                          {label}
                          {count !== undefined && countElem(this.props)}
           </div>}
           {iconElem(this.props)}
      </div>
    );
  }
}

Switch.propTypes = {
  count: PropTypes.number,
  countElem: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element
  ]),
  disabled: PropTypes.bool,
  iconElem: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element
  ]),
  label: PropTypes.string,
  labelPosition: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.bool,
  iconLabel: PropTypes.array
};

function noop () {
}

Switch.defaultProps = {
  countElem (p) {
    return <span className='sw-count'>({p.count})</span>;
  },
  value: false,
  onChange: noop,
  labelPosition: 'before',
  disabled: false,
  iconElem (prop) {
    const labelClass = classNames('sw-icon-label', {
      'sw-il-left': prop.value,
      'sw-il-right': !prop.value
    });

    let iconLabelText;

    if (prop.iconLabel && prop.iconLabel.length) {
      iconLabelText = prop.value ? prop.iconLabel[0] : prop.iconLabel[1];
    }
    return (
      <div className='sw-wrapper'>
           {prop.iconLabel && prop.iconLabel.length &&
           (<div className={labelClass}>
                 {iconLabelText}
           </div>)
           }
        <div className='sw-btn'>
        </div>
      </div>
    );
  }
};
