import mongoose from 'mongoose';

const watchListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    animeId: {
      type: String,
      required: true,
    },
    poster: {
      type: String,
      required: true,
    },
    episodes: {
      sub: { type: Number, default: 0 },
      dub: { type: Number, default: 0 },
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default : 'TV'
    },
    status: {
      type: String,
      enum: ['Plan to Watch', 'Watching', 'On-Hold', 'Dropped', 'Completed'],
      default: 'Plan to Watch',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('WatchList', watchListSchema);
