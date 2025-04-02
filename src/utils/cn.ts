import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ฟังก์ชันช่วยในการจัดการวันที่
export function formatDateToThai(date: Date): string {
  if (!date) return '';
  
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return date.toLocaleDateString('th-TH', options);
}

// ฟังก์ชันแปลง Date เป็น string format yyyy-MM-dd สำหรับ input type="date"
export function formatDateForInput(date: Date): string {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
} 