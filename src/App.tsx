import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { UserCircle2, Wrench, Building2 } from 'lucide-react';
import heic2any from 'heic2any';
import { heicTo, isHeic } from 'heic-to';

import './App.css';
import './utils/i18n';  // Import i18n config
import DamageForm, { AddDamageButton } from './components/DamageForm';
import { FormData, DamageDetail, DamageType, ResidenceType, RoomType } from './types';
import generatePdf, { isSafari } from './utils/reactPdfGenerator';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Card, CardContent } from './components/ui/card';
import AppLayout from './components/AppLayout';
import NotFound from './components/NotFound';
import { FormField, FormSection } from './components/ui/layout';
import { SectionTitle } from './components/ui/typography';

// Map สำหรับเก็บข้อมูลชื่อโครงการจาก URL parameter
const projectNameMapping: Record<string, string> = {
  'kjkszppj': 'Rhythm Phahol-Ari',
};

function App() {
  const { t: originalT } = useTranslation();
  const t = originalT as unknown as (key: string, options?: any) => string;
  
  const [loading, setLoading] = useState(false);
  const [projectNotFound, setProjectNotFound] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
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
    floor: '',
    roomNumber: '',
    residentName: '',
    phoneNumber: '',
    email: '',
    residenceType: 'owner' as ResidenceType,
    otherResidenceType: '',
    projectName: '',
    damages: [],
  } as FormData);

  const [errors, setErrors] = useState({
    roomNumber: false,
    residentName: false,
    floor: false,
    phoneNumber: false,
    email: false,
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
      floor: !formData.floor.trim(),
      phoneNumber: !formData.phoneNumber.trim(),
      email: !formData.email.trim(),
    };
    
    setErrors(newErrors);
    
    // Check if all damage entries have required fields
    // ถ้าไม่มีรายการความเสียหาย ก็ถือว่าผ่านการตรวจสอบในส่วนนี้
    const allDamagesValid = formData.damages.length === 0 || formData.damages.every(
      (damage) => {
        // ตรวจสอบ room สำหรับทุกประเภทความเสียหาย
        const hasRoom = damage.room && (damage.room !== 'other' || (damage.room === 'other' && damage.otherRoom?.trim()));
        
        // ตรวจสอบ structuralDamageArea สำหรับความเสียหายเชิงโครงสร้าง
        const hasStructuralArea = damage.type !== 'structural' || 
          (damage.structuralDamageArea && 
            (damage.structuralDamageArea !== 'other' || 
              (damage.structuralDamageArea === 'other' && damage.otherStructuralDamageArea?.trim())
            )
          );
        
        return hasRoom && hasStructuralArea;
      }
    );
    
    return !newErrors.roomNumber && 
           !newErrors.residentName && 
           !newErrors.floor &&
           !newErrors.phoneNumber &&
           !newErrors.email &&
           allDamagesValid;
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

    if (field === 'floor' || field === 'phoneNumber' || field === 'email') {
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
      type: 'water' as DamageType,
      room: 'bedroom' as RoomType,
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
    const convertHeicToJpeg = async (file: File) => {
      try {
        // ตรวจสอบว่าไฟล์เป็น HEIC หรือไม่ โดยใช้ isHeic จาก heic-to
        const fileIsHeic = await isHeic(file).catch(() => false);
        
        if (fileIsHeic) {
          console.log(`Converting HEIC file: ${file.name} using heic-to`);
          try {
            // ใช้ heic-to แทน heic2any
            const jpegBlob = await heicTo({
              blob: file,
              type: 'image/jpeg',
              quality: 0.8
            });
            
            // สร้าง File object ใหม่พร้อมนามสกุล .jpg
            const newFileName = file.name.replace(/\.heic$/i, '.jpg');
            const convertedFile = new File([jpegBlob], newFileName, { type: 'image/jpeg' });
            
            console.log(`HEIC converted successfully to: ${newFileName}`);
            return {
              file: convertedFile,
              preview: URL.createObjectURL(jpegBlob)
            };
          } catch (heicToError) {
            console.error(`Error with heic-to conversion, trying heic2any as fallback: ${file.name}`, heicToError);
            
            // ใช้ heic2any เป็น fallback สำหรับไฟล์ที่ heic-to ไม่สามารถแปลงได้
            try {
              const jpegBlob = await heic2any({
                blob: file,
                toType: 'image/jpeg',
                quality: 0.8
              }) as Blob;
              
              const newFileName = file.name.replace(/\.heic$/i, '.jpg');
              const convertedFile = new File([jpegBlob], newFileName, { type: 'image/jpeg' });
              
              console.log(`HEIC converted with heic2any fallback: ${newFileName}`);
              return {
                file: convertedFile,
                preview: URL.createObjectURL(jpegBlob)
              };
            } catch (fallbackError) {
              console.error(`Both conversion methods failed for: ${file.name}`, fallbackError);
              // ถ้าทั้งสองวิธีล้มเหลว ใช้ไฟล์ต้นฉบับ
              return {
                file: file,
                preview: URL.createObjectURL(file)
              };
            }
          }
        }
        
        // สำหรับไฟล์ที่ไม่ใช่ HEIC ให้ใช้ไฟล์ต้นฉบับ
        return {
          file: file,
          preview: URL.createObjectURL(file)
        };
      } catch (error) {
        console.error(`Error checking or converting file: ${file.name}`, error);
        // ถ้าเกิดข้อผิดพลาด ใช้ไฟล์ต้นฉบับ
        return {
          file: file,
          preview: URL.createObjectURL(file)
        };
      }
    };

    // Process all files (convert if needed) and update state when all are done
    const processFiles = async () => {
      try {
        const processedFiles = await Promise.all(files.map(convertHeicToJpeg));
        
        setFormData((prev) => {
          const updatedDamages = prev.damages.map((damage) => {
            if (damage.id === damageId) {
              const newImages = processedFiles.map(({ file, preview }) => ({
                id: uuidv4(),
                file,
                name: file.name,
                preview,
              }));
              
              return {
                ...damage,
                images: [...damage.images, ...newImages],
              };
            }
            return damage;
          });
          
          return {
            ...prev,
            damages: updatedDamages,
          };
        });
      } catch (error) {
        console.error('Error processing image files:', error);
        setNotification({
          open: true,
          message: 'เกิดข้อผิดพลาดในการประมวลผลรูปภาพ',
          severity: 'error'
        });
      }
    };
    
    processFiles();
  }, [setFormData, setNotification]);
  
  const handleDeleteDamageImage = useCallback((damageId: string, imageId: string) => {
    setFormData((prev) => {
      const updatedDamages = prev.damages.map((damage) => {
        if (damage.id === damageId) {
          // Find the image to be deleted
          const imageToDelete = damage.images.find(img => img.id === imageId);
          
          // Revoke the object URL to avoid memory leaks
          if (imageToDelete?.preview) {
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
      type: 'structural' as DamageType,
      room: 'bedroom' as RoomType,
      location: '',
      description: '',
      images: [],
    };
    
    setFormData((prev) => ({
      ...prev,
      damages: [...prev.damages, newDamage],
    }));
  }, []);
  
  // แปลงไฟล์รูปภาพเป็น base64 string
  const processImages = async () => {
    const processedImages: { id: string; damageId: string; base64: string }[] = [];
    
    for (const damage of formData.damages) {
      for (const img of damage.images) {
        if (img.file) {
          try {
            // ตรวจสอบและแปลงไฟล์ HEIC เป็น JPEG ก่อนแปลงเป็น base64
            let fileToProcess = img.file;
            
            // ตรวจสอบว่าเป็นไฟล์ HEIC หรือไม่
            const fileIsHeic = await isHeic(img.file).catch(() => false);
            
            if (fileIsHeic) {
              console.log(`Converting HEIC to JPEG before processing to base64: ${img.file.name}`);
              try {
                // ใช้ heic-to แปลงเป็น JPEG
                const jpegBlob = await heicTo({
                  blob: img.file,
                  type: 'image/jpeg',
                  quality: 0.8
                });
                
                const newFileName = img.file.name.replace(/\.heic$/i, '.jpg');
                fileToProcess = new File([jpegBlob], newFileName, { type: 'image/jpeg' });
                console.log(`HEIC converted successfully before base64 conversion: ${newFileName}`);
              } catch (heicToError) {
                console.error(`Error with heic-to conversion before base64, trying heic2any: ${img.file.name}`, heicToError);
                
                // ใช้ heic2any เป็น fallback
                try {
                  const jpegBlob = await heic2any({
                    blob: img.file,
                    toType: 'image/jpeg',
                    quality: 0.8
                  }) as Blob;
                  
                  const newFileName = img.file.name.replace(/\.heic$/i, '.jpg');
                  fileToProcess = new File([jpegBlob], newFileName, { type: 'image/jpeg' });
                  console.log(`HEIC converted with heic2any before base64: ${newFileName}`);
                } catch (fallbackError) {
                  console.error(`Both conversion methods failed before base64: ${img.file.name}`, fallbackError);
                  // ใช้ไฟล์เดิมถ้าแปลงไม่สำเร็จ
                  fileToProcess = img.file;
                }
              }
            }
            
            // แปลงไฟล์เป็น base64
            const base64String = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(fileToProcess);
            });
            
            processedImages.push({
              id: img.id,
              damageId: damage.id,
              base64: base64String
            });
          } catch (error) {
            console.error('Error converting image to base64:', error);
          }
        }
      }
    }
    
    return processedImages;
  };
  
  const [pdfUrl, setPdfUrl] = useState<{ url: string; filename: string } | null>(null);
  
  const handleGeneratePdf = async () => {
    let blobUrl: string | null = null;
    
    try {
      // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
      if (!validateForm()) {
        setNotification({
          open: true,
          message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
          severity: 'error'
        });
        return;
      }

      // แสดง loading
      setLoading(true);

      // ประมวลผลรูปภาพ
      const processedImages = await processImages();

      // สร้าง PDF
      const { url, filename } = await generatePdf(formData, processedImages);
      blobUrl = url;
      
      // เก็บ URL สำหรับแสดง Link ดาวน์โหลด
      setPdfUrl({ url, filename });

      // ดาวน์โหลด PDF โดยอัตโนมัติ
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // แสดงข้อความสำเร็จพร้อมคำแนะนำ
      setNotification({
        open: true,
        message: 'สร้าง PDF สำเร็จ ระบบกำลังดาวน์โหลดไฟล์อัตโนมัติ หากไม่มีการดาวน์โหลด กรุณาคลิกที่ลิงก์ด้านล่าง',
        severity: 'success'
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      setNotification({
        open: true,
        message: 'เกิดข้อผิดพลาดในการสร้าง PDF',
        severity: 'error'
      });
      // ล้าง URL เมื่อเกิดข้อผิดพลาด
      setPdfUrl(null);
    } finally {
      setLoading(false);
    }
  };
  
  // เพิ่มฟังก์ชันสำหรับ cleanup URL เมื่อ component unmount
  useEffect(() => {
    return () => {
      if (pdfUrl?.url) {
        URL.revokeObjectURL(pdfUrl.url);
      }
    };
  }, [pdfUrl]);
  
  if (projectNotFound) {
    return <NotFound projectMapping={projectNameMapping} />;
  }
  
  return (
    <AppLayout 
      projectName={formData.projectName}
      notification={{
        ...notification,
        onClose: () => setNotification({ ...notification, open: false })
      }}
    >
      <FormSection>
        <div className="flex items-center gap-2 mb-4">
          <UserCircle2 className="w-6 h-6 text-primary" />
          <SectionTitle>{t('form.basicInfo')}</SectionTitle>
        </div>

        <Card className="mb-6 border border-border rounded-lg">
          <CardContent className="flex flex-col gap-6 p-4 lg:p-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              <FormField className='col-span-1'>
                <Label htmlFor="floor" className={errors.floor ? "text-destructive" : ""}>
                  {t('form.floor')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="floor"
                  value={formData.floor}
                  onChange={(e) => handleTextChange('floor', e.target.value)}
                  className={errors.floor ? "border-destructive" : ""}
                />
                {errors.floor && (
                  <p className="text-destructive">{t('form.requiredField')}</p>
                )}  
              </FormField>

              <FormField className='col-span-1'>
                <Label htmlFor="roomNumber" className={errors.roomNumber ? "text-destructive" : ""}>
                  {t('form.roomNumber')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="roomNumber"
                  value={formData.roomNumber}
                  onChange={(e) => handleTextChange('roomNumber', e.target.value)}
                  className={errors.roomNumber ? "border-destructive" : ""}
                />
                {errors.roomNumber && (
                  <p className="text-destructive">{t('form.requiredField')}</p>
                )}
              </FormField>

            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <FormField>
                <Label htmlFor="residentName" className="font-medium">
                  {t('form.residentName')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="residentName"
                  value={formData.residentName}
                  onChange={(e) => handleTextChange('residentName', e.target.value)}
                  className={errors.residentName ? "border-destructive" : ""}
                />
                {errors.residentName && (
                  <p className="text-destructive text-xs">{t('form.requiredField')}</p>
                )}
              </FormField>

              <FormField>
                <Label htmlFor="phoneNumber" className="font-medium">
                  {t('form.phoneNumber')} <span className="text-destructive">*</span>
                </Label>
                <Input  
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleTextChange('phoneNumber', e.target.value)}
                  className={errors.phoneNumber ? "border-destructive" : ""}
                />
              </FormField>

              <FormField>
                <Label htmlFor="email" className="font-medium">
                  {t('form.email')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleTextChange('email', e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
              </FormField>
            </div>

            <FormField className='space-y-4'>
              <Label className="font-medium">
                {t('form.residenceType')}
              </Label>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  {['owner', 'renter', 'other'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={type}
                        name="residenceType"
                        value={type}
                        checked={formData.residenceType === type}
                        onChange={(e) => handleTextChange('residenceType', e.target.value as ResidenceType)}
                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor={type} className="text-sm">
                        {t(`residenceType.${type}`)}
                      </label>
                    </div>
                  ))}
                </div>
                {formData.residenceType === 'other' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={formData.otherResidenceType}
                      onChange={(e) => handleTextChange('otherResidenceType', e.target.value)}
                      placeholder={t('form.otherResidenceType')}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                )}
              </div>
            </FormField>
          </CardContent>
        </Card>
      </FormSection>
      
      {/* Separator */}
      <div className="w-full h-[1px] bg-border my-8" />
      
      <FormSection>
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="w-6 h-6 text-primary" />
          <SectionTitle>{t('form.damageSection')}</SectionTitle>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{t('form.electricDescription')}</p>
        
        {formData.damages.filter(damage => damage.type === 'water' || damage.type === 'electric').length > 0 ? (
          // มีรายการความเสียหายระบบประปาหรือไฟฟ้า
          formData.damages.filter(damage => damage.type === 'water' || damage.type === 'electric').map((damage, index) => (
            <DamageForm
              key={damage.id}
              damage={damage}
              onUpdate={handleUpdateDamage}
              onDelete={handleDeleteDamage}
              onAddImage={handleAddDamageImage}
              onDeleteImage={handleDeleteDamageImage}
              index={index}
              isStructural={false}
            />
          ))
        ) : (
          // ไม่มีรายการความเสียหาย แสดงข้อความแนะนำ
          <div className="p-4 bg-muted rounded-lg mb-4 text-center">
            <p className="text-muted-foreground">
              ยังไม่มีรายการความเสียหายระบบประปาหรือไฟฟ้า กดปุ่มด้านล่างเพื่อเพิ่มรายการ
            </p>
          </div>
        )}
        
        <AddDamageButton onAddDamage={handleAddDamage} />
      </FormSection>

      {/* Separator */}
      <div className="w-full h-[1px] bg-border my-8" />

      <FormSection>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-6 h-6 text-primary" />
          <SectionTitle>{t('form.structuralSection')}</SectionTitle>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{t('form.structuralDescription')}</p>
        
        {formData.damages.filter(damage => damage.type === 'structural').length > 0 ? (
          // มีรายการความเสียหายโครงสร้าง
          formData.damages.filter(damage => damage.type === 'structural').map((damage, index) => (
            <DamageForm
              key={damage.id}
              damage={damage}
              onUpdate={handleUpdateDamage}
              onDelete={handleDeleteDamage}
              onAddImage={handleAddDamageImage}
              onDeleteImage={handleDeleteDamageImage}
              index={index}
              isStructural={true}
            />
          ))
        ) : (
          // ไม่มีรายการความเสียหาย แสดงข้อความแนะนำ
          <div className="p-4 bg-muted rounded-lg mb-4 text-center">
            <p className="text-muted-foreground">
              ยังไม่มีรายการความเสียหายโครงสร้าง กดปุ่มด้านล่างเพื่อเพิ่มรายการ
            </p>
          </div>
        )}
        
        <Button variant="outline" onClick={handleAddCrack} className="w-full border-primary text-primary">
          + {t('form.addStructural')}
        </Button>
      </FormSection>
      
      {/* Separator */}
      <div className="w-full h-[1px] bg-border my-8" />
      
      <div className="w-full mt-8 flex flex-col gap-4">
        {/* แสดง Link ดาวน์โหลดหลังจากสร้าง PDF */}
        {pdfUrl && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="mb-2 text-muted-foreground">หากไม่มีการดาวน์โหลดอัตโนมัติ คลิกที่ลิงก์ด้านล่าง:</p>
            <a
              href={pdfUrl.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline font-medium"
            >
              ดาวน์โหลด PDF ({pdfUrl.filename})
            </a>
          </div>
        )}

        <Button
          onClick={handleGeneratePdf}
          disabled={loading}
          size="lg"
          className="w-full py-2 px-6 text-lg font-semibold"
        >
          {loading ? t('form.generating') : t('form.generateReport')}
        </Button>
      </div>
      
    </AppLayout>
  );
}

export default App; 