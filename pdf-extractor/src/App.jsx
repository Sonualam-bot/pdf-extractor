import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfURL, setPdfURL] = useState("");
  const [numPages, setNumPages] = useState(null);

  const [selectedPages, setSelectedPages] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setSelectedPages([]);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("pdfFile", selectedFile);

    try {
      const response = await fetch("https://pdf.sonualam.repl.co/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPdfURL(`https://pdf.sonualam.repl.co/files/${data.filename}`);
      } else {
        console.error("File upload failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePageSelection = (pageNumber) => {
    const updatedSelectedPages = [...selectedPages];

    if (updatedSelectedPages.includes(pageNumber)) {
      const index = updatedSelectedPages.indexOf(pageNumber);
      updatedSelectedPages.splice(index, 1);
    } else {
      updatedSelectedPages.push(pageNumber);
    }

    setSelectedPages(updatedSelectedPages);
  };

  // tiell here
  const extractAndDownloadPages = async () => {
    const pagesToDownload = selectedPages.sort(); // to ensure selected pages are in order

    const pdfBytes = await fetch(pdfURL).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const extractedPdf = await PDFDocument.create();
    for (const pageNo of pagesToDownload) {
      const [copiedPage] = await extractedPdf.copyPages(pdfDoc, [pageNo - 1]);
      extractedPdf.addPage(copiedPage);
    }

    const modifiedPdfBytes = await extractedPdf.save();
    const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
    saveAs(blob, "selected_pages.pdf");
    setPdfURL("");
  };

  // untill here
  const renderCheckbox = (page) => (
    <input
      type="checkbox"
      checked={selectedPages.includes(page)}
      onChange={() => handlePageSelection(page)}
      style={checkboxStyle}
    />
  );

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <div key={`page_${i}`} style={pageStyle}>
          {renderCheckbox(i)}
          <Page
            pageNumber={i}
            width={600}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </div>
      );
    }
    return pages;
  };

  const formStyle = {
    border: "2px solid #ccc",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
    maxWidth: "300px",
    margin: "0 auto",
    marginTop: "40px",
  };

  const buttonStyle = {
    background: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "10px",
  };

  const inputStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    width: "100%",
    marginBottom: "10px",
    marginTop: "10px",
    borderRadius: "4px",
  };

  const checkboxStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: "1",
  };

  const pageStyle = {
    border: "5px solid #ccc",
    padding: "1%",
    margin: "1%",
    position: "relative",
    width: "98%",
  };

  const pdfOutputStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "1rem",
    margin: "0 auto",
    width: "580px",
  };

  const pdfContainerStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const footerStyle = {
    color: "#fff",
    textAlign: "center",
    padding: "10px 0px",
    position: "fixed",
    bottom: "0",
    width: "100%",
  };

  const anchorStyle = {
    fontSize: "1.4rem",
    textDecoration: "none",
    color: "black",
  };

  useEffect(() => {
    setNumPages(null); // Reset the number of pages when a new file is chosen
  }, [pdfURL]);

  return (
    <div className="App">
      <div style={formStyle}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf"
          style={inputStyle}
        />
        <button onClick={uploadFile} style={buttonStyle}>
          Upload
        </button>
      </div>

      <div style={pdfOutputStyle}>
        {pdfURL && (
          <div style={pdfContainerStyle}>
            {selectedPages.length > 0 && (
              <button style={buttonStyle} onClick={extractAndDownloadPages}>
                Download Selected Pages
              </button>
            )}
            <Document
              file={pdfURL}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              {renderPages()}
            </Document>
          </div>
        )}
      </div>
      <div style={footerStyle}>
        <a style={anchorStyle} href="https://github.com/yourgithubusername">
          Find Code 👉 GitHub
        </a>
      </div>
    </div>
  );
}

export default App;
