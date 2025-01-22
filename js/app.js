// <<<<<<< HEAD
// variables
// Function to toggle password visibility
function viewPassword() {
  const passwordField = document.querySelector('#exampleInputPassword1');
  passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
}

// Attach the event listener to the "Show Password" checkbox
const viewPasswordCheckbox = document.querySelector('#view_pwd');
viewPasswordCheckbox.addEventListener('click', viewPassword);

// Handle forgot password form submission
const forgotPasswordForm = document.querySelector('#forgotPasswordForm');
forgotPasswordForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.querySelector('#recoveryEmail').value;

  // Simulate backend API call (replace with real API call)
  alert(`A recovery code has been sent to ${email}.`);
  
  // Close modal
  const modal = bootstrap.Modal.getInstance(document.querySelector('#forgotPasswordModal'));
  modal.hide();
});

// Handle code verification submission
const verifyCodeForm = document.querySelector('#verifyCodeForm');
verifyCodeForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const code = document.querySelector('#recoveryCode').value;

  // Simulate API call to verify code (replace with real API call)
  fetch('/api/verify-recovery-code', {
      method: 'POST',
      body: JSON.stringify({ code: code }),
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert('Code verified successfully!');
          const modal = bootstrap.Modal.getInstance(document.querySelector('#forgotPasswordModal'));
          modal.hide();
      } else {
          alert('Invalid code. Please try again.');
      }
  })
  .catch(error => {
      console.error('Error verifying code:', error);
      alert('An error occurred. Please try again.');
  });
});
// >>>>>>> 713109659937ad8013da6e409ac6bf2fcbe20513
