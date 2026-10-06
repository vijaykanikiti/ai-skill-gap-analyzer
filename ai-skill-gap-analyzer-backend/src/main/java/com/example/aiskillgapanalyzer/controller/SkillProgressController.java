package com.example.aiskillgapanalyzer.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.aiskillgapanalyzer.entity.ResumeAnalysis;
import com.example.aiskillgapanalyzer.entity.SkillProgress;
import com.example.aiskillgapanalyzer.repository.ResumeAnalysisRepository;
import com.example.aiskillgapanalyzer.service.SkillProgressService;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "http://localhost:5173")
public class SkillProgressController {

    private final SkillProgressService skillProgressService;

    private final ResumeAnalysisRepository resumeAnalysisRepository;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public SkillProgressController(
            SkillProgressService skillProgressService,
            ResumeAnalysisRepository resumeAnalysisRepository) {

        this.skillProgressService =
                skillProgressService;

        this.resumeAnalysisRepository =
                resumeAnalysisRepository;
    }


    // ============================================================
    // UPDATE PROGRESS
    // ============================================================

    @PostMapping("/update")
    public ResponseEntity<?> updateProgress(
            @RequestBody Map<String, Object> request) {

        try {

            Long userId =
                    Long.valueOf(
                            request.get("userId").toString()
                    );

            Long analysisId =
                    Long.valueOf(
                            request.get("analysisId").toString()
                    );

            String skillName =
                    request.get("skillName").toString();


            Integer progressPercentage =
                    Integer.valueOf(
                            request
                                    .get("progressPercentage")
                                    .toString()
                    );


            SkillProgress updatedProgress =
                    skillProgressService.updateProgress(
                            userId,
                            analysisId,
                            skillName,
                            null,
                            progressPercentage
                    );


            return ResponseEntity.ok(
                    updatedProgress
            );


        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to update progress",

                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }


    // ============================================================
    // GET PROGRESS BY ANALYSIS
    // ============================================================

    @GetMapping("/analysis/{analysisId}")
    public ResponseEntity<?> getProgressByAnalysis(
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
            // GET EXISTING PROGRESS
            // ====================================================

            List<SkillProgress> progressList =
                    skillProgressService
                            .getByAnalysis(
                                    analysisId
                            );


            // ====================================================
            // CREATE PROGRESS FOR OLD ANALYSIS
            // ====================================================
            //
            // This is the important fix.
            //
            // If the analysis was created before the progress
            // initialization code was added, there will be no
            // records in skill_progress.
            //
            // We create them here automatically.
            // ====================================================

            if (progressList.isEmpty()) {

                String missingSkills =
                        analysis.getMissingSkills();


                if (missingSkills != null &&
                        !missingSkills.trim().isEmpty()) {


                    List<String> skills =
                            Arrays.stream(
                                    missingSkills.split(",")
                            )
                            .map(String::trim)
                            .filter(
                                    skill ->
                                            !skill.isEmpty()
                            )
                            .toList();


                    skillProgressService.initializeProgress(

                            analysis.getUserId(),

                            analysis.getId(),

                            skills
                    );


                    // Get the newly created records
                    progressList =
                            skillProgressService
                                    .getByAnalysis(
                                            analysisId
                                    );
                }
            }


            // ====================================================
            // CALCULATE OVERALL PROGRESS
            // ====================================================

            double overallProgress =
                    skillProgressService
                            .calculateOverallProgress(
                                    analysisId
                            );


            // ====================================================
            // RESPONSE
            // ====================================================

            return ResponseEntity.ok(
                    Map.of(

                            "analysisId",
                            analysisId,

                            "overallProgress",
                            overallProgress,

                            "skills",
                            progressList
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
                                    "Failed to fetch progress",

                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }


    // ============================================================
    // GET PROGRESS BY USER
    // ============================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getProgressByUser(
            @PathVariable Long userId) {

        try {

            List<SkillProgress> progressList =
                    skillProgressService
                            .getByUser(userId);


            return ResponseEntity.ok(
                    progressList
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
                                    "Failed to fetch user progress",

                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }
}