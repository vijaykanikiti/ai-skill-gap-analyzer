package com.example.aiskillgapanalyzer.controller;

import com.example.aiskillgapanalyzer.service.JobSearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobSearchController {

    private final JobSearchService jobSearchService;

    public JobSearchController(
            JobSearchService jobSearchService) {

        this.jobSearchService = jobSearchService;
    }

    /**
     * Get real job opportunities based on
     * selected role and selected location.
     *
     * Example:
     *
     * /api/jobs/recommendations
     * ?role=Full%20Stack%20Developer
     * &location=Bangalore
     */
    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendedJobs(
            @RequestParam String role,
            @RequestParam String location) {

        try {

            // Validate role
            if (role == null || role.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Job role is required.");
            }

            // Validate location
            if (location == null
                    || location.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Job location is required.");
            }

            /*
             * Search real jobs from Adzuna.
             *
             * The service will:
             *
             * 1. Search related role names
             * 2. Search the selected location
             * 3. Filter unrelated jobs
             * 4. Remove duplicate jobs
             * 5. Calculate relevance
             * 6. Return real company/job information
             */
            List<Map<String, Object>> jobs =
                    jobSearchService.searchJobs(
                            role.trim(),
                            location.trim()
                    );

            /*
             * Build response.
             */
            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "role",
                    role.trim()
            );

            response.put(
                    "location",
                    location.trim()
            );

            response.put(
                    "jobs",
                    jobs
            );

            response.put(
                    "count",
                    jobs.size()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Failed to fetch jobs: "
                                    + e.getMessage()
                    );
        }
    }


    @GetMapping("/companies")
public ResponseEntity<?> getRecommendedCompanies(
        @RequestParam String role,
        @RequestParam String location) {

    try {

        if (role == null || role.trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Role is required.");
        }

        if (location == null || location.trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Location is required.");
        }

        List<Map<String, Object>> companies =
                jobSearchService.searchCompanies(
                        role,
                        location
                );

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "role",
                role.trim()
        );

        response.put(
                "location",
                location.trim()
        );

        response.put(
                "companies",
                companies
        );

        response.put(
                "count",
                companies.size()
        );

        response.put(
                "source",
                "Google Places"
        );

        return ResponseEntity.ok(
                response
        );

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity
                .internalServerError()
                .body(
                        "Failed to fetch companies: "
                                + e.getMessage()
                );
    }
}
}