/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('banners', function(table) {
      table.increments('id').primary();
      table.string('banner_name', 255).notNullable();
      table.string('banner_image', 255).notNullable();
      table.text('description', 255).notNullable();
    })
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
