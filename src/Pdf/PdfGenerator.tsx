import React, { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { LineChartChartJs } from "../LineChart/LinechartChartJs";
import html2canvas from "html2canvas";
import Accordion1 from "../Accordion/Accordion";
import Accordion from "../Accordion/Accordion";
import MultiActionAreaCard from "../Card/Card";
import { Box, Typography } from "@mui/material";

const PdfGenerator = ({ sensorData }: { sensorData: any }) => {
  // Extracting the first and last dates from the JSON data
  const startDate = new Date(sensorData[0].time);
  const endDate = new Date(sensorData[sensorData.length - 1].time);

  let minCrackMovement = Number.POSITIVE_INFINITY;
  let maxCrackMovement = Number.NEGATIVE_INFINITY;
  let minTemperature = Number.POSITIVE_INFINITY;
  let maxTemperature = Number.NEGATIVE_INFINITY;

  const transformedData = sensorData.reduce((acc: any, item: any) => {
    const time = item.time;
    if (item.field === "CRACKMOVEMENT") {
      minCrackMovement = -30;
      maxCrackMovement = 30;
    }
    if (item.field === "TEMPERATURE") {
      minTemperature = -40;
      maxTemperature = 40;
    }
    if (!acc[time]) acc[time] = { name: time };
    acc[time][item.field.toLowerCase()] = item.value;
    return acc;
  }, {});

  const chartRef = useRef<HTMLDivElement>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);

  const generatePDF = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const doc = new jsPDF({
          orientation: "landscape",
        });
        doc.text("Hello world!", 10, 10);
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
      <button onClick={generatePDF} style={{ marginTop: "50px" }}>
        Generate PDF
      </button>
      {pdfPreview && (
        <div>
          <button onClick={downloadPDF}>Download PDF</button>
          <iframe src={pdfPreview} width="100%" height="90%" />
        </div>
      )}
      <Box sx={{ marginTop: 5 }}>
        <MultiActionAreaCard />
      </Box>
    </div>
  );
};

export default PdfGenerator;
