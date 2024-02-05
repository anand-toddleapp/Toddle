/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('events', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('description').notNullable();
      table.decimal('price').notNullable();
      table.date('date').notNullable();
      table.integer('creator_id').unsigned().references('id').inTable('users');
    });
  };
  
  /**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
  exports.down = function(knex) {
    return knex.schema.dropTable('events');
  };
  
