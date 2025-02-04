// const DragAndDrop = (props) => {

//     return (
//         <div {...getRootProps()} className="dropzone-container mt-1">
//         <input {...getInputProps()} />
//         <div className="icon-container">
//           <img src={execlIcons} alt="Excel" className="excel-icon" />
//           {uploading && uploadProgress === 100 && (
//             <BsCheck2Circle className="check-icon text-success" />
//           )}
//         </div>
//         <p className="dropzone-text">
//           Drag and drop an Excel file here, or click to select one
//         </p>
//         {isBroadCreated && (
//           <p className="dropzone-text text-custom-green">
//             {isBroadCreated && (
//               <p className="dropzone-text text-custom-green">
//                 Broadcast Successfully Created
//               </p>
//             )}
//           </p>
//         )}

//         {fileTypeError ? (
//           <p className="text-danger">Please upload .xls or .xlsx only.</p>
//         ) : (
//           selectedFile && <p>File Name: {selectedFile.name}</p>
//         )}

//         <style jsx>{`
//           .dropzone-container {
//             border: 2px dashed #18273e;
//             padding: 40px; /* Increased padding for bigger size */
//             text-align: center;
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             justify-content: center;
//           }

//           .icon-container {
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             justify-content: center;
//             position: relative;
//             margin-bottom: 20px; /* Adjusted margin */
//           }

//           .excel-icon {
//             min-height: 50px;
//             min-width: 60px;
//             color: goldenrod;
//           }

//           .check-icon {
//             color: green;
//             min-height: 25px;
//             min-width: 25px;
//             height: 50px;
//             width: 50px;
//             position: absolute;
//             top: 0;
//             right: 0;
//           }

//           .dropzone-text {
//             margin-bottom: 20px;
//             font-size: 18px; /* Increased font size */
//           }
//         `}</style>
//       </div>
//     );
// };
// export default DragAndDrop;
