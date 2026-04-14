/*
  Warnings:

  - You are about to drop the column `Thumbnail` on the `blogs` table. All the data in the column will be lost.
  - Added the required column `thumbnail` to the `blogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "Thumbnail",
ADD COLUMN     "thumbnail" TEXT NOT NULL;
