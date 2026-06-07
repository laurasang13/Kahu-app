const { PrismaClient, Rol } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Admin
  const adminHash = await bcrypt.hash('admin123', 10)
  const admin = await prisma.usuario.upsert({
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

  // Usuario de prueba
  const userHash = await bcrypt.hash('test123', 10)
  const usuario = await prisma.usuario.upsert({
    where: { email: 'patricia@test.com' },
    update: {},
    create: {
      nombre: 'Patricia',
      email: 'patricia@test.com',
      password_hash: userHash,
      ciudad: 'Las Palmas',
      rol: Rol.USER
    }
  })

  // Mascota de prueba
  const mascota = await prisma.mascota.upsert({
    where: { id: 'seed-mascota-0001' },
    update: {},
    create: {
      id: 'seed-mascota-0001',
      usuario_id: usuario.id,
      nombre: 'Luna',
      raza: 'Border Collie',
      peso_kg: 10,
      edad_meses: 36,
      sexo: 'hembra',
      alergias: 'ninguna'
    }
  })

  console.log('✅ Seed completado:', { admin, usuario, mascota })
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())