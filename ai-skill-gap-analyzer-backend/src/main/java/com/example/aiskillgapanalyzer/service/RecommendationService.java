package com.example.aiskillgapanalyzer.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.aiskillgapanalyzer.entity.Recommendation;
import com.example.aiskillgapanalyzer.repository.RecommendationRepository;

@Service
public class RecommendationService {

    private final RecommendationRepository
            recommendationRepository;

    public RecommendationService(
            RecommendationRepository recommendationRepository) {

        this.recommendationRepository =
                recommendationRepository;
    }

    public List<Recommendation> generateRecommendations(
            Long analysisId,
            Long userId,
            String missingSkills) {

        List<Recommendation> recommendations =
                new ArrayList<>();

        if (missingSkills == null ||
            missingSkills.trim().isEmpty()) {

            return recommendations;
        }

        String[] skills =
                missingSkills.split(",");

        for (String skill : skills) {

            skill = skill.trim();

            if (skill.isEmpty()) {
                continue;
            }

            addRecommendationsForSkill(
                    recommendations,
                    analysisId,
                    userId,
                    skill
            );
        }

        return recommendationRepository
                .saveAll(recommendations);
    }

    private void addRecommendationsForSkill(
            List<Recommendation> recommendations,
            Long analysisId,
            Long userId,
            String skill) {

        String normalized =
                skill.toLowerCase();

        /*
         * =========================
         * REACT
         * =========================
         */

        if (normalized.equals("react")) {

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Course",
                "React Fundamentals",
                "Learn React components, props, state, hooks and routing.",
                "Intermediate",
                7
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Certification",
                "Frontend Development Certification",
                "Practice frontend development concepts and React application development.",
                "Intermediate",
                14
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Project",
                "React Task Management Application",
                "Build a task manager with authentication, CRUD operations and API integration.",
                "Intermediate",
                7
            );

            return;
        }

        /*
         * =========================
         * JAVA
         * =========================
         */

        if (normalized.equals("java")) {

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Course",
                "Core Java Programming",
                "Learn OOP, collections, exception handling, streams and Java fundamentals.",
                "Intermediate",
                10
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Certification",
                "Java Programming Certification",
                "Demonstrate knowledge of Java programming and object-oriented concepts.",
                "Intermediate",
                15
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Project",
                "Employee Management System",
                "Build a Java application for employee CRUD operations.",
                "Intermediate",
                7
            );

