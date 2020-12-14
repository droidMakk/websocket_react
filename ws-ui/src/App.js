import { useEffect, useState, useRef } from 'react'
import './App.css';

function App() {
  const [connected, setConnected] = useState(false)
  const [message, setMessage] = useState(null);
  const wsRef = useRef()

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:8080', 'echo-protocol')
    wsRef.current.onopen = () => {
      console.log('connection opened!')
      setConnected(true)
    }
    wsRef.current.onmessage = (e) => {
      console.log('recieved message ---', e.data)
      setMessage(e.data)
    }

    return () => {
      // close connection
      wsRef.current.close()
    }
  },[])

  return (
    <div className="App">
      <div>
        <h4>{connected ? 'CONNECTED' : 'DISCONNECTED'}</h4>
        <p>THE CURRENT DATA - {message}</p>
      </div>
    </div>
  );  
}

export default App;
