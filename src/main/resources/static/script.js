const API = "/api";

// ======================================================
// PHONE VALIDATION
// ======================================================

function isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
}


// ======================================================
// GET ARRAY FROM API RESPONSE
// ======================================================

function getArray(data, key) {

    if (Array.isArray(data)) {
        return data;
    }

    if (data && Array.isArray(data[key])) {
        return data[key];
    }

    if (data && Array.isArray(data.content)) {
        return data.content;
    }

    return [];
}


// ======================================================
// LOAD USERS
// ======================================================

async function loadUsers() {

    try {

        const response = await fetch(`${API}/users`);

        if (!response.ok) {
            throw new Error("Unable to load users");
        }

        const data = await response.json();

        // FIX: Always convert response into an array
        const users = getArray(data, "users");

        const userList =
            document.getElementById("userList");

        const requestUser =
            document.getElementById("requestUser");


        // ----------------------------------------------
        // LOAD EXISTING REQUESTS
        // ----------------------------------------------

        let requests = [];

        try {

            const requestResponse =
                await fetch(`${API}/requests`);

            if (requestResponse.ok) {

                const requestData =
                    await requestResponse.json();

                requests =
                    getArray(requestData, "requests");
            }

        } catch (error) {

            console.error(
                "Unable to load requests:",
                error
            );
        }


        // ----------------------------------------------
        // USERS WITH ACTIVE REQUESTS
        // ----------------------------------------------

        const busyUserIds = requests
            .filter(request =>
                request.status === "ASSIGNED" ||
                request.status === "REQUESTED"
            )
            .map(request =>
                request.user
                    ? request.user.id
                    : null
            );


        // ----------------------------------------------
        // CLEAR USER LIST
        // ----------------------------------------------

        if (userList) {
            userList.innerHTML = "";
        }


        // ----------------------------------------------
        // CLEAR USER DROPDOWN
        // ----------------------------------------------

        if (requestUser) {

            requestUser.innerHTML =
                `<option value="">Select User</option>`;
        }


        // ----------------------------------------------
        // NO USERS
        // ----------------------------------------------

        if (users.length === 0) {

            if (userList) {

                userList.innerHTML =
                    `<p>No users found.</p>`;
            }

            return;
        }


        // ----------------------------------------------
        // DISPLAY USERS
        // ----------------------------------------------

        users.forEach(user => {

            if (userList) {

                userList.innerHTML += `

                    <div class="card">

                        <h3>${user.name || ""}</h3>

                        <p>
                            <b>ID:</b> ${user.id || ""}
                        </p>

                        <p>
                            <b>Email:</b> ${user.email || ""}
                        </p>

                        <p>
                            <b>Phone:</b> ${user.phone || ""}
                        </p>

                    </div>

                `;
            }


            // ------------------------------------------
            // ONLY USERS WITHOUT ACTIVE REQUEST
            // ------------------------------------------

            if (
                requestUser &&
                !busyUserIds.includes(user.id)
            ) {

                requestUser.innerHTML += `

                    <option value="${user.id}">
                        ${user.name} (ID: ${user.id})
                    </option>

                `;
            }

        });

    } catch (error) {

        console.error(
            "Load users error:",
            error
        );

        const userList =
            document.getElementById("userList");

        if (userList) {

            userList.innerHTML =
                `<p class="error">
                    Unable to load users.
                </p>`;
        }
    }
}


// ======================================================
// CREATE USER
// ======================================================

