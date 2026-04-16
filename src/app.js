const express = require('express');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habitRoutes');
const errorHandler = require('./middlewares/errorMiddleware');
const swaggerSpec = require('./docs/swagger');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'HabTrack API em execucao. Acesse /api-docs para a documentacao Swagger.',
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

app.use(errorHandler);

module.exports = app;
