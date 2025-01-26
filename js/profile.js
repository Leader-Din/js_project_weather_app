document.addEventListener("DOMContentLoaded", function() {
    const userProfile = document.querySelector('#userProfile tbody');
    const saveChangesButton = document.getElementById('saveChanges');
    const profilePicture = document.getElementById('profilePicture');
    const profilePictureInput = document.getElementById('profilePictureInput');
    let userData = JSON.parse(localStorage.getItem('userData'));

    function populateProfile() {
        userProfile.innerHTML = '';
        if (userData) {
            if (userData.profilePicture) {
                profilePicture.src = userData.profilePicture;
            }

            const profileFields = [
                { label: 'First Name', value: userData.firstName, id: 'firstName' },
                { label: 'Last Name', value: userData.lastName, id: 'lastName' },
                { label: 'Username', value: userData.username, id: 'username' },
                { label: 'Email', value: userData.email, id: 'email' },
                { label: 'Phone Number', value: userData.phoneNumber, id: 'phoneNumber' }
            ];

            profileFields.forEach(field => {
                const row = document.createElement('tr');

                const labelCell = document.createElement('td');
                labelCell.textContent = field.label;

                const valueCell = document.createElement('td');
                valueCell.textContent = field.value;
                valueCell.id = `value-${field.id}`;

                const actionCell = document.createElement('td');
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.className = 'btn btn-primary btn-sm';
                editButton.addEventListener('click', () => editField(field.id));
                actionCell.appendChild(editButton);

                row.appendChild(labelCell);
                row.appendChild(valueCell);
                row.appendChild(actionCell);
                userProfile.appendChild(row);
            });
        } else {
            userProfile.innerHTML = '<tr><td colspan="3">No user data found. Please register first.</td></tr>';
        }
    }

    function editField(fieldId) {
        const valueCell = document.getElementById(`value-${fieldId}`);
        const currentValue = valueCell.textContent;
        valueCell.innerHTML = `<input type="text" class="form-control" id="edit-${fieldId}" value="${currentValue}">`;
        saveChangesButton.style.display = 'inline-block';
    }

    profilePictureInput.addEventListener('change', function() {
        const file = profilePictureInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePicture.src = e.target.result;
            userData.profilePicture = e.target.result;
            localStorage.setItem('userData', JSON.stringify(userData));
        };
        reader.readAsDataURL(file);
    });

    saveChangesButton.addEventListener('click', () => {
        const fieldsToUpdate = ['firstName', 'lastName', 'username', 'email', 'phoneNumber'];
        fieldsToUpdate.forEach(fieldId => {
            const inputElement = document.getElementById(`edit-${fieldId}`);
            if (inputElement) {
                userData[fieldId] = inputElement.value;
            }
        });
        localStorage.setItem('userData', JSON.stringify(userData));
        populateProfile();
        saveChangesButton.style.display = 'none';
        alert('Profile updated successfully!');
    });

    populateProfile();
});
