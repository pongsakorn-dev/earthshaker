export type RoomType = 'livingRoom' | 'bedroom' | 'kitchen' | 'bathroom' | 'other';

export type DamageExtent = 'minor' | 'moderate' | 'severe';

export type ResidenceType = 'owner' | 'renter';

export type DamageType = 'water' | 'electric' | 'other';

export interface DamageDetail {
  id: string;
  type: DamageType;
  location: string;
  description: string;
  images: {
    id: string;
    file: File;
    preview: string;
  }[];
}

export interface ImageDetail {
  id: string;
  file: File;
  preview: string;
  room: RoomType;
  damageLocation: string;
  damageExtent: DamageExtent;
}

export interface FormData {
  roomNumber: string;
  residentName: string;
  residenceType: ResidenceType;
  damages: DamageDetail[];
  images: ImageDetail[];
} 