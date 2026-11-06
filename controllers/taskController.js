const mongoose = require('mongoose');
const Task = require('../models/task');

const activeTasks = { deletedAt: null };

const parseTaskInput = (body) => {
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const dueDateValue = typeof body.dueDate === 'string' ? body.dueDate.trim() : '';

    if (!title) {
        return { error: 'El título es obligatorio.' };
    }

    if (title.length > 120 || description.length > 1000) {
        return { error: 'El título admite hasta 120 caracteres y la descripción hasta 1000.' };
    }

    let dueDate = null;
    if (dueDateValue) {
        const parsedDate = new Date(`${dueDateValue}T00:00:00.000Z`);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDateValue)
            || Number.isNaN(parsedDate.getTime())
            || parsedDate.toISOString().slice(0, 10) !== dueDateValue) {
            return { error: 'La fecha límite no es válida.' };
        }
        dueDate = parsedDate;
    }

    return { title, description, dueDate };
};

const findTask = async (id) => {
    if (!mongoose.isValidObjectId(id)) {
        return null;
    }
    return Task.findOne({ _id: id, ...activeTasks });
};

exports.list = async (req, res, next) => {
    try {
        const tasks = await Task.find(activeTasks).sort({ completed: 1, dueDate: 1, createdAt: -1 }).lean();
        res.render('index', {
            tasks,
            error: null,
            notice: req.query.notice || null,
            form: { title: '', description: '', dueDate: '' }
        });
    } catch (error) {
        next(error);
    }
};

exports.create = async (req, res, next) => {
    const input = parseTaskInput(req.body);
    if (input.error) {
        try {
            const tasks = await Task.find(activeTasks).sort({ completed: 1, dueDate: 1, createdAt: -1 }).lean();
            return res.status(422).render('index', {
                tasks,
                error: input.error,
                notice: null,
                form: req.body
            });
        } catch (error) {
            return next(error);
        }
    }

    try {
        await Task.create(input);
        res.redirect('/?notice=created');
    } catch (error) {
        next(error);
    }
};

exports.editForm = async (req, res, next) => {
    try {
        const task = await findTask(req.params.id);
        if (!task) {
            return res.status(404).render('error', {
                title: 'Tarea no encontrada',
                message: 'La tarea no existe o ya fue eliminada.'
            });
        }
        res.render('edit', { task, error: null });
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    const input = parseTaskInput(req.body);
    try {
        const task = await findTask(req.params.id);
        if (!task) {
            return res.status(404).render('error', {
                title: 'Tarea no encontrada',
                message: 'La tarea no existe o ya fue eliminada.'
            });
        }
        if (input.error) {
            return res.status(422).render('edit', { task: { ...task.toObject(), ...req.body }, error: input.error });
        }

        task.title = input.title;
        task.description = input.description;
        task.dueDate = input.dueDate;
        await task.save();
        res.redirect('/?notice=updated');
    } catch (error) {
        next(error);
    }
};

exports.toggle = async (req, res, next) => {
    try {
        const task = await findTask(req.params.id);
        if (!task) {
            return res.status(404).render('error', {
                title: 'Tarea no encontrada',
                message: 'La tarea no existe o ya fue eliminada.'
            });
        }
        task.completed = !task.completed;
        await task.save();
        res.redirect('/');
    } catch (error) {
        next(error);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const task = await findTask(req.params.id);
        if (!task) {
            return res.status(404).render('error', {
                title: 'Tarea no encontrada',
                message: 'La tarea no existe o ya fue eliminada.'
            });
        }
        task.deletedAt = new Date();
        await task.save();
        res.redirect('/');
    } catch (error) {
        next(error);
    }
};
