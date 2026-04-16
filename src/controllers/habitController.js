const habitService = require('../services/habitService');

function listHabits(req, res, next) {
  try {
    const habits = habitService.listHabitsByUser(req.user.id);

    return res.status(200).json({
      message: habits.length
        ? 'Habitos carregados com sucesso.'
        : 'Nenhum habito cadastrado para este usuario.',
      data: habits,
    });
  } catch (error) {
    return next(error);
  }
}

function createHabit(req, res, next) {
  try {
    const habit = habitService.createHabit(req.user.id, req.body);

    return res.status(201).json({
      message: 'Habito criado com sucesso.',
      data: habit,
    });
  } catch (error) {
    return next(error);
  }
}

function updateHabit(req, res, next) {
  try {
    const habit = habitService.updateHabit(req.user.id, req.params.id, req.body);

    return res.status(200).json({
      message: 'Habito atualizado com sucesso.',
      data: habit,
    });
  } catch (error) {
    return next(error);
  }
}

function deleteHabit(req, res, next) {
  try {
    habitService.deleteHabit(req.user.id, req.params.id);

    return res.status(200).json({
      message: 'Habito removido com sucesso.',
    });
  } catch (error) {
    return next(error);
  }
}

function updateTodayStatus(req, res, next) {
  try {
    const habit = habitService.markHabitForToday(
      req.user.id,
      req.params.id,
      req.body.completed
    );

    return res.status(200).json({
      message: 'Status diario do habito atualizado com sucesso.',
      data: habit,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  updateTodayStatus,
};
