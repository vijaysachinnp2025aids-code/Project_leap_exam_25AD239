package com.example.project_exam.controller;

import com.example.project_exam.entity.AssistantRequest;
import com.example.project_exam.service.AssistantRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assistance-requests")
@CrossOrigin
public class AssistantRequestController {

    private final AssistantRequestService service;

    public AssistantRequestController(
            AssistantRequestService service) {
        this.service = service;
    }

    // ==========================================
    // CREATE ASSISTANCE REQUEST
    // ==========================================

    @PostMapping
    public AssistantRequest createRequest(
            @RequestBody AssistantRequest request) {

        return service.createRequest(request);
    }


    // ==========================================
    // GET ALL ASSISTANCE REQUESTS
    // ==========================================

    @GetMapping
    public List<AssistantRequest> getAllRequests() {

        return service.getAllRequests();
    }


    // ==========================================
    // GET REQUEST BY ID
    // ==========================================

    @GetMapping("/{id}")
    public AssistantRequest getRequestById(
            @PathVariable Long id) {

        return service.getRequestById(id);
    }


    // ==========================================
    // COMPLETE REQUEST
    // ==========================================

    @PutMapping("/{id}/complete")
    public AssistantRequest completeRequest(
            @PathVariable Long id) {

        return service.completeRequest(id);
    }


    // ==========================================
    // CANCEL REQUEST
    // ==========================================

    @PutMapping("/{id}/cancel")
    public AssistantRequest cancelRequest(
            @PathVariable Long id) {

        return service.cancelRequest(id);
    }


    // ==========================================
    // DELETE REQUEST
    // ==========================================

    @DeleteMapping("/{id}")
    public String deleteRequest(
            @PathVariable Long id) {

        service.deleteRequest(id);

        return "Assistance request deleted successfully";
    }


    // ==========================================
    // HELPER WORKLOAD
    // ==========================================

    @GetMapping("/helper/{helperId}")
    public List<AssistantRequest> getHelperWorkload(
            @PathVariable Long helperId) {

        return service.getHelperWorkload(helperId);
    }
}
