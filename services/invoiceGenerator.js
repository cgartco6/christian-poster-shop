const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateInvoice(order, callback) {
  const doc = new PDFDocument();
  const filename = `invoice-${order.orderId}.pdf`;
  const stream = fs.createWriteStream(path.join(__dirname, '../public/invoices', filename));
  doc.pipe(stream);
  doc.fontSize(20).text('HolyCanvas Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Order #: ${order.orderId}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.text(`Customer: ${order.customer.name}`);
  doc.text(`Total: R${order.totalAmount}`);
  doc.end();
  stream.on('finish', () => callback(filename));
}

module.exports = { generateInvoice };
