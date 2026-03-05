-- CreateTable
CREATE TABLE "parent_access_pins" (
    "id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "pin_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parent_access_pins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "parent_access_pins_parent_id_idx" ON "parent_access_pins"("parent_id");

-- AddForeignKey
ALTER TABLE "parent_access_pins" ADD CONSTRAINT "parent_access_pins_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
