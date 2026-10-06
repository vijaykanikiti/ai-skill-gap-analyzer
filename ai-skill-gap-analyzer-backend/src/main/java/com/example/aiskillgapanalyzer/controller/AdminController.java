package com.example.aiskillgapanalyzer.controller;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.aiskillgapanalyzer.entity.Resume;
import com.example.aiskillgapanalyzer.entity.ResumeAnalysis;
import com.example.aiskillgapanalyzer.entity.User;
import com.example.aiskillgapanalyzer.repository.ResumeAnalysisRepository;
import com.example.aiskillgapanalyzer.repository.ResumeRepository;
import com.example.aiskillgapanalyzer.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final ResumeRepository resumeRepository;

    public AdminController(
            UserRepository userRepository,
            ResumeAnalysisRepository resumeAnalysisRepository,
            ResumeRepository resumeRepository) {

        this.userRepository = userRepository;
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.resumeRepository = resumeRepository;
    }

    // =========================
    // ADMIN OVERVIEW
    // =========================

    @GetMapping("/overview")
    public Map<String, Object> getOverview() {

        List<User> users =
                userRepository.findAll();

        List<ResumeAnalysis> analyses =
                resumeAnalysisRepository.findAll();

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "totalUsers",
                users.size()
        );

        response.put(
                "totalAnalyses",
                analyses.size()
        );

        response.put(
                "completedAnalyses",
                analyses.size()
        );

        response.put(
                "pendingAnalyses",
                0
        );

        double averageMatch = analyses
                .stream()
                .mapToDouble(
                        analysis -> analysis.getMatchPercentage()
                )
                .average()
                .orElse(0);

        response.put(
                "averageMatchPercentage",
                Math.round(averageMatch)
        );

        return response;
    }

    // =========================
    // ADMIN USERS
    // =========================

    @GetMapping("/users")
    public List<Map<String, Object>> getUsers() {

        List<User> users =
                userRepository
                        .findAllByOrderByCreatedAtDesc();

        List<Map<String, Object>> response =
                new ArrayList<>();

        for (User user : users) {

            Map<String, Object> data =
                    new HashMap<>();

            data.put("id", user.getId());
            data.put("name", user.getName());
            data.put("email", user.getEmail());
            data.put("role", user.getRole());
            data.put(
                    "targetRole",
                    user.getTargetRole()
            );
            data.put("phone", user.getPhone());
            data.put(
                    "location",
                    user.getLocation()
            );
            data.put(
                    "createdAt",
                    user.getCreatedAt()
            );

            response.add(data);
        }

        return response;
    }

    // =========================
    // ADMIN ANALYSES
    // =========================

    @GetMapping("/analyses")
    public List<Map<String, Object>> getAnalyses() {

        List<ResumeAnalysis> analyses =
                resumeAnalysisRepository
                        .findAllByOrderByAnalyzedAtDesc();

        List<Map<String, Object>> response =
                new ArrayList<>();

        for (ResumeAnalysis analysis : analyses) {

            Map<String, Object> data =
                    new HashMap<>();

            data.put("id", analysis.getId());
            data.put(
                    "userId",
                    analysis.getUserId()
            );
            data.put(
                    "resumeId",
                    analysis.getResumeId()
            );
            data.put(
                    "jobRoleId",
                    analysis.getJobRoleId()
            );
            data.put(
                    "targetRole",
                    analysis.getTargetRole()
            );
            data.put(
                    "detectedSkills",
                    analysis.getDetectedSkills()
            );
            data.put(
                    "matchedSkills",
                    analysis.getMatchedSkills()
            );
            data.put(
                    "missingSkills",
                    analysis.getMissingSkills()
            );
            data.put(
                    "matchPercentage",
                    analysis.getMatchPercentage()
            );
            data.put(
                    "analyzedAt",
                    analysis.getAnalyzedAt()
            );

            User user = userRepository
                    .findById(analysis.getUserId())
                    .orElse(null);

            if (user != null) {

                data.put(
                        "userName",
                        user.getName()
                );

                data.put(
                        "userEmail",
                        user.getEmail()
                );
            }

            response.add(data);
        }

        return response;
    }

    // =========================
    // ADMIN ACTIVITY
    // =========================

    @GetMapping("/activity")
    public List<Map<String, Object>> getActivity() {

        List<Map<String, Object>> activities =
                new ArrayList<>();

        // -------------------------
        // USER REGISTRATIONS
        // -------------------------

        List<User> users =
                userRepository.findAll();

        for (User user : users) {

            Map<String, Object> activity =
                    new HashMap<>();

            activity.put(
                    "id",
                    "user-" + user.getId()
            );

            activity.put(
                    "type",
                    "Registration"
            );

            activity.put(
                    "user",
                    user.getName()
            );

            activity.put(
                    "description",
                    "Created a new account"
            );

            activity.put(
                    "timestamp",
                    user.getCreatedAt()
            );

            activity.put(
                    "status",
                    "Completed"
            );

            activities.add(activity);
        }

        // -------------------------
        // RESUME ANALYSES
        // -------------------------

        List<ResumeAnalysis> analyses =
                resumeAnalysisRepository.findAll();

        for (ResumeAnalysis analysis : analyses) {

            Map<String, Object> activity =
                    new HashMap<>();

            activity.put(
                    "id",
                    "analysis-" + analysis.getId()
            );

            activity.put(
                    "type",
                    "Resume Analysis"
            );

            User user = userRepository
                    .findById(analysis.getUserId())
                    .orElse(null);

            activity.put(
                    "user",
                    user != null
                            ? user.getName()
                            : "Unknown User"
            );

            activity.put(
                    "description",
                    "Completed resume skill-gap analysis"
            );

            activity.put(
                    "timestamp",
                    analysis.getAnalyzedAt()
            );

            activity.put(
                    "status",
                    "Completed"
            );

            activities.add(activity);
        }

        // -------------------------
        // RESUME UPLOADS
        // -------------------------

        List<Resume> resumes =
                resumeRepository.findAll();

        for (Resume resume : resumes) {

            Map<String, Object> activity =
                    new HashMap<>();

            activity.put(
                    "id",
                    "resume-" + resume.getId()
            );

            activity.put(
                    "type",
                    "Resume Upload"
            );

            User user = userRepository
                    .findById(resume.getUserId())
                    .orElse(null);

            activity.put(
                    "user",
                    user != null
                            ? user.getName()
                            : "Unknown User"
            );

            activity.put(
                    "description",
                    "Uploaded a new resume"
            );

            activity.put(
                    "timestamp",
                    resume.getUploadedAt()
            );

            activity.put(
                    "status",
                    "Completed"
            );

            activities.add(activity);
        }

        // -------------------------
        // SORT BY LATEST
        // -------------------------

        activities.sort(
                Comparator.comparing(
                        activity -> {

                            Object timestamp =
                                    activity.get("timestamp");

                            if (timestamp == null) {
                                return "";
                            }

                            return timestamp.toString();
                        },
                        Comparator.reverseOrder()
                )
        );

        return activities;
    }
}