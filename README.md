# Sistema de Cuenta Regresiva Web

Este es un sistema web que reemplaza la funcionalidad de la macro de Excel para la gestión de tiempos de zonales. La aplicación permite:

- Agregar zonales con sus horas de salida
- Mantener un registro histórico de tiempos
- Actualizar tiempos en tiempo real
- Compartir la información en tiempo real entre múltiples usuarios

## Requisitos

- Node.js (versión 14 o superior)
- MongoDB
- NPM o Yarn

## Instalación

1. Clonar el repositorio
2. Instalar dependencias del backend:
```bash
cd backend
npm install
```

3. Instalar dependencias del frontend:
```bash
cd frontend
npm install
```

4. Configurar MongoDB:
- Asegurarse de que MongoDB esté corriendo
- Opcionalmente, crear un archivo `.env` en el directorio backend con la siguiente variable:
```
MONGODB_URI=your_mongodb_uri
```

## Ejecución

Para ejecutar la aplicación en modo desarrollo:

```bash
# En una terminal, en el directorio raíz:
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Características

- Interfaz moderna con Material-UI
- Actualización en tiempo real usando Socket.IO
- Persistencia de datos con MongoDB
- Manejo de múltiples usuarios simultáneos
- Registro histórico de tiempos
- Interfaz intuitiva y fácil de usar

## Estructura del Proyecto

```
cuenta-regresiva/
├── backend/        # Servidor Node.js
│   └── server.js   # Punto de entrada del servidor
├── frontend/       # Aplicación React
│   ├── src/        # Código fuente
│   │   ├── App.js  # Componente principal
│   │   └── index.js
│   └── package.json
└── package.json    # Configuración del proyecto
```

## Tecnologías Utilizadas

- Frontend: React, Material-UI
- Backend: Node.js, Express
- Base de Datos: MongoDB
- Comunicación en tiempo real: Socket.IO
- Estado: React Hooks
