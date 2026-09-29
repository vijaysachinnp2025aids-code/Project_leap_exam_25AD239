package com.example.project_exam.controller;

import com.example.project_exam.entity.User;
import com.example.project_exam.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }


    // CREATE USER
    @PostMapping
    public User createUser(
            @Valid @RequestBody User user) {

        return service.createUser(user);
    }


    // GET ALL USERS
    @GetMapping
    public List<User> getAllUsers() {

        return service.getAllUsers();
    }


    // GET USER BY ID
    @GetMapping("/{id}")
    public User getUserById(
            @PathVariable Long id) {

        return service.getUserById(id);
    }


    // UPDATE USER
    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Long id,
            @Valid @RequestBody User user) {

        return service.updateUser(id, user);
    }


    // DELETE USER
    @DeleteMapping("/{id}")
    public String deleteUser(
            @PathVariable Long id) {

        service.deleteUser(id);

        return "User deleted successfully";
    }
}
