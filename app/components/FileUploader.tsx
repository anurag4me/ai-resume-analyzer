import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      setSelectedFile(file);
      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/pdf": [".pdf"] },
      maxSize: maxFileSize,
    });

  // Preserve react-dropzone's input props (including its internal ref) while
  // keeping a local ref so we can clear the native input value when needed.
  const inputProps = getInputProps();
  const { ref: providedRef, ...restInputProps } = inputProps as any;

  const handleInputRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (!providedRef) return;
    if (typeof providedRef === "function") providedRef(node);
    else if (providedRef && typeof providedRef === "object")
      providedRef.current = node;
  };

  // Keep local selectedFile in sync with react-dropzone's acceptedFiles
  useEffect(() => {
    const f = acceptedFiles[0] || null;
    setSelectedFile(f);
    // don't call onFileSelect here to avoid duplicate notifications when onDrop already did
    // but if acceptedFiles is changed externally, notify parent as well
    // (safe because onDrop also sets selectedFile)
  }, [acceptedFiles]);

  const file = selectedFile;

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...restInputProps} ref={handleInputRef} />

        <div className="space-y-4 cursor-pointer">
          {file ? (
            <div
              className="uploader-selected-file"
              onClick={(e) => e.stopPropagation()}
            >
              <img src="/images/pdf.png" alt="pdf" className="size-10" />
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                className="p-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setSelectedFile(null);
                  if (inputRef.current) {
                    // clear the underlying file input so react-dropzone no longer holds the file
                    try {
                      inputRef.current.value = "";
                    } catch (err) {
                      /* ignore */
                    }
                  }
                  onFileSelect?.(null);
                }}
              >
                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <img src="/icons/info.svg" alt="upload" className="size-20" />
              </div>
              <p className="text-lg text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-lg text-gray-500">
                PDF (max {formatSize(maxFileSize)})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
