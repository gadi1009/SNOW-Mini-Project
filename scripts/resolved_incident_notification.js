// Business Rule: Send Resolved Incident Email
// Table: incident
// When: after
// Update: true
// Condition: current.state.changesTo(6) // Resolved

(function executeRule(current, previous /*null when async*/) {

  // Send an email to the caller
  gs.eventQueue('incident.resolved', current, gs.getUserID(), gs.getUserName());

})(current, previous);
