import Dexie, { type Table } from 'dexie';
import { z } from 'zod';

export type Role = 'manager' | 'doctor';
export type Status = string;
export interface Patient { id:string; fileNo:string; fullName:string; phone:string; birthDate:string; gender:string; address:string; allergies:string; medicalHistory:string; notes:string; createdAt:string; isSeed?:boolean }
export interface Doctor { id:string; name:string; specialty:string; phone:string; active:boolean; isSeed?:boolean }
export interface Appointment { id:string; patientId:string; doctorId:string; date:string; startTime:string; endTime:string; procedure:string; notes:string; amount:number; status:Status; color:string; createdAt:string; updatedAt:string; isSeed?:boolean }
export interface TreatmentPlan { id:string; patientId:string; diagnosis:string; proposedProcedures:string; status:Status; expectedCost:number; notes:string; startDate:string; completedDate:string; appointmentIds:string[]; isSeed?:boolean }
export interface DentalChartEntry { id:string; patientId:string; toothNumber:number; status:Status; note:string }
export interface InventoryItem { id:string; name:string; category:string; quantity:number; minQuantity:number; unit:string; expiryDate:string; supplier:string; unitPrice:number; isSeed?:boolean }
export interface InventoryMovement { id:string; itemId:string; type:'supply'|'consume'; quantity:number; note:string; createdAt:string; isSeed?:boolean }
export interface Invoice { id:string; appointmentId:string; patientId:string; amount:number; status:Status; createdAt:string; isSeed?:boolean }
export interface Payment { id:string; invoiceId:string; amount:number; date:string; note:string; isSeed?:boolean }
export interface Activity { id:string; type:string; label:string; createdAt:string }
export interface Radiograph { id:string; patientId:string; name:string; mimeType:string; size:number; dataUrl:string; note:string; createdAt:string }
export interface Settings { clinicName:string; address:string; phone:string; workingHours:string; currency:string; timezone:string; expiryAlertDays:number; numberLocale:string; activeRole:Role; setupComplete:boolean; persistedStorage:string; homepageEyebrow:string; homepageTitle:string; homepageDescription:string; primaryColor:string; accentColor:string }
export type StoreName = 'patients'|'doctors'|'appointments'|'treatmentPlans'|'dentalChartEntries'|'inventoryItems'|'inventoryMovements'|'invoices'|'payments'|'activityLog'|'radiographs'|'settings';
export interface DBData { patients:Patient[]; doctors:Doctor[]; appointments:Appointment[]; treatmentPlans:TreatmentPlan[]; dentalChartEntries:DentalChartEntry[]; inventoryItems:InventoryItem[]; inventoryMovements:InventoryMovement[]; invoices:Invoice[]; payments:Payment[]; activityLog:Activity[]; radiographs:Radiograph[]; settings:Settings }
export interface ClinicBackup { version:2; exportedAt:string; data:DBData }

