package com.example.aiskillgapanalyzer.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.aiskillgapanalyzer.entity.Skill;
import com.example.aiskillgapanalyzer.repository.SkillRepository;

@Service
public class SkillAnalysisService {

    private final SkillRepository skillRepository;

    public SkillAnalysisService(
            SkillRepository skillRepository) {

        this.skillRepository = skillRepository;
    }

    public List<Skill> detectSkills(String resumeText) {

        List<Skill> detectedSkills =
                new ArrayList<>();

        if (resumeText == null ||
            resumeText.trim().isEmpty()) {

            return detectedSkills;
        }

        String text =
                resumeText.toLowerCase();

        List<Skill> allSkills =
                skillRepository.findAll();

        for (Skill skill : allSkills) {

            String skillName =
                    skill.getSkillName().toLowerCase();

            if (containsSkill(text, skillName)) {

                detectedSkills.add(skill);
            }
        }

        return detectedSkills;
    }

    private boolean containsSkill(
            String text,
            String skillName) {

        if (skillName.equals("c")) {

            return text.matches(
                    ".*\\bc\\b.*"
            );
        }

        return text.contains(skillName);
    }
}