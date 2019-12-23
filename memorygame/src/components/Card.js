import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Card.scss';

/* * * *
 * NOTE: For react-testing-library, we use ...props since 'data-testid' is not a valid way to write a variable"
 */
const Card = ({ number, onClick, index, showCard, style, ...props }) => {
  const defaultOnClick = () => {
    onClick(index, number);
  };

  return (
    <div className="card" onClick={defaultOnClick} style={style} {...props}>
      {showCard ? number : ''}
    </div>
  );
};

Card.propTypes = {
  number: PropTypes.number,
  onClick: PropTypes.func,
  index: PropTypes.number,
  showCard: PropTypes.bool,
};

Card.defaultProps = {
  number: -1,
  index: -1,
  showCard: false,
  onClick: () => {},
};

export default Card;
