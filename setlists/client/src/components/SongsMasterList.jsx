import React from "react";
import OneSongBox from "./OneSongBox";
import EditSongForm from "./EditSongForm";
import SongCreateForm from "./SongCreateForm";
import Segno from "../assets/segno.png";

export default class SongsMasterList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: null,
    };
  }

  resetEdit = () => {
    this.setState({
      isEdit: null,
    });
  };

  setEdit = (id) => {
    this.setState({
      isEdit: id,
    });
  };

  setFormData = (song) => {
    // Call the parent's setFormData instead
    this.props.setFormData(song.id);
  };

  render() {
    return (
      <div className="masterlist-and-add-a-song">
        <img
          className="segno-image"
          src={Segno}
          alt="home button"
          onClick={this.props.segnoHandleSubmit}
        />
        <h3 className="master-songlist">Master Songlist Library</h3>
        <h4 className="master-songlist-subtitle">
          Scroll to view, edit and delete songs below...
        </h4>
        <div className="all-songs-map">
          {this.props.songs.map((song) => (
            // the line below doesn't really add functionality, the key
            // is required by react and the className is just for styling
            <div key={song.id} className="all-songs-one-box">
              {this.state.isEdit === song.id ? (
                <EditSongForm
                  // Below are all props
                  formData={this.state.formData}
                  handleChange={this.handleChange}
                  songUpdateHandleSubmit={this.props.songUpdateHandleSubmit}
                  resetEdit={this.resetEdit}
                />
              ) : (
                <>
                  {/* the first song below is used in OneSongBox.jsx */}
                  <OneSongBox
                    {...this.props}
                    song={song}
                    setEdit={this.setEdit}
                    setFormData={this.setFormData}
                  />
                </>
              )}
            </div>
          ))}
        </div>
        <SongCreateForm {...this.props} />
      </div>
    );
  }
}