async function createUser() {

    const name =
        document.getElementById("userName")
            .value.trim();

    const email =
        document.getElementById("userEmail")
            .value.trim();

    const phone =
        document.getElementById("userPhone")
            .value.trim();


    // ----------------------------------------------
    // REQUIRED VALIDATION
    // ----------------------------------------------

    if (!name || !email || !phone) {

        alert(
            "Please fill in all user fields."
        );

        return;
    }


    // ----------------------------------------------
    // PHONE VALIDATION
    // ----------------------------------------------

    if (!isValidPhone(phone)) {

        alert(
            "Phone number must contain exactly 10 digits."
        );

        document
            .getElementById("userPhone")
            .focus();

        return;
    }


    try {

        const response = await fetch(
            `${API}/users`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    name: name,

                    email: email,

                    phone: phone

                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to create user."
            );

            return;
        }


        // ------------------------------------------
        // SUCCESS
        // ------------------------------------------

        alert(
            "User created successfully."
        );


        // ------------------------------------------
        // CLEAR FORM
        // ------------------------------------------

        document.getElementById(
            "userName"
        ).value = "";

        document.getElementById(
            "userEmail"
        ).value = "";

        document.getElementById(
            "userPhone"
        ).value = "";


        // ------------------------------------------
        // REFRESH USERS
        // ------------------------------------------

        await loadUsers();


        // ------------------------------------------
        // SELECT NEW USER
        // ------------------------------------------

        if (data.id) {

            const requestUser =
                document.getElementById(
                    "requestUser"
                );

            if (requestUser) {
                requestUser.value = data.id;
            }
        }

    } catch (error) {

        console.error(
            "Create user error:",
            error
        );

        alert(
            "Unable to connect to backend."
        );
    }
}


// ======================================================
// LOAD HELPERS
// ======================================================

async function loadHelpers() {

    try {

        const response =
            await fetch(`${API}/helpers`);


        if (!response.ok) {

            throw new Error(
                "Unable to load helpers"
            );
        }


        const data =
            await response.json();

        // FIX: Always convert to array
        const helpers =
            getArray(data, "helpers");


        const helperList =
            document.getElementById(
                "helperList"
            );

        const workloadHelper =
            document.getElementById(
                "workloadHelper"
            );


        if (helperList) {
            helperList.innerHTML = "";
        }


        if (workloadHelper) {

            workloadHelper.innerHTML =
                `<option value="">
                    Select Helper
                </option>`;
        }


        // ------------------------------------------
        // DISPLAY HELPERS
        // ------------------------------------------

        helpers.forEach(helper => {

            const available =
                helper.available === true;


            const status =
                available
                    ? "Available"
                    : "Unavailable";


            const icon =
                available
                    ? "🟢"
                    : "🔴";


            // --------------------------------------
            // HELPER CARD
            // --------------------------------------

            if (helperList) {

                helperList.innerHTML += `

                    <div class="card">

                        <h3>${helper.name || ""}</h3>

                        <p>
                            <b>ID:</b>
                            ${helper.id || ""}
                        </p>

                        <p>
                            <b>Phone:</b>
                            ${helper.phone || ""}
                        </p>

                        <p>
                            <b>Status:</b>
                            ${icon} ${status}
                        </p>

                    </div>

                `;
            }


            // --------------------------------------
            // HELPER WORKLOAD DROPDOWN
            // --------------------------------------

            if (workloadHelper) {

                workloadHelper.innerHTML += `

                    <option value="${helper.id}">
                        ${helper.name} - ${status}
                    </option>

                `;
            }

        });

    } catch (error) {

        console.error(
            "Load helpers error:",
            error
        );
    }
}


// ======================================================
// CREATE HELPER
// ======================================================

async function createHelper() {

    const name =
        document.getElementById("helperName")
            .value.trim();

    const phone =
        document.getElementById("helperPhone")
            .value.trim();


    if (!name || !phone) {

        alert(
            "Please fill in all helper fields."
        );

        return;
    }


    if (!isValidPhone(phone)) {

        alert(
            "Helper phone number must contain exactly 10 digits."
        );

        document
            .getElementById("helperPhone")
            .focus();

        return;
    }


    try {

        const response =
            await fetch(
                `${API}/helpers`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        phone: phone,

                        available: true

                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to create helper."
            );

            return;
        }


        alert(
            "Helper created successfully."
        );


        document.getElementById(
            "helperName"
        ).value = "";

        document.getElementById(
            "helperPhone"
        ).value = "";


        await loadHelpers();


    } catch (error) {

        console.error(
            "Create helper error:",
            error
        );

        alert(
            "Unable to connect to backend."
        );
    }
}


