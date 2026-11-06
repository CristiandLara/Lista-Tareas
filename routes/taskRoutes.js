const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

router.get('/', taskController.list);
router.post('/tasks', taskController.create);
router.get('/tasks/:id/edit', taskController.editForm);
router.post('/tasks/:id/edit', taskController.update);
router.post('/tasks/:id/toggle', taskController.toggle);
router.post('/tasks/:id/delete', taskController.remove);

module.exports = router;
