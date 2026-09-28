package com.example.project_exam.controller;

import com.example.project_exam.entity.Helper;
import com.example.project_exam.service.HelperService;
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

    @PostMapping
    public Helper createHelper(@RequestBody Helper helper) {
        return service.createHelper(helper);
    }

    @GetMapping
    public List<Helper> getAllHelpers() {
        return service.getAllHelpers();
    }

    @GetMapping("/{id}")
    public Helper getHelperById(@PathVariable Long id) {
        return service.getHelperById(id);
    }

    @PutMapping("/{id}")
    public Helper updateHelper(@PathVariable Long id, @RequestBody Helper helper) {
        return service.updateHelper(id, helper);
    }

    @DeleteMapping("/{id}")
    public String deleteHelper(@PathVariable Long id) {
        service.deleteHelper(id);
        return "Helper deleted successfully";
    }
}
