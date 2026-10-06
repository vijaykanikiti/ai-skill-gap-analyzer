package com.example.aiskillgapanalyzer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.aiskillgapanalyzer.entity.JobRoleSkill;

public interface JobRoleSkillRepository
        extends JpaRepository<JobRoleSkill, Long> {

    List<JobRoleSkill> findByJobRoleId(Long jobRoleId);
}