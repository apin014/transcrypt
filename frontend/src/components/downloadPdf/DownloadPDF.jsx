// src/downloadPdf/DownloadPDF.js
import html2pdf from 'html2pdf.js';
import CryptoJS from 'crypto-js';
import { Button } from 'flowbite-react';

const DownloadPDF = ({ elementId, fileName, secretKey }) => {
    const printDocument = () => {
        const element = document.getElementById(elementId);
        if (element) {
            html2pdf()
                .from(element)
                .set({
                    margin: 1,
                    filename: `${fileName}.pdf`,
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                })
                .outputPdf('datauristring')
                .then((pdfDataUri) => {
                    const pdfBase64 = pdfDataUri.split(',')[1];
                    const encryptedPdf = CryptoJS.AES.encrypt(pdfBase64, secretKey).toString();
                    downloadEncryptedPdf(encryptedPdf, fileName);
                });
        } else {
            console.error('Element not found!');
        }
    };

    const downloadEncryptedPdf = (encryptedPdf, fileName) => {
        const link = document.createElement('a');
        link.href = 'data:application/octet-stream,' + encodeURIComponent(encryptedPdf);
        link.download = `${fileName}.encrypted`;
        link.click();
    };

    return (
        <Button className='bg-red-600' id="download-pdf-button" onClick={printDocument}>
            Download PDF
        </Button>
    );
};

export default DownloadPDF;
