const users = [];
const habits = [];
const revokedTokens = new Set();

let userSequence = 1;
let habitSequence = 1;

function nextUserId() {
  return userSequence++;
}

function nextHabitId() {
  return habitSequence++;
}

module.exports = {
  users,
  habits,
  revokedTokens,
  nextUserId,
  nextHabitId,
};
