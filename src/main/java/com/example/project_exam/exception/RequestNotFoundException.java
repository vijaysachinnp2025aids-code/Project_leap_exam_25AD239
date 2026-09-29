package com.example.project_exam.exception;

public class RequestNotFoundException extends RuntimeException {
    public RequestNotFoundException(Long id) {
        super("Request " + id + " was not found.");
    }
}
