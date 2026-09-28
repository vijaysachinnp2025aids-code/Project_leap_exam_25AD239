package com.example.project_exam.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

@Entity
public class AssistantRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pickupPoint;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String assistanceType;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    @ManyToOne
    private User user;

    @ManyToOne
    private Helper helper;

    public AssistantRequest() {
    }

    public AssistantRequest(Long id, Helper helper, User user, RequestStatus status,
                            String assistanceType, LocalDateTime endTime,
                            String pickupPoint, LocalDateTime startTime) {
        this.id = id;
        this.helper = helper;
        this.user = user;
        this.status = status;
        this.assistanceType = assistanceType;
        this.endTime = endTime;
        this.pickupPoint = pickupPoint;
        this.startTime = startTime;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPickupPoint() { return pickupPoint; }
    public void setPickupPoint(String pickupPoint) { this.pickupPoint = pickupPoint; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public String getAssistanceType() { return assistanceType; }
    public void setAssistanceType(String assistanceType) { this.assistanceType = assistanceType; }
    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Helper getHelper() { return helper; }
    public void setHelper(Helper helper) { this.helper = helper; }
}
