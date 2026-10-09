package com.example.aiskillgapanalyzer.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.aiskillgapanalyzer.entity.Resume;
import com.example.aiskillgapanalyzer.entity.Skill;
import com.example.aiskillgapanalyzer.repository.ResumeRepository;
import com.example.aiskillgapanalyzer.service.LearningRecommendationService;
import com.example.aiskillgapanalyzer.service.ResumeTextExtractorService;
import com.example.aiskillgapanalyzer.service.SkillDetectionService;
import com.example.aiskillgapanalyzer.service.SkillGapService;
import com.example.aiskillgapanalyzer.service.SkillGapService.SkillGapResult;

@RestController
@RequestMapping("/api/skill-gap")
@CrossOrigin(origins = "http://localhost:5173")
public class SkillGapController {

    private final ResumeRepository resumeRepository;
    private final ResumeTextExtractorService resumeTextExtractorService;
    private final SkillDetectionService skillDetectionService;
    private final SkillGapService skillGapService;
    private final LearningRecommendationService learningRecommendationService;

    public SkillGapController(
            ResumeRepository resumeRepository,
            ResumeTextExtractorService resumeTextExtractorService,
            SkillDetectionService skillDetectionService,
            SkillGapService skillGapService,
            LearningRecommendationService learningRecommendationService) {

        this.resumeRepository = resumeRepository;
        this.resumeTextExtractorService = resumeTextExtractorService;
        this.skillDetectionService = skillDetectionService;
        this.skillGapService = skillGapService;
        this.learningRecommendationService = learningRecommendationService;
    }

    @PostMapping("/analyze/{resumeId}/{jobRoleId}")
    public ResponseEntity<?> analyzeSkillGap(
            @PathVariable Long resumeId,
            @PathVariable Long jobRoleId) {

        try {

            // ==========================================
            // 1. FIND RESUME
            // ==========================================

            Resume resume = resumeRepository.findById(resumeId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Resume not found with ID: " + resumeId
                            )
                    );

            // ==========================================
            // 2. EXTRACT RESUME TEXT
            // ==========================================

            String resumeText =
                    resumeTextExtractorService.extractText(
                            resume.getFilePath(),
                            resume.getFileType()
                    );

            if (resumeText == null ||
                    resumeText.trim().isEmpty()) {

                return ResponseEntity.badRequest().body(
                        Map.of(
                                "message",
                                "Could not extract text from the resume."
                        )
                );
            }

            // ==========================================
            // 3. DETECT SKILLS FROM RESUME
            // ==========================================

            List<Skill> detectedSkills =
                    skillDetectionService.detectSkills(resumeText);

            // ==========================================
            // 4. CALCULATE SKILL GAP
            // ==========================================

            SkillGapResult result =
                    skillGapService.calculateSkillGap(
                            jobRoleId,
                            detectedSkills
                    );

            // ==========================================
            // 5. GENERATE LEARNING RECOMMENDATIONS
            // ==========================================

            List<String> learningRecommendations =
                    learningRecommendationService
                            .generateRecommendations(
                                    result.getMissingSkills()
                            );

            // ==========================================
            // 6. PREPARE RESPONSE
            // ==========================================

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "resumeId",
                    resumeId
            );

            response.put(
                    "jobRoleId",
                    jobRoleId
            );

            response.put(
                    "targetRole",
                    resume.getTargetRole()
            );

            response.put(
                    "location",
                    resume.getLocation()
            );

            // ==========================================
            // DETECTED SKILLS
            // ==========================================

            response.put(
                    "detectedSkills",
                    detectedSkills.stream()
                            .map(Skill::getSkillName)
                            .toList()
            );

            // ==========================================
            // REQUIRED SKILLS
            // ==========================================

            response.put(
                    "requiredSkills",
                    result.getRequiredSkills()
            );

            // ==========================================
            // MATCHED SKILLS
            // ==========================================

            response.put(
                    "matchedSkills",
                    result.getMatchedSkills()
            );

            // ==========================================
            // MISSING SKILLS
            // ==========================================

            response.put(
                    "missingSkills",
                    result.getMissingSkills()
            );

            // ==========================================
            // MATCH PERCENTAGE
            // ==========================================

            response.put(
                    "matchPercentage",
                    result.getMatchPercentage()
            );

            // ==========================================
            // LEARNING RECOMMENDATIONS
            // ==========================================

            response.put(
                    "learningRecommendations",
                    learningRecommendations
            );

            // ==========================================
            // RETURN RESPONSE
            // ==========================================

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            Map.of(
                                    "message",
                                    "Skill gap analysis failed.",

                                    "error",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unknown error"
                            )
                    );
        }
    }
}