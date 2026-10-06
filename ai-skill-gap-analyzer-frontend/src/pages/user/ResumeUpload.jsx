import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Upload,
  FileText,
  File,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

import "../../styles/resume.css";

function ResumeUpload() {

  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const MAX_SIZE = 5 * 1024 * 1024;

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  const validateFile = (file) => {

    setError("");

    if (!file) {
      return false;
    }

    if (!allowedTypes.includes(file.type)) {

      setError(
        "Please upload a PDF, DOC, or DOCX file."
      );

      return false;
    }

    if (file.size > MAX_SIZE) {

      setError(
        "File size must be less than 5 MB."
      );

      return false;
    }

    return true;
  };


  const handleFile = (file) => {

    if (!validateFile(file)) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };


  const handleInputChange = (e) => {

    const file = e.target.files[0];

    handleFile(file);
  };


  const handleDragEnter = (e) => {

    e.preventDefault();
    e.stopPropagation();

    setDragActive(true);
  };


  const handleDragLeave = (e) => {

    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);
  };


  const handleDragOver = (e) => {

    e.preventDefault();
    e.stopPropagation();

    setDragActive(true);
  };


  const handleDrop = (e) => {

    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    const file = e.dataTransfer.files[0];

    handleFile(file);
  };


  const removeFile = () => {

    setSelectedFile(null);
    setError("");
    setUploadProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const formatFileSize = (bytes) => {

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };


  // REAL BACKEND UPLOAD
  const handleAnalyze = async () => {

    if (!selectedFile) {

      setError(
        "Please select your resume first."
      );

      return;
    }

    setError("");
    setUploading(true);
    setUploadProgress(10);

    try {

      // Get logged-in user
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {

        setError(
          "User session not found. Please login again."
        );

        setUploading(false);
        setUploadProgress(0);

        return;
      }

      const user = JSON.parse(storedUser);

      if (!user.id) {

        setError(
          "User ID not found. Please login again."
        );

        setUploading(false);
        setUploadProgress(0);

        return;
      }


      // Create FormData
      const formData = new FormData();

      formData.append(
        "file",
        selectedFile
      );

      formData.append(
        "userId",
        user.id
      );


      setUploadProgress(30);


      // Call Spring Boot API
      const response = await fetch(
        "http://localhost:8080/api/resumes/upload",
        {
          method: "POST",
          body: formData
        }
      );


      setUploadProgress(70);


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Resume upload failed."
        );
      }


      setUploadProgress(100);


      // Store uploaded resume information
      localStorage.setItem(
        "resume",
        JSON.stringify(data)
      );


      // Navigate after successful upload
      setTimeout(() => {

        setUploading(false);

        navigate("/resume-analysis");

      }, 500);


    } catch (error) {

      console.error(
        "Resume upload error:",
        error
      );

      setError(
        error.message ||
        "Unable to upload resume. Please try again."
      );

      setUploading(false);
      setUploadProgress(0);
    }
  };


  return (

    <div className="resume-page">

      {/* HEADER */}

      <header className="resume-page-header">

        <div>

          <span className="resume-label">
            RESUME ANALYSIS
          </span>

          <h1>
            Upload Your Resume
          </h1>

          <p>
            Upload your latest resume and let AI identify
            your skills, experience, and career strengths.
          </p>

        </div>

      </header>


      {/* CONTENT */}

      <div className="resume-content">


        {/* MAIN UPLOAD CARD */}

        <section className="resume-upload-card">


          <div className="resume-card-header">

            <div className="resume-header-icon">
              <Sparkles size={21} />
            </div>

            <div>

              <h2>
                Upload Resume
              </h2>

              <p>
                Supported formats: PDF, DOC, DOCX
              </p>

            </div>

          </div>


          {!selectedFile ? (

            <div
              className={`resume-dropzone ${
                dragActive ? "drag-active" : ""
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() =>
                fileInputRef.current?.click()
              }
            >

              <div className="upload-icon-circle">
                <Upload size={28} />
              </div>

              <h3>
                Drag & Drop your resume here
              </h3>

              <p>
                or click to browse from your computer
              </p>

              <span className="browse-btn">
                Browse Files
              </span>

              <small>
                Maximum file size: 5 MB
              </small>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleInputChange}
                hidden
              />

            </div>

          ) : (

            <div className="selected-file-card">

              <div className="selected-file-left">

                <div className="file-icon">
                  <FileText size={25} />
                </div>

                <div className="file-details">

                  <strong>
                    {selectedFile.name}
                  </strong>

                  <span>
                    {formatFileSize(
                      selectedFile.size
                    )}
                  </span>

                </div>

              </div>


              <button
                className="remove-file-btn"
                onClick={removeFile}
                disabled={uploading}
              >
                <X size={18} />
              </button>

            </div>

          )}


          {/* ERROR */}

          {error && (

            <div className="resume-error">

              <AlertCircle size={17} />

              <span>
                {error}
              </span>

            </div>

          )}


          {/* UPLOAD PROGRESS */}

          {uploading && (

            <div className="upload-progress-container">

              <div className="progress-header">

                <span>
                  {uploadProgress < 70
                    ? "Uploading resume..."
                    : "Preparing resume analysis..."
                  }
                </span>

                <strong>
                  {uploadProgress}%
                </strong>

              </div>


              <div className="resume-progress">

                <div
                  style={{
                    width: `${uploadProgress}%`
                  }}
                />

              </div>

            </div>

          )}


          {/* ANALYZE BUTTON */}

          <button
            className="analyze-resume-btn"
            onClick={handleAnalyze}
            disabled={uploading}
          >

            {uploading ? (

              <>
                Analyzing Resume...
              </>

            ) : (

              <>
                Analyze My Resume
                <ArrowRight size={18} />
              </>

            )}

          </button>


          {/* SECURITY */}

          <div className="resume-security">

            <ShieldCheck size={17} />

            <span>
              Your resume will be processed securely for
              skill analysis.
            </span>

          </div>

        </section>


        {/* RIGHT INFORMATION */}

        <section className="resume-info-card">

          <div className="resume-info-title">

            <div className="resume-info-icon">
              <FileText size={20} />
            </div>

            <h2>
              What we'll analyze
            </h2>

          </div>


          <div className="analysis-list">


            <div className="analysis-item">

              <div className="analysis-number">
                01
              </div>

              <div>

                <strong>
                  Technical Skills
                </strong>

                <p>
                  Programming languages, frameworks,
                  databases, cloud and development tools.
                </p>

              </div>

            </div>


            <div className="analysis-item">

              <div className="analysis-number">
                02
              </div>

              <div>

                <strong>
                  Soft Skills
                </strong>

                <p>
                  Communication, leadership, teamwork
                  and other professional abilities.
                </p>

              </div>

            </div>


            <div className="analysis-item">

              <div className="analysis-number">
                03
              </div>

              <div>

                <strong>
                  Education
                </strong>

                <p>
                  Degrees, certifications and educational
                  background.
                </p>

              </div>

            </div>


            <div className="analysis-item">

              <div className="analysis-number">
                04
              </div>

              <div>

                <strong>
                  Experience
                </strong>

                <p>
                  Work experience, projects and
                  professional achievements.
                </p>

              </div>

            </div>


          </div>


          <div className="resume-tip">

            <CheckCircle2 size={18} />

            <div>

              <strong>
                AI-powered analysis
              </strong>

              <p>
                Your extracted information will be used
                to compare your profile with your target
                job requirements.
              </p>

            </div>

          </div>


        </section>

      </div>

    </div>
  );
}

export default ResumeUpload;