export type DamageType = 'water' | 'electric' | 'structural' | 'other';

export type ResidenceType = 'owner' | 'renter' | 'company' | 'other';

export type RoomType = 'livingRoom' | 'bedroom' | 'kitchen' | 'bathroom' | 'storage' | 'balcony' | 'other';

export type StructuralDamageArea = 'ceiling' | 'wall' | 'floor' | 'baseboard' | 'door' | 'doorFrame' | 'other';

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
  otherRoom?: string;
  location: string;
  description: string;
  images: DamageImage[];
  structuralDamageArea?: StructuralDamageArea;
  otherStructuralDamageArea?: string;
  processedImages?: Array<{
    id?: string;
    base64: string;
    name?: string;
    file?: File;
  }>;
}

export interface FormData {
  floor: string;
  roomNumber: string;
  residentName: string;
  phoneNumber: string;
  email: string;
  residenceType: ResidenceType;
  otherResidenceType: string;
  projectName: string;
  reportDate: Date;
  damages: DamageDetail[];
}

export interface GeneratePdfOptions {
  formData: FormData;
  lang: string;
  translations: Record<string, string>;
}
