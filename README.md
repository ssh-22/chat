# Chat App

This is a TypeScript-based chat app that allows users to have group conversations with LINE-style UI. The app only includes a messaging feature.

https://github.com/ssh-22/chat/assets/50019567/8d9c7809-b0b2-42d5-8779-62f360658677

https://github.com/ssh-22/chat/assets/50019567/f08670cd-e0c1-4360-a18a-1050b21c7069

## Technologies Used

The server-side of the app is built using `Node.js`, `Express`, `ws`, and `TypeScript`,while the front-end is built with `React` and `TypeScript`. The version of Node.js used for the backend is 18 and 16 for the front-end.

## Installation

To install the app, follow these steps:

1. Clone this repository to your local machine.
2. In the `frontend` directory, run `npm install` to install the necessary dependencies. Make sure you have Node.js version 16 installed.
3. In the `backend` directory, run `npm install` to install the necessary dependencies. Make sure you have Node.js version 18 installed.
    1. Since the backend directory was used for local development only, you should use the `workers` directory for production.
5. To start the front-end, navigate to the `frontend` directory and run `npm start`.
6. To start the back-end, navigate to the `backend` directory and run `npm run dev`.

If you don't have the correct version of Node.js installed, you can download it from the official website: https://nodejs.org/en/download/

## Deployment

### Backend

To deploy the backend app, follow these steps:

1. Sign Up for Cloudflare
2. Subscribe to [Cloudflare Workers](https://www.cloudflare.com/products/workers/) Paid plan to enable Durable Objects
3. Create a durable object
4. Deploy `workers` to Cloudflare workers
5. Make sure the frontend app connect with the backend app

### Frontend

To deploy the frontend app, follow these steps:

1. Use hosting service such as [Cloudflare pages](https://pages.cloudflare.com/).
2. Sign Up for [Auth0](https://auth0.com/) to obtain CLIENT_ID and DOMAIN for the frontend app
3. Sign Up for [Google API](https://console.developers.google.com/apis/dashboard) to obtain Client id and secret for Auth0 Google login authentication
4. Set the following environment variables through deploy
    1. `REACT_APP_CLIENT_ID`: Obtain CLIENT_ID from Auth0
    2. `REACT_APP_DOMAIN`: Obtain DOMAIN from Auth0
    3. `REACT_APP_WEBSOCKET_URL`: your production WebSocket URL ending with '/wss'
5. Deploy the frontend app
6. Make sure you can send and receive messages via Chat

## Usage

Once the app is installed, users can use it to have group conversations. The UI is designed to resemble the LINE chat app.    
