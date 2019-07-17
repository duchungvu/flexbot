/**
 * Graph API requests
 * These methods are written by Facebook with some extra comments
 */

// Put in strict mode
'use strict';

// Imports dependencies
const request = require("request"),
  camelCase = require("camelcase"),
  config = require("./config");

// Initialize GraphAPi module
module.exports = class GraphAPi {
  /**
   * Send the HTTP POST request to the Messenger Platform
   */
  static callSendAPI(requestBody) {
    request(
      {
        uri: `${config.mPlatfom}/me/messages`,
        qs: {
          access_token: config.pageAccessToken
        },
        method: "POST",
        json: requestBody
      },
      (error, _res, body) => {
        if (!error) {
          console.log("Request sent:", body);
        } else {
          console.error("Unable to send message:", error);
        }
      }
    );
  }

  static callSubscriptionsAPI() {
    // Send the HTTP request to the Subscriptions Edge to configure your webhook
    // You can use the Graph API's /{app-id}/subscriptions edge to configure and
    // manage your app's Webhooks product
    // https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge
    console.log(
      `Setting app ${config.appId} callback url to ${config.webhookUrl}`
    );
    request(
      {
        uri: `${config.mPlatfom}/${config.appId}/subscriptions`,
        qs: {
          access_token: config.appId + "|" + config.appSecret,
          object: "page",
          callback_url: config.webhookUrl,
          verify_token: config.verifyToken,
          fields:
            "messages, messaging_postbacks, messaging_optins, \
          message_deliveries, messaging_referrals ",
          include_values: "true"
        },
        method: "POST"
      },
      (error, _res, body) => {
        if (!error) {
          console.log("Request sent:", body);
        } else {
          console.error("Unable to send message:", error);
        }
      }
    );
  }

  static callSubscribedApps() {
    // Send the HTTP request to subscribe an app for Webhooks for Pages
    // You can use the Graph API's /{page-id}/subscribed_apps edge to configure
    // and manage your pages subscriptions
    // https://developers.facebook.com/docs/graph-api/reference/page/subscribed_apps
    console.log(`Subscribing app ${config.appId} to page ${config.pageId}`);
    request(
      {
        uri: `${config.mPlatfom}/${config.pageId}/subscribed_apps`,
        qs: {
          access_token: config.pageAccessToken,
          subscribed_fields:
            "messages, messaging_postbacks, messaging_optins, \
          message_deliveries, messaging_referrals "
        },
        method: "POST"
      },
      error => {
        if (error) {
          console.error("Unable to send message:", error);
        }
      }
    );
  }

  static callNLPConfigsAPI() {
    // Send the HTTP request to the Built-in NLP Configs API
    // https://developers.facebook.com/docs/graph-api/reference/page/nlp_configs/

    console.log(`Enable Built-in NLP for Page ${config.pageId}`);
    request(
      {
        uri: `${config.mPlatfom}/me/nlp_configs`,
        qs: {
          access_token: config.pageAccessToken,
          nlp_enabled: true
        },
        method: "POST"
      },
      (error, _res, body) => {
        if (!error) {
          console.log("Request sent:", body);
        } else {
          console.error("Unable to activate built-in NLP:", error);
        }
      }
    );
  }

  static callFBAEventsAPI(senderPsid, eventName) {
    // Construct the message body
    let requestBody = {
      event: "CUSTOM_APP_EVENTS",
      custom_events: JSON.stringify([
        {
          _eventName: "postback_payload",
          _value: eventName,
          _origin: "original_coast_clothing"
        }
      ]),
      advertiser_tracking_enabled: 1,
      application_tracking_enabled: 1,
      extinfo: JSON.stringify(["mb1"]),
      page_id: config.pageId,
      page_scoped_user_id: senderPsid
    };

    // Send the HTTP request to the Activities API
    request(
      {
        uri: `${config.mPlatfom}/${config.appId}/activities`,
        method: "POST",
        form: requestBody
      },
      error => {
        if (!error) {
          console.log(`FBA event '${eventName}'`);
        } else {
          console.error(`Unable to send FBA event '${eventName}':` + error);
        }
      }
    );
  }
};
