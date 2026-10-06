package com.example.aiskillgapanalyzer.dto;

public class ProfileUpdateRequest {

    private String name;

    private String email;

    private String phone;

    private String location;

    private String targetRole;


    // ============================================================
    // GETTERS
    // ============================================================

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getLocation() {
        return location;
    }

    public String getTargetRole() {
        return targetRole;
    }


    // ============================================================
    // SETTERS
    // ============================================================

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }
}