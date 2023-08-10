import { Box, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import React, { useRef, useState } from "react";
import Accordion from "../Accordion/Accordion";
import MultiActionAreaCard from "../Card/Card";
import { LineChartChartJs } from "../LineChart/LinechartChartJs";
import PDFPreview from "./PDFPreview";
import PDFSelectionForm from "./PDFSelectionForm";
import { transformSensorData } from "./utils";

interface Selection {
  typography: boolean;
  accordion: boolean;
  lineChart: boolean;
  card: boolean;
}

const PdfGenerator: React.FC<any> = ({ sensorData }) => {
  // Extracting the first and last dates from the JSON data
  const startDate = new Date(sensorData[0].time);
  const endDate = new Date(sensorData[sensorData.length - 1].time);

  const {
    transformedData,
    minCrackMovement,
    maxCrackMovement,
    minTemperature,
    maxTemperature,
  } = transformSensorData(sensorData);

  const chartRef = useRef<HTMLDivElement>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);

  const generatePDF = () => {
    if (chartRef.current) {
      html2canvas(pdfContentRef.current).then((canvas) => {
        console.log("pdfContentRef.current", pdfContentRef.current);
        const imgData = canvas.toDataURL("image/png");
        const doc = new jsPDF({
          orientation: "landscape",
        });
        doc.addImage(imgData, "PNG", 10, 20, 500, 150);

        // Add a new page
        doc.addPage();
        doc.text("Page 2 content here", 10, 10);

        // Convert the PDF to a Blob object
        const pdfBlob = doc.output("blob");

        // Create a URL from the Blob
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Set the URL as the preview
        setPdfPreview(pdfUrl);
      });
    }
  };

  const downloadPDF = () => {
    if (pdfPreview) {
      const link = document.createElement("a");
      link.href = pdfPreview;
      link.download = "sample.pdf";
      link.click();
    }
  };

  const [selection, setSelection] = useState<Selection>({
    typography: false,
    accordion: false,
    lineChart: false,
    card: false,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCheckboxChange = (element: string, isChecked: boolean) => {
    setSelection((prevSelection) => ({
      ...prevSelection,
      [element]: isChecked,
    }));
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    generatePDF();
    setIsFormOpen(false);
  };

  const pdfContentRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <Typography variant="h1" gutterBottom sx={{ padding: 10 }}>
        Title
      </Typography>
      <Accordion title="Custom Title" content="Custom Content" />{" "}
      <div ref={chartRef}>
        <LineChartChartJs
          data={Object.values(transformedData)}
          startDate={startDate}
          endDate={endDate}
          minCrackMovement={minCrackMovement}
          maxCrackMovement={maxCrackMovement}
          minTemperature={minTemperature}
          maxTemperature={maxTemperature}
        />
      </div>
      <button onClick={generatePDF} className="buttonMarginTop">
        Generate PDF
      </button>
      <PDFPreview pdfPreview={pdfPreview} downloadPDF={downloadPDF} />
      <Box sx={{ marginTop: 5 }}>
        <MultiActionAreaCard />
      </Box>
      <div>
        <button onClick={() => setIsFormOpen(true)}>Create PDF</button>

        <Modal open={isFormOpen} onClose={() => setIsFormOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6">Select Elements for PDF</Typography>
            <button onClick={() => setIsFormOpen(true)}>Create PDF</button>
            <PDFSelectionForm
              isFormOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              selection={selection}
              handleCheckboxChange={handleCheckboxChange}
              handleFormSubmit={handleFormSubmit}
            />
          </Box>
        </Modal>
      </div>
      <div ref={pdfContentRef}>
        {selection.typography && <Typography>Some text here</Typography>}
        {selection.accordion && <Accordion title="Title" content="Content" />}
        {selection.lineChart && (
          <LineChartChartJs
            data={Object.values(transformedData)}
            startDate={startDate}
            endDate={endDate}
            minCrackMovement={minCrackMovement}
            maxCrackMovement={maxCrackMovement}
            minTemperature={minTemperature}
            maxTemperature={maxTemperature}
          />
        )}
        {selection.card && <MultiActionAreaCard /* props */ />}
      </div>
    </div>
  );
};

export default PdfGenerator;
