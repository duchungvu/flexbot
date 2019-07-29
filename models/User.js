'use strict';

const { Model } = require('objection');

class User extends Model {

  // Table name is required
  static get tableName() {
    return 'users';
  }

  static get relationMappings() {

    const Reminder = require('./Reminder');

    return {
      reminders: {
        relation: Model.ManyToManyRelation,
        modelClass: Reminder,
        join: {
          from: 'users.id',
          through: {
            from: 'users_reminders.user_id',
            to: 'users_reminders.reminder_id'
          },
          to: 'reminders.id'
        }
      }
    };
  }
}

module.exports = User;
