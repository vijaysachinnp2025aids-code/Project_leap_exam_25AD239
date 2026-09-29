package com.example.project_exam.service;

import com.example.project_exam.entity.User;
import com.example.project_exam.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    // CREATE USER
    public User createUser(User user) {
        return repository.save(user);
    }

    // GET ALL USERS
    public List<User> getAllUsers() {
        return repository.findAll();
    }

    // GET USER BY ID
    public User getUserById(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found with ID: " + id));
    }

    // UPDATE USER
    public User updateUser(Long id, User user) {

        User existing = getUserById(id);

        existing.setName(user.getName());
        existing.setEmail(user.getEmail());
        existing.setPhone(user.getPhone());

        return repository.save(existing);
    }

    // DELETE USER
    public void deleteUser(Long id) {

        User user = getUserById(id);

        repository.delete(user);
    }
}