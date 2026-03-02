-- CreateEnum
CREATE TYPE "SpriteType" AS ENUM ('OBSTACLE', 'ENEMY', 'ITEM', 'DECORATION');

-- CreateTable
CREATE TABLE "user_sprites" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "type" "SpriteType" NOT NULL,
    "name" TEXT NOT NULL,
    "pixel_data" JSONB NOT NULL,
    "behavior" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sprites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_levels" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "grid_data" JSONB NOT NULL,
    "objects" JSONB NOT NULL,
    "settings" JSONB NOT NULL,
    "thumbnail" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_projects" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My Game',
    "hero_id" TEXT,
    "level_ids" JSONB NOT NULL DEFAULT '[]',
    "sprite_ids" JSONB NOT NULL DEFAULT '[]',
    "settings" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_sprites_child_id_idx" ON "user_sprites"("child_id");

-- CreateIndex
CREATE INDEX "user_sprites_type_idx" ON "user_sprites"("type");

-- CreateIndex
CREATE INDEX "user_levels_child_id_idx" ON "user_levels"("child_id");

-- CreateIndex
CREATE INDEX "user_levels_theme_idx" ON "user_levels"("theme");

-- CreateIndex
CREATE INDEX "game_projects_child_id_idx" ON "game_projects"("child_id");

-- AddForeignKey
ALTER TABLE "user_sprites" ADD CONSTRAINT "user_sprites_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_levels" ADD CONSTRAINT "user_levels_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_projects" ADD CONSTRAINT "game_projects_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;
