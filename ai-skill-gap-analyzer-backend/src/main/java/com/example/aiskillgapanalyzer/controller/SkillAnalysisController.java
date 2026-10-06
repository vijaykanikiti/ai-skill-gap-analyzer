package com.example.aiskillgapanalyzer.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.aiskillgapanalyzer.entity.Skill;
import com.example.aiskillgapanalyzer.service.SkillAnalysisService;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "http://localhost:5173")
public class SkillAnalysisController {

    private final SkillAnalysisService skillAnalysisService;

    public SkillAnalysisController(
            SkillAnalysisService skillAnalysisService) {

        this.skillAnalysisService =
                skillAnalysisService;
    }

    @PostMapping("/detect")
    public ResponseEntity<?> detectSkills(
            @RequestBody Map<String, String> request) {

        String resumeText =
                request.get("resumeText");

        if (resumeText == null ||
            resumeText.trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body(
                        Map.of(
                            "message",
                            "Resume text is required"
                        )
                    );
        }

        List<Skill> skills =
                skillAnalysisService
                        .detectSkills(resumeText);

        List<Map<String, Object>> result =
                skills.stream()
                        .map(skill -> {

                            Map<String, Object> data =
                                    new HashMap<>();

                            data.put(
                                    "id",
                                    skill.getId()
                            );

                            data.put(
                                    "skillName",
                                    skill.getSkillName()
                            );

                            data.put(
                                    "category",
                                    skill.getCategory()
                            );

                            return data;
                        })
                        .toList();

        return ResponseEntity.ok(
                Map.of(
                    "detectedSkills",
                    result,
                    "count",
                    result.size()
                )
        );
    }
}