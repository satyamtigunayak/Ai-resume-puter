import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '../lib/utils'
import { useState } from 'react'
interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const maxFileSize = 20 * 1024 * 1024;

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

const onDrop = useCallback((accepted: File[]) => {
    const file = accepted[0] || null;
    setSelectedFile(file);
    onFileSelect?.(file);
}, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: maxFileSize,
    });

const file = selectedFile;
    if (file) {
        return (
            <div className="rz-file-picked">
                <div className="rz-file-info">
                    <img src="/images/pdf.png" alt="PDF" style={{ width: 28, height: 28 }} />
                    <div>
                        <div className="rz-file-name">{file.name}</div>
                        <div className="rz-file-size">{formatSize(file.size)}</div>
                    </div>
                </div>
                <button
                    type="button"
                    className="rz-file-rm"
onClick={(e) => {
    e.stopPropagation();
    setSelectedFile(null);
    onFileSelect?.(null);
}}                    aria-label="Remove file"
                >
                    ✕
                </button>
            </div>
        );
    }

    return (
        <div
            className={`rz-dropzone${isDragActive ? ' is-active' : ''}`}
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            <div className="rz-dropzone-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                        stroke="var(--clay)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="17 8 12 3 7 8"
                        stroke="var(--clay)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="12" y1="3" x2="12" y2="15"
                        stroke="var(--clay)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <p className="rz-dropzone-text">
                <em>Click to upload</em> or drag & drop
            </p>
            <p className="rz-dropzone-hint">PDF only · max {formatSize(maxFileSize)}</p>
        </div>
    );
};

export default FileUploader;
