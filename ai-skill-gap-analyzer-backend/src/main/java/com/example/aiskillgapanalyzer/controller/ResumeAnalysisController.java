package com.example.aiskillgapanalyzer.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.aiskillgapanalyzer.entity.LearningRoadmap;
import com.example.aiskillgapanalyzer.entity.Recommendation;
import com.example.aiskillgapanalyzer.entity.Resume;
import com.example.aiskillgapanalyzer.entity.ResumeAnalysis;
import com.example.aiskillgapanalyzer.entity.Skill;

import com.example.aiskillgapanalyzer.repository.JobRoleRepository;
import com.example.aiskillgapanalyzer.repository.LearningRoadmapRepository;
import com.example.aiskillgapanalyzer.repository.RecommendationRepository;
import com.example.aiskillgapanalyzer.repository.ResumeAnalysisRepository;
import com.example.aiskillgapanalyzer.repository.ResumeRepository;

import com.example.aiskillgapanalyzer.service.LearningRoadmapService;
import com.example.aiskillgapanalyzer.service.RecommendationService;
import com.example.aiskillgapanalyzer.service.ResumeTextExtractorService;
import com.example.aiskillgapanalyzer.service.SkillAnalysisService;
import com.example.aiskillgapanalyzer.service.SkillGapService;
import com.example.aiskillgapanalyzer.service.SkillGapService.SkillGapResult;
import com.example.aiskillgapanalyzer.service.SkillProgressService;


