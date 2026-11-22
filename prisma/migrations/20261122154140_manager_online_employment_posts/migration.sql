-- CreateTable
CREATE TABLE "manager_online_employment_posts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "manager_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "registration_link" TEXT,
    "contact" TEXT,
    "validated_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "manager_online_employment_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "manager_online_employment_posts_manager_created" ON "manager_online_employment_posts"("manager_id", "created_at");

-- AddForeignKey
ALTER TABLE "manager_online_employment_posts" ADD CONSTRAINT "manager_online_employment_posts_manager_id_members_id_fk" FOREIGN KEY ("manager_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
