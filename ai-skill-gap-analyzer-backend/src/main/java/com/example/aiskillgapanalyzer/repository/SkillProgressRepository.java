package com.example.aiskillgapanalyzer.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.aiskillgapanalyzer.entity.SkillProgress;

public interface SkillProgressRepository
        extends JpaRepository<SkillProgress, Long> {

    List<SkillProgress> findByUserId(Long userId);

    List<SkillProgress> findByAnalysisId(Long analysisId);

    Optional<SkillProgress> findByAnalysisIdAndSkillName(
            Long analysisId,
            String skillName);
}