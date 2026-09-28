const eventService = require('../services/event.service');
const { VALID_TRACKS } = require('../services/registration.service');
const { sendSuccess } = require('../utils/response');

const TRACK_DETAILS = [
  {
    id: 'AI/ML',
    name: 'Artificial Intelligence & Machine Learning',
    shortName: 'AI/ML',
    description:
      'Machine learning, deep learning architectures, generative AI, NLP, computer vision, robotics perception, and trustworthy/responsible AI systems.',
    topics: ['Deep Learning', 'Computer Vision', 'NLP & LLMs', 'Generative AI', 'Responsible AI'],
  },
  {
    id: 'Data Science',
    name: 'Data Science & Analytics',
    shortName: 'Data Science',
    description:
      'Big data processing, predictive analytics, statistical modeling, data visualization, business intelligence, data governance, and privacy-preserving data mining.',
    topics: ['Predictive Modeling', 'Big Data Engineering', 'Visual Analytics', 'Data Privacy', 'Business Intelligence'],
  },
  {
    id: 'Emerging Tech',
    name: 'Emerging Technologies',
    shortName: 'Emerging Tech',
    description:
      'Internet of Things (IoT), cloud & edge computing architectures, blockchain & Web3, cybersecurity, AR/VR immersive systems, and industrial robotics.',
    topics: ['IoT & Embedded Systems', 'Cloud & Edge Computing', 'Cybersecurity', 'Blockchain', 'AR / VR'],
  },
  {
    id: 'Sustainable Tech',
    name: 'Sustainable & Green Technologies',
    shortName: 'Sustainable Tech',
    description:
      'Green computing, renewable energy integration, smart cities, circular economy, waste management innovations, and climate-adaptive technological solutions.',
    topics: ['Green Computing', 'Renewable Energy Systems', 'Smart Cities', 'Climate Tech', 'Circular Economy'],
  },
  {
    id: 'Interdisciplinary Innovation',
    name: 'Interdisciplinary Innovation',
    shortName: 'Interdisciplinary Innovation',
    description:
      'Technology intersections with healthcare & biomedical engineering, educational technology, precision agriculture, human-computer interaction, and tech-driven social innovation.',
    topics: ['Digital Healthcare', 'EdTech', 'AgriTech', 'Human-Computer Interaction', 'Social Impact Tech'],
  },
];

exports.getConfig = async (req, res, next) => {
  try {
    const config = await eventService.getEventConfig();
    return sendSuccess(res, { config });
  } catch (err) {
    next(err);
  }
};

exports.getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await eventService.getAnnouncements();
    return sendSuccess(res, { announcements });
  } catch (err) {
    next(err);
  }
};

exports.getTracks = async (req, res, next) => {
  try {
    return sendSuccess(res, {
      tracks: TRACK_DETAILS,
      validTrackNames: VALID_TRACKS,
    });
  } catch (err) {
    next(err);
  }
};
