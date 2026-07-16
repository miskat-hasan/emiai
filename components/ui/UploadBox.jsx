// components/ui/UploadBox.jsx
import { Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-black">{label}</label>
      )}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function UploadBox({
  label,
  accept,
  hint,
  file,
  previewUrl,
  onChange,
  onRemove,
}) {
  const ref = useRef(null);
  const [localUrl, setLocalUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const isImage = accept?.includes("image");

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setLocalUrl(null);
  }, [file]);

  const displayUrl = localUrl || previewUrl;

  const isAcceptedFile = file => {
    if (!accept) return true;

    const acceptTypes = accept.split(",").map(item => item.trim());

    return acceptTypes.some(type => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.replace("/*", "/"));
      }

      if (type.startsWith(".")) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }

      return file.type === type;
    });
  };

  const handleDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];

    if (!droppedFile) return;

    if (!isAcceptedFile(droppedFile)) return;

    onChange(droppedFile);
  };

  return (
    <Field label={label}>
      {displayUrl && isImage ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayUrl}
            alt={label}
            className="w-full h-40 object-cover"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => ref.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex items-center gap-3 p-4 rounded-xl border border-dashed cursor-pointer transition-all
    ${
      isDragging
        ? "border-primary bg-primary/10"
        : "border-gray-200 bg-gray-50 hover:border-primary/40 hover:bg-primary/5"
    }`}
        >
          <Upload size={18} className="text-primary shrink-0" />
          <div className="text-sm min-w-0 flex-1">
            {file || previewUrl ? (
              <span className="font-medium text-black truncate block">
                {file?.name ?? "Uploaded file"}
              </span>
            ) : (
              <>
                {isDragging ? (
                  <span className="font-semibold text-primary">
                    Drop your file here
                  </span>
                ) : file || previewUrl ? (
                  <span className="font-medium text-black truncate block">
                    {file?.name ?? "Uploaded file"}
                  </span>
                ) : (
                  <>
                    <span className="font-semibold text-primary underline underline-offset-2">
                      Click to Upload
                    </span>
                    <span className="text-gray"> or drag & drop</span>
                  </>
                )}
              </>
            )}
            {!file && !previewUrl && (
              <p className="text-xs text-gray mt-0.5">{hint}</p>
            )}
          </div>
          {(file || previewUrl) && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onRemove();
              }}
              className="text-gray hover:text-red-500 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => onChange(e.target.files?.[0] ?? null)}
      />
    </Field>
  );
}
