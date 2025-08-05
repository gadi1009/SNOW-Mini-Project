// Business Rule: Send New Incident Email
// Table: incident
// When: after
// Insert: true

(function executeRule(current, previous /*null when async*/) {

  // Send an email to the caller
  gs.eventQueue('incident.inserted', current, gs.getUserID(), gs.getUserName());

})(current, previous);
