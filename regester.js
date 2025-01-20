document.addEventListener("DOMContentLoaded", function() {

    // variable
    const formContainer = document.getElementById('formContainer');

    const form = document.createElement('form');
    form.id = 'registrationForm';

    const title = document.createElement('h2');
    title.textContent = 'Register';
    formContainer.appendChild(title);

    const fields = [
        { label: 'First Name', type: 'text', id: 'firstName', required: true },
        { label: 'Last Name', type: 'text', id: 'lastName', required: true },
        { label: 'Username', type: 'text', id: 'username', required: true },
        { label: 'Email', type: 'email', id: 'email', required: true },
        { label: 'Phone Number', type: 'tel', id: 'phoneNumber', required: true },
        { label: 'Password', type: 'password', id: 'password', required: true },
        { label: 'Confirm Password', type: 'password', id: 'confirmPassword', required: true },
    ];

    fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.setAttribute('for', field.id);
        label.textContent = field.label;

        const input = document.createElement('input');
        input.type = field.type;
        input.id = field.id;
        input.required = field.required;

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        form.appendChild(formGroup);
    });

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    form.appendChild(submitButton);

    formContainer.appendChild(form);

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
        } else {
            // Handle successful submission (e.g., send data to a server)
            alert('Form submitted successfully!');
        }
    });
});