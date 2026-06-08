# Kahu — API Endpoints

## Base URLs
- **Node:** `http://localhost:3001`
- **FastAPI:** `http://localhost:8000`

🔒 = Requiere `Authorization: Bearer <token>`

---

## Auth

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/api/auth/register` | 🌐 | Registrar nuevo usuario |
| POST | `/api/auth/login` | 🌐 | Iniciar sesión |
| GET | `/api/auth/me` | 🔒 | Obtener usuario autenticado |

---

## Mascotas

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/mascotas` | 🔒 | Obtener mascotas del usuario |
| GET | `/api/mascotas/:id` | 🔒 | Obtener mascota por ID |
| POST | `/api/mascotas` | 🔒 | Crear nueva mascota |
| PUT | `/api/mascotas/:id` | 🔒 | Actualizar mascota |
| DELETE | `/api/mascotas/:id` | 🔒 | Eliminar mascota |

---

## Planes Nutricionales

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/planes/:mascotaId` | 🔒 | Obtener planes de una mascota |
| POST | `/api/planes` | 🔒 | Crear plan (llamado por el agente IA) |
| DELETE | `/api/planes/:id` | 🔒 | Eliminar plan |

---

## Historial Veterinario

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/historial-vet/:mascotaId` | 🔒 | Obtener historial de una mascota |
| POST | `/api/historial-vet` | 🔒 | Crear registro (llamado por el agente IA) |
| DELETE | `/api/historial-vet/:id` | 🔒 | Eliminar registro |

---

## Chat Historial

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/chat/:mascotaId` | 🔒 | Obtener historial de chat |
| POST | `/api/chat` | 🔒 | Guardar mensaje en historial |

---

## Agente IA (FastAPI)

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/api/chat` | 🌐 | Enviar mensaje al agente IA |
| GET | `/api/chat/history/:mascotaId` | 🌐 | Proxy al historial de Node |
| GET | `/health` | 🌐 | Health check del servicio IA |

---

## Usuarios de prueba

| Nombre | Email | Password | Rol |
|--------|-------|----------|-----|
| KahuAdmin | admin@kahu.com | admin123 | ADMIN |
| Patricia | patricia@test.com | test123 | USER |
| Carlos | carlos@test.com | test123 | USER |
| Ana | ana@test.com | test123 | USER |
| Miguel | miguel@test.com | test123 | USER |
| Sara | sara@test.com | test123 | USER |

## Mascotas de prueba

| ID | Nombre | Raza | Dueño |
|----|--------|------|-------|
| seed-mascota-0001 | Luna | Border Collie | Patricia |
| seed-mascota-0002 | Rocky | Labrador | Carlos |
| seed-mascota-0003 | Nala | Golden Retriever | Ana |
| seed-mascota-0004 | Thor | Pastor Alemán | Miguel |
| seed-mascota-0005 | Mia | Beagle | Sara |