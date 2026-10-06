package com.example.aiskillgapanalyzer.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.aiskillgapanalyzer.entity.LearningRoadmap;
import com.example.aiskillgapanalyzer.repository.LearningRoadmapRepository;

@Service
public class LearningRoadmapService {

    private final LearningRoadmapRepository roadmapRepository;

    public LearningRoadmapService(
            LearningRoadmapRepository roadmapRepository) {

        this.roadmapRepository = roadmapRepository;
    }

    public List<LearningRoadmap> generateRoadmap(
            Long analysisId,
            Long userId,
            String missingSkills) {

        List<LearningRoadmap> roadmap =
                new ArrayList<>();

        if (missingSkills == null ||
            missingSkills.trim().isEmpty()) {

            return roadmap;
        }

        String[] skills =
                missingSkills.split(",");

        int order = 1;

        for (String skill : skills) {

            skill = skill.trim();

            if (skill.isEmpty()) {
                continue;
            }

            RoadmapData data =
                    getRoadmapData(skill);

            LearningRoadmap item =
                    new LearningRoadmap();

            item.setAnalysisId(analysisId);
            item.setUserId(userId);
            item.setSkillName(skill);
            item.setLevel(data.level);
            item.setTopics(data.topics);
            item.setProjectSuggestion(
                    data.projectSuggestion
            );
            item.setEstimatedDays(
                    data.estimatedDays
            );
            item.setStepOrder(order++);

            roadmapRepository.save(item);

            roadmap.add(item);
        }

        return roadmap;
    }

