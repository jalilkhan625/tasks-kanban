// src/App.js
import React from 'react';
import KanbanBoard from './components/KanbanBoard';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    background: { default: '#f9f9f9' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <KanbanBoard />
      </div>
    </ThemeProvider>
  );
}

export default App;