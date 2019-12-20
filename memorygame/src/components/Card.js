import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Card.scss';

const Card = ({ number, onClick }) => {
  const [show, setShow] = useState(false);

  const defaultOnClick = () => {
    setShow(!show);
    onClick();
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
};

Card.defaultProps = {
  number: 'NULL',
  onClick: () => {},
};

export default Card;
