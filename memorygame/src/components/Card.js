import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Card.scss';

const Card = ({ number, onClick, index, showCard }) => {
  const [show, setShow] = useState(showCard);

  const defaultOnClick = () => {
    setShow(true); // Not allowed to flip again, so it stays true
    onClick(index, number);
  };

  return (
    <div className="card" onClick={defaultOnClick}>
      {show ? number : ''}
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
