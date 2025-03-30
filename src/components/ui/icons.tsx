import React from 'react';
import { Trash, Image, Camera } from 'lucide-react';

export const DeleteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Trash {...props} />
);

export const AddPhotoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Image {...props} />
);

export const PhotoCameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Camera {...props} />
); 