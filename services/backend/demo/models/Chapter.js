// import mongoose, { Schema, Document, Types } from 'mongoose';
// import { IExecom } from './Execom';

// export interface IChapter extends Document {
//   chapterName: string;
//   chapterChair: string;
//   relatedPositions: ( | 'chair(for Chapter)'| 'vice chair(for chapter)'| 'secretary(for chapter)'| 'vice secretary(for chapter)')[];
//   execoms: Types.ObjectId[] | IExecom[];
// }

// const chapterSchema = new Schema<IChapter>(
//   {
//     chapterName: { type: String, required: true },
//     chapterChair: { type: String, required: true },
//     relatedPositions: {
//       type: [String],
//       enum: [
//         'chair(for chapter)',
//         'vice chair(for chapter)',
//         'secretary(for chapter)',
//         'vice secretary(for chapter)',
//       ],
//       required: true,
//     },
//     execoms: [{ type: Schema.Types.ObjectId, ref: 'Execom', required: true }],
//   },
//   { timestamps: true }
// );

// const Chapter = mongoose.model<IChapter>('Chapter', chapterSchema);
// export default Chapter;

// const mongoose = require('mongoose');

// const chapterSchema = new mongoose.Schema({
//   chapterName: {
//     type: String,
//     required: true,
//   },
//   chapterChair: {
//     type: String,
//     required: true,
//   },
//   relatedPositions: {
//     type: [String],
//     enum: [
//       'chair(for specific chapter)',
//       'vice chair(for specific chapter)',
//       'secretary(for specific chapter)',
//       'vice secretary(for specific chapter)',
//     ],
//     required: true,
//   },
//   execoms: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Execom',  // Reference to the Execom model
//     required: true,
//   }],
// }, { timestamps: true });

// const Chapter = mongoose.model('Chapter', chapterSchema);

// module.exports = Chapter;
const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  chapterName: {
    type: String,
    required: true,
  },
  chapterChair: {
    type: String,
    required: true,
  },
  relatedPositions: {
    type: [String],
    enum: [
      'chair(for specific chapter)',
      'vice chair(for specific chapter)',
      'secretary(for specific chapter)',
      'vice secretary(for specific chapter)',
    ],
    required: true,
  },
  execoms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Execom',
    required: true,
  }],
  overview: {
    type: String,
    default: '',
  },
  activities: {
    type: [String],
    default: [],
  },
  focusAreas: {
    type: [String],
    default: [],
  },
  founded: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'from-gray-700 to-gray-900',
  },

  acronym: {
    type: String,
    default: 'CH',
  },
}, { timestamps: true });

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;
