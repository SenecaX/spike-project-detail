import React, { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { LineChartChartJs } from "../LineChart/LinechartChartJs";
import html2canvas from "html2canvas";
import Accordion1 from "../Accordion/Accordion";
import Accordion from "../Accordion/Accordion";
import MultiActionAreaCard from "../Card/Card";
import { Box, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";

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
      html2canvas(pdfContentRef.current).then((canvas) => {
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

  const [selection, setSelection] = useState({
    typography: false,
    accordion: false,
    lineChart: false,
    card: false,
    // Add other elements as needed
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
    setIsFormOpen(false); // Close the modal
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
      <button onClick={generatePDF} style={{ marginTop: "50px" }}>
        Generate PDF
      </button>
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
            <form onSubmit={handleFormSubmit} style={{ display: "column" }}>
              <label>
                <input
                  type="checkbox"
                  checked={selection.typography}
                  onChange={(e) =>
                    handleCheckboxChange("typography", e.target.checked)
                  }
                />
                Include Typography
              </label>

              <br />

              <label>
                <input
                  type="checkbox"
                  checked={selection.accordion}
                  onChange={(e) =>
                    handleCheckboxChange("accordion", e.target.checked)
                  }
                />
                Include Accordion
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  checked={selection.lineChart}
                  onChange={(e) =>
                    handleCheckboxChange("lineChart", e.target.checked)
                  }
                />
                Include Line Chart
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  checked={selection.card}
                  onChange={(e) =>
                    handleCheckboxChange("card", e.target.checked)
                  }
                />
                Include Card
              </label>

              {/* Repeat for other elements */}
              <br />
              <button type="submit">Preview PDF</button>
              <button type="button" onClick={() => setIsFormOpen(false)}>
                Cancel
              </button>
            </form>
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
        {/* Add other elements as needed */}
      </div>
    </div>
  );
};

export default PdfGenerator;
