import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { PhotoCameraIcon } from './ui/icons';

interface ImageUploaderProps {
  onImageSelect: (files: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const { t: originalT } = useTranslation();
  const t = originalT as unknown as (key: string, options?: any) => string;

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      onImageSelect(filesArray);
      
      // Reset input value so the same file can be selected again if removed
      event.target.value = '';
    }
  }, [onImageSelect]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="p-8 flex flex-col items-center border-2 border-dashed border-muted bg-muted/20 mb-6 cursor-pointer hover:bg-muted/30">
      <label
        htmlFor="image-upload"
        className="w-full flex flex-col items-center cursor-pointer"
      >
        <input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
        />
        <PhotoCameraIcon className="h-16 w-16 text-primary mb-4" />
        <h3 className="text-xl font-medium mb-2">
          {t('form.images')}
        </h3>
        <Button 
          size="lg"
          className="mt-4 px-6 py-2 text-lg"
        >
          {t('form.addMore')}
        </Button>
      </label>
    </Card>
  );
};

export default ImageUploader; 