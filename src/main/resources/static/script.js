const API = "http://localhost:8000";


// =====================================================
// USER
// =====================================================

document.getElementById("userForm").addEventListener("submit", async function(e) {

    e.preventDefault();

    const user = {
        name: document.getElementById("userName").value,
        email: document.getElementById("userEmail").value,
        phone: document.getElementById("userPhone").value
    };

    try {

        const response = await fetch(`${API}/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error("Failed to create user");
        }

        alert("User created successfully!");

        document.getElementById("userForm").reset();

        loadUsers();

    } catch (error) {

        alert(error.message);

    }

});


async function loadUsers() {

    try {

        const response = await fetch(`${API}/api/users`);

        const users = await response.json();

        const list = document.getElementById("userList");

        list.innerHTML = "";

        users.forEach(user => {

            list.innerHTML += `
                <div class="item">

                    <h3>${user.name}</h3>

                    <p>Email: ${user.email}</p>

                    <p>Phone: ${user.phone}</p>

                    <button
                        class="action delete"
                        onclick="deleteUser(${user.id})">
                        Delete
                    </button>

                </div>
            `;

        });

    } catch (error) {

        alert("Cannot connect to backend");

    }

}


async function deleteUser(id) {

    if (!confirm("Delete this user?")) {
        return;
    }

    await fetch(`${API}/api/users/${id}`, {
        method: "DELETE"
    });

    loadUsers();
}


// =====================================================
// HELPER
// =====================================================

document.getElementById("helperForm").addEventListener("submit", async function(e) {

    e.preventDefault();

    const helper = {

        name: document.getElementById("helperName").value,

        phone: document.getElementById("helperPhone").value,

        available: document.getElementById("helperAvailable").checked

    };

    try {

        const response = await fetch(`${API}/api/helpers`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(helper)

        });

        if (!response.ok) {
            throw new Error("Failed to create helper");
        }

        alert("Helper created successfully!");

        document.getElementById("helperForm").reset();

        loadHelpers();

    } catch (error) {

        alert(error.message);

    }

});


async function loadHelpers() {

    try {

        const response = await fetch(`${API}/api/helpers`);

        const helpers = await response.json();

        const list = document.getElementById("helperList");

        list.innerHTML = "";

        helpers.forEach(helper => {

            list.innerHTML += `

                <div class="item">

                    <h3>${helper.name}</h3>

                    <p>Phone: ${helper.phone}</p>

                    <p>
                        Available:
                        ${helper.available ? "Yes" : "No"}
                    </p>

                    <button
                        class="action delete"
                        onclick="deleteHelper(${helper.id})">
                        Delete
                    </button>

                </div>

            `;

        });

    } catch (error) {

        alert("Cannot connect to backend");

    }

}


async function deleteHelper(id) {

    if (!confirm("Delete this helper?")) {
        return;
    }

    await fetch(`${API}/api/helpers/${id}`, {
        method: "DELETE"
    });

    loadHelpers();
}


// =====================================================
// ASSISTANCE REQUEST
// =====================================================

document.getElementById("requestForm").addEventListener("submit", async function(e) {

    e.preventDefault();

    const request = {

        pickupPoint:
        document.getElementById("pickupPoint").value,

        startTime:
        document.getElementById("startTime").value,

        endTime:
        document.getElementById("endTime").value,

        assistanceType:
        document.getElementById("assistanceType").value

    };

    try {

        const response = await fetch(`${API}/api/requests`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(request)

        });

        if (!response.ok) {
            throw new Error("Failed to create request");
        }

        alert("Assistance request created!");

        document.getElementById("requestForm").reset();

        loadRequests();

    } catch (error) {

        alert(error.message);

    }

});


async function loadRequests() {

    try {

        const response = await fetch(`${API}/api/requests`);

        const requests = await response.json();

        const list = document.getElementById("requestList");

        list.innerHTML = "";

        requests.forEach(request => {

            list.innerHTML += `

                <div class="item">

                    <h3>
                        Request #${request.id}
                    </h3>

                    <p>
                        Pickup:
                        ${request.pickupPoint}
                    </p>

                    <p>
                        Start:
                        ${request.startTime}
                    </p>

                    <p>
                        End:
                        ${request.endTime}
                    </p>

                    <p>
                        Assistance:
                        ${request.assistanceType}
                    </p>

                    <span class="status">
                        ${request.status}
                    </span>

                    <br>

                    <button
                        class="action complete"
                        onclick="completeRequest(${request.id})">
                        Complete
                    </button>

                    <button
                        class="action cancel"
                        onclick="cancelRequest(${request.id})">
                        Cancel
                    </button>

                    <button
                        class="action delete"
                        onclick="deleteRequest(${request.id})">
                        Delete
                    </button>

                </div>

            `;

        });

    } catch (error) {

        alert("Cannot connect to backend");

    }

}


async function completeRequest(id) {

    const response = await fetch(
        `${API}/api/requests/${id}/complete`,
        {
            method: "PUT"
        }
    );

    if (!response.ok) {

        const error = await response.text();

        alert(error);

        return;
    }

    loadRequests();

}


async function cancelRequest(id) {

    const response = await fetch(
        `${API}/api/requests/${id}/cancel`,
        {
            method: "PUT"
        }
    );

    if (!response.ok) {

        const error = await response.text();

        alert(error);

        return;
    }

    loadRequests();

}


async function deleteRequest(id) {

    if (!confirm("Delete this request?")) {
        return;
    }

    await fetch(
        `${API}/api/requests/${id}`,
        {
            method: "DELETE"
        }
    );

    loadRequests();

}
