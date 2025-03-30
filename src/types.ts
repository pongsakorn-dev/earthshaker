export type DamageType = 'water' | 'electric' | 'other';

export type ResidenceType = 'owner' | 'renter';

export type RoomType = 'livingRoom' | 'bedroom' | 'kitchen' | 'bathroom' | 'other';

export interface DamageImage {
  id: string;
  name?: string;
  file?: File;
  preview: string;
}

export interface DamageDetail {
  id: string;
  type: DamageType;
  room?: RoomType;
  location: string;
  description: string;
  images: DamageImage[];
  processedImages?: Array<{
    id?: string;
    base64: string;
    name?: string;
    file?: File;
  }>;
}

export interface FormData {
  roomNumber: string;
  residentName: string;
  residenceType: ResidenceType;
  damages: DamageDetail[];
}

export interface GeneratePdfOptions {
  formData: FormData;
  lang: string;
  translations: any;
}
