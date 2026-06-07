/*
  Warnings:

  - The `rol` column on the `Usuario` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "rol",
ADD COLUMN     "rol" "Rol" NOT NULL DEFAULT 'USER';
