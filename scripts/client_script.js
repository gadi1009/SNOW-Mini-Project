// Client Script: High-Priority Incident Validation
// Type: onChange
// Field: priority

function onChange(control, oldValue, newValue, isLoading, isTemplate) {
  if (isLoading || newValue === '') {
    return;
  }

  // If priority is set to 1 (High)
  if (newValue == 1) {
    var description = g_form.getValue('description');
    if (description.length < 20) {
      g_form.showFieldMsg('description', 'For high-priority incidents, please provide a more detailed description (at least 20 characters).', 'error');
    }
  }
}
