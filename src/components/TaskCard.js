import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  Fade,
  TextField,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Utility to return a color based on priority
function getPriorityColor(priority) {
  switch (priority) {
    case 'High':
      return 'error.main';
    case 'Medium':
      return 'warning.main';
    case 'Low':
      return 'success.main';
    default:
      return 'grey.500';
  }
}

function TaskCard({
  task,
  columnId,
  onDelete,
  onSaveEdit,
}) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [localTitle, setLocalTitle] = useState(task.title);
  const [localPriority, setLocalPriority] = useState(task.priority);
  const [localDate, setLocalDate] = useState(task.date);
  const [localComments, setLocalComments] = useState(task.comments);
  const [localAttachments, setLocalAttachments] = useState(task.attachments);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 0.2s ease', // Smooth transition
    marginBottom: '12px',
    touchAction: 'manipulation', // Improve touch drag
    cursor: isDragging ? 'grabbing' : 'grab', // Visual feedback
    opacity: isDragging ? 0.8 : 1, // Fade effect while dragging
    zIndex: isDragging ? 1000 : 'auto', // Ensure dragged item is on top
  };

  const handleOpenEditModal = () => {
    setLocalTitle(task.title);
    setLocalPriority(task.priority);
    setLocalDate(task.date);
    setLocalComments(task.comments);
    setLocalAttachments(task.attachments);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleSaveEdit = () => {
    const updatedTask = {
      id: task.id,
      title: localTitle,
      priority: localPriority,
      date: localDate,
      comments: localComments,
      attachments: localAttachments,
    };
    onSaveEdit(columnId, task.id, updatedTask);
    handleCloseEditModal();
  };

  const handleDelete = () => {
    onDelete(columnId, task.id);
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        p: 2,
        bgcolor: '#fff',
        borderRadius: 2,
        boxShadow: 2,
        borderLeft: '6px solid',
        borderColor: getPriorityColor(task.priority),
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle1" fontWeight="bold">
          {task.title}
        </Typography>
        <Chip
          label={task.priority}
          size="small"
          sx={{
            bgcolor: getPriorityColor(task.priority),
            color: 'white',
            fontWeight: 'bold',
          }}
        />
      </Box>

      <Typography variant="body2" color="text.secondary">
        📅 Date: {task.date}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        💬 Comments: {task.comments} | 📎 Attachments: {task.attachments}
      </Typography>

      <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleOpenEditModal}
          size="small"
          startIcon={<EditIcon />}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          size="small"
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </Box>

      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        closeAfterTransition
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Fade in={openEditModal}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              p: 4,
              borderRadius: 2,
              boxShadow: 24,
              minWidth: 350,
              width: '90%',
              maxWidth: 450,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>Edit Task</Typography>

            <TextField
              label="Task Title"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />

            <TextField
              label="Priority"
              value={localPriority}
              onChange={(e) => setLocalPriority(e.target.value)}
              select
              SelectProps={{ native: true }}
              fullWidth
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </TextField>

            <TextField
              label="Date"
              type="date"
              value={localDate}
              onChange={(e) => setLocalDate(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Comments"
              type="number"
              value={localComments}
              onChange={(e) => setLocalComments(Number(e.target.value) || 0)}
              fullWidth
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />

            <TextField
              label="Attachments"
              type="number"
              value={localAttachments}
              onChange={(e) => setLocalAttachments(Number(e.target.value) || 0)}
              fullWidth
              variant="outlined"
              size="small"
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleSaveEdit}
                size="small"
                disabled={!localTitle.trim()}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={handleCloseEditModal}
                size="small"
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}

export default TaskCard;