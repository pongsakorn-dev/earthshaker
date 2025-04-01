import React from 'react';
import { useTranslation } from 'react-i18next';
import { DamageDetail, DamageType, RoomType, StructuralDamageArea } from '../types';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { DeleteIcon, AddPhotoIcon } from './ui/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

interface DamageFormProps {
  damage: DamageDetail;
  onUpdate: (id: string, updatedDamage: Partial<DamageDetail>) => void;
  onDelete: (id: string) => void;
  onAddImage: (damageId: string, files: File[]) => void;
  onDeleteImage: (damageId: string, imageId: string) => void;
  index: number;
  isStructural: boolean;
}

const DamageForm: React.FC<DamageFormProps> = ({
  damage,
  onUpdate,
  onDelete,
  onAddImage,
  onDeleteImage,
  index,
  isStructural
}) => {
  const { t: originalT } = useTranslation();
  const t = originalT as unknown as (key: string, options?: any) => string;
  
  const handleDamageTypeChange = (type: DamageType, checked: boolean) => {
    onUpdate(damage.id, { 
      type: checked ? type : 'other',
      structuralDamageArea: undefined
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      onAddImage(damage.id, filesArray);
      event.target.value = '';
    }
  };

  const roomOptions = [
    { value: 'livingRoom', label: t('rooms.livingRoom') },
    { value: 'bedroom', label: t('rooms.bedroom') },
    { value: 'kitchen', label: t('rooms.kitchen') },
    { value: 'bathroom', label: t('rooms.bathroom') },
    { value: 'storage', label: t('rooms.storage') },
    { value: 'balcony', label: t('rooms.balcony') },
    { value: 'other', label: t('rooms.other') },
  ];

  const structuralDamageAreaOptions = [
    { value: 'ceiling', label: t('structuralDamageArea.ceiling') },
    { value: 'wall', label: t('structuralDamageArea.wall') },
    { value: 'floor', label: t('structuralDamageArea.floor') },
    { value: 'baseboard', label: t('structuralDamageArea.baseboard') },
    { value: 'door', label: t('structuralDamageArea.door') },
    { value: 'doorFrame', label: t('structuralDamageArea.doorFrame') },
    { value: 'other', label: t('structuralDamageArea.other') },
  ];
  
  return (
    <Card className="mb-6 border border-border rounded-lg">
      <CardContent className="flex flex-col gap-6 p-6">
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
          {!isStructural && (
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
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('form.room')}</Label>
              <Select
                value={damage.room || ''}
                onValueChange={(value) => onUpdate(damage.id, { room: value as RoomType })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('Select Room')} />
                </SelectTrigger>
                <SelectContent>
                  {roomOptions.map(option => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="text-base py-3"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {damage.room === 'other' && (
                <div className="mt-2">
                  <Input
                    placeholder={t('form.specifyRoom')}
                    value={damage.otherRoom || ''}
                    onChange={(e) => onUpdate(damage.id, { otherRoom: e.target.value })}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {isStructural && (
              <div className="space-y-2">
                <Label>{t('form.structuralDamageArea')}</Label>
                <Select
                  value={damage.structuralDamageArea || ''}
                  onValueChange={(value) => onUpdate(damage.id, { structuralDamageArea: value as StructuralDamageArea })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('Select Area')} />
                  </SelectTrigger>
                  <SelectContent>
                    {structuralDamageAreaOptions.map(option => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="text-base py-3"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {damage.structuralDamageArea === 'other' && (
                  <div className="mt-2">
                    <Input
                      placeholder={t('form.specifyArea')}
                      value={damage.otherStructuralDamageArea || ''}
                      onChange={(e) => onUpdate(damage.id, { otherStructuralDamageArea: e.target.value })}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            )}
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
            
            <div className="relative h-[120px] border-2 border-dashed border-border rounded-lg flex items-center justify-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Add images"
              />
              <div className="flex flex-col items-center gap-2">
                <AddPhotoIcon className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t('form.addImages')}</span>
              </div>
            </div>
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
      variant="outline"
      className="w-full border-primary text-primary"
    >
      + {t('form.addDamage')}
    </Button>
  );
};

export default DamageForm; 