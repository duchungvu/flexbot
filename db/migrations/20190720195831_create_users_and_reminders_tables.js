
exports.up = function(knex) {
  return knex.schema.createTable('reminders', (table) => {
    table.increments();
    table.string('name').notNullable();
  })
  .createTable('users', (table) => {
    table.increments();
    table.bigInteger('fb_id').unique().notNullable();
  })
  .createTable('users_reminders', (table) => {
    table.increments();
    table.integer('user_id').references('id').inTable('users').notNullable();
    table.integer('reminder_id').references('id').inTable('reminders').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users').dropTable('reminders').dropTable('users_reminders');
};
