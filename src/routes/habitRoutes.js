const express = require('express');
const habitController = require('../controllers/habitController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/habits:
 *   get:
 *     summary: Lista os habitos do usuario autenticado
 *     tags: [Habitos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista carregada com sucesso
 */
router.get('/', habitController.listHabits);

/**
 * @swagger
 * /api/habits:
 *   post:
 *     summary: Cria um novo habito
 *     tags: [Habitos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HabitRequest'
 *     responses:
 *       201:
 *         description: Habito criado com sucesso
 */
router.post('/', habitController.createHabit);

/**
 * @swagger
 * /api/habits/{id}:
 *   put:
 *     summary: Atualiza um habito existente
 *     tags: [Habitos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HabitRequest'
 *     responses:
 *       200:
 *         description: Habito atualizado com sucesso
 */
router.put('/:id', habitController.updateHabit);

/**
 * @swagger
 * /api/habits/{id}:
 *   delete:
 *     summary: Remove um habito do usuario autenticado
 *     tags: [Habitos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Habito removido com sucesso
 */
router.delete('/:id', habitController.deleteHabit);

/**
 * @swagger
 * /api/habits/{id}/today:
 *   patch:
 *     summary: Marca ou desmarca a conclusao diaria do habito
 *     tags: [Habitos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HabitStatusRequest'
 *     responses:
 *       200:
 *         description: Status diario atualizado com sucesso
 */
router.patch('/:id/today', habitController.updateTodayStatus);

module.exports = router;
