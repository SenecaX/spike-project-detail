/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const GENERATE_PDF = gql`
  mutation GeneratePDF($input: GeneratePDFInput!) {
    generatePDF(input: $input) {
      data
      message
    }
  }
`;

function SimpleForm() {
  const [textFormData, setTextFormData] = useState({
    name: "",
    description: "",
    age: 0,
  });

  const [imageFormData, setImageFormData] = useState({
    title: "",
    image: null,
  });

  const [pdfSrc, setPdfSrc] = useState<string | null>(null);
  const [generatePDF, { data }] = useMutation(GENERATE_PDF);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "age") {
      setTextFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setTextFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    if (name === "image" && files) {
      setImageFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setImageFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 2. Utility function to convert image to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleTextFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await generatePDF({
        variables: {
          input: textFormData,
        },
      });

      handlePDFResponse(response);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
  const handleImageFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let input = {
      title: imageFormData.title,
    };

    if (imageFormData.image) {
      input["image"] = await convertToBase64(imageFormData.image);
    }

    try {
      const response = await generatePDF({
        variables: {
          input: input,
        },
      });

      handlePDFResponse(response);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handlePDFResponse = (response: any) => {
    if (
      response &&
      response.data &&
      response.data.generatePDF &&
      response.data.generatePDF.data
    ) {
      const encodedPDF = response.data.generatePDF.data;

      const decodedPDF = Uint8Array.from(atob(encodedPDF), (c) =>
        c.charCodeAt(0)
      );

      const blob = new Blob([decodedPDF], { type: "application/pdf" });

      const blobUrl = URL.createObjectURL(blob);
      setPdfSrc(blobUrl);
    } else {
      console.error("Invalid GraphQL response structure.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        border: "2px solid black",
        padding: "20px",
      }}
    >
      <div
        style={{
          flex: 1,
          marginRight: "20px",
          border: "2px solid red",
          padding: "20px",
        }}
      >
        <div
          style={{
            flex: 1,
            marginRight: "20px",
            border: "2px solid red",
            padding: "20px",
          }}
        >
          {/* 4. Text form */}
          <form onSubmit={handleTextFormSubmit}>
            <input
              name="name"
              value={textFormData.name}
              onChange={handleTextChange}
              placeholder="Name"
            />
            <input
              name="description"
              value={textFormData.description}
              onChange={handleTextChange}
              placeholder="Description"
            />
            <input
              name="age"
              value={textFormData.age}
              onChange={handleTextChange}
              placeholder="Age"
              type="number"
            />
            <button type="submit">Generate PDF from Text Data</button>
          </form>
        </div>

        <div
          style={{
            flex: 1,
            marginRight: "20px",
            border: "2px solid orange",
            padding: "20px",
          }}
        >
          {/* 5. Image form */}
          <form onSubmit={handleImageFormSubmit}>
            <input
              name="title"
              value={imageFormData.title}
              onChange={handleImageChange}
              placeholder="Title"
            />
            <input type="file" name="image" onChange={handleImageChange} />
            <button type="submit">Generate PDF from Image</button>
          </form>
        </div>
      </div>

      <div style={{ flex: 2, border: "2px solid blue", padding: "20px" }}>
        {pdfSrc && (
          <div style={{ marginTop: "20px" }}>
            <div style={{ border: "2px solid green", padding: "10px" }}>
              <object
                data={pdfSrc}
                type="application/pdf"
                style={{ width: "100%", height: "100vh" }}
              >
                <p>PDF preview is not available.</p>
              </object>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SimpleForm;
