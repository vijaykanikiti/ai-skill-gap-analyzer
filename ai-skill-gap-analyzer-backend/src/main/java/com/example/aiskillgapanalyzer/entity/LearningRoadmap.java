package com.example.aiskillgapanalyzer.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "learning_roadmaps")
public class LearningRoadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long analysisId;

    private Long userId;

    private String skillName;

    private String level;

    private String topics;

    private String projectSuggestion;

    private Integer estimatedDays;

    private Integer stepOrder;

    public LearningRoadmap() {
    }

    public LearningRoadmap(
            Long analysisId,
            Long userId,
            String skillName,
            String level,
            String topics,
            String projectSuggestion,
            Integer estimatedDays,
            Integer stepOrder) {

        this.analysisId = analysisId;
        this.userId = userId;
        this.skillName = skillName;
        this.level = level;
        this.topics = topics;
        this.projectSuggestion = projectSuggestion;
        this.estimatedDays = estimatedDays;
        this.stepOrder = stepOrder;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAnalysisId() {
        return analysisId;
    }

    public void setAnalysisId(Long analysisId) {
        this.analysisId = analysisId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getTopics() {
        return topics;
    }

    public void setTopics(String topics) {
        this.topics = topics;
    }

    public String getProjectSuggestion() {
        return projectSuggestion;
    }

    public void setProjectSuggestion(String projectSuggestion) {
        this.projectSuggestion = projectSuggestion;
    }

    public Integer getEstimatedDays() {
        return estimatedDays;
    }

    public void setEstimatedDays(Integer estimatedDays) {
        this.estimatedDays = estimatedDays;
    }

    public Integer getStepOrder() {
        return stepOrder;
    }

    public void setStepOrder(Integer stepOrder) {
        this.stepOrder = stepOrder;
    }
}