import { randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import { clinicSyncTable } from "@workspace/db/schema";

const router: IRouter = Router();

const codeSchema = z.string().regex(/^AL-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
const backupSchema = z.object({
  version: z.literal(2),
  exportedAt: z.string().min(1),
  data: z.record(z.string(), z.unknown()),
});

function createCode(): string {
  const raw = randomBytes(4).toString("hex").toUpperCase();
  return `AL-${raw.slice(0, 4)}-${raw.slice(4)}`;
}

router.post("/sync/register", async (req, res) => {
  const input = z.object({ clinicName: z.string().trim().min(1).max(120) }).safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: "اسم العيادة غير صالح." });
    return;
  }

  try {
    let code = createCode();
    while ((await db.select({ code: clinicSyncTable.code }).from(clinicSyncTable).where(eq(clinicSyncTable.code, code))).length) {
      code = createCode();
    }
    await db.insert(clinicSyncTable).values({
      code,
      clinicName: input.data.clinicName,
      payload: { version: 2, exportedAt: new Date().toISOString(), data: {} },
    });
    res.status(201).json({ code });
  } catch {
    res.status(503).json({ error: "خدمة المزامنة غير متاحة حالياً." });
  }
});

router.post("/sync/push", async (req, res) => {
  const input = z.object({ code: codeSchema, backup: backupSchema }).safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: "بيانات المزامنة غير صالحة." });
    return;
  }

  try {
    const current = await db
      .select({ revision: clinicSyncTable.revision })
      .from(clinicSyncTable)
      .where(eq(clinicSyncTable.code, input.data.code));
    if (!current.length) {
      res.status(404).json({ error: "رمز المزامنة غير موجود." });
      return;
    }
    const revision = (current[0]?.revision ?? 0) + 1;
    await db
      .update(clinicSyncTable)
      .set({
        payload: input.data.backup,
        revision,
        updatedAt: new Date(),
      })
      .where(eq(clinicSyncTable.code, input.data.code));
    res.json({ revision });
  } catch {
    res.status(503).json({ error: "تعذر حفظ نسخة المزامنة." });
  }
});

router.get("/sync/pull", async (req, res) => {
  const input = codeSchema.safeParse(req.query.code);
  if (!input.success) {
    res.status(400).json({ error: "رمز المزامنة غير صالح." });
    return;
  }

  try {
    const rows = await db
      .select({
        payload: clinicSyncTable.payload,
        revision: clinicSyncTable.revision,
        updatedAt: clinicSyncTable.updatedAt,
      })
      .from(clinicSyncTable)
      .where(and(eq(clinicSyncTable.code, input.data)));
    const row = rows[0];
    const payload = row?.payload;
    const payloadData = payload && typeof payload === "object" && "data" in payload
      ? (payload as { data?: unknown }).data
      : undefined;
    if (!row || !payload || !payloadData || typeof payloadData !== "object" || !Array.isArray((payloadData as { patients?: unknown }).patients)) {
      res.status(404).json({ error: "لم يتم رفع نسخة مزامنة لهذا الرمز بعد." });
      return;
    }
    res.json({ backup: row.payload, revision: row.revision, updatedAt: row.updatedAt });
  } catch {
    res.status(503).json({ error: "تعذر قراءة نسخة المزامنة." });
  }
});

export default router;