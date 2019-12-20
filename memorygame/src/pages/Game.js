import React, { useState, useEffect } from 'react';
import './Game.scss';
import Cards from '../components/Cards';
import InputText from '../components/InputText';
import InputButton from '../components/InputButton';

const Game = () => {
  const [numberOfCardsField, setNumberOfCardsField] = useState('');
  const [numberOfCardsSubmit, setNumberOfCardsSubmit] = useState(0);
  const [mismatchDelayField, setMismatchDelayField] = useState('');
  const [mismatchDelaySubmit, setMismatchDelaySubmit] = useState(2000);

  const onCardNumberChange = e => setNumberOfCardsField(e.target.value);
  const onDelayChange = e => setMismatchDelayField(e.target.value);

  const renderCards = () => {
    if (numberOfCardsSubmit <= 1)
      return <div className="card-number-error">Enter number of play cards greater than 2!</div>;

    return <Cards numberOfCards={numberOfCardsSubmit} />;
  };

  const onConfirmCardsSubmit = () => {
    setNumberOfCardsSubmit(numberOfCardsField);
  };

  const onDelaySubmit = () => {
    setMismatchDelaySubmit(mismatchDelayField);
  };
  // TODO: pass delay change into Cards
  return (
    <div className="game-page">
      {renderCards()}
      <div className="history">
        <div className="number-of-cards-field">
          <InputText
            inputFor="Number Of Cards"
            value={numberOfCardsField}
            onChange={onCardNumberChange}
          />
          <InputButton inputFor="Confirm Cards" onClick={onConfirmCardsSubmit} />
        </div>

        <div className="mismatch-delay-field">
          <InputText
            inputFor="Mismatch Delay"
            value={mismatchDelayField}
            onChange={onDelayChange}
          />
          <InputButton inputFor="Set Mismatch Delay" onClick={onDelaySubmit} />
        </div>
      </div>
    </div>
  );
};

export default Game;
