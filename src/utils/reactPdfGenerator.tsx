import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font, pdf } from '@react-pdf/renderer';
import { FormData, DamageDetail } from '../types';

// Register Thai fonts from local files
Font.register({
  family: 'THSarabunNew',
  fonts: [
    {
      src: '/fonts/THSarabunNew.ttf',
      fontWeight: 'normal',
      fontStyle: 'normal',
    },
    {
      src: '/fonts/THSarabunNew-Bold.ttf',
      fontWeight: 'bold',
      fontStyle: 'normal',
    },
    {
      src: '/fonts/THSarabunNew-Italic.ttf',
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
    {
      src: '/fonts/THSarabunNew-BoldItalic.ttf',
      fontWeight: 'bold',
      fontStyle: 'italic',
    }
  ]
});

// กำหนดสไตล์ PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'THSarabunNew',
    fontSize: 14,
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    opacity: 0.08,
    textAlign: 'center',
    width: '100%',
    zIndex: -1,
  },
  header: {
    fontSize: 24,
    fontFamily: 'THSarabunNew',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#2e7d32',
  },
  roomNumber: {
    fontSize: 27,
    fontFamily: 'THSarabunNew',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#2e7d32',
  },
  inspectionInfo: {
    fontSize: 12,
    marginBottom: 25,
    textAlign: 'right',
    color: '#666666',
  },
  damagePointInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 12,
    marginBottom: 20,
    borderRadius: 4,
  },
  infoSection: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    marginBottom: 30,
    border: '1 solid #e0e0e0',
  },
  infoRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoRowHalf: {
    width: '48%',
  },
  infoLabel: {
    fontFamily: 'THSarabunNew',
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
    fontSize: 14,
  },
  damageHeader: {
    backgroundColor: '#2e7d32',
    color: 'white',
    padding: 12,
    fontFamily: 'THSarabunNew',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    borderRadius: 4,
  },
  damageTitle: {
    color: '#2e7d32',
    fontSize: 21,
    fontFamily: 'THSarabunNew',
    fontWeight: 'bold',
    marginBottom: 20,
    borderBottom: '2 solid #2e7d32',
    paddingBottom: 8,
  },
  damageDetail: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    border: '1 solid #e0e0e0',
  },
  damageLabel: {
    fontFamily: 'THSarabunNew',
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
  },
  imageContainer: {
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  imageWrapper: {
    width: '100%',
    marginBottom: 25,
  },
  image: {
    width: '100%',
    height: 400,
    objectFit: 'contain',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    border: '1 solid #e0e0e0',
  },
  imageSingle: {
    width: '100%',
    height: 300,
    objectFit: 'contain',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    border: '1 solid #e0e0e0',
  },
  imageCaption: {
    fontSize: 9,
    textAlign: 'center',
    marginTop: 5,
    color: '#666666',
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
    fontSize: 12,
  },
  signatureDate: {
    marginTop: 20,
    fontSize: 11,
    color: '#666666',
  },
  paginator: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    fontSize: 11,
    color: '#666666',
  },
  reporter: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 11,
    textAlign: 'right',
    fontFamily: 'THSarabunNew',
    fontWeight: 'bold',
  },
  miniSignature: {
    position: 'absolute',
    bottom: 60,
    right: 40,
    textAlign: 'right',
    fontSize: 12,
  },
  miniSignatureLine: {
    width: 200,
    height: 1,
    backgroundColor: '#000000',
    marginVertical: 8,
    alignSelf: 'flex-end',
  },
  damageDetailsContainer: {
    marginBottom: 20,
  },
  damageDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  damageDetailHalf: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 8,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 4,
    border: '1 solid #e0e0e0',
  },
  damageDetailFull: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 8,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 4,
    border: '1 solid #e0e0e0',
  },
  signatureSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTop: '1 solid #e0e0e0',
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 40,
  },
  signatureBox: {
    alignItems: 'center',
  },
  signatureText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

