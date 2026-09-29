package com.example.project_exam.service;

import com.example.project_exam.entity.AssistantRequest;
import com.example.project_exam.entity.Helper;
import com.example.project_exam.entity.RequestStatus;
import com.example.project_exam.entity.User;
import com.example.project_exam.exception.NoAvailableHelperException;
import com.example.project_exam.exception.RequestNotFoundException;
import com.example.project_exam.repository.AssistantRequestRepository;
import com.example.project_exam.repository.HelperRepository;
import com.example.project_exam.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AssistantRequestService {

    private final AssistantRequestRepository requestRepository;
    private final HelperRepository helperRepository;
    private final UserRepository userRepository;

    public AssistantRequestService(
            AssistantRequestRepository requestRepository,
            HelperRepository helperRepository,
            UserRepository userRepository) {

        this.requestRepository = requestRepository;
        this.helperRepository = helperRepository;
        this.userRepository = userRepository;
    }

    // =====================================================
    // CREATE REQUEST
    // =====================================================

    @Transactional
    public AssistantRequest createRequest(AssistantRequest request) {

        // -----------------------------------------------
        // CHECK USER
        // -----------------------------------------------

        if (request.getUser() == null ||
                request.getUser().getId() == null) {

            throw new RuntimeException(
                    "Please select a user before requesting assistance."
            );
        }

        Long userId = request.getUser().getId();

        // Get REAL user from database
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Selected user does not exist."
                        ));

        // Attach real user
        request.setUser(user);


        // -----------------------------------------------
        // CHECK AVAILABLE HELPERS
        // -----------------------------------------------

        List<Helper> helpers =
                helperRepository.findByAvailableTrue();

        Helper selectedHelper = null;


        // -----------------------------------------------
        // FIND HELPER
        // -----------------------------------------------

        for (Helper helper : helpers) {

            List<AssistantRequest> helperRequests =
                    requestRepository.findByHelperId(helper.getId());

            boolean overlap = false;

            for (AssistantRequest existing : helperRequests) {

                if (existing.getStatus() ==
                        RequestStatus.COMPLETED ||
                        existing.getStatus() ==
                                RequestStatus.CANCELLED) {

                    continue;
                }


                if (request.getStartTime()
                        .isBefore(existing.getEndTime())
                        &&
                        request.getEndTime()
                                .isAfter(existing.getStartTime())) {

                    overlap = true;
                    break;
                }
            }


            if (!overlap) {

                selectedHelper = helper;
                break;
            }
        }


        // -----------------------------------------------
        // NO HELPER
        // -----------------------------------------------

        if (selectedHelper == null) {
            throw new NoAvailableHelperException();
        }


        // -----------------------------------------------
        // ASSIGN HELPER
        // -----------------------------------------------

        request.setHelper(selectedHelper);

        request.setStatus(RequestStatus.ASSIGNED);


        // Helper becomes unavailable
        selectedHelper.setAvailable(false);

        helperRepository.save(selectedHelper);


        return requestRepository.save(request);
    }


    // =====================================================
    // GET ALL REQUESTS
    // =====================================================

    public List<AssistantRequest> getAllRequests() {

        return requestRepository.findAll();
    }


    // =====================================================
    // GET REQUEST
    // =====================================================

    public AssistantRequest getRequestById(Long id) {

        return requestRepository.findById(id)
                .orElseThrow(() -> new RequestNotFoundException(id));
    }


    // =====================================================
    // HELPER WORKLOAD
    // =====================================================

    public List<AssistantRequest> getHelperWorkload(
            Long helperId) {

        return requestRepository.findByHelperId(helperId);
    }


    // =====================================================
    // COMPLETE REQUEST
    // =====================================================

    @Transactional
    public AssistantRequest completeRequest(Long id) {

        AssistantRequest request =
                getRequestById(id);


        if (request.getStatus() ==
                RequestStatus.CANCELLED) {

            throw new RuntimeException(
                    "Cancelled request cannot be completed"
            );
        }


        request.setStatus(
                RequestStatus.COMPLETED
        );


        // Make helper available
        if (request.getHelper() != null) {

            Helper helper =
                    request.getHelper();

            helper.setAvailable(true);

            helperRepository.save(helper);
        }


        return requestRepository.save(request);
    }


    // =====================================================
    // CANCEL REQUEST
    // =====================================================

    @Transactional
    public AssistantRequest cancelRequest(Long id) {

        AssistantRequest request =
                getRequestById(id);


        if (request.getStatus() ==
                RequestStatus.COMPLETED) {

            throw new RuntimeException(
                    "Completed request cannot be cancelled"
            );
        }


        request.setStatus(
                RequestStatus.CANCELLED
        );


        // Make helper available
        if (request.getHelper() != null) {

            Helper helper =
                    request.getHelper();

            helper.setAvailable(true);

            helperRepository.save(helper);
        }


        return requestRepository.save(request);
    }


    // =====================================================
    // DELETE REQUEST
    // =====================================================

    @Transactional
    public void deleteRequest(Long id) {

        AssistantRequest request =
                getRequestById(id);


        // Make helper available
        if (request.getHelper() != null) {

            Helper helper =
                    request.getHelper();

            helper.setAvailable(true);

            helperRepository.save(helper);
        }


        requestRepository.delete(request);
    }
}
