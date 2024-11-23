/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('services', function(table) {
      table.increments('id').primary();
      table.string('service_code', 255).notNullable();
      table.string('service_name', 255).notNullable();
      table.string('service_icon', 255).notNullable();
      table.integer('service_tariff').notNullable();
    })
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
