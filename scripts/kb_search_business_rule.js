// Business Rule: Search Knowledge Base on Incident Update
// Table: incident
// When: async
// Update: true
// Condition: current.short_description.changes()

(function executeRule(current, previous /*null when async*/) {

    // Only run if the short description is not empty
    if (gs.nil(current.short_description)) {
        return;
    }

    // Search the Knowledge Base
    var kbSearch = new GlideRecord('kb_knowledge');
    kbSearch.addQuery('active', 'true');
    kbSearch.addQuery('123TEXTQUERY321', current.short_description);
    kbSearch.setLimit(3);
    kbSearch.query();

    if (kbSearch.getRowCount() > 0) {
        var msg = 'Relevant Knowledge Base articles found:\n';
        while (kbSearch.next()) {
            msg += '  - KB: ' + kbSearch.number + ' - ' + kbSearch.short_description + '\n';
        }
        current.work_notes = msg;
        current.update();
    }

})(current, previous);
