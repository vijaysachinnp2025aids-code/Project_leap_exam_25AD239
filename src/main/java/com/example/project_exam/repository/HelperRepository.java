package com.example.project_exam.repository;

import com.example.project_exam.entity.Helper;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HelperRepository extends JpaRepository<Helper, Long> {

    List<Helper> findByAvailableTrue();
}
