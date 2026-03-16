import React from "react";

export default class SongCreateForm extends React.Component {
  render() {
    return (
      <div className="add-song-form">
        <h2 className="add-song-header">Add a song to the database</h2>
        <div className="new-song-inputs">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await this.props.songCreateHandleSubmit(this.props.formData);
            }}
          >
            <input
              className="song-input"
              type="text"
              placeholder="Song Name"
              name="name"
              onChange={this.props.handleChange}
              // formData could be anything
              value={this.props.formData.name}
            />{" "}
            <br />
            <input
              className="abbrev-input"
              type="text"
              placeholder="Song Abbreviation"
              name="abbreviation"
              onChange={this.props.handleChange}
              value={this.props.formData.abbreviation}
            />
            <input
              className="length-input"
              type="string"
              placeholder="Length"
              name="length"
              onChange={this.props.handleChange}
              value={this.props.formData.length}
            />
            <button className="save-song-button">Save</button>
          </form>
        </div>
      </div>
    );
  }
}
