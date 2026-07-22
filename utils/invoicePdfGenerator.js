import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateProformaInvoice = (doc, data, settings) => {
  const brandName = settings.brandName || 'KRISHNA PUBLICITY';
  const address = settings.address || "F.F.107-'Ambikapark Aparment', Sitanagar To\nBombay Market Road,\nNr.HDFC Bank, Sitanagar, Punagam Surat-395010.";
  const phone = settings.phone || "Mo.7878 161516 / 787405 1516";
  const email = settings.email || "krishnapublicity2016@gmail.com";

  // Global colors
  const primaryGreen = '#2ea354';
  const primaryRed = '#e60000';
  const rowYellow = '#ffff00';
  const greyBg = '#f5f5f5';

  // Draw main outer green border
  doc.rect(20, 20, 555, 780).lineWidth(2).strokeColor(primaryGreen).stroke();

  // Top Section
  let currentY = 30;

  // Logo
  if (settings.logo) {
    try {
      let logoFile = settings.logo;
      if (logoFile.startsWith('/uploads/')) {
        logoFile = logoFile.replace('/uploads/', '');
      } else if (logoFile.startsWith('uploads/')) {
        logoFile = logoFile.replace('uploads/', '');
      }
      
      const logoPath = path.join(__dirname, '..', 'uploads', logoFile);
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 30, currentY, { height: 60, width: 140, fit: [140, 60] });
        // The grey border was here, removed.
      } else {
        doc.fillColor(primaryRed).fontSize(20).font('Helvetica-Bold').text(brandName, 30, currentY);
      }
    } catch (err) {
      doc.fillColor(primaryRed).fontSize(20).font('Helvetica-Bold').text(brandName, 30, currentY);
    }
  } else {
    doc.fillColor(primaryRed).fontSize(20).font('Helvetica-Bold').text(brandName, 30, currentY);
  }

  // Right Side: Proforma Invoice text
  doc.fillColor(primaryRed).fontSize(16).font('Helvetica-Bold').text('Proforma Invoice', 0, currentY, { align: 'right', width: 550 });
  
  currentY += 45;

  // Date, PI. N., CUSTOMER ID Table
  const topTableX = 400;
  const topTableY = currentY;
  
  doc.fontSize(9).fillColor('#000').font('Helvetica');
  doc.text('DATE', topTableX, topTableY);
  doc.rect(460, topTableY - 3, 100, 15).strokeColor('#000').lineWidth(0.5).stroke();
  doc.text(data.date || new Date().toISOString().slice(0, 10).split('-').reverse().join('-'), 460, topTableY, { width: 100, align: 'center' });

  doc.text('PI. N.', topTableX, topTableY + 20);
  doc.rect(460, topTableY + 17, 100, 15).stroke();
  doc.text(`[${data.billNumber || '1'}]`, 460, topTableY + 20, { width: 100, align: 'center' });

  doc.text('CUSTOMER ID', topTableX, topTableY + 40);
  doc.rect(460, topTableY + 37, 100, 15).stroke();
  doc.text(data.customerId || '25', 460, topTableY + 40, { width: 100, align: 'center' });

  // Address
  currentY += 25;
  doc.fontSize(8).fillColor('#000').font('Helvetica-Bold');
  doc.text(address, 30, currentY, { width: 250, lineGap: 3 });
  doc.text(phone, 30, doc.y + 2);
  
  doc.fillColor(primaryRed).text('GSTIN NO.24DBVPM5453E2ZB', 30, doc.y + 2);

  // Pink highlight bar
  currentY = doc.y + 2;
  doc.rect(30, currentY, 350, 12).fill('#ffcce6');
  doc.fillColor(primaryRed).fontSize(7).text('Special In Hording Indoor/outdoor, Branding, Tricycle, Rikshaw, Wallpainting, Advertising In All Our Gujrat.', 32, currentY + 2);

  // CUSTOMER Block
  currentY += 15;
  doc.rect(30, currentY, 200, 15).fill(primaryGreen);
  doc.fillColor('#fff').fontSize(9).font('Helvetica-Bold').text(data.partyType || 'CUSTOMER', 32, currentY + 3);
  
  currentY += 15;
  doc.fillColor('#000').font('Helvetica-Bold').text(data.partyName || 'Name Not Provided', 32, currentY + 3);
  doc.font('Helvetica').fontSize(8).fillColor('#555').text(data.partyAddress || '', 32, doc.y + 2);
  
  doc.fillColor(primaryRed).font('Helvetica-Bold').text(`GSTIN : ${data.partyGst || ''}`, 32, doc.y + 5);
  
  // Subject highlight
  doc.rect(30, doc.y + 2, 200, 10).fill('#ffffe0');
  doc.fillColor('#000').text(`Sub.: ${data.subject || 'Services'}`, 32, doc.y - 8);
  
  doc.fillColor('#000').text('Display period : ', 32, doc.y + 4, { continued: true }).fillColor(primaryRed).text('1 Months    Time Period : Not Specified');

  // Table Header
  currentY = doc.y + 10;
  const tableTop = currentY;
  
  doc.rect(30, tableTop, 535, 15).fill(primaryGreen);
  doc.fillColor('#fff').fontSize(9).font('Helvetica-Bold');
  doc.text('Location / Description', 100, tableTop + 3);
  doc.text('Rate', 420, tableTop + 3);
  doc.text('Amount', 490, tableTop + 3);

  // Draw grid horizontal lines (alternating bg)
  let y = currentY + 15;
  for (let i = 0; i < 11; i++) {
    if (i % 2 === 0) {
      doc.rect(30, y, 535, 20).fill('#ffffff');
    } else {
      doc.rect(30, y, 535, 20).fill(greyBg);
    }
    y += 20;
  }

  // Draw vertical lines
  doc.moveTo(400, tableTop).lineTo(400, y).strokeColor(primaryGreen).lineWidth(1).stroke();
  doc.moveTo(480, tableTop).lineTo(480, y).strokeColor(primaryGreen).stroke();
  doc.rect(30, tableTop, 535, y - tableTop).strokeColor(primaryGreen).stroke();

  // Fill row text
  currentY += 15;
  doc.fillColor('#000').fontSize(8).font('Helvetica');
  doc.text(`1. ${data.details || 'Details'}`, 32, currentY + 5, { width: 360 });
  doc.text(data.amount?.toString() || '0', 405, currentY + 5, { width: 70, align: 'right' });
  doc.text(data.amount?.toString() || '0', 485, currentY + 5, { width: 75, align: 'right' });

  // Yellow highlighted row
  const totalAmountRowY = y - 20;
  doc.rect(30, totalAmountRowY, 535, 20).fill(rowYellow);
  doc.fillColor('#000').font('Helvetica-Bold').fontSize(8);
  doc.text('Total Amount', 32, totalAmountRowY + 5);
  doc.text(data.amount?.toString() || '0', 485, totalAmountRowY + 5, { width: 75, align: 'right' });

  // Redraw vertical lines over yellow row
  doc.moveTo(400, totalAmountRowY).lineTo(400, y).strokeColor(primaryGreen).lineWidth(1).stroke();
  doc.moveTo(480, totalAmountRowY).lineTo(480, y).strokeColor(primaryGreen).stroke();

  // Totals Block
  const totalBoxY = y;
  
  doc.fillColor('#000').font('Helvetica-Bold').fontSize(8);
  doc.text('Subtotal', 405, totalBoxY + 3);
  doc.rect(480, totalBoxY, 85, 15).fill('#e6f9ed');
  doc.fillColor(primaryGreen).text(data.amount?.toString() || '0', 485, totalBoxY + 3, { width: 75, align: 'right' });
  
  doc.rect(480, totalBoxY, 85, 15).strokeColor(primaryGreen).stroke();
  
  doc.fillColor('#000').text('CGSTN 9%', 405, totalBoxY + 18);
  doc.rect(480, totalBoxY + 15, 85, 15).stroke();
  doc.text('0.00%', 485, totalBoxY + 18, { width: 75, align: 'right' });
  
  doc.text('SGSTN 9%', 405, totalBoxY + 33);
  doc.rect(480, totalBoxY + 30, 85, 15).stroke();
  doc.text('0.00%', 485, totalBoxY + 33, { width: 75, align: 'right' });
  
  doc.text('Tax 18%', 405, totalBoxY + 48);
  doc.rect(480, totalBoxY + 45, 85, 15).fill('#fffbcc');
  doc.fillColor('#b8860b').text('0.00%', 485, totalBoxY + 48, { width: 75, align: 'right' });
  doc.rect(480, totalBoxY + 45, 85, 15).strokeColor(primaryGreen).stroke();
  
  doc.fillColor('#000').text('Other', 405, totalBoxY + 68);
  doc.rect(480, totalBoxY + 65, 85, 15).stroke();
  doc.text('-', 485, totalBoxY + 68, { width: 75, align: 'right' });

  doc.rect(400, totalBoxY + 80, 165, 15).fill('#ffcc00');
  doc.fillColor('#000').font('Helvetica-Bold').fontSize(10);
  doc.text('TOTAL', 405, totalBoxY + 83);
  doc.text(`Rs. ${data.amount || 0}`, 485, totalBoxY + 83, { width: 75, align: 'right' });
  doc.rect(400, totalBoxY + 80, 165, 15).strokeColor(primaryGreen).stroke();

  // Terms and Conditions Block
  doc.rect(30, totalBoxY, 350, 15).fill(primaryGreen);
  doc.fillColor('#fff').fontSize(9).font('Helvetica-Bold').text('TERMS AND CONDITIONS', 32, totalBoxY + 3);
  
  doc.rect(30, totalBoxY + 15, 350, 95).strokeColor(primaryGreen).stroke();
  
  doc.fillColor('#000').fontSize(8).font('Helvetica-Bold');
  let ty = totalBoxY + 20;
  doc.text('1. G.S.T. 18% Tax will be Charge Extra', 32, ty); ty += 12;
  doc.text('2. Mounting & Demounting Wii be 5.00 Rs. Per Sq.Ft.', 32, ty); ty += 12;
  doc.text('3. Printing Non Lit Rs.10.00per Sq.Ft', 32, ty); ty += 12;
  doc.text('4. For any reasons, if your flex is damaged, it will be your', 32, ty); ty += 10;
  doc.font('Helvetica-Oblique').text('    responsibility to provide us with a new flex', 32, ty); ty += 12;
  doc.font('Helvetica-Bold').text('5. Payment will be made in mode Advance.', 32, ty); ty += 12;
  doc.text('6. KRISHNAPUBLICITY will not be liable for display material like: theft,', 32, ty); ty += 10;
  doc.text('    wear & tear OR any type of dameges.', 32, ty);

  // Bank Details
  doc.rect(30, totalBoxY + 110, 350, 45).strokeColor(primaryGreen).stroke();
  doc.fillColor(primaryRed).font('Helvetica-Bold').fontSize(8);
  doc.text('Account Name: KRISHNA PUBLICITY      : Bank Name AXIS BANK LTD', 32, totalBoxY + 115);
  doc.fillColor('#000');
  doc.text('Account Number: 922020000049646', 32, totalBoxY + 130);
  doc.text('IFSC Code: UTIB0001050 (Magob, Surat)', 32, totalBoxY + 140);

  // Signature
  doc.fillColor('#000').fontSize(8).font('Helvetica-Bold');
  doc.text('For, KRISHNA PUBLICITY', 430, totalBoxY + 130);

  // Bottom Footer (Yellow BG text + email)
  doc.rect(140, 755, 320, 10).fill('#ffffcc');
  doc.fillColor('#000').font('Helvetica').fontSize(8).text('If you have any questions about this price quote, please contact', 0, 756, { align: 'center' });
  
  doc.fillColor('blue').font('Helvetica-Oblique').text(`E-mail : ${email}`, 0, 768, { align: 'center' });
  doc.fillColor('#000').font('Helvetica-BoldOblique').fontSize(12).text('Thank You For Your Business!', 0, 778, { align: 'center' });
};
