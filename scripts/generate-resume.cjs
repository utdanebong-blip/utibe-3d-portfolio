#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const dataPath = path.join(__dirname, '../src/data/demoData.json');
const outPath = path.join(__dirname, '../public/assets/resume.pdf');

if (!fs.existsSync(dataPath)) {
  console.error('demoData.json not found at', dataPath);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const about = raw.about || {};
const resume = raw.resume || {};
const contact = raw.contact || {};

fs.mkdirSync(path.dirname(outPath), { recursive: true });

const doc = new PDFDocument({ size: 'A4', margin: 50 });
const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

const headingSize = 14;
const subHeadingSize = 11;
const bodySize = 10;
const lineGap = 6;

doc.font('Helvetica-Bold').fontSize(20).text('UTIBE EBONG', { align: 'left' });
doc.moveDown(0.2);
doc.font('Helvetica').fontSize(subHeadingSize).fillColor('gray').text(contact.email || '', { align: 'left' });
if (contact.phone) doc.text(contact.phone, { align: 'left' });
if (contact.location) doc.text(contact.location, { align: 'left' });
doc.moveDown(0.6);

doc.font('Helvetica-Bold').fontSize(headingSize).fillColor('black').text('Summary');
doc.moveDown(0.25);
doc.font('Helvetica').fontSize(bodySize).fillColor('black').lineGap(lineGap).text(about.bio || '', { align: 'left' });
doc.moveDown(0.6);

if ((resume.skills || about.skills || []).length > 0) {
  const skills = (resume.skills && resume.skills.length) ? resume.skills : about.skills || [];
  doc.font('Helvetica-Bold').fontSize(headingSize).text('Skills');
  doc.moveDown(0.25);
  doc.font('Helvetica').fontSize(bodySize);
  const skillLine = skills.map(s => s.name || s).join(' • ');
  doc.text(skillLine, { align: 'left' });
  doc.moveDown(0.6);
}

if ((resume.experiences || about.experiences || []).length > 0) {
  const experiences = (resume.experiences && resume.experiences.length) ? resume.experiences : about.experiences || [];
  doc.font('Helvetica-Bold').fontSize(headingSize).text('Experience');
  doc.moveDown(0.25);
  doc.font('Helvetica').fontSize(bodySize);
  experiences.forEach(exp => {
    doc.font('Helvetica-Bold').text(`${exp.title} — ${exp.company}`, { continued: false });
    doc.font('Helvetica-Oblique').fontSize(9).fillColor('gray').text(` ${exp.startDate || ''} • ${exp.endDate || ''}`);
    doc.moveDown(0.1);
    if (exp.description) doc.font('Helvetica').fontSize(bodySize).fillColor('black').text(exp.description);
    if (exp.achievements && exp.achievements.length) {
      exp.achievements.forEach(a => {
        doc.list([a], { bulletRadius: 2, textIndent: 10 });
      });
    }
    doc.moveDown(0.4);
  });
  doc.moveDown(0.3);
}

if ((resume.education || []).length > 0) {
  doc.font('Helvetica-Bold').fontSize(headingSize).text('Education');
  doc.moveDown(0.25);
  doc.font('Helvetica').fontSize(bodySize);
  resume.education.forEach(edu => {
    doc.font('Helvetica-Bold').text(`${edu.degree}`, { continued: false });
    doc.font('Helvetica-Oblique').fontSize(9).fillColor('gray').text(` ${edu.institution} • ${edu.startDate || ''} - ${edu.endDate || ''}`);
    if (edu.description) {
      doc.moveDown(0.1);
      doc.font('Helvetica').fontSize(bodySize).fillColor('black').text(edu.description);
    }
    doc.moveDown(0.3);
  });
}

if ((resume.certifications || []).length > 0) {
  doc.font('Helvetica-Bold').fontSize(headingSize).text('Certifications');
  doc.moveDown(0.25);
  doc.font('Helvetica').fontSize(bodySize);
  resume.certifications.forEach(c => doc.text(`• ${c}`));
  doc.moveDown(0.4);
}

if ((resume.recommendations || []).length > 0) {
  doc.font('Helvetica-Bold').fontSize(headingSize).text('Recommendations');
  doc.moveDown(0.25);
  doc.font('Helvetica').fontSize(bodySize).text((resume.recommendations || []).join('\n'));
}

doc.end();

stream.on('finish', () => {
  console.log('Generated resume at', outPath);
});
