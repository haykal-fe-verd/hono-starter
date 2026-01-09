/*
  Warnings:

  - You are about to drop the column `remember_token` on the `tb_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tb_user" DROP COLUMN "remember_token";
