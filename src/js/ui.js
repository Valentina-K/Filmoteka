import { AuthErrorCodes } from 'firebase/auth';

export const loginForm = document.querySelector('.auth-form');
export const txtEmail = document.querySelector('#txtEmail');
export const txtPassword = document.querySelector('#txtPassword');

export const btnLogin = document.querySelector('#btnLogin');
export const btnSignup = document.querySelector('#btnSignup');

export const btnLogout = document.querySelector('#btnLogout');
export const btnCloseRegForm = document.querySelector('[data-modal-close-reg]');

/* export const divAuthState = document.querySelector('#divAuthState');
export const lblAuthState = document.querySelector('#lblAuthState'); */

export const divLoginError = document.querySelector('#divLoginError');
export const lblLoginErrorMessage = document.querySelector(
  '#lblLoginErrorMessage'
);

export const showLoginForm = () => {
  document.querySelector('[data-modal-reg]').classList.toggle('is-hidden');
};

export const hideLoginError = () => {
  divLoginError.style.display = 'none';
  lblLoginErrorMessage.innerHTML = '';
};

export const showLoginError = error => {
  divLoginError.style.display = 'block';
  if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
    lblLoginErrorMessage.innerHTML = `Wrong password. Try again.`;
  } else {
    lblLoginErrorMessage.innerHTML = `Error: ${error.message}`;
  }
};

hideLoginError();
