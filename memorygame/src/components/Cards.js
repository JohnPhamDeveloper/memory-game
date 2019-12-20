import React, { useEffect, useState, useRef } from 'react';
import { generatePlayingCards, shuffleCards } from './Cards.controller';
import Card from './Card';
import './Cards.scss';

const Cards = ({ numberOfCards, mismatchDelay }) => {
  const [cards, setCards] = useState([]); // Card components
  const [blockMouse, setBlockMouse] = useState(false);
  const [currentSelectedCards, setCurrentSelectedCards] = useState([]); // Cards currently selected by player
  const [previouslySelectedCards, setPreviouslySelectedCards] = useState([]); // All cards that matched already

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

    // Used in onClick function to prevent stale state
    cardsRef.current = cards;
  }, [cards]);

  useEffect(() => {
    // Game is over when all cards are selected
    if (previouslySelectedCards.length === cards.length) {
      console.log('Game is over!');
    }

    // Find the previously selected cards and modify their style so that their color is green
    // and make them unclickable
    const tempCards = cards.slice();
    console.log(previouslySelectedCards);
    for (let i = 0; i < previouslySelectedCards.length; i++) {
      const cardComponent = tempCards[previouslySelectedCards[i]];
      const updatedCardComponent = (
        <Card
          {...cardComponent.props}
          key={cardComponent.props.id}
          style={{ pointerEvents: 'none', backgroundColor: 'green' }}
        />
      );

      tempCards[previouslySelectedCards[i]] = updatedCardComponent;
    }

    setCards(tempCards);

    console.log('updated');
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
        setPreviouslySelectedCards(oldArray => [...oldArray, cardIndex1, cardIndex2]);
        setBlockMouse(false);
      } else {
        // Bad match, so "flip" them back
        // Wait 2 second so they can see the second card
        // At the same time, block user input
        console.log('Not matched');
        if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;

          const tempCards = cards.slice();

          tempCards[cardIndex1] = (
            <Card {...cards[cardIndex1].props} key={cards[cardIndex1].props.id} showCard={false} />
          );

          tempCards[cardIndex2] = (
            <Card {...cards[cardIndex2].props} key={cards[cardIndex2].props.id} showCard={false} />
          );

          setCards(tempCards);
          setBlockMouse(false);
        }, mismatchDelay);
      }

      setCurrentSelectedCards([]);
    }
  }, [currentSelectedCards]);

  // Generate card components to store into card state
  const generateCards = () => {
    generatePlayingCards();
    const tempCards = generatePlayingCards(numberOfCards, onCardClick);
    shuffleCards(tempCards);
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
