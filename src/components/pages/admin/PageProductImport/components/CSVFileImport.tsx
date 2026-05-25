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
  const [status, setStatus] = React.useState<
    "idle" | "uploading" | "done" | "error"
  >("idle");

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
      const authorization_token = localStorage.getItem("authorization_token");
      const response = await axios.get(url, {
        params: { name: file.name },
        headers: {
          Authorization: `Basic ${authorization_token}`,
        },
      });
      const signedUrl =
        typeof response.data === "string" ? response.data : response.data.url;
      await fetch(signedUrl, { method: "PUT", body: file });
      setFile(undefined);
      setStatus("done");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
          alert(
            "You are not authorized. Please provide a valid authorization token."
          );
        } else if (status === 403) {
          alert("You do not have permission to perform this action.");
        } else {
          // status 0 or undefined: CORS-blocked 401/403 — real status unreadable
          alert(
            "You are not authorized. Please provide a valid authorization token."
          );
        }
      }
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
          <button onClick={removeFile} disabled={status === "uploading"}>
            Remove file
          </button>
          <button onClick={uploadFile} disabled={status === "uploading"}>
            {status === "uploading" ? "Uploading..." : "Upload file"}
          </button>
        </div>
      )}
      {status === "done" && (
        <Typography color="success.main" variant="body2">
          Uploaded successfully!
        </Typography>
      )}
      {status === "error" && (
        <Typography color="error" variant="body2">
          Upload failed. Please try again.
        </Typography>
      )}
    </Box>
  );
}
