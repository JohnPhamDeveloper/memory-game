import React from 'react';
import PropTypes from 'prop-types';

const InputText = ({ ref, inputFor, value, onChange }) => {
  const inputForToLower = inputFor.toLowerCase();

  return (
    <input
      className={`${inputForToLower}-input`}
      type="text"
      name={`${inputForToLower}-input`}
      value={value}
      placeholder={inputFor}
      onChange={onChange}
      ref={ref}
    />
  );
};

InputText.propTypes = {
  inputFor: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  ref: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
};

InputText.defaultProps = {
  inputFor: 'NULL',
  value: '',
  onChange: () => {},
  ref: () => {},
};

export default InputText;
