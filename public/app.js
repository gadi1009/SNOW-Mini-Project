// PLEASE REPLACE THESE VALUES WITH YOUR SERVICENOW INSTANCE DETAILS
const SN_INSTANCE_URL = 'https://YOUR_INSTANCE.service-now.com';
const SN_USERNAME = 'YOUR_USERNAME';
const SN_PASSWORD = 'YOUR_PASSWORD'; // It is recommended to use a more secure authentication method in production

// --- Create Change Request ---
const createChangeForm = document.getElementById('create-change-form');
createChangeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const shortDescription = document.getElementById('short-description').value;
    const description = document.getElementById('description').value;
    const assignmentGroup = document.getElementById('assignment-group').value;
    const configurationItem = document.getElementById('configuration-item').value;

    const responseDiv = document.getElementById('response');
    responseDiv.innerHTML = 'Creating Change Request...';

    try {
        const response = await fetch(`${SN_INSTANCE_URL}/api/custom/create_change_request_api/v1/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${SN_USERNAME}:${SN_PASSWORD}`)
            },
            body: JSON.stringify({
                short_description: shortDescription,
                description: description,
                assignment_group: assignmentGroup,
                configuration_item: configurationItem
            })
        });

        const responseData = await response.json();
        responseDiv.innerHTML = JSON.stringify(responseData, null, 2);

    } catch (error) {
        responseDiv.innerHTML = `Error: ${error.message}`;
    }
});

// --- Check Change Request Status ---
const checkStatusForm = document.getElementById('check-status-form');
checkStatusForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const changeNumber = document.getElementById('change-number').value;
    const statusResultDiv = document.getElementById('status-result');
    statusResultDiv.innerHTML = `Checking status for ${changeNumber}...`;

    try {
        const response = await fetch(`${SN_INSTANCE_URL}/api/custom/create_change_request_api/v1/status/${changeNumber}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa(`${SN_USERNAME}:${SN_PASSWORD}`)
            }
        });

        const responseData = await response.json();
        if (response.ok) {
            statusResultDiv.innerHTML = `Status: <strong>${responseData.change_request.state}</strong>`;
        } else {
            statusResultDiv.innerHTML = `Error: ${responseData.message}`;
        }

    } catch (error) {
        statusResultDiv.innerHTML = `Error: ${error.message}`;
    }
});