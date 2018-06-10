const conn = require('../conn');
const chance = require('chance').Chance();
const { Sequelize } = conn;

const Question = conn.define(
  'question',
  {
    question: Sequelize.STRING,
    correct_answer: Sequelize.STRING,
    incorrect_answers: Sequelize.ARRAY(Sequelize.STRING),
    category: Sequelize.STRING,
    difficulty: Sequelize.STRING,
    answered_correctly: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  },
  { underscored: true }
);


module.exports = Question;
