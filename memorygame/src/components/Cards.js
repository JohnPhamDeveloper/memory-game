import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { generatePlayingCards } from './Cards.controller';
import Card from './Card';
import './cards.scss';

const Cards = ({
  mismatchDelay,
  cardsDatas,
  onCardClick,
  onCardsMatched,
  onCardsMismatched,
  onCardsWillCompare,
  onAllCardsMatched,
  cardsClickedIndexes,
  resetCards,
  onCardsDidCompare,
}) => {
  const [cards, setCards] = useState([]); // Card components
  const [previouslyMatchedCardsIndexes, setpreviouslyMatchedCardsIndexes] = useState([]); // All cards that matched already
  const [currentlySelectedCardsIndexes, setCurrentlySelectedCardsIndexes] = useState([]); // Currently selected cards (max 2)
  // const [cardsJustGenerated, setCardsJustGenerated] = useState(true);

  // Use a ref to our cards because this will be used in an onClick function
  // If I don't use a ref, the state will be stale inside the onClick function
  // const cardsRef = useRef(cards);
  const timeoutRef = useRef(null); // When wrong cards are selected, show them for a bit before flipping

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    setCurrentlySelectedCardsIndexes(cardsClickedIndexes);
  }, [cardsClickedIndexes]);

  useEffect(() => {
    if (cardsDatas && cardsDatas.length >= 0) generateCards();
  }, [cardsDatas]);

  useEffect(() => {
    // Show the cards that are currently selected
    if (currentlySelectedCardsIndexes.length > 0 && cards.length > 0) {
      const shownCards = showCardsInDeck(cards, currentlySelectedCardsIndexes);
      setCards(shownCards);
    }
  }, [currentlySelectedCardsIndexes]);

  useEffect(() => {
    // Player has selected two cards
    if (currentlySelectedCardsIndexes && currentlySelectedCardsIndexes.length >= 2) {
      console.log('Applying game logic...');

      onCardsWillCompare();

      let matchedindexes = [];
      let unmatchedIndexes = [];
      const prevFound = {};

      // For every currently selected card, we want to find another card that matches/mismatch it
      for (let i = 0; i < currentlySelectedCardsIndexes.length; i++) {
        const cardIndex = cards[currentlySelectedCardsIndexes[i]].props.index;
        const cardNumber = cards[currentlySelectedCardsIndexes[i]].props.number;

        console.log('Next for---');

        // Find match
        const matchedIndex = currentlySelectedCardsIndexes.find(index => {
          console.log('Comparing...');
          console.log(
            `Cardnumber: ${cardNumber} === otherCardNumber: ${cards[index].props.number}`,
          );
          console.log(`cardIndex: ${cardIndex} !== otherCardIndex: ${index}`);
          console.log(`$prevFound[cardNumber]: ${prevFound[cardNumber]}`);
          // Same number, different index, wasn't previously found
          if (
            cardNumber === cards[index].props.number &&
            cardIndex !== index &&
            !prevFound[cardNumber]
          ) {
            console.log('Successfully returned this as the matched index');
            matchedindexes.push(cardIndex, index);
            prevFound[cardNumber] = true;
            return index;
          }
        });

        // Couldnt find a match which means it wasn't previously found
        if (!prevFound[cardNumber] && !matchedIndex) {
          unmatchedIndexes.push(cardIndex);
        }
      }

      // console.log('...');
      // console.log(matchedindexes);
      // console.log(unmatchedIndexes);
      // console.log('...');

      // Use delay for both
      if (
        matchedindexes &&
        matchedindexes.length > 0 &&
        unmatchedIndexes &&
        unmatchedIndexes.length > 0
      ) {
        console.log('time out version 1');
        timeoutRef.current = setTimeout(() => {
          handleMatch(matchedindexes);
          handleMismatch(unmatchedIndexes);
          onCardsDidCompare(matchedindexes);
        }, mismatchDelay);
      } else if (unmatchedIndexes && unmatchedIndexes.length > 0) {
        console.log('time out version 2');
        timeoutRef.current = setTimeout(() => {
          handleMatch(matchedindexes);
          handleMismatch(unmatchedIndexes);
          onCardsDidCompare(matchedindexes);
        }, mismatchDelay);
      } else {
        console.log('time out version 3');
        handleMatch(matchedindexes);
        handleMismatch(unmatchedIndexes);
        onCardsDidCompare(matchedindexes);
      }

      // Bad match, so "flip" them back
      // Wait 2 second so they can see the second card
      //timeoutRef.current = setTimeout(() => {

      // onCardsDidCompare(matchedindexes);
      //}, mismatchDelay);
    }
  }, [currentlySelectedCardsIndexes]);

  useEffect(() => {
    if (resetCards) {
      setpreviouslyMatchedCardsIndexes([]);
      setCards([]);
    }
  }, [resetCards]);

  const createCopyOfCardWithPreviousProps = (card, style, showCard) => {
    return <Card {...card.props} key={card.props.id} style={style} showCard={showCard} />;
  };

  const showCardsInDeck = (cardsArray, cardIndexes) => {
    const tempCards = cardsArray.slice();
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

    return tempCards;
  };

  const hasPreviousMatchedCards = () =>
    previouslyMatchedCardsIndexes && previouslyMatchedCardsIndexes.length > 0;

  useEffect(() => {
    // No cards were previously matched, so don't try to find them
    if (hasPreviousMatchedCards()) {
      // Find the previously selected cards and modify their style so that their color is green
      // and make them unclickable
      // SHoudl this be in the matched function? ******************
      const tempCards = cards.slice();

      for (let i = 0; i < previouslyMatchedCardsIndexes.length; i++) {
        const cardComponent = tempCards[previouslyMatchedCardsIndexes[i]];
        const updatedCardStyle = { pointerEvents: 'none', backgroundColor: 'green' };
        const updatedCardComponent = createCopyOfCardWithPreviousProps(
          cardComponent,
          updatedCardStyle,
          true,
        );

        tempCards[previouslyMatchedCardsIndexes[i]] = updatedCardComponent;
      }
      setCards(tempCards);
    }
  }, [previouslyMatchedCardsIndexes]);

  useEffect(() => {
    console.log('yesw');
    console.log(previouslyMatchedCardsIndexes);
    console.log(cards.length);
    if (
      cards.length > 0 &&
      previouslyMatchedCardsIndexes.length > 0 &&
      previouslyMatchedCardsIndexes.length === cards.length
    ) {
      onAllCardsMatched();
    }
  }, [previouslyMatchedCardsIndexes]);

  /* * * * * * * * * * * * *
   * HANDLE MISMATCH CARDS  *
   * * * * * * * * * * * * */
  const handleMismatch = cardIndexes => {
    if (!cardIndexes || cardIndexes.length <= 0) return;

    console.log('unmatch');
    timeoutRef.current = null;

    // Tell server to wait a bit before sending down the new game state... which will cause the re-render

    const tempCards = cards.slice();
    cardIndexes.forEach(index => {
      tempCards[index] = createCopyOfCardWithPreviousProps(cards[index], {}, false);
    });
    setCards(tempCards);
    onCardsMismatched();
  };

  /* * * * * * * * * * * *
   * HANDLE MATCH CARDS  *
   * * * * * * * * * * * * */
  const handleMatch = cardIndexes => {
    if (!cardIndexes || cardIndexes.length <= 0) return;

    console.log('Matched');
    setpreviouslyMatchedCardsIndexes(oldArray => [...oldArray, ...cardIndexes]);

    onCardsMatched(cardIndexes);
  };

  const onCardClickRefactor = index => {
    onCardClick(index);
    // setcurrentlySelectedCardsIndexes(oldSelected => [...oldSelected, index]);
  };

  // Generate card components to store into card state
  const generateCards = () => {
    const tempCards = generatePlayingCards(
      cardsDatas,
      onCardClickRefactor,
      currentlySelectedCardsIndexes,
    );
    setCards(tempCards);
  };

  const renderCards = () => {
    return cards.map(card => card);
  };

  return (
    <div className="cards" data-testid="cards-test-id">
      {renderCards()}
    </div>
  );
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
  onAllCardsMatched: PropTypes.func,
  onCardsDidCompare: PropTypes.func,
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
  onAllCardsMatched: () => {},
  onCardsDidCompare: () => {},
};

export default Cards;
