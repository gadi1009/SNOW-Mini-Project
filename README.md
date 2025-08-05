# ServiceNow Incident Management Mini-Project

This project simulates a custom Incident Management process in ServiceNow. It's designed to showcase essential skills for a ServiceNow Implementer, including form customization, scripting, workflow automation, and reporting.

## Features

*   **Custom Incident Form:** A tailored incident form with dynamic fields based on the selected category.
*   **Real-time Validation:** A Client Script ensures that high-priority incidents have a detailed description.
*   **Automatic Assignment:** A Business Rule automatically assigns incidents to the appropriate team based on the category.
*   **SLA Handling:** The Business Rule also attaches a Service Level Agreement (SLA) based on the incident's priority.
*   **Simple Workflow:** A basic workflow to manage the incident lifecycle from "New" to "Resolved."
*   **Dashboard Reporting:** Instructions on how to create a dashboard to monitor incident trends.
*   **Dynamic Urgency Calculation:** Automatically sets the "Urgency" of an incident based on its "Impact."
*   **Email Notifications:** Sends email notifications to the caller when a new incident is created and when their incident is resolved.
*   **Inbound Email Action:** Allows users to create incidents by sending an email to the ServiceNow instance.
*   **Knowledge Base Integration:**
    *   Automatically searches the Knowledge Base for relevant articles when an incident's short description is updated.
    *   Provides a button to create a new knowledge article from a resolved incident.

## Setup Instructions

1.  **Get a ServiceNow Developer Instance:**
    *   Go to the [ServiceNow Developer Portal](https://developer.servicenow.com/).
    *   Sign up for an account or log in.
    *   Request a new "London," "Madrid," or "New York" release Personal Developer Instance (PDI).

2.  **Apply the Update Set:**
    *   This project is provided as an Update Set for easy deployment.
    *   Download the `Incident_Management_Mini_Project.xml` file from this repository.
    *   In your PDI, navigate to **System Update Sets > Retrieved Update Sets**.
    *   Click the "Import Update Set from XML" link.
    *   Choose the downloaded XML file and click "Upload."
    *   Once uploaded, open the "Incident Management Mini-Project" update set.
    *   Click "Preview Update Set" to check for conflicts.
    *   Click "Commit Update Set" to apply the changes.

3.  **Test the Project:**
    *   Navigate to **Incident > Create New**.
    *   You should see the new custom incident form.
    *   Experiment with the form's dynamic UI policies and client script.
    *   Create a few test incidents with different categories and priorities.
    *   Verify that the incidents are automatically assigned and have the correct SLAs attached.
    *   Follow the dashboard setup instructions to create your reporting dashboard.

## Example Code Snippets

### Client Script: High-Priority Incident Validation

This script runs on the client-side (the user's browser) to validate the incident form in real-time.

```javascript
// Client Script: High-Priority Incident Validation
// Type: onChange
// Field: priority

function onChange(control, oldValue, newValue, isLoading, isTemplate) {
  if (isLoading || newValue === '') {
    return;
  }

  // If priority is set to 1 (High)
  if (newValue == 1) {
    var description = g_form.getValue('description');
    if (description.length < 20) {
      g_form.showFieldMsg('description', 'For high-priority incidents, please provide a more detailed description (at least 20 characters).', 'error');
    }
  }
}
```

### Business Rule: Automatic Assignment and SLA

This script runs on the server-side when an incident is created or updated.

```javascript
// Business Rule: Automatic Assignment and SLA
// Table: incident
// When: before
// Insert: true
// Update: true

(function executeRule(current, previous /*null when async*/) {

  // Assign to the correct group based on category
  if (current.category == 'hardware') {
    current.assignment_group.setDisplayValue('Hardware');
  } else if (current.category == 'software') {
    current.assignment_group.setDisplayValue('Software');
  } else if (current.category == 'network') {
    current.assignment_group.setDisplayValue('Network');
  }

  // Attach SLA based on priority
  if (current.priority == 1) { // High
    current.sla_due = gs.daysAgo(-1); // 1-day SLA
  } else if (current.priority == 2) { // Medium
    current.sla_due = gs.daysAgo(-3); // 3-day SLA
  } else { // Low
    current.sla_due = gs.daysAgo(-5); // 5-day SLA
  }

})(current, previous);
```

### Script Include: IncidentUtils

This script include provides reusable functions that can be called from other scripts.

```javascript
// Script Include: IncidentUtils
// Name: IncidentUtils
// Client callable: true

var IncidentUtils = Class.create();
IncidentUtils.prototype = Object.extendsObject(AbstractAjaxProcessor, {

  getUrgencyFromImpact: function() {
    var impact = this.getParameter('sysparm_impact');
    var urgency = '3'; // Default to Low

    if (impact == '1') { // High
      urgency = '1'; // High
    } else if (impact == '2') { // Medium
      urgency = '2'; // Medium
    }

    return urgency;
  },

  type: 'IncidentUtils'
});
```

### Workflow Script: Close Incident

This script is used within a workflow to automatically close an incident.

```javascript
// Workflow Script: Close Incident

// Set the state to "Resolved"
current.state = 6;

// Set the resolution code and notes
current.close_code = 'Closed/Resolved by Workflow';
current.close_notes = 'Incident automatically closed by the workflow.';

// Update the record
current.update();
```
