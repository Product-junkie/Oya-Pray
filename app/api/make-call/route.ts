const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Logic to turn 070... into +23470...
  let formattedPhone = phone;
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '+234' + formattedPhone.substring(1);
  }

  const { error } = await supabase
    .from('reminders')
    .insert([{
      phone: formattedPhone,
      prayer_times: [time],
      timezone: 'Africa/Lagos'
    }]);

  if (!error) {
    alert("Alice is watching you! She will call at " + time);
  }
};