# Urbania — Sistema de Gestión de Condominios

Plataforma web integral para la administración de condominios. Permite gestionar residentes, propietarios, vehículos, estacionamientos, accesos, préstamos de bienes y más, con roles diferenciados por tipo de usuario.

🔗 **Frontend (producción):** [https://fronted-hd-ngne.vercel.app](https://fronted-hd-ngne.vercel.app)
🔗 **Backend (API):** [https://sgc-backend-vfvl.onrender.com](https://sgc-backend-vfvl.onrender.com)
📄 **Documentación Swagger:** [https://sgc-backend-vfvl.onrender.com/swagger-ui/index.html](https://sgc-backend-vfvl.onrender.com/swagger-ui/index.html)

---

## Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Roles y Credenciales](#roles-y-credenciales)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Descripción de Archivos](#descripción-de-archivos)
- [Variables de Entorno](#variables-de-entorno)
- [Instalación y Desarrollo](#instalación-y-desarrollo)

---

## Tecnologías

- **React 18** + **Vite**
- **React Router v6**
- **React Toastify** — notificaciones
- **React Icons** — iconografía (Feather Icons)
- **CSS-in-JS** (estilos inline) — sin framework CSS externo

---

## Roles y Credenciales

### Super Administrador

| Campo | Valor |
|-------|-------|
| Email | admin@sgc.com |
| Password | 123456 |

---

### Administrador de Condominio

| Condominio | Email | Password |
|------------|-------|----------|
| Residencial Los Olivos | maria.lopez@olivos.com | 123456 |
| Edificio San Martín | pedro.sanchez@sanmartin.com | 123456 |

---

### Propietario

| Condominio | Email | Password |
|------------|-------|----------|
| Residencial Los Olivos | luis.fernandez@email.com | 123456 |
| Residencial Los Olivos | ana.martinez@email.com | 123456 |
| Residencial Los Olivos | jorge.ramirez@email.com | 123456 |
| Residencial Los Olivos | rosa.castro@email.com | 123456 |
| Residencial Los Olivos | miguel.alvarez@email.com | 123456 |
| Edificio San Martín | diana.peralta@email.com | 123456 |
| Edificio San Martín | ricardo.ortega@email.com | 123456 |

---

### Agente de Seguridad

| Condominio | Email | Password |
|------------|-------|----------|
| Residencial Los Olivos | jose.huaman@olivos.com | 123456 |
| Residencial Los Olivos | carmen.vega@olivos.com | 123456 |
| Edificio San Martín | alberto.rios@sanmartin.com | 123456 |

---

## Estructura del Proyecto

```
src
├── App.css
├── App.jsx
├── components
│   ├── AuthLayout.jsx
│   ├── AuthLeft.jsx
│   ├── AuthRight.jsx
│   ├── BadgeEstado.jsx
│   ├── CardDescrip.jsx
│   ├── CarruselCard.jsx
│   ├── EncabezadoTabla.jsx
│   ├── FAQ.jsx
│   ├── Footer.jsx
│   ├── ForgotPassword.jsx
│   ├── GuestRoute.jsx
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── Layout.jsx
│   ├── ListaConImagen.jsx
│   ├── Navbar.jsx
│   ├── Navbar2.jsx
│   ├── PricingCards.jsx
│   ├── PrivateRoute.jsx
│   ├── ScrollTop.jsx
│   ├── SeccionImg.jsx
│   ├── SidebarAdmin.jsx
│   ├── SidebarLayout.jsx
│   ├── SidebarPropietario.jsx
│   ├── SidebarSeguridad.jsx
│   ├── SidebarSuperAdmin.jsx
│   ├── WhatsappBoton.jsx
│   └── common
│       ├── ActionButton.jsx
│       ├── ConfirmModal.jsx
│       ├── EmptyState.jsx
│       ├── FormField.jsx
│       ├── InfoCard.jsx
│       ├── Loading.jsx
│       ├── Modal.jsx
│       ├── SectionHeader.jsx
│       ├── StatCard.jsx
│       ├── StatusBadge.jsx
│       └── Toast.jsx
├── context
│   └── AuthContext.jsx
├── hooks
│   ├── Admin
│   │   ├── useAdminApartments.js
│   │   ├── useAdminAssets.js
│   │   ├── useAdminDashboard.js
│   │   ├── useAdminLogs.js
│   │   ├── useAdminSettings.js
│   │   ├── useAdminStructure.js
│   │   └── useAdminUsers.js
│   ├── useLogin.js
│   ├── useLogout.js
│   ├── useSecurityAccess.js
│   └── useSidebarUser.js
├── images
│   └── (assets estáticos — imágenes, logos, video)
├── index.css
├── layouts
│   ├── AppLayout.jsx
│   ├── LoginLayout.jsx
│   └── PublicLayout.jsx
├── main.jsx
├── pages
│   ├── admin
│   ├── propietario
│   ├── public
│   ├── seguridad
│   └── superadmin
├── services
│   └── api.js
├── theme
│   └── colors.js
└── utils
    ├── roleRoutes.js
    └── validators.js
```

---

## Descripción de Archivos

### Raíz

| Archivo | Descripción |
|---------|-------------|
| `main.jsx` | Punto de entrada de la aplicación. Monta el árbol React con `BrowserRouter`, `AuthContext` y `ToastContainer`. |
| `App.jsx` | Define el enrutamiento principal con React Router. Agrupa rutas públicas, privadas y por rol usando `PrivateRoute` y `GuestRoute`. |
| `App.css` / `index.css` | Estilos globales base y reset de la aplicación. |

---

### `/components`

Componentes reutilizables usados en múltiples páginas.

| Archivo | Descripción |
|---------|-------------|
| `AuthLayout.jsx` | Layout contenedor del flujo de autenticación. Muestra la pantalla dividida con imagen izquierda (AuthLeft) y formulario derecho (AuthRight). Gestiona la animación de entrada por fases. |
| `AuthLeft.jsx` | Panel izquierdo del login. Muestra el título hero, descripción y badges de características del sistema sobre la imagen de fondo. |
| `AuthRight.jsx` | Formulario de inicio de sesión. Maneja validación, estados de carga, visibilidad de contraseña y enlace a recuperación. |
| `BadgeEstado.jsx` | Componente badge reutilizable para mostrar estados (activo, inactivo, pendiente) con colores diferenciados. |
| `CardDescrip.jsx` | Tarjeta con imagen, título y descripción usada en secciones informativas de la landing. |
| `CarruselCard.jsx` | Carrusel de tarjetas para mostrar testimonios, características o servicios en la landing. |
| `EncabezadoTabla.jsx` | Encabezado estilizado para tablas de datos con soporte de título y contador de registros. |
| `FAQ.jsx` | Sección de preguntas frecuentes con acordeón expandible para la página pública. |
| `Footer.jsx` | Pie de página global con links de navegación, redes sociales y datos de contacto. |
| `ForgotPassword.jsx` | Modal de recuperación de contraseña. Envía el correo al endpoint `/api/auth/forgot-password`. |
| `GuestRoute.jsx` | Ruta protegida inversa. Redirige al dashboard correspondiente si el usuario ya está autenticado. |
| `Header.jsx` | Cabecera informativa para páginas públicas internas (Nosotros, Servicios, etc.). |
| `Hero.jsx` | Sección hero principal de la landing con video de fondo, título y llamada a la acción. |
| `Layout.jsx` | Wrapper genérico de layout con padding y contenedor centrado. |
| `ListaConImagen.jsx` | Sección con lista de características acompañada de imagen ilustrativa. |
| `Navbar.jsx` | Barra de navegación principal para páginas públicas con links y botón de acceso. |
| `Navbar2.jsx` | Variante de navbar para páginas internas o con scroll activo. |
| `PricingCards.jsx` | Tarjetas de planes y precios para la página de Precios. |
| `PrivateRoute.jsx` | Ruta protegida por autenticación y rol. Redirige al login si no hay sesión activa o si el rol no coincide. |
| `ScrollTop.jsx` | Componente que hace scroll al tope de la página en cada cambio de ruta. |
| `SeccionImg.jsx` | Sección con imagen de fondo y contenido superpuesto, usada en páginas públicas. |
| `SidebarAdmin.jsx` | Sidebar del panel administrador de condominio con menú de gestión inmobiliaria. Color azul. |
| `SidebarLayout.jsx` | Componente base de todos los sidebars. Gestiona apertura/cierre, animaciones, información del usuario desde `AuthContext` y botón de logout. |
| `SidebarPropietario.jsx` | Sidebar del panel propietario con menú de apartamento, vehículos e inquilinos. Color naranja. |
| `SidebarSeguridad.jsx` | Sidebar del panel de seguridad con menú de accesos, estacionamientos, préstamos y movimientos. Color verde. |
| `SidebarSuperAdmin.jsx` | Sidebar del super administrador con gestión de condominios, administradores y usuarios. Color púrpura. |
| `WhatsappBoton.jsx` | Botón flotante de contacto por WhatsApp visible en páginas públicas. |

---

### `/components/common`

Componentes atómicos de UI compartidos entre todos los paneles.

| Archivo | Descripción |
|---------|-------------|
| `ActionButton.jsx` | Botón de acción con soporte de ícono, variante de color y estado de carga. |
| `ConfirmModal.jsx` | Modal de confirmación con mensaje personalizable y acciones de aceptar/cancelar. |
| `EmptyState.jsx` | Estado vacío estilizado con ícono, título y descripción para tablas o listas sin datos. |
| `FormField.jsx` | Campo de formulario con label, input y manejo de error unificado. |
| `InfoCard.jsx` | Tarjeta de información con ícono, etiqueta y valor para mostrar datos de perfil o resumen. |
| `Loading.jsx` | Indicador de carga centrado con spinner animado. |
| `Modal.jsx` | Modal base reutilizable con overlay, header con título, botón de cierre y slot para contenido. |
| `SectionHeader.jsx` | Encabezado de sección con título, descripción opcional y acción secundaria. |
| `StatCard.jsx` | Tarjeta de estadística con valor numérico, etiqueta y color de acento configurable. |
| `StatusBadge.jsx` | Badge de estado con texto y color basado en un valor string (activo, inactivo, etc.). |
| `Toast.jsx` | Wrapper de configuración del `ToastContainer` de react-toastify con posición y estilos globales. |

---

### `/context`

| Archivo | Descripción |
|---------|-------------|
| `AuthContext.jsx` | Contexto global de autenticación. Provee `user`, `loading` y `setUser` a toda la app. Obtiene el usuario actual desde `GET /api/auth/me` al cargar la aplicación. |

---

### `/hooks`

#### `/hooks/Admin`

| Archivo | Descripción |
|---------|-------------|
| `useAdminApartments.js` | Lógica para listar, filtrar, asignar propietario y actualizar ocupantes de departamentos del condominio. |
| `useAdminAssets.js` | Gestión de bienes comunes: listado, creación y cambio de estado (disponible, en mantenimiento, etc.). |
| `useAdminDashboard.js` | Obtiene métricas del dashboard del administrador desde `GET /api/admin/dashboard/metrics`. |
| `useAdminLogs.js` | Carga y filtra el historial de accesos y movimientos del condominio. |
| `useAdminSettings.js` | Lee y actualiza la configuración general del condominio (nombre, reglas, etc.). |
| `useAdminStructure.js` | Gestión de la estructura organizativa del condominio (torres, pisos, nodos). |
| `useAdminUsers.js` | CRUD de usuarios del condominio: listar, crear, actualizar, activar/desactivar. |

#### Hooks globales

| Archivo | Descripción |
|---------|-------------|
| `useLogin.js` | Maneja el flujo de login: llama a `POST /api/auth/login`, actualiza el contexto y redirige según el rol del usuario. |
| `useLogout.js` | Llama a `POST /api/auth/logout`, limpia el contexto y redirige al login. |
| `useSecurityAccess.js` | Encapsula la lógica de verificación de placa, registro de entrada y registro de salida para el panel de seguridad. |
| `useSidebarUser.js` | Construye el array de información de usuario para el sidebar a partir del contexto de autenticación. |

---

### `/layouts`

| Archivo | Descripción |
|---------|-------------|
| `AppLayout.jsx` | Layout base para paneles privados (admin, propietario, seguridad, superadmin). Incluye el sidebar correspondiente según el rol y el área de contenido principal. |
| `LoginLayout.jsx` | Layout minimalista para las páginas de autenticación (login, recuperación de contraseña). |
| `PublicLayout.jsx` | Layout para páginas públicas. Incluye `Navbar`, `Footer` y `ScrollTop`. |

---

### `/pages`

#### `/pages/public`

| Archivo | Descripción |
|---------|-------------|
| `Inicio.jsx` | Landing page principal con Hero, características del sistema, galería y llamada a la acción. |
| `Login.jsx` | Página de inicio de sesión. Renderiza `AuthLayout` con las imágenes y configuración de color del sistema. |
| `Nosotros.jsx` | Página institucional con información sobre el equipo y misión del producto. |
| `Servicios.jsx` | Descripción de los servicios y módulos que ofrece la plataforma. |
| `Precios.jsx` | Página de planes y precios con tarjetas comparativas. |
| `Contacto.jsx` | Formulario de contacto y datos de soporte. |
| `Privacidad.jsx` | Política de privacidad de la plataforma. |
| `Terminos.jsx` | Términos y condiciones de uso del servicio. |
| `Register.jsx` | Formulario de registro para nuevos usuarios. |

#### `/pages/superadmin`

| Archivo | Descripción |
|---------|-------------|
| `DashboardSuperAdmin.jsx` | Panel principal del super administrador con métricas globales, condominios recientes y administradores registrados. |
| `Condominios.jsx` | CRUD completo de condominios: crear, editar, activar/desactivar y asignar administrador. |
| `Administradores.jsx` | Gestión de administradores de condominio: crear, editar, asignar condominio y cambiar estado. |
| `UsuariosGlobales.jsx` | Vista de todos los usuarios del sistema con opciones de cambio de estado e invalidación de sesión. |
| `PerfilSuperAdmin.jsx` | Perfil del super administrador con datos personales y formulario de cambio de contraseña. |

#### `/pages/admin`

| Archivo | Descripción |
|---------|-------------|
| `DashboardAdmin.jsx` | Panel del administrador de condominio con métricas de ocupación, departamentos, vehículos y actividad reciente. |
| `Usuarios.jsx` | Gestión de usuarios del condominio: propietarios y agentes de seguridad. |
| `Departamentos.jsx` | Listado y gestión de departamentos con asignación de propietarios y actualización de ocupantes. |
| `Bienes.jsx` | Gestión de bienes comunes (carritos, sillas, equipos) con control de estado. |
| `Reportes.jsx` | Generación y visualización de reportes de accesos, ocupación y movimientos. |
| `Configuracion.jsx` | Ajustes del condominio: nombre, dirección, reglas y parámetros generales. |
| `Auditoria.jsx` | Historial completo de acciones y movimientos registrados en el condominio. |
| `Perfil.jsx` | Perfil del administrador con datos personales y cambio de contraseña. |

#### `/pages/propietario`

| Archivo | Descripción |
|---------|-------------|
| `DashboardPropietario.jsx` | Resumen del propietario: estado del apartamento, vehículos registrados e inquilinos activos. |
| `MiApartamento.jsx` | Detalle del apartamento asignado al propietario con información de ocupación y características. |
| `MisVehiculos.jsx` | Gestión de vehículos del propietario: registrar y eliminar. |
| `MisInquilinos.jsx` | Administración de inquilinos del apartamento: agregar y eliminar. |
| `Historial.jsx` | Historial de accesos y movimientos del apartamento del propietario. |
| `PerfilPropietario.jsx` | Perfil del propietario con datos personales y cambio de contraseña. |

#### `/pages/seguridad`

| Archivo | Descripción |
|---------|-------------|
| `AccesosSeguridad.jsx` | Registro de entradas y salidas de vehículos. Verifica la placa contra el sistema, registra el log de acceso y muestra el historial de la sesión actual. |
| `VehiculosSeguridad.jsx` | Búsqueda de vehículos por placa y visualización de slots de estacionamiento con disponibilidad en tiempo real. |
| `VisitasSeguridad.jsx` | Gestión de préstamos de bienes comunes (carritos): registrar nuevos préstamos y marcar devoluciones. |
| `Movimientos.jsx` | Historial de actividad del condominio con métricas de estacionamientos y préstamos activos, filtros por tipo y fecha. |
| `PerfilSeguridad.jsx` | Perfil del agente de seguridad con datos del usuario autenticado y formulario de cambio de contraseña. |

---

### `/services`

| Archivo | Descripción |
|---------|-------------|
| `api.js` | Centraliza todas las llamadas HTTP al backend (`https://sgc-backend-vfvl.onrender.com`). Exporta funciones por módulo (auth, superadmin, admin, propietario, seguridad). Usa `fetch` con `credentials: 'include'` para manejo de cookies de sesión. Lanza errores con el mensaje del servidor cuando la respuesta no es OK. |

---

### `/theme`

| Archivo | Descripción |
|---------|-------------|
| `colors.js` | Paleta de colores centralizada por rol: púrpura (superadmin), azul (admin), naranja (propietario), verde (seguridad). Exporta objetos con `accentColor`, `accentLight` y `accentDark`. |

---

### `/utils`

| Archivo | Descripción |
|---------|-------------|
| `roleRoutes.js` | Mapea cada rol del backend (`SUPER_ADMINISTRADOR`, `ADMINISTRADOR_CONDOMINIO`, `PROPIETARIO`, `AGENTE_SEGURIDAD`) a su ruta de dashboard correspondiente. Usado en `useLogin.js` para la redirección post-login. |
| `validators.js` | Funciones de validación de formularios: verifica formato de correo y que los campos requeridos no estén vacíos. |

---

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=https://sgc-backend-vfvl.onrender.com
```

---

## Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build
```
