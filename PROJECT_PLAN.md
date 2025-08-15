# ServiceNow Mini-Project: Step-by-Step Implementation Plan

This document provides a detailed, step-by-step guide to implementing the custom Incident Management process in a ServiceNow Developer Instance.

## Phase 1: Custom Incident Form and UI Policies

1.  **Create a new View for the Incident Form:**
    *   Navigate to **System UI > Views**.
    *   Click **New**.
    *   **Name:** `MiniProject`
    *   **Title:** `Mini-Project View`
    *   Click **Submit**.

2.  **Customize the Incident Form Layout:**
    *   Navigate to **Incident > Create New**.
    *   Right-click the header and choose **Configure > Form Layout**.
    *   From the **View name** dropdown, select **Mini-Project View**.
    *   Arrange the fields as follows:
        *   **Left Column:** Number, Caller, Category, Subcategory, Service, Configuration Item
        *   **Right Column:** State, Priority, Urgency, Impact, Assignment group, Assigned to
        *   **Bottom Section:** Short description, Description
    *   Click **Save**.

3.  **Create UI Policies to Show/Hide Fields:**
    *   **UI Policy 1: Show Hardware-related fields**
        *   Navigate to **System UI > UI Policies**.
        *   Click **New**.
        *   **Table:** Incident
        *   **Short description:** `Show Hardware Fields`
        *   **Conditions:** `Category` `is` `Hardware`
        *   In the **UI Policy Actions** related list, click **New**.
        *   **Field name:** `Configuration Item`
        *   **Visible:** `True`
        *   **Mandatory:** `True`
        *   Click **Submit**.
    *   **UI Policy 2: Show Software-related fields**
        *   Create a similar UI Policy named `Show Software Fields`.
        *   **Conditions:** `Category` `is` `Software`
        *   **UI Policy Action:** Make the `Software` field visible and mandatory.

## Phase 2: Client Script for Real-time Validation

1.  **Create a new Client Script:**
    *   Navigate to **System Definition > Client Scripts**.
    *   Click **New**.
    *   **Name:** `High-Priority Incident Validation`
    *   **Table:** `Incident`
    *   **UI Type:** `All`
    *   **Type:** `onChange`
    *   **Field name:** `priority`
    *   **Script:**

        ```javascript
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

    *   Click **Submit**.

## Phase 3: Business Rule for Automation

1.  **Create a new Business Rule:**
    *   Navigate to **System Definition > Business Rules**.
    *   Click **New**.
    *   **Name:** `Automatic Assignment and SLA`
    *   **Table:** `Incident`
    *   **Advanced:** Check the box
    *   **When:** `before`
    *   **Insert:** `true`
    *   **Update:** `true`
    *   **Filter Conditions:** `Category` `changes`
    *   **Script:**

        ```javascript
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

    *   Click **Submit**.

## Phase 4: Workflow Automation

1.  **Create a new Workflow:**
    *   Navigate to **Workflow > Workflow Editor**.
    *   Click the **New Workflow** button.
    *   **Name:** `Incident Resolution`
    *   **Table:** `Incident`
    *   Click **Submit**.

2.  **Design the Workflow:**
    *   Drag a **Begin** activity onto the canvas.
    *   Drag a **Run Script** activity onto the canvas.
        *   **Name:** `Set to In Progress`
        *   **Script:** `current.state = 2; // In Progress`
    *   Drag a **Wait for Condition** activity.
        *   **Name:** `Wait for Resolution`
        *   **Condition:** `State` `is` `Resolved`
    *   Drag another **Run Script** activity.
        *   **Name:** `Close Incident`
        *   **Script:**

            ```javascript
            current.state = 7; // Closed
            current.close_code = 'Closed/Resolved by Workflow';
            current.close_notes = 'Incident automatically closed by the workflow.';
            current.update();
            ```

    *   Connect the activities in the following order:
        *   Begin -> Set to In Progress -> Wait for Resolution -> Close Incident -> End
    *   Click **Publish** to activate the workflow.

## Phase 5: Dashboard Reporting

1.  **Create a new Dashboard:**
    *   Navigate to **Self-Service > Dashboards**.
    *   Click the **New Dashboard** button.
    *   **Name:** `Incident Management Overview`
    *   Click **Submit**.

2.  **Add Reports to the Dashboard:**
    *   Open your new dashboard.
    *   Click the **Add Widgets** icon (the plus sign).
    *   Select **Reports**.
    *   Choose the **Incident** table.
    *   Create the following reports and add them to your dashboard:
        *   **Incidents by Category (Pie Chart):** Group by `Category`.
        *   **Incidents by Priority (Bar Chart):** Group by `Priority`.
        *   **Open Incidents by Assignee (List):** Filter by `State` `is not` `Closed` or `Resolved`.
        *   **Incidents Closed This Week (Scorecard):** Filter by `Resolved` `at or after` `Last 7 days`.

3.  **Arrange your Dashboard:**
    *   Drag and resize the reports to create a visually appealing and informative layout.

## Phase 6: New Features

1.  **Dynamic Urgency Calculation:**
    *   Create a new Client Script to call the `IncidentUtils` script include and dynamically set the urgency based on the impact.
2.  **Email Notifications:**
    *   Create a Business Rule to send an email to the caller when a new incident is created for them.
    *   Create a Business Rule to send an email to the caller when their incident is resolved.
3.  **Inbound Email Action:**
    *   Create an Inbound Email Action to allow users to create incidents by sending an email to the ServiceNow instance.

## Phase 7: Knowledge Base Integration

1.  **Automatic Knowledge Search:**
    *   Create a Business Rule that automatically searches the Knowledge Base when an incident's `short_description` is updated.
2.  **"Create Knowledge Article" Button:**
    *   Add a new UI Action (a button) that will appear on `Resolved` incidents.

## Phase 8: Enhanced Automation & Workflow

1.  **Problem and Change Management Integration:**
    *   Allow for the creation of new Problem or Change records directly from an incident.
2.  **Major Incident Management:**
    *   Introduce a system for handling high-impact incidents.
3.  **Parent/Child Incidents:**
    *   Add the ability to link related incidents.

## Phase 9: Deeper Integrations

1.  **Monitoring Tool Integration:**
    *   Create incidents automatically from alerts generated by monitoring tools like Datadog, New Relic, or Prometheus.
2.  **Slack/Microsoft Teams Integration:**
    *   Post incident updates to a dedicated chat channel.

## Phase 10: Improved User Self-Service

1.  **Service Catalog for Incidents:**
    *   Create a service catalog item for reporting common issues.
2.  **Virtual Agent (Chatbot):**
    *   Implement a chatbot to help users resolve common issues without human intervention.

## Phase 11: DevOps Integration

1.  **Automated Change Request Creation:**
    *   Create a Scripted REST API to allow CI/CD pipelines to automatically create Change Requests.
2.  **Update Change Request State:**
    *   Create a Scripted REST API to allow CI/CD pipelines to update the state of a Change Request.
3.  **Get Change Request Status:**
    *   Create a Scripted REST API to allow CI/CD pipelines to get the status of a Change Request.
