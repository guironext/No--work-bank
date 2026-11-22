/*
  Warnings:

  - Made the column `mission` on table `manager_employment_posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `profile` on table `manager_employment_posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `level` on table `manager_employment_posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `workplace` on table `manager_employment_posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `experience` on table `manager_employment_posts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "manager_employment_posts" ALTER COLUMN "mission" SET NOT NULL,
ALTER COLUMN "profile" SET NOT NULL,
ALTER COLUMN "level" SET NOT NULL,
ALTER COLUMN "workplace" SET NOT NULL,
ALTER COLUMN "experience" SET NOT NULL;
