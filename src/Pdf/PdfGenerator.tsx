import { jsPDF } from "jspdf";

const PdfGenerator = () => {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Hello world!", 10, 10);
    doc.save("sample.pdf");
  };

  return (
    <div>
      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
};

export default PdfGenerator;
