// Data-driven content for feature detail pages
export const featureDetails = {
  'ai-driven': {
    title: 'AI-driven',
    hero: {
      heading: 'AI-driven Agriculture',
      subheading: 'Harnessing Machine Learning for Smarter Farming',
      icon: 'SmartToy',
    },
    explanation: [
      'Our system leverages advanced Machine Learning algorithms to analyze soil, weather, and crop data for optimal recommendations.',
      'Deep Learning (CNNs) powers our disease detection, identifying plant issues from images with high accuracy.',
      'We use models like Random Forest, XGBoost, and Convolutional Neural Networks (CNN) for different prediction tasks.',
      'Predictions are made using real-time and historical data, ensuring actionable insights for farmers.',
      'Government and real-time APIs (weather, market, soil) are integrated to support AI-driven decisions.'
    ],
    process: [
      'Data Collection',
      'Preprocessing',
      'Model Inference',
      'Result Delivery',
    ],
    example: {
      title: 'Real-world Example',
      description: 'A farmer uploads a leaf photo, and our AI instantly detects early blight, suggesting treatment and prevention steps.'
    },
    icon: 'SmartToy',
  },
  'data-backed': {
    title: 'Data-backed',
    hero: {
      heading: 'Data-backed Insights',
      subheading: 'Decisions Powered by Real Data',
      icon: 'BarChart',
    },
    explanation: [
      'We aggregate data from government sources, IoT sensors, and market feeds.',
      'All recommendations are supported by transparent, up-to-date datasets.'
    ],
    process: [
      'Data Aggregation',
      'Validation',
      'Insight Generation',
    ],
    example: {
      title: 'Real-world Example',
      description: 'A user receives a crop price forecast based on live market and historical trends.'
    },
    icon: 'BarChart',
  },
  'govt-data-integration': {
    title: 'Govt. Data Integration',
    hero: {
      heading: 'Government Data Integration',
      subheading: 'Trusted Sources for Reliable Decisions',
      icon: 'Gavel',
    },
    explanation: [
      'We integrate with government APIs for weather, soil, and crop data.',
      'This ensures recommendations are always based on the latest, most reliable information.'
    ],
    process: [
      'API Integration',
      'Data Validation',
      'Recommendation Update',
    ],
    example: {
      title: 'Real-world Example',
      description: 'A farmer receives a pest alert based on government-issued warnings for their region.'
    },
    icon: 'Gavel',
  },
  'farmer-friendly': {
    title: 'Farmer-friendly',
    hero: {
      heading: 'Farmer-friendly Design',
      subheading: 'Simple, Intuitive, Accessible',
      icon: 'EmojiPeople',
    },
    explanation: [
      'Our UI is designed for ease of use, even for first-time smartphone users.',
      'We support multiple languages and voice guidance.'
    ],
    process: [
      'User Research',
      'Accessibility Design',
      'Continuous Feedback',
    ],
    example: {
      title: 'Real-world Example',
      description: 'A farmer navigates the app in their local language and receives voice instructions for crop care.'
    },
    icon: 'EmojiPeople',
  },
};
