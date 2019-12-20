import React, { useEffect, useState } from 'react';
import Card from './Card';
import './Cards.scss';

const Cards = ({ numberOfCards }) => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Generate cards on mount
    generateCards();
  }, []);

  useEffect(() => {
    // Clear the cards since user has chosen a different number of cards
    clearCards();
  }, [numberOfCards]);

  useEffect(() => {
    // Re-genderate cards since cards were cleared
    if (cards && cards.length <= 0) generateCards();
  }, [cards]);

  const generateCards = () => {
    const tempCards = [];

    for (let i = 1; i <= numberOfCards; i++) {
      const component = <Card key={`card-${i}`} number={i} />;
      const component2 = <Card key={`card-${i}-paired`} number={i} />;
      tempCards.push(component, component2); // Push twice so that there are two cards that can match
    }

    shuffle(tempCards);
    setCards(tempCards);
  };

  const clearCards = () => setCards([]);

  const renderCards = () => {
    return cards.map(card => card);
  };

  // https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
  const shuffle = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  return <div className="cards">{renderCards()}</div>;
};

export default Cards;
