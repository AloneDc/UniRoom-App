

# 🏠 UniRoom – Plataforma de Alojamiento Estudiantil

UniRoom es una plataforma web moderna diseñada para conectar estudiantes universitarios con arrendadores de manera rápida, segura y eficiente.  
Permite publicar habitaciones, gestionar reservas, explorar alojamientos disponibles y administrar perfiles de usuario con una interfaz intuitiva y responsiva.


## ✨ Características principales

### 👤 Gestión de usuarios
- Registro e inicio de sesión con **Supabase Auth**
- Roles disponibles: **Estudiante** y **Arrendador**
- Perfil personal editable
- Fotografía de usuario y datos de contacto

### 🏘️ Gestión de habitaciones
- Publicación de habitaciones por arrendadores
- Carga de fotos mediante Supabase Storage
- Precio, ubicación, servicios y tipo de habitación
- Disponibilidad en tiempo real

### 🔎 Búsqueda inteligente
- Filtros por ubicación, precio y tipo de habitación
- Habitaciones destacadas
- Página individual con detalles completos

### 📆 Sistema de reservas
- Estudiantes pueden realizar reservas
- Arrendadores pueden gestionar sus solicitudes
- Estados: *pending*, *confirmed*, *cancelled*

### ⭐ Reseñas y calificaciones
- Calificación de habitaciones con puntaje de 1 a 5
- Comentarios públicos

### 🎨 Diseño UI/UX moderno
- Diseño completamente responsivo
- Animaciones con **Framer Motion**
- Estilo visual con **TailwindCSS**


## 🧰 Tecnologías utilizadas

| Tecnología | Propósito |
|-----------|-----------|
| **Next.js 14 (App Router)** | Frontend y SSR |
| **React 18** | Componentización |
| **TypeScript** | Tipado estático |
| **Supabase (Auth, DB, Storage)** | Backend completo |
| **PostgreSQL** | Base de datos |
| **TailwindCSS** | Estilos responsivos |
| **Framer Motion** | Animaciones |
| **Lucide Icons** | Iconos del proyecto |

---

## 📂 Estructura del proyecto

```bash
src/
 ├── app/                     # Rutas del App Router
 │   ├── (auth)/              # Login y registro
 │   ├── (main)/              # Páginas principales
 │   ├── layout.tsx           # Layout global
 │   └── page.tsx             # Homepage
 ├── presentation/
 │   ├── components/          # Componentes reutilizables
 │   ├── context/             # AuthContext, Providers
 │   └── ui/                  # Elementos UI
 ├── infrastructure/
 │   ├── supabase/            # Cliente Supabase
 │   ├── storage/             # Servicios de archivos
 │   └── api/                 # Servicios externos
 ├── domain/
 │   ├── services/            # RoomService, AuthService
 │   └── models/              # Entidades y tipos
 ├── shared/
 │   ├── validations/         # Schemas Zod
 │   └── types/               # Tipos globales
 ├── styles/
 │   └── globals.css
````

---

## 🗄️ Base de datos (Supabase)

### Tablas principales:

* `users` → perfiles (student / landlord)
* `rooms` → habitaciones publicadas
* `room_photos` → fotos de habitaciones
* `reservations` → reservas por estudiantes
* `reviews` → calificaciones y comentarios
* `support_messages` → soporte al usuario

Base de datos: **PostgreSQL**
Backend: **Supabase**
Storage: **Supabase Storage**


## 📜 Licencia

Proyecto distribuido bajo licencia **MIT**.



