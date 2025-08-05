// Script Include: IncidentUtils
// Name: IncidentUtils
// Client callable: true

var IncidentUtils = Class.create();
IncidentUtils.prototype = Object.extendsObject(AbstractAjaxProcessor, {

  getUrgencyFromImpact: function() {
    var impact = this.getParameter('sysparm_impact');
    var urgency = '3'; // Default to Low

    if (impact == '1') { // High
      urgency = '1'; // High
    } else if (impact == '2') { // Medium
      urgency = '2'; // Medium
    }

    return urgency;
  },

  type: 'IncidentUtils'
});