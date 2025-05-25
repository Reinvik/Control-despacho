import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Switch
} from '@mui/material';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

function App() {
  const [zonals, setZonals] = useState([]);
  const [newZonal, setNewZonal] = useState({
    nombre: '',
    fecha: new Date().toLocaleDateString('es-ES', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }),
    horaSalida: '00:00'
  });

  useEffect(() => {
    socket.on('initialData', data => {
      setZonals(data);
    });

    socket.on('timerUpdate', data => {
      setZonals(data);
    });

    socket.on('zonalAdded', zonal => {
      setZonals(prev => [...prev, zonal]);
    });

    socket.on('zonalUpdated', zonal => {
      setZonals(prev => 
        prev.map(item => item._id === zonal._id ? zonal : item)
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewZonal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddZonal = async () => {
    if (!newZonal.nombre || !newZonal.horaSalida) return;

    try {
      const response = await fetch('http://localhost:5000/api/zonal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newZonal,
          activo: true,
          tiempoRestante: '00:00:00'
        }),
      });

      if (response.ok) {
        setNewZonal({
          nombre: '',
          fecha: new Date().toLocaleDateString('es-ES', { 
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          horaSalida: '00:00'
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleToggle = async (id, activo) => {
    try {
      const response = await fetch(`http://localhost:5000/api/zonal/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activo: !activo }),
      });

      if (!response.ok) {
        throw new Error('Failed to update zonal');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Panel de Despacho
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          label="Nombre Zonal"
          name="nombre"
          value={newZonal.nombre}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          label="Hora Salida"
          name="horaSalida"
          type="time"
          value={newZonal.horaSalida}
          onChange={handleInputChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddZonal}
        >
          Agregar
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Activo</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Hora Salida</TableCell>
              <TableCell>Tiempo Restante</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {zonals.map((zonal) => (
              <TableRow key={zonal._id}>
                <TableCell>
                  <Switch
                    checked={zonal.activo}
                    onChange={() => handleToggle(zonal._id, zonal.activo)}
                  />
                </TableCell>
                <TableCell>{zonal.nombre}</TableCell>
                <TableCell>{zonal.fecha}</TableCell>
                <TableCell>{zonal.horaSalida}</TableCell>
                <TableCell>
                  {zonal.tiempoRestante}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;
