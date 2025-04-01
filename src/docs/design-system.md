# แนวทางการใช้งาน Design System - Earthquake Damage Report Application

Design System นี้ถูกพัฒนาขึ้นเพื่อสร้างความสอดคล้องและประสิทธิภาพในการพัฒนา UI สำหรับแอปพลิเคชันรายงานความเสียหายจากแผ่นดินไหว โดยใช้ Shadcn UI เป็นพื้นฐาน

## 1. สี (Colors)

### สีหลัก (Primary Colors)
- **น้ำเงินเข้ม (#2563EB)**: สีหลักของแอปพลิเคชัน ใช้สำหรับปุ่มหลัก, แถบนำทาง, และองค์ประกอบสำคัญ
- **เทาอมฟ้า (#64748B)**: สีรองของแอปพลิเคชัน ใช้สำหรับข้อความรอง, องค์ประกอบที่ไม่เน้น, และพื้นหลังรอง

### สีแจ้งเตือน (Alert Colors)
- **สีแดง (#EF4444)**: ใช้แสดงความผิดพลาด, ข้อผิดพลาดในการกรอกข้อมูล
- **สีเหลือง (#F59E0B)**: ใช้สำหรับคำเตือนและการแจ้งเตือนระดับกลาง
- **สีเขียว (#10B981)**: ใช้แสดงความสำเร็จ, การยืนยัน และการดำเนินการเสร็จสิ้น

### สีพื้นหลัง (Background)
- **สีขาว (#FFFFFF)**: ใช้เป็นพื้นหลักหลัก
- **สีเทาอ่อนมาก (#F9FAFB)**: ใช้เป็นพื้นหลังสำรอง หรือแยกส่วนต่างๆ ของฟอร์ม

### สีข้อความ (Text)
- **สีเทาเข้ม (#1E293B)**: ใช้สำหรับข้อความหลัก
- **สีเทากลาง (#64748B)**: ใช้สำหรับข้อความรองและคำอธิบาย

### การใช้งานใน CSS
```css
/* สีหลัก */
.text-primary { color: hsl(var(--color-primary)); }
.bg-primary { background-color: hsl(var(--color-primary)); }

/* สีรอง */
.text-secondary { color: hsl(var(--color-secondary)); }
.bg-secondary { background-color: hsl(var(--color-secondary)); }
```

### การใช้งานใน Tailwind
```jsx
<button className="bg-primary text-primary-foreground">ปุ่มหลัก</button>
<button className="bg-secondary text-secondary-foreground">ปุ่มรอง</button>
<div className="text-destructive">ข้อความแจ้งเตือนความผิดพลาด</div>
```

## 2. การพิมพ์ (Typography)

### ฟอนต์ (Font Family)
เราใช้ฟอนต์ **Sarabun** สำหรับทั้งภาษาไทยและภาษาอังกฤษ เพื่อความสอดคล้องและอ่านง่าย

### ขนาดตัวอักษร (Font Sizes)
- **h1**: 2rem (32px), font-weight: 700, line-height: 1.2
- **h2**: 1.5rem (24px), font-weight: 700, line-height: 1.3
- **h3**: 1.25rem (20px), font-weight: 600, line-height: 1.4
- **body**: 1rem (16px), font-weight: 400, line-height: 1.5
- **small**: 0.875rem (14px), font-weight: 400, line-height: 1.4

### การใช้งานใน CSS
```css
.h1 {
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 700;
}

.text-base {
  font-size: 1rem;
  line-height: 1.5;
}
```

### การใช้งานใน Tailwind
```jsx
<h1 className="text-3xl font-bold leading-tight">หัวข้อหลัก</h1>
<h2 className="text-2xl font-bold leading-snug">หัวข้อรอง</h2>
<p className="text-base leading-normal">ข้อความทั่วไป</p>
```

## 3. ระยะห่าง (Spacing)

ระบบระยะห่างใช้หน่วย rem โดยมีค่าพื้นฐานเป็น 4px (0.25rem)

- **0**: 0
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)

### การใช้งานใน CSS
```css
.card {
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-4);
}
```

### การใช้งานใน Tailwind
```jsx
<div className="p-6 mb-4">เนื้อหา</div>
<div className="pt-4 px-6">เนื้อหา</div>
```

## 4. องค์ประกอบ UI (Components)

### ปุ่ม (Buttons)
ปุ่มมีหลายประเภทตามการใช้งาน:

- **ปุ่มหลัก (Primary)**: ใช้สำหรับการกระทำหลัก เช่น บันทึก, ยืนยัน
- **ปุ่มรอง (Secondary)**: ใช้สำหรับการกระทำรอง เช่น ยกเลิก, ย้อนกลับ
- **ปุ่มอันตราย (Destructive)**: ใช้สำหรับการกระทำที่ไม่สามารถย้อนกลับได้ เช่น ลบ

### การ์ด (Cards)
ใช้สำหรับจัดกลุ่มเนื้อหาที่เกี่ยวข้องกัน:

```jsx
<div className="card-style p-6 mb-4">
  <h3 className="text-xl font-semibold mb-4">หัวข้อการ์ด</h3>
  <p>เนื้อหาการ์ด</p>
</div>
```

### ฟอร์ม (Forms)
ฟอร์มประกอบด้วยองค์ประกอบต่างๆ:

- **Label**: ป้ายกำกับฟิลด์
- **Input**: ช่องกรอกข้อความ
- **Select**: ตัวเลือกแบบดรอปดาวน์
- **Checkbox/Radio**: ตัวเลือกแบบติ๊ก
- **Textarea**: ช่องกรอกข้อความหลายบรรทัด

```jsx
<div className="mb-4">
  <label className="form-label">ชื่อ</label>
  <input className="form-input" type="text" />
</div>
```

## 5. แนวทางการใช้ Animation

- **Duration**:
  - เร็ว (Fast): 150ms - สำหรับการเปลี่ยนแปลงเล็กน้อย เช่น hover, focus
  - ปกติ (Normal): 300ms - สำหรับการเปลี่ยนแปลงปานกลาง เช่น การแสดง/ซ่อนเนื้อหา
  - ช้า (Slow): 500ms - สำหรับการเปลี่ยนแปลงใหญ่ เช่น การเปลี่ยนหน้า

- **Easing**:
  - ease-in-out: สำหรับการเปลี่ยนแปลงทั่วไป
  - ease-out: สำหรับการแสดงองค์ประกอบ
  - ease-in: สำหรับการซ่อนองค์ประกอบ

## 6. แนวทางการใช้ Responsive Design

เราใช้การออกแบบแบบ Mobile-first โดยมี Breakpoints ดังนี้:

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### การใช้งานใน Tailwind
```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
  เนื้อหาที่ปรับตามขนาดหน้าจอ
</div>
```

## 7. แนวทางการเข้าถึง (Accessibility)

- **ความคมชัดของสี**: ใช้สีที่มีความคมชัดเพียงพอตามมาตรฐาน WCAG 2.1 AA
- **ขนาดตัวอักษร**: ใช้ขนาดตัวอักษรที่อ่านง่าย ไม่น้อยกว่า 14px (0.875rem)
- **Focus State**: ทุกองค์ประกอบที่โต้ตอบได้ต้องมี Focus State ที่ชัดเจน
- **Semantic HTML**: ใช้ HTML ที่มีความหมายเพื่อรองรับการอ่านหน้าจอ

## 8. แนวทางการใช้ Icon

เราใช้ Lucide Icons เป็นหลัก โดยมีขนาดมาตรฐานดังนี้:

- **เล็ก**: 16px (1rem)
- **กลาง**: 20px (1.25rem)
- **ใหญ่**: 24px (1.5rem)

```jsx
<LucideIcon className="w-4 h-4" /> // ไอคอนขนาดเล็ก
<LucideIcon className="w-5 h-5" /> // ไอคอนขนาดกลาง
<LucideIcon className="w-6 h-6" /> // ไอคอนขนาดใหญ่
```

## 9. แนวทางการใช้งานร่วมกับ Shadcn UI

Shadcn UI ใช้ Tailwind CSS และ Radix UI ใต้ระบบ ทำให้สามารถปรับแต่งได้ง่ายและคงความสอดคล้อง นี่คือแนวทางการใช้งาน:

- ใช้ Component ของ Shadcn UI เป็นพื้นฐาน
- ปรับแต่ง Component โดยการ extend ตาม Design System ที่กำหนด
- ใช้ Slot pattern ของ Radix UI เพื่อปรับแต่ง Component ได้อย่างยืดหยุ่น

```jsx
<Button variant="default">ปุ่มหลัก</Button>
<Button variant="secondary">ปุ่มรอง</Button>
<Button variant="destructive">ปุ่มอันตราย</Button>
```

## 10. แนวทางการพัฒนาต่อไป

- **Maintain Design Tokens**: อัปเดตตัวแปร Design ใน Theme เมื่อมีการเปลี่ยนแปลง
- **Component Library**: พัฒนา Component Library เพื่อรวบรวม Component ทั้งหมด
- **Documentation**: จัดทำเอกสารที่ละเอียดขึ้นสำหรับแต่ละ Component
- **Testing**: ทดสอบการใช้งานกับกลุ่มผู้ใช้ที่หลากหลาย 