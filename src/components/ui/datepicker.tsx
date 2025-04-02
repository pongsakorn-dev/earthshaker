import React, { useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';

// สร้างฟังก์ชัน cn ในไฟล์นี้เพื่อแก้ไขปัญหา import ที่ไม่พบไฟล์
function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: boolean;
}

// เพิ่ม CSS styles สำหรับ date picker
const injectDatePickerStyles = () => {
  // ตรวจสอบว่าเพิ่ม style แล้วหรือยัง
  const styleId = 'date-picker-custom-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    /* ทำให้ calendar picker ของ input มีขนาดใหญ่ขึ้น */
    input[type="date"]::-webkit-calendar-picker-indicator {
      width: 100%;
      height: 100%;
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
      z-index: 10;
    }
    
    /* ปรับแต่ง date picker บน iOS */
    @supports (-webkit-touch-callout: none) {
      input[type="date"] {
        padding-right: 42px;
      }
    }
    
    /* เพิ่ม padding ทำให้พื้นที่กดง่ายขึ้น */
    @media (max-width: 768px) {
      input[type="date"] {
        padding: 12px;
        height: 48px;
        font-size: 16px;
        padding-right: 48px;
      }
      
      .date-picker-calendar-icon {
        width: 24px;
        height: 24px;
        right: 12px;
      }
    }

    /* ปรับขนาด calendar panel ให้ใหญ่ขึ้น */
    ::-webkit-datetime-edit {
      font-size: 16px;
    }
    
    ::-webkit-calendar-picker {
      font-size: 16px;
    }
    
    /* สำหรับ Chrome, Edge, และ Safari */
    ::-webkit-calendar-picker-indicator:hover {
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 50%;
    }

    /* ทำให้ calendar panel ใหญ่ขึ้น (Firefox, Chrome) */
    input[type="date"]::-webkit-datetime-edit {
      padding: 8px 0;
    }

    /* Chrome และ Edge */
    @media screen and (-webkit-min-device-pixel-ratio:0) {
      input[type="date"]:focus::-webkit-calendar-picker-indicator {
        transform: scale(1.5);
        transform-origin: center right;
      }
    }

    /* ทำให้ Panel ที่เปิดขึ้นมามีขนาดใหญ่ขึ้น (ใช้ได้บางส่วนใน Chrome) */
    input[type="date"]::-webkit-clear-button,
    input[type="date"]::-webkit-inner-spin-button,
    input[type="date"]::-webkit-calendar-picker-indicator {
      transform: scale(1.5);
      margin-right: 8px;
    }

    /* ปรับแต่ง font size สำหรับวันที่ที่เลือก */
    input[type="date"]:not(:placeholder-shown) {
      font-size: 16px;
    }

    /* สำหรับอุปกรณ์มือถือ - ทำให้ input ใหญ่ขึ้นเพื่อป้องกันการ zoom */
    @media (max-width: 768px) {
      /* ทำให้ calendar panel (ส่วนตารางปฏิทิน) ใหญ่ขึ้นเมื่อเปิดบนมือถือ */
      input[type="date"] {
        height: 50px; /* input สูงขึ้น */
        font-size: 18px; /* ขนาดตัวอักษรใหญ่ขึ้น */
      }
      
      /* เพิ่ม forced transform scale ให้ panel ที่เปิดขึ้นมา */
      input[type="date"]:focus::-webkit-calendar-picker-indicator {
        transform: scale(2);
        transform-origin: bottom right;
      }
    }

    /* ทำให้ปุ่มเลือกวันที่ชัดเจนและกดง่าย */
    .date-picker-button {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
};

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, error, ...props }, ref) => {
    // เพิ่ม CSS styles เมื่อ component mount
    useEffect(() => {
      injectDatePickerStyles();
    }, []);

    const inputRef = useRef<HTMLInputElement>(null);
    // ทำการ forward ref ที่ได้รับมาหรือใช้ inputRef ถ้าไม่มี ref จากภายนอก
    const combinedRef = (node: HTMLInputElement) => {
      inputRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    // ฟังก์ชันสำหรับเปิด date picker เมื่อคลิกที่ไอคอน
    const handleIconClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (inputRef.current) {
        inputRef.current.showPicker();
      }
    };

    return (
      <div className="relative w-full">
        <input
          type="date"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "pr-10", // เพิ่ม padding ด้านขวาสำหรับไอคอน
            error && "border-destructive",
            className
          )}
          ref={combinedRef}
          style={{
            // CSS เพื่อทำให้ date picker ใหญ่ขึ้นบนมือถือ
            fontSize: '16px', // ป้องกันการ zoom เข้าเมื่อกดใน iOS
            touchAction: 'manipulation', // ช่วยในการจัดการ touch events
            cursor: 'pointer', // เปลี่ยน cursor เป็น pointer เพื่อแสดงว่าสามารถคลิกได้
          }}
          onClick={(e) => {
            // หากกดที่ input ให้แสดง date picker
            if (inputRef.current && !props.disabled) {
              inputRef.current.showPicker();
            }
            // ดำเนินการ onClick ที่อาจส่งมาจากภายนอก
            props.onClick?.(e);
          }}
          {...props}
        />
        
        {/* เพิ่มไอคอนปฏิทินที่ชัดเจน */}
        <div 
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer z-20"
          onClick={handleIconClick}
        >
          <Calendar className="w-5 h-5 text-primary date-picker-calendar-icon" />
        </div>
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export { DatePicker }; 