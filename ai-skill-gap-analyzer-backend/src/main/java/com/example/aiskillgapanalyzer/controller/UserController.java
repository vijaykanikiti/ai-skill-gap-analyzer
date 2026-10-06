package com.example.aiskillgapanalyzer.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.aiskillgapanalyzer.dto.ProfileUpdateRequest;
import com.example.aiskillgapanalyzer.entity.User;
import com.example.aiskillgapanalyzer.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public UserController(UserRepository userRepository) {

        this.userRepository = userRepository;
    }


    // ============================================================
    // GET USER PROFILE
    // ============================================================

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserProfile(
            @PathVariable Long userId) {

        try {

            Optional<User> optionalUser =
                    userRepository.findById(userId);


            if (optionalUser.isEmpty()) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                Map.of(
                                        "message",
                                        "User not found"
                                )
                        );
            }


            User user = optionalUser.get();


            return ResponseEntity.ok(
                    Map.of(
                            "id",
                            user.getId(),

                            "name",
                            user.getName(),

                            "email",
                            user.getEmail(),

                            "role",
                            user.getRole() == null
                                    ? ""
                                    : user.getRole(),

                            "targetRole",
                            user.getTargetRole() == null
                                    ? ""
                                    : user.getTargetRole(),

                            "phone",
                            user.getPhone() == null
                                    ? ""
                                    : user.getPhone(),

                            "location",
                            user.getLocation() == null
                                    ? ""
                                    : user.getLocation()
                    )
            );


        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to load profile",

                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }


    // ============================================================
    // UPDATE USER PROFILE
    // ============================================================

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable Long userId,
            @RequestBody ProfileUpdateRequest request) {

        try {

            Optional<User> optionalUser =
                    userRepository.findById(userId);


            if (optionalUser.isEmpty()) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                Map.of(
                                        "message",
                                        "User not found"
                                )
                        );
            }


            User user = optionalUser.get();


            // ====================================================
            // UPDATE NAME
            // ====================================================

            if (request.getName() != null &&
                    !request.getName().trim().isEmpty()) {

                user.setName(
                        request.getName().trim()
                );
            }


            // ====================================================
            // UPDATE EMAIL
            // ====================================================

            if (request.getEmail() != null &&
                    !request.getEmail().trim().isEmpty()) {

                String newEmail =
                        request.getEmail()
                                .trim()
                                .toLowerCase();


                // Check whether another user already
                // has this email
                Optional<User> existingUser =
                        userRepository.findByEmail(
                                newEmail
                        );


                if (existingUser.isPresent() &&
                        !existingUser.get()
                                .getId()
                                .equals(userId)) {

                    return ResponseEntity
                            .status(
                                    HttpStatus.CONFLICT
                            )
                            .body(
                                    Map.of(
                                            "message",
                                            "Email is already registered"
                                    )
                            );
                }


                user.setEmail(newEmail);
            }


            // ====================================================
            // UPDATE PHONE
            // ====================================================

            user.setPhone(
                    request.getPhone()
            );


            // ====================================================
            // UPDATE LOCATION
            // ====================================================

            user.setLocation(
                    request.getLocation()
            );


            // ====================================================
            // UPDATE TARGET ROLE
            // ====================================================

            user.setTargetRole(
                    request.getTargetRole()
            );


            // ====================================================
            // SAVE
            // ====================================================

            User savedUser =
                    userRepository.save(user);


            // ====================================================
            // RESPONSE
            // ====================================================

            return ResponseEntity.ok(
                    Map.of(
                            "id",
                            savedUser.getId(),

                            "name",
                            savedUser.getName(),

                            "email",
                            savedUser.getEmail(),

                            "role",
                            savedUser.getRole() == null
                                    ? ""
                                    : savedUser.getRole(),

                            "targetRole",
                            savedUser.getTargetRole() == null
                                    ? ""
                                    : savedUser.getTargetRole(),

                            "phone",
                            savedUser.getPhone() == null
                                    ? ""
                                    : savedUser.getPhone(),

                            "location",
                            savedUser.getLocation() == null
                                    ? ""
                                    : savedUser.getLocation()
                    )
            );


        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to update profile",

                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }
}