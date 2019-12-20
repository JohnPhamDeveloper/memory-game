import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Card.scss';

const Card = ({ number, onClick, index }) => {
  const [show, setShow] = useState(false);

  const defaultOnClick = () => {
    setShow(!show);
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
};

Card.defaultProps = {
  number: 'NULL',
  index: -1,
  onClick: () => {},
};

export default Card;
