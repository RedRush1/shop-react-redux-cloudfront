import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();
  const [status, setStatus] = React.useState<"idle" | "uploading" | "done" | "error">("idle");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setStatus("idle");
    }
  };

  const removeFile = () => {
    setFile(undefined);
    setStatus("idle");
  };

  const uploadFile = async () => {
    if (!file) return;
    setStatus("uploading");
    try {
      const response = await axios.get(url, {
        params: { name: encodeURIComponent(file.name) },
      });
      await fetch(response.data, { method: "PUT", body: file });
      setFile(undefined);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" accept=".csv" onChange={onFileChange} />
      ) : (
        <div>
          <span style={{ marginRight: 8 }}>{file.name}</span>
          <button onClick={removeFile} disabled={status === "uploading"}>Remove file</button>
          <button onClick={uploadFile} disabled={status === "uploading"}>
            {status === "uploading" ? "Uploading..." : "Upload file"}
          </button>
        </div>
      )}
      {status === "done" && <Typography color="success.main" variant="body2">Uploaded successfully!</Typography>}
      {status === "error" && <Typography color="error" variant="body2">Upload failed. Please try again.</Typography>}
    </Box>
  );
}
