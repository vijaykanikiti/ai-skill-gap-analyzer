package com.example.aiskillgapanalyzer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.aiskillgapanalyzer.entity.Recommendation;

public interface RecommendationRepository
        extends JpaRepository<Recommendation, Long> {

    List<Recommendation> findByAnalysisId(
            Long analysisId);

    List<Recommendation> findByUserId(
            Long userId);
}