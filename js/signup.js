document.addEventListener('DOMContentLoaded', function() {
    // Get all forms
    const forms = [
        {
            form: document.getElementById('mc-embedded-subscribe-form'),
            responseDiv: document.getElementById('signup-response')
        },
        {
            form: document.getElementById('mc-embedded-subscribe-form-cta'),
            responseDiv: document.getElementById('signup-response-cta')
        },
        {
            form: document.getElementById('mc-embedded-subscribe-form-utgifter'),
            responseDiv: document.getElementById('signup-response-utgifter')
        },
        {
            form: document.getElementById('mc-embedded-subscribe-form-premium'),
            responseDiv: document.getElementById('signup-response-premium')
        },
        {
            form: document.getElementById('mc-embedded-subscribe-form-basic'),
            responseDiv: document.getElementById('signup-response-basic')
        }
    ];

    // Modal handling for both basic and premium
    const modals = [
        {
            modal: document.getElementById('basic-modal'),
            button: document.querySelector('.basic-notify'),
            closeButton: document.querySelector('#basic-modal .modal-close')
        },
        {
            modal: document.getElementById('premium-modal'),
            button: document.querySelector('.premium-notify'),
            closeButton: document.querySelector('#premium-modal .modal-close')
        }
    ];

    // Setup modal handlers
    modals.forEach(({modal, button, closeButton}) => {
        if (button && modal && closeButton) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });

            closeButton.addEventListener('click', function() {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });

            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    });

    // Add submit handler to each form
    forms.forEach(({form, responseDiv}) => {
        if (!form) return; // Skip if form doesn't exist

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            
            // Get the base URL from the form's action attribute
            let url = form.action;
            
            // Convert form data to URL-encoded string
            const searchParams = new URLSearchParams();
            for (const pair of formData) {
                searchParams.append(pair[0], pair[1]);
            }

            // Add callback parameter for JSONP
            url = url + '&c=?';
            
            // Add premium tag if this is the premium form (after the callback parameter)
            if (form.id === 'mc-embedded-subscribe-form-premium') {
                url = url + '&tags[]=' + encodeURIComponent('premium-interest');
            }

            // Show loading state
            const button = form.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            button.textContent = 'Skickar...';
            button.disabled = true;

            // Submit to Mailchimp
            fetch(url, {
                method: 'POST',
                body: searchParams,
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(() => {
                // Show success message
                responseDiv.textContent = 'Tack för din anmälan! Vi hör av oss när appen lanseras.';
                responseDiv.className = 'signup-response success';
                form.reset();
                
                // If this is a modal form, close the modal after a delay
                const parentModal = form.closest('.modal');
                if (parentModal) {
                    setTimeout(() => {
                        parentModal.classList.remove('active');
                        document.body.style.overflow = '';
                    }, 2000);
                }
            })
            .catch(error => {
                // Show error message
                responseDiv.textContent = 'Ett fel uppstod. Försök igen senare.';
                responseDiv.className = 'signup-response error';
            })
            .finally(() => {
                // Reset button state
                button.textContent = originalText;
                button.disabled = false;
            });
        });
    });
}); 