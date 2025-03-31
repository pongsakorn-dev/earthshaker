import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font, pdf } from '@react-pdf/renderer';
import { FormData, DamageDetail } from '../types';

// ลงทะเบียนฟอนต์ไทย
Font.register({
  family: 'THSarabunNew',
  src: '/fonts/THSarabunNew.ttf',
});

Font.register({
  family: 'THSarabunNew-Bold',
  src: '/fonts/THSarabunNew-Bold.ttf',
  fontWeight: 'bold',
});

// กำหนดสไตล์ PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'THSarabunNew',
    fontSize: 14,
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(45deg)',
    fontSize: 60,
    color: 'rgba(200, 200, 200, 0.2)',
    zIndex: 0,
    textAlign: 'center',
    width: '100%',
  },
  header: {
    fontSize: 24,
    fontFamily: 'THSarabunNew-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  roomNumber: {
    fontSize: 30,
    fontFamily: 'THSarabunNew-Bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  inspectionInfo: {
    textAlign: 'right',
    fontSize: 14,
    marginVertical: 5,
  },
  damagePointInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    fontSize: 16,
  },
  infoSection: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    fontSize: 16,
  },
  infoLabel: {
    width: 170,
    fontFamily: 'THSarabunNew-Bold',
  },
  damageHeader: {
    backgroundColor: '#2e7d32',
    color: 'white',
    padding: 8,
    fontFamily: 'THSarabunNew-Bold',
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  damageTitle: {
    color: '#2e7d32',
    fontSize: 22,
    fontFamily: 'THSarabunNew-Bold',
    marginBottom: 10,
  },
  damageDetail: {
    marginBottom: 8,
    fontSize: 16,
  },
  damageLabel: {
    fontFamily: 'THSarabunNew-Bold',
    width: 170,
  },
  imageContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  image: {
    width: 350,
    height: 280,
    objectFit: 'contain',
    marginBottom: 5,
  },
  signature: {
    marginTop: 30,
    textAlign: 'center',
  },
  signatureLine: {
    width: 200,
    height: 1,
    backgroundColor: 'black',
    marginTop: 50,
    marginBottom: 5,
    alignSelf: 'center',
  },
  signatureName: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 14,
  },
  signatureDate: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 14,
  },
  paginator: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    fontSize: 12,
  },
  reporter: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 12,
    textAlign: 'right',
    fontFamily: 'THSarabunNew-Bold',
  },
  miniSignature: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    textAlign: 'right',
    fontSize: 12,
  },
  miniSignatureLine: {
    width: 150,
    height: 1,
    backgroundColor: 'black',
    marginTop: 3,
    marginBottom: 3,
    alignSelf: 'flex-end',
  }
});

// สร้างหน้า PDF สำหรับข้อมูลทั่วไป
const InfoPage = ({ formData, pageNumber, totalPages }: { formData: FormData, pageNumber: number, totalPages: number }) => (
  <Page size="A4" style={styles.page}>
    {/* ลายน้ำ */}
    <View style={styles.watermark}>
      <Text>{formData.projectName}</Text>
      <Text style={{ fontSize: 40 }}>{formData.roomNumber}</Text>
      <Text style={{ fontSize: 20 }}>ใช้สำหรับการรายงานความเสียหายของ {formData.projectName} - {formData.roomNumber} เท่านั้น</Text>
    </View>
    
    {/* หัวข้อ */}
    <Text style={styles.header}>บันทึกความเสียหายของห้องชุด</Text>
    <Text style={styles.roomNumber}>เลขที่ {formData.roomNumber}</Text>
    
    {/* ข้อมูลผู้อยู่อาศัย */}
    <View style={styles.infoSection}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>ชื่อผู้อยู่อาศัย:</Text>
        <Text>{formData.residentName}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>ประเภทที่พักอาศัย:</Text>
        <Text>{formData.residenceType === 'owner' ? 'เจ้าของห้อง' : 'ผู้เช่า'}</Text>
      </View>
    </View>
    
    {/* หัวข้อส่วนรายการความเสียหาย */}
    <Text style={styles.damageHeader}>รายการความเสียหาย</Text>
    <Text style={styles.inspectionInfo}>วันที่รายงาน: {new Date().toLocaleDateString('th-TH')}</Text>
    
    {/* แสดงเลขหน้า */}
    <Text style={styles.paginator}>หน้า {pageNumber} / {totalPages}</Text>
    
    {/* แสดงชื่อและลายเซ็นผู้รายงานที่มุมล่างขวา */}
    <View style={styles.miniSignature}>
      <Text>ลงชื่อ</Text>
      <Text>{'\n'}</Text>
      <View style={styles.miniSignatureLine} />
      <Text style={{ textAlign: 'center' }}>({formData.residentName})</Text>
      <Text>ผู้รายงานความเสียหาย</Text>
    </View>
  </Page>
);

