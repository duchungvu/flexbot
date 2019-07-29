'use strict';

const
  GraphAPi = require('./graph-api'),
  knex = require('../db/knex'),
  User = require('../models/User'),
  Reminder = require('../models/Reminder'),
  { Model } = require('objection');

Model.knex(knex);

module.exports = class Receive {
  constructor(senderPSID, webhookEvent) {
    this.senderPSID = senderPSID;
    this.webhookEvent = webhookEvent;
  }

  // Check if the event is a message or postback and
  // call the appropriate handler function
  // If the message is sent successfully, Messenger will send a message_deliveries
  // webhook event
  async handleMessage() {
    let event = this.webhookEvent;
    let responses;

    // Check if the webhook event is message (not message_deliveries) or postback then check if it's text or something else
    try {
      let user = await this.addUser();
      console.log("User " + user.id + " " + user.fb_id);
      if (event.message) {
        let message = event.message;
        if (message.text) {
          responses = await this.handleTextMessage(user);
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
  async handleTextMessage(user) {
    console.log(
      "Received text:",
      `${this.webhookEvent.message.text} for ${this.senderPSID}`
    );

    let text = this.webhookEvent.message.text;
    let responseText = "You just sent " + text + "\n";

    if (text.includes('set')) {
      const reminders = await user
        .$relatedQuery('reminders')
        .insert({ name : text });

        console.log("Added :" + reminders);
    } else if (text.includes('get')) {
      const reminders = await Reminder
        .query()
        .joinRelation('users')
        .where('users.id', user.id);
        // .where('users.id', user.id);

        for (var reminder of reminders) {
          // console.log(reminder.name);
          responseText = responseText + reminder.name + '\n';
        }
    }

    let response = { text: responseText };
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
  async addUser() {

    let user = await User
      .query()
      .where('fb_id', parseInt(this.senderPSID, 10));

    if (user.length === 0) {
      console.log("HMM");
      user = await User
      .query()
      .insert({fb_id : parseInt(this.senderPSID, 10)});
    }

    // console.log(user[0] instanceof User);
    return user[0];
  }
};
