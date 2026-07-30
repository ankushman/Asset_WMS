import * as XLSX from 'xlsx';

export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function exportToExcel(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToPDF(title: string, headers: string[], rows: (string | number)[][]) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - Sankaj Logistics Report</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #1e293b; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ea580c; padding-bottom: 15px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #0b192c; }
          .logo span { color: #ea580c; }
          .title { font-size: 18px; font-weight: 600; color: #334e68; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
          th { background-color: #f1f5f9; color: #0f172a; font-weight: 600; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .footer { margin-top: 30px; text-align: right; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">SANKAJ <span>LOGISTICS LIMITED</span></div>
          <div class="title">${title}</div>
        </div>
        <p style="font-size: 12px; color: #64748b;">Generated on: ${new Date().toLocaleString()} | Confidential Enterprise Document</p>
        <table>
          <thead>
            <tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows
              .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
              .join('')}
          </tbody>
        </table>
        <div class="footer">
          Sankaj Logistics Limited | Enterprise Warehouse Management System
        </div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

export interface GatePassData {
  gatePassNo: string;
  orderCode: string;
  invoiceNo: string;
  customerName: string;
  warehouseName: string;
  warehouseAddress?: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  transporterName: string;
  transportCompany?: string;
  dispatchDateTime: string;
  preparedBy: string;
  remarks?: string;
  totalItems: number;
  pickingType?: string;
  printedBy?: string;
  printedAt?: string;
  items?: {
    sku: string;
    productName: string;
    category?: string;
    quantity: number;
    uom: string;
  }[];
}

export function printGatePassPDF(data: GatePassData) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const defaultItems = data.items || [
    { sku: 'SKU-AST-1042', productName: 'Automotive Engine Assemblies', category: 'Heavy Equipment', quantity: Math.round(data.totalItems * 0.4), uom: 'Boxes' },
    { sku: 'SKU-AST-2098', productName: 'Hydraulic Seals & Braking Kits', category: 'Spare Parts', quantity: Math.round(data.totalItems * 0.35), uom: 'Cartons' },
    { sku: 'SKU-AST-3150', productName: 'Industrial Transmission Lubricants', category: 'Consumables', quantity: Math.round(data.totalItems * 0.25), uom: 'Barrels' },
  ];

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Gate Pass - ${data.gatePassNo} | SANKAJ LOGISTICS LIMITED</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }
          * { box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 15px;
            background: #ffffff;
            font-size: 11px;
            line-height: 1.4;
          }
          .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #ea580c;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .brand-title {
            font-size: 22px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: 0.5px;
          }
          .brand-title span {
            color: #ea580c;
          }
          .brand-subtitle {
            font-size: 10px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .doc-badge {
            background: #0f172a;
            color: #ffffff;
            padding: 8px 16px;
            font-size: 13px;
            font-weight: 800;
            border-radius: 6px;
            text-align: center;
            letter-spacing: 1px;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
          }
          .info-table td {
            padding: 5px 8px;
            border: 1px solid #cbd5e1;
            font-size: 11px;
          }
          .lbl {
            background: #f8fafc;
            font-weight: 700;
            color: #475569;
            width: 18%;
          }
          .val {
            font-weight: 600;
            color: #0f172a;
            width: 32%;
          }
          .section-title {
            font-size: 11px;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            background: #f1f5f9;
            padding: 5px 8px;
            border: 1px solid #cbd5e1;
            border-bottom: none;
            margin-top: 10px;
            letter-spacing: 0.5px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
          }
          .items-table th {
            background: #0f172a;
            color: #ffffff;
            padding: 6px 8px;
            border: 1px solid #0f172a;
            font-size: 10px;
            font-weight: 700;
            text-align: left;
            text-transform: uppercase;
          }
          .items-table td {
            padding: 6px 8px;
            border: 1px solid #cbd5e1;
            font-size: 11px;
          }
          .items-table tr:nth-child(even) {
            background: #f8fafc;
          }
          .signatures-grid {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            margin-bottom: 15px;
          }
          .sig-cell {
            border: 1px solid #cbd5e1;
            height: 65px;
            vertical-align: bottom;
            padding: 6px;
            text-align: center;
            font-size: 10px;
            font-weight: 700;
            color: #475569;
            width: 16.66%;
          }
          .seal-cell {
            border: 2px dashed #94a3b8;
            height: 65px;
            vertical-align: middle;
            text-align: center;
            font-size: 9px;
            font-weight: 800;
            color: #64748b;
            background: #fafafa;
            width: 16.66%;
          }
          .footer-section {
            border-top: 2px solid #e2e8f0;
            padding-top: 8px;
            margin-top: 15px;
            text-align: center;
            font-size: 10px;
            color: #64748b;
          }
          .sys-msg {
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .audit-text {
            font-size: 9px;
            color: #94a3b8;
            margin-top: 4px;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <div class="header-container">
          <div>
            <div class="brand-title">SANKAJ <span>LOGISTICS LIMITED</span></div>
            <div class="brand-subtitle">Enterprise Warehouse Management System</div>
          </div>
          <div class="doc-badge">
            OUTBOUND GATE PASS
          </div>
        </div>

        <!-- Info Grid -->
        <table class="info-table">
          <tr>
            <td class="lbl">Gate Pass No:</td>
            <td class="val"><strong style="font-size:12px; color:#ea580c;">${data.gatePassNo}</strong></td>
            <td class="lbl">Dispatch Date & Time:</td>
            <td class="val">${data.dispatchDateTime}</td>
          </tr>
          <tr>
            <td class="lbl">Outbound Order No:</td>
            <td class="val">${data.orderCode}</td>
            <td class="lbl">Invoice Number:</td>
            <td class="val">${data.invoiceNo}</td>
          </tr>
          <tr>
            <td class="lbl">Customer Name:</td>
            <td class="val">${data.customerName}</td>
            <td class="lbl">Warehouse Location:</td>
            <td class="val">${data.warehouseName}</td>
          </tr>
        </table>

        <!-- Transporter & Vehicle Details -->
        <div class="section-title">Transporter & Vehicle Verification Details</div>
        <table class="info-table">
          <tr>
            <td class="lbl">Transporter Name:</td>
            <td class="val">${data.transporterName}</td>
            <td class="lbl">Vehicle Number:</td>
            <td class="val"><strong style="font-size:12px;">${data.vehicleNumber}</strong></td>
          </tr>
          <tr>
            <td class="lbl">Driver Name:</td>
            <td class="val">${data.driverName}</td>
            <td class="lbl">Driver Phone / Mobile:</td>
            <td class="val">${data.driverPhone}</td>
          </tr>
          <tr>
            <td class="lbl">Picking Type:</td>
            <td class="val">${data.pickingType || 'Pallet'}</td>
            <td class="lbl">Total Units / Volume:</td>
            <td class="val"><strong>${data.totalItems} Units</strong></td>
          </tr>
        </table>

        <!-- Material Details Table -->
        <div class="section-title">Material Dispatch Item Manifest</div>
        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 50px;">S.No</th>
              <th style="width: 120px;">SKU Code</th>
              <th>Product Name & Specification</th>
              <th style="width: 120px;">Category</th>
              <th style="width: 90px; text-align: right;">Quantity</th>
              <th style="width: 70px;">UOM</th>
            </tr>
          </thead>
          <tbody>
            ${defaultItems
              .map(
                (item, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td style="font-family: monospace; font-weight: 700;">${item.sku}</td>
                <td style="font-weight: 600;">${item.productName}</td>
                <td>${item.category || 'General Cargo'}</td>
                <td style="text-align: right; font-weight: 700;">${item.quantity}</td>
                <td>${item.uom}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <!-- Remarks -->
        ${
          data.remarks
            ? `<div style="margin-bottom: 12px; font-size: 10px; color: #475569; padding: 6px; background: #f8fafc; border: 1px solid #cbd5e1;">
                <strong>Remarks / Dispatch Notes:</strong> ${data.remarks}
              </div>`
            : ''
        }

        <!-- Signatures & Authorizations -->
        <div class="section-title">Authorizations & Security Sign-Offs</div>
        <table class="signatures-grid">
          <tr>
            <td class="sig-cell">Prepared By<br/><span style="font-size:9px; font-weight:normal;">(${data.preparedBy})</span></td>
            <td class="sig-cell">Checked By<br/><span style="font-size:9px; font-weight:normal;">(QC Supervisor)</span></td>
            <td class="sig-cell">Approved By<br/><span style="font-size:9px; font-weight:normal;">(Warehouse Manager)</span></td>
            <td class="sig-cell">Security Officer<br/><span style="font-size:9px; font-weight:normal;">(Gate Check)</span></td>
            <td class="sig-cell">Driver Signature<br/><span style="font-size:9px; font-weight:normal;">(${data.driverName})</span></td>
            <td class="seal-cell">COMPANY SEAL<br/>OFFICIAL STAMP</td>
          </tr>
        </table>

        <!-- Footer -->
        <div class="footer-section">
          <div class="sys-msg">This Gate Pass is system generated.</div>
          <div class="audit-text">
            Printed On: ${data.printedAt || new Date().toLocaleString()} | Printed By: ${data.printedBy || data.preparedBy} | WMS System Ref: ${data.gatePassNo}
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

