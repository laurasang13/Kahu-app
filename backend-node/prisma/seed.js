const { PrismaClient, Rol } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Admin
  const adminHash = await bcrypt.hash('admin123', 10)
  await prisma.usuario.upsert({
    where: { email: 'admin@kahu.com' },
    update: { rol: Rol.ADMIN },
    create: {
      nombre: 'KahuAdmin',
      email: 'admin@kahu.com',
      password_hash: adminHash,
      ciudad: 'Las Palmas',
      rol: Rol.ADMIN
    }
  })

  // Usuarios de prueba
  const usuarios = [
    { nombre: 'Patricia', email: 'patricia@test.com', ciudad: 'Las Palmas', password: 'test123' },
    { nombre: 'Carlos', email: 'carlos@test.com', ciudad: 'Madrid', password: 'test123' },
    { nombre: 'Ana', email: 'ana@test.com', ciudad: 'Barcelona', password: 'test123' },
    { nombre: 'Miguel', email: 'miguel@test.com', ciudad: 'Sevilla', password: 'test123' },
    { nombre: 'Sara', email: 'sara@test.com', ciudad: 'Valencia', password: 'test123' },
  ]

  const createdUsuarios = []
  for (const u of usuarios) {
    const hash = await bcrypt.hash(u.password, 10)
    const usuario = await prisma.usuario.upsert({
      where: { email: u.email },
      update: {},
      create: {
        nombre: u.nombre,
        email: u.email,
        password_hash: hash,
        ciudad: u.ciudad,
        rol: Rol.USER
      }
    })
    createdUsuarios.push(usuario)
  }

  // Mascotas de prueba
  const mascotas = [
    { id: 'seed-mascota-0001', usuario_email: 'patricia@test.com', nombre: 'Luna', raza: 'Border Collie', peso_kg: 10, edad_meses: 36, sexo: 'hembra', alergias: 'ninguna' },
    { id: 'seed-mascota-0002', usuario_email: 'carlos@test.com', nombre: 'Rocky', raza: 'Labrador', peso_kg: 30, edad_meses: 24, sexo: 'macho', alergias: 'pollo' },
    { id: 'seed-mascota-0003', usuario_email: 'ana@test.com', nombre: 'Nala', raza: 'Golden Retriever', peso_kg: 25, edad_meses: 18, sexo: 'hembra', alergias: 'ninguna' },
    { id: 'seed-mascota-0004', usuario_email: 'miguel@test.com', nombre: 'Thor', raza: 'Pastor Alemán', peso_kg: 35, edad_meses: 48, sexo: 'macho', alergias: 'cereales' },
    { id: 'seed-mascota-0005', usuario_email: 'sara@test.com', nombre: 'Mia', raza: 'Beagle', peso_kg: 12, edad_meses: 8, sexo: 'hembra', alergias: 'ninguna' },
  ]

  for (const m of mascotas) {
    const usuario = createdUsuarios.find(u => u.email === m.usuario_email)
    await prisma.mascota.upsert({
      where: { id: m.id },
      update: {},
      create: {
        id: m.id,
        usuario_id: usuario.id,
        nombre: m.nombre,
        raza: m.raza,
        peso_kg: m.peso_kg,
        edad_meses: m.edad_meses,
        sexo: m.sexo,
        alergias: m.alergias
      }
    })
  }

  console.log('✅ Seed completado con 1 admin, 5 usuarios y 5 mascotas')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())