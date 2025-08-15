// Scripted REST API: Create Change Request
// Name: Create Change Request
// API ID: custom.create_change_request_api
// HTTP Method: POST

(function process( /*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {

    // Get the request body
    var body = request.body.data;

    // Create a new Change Request
    var change = new GlideRecord('change_request');
    change.initialize();

    // Set change request values from the request body
    change.short_description = body.short_description;
    change.description = body.description;
    change.assignment_group.setDisplayValue(body.assignment_group);
    change.cmdb_ci.setDisplayValue(body.configuration_item);
    change.type = 'Standard'; // Assuming a standard change for automation
    change.state = '-4'; // Assess

    // Insert the new change request
    var changeSysId = change.insert();

    // Prepare the response
    if (changeSysId) {
        response.setStatus(201); // Created
        response.setBody({
            'status': 'success',
            'message': 'Change Request created successfully',
            'change_request': {
                'number': change.number,
                'sys_id': change.sys_id
            }
        });
    } else {
        response.setStatus(500); // Internal Server Error
        response.setBody({
            'status': 'error',
            'message': 'Failed to create Change Request'
        });
    }

})(request, response);
