// const mongoose = require('mongoose');

// const execomSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   year: { type: Number, required: true },
//   branch: { type: String, required: true },
//   usn: { type: String, required: true, unique: true },
//   chapters: [{ type: String, required: true }],
//   position: {
//     type: String,
//     enum: [
//       'chair(main)',
//       'vice chair(main)',
//       'secretary(main)',
//       'vice secretary(main)',
//       'Execom',
//       'chair(for specific chapter)',
//       'vice chair(for specific chapter)',
//     ],
//     required: true,
//   },
// });

// const chapterSchema = new mongoose.Schema({
//   chapterName: { type: String, required: true },
//   chapterChair: { type: String, required: true },
//   relatedPositions: { type: [String], required: true },
//   execoms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Execom' }],
//   overview: { type: String },
//   activities: { type: [String] },
//   focusAreas: { type: [String] },
//   founded: { type: String },
//   website: { type: String },
//   color: { type: String },
//   icon: { type: String },
//   acronym: { type: String },
// }, { timestamps: true });

// const Execom = mongoose.model('Execom', execomSchema);
// const Chapter = mongoose.model('Chapter', chapterSchema);

// async function seed() {
//   try {
//     await mongoose.connect('mongodb://127.0.0.1:27017/ieee-db');
//     console.log('Connected to MongoDB');

//     await Execom.deleteMany({});
//     await Chapter.deleteMany({});

//     const execoms = await Execom.insertMany([
//       {
//         name: 'Aarav R',
//         year: 3,
//         branch: 'CSE',
//         usn: '1MS21CS001',
//         chapters: ['WIE', 'CS'],
//         position: 'chair(main)',
//       },
//       {
//         name: 'Diya N',
//         year: 3,
//         branch: 'ISE',
//         usn: '1MS21IS002',
//         chapters: ['RAS'],
//         position: 'vice chair(main)',
//       },
//       {
//         name: 'Kiran M',
//         year: 2,
//         branch: 'ECE',
//         usn: '1MS22EC003',
//         chapters: ['CS'],
//         position: 'chair(for specific chapter)',
//       },
//       {
//         name: 'Sneha L',
//         year: 2,
//         branch: 'EEE',
//         usn: '1MS22EE004',
//         chapters: ['WIE'],
//         position: 'secretary(main)',
//       },
//       {
//         name: 'Yash S',
//         year: 1,
//         branch: 'ME',
//         usn: '1MS23ME005',
//         chapters: ['WIE', 'RAS'],
//         position: 'Execom',
//       },
//     ]);

//     await Chapter.insertMany([
//       {
//         chapterName: 'WIE',
//         chapterChair: 'Sneha L',
//         relatedPositions: ['chair(for specific chapter)', 'vice chair(for specific chapter)'],
//         execoms: [execoms[0]._id, execoms[3]._id, execoms[4]._id],
//         overview: 'Empowering women in engineering through education, mentorship, and leadership programs.',
//         activities: ['Workshops', 'Outreach Programs', 'Networking Events'],
//         focusAreas: ['Women Empowerment', 'Leadership', 'STEM Education'],
//         founded: '1997',
//         website: 'wie.ieee.org',
//         color: 'from-pink-500 to-purple-600',
       
//         acronym: 'WIE',
//       },
//       {
//         chapterName: 'Computer Society',
//         chapterChair: 'Kiran M',
//         relatedPositions: ['chair(for specific chapter)', 'vice chair(for specific chapter)'],
//         execoms: [execoms[0]._id, execoms[2]._id],
//         overview: 'Advancing computer science and technology to benefit humanity.',
//         activities: ['Hackathons', 'Seminars', 'Technical Talks'],
//         focusAreas: ['AI', 'Cloud Computing', 'Software Development'],
//         founded: '1946',
//         website: 'computer.org',
//         color: 'from-blue-500 to-blue-700',
        
//         acronym: 'CS',
//       },
//       {
//         chapterName: 'RAS',
//         chapterChair: 'Diya N',
//         relatedPositions: ['chair(for specific chapter)', 'vice chair(for specific chapter)'],
//         execoms: [execoms[1]._id, execoms[4]._id],
//         overview: 'Promoting robotics and automation through research and innovation.',
//         activities: ['Robot Wars', 'Arduino Bootcamps', 'Automation Challenges'],
//         focusAreas: ['Robotics', 'Automation', 'Mechatronics'],
//         founded: '1984',
//         website: 'ras.ieee.org',
//         color: 'from-red-500 to-red-700',
      
