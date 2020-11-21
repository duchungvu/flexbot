# FlexBot

Flexbot is a [Messenger](https://www.messenger.com/) chatbot that help users set reminders and daily subscriptions through basic messages. This project is developed to assist me and my friends in daily tasks, as Messenger is out main communication platform. Through this project, I learned more about [Node.js](https://nodejs.org/en/) and [webhook](https://developers.facebook.com/docs/messenger-platform/webhook/)

## Supported features
- Daily reminders
- Daily news subscriptions (WIP)

## Technologies used
- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [Knex.js](https://knexjs.org/)
- [Objection.js](https://vincit.github.io/objection.js/)
- [PostgreSQL](https://knexjs.org/)
- [ngrok](https://ngrok.com/)

## Setup
1. Install [Node.js](https://nodejs.org/en/download/) on your machine

2. Clone this repository to your local machine
```
$ git clone https://github.com/duchungvu/FlexBot.git
$ cd flexbot
```

3. Install dependencies
```
$ npm install
```

4. Create environment file
```
$ touch .env
```
and type in
```
PAGE_ID=
APP_ID=
PAGE_ACCESS_TOKEN=
APP_SECRET=
VERIFY_TOKEN=
APP_URL=
PORT=
```
[Learn more](https://developers.facebook.com/docs/messenger-platform/getting-started/app-setup)


## Run locally
1. Run ngrok
```
$ ngrok http 3000
```
You can set the port to anything, I set 3000 here. Copy the link on the line `Forwarding` that looks like `https://something.ngrok.io` and paste into `APP_URL`

2. In other terminal, run the the Node.js application
```
$ node app.js
```

3. Run this link `http://localhost:3000/profile?mode=all&verify_token=<VERIFY_TOKEN>` with the `VERIFY_TOKEN` you set in the `.env` file to subscribe to Messenger events. Now you are all set, go to [Messenger](https://www.messenger.com/) and send a message.

## Run on heroku

WIP


## Acknowledgements
- [Original Coasting Clothing](https://github.com/fbsamples/original-coast-clothing)
- [Chat Extensions](https://github.com/fbsamples/messenger-bot-samples/tree/master/chat-extensions)
