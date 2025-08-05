// Workflow Script: Close Incident

// Set the state to "Resolved"
current.state = 6;

// Set the resolution code and notes
current.close_code = 'Closed/Resolved by Workflow';
current.close_notes = 'Incident automatically closed by the workflow.';

// Update the record
current.update();