//         acronym: 'RAS',
//       },
//       {
//         chapterName: 'PES',
//         chapterChair: 'Anusha S',
//         relatedPositions: ['chair(for specific chapter)'],
//         execoms: [],
//         overview: 'Power and energy systems development for a sustainable future.',
//         activities: ['Energy Audits', 'Power System Simulations', 'Smart Grid Seminars'],
//         focusAreas: ['Power Systems', 'Renewables', 'Smart Grids'],
//         founded: '1884',
//         website: 'ieee-pes.org',
//         color: 'from-yellow-500 to-orange-600',
        
//         acronym: 'PES',
//       },
//       {
//         chapterName: 'SIGHT',
//         chapterChair: 'Rahul D',
//         relatedPositions: ['chair(for specific chapter)'],
//         execoms: [],
//         overview: 'Special Interest Group on Humanitarian Technology - solving real-world issues with tech.',
//         activities: ['Rural Tech Projects', 'Health Camps', 'Sustainability Hackathons'],
//         focusAreas: ['Humanitarian Tech', 'IoT for Development', 'Affordable Engineering'],
//         founded: '2008',
//         website: 'sight.ieee.org',
//         color: 'from-green-500 to-green-700',
        
//         acronym: 'SIGHT',
//       },
//     ]);

//     console.log('✅ Sample data inserted into MongoDB.');
//     process.exit(0);
//   } catch (err) {
//     console.error('❌ Error inserting data:', err);
//     process.exit(1);
//   }
// }

// seed();
// const mongoose = require('mongoose');
// const Execom = require('./models/execom'); // adjust path as needed
// const StudentBranch = require('./models/StudentBranch');
// const Chapter = require('./models/Chapter');

// const uri = 'mongodb://localhost:27017/ieee-db';

// const mainRoles = [
//   'chair(main)',
//   'vice chair(main)',
//   'secretary(main)',
//   'vice secretary(main)',
// ];

// const seedExecoms = [
//   { name: 'Michael Taylor', year: 2, branch: 'ME', usn: '1MS23ME001', chapters: ['RAS'], position: 'chair(for specific chapter)' },
//   { name: 'Sergio Cooper', year: 3, branch: 'ME', usn: '1MS22ME002', chapters: ['RAS'], position: 'vice secretary(main)' },
//   { name: 'Erika Green', year: 3, branch: 'ISE', usn: '1MS22CS003', chapters: ['RAS', 'PES'], position: 'vice chair(for specific chapter)' },
//   { name: 'Stephanie Adams', year: 2, branch: 'EEE', usn: '1MS24IS004', chapters: ['WIE', 'RAS'], position: 'chair(main)' },
//   { name: 'David Fuller', year: 3, branch: 'ME', usn: '1MS23IS005', chapters: ['SIGHT'], position: 'secretary(main)' },
//   { name: 'Mrs. Sara Henderson MD', year: 2, branch: 'EEE', usn: '1MS21EC006', chapters: ['CS'], position: 'secretary(main)' },
//   { name: 'Paul Clarke', year: 3, branch: 'CSE', usn: '1MS23IS007', chapters: ['SIGHT'], position: 'chair(main)' },
//   { name: 'Christopher Wilcox', year: 3, branch: 'ECE', usn: '1MS21ME008', chapters: ['PES', 'RAS'], position: 'vice chair(for specific chapter)' },
//   { name: 'Jennifer Holland', year: 4, branch: 'EEE', usn: '1MS24CS009', chapters: ['SIGHT'], position: 'vice chair(for specific chapter)' },
//   { name: 'Cassandra Tate', year: 4, branch: 'EEE', usn: '1MS24IS010', chapters: ['EDS', 'RAS'], position: 'chair(for specific chapter)' },
// ];

