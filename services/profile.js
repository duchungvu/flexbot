'use strict';

// Imports dependencies
const GraphAPi = require("./graph-api"),
  config = require("./config");

module.exports = class Profile {
  // When setting a webhook, the app (APP_ID) should subcribe to the page (PAGE_ID) and have the webhook url (APP_URL/webhook)
  setWebhook() {
    GraphAPi.callSubscriptionsAPI();
    GraphAPi.callSubscribedApps();
  }
};
