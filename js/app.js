function viewPassword() {
    const passwordField = document.querySelector('#exampleInputPassword1');
    passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
  }

  const viewPasswordCheckbox = document.querySelector('#view_pwd');
  viewPasswordCheckbox.addEventListener('click', viewPassword);