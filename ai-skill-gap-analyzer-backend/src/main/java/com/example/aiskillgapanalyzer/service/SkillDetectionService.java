package com.example.aiskillgapanalyzer.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.aiskillgapanalyzer.entity.Skill;
import com.example.aiskillgapanalyzer.repository.SkillRepository;

@Service
public class SkillDetectionService {

    private final SkillRepository skillRepository;

    public SkillDetectionService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public List<Skill> detectSkills(String resumeText) {

        List<Skill> detectedSkills = new ArrayList<>();

        if (resumeText == null || resumeText.trim().isEmpty()) {
            return detectedSkills;
        }

        String text = resumeText.toLowerCase();

        List<Skill> allSkills = skillRepository.findAll();

        for (Skill skill : allSkills) {

            if (skill.getSkillName() == null) {
                continue;
            }

            String skillName = skill.getSkillName().toLowerCase().trim();

            if (text.contains(skillName)) {
                detectedSkills.add(skill);
            }
        }

        return detectedSkills;
    }
}