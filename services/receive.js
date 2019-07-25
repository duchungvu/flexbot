'use strict';

const
  GraphAPi = require("./graph-api"),
  knex = require("../db/knex");

module.exports = class Receive {
  constructor(senderPSID, webhookEvent) {
    this.senderPSID = senderPSID;
    this.webhookEvent = webhookEvent;
  }

  // Check if the event is a message or postback and
  // call the appropriate handler function
  // If the message is sent successfully, Messenger will send a message_deliveries
  // webhook event
  //
  async handleMessage() {
    let event = this.webhookEvent;

    let responses;

    // Check if the webhook event is message (not message_deliveries) or postback then check if it's text or something else
    try {
      if (event.message) {
        let message = event.message;
        let user = await this.getUser();
        if (message.text) {
          responses = this.handleTextMessage(user);
        } else if (message.attachments) {
          responses = this.handleAttachmentMessage();
        }
      } else if (event.postback) {
          responses = this.handlePostback();
      }
    } catch (error) {
      console.error(error);
      responses = {
        text: `An error has occured: '${error}'. We have been notified and \
        will fix the issue shortly!`
      };
    }

    // Basically, a request should have recipient.id and message (text, attachment)
    let requestBody = {
      "recipient": {
        "id": this.senderPSID
      },
      "message": responses
    }

    GraphAPi.callSendAPI(requestBody);
  }

  // Handles messages events with text
  handleTextMessage(user) {
    console.log(
      "Received text:",
      `${this.webhookEvent.message.text} for ${this.senderPSID}`
    );

    let text = this.webhookEvent.message.text;
    // console.log(user['fb_id']);

    if (text.includes('set')) {
      // console.log("hi");
      knex('reminders')
      .insert({name : text})
      .returning('id')
      .then((id) => {
        console.log("Inserted");
        knex('users_reminders')
        .insert({fb_id : parseInt(user, 10),
          reminder_id : parseInt(id, 10)})
        .then(() => {
          console.log("Inserted #2");
        })
      })
    }

    let response = { text: "You just sent " + text }
    // let message = this.webhookEvent.message.text;
    // if (message.includes("set")) {
    //   knex('users')
    // }
    return response;
  }

  // Handles message postbacks
  handleAttachmentMessage() {
    let response = { text : "This feature will be implemented later"};
    console.log('This feature will be implemented later');
    return response;
  }

  // Handles message postbacks
  handlePostback() {
    let response = { text : 'This feature will be implemented later' };
    console.log('This feature will be implemented later');
    return response;
  }

  //
  getUser() {
    return knex('users')
    .where('fb_id', parseInt(this.senderPSID, 10))
    .first()
    .then((found) => {
      if (!found) {
        return knex('users').insert({fb_id : parseInt(this.senderPSID, 10)})
        .then((user) => {
          console.log("Add :" + user['fb_id']);
          return user['fb_id'];
        });
      } else {
        return knex('users')
        .where('fb_id', parseInt(this.senderPSID, 10))
        .first()
        .then((user) => {
          console.log("Exist: " + user['fb_id']);
          return user['fb_id'];
        });
      }
    });
    // console.log(id);
    // return id;
  }
};
