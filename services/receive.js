'use strict';

const
  GraphAPi = require('./graph-api'),
  knex = require('../db/knex'),
  User = require('../models/User'),
  Reminder = require('../models/Reminder'),
  { Model } = require('objection'),
  Response = require('./response');

Model.knex(knex);

module.exports = class Receive {
  constructor(senderPSID, webhookEvent) {
    this.senderPSID = senderPSID;
    this.webhookEvent = webhookEvent;
  }

  // Check if the event is a message or postback and
  // call the appropriate handler function
  // If the message is sent successfully, Messenger will send a
  // message_deliveries webhook event
  async handleMessage() {
    let event = this.webhookEvent;
    let responses;

    // Check if the webhook event is message (not message_deliveries)
    // or postback then check if it's text or something else
    try {
      let user = await this.addUser();
      console.log('User: ' + user.fb_id);
      if (event.message) {
        let message = event.message;
        if (message.quick_reply) {
          responses = await this.handleQuickReply(user);
        } else if (message.attachments) {
          responses = this.handleAttachmentMessage();
        } else if (message.text) {
          responses = await this.handleTextMessage(user);
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
    if (Array.isArray(responses)) {
      let delay = 0;
      for (let response of responses) {
        this.sendMessage(response, delay * 2000);
        delay++;
      }
    } else {
      this.sendMessage(responses);
    }
  }

  // Handles messages events with text
  async handleTextMessage(user) {
    console.log(
      "Received text:",
      `${this.webhookEvent.message.text} for ${this.senderPSID}`
    );

    let response;
    let text = this.webhookEvent.message.text;
    // let responseText = 'You just sent ' + text + ''\n';

    // if (text.includes('set')) {
    //   const reminders = await user
    //     .$relatedQuery('reminders')
    //     .insert({
    //       name: text
    //     });
    //
    //   console.log("Added :" + reminders);
    // } else if (text.includes('get')) {
    //   const reminders = await Reminder
    //     .query()
    //     .joinRelation('users')
    //     .where('users.id', user.id);
    //
    //   for (var reminder of reminders) {
    //     // console.log(reminder.name);
    //     responseText = responseText + reminder.name + '\n';
    //   }
    // }

    response = [
      Response.genText(text),
      Response.genQuickReply('Choose an option: ', [{
          title: 'Get reminders',
          payload: 'GET_REMINDERS'
        },
        {
          title: 'Set a reminder',
          payload: 'SET_REMINDERS'
        }
      ])
    ];

    return response;
  }

  // Handles quick reply
  async handleQuickReply(user) {
    // Get the payload of the quick reply
    let payload = this.webhookEvent.message.quick_reply.payload;

    return await this.handlePayload(user, payload);
  }

  // Handles message postbacks
  handleAttachmentMessage() {
    let response = {
      text: 'This feature will be implemented later'
    };
    console.log('This feature will be implemented later');
    return response;
  }

  // Handles message postbacks
  handlePostback() {
    let response = {
      text: 'This feature will be implemented later'
    };
    console.log('This feature will be implemented later');
    return response;
  }

  // Handles payload
  async handlePayload(user, payload) {
    console.log('Received Payload:', `${payload} for ${this.senderPSID}`);

    let response;

    if (payload === 'GET_REMINDERS') {
      response = await this.getReminder(user);
    } else if (payload === 'SET_REMINDERS') {
      response = this.setReminder();
    }

    return response;
  }

  async getReminder(user) {
    let list = '';
    let reminders = await Reminder
      .query()
      .joinRelation('users')
      .where('users.id', user.id);

    for (let reminder of reminders) {
      list = list + reminder.name + '\n';
    }

    let response = [
      Response.genText(list),
      Response.genQuickReply('Choose an option: ', [{
          title: 'GET REMINDERS',
          payload: 'GET_REMINDERS'
        },
        {
          title: 'SET REMINDERS',
          payload: 'SET_REMINDERS'
        }
      ])
    ];

    return response;
  }

  setReminder() {
    let response = [
      Response.genText('Try again later'),
      Response.genQuickReply('Choose an option: ', [{
          title: 'Get reminders',
          payload: 'GET_REMINDERS'
        },
        {
          title: 'Set a reminder',
          payload: 'SET_REMINDERS'
        }
      ])
    ];

    return response;
  }

  // Add or find user
  async addUser() {

    let user = await User
      .query()
      .where('fb_id', parseInt(this.senderPSID, 10));

    if (user.length === 0) {
      user = await User
        .query()
        .insert({
          fb_id: parseInt(this.senderPSID, 10)
        });
      console.log('Added new user');
    }

    // console.log(user[0] instanceof User);
    return user[0];
  }

  sendMessage(response, delay = 0) {
    // Check if there is delay in the response
    if ('delay' in response) {
      delay = response['delay'];
      delete response['delay'];
    }

    // Construct the message body
    // Basically, a request should have recipient.id and
    // message (text, attachment)
    let requestBody = {
      recipient: {
        id: this.senderPSID
      },
      message: response
    };

    setTimeout(() => GraphAPi.callSendAPI(requestBody), delay);
  }
};
