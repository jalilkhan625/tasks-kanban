import React from 'react';
import { Box, Typography } from '@mui/material';
import TaskCard from './TaskCard';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function Column({
  columnId,
  tasks,
  onDelete,
  onSaveEdit,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: columnId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 0.2s ease',
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        minWidth: 280,
        flexShrink: 0,
        bgcolor: '#f9f9f9',
        p: 2,
        borderRadius: 2,
        boxShadow: 1,
        display: 'flex',
        flexDirection: 'column',
        // Add padding and min-height to ensure droppable area is clear
        minHeight: '200px',
        border: isDragging ? '2px dashed #1976d2' : '2px solid transparent', // Visual feedback
      }}
      {...attributes}
      {...listeners}
    >
      <Typography variant="h6" gutterBottom>
        {columnId} ({tasks.length})
      </Typography>

      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            columnId={columnId}
            onDelete={onDelete}
            onSaveEdit={onSaveEdit}
          />
        ))}
      </SortableContext>
    </Box>
  );
}

export default Column;