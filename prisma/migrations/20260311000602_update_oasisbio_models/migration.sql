/*
  Warnings:

  - You are about to drop the `dcos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `references` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `worlds` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `isPreset` on the `abilities` table. All the data in the column will be lost.
  - You are about to drop the column `birthday` on the `oasis_bios` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `oasis_bios` table. All the data in the column will be lost.
  - Added the required column `category` to the `abilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `oasis_bios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `oasis_bios` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "dcos";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "references";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "worlds";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "era_identities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "oasis_bio_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eraType" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "description" TEXT,
    CONSTRAINT "era_identities_oasis_bio_id_fkey" FOREIGN KEY ("oasis_bio_id") REFERENCES "oasis_bios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dcos_files" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "oasis_bio_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "folder" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "dcos_files_oasis_bio_id_fkey" FOREIGN KEY ("oasis_bio_id") REFERENCES "oasis_bios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reference_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "oasis_bio_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT NOT NULL,
    CONSTRAINT "reference_items_oasis_bio_id_fkey" FOREIGN KEY ("oasis_bio_id") REFERENCES "oasis_bios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "world_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "oasis_bio_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "timeline" TEXT,
    "rules" TEXT,
    "factions" TEXT,
    CONSTRAINT "world_items_oasis_bio_id_fkey" FOREIGN KEY ("oasis_bio_id") REFERENCES "oasis_bios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "model_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "oasis_bio_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "objUrl" TEXT NOT NULL,
    "mtlUrl" TEXT,
    "previewImage" TEXT,
    "relatedWorldId" TEXT,
    "relatedEraId" TEXT,
    CONSTRAINT "model_items_oasis_bio_id_fkey" FOREIGN KEY ("oasis_bio_id") REFERENCES "oasis_bios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_abilities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "oasis_bio_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'custom',
    "level" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "relatedWorldId" TEXT,
    "relatedEraId" TEXT,
    CONSTRAINT "abilities_oasis_bio_id_fkey" FOREIGN KEY ("oasis_bio_id") REFERENCES "oasis_bios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_abilities" ("id", "level", "name", "oasis_bio_id") SELECT "id", "level", "name", "oasis_bio_id" FROM "abilities";
DROP TABLE "abilities";
ALTER TABLE "new_abilities" RENAME TO "abilities";
CREATE TABLE "new_oasis_bios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tagline" TEXT,
    "identityMode" TEXT NOT NULL DEFAULT 'real',
    "birthDate" DATETIME,
    "gender" TEXT,
    "pronouns" TEXT,
    "placeOfOrigin" TEXT,
    "currentEra" TEXT,
    "species" TEXT,
    "status" TEXT,
    "description" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "oasis_bios_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_oasis_bios" ("createdAt", "gender", "id", "updatedAt", "user_id") SELECT "createdAt", "gender", "id", "updatedAt", "user_id" FROM "oasis_bios";
DROP TABLE "oasis_bios";
ALTER TABLE "new_oasis_bios" RENAME TO "oasis_bios";
CREATE UNIQUE INDEX "oasis_bios_slug_key" ON "oasis_bios"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
