¡Perfecto! Aquí tienes el **README.md EXACTO en formato Markdown puro**, listo para pegar directamente en un archivo `README.md` sin modificar nada más.

---

````md
# 🏠 UniRoom – Plataforma de Alojamiento Estudiantil

UniRoom es una plataforma web moderna diseñada para conectar estudiantes universitarios con arrendadores de manera rápida, segura y eficiente.  
Permite publicar habitaciones, gestionar reservas, explorar alojamientos disponibles y administrar perfiles de usuario con una interfaz intuitiva y responsiva.

---

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

---

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

---

## 🔧 Instalación y configuración

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tuusuario/uniroom.git
cd uniroom
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar variables de entorno

Crear `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
SUPABASE_SERVICE_ROLE_KEY=opcional
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4️⃣ Ejecutar el proyecto

```bash
npm run dev
```

Abrir en el navegador:
👉 [http://localhost:3000](http://localhost:3000)

---

## 📸 Capturas (opcional)

Agrega tus capturas en `/public/screenshots/`:

```md
![Home Screenshot](public/screenshots/home.png)
![Room Detail](public/screenshots/room-detail.png)
![Dashboard](public/screenshots/dashboard.png)
```

---

## 🚀 Roadmap

* [ ] Chat en tiempo real entre usuarios
* [ ] Google Maps API para ubicación
* [ ] Filtros avanzados por servicios
* [ ] Panel administrativo global
* [ ] App móvil con React Native
* [ ] Mejoras SEO y Lighthouse

---

## 📜 Licencia

Proyecto distribuido bajo licencia **MIT**.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas.
Puedes abrir un **issue** o un **pull request**.

---

## 💼 Autor

**Eduardo Calderón**
Desarrollador Web – Piura, Perú
Apasionado por tecnologías modernas y plataformas inteligentes.

```

---

Si quieres, te hago también:

✅ Badges para el README  
✅ Un banner gráfico de presentación  
✅ Un logo SVG profesional para UniRoom  
¿Quieres agregar algo visual?
```
