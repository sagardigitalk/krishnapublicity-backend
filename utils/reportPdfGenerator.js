import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const drawReportHeader = (doc, title, periodText, settings) => {
  const brandName = settings.brandName || 'KRISHNA PUBLICITY';
  const address = settings.address || "F.F.107-'Ambikapark Aparment', Sitanagar To\nBombay Market Road,\nNr.HDFC Bank, Sitanagar, Punagam Surat-395010.";
  const phone = settings.phone || "Mo.7878 161516 / 787405 1516";
  const email = settings.email || "krishnapublicity2016@gmail.com";

  const primaryGreen = '#2ea354';
  const primaryRed = '#e60000';

  // Draw main outer green border
  doc.rect(20, 20, 555, 802).lineWidth(2).strokeColor(primaryGreen).stroke();
  doc.on('pageAdded', () => {
    doc.rect(20, 20, 555, 802).lineWidth(2).strokeColor(primaryGreen).stroke();
  });

  // Top Section
  let currentY = 30;

  // Logo
  if (settings.logo) {
    try {
      let logoFile = settings.logo;
      if (logoFile.startsWith('/uploads/')) logoFile = logoFile.replace('/uploads/', '');
      else if (logoFile.startsWith('uploads/')) logoFile = logoFile.replace('uploads/', '');
      
      const logoPath = path.join(__dirname, '..', 'uploads', logoFile);
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 30, currentY, { height: 60, width: 140, fit: [140, 60] });
      } else {
        doc.fillColor(primaryRed).fontSize(20).font('Helvetica-Bold').text(brandName, 30, currentY);
      }
    } catch (err) {
      doc.fillColor(primaryRed).fontSize(20).font('Helvetica-Bold').text(brandName, 30, currentY);
    }
  } else {
    doc.fillColor(primaryRed).fontSize(20).font('Helvetica-Bold').text(brandName, 30, currentY);
  }

  // Right Side: Title text (Red, like Proforma Invoice)
  doc.fillColor(primaryRed).fontSize(16).font('Helvetica-Bold').text(title, 0, currentY, { align: 'right', width: 550 });
  
  // Date/Period Table
  const topTableX = 320;
  const topTableY = currentY + 45;
  
  doc.fontSize(9).fillColor('#000').font('Helvetica');
  doc.text('DATE / PERIOD', topTableX, topTableY);
  doc.rect(410, topTableY - 3, 150, 15).strokeColor('#000').lineWidth(0.5).stroke();
  doc.text(periodText, 410, topTableY, { width: 150, align: 'center' });

  // Address (Moved below the logo safely)
  currentY = 100; // Force it below the logo (30 + 60 height)
  
  doc.fontSize(8).fillColor('#000').font('Helvetica-Bold');
  doc.text(address, 30, currentY, { width: 300, lineGap: 3 });
  doc.text(`Phone: ${phone} | Email: ${email}`, 30, doc.y + 2);
  
  doc.fillColor(primaryRed).text(`GSTIN NO.${settings.gstin || '24DBVPM5453E2ZB'}`, 30, doc.y + 2);

  // Pink highlight bar
  currentY = doc.y + 5;
  doc.rect(25, currentY, 545, 12).fill('#ffcce6');
  doc.fillColor(primaryRed).fontSize(7).font('Helvetica').text('Special In Hording Indoor/outdoor, Branding, Tricycle, Rikshaw, Wallpainting, Advertising In All Our Gujrat.', 30, currentY + 2);

  doc.moveDown(2);
  doc.fillColor('#000000'); // Reset color for table
};
