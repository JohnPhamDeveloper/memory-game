import React, { useEffect, useState } from 'react';
import Card from './Card';
import './Cards.scss';

const Cards = ({ numberOfCards }) => {
  const [cards, setCards] = useState([]); // Card components
  const [blockMouse, setBlockMouse] = useState(false);
  const [selectedCardsIndex, setSelectedCardsIndex] = useState([]); // Cards currently selected by player

  useEffect(() => {
    generateCards();
  }, []);

  useEffect(() => {
    // Clear the cards since user has chosen a different number of cards
    setCards([]);
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

      // Block input here...
      setBlockMouse(true);

      const cardNumber1 = cards[selectedCardsIndex[0]].props.number;
      const cardNumber2 = cards[selectedCardsIndex[1]].props.number;

      // Check if the two cards are the same number
      if (cardNumber1 === cardNumber2) {
        console.log('Matched');
      } else {
        // Not the same, so "flip" them back

        // Wait 1 second so they can see the second card
        // At the same time, block user input
        setTimeout(() => {
          // Then execute logic
          console.log('Not matched');
          const cardIndex1 = cards[selectedCardsIndex[0]].props.index;
          const cardIndex2 = cards[selectedCardsIndex[1]].props.index;
          const tempCards = cards.slice();
          tempCards[cardIndex1] = (
            <Card {...cards[cardIndex1].props} key={cards[cardIndex1].props.id} showCard={false} />
          );
          tempCards[cardIndex2] = (
            <Card {...cards[cardIndex2].props} key={cards[cardIndex1].props.id} showCard={false} />
          );
          setCards(tempCards);
          setBlockMouse(false);
        }, 2000);
      }

      // Clear selected cards
      setSelectedCardsIndex([]);
    }
  }, [selectedCardsIndex]);

  // Generate card components to store into card state
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

      // This is the duplicate card
      const component2 = (
        <Card
          key={`card-${i} paired2`}
          id={`card-${i} paired2`}
          number={i}
          index={i}
          onClick={onCardClick}
        />
      );
      tempCards.push(component, component2);
    }

    shuffle(tempCards);
    setCards(tempCards);
  };

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

  return (
    <div
      className="cards"
      style={blockMouse ? { pointerEvents: 'none' } : { pointerEvents: 'all' }}
    >
      {renderCards()}
    </div>
  );
};

export default Cards;
