package com.example.project_exam.service;

import com.example.project_exam.entity.Helper;
import com.example.project_exam.repository.HelperRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HelperService {

    private final HelperRepository repository;

    public HelperService(HelperRepository repository) {
        this.repository = repository;
    }

    public Helper createHelper(Helper helper) {
        return repository.save(helper);
    }

    public List<Helper> getAllHelpers() {
        return repository.findAll();
    }

    public Helper getHelperById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Helper not found"));
    }

    public Helper updateHelper(Long id, Helper helper) {

        Helper existing = getHelperById(id);

        existing.setName(helper.getName());
        existing.setPhone(helper.getPhone());
        existing.setAvailable(helper.isAvailable());

        return repository.save(existing);
    }

    public void deleteHelper(Long id) {

        Helper helper = getHelperById(id);

        repository.delete(helper);
    }
}