const DB_NAME='alteesh-clinic-local';
const stores:StoreName[]=['patients','doctors','appointments','treatmentPlans','dentalChartEntries','inventoryItems','inventoryMovements','invoices','payments','activityLog','radiographs','settings'];
const blank:DBData={patients:[],doctors:[],appointments:[],treatmentPlans:[],dentalChartEntries:[],inventoryItems:[],inventoryMovements:[],invoices:[],payments:[],activityLog:[],radiographs:[],settings:{clinicName:'Alteesh Clinic',address:'',phone:'',workingHours:'08:00–18:00',currency:'ل.س',timezone:'Asia/Damascus',expiryAlertDays:30,numberLocale:'en-US',activeRole:'manager',setupComplete:false,persistedStorage:'غير معروف',homepageEyebrow:'مساحة العيادة اليومية',homepageTitle:'يوم واضح. رعاية أهدأ.',homepageDescription:'نظام محلي صغير لإدارة العيادة، صُمم ليبقي كل ما يهم الفريق أمامه — حتى دون اتصال.',primaryColor:'#0a466b',accentColor:'#f1d875'}};
const id=()=>`${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
const today=(timezone='Asia/Damascus')=>{
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const year=parts.find(part=>part.type==='year')?.value??'1970';
  const month=parts.find(part=>part.type==='month')?.value??'01';
  const day=parts.find(part=>part.type==='day')?.value??'01';
  return `${year}-${month}-${day}`;
};

class AlteeshDatabase extends Dexie {
  patients!: Table<Patient, string>;
  doctors!: Table<Doctor, string>;
  appointments!: Table<Appointment, string>;
  treatmentPlans!: Table<TreatmentPlan, string>;
  dentalChartEntries!: Table<DentalChartEntry, string>;
  inventoryItems!: Table<InventoryItem, string>;
  inventoryMovements!: Table<InventoryMovement, string>;
  invoices!: Table<Invoice, string>;
  payments!: Table<Payment, string>;
  activityLog!: Table<Activity, string>;
  radiographs!: Table<Radiograph, string>;
  settings!: Table<Settings & { id: string }, string>;

  constructor() {
    super(DB_NAME);
    this.version(1).stores({
      patients: 'id, fileNo, fullName, phone, isSeed',
      doctors: 'id, name, active, isSeed',
      appointments: 'id, date, startTime, endTime, patientId, doctorId, status, isSeed',
      treatmentPlans: 'id, patientId, status, isSeed',
      dentalChartEntries: 'id, patientId, toothNumber',
      inventoryItems: 'id, category, expiryDate, isSeed',
      inventoryMovements: 'id, itemId, type, createdAt, isSeed',
      invoices: 'id, patientId, appointmentId, status, isSeed',
      payments: 'id, invoiceId, date, isSeed',
      activityLog: 'id, type, createdAt, isSeed',
      settings: 'id',
    });
    this.version(2).stores({
      patients: 'id, fileNo, fullName, phone, isSeed',
      doctors: 'id, name, active, isSeed',
      appointments: 'id, date, startTime, endTime, patientId, doctorId, status, isSeed',
      treatmentPlans: 'id, patientId, status, isSeed',
      dentalChartEntries: 'id, patientId, toothNumber',
      inventoryItems: 'id, category, expiryDate, isSeed',
      inventoryMovements: 'id, itemId, type, createdAt, isSeed',
      invoices: 'id, patientId, appointmentId, status, isSeed',
      payments: 'id, invoiceId, date, isSeed',
      activityLog: 'id, type, createdAt, isSeed',
      radiographs: 'id, patientId, createdAt',
      settings: 'id',
    });
  }
}

const db = new AlteeshDatabase();
const tables:Record<StoreName, Table<any, string>> = {
  patients: db.patients,
  doctors: db.doctors,
  appointments: db.appointments,
  treatmentPlans: db.treatmentPlans,
  dentalChartEntries: db.dentalChartEntries,
  inventoryItems: db.inventoryItems,
  inventoryMovements: db.inventoryMovements,
  invoices: db.invoices,
  payments: db.payments,
  activityLog: db.activityLog,
  radiographs: db.radiographs,
  settings: db.settings,
};
async function all<T>(store:StoreName):Promise<T[]> { return tables[store].toArray() as Promise<T[]>; }
async function put<T extends {id:string}>(store:StoreName, value:T):Promise<T> { await tables[store].put(value); return value; }
async function remove(store:StoreName,key:string) { await tables[store].delete(key); }

const seededPatients:Patient[]=[{id:'p1',fileNo:'A-1048',fullName:'سارة عبدالرحمن',phone:'050 412 7782',birthDate:'1994-02-18',gender:'أنثى',address:'حي النرجس',allergies:'لا يوجد',medicalHistory:'لا يوجد',notes:'تفضّل المواعيد المسائية',createdAt:'2025-01-12',isSeed:true},{id:'p2',fileNo:'A-1051',fullName:'خالد العتيبي',phone:'055 801 2934',birthDate:'1988-10-04',gender:'ذكر',address:'حي الياسمين',allergies:'البنسلين',medicalHistory:'ضغط مستقر',notes:'',createdAt:'2025-01-16',isSeed:true},{id:'p3',fileNo:'A-1055',fullName:'نورة فهد',phone:'053 228 4160',birthDate:'2001-07-22',gender:'أنثى',address:'حي الورود',allergies:'',medicalHistory:'',notes:'',createdAt:'2025-01-20',isSeed:true}];
const seededDoctors:Doctor[]=[{id:'d1',name:'د. ليان السالم',specialty:'طب أسنان عام',phone:'011 222 1840',active:true,isSeed:true},{id:'d2',name:'د. مازن الحربي',specialty:'تقويم وزراعة',phone:'011 222 1841',active:true,isSeed:true}];
const seededAppointments:Appointment[]=[{id:'a1',patientId:'p1',doctorId:'d1',date:today(),startTime:'09:00',endTime:'09:45',procedure:'تنظيف وفحص دوري',notes:'',amount:280,status:'confirmed',color:'#3d8b83',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),isSeed:true},{id:'a2',patientId:'p2',doctorId:'d2',date:today(),startTime:'10:30',endTime:'11:30',procedure:'حشوة تجميلية',notes:'',amount:450,status:'waiting',color:'#e98772',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),isSeed:true},{id:'a3',patientId:'p3',doctorId:'d1',date:today(),startTime:'12:00',endTime:'13:00',procedure:'استشارة تقويم',notes:'',amount:0,status:'confirmed',color:'#caa95e',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),isSeed:true}];
const seededTreatmentPlans:TreatmentPlan[]=[{id:'tp1',patientId:'p1',diagnosis:'تسوس سطحي في الضرس السادس',proposedProcedures:'إزالة التسوس وحشوة تجميلية',status:'proposed',expectedCost:620,notes:'مراجعة الخطة في الزيارة القادمة',startDate:today(),completedDate:'',appointmentIds:['a1'],isSeed:true}];
const seededInventory:InventoryItem[]=[{id:'i1',name:'قفازات لاتكس',category:'مستهلكات',quantity:18,minQuantity:20,unit:'علبة',expiryDate:'2027-08-12',supplier:'مستلزمات رعاية',unitPrice:34,isSeed:true},{id:'i2',name:'مادة حشو مركبة',category:'مواد علاجية',quantity:7,minQuantity:5,unit:'سرنجة',expiryDate:'2026-10-10',supplier:'ميديكال لاين',unitPrice:92,isSeed:true},{id:'i3',name:'كمامات طبية',category:'مستهلكات',quantity:64,minQuantity:25,unit:'علبة',expiryDate:'2028-03-05',supplier:'مستلزمات رعاية',unitPrice:22,isSeed:true}];
export async function loadData():Promise<DBData>{const values=await Promise.all(stores.map(s=>all<any>(s)));const data:any={...blank};stores.forEach((s,i)=>{data[s]=s==='settings'?({...blank.settings,...(values[i][0]??{})}):values[i]});return data as DBData}
export async function save(store:StoreName, value:any){return put(store,value)}
export async function deleteRecord(store:StoreName,key:string){return remove(store,key)}
export async function initializeSeed():Promise<DBData>{const data=await loadData();if(data.settings.setupComplete)return data;for(const p of seededPatients)await put('patients',p);for(const d of seededDoctors)await put('doctors',d);for(const a of seededAppointments)await put('appointments',a);for(const plan of seededTreatmentPlans)await put('treatmentPlans',plan);for(const i of seededInventory)await put('inventoryItems',i);await put('settings',{...data.settings,id:'settings',setupComplete:true});await put('activityLog',{id:id(),type:'setup',label:'تم تجهيز بيانات العيادة لأول مرة',createdAt:new Date().toISOString(),isSeed:true});return loadData()}
export async function saveSettings(settings:Settings){return put('settings',{...settings,id:'settings'})}
export async function createEntity(store:StoreName,value:any){const entity={...value,id:value.id??id(),createdAt:value.createdAt??new Date().toISOString()};await put(store,entity);return entity}
const appointmentInputSchema=z.object({patientId:z.string().min(1),doctorId:z.string().min(1),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),startTime:z.string().regex(/^\d{2}:\d{2}$/),endTime:z.string().regex(/^\d{2}:\d{2}$/),procedure:z.string().min(1),notes:z.string(),amount:z.number().nonnegative(),status:z.string(),color:z.string()});
export async function createAppointment(value:Omit<Appointment,'id'|'createdAt'|'updatedAt'>){const input=appointmentInputSchema.parse(value);if(input.endTime<=input.startTime)throw new Error('وقت النهاية يجب أن يكون بعد وقت البداية.');const existing=await all<Appointment>('appointments');const conflict=existing.find(a=>a.date===input.date&&a.status!=='cancelled'&&input.startTime<a.endTime&&input.endTime>a.startTime);if(conflict)throw new Error(`يوجد تعارض على الكرسي المشترك من ${conflict.startTime} إلى ${conflict.endTime}. اختر وقتاً آخر.`);const appointment=await createEntity('appointments',{...input,updatedAt:new Date().toISOString(),isSeed:false});if(input.status==='completed'&&input.amount>0)await createEntity('invoices',{appointmentId:appointment.id,patientId:appointment.patientId,amount:appointment.amount,status:'unpaid',isSeed:false});return appointment;}
export async function clearSeeds(){const data=await loadData();for(const s of stores){if(s==='settings')continue;for(const item of (data[s] as any[])){if(item.isSeed)await remove(s,item.id)}}return loadData()}
export async function requestPersistentStorage():Promise<boolean>{if(!navigator.storage?.persist)return false;return navigator.storage.persist();}
export async function exportBackup():Promise<ClinicBackup>{return {version:2,exportedAt:new Date().toISOString(),data:JSON.parse(JSON.stringify(await loadData())) as DBData}}
function normalizeBackup(value:unknown):ClinicBackup{
  const candidate=value as Partial<ClinicBackup>|null;
  const data=candidate?.data as Partial<DBData>|undefined;
  if(!candidate || candidate.version!==2 || !data || !Array.isArray(data.patients) || !data.settings)throw new Error('ملف النسخة الاحتياطية غير صالح أو من إصدار غير مدعوم.');
  const normalized:any={...blank,...data,settings:{...blank.settings,...data.settings}};
  for(const store of stores)if(store!=='settings'&&!Array.isArray(normalized[store]))normalized[store]=[];
  return {version:2,exportedAt:String(candidate.exportedAt||new Date().toISOString()),data:normalized as DBData};
}
export async function importBackup(value:unknown):Promise<DBData>{
  const backup=normalizeBackup(value);
  await db.transaction('rw',Object.values(tables),async()=>{
    for(const store of stores)await tables[store].clear();
    for(const store of stores){
      if(store==='settings')await tables.settings.put({...backup.data.settings,id:'settings'});
      else if(backup.data[store].length)await tables[store].bulkPut(backup.data[store] as any[]);
    }
  });
  return loadData();
}
const syncEndpoint='/api/sync';
async function syncRequest(path:string,init?:RequestInit){
  const response=await fetch(`${syncEndpoint}${path}`,{...init,headers:{'Content-Type':'application/json',...(init?.headers||{})}});
  const body=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(typeof body.error==='string'?body.error:'تعذر الاتصال بخدمة المزامنة.');
  return body;
}
export async function registerSyncClinic(clinicName:string):Promise<string>{const result=await syncRequest('/register',{method:'POST',body:JSON.stringify({clinicName})});return String(result.code)}
export async function pushSync(code:string):Promise<{revision:number}>{const backup=await exportBackup();return syncRequest('/push',{method:'POST',body:JSON.stringify({code,backup})})}
export async function pullSync(code:string):Promise<DBData>{const result=await syncRequest(`/pull?code=${encodeURIComponent(code)}`);return importBackup(result.backup)}
export { id, today };