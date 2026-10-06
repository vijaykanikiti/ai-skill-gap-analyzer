package com.example.aiskillgapanalyzer.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.aiskillgapanalyzer.dto.ForgotPasswordRequest;
import com.example.aiskillgapanalyzer.dto.GoogleLoginRequest;
import com.example.aiskillgapanalyzer.dto.LoginRequest;
import com.example.aiskillgapanalyzer.dto.LoginResponse;
import com.example.aiskillgapanalyzer.dto.RegisterRequest;
import com.example.aiskillgapanalyzer.dto.ResetPasswordRequest;
import com.example.aiskillgapanalyzer.dto.UserResponse;
import com.example.aiskillgapanalyzer.dto.VerifyOtpRequest;

import com.example.aiskillgapanalyzer.entity.PasswordResetToken;
import com.example.aiskillgapanalyzer.entity.User;

import com.example.aiskillgapanalyzer.repository.PasswordResetTokenRepository;
import com.example.aiskillgapanalyzer.repository.UserRepository;

import com.example.aiskillgapanalyzer.service.AuthService;
import com.example.aiskillgapanalyzer.service.EmailService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final AuthService authService;
    private final EmailService emailService;
    private final PasswordResetTokenRepository tokenRepository;

    public AuthController(
            UserRepository userRepository,
            AuthService authService,
            EmailService emailService,
            PasswordResetTokenRepository tokenRepository) {

        this.userRepository = userRepository;
        this.authService = authService;
        this.emailService = emailService;
        this.tokenRepository = tokenRepository;
    }

    // =========================================================
    // REGISTER
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        // Check required fields
        if (request.getName() == null ||
            request.getName().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Name is required"
                    ));
        }

        if (request.getEmail() == null ||
            request.getEmail().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Email is required"
                    ));
        }

        if (request.getPassword() == null ||
            request.getPassword().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Password is required"
                    ));
        }

        // Normalize email
        String email = request.getEmail()
                .trim()
                .toLowerCase();

        // Check duplicate email
        if (userRepository.existsByEmail(email)) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            "Email is already registered"
                    ));
        }

        // Create user
        User user = new User();

        user.setName(
                request.getName().trim()
        );

        user.setEmail(email);

        user.setPassword(
                request.getPassword()
        );

        // Normal registration
        user.setProvider("LOCAL");
        user.setGoogleId(null);

        // Every normal registration is USER
        user.setRole("USER");

        user.setTargetRole(
                request.getTargetRole()
        );

        user.setPhone(
                request.getPhone()
        );

        user.setLocation(
                request.getLocation()
        );

        user.setCreatedAt(
                LocalDateTime.now()
        );

        // Save user
        User savedUser =
                userRepository.save(user);

        // Response
        UserResponse response =
                new UserResponse(
                        savedUser.getId(),
                        savedUser.getName(),
                        savedUser.getEmail(),
                        savedUser.getRole(),
                        savedUser.getTargetRole(),
                        savedUser.getPhone(),
                        savedUser.getLocation()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =========================================================
    // NORMAL LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        // Check email
        if (request.getEmail() == null ||
            request.getEmail().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Email is required"
                    ));
        }

        // Check password
        if (request.getPassword() == null ||
            request.getPassword().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Password is required"
                    ));
        }

        // Normalize email
        String email = request.getEmail()
                .trim()
                .toLowerCase();

        // Find user
        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        // User doesn't exist
        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }

        /*
         * Google users don't have a normal password.
         * Therefore check for null first.
         */
        if (user.getPassword() == null ||
            !user.getPassword()
                    .equals(request.getPassword())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }

        // Login response
        LoginResponse response =
                new LoginResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                );

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // GOOGLE LOGIN
    // =========================================================

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(
            @RequestBody GoogleLoginRequest request) {

        try {

            // Verify Google credential
            LoginResponse response =
                    authService.googleLogin(
                            request.getCredential()
                    );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid Google login"
                    ));
        }
    }

    // =========================================================
    // FORGOT PASSWORD - SEND OTP
    // =========================================================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        // Check email
        if (request.getEmail() == null ||
            request.getEmail().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Email is required"
                    ));
        }

        // Normalize email
        String email = request.getEmail()
                .trim()
                .toLowerCase();

        // Check user
        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "No account found with this email"
                    ));
        }

        try {

            // Generate and send OTP
            emailService.sendPasswordResetOtp(email);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "OTP sent successfully to your email"
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Failed to send OTP"
                    ));
        }
    }

    // =========================================================
    // VERIFY OTP
    // =========================================================

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody VerifyOtpRequest request) {

        // Check email
        if (request.getEmail() == null ||
            request.getEmail().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Email is required"
                    ));
        }

        // Check OTP
        if (request.getOtp() == null ||
            request.getOtp().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "OTP is required"
                    ));
        }

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        String otp = request.getOtp()
                .trim();

        // Find latest OTP
        PasswordResetToken token =
                tokenRepository
                        .findTopByEmailOrderByIdDesc(email)
                        .orElse(null);

        if (token == null) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "OTP not found. Please request a new OTP."
                    ));
        }

        // Check if OTP was already used
        if (token.isUsed()) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "OTP has already been used"
                    ));
        }

        // Check expiry
        if (LocalDateTime.now()
                .isAfter(token.getExpiryTime())) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "OTP has expired. Please request a new OTP."
                    ));
        }

        // Check OTP
        if (!token.getOtp().equals(otp)) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "Invalid OTP"
                    ));
        }

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "OTP verified successfully"
                )
        );
    }

    // =========================================================
    // RESET PASSWORD
    // =========================================================

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        // Check email
        if (request.getEmail() == null ||
            request.getEmail().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Email is required"
                    ));
        }

        // Check OTP
        if (request.getOtp() == null ||
            request.getOtp().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "OTP is required"
                    ));
        }

        // Check new password
        if (request.getNewPassword() == null ||
            request.getNewPassword().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "New password is required"
                    ));
        }

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        String otp = request.getOtp()
                .trim();

        // Find latest OTP
        PasswordResetToken token =
                tokenRepository
                        .findTopByEmailOrderByIdDesc(email)
                        .orElse(null);

        if (token == null) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "OTP not found"
                    ));
        }

        // Check if OTP was already used
        if (token.isUsed()) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "OTP has already been used"
                    ));
        }

        // Check expiry
        if (LocalDateTime.now()
                .isAfter(token.getExpiryTime())) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "OTP has expired"
                    ));
        }

        // Check OTP
        if (!token.getOtp().equals(otp)) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "Invalid OTP"
                    ));
        }

        // Find user
        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "User not found"
                    ));
        }

        // Update password
        user.setPassword(
                request.getNewPassword()
        );

        userRepository.save(user);

        // Mark OTP as used
        token.setUsed(true);

        tokenRepository.save(token);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Password reset successfully"
                )
        );
    }
}