            return;
        }

        /*
         * =========================
         * SPRING BOOT
         * =========================
         */

        if (normalized.equals("spring boot")) {

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Course",
                "Spring Boot REST API Development",
                "Learn controllers, services, repositories, REST APIs and configuration.",
                "Intermediate",
                7
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Certification",
                "Spring Framework Development Certification",
                "Practice Spring Boot application development and backend architecture.",
                "Intermediate",
                14
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Project",
                "Spring Boot Employee API",
                "Build a complete employee management REST API with MySQL.",
                "Intermediate",
                7
            );

            return;
        }

        /*
         * =========================
         * SPRING DATA JPA
         * =========================
         */

        if (normalized.equals("spring data jpa")) {

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Course",
                "Spring Data JPA",
                "Learn entities, repositories, relationships, JPQL and CRUD operations.",
                "Intermediate",
                5
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Certification",
                "Backend Java Development Certification",
                "Practice database integration and persistence using Spring technologies.",
                "Intermediate",
                10
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Project",
                "Spring Boot MySQL CRUD System",
                "Create a CRUD application using Spring Boot, JPA and MySQL.",
                "Intermediate",
                5
            );

            return;
        }

        /*
         * =========================
         * SPRING MVC
         * =========================
         */

        if (normalized.equals("spring mvc")) {

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Course",
                "Spring MVC Fundamentals",
                "Learn MVC architecture, controllers, request mapping and form handling.",
                "Intermediate",
                5
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Certification",
                "Java Web Development Certification",
                "Practice Java web application development using Spring technologies.",
                "Intermediate",
                10
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Project",
                "Student Management Web Application",
                "Build a web application using Spring MVC and MySQL.",
                "Intermediate",
                7
            );

            return;
        }

        /*
         * =========================
         * JAVASCRIPT
         * =========================
         */

        if (normalized.equals("javascript")) {

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Course",
                "Modern JavaScript",
                "Learn ES6, functions, arrays, objects, promises and asynchronous programming.",
                "Intermediate",
                7
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Certification",
                "JavaScript Development Certification",
                "Demonstrate practical JavaScript programming skills.",
                "Intermediate",
                10
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Project",
                "JavaScript Expense Tracker",
                "Build an expense tracker using JavaScript and browser storage.",
                "Intermediate",
                5
            );

            return;
        }

        /*
         * =========================
         * HTML
         * =========================
         */

        if (normalized.equals("html")) {

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Course",
                "HTML Fundamentals",
                "Learn semantic HTML, forms, tables and accessibility.",
                "Beginner",
                3
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Certification",
                "Web Development Fundamentals",
                "Learn the foundations of modern web development.",
                "Beginner",
                7
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Project",
                "Personal Portfolio Website",
                "Create a responsive personal portfolio website.",
                "Beginner",
                3
            );

            return;
        }

        /*
         * =========================
         * CSS
         * =========================
         */

        if (normalized.equals("css")) {

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Course",
                "CSS and Responsive Design",
                "Learn Flexbox, Grid, responsive layouts and animations.",
                "Beginner",
                4
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Certification",
                "Frontend Web Development Certification",
                "Practice modern CSS and responsive web design.",
                "Beginner",
                7
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Project",
                "Responsive Portfolio Website",
                "Build a responsive portfolio using HTML and CSS.",
                "Beginner",
                4
            );

            return;
        }

        /*
         * =========================
         * MYSQL / SQL
         * =========================
         */

        if (normalized.equals("mysql") ||
            normalized.equals("sql")) {

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Course",
                "SQL and MySQL Fundamentals",
                "Learn queries, joins, grouping, subqueries and database design.",
                "Intermediate",
                5
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Certification",
                "SQL Database Certification",
                "Practice relational database concepts and SQL queries.",
                "Intermediate",
                10
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Project",
                "Student Database Management System",
                "Design and build a relational database for student records.",
                "Intermediate",
                5
            );

            return;
        }

        /*
         * =========================
         * REST API
         * =========================
         */

        if (normalized.equals("rest api")) {

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Course",
                "REST API Development",
                "Learn HTTP methods, JSON, REST architecture and status codes.",
                "Intermediate",
                4
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Certification",
                "Backend API Development Certification",
                "Practice designing and developing RESTful APIs.",
                "Intermediate",
                7
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Project",
                "E-Commerce REST API",
                "Build REST APIs for products, users, orders and payments.",
                "Intermediate",
                7
            );

            return;
        }

        /*
         * =========================
         * GIT
         * =========================
         */

        if (normalized.equals("git")) {

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Course",
                "Git and GitHub Fundamentals",
                "Learn repositories, commits, branches, merging and pull requests.",
                "Beginner",
                3
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Certification",
                "Version Control Fundamentals",
                "Practice Git-based source code management.",
                "Beginner",
                5
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Project",
                "GitHub Project Workflow",
                "Create a project and manage development using Git branches and pull requests.",
                "Beginner",
                3
            );

            return;
        }

        /*
         * =========================
         * DOCKER
         * =========================
         */

        if (normalized.equals("docker")) {

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Course",
                "Docker Fundamentals",
                "Learn images, containers, Dockerfiles, volumes and networks.",
                "Beginner",
                5
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Certification",
                "Container Fundamentals",
                "Learn containerization and application deployment concepts.",
                "Beginner",
                10
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Project",
                "Dockerize Spring Boot Application",
                "Containerize a Spring Boot application and MySQL database.",
                "Intermediate",
                5
            );

            return;
        }

        /*
         * =========================
         * PYTHON
         * =========================
         */

        if (normalized.equals("python")) {

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Course",
                "Python Programming",
                "Learn Python syntax, functions, collections, OOP and file handling.",
                "Beginner",
                7
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Certification",
                "Python Programming Certification",
                "Practice Python programming and problem solving.",
                "Beginner",
                10
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Project",
                "Python Data Analysis Application",
                "Build a small application that processes and analyzes data.",
                "Intermediate",
                7
            );

            return;
        }

        /*
         * =========================
         * MACHINE LEARNING
         * =========================
         */

        if (normalized.equals("machine learning")) {

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Course",
                "Machine Learning Fundamentals",
                "Learn regression, classification, clustering and model evaluation.",
                "Intermediate",
                10
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Certification",
                "Machine Learning Certification",
                "Practice machine learning algorithms and model evaluation.",
                "Intermediate",
                15
            );

            add(
                recommendations,
                analysisId,
                userId,
                skill,
                "Project",
                "Machine Learning Prediction System",
                "Build a machine learning model for real-world prediction.",
                "Intermediate",
                10
            );

            return;
        }

        /*
         * =========================
         * DEFAULT
         * =========================
         */

        add(
            recommendations,
            analysisId,
            userId,
            skill,
            "Course",
            skill + " Fundamentals",
            "Learn the fundamentals and practical usage of "
                    + skill + ".",
            "Beginner",
            5
        );

        add(
            recommendations,
            analysisId,
            userId,
            skill,
            "Project",
            skill + " Practical Project",
            "Build a practical project using "
                    + skill + ".",
            "Beginner",
            5
        );
    }

    private void add(
            List<Recommendation> recommendations,
            Long analysisId,
            Long userId,
            String skillName,
            String type,
            String title,
            String description,
            String level,
            Integer estimatedDays) {

        Recommendation recommendation =
                new Recommendation();

        recommendation.setAnalysisId(analysisId);
        recommendation.setUserId(userId);
        recommendation.setSkillName(skillName);
        recommendation.setType(type);
        recommendation.setTitle(title);
        recommendation.setDescription(description);
        recommendation.setLevel(level);
        recommendation.setEstimatedDays(
                estimatedDays
        );

        recommendations.add(recommendation);
    }
}