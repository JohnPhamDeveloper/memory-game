import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Card from '../Card';

// const ItemList = ({ items }) => {
//   return items.map(item => <p key={item}>{item}</p>);
// };

// it('renders items in a list', () => {
//   const container = document.createElement('div');
//   ReactDOM.render(<ItemList items={['cheese', 'apples']} />, container);
//   expect(container.textContent).toMatch('cheese');
//   expect(container.textContent).toMatch('apples');
// });

it('render a card with a number 4 if showCard is true', () => {
  const { container } = render(<Card number={4} showCard />);
  expect(container.textContent).toMatch('4');
});

it('render a card without a number 4 if showCard is false', () => {
  const { container } = render(<Card number={4} showCard={false} />);
  expect(container.textContent).toMatch('');
});
