exports.up = function(knex) {
    return knex.schema.createTable('bookings', function(table) {
      table.increments('id').primary();
      table.integer('event_id').unsigned().references('id').inTable('events');
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.timestamps(true, true); // Adds created_at and updated_at columns
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('bookings');
  };
  