import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import './App.css';
import './utils/i18n';  // Import i18n config
import LanguageSelector from './components/LanguageSelector';
import DamageForm, { AddDamageButton } from './components/DamageForm';
import { FormData, DamageDetail, DamageType, ResidenceType, RoomType } from './types';
import generatePdf from './utils/htmlToPdfGenerator';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Card } from './components/ui/card';

function App() {
  const { t: originalT, i18n } = useTranslation();
  const t = originalT as unknown as (key: string, options?: any) => string;
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  
  const [formData, setFormData] = useState<FormData>({
    roomNumber: '',
    residentName: '',
    residenceType: 'owner' as ResidenceType,
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
      // ทำให้ข้อมูลพร้อมสำหรับการสร้าง PDF
      const pdfData = {
        ...formData,
        // สร้างก๊อปปี้ของข้อมูลและทำความสะอาดข้อมูลความเสียหาย
        damages: formData.damages.map(damage => ({
          ...damage,
          // ตรวจสอบให้แน่ใจว่าทุกฟิลด์มีค่า
          type: damage.type || 'other',
          location: damage.location || '',
          description: damage.description || '',
          // กรองรูปภาพเฉพาะที่มีข้อมูลไฟล์
          images: damage.images
            .filter(img => img && img.file instanceof File)
            .map(img => ({
              ...img,
              // แนะนำให้ใช้ไฟล์ไปสร้าง base64 โดยตรงมากกว่าใช้ preview URL
              preview: '', // จะถูกสร้างใหม่ในตัว PDF generator
            }))
        }))
      };
      
      // Prepare translations for PDF
      const pdfTranslations = {
        title: 'Earthquake Damage Report',
        roomNumber: t('form.roomNumber'),
        residentName: t('form.residentName'),
        residenceType: t('form.residenceType'),
        residenceTypes: {
          owner: t('residenceType.owner'),
          renter: t('residenceType.renter'),
        },
        damages: t('form.damages'),
        damageTypes: {
          water: t('damageType.water'),
          electric: t('damageType.electric'),
          other: t('damageType.other'),
        },
        damageLocation: t('form.damageLocation'),
        damageDescription: t('form.damageDescription'),
      };
      
      console.log('Generating PDF...');
      const pdfDataUri = await generatePdf({
        formData: pdfData,
        lang: i18n.language,
        translations: pdfTranslations,
      });
      console.log('PDF generated successfully');
      
      if (!pdfDataUri) {
        throw new Error('PDF data is empty');
      }
      
      // ดาวน์โหลด PDF โดยตรง
      const fileName = `Damage_Report_${formData.roomNumber}.pdf`;
      const a = document.createElement('a');
      a.href = pdfDataUri;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setNotification({
        open: true,
        message: `PDF ${fileName} has been downloaded successfully`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      setNotification({
        open: true,
        message: `Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <LanguageSelector />
        
        <Card className="p-6 md:p-8 mb-6 rounded-lg shadow-md">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-green-700 mb-6">
            {t('app.title')}
          </h1>
          
          <div className="space-y-6 mb-8">
            <div className="space-y-2">
              <Label htmlFor="roomNumber" className="font-medium">
                {t('form.roomNumber')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="roomNumber"
                value={formData.roomNumber}
                onChange={(e) => handleTextChange('roomNumber', e.target.value)}
                className={errors.roomNumber ? "border-red-500" : ""}
              />
              {errors.roomNumber && (
                <p className="text-sm text-red-500">{t('form.requiredField')}</p>
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
          
          <h2 className="text-xl font-semibold mb-4 mt-8">
            {t('form.damages')}
          </h2>
          
          {formData.damages.length === 0 && (
            <p className="text-gray-500 italic mb-4">
              {t('form.noDamages')}
            </p>
          )}
          
          {formData.damages.map((damage, index) => (
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
          }`}>
            <div className="flex justify-between items-center">
              <span>{notification.message}</span>
              <button 
                onClick={() => setNotification({ ...notification, open: false })} 
                className="ml-4 text-current hover:text-gray-700"
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