// ======================================================
// CREATE ASSISTANCE REQUEST
// ======================================================

async function createRequest() {

    const userSelect =
        document.getElementById(
            "requestUser"
        );


    const userId =
        userSelect.value;


    const pickupPoint =
        document.getElementById(
            "pickupPoint"
        ).value.trim();


    const startTime =
        document.getElementById(
            "startTime"
        ).value;


    const endTime =
        document.getElementById(
            "endTime"
        ).value;


    const assistanceType =
        document.getElementById(
            "assistanceType"
        ).value;


    // ----------------------------------------------
    // USER REQUIRED
    // ----------------------------------------------

    if (!userId) {

        alert(
            "Please select a user before requesting assistance."
        );

        userSelect.focus();

        return;
    }


    // ----------------------------------------------
    // PICKUP
    // ----------------------------------------------

    if (!pickupPoint) {

        alert(
            "Please enter pickup point."
        );

        return;
    }


    // ----------------------------------------------
    // TIME
    // ----------------------------------------------

    if (!startTime || !endTime) {

        alert(
            "Please select start and end time."
        );

        return;
    }


    if (startTime >= endTime) {

        alert(
            "End time must be after start time."
        );

        return;
    }


    // ----------------------------------------------
    // ASSISTANCE TYPE
    // ----------------------------------------------

    if (!assistanceType) {

        alert(
            "Please select assistance type."
        );

        return;
    }


    // ==================================================
    // REQUEST OBJECT
    // ==================================================

    const request = {

        pickupPoint: pickupPoint,

        startTime: startTime + ":00",

        endTime: endTime + ":00",

        assistanceType: assistanceType,

        user: {
            id: Number(userId)
        }

    };


    try {

        const response =
            await fetch(
                `${API}/requests`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(request)
                }
            );


        const data =
            await response.json();


        // ==================================================
        // FAILED
        // ==================================================

        if (!response.ok) {

            alert(
                data.message ||
                "No helper is available for the requested time."
            );

            return;
        }


        // ==================================================
        // SUCCESS
        // ==================================================

        const requestId =
            data.id;

        const helperName =
            data.helper
                ? data.helper.name
                : "Helper";


        alert(
            "Request #" +
            requestId +
            " assigned successfully!\n\n" +
            "Helper: " +
            helperName +
            "\nStatus: " +
            (data.status || "ASSIGNED")
        );


        // ==================================================
        // REMOVE USER FROM DROPDOWN
        // ==================================================

        const selectedOption =
            userSelect.querySelector(
                `option[value="${userId}"]`
            );


        if (selectedOption) {
            selectedOption.remove();
        }


        userSelect.value = "";


        // ==================================================
        // CLEAR FORM
        // ==================================================

        document.getElementById(
            "pickupPoint"
        ).value = "";

        document.getElementById(
            "startTime"
        ).value = "";

        document.getElementById(
            "endTime"
        ).value = "";

        document.getElementById(
            "assistanceType"
        ).value = "";


        // ==================================================
        // REFRESH DATA
        // ==================================================

        await loadHelpers();

        await loadRequests();

        await loadUsers();


    } catch (error) {

        console.error(
            "Create request error:",
            error
        );

        alert(
            "Unable to connect to backend."
        );
    }
}


// ======================================================
// LOAD ASSISTANCE REQUESTS
// ======================================================

