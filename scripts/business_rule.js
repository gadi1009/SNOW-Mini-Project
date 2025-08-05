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