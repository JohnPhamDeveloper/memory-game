import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Card.scss';

const Card = ({ number, onClick, index, showCard }) => {
  //const [show, setShow] = useState(false);

  // useEffect(() => {
  //   console.log('show card changed: ', showCard);
  //   setShow(showCard);
  // }, [showCard]);

  // useEffect(() => {
  //   console.log('show card changed: ', showCard);
  //   // Sync state with props
  //   if (showCard !== show) {
  //     setShow(showCard);
  //   }
  // }, [show]);

  const defaultOnClick = () => {
    onClick(index, number);
  };

  return (
    <div className="card" onClick={defaultOnClick}>
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
