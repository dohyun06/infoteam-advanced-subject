/*
  Warnings:

  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryName` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `Post` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_UserSubscription` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Post` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_categoryName_fkey";

-- DropForeignKey
ALTER TABLE "_UserSubscription" DROP CONSTRAINT "_UserSubscription_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserSubscription" DROP CONSTRAINT "_UserSubscription_B_fkey";

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
DROP COLUMN "categoryName",
DROP COLUMN "uuid",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "uuid",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "_UserSubscription";

-- CreateTable
CREATE TABLE "UserSubscription" (
    "userId" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("userId","categoryId")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
