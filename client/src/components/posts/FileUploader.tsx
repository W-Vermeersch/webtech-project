import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./FileUploader.css";

// Fileuploader component is built using the react-dropzone package
// package documentation: https://www.npmjs.com/package/react-dropzone
// Idea for the implementation inspired by a youtube tutorial video: https://www.youtube.com/watch?v=_W3R2VwRyF4&t=14210s

// Adjusted implementation to also show a preview of the image. Integrated with a form to pass the values with setFieldValue.

interface FileUploaderProps {
  setFieldValue: (field: string, value: any) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ setFieldValue }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file: File = acceptedFiles[0];

        // Generate preview URL using Object URL
        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview);

        // Pass the File object directly (to use with FormData)
        setFieldValue("file", file);
      }
    },
    [setFieldValue]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".heic"],
    },
    maxFiles: 1,
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} className="dropzone-input" />

      {previewUrl ? (
        <>
          <div className="file-uploader-preview-container">
            <img src={previewUrl} alt="Preview" className="file-uploader-img" />
          </div>
          <p className="file-subtitle">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file-uploader-box">
          <img
            src="/src/assets/upload-file.svg"
            width={96}
            height={77}
            alt="file upload"
            className="file-uploader-icon"
          />
          <h3 className="dropzone-text">Click or drag</h3>
          JPEG, PNG, JPG, HEIC
        </div>
      )}
    </div>
  );
};

export default FileUploader;
