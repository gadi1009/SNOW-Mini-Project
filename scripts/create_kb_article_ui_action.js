// UI Action: Create Knowledge Article from Incident
// Name: Create Knowledge Article
// Table: incident
// Condition: current.state == 6 // Resolved

function createKnowledgeArticle() {
    var kb = new GlideRecord('kb_knowledge');
    kb.initialize();
    kb.short_description = current.short_description;
    kb.article_body = 'Incident ' + current.number + ' was resolved with the following notes:\n\n' + current.close_notes;
    kb.insert();

    // Open the new knowledge article in a new tab
    var url = 'kb_knowledge.do?sys_id=' + kb.sys_id;
    g_navigation.open(url, '_blank');
}