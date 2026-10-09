
package com.example.aiskillgapanalyzer.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.aiskillgapanalyzer.entity.LoginOtp;

public interface LoginOtpRepository
        extends JpaRepository<LoginOtp, Long> {

    Optional<LoginOtp> findTopByEmailOrderByIdDesc(String email);
}

