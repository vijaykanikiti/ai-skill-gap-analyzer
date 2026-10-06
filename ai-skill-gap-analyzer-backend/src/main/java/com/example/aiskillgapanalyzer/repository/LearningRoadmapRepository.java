package com.example.aiskillgapanalyzer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.aiskillgapanalyzer.entity.LearningRoadmap;

public interface LearningRoadmapRepository
        extends JpaRepository<LearningRoadmap, Long> {

    List<LearningRoadmap> findByAnalysisIdOrderByStepOrder(
            Long analysisId);

    List<LearningRoadmap> findByUserIdOrderByStepOrder(
            Long userId);
}