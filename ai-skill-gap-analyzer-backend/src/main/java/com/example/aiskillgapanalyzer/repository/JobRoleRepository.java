package com.example.aiskillgapanalyzer.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.aiskillgapanalyzer.entity.JobRole;

public interface JobRoleRepository
        extends JpaRepository<JobRole, Long> {

    Optional<JobRole> findByRoleNameIgnoreCase(String roleName);
}