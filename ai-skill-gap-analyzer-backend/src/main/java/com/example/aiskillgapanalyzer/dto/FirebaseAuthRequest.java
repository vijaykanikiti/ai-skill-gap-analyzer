package com.example.aiskillgapanalyzer.dto;

public class FirebaseAuthRequest {

    private String idToken;
    private String name;

    public FirebaseAuthRequest() {
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}