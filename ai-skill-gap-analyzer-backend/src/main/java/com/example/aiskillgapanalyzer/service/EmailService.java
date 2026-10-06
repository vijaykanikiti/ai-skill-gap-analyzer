package com.example.aiskillgapanalyzer.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.aiskillgapanalyzer.entity.PasswordResetToken;
import com.example.aiskillgapanalyzer.repository.PasswordResetTokenRepository;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final PasswordResetTokenRepository tokenRepository;

    public EmailService(
            JavaMailSender mailSender,
            PasswordResetTokenRepository tokenRepository) {

        this.mailSender = mailSender;
        this.tokenRepository = tokenRepository;
    }

    // =========================================================
    // SEND OTP
    // =========================================================

    public void sendPasswordResetOtp(String email) {

        // Generate 6 digit OTP
        String otp = String.format(
                "%06d",
                new Random().nextInt(1000000)
        );

        // OTP expires after 5 minutes
        LocalDateTime expiryTime =
                LocalDateTime.now().plusMinutes(5);

        // Save OTP in database
        PasswordResetToken token =
                new PasswordResetToken();

        token.setEmail(email);
        token.setOtp(otp);
        token.setExpiryTime(expiryTime);
        token.setUsed(false);

        tokenRepository.save(token);

        // Create email
        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "SkillGap AI - Password Reset OTP"
        );

        message.setText(
                "Hello,\n\n"
                + "Your OTP for resetting your SkillGap AI "
                + "password is:\n\n"
                + otp
                + "\n\n"
                + "This OTP is valid for 5 minutes.\n\n"
                + "If you did not request a password reset, "
                + "please ignore this email.\n\n"
                + "Regards,\n"
                + "SkillGap AI Team"
        );

        // Send email
        mailSender.send(message);
    }
}