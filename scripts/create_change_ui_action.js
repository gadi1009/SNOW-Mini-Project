// UI Action: Create Change
// Name: Create Change
// Table: incident
// Condition: current.rfc == '' && current.isValidRecord()

// Create a new Change Request
var change = new GlideRecord('change_request');
change.initialize();

// Copy information from the incident
change.short_description = current.short_description;
change.description = current.description;
change.cmdb_ci = current.cmdb_ci;
change.company = current.company;
change.sys_domain = current.sys_domain;

// Set the parent to the incident
change.parent = current.sys_id;

// Insert the new change request
var changeSysId = change.insert();

// Link the change to the incident
current.rfc = changeSysId;
current.update();

// Display a message and redirect to the new change request
gs.addInfoMessage('Change ' + change.number + ' created');
action.setRedirectURL(change);
