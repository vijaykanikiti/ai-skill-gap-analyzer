package com.example.aiskillgapanalyzer.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;

@Service
public class ResumeTextExtractorService {

    public String extractText(String filePath, String fileType)
            throws IOException {

        Path path = Paths.get(filePath);

        if (!Files.exists(path)) {
            throw new IOException("Resume file not found");
        }

        if (fileType != null &&
            fileType.equalsIgnoreCase("application/pdf")) {

            return extractPdfText(path);
        }

        if (fileType != null &&
            (fileType.equalsIgnoreCase(
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
             || fileType.equalsIgnoreCase("application/msword"))) {

            return extractDocxText(path);
        }

        String lowerPath = path.toString().toLowerCase();

        if (lowerPath.endsWith(".pdf")) {
            return extractPdfText(path);
        }

        if (lowerPath.endsWith(".docx")) {
            return extractDocxText(path);
        }

        throw new IOException(
                "Unsupported resume format"
        );
    }


    private String extractPdfText(Path path)
            throws IOException {

        try (PDDocument document =
                     Loader.loadPDF(path.toFile())) {

            PDFTextStripper stripper =
                    new PDFTextStripper();

            return stripper.getText(document);
        }
    }


    private String extractDocxText(Path path)
            throws IOException {

        try (InputStream inputStream =
                     Files.newInputStream(path);
             XWPFDocument document =
                     new XWPFDocument(inputStream);
             XWPFWordExtractor extractor =
                     new XWPFWordExtractor(document)) {

            return extractor.getText();
        }
    }
}