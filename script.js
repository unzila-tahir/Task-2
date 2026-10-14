
        (() => {
            const form = document.querySelector('#auth-form');
            const tabs = [...document.querySelectorAll('.tab')];
            const nameField = document.querySelector('#name-field');
            const confirmField = document.querySelector('#confirm-field');
            const loginOptions = document.querySelector('#login-options');
            const signupOptions = document.querySelector('#signup-options');
            const password = document.querySelector('#password');
            const message = document.querySelector('#form-message');
            let mode = 'login';

            function clearErrors() {
                document.querySelectorAll('.field-error').forEach(error => error.textContent = '');
                form.querySelectorAll('input[aria-invalid="true"]').forEach(input => input.removeAttribute('aria-invalid'));
                message.textContent = '';
                message.classList.remove('error');
            }
            function setMode(nextMode) {
                mode = nextMode;
                const signup = mode === 'signup';
                tabs.forEach(tab => tab.setAttribute('aria-selected', String(tab.dataset.mode === mode)));
                nameField.classList.toggle('hidden', !signup);
                confirmField.classList.toggle('hidden', !signup);
                loginOptions.classList.toggle('hidden', signup);
                signupOptions.classList.toggle('hidden', !signup);
                document.querySelector('#form-title').textContent = signup ? 'Create your account' : 'Welcome back';
                document.querySelector('#form-subtitle').textContent = signup ? 'A few details and you’re ready to go.' : 'Sign in to continue to your workspace.';
                document.querySelector('#submit-button').textContent = signup ? 'Create account' : 'Sign in';
                password.autocomplete = signup ? 'new-password' : 'current-password';
                clearErrors();
            }
            tabs.forEach(tab => tab.addEventListener('click', () => setMode(tab.dataset.mode)));
            document.querySelector('.show-password').addEventListener('click', event => {
                const button = event.currentTarget;
                const showing = password.type === 'password';
                password.type = showing ? 'text' : 'password';
                button.textContent = showing ? 'Hide' : 'Show';
                button.setAttribute('aria-label', showing ? 'Hide password' : 'Show password');
                button.setAttribute('aria-pressed', String(showing));
            });
            function reportError(input, errorId, text) {
                input.setAttribute('aria-invalid', 'true');
                document.getElementById(errorId).textContent = text;
            }
            form.addEventListener('submit', event => {
                event.preventDefault();
                clearErrors();
                let valid = true;
                const name = document.querySelector('#name');
                const email = document.querySelector('#email');
                const confirm = document.querySelector('#confirm-password');
                if (mode === 'signup' && !name.value.trim()) { reportError(name, 'name-error', 'Please enter your name.'); valid = false; }
                if (!email.value.trim()) { reportError(email, 'email-error', 'Please enter your email address.'); valid = false; }
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { reportError(email, 'email-error', 'Enter a valid email address.'); valid = false; }
                if (!password.value) { reportError(password, 'password-error', 'Please enter your password.'); valid = false; }
                else if (mode === 'signup' && password.value.length < 8) { reportError(password, 'password-error', 'Use at least 8 characters.'); valid = false; }
                if (mode === 'signup' && password.value && confirm.value !== password.value) { reportError(confirm, 'confirm-error', 'Passwords do not match.'); valid = false; }
                if (mode === 'signup' && !document.querySelector('#terms').checked) { message.textContent = 'Please agree to the terms to continue.'; message.classList.add('error'); valid = false; }
                if (!valid) {
                    if (!message.textContent) message.textContent = 'Please check the highlighted fields.';
                    message.classList.add('error');
                    form.querySelector('[aria-invalid="true"]')?.focus();
                    return;
                }
                message.textContent = mode === 'signup' ? 'Your details look good. Account creation is not connected yet.' : 'Your details look good. Sign-in is not connected yet.';
            });
            form.querySelectorAll('input').forEach(input => input.addEventListener('input', () => {
                if (input.hasAttribute('aria-invalid')) {
                    input.removeAttribute('aria-invalid');
                    document.getElementById(input.getAttribute('aria-describedby'))?.replaceChildren();
                }
                message.textContent = '';
                message.classList.remove('error');
            }));
            document.querySelector('#forgot-link').addEventListener('click', event => {
                event.preventDefault();
                message.classList.remove('error');
                message.textContent = 'Password reset is not connected yet.';
            });
        })();
    