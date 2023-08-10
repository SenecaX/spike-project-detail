import React from "react";
import { Box, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";

interface PDFSelectionFormProps {
  isFormOpen: boolean;
  onClose: () => void;
  selection: any;
  handleCheckboxChange: (element: string, isChecked: boolean) => void;
  handleFormSubmit: (event: React.FormEvent) => void;
}

const PDFSelectionForm: React.FC<PDFSelectionFormProps> = ({
  isFormOpen,
  onClose,
  selection,
  handleCheckboxChange,
  handleFormSubmit,
}) => (
  <Modal open={isFormOpen} onClose={onClose}>
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
            onChange={(e) => handleCheckboxChange("card", e.target.checked)}
          />
          Include Card
        </label>

        {/* Repeat for other elements */}
        <br />
        <button type="submit">Preview PDF</button>
        {/* <button type="button" onClick={() => setIsFormOpen(false)}>
                Cancel
              </button> */}
      </form>
    </Box>
  </Modal>
);

export default PDFSelectionForm;
