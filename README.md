# Libro de cuentas

Sistema web de contabilidad para restaurantes: balance, ventas de platos con recetas (descuentan insumos), compras, costos y margen, cierre del día, cuentas por cobrar y pagar, respaldo e impresión a PDF.

## Estructura
```
contabilidad/
├── src/                    Servidor (Node.js + Express)
│   ├── server.js           Punto de entrada
│   ├── db.js               Base de datos SQLite y tablas
│   ├── schema.js           Tablas y reglas de validación
│   ├── config.js, errors.js, middleware.js   Configuración, errores y seguridad
│   ├── services/restaurant.js   Ventas de platos y compras de insumos
│   ├── auth.js             Login, roles y registro de cambios
│   └── routes/
│       ├── crud.js         Alta, edición y borrado de registros
│       ├── operations.js   Ventas/compras, transferencias, respaldo
│       └── users.js        Contraseñas y usuarios
├── public/                 Sitio web que ve el usuario
│   ├── index.html          Estructura de la página
│   ├── css/styles.css      Diseño
│   └── js/
│       ├── state.js, config.js, api.js, auth.js, events.js, app.js
│       └── views/          dashboard.js, lists.js, sales.js, purchases.js, tools.js
├── test/                   Pruebas automáticas (npm test)
├── data.db                 Tus datos (se crea solo; cópialo para respaldar)
├── .env.example            Variables para publicar en internet
└── package.json
```

## Uso
1. Instala Node.js 18 o superior.
2. `npm install` y luego `npm start` (o `npm run dev` para recargar al editar).
3. Abre http://localhost:3000. Usuario inicial: `admin` / `admin123`.
4. En Respaldo cambia la contraseña y crea usuarios de solo lectura.

## Publicar en internet
Súbelo a Render o Railway, define la variable `SECRET` (ver `.env.example`) y usa un volumen para `data.db`.
