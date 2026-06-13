-- CreateTable
CREATE TABLE "Tratamiento" (
    "id" TEXT NOT NULL,
    "mascota_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "frecuencia_dias" INTEGER NOT NULL,
    "ultima_dosis" TIMESTAMP(3),
    "proxima_dosis" TIMESTAMP(3),
    "notas" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tratamiento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tratamiento" ADD CONSTRAINT "Tratamiento_mascota_id_fkey" FOREIGN KEY ("mascota_id") REFERENCES "Mascota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
