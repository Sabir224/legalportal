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

            doc.setFillColor(26, 43, 66);
            doc.rect(0, 0, pageWidth, 45, 'F');

            const logoX = 15, logoY = 10, logoW = 25, logoH = 25;
            doc.addImage(logo, "PNG", logoX, logoY, logoW, logoH);

            // Company Info 
            const infoX = logoX + logoW + 5;
            const infoY = logoY + 4;
            const maxInfoWidth = pageWidth / 2.2;
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(255, 255, 255);
            const companyInfo = [
                "AWS Legal Consultancy FZ-LLC",
                "The H Hotel - office tower 1602",
                "Sheikh Zayed Road, Dubai",
                "United Arab Emirates",
                "TRN 100487818500003"
            ];
            let offsetY = 0;
            companyInfo.forEach(line => {
                const wrapped = doc.splitTextToSize(line, maxInfoWidth);
                doc.text(wrapped, infoX, infoY + offsetY);
                offsetY += 6; // Reduced from 7 to maintain compact spacing
            });

            // Invoice Title
            doc.setFontSize(28);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255, 255, 255); // White text
            doc.text("INVOICE", pageWidth - 20, logoY + 15, { align: "right" });
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Invoice #: INV-${new Date().getTime()}`, pageWidth - 20, logoY + 22, { align: "right" });

            doc.setTextColor(0, 0, 0);

            return 50; // Return the height of the blue header
        };

        let currentY = addHeader();

        // === CLIENT INFO  ===
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Invoice Issued To:", 15, currentY + 36);

        doc.setFontSize(10);

        // Colors
        const headingColor = [26, 43, 66];   // dark dull blue
        const valueColor = [26, 61, 124];      // dull grey
        const dueDateColor = [204, 0, 0];     // red
        const blackColor = [0, 0, 0];
        const dullBlackColor = [50, 50, 50];

        doc.setFont("helvetica", "normal");
        doc.setTextColor(...headingColor);
        doc.text(formData.name || "-", 15, currentY + 44);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(...headingColor);
        doc.text(formData.email || "-", 15, currentY + 49);

        doc.setFontSize(9);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(...dullBlackColor);
        doc.text("Balance Due", pageWidth - 20, currentY + 9, { align: "right" });

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...dullBlackColor);
        doc.text("AED 0.00", pageWidth - 20, currentY + 14, { align: "right" });


        doc.setFontSize(10);

        // Date Issued
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...headingColor);
        doc.text("Date Issued:", pageWidth - 70, currentY + 24, { align: "left" });

        doc.setFont("helvetica", "italic");
        doc.setTextColor(...headingColor);
        doc.text(new Date().toLocaleDateString(), pageWidth - 20, currentY + 24, { align: "right" });

        // TERMS
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...headingColor);
        doc.text("Terms:", pageWidth - 70, currentY + 32, { align: "left" });

        doc.setFont("helvetica", "italic");
        doc.setTextColor(...headingColor);
        doc.text(" Due on Receipt", pageWidth - 20, currentY + 32, { align: "right" });

        // P.O.
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...headingColor);
        doc.text("P.O.#:", pageWidth - 70, currentY + 40, { align: "left" });

        doc.setFont("helvetica", "italic");
        doc.setTextColor(...headingColor);
        doc.text(`${formData.service}`, pageWidth - 20, currentY + 40, { align: "right" });

        // DUE DATE
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...dueDateColor);
        doc.text("Due Date:", pageWidth - 70, currentY + 48, { align: "left" });

        doc.setFont("helvetica", "italic");
        doc.setTextColor(...dueDateColor);
        doc.text("30/09/2025", pageWidth - 20, currentY + 48, { align: "right" });

        currentY += 35;


        // === PAYMENT TABLE ===
doc.setFontSize(12);
doc.setFont("helvetica", "bold");
doc.setTextColor(...blackColor);
doc.text("Payment Summary", 15, currentY + 27);

currentY += 33;

// Find the selected service to get its price
const selectedService = legalServices.find(service => service.name === formData.service);
const servicePrice = selectedService ? selectedService.price : 0;

// === TABLE HEADER + ROWS ===

// Table dimensions
const tableX = 15;
const tableWidth = pageWidth - 30;
const rowHeight = 10;

// === HEADER (first row) ===
doc.setFont("helvetica", "bold");
doc.setFontSize(11);
doc.setTextColor(200, 170, 90);

// Column headers
doc.text("Description", tableX + 5, currentY + 7);
// doc.text("Qty", tableX + tableWidth * 0.6, currentY + 7);
doc.text("Rate", tableX + tableWidth * 0.7, currentY + 7);
doc.text("Tax", tableX + tableWidth * 0.8, currentY + 7);
doc.text("Amount", tableX + tableWidth - 10, currentY + 7, { align: "right" });