// สร้างหน้า PDF สำหรับแต่ละจุดความเสียหาย
const DamagePage = ({ 
  damage, 
  index, 
  formData, 
  damageImages,
  pageNumber, 
  totalPages 
}: { 
  damage: DamageDetail, 
  index: number, 
  formData: FormData, 
  damageImages: string[],
  pageNumber: number, 
  totalPages: number 
}) => (
  <Page size="A4" style={styles.page}>
    {/* ลายน้ำ */}
    <View style={styles.watermark}>
      <Text>{formData.projectName}</Text>
      <Text style={{ fontSize: 40 }}>{formData.roomNumber}</Text>
      <Text style={{ fontSize: 20 }}>ใช้สำหรับการรายงานความเสียหายของ {formData.projectName} - {formData.roomNumber} เท่านั้น</Text>
    </View>
    
    {/* ข้อมูลหัวกระดาษ */}
    <View style={styles.damagePointInfo}>
      <Text>ห้องชุดเลขที่ {formData.roomNumber}</Text>
      <Text>จุดที่ {index + 1} จากทั้งหมด {formData.damages.length} จุด</Text>
    </View>
    
    {/* หัวข้อความเสียหาย */}
    <Text style={styles.damageTitle}>
      {index + 1}. {damage.type === 'water' ? 'ระบบน้ำ' : 
                  damage.type === 'electric' ? 'ระบบไฟฟ้า' : 
                  damage.type === 'crack' ? 'รอยแตกร้าว' : 'อื่นๆ'}
    </Text>
    
    {/* รายละเอียดความเสียหาย */}
    {damage.room && (
      <View style={styles.damageDetail}>
        <Text style={styles.damageLabel}>ประเภทห้อง:</Text>
        <Text>
          {damage.room === 'livingRoom' ? 'ห้องนั่งเล่น' : 
           damage.room === 'bedroom' ? 'ห้องนอน' : 
           damage.room === 'kitchen' ? 'ห้องครัว' : 
           damage.room === 'bathroom' ? 'ห้องน้ำ' : 'อื่นๆ'}
        </Text>
      </View>
    )}
    
    <View style={styles.damageDetail}>
      <Text style={styles.damageLabel}>ตำแหน่งความเสียหาย:</Text>
      <Text>{damage.location || '-'}</Text>
    </View>
    
    {damage.description && (
      <View style={styles.damageDetail}>
        <Text style={styles.damageLabel}>คำอธิบาย:</Text>
        <Text>{damage.description}</Text>
      </View>
    )}
    
    {/* รูปภาพความเสียหาย */}
    {damageImages && damageImages.length > 0 && (
      <View style={styles.imageContainer}>
        {damageImages.map((imageBase64, imgIndex) => (
          <View key={imgIndex} style={{ marginBottom: 10 }}>
            <Image src={imageBase64} style={styles.image} />
            <Text style={{ fontSize: 10, textAlign: 'center' }}>รูปภาพที่ {imgIndex + 1}</Text>
          </View>
        ))}
      </View>
    )}
    
    {/* ลายเซ็นขนาดใหญ่ (แสดงในหน้าสุดท้ายเท่านั้น) */}
    {/* {pageNumber === totalPages && (
      <View style={styles.signature}>
        <Text>ลงชื่อ</Text>
        <Text>{'\n'}</Text>
        <View style={styles.signatureLine} />
        <Text style={styles.signatureName}>({formData.residentName})</Text>
        <Text style={{ fontSize: 14, marginTop: 5 }}>ผู้รายงานความเสียหาย</Text>
        <Text style={styles.signatureDate}>วันที่ ________/________/________</Text>
      </View>
    )} */}
    
    {/* แสดงเลขหน้า */}
    <Text style={styles.paginator}>หน้า {pageNumber} / {totalPages}</Text>
    
    {/* แสดงชื่อและลายเซ็นผู้รายงานที่มุมล่างขวา */}
    <View style={styles.miniSignature}>
      <Text>ลงชื่อ</Text>
      <Text>{'\n'}</Text>
      <View style={styles.miniSignatureLine} />
      <Text style={{ textAlign: 'center' }}>({formData.residentName})</Text>
      <Text>ผู้รายงานความเสียหาย</Text>
    </View>
  </Page>
);

// สร้างเอกสาร PDF
export const generatePdf = async (formData: FormData, processedImages: { id: string; damageId: string; base64: string }[]): Promise<string> => {
  try {
    // สร้าง Document จาก React Components
    const pdfDocument = (
      <Document>
        {/* หน้าแรกแสดงข้อมูลทั่วไป */}
        <InfoPage formData={formData} pageNumber={1} totalPages={formData.damages.length + 1} />
        
        {/* หน้าต่อไปสำหรับแต่ละจุดความเสียหาย */}
        {formData.damages.map((damage, index) => {
          // หาภาพที่ตรงกับ damageId
          const damageImages = processedImages
            .filter(img => img.damageId === damage.id)
            .map(img => img.base64);
          
          return (
            <DamagePage 
              key={damage.id}
              damage={damage}
              index={index}
              formData={formData}
              damageImages={damageImages}
              pageNumber={index + 2} // เริ่มจากหน้า 2 (หน้าแรกเป็นข้อมูลทั่วไป)
              totalPages={formData.damages.length + 1}
            />
          );
        })}
      </Document>
    );
    
    // สร้าง PDF Blob
    const pdfBlob = await pdf(pdfDocument).toBlob();
    
    // แปลง Blob เป็น Data URI
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(pdfBlob);
    });
    
  } catch (error) {
    console.error('Error generating PDF with React-PDF:', error);
    throw error;
  }
};

export default generatePdf; 