import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Cards from './components/Cards';
import './app.scss';
import './typography.scss';
import InputText from './components/InputText';
import InputButton from './components/InputButton';

const App = () => {
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
    <div className="App">
      <Login />
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
    </div>
  );
};

export default App;
