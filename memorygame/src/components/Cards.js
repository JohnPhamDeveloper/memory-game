import React, { useEffect, useState, useRef } from 'react';
import Card from './Card';
import './Cards.scss';

const Cards = ({ numberOfCards }) => {
  const [cards, setCards] = useState([]); // Card components
  const [blockMouse, setBlockMouse] = useState(false);
  const [currentSelectedCards, setCurrentSelectedCards] = useState([]); // Cards currently selected by player
  const [previouslySelectedCards, setPreviouslySelectedCards] = useState([]); // All cards that stay displayed

  // Use a ref to our cards because this will be used in an onClick function
  // If I don't use a ref, the state will be stale inside the onClick function
  const cardsRef = useRef(cards);
  const timeoutRef = useRef(null); // When wrong cards are selected, show them for a bit before flipping

  useEffect(() => {
    generateCards();
  }, []);

  useEffect(() => {
    // Clear the cards since user has chosen a different number of cards
    setCards([]);
  }, [numberOfCards]);

  useEffect(() => {
    // Re-generate cards since cards were cleared
    if (cards && cards.length <= 0) generateCards();
    cardsRef.current = cards;
  }, [cards]);

  useEffect(() => {
    // Game is over when all cards are selected
    if (previouslySelectedCards.length === cards.length) {
      console.log('Game is over!');
    }
  }, [previouslySelectedCards]);

  useEffect(() => {
    // Player has selected two cards
    if (currentSelectedCards && currentSelectedCards.length === 2) {
      console.log('Applying game logic...');

      setBlockMouse(true);
      const cardIndex1 = cards[currentSelectedCards[0]].props.index;
      const cardIndex2 = cards[currentSelectedCards[1]].props.index;
      const cardNumber1 = cards[currentSelectedCards[0]].props.number;
      const cardNumber2 = cards[currentSelectedCards[1]].props.number;

      // Check if the two cards are the same number
      if (cardNumber1 === cardNumber2) {
        console.log('Matched');
        setCurrentSelectedCards([]);
        setPreviouslySelectedCards(cardIndex1, cardIndex2);
        // setBlockMouse(false);
      } else {
        // Bad match, so "flip" them back
        // Wait 2 second so they can see the second card
        // At the same time, block user input
        if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);

        timeoutRef.current = null;

        // Then execute logic
        console.log('Not matched');

        const tempCards = cards.slice();

        tempCards[cardIndex1] = (
          <Card {...cards[cardIndex1].props} key={cards[cardIndex1].props.id} showCard={false} />
        );

        tempCards[cardIndex2] = (
          <Card {...cards[cardIndex2].props} key={cards[cardIndex2].props.id} showCard={false} />
        );

        setCards(tempCards);
        setBlockMouse(false);
      }

      setCurrentSelectedCards([]);
    }
  }, [currentSelectedCards]);

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
    setCurrentSelectedCards(oldArray => [...oldArray, index]);

    console.log(cardsRef.current);

    const tempCards = cardsRef.current.slice();
    const selectedCardComponent = tempCards[index];
    const updatedCardComponent = (
      <Card {...selectedCardComponent.props} key={selectedCardComponent.props.id} showCard />
    );
    tempCards[index] = updatedCardComponent;
    setCards(tempCards);
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
