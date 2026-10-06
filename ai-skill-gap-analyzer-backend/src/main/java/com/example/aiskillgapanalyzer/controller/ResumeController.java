package com.example.aiskillgapanalyzer.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.aiskillgapanalyzer.entity.Resume;
import com.example.aiskillgapanalyzer.repository.ResumeRepository;
import com.example.aiskillgapanalyzer.service.ResumeTextExtractorService;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeController {

    private final ResumeRepository resumeRepository;

    private final ResumeTextExtractorService resumeTextExtractorService;

    private final String uploadDirectory = "uploads/resumes";


    // Constructor
    public ResumeController(
            ResumeRepository resumeRepository,
            ResumeTextExtractorService resumeTextExtractorService) {

        this.resumeRepository = resumeRepository;

        this.resumeTextExtractorService =
                resumeTextExtractorService;
    }


    // =========================================================
    // UPLOAD RESUME
    // =========================================================

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(

            @RequestParam("file") MultipartFile file,

            @RequestParam("userId") Long userId) {

        try {

            // -------------------------------------------------
            // Check file
            // -------------------------------------------------

            if (file.isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Please select a resume file"
                        ));
            }


            // -------------------------------------------------
            // Get original file name
            // -------------------------------------------------

            String fileName =
                    file.getOriginalFilename();


            if (fileName == null ||
                fileName.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Invalid file"
                        ));
            }


            // -------------------------------------------------
            // Check file type
            // -------------------------------------------------

            String lowerFileName =
                    fileName.toLowerCase();


            if (!lowerFileName.endsWith(".pdf") &&
                !lowerFileName.endsWith(".docx")) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Only PDF and DOCX files are allowed"
                        ));
            }


            // -------------------------------------------------
            // Create upload directory
            // -------------------------------------------------

            Path uploadPath =
                    Paths.get(uploadDirectory);


            if (!Files.exists(uploadPath)) {

                Files.createDirectories(uploadPath);
            }


            // -------------------------------------------------
            // Create unique file name
            // -------------------------------------------------

            String savedFileName =
                    System.currentTimeMillis()
                    + "_"
                    + fileName;


            Path filePath =
                    uploadPath.resolve(savedFileName);


            // -------------------------------------------------
            // Save file
            // -------------------------------------------------

            Files.copy(
                    file.getInputStream(),
                    filePath
            );


            // -------------------------------------------------
            // Save database record
            // -------------------------------------------------

            Resume resume =
                    new Resume();

            resume.setUserId(userId);

            resume.setFileName(fileName);

            resume.setFileType(
                    file.getContentType()
            );

            resume.setFilePath(
                    filePath.toString()
            );

            resume.setUploadedAt(
                    LocalDateTime.now()
            );


            Resume savedResume =
                    resumeRepository.save(resume);


            // -------------------------------------------------
            // Return success response
            // -------------------------------------------------

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(

                            "message",
                            "Resume uploaded successfully",

                            "resumeId",
                            savedResume.getId(),

                            "fileName",
                            savedResume.getFileName(),

                            "userId",
                            savedResume.getUserId()

                    ));


        } catch (IOException e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(Map.of(
                            "message",
                            "Failed to upload resume"
                    ));
        }
    }


    // =========================================================
    // EXTRACT RESUME TEXT
    // =========================================================

    @GetMapping("/extract/{resumeId}")
    public ResponseEntity<?> extractResumeText(
            @PathVariable Long resumeId) {

        try {

            // -------------------------------------------------
            // Find resume from database
            // -------------------------------------------------

            Resume resume =
                    resumeRepository
                            .findById(resumeId)
                            .orElse(null);


            if (resume == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "message",
                                "Resume not found"
                        ));
            }


            // -------------------------------------------------
            // Extract text from resume
            // -------------------------------------------------

            String extractedText =
                    resumeTextExtractorService.extractText(
                            resume.getFilePath(),
                            resume.getFileType()
                    );


            // -------------------------------------------------
            // Check extracted text
            // -------------------------------------------------

            if (extractedText == null ||
                extractedText.trim().isEmpty()) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "message",
                                "No text could be extracted from the resume"
                        ));
            }


            // -------------------------------------------------
            // Return extracted text
            // -------------------------------------------------

            return ResponseEntity.ok(
                    Map.of(

                            "resumeId",
                            resume.getId(),

                            "fileName",
                            resume.getFileName(),

                            "text",
                            extractedText

                    )
            );


        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(Map.of(
                            "message",
                            "Failed to extract resume text"
                    ));
        }
    }
}