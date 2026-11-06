const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio.'],
        trim: true,
        maxlength: [120, 'El título no puede superar los 120 caracteres.']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'La descripción no puede superar los 1000 caracteres.'],
        default: ''
    },
    completed: {
        type: Boolean,
        default: false
    },
    dueDate: {
        type: Date,
        default: null
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
