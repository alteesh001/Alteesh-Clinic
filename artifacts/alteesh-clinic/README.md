# Alteesh Clinic

تطبيق إدارة عيادة أسنان عربي يعمل أوفلاين بالكامل. البيانات تُحفظ محليًا في
IndexedDB عبر Dexie، ولا توجد حسابات أو خدمات خارجية أو طلبات شبكة وقت التشغيل.

## تشغيل الويب

```bash
pnpm --filter @workspace/alteesh-clinic run dev
```

يحتاج Vite إلى `PORT` و`BASE_PATH` عند التشغيل اليدوي. الـ workflow يمررهما
تلقائيًا.

## البيانات والصلاحيات

- يبدأ التطبيق بشاشة `/setup`، ويمكن إضافة بيانات تجريبية عربية قابلة للحذف.
- وضع المدير يعرض كل صفحات الإدارة.
- وضع الطبيب يعرض جدول الكرسي المشترك فقط: الوقت والحالة ونوع الإجراء.
- لا توجد حماية أمنية بين الوضعين؛ التبديل مقصود لتبسيط الواجهة وليس بديلاً عن
  نظام صلاحيات.
- يطلب التطبيق التخزين الدائم عند الإقلاع ويعرض حالته في الإعدادات.
- التاريخ يُحفظ بصيغة `YYYY-MM-DD` والوقت بصيغة `HH:mm`، والمنطقة الافتراضية
  `Asia/Damascus`.

## أندرويد

تمت إضافة مشروع Capacitor ومنصة Android:

```bash
pnpm --filter @workspace/alteesh-clinic run android:sync
pnpm --filter @workspace/alteesh-clinic run android:open
```

يحتاج البناء النهائي إلى Android Studio وAndroid SDK على جهاز البناء.

## ويندوز

```bash
pnpm --filter @workspace/alteesh-clinic run desktop:build
```

تم إعداد Electron و`electron-builder` لإخراج NSIS EXE. في بيئة Linux الحالية
تم إنشاء تطبيق Electron غير مضغوط بنجاح، لكن إخراج ملف EXE النهائي يحتاج Wine
أو تشغيل الأمر على Windows؛ لم يتم الادعاء ببناء EXE هنا دون تلك البيئة.

## التحقق المنفذ

- TypeScript: ناجح.
- Vite production build: ناجح.
- المسارات المباشرة عبر proxy: تعيد التطبيق بدون شاشة بيضاء.
- Android Capacitor sync: ناجح.
- معاينة RTL وشاشة الإعداد والشعار المرفق: ناجحة.
- PWA manifest وservice worker والخطوط مضمّنة محليًا.