// สร้างหน้า PDF สำหรับข้อมูลทั่วไป
const InfoPage = ({ formData, pageNumber, totalPages }: { formData: FormData, pageNumber: number, totalPages: number }) => (
  <Page size="A4" style={styles.page}>
    {/* ลายน้ำ */}
    <View style={styles.watermark}>
      <Text>{formData.projectName}</Text>
      <Text style={{ fontSize: 30 }}>{formData.roomNumber}</Text>
      <Text style={{ fontSize: 15 }}>ใช้สำหรับการรายงานความเสียหายของ {formData.projectName} - {formData.roomNumber} เท่านั้น</Text>
    </View>
    
    {/* หัวข้อ */}
    <Text style={styles.header}>บันทึกความเสียหายของห้องชุด</Text>
    <Text style={styles.roomNumber}>เลขที่ {formData.roomNumber} ชั้น {formData.floor}</Text>
    
    {/* ข้อมูลผู้อยู่อาศัย */}
    <View style={styles.infoSection}>
      <View style={styles.infoRowContainer}>
        <View style={styles.infoRowHalf}>
          <Text style={styles.infoLabel}>ชื่อผู้อยู่อาศัย:</Text>
          <Text>{formData.residentName}</Text>
        </View>
        
        <View style={styles.infoRowHalf}>
          <Text style={styles.infoLabel}>ประเภทที่พักอาศัย:</Text>
          <Text>{formData.residenceType === 'owner' ? 'เจ้าของห้อง' : 'ผู้เช่า'}</Text>
        </View>
      </View>

      <View style={styles.infoRowContainer}>
        <View style={styles.infoRowHalf}>
          <Text style={styles.infoLabel}>เบอร์โทรศัพท์:</Text>
          <Text>{formData.phoneNumber}</Text>
        </View>
        
        <View style={styles.infoRowHalf}>
          <Text style={styles.infoLabel}>อีเมล:</Text>
          <Text>{formData.email}</Text>
        </View>
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
      <Text style={{ fontSize: 30 }}>{formData.roomNumber}</Text>
      <Text style={{ fontSize: 15 }}>ใช้สำหรับการรายงานความเสียหายของ {formData.projectName} - {formData.roomNumber} เท่านั้น</Text>
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
                  damage.type === 'structural' ? 'ความเสียหายเชิงโครงสร้าง' : 'อื่นๆ'}
    </Text>
    
    {/* รายละเอียดความเสียหาย */}
    <View style={styles.damageDetailsContainer}>
      <View style={styles.damageDetailRow}>
        {damage.room && (
          <View style={styles.damageDetailHalf}>
            <Text style={styles.damageLabel}>ประเภทห้อง:</Text>
            <Text>
              {damage.room === 'livingRoom' ? 'ห้องนั่งเล่น' : 
               damage.room === 'bedroom' ? 'ห้องนอน' : 
               damage.room === 'kitchen' ? 'ห้องครัว' : 
               damage.room === 'bathroom' ? 'ห้องน้ำ' : 
               damage.room === 'storage' ? 'ห้องเก็บของ' :
               damage.room === 'balcony' ? 'ระเบียง' : 
               damage.room === 'other' && damage.otherRoom ? damage.otherRoom : 'อื่นๆ'}
            </Text>
          </View>
        )}

        <View style={styles.damageDetailHalf}>
          <Text style={styles.damageLabel}>ประเภทความเสียหาย:</Text>
          <Text>
            {damage.type === 'water' ? 'ระบบประปา' :
             damage.type === 'electric' ? 'ระบบไฟฟ้า' :
             damage.type === 'structural' ? 'ความเสียหายเชิงโครงสร้าง' : 'อื่นๆ'}
          </Text>
        </View>
      </View>

      {damage.type === 'structural' && damage.structuralDamageArea && (
        <View style={styles.damageDetailRow}>
          <View style={styles.damageDetailFull}>
            <Text style={styles.damageLabel}>บริเวณจุดที่ได้รับความเสียหาย:</Text>
            <Text>
              {damage.structuralDamageArea === 'ceiling' ? 'ฝ้าเพดาน' :
               damage.structuralDamageArea === 'wall' ? 'ผนัง' :
               damage.structuralDamageArea === 'floor' ? 'พื้น' :
               damage.structuralDamageArea === 'baseboard' ? 'ขอบบัวด้านล่าง' :
               damage.structuralDamageArea === 'door' ? 'ประตู' :
               damage.structuralDamageArea === 'doorFrame' ? 'วงกบประตู' : 
               damage.structuralDamageArea === 'other' && damage.otherStructuralDamageArea ? damage.otherStructuralDamageArea : 'อื่นๆ'}
            </Text>
          </View>
        </View>
      )}

      {damage.description && (
        <View style={styles.damageDetailRow}>
          <View style={styles.damageDetailFull}>
            <Text style={styles.damageLabel}>คำอธิบาย:</Text>
            <Text>{damage.description}</Text>
          </View>
        </View>
      )}
    </View>
    
    {/* รูปภาพความเสียหาย */}
    {damageImages && damageImages.length > 0 && (
      <View style={styles.imageContainer}>
        {damageImages.map((imageBase64, imgIndex) => (
          <View key={imgIndex} style={styles.imageWrapper}>
            <Image 
              src={imageBase64} 
              style={damageImages.length === 1 ? styles.imageSingle : styles.image} 
            />
            <Text style={styles.imageCaption}>รูปภาพที่ {imgIndex + 1}</Text>
          </View>
        ))}
      </View>
    )}
    
    {/* แสดงเลขหน้า */}
    <Text style={styles.paginator}>หน้า {pageNumber} / {totalPages}</Text>
    
    {/* ส่วนลายเซ็น - แสดงเมื่อมีรูปเดียวเท่านั้น */}
    {damageImages && damageImages.length === 1 && (
      <View style={styles.signatureSection}>
        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureText}>ลงชื่อ</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>({formData.residentName})</Text>
            <Text style={styles.signatureText}>ผู้รายงานความเสียหาย</Text>
          </View>
        </View>
      </View>
    )}
    
    {/* แสดงลายเซ็นแบบเดิมเมื่อมีรูปมากกว่า 1 รูป */}
    {damageImages && damageImages.length > 1 && (
      <View style={styles.miniSignature}>
        <Text>ลงชื่อ</Text>
        <Text>{'\n'}</Text>
        <View style={styles.miniSignatureLine} />
        <Text style={{ textAlign: 'center' }}>({formData.residentName})</Text>
        <Text>ผู้รายงานความเสียหาย</Text>
      </View>
    )}
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