// const seedChapters = [
//   {
//     chapterName: 'PES',
//     chapterChair: 'Sergio Cooper',
//     relatedPositions: ['vice secretary(main)', 'vice chair(for specific chapter)'],
//     overview: 'Know something behavior doctor. Television include respond old few.',
//     activities: ['Right-sized dynamic product', 'Persistent fresh-thinking adapter'],
//     focusAreas: ['article', 'leg', 'quality'],
//     founded: '2014',
//     website: 'https://ieee-ritb/',
//     color: 'from-blue-600 to-blue-800',
//     acronym: 'PES',
//     execoms: [],
//   },
//   {
//     chapterName: 'RAS',
//     chapterChair: 'Michael Taylor',
//     relatedPositions: ['chair(for specific chapter)', 'vice secretary(main)'],
//     overview: 'Stage why build window action. Deep good task candidate.',
//     activities: ['Re-engineered content-based synergy', 'Configurable coherent application'],
//     focusAreas: ['believe', 'them', 'suddenly'],
//     founded: '2015',
//     website: 'https://ieee-ritb/',
//     color: 'from-blue-600 to-blue-800',
//     acronym: 'RAS',
//     execoms: [],
//   },
//   {
//     chapterName: 'WIE',
//     chapterChair: 'Cassandra Tate',
//     relatedPositions: ['chair(for specific chapter)', 'chair(for specific chapter)'],
//     overview: 'Really garden Republican foreign as someone bit.',
//     activities: ['Organized impactful utilization', 'Switchable multi-state conglomeration'],
//     focusAreas: ['police', 'visit', 'executive'],
//     founded: '2018',
//     website: 'https://ieee-ritb/',
//     color: 'from-blue-600 to-blue-800',
//     acronym: 'WIE',
//     execoms: [],
//   },
// ];

// async function seedDB() {
//   try {
//     await mongoose.connect(uri);
//     console.log('🌱 Connected to DB');

//     await Execom.deleteMany({});
//     await StudentBranch.deleteMany({});
//     await Chapter.deleteMany({});

//     const createdExecoms = await Execom.insertMany(seedExecoms);
//     console.log(`👥 Inserted ${createdExecoms.length} execoms`);

//     // Filter main role holders for student branch
//     const mainMembers = createdExecoms.filter(ex => mainRoles.includes(ex.position));
//     const studentBranch = await StudentBranch.create({
//       website: 'https://ieee-ritb',
//       email: 'ieee@msrit.edu',
//       foundedYear: 2001,
//       members: mainMembers.map(ex => ex._id),
//     });
//     console.log(`🏫 Student Branch created with ${mainMembers.length} main members`);

//     // Link execoms by name for chapter documents
//     for (const ch of seedChapters) {
//       ch.execoms = createdExecoms
//         .filter(ex => ch.relatedPositions.includes(ex.position))
//         .map(ex => ex._id);
//     }

//     await Chapter.insertMany(seedChapters);
//     console.log(`📚 Inserted ${seedChapters.length} chapters`);

//     console.log('✅ Seeding complete!');
//     process.exit(0);
//   } catch (err) {
//     console.error('❌ Error during seeding:', err);
//     process.exit(1);
//   }
// }

// seedDB();

const mongoose = require('mongoose');
const Execom = require('./models/Execom'); 
const StudentBranch = require('./models/StudentBranch');
const Chapter = require('./models/Chapter');

const uri = 'mongodb://localhost:27017/ieee-db';

const mainRoles = [
  'chair(main)',
  'vice chair(main)',
  'secretary(main)',
  'vice secretary(main)',
  'Execom',
];

const chapterRoles = [
  'chair(for specific chapter)',
  'vice chair(for specific chapter)',
  'secretary(for specific chapter)',
  'vice secretary(for specific chapter)',
];

