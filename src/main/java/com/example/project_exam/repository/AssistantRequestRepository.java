package com.example.project_exam.repository;

import com.example.project_exam.entity.AssistantRequest;
import com.example.project_exam.entity.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssistantRequestRepository extends JpaRepository<AssistantRequest, Long> {

    List<AssistantRequest> findByHelperId(Long helperId);

    List<AssistantRequest> findByStatus(RequestStatus status);
}