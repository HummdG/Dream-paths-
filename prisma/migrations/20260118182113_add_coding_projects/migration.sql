-- CreateEnum
CREATE TYPE "StepStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "SnapshotTrigger" AS ENUM ('AUTO_SAVE', 'MANUAL_SAVE', 'RUN_CODE', 'STEP_COMPLETE', 'STEP_START');

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "pack_id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My Game',
    "current_mission_id" TEXT NOT NULL,
    "current_step_id" TEXT NOT NULL,
    "game_config_json" JSONB NOT NULL,
    "total_stars" INTEGER NOT NULL DEFAULT 0,
    "badges_json" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "step_progress" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "step_id" TEXT NOT NULL,
    "current_code" TEXT NOT NULL,
    "status" "StepStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "stars_earned" INTEGER NOT NULL DEFAULT 0,
    "run_count" INTEGER NOT NULL DEFAULT 0,
    "hint_views" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "step_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "code_snapshots" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "step_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "trigger_type" "SnapshotTrigger" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "projects_child_id_idx" ON "projects"("child_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_child_id_pack_id_key" ON "projects"("child_id", "pack_id");

-- CreateIndex
CREATE INDEX "step_progress_project_id_idx" ON "step_progress"("project_id");

-- CreateIndex
CREATE INDEX "step_progress_mission_id_idx" ON "step_progress"("mission_id");

-- CreateIndex
CREATE UNIQUE INDEX "step_progress_project_id_step_id_key" ON "step_progress"("project_id", "step_id");

-- CreateIndex
CREATE INDEX "code_snapshots_project_id_step_id_idx" ON "code_snapshots"("project_id", "step_id");

-- CreateIndex
CREATE INDEX "code_snapshots_created_at_idx" ON "code_snapshots"("created_at");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_progress" ADD CONSTRAINT "step_progress_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_snapshots" ADD CONSTRAINT "code_snapshots_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