async function loadRequests() {

    try {

        const response =
            await fetch(
                `${API}/requests`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load requests"
            );
        }


        const data =
            await response.json();

        // FIX: Always convert to array
        const requests =
            getArray(data, "requests");


        const requestList =
            document.getElementById(
                "requestList"
            );


        if (!requestList) {
            return;
        }


        requestList.innerHTML = "";


        if (requests.length === 0) {

            requestList.innerHTML =
                `<p>No assistance requests found.</p>`;

            return;
        }


        requests.forEach(request => {

            const userName =
                request.user
                    ? request.user.name
                    : "Unknown";


            const helperName =
                request.helper
                    ? request.helper.name
                    : "Not assigned";


            let buttons = "";


            // ------------------------------------------
            // ACTIVE REQUEST
            // ------------------------------------------

            if (
                request.status !== "COMPLETED" &&
                request.status !== "CANCELLED"
            ) {

                buttons = `

                    <button
                        onclick="completeRequest(${request.id})">
                        Complete
                    </button>

                    <button
                        onclick="cancelRequest(${request.id})">
                        Cancel
                    </button>

                `;
            }


            requestList.innerHTML += `

                <div class="card">

                    <h3>
                        Request #${request.id}
                    </h3>

                    <p>
                        <b>User:</b>
                        ${userName}
                    </p>

                    <p>
                        <b>Pickup:</b>
                        ${request.pickupPoint || ""}
                    </p>

                    <p>
                        <b>Helper:</b>
                        ${helperName}
                    </p>

                    <p>
                        <b>Assistance:</b>
                        ${request.assistanceType || ""}
                    </p>

                    <p>
                        <b>Status:</b>
                        ${request.status || ""}
                    </p>

                    ${buttons}

                </div>

            `;
        });


    } catch (error) {

        console.error(
            "Load requests error:",
            error
        );


        const requestList =
            document.getElementById(
                "requestList"
            );


        if (requestList) {

            requestList.innerHTML =
                `<p class="error">
                    Unable to load requests.
                </p>`;
        }
    }
}


// ======================================================
// COMPLETE REQUEST
// ======================================================

async function completeRequest(id) {

    try {

        const response =
            await fetch(
                `${API}/requests/${id}/complete`,
                {
                    method: "PUT"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to complete request."
            );

            return;
        }


        alert(
            "Work completed successfully.\n\n" +
            "Helper is now Available."
        );


        await loadRequests();

        await loadHelpers();

        await loadUsers();


    } catch (error) {

        console.error(
            "Complete request error:",
            error
        );

        alert(
            "Unable to connect to backend."
        );
    }
}


// ======================================================
// CANCEL REQUEST
// ======================================================

async function cancelRequest(id) {

    try {

        const response =
            await fetch(
                `${API}/requests/${id}/cancel`,
                {
                    method: "PUT"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to cancel request."
            );

            return;
        }


        alert(
            "Request cancelled successfully.\n\n" +
            "Helper is now Available."
        );


        await loadRequests();

        await loadHelpers();

        await loadUsers();


    } catch (error) {

        console.error(
            "Cancel request error:",
            error
        );

        alert(
            "Unable to connect to backend."
        );
    }
}


// ======================================================
// HELPER WORKLOAD
// ======================================================

async function loadHelperWorkload() {

    const workloadHelper =
        document.getElementById(
            "workloadHelper"
        );


    if (!workloadHelper) {
        return;
    }


    const helperId =
        workloadHelper.value;


    if (!helperId) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/requests/helper/${helperId}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load helper workload"
            );
        }


        const data =
            await response.json();


        const requests =
            getArray(data, "requests");


        const workload =
            document.getElementById(
                "helperWorkload"
            );


        if (!workload) {
            return;
        }


        workload.innerHTML = "";


        if (requests.length === 0) {

            workload.innerHTML =
                "<p>No work assigned.</p>";

            return;
        }


        requests.forEach(request => {

            workload.innerHTML += `

                <div class="card">

                    <h3>
                        Request #${request.id}
                    </h3>

                    <p>
                        <b>User:</b>
                        ${
                request.user
                    ? request.user.name
                    : "Unknown"
            }
                    </p>

                    <p>
                        <b>Pickup:</b>
                        ${request.pickupPoint || ""}
                    </p>

                    <p>
                        <b>Assistance:</b>
                        ${request.assistanceType || ""}
                    </p>

                    <p>
                        <b>Status:</b>
                        ${request.status || ""}
                    </p>

                </div>

            `;
        });


    } catch (error) {

        console.error(
            "Load workload error:",
            error
        );
    }
}


// ======================================================
// REFRESH EVERYTHING
// ======================================================

async function refreshAll() {

    await loadUsers();

    await loadHelpers();

    await loadRequests();
}


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadUsers();

        loadHelpers();

        loadRequests();

    }
);