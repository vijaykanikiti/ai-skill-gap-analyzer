package com.example.aiskillgapanalyzer.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.example.aiskillgapanalyzer.entity.JobRoleSkill;
import com.example.aiskillgapanalyzer.entity.Skill;
import com.example.aiskillgapanalyzer.repository.JobRoleSkillRepository;
import com.example.aiskillgapanalyzer.repository.SkillRepository;

@Service
public class SkillGapService {

    private final JobRoleSkillRepository jobRoleSkillRepository;

    private final SkillRepository skillRepository;

    public SkillGapService(
            JobRoleSkillRepository jobRoleSkillRepository,
            SkillRepository skillRepository) {

        this.jobRoleSkillRepository =
                jobRoleSkillRepository;

        this.skillRepository =
                skillRepository;
    }

    public SkillGapResult calculateSkillGap(
            Long jobRoleId,
            List<Skill> detectedSkills) {

        List<JobRoleSkill> requiredRoleSkills =
                jobRoleSkillRepository
                        .findByJobRoleId(jobRoleId);

        List<String> requiredSkills =
                new ArrayList<>();

        for (JobRoleSkill roleSkill :
                requiredRoleSkills) {

            Skill skill =
                    skillRepository
                            .findById(
                                    roleSkill.getSkillId()
                            )
                            .orElse(null);

            if (skill != null) {

                requiredSkills.add(
                        skill.getSkillName()
                );
            }
        }

        Set<String> detectedSkillNames =
                new HashSet<>();

        for (Skill skill : detectedSkills) {

            detectedSkillNames.add(
                    skill.getSkillName().toLowerCase()
            );
        }

        List<String> matchedSkills =
                new ArrayList<>();

        List<String> missingSkills =
                new ArrayList<>();

        for (String requiredSkill :
                requiredSkills) {

            if (detectedSkillNames.contains(
                    requiredSkill.toLowerCase())) {

                matchedSkills.add(requiredSkill);

            } else {

                missingSkills.add(requiredSkill);
            }
        }

        double percentage = 0;

        if (!requiredSkills.isEmpty()) {

            percentage =
                    ((double) matchedSkills.size()
                    / requiredSkills.size())
                    * 100;
        }

        percentage =
                Math.round(percentage * 100.0)
                / 100.0;

        return new SkillGapResult(
                requiredSkills,
                matchedSkills,
                missingSkills,
                percentage
        );
    }

    public static class SkillGapResult {

        private List<String> requiredSkills;

        private List<String> matchedSkills;

        private List<String> missingSkills;

        private double matchPercentage;

        public SkillGapResult(
                List<String> requiredSkills,
                List<String> matchedSkills,
                List<String> missingSkills,
                double matchPercentage) {

            this.requiredSkills = requiredSkills;

            this.matchedSkills = matchedSkills;

            this.missingSkills = missingSkills;

            this.matchPercentage =
                    matchPercentage;
        }

        public List<String> getRequiredSkills() {
            return requiredSkills;
        }

        public List<String> getMatchedSkills() {
            return matchedSkills;
        }

        public List<String> getMissingSkills() {
            return missingSkills;
        }

        public double getMatchPercentage() {
            return matchPercentage;
        }
    }
}