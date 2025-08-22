// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

//  const LFPPDFgenartor = (data) => {
//     const { agreement, fixedHeadings } = data;
//     console.log("Pdf")
//     // 📝 Prepare Agreement fixed part + editable values merged
//     let agreementContent = [];
//     agreement.fixedParts.forEach((part, index) => {
//         agreementContent.push({ text: part, bold: true, margin: [0, 2, 0, 2] });
//         if (agreement.editableValues[index]) {
//             agreementContent.push({
//                 text: agreement.editableValues[index],
//                 bold: false,
//                 margin: [0, 2, 0, 2],
//             });
//         }
//     });

//     // 📝 Prepare Sections & Points
//     let sectionContent = fixedHeadings.map((section) => {
//         let points = section.points.map((p, idx) => {
//             return {
//                 text: `${idx + 1}. ${p.text.replace(/<\/?[^>]+(>|$)/g, "")}`, // remove HTML tags
//                 margin: [10, 2, 0, 2],
//             };
//         });

//         return [
//             { text: section.title.replace(/<\/?[^>]+(>|$)/g, ""), style: "sectionHeader" },
//             ...points,
//         ];
//     });

//     // 📝 PDF definition
//     const docDefinition = {
//         content: [
//             { text: "AGREEMENT DOCUMENT", style: "header" },
//             { text: "\n" },
//             { text: "Agreement Parties", style: "subheader" },
//             {
//                 text: agreementContent.map((c) => c.text).join(""),
//                 margin: [0, 5, 0, 15],
//             },
//             { text: "Agreement Sections", style: "subheader" },
//             ...sectionContent.flat(),
//         ],
//         styles: {
//             header: {
//                 fontSize: 18,
//                 bold: true,
//                 alignment: "center",
//             },
//             subheader: {
//                 fontSize: 14,
//                 bold: true,
//                 margin: [0, 10, 0, 5],
//             },
//             sectionHeader: {
//                 fontSize: 12,
//                 bold: true,
//                 decoration: "underline",
//                 margin: [0, 8, 0, 4],
//             },
//         },
//     };

//     pdfMake.createPdf(docDefinition).download("Agreement.pdf");
// };



// export default LFPPDFgenartor;