import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import './App.css';
import './utils/i18n';  // Import i18n config
import LanguageSelector from './components/LanguageSelector';
import DamageForm, { AddDamageButton } from './components/DamageForm';
import { FormData, DamageDetail, DamageType, ResidenceType, RoomType } from './types';
import generatePdf from './utils/reactPdfGenerator';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Card } from './components/ui/card';

// เพิ่มการประกาศ type สำหรับ window global
declare global {
  interface Window {
    MSStream?: any;
    saveAs?: (blob: Blob, fileName: string) => void;
  }
}

// Map สำหรับเก็บข้อมูลชื่อโครงการจาก URL parameter
const projectNameMapping: Record<string, string> = {
  'rhythm': 'Rhythm Asok',
  'rhythm-sukhumvit': 'Rhythm Sukhumvit',
  'rhythm-rangnam': 'Rhythm Rangnam',
  'rhythm-phahol-ari': 'Rhythm Phahol-Ari',
  'rhythm-ekamai': 'Rhythm Ekamai'
};

// NotFound component สำหรับแสดงเมื่อไม่พบโครงการที่ระบุ
const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-6">โครงการที่คุณต้องการไม่มีในระบบ</h2>
      <p className="text-gray-600 mb-8">กรุณาตรวจสอบ URL อีกครั้ง</p>
      <ul className="space-y-2">
        {Object.entries(projectNameMapping).map(([key, name]) => (
          <li key={key}>
            <a 
              href={`/${key}`} 
              className="text-blue-500 hover:underline"
            >
              {name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

function App() {
  const { t: originalT } = useTranslation();
  const t = originalT as unknown as (key: string, options?: any) => string;
  
  const [loading, setLoading] = useState(false);
  const [projectNotFound, setProjectNotFound] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  
  // ฟังก์ชันสำหรับดึงชื่อโครงการจาก URL parameter
  const getProjectNameFromURL = (): { name: string, key: string } | null => {
    // ดึง pathname จาก URL ปัจจุบัน
    const pathname = window.location.pathname;
    // ลบ / ออกและดึงเฉพาะส่วนที่ต้องการ
    const key = pathname.split('/').filter(Boolean)[0];
    
    // ถ้าไม่มี key หรือไม่พบใน mapping ให้ return null
    if (!key || !projectNameMapping[key]) {
      return null;
    }
    
    // ส่งคืนชื่อโครงการจาก mapping
    return { 
      key, 
      name: projectNameMapping[key] 
    };
  };
  
  const [formData, setFormData] = useState<FormData>({
    roomNumber: '',
    residentName: '',
    residenceType: 'owner' as ResidenceType,
    projectName: '',
    damages: [
      {
        id: uuidv4(),
        type: 'water' as DamageType,
        room: 'bedroom' as RoomType,
        location: '',
        description: '',
        images: [],
      }
    ],
  });

  const [errors, setErrors] = useState({
    roomNumber: false,
    residentName: false,
  });
  
  // อัพเดทชื่อโครงการเมื่อ URL เปลี่ยน
  useEffect(() => {
    const project = getProjectNameFromURL();
    
    if (project) {
      setFormData(prev => ({
        ...prev,
        projectName: project.name
      }));
      setProjectNotFound(false);
    } else {
      setProjectNotFound(true);
    }
  }, []);
  
  const validateForm = (): boolean => {
    const newErrors = {
      roomNumber: !formData.roomNumber.trim(),
      residentName: !formData.residentName.trim(),
    };
    
    setErrors(newErrors);
    
    // Check if all damage entries have required fields
    const allDamagesValid = formData.damages.every(
      (damage) => damage.location && damage.type
    );
    
    return !newErrors.roomNumber && 
           !newErrors.residentName && 
           allDamagesValid && 
           formData.damages.length > 0;
  };
  
  const handleTextChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    if (field === 'roomNumber' || field === 'residentName') {
      setErrors((prev) => ({
        ...prev,
        [field]: !value.trim(),
      }));
    }
  };

  const handleResidenceTypeChange = (value: ResidenceType) => {
    setFormData((prev) => ({
      ...prev,
      residenceType: value,
    }));
  };
  
  const handleAddDamage = useCallback(() => {
    const newDamage: DamageDetail = {
      id: uuidv4(),
      type: 'other' as DamageType,
      location: '',
      description: '',
      images: [],
    };
    
    setFormData((prev) => ({
      ...prev,
      damages: [...prev.damages, newDamage],
    }));
  }, []);
  
  const handleUpdateDamage = useCallback((id: string, updatedDamage: Partial<DamageDetail>) => {
    setFormData((prev) => ({
      ...prev,
      damages: prev.damages.map((damage) =>
        damage.id === id ? { ...damage, ...updatedDamage } : damage
      ),
    }));
  }, []);
  
  const handleDeleteDamage = useCallback((id: string) => {
    setFormData((prev) => {
      // Get all images from the damage being deleted
      const damageToDelete = prev.damages.find(damage => damage.id === id);
      const imagesToCleanup = damageToDelete?.images || [];
      
      // Revoke object URLs to avoid memory leaks
      imagesToCleanup.forEach(img => {
        URL.revokeObjectURL(img.preview);
      });
      
      return {
        ...prev,
        damages: prev.damages.filter((damage) => damage.id !== id),
      };
    });
  }, []);
  
  const handleAddDamageImage = useCallback((damageId: string, files: File[]) => {
    const newImages = files.map((file) => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
    }));
    
    setFormData((prev) => ({
      ...prev,
      damages: prev.damages.map((damage) =>
        damage.id === damageId 
          ? { ...damage, images: [...damage.images, ...newImages] } 
          : damage
      ),
    }));
  }, []);
  
  const handleDeleteDamageImage = useCallback((damageId: string, imageId: string) => {
    setFormData((prev) => {
      const updatedDamages = prev.damages.map((damage) => {
        if (damage.id === damageId) {
          // Find the image to delete
          const imageToDelete = damage.images.find(img => img.id === imageId);
          
          // Revoke object URL to avoid memory leaks
          if (imageToDelete) {
            URL.revokeObjectURL(imageToDelete.preview);
          }
          
          return {
            ...damage,
            images: damage.images.filter((img) => img.id !== imageId),
          };
        }
        return damage;
      });
      
      return {
        ...prev,
        damages: updatedDamages,
      };
    });
  }, []);
  
  const handleAddCrack = useCallback(() => {
    const newDamage: DamageDetail = {
      id: uuidv4(),
      type: 'crack' as DamageType,
      location: '',
      description: 'รอยแตกร้าว',
      images: [],
    };
    
    setFormData((prev) => ({
      ...prev,
      damages: [...prev.damages, newDamage],
    }));
  }, []);
  
  const handleGeneratePdf = async () => {
    if (!validateForm()) {
      setNotification({
        open: true,
        message: t('form.requiredField'),
        severity: 'error',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // แปลงรูปภาพเป็น base64
      const processedImages: { id: string; damageId: string; base64: string }[] = [];
      
      // ประมวลผลรูปภาพแบบ sequential
      for (const damage of formData.damages) {
        if (damage.images && damage.images.length > 0) {
          for (const img of damage.images) {
            if (img.file) {
              try {
                // แปลงรูปภาพให้เป็น JPEG ที่มีความเข้ากันได้สูงกับ PDF
                const imageUrl = img.preview;
                const jpegBase64 = await convertToJpeg(imageUrl);
                
                processedImages.push({
                  id: img.id,
                  damageId: damage.id,
                  base64: jpegBase64
                });
              } catch (error) {
                console.error('Error processing image:', error);
              }
            }
          }
        }
      }
      
      console.log('Generating PDF...');
      // เรียกใช้ PDF Generator ตัวใหม่ที่ใช้ @react-pdf/renderer
      const pdfDataUri = await generatePdf(formData, processedImages);
      console.log('PDF generated successfully');
      
      if (!pdfDataUri) {
        throw new Error('PDF data is empty');
      }
      
      // ดึง key ของโครงการจาก URL
      const project = getProjectNameFromURL();
      const projectKey = project?.key || 'unknown';
      
      // ตั้งชื่อไฟล์
      const fileName = `${projectKey}_${formData.roomNumber}.pdf`;
      
      // ตรวจสอบว่าเป็นอุปกรณ์และระบบปฏิบัติการอะไร
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge|Edg/.test(navigator.userAgent);
      const isMobile = isIOS || isAndroid || /Mobi|mini|IEMobile/i.test(navigator.userAgent);
      
      // สร้าง blob สำหรับการดาวน์โหลดในทุกแพลตฟอร์ม
      const byteString = atob(pdfDataUri.split(',')[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([uint8Array], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      
      if (isMobile) {
        // สำหรับ Android บางรุ่น สามารถทดลองใช้ anchor element เพื่อดาวน์โหลด
        if (isAndroid && isChrome) {
          try {
            // ลองดาวน์โหลดตรงก่อน (Chrome บน Android บางรุ่นรองรับ)
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = fileName;
            a.target = '_blank'; // สำคัญสำหรับ Android
            a.setAttribute('rel', 'noopener');
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
              document.body.removeChild(a);
            }, 100);
            
            // แสดงคำแนะนำทั้งสองกรณี เผื่อดาวน์โหลดตรงไม่ได้
            setNotification({
              open: true,
              message: `PDF กำลังดาวน์โหลด... หากไม่พบไฟล์ที่ดาวน์โหลด โปรดดูที่:
              1. แถบแจ้งเตือนด้านบนของหน้าจอ (Notification)
              2. โฟลเดอร์ Downloads ในเครื่อง
              3. หากยังไม่พบ ลองกดปุ่มเมนู (⋮) และเลือก "ดาวน์โหลด"`,
              severity: 'success',
            });
            
            // ทำความสะอาด URL
            setTimeout(() => {
              URL.revokeObjectURL(blobUrl);
            }, 1000);
          } catch (error) {
            console.error('Failed to download directly on Android Chrome, falling back to tab open:', error);
            // Fallback - เปิดในแท็บใหม่
            window.open(blobUrl, '_blank');
            
            setNotification({
              open: true,
              message: `
                1. กดปุ่มเมนู (⋮) ที่มุมบนขวาของหน้าจอ
                2. เลือก "Download" (ดาวน์โหลด)
                3. หรือใช้ปุ่มดาวน์โหลด (⬇️) ถ้ามีแสดงบนหน้าจอ
              `,
              severity: 'success',
            });
            
            // ทำความสะอาด URL
            setTimeout(() => {
              URL.revokeObjectURL(blobUrl);
            }, 1000);
          }
        } else if (isAndroid) {
          // Android ที่ไม่ใช่ Chrome
          try {
            // ลองอีกวิธีสำหรับ Android ทั่วไป (Samsung Browser, etc.)
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            link.click();
            
            setNotification({
              open: true,
              message: `กำลังบันทึกไฟล์... หากไม่พบการดาวน์โหลด ให้กดปุ่มเมนู (⋮) และเลือก "ดาวน์โหลด"`,
              severity: 'success',
            });
            
            // ทำความสะอาด URL
            setTimeout(() => {
              URL.revokeObjectURL(blobUrl);
            }, 1000);
          } catch (e) {
            // Fallback - เปิดในแท็บใหม่
            window.open(blobUrl, '_blank');
            
            setNotification({
              open: true,
              message: `PDF ถูกสร้างแล้ว กรุณากดปุ่มดาวน์โหลดในหน้าที่เปิดขึ้น`,
              severity: 'success',
            });
            
            // ทำความสะอาด URL
            setTimeout(() => {
              URL.revokeObjectURL(blobUrl);
            }, 1000);
          }
        } else if (isIOS) {
          // สำหรับ iOS ยังคงต้องใช้วิธีเปิดในแท็บใหม่
          window.open(blobUrl, '_blank');
          
          setNotification({
            open: true,
            message: `
              1. กดปุ่มแชร์ (รูปสี่เหลี่ยมมีลูกศรชี้ขึ้น 📤) ที่อยู่ด้านล่างกลางของหน้าจอ
              2. เลือก "Save to Files" (บันทึกลงในไฟล์)
              3. เลือกตำแหน่งที่ต้องการจัดเก็บแล้วกด "Save"
            `,
            severity: 'success',
          });
          
          // ทำความสะอาด URL
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
          }, 1000);
        } else {
          // สำหรับมือถืออื่นๆ
          window.open(blobUrl, '_blank');
          
          setNotification({
            open: true,
            message: 'กดปุ่มแชร์หรือเมนูตัวเลือกในเบราว์เซอร์ของคุณ แล้วเลือกบันทึกไฟล์',
            severity: 'success',
          });
          
          // ทำความสะอาด URL
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
          }, 1000);
        }
      } else {
        // สำหรับ desktop browsers - ดาวน์โหลดโดยตรง
        try {
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = fileName;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          
          // ทำความสะอาด
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
          }, 100);
          
          setNotification({
            open: true,
            message: `PDF ${fileName} ถูกดาวน์โหลดเรียบร้อยแล้ว`,
            severity: 'success',
          });
        } catch (error) {
          console.error('Error downloading PDF:', error);
          // Fallback ใช้การเปิดในแท็บใหม่
          window.open(blobUrl, '_blank');
          
          setNotification({
            open: true,
            message: `PDF ถูกสร้างแล้ว โปรดกดปุ่มบันทึกในหน้าต่างใหม่ที่เปิดขึ้น`,
            severity: 'success',
          });
          
          // ทำความสะอาด URL หลังจากเปิดในหน้าต่างใหม่
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setNotification({
        open: true,
        message: `เกิดข้อผิดพลาดในการสร้าง PDF: ${error instanceof Error ? error.message : 'ข้อผิดพลาดที่ไม่ทราบสาเหตุ'}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      formData.damages.forEach((damage) => {
        damage.images.forEach((img) => {
          URL.revokeObjectURL(img.preview);
        });
      });
    };
  }, [formData.damages]);

  // ฟังก์ชันสำหรับแปลงรูปภาพเป็น JPEG ด้วย canvas
  const convertToJpeg = (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      img.onload = () => {
        try {
          // สร้าง canvas และกำหนดขนาด
          const canvas = document.createElement('canvas');
          
          // คำนวณขนาดใหม่ - ปรับความละเอียดรูปภาพลงถ้าจำเป็น (ไม่เกิน 1200px)
          let width = img.width;
          let height = img.height;
          const maxDimension = 1200;
          
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round(height * (maxDimension / width));
              width = maxDimension;
            } else {
              width = Math.round(width * (maxDimension / height));
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // วาดรูปภาพลงบน canvas
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Unable to get canvas context');
          }
          
          // วาดรูปสีขาวเป็นพื้นหลังก่อน (ป้องกันปัญหาความโปร่งใส)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          
          // วาดรูปจริงทับไป
          ctx.drawImage(img, 0, 0, width, height);
          
          // แปลงเป็น JPEG (คุณภาพ 0.9 หรือ 90%)
          const jpegBase64 = canvas.toDataURL('image/jpeg', 0.9);
          resolve(jpegBase64);
        } catch (error) {
          console.error('Canvas processing error:', error);
          reject(error);
        }
      };
      
      img.onerror = (error) => {
        console.error('Image loading error:', error);
        reject(error);
      };
      
      img.src = imageUrl;
    });
  };

  // ถ้าไม่พบโครงการให้แสดงหน้า NotFound
  if (projectNotFound) {
    return <NotFound />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold">{t('app.title')}</h1>
          <h2 className="text-xl mt-1 text-gray-600">{formData.projectName}</h2>
          <div className="self-end">
            <LanguageSelector />
          </div>
        </div>
        
        <Card className="p-6 md:p-8 mb-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t('form.basicInfo')}</h2>
          
          <div className="space-y-6 mb-8">
            <div className="space-y-2">
              <Label htmlFor="roomNumber" className={errors.roomNumber ? "text-destructive" : ""}>
                {t('form.roomNumber')} *
              </Label>
              <Input
                id="roomNumber"
                value={formData.roomNumber}
                onChange={(e) => handleTextChange('roomNumber', e.target.value)}
                className={errors.roomNumber ? "border-destructive" : ""}
              />
              {errors.roomNumber && (
                <p className="text-destructive text-xs">{t('form.requiredField')}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="residentName" className="font-medium">
                {t('form.residentName')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="residentName"
                value={formData.residentName}
                onChange={(e) => handleTextChange('residentName', e.target.value)}
                className={errors.residentName ? "border-red-500" : ""}
              />
              {errors.residentName && (
                <p className="text-sm text-red-500">{t('form.requiredField')}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className="font-medium">
                {t('form.residenceType')}
              </Label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="residenceType"
                    value="owner"
                    checked={formData.residenceType === 'owner'}
                    onChange={() => handleResidenceTypeChange('owner')}
                    className="h-4 w-4 text-green-600"
                  />
                  <span>{t('residenceType.owner')}</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="residenceType"
                    value="renter"
                    checked={formData.residenceType === 'renter'}
                    onChange={() => handleResidenceTypeChange('renter')}
                    className="h-4 w-4 text-green-600"
                  />
                  <span>{t('residenceType.renter')}</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold">{t('form.damageSection')}</h2>
            
            {formData.damages.filter(damage => damage.type !== 'crack').map((damage, index) => (
              <DamageForm
                key={damage.id}
                damage={damage}
                onUpdate={handleUpdateDamage}
                onDelete={handleDeleteDamage}
                onAddImage={handleAddDamageImage}
                onDeleteImage={handleDeleteDamageImage}
                index={index}
              />
            ))}
            
            <AddDamageButton onAddDamage={handleAddDamage} />
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold">{t('form.crackSection')}</h2>
            <p className="text-sm text-gray-600 mb-4">{t('form.crackDescription')}</p>
            
            {formData.damages.filter(damage => damage.type === 'crack').map((damage, index) => (
              <DamageForm
                key={damage.id}
                damage={damage}
                onUpdate={handleUpdateDamage}
                onDelete={handleDeleteDamage}
                onAddImage={handleAddDamageImage}
                onDeleteImage={handleDeleteDamageImage}
                index={index}
              />
            ))}
            
            <Button onClick={handleAddCrack} className="w-full">
              + {t('form.addCrack')}
            </Button>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleGeneratePdf}
              disabled={loading}
              className="py-2 px-6 text-lg font-semibold"
            >
              {loading ? t('form.generating') : t('form.generateReport')}
            </Button>
          </div>
        </Card>
        
        {notification.open && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
            notification.severity === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          } max-w-md`}>
            <div className="flex justify-between items-start">
              <span className="whitespace-pre-line text-sm">{notification.message}</span>
              <button 
                onClick={() => setNotification({ ...notification, open: false })} 
                className="ml-4 text-current hover:text-gray-700 flex-shrink-0"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 