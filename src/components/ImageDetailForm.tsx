import React from 'react';
import { useTranslation } from 'react-i18next';
import { DamageImage, RoomType } from '../types';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { DeleteIcon } from './ui/icons';

// กำหนด types ที่จำเป็น
type DamageExtent = 'minor' | 'moderate' | 'severe';

// สร้าง interface สำหรับ ImageDetail
interface ImageDetail extends DamageImage {
  room?: RoomType;
  damageExtent?: DamageExtent;
  damageLocation?: string;
}

interface ImageDetailFormProps {
  image: ImageDetail;
  onUpdate: (id: string, field: keyof ImageDetail, value: any) => void;
  onDelete: (id: string) => void;
  index: number;
}

const ImageDetailForm: React.FC<ImageDetailFormProps> = ({
  image,
  onUpdate,
  onDelete,
  index
}) => {
  const { t: originalT } = useTranslation();
  const t = originalT as unknown as (key: string, options?: any) => string;
  
  return (
    <Card className="mb-6 relative border overflow-visible border-border rounded-lg">
      <div className="relative">
        <img
          src={image.preview}
          alt={`Damage image ${index + 1}`}
          className="h-[200px] w-full object-contain bg-muted"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(image.id)}
          className="absolute top-2 right-2 h-8 w-8 bg-white/70 hover:bg-white/90"
          aria-label="delete image"
        >
          <DeleteIcon className="h-4 w-4" />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">
          {t('form.imageDetails')} #{index + 1}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label 
              htmlFor={`room-select-${image.id}`}
              className={!image.room ? "text-destructive" : ""}
            >
              {t('form.room')} *
            </Label>
            <select
              id={`room-select-${image.id}`}
              value={image.room || ''}
              onChange={(e) => onUpdate(image.id, 'room', e.target.value as RoomType)}
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${!image.room ? "border-destructive" : "border-input"}`}
            >
              <option value="">{t('form.selectOption')}</option>
              <option value="livingRoom">{t('rooms.livingRoom')}</option>
              <option value="bedroom">{t('rooms.bedroom')}</option>
              <option value="kitchen">{t('rooms.kitchen')}</option>
              <option value="bathroom">{t('rooms.bathroom')}</option>
              <option value="other">{t('rooms.other')}</option>
            </select>
            {!image.room && (
              <p className="text-xs text-destructive">{t('form.requiredField')}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label 
              htmlFor={`damage-extent-${image.id}`}
              className={!image.damageExtent ? "text-destructive" : ""}
            >
              {t('form.damageExtent')} *
            </Label>
            <select
              id={`damage-extent-${image.id}`}
              value={image.damageExtent || ''}
              onChange={(e) => onUpdate(image.id, 'damageExtent', e.target.value as DamageExtent)}
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${!image.damageExtent ? "border-destructive" : "border-input"}`}
            >
              <option value="">{t('form.selectOption')}</option>
              <option value="minor">{t('damageExtent.minor')}</option>
              <option value="moderate">{t('damageExtent.moderate')}</option>
              <option value="severe">{t('damageExtent.severe')}</option>
            </select>
            {!image.damageExtent && (
              <p className="text-xs text-destructive">{t('form.requiredField')}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label 
              htmlFor={`damage-location-${image.id}`}
              className={!image.damageLocation ? "text-destructive" : ""}
            >
              {t('form.damageLocation')} *
            </Label>
            <Input
              id={`damage-location-${image.id}`}
              value={image.damageLocation || ''}
              onChange={(e) => onUpdate(image.id, 'damageLocation', e.target.value)}
              className={!image.damageLocation ? "border-destructive" : ""}
            />
            {!image.damageLocation && (
              <p className="text-xs text-destructive">{t('form.requiredField')}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageDetailForm; 