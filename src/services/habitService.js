const { habits, nextHabitId } = require('../models/dataStore');

function validateHabitPayload(payload) {
  if (!payload.name || !payload.name.trim()) {
    const error = new Error('name e obrigatorio.');
    error.statusCode = 400;
    throw error;
  }
}

function mapHabitStatus(habit) {
  const today = new Date().toISOString().slice(0, 10);
  const completedToday = Boolean(habit.dailyStatus[today]);

  return {
    id: habit.id,
    userId: habit.userId,
    name: habit.name,
    description: habit.description,
    createdAt: habit.createdAt,
    updatedAt: habit.updatedAt,
    completedToday,
    statusToday: completedToday ? 'completed' : 'pending',
  };
}

function listHabitsByUser(userId) {
  return habits
    .filter((habit) => habit.userId === userId)
    .map(mapHabitStatus);
}

function createHabit(userId, payload) {
  validateHabitPayload(payload);

  const now = new Date().toISOString();
  const habit = {
    id: nextHabitId(),
    userId,
    name: payload.name.trim(),
    description: payload.description ? payload.description.trim() : '',
    createdAt: now,
    updatedAt: now,
    dailyStatus: {},
  };

  habits.push(habit);

  return mapHabitStatus(habit);
}

function findHabitById(userId, habitId) {
  const parsedId = Number(habitId);
  const habit = habits.find(
    (storedHabit) => storedHabit.id === parsedId && storedHabit.userId === userId
  );

  if (!habit) {
    const error = new Error('Habito nao encontrado para o usuario autenticado.');
    error.statusCode = 404;
    throw error;
  }

  return habit;
}

function updateHabit(userId, habitId, payload) {
  validateHabitPayload(payload);

  const habit = findHabitById(userId, habitId);

  habit.name = payload.name.trim();
  habit.description = payload.description ? payload.description.trim() : '';
  habit.updatedAt = new Date().toISOString();

  return mapHabitStatus(habit);
}

function deleteHabit(userId, habitId) {
  const habit = findHabitById(userId, habitId);
  const habitIndex = habits.findIndex((storedHabit) => storedHabit.id === habit.id);

  habits.splice(habitIndex, 1);
}

function markHabitForToday(userId, habitId, completed) {
  const habit = findHabitById(userId, habitId);
  const today = new Date().toISOString().slice(0, 10);

  if (typeof completed !== 'boolean') {
    const error = new Error('completed deve ser booleano.');
    error.statusCode = 400;
    throw error;
  }

  habit.dailyStatus[today] = completed;
  habit.updatedAt = new Date().toISOString();

  return mapHabitStatus(habit);
}

module.exports = {
  listHabitsByUser,
  createHabit,
  updateHabit,
  deleteHabit,
  markHabitForToday,
};
