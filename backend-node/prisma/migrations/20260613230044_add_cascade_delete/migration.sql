-- DropForeignKey
ALTER TABLE "ChatHistorial" DROP CONSTRAINT "ChatHistorial_mascota_id_fkey";

-- DropForeignKey
ALTER TABLE "HistorialVeterinario" DROP CONSTRAINT "HistorialVeterinario_mascota_id_fkey";

-- DropForeignKey
ALTER TABLE "PlanNutricional" DROP CONSTRAINT "PlanNutricional_mascota_id_fkey";

-- DropForeignKey
ALTER TABLE "RegistroPeso" DROP CONSTRAINT "RegistroPeso_mascota_id_fkey";

-- DropForeignKey
ALTER TABLE "Tratamiento" DROP CONSTRAINT "Tratamiento_mascota_id_fkey";

-- AddForeignKey
ALTER TABLE "PlanNutricional" ADD CONSTRAINT "PlanNutricional_mascota_id_fkey" FOREIGN KEY ("mascota_id") REFERENCES "Mascota"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialVeterinario" ADD CONSTRAINT "HistorialVeterinario_mascota_id_fkey" FOREIGN KEY ("mascota_id") REFERENCES "Mascota"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatHistorial" ADD CONSTRAINT "ChatHistorial_mascota_id_fkey" FOREIGN KEY ("mascota_id") REFERENCES "Mascota"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroPeso" ADD CONSTRAINT "RegistroPeso_mascota_id_fkey" FOREIGN KEY ("mascota_id") REFERENCES "Mascota"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tratamiento" ADD CONSTRAINT "Tratamiento_mascota_id_fkey" FOREIGN KEY ("mascota_id") REFERENCES "Mascota"("id") ON DELETE CASCADE ON UPDATE CASCADE;
