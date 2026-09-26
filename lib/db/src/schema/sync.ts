import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const clinicSyncTable = pgTable("clinic_sync", {
  code: text("code").primaryKey(),
  clinicName: text("clinic_name").notNull(),
  payload: jsonb("payload").$type<unknown>().notNull(),
  revision: integer("revision").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});