import Box from '@mui/material/Box';

function Admin_view() {
  return (
    <div>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2 
      }}>
        <a
          className="App-link"
          href="/"
          target="_self"
          rel="noopener noreferrer"
        >
          Login
        </a>
        <a
          className="App-link"
          href="/home"
          target="_self"
          rel="noopener noreferrer"
        >
          Home
        </a>
        <a
          className="App-link"
          href="/device_history"
          target="_self"
          rel="noopener noreferrer"
        >
          Device History
        </a>
      </Box>
    </div>
  )
}
  
export default Admin_view;