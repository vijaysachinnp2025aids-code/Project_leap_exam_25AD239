package com.example.project_exam.exception;

public class NoAvailableHelperException extends RuntimeException {
    public NoAvailableHelperException() {
        super("No available helper can cover this time slot. Please choose another time.");
    }
}
