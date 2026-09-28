package com.example.project_exam.controller;


import com.example.project_exam.entity.AssistantRequest;
import com.example.project_exam.service.AssistantRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin
public class AssistantRequestController {

    private final AssistantRequestService service;

    public AssistantRequestController(AssistantRequestService service) {
        this.service = service;
    }

    @PostMapping
    public AssistantRequest createRequest(@RequestBody AssistantRequest request) {
        return service.createRequest(request);
    }

    @GetMapping
    public List<AssistantRequest> getAllRequests() {
        return service.getAllRequests();
    }

    @GetMapping("/{id}")
    public AssistantRequest getRequestById(@PathVariable Long id) {
        return service.getRequestById(id);
    }

    @PutMapping("/{id}")
    public AssistantRequest updateRequest(
            @PathVariable Long id,
            @RequestBody AssistantRequest request) {

        return service.updateRequest(id, request);
    }

    @PutMapping("/{id}/complete")
    public AssistantRequest completeRequest(@PathVariable Long id) {
        return service.completeRequest(id);
    }

    @PutMapping("/{id}/cancel")
    public AssistantRequest cancelRequest(@PathVariable Long id) {
        return service.cancelRequest(id);
    }

    @DeleteMapping("/{id}")
    public String deleteRequest(@PathVariable Long id) {
        service.deleteRequest(id);
        return "Request deleted successfully";
    }
}