// Draw horizontal line separating header from body
doc.setDrawColor(0, 0, 0);
doc.line(tableX, currentY + rowHeight, tableX + tableWidth, currentY + rowHeight);

// === BODY ROW (service details) ===
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.setTextColor(50, 50, 50); // Dull black/gray instead of [0, 0, 0]

const bodyY = currentY + rowHeight + 7;
doc.text(`${formData.service} Fee`, tableX + 5, bodyY + 1);
// doc.text("1.00", tableX + tableWidth * 0.6, bodyY);
doc.text("540.00", tableX + tableWidth * 0.7, bodyY);
doc.text("25.71", tableX + tableWidth * 0.8, bodyY);
doc.text(`${servicePrice.toLocaleString()}`, tableX + tableWidth - 10, bodyY, { align: "right" });

// Add tax percentage below the tax value
doc.setFontSize(8);
doc.text("5.00%", tableX + tableWidth * 0.8, bodyY + 5);


// Draw horizontal line separating header from body
doc.setDrawColor(0, 0, 0);
doc.line(tableX, currentY + rowHeight, tableX + tableWidth, currentY + rowHeight);
doc.line(tableX, currentY + (rowHeight + 14), tableX + tableWidth, currentY + (rowHeight + 14));

// Move position down for next elements
currentY += 25;

// Add subtotal
doc.setFont("helvetica", "bold");
doc.setFontSize(10);
doc.text("Sub Total", tableX + tableWidth * 0.72, currentY + 7);
doc.setFont("helvetica", "normal");
// doc.text("25.71", tableX + tableWidth * 0.8, currentY + 7);
doc.text(`AED ${servicePrice.toLocaleString()}`, tableX + tableWidth - 10, currentY + 7, { align: "right" });


// Add balance due
currentY += 10;
doc.setFont("helvetica", "bold");
doc.text("Balance Due", tableX + tableWidth * 0.72, currentY + 5);
doc.setFont("helvetica", "normal");
doc.text("AED 0.00", tableX + tableWidth - 10, currentY + 5, { align: "right" });

currentY += 20;

// Tax Summary Section
doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.setTextColor(...blackColor);
doc.text("Tax Summary", tableX, currentY);

// Tax table dimensions
const taxTableWidth = tableWidth;
const taxTableX = tableX;

// Draw tax table header
currentY += 8;
doc.setFont("helvetica", "bold");
doc.setFontSize(10);
doc.setTextColor(200, 170, 90);

doc.text("Tax Details", taxTableX + 5, currentY + 3);
doc.text("Taxable Amount (AED)", taxTableX + taxTableWidth * 0.5, currentY + 3);
doc.text("Tax Amount (AED)", taxTableX + taxTableWidth - 10, currentY + 3, { align: "right" });

// Draw horizontal line for tax table header
doc.setDrawColor(0, 0, 0);
doc.line(taxTableX, currentY + 7, taxTableX + taxTableWidth, currentY + 7);

// Tax table body
currentY += 10;
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.setTextColor(50, 50, 50);

doc.text("Standard Rate (5%)", taxTableX + 5, currentY + 4);
doc.text("514.29", taxTableX + taxTableWidth * 0.6, currentY + 4);
doc.text("25.71", taxTableX + taxTableWidth - 10, currentY + 4, { align: "right" });

// Draw horizontal line for tax table header
doc.setDrawColor(0, 0, 0);
doc.line(taxTableX, currentY + 9, taxTableX + taxTableWidth, currentY + 9);

// Tax table total
currentY += 10;
doc.setFont("helvetica", "bold");
doc.text("Total", taxTableX + 5, currentY + 5);
doc.text("AED514.29", taxTableX + taxTableWidth * 0.6, currentY + 5);
doc.text("AED25.71", taxTableX + taxTableWidth - 10, currentY + 5, { align: "right" });

        

        // === BANK DETAILS ===
        const marginLeft = 15;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...dullBlackColor);
        doc.text("Bank Details", marginLeft, currentY + 25);

        doc.setFontSize(10);
currentY += 3;
        const details = [
            "Bank: Emirates NBD",
            "Account Name: AWS Legal Consultancy FZ-LLC",
            "IBAN: AE123456789012345678901",
            "SWIFT: EBILAEAD"
        ];

        const startY = currentY + 31;
        const lineHeight = 8;

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
            doc.setTextColor(...dullBlackColor);
            doc.text(label.trim(), marginLeft, y);

            // value (dull grey)
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...dullBlackColor);
            doc.text(value.trim(), valueX, y);
        });

        // === Footer ===
        currentY += 15; // small gap after table

        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120); // elegant gray

        // Center it relative to page width, but near last content
        doc.text(
            "Thanks for choosing AWS Legal Consultancy as your trusted partner!",
            pageWidth / 2,
            currentY + 70,
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