-- CreateTable
CREATE TABLE "opportunities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "valid_from" DATE NOT NULL,
    "valid_until" DATE NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "registration_link" TEXT,
    "contact" TEXT,
    "contact_people" TEXT,
    "created_by_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "opportunities_valid_until" ON "opportunities"("valid_until");

-- CreateIndex
CREATE INDEX "opportunities_created_at" ON "opportunities"("created_at");

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_created_by_id_members_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
