/*
  Warnings:

  - You are about to drop the column `email` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `confirm_password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `sex` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Email` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Age` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Sex` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."User_email_key";

-- DropIndex
DROP INDEX "public"."User_username_key";

-- AlterTable
ALTER TABLE "public"."Block" DROP COLUMN "email",
ADD COLUMN     "Email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "age",
DROP COLUMN "confirm_password",
DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "sex",
DROP COLUMN "username",
ADD COLUMN     "Age" INTEGER NOT NULL,
ADD COLUMN     "Confirm_password" TEXT,
ADD COLUMN     "Email" TEXT NOT NULL,
ADD COLUMN     "Password" TEXT NOT NULL,
ADD COLUMN     "Sex" TEXT NOT NULL,
ADD COLUMN     "Username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_Username_key" ON "public"."User"("Username");

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "public"."User"("Email");
