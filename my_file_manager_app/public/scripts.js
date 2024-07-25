// script to handle delete file in the file manager page

function handleDelete(form) {
    const id = form.action.split('/').pop();

    fetch(`/api/files/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Refresh the page or redirect to the file manager
            window.location.reload();
        } else {
            return response.json().then(data => {
                console.error('Error deleting file:', data.error);
            });
        }
    })
    .catch(error => console.error('Error:', error));

    return false; // Prevent form resubmission
}


