package com.example.aiskillgapanalyzer.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.aiskillgapanalyzer.entity.Recommendation;
import com.example.aiskillgapanalyzer.service.RecommendationService;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:5173")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(
            RecommendationService recommendationService) {

        this.recommendationService = recommendationService;
    }

    // =========================================================
    // GENERATE RECOMMENDATIONS
    // =========================================================

    @PostMapping("/generate")
    public ResponseEntity<?> generateRecommendations(

            @RequestParam Long resumeId,

            @RequestParam Long userId,

            @RequestParam String missingSkills) {

        try {

            /*
             * Currently there is no separate Analysis entity.
             *
             * Therefore resumeId is used as the analysis reference.
             */

            List<Recommendation> recommendations =
                    recommendationService.generateRecommendations(
                            resumeId,
                            userId,
                            missingSkills
                    );

            return ResponseEntity.ok(
                    recommendations
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Failed to generate recommendations: "
                                    + e.getMessage()
                    );
        }
    }
}