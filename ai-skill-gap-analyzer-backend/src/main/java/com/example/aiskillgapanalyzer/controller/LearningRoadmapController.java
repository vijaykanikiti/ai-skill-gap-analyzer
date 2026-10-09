package com.example.aiskillgapanalyzer.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.aiskillgapanalyzer.entity.LearningRoadmap;
import com.example.aiskillgapanalyzer.service.LearningRoadmapService;

@RestController
@RequestMapping("/api/roadmap")
@CrossOrigin(origins = "http://localhost:5173")
public class LearningRoadmapController {

    private final LearningRoadmapService learningRoadmapService;

    public LearningRoadmapController(
            LearningRoadmapService learningRoadmapService) {

        this.learningRoadmapService = learningRoadmapService;
    }

    // =========================================================
    // GENERATE LEARNING ROADMAP
    // =========================================================

    @PostMapping("/generate")
    public ResponseEntity<?> generateRoadmap(

            @RequestParam Long resumeId,

            @RequestParam Long userId,

            @RequestParam String missingSkills) {

        try {

            /*
             * Currently the project does not have a separate
             * Analysis entity.
             *
             * Therefore resumeId is used as the analysis
             * reference when calling the existing
             * LearningRoadmapService.
             */

            List<LearningRoadmap> roadmap =
                    learningRoadmapService.generateRoadmap(
                            resumeId,
                            userId,
                            missingSkills
                    );

            return ResponseEntity.ok(roadmap);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Failed to generate learning roadmap: "
                                    + e.getMessage()
                    );
        }
    }
}