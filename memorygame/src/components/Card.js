import React from 'react';
import PropTypes from 'prop-types';
import './Card.scss';

const Card = ({ number }) => {
  return <div className="card">{number}</div>;
};

Card.propTypes = {
  number: PropTypes.number,
};

Card.defaultProps = {
  number: 'NULL',
};

export default Card;
