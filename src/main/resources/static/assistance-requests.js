const API_ROOT = "/api/assistance-requests";

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

function showMessage(message, success = false) {
    const element = document.getElementById("requestMessage");
    element.className = `notice ${success ? "success" : "error"}`;
    element.textContent = message;
}

async function loadUsers() {
    const select = document.getElementById("requestUser");
    try {
        const users = await readResponse(await fetch("/api/users"));
        select.innerHTML = '<option value="">Select a user</option>' + users.map(user =>
            `<option value="${user.id}">${escapeHtml(user.name)} (ID ${user.id})</option>`).join("");
        if (!users.length) select.innerHTML = '<option value="">Create a user first</option>';
    } catch (error) {
        select.innerHTML = '<option value="">Unable to load users</option>';
        showMessage(error.message);
    }
}

async function createRequest() {
    const userId = document.getElementById("requestUser").value;
    const pickupPoint = document.getElementById("pickupPoint").value.trim();
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const assistanceType = document.getElementById("assistanceType").value;

    if (!userId || !pickupPoint || !startTime || !endTime || !assistanceType) {
        showMessage("Please fill in all request fields.");
        return;
    }
    if (new Date(endTime) <= new Date(startTime)) {
        showMessage("End time must be after start time.");
        return;
    }

    try {
        const request = {
            user: { id: Number(userId) }, pickupPoint,
            startTime: `${startTime}:00`, endTime: `${endTime}:00`, assistanceType
        };
        const created = await readResponse(await fetch(API_ROOT, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request)
        }));
        showMessage(`Request #${created.id} assigned to ${created.helper?.name || "a helper"}. Status: ${created.status}.`, true);
        ["pickupPoint", "startTime", "endTime", "assistanceType"].forEach(id => document.getElementById(id).value = "");
        await loadRequests();
    } catch (error) {
        showMessage(error.message);
    }
}

async function loadRequests() {
    const list = document.getElementById("requestList");
    try {
        const requests = await readResponse(await fetch(API_ROOT));
        if (!requests.length) {
            list.innerHTML = "<p>No assistance requests found.</p>";
            return;
        }
        list.innerHTML = requests.map(request => {
            const buttons = ["ASSIGNED", "REQUESTED"].includes(request.status) ? `
                <button class="action-btn complete-btn" onclick="updateRequestStatus(${request.id}, 'complete')">Complete</button>
                <button class="action-btn cancel-btn" onclick="updateRequestStatus(${request.id}, 'cancel')">Cancel</button>` : "";
            return `<article class="request-item">
                <h3>Request #${request.id}</h3>
                <p><b>User:</b> ${escapeHtml(request.user?.name || "Unknown")}</p>
                <p><b>Pickup:</b> ${escapeHtml(request.pickupPoint)}</p>
                <p><b>Start:</b> ${escapeHtml(request.startTime)}</p>
                <p><b>End:</b> ${escapeHtml(request.endTime)}</p>
                <p><b>Assistance:</b> ${escapeHtml(request.assistanceType)}</p>
                <p><b>Helper:</b> ${escapeHtml(request.helper?.name || "Not assigned")}</p>
                <p><b>Status:</b> <span class="status ${escapeHtml(request.status)}">${escapeHtml(request.status)}</span></p>
                ${buttons}
            </article>`;
        }).join("");
    } catch (error) {
        list.innerHTML = `<p class="error">${escapeHtml(error.message)}</p>`;
    }
}

async function updateRequestStatus(id, action) {
    try {
        await readResponse(await fetch(`${API_ROOT}/${id}/${action}`, { method: "PUT" }));
        showMessage(`Request #${id} ${action === "complete" ? "completed" : "cancelled"}.`, true);
        await loadRequests();
    } catch (error) { showMessage(error.message); }
}

document.getElementById("submitRequest").addEventListener("click", createRequest);
document.getElementById("refreshRequests").addEventListener("click", loadRequests);
document.addEventListener("DOMContentLoaded", () => Promise.all([loadUsers(), loadRequests()]));
