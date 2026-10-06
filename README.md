# ⚡ TTaskFlow - Gestión de Proyectos y Tareas

Interfaz web moderna y de alto rendimiento desarrollada como evaluación final del módulo para la administración ágil de proyectos y sus tareas correspondientes en entornos de equipo.

Construida con React 19, TypeScript, Vite 8 y Tailwind CSS v4, utilizando componentes accesibles y una arquitectura organizada por responsabilidades.

🚀 Características Principales

🔐 Autenticación & Autorización

Registro de usuarios e inicio de sesión.

Gestión de sesión mediante tokens JWT con persistencia en LocalStorage.

Rutas públicas y rutas protegidas mediante ProtectedRoute.

Cierre de sesión con limpieza del estado global.

📁 Gestión Completa de Proyectos

Creación rápida de proyectos mediante un panel lateral interactivo.

Validación de datos del formulario.

Listado dinámico de proyectos asociados al usuario autenticado.

Selección interactiva para cambiar el espacio de trabajo en tiempo real.

Edición y eliminación de proyectos.

📋 Gestión Completa de Tareas por Proyecto

Creación de tareas vinculadas al proyecto activo.

Edición del título y descripción mediante modales.

Cambio de estado mediante peticiones asíncronas hacia la API:

Pendiente → Completada.

Completada → Pendiente.

Eliminación individual de tareas.

Listado de tareas correspondiente al proyecto seleccionado.

📊 Métricas & Feedback Visual

Tarjetas de resumen con:

Total de tareas.

Tareas completadas.

Tareas pendientes.

Métricas calculadas dinámicamente por proyecto.

Notificaciones Toast con Sonner.

Indicadores de carga mediante Skeletons.

Estados vacíos (Empty State).

Estados de error con posibilidad de reintentar manualmente.

🛠️ Stack Tecnológico

Tecnología

Rol / Descripción

React 19

Biblioteca principal para construir la interfaz.

TypeScript

Tipado estático y autocompletado en toda la aplicación.

Vite 8

Entorno de desarrollo y empaquetador para producción.

Tailwind CSS v4

Sistema de estilos basado en utilidades.

React Router DOM v7

Enrutamiento del lado del cliente para la SPA.

Lucide React

Iconografía vectorial para la interfaz.

Sonner

Sistema de Toasts y notificaciones.

@base-ui/react

Primitivas accesibles para componentes de interfaz.

📁 Estructura del Proyecto

taskflow-front/
├── src/
│   ├── assets/                 # Recursos estáticos, imágenes y SVG
│   ├── components/             # Componentes reutilizables
│   │   ├── common/             # Componentes comunes, como ProtectedRoute
│   │   ├── tasks/              # Componentes relacionados con tareas
│   │   └── ui/                 # Componentes UI reutilizables
│   ├── context/                # Contextos globales de la aplicación
│   │   ├── AuthContext.tsx
│   │   └── ProjectProvider.tsx
│   ├── hooks/                  # Custom Hooks
│   │   ├── useAuth.ts
│   │   └── useProjects.ts
│   ├── layouts/                # Layouts compartidos
│   │   └── MainLayout.tsx
│   ├── lib/                    # Utilidades y constantes
│   ├── pages/                  # Vistas principales
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── DashboardPage.tsx
│   ├── services/               # Capa de consumo de API REST
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── project.service.ts
│   │   └── task.service.ts
│   ├── App.tsx                 # Configuración principal de rutas/providers
│   └── main.tsx                # Punto de entrada
├── .env.example
├── .gitignore
├── package.json
└── README.md

⚙️ Configuración del Entorno

1. Clonar el repositorio

git clone https://github.com/JCAYOJA/taskflow-front.git
cd taskflow-front

2. Instalar dependencias

npm install

3. Configurar variables de entorno

Copia la plantilla:

cp .env.example .env

En Windows PowerShell también puedes utilizar:

Copy-Item .env.example .env

Configura el archivo .env según tu entorno:

Variable

Descripción

Valor por defecto

VITE_API_URL

URL base de la API REST

http://localhost:3000

VITE_TOKEN_KEY

Clave utilizada para almacenar el JWT en localStorage

taskflow_token

VITE_APP_NAME

Nombre visible de la aplicación

TaskFlow

Importante: no subas el archivo .env al repositorio. Las variables sensibles deben permanecer fuera del control de versiones.

💻 Instalación y Ejecución

Desarrollo

Inicia el servidor de desarrollo:

npm run dev

La aplicación estará disponible normalmente en:

http://localhost:5173

Compilar para producción

npm run build

El resultado se generará en:

dist/

Previsualizar el build

npm run preview

Ejecutar el linter

npm run lint

🔗 Backend

El frontend consume la API proporcionada para el proyecto:

Repositorio del backend:

https://github.com/JCAYOJA/taskflow-api

La aplicación requiere que el backend esté ejecutándose y que VITE_API_URL apunte a la URL correspondiente.

🔌 Endpoints Consumidos

Autenticación

Método

Endpoint

Descripción

POST

/auth/register

Registro de usuario.

POST

/auth/login

Inicio de sesión y obtención del JWT.

GET

/auth/me

Obtención del usuario autenticado.

Las solicitudes autenticadas utilizan:

Authorization: Bearer <token>

Proyectos

Método

Endpoint

Descripción

GET

/projects

Obtener proyectos del usuario autenticado.

POST

/projects

Crear un proyecto.

PUT

/projects/:id

Actualizar un proyecto.

DELETE

/projects/:id

Eliminar un proyecto.

GET

/projects/:id

Obtener el detalle de un proyecto.

Tareas

Método

Endpoint

Descripción

GET

/tasks/:projectId

Obtener tareas del proyecto.

POST

/tasks/:projectId

Crear una tarea.

PATCH

/tasks/:projectId

Actualizar una tarea.

PATCH

/tasks/:projectId/complete

Marcar una tarea como completada.

PATCH

/tasks/:projectId/pending

Marcar una tarea como pendiente.

DELETE

/tasks/:projectId

Eliminar una tarea.

🎯 Conceptos de React Aplicados

El proyecto aplica los principales conceptos trabajados durante el módulo:

Componentes funcionales.

Props.

useState.

useEffect.

Context API.

Custom Hooks.

Formularios.

Consumo de APIs REST.

Renderizado condicional.

Estados de carga.

Manejo de errores.

Rutas públicas y protegidas.

Persistencia del JWT.

Separación de responsabilidades mediante servicios.

📚 Proyecto Base

El proyecto parte del proyecto base trabajado durante el módulo:

https://github.com/javieronishi/taskflow-front

El backend utilizado para la aplicación es:

https://github.com/JCAYOJA/taskflow-api

👨‍💻 Autor

JHONNY CAYOJA

Proyecto desarrollado como evaluación final del módulo de React.