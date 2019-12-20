import React, { useEffect, useState } from 'react';
import Card from './Card';
import './Cards.scss';

const Cards = ({ numberOfCards }) => {
  const [cards, setCards] = useState([]);
  const [selectedCardsIndex, setSelectedCardsIndex] = useState([]);

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
      const component = (
        <Card
          key={`card-${i} paired1`}
          id={`card-${i} paired1`}
          number={i}
          index={i}
          onClick={onCardClick}
        />
      );
      const component2 = (
        <Card
          key={`card-${i} paired2`}
          id={`card-${i} paired2`}
          number={i}
          index={i}
          onClick={onCardClick}
        />
      );
      tempCards.push(component, component2); // Push twice so that there are two cards that can match
    }

    shuffle(tempCards);
    setCards(tempCards);
  };

  const clearCards = () => setCards([]);

  // Move to controller class?
  const onCardClick = (index, number) => {
    console.log('Index: ', index);
    console.log('Number: ', number);
  };

  const renderCards = () => {
    return cards.map(card => card);
  };

  // https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
  const shuffle = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);

      // Give the component a new index since shuffling changes position in array
      const modifiedComponentI = (
        <Card {...array[i].props} key={`${array[i].props.id} modified`} index={j} />
      );
      const modifiedComponentJ = (
        <Card {...array[j].props} key={`${array[j].props.id} modified`} index={i} />
      );

      // Swap, but use the modified version instead
      array[i] = modifiedComponentJ;
      array[j] = modifiedComponentI;
    }
  };

  return <div className="cards">{renderCards()}</div>;
};

export default Cards;
