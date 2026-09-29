package com.example.project_exam.controller;

import com.example.project_exam.entity.Helper;
import com.example.project_exam.service.HelperService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/helpers")
@CrossOrigin
public class HelperController {

    private final HelperService service;

    public HelperController(HelperService service) {
        this.service = service;
    }


    // CREATE HELPER
    @PostMapping
    public Helper createHelper(
            @Valid @RequestBody Helper helper) {

        return service.createHelper(helper);
    }


    // GET ALL HELPERS
    @GetMapping
    public List<Helper> getAllHelpers() {

        return service.getAllHelpers();
    }


    // GET HELPER BY ID
    @GetMapping("/{id}")
    public Helper getHelperById(
            @PathVariable Long id) {

        return service.getHelperById(id);
    }


    // UPDATE HELPER
    @PutMapping("/{id}")
    public Helper updateHelper(
            @PathVariable Long id,
            @Valid @RequestBody Helper helper) {

        return service.updateHelper(id, helper);
    }


    // DELETE HELPER
    @DeleteMapping("/{id}")
    public String deleteHelper(
            @PathVariable Long id) {

        service.deleteHelper(id);

        return "Helper deleted successfully";
    }
}