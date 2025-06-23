// import mongoose, { Schema, Document } from 'mongoose';

// export interface IExecom extends Document {
//   name: string;
//   year: number;
//   branch: string;
//   usn: string;
//   chapters: string[]; // could also be ObjectId[] if you want refs
//   position:
//     | 'chair(main)'
//     | 'vice chair(main)'
//     | 'secretary(main)'
//     | 'vice secretary(main)'
//     | 'Execom'
//     | 'chair(for specific chapter)'
//     | 'vice chair(for specific chapter)';
// }

// const execomSchema = new Schema<IExecom>(
//   {
//     name: { type: String, required: true },
//     year: { type: Number, required: true },
//     branch: { type: String, required: true },
//     usn: { type: String, required: true, unique: true },
//     chapters: [{ type: String, required: true }],
//     position: {
//       type: String,
//       enum: [
//         'chair(main)',
//         'vice chair(main)',
//         'secretary(main)',
//         'vice secretary(main)',
//         'Execom',
//         'chair(for specific chapter)',
//         'vice chair(for specific chapter)',
//       ],
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// const Execom = mongoose.model<IExecom>('Execom', execomSchema);
// export default Execom;

const mongoose = require('mongoose');

const execomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    year: { type: Number, required: true },
    branch: { type: String, required: true },
    usn: { type: String, required: true, unique: true },
    chapters: [{ type: String, required: true }],
    position: {
      type: String,
      enum: [
        'chair(main)',
        'vice chair(main)',
        'secretary(main)',
        'vice secretary(main)',
        'Execom',
        'chair(for specific chapter)',
        'vice chair(for specific chapter)',
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const Execom = mongoose.model('Execom', execomSchema);
module.exports = Execom;
