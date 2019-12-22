import React, { useEffect, useState, useRef } from 'react';
import { generatePlayingCards } from './Cards.controller';
import PropTypes from 'prop-types';
import Card from './Card';
import './Cards.scss';

const Cards = ({
  mismatchDelay,
  cardsDatas,
  onCardClick,
  onCardsMatched,
  onCardsMismatched,
  cardsClickedIndexes,
  resetCards,
  onCardsWillCompare,
}) => {
  const [cards, setCards] = useState([]); // Card components
  const [previouslySelectedCards, setPreviouslySelectedCards] = useState([]); // All cards that matched already
  const [cardsJustGenerated, setCardsJustGenerated] = useState(true);

  // Use a ref to our cards because this will be used in an onClick function
  // If I don't use a ref, the state will be stale inside the onClick function
  const cardsRef = useRef(cards);
  const timeoutRef = useRef(null); // When wrong cards are selected, show them for a bit before flipping

  /* * * * * * * * *
   * CARD CLICKED EVENT
   * * * * * * * * * */
  useEffect(() => {
    showCardsInDeck(cardsClickedIndexes);
  }, [cardsClickedIndexes]);

  useEffect(() => {
    if (resetCards) {
      setCardsJustGenerated(true);
      setPreviouslySelectedCards([]);
      setCards([]);
    }
  }, [resetCards]);

  useEffect(() => {
    if (cardsDatas) generateCards();
  }, [cardsDatas]);

  const createCopyOfCardWithPreviousProps = (card, style, showCard) => {
    return <Card {...card.props} key={card.props.id} style={style} showCard={showCard} />;
  };

  const showCardsInDeck = cardIndexes => {
    const tempCards = cardsRef.current.slice();
    const updatedCardComponentStyle = { pointerEvents: 'none', backgroundColor: 'pink' };
    cardIndexes.forEach(cardIndex => {
      const selectedCardComponent = tempCards[cardIndex];
      const updatedCardComponent = createCopyOfCardWithPreviousProps(
        selectedCardComponent,
        updatedCardComponentStyle,
        true,
      );
      tempCards[cardIndex] = updatedCardComponent;
    });

    setCards(tempCards);
  };

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  useEffect(() => {
    // Game is over when all cards are selected
    if (previouslySelectedCards.length === cards.length && !cardsJustGenerated) {
      console.log('Game is over!');
    }

    //
    if (!previouslySelectedCards || previouslySelectedCards.length <= 0) {
      console.log('HALTED');
      return;
    }

    // Find the previously selected cards and modify their style so that their color is green
    // and make them unclickable
    const tempCards = cards.slice();

    for (let i = 0; i < previouslySelectedCards.length; i++) {
      const cardComponent = tempCards[previouslySelectedCards[i]];
      const updatedCardStyle = { pointerEvents: 'none', backgroundColor: 'green' };
      const updatedCardComponent = createCopyOfCardWithPreviousProps(
        cardComponent,
        updatedCardStyle,
        true,
      );

      tempCards[previouslySelectedCards[i]] = updatedCardComponent;
    }
    setCards(tempCards);

    console.log('updated');
  }, [previouslySelectedCards]);

  /* * * * * * * * * * * * *
   * HANDLE MISMATCH CARDS  *
   * * * * * * * * * * * * */
  const handleMismatch = (cardIndex1, cardIndex2) => {
    timeoutRef.current = null;

    const tempCards = cards.slice();
    tempCards[cardIndex1] = createCopyOfCardWithPreviousProps(cards[cardIndex1], {}, false);
    tempCards[cardIndex2] = createCopyOfCardWithPreviousProps(cards[cardIndex2], {}, false);

    setCards(tempCards);
    //setCurrentSelectedCards([]);

    onCardsMismatched();
  };

  /* * * * * * * * * * * *
   * HANDLE MATCH CARDS  *
   * * * * * * * * * * * * */
  const handleMatch = (cardIndex1, cardIndex2) => {
    console.log('Matched');
    setPreviouslySelectedCards(oldArray => [...oldArray, cardIndex1, cardIndex2]);
    // setCurrentSelectedCards([]);

    onCardsMatched([cardIndex1, cardIndex2]);
  };

  /**
   * Two cards selected
   */
  useEffect(() => {
    // Player has selected two cards
    if (cardsClickedIndexes && cardsClickedIndexes.length === 2) {
      console.log('Applying game logic...');

      onCardsWillCompare();

      const cardIndex1 = cards[cardsClickedIndexes[0]].props.index;
      const cardIndex2 = cards[cardsClickedIndexes[1]].props.index;
      const cardNumber1 = cards[cardsClickedIndexes[0]].props.number;
      const cardNumber2 = cards[cardsClickedIndexes[1]].props.number;

      // Check if the two cards are the same number
      if (cardNumber1 === cardNumber2) {
        handleMatch(cardIndex1, cardIndex2);
      } else {
        // Bad match, so "flip" them back
        // Wait 2 second so they can see the second card
        // At the same time, block user input
        console.log('Not matched');
        if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
          handleMismatch(cardIndex1, cardIndex2);
        }, mismatchDelay);
      }
    }
  }, [cardsClickedIndexes]);

  // Generate card components to store into card state
  const generateCards = () => {
    const tempCards = generatePlayingCards(cardsDatas, onCardClick);
    setCards(tempCards);
  };

  //const onCardClick = (index, number) => emitCardClicked(index);

  const renderCards = () => {
    return cards.map(card => card);
  };

  return <div className="cards">{renderCards()}</div>;
};

Cards.propTypes = {
  mismatchDelay: PropTypes.number,
  cardsDatas: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number,
    }),
  ),
  onCardClick: PropTypes.func,
  onCardsMatched: PropTypes.func,
  onCardsMismatched: PropTypes.func,
  cardsClickedIndexes: PropTypes.arrayOf(PropTypes.number),
  resetCards: PropTypes.bool,
  onCardsWillCompare: PropTypes.func,
};

Cards.defaultProps = {
  mismatchDelay: 1000,
  cardsDatas: [],
  onCardClick: () => {},
  onCardsMatched: () => {},
  onCardsMismatched: () => {},
  cardsClickedIndexes: [],
  resetCards: false,
  onCardsWillCompare: () => {},
};

export default Cards;
