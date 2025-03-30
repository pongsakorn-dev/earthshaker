import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FormData, DamageDetail } from '../types';

interface GeneratePdfOptions {
  formData: FormData;
  lang: string;
  translations: any;
}

/**
 * แปลงไฟล์รูปภาพเป็น Base64
 */
const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      console.error('Error converting image:', error);
      reject('Error converting image');
    };
    reader.readAsDataURL(file);
  });
};

/**
 * สร้าง PDF จาก HTML ในหน้าเว็บ
 */
export const generatePdf = async ({ formData, lang, translations }: GeneratePdfOptions): Promise<string> => {
  try {
    console.log('Starting HTML to PDF conversion process...');
    
    // เตรียมรูปภาพ
    const processedImages: { id: string; damageId: string; base64: string }[] = [];
    for (const damage of formData.damages) {
      if (damage.images && damage.images.length > 0) {
        for (const img of damage.images) {
          if (img.file) {
            try {
              const base64 = await convertImageToBase64(img.file);
              processedImages.push({
                id: img.id,
                damageId: damage.id,
                base64
              });
            } catch (error) {
              console.error('Error processing image:', error);
            }
          }
        }
      }
    }
    
    // สร้าง HTML element สำหรับแสดงผล PDF
    const pdfContent = document.createElement('div');
    pdfContent.style.width = '794px'; // A4 width in pixels (approximately)
    pdfContent.style.padding = '20px'; // ลดขนาด padding ลงเพื่อให้มีพื้นที่ใช้สอยมากขึ้น
    pdfContent.style.fontFamily = "'Helvetica Neue', Arial, sans-serif";
    pdfContent.style.position = 'absolute';
    pdfContent.style.left = '-9999px';
    pdfContent.style.top = '0';
    
    // เพิ่ม CSS สำหรับ PDF content
    const style = document.createElement('style');
    style.textContent = `
      .pdf-page {
        background-color: white;
        margin-bottom: 20px;
        padding: 20px; /* ลดขนาด padding */
        position: relative; /* เพื่อรองรับลายน้ำ */
        word-break: keep-all; /* ป้องกันการตัดคำภาษาไทย */
        hyphens: none; /* ป้องกันการใช้ยัติภังค์ */
        font-size: 14px; /* ลดขนาดฟอนต์เล็กน้อยเพื่อให้ข้อความพอดีกับพื้นที่ */
      }
      .pdf-watermark {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-30deg);
        font-size: 150px;
        color: rgba(200, 200, 200, 0.15);
        font-weight: bold;
        user-select: none;
        pointer-events: none;
        z-index: 0;
        font-family: Arial, sans-serif;
        white-space: nowrap;
        letter-spacing: 10px;
        width: 100%;
        text-align: center;
      }
      .pdf-header {
        color: #2e7d32;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px; /* ลดระยะห่าง */
        position: relative; /* เพื่อให้อยู่ข้างบนลายน้ำ */
        z-index: 1;
      }
      .pdf-info {
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 15px; /* ลดระยะห่าง */
        position: relative;
        z-index: 1;
      }
      .pdf-info-row {
        margin-bottom: 8px; /* ลดระยะห่าง */
      }
      .pdf-info-label {
        font-weight: bold;
        display: inline-block;
        width: 170px;
        white-space: nowrap;
      }
      .pdf-section-header {
        background-color: #2e7d32;
        color: white;
        padding: 5px 10px;
        margin: 15px 0 8px 0; /* ลดระยะห่าง */
        text-align: center;
        position: relative;
        z-index: 1;
      }
      .pdf-damage-item {
        margin-bottom: 12px; /* ลดระยะห่าง */
        padding-bottom: 12px; /* ลดระยะห่าง */
        border-bottom: 1px solid #ddd;
        position: relative;
        z-index: 1;
      }
      .pdf-damage-title {
        color: #2e7d32;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px; /* ลดระยะห่าง */
      }
      .pdf-damage-detail {
        margin-bottom: 4px; /* ลดระยะห่าง */
      }
      .pdf-damage-detail-label {
        font-weight: bold;
        display: inline-block;
        width: 170px;
        white-space: nowrap;
      }
      .pdf-images {
        display: flex;
        flex-wrap: wrap;
        gap: 8px; /* ลดระยะห่าง */
        margin-top: 8px; /* ลดระยะห่าง */
      }
      .pdf-image {
        width: 180px; /* ลดขนาดรูปเล็กน้อย */
        height: 140px; /* ลดขนาดรูปเล็กน้อย */
        object-fit: cover;
      }
      .pdf-signature {
        margin-top: 30px; /* ลดระยะห่าง */
        text-align: center;
        position: relative;
        z-index: 1;
      }
      .pdf-signature-line {
        width: 250px;
        border-bottom: 1px solid black;
        margin: 40px auto 8px auto; /* ลดระยะห่าง */
      }
      .pdf-signature-name {
        margin-bottom: 15px; /* ลดระยะห่าง */
      }
      .pdf-signature-date {
        margin-top: 15px; /* ลดระยะห่าง */
      }
      /* เพิ่ม style ใหม่สำหรับข้อความที่ไม่ควรตัดคำ */
      .pdf-no-break {
        white-space: nowrap;
      }
    `;
    pdfContent.appendChild(style);
    
    // สร้างเนื้อหา PDF
    const content = document.createElement('div');
    content.className = 'pdf-page';
    
    // เพิ่มลายน้ำ
    const watermark = document.createElement('div');
    watermark.className = 'pdf-watermark';
    watermark.textContent = 'RHYTHM';
    content.appendChild(watermark);
    
    // เพิ่มลายน้ำเพิ่มเติมบนและล่าง
    const watermarkTop = document.createElement('div');
    watermarkTop.className = 'pdf-watermark';
    watermarkTop.textContent = 'RHYTHM';
    watermarkTop.style.top = '25%';
    content.appendChild(watermarkTop);
    
    const watermarkBottom = document.createElement('div');
    watermarkBottom.className = 'pdf-watermark';
    watermarkBottom.textContent = 'RHYTHM';
    watermarkBottom.style.top = '75%';
    content.appendChild(watermarkBottom);
    
    // หัวข้อ
    const header = document.createElement('div');
    header.className = 'pdf-header';
    
    // ใช้ innerHTML แทน textContent เพื่อให้สามารถจัดรูปแบบได้
    header.innerHTML = `บันทึกความเสียหายของห้องชุด<br/><span style="font-size: 32px; display: block; margin-top: 10px;">เลขที่ ${formData.roomNumber}</span>`;
    
    content.appendChild(header);
    
    // ข้อมูลห้องและผู้อยู่อาศัย
    const infoBox = document.createElement('div');
    infoBox.className = 'pdf-info';
    
    // Resident Name
    const nameRow = document.createElement('div');
    nameRow.className = 'pdf-info-row';
    const nameLabel = document.createElement('span');
    nameLabel.className = 'pdf-info-label pdf-no-break';
    // ใช้ภาษาไทยเสมอสำหรับป้ายกำกับ
    nameLabel.textContent = 'ชื่อผู้อยู่อาศัย:';
    nameRow.appendChild(nameLabel);
    
    const name = document.createElement('span');
    name.textContent = formData.residentName; // คงค่าที่ผู้ใช้กรอกตามเดิม
    name.style.wordBreak = 'normal';
    nameRow.appendChild(name);
    infoBox.appendChild(nameRow);
    
    // Residence Type
    const typeRow = document.createElement('div');
    typeRow.className = 'pdf-info-row';
    const typeLabel = document.createElement('span');
    typeLabel.className = 'pdf-info-label pdf-no-break';
    // ใช้ภาษาไทยเสมอสำหรับป้ายกำกับ
    typeLabel.textContent = 'ประเภทที่พักอาศัย:';
    typeRow.appendChild(typeLabel);
    
    const type = document.createElement('span');
    // ใช้ภาษาไทยเสมอสำหรับค่าที่แปลได้
    type.textContent = formData.residenceType === 'owner' ? 'เจ้าของห้อง' : 'ผู้เช่า';
    type.style.wordBreak = 'normal';
    typeRow.appendChild(type);
    infoBox.appendChild(typeRow);
    
    content.appendChild(infoBox);
    
    // หัวข้อรายการความเสียหาย
    const damageHeader = document.createElement('div');
    damageHeader.className = 'pdf-section-header';
    // ใช้ภาษาไทยเสมอสำหรับหัวข้อส่วน
    damageHeader.textContent = 'รายการความเสียหาย';
    content.appendChild(damageHeader);
    
    // แสดงรายการความเสียหาย
    formData.damages.forEach((damage, index) => {
      const damageItem = document.createElement('div');
      damageItem.className = 'pdf-damage-item';
      
      // หัวข้อความเสียหาย
      const damageTitle = document.createElement('div');
      damageTitle.className = 'pdf-damage-title';
      
      // แปลงประเภทความเสียหาย (ใช้ภาษาไทยเสมอ)
      let damageTypeText = damage.type === 'water' ? 'ระบบน้ำ' : 
                          damage.type === 'electric' ? 'ระบบไฟฟ้า' : 'อื่นๆ';
      
      damageTitle.textContent = `${index + 1}. ${damageTypeText}`;
      damageItem.appendChild(damageTitle);
      
      // ประเภทห้อง
      if (damage.room) {
        const roomTypeRow = document.createElement('div');
        roomTypeRow.className = 'pdf-damage-detail';
        
        const roomTypeLabel = document.createElement('span');
        roomTypeLabel.className = 'pdf-damage-detail-label pdf-no-break';
        // ใช้ภาษาไทยเสมอสำหรับป้ายกำกับ
        roomTypeLabel.textContent = 'ประเภทห้อง:';
        roomTypeRow.appendChild(roomTypeLabel);
        
        const roomType = document.createElement('span');
        roomType.style.wordBreak = 'normal';
        
        // แปลงประเภทห้อง (ใช้ภาษาไทยเสมอ)
        let roomTypeText = damage.room === 'livingRoom' ? 'ห้องนั่งเล่น' : 
                         damage.room === 'bedroom' ? 'ห้องนอน' : 
                         damage.room === 'kitchen' ? 'ห้องครัว' : 
                         damage.room === 'bathroom' ? 'ห้องน้ำ' : 'อื่นๆ';
        
        roomType.textContent = roomTypeText;
        roomTypeRow.appendChild(roomType);
        damageItem.appendChild(roomTypeRow);
      }
      
      // ตำแหน่งความเสียหาย
      const locationRow = document.createElement('div');
      locationRow.className = 'pdf-damage-detail';
      
      const locationLabel = document.createElement('span');
      locationLabel.className = 'pdf-damage-detail-label pdf-no-break';
      // ใช้ภาษาไทยเสมอสำหรับป้ายกำกับ
      locationLabel.textContent = 'ตำแหน่งความเสียหาย:';
      locationRow.appendChild(locationLabel);
      
      const location = document.createElement('span');
      location.textContent = damage.location || '-'; // คงค่าที่ผู้ใช้กรอกตามเดิม
      location.style.wordBreak = 'normal';
      locationRow.appendChild(location);
      damageItem.appendChild(locationRow);
      
      // คำอธิบายความเสียหาย
      if (damage.description) {
        const descRow = document.createElement('div');
        descRow.className = 'pdf-damage-detail';
        
        const descLabel = document.createElement('span');
        descLabel.className = 'pdf-damage-detail-label pdf-no-break';
        // ใช้ภาษาไทยเสมอสำหรับป้ายกำกับ
        descLabel.textContent = 'คำอธิบาย:';
        descRow.appendChild(descLabel);
        
        const desc = document.createElement('span');
        desc.textContent = damage.description; // คงค่าที่ผู้ใช้กรอกตามเดิม
        desc.style.display = 'inline-block';
        desc.style.maxWidth = '500px';
        desc.style.wordBreak = 'normal';
        descRow.appendChild(desc);
        damageItem.appendChild(descRow);
      }
      
      // รูปภาพ
      const damageImages = processedImages.filter(img => img.damageId === damage.id);
      if (damageImages.length > 0) {
        const imagesRow = document.createElement('div');
        imagesRow.className = 'pdf-damage-detail';
        
        const imagesLabel = document.createElement('span');
        imagesLabel.className = 'pdf-damage-detail-label pdf-no-break';
        // ใช้ภาษาไทยเสมอสำหรับป้ายกำกับ
        imagesLabel.textContent = 'รูปภาพ:';
        imagesRow.appendChild(imagesLabel);
        
        const imagesContainer = document.createElement('div');
        imagesContainer.className = 'pdf-images';
        
        damageImages.forEach(img => {
          const imgElement = document.createElement('img');
          imgElement.className = 'pdf-image';
          imgElement.src = img.base64;
          imagesContainer.appendChild(imgElement);
        });
        
        imagesRow.appendChild(imagesContainer);
        damageItem.appendChild(imagesRow);
      }
      
      content.appendChild(damageItem);
    });
    
    // ลายเซ็น
    const signature = document.createElement('div');
    signature.className = 'pdf-signature';
    
    const signatureTitle = document.createElement('div');
    // ใช้ภาษาไทยเสมอสำหรับหัวข้อลายเซ็น
    signatureTitle.textContent = 'ลงชื่อผู้รายงานความเสียหาย';
    signature.appendChild(signatureTitle);
    
    const signatureLine = document.createElement('div');
    signatureLine.className = 'pdf-signature-line';
    signature.appendChild(signatureLine);
    
    const signatureName = document.createElement('div');
    signatureName.className = 'pdf-signature-name';
    signatureName.textContent = `(${formData.residentName})`; // คงค่าที่ผู้ใช้กรอกตามเดิม
    signature.appendChild(signatureName);
    
    const signatureDate = document.createElement('div');
    signatureDate.className = 'pdf-signature-date';
    // ใช้ภาษาไทยเสมอสำหรับวันที่
    signatureDate.textContent = 'วันที่ ________/________/________';
    signature.appendChild(signatureDate);
    
    content.appendChild(signature);
    
    pdfContent.appendChild(content);
    document.body.appendChild(pdfContent);
    
    try {
      // แทนที่จะแปลงทั้ง HTML เป็น Canvas เดียว เราจะแบ่งเนื้อหาเป็นส่วนๆ
      
      // 1. ส่วนหัวข้อและข้อมูลห้อง
      const headerSection = document.createElement('div');
      headerSection.appendChild(header.cloneNode(true));
      headerSection.appendChild(infoBox.cloneNode(true));
      content.insertBefore(headerSection, damageHeader);
      
      // 2. แปลงส่วนหัวเป็น Canvas แยก
      const headerCanvas = await html2canvas(headerSection, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true
      });
      
      // เริ่มสร้าง PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // กำหนดขอบกระดาษสำหรับการเข้าเล่ม
      const leftMargin = 25; // ขอบซ้ายกว้างขึ้นสำหรับการเข้าเล่ม
      const rightMargin = 15;
      const topMargin = 15;
      const bottomMargin = 20;
      
      // คำนวณพื้นที่ใช้งานจริง
      const contentWidth = pdfWidth - leftMargin - rightMargin;
      
      // เพิ่มลายน้ำในแต่ละหน้า (อย่างง่าย)
      const addWatermark = () => {
        // บันทึกสถานะสีปัจจุบัน
        const textColor = pdf.getTextColor ? pdf.getTextColor() : 0; // ใช้สีดำถ้าไม่มีเมธอด getTextColor
        
        // ตั้งค่าสำหรับลายน้ำ
        pdf.setTextColor(200, 200, 200);
        pdf.setFontSize(80);
        
        // เพิ่มข้อความลายน้ำตรงกลาง
        pdf.text('RHYTHM', pdfWidth/2, pageHeight/2, { align: 'center' });
        
        // คืนค่าสีกลับมา
        pdf.setTextColor(typeof textColor === 'number' ? textColor : 0);
        pdf.setFontSize(12); // คืนค่าขนาดตัวอักษรกลับมา
      };
      
      // เพิ่มลายน้ำในหน้าแรก
      addWatermark();
      
      const headerHeight = (headerCanvas.height * contentWidth) / headerCanvas.width;
      pdf.addImage(
        headerCanvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        leftMargin,
        topMargin,
        contentWidth, 
        headerHeight
      );
      
      let currentY = topMargin + headerHeight;
      let currentPage = 1;
      
      // เพิ่มหัวข้อ "รายการความเสียหาย"
      const sectionHeaderCanvas = await html2canvas(damageHeader, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true
      });
      
      const sectionHeaderHeight = (sectionHeaderCanvas.height * contentWidth) / sectionHeaderCanvas.width;
      
      // ตรวจสอบว่าหัวข้อจะล้นหน้าหรือไม่
      if (currentY + sectionHeaderHeight > pageHeight - bottomMargin) {
        pdf.addPage();
        currentPage++;
        currentY = topMargin;
        addWatermark(); // เพิ่มลายน้ำในหน้าใหม่
      }
      
      pdf.addImage(
        sectionHeaderCanvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        leftMargin,
        currentY,
        contentWidth, 
        sectionHeaderHeight
      );
      
      currentY += sectionHeaderHeight;
      
      // 3. แปลงแต่ละรายการความเสียหายแยกกัน
      for (let i = 0; i < formData.damages.length; i++) {
        const damageItemElement = document.querySelectorAll('.pdf-damage-item')[i];
        
        // คัดลอกองค์ประกอบออกมาเพื่อวัดขนาด
        const tempDamageItem = document.createElement('div');
        tempDamageItem.appendChild(damageItemElement.cloneNode(true));
        document.body.appendChild(tempDamageItem);
        
        const damageCanvas = await html2canvas(tempDamageItem, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true
        });
        
        document.body.removeChild(tempDamageItem);
        
        const damageHeight = (damageCanvas.height * contentWidth) / damageCanvas.width;
        
        // ตรวจสอบว่ารายการจะล้นหน้าหรือไม่
        if (currentY + damageHeight > pageHeight - bottomMargin) {
          // ถ้าล้นหน้า ให้ขึ้นหน้าใหม่
          pdf.addPage();
          currentPage++;
          currentY = topMargin;
          addWatermark(); // เพิ่มลายน้ำในหน้าใหม่
        }
        
        pdf.addImage(
          damageCanvas.toDataURL('image/jpeg', 1.0),
          'JPEG',
          leftMargin,
          currentY,
          contentWidth, 
          damageHeight
        );
        
        currentY += damageHeight;
      }
      
      // 4. ส่วนลายเซ็น
      const signatureCanvas = await html2canvas(signature, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true
      });
      
      const signatureHeight = (signatureCanvas.height * contentWidth) / signatureCanvas.width;
      
      // ตรวจสอบว่าลายเซ็นจะล้นหน้าหรือไม่
      if (currentY + signatureHeight > pageHeight - bottomMargin) {
        pdf.addPage();
        currentPage++;
        currentY = topMargin;
        addWatermark(); // เพิ่มลายน้ำในหน้าใหม่
      }
      
      pdf.addImage(
        signatureCanvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        leftMargin,
        currentY,
        contentWidth, 
        signatureHeight
      );
      
      const pdfDataUri = pdf.output('datauristring');
      
      // ลบ HTML element ออก
      document.body.removeChild(pdfContent);
      
      console.log('HTML to PDF conversion completed successfully with proper pagination');
      return pdfDataUri;
      
    } catch (error) {
      // ลบ HTML element ออกในกรณีที่เกิด error
      if (document.body.contains(pdfContent)) {
        document.body.removeChild(pdfContent);
      }
      console.error('Error converting HTML to PDF:', error);
      throw error;
    }
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export default generatePdf; 