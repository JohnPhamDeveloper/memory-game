import React, { useState, useEffect } from 'react';
import Cards from '../components/Cards';
import InputText from '../components/InputText';
import InputButton from '../components/InputButton';

const Game = () => {
  const [numberOfCardsField, setNumberOfCardsField] = useState('');
  const [numberOfCardsSubmit, setNumberOfCardsSubmit] = useState(0);

  const onCardNumberChange = e => setNumberOfCardsField(e.target.value);

  const renderCards = () => {
    if (numberOfCardsSubmit <= 1)
      return <div className="card-number-error">Enter number of play cards greater than 2!</div>;

    return <Cards numberOfCards={numberOfCardsSubmit} />;
  };

  const onConfirmCardsSubmit = () => {
    setNumberOfCardsSubmit(numberOfCardsField);
  };

  return (
    <div className="game-page">
      {renderCards()}
      <div className="history">
        <InputText
          inputFor="Number of cards"
          value={numberOfCardsField}
          onChange={onCardNumberChange}
        />
        <InputButton inputFor="Confirm cards" onClick={onConfirmCardsSubmit} />
      </div>
    </div>
  );
};

export default Game;
