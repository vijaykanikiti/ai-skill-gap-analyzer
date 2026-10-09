package com.example.aiskillgapanalyzer.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

import org.springframework.stereotype.Service;

@Service
public class FirebaseAuthService {

    public FirebaseToken verifyToken(String idToken) {

        try {

            FirebaseToken decodedToken =
                    FirebaseAuth.getInstance().verifyIdToken(idToken);

            return decodedToken;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Invalid Firebase ID token"
            );
        }
    }
}