
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
    // PASSWORD RESET - SEND OTP
    // =========================================================

    public void sendPasswordResetOtp(String email) {

        String otp = String.format(
                "%06d",
                new Random().nextInt(1000000)
        );

        LocalDateTime expiryTime =
                LocalDateTime.now().plusMinutes(5);

        PasswordResetToken token =
                new PasswordResetToken();

        token.setEmail(email);
        token.setOtp(otp);
        token.setExpiryTime(expiryTime);
        token.setUsed(false);

        tokenRepository.save(token);

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

        mailSender.send(message);
    }


    // =========================================================
    // TWO-STEP AUTHENTICATION - SEND LOGIN OTP
    // =========================================================

    public String generateLoginOtp() {

        return String.format(
                "%06d",
                new Random().nextInt(1000000)
        );
    }


    // =========================================================
    // TWO-STEP AUTHENTICATION - SEND OTP EMAIL
    // =========================================================

    public void sendLoginOtp(String email, String otp) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "SkillGap AI - Login Verification OTP"
        );

        message.setText(
                "Hello,\n\n"
                + "Your SkillGap AI login verification OTP is:\n\n"
                + otp
                + "\n\n"
                + "This OTP is valid for 5 minutes.\n\n"
                + "If you did not try to login to your account, "
                + "please ignore this email.\n\n"
                + "Regards,\n"
                + "SkillGap AI Team"
        );

        mailSender.send(message);
    }
}