    private RoadmapData getRoadmapData(
            String skill) {

        String normalized =
                skill.toLowerCase();

        if (normalized.equals("java")) {

            return new RoadmapData(
                    "Intermediate",
                    "OOP, Collections, Exception Handling, Streams, Multithreading",
                    "Build a Java Employee Management System",
                    10
            );
        }

        if (normalized.equals("spring boot")) {

            return new RoadmapData(
                    "Intermediate",
                    "REST API, Controllers, Services, Repositories, Configuration",
                    "Build a Spring Boot REST API",
                    7
            );
        }

        if (normalized.equals("spring mvc")) {

            return new RoadmapData(
                    "Intermediate",
                    "MVC architecture, Controllers, Request Mapping, Forms",
                    "Build a Spring MVC Student Management System",
                    5
            );
        }

        if (normalized.equals("spring data jpa")) {

            return new RoadmapData(
                    "Intermediate",
                    "Entities, Repositories, Relationships, JPQL, CRUD",
                    "Build a Spring Boot + MySQL CRUD application",
                    5
            );
        }

        if (normalized.equals("react")) {

            return new RoadmapData(
                    "Intermediate",
                    "Components, Props, State, Hooks, Routing, API Integration",
                    "Build a React Task Management Application",
                    7
            );
        }

        if (normalized.equals("javascript")) {

            return new RoadmapData(
                    "Intermediate",
                    "Variables, Functions, Arrays, Objects, ES6, Async Programming",
                    "Build a JavaScript Expense Tracker",
                    7
            );
        }

        if (normalized.equals("html")) {

            return new RoadmapData(
                    "Beginner",
                    "Semantic HTML, Forms, Tables, Accessibility",
                    "Build a Personal Portfolio Website",
                    3
            );
        }

        if (normalized.equals("css")) {

            return new RoadmapData(
                    "Beginner",
                    "Selectors, Flexbox, Grid, Responsive Design, Animations",
                    "Build a Responsive Portfolio Website",
                    4
            );
        }

        if (normalized.equals("mysql") ||
            normalized.equals("sql")) {

            return new RoadmapData(
                    "Intermediate",
                    "SELECT, JOIN, GROUP BY, Subqueries, Indexes, Database Design",
                    "Build a Student Database Management System",
                    5
            );
        }

        if (normalized.equals("rest api")) {

            return new RoadmapData(
                    "Intermediate",
                    "HTTP Methods, JSON, REST Architecture, Status Codes",
                    "Build a REST API for an E-Commerce Application",
                    4
            );
        }

        if (normalized.equals("git")) {

            return new RoadmapData(
                    "Beginner",
                    "Repositories, Branches, Commit, Merge, Pull Request",
                    "Create and manage a project using Git and GitHub",
                    3
            );
        }

        if (normalized.equals("docker")) {

            return new RoadmapData(
                    "Beginner",
                    "Images, Containers, Dockerfile, Volumes, Networks",
                    "Containerize a Spring Boot Application",
                    5
            );
        }

        if (normalized.equals("python")) {

            return new RoadmapData(
                    "Beginner",
                    "Syntax, Functions, Collections, OOP, File Handling",
                    "Build a Python Data Analysis Application",
                    7
            );
        }

        if (normalized.equals("pandas")) {

            return new RoadmapData(
                    "Intermediate",
                    "DataFrames, Series, Filtering, Grouping, Data Cleaning",
                    "Build a Sales Data Analysis Project",
                    5
            );
        }

        if (normalized.equals("numpy")) {

            return new RoadmapData(
                    "Intermediate",
                    "Arrays, Indexing, Mathematical Operations, Statistics",
                    "Build a Numerical Data Analysis Project",
                    4
            );
        }

        if (normalized.equals("statistics")) {

            return new RoadmapData(
                    "Intermediate",
                    "Mean, Median, Probability, Distribution, Correlation",
                    "Analyze a Real-World Dataset",
                    5
            );
        }

        if (normalized.equals("power bi")) {

            return new RoadmapData(
                    "Intermediate",
                    "Data Import, Data Modeling, DAX, Charts, Dashboards",
                    "Build a Business Analytics Dashboard",
                    5
            );
        }

        if (normalized.equals("machine learning")) {

            return new RoadmapData(
                    "Intermediate",
                    "Regression, Classification, Clustering, Model Evaluation",
                    "Build a Machine Learning Prediction System",
                    10
            );
        }

        if (normalized.equals("scikit-learn")) {

            return new RoadmapData(
                    "Intermediate",
                    "Preprocessing, Models, Training, Testing, Evaluation",
                    "Build a Classification Machine Learning Project",
                    7
            );
        }

        if (normalized.equals("tensorflow")) {

            return new RoadmapData(
                    "Intermediate",
                    "Neural Networks, Tensors, Training, Evaluation",
                    "Build an Image Classification Project",
                    10
            );
        }

        if (normalized.equals("deep learning")) {

            return new RoadmapData(
                    "Advanced",
                    "Neural Networks, CNN, RNN, Training, Optimization",
                    "Build a Deep Learning Image Classifier",
                    14
            );
        }

        if (normalized.equals("typescript")) {

            return new RoadmapData(
                    "Intermediate",
                    "Types, Interfaces, Classes, Generics, Modules",
                    "Build a TypeScript React Application",
                    5
            );
        }

        if (normalized.equals("angular")) {

            return new RoadmapData(
                    "Intermediate",
                    "Components, Services, Routing, Forms, HTTP Client",
                    "Build an Angular Dashboard",
                    7
            );
        }

        if (normalized.equals("node.js")) {

            return new RoadmapData(
                    "Intermediate",
                    "Node.js, Express, REST APIs, Middleware",
                    "Build a Node.js REST API",
                    7
            );
        }

        if (normalized.equals("mongodb")) {

            return new RoadmapData(
                    "Intermediate",
                    "Collections, Documents, Queries, Aggregation",
                    "Build a MongoDB CRUD Application",
                    5
            );
        }

        if (normalized.equals("aws")) {

            return new RoadmapData(
                    "Intermediate",
                    "EC2, S3, IAM, RDS, Deployment",
                    "Deploy a Spring Boot Application on AWS",
                    7
            );
        }

        if (normalized.equals("azure")) {

            return new RoadmapData(
                    "Intermediate",
                    "Azure App Service, Storage, Database, Deployment",
                    "Deploy a Web Application on Azure",
                    7
            );
        }

        return new RoadmapData(
                "Beginner",
                "Fundamentals, Practical Exercises, Real-World Usage",
                "Build a small project using " + skill,
                5
        );
    }

    private static class RoadmapData {

        private String level;
        private String topics;
        private String projectSuggestion;
        private Integer estimatedDays;

        public RoadmapData(
                String level,
                String topics,
                String projectSuggestion,
                Integer estimatedDays) {

            this.level = level;
            this.topics = topics;
            this.projectSuggestion =
                    projectSuggestion;
            this.estimatedDays =
                    estimatedDays;
        }
    }
}