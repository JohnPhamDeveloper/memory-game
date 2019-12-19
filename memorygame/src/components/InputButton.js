import React from 'react';
import PropTypes from 'prop-types';

const InputButton = ({ inputFor, onClick }) => {
  const inputForToLower = inputFor.toLowerCase();

  return (
    <input
      className={`${inputForToLower}-button`}
      type="button"
      name={`${inputForToLower}-button`}
      onClick={onClick}
      value={inputFor}
    />
  );
};

InputButton.propTypes = {
  inputFor: PropTypes.string,
  onClick: PropTypes.func,
};

InputButton.defaultProps = {
  inputFor: 'NULL',
  onClick: () => console.error('onClick is undefined'),
};

export default InputButton;
