import React from 'react';
import { useTranslation } from 'react-i18next';
import { DamageDetail, DamageType, RoomType } from '../types';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { DeleteIcon, AddPhotoIcon } from './ui/icons';

interface DamageFormProps {
  damage: DamageDetail;
  onUpdate: (id: string, updatedDamage: Partial<DamageDetail>) => void;
  onDelete: (id: string) => void;
  onAddImage: (damageId: string, files: File[]) => void;
  onDeleteImage: (damageId: string, imageId: string) => void;
  index: number;
}

const DamageForm: React.FC<DamageFormProps> = ({
  damage,
  onUpdate,
  onDelete,
  onAddImage,
  onDeleteImage,
  index
}) => {
  const { t: originalT } = useTranslation();
  const t = originalT as unknown as (key: string, options?: any) => string;
  
  const handleDamageTypeChange = (type: DamageType, checked: boolean) => {
    onUpdate(damage.id, { type: checked ? type : 'other' });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      onAddImage(damage.id, filesArray);
      
      // Reset input value so the same file can be selected again if removed
      event.target.value = '';
    }
  };

  // สร้างรายการประเภทห้องสำหรับ select
  const roomOptions = [
    { value: 'livingRoom', label: t('rooms.livingRoom') },
    { value: 'bedroom', label: t('rooms.bedroom') },
    { value: 'kitchen', label: t('rooms.kitchen') },
    { value: 'bathroom', label: t('rooms.bathroom') },
    { value: 'other', label: t('rooms.other') },
  ];
  
  return (
    <Card className="mb-6 border border-border rounded-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {t('form.damageDetails')} #{index + 1}
          </h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(damage.id)}
            className="h-8 w-8 text-destructive"
            aria-label="delete damage"
          >
            <DeleteIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`water-${damage.id}`}
                checked={damage.type === 'water'} 
                onCheckedChange={(checked) => handleDamageTypeChange('water', checked === true)}
              />
              <Label htmlFor={`water-${damage.id}`}>{t('damageType.water')}</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`electric-${damage.id}`}
                checked={damage.type === 'electric'} 
                onCheckedChange={(checked) => handleDamageTypeChange('electric', checked === true)}
              />
              <Label htmlFor={`electric-${damage.id}`}>{t('damageType.electric')}</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`crack-${damage.id}`}
                checked={damage.type === 'crack'} 
                onCheckedChange={(checked) => handleDamageTypeChange('crack', checked === true)}
              />
              <Label htmlFor={`crack-${damage.id}`}>{t('damageType.crack')}</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`other-${damage.id}`}
                checked={damage.type === 'other'} 
                onCheckedChange={(checked) => handleDamageTypeChange('other', checked === true)}
              />
              <Label htmlFor={`other-${damage.id}`}>{t('damageType.other')}</Label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`room-type-${damage.id}`}>{t('form.room')}</Label>
              <select
                id={`room-type-${damage.id}`}
                value={damage.room || ''}
                onChange={(e) => onUpdate(damage.id, { room: e.target.value as RoomType })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">{t('Select Room')}</option>
                {roomOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`location-${damage.id}`}>{t('form.damageLocation')} *</Label>
              <Input
                id={`location-${damage.id}`}
                value={damage.location}
                onChange={(e) => onUpdate(damage.id, { location: e.target.value })}
                required
                className={!damage.location ? "border-destructive" : ""}
              />
              {!damage.location && (
                <p className="text-xs text-destructive mt-1">{t('form.requiredField')}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`description-${damage.id}`}>{t('form.damageDescription')}</Label>
            <Textarea
              id={`description-${damage.id}`}
              value={damage.description}
              onChange={(e) => onUpdate(damage.id, { description: e.target.value })}
              rows={3}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">
            {t('form.images')} ({damage.images.length})
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {damage.images.map((image) => (
              <div key={image.id} className="relative h-[120px] border border-border rounded overflow-hidden">
                <img
                  src={image.preview}
                  alt="Damage"
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteImage(damage.id, image.id)}
                  className="absolute top-1 right-1 h-6 w-6 bg-white/70 hover:bg-white/90"
                  aria-label="delete image"
                >
                  <DeleteIcon className="h-3 w-3" />
                </Button>
              </div>
            ))}
            
            <label
              htmlFor={`damage-image-upload-${damage.id}`}
              className="flex flex-col items-center justify-center h-[120px] border-2 border-dashed border-muted rounded cursor-pointer hover:bg-muted/20"
            >
              <input
                id={`damage-image-upload-${damage.id}`}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
              <AddPhotoIcon className="h-8 w-8 text-primary mb-2" />
              <span className="text-xs text-center">{t('form.addImages')}</span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export interface AddDamageButtonProps {
  onAddDamage: () => void;
}

export const AddDamageButton: React.FC<AddDamageButtonProps> = ({ onAddDamage }) => {
  const { t: originalT } = useTranslation();
  const t = originalT as unknown as (key: string, options?: any) => string;
  
  return (
    <Button 
      onClick={onAddDamage}
      className="w-full"
    >
      + {t('form.addDamage')}
    </Button>
  );
};

export default DamageForm; 