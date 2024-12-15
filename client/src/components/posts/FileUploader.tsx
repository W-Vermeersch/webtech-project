import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./FileUploader.css";
// https://www.npmjs.com/package/react-dropzone copied and adjusted

interface FileUploaderProps {
  setFieldValue: (field: string, value: any) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ setFieldValue }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file: File = acceptedFiles[0];

        const reader = new FileReader();

        reader.onabort = () => console.log("File reading was aborted");
        reader.onerror = () => console.log("File reading has failed");
        reader.onload = () => {
          const binarystring = reader.result;
          setPreviewUrl(binarystring as string);
          setFieldValue("file", binarystring);
          setFieldValue("image_type", file.type);
        };
        reader.readAsDataURL(file);
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
