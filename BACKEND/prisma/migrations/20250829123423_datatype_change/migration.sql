/*
  Warnings:

  - A unique constraint covering the columns `[Email]` on the table `Block` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."User_Username_key";

-- CreateIndex
CREATE UNIQUE INDEX "Block_Email_key" ON "public"."Block"("Email");
