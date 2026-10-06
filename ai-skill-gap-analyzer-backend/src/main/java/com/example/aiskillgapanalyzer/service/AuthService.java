package com.example.aiskillgapanalyzer.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.aiskillgapanalyzer.dto.LoginResponse;
import com.example.aiskillgapanalyzer.entity.User;
import com.example.aiskillgapanalyzer.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@Service
public class AuthService {

    private final UserRepository userRepository;

    @Value("${google.client.id}")
    private String googleClientId;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponse googleLogin(String credential) throws Exception {

        if (credential == null || credential.trim().isEmpty()) {
            throw new IllegalArgumentException("Google credential is required");
        }

        GoogleIdTokenVerifier verifier =
                new GoogleIdTokenVerifier.Builder(
                        new NetHttpTransport(),
                        GsonFactory.getDefaultInstance())
                        .setAudience(
                                Collections.singletonList(googleClientId))
                        .build();

        GoogleIdToken idToken = verifier.verify(credential);

        if (idToken == null) {
            throw new IllegalArgumentException(
                    "Invalid Google credential");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();

        String email = payload.getEmail();

        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Google account email not found");
        }

        email = email.trim().toLowerCase();

        String name = (String) payload.get("name");

        if (name == null || name.trim().isEmpty()) {
            name = email.split("@")[0];
        }

        Optional<User> existingUser =
                userRepository.findByEmail(email);

        User user;

        if (existingUser.isPresent()) {

            // Existing user
            user = existingUser.get();

        } else {

            // New Google user
            user = new User();

            user.setName(name);
            user.setEmail(email);

            /*
             * The current User entity requires password
             * to be non-null.
             *
             * Google users don't need a normal password,
             * so we generate an unusable random value.
             */
            user.setPassword(UUID.randomUUID().toString());

            user.setRole("USER");
            user.setTargetRole(null);
            user.setPhone(null);
            user.setLocation(null);
            user.setCreatedAt(LocalDateTime.now());

            user = userRepository.save(user);
        }

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}