
exports.up = function(knex) {
  return knex.schema.createTable('clucks', (t) => {
    t.bigIncrements('id');
    t.string('username');
    t.string('image_url');
    t.text('content');
    t.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('clucks');
};
