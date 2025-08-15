// UI Action: Create Problem
// Name: Create Problem
// Table: incident
// Condition: current.problem_id == '' && current.isValidRecord()

// Create a new Problem record
var problem = new GlideRecord('problem');
problem.initialize();

// Copy information from the incident
problem.short_description = current.short_description;
problem.description = current.description;
problem.cmdb_ci = current.cmdb_ci;
problem.company = current.company;
problem.sys_domain = current.sys_domain;

// Set the first reported incident
problem.first_reported_by_task = current.sys_id;

// Insert the new problem record
var problemSysId = problem.insert();

// Link the problem to the incident
current.problem_id = problemSysId;
current.update();

// Display a message and redirect to the new problem
gs.addInfoMessage('Problem ' + problem.number + ' created');
action.setRedirectURL(problem);
