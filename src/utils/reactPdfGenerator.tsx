import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font, pdf } from '@react-pdf/renderer';
import { FormData, DamageDetail } from '../types';

// ฟังก์ชันการแปลงวันที่เป็นรูปแบบไทย
const formatDateToThai = (date: Date): string => {
  if (!date) return '';
  
  // เปลี่ยนเป็นรูปแบบ DD/MM/YY
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2); // เอาเฉพาะ 2 หลักสุดท้าย
  
  return `${day}/${month}/${year}`;
};

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
    color: '#3f51b5',
  },
  roomNumber: {
    fontSize: 27,
    fontFamily: 'THSarabunNew',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#3f51b5',
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
    color: '#3f51b5',
    marginBottom: 4,
    fontSize: 14,
  },
  damageHeader: {
    backgroundColor: '#3f51b5',
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
    color: '#3f51b5',
    fontSize: 21,
    fontFamily: 'THSarabunNew',
    fontWeight: 'bold',
    marginBottom: 20,
    borderBottom: '2 solid #3f51b5',
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
    color: '#3f51b5',
    marginBottom: 4,
  },
  imageContainer: {
    marginTop: 15,
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'column',
  },
  imageWrapper: {
    width: '100%',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 180,
    objectFit: 'contain',
  },
  imageSingle: {
    width: '100%',
    height: 220,
    objectFit: 'contain',
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
    marginTop: 40,
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
    marginBottom: 10,
  },
  damageDetailHalf: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 4,
    border: '1 solid #e0e0e0',
  },
  damageDetailFull: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 4,
    border: '1 solid #e0e0e0',
  },
  signatureSection: {
    marginTop: 15,
    paddingTop: 15,
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
  imageStructural: {
    width: '100%',
    height: 180,
    objectFit: 'contain',
  },
  projectHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3f51b5',
    marginBottom: 5,
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
    <Text style={styles.projectHeader}>{formData.projectName}</Text>
    <Text style={styles.header}>บันทึกความเสียหายของห้องชุด</Text>
    <Text style={styles.roomNumber}>ชั้น {formData.floor} เลขที่ {formData.roomNumber}</Text>
    
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
    <Text style={styles.inspectionInfo}>วันที่รายงาน: {formData.reportDate ? formatDateToThai(formData.reportDate) : formatDateToThai(new Date())}</Text>
    
    {/* แสดงเลขหน้า */}
    <Text style={styles.paginator}>หน้า {pageNumber} / {totalPages}</Text>
    
    {/* ส่วนลายเซ็น - ปรับให้เหมือนกับหน้าอื่นๆ */}
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
}) => {
  // แยกรูปภาพเป็น 2 ส่วน: รูปแรกและรูปที่เหลือ
  const firstImage = damageImages[0];
  const remainingImages = damageImages.slice(1);

  // คำนวณจำนวนหน้าที่จำเป็นสำหรับรูปที่เหลือ (3 รูปต่อหน้าตามที่ต้องการ)
  const remainingPages = Math.ceil(remainingImages.length / 3);
  
  // สร้าง array เพื่อรวบรวมหน้าทั้งหมด
  const pages = [];
  
  // เพิ่มหน้าหลักแสดงรายละเอียดและรูปแรก
  pages.push(
    <Page key={`main-${damage.id}`} size="A4" style={styles.page}>
      {/* ลายน้ำ */}
      <View style={styles.watermark}>
        <Text>{formData.projectName}</Text>
        <Text style={{ fontSize: 30 }}>{formData.roomNumber}</Text>
        <Text style={{ fontSize: 15 }}>ใช้สำหรับการรายงานความเสียหายของ {formData.projectName} - {formData.roomNumber} เท่านั้น</Text>
      </View>
      
      {/* ข้อมูลหัวกระดาษ */}
      <Text style={styles.projectHeader}>{formData.projectName}</Text>
      <View style={styles.damagePointInfo}>
        <Text>ชั้น {formData.floor} เลขที่ {formData.roomNumber}</Text>
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
        <View style={[styles.damageDetailRow, { marginBottom: damage.type === 'structural' ? 8 : 10 }]}>
          {damage.room && (
            <View style={styles.damageDetailHalf}>
              <Text style={[styles.damageLabel, { marginBottom: damage.type === 'structural' ? 2 : 4 }]}>ประเภทห้อง:</Text>
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
            <Text style={[styles.damageLabel, { marginBottom: damage.type === 'structural' ? 2 : 4 }]}>ประเภทความเสียหาย:</Text>
            <Text>
              {damage.type === 'water' ? 'ระบบประปา' :
               damage.type === 'electric' ? 'ระบบไฟฟ้า' :
               damage.type === 'structural' ? 'ความเสียหายเชิงโครงสร้าง' : 'อื่นๆ'}
            </Text>
          </View>
        </View>

        {damage.type === 'structural' && damage.structuralDamageArea && (
          <View style={[styles.damageDetailRow, { marginBottom: 8 }]}>
            <View style={styles.damageDetailFull}>
              <Text style={[styles.damageLabel, { marginBottom: 2 }]}>บริเวณจุดที่ได้รับความเสียหาย:</Text>
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
          <View style={[styles.damageDetailRow, { marginBottom: damage.type === 'structural' ? 8 : 10 }]}>
            <View style={styles.damageDetailFull}>
              <Text style={[styles.damageLabel, { marginBottom: damage.type === 'structural' ? 2 : 4 }]}>คำอธิบาย:</Text>
              <Text>{damage.description}</Text>
            </View>
          </View>
        )}
      </View>
      
      {/* รูปภาพแรก */}
      {firstImage && (
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image 
              src={firstImage} 
              style={damage.type === 'structural' ? styles.imageStructural : styles.imageSingle}
            />
            <Text style={styles.imageCaption}>รูปภาพที่ 1</Text>
          </View>
        </View>
      )}
      
      {/* แสดงเลขหน้า */}
      <Text style={styles.paginator}>หน้า {pageNumber} / {totalPages}</Text>
      
      {/* ส่วนลายเซ็น */}
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
    </Page>
  );

  // สร้างหน้ารูปภาพเพิ่มเติม
  for (let pageIdx = 0; pageIdx < remainingPages; pageIdx++) {
    const startImageIdx = pageIdx * 3;
    const imagesForPage = remainingImages.slice(startImageIdx, startImageIdx + 3);
    
    if (imagesForPage.length > 0) {
      pages.push(
        <Page key={`images-${damage.id}-${pageIdx}`} size="A4" style={styles.page}>
          {/* ลายน้ำ */}
          <View style={styles.watermark}>
            <Text>{formData.projectName}</Text>
            <Text style={{ fontSize: 30 }}>{formData.roomNumber}</Text>
            <Text style={{ fontSize: 15 }}>ใช้สำหรับการรายงานความเสียหายของ {formData.projectName} - {formData.roomNumber} เท่านั้น</Text>
          </View>

          {/* ข้อมูลหัวกระดาษ */}
          <Text style={styles.projectHeader}>{formData.projectName}</Text>
          <View style={styles.damagePointInfo}>
            <Text>ชั้น {formData.floor} เลขที่ {formData.roomNumber}</Text>
            <Text>จุดที่ {index + 1} จากทั้งหมด {formData.damages.length} จุด</Text>
            <Text>รูปภาพเพิ่มเติม</Text>
          </View>

          {/* รูปภาพ (3 รูปต่อหน้า) */}
          <View style={styles.imageContainer}>
            {imagesForPage.map((img, idx) => (
              <View key={idx} style={styles.imageWrapper}>
                <Image 
                  src={img} 
                  style={styles.image}
                />
                <Text style={styles.imageCaption}>รูปภาพที่ {startImageIdx + idx + 2}</Text>
              </View>
            ))}
          </View>

          {/* แสดงเลขหน้า */}
          <Text style={styles.paginator}>หน้า {pageNumber + pageIdx + 1} / {totalPages}</Text>
        </Page>
      );
    }
  }
  
  return <>{pages}</>;
};

// เพิ่มฟังก์ชันตรวจสอบ Safari browser
const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

// สร้างเอกสาร PDF
export const generatePdf = async (formData: FormData, processedImages: { id: string; damageId: string; base64: string }[]): Promise<{ url: string; filename: string }> => {
  try {
    // ข้อมูลหน้าสำหรับแต่ละ damage
    const damagePageInfo: { damageId: string; mainPage: number; additionalPages: number }[] = [];
    let currentPage = 2; // เริ่มจากหน้า 2 (หน้าแรกคือ InfoPage)
    
    // คำนวณจำนวนหน้าและเลขหน้าแรกของแต่ละ damage
    formData.damages.forEach(damage => {
      const damageImages = processedImages.filter(img => img.damageId === damage.id);
      const additionalPages = damageImages.length > 1 
        ? Math.ceil((damageImages.length - 1) / 3) 
        : 0;
        
      damagePageInfo.push({
        damageId: damage.id,
        mainPage: currentPage,
        additionalPages: additionalPages
      });
      
      // เพิ่มหน้าสำหรับ damage นี้ (1 หน้าหลัก + N หน้ารูปภาพเพิ่มเติม)
      currentPage += 1 + additionalPages;
    });
    
    // จำนวนหน้าทั้งหมด = หน้าแรก (InfoPage) + หน้า damage ทั้งหมด
    const totalPages = currentPage - 1;
    
    // สร้าง Document จาก React Components
    const pdfDocument = (
      <Document>
        <InfoPage formData={formData} pageNumber={1} totalPages={totalPages} />
        
        {formData.damages.map((damage, index) => {
          const pageInfo = damagePageInfo.find(info => info.damageId === damage.id);
          const damageImages = processedImages
            .filter(img => img.damageId === damage.id)
            .map(img => img.base64);
          
          if (!pageInfo) {
            console.error(`No page info found for damage ${damage.id}`);
            return null;
          }
          
          return (
            <DamagePage 
              key={damage.id}
              damage={damage}
              index={index}
              formData={formData}
              damageImages={damageImages}
              pageNumber={pageInfo.mainPage}
              totalPages={totalPages}
            />
          );
        })}
      </Document>
    );
    
    // สร้าง PDF Blob
    const pdfBlob = await pdf(pdfDocument).toBlob();
    
    // สร้างชื่อไฟล์ตามรูปแบบใหม่: ชื่อโครงการ_ชั้นF_เลขห้อง.pdf
    const filename = `${formData.projectName}_${formData.floor}F_${formData.roomNumber}.pdf`;
    
    // สร้าง Blob URL
    const url = URL.createObjectURL(pdfBlob);
    
    return { url, filename };
    
  } catch (error) {
    console.error('Error generating PDF with React-PDF:', error);
    throw error;
  }
};

export { isSafari };
export default generatePdf; 