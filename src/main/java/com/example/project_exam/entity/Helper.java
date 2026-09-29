package com.example.project_exam.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
@Table(name = "helpers")
public class Helper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Helper name is required")
    private String name;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Phone number must be exactly 10 digits"
    )
    private String phone;

    private boolean available = true;

    // ONE HELPER -> MANY ASSISTANCE REQUESTS
    @OneToMany(mappedBy = "helper")
    @JsonIgnore
    private List<AssistantRequest> assistanceRequests =
            new ArrayList<>();

    // Default constructor
    public Helper() {
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public List<AssistantRequest> getAssistanceRequests() {
        return assistanceRequests;
    }

    public void setAssistanceRequests(
            List<AssistantRequest> assistanceRequests) {
        this.assistanceRequests = assistanceRequests;
    }
}