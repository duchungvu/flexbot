'use strict';

const
  GraphAPi = require("./graph-api");

module.exports = class Receive {
  constructor(senderPSID, webhookEvent) {
    this.senderPSID = senderPSID;
    this.webhookEvent = webhookEvent;
  }

  // Check if the event is a message or postback and
  // call the appropriate handler function
  handleMessage() {
    let event = this.webhookEvent;

    let responses;

    // Check if the webhook event is message (not message_deliveries) or postback then check if it's text or something else
    // try {
      if (event.message) {
        let message = event.message;
        if (message.text) {
          responses = this.handleTextMessage();
        }
      } else if (webhook_event.postback) {
          console.log('later');
      }
    // } catch (error) {
    //   console.error(error);
    //   responses = {
    //     text: `An error has occured: '${error}'. We have been notified and \
    //     will fix the issue shortly!`
    //   };
    // }
    //

    // Basically, a request should the recipient.id and message (text, attachment)
    let requestBody = {
      "recipient": {
        "id": this.senderPSID
      },
      "message": responses
    }

    GraphAPi.callSendAPI(requestBody);
  }

  // Handles messages events with text
  handleTextMessage() {
    console.log(
      "Received text:",
      `${this.webhookEvent.message.text} for ${this.senderPSID}`
    );

    let response = { text: "You just sent " + this.webhookEvent.message.text}
    return response;
  }
};
