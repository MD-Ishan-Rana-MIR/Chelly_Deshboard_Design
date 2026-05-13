import Swal from "sweetalert2";

export const handleDelete = async () => {
    return (
        Swal.fire({
            icon: 'warning', // shows the yellow triangle
            title: 'Delete Streamer',
            html: 'Are you sure you want to delete <strong>Living Room Streamer</strong>?<br>This cannot be undone.',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            focusCancel: true,
            reverseButtons: true,
            buttonsStyling: false,
            customClass: {
                confirmButton: 'bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700',
                cancelButton: 'border border-blue-600 text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-blue-50'
            }
        })
    )
};