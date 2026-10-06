package com.example.aiskillgapanalyzer.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.aiskillgapanalyzer.entity.SkillProgress;
import com.example.aiskillgapanalyzer.repository.SkillProgressRepository;

@Service
public class SkillProgressService {

    private final SkillProgressRepository skillProgressRepository;

    public SkillProgressService(
            SkillProgressRepository skillProgressRepository) {

        this.skillProgressRepository =
                skillProgressRepository;
    }


    // ============================================================
    // INITIALIZE PROGRESS
    // ============================================================

    public void initializeProgress(
            Long userId,
            Long analysisId,
            List<String> skills) {

        if (skills == null || skills.isEmpty()) {
            return;
        }


        for (String skill : skills) {

            if (skill == null ||
                    skill.trim().isEmpty()) {

                continue;
            }


            String skillName =
                    skill.trim();


            // Check whether progress already exists
            Optional<SkillProgress> existing =

                    skillProgressRepository
                            .findByAnalysisIdAndSkillName(
                                    analysisId,
                                    skillName
                            );


            // Don't create duplicate records
            if (existing.isPresent()) {
                continue;
            }


            SkillProgress progress =
                    new SkillProgress();


            progress.setUserId(
                    userId
            );


            progress.setAnalysisId(
                    analysisId
            );


            progress.setSkillName(
                    skillName
            );


            progress.setStatus(
                    "NOT_STARTED"
            );


            progress.setProgressPercentage(
                    0
            );


            progress.setUpdatedAt(
                    LocalDateTime.now()
            );


            skillProgressRepository.save(
                    progress
            );
        }
    }


    // ============================================================
    // UPDATE PROGRESS
    // ============================================================

    public SkillProgress updateProgress(
            Long userId,
            Long analysisId,
            String skillName,
            String status,
            Integer progressPercentage) {


        Optional<SkillProgress> existing =

                skillProgressRepository
                        .findByAnalysisIdAndSkillName(
                                analysisId,
                                skillName
                        );


        SkillProgress progress;


        if (existing.isPresent()) {

            progress =
                    existing.get();

        } else {

            progress =
                    new SkillProgress();

            progress.setUserId(
                    userId
            );

            progress.setAnalysisId(
                    analysisId
            );

            progress.setSkillName(
                    skillName
            );
        }


        // ========================================================
        // VALIDATE PERCENTAGE
        // ========================================================

        if (progressPercentage == null) {

            progressPercentage = 0;
        }


        if (progressPercentage < 0) {

            progressPercentage = 0;
        }


        if (progressPercentage > 100) {

            progressPercentage = 100;
        }


        progress.setProgressPercentage(
                progressPercentage
        );


        // ========================================================
        // SET STATUS AUTOMATICALLY
        // ========================================================

        if (progressPercentage >= 100) {

            progress.setStatus(
                    "COMPLETED"
            );

        } else if (progressPercentage > 0) {

            progress.setStatus(
                    "IN_PROGRESS"
            );

        } else {

            progress.setStatus(
                    "NOT_STARTED"
            );
        }


        progress.setUpdatedAt(
                LocalDateTime.now()
        );


        return skillProgressRepository.save(
                progress
        );
    }


    // ============================================================
    // GET PROGRESS BY ANALYSIS
    // ============================================================

    public List<SkillProgress> getByAnalysis(
            Long analysisId) {

        return skillProgressRepository
                .findByAnalysisId(
                        analysisId
                );
    }


    // ============================================================
    // GET PROGRESS BY USER
    // ============================================================

    public List<SkillProgress> getByUser(
            Long userId) {

        return skillProgressRepository
                .findByUserId(
                        userId
                );
    }


    // ============================================================
    // CALCULATE OVERALL PROGRESS
    // ============================================================

    public double calculateOverallProgress(
            Long analysisId) {

        List<SkillProgress> progressList =

                skillProgressRepository
                        .findByAnalysisId(
                                analysisId
                        );


        if (progressList.isEmpty()) {

            return 0.0;
        }


        int total = 0;


        for (SkillProgress progress :
                progressList) {

            if (progress.getProgressPercentage() != null) {

                total +=
                        progress.getProgressPercentage();
            }
        }


        return (double) total /
                progressList.size();
    }
}