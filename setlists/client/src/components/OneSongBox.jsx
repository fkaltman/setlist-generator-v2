import React from "react";
import Swal from "sweetalert2";

export default function OneSongBox(props) {
  return (
    <>
      <div className="song-text">{props.song.name}</div>
      <div className="abbrev-text">{props.song.abbreviation}</div>
      <div className="song-length">{props.song.length}</div>
      <br />
      {/* Edit songs button */}
      <div>
        <button
          className="song-edit-button"
          onClick={() => {
            props.setFormData(props.song);
            props.setEdit(props.song.id);
          }}
        >
          Edit
        </button>
      </div>
      {/* Delete Songs button */}
      <div>
        <button
          className="song-delete-button"
          onClick={() => {
            // Delete warning modal with password protection
            Swal.fire({
              title: "Delete Song?",
              html: `
            <p>You won't be able to reverse this!</p>
            <input type="password" id="delete-password" class="swal2-input" placeholder="Enter password to delete">
          `,
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#81b878",
              cancelButtonColor: "#eabfbf",
              confirmButtonText: "Yes, delete it!",
              preConfirm: async () => {
                const password =
                  document.getElementById("delete-password").value;
                if (password !== "safecamp") {
                  Swal.showValidationMessage("Incorrect password");
                  return false;
                }

                try {
                  await props.removeSong(props.song.id);
                  return true;
                } catch (error) {
                  Swal.showValidationMessage("Failed to delete song");
                  return false;
                }
              },
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire("Deleted!", "The song has been deleted.", "success");
              }
            });
          }}
        >
          Delete
        </button>
      </div>
    </>
  );
}
