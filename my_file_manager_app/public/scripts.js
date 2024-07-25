// script to handle delete file in the file manager page

function handleDelete(form) {
    const id = form.action.split('/').pop();
    fetch(`/api/files/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Refresh the page or redirect to the file manager
            window.location.reload();
        } else {
            console.error('Error deleting file:', data.error);
        }
    })
    .catch(error => console.error('Error:', error));

    return false; // Prevent form resubmission
}

