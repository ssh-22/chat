import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chat from '../Chat';
import { WebSocket, Server } from 'mock-socket';

describe('Chat', () => {
  let mockServer: Server;

  beforeAll(() => {
    mockServer = new Server('ws://localhost:3001');
  });

  afterAll(() => {
    mockServer.close();
  });

  beforeEach(() => {
    render(<Chat />);
  });

  test('renders chat container', () => {
    const chatContainer = screen.getByTestId('chat-container');
    expect(chatContainer).toBeInTheDocument();
  });

  test('renders input form', () => {
    const inputForm = screen.getByTestId('input-form');
    expect(inputForm).toBeInTheDocument();
  });

  test('renders input field', () => {
    const inputField = screen.getByTestId('input');
    expect(inputField).toBeInTheDocument();
  });

  test('renders submit button', () => {
    const submitButton = screen.getByText('送信');
    expect(submitButton).toBeInTheDocument();
  });

  test('empty input field does not send message', () => {
    const submitButton = screen.getByText('送信');
    userEvent.click(submitButton);
    expect(screen.queryByText('User:')).not.toBeInTheDocument();
  });

  test('input field accepts input', async () => {
    const inputField = screen.getByTestId('input');
    const testMessage = 'Hello, world!';

    fireEvent.change(inputField, { target: { value: testMessage } });

    mockServer.on('connection', (socket) => {
      socket.send(
        JSON.stringify({ type: 'connected', userId: 'test-user-id' }),
      );
    });

    fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter' });

    await waitFor(() => expect(inputField).toHaveValue(''));
  });
});