// 10 fake execoms (some with main, some with chapter roles)
const seedExecoms = [
  { name: 'Michael Taylor', year: 2, branch: 'ME', usn: '1MS23ME001', chapters: ['RAS'], position: 'chair(for specific chapter)' },
  { name: 'Sergio Cooper', year: 3, branch: 'ME', usn: '1MS22ME002', chapters: ['RAS'], position: 'vice secretary(main)' },
  { name: 'Erika Green', year: 3, branch: 'ISE', usn: '1MS22CS003', chapters: ['RAS', 'PES'], position: 'vice chair(for specific chapter)' },
  { name: 'Stephanie Adams', year: 2, branch: 'EEE', usn: '1MS24IS004', chapters: ['WIE', 'RAS'], position: 'chair(main)' },
  { name: 'David Fuller', year: 3, branch: 'ME', usn: '1MS23IS005', chapters: ['SIGHT'], position: 'secretary(main)' },
  { name: 'Sara Henderson', year: 2, branch: 'EEE', usn: '1MS21EC006', chapters: ['CS'], position: 'secretary(main)' },
  { name: 'Paul Clarke', year: 3, branch: 'CSE', usn: '1MS23IS007', chapters: ['SIGHT'], position: 'chair(main)' },
  { name: 'Christopher Wilcox', year: 3, branch: 'ECE', usn: '1MS21ME008', chapters: ['PES', 'RAS'], position: 'vice chair(for specific chapter)' },
  { name: 'Jennifer Holland', year: 4, branch: 'EEE', usn: '1MS24CS009', chapters: ['SIGHT'], position: 'vice chair(for specific chapter)' },
  { name: 'Cassandra Tate', year: 4, branch: 'EEE', usn: '1MS24IS010', chapters: ['EDS', 'RAS'], position: 'chair(for specific chapter)' },
];

// Predefined chapters
const seedChapters = [
  {
    chapterName: 'PES',
    chapterChair: 'Erika Green',
    relatedPositions: ['vice chair(for specific chapter)', 'vice secretary(main)'], // will be cleaned
    overview: 'PES chapter overview at MSRIT.',
    activities: ['Hackathons', 'Seminars'],
    focusAreas: ['Power Systems', 'Green Energy'],
    founded: '2014',
    website: 'https://ieee-ritb/pes',
    color: 'from-blue-600 to-blue-800',
    acronym: 'PES',
    execoms: [],
  },
  {
    chapterName: 'RAS',
    chapterChair: 'Michael Taylor',
    relatedPositions: ['chair(for specific chapter)', 'vice secretary(main)'], // will be cleaned
    overview: 'RAS chapter overview at MSRIT.',
    activities: ['Robotics Workshop', 'Line Follower Challenge'],
    focusAreas: ['Robotics', 'AI'],
    founded: '2015',
    website: 'https://ieee-ritb/ras',
    color: 'from-blue-600 to-blue-800',
    acronym: 'RAS',
    execoms: [],
  },
  {
    chapterName: 'WIE',
    chapterChair: 'Cassandra Tate',
    relatedPositions: ['chair(for specific chapter)'], // valid
    overview: 'WIE chapter at MSRIT.',
    activities: ['Women in Tech Panel', 'STEM Outreach'],
    focusAreas: ['Women Empowerment', 'Leadership'],
    founded: '2018',
    website: 'https://ieee-ritb/wie',
    color: 'from-pink-600 to-pink-800',
    acronym: 'WIE',
    execoms: [],
  },
];

async function seedDB() {
  try {
    await mongoose.connect(uri);
    console.log('🌱 Connected to MongoDB');

    await Execom.deleteMany({});
    await StudentBranch.deleteMany({});
    await Chapter.deleteMany({});

    const createdExecoms = await Execom.insertMany(seedExecoms);
    console.log(`👥 Inserted ${createdExecoms.length} Execom members`);

    const mainMembers = createdExecoms.filter(ex => mainRoles.includes(ex.position));
    const studentBranch = await StudentBranch.create({
      website: 'https://ieee-ritb',
      email: 'ieee@msrit.edu',
      foundedYear: 2001,
      members: mainMembers.map(ex => ex._id),
    });
    console.log(`🏫 Student Branch created with ${mainMembers.length} main members`);

    for (const ch of seedChapters) {
      // clean invalid roles
      ch.relatedPositions = ch.relatedPositions.filter(role => chapterRoles.includes(role));
      // link execoms by position
      ch.execoms = createdExecoms
        .filter(ex => ex.chapters.includes(ch.chapterName))
        .filter(ex => chapterRoles.includes(ex.position))
        .map(ex => ex._id);
    }

    await Chapter.insertMany(seedChapters);
    console.log(`📚 Inserted ${seedChapters.length} chapters with chapter-level execoms`);

    console.log('✅ Seed completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedDB();
