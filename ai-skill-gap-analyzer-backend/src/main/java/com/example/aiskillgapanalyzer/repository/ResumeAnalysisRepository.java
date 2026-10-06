package com.example.aiskillgapanalyzer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.aiskillgapanalyzer.entity.ResumeAnalysis;

public interface ResumeAnalysisRepository
        extends JpaRepository<ResumeAnalysis, Long> {

    List<ResumeAnalysis> findByUserId(Long userId);

    List<ResumeAnalysis> findByUserIdOrderByAnalyzedAtDesc(
            Long userId
    );

    List<ResumeAnalysis> findAllByOrderByAnalyzedAtDesc();
}