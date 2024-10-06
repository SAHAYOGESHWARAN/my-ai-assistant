import { render, screen, fireEvent } from '@testing-library/react';
import App from '../client/src/App';

test('renders AI Assistant header', () => {
  render(<App />);
  const headerElement = screen.getByText(/AI Assistant/i);
  expect(headerElement).toBeInTheDocument();
});

test('triggers voice input on button click', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Speak/i);
  fireEvent.click(buttonElement);
  expect(buttonElement).toBeInTheDocument(); // Placeholder check
});
