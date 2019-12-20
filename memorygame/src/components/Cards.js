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

  /**
   * TODO HERE
   */
  useEffect(() => {
    // Player has selected two cards
    if (selectedCardsIndex && selectedCardsIndex.length === 2) {
      console.log('Applying game logic...');

      // TODO: make more readable
      if (cards[selectedCardsIndex[0]].props.number === cards[selectedCardsIndex[1]].props.number) {
        console.log('Matched');
      } else {
        console.log('Not matched');
      }

      // Clear, then unshow those two cards if they are not a match
      setSelectedCardsIndex([]);
    }
  }, [selectedCardsIndex]);

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

  const onCardClick = (index, number) => {
    console.log('Index: ', index);
    console.log('Number: ', number);
    setSelectedCardsIndex(oldArray => [...oldArray, index]);
  };

  const renderCards = () => {
    return cards.map(card => card);
  };

  // https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
  const shuffle = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);

      // Give the component a new index since shuffling changes position in array
      // Also use id to modify the key because key is not directly accessible as a prop
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
