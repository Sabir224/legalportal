import React, { useState } from 'react';
import jsPDF from 'jspdf';

import styles from "./InvoiceForm.module.css";
import logo from "../../../Pages/Images/logo.png";

const InvoiceForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: ''
    });

    const legalServices = [
        { name: "Legal Consultation", price: 1500 },
        { name: "Contract Drafting", price: 3500 },
        { name: "Court Representation", price: 7500 }
    ];




    const generateInvoice = (formData, logo) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // === HEADER ===
        const addHeader = () => {

            doc.setFillColor(0, 0, 62);
            doc.rect(0, 0, pageWidth, 45, 'F');

            const logoX = 15, logoY = 10, logoW = 25, logoH = 25;
            doc.addImage(logo, "PNG", logoX, logoY, logoW, logoH);

            // Company Info (next to logo) - white text
            const infoX = logoX + logoW + 5;
            const infoY = logoY + 4;
            const maxInfoWidth = pageWidth / 2.2;
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(255, 255, 255);
            const companyInfo = [
                "AWS Legal Consultancy FZ-LLC",
                "1 Sheikh Zayed Road, Dubai, UAE",
                "Phone: +971 50 123 4567",
                "Email: info@awslegal.ae"
            ];
            let offsetY = 0;
            companyInfo.forEach(line => {
                const wrapped = doc.splitTextToSize(line, maxInfoWidth);
                doc.text(wrapped, infoX, infoY + offsetY);
                offsetY += 6; // Reduced from 7 to maintain compact spacing
            });

            // Invoice Title (far right) - white text
            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255, 255, 255); // White text
            doc.text("INVOICE", pageWidth - 20, logoY + 9, { align: "right" });
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Invoice #: INV-${new Date().getTime()}`, pageWidth - 20, logoY + 18, { align: "right" });
            // doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 20, logoY + 22, { align: "right" });

            // Reset text color to black for the rest of the document
            doc.setTextColor(0, 0, 0);

            return 50; // Return the height of the blue header
        };

        let currentY = addHeader();
        // === CLIENT INFO (left) ===
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Invoice Issued To:", 15, currentY + 10);

        doc.setFontSize(10);

        // Colors
        const headingColor = [0, 0, 62];   // dark dull blue
        const valueColor = [26, 61, 124];      // dull grey
        const dueDateColor = [204, 0, 0];     // red
        const blackColor = [0, 0, 0];

        // Name
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...headingColor);
        doc.text("Name", 15, currentY + 17);

        doc.setFont("helvetica", "italic");
        doc.setTextColor(...valueColor);
        doc.text(formData.name || "-", 40, currentY + 17);

        // Email
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...headingColor);
        doc.text("Email", 15, currentY + 22);

        doc.setFont("helvetica", "italic");
        doc.setTextColor(...valueColor);
        doc.text(formData.email || "-", 40, currentY + 22);

        // Phone (only if available)
        if (formData.phone) {
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...headingColor);
            doc.text("Phone", 15, currentY + 28);

            doc.setFont("helvetica", "italic");
            doc.setTextColor(...valueColor);
            doc.text(formData.phone, 40, currentY + 28);
        }

        // === DATE INFO (right, aligned with client info) ===
        doc.setFontSize(10);

        // Date Issued
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...headingColor);
        doc.text("Date Issued:", pageWidth - 60, currentY + 17, { align: "left" });

        doc.setFont("helvetica", "italic");
        doc.setTextColor(...valueColor);
        doc.text(new Date().toLocaleDateString(), pageWidth - 20, currentY + 17, { align: "right" });

        // Due Date
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...dueDateColor);
        doc.text("Due Date:", pageWidth - 60, currentY + 23, { align: "left" });

        doc.setFont("helvetica", "italic");
        doc.setTextColor(...dueDateColor);
        doc.text("30/09/2025", pageWidth - 20, currentY + 23, { align: "right" });


        currentY += 35;


        // === SERVICE DESCRIPTION ===
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...blackColor);
        doc.setFontSize(12);
        doc.text("Service Description", 15, currentY + 5);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...headingColor);
        doc.text(`${formData.service}`, 15, currentY + 12);

        currentY += 24;

        // === PAYMENT TABLE ===
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...blackColor);
        doc.text("Payment Summary", 15, currentY);

        currentY += 6;

        // Find the selected service to get its price
        const selectedService = legalServices.find(service => service.name === formData.service);
        const servicePrice = selectedService ? selectedService.price : 0;

        // === TABLE HEADER + ROWS WITH SMOOTH OUTER EDGES ===

        // Table dimensions
        const tableX = 15;
        const tableWidth = pageWidth - 30;
        const rowHeight = 10;
        const numRows = 2; // header + 1 data row
        const tableHeight = rowHeight * numRows;

        // Draw outer table with rounded edges
        doc.setFillColor(0, 0, 62);
        doc.roundedRect(tableX, currentY, tableWidth, tableHeight, 3, 3, "S");

        // === HEADER (first row) ===
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(200, 170, 90);

        doc.text("Description", tableX + 5, currentY + 7);
        doc.text("Amount", tableX + tableWidth - 12, currentY + 7, { align: "right" });

        // Draw horizontal line separating header from body
        doc.setDrawColor(0, 0, 0);
        doc.line(tableX, currentY + rowHeight, tableX + tableWidth, currentY + rowHeight);

        // === BODY ROW (service details) ===
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        const bodyY = currentY + rowHeight + 7;
        doc.text(formData.service || "-", tableX + 5, bodyY);
        doc.text(
            `AED ${servicePrice.toLocaleString()}`,
            tableX + tableWidth - 10,
            bodyY,
            { align: "right" }
        );

        // Total Row
        currentY += 29;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...headingColor);
        doc.text("Total:", pageWidth - 70, currentY);
        doc.text(`AED ${servicePrice.toLocaleString()}`, pageWidth - 22, currentY, { align: "right" });

        currentY += 20;

        // === BANK DETAILS ===
        const marginLeft = 15;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(...blackColor);
        doc.text("Bank Details", marginLeft, currentY);

        doc.setFontSize(10);

        const details = [
            "Bank: Emirates NBD",
            "Account Name: AWS Legal Consultancy FZ-LLC",
            "IBAN: AE123456789012345678901",
            "SWIFT: EBILAEAD"
        ];

        const startY = currentY + 7;
        const lineHeight = 6; // spacing between lines

        // step 1: find widest label (before colon)
        let maxLabelWidth = 0;
        details.forEach(line => {
            const [label] = line.split(":");
            const width = doc.getTextWidth(label.trim());
            if (width > maxLabelWidth) maxLabelWidth = width;
        });

        // fixed position for values (aligned column)
        const valueX = marginLeft + maxLabelWidth + 5; // space after colon

        // step 2: draw labels (dark blue) and values (dull grey)
        details.forEach((line, i) => {
            const y = startY + i * lineHeight;
            const [label, value] = line.split(":");

            // label (heading color)
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...headingColor);
            doc.text(label.trim(), marginLeft, y);

            // value (dull grey)
            doc.setFont("helvetica", "italic");
            doc.setTextColor(...valueColor);
            doc.text(value.trim(), valueX, y);
        });

        // === Footer ===
        currentY += 15; // small gap after table

        doc.setFont("helvetica", "italic");
        doc.setFontSize(11);
        doc.setTextColor(120, 120, 120); // elegant gray

        // Center it relative to page width, but near last content
        doc.text(
            "Thanks for choosing AWS Legal Consultancy as your trusted partner!",
            pageWidth / 2,
            currentY + 50,
            { align: "center" }
        );

        // Reset for anything after
        doc.setTextColor(0, 0, 0);



        // Save PDF
        doc.save(`Invoice_${formData.name}.pdf`);
    };




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className={styles.invoiceFormContainer}>
            <div className={styles.invoiceFormCard}>
                <h2 className={styles.title}>Generate Legal Invoice</h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        generateInvoice(formData, logo);
                    }}
                >
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                required
                                className={styles.formInput}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                required
                                className={styles.formInput}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className={styles.formInput}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            className={styles.formSelect}
                            required
                        >
                            <option value="">Select a service</option>
                            {legalServices.map((service, index) => (
                                <option key={index} value={service.name}>
                                    {service.name} (AED {service.price.toLocaleString()})
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className={styles.generateBtn}>
                        Generate Invoice
                    </button>
                </form>
            </div>
        </div>
    );

};

export default InvoiceForm;