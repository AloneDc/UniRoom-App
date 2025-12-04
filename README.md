🏠 UniRoom – Plataforma de Alojamiento Estudiantil

Plataforma web moderna diseñada para conectar estudiantes universitarios con arrendadores de manera rápida, segura y eficiente.
Los usuarios pueden registrarse, publicar habitaciones, realizar reservas, explorar alojamiento disponible y gestionar su perfil desde un panel intuitivo y responsivo.

✨ Características principales
👤 Gestión de usuarios

Registro e inicio de sesión con Supabase Auth

Roles: Estudiante y Arrendador

Perfil personal editable

Fotografía de usuario y datos de contacto

🏘️ Gestión de habitaciones

Publicación de habitaciones por arrendadores

Carga de fotos mediante Supabase Storage

Precio, ubicación, servicios y tipo de habitación

Disponibilidad y estado actualizado

🔎 Búsqueda inteligente

Filtros por ubicación, precio y tipo de habitación

Listado de habitaciones destacadas

Página individual con detalles de cada propiedad

📆 Sistema de reservas

Estudiantes pueden reservar habitaciones

Arrendadores gestionan las reservas recibidas

Estado de reserva: pending, confirmed, cancelled

⭐ Reseñas y calificaciones

Cada habitación puede recibir reseñas

Calificación de 1 a 5 estrellas

Comentarios visibles para otros usuarios

🎨 Diseño UI/UX moderno

Totalmente responsivo

Animaciones con Framer Motion

Estilo limpio y profesional con TailwindCSS

🧰 Tecnologías utilizadas
Tecnología	Uso
Next.js 14 (App Router)	Frontend + lógica server-side
React 18	Componentes y estado
TypeScript	Tipado estático y seguridad
Supabase (Auth, Database, Storage)	Backend completo
PostgreSQL	Base de datos
TailwindCSS	Estilos modernos y responsivos
Framer Motion	Animaciones fluidas
Lucide Icons	Iconografía moderna
📂 Estructura del proyecto
src/
 ├── app/                     # Rutas del App Router
 │   ├── (auth)/              # Login, registro
 │   ├── (main)/              # Paginas principales
 │   ├── layout.tsx           # Layout general
 │   └── page.tsx             # Página Home
 ├── presentation/
 │   ├── components/          # Componentes reutilizables
 │   ├── context/             # AuthContext, Providers
 │   └── ui/                  # Elementos UI
 ├── infrastructure/
 │   ├── supabase/            # Cliente de Supabase
 │   ├── storage/             # Servicios de almacenamiento
 │   └── api/                 # Servicios externos
 ├── domain/
 │   ├── services/            # Lógica de negocio (RoomService, AuthService...)
 │   └── models/              # Tipos y entidades
 ├── shared/
 │   ├── validations/         # Schemas Zod
 │   └── types/               # Tipos globales
 ├── styles/
 │   └── globals.css

🗄️ Diseño de Base de Datos

Tablas principales:

users → perfiles de usuarios (student / landlord)

rooms → habitaciones publicadas

room_photos → imágenes de cada habitación

reservations → reservas de estudiantes

reviews → calificaciones y comentarios

support_messages → mensajes al equipo de soporte

Motor: PostgreSQL (Supabase)
Autenticación: Supabase Auth
Almacenamiento: Supabase Storage

🔧 Instalación y configuración
1️⃣ Clona el repositorio
git clone https://github.com/tuusuario/uniroom.git
cd uniroom

2️⃣ Instala dependencias
npm install

3️⃣ Configura las variables de entorno

Crea un archivo .env.local con:

NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=solo_si_usas_backend
NEXT_PUBLIC_SITE_URL=http://localhost:3000

4️⃣ Ejecuta el proyecto
npm run dev

5️⃣ Abre en el navegador

👉 http://localhost:3000

📸 Capturas (ajusta las rutas si deseas)

Puedes subir tus imágenes a /public/screenshots/

![Home Screenshot](public/screenshots/home.png)
![Room Detail Screenshot](public/screenshots/room-detail.png)
![Dashboard Screenshot](public/screenshots/dashboard.png)
