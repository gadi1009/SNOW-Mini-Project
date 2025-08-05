// Inbound Email Action: Create Incident
// Target table: incident
// Action type: New

// Set the caller to the sender of the email
current.caller_id = gs.getUserID();

// Set the short description to the email subject
current.short_description = email.subject;

// Set the description to the email body
current.description = email.body_text;

// Set the incident state to New
current.incident_state = 1;

// Set the urgency to Low
current.urgency = 3;

// Set the impact to Low
current.impact = 3;

// Insert the new incident
current.insert();
