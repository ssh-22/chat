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

  test('renders textarea', () => {
    const textArea = screen.getByTestId('textarea');
    expect(textArea).toBeInTheDocument();
  });

  test('renders submit button', () => {
    const submitButton = screen.getByTestId('submit');
    expect(submitButton).toBeInTheDocument();
  });

  test('empty textarea does not send message', () => {
    const submitButton = screen.getByTestId('textarea');
    userEvent.click(submitButton);
    expect(screen.queryByText('User:')).not.toBeInTheDocument();
  });

  test('textarea accepts input', async () => {
    const textArea = screen.getByTestId('textarea');
    const testMessage = 'Hello, world!';

    fireEvent.change(textArea, { target: { value: testMessage } });

    mockServer.on('connection', (socket) => {
      socket.send(
        JSON.stringify({ type: 'connected', userId: 'test-user-id' }),
      );
    });

    fireEvent.keyDown(textArea, { key: 'Enter', code: 'Enter' });

    await waitFor(() => expect(textArea).toHaveValue(''));
  });
});
