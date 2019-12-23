import React from 'react';
import { render, fireEvent, screen, wait } from '@testing-library/react';
import Cards from '../Cards';
import '@testing-library/jest-dom/extend-expect';

const clickedStyleString = 'background-color: pink; pointer-events: none;';
const cardsDatas = [{ number: 3 }, { number: 1 }, { number: 3 }, { number: 1 }];
const emptyCardsDatas = [];
const cardsClickedIndexes = [0];
const matchedCardsClickedIndexes = [0, 2];
const mismatchedCardsClickedIndexes = [0, 1];
const allCardsClickedIndexes = [0, 1, 2, 3];
const props = {
  mismatchDelay: 1000,
  cardsDatas,
  onCardClick: () => {},
  onCardsMatched: () => {},
  onCardsMismatched: () => {},
  cardsClickedIndexes: [],
  resetCards: false,
  onCardsWillCompare: () => {},
};

it('creates the same number of cards as the cardsData', () => {
  const { getByTestId } = render(<Cards {...props} />);
  const cardsCount = getByTestId('cards-test-id').childElementCount;
  expect(cardsCount).toEqual(cardsDatas.length);
});

it('is empty when there is no cardData', () => {
  const newProps = {
    ...props,
    cardsDatas: emptyCardsDatas,
  };
  const { getByTestId } = render(<Cards {...newProps} />);
  const cardsContainer = getByTestId('cards-test-id');
  expect(cardsContainer).toBeEmpty();
});

it('is not empty when there is cardData', () => {
  const { getByTestId } = render(<Cards {...props} />);
  const cardsContainer = getByTestId('cards-test-id');
  expect(cardsContainer).not.toBeEmpty();
});

it('makes the card pink and shows number when clicked', async () => {
  const { getByTestId } = render(<Cards {...props} cardsClickedIndexes={cardsClickedIndexes} />);

  const firstMatchedIndex = cardsClickedIndexes[0];
  const card1 = getByTestId(`card-${firstMatchedIndex}-${cardsDatas[firstMatchedIndex].number}`);
  expect(card1).toHaveStyle(clickedStyleString);
});

test('no cards have styles if there are no cards clicked', async () => {
  const { getByTestId } = render(<Cards {...props} />);

  const cards = getByTestId(`cards-test-id`).childNodes;
  cards.forEach(card => {
    expect(card).toHaveStyle('');
  });
});

it('calls onCardsMatch if the two cards match', () => {
  const onMatch = jest.fn();
  const { getByTestId } = render(
    <Cards {...props} cardsClickedIndexes={matchedCardsClickedIndexes} onCardsMatched={onMatch} />,
  );

  const firstMatchedIndex = matchedCardsClickedIndexes[0];
  const secondMatchedIndex = matchedCardsClickedIndexes[1];

  const card1 = getByTestId(`card-${firstMatchedIndex}-${cardsDatas[firstMatchedIndex].number}`);
  const card2 = getByTestId(`card-${secondMatchedIndex}-${cardsDatas[secondMatchedIndex].number}`);

  fireEvent.click(card1);
  fireEvent.click(card2);

  expect(onMatch).toHaveBeenCalledTimes(1);
  expect(onMatch).toHaveBeenCalledWith([
    matchedCardsClickedIndexes[0],
    matchedCardsClickedIndexes[1],
  ]);
});

it('shows no cards when the game resets', () => {
  const { getByTestId } = render(<Cards {...props} resetCards={true} />);

  const cardsContainer = getByTestId('cards-test-id');
  expect(cardsContainer).toBeEmpty();
});

it('runs onClick when card is clicked', async () => {
  const onClick = jest.fn();
  const { getByTestId } = render(<Cards {...props} onCardClick={onClick} />);

  const firstMatchedIndex = matchedCardsClickedIndexes[0];
  const secondMatchedIndex = matchedCardsClickedIndexes[1];

  const card1 = getByTestId(`card-${firstMatchedIndex}-${cardsDatas[firstMatchedIndex].number}`);
  const card2 = getByTestId(`card-${secondMatchedIndex}-${cardsDatas[secondMatchedIndex].number}`);

  fireEvent.click(card1);
  fireEvent.click(card2);

  expect(onClick).toBeCalledTimes(2);
});

it('runs onAllCardsMatched when all cards have been matched', async () => {
  const myOnAllCardsMatched = jest.fn();
  const { getByTestId } = render(
    <Cards
      {...props}
      cardsClickedIndexes={allCardsClickedIndexes}
      onAllCardsMatched={myOnAllCardsMatched}
    />,
  );

  // Make all cards match
  const card1 = getByTestId(`card-${0}-${cardsDatas[0].number}`);
  const card2 = getByTestId(`card-${2}-${cardsDatas[2].number}`);
  const card3 = getByTestId(`card-${1}-${cardsDatas[1].number}`);
  const card4 = getByTestId(`card-${3}-${cardsDatas[3].number}`);
  fireEvent.click(card1);
  fireEvent.click(card2);

  // Wait before clicking the next two cards
  await wait(
    () => {
      fireEvent.click(card3);
      fireEvent.click(card4);
    },
    { timeout: props.mismatchDelay + 300 },
  );

  // Mismatch causes the cards to be timed out for a bit so need to wait
  await wait(
    () => {
      expect(myOnAllCardsMatched).toBeCalledTimes(1);
    },
    { timeout: props.mismatchDelay + 300 },
  );
});

it('calls onCardMismatched if cards dont match', async () => {
  const onClick = jest.fn();
  const { getByTestId } = render(
    <Cards
      {...props}
      cardsClickedIndexes={mismatchedCardsClickedIndexes}
      onCardsMismatched={onClick}
    />,
  );

  const firstMismatchedIndex = mismatchedCardsClickedIndexes[0];
  const secondMismatchedIndex = mismatchedCardsClickedIndexes[1];

  const card1 = getByTestId(
    `card-${firstMismatchedIndex}-${cardsDatas[firstMismatchedIndex].number}`,
  );
  const card2 = getByTestId(
    `card-${secondMismatchedIndex}-${cardsDatas[secondMismatchedIndex].number}`,
  );

  fireEvent.click(card1);
  fireEvent.click(card2);

  await wait(
    () => {
      expect(onClick).toBeCalledTimes(1);
    },
    { timeout: props.mismatchDelay + 2000 },
  );
});
