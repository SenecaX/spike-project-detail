import React from "react";

interface PDFPreviewProps {
  pdfPreview: string | null;
  downloadPDF: () => void;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ pdfPreview, downloadPDF }) => (
  <>
    {pdfPreview && (
      <div>
        <button onClick={downloadPDF}>Download PDF</button>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <iframe src={pdfPreview} width="80%" height="80%" />
        </div>
      </div>
    )}
  </>
);

export default PDFPreview;