@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeAnalysisController {

    // ============================================================
    // REPOSITORIES
    // ============================================================

    private final ResumeRepository resumeRepository;

    private final JobRoleRepository jobRoleRepository;

    private final ResumeAnalysisRepository resumeAnalysisRepository;

    private final LearningRoadmapRepository learningRoadmapRepository;

    private final RecommendationRepository recommendationRepository;


    // ============================================================
    // SERVICES
    // ============================================================

    private final ResumeTextExtractorService resumeTextExtractorService;

    private final SkillAnalysisService skillAnalysisService;

    private final SkillGapService skillGapService;

    private final LearningRoadmapService learningRoadmapService;

    private final RecommendationService recommendationService;

    private final SkillProgressService skillProgressService;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public ResumeAnalysisController(

            ResumeRepository resumeRepository,

            JobRoleRepository jobRoleRepository,

            ResumeAnalysisRepository resumeAnalysisRepository,

            ResumeTextExtractorService resumeTextExtractorService,

            SkillAnalysisService skillAnalysisService,

            SkillGapService skillGapService,

            LearningRoadmapService learningRoadmapService,

            LearningRoadmapRepository learningRoadmapRepository,

            RecommendationService recommendationService,

            RecommendationRepository recommendationRepository,

            SkillProgressService skillProgressService) {


        this.resumeRepository =
                resumeRepository;

        this.jobRoleRepository =
                jobRoleRepository;

        this.resumeAnalysisRepository =
                resumeAnalysisRepository;

        this.resumeTextExtractorService =
                resumeTextExtractorService;

        this.skillAnalysisService =
                skillAnalysisService;

        this.skillGapService =
                skillGapService;

        this.learningRoadmapService =
                learningRoadmapService;

        this.learningRoadmapRepository =
                learningRoadmapRepository;

        this.recommendationService =
                recommendationService;

        this.recommendationRepository =
                recommendationRepository;

        this.skillProgressService =
                skillProgressService;
    }


    // ============================================================
    // ANALYZE RESUME
    // ============================================================

    @PostMapping("/analyze/{resumeId}")
    public ResponseEntity<?> analyzeResume(

            @PathVariable Long resumeId,

            @RequestParam Long jobRoleId) {

        try {

            // ====================================================
            // FIND RESUME
            // ====================================================

            Resume resume =
                    resumeRepository
                            .findById(resumeId)
                            .orElse(null);


            if (resume == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                Map.of(
                                        "message",
                                        "Resume not found"
                                )
                        );
            }


            // ====================================================
            // FIND JOB ROLE
            // ====================================================

            var jobRole =
                    jobRoleRepository
                            .findById(jobRoleId)
                            .orElse(null);


            if (jobRole == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                Map.of(
                                        "message",
                                        "Job role not found"
                                )
                        );
            }


            // ====================================================
            // EXTRACT RESUME TEXT
            // ====================================================

            String resumeText =
                    resumeTextExtractorService
                            .extractText(
                                    resume.getFilePath(),
                                    resume.getFileType()
                            );


            // ====================================================
            // DETECT SKILLS
            // ====================================================

            List<Skill> detectedSkills =
                    skillAnalysisService
                            .detectSkills(resumeText);


            // ====================================================
            // CALCULATE SKILL GAP
            // ====================================================

            SkillGapResult result =
                    skillGapService
                            .calculateSkillGap(
                                    jobRoleId,
                                    detectedSkills
                            );


            // ====================================================
            // CREATE ANALYSIS
            // ====================================================

            ResumeAnalysis analysis =
                    new ResumeAnalysis();


            analysis.setResumeId(
                    resume.getId()
            );


            analysis.setUserId(
                    resume.getUserId()
            );


            analysis.setJobRoleId(
                    jobRole.getId()
            );


            analysis.setTargetRole(
                    jobRole.getRoleName()
            );


            analysis.setDetectedSkills(

                    String.join(
                            ", ",

                            detectedSkills
                                    .stream()
                                    .map(Skill::getSkillName)
                                    .toList()
                    )
            );


            analysis.setMatchedSkills(

                    String.join(
                            ", ",

                            result.getMatchedSkills()
                    )
            );


            analysis.setMissingSkills(

                    String.join(
                            ", ",

                            result.getMissingSkills()
                    )
            );


            analysis.setMatchPercentage(
                    result.getMatchPercentage()
            );


            analysis.setAnalyzedAt(
                    LocalDateTime.now()
            );


            // ====================================================
            // SAVE ANALYSIS
            // ====================================================

            ResumeAnalysis savedAnalysis =
                    resumeAnalysisRepository
                            .save(analysis);


            // ====================================================
            // INITIALIZE SKILL PROGRESS
            // ====================================================
            //
            // Create NOT_STARTED progress records for every
            // missing skill.
            //
            // Example:
            //
            // React       -> 0% -> NOT_STARTED
            // Docker      -> 0% -> NOT_STARTED
            // Spring Boot -> 0% -> NOT_STARTED
            //
            // This makes the Progress page display the skills.
            // ====================================================

            skillProgressService.initializeProgress(

                    resume.getUserId(),

                    savedAnalysis.getId(),

                    result.getMissingSkills()
            );


            // ====================================================
            // RESPONSE
            // ====================================================

            return ResponseEntity.ok(

                    Map.of(

                            "analysisId",
                            savedAnalysis.getId(),

                            "resumeId",
                            resume.getId(),

                            "targetRole",
                            jobRole.getRoleName(),

                            "detectedSkills",

                            detectedSkills
                                    .stream()
                                    .map(Skill::getSkillName)
                                    .toList(),

                            "requiredSkills",
                            result.getRequiredSkills(),

                            "matchedSkills",
                            result.getMatchedSkills(),

                            "missingSkills",
                            result.getMissingSkills(),

                            "matchPercentage",
                            result.getMatchPercentage()
                    )
            );


        } catch (Exception e) {

            e.printStackTrace();


            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "message",
                                    "Resume analysis failed",
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }


    // ============================================================
    // GENERATE LEARNING ROADMAP
    // ============================================================

    @PostMapping("/roadmap/{analysisId}")
    public ResponseEntity<?> generateRoadmap(

            @PathVariable Long analysisId) {

        try {

            // ====================================================
            // FIND ANALYSIS
            // ====================================================

            ResumeAnalysis analysis =
                    resumeAnalysisRepository
                            .findById(analysisId)
                            .orElse(null);


            if (analysis == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                Map.of(
                                        "message",
                                        "Analysis not found"
                                )
                        );
            }


            // ====================================================
            // CHECK EXISTING ROADMAP
            // ====================================================

            List<LearningRoadmap> existingRoadmap =

                    learningRoadmapRepository
                            .findByAnalysisIdOrderByStepOrder(
                                    analysisId
                            );


            if (!existingRoadmap.isEmpty()) {

                return ResponseEntity.ok(
                        existingRoadmap
                );
            }


            // ====================================================
            // GENERATE ROADMAP
            // ====================================================

            List<LearningRoadmap> roadmap =

                    learningRoadmapService
                            .generateRoadmap(

                                    analysis.getId(),

                                    analysis.getUserId(),

                                    analysis.getMissingSkills()
                            );


            // ====================================================
            // RETURN ROADMAP
            // ====================================================

            return ResponseEntity.ok(
                    roadmap
            );


        } catch (Exception e) {

            e.printStackTrace();


            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to generate learning roadmap",
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }


    // ============================================================
    // GENERATE RECOMMENDATIONS
    // ============================================================

    @PostMapping("/recommendations/{analysisId}")
    public ResponseEntity<?> generateRecommendations(

            @PathVariable Long analysisId) {

        try {

            // ====================================================
            // FIND ANALYSIS
            // ====================================================

            ResumeAnalysis analysis =
                    resumeAnalysisRepository
                            .findById(analysisId)
                            .orElse(null);


            if (analysis == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                Map.of(
                                        "message",
                                        "Analysis not found"
                                )
                        );
            }


            // ====================================================
            // CHECK EXISTING RECOMMENDATIONS
            // ====================================================

            List<Recommendation>
                    existingRecommendations =

                    recommendationRepository
                            .findByAnalysisId(
                                    analysisId
                            );


            if (!existingRecommendations.isEmpty()) {

                return ResponseEntity.ok(
                        existingRecommendations
                );
            }


            // ====================================================
            // GENERATE RECOMMENDATIONS
            // ====================================================

            List<Recommendation>
                    recommendations =

                    recommendationService
                            .generateRecommendations(

                                    analysis.getId(),

                                    analysis.getUserId(),

                                    analysis.getMissingSkills()
                            );


            // ====================================================
            // RETURN RECOMMENDATIONS
            // ====================================================

            return ResponseEntity.ok(
                    recommendations
            );


        } catch (Exception e) {

            e.printStackTrace();


            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to generate recommendations",
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }
}