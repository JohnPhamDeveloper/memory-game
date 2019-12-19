import React from 'react';
import PropTypes from 'prop-types';

const InputText = ({ inputFor, value, onChange }) => {
  const inputForToLower = inputFor.toLowerCase();

  return (
    <input
      classinputFor={`${inputForToLower}-input`}
      type="text"
      name={`${inputForToLower}-input`}
      value={value}
      placeholder={inputFor}
      onChange={onChange}
    />
  );
};

InputText.propTypes = {
  inputFor: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

InputText.defaultProps = {
  inputFor: 'NULL',
  value: 'NULL',
  onChange: () => console.log('onChange null'),
};

export default InputText;
