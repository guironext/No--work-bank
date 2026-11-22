-- CreateTable
CREATE TABLE "manager_company_listings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "manager_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "website" TEXT,
    "contact" TEXT,
    "validated_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "manager_company_listings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "manager_company_listings_manager_created" ON "manager_company_listings"("manager_id", "created_at");

-- AddForeignKey
ALTER TABLE "manager_company_listings" ADD CONSTRAINT "manager_company_listings_manager_id_members_id_fk" FOREIGN KEY ("manager_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
