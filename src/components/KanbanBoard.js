import React, { useState } from 'react';
import {
  Box, Typography, IconButton, Modal, Fade, TextField, Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import Column from './Column';

const initialTasks = {
  'To-do': [
    { id: 'todo-1', title: 'Review UX Feedback', priority: 'High', date: '2024-03-13', comments: 1, attachments: 2 },
    { id: 'todo-2', title: 'Research Best Practices', priority: 'Low', date: '2024-03-10', comments: 2, attachments: 2 },
  ],
  'In Progress': [
    { id: 'progress-1', title: 'Create Wireframe', priority: 'Medium', date: '2024-03-12', comments: 1, attachments: 0 },
  ],
  'Done': [
    { id: 'done-1', title: 'Mockup', priority: 'High', date: '2024-03-10', comments: 0, attachments: 0 },
  ],
};

function KanbanBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedPriority, setEditedPriority] = useState('Medium');
  const [editedDate, setEditedDate] = useState('');
  const [editedComments, setEditedComments] = useState(0);
  const [editedAttachments, setEditedAttachments] = useState(0);
  const [newTaskColumn, setNewTaskColumn] = useState('To-do');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require a minimum drag distance for smoother start
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id;
    let sourceColumn = null;
    let destinationColumn = null;
    let activeTask = null;

    // Find source column and task
    for (const columnId of Object.keys(tasks)) {
      const columnTasks = tasks[columnId];
      if (columnTasks.some(task => task.id === activeId)) {
        sourceColumn = columnId;
        activeTask = columnTasks.find(task => task.id === activeId);
      }
    }

    if (!sourceColumn || !activeTask) return;

    // Determine destination column
    const columnIds = Object.keys(tasks);
    if (columnIds.includes(over.id)) {
      // Dropped directly on a column
      destinationColumn = over.id;
    } else {
      // Dropped on a task, find its column
      for (const columnId of columnIds) {
        if (tasks[columnId].some(task => task.id === over.id)) {
          destinationColumn = columnId;
          break;
        }
      }
    }

    if (!destinationColumn) return;

    // Remove task from source
    const sourceTasks = tasks[sourceColumn].filter(task => task.id !== activeId);
    const destinationTasks = [...tasks[destinationColumn]];

    // Determine insert position
    let insertIndex = destinationTasks.length; // Default to end
    if (over.id !== destinationColumn) {
      const overIndex = destinationTasks.findIndex(task => task.id === over.id);
      insertIndex = overIndex >= 0 ? overIndex : destinationTasks.length;
    }

    // Insert task at the correct position
    destinationTasks.splice(insertIndex, 0, activeTask);

    // Update state in a single, controlled move
    setTasks(prev => ({
      ...prev,
      [sourceColumn]: sourceTasks,
      [destinationColumn]: destinationTasks,
    }));
  };

  const handleDelete = (columnId, taskId) => {
    setTasks(prev => ({
      ...prev,
      [columnId]: prev[columnId].filter(task => task.id !== taskId),
    }));
  };

  const handleSaveEdit = (columnId, taskId, updatedTask) => {
    setTasks(prev => ({
      ...prev,
      [columnId]: prev[columnId].map(task =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      ),
    }));
  };

  const handleAddTask = () => {
    const uniqueId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newTask = {
      id: uniqueId,
      title: editedTitle,
      priority: editedPriority,
      date: editedDate || new Date().toISOString().split('T')[0],
      comments: editedComments,
      attachments: editedAttachments,
    };

    setTasks(prev => ({
      ...prev,
      [newTaskColumn]: [...prev[newTaskColumn], newTask],
    }));

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditedTitle('');
    setEditedPriority('Medium');
    setEditedDate('');
    setEditedComments(0);
    setEditedAttachments(0);
  };

  const columns = Object.keys(tasks);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <IconButton onClick={() => setModalOpen(true)} size="large" color="primary">
          <AddIcon fontSize="large" />
        </IconButton>
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
          {columns.map((columnId) => (
            <Column
              key={columnId}
              columnId={columnId}
              tasks={tasks[columnId]}
              onDelete={handleDelete}
              onSaveEdit={handleSaveEdit}
            />
          ))}
        </Box>
      </DndContext>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Fade in={modalOpen}>
          <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 24, minWidth: 300 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Add New Task</Typography>
            <TextField
              label="Task Title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Priority"
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value)}
              select
              SelectProps={{ native: true }}
              fullWidth
              sx={{ mb: 2 }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </TextField>
            <TextField
              label="Date"
              type="date"
              value={editedDate}
              onChange={(e) => setEditedDate(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Comments"
              type="number"
              value={editedComments}
              onChange={(e) => setEditedComments(Number(e.target.value) || 0)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Attachments"
              type="number"
              value={editedAttachments}
              onChange={(e) => setEditedAttachments(Number(e.target.value) || 0)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Column"
              value={newTaskColumn}
              onChange={(e) => setNewTaskColumn(e.target.value)}
              select
              SelectProps={{ native: true }}
              fullWidth
              sx={{ mb: 2 }}
            >
              {columns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </TextField>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleAddTask}
                disabled={!editedTitle.trim()}
              >
                Add
              </Button>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}

export default KanbanBoard;