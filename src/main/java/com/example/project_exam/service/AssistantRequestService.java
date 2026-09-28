package com.example.project_exam.service;

import com.example.project_exam.entity.AssistantRequest;
import com.example.project_exam.entity.RequestStatus;
import com.example.project_exam.repository.AssistantRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssistantRequestService {

    private final AssistantRequestRepository repository;

    public AssistantRequestService(AssistantRequestRepository repository) {
        this.repository = repository;
    }

    public AssistantRequest createRequest(AssistantRequest request) {
        request.setStatus(RequestStatus.REQUESTED);
        return repository.save(request);
    }

    public List<AssistantRequest> getAllRequests() {
        return repository.findAll();
    }

    public AssistantRequest getRequestById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
    }

    public AssistantRequest updateRequest(Long id, AssistantRequest request) {
        AssistantRequest existing = getRequestById(id);
        existing.setHelper(request.getHelper());
        existing.setUser(request.getUser());
        existing.setAssistanceType(request.getAssistanceType());
        existing.setPickupPoint(request.getPickupPoint());
        existing.setStartTime(request.getStartTime());
        existing.setEndTime(request.getEndTime());
        existing.setStatus(request.getStatus());
        return repository.save(existing);
    }

    public AssistantRequest completeRequest(Long id) {
        AssistantRequest request = getRequestById(id);
        request.setStatus(RequestStatus.COMPLETED);
        return repository.save(request);
    }

    public AssistantRequest cancelRequest(Long id) {
        AssistantRequest request = getRequestById(id);
        request.setStatus(RequestStatus.CANCELLED);
        return repository.save(request);
    }

    public void deleteRequest(Long id) {
        repository.delete(getRequestById(id));
    }
}
