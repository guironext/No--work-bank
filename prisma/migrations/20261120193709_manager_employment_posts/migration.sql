-- CreateTable
CREATE TABLE "manager_employment_posts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "manager_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "offer_date" DATE NOT NULL,
    "description" TEXT NOT NULL,
    "mission" TEXT,
    "profile" TEXT,
    "level" TEXT,
    "workplace" TEXT,
    "experience" TEXT,
    "salary" TEXT,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "manager_employment_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "manager_employment_posts_manager_created" ON "manager_employment_posts"("manager_id", "created_at");

-- AddForeignKey
ALTER TABLE "manager_employment_posts" ADD CONSTRAINT "manager_employment_posts_manager_id_members_id_fk" FOREIGN KEY ("manager_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
