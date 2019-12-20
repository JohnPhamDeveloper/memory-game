import React from 'react';
import Card from './Card';

/**
 * Generates playing cards
 * @param numberOfCards {int} The number of cards in the game area will be multiplied by 2 so there's a match for every card
 * @param onCardClick {function} callback
 * @return [Card] Array of generated card components
 */
export const generatePlayingCards = (numberOfCards, onCardClick) => {
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

  return tempCards;
};

/**
 * Shuffles cards
 * @param cards { [Card] }
 */
export const shuffleCards = cards => {
  for (let i = cards.length - 1; i > 0; i--) {
    // https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
    const j = Math.floor(Math.random() * i);

    // Give the component a new index since shuffling changes position in array
    // Also use id to modify the key because key is not directly accessible as a prop
    const modifiedComponentI = (
      <Card {...cards[i].props} key={`${cards[i].props.id} modified`} index={j} />
    );

    const modifiedComponentJ = (
      <Card {...cards[j].props} key={`${cards[j].props.id} modified`} index={i} />
    );

    // Swap, but use the modified version instead
    cards[i] = modifiedComponentJ;
    cards[j] = modifiedComponentI;
  }
};
