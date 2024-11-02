import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Konfiguracja adresu serwera Socket.IO
const socket = io('http://localhost:8000'); // Zmień na adres swojego serwera

const ToggleButton = () => {
  const [isOn, setIsOn] = useState(false);

  // Ustawienie połączenia socket przy montowaniu komponentu
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Połączono z serwerem Socket.IO');
    });

    // Zamknij połączenie przy odmontowywaniu komponentu
    return () => {
      socket.disconnect();
    };
  }, []);

  // Funkcja obsługująca kliknięcie przycisku
  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);

    // Wysłanie aktualnego stanu do serwera przez socket
    socket.emit('toggleState', newState ? 'ON' : 'OFF');
  };

  return (
    <button 
      onClick={handleToggle}
      style={{
        padding: '10px 20px',
        height: '10%',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: isOn ? '#4CAF50' : '#f44336', // zielony dla ON, czerwony dla OFF
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
      }}
    >
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
};

export default ToggleButton;
