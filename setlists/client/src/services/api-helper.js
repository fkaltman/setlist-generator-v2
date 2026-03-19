import { supabase } from "./supabaseClient";

// Setlist API calls

export const fetchSetlists = async () => {
  const { data, error } = await supabase.from("setlists").select("*, songs(*)");
  if (error) throw error;
  return data;
};

export const fetchSetlist = async (id) => {
  const { data, error } = await supabase
    .from("setlists")
    .select("*, songs(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const createSetlist = async (setlistData) => {
  const { data, error } = await supabase
    .from("setlists")
    .insert([setlistData])
    .single();
  if (error) throw error;
  return data;
};

export const deleteSetlist = async (id) => {
  const { data, error } = await supabase
    .from("setlists")
    .delete()
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const editSetlist = async (id, updateSetlist) => {
  const { created_at, updated_at, songs, ...setlistFields } = updateSetlist;
  const { data, error } = await supabase
    .from("setlists")
    .update(setlistFields)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

// ------------------song api calls----------------------- //

export const fetchSongs = async () => {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("name");
  if (error) throw error;
  return data;
};

export const fetchSong = async (id) => {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const createSong = async (songData) => {
  try {
    const { data, error } = await supabase
      .from("songs")
      .insert([songData])
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const deleteSong = async (id) => {
  const { data, error } = await supabase.from("songs").delete().eq("id", id);
  if (error) throw error;
  return data;
};

export const editSong = async (id, updateSong) => {
  const { created_at, updated_at, ...songFields } = updateSong;
  const { data, error } = await supabase
    .from("songs")
    .update(songFields)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

// ------------------random song & list functions----------------------- //

function makeRandomList(songs) {
  const count = Math.min(15, songs.length);
  const selected = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * songs.length);
    selected.push(songs.splice(randomIndex, 1)[0]);
  }
  return selected;
}

export const getRandomSong = async () => {
  const { data, error } = await supabase.from("songs").select("*");
  if (error) throw error;

  const allSongs = [...data];
  const set1 = makeRandomList(allSongs);
  const set2 = makeRandomList(allSongs);
  return { set1, set2 };
};

export const getOneRandomSong = async (excludeIds = []) => {
  const { data, error } = await supabase.from("songs").select("*");
  if (error) throw error;

  // Filter out songs that are already in the setlist
  const availableSongs = data.filter((song) => !excludeIds.includes(song.id));

  // If all songs are used, return a random one anyway
  if (availableSongs.length === 0)
    return data[Math.floor(Math.random() * data.length)];

  const randomIndex = Math.floor(Math.random() * availableSongs.length);
  return availableSongs[randomIndex];
};
