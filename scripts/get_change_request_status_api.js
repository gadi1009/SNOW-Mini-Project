// Scripted REST API: Get Change Request Status
// Name: Get Change Request Status
// API ID: custom.create_change_request_api (assuming we add a new resource to the existing API)
// HTTP Method: GET
// Relative Path: /status/{change_request_number}

(function process( /*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {

    // Get the change request number from the path parameter
    var changeRequestNumber = request.pathParams.change_request_number;

    // Find the change request
    var change = new GlideRecord('change_request');
    if (change.get('number', changeRequestNumber)) {

        // Prepare the response
        response.setStatus(200); // OK
        response.setBody({
            'status': 'success',
            'change_request': {
                'number': change.number,
                'state': change.state.getDisplayValue(),
                'sys_id': change.sys_id
            }
        });

    } else {
        // Change Request not found
        response.setStatus(404); // Not Found
        response.setBody({
            'status': 'error',
            'message': 'Change Request ' + changeRequestNumber + ' not found'
        });
    }

})(request, response);
