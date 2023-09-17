/* eslint-disable jsx-a11y/iframe-has-title */

import React, { useState } from "react";
import axios from "axios";

const PdfGenerator2: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [pdfLink, setPdfLink] = useState<string | null>(null);

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = function () {
        setImage(reader.result as string);
      };
    }
  };

  const handleSubmit = async () => {
    const query = `
      mutation GeneratePdf($name: String!, $description: String!, $imageBase64: String!) {
        generatePdfWithImageCanvas(name: $name, description: $description, imageBase64: $imageBase64)
      }
    `;

    try {
      // Modified URL to ensure it points to your NestJS server
      const response = await axios.post("http://localhost:3001/graphql", {
        query: query,
        variables: {
          name: name,
          description: description,
          imageBase64: image,
        },
      });

      const {
        data: { generatePdfWithImageCanvas },
      } = response;
      setPdfLink(`data:application/pdf;base64,${generatePdfWithImageCanvas}`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Consider adding user feedback here.
    }
  };

  return (
    <div>
      <h2>Create PDF</h2>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>
      </div>
      <div>
        <label>
          Image:
          <input type="file" onChange={onImageChange} />
        </label>
      </div>
      <button onClick={handleSubmit}>Generate PDF</button>
      {pdfLink && <iframe src={pdfLink} width="500" height="400"></iframe>}
    </div>
  );
};

export default PdfGenerator2;
