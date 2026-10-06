package com.example.aiskillgapanalyzer.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.aiskillgapanalyzer.entity.JobRole;
import com.example.aiskillgapanalyzer.repository.JobRoleRepository;

@RestController
@RequestMapping("/api/job-roles")
@CrossOrigin(origins = "http://localhost:5173")
public class JobRoleController {

    private final JobRoleRepository jobRoleRepository;

    public JobRoleController(
            JobRoleRepository jobRoleRepository) {

        this.jobRoleRepository = jobRoleRepository;
    }

    @GetMapping
    public List<JobRole> getAllJobRoles() {

        return jobRoleRepository.findAll();
    }
}