import WatchList from '../models/watchList.model.js';

export const addToWatchList = async (req, res) => {
  try {
    if (!req.user?._id) return res.status(401).json({ message: 'Unauthorized - no user data' });

    const { animeId, poster, episodes, title, type, status } = req.body.payload;

    if (!animeId || !poster || !episodes || !title) {
      return res.status(404).json({ message: 'Fields required to add to the watch list' });
    }

    // Check if the anime is already in the user's watchlist
    const existingEntry = await WatchList.findOne({ userId: req.user._id, animeId });

    if (existingEntry) {
      return res.status(409).json({ message: 'Anime already added to the watchlist' });
    }

    // Default the missing values on the backend
    const defaultEpisodes = {
      sub: episodes?.sub ?? null, // Default to null if sub is missing
      dub: episodes?.dub ?? null, // Default to null if dub is missing
    };

    const defaultStatus = status || 'Plan to Watch';

    const newWatchList = new WatchList({
      userId: req.user._id,
      animeId,
      poster,
      episodes: defaultEpisodes,
      title,
      type,
      status: defaultStatus,
    });

    await newWatchList.save();
    res.status(201).json({ message: 'WatchList entry created', data: newWatchList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating WatchList entry', error: error.message });
  }
};

export const getUserWatchList = async (req, res) => {
  try {
    if (!req.user?._id) return res.status(401).json({ message: 'Unauthorized - no user data' });

    const watchLists = await WatchList.find({ userId: req.user._id });
    res.status(200).json(watchLists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching WatchList entries', error: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { animeId } = req.params;
    const userId = req.user?._id;
    const { status } = req.body;

    // ✅ Validate input
    if (!animeId) {
      return res.status(400).json({ message: 'animeId is required' });
    }
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: no user ID found' });
    }
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // ✅ Update the entry that matches both userId and animeId
    const updated = await WatchList.findOneAndUpdate(
      { animeId, userId },
      { status },
      { new: true } // return the updated doc
    );

    if (!updated) {
      return res.status(404).json({ message: 'Watchlist entry not found for this user' });
    }

    // ✅ Success
    res.status(200).json({ message: 'Updated successfully', data: updated });
  } catch (error) {
    console.error('Error updating watchlist:', error);
    res.status(500).json({
      message: 'Error updating WatchList entry',
      error: error.message,
    });
  }
};

export const removeFromWatchList = async (req, res) => {
  try {
    const { animeId } = req.params;
    const userId = req.user?._id;

    // ✅ Validate input first
    if (!animeId) {
      return res.status(400).json({ message: 'animeId is required' });
    }
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: no user ID found' });
    }

    // ✅ Find and delete in one operation
    const deletedEntry = await WatchList.findOneAndDelete({ animeId, userId });

    if (!deletedEntry) {
      return res.status(404).json({ message: 'Watchlist entry not found for this user' });
    }

    // ✅ Success
    res.status(200).json({ message: 'Deleted successfully', deleted: deletedEntry });
  } catch (error) {
    console.error('Error deleting watchlist:', error);
    res.status(500).json({
      message: 'Error deleting WatchList entry',
      error: error.message,
    });
  }
};
