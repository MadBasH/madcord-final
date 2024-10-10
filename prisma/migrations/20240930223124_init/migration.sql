/*
  Warnings:

  - You are about to drop the column `updated` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_serverId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_serverId_fkey";

-- DropForeignKey
ALTER TABLE "Server" DROP CONSTRAINT "Server_profileId_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "updated",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
