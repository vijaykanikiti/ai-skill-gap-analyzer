package com.example.aiskillgapanalyzer.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class LearningRecommendationService {

    public List<String> generateRecommendations(
            List<String> missingSkills) {

        List<String> recommendations = new ArrayList<>();

        if (missingSkills == null || missingSkills.isEmpty()) {

            recommendations.add(
                    "Your resume contains the required skills for this target role."
            );

            recommendations.add(
                    "Focus on advanced projects and practical experience."
            );

            return recommendations;
        }

        for (String skill : missingSkills) {

            if (skill == null || skill.trim().isEmpty()) {
                continue;
            }

            String normalizedSkill =
                    skill.toLowerCase().trim();

            switch (normalizedSkill) {

                case "java":
                    recommendations.add(
                            "Learn Java fundamentals, OOP, collections, exception handling, and advanced Java."
                    );
                    break;

                case "spring boot":
                    recommendations.add(
                            "Learn Spring Boot, REST APIs, Spring Data JPA, dependency injection, and database integration."
                    );
                    break;

                case "react":
                    recommendations.add(
                            "Learn React components, hooks, state management, routing, and API integration."
                    );
                    break;

                case "javascript":
                    recommendations.add(
                            "Improve JavaScript fundamentals, ES6+, asynchronous programming, promises, and DOM concepts."
                    );
                    break;

                case "mysql":
                    recommendations.add(
                            "Learn MySQL queries, joins, indexes, relationships, normalization, and database design."
                    );
                    break;

                case "html":
                    recommendations.add(
                            "Learn HTML5 semantic elements, forms, accessibility, and modern page structure."
                    );
                    break;

                case "css":
                    recommendations.add(
                            "Improve CSS layouts, Flexbox, Grid, responsive design, and modern UI styling."
                    );
                    break;

                case "docker":
                    recommendations.add(
                            "Learn Docker images, containers, Dockerfiles, volumes, networking, and Docker Compose."
                    );
                    break;

                case "aws":
                    recommendations.add(
                            "Learn AWS fundamentals including EC2, S3, IAM, RDS, and basic cloud deployment."
                    );
                    break;

                case "git":
                    recommendations.add(
                            "Learn Git commands, branching, merging, pull requests, and GitHub workflows."
                    );
                    break;

                case "python":
                    recommendations.add(
                            "Learn Python syntax, functions, OOP, data structures, and practical application development."
                    );
                    break;

                default:
                    recommendations.add(
                            "Learn " + skill
                            + " fundamentals and practice the skill through real-world projects."
                    );
                    break;
            }
        }

        return recommendations;
    }
}