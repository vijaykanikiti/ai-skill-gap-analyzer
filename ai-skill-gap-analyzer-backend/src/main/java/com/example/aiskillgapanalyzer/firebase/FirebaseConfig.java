package com.example.aiskillgapanalyzer.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initializeFirebase() throws IOException {

        if (FirebaseApp.getApps().isEmpty()) {

            FileInputStream serviceAccount =
                    new FileInputStream("firebase-service-account.json");

            FirebaseOptions options =
                    FirebaseOptions.builder()
                            .setCredentials(
                                    GoogleCredentials.fromStream(serviceAccount)
                            )
                            .build();

            FirebaseApp.initializeApp(options);

            System.out.println("Firebase Admin SDK initialized successfully.");
        }
    }
}