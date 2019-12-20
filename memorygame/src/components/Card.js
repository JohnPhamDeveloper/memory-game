import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Card.scss';

const Card = ({ number, onClick, index, showCard, style }) => {
  const defaultOnClick = () => {
    onClick(index, number);
  };

  return (
    <div className="card" onClick={defaultOnClick} style={style}>
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
  number: 'NULL',
  index: -1,
  showCard: false,
  onClick: () => {},
};

export default Card;
