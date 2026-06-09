import { type FormEvent, useState } from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: {
        companyName: string; jobTitle: string; jobDescription: string; file: File
    }) => {
        setIsProcessing(true);

        setStatusText('Uploading file...');
        const uploadedFile = await fs.upload([file]);
        if (!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if (!imageFile.file) return setStatusText('Error: Failed to convert PDF');

        setStatusText('Uploading image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if (!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing analysis...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing your resume...');
        const feedback = await ai.feedback(
            uploadedImage.path,
            prepareInstructions({ jobTitle, jobDescription })
        );
        if (!feedback) return setStatusText('Error: Failed to analyze resume');

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Done — redirecting...');
        navigate(`/resume/${uuid}`);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;
        if (!file) return;
        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="rz-page">
            <Navbar />
            <div className="rz-upload-wrap">
                {isProcessing ? (
                    <div className="rz-processing">
                        <img src="/images/resume-scan.gif" style={{ width: 200, opacity: 0.65 }} alt="analyzing" />
                        <p className="rz-status-text">{statusText}</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div>
                            <h1 className="rz-upload-hd-title">Analyze your resume</h1>
                            <p className="rz-upload-hd-sub">
                                Get an ATS score and AI-powered feedback tailored to the role you're applying for.
                            </p>
                        </div>

                        <form id="upload-form" onSubmit={handleSubmit} style={{ all: 'unset', display: 'contents' }}>

                            {/* Step 1 — Role details */}
                            <div>
                                <div className="rz-step-label">
                                    <span className="rz-step-num">1</span>
                                    <span className="rz-step-text">Tell us about the role</span>
                                </div>
                                <div className="rz-form-card">
                                    <div className="rz-form-row">
                                        <div className="rz-form-group">
                                            <label className="rz-form-label">Company</label>
                                            <input
                                                className="rz-input"
                                                type="text"
                                                name="company-name"
                                                placeholder="e.g. Google"
                                            />
                                        </div>
                                        <div className="rz-form-group">
                                            <label className="rz-form-label">Job Title</label>
                                            <input
                                                className="rz-input"
                                                type="text"
                                                name="job-title"
                                                placeholder="e.g. Software Engineer"
                                            />
                                        </div>
                                    </div>
                                    <div className="rz-form-group">
                                        <label className="rz-form-label">Job Description</label>
                                        <textarea
                                            className="rz-textarea"
                                            name="job-description"
                                            placeholder="Paste the full job description here…"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Step 2 — Upload */}
                            <div>
                                <div className="rz-step-label">
                                    <span className="rz-step-num">2</span>
                                    <span className="rz-step-text">Upload your resume</span>
                                </div>
                                <div className="rz-form-card">
                                    <FileUploader onFileSelect={handleFileSelect} />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                className="rz-btn rz-btn-primary rz-btn-lg"
                                type="submit"
                                disabled={!file}
                                style={{ alignSelf: 'flex-end' }}
                            >
                                Analyze resume →
                            </button>
                        </form>
                    </>
                )}
            </div>
        </main>
    );
}

export default Upload;
