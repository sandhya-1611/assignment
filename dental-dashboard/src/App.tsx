// import React from 'react';

// function App() {
//   return (
//     <div className="App">
//       <h1>Hello, React + TypeScript!</h1>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const theme = createTheme({
  palette: {
    mode: 'dark', 
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to DentalFlow
        </Typography>
        <Typography variant="body1" paragraph>
          This is a basic MUI setup using React and TypeScript.
        </Typography>
        <Button variant="contained" color="primary">
          Get Started
        </Button>
      </Container>
    </ThemeProvider>
  );
}

export default App;
