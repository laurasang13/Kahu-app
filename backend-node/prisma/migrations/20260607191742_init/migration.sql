-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "ciudad" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mascota" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "raza" TEXT NOT NULL,
    "peso_kg" DOUBLE PRECISION NOT NULL,
    "edad_meses" INTEGER NOT NULL,
    "sexo" TEXT NOT NULL,
    "alergias" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mascota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanNutricional" (
    "id" TEXT NOT NULL,
    "mascota_id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "ingredientes" TEXT NOT NULL,
    "proporciones" TEXT NOT NULL,
    "calorias_total" DOUBLE PRECISION NOT NULL,
    "notas_ia" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanNutricional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialVeterinario" (
    "id" TEXT NOT NULL,
    "mascota_id" TEXT NOT NULL,
    "fecha_visita" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tratamiento" TEXT NOT NULL,
    "proxima_cita" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistorialVeterinario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatHistorial" (
    "id" TEXT NOT NULL,
    "mascota_id" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatHistorial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Mascota" ADD CONSTRAINT "Mascota_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanNutricional" ADD CONSTRAINT "PlanNutricional_mascota_id_fkey" FOREIGN KEY ("mascota_id") REFERENCES "Mascota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialVeterinario" ADD CONSTRAINT "HistorialVeterinario_mascota_id_fkey" FOREIGN KEY ("mascota_id") REFERENCES "Mascota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatHistorial" ADD CONSTRAINT "ChatHistorial_mascota_id_fkey" FOREIGN KEY ("mascota_id") REFERENCES "Mascota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
