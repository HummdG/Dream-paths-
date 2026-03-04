-- CreateTable
CREATE TABLE "path_subscriptions" (
    "id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "path_id" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "stripe_subscription_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "path_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "path_subscriptions_stripe_subscription_id_key" ON "path_subscriptions"("stripe_subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "path_subscriptions_parent_id_path_id_key" ON "path_subscriptions"("parent_id", "path_id");

-- AddForeignKey
ALTER TABLE "path_subscriptions" ADD CONSTRAINT "path_subscriptions_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
