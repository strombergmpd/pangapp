document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('mc-embedded-subscribe-form');
    const responseDiv = document.getElementById('signup-response');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const jsonData = {};
        formData.forEach((value, key) => jsonData[key] = value);

        // Convert form data to URL-encoded string
        const searchParams = new URLSearchParams();
        for (const pair of formData) {
            searchParams.append(pair[0], pair[1]);
        }

        // Add callback parameter for JSONP
        const url = form.action + '&c=?';

        // Show loading state
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        button.textContent = 'Skickar...';
        button.disabled = true;

        // Submit to Mailchimp
        fetch(url, {
            method: 'POST',
            body: searchParams,
            mode: 'no-cors'
        })
        .then(() => {
            // Show success message
            responseDiv.textContent = 'Tack för din anmälan! Vi hör av oss när appen lanseras.';
            responseDiv.className = 'signup-response success';
            form.reset();
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