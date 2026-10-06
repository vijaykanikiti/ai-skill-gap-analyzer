package com.example.aiskillgapanalyzer;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.aiskillgapanalyzer.entity.JobRole;
import com.example.aiskillgapanalyzer.entity.JobRoleSkill;
import com.example.aiskillgapanalyzer.entity.Skill;
import com.example.aiskillgapanalyzer.repository.JobRoleRepository;
import com.example.aiskillgapanalyzer.repository.JobRoleSkillRepository;
import com.example.aiskillgapanalyzer.repository.SkillRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final JobRoleRepository jobRoleRepository;
    private final SkillRepository skillRepository;
    private final JobRoleSkillRepository jobRoleSkillRepository;

    public DataInitializer(
            JobRoleRepository jobRoleRepository,
            SkillRepository skillRepository,
            JobRoleSkillRepository jobRoleSkillRepository) {

        this.jobRoleRepository = jobRoleRepository;
        this.skillRepository = skillRepository;
        this.jobRoleSkillRepository = jobRoleSkillRepository;
    }

    @Override
    public void run(String... args) {

        if (jobRoleRepository.count() > 0) {
            return;
        }

        System.out.println("Initializing job roles and skills...");

        /*
         * =========================
         * SKILLS
         * =========================
         */

        Map<String, Skill> skills = new HashMap<>();

        createSkill(skills, "Java", "Technical");
        createSkill(skills, "Python", "Technical");
        createSkill(skills, "C", "Technical");
        createSkill(skills, "C++", "Technical");
        createSkill(skills, "JavaScript", "Technical");
        createSkill(skills, "TypeScript", "Technical");

        createSkill(skills, "HTML", "Technical");
        createSkill(skills, "CSS", "Technical");

        createSkill(skills, "React", "Technical");
        createSkill(skills, "Angular", "Technical");
        createSkill(skills, "Node.js", "Technical");

        createSkill(skills, "Spring Boot", "Technical");
        createSkill(skills, "Spring MVC", "Technical");
        createSkill(skills, "Spring Data JPA", "Technical");

        createSkill(skills, "REST API", "Technical");
        createSkill(skills, "Microservices", "Technical");

        createSkill(skills, "MySQL", "Database");
        createSkill(skills, "PostgreSQL", "Database");
        createSkill(skills, "MongoDB", "Database");

        createSkill(skills, "SQL", "Database");

        createSkill(skills, "Git", "Tools");
        createSkill(skills, "GitHub", "Tools");
        createSkill(skills, "Docker", "Tools");

        createSkill(skills, "AWS", "Cloud");
        createSkill(skills, "Azure", "Cloud");

        createSkill(skills, "Excel", "Tools");
        createSkill(skills, "Power BI", "Tools");

        createSkill(skills, "Statistics", "Technical");
        createSkill(skills, "Pandas", "Technical");
        createSkill(skills, "NumPy", "Technical");

        createSkill(skills, "Machine Learning", "AI/ML");
        createSkill(skills, "Deep Learning", "AI/ML");
        createSkill(skills, "TensorFlow", "AI/ML");
        createSkill(skills, "Scikit-learn", "AI/ML");

        createSkill(skills, "Communication", "Soft Skill");
        createSkill(skills, "Teamwork", "Soft Skill");
        createSkill(skills, "Problem Solving", "Soft Skill");
        createSkill(skills, "Leadership", "Soft Skill");
        createSkill(skills, "Time Management", "Soft Skill");

        /*
         * =========================
         * JOB ROLES
         * =========================
         */

        JobRole javaDeveloper = createJobRole(
                "Java Developer",
                "Develops applications using Java and Spring technologies."
        );

        JobRole fullStackDeveloper = createJobRole(
                "Full Stack Developer",
                "Develops both frontend and backend web applications."
        );

        JobRole frontendDeveloper = createJobRole(
                "Frontend Developer",
                "Develops user interfaces and frontend web applications."
        );

        JobRole backendDeveloper = createJobRole(
                "Backend Developer",
                "Develops server-side applications and APIs."
        );

        JobRole dataAnalyst = createJobRole(
                "Data Analyst",
                "Analyzes data and creates business insights."
        );

        JobRole dataScientist = createJobRole(
                "Data Scientist",
                "Uses data science and machine learning techniques."
        );

        JobRole mlEngineer = createJobRole(
                "Machine Learning Engineer",
                "Builds and deploys machine learning systems."
        );

        /*
         * =========================
         * JAVA DEVELOPER SKILLS
         * =========================
         */

        addSkill(javaDeveloper, skills, "Java", "Required");
        addSkill(javaDeveloper, skills, "Spring Boot", "Required");
        addSkill(javaDeveloper, skills, "Spring MVC", "Required");
        addSkill(javaDeveloper, skills, "Spring Data JPA", "Required");
        addSkill(javaDeveloper, skills, "MySQL", "Required");
        addSkill(javaDeveloper, skills, "REST API", "Required");
        addSkill(javaDeveloper, skills, "Git", "Required");
        addSkill(javaDeveloper, skills, "SQL", "Required");
        addSkill(javaDeveloper, skills, "Docker", "Optional");

        /*
         * =========================
         * FULL STACK DEVELOPER
         * =========================
         */

        addSkill(fullStackDeveloper, skills, "Java", "Required");
        addSkill(fullStackDeveloper, skills, "Spring Boot", "Required");
        addSkill(fullStackDeveloper, skills, "Spring MVC", "Required");
        addSkill(fullStackDeveloper, skills, "Spring Data JPA", "Required");
        addSkill(fullStackDeveloper, skills, "HTML", "Required");
        addSkill(fullStackDeveloper, skills, "CSS", "Required");
        addSkill(fullStackDeveloper, skills, "JavaScript", "Required");
        addSkill(fullStackDeveloper, skills, "React", "Required");
        addSkill(fullStackDeveloper, skills, "MySQL", "Required");
        addSkill(fullStackDeveloper, skills, "REST API", "Required");
        addSkill(fullStackDeveloper, skills, "Git", "Required");
        addSkill(fullStackDeveloper, skills, "Docker", "Optional");

        /*
         * =========================
         * FRONTEND DEVELOPER
         * =========================
         */

        addSkill(frontendDeveloper, skills, "HTML", "Required");
        addSkill(frontendDeveloper, skills, "CSS", "Required");
        addSkill(frontendDeveloper, skills, "JavaScript", "Required");
        addSkill(frontendDeveloper, skills, "React", "Required");
        addSkill(frontendDeveloper, skills, "TypeScript", "Required");
        addSkill(frontendDeveloper, skills, "Git", "Required");
        addSkill(frontendDeveloper, skills, "REST API", "Required");
        addSkill(frontendDeveloper, skills, "Angular", "Optional");

        /*
         * =========================
         * BACKEND DEVELOPER
         * =========================
         */

        addSkill(backendDeveloper, skills, "Java", "Required");
        addSkill(backendDeveloper, skills, "Spring Boot", "Required");
        addSkill(backendDeveloper, skills, "Spring MVC", "Required");
        addSkill(backendDeveloper, skills, "Spring Data JPA", "Required");
        addSkill(backendDeveloper, skills, "REST API", "Required");
        addSkill(backendDeveloper, skills, "MySQL", "Required");
        addSkill(backendDeveloper, skills, "SQL", "Required");
        addSkill(backendDeveloper, skills, "Git", "Required");
        addSkill(backendDeveloper, skills, "Docker", "Optional");
        addSkill(backendDeveloper, skills, "Microservices", "Optional");

        /*
         * =========================
         * DATA ANALYST
         * =========================
         */

        addSkill(dataAnalyst, skills, "SQL", "Required");
        addSkill(dataAnalyst, skills, "Excel", "Required");
        addSkill(dataAnalyst, skills, "Python", "Required");
        addSkill(dataAnalyst, skills, "Pandas", "Required");
        addSkill(dataAnalyst, skills, "NumPy", "Required");
        addSkill(dataAnalyst, skills, "Statistics", "Required");
        addSkill(dataAnalyst, skills, "Power BI", "Required");
        addSkill(dataAnalyst, skills, "MySQL", "Optional");

        /*
         * =========================
         * DATA SCIENTIST
         * =========================
         */

        addSkill(dataScientist, skills, "Python", "Required");
        addSkill(dataScientist, skills, "SQL", "Required");
        addSkill(dataScientist, skills, "Pandas", "Required");
        addSkill(dataScientist, skills, "NumPy", "Required");
        addSkill(dataScientist, skills, "Statistics", "Required");
        addSkill(dataScientist, skills, "Machine Learning", "Required");
        addSkill(dataScientist, skills, "Scikit-learn", "Required");
        addSkill(dataScientist, skills, "Deep Learning", "Optional");
        addSkill(dataScientist, skills, "TensorFlow", "Optional");

        /*
         * =========================
         * MACHINE LEARNING ENGINEER
         * =========================
         */

        addSkill(mlEngineer, skills, "Python", "Required");
        addSkill(mlEngineer, skills, "Machine Learning", "Required");
        addSkill(mlEngineer, skills, "Scikit-learn", "Required");
        addSkill(mlEngineer, skills, "TensorFlow", "Required");
        addSkill(mlEngineer, skills, "Deep Learning", "Required");
        addSkill(mlEngineer, skills, "NumPy", "Required");
        addSkill(mlEngineer, skills, "Pandas", "Required");
        addSkill(mlEngineer, skills, "Statistics", "Required");
        addSkill(mlEngineer, skills, "Git", "Required");
        addSkill(mlEngineer, skills, "Docker", "Optional");

        System.out.println("Job roles and skills initialized successfully.");
    }

    private void createSkill(
            Map<String, Skill> skills,
            String skillName,
            String category) {

        Skill skill = new Skill(skillName, category);

        Skill savedSkill = skillRepository.save(skill);

        skills.put(skillName.toLowerCase(), savedSkill);
    }

    private JobRole createJobRole(
            String roleName,
            String description) {

        JobRole jobRole = new JobRole(
                roleName,
                description
        );

        return jobRoleRepository.save(jobRole);
    }

    private void addSkill(
            JobRole jobRole,
            Map<String, Skill> skills,
            String skillName,
            String importance) {

        Skill skill = skills.get(
                skillName.toLowerCase()
        );

        if (skill == null) {
            System.out.println(
                    "Skill not found: " + skillName
            );
            return;
        }

        JobRoleSkill jobRoleSkill =
                new JobRoleSkill(
                        jobRole.getId(),
                        skill.getId(),
                        importance
                );

        jobRoleSkillRepository.save(jobRoleSkill);
    }
}