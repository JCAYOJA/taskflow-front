# ⚡ TaskFlow - Gestión de Proyectos y Tareas

Interfaz web moderna y de alto rendimiento desarrollada como evaluación final del módulo para la administración ágil de proyectos y sus tareas correspondientes en entornos de equipo. Construida con **React 19**, **TypeScript**, **Vite** y estandarizada utilizando **Tailwind CSS v4** y componentes accesibles.

---

## 🚀 Características Principales

- **🔐 Autenticación & Autorización:**
  - Registro de usuarios e inicio de sesión.
  - Gestión de sesión mediante tokens JWT con persistencia en `LocalStorage`.
  - Rutas públicas y rutas protegidas (`ProtectedRoute`).
  - Cierre de sesión seguro con limpieza de estado global.

- **📁 Gestión Completa de Proyectos (CRUD - Examen Final):**
  - Creación rápida de proyectos mediante un panel lateral interactivo con validación de estados.
  - Listado dinámico de proyectos asociados al usuario autenticado.
  - Selección interactiva para conmutar el espacio de trabajo en tiempo real.
  - Eliminación lógica de proyectos de la base de datos.

- **📋 Gestión Completa de Tareas por Proyecto (CRUD):**
  - Creación de tareas vinculadas estrictamente a un proyecto activo.
  - Edición en caliente del título y descripción de tareas existentes mediante modales.
  - Alternancia ágil de estado mediante peticiones asíncronas hacia la API: pendiente ↔ completada.
  - Eliminación permanente de tareas de forma individual.

- **📊 Métricas & Feedback Visual en Tiempo Real:**
  - Tarjetas de resumen automatizadas en el panel superior: *Total de tareas*, *Completadas* y *Pendientes* calculadas dinámicamente por proyecto.
  - Notificaciones enriquecidas (*toasts*) con Sonner para cada acción del usuario.
  - Indicadores de carga mediante estructuras estructuradas animadas (*Skeletons*).
  - Manejo integral de estados vacíos (*Empty state*) y estados de error con opción de reintento manual.

---

## 🛠️ Stack Tecnológico

| Tecnología | Rol / Descripción |
| :--- | :--- |
| **[React 19](https://react.dev/)** | Biblioteca principal de componentes de interfaz. |
| **[TypeScript](https://www.typescriptlang.org/)** | Tipado estático robusto y autocompletado en toda la aplicación. |
| **[Vite 8](https://vite.dev/)** | Entorno de desarrollo ultrarrápido y empaquetador para producción. |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Motor de estilos moderno y diseño basado en utilidades de última generación. |
| **[React Router DOM v7](https://reactrouter.com/)** | Enrutamiento declarativo del lado del cliente (SPA). |
| **[Lucide React](https://lucide.dev/)** | Iconografía vectorizada clara y consistente. |
| **[Sonner](https://sonner.emilkowal.ski/)** | Sistema ligero y estilizado de alertas y notificaciones Toast. |
| **[@base-ui/react](https://base-ui.com/) / Shadcn** | Primitivas y componentes UI accesibles y sin estilos restrictivos. |

---

## 📁 Estructura del Proyecto

```text
src/
├── assets/             # Recursos estáticos (imágenes, SVGs)
├── components/         # Componentes reutilizables
│   ├── common/         # Componentes comunes (p. ej. ProtectedRoute)
│   ├── tasks/          # Componentes de tareas (TaskItem, TaskForm, TaskSkeleton)
│   └── ui/             # Primitivas de diseño (Button, Card, Dialog, Input, etc.)
├── context/            # Contexto global de la aplicación (AuthContext, ProjectContext)
├── hooks/              # Custom hooks (useAuth, useProjects)
├── layouts/            # Estructuras de página compartidas (MainLayout)
├── lib/                # Utilidades generales y constantes globales
├── pages/              # Vistas principales de la aplicación
│   ├── LandingPage.tsx   # Página de inicio con hero y características
│   ├── LoginPage.tsx     # Formulario de inicio de sesión
│   ├── RegisterPage.tsx  # Formulario de registro de usuarios
│   └── DashboardPage.tsx # Panel privado con métricas, barra de proyectos y lista de tareas
├── services/           # Capa de consumo de API REST
│   ├── api.ts            # Cliente fetch centralizado con inyección de JWT
│   ├── auth.service.ts   # Peticiones de autenticación
│   ├── project.service.ts# Peticiones CRUD de proyectos (Examen Final)
│   └── task.service.ts   # Peticiones CRUD de tareas por proyecto
├── App.tsx             # Configuración de rutas y providers globales
└── main.tsx            # Punto de entrada de la aplicación
```

---

## ⚙️ Configuración del Entorno

1. Clona el repositorio y sitúate en el directorio del proyecto:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd taskflow-front
   ```

2. Copia la plantilla de variables de entorno:
   ```bash
   cp .env.example .env
   ```

3. Modifica los valores en el archivo `.env` según tu entorno:

| Variable | Descripción | Valor por defecto |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base del backend (API REST de TaskFlow) | `http://localhost:3000` |
| `VITE_TOKEN_KEY` | Nombre de la clave para almacenar el JWT en `localStorage` | `taskflow_token` |
| `VITE_APP_NAME` | Nombre visible de la aplicación en la interfaz | `TaskFlow` |

---

## 💻 Instalación y Ejecución

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior recomendada).

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible típicamente en [http://localhost:5173](http://localhost:5173).

### 3. Compilar para producción
```bash
npm run build
```
Genera el paquete optimizado en el directorio `dist/`.

### 4. Previsualizar el build de producción localmente
```bash
npm run preview
```

### 5. Verificar linters de código
```bash
npm run lint
```

---

## 🔗 Endpoints Consumidos (Backend)

La aplicación se comunica con la API proporcionada (`project-task-flow-api`) bajo los siguientes endpoints:

- **Autenticación:**
  - `POST /auth/register` - Registro de usuario (`name`, `email`, `password`).
  - `POST /auth/login` - Inicio de sesión (`email`, `password`) -> devuelve token JWT.
  - `GET /auth/me` - Perfil del usuario autenticado con cabecera `Authorization: Bearer <token>`.

- **Proyectos:**
  - `GET /projects` - Obtener lista de proyectos del usuario autenticado.
  - `POST /projects` - Crear un proyecto (`name`, `description`).
  - `PUT /projects/:id` - Actualizar nombre o descripción de un proyecto.
  - `DELETE /projects/:id` - Eliminar proyecto.
  - `GET /projects/:id` - Obtener el detalle de un proyecto específico junto con sus tareas vinculadas.

- **Tareas:**
  - `GET /tasks/:projectId` - Obtener lista de tareas vinculadas al proyecto.
  - `POST /tasks/:projectId` - Crear una tarea dentro de un proyecto (`title`, `description`).
  - `PATCH /tasks/:projectId` - Actualizar una tarea enviando el `id` en el cuerpo.
  - `PATCH /tasks/:projectId/complete` - Marcar tarea como completada.
  - `PATCH /tasks/:projectId/pending` - Marcar tarea como pendiente.
  - `DELETE /tasks/:projectId` - Eliminar tarea enviando el `id` en el cuerpo.

---

## 📄 Licencia

Este proyecto está distribuido bajo licencia privada con fines académicos y de evaluación técnica para el módulo de React.
