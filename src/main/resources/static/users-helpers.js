const API_ROOT = "/api";

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
}

async function readResponse(response) {
    const text = await response.text();
    let data;
    try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
    if (!response.ok) throw new Error(data.message || Object.values(data).join(" ") || `Request failed (${response.status})`);
    return data;
}

function openTab(tabId, button) {
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.hidden = tab.id !== tabId;
        tab.classList.toggle("active", tab.id === tabId);
    });
    document.querySelectorAll(".tab").forEach(tab => {
        const active = tab === button;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
    });
    if (tabId === "userTab") loadUsers();
    if (tabId === "helperTab") loadHelpers();
}

async function createUser() {
    const message = document.getElementById("userMessage");
    const user = {
        name: document.getElementById("userName").value.trim(),
        email: document.getElementById("userEmail").value.trim(),
        phone: document.getElementById("userPhone").value.trim()
    };
    if (!user.name || !user.email || !user.phone) {
        message.className = "notice error";
        message.textContent = "Please fill in all user fields.";
        return;
    }
    try {
        const response = await fetch(`${API_ROOT}/users`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(user)
        });
        const created = await readResponse(response);
        message.className = "notice success";
        message.textContent = `User created. ID: ${created.id}`;
        ["userName", "userEmail", "userPhone"].forEach(id => document.getElementById(id).value = "");
        await loadUsers();
    } catch (error) {
        message.className = "notice error";
        message.textContent = error.message;
    }
}

async function loadUsers() {
    const list = document.getElementById("userList");
    try {
        const users = await readResponse(await fetch(`${API_ROOT}/users`));
        list.innerHTML = users.length ? users.map(user => `
            <article class="user-item"><h3>${escapeHtml(user.name)}</h3>
                <p><b>ID:</b> ${user.id}</p><p><b>Email:</b> ${escapeHtml(user.email)}</p><p><b>Phone:</b> ${escapeHtml(user.phone)}</p>
            </article>`).join("") : "<p>No users found.</p>";
    } catch (error) { list.innerHTML = `<p class="error">${escapeHtml(error.message)}</p>`; }
}

async function createHelper() {
    const message = document.getElementById("helperMessage");
    const helper = {
        name: document.getElementById("helperName").value.trim(),
        phone: document.getElementById("helperPhone").value.trim(),
        available: document.getElementById("helperAvailable").value === "true"
    };
    if (!helper.name || !helper.phone) {
        message.className = "notice error";
        message.textContent = "Please fill in the helper name and phone.";
        return;
    }
    try {
        const response = await fetch(`${API_ROOT}/helpers`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(helper)
        });
        const created = await readResponse(response);
        message.className = "notice success";
        message.textContent = `Helper created. ID: ${created.id}`;
        document.getElementById("helperName").value = "";
        document.getElementById("helperPhone").value = "";
        await loadHelpers();
    } catch (error) {
        message.className = "notice error";
        message.textContent = error.message;
    }
}

async function loadHelpers() {
    const list = document.getElementById("helperList");
    const select = document.getElementById("helperSelect");
    try {
        const helpers = await readResponse(await fetch(`${API_ROOT}/helpers`));
        const selected = select.value;
        select.innerHTML = '<option value="">Select a helper</option>' + helpers.map(helper =>
            `<option value="${helper.id}">${escapeHtml(helper.name)}</option>`).join("");
        if (helpers.some(helper => String(helper.id) === selected)) select.value = selected;
        list.innerHTML = helpers.length ? helpers.map(helper => `
            <article class="helper-item"><h3>${escapeHtml(helper.name)}</h3>
                <p><b>ID:</b> ${helper.id}</p><p><b>Phone:</b> ${escapeHtml(helper.phone)}</p>
                <p class="${helper.available ? "available" : "unavailable"}">${helper.available ? "Available" : "Not available"}</p>
            </article>`).join("") : "<p>No helpers found.</p>";
    } catch (error) { list.innerHTML = `<p class="error">${escapeHtml(error.message)}</p>`; }
}

async function loadHelperWorkload() {
    const helperId = document.getElementById("helperSelect").value;
    const list = document.getElementById("workloadList");
    if (!helperId) { list.innerHTML = ""; return; }
    try {
        const requests = await readResponse(await fetch(`${API_ROOT}/assistance-requests/helper/${helperId}`));
        list.innerHTML = requests.length ? requests.map(request => `
            <article class="request-item"><h3>Request #${request.id}</h3>
                <p><b>User:</b> ${escapeHtml(request.user?.name || "Unknown")}</p>
                <p><b>Pickup:</b> ${escapeHtml(request.pickupPoint)}</p>
                <p><b>Time:</b> ${escapeHtml(request.startTime)} – ${escapeHtml(request.endTime)}</p>
                <p><b>Status:</b> ${escapeHtml(request.status)}</p>
            </article>`).join("") : "<p>No assigned requests.</p>";
    } catch (error) { list.innerHTML = `<p class="error">${escapeHtml(error.message)}</p>`; }
}

document.addEventListener("DOMContentLoaded", () => {
    loadUsers();
    loadHelpers();
});
