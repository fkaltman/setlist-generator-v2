import React, { Component } from "react";
import { getRandomSong, getOneRandomSong } from "../services/api-helper";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Segno from "../assets/segno.png";
import X from "../assets/x.png";

export default class GenerateSetlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setOne: [],
      setTwo: [],
      printingSet: null,
    };
  }

  componentDidMount = async () => {
    this.getRandos();
  };

  componentDidUpdate = async (prevProps) => {
    // Regenerate setlists if setlistCount changes
    if (prevProps.setlistCount !== this.props.setlistCount) {
      this.getRandos();
    }
  };

  getOneSong1 = async () => {
    const usedIds = this.state.setOne.map((song) => song.id);
    let newSong = await getOneRandomSong(usedIds);
    this.setState((prevState) => ({
      setOne: [...prevState.setOne, newSong],
    }));
  };

  getOneSong2 = async () => {
    const usedIds = this.state.setTwo.map((song) => song.id);
    let newSong = await getOneRandomSong(usedIds);
    this.setState((prevState) => ({
      setTwo: [...prevState.setTwo, newSong],
    }));
  };

  getRandos = async () => {
    const randomList = await getRandomSong();
    if (this.props.setlistCount === 1) {
      this.setState({
        setOne: randomList.set1,
        setTwo: [],
      });
    } else {
      this.setState({
        setOne: randomList.set1,
        setTwo: randomList.set2,
      });
    }
  };

  removeGeneratedSong1 = async (id) => {
    this.setState((prevState) => ({
      setOne: [...prevState.setOne.filter((song) => id !== song.id)],
    }));
  };

  removeGeneratedSong2 = async (id) => {
    this.setState((prevState) => ({
      setTwo: [...prevState.setTwo.filter((song) => id !== song.id)],
    }));
  };

  // Reorder helper function
  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // Handle drag end for both sets
  onDragEnd = (result) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Reorder within Set 1
    if (
      source.droppableId === "setOne" &&
      destination.droppableId === "setOne"
    ) {
      const reorderedSetOne = this.reorder(
        this.state.setOne,
        source.index,
        destination.index,
      );
      this.setState({ setOne: reorderedSetOne });
    }

    // Reorder within Set 2
    if (
      source.droppableId === "setTwo" &&
      destination.droppableId === "setTwo"
    ) {
      const reorderedSetTwo = this.reorder(
        this.state.setTwo,
        source.index,
        destination.index,
      );
      this.setState({ setTwo: reorderedSetTwo });
    }
  };

  handlePrintSet1 = () => {
    this.setState({ printingSet: "set1" }, () => {
      window.print();
      // Reset after print dialog closes
      setTimeout(() => this.setState({ printingSet: null }), 100);
    });
  };

  handlePrintSet2 = () => {
    this.setState({ printingSet: "set2" }, () => {
      window.print();
      // Reset after print dialog closes
      setTimeout(() => this.setState({ printingSet: null }), 100);
    });
  };

  render() {
    const printClass = this.state.printingSet
      ? `printing-${this.state.printingSet}`
      : "";
    const setlistLayoutClass =
      this.props.setlistCount === 1 ? "single-setlist" : "two-rando-sets";
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className={`rando-lists-page ${printClass}`}>
          <div className="setlist-header">
            <img
              className="segno-image"
              src={Segno}
              alt="home button"
              onClick={this.props.segnoHandleSubmit}
            />
          </div>
          <h2 className="add-remove-drag">
            Add, remove, and drag to <br className="for-mobile-only" />
            rearrange songs
          </h2>
          <div className={setlistLayoutClass}>
            {this.state.setOne && (
              <>
                <div className="set-one">
                  <h1 className="set-one-title">Set 1</h1>
                  <p className="set-time">
                    {Math.ceil(
                      this.state.setOne.reduce(
                        (sum, song) => sum + song.length,
                        0,
                      ),
                    )}{" "}
                    minutes
                  </p>
                  <hr />
                  <Droppable droppableId="setOne">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {this.state.setOne.map((song, index) => (
                          <Draggable
                            key={song.id.toString()}
                            draggableId={song.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                className="info"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  opacity: snapshot.isDragging ? 0.8 : 1,
                                }}
                              >
                                <div className="songs-and-times">
                                  <div
                                    className="s-abbrev"
                                    style={{
                                      color: snapshot.isDragging
                                        ? "#999"
                                        : "inherit",
                                    }}
                                  >
                                    {song.abbreviation}
                                  </div>
                                  <div
                                    className="s-length"
                                    style={{
                                      color: snapshot.isDragging
                                        ? "#999"
                                        : "inherit",
                                    }}
                                  >
                                    {" "}
                                    {song.length}
                                  </div>
                                  <img
                                    className="x"
                                    src={X}
                                    alt="remove"
                                    onClick={() => {
                                      this.removeGeneratedSong1(song.id);
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  <button
                    className="add-random-song"
                    onClick={() => {
                      this.getOneSong1();
                    }}
                  >
                    ADD A SONG
                  </button>
                  <button className="print-link" onClick={this.handlePrintSet1}>
                    Print Set 1
                  </button>
                </div>
                {this.props.setlistCount === 2 && (
                  <div className="set-two">
                    <h1 className="set-two-title">Set 2</h1>
                    <p className="set-time">
                      {Math.ceil(
                        this.state.setTwo.reduce(
                          (sum, song) => sum + song.length,
                          0,
                        ),
                      )}{" "}
                      minutes
                    </p>
                    <hr />
                    <Droppable droppableId="setTwo">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {this.state.setTwo.map((song, index) => (
                            <Draggable
                              key={song.id.toString()}
                              draggableId={song.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  className="info"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    opacity: snapshot.isDragging ? 0.8 : 1,
                                  }}
                                >
                                  <div className="songs-and-times">
                                    <div
                                      className="s-abbrev"
                                      style={{
                                        color: snapshot.isDragging
                                          ? "#999"
                                          : "inherit",
                                      }}
                                    >
                                      {song.abbreviation}
                                    </div>
                                    <div
                                      className="s-length"
                                      style={{
                                        color: snapshot.isDragging
                                          ? "#999"
                                          : "inherit",
                                      }}
                                    >
                                      {" "}
                                      {song.length}
                                    </div>
                                    <img
                                      className="x"
                                      src={X}
                                      alt="remove"
                                      onClick={() => {
                                        this.removeGeneratedSong2(song.id);
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    <button
                      className="add-random-song"
                      onClick={() => {
                        this.getOneSong2();
                      }}
                    >
                      ADD A SONG
                    </button>
                    <button
                      className="print-link"
                      onClick={this.handlePrintSet2}
                    >
                      Print Set 2
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DragDropContext>
    );
  }
}
