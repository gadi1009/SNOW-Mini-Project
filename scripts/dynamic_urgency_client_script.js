// Client Script: Set Urgency from Impact
// Type: onChange
// Field: impact

function onChange(control, oldValue, newValue, isLoading, isTemplate) {
  if (isLoading || newValue === '') {
    return;
  }

  var ga = new GlideAjax('IncidentUtils');
  ga.addParam('sysparm_name', 'getUrgencyFromImpact');
  ga.addParam('sysparm_impact', newValue);
  ga.getXML(setUrgency);

  function setUrgency(response) {
    var answer = response.responseXML.documentElement.getAttribute('answer');
    g_form.setValue('urgency', answer);
  }
}
