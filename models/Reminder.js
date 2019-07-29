'use strict'

const { Model } = require('objection');

class Reminder extends Model {

  // Table name is required
  static get tableName() {
    return 'reminders';
  }

  static get relationMappings() {

    const User = require('./User')

    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'reminders.id',
          through: {
            from: 'users_reminders.reminder_id',
            to: 'users_reminders.user_id'
          },
          to: 'users.id'
        }
      }
    };
  }
}

module.exports = Reminder;
