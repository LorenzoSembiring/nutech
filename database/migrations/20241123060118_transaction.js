/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('transactions', function(table) {
      table.increments('id').primary();
      table.integer('service_id').notNullable().unsigned().index().references('id').inTable('services');
      table.integer('user_id').notNullable().unsigned().index().references('id').inTable('users');
      table.string('transaction_type', 255).notNullable();
      table.string('description', 255).notNullable();
      table.integer('total_amount').notNullable();
      table.dateTime('created_on');
    })
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
