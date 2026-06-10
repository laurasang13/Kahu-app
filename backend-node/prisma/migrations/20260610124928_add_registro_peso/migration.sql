-- CreateTable
CREATE TABLE "RegistroPeso" (
    "id" TEXT NOT NULL,
    "mascota_id" TEXT NOT NULL,
    "peso_kg" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistroPeso_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RegistroPeso" ADD CONSTRAINT "RegistroPeso_mascota_id_fkey" FOREIGN KEY ("mascota_id") REFERENCES "Mascota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
