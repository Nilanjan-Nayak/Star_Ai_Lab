// ============================================================================
// Type Definitions & Enums
// ============================================================================

/**
 * Represents available accent colors for UI elements
 */
export enum AccentColor {
  PURPLE = 'accent-purple',
  BLUE = 'accent-blue',
  GREEN = 'accent-green',
  ORANGE = 'accent-orange',
  PINK = 'accent-pink',
  GREY = 'accent-grey',
}

/**
 * Supported icon types from lucide-react or similar icon library
 */
export type IconType =
  | 'Brain'
  | 'Mic'
  | 'Globe'
  | 'TrendingUp'
  | 'Users'
  | 'BarChart3'
  | 'Image'
  | 'Calendar'
  | 'TestTube';

/**
 * Message sender types for chatbot interface
 */
export enum MessageSender {
  BOT = 'bot',
  USER = 'user',
}

// ============================================================================
// Feature Types
// ============================================================================

/**
 * Represents a product feature with capabilities
 */
export interface Feature {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly icon: IconType;
  readonly color: AccentColor;
  readonly capabilities: readonly string[];
}

/**
 * Factory function to create a Feature with type safety
 */
export const createFeature = (data: Omit<Feature, 'id'> & { id: number }): Feature => ({
  ...data,
  capabilities: Object.freeze([...data.capabilities]),
} as const);

// ============================================================================
// Pricing Types
// ============================================================================

/**
 * Pricing period types
 */
export type BillingPeriod = 'forever' | 'month' | 'year' | 'contact us';

/**
 * Represents a subscription pricing plan
 */
export interface PricingPlan {
  readonly id: number;
  readonly name: string;
  readonly price: string;
  readonly period: BillingPeriod;
  readonly description: string;
  readonly features: readonly string[];
  readonly limitations?: readonly string[];
  readonly buttonText: string;
  readonly popular: boolean;
  readonly color: AccentColor;
  readonly badge?: string;
}

/**
 * Factory function to create a PricingPlan with defaults
 */
export const createPricingPlan = (
  data: Omit<PricingPlan, 'popular' | 'badge'> & Partial<Pick<PricingPlan, 'popular' | 'badge'>>
): PricingPlan => ({
  popular: false,
  ...data,
  features: Object.freeze([...data.features]),
  limitations: data.limitations ? Object.freeze([...data.limitations]) : undefined,
});

// ============================================================================
// Competitor Comparison Types
// ============================================================================

/**
 * Comparison metric categories
 */
export const COMPARISON_METRICS = [
  'Content Quality',
  'AI Models',
  'Templates',
  'Collaboration',
  'Pricing',
  'Support',
] as const;

export type ComparisonMetric = typeof COMPARISON_METRICS[number];

/**
 * Score range validation (0-100)
 */
export type Score = number & { readonly __brand: 'Score' };

/**
 * Type guard for score validation
 */
export const isValidScore = (value: number): value is Score =>
  value >= 0 && value <= 100;

/**
 * Represents a competitor in comparison table
 */
export interface Competitor {
  readonly name: string;
  readonly logo: string;
  readonly scores: Record<ComparisonMetric, Score>;
  readonly highlights: readonly string[];
  readonly isOurs?: boolean;
}

// ============================================================================
// Testimonial Types
// ============================================================================

/**
 * Star rating type (1-5)
 */
export type Rating = 1 | 2 | 3 | 4 | 5;

/**
 * Customer testimonial with metrics
 */
export interface Testimonial {
  readonly id: number;
  readonly name: string;
  readonly role: string;
  readonly company: string;
  readonly avatar: string;
  readonly content: string;
  readonly rating: Rating;
  readonly metrics: string;
  readonly verifiedPurchase?: boolean;
}

// ============================================================================
// Chatbot Types
// ============================================================================

/**
 * Individual chat message
 */
export interface ChatbotMessage {
  readonly id: number;
  readonly text: string;
  readonly sender: MessageSender;
  readonly timestamp: Date;
  readonly metadata?: Record<string, unknown>;
}

// ============================================================================
// Demo Content Types
// ============================================================================

/**
 * Content generation metrics
 */
export interface ContentMetrics {
  readonly wordsGenerated: number;
  readonly timeToGenerate: number;
  readonly seoScore: Score;
  readonly readabilityScore: Score;
}

/**
 * Demo content showcase
 */
export interface DemoContent {
  readonly inputPrompt: string;
  readonly outputContent: string;
  readonly metrics: ContentMetrics;
  readonly modelUsed?: string;
  readonly generatedAt?: Date;
}

// ============================================================================
// Mock Data - Features
// ============================================================================

export const MOCK_FEATURES: readonly Feature[] = Object.freeze([
  createFeature({
    id: 1,
    title: 'Advanced Content Generation',
    description:
      'Generate blogs, emails, social posts, and marketing copy with AI models including GPT-4 Turbo, Claude-3, and Gemini Pro.',
    icon: 'Brain',
    color: AccentColor.PURPLE,
    capabilities: [
      'Blog Posts',
      'Email Campaigns',
      'Social Media',
      'Marketing Copy',
      'Product Descriptions',
    ],
  }),
  createFeature({
    id: 2,
    title: 'Brand Voice Training',
    description:
      'Train AI on your brand guidelines, tone of voice, and writing style for consistent content across all platforms.',
    icon: 'Mic',
    color: AccentColor.BLUE,
    capabilities: [
      'Voice Analysis',
      'Style Guidelines',
      'Tone Consistency',
      'Brand Training',
      'Custom Templates',
    ],
  }),
  createFeature({
    id: 3,
    title: 'Multi-Language Support',
    description:
      'Create content in 50+ languages with native-level fluency and cultural context awareness.',
    icon: 'Globe',
    color: AccentColor.GREEN,
    capabilities: [
      '50+ Languages',
      'Cultural Context',
      'Local SEO',
      'Translation',
      'Localization',
    ],
  }),
  createFeature({
    id: 4,
    title: 'SEO Optimization',
    description:
      'Built-in SEO analyzer that optimizes content for search engines while maintaining readability and engagement.',
    icon: 'TrendingUp',
    color: AccentColor.ORANGE,
    capabilities: [
      'Keyword Research',
      'Meta Tags',
      'Content Structure',
      'SERP Analysis',
      'Competitor Insights',
    ],
  }),
  createFeature({
    id: 5,
    title: 'Real-time Collaboration',
    description:
      'Collaborate with team members in real-time with advanced editing, comments, and approval workflows.',
    icon: 'Users',
    color: AccentColor.PINK,
    capabilities: [
      'Live Editing',
      'Team Comments',
      'Approval Flows',
      'Version Control',
      'Role Management',
    ],
  }),
  createFeature({
    id: 6,
    title: 'Analytics & Insights',
    description:
      'Track content performance, engagement metrics, and AI-generated insights to improve your content strategy.',
    icon: 'BarChart3',
    color: AccentColor.GREY,
    capabilities: [
      'Performance Tracking',
      'Engagement Metrics',
      'A/B Testing',
      'Content Analytics',
      'ROI Insights',
    ],
  }),
  createFeature({
    id: 7,
    title: 'AI-Powered Image Generation',
    description:
      'Generate stunning visuals, graphics, and illustrations that perfectly complement your written content using advanced AI image models.',
    icon: 'Image',
    color: AccentColor.PINK,
    capabilities: [
      'Custom Illustrations',
      'Social Media Graphics',
      'Blog Images',
      'Infographics',
      'Brand Assets',
    ],
  }),
  createFeature({
    id: 8,
    title: 'Content Scheduling & Publishing',
    description:
      'Schedule and automatically publish content across multiple platforms with optimal timing and engagement analytics.',
    icon: 'Calendar',
    color: AccentColor.ORANGE,
    capabilities: [
      'Auto-Scheduling',
      'Multi-Platform Publishing',
      'Engagement Optimization',
      'Content Calendar',
      'Performance Analytics',
    ],
  }),
  createFeature({
    id: 9,
    title: 'Advanced A/B Testing',
    description:
      'Test different versions of your content with AI-powered A/B testing to optimize engagement and conversion rates.',
    icon: 'TestTube',
    color: AccentColor.GREEN,
    capabilities: [
      'Content Variations',
      'Performance Testing',
      'Conversion Optimization',
      'Audience Insights',
      'Automated Reporting',
    ],
  }),
]);

// ============================================================================
// Mock Data - Pricing Plans
// ============================================================================

export const MOCK_PRICING_PLANS: readonly PricingPlan[] = Object.freeze([
  createPricingPlan({
    id: 1,
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for individual creators and small projects',
    features: [
      '5,000 words/month',
      '3 AI models access',
      'Basic templates',
      'Email support',
      'Standard quality',
    ],
    limitations: [
      'Limited advanced features',
      'No brand training',
      'Standard priority',
    ],
    buttonText: 'Start Free',
    color: AccentColor.GREY,
  }),
  createPricingPlan({
    id: 2,
    name: 'Professional',
    price: '$29',
    period: 'month',
    description: 'Ideal for content creators and small businesses',
    features: [
      '100,000 words/month',
      'All AI models',
      'Advanced templates',
      'Brand voice training',
      'Priority support',
      'SEO optimization',
      'Analytics dashboard',
    ],
    buttonText: 'Start 14-day trial',
    popular: true,
    color: AccentColor.BLUE,
    badge: 'Most Popular',
  }),
  createPricingPlan({
    id: 3,
    name: 'Business',
    price: '$89',
    period: 'month',
    description: 'Perfect for growing teams and agencies',
    features: [
      '500,000 words/month',
      'Team collaboration',
      'Custom AI models',
      'White-label options',
      'API access',
      'Advanced analytics',
      'Priority phone support',
      'Custom integrations',
    ],
    buttonText: 'Contact Sales',
    color: AccentColor.PURPLE,
  }),
  createPricingPlan({
    id: 4,
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'Tailored solutions for large organizations',
    features: [
      'Unlimited words',
      'Custom AI training',
      'Dedicated account manager',
      'On-premise deployment',
      'Advanced security',
      'SLA guarantee',
      'Custom workflows',
      '24/7 phone support',
    ],
    buttonText: 'Contact Sales',
    color: AccentColor.ORANGE,
  }),
]);

// ============================================================================
// Mock Data - Competitors
// ============================================================================

const createCompetitorScores = (scores: Record<string, number>): Record<ComparisonMetric, Score> => {
  const validatedScores: Partial<Record<ComparisonMetric, Score>> = {};
  
  COMPARISON_METRICS.forEach((metric) => {
    const score = scores[metric];
    if (score !== undefined && isValidScore(score)) {
      validatedScores[metric] = score as Score;
    }
  });
  
  return validatedScores as Record<ComparisonMetric, Score>;
};

export const MOCK_COMPETITORS: readonly Competitor[] = Object.freeze([
  {
    name: 'WriteGenius',
    logo: '✨',
    scores: createCompetitorScores({
      'Content Quality': 95,
      'AI Models': 98,
      'Templates': 92,
      'Collaboration': 94,
      'Pricing': 88,
      'Support': 96,
    }),
    highlights: Object.freeze([
      'Latest AI Models',
      'Brand Voice Training',
      'Real-time Collaboration',
    ]),
    isOurs: true,
  },
  {
    name: 'Jasper',
    logo: '🎯',
    scores: createCompetitorScores({
      'Content Quality': 87,
      'AI Models': 82,
      'Templates': 88,
      'Collaboration': 75,
      'Pricing': 70,
      'Support': 80,
    }),
    highlights: Object.freeze([
      'Good Templates',
      'Established Brand',
      'Marketing Focus',
    ]),
  },
  {
    name: 'Copy.ai',
    logo: '🤖',
    scores: createCompetitorScores({
      'Content Quality': 81,
      'AI Models': 79,
      'Templates': 85,
      'Collaboration': 70,
      'Pricing': 82,
      'Support': 75,
    }),
    highlights: Object.freeze([
      'Affordable Pricing',
      'Easy Interface',
      'Good for Beginners',
    ]),
  },
  {
    name: 'Writesonic',
    logo: '⚡',
    scores: createCompetitorScores({
      'Content Quality': 83,
      'AI Models': 80,
      'Templates': 86,
      'Collaboration': 68,
      'Pricing': 85,
      'Support': 78,
    }),
    highlights: Object.freeze([
      'Fast Generation',
      'Multiple Languages',
      'SEO Tools',
    ]),
  },
]);

// ============================================================================
// Mock Data - Testimonials
// ============================================================================

export const MOCK_TESTIMONIALS: readonly Testimonial[] = Object.freeze([
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Content Marketing Manager',
    company: 'TechFlow Inc',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    content:
      "WriteGenius transformed our content strategy. We're producing 3x more high-quality content in half the time. The brand voice training is phenomenal.",
    rating: 5,
    metrics: '300% increase in content output',
    verifiedPurchase: true,
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    role: 'Founder & CEO',
    company: 'GrowthLabs',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    content:
      'The AI models are incredibly advanced. Our conversion rates improved by 40% after switching to WriteGenius for all our marketing copy.',
    rating: 5,
    metrics: '40% conversion rate increase',
    verifiedPurchase: true,
  },
  {
    id: 3,
    name: 'Emily Watson',
    role: 'Digital Marketing Director',
    company: 'Innovate Co',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    content:
      'Best investment we made this year. The collaboration features and real-time editing have streamlined our entire content workflow.',
    rating: 5,
    metrics: '60% faster content approval',
    verifiedPurchase: true,
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Head of Marketing',
    company: 'ScaleUp Solutions',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    content:
      "WriteGenius understands our brand voice perfectly. It's like having a senior copywriter who never sleeps and works at lightning speed.",
    rating: 5,
    metrics: '85% time savings on content creation',
    verifiedPurchase: true,
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    role: 'Social Media Manager',
    company: 'Creative Agency Pro',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    content:
      'The multi-language support is incredible. We expanded to 15 new markets in just 3 months, and the content quality is consistent across all languages.',
    rating: 5,
    metrics: '15 new markets entered',
    verifiedPurchase: true,
  },
  {
    id: 6,
    name: 'Alex Chen',
    role: 'E-commerce Director',
    company: 'ShopSmart',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    content:
      'Product descriptions that actually convert! Our sales increased by 65% after implementing WriteGenius for all our product listings.',
    rating: 5,
    metrics: '65% sales increase',
    verifiedPurchase: true,
  },
  {
    id: 7,
    name: 'Rachel Green',
    role: 'Content Strategist',
    company: 'Digital First Media',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    content:
      'The SEO optimization feature is a game-changer. Our organic traffic doubled in 6 months, and we consistently rank for competitive keywords.',
    rating: 5,
    metrics: '200% organic traffic growth',
    verifiedPurchase: true,
  },
]);

// ============================================================================
// Mock Data - Chatbot
// ============================================================================

export const MOCK_CHATBOT_INITIAL_MESSAGES: readonly ChatbotMessage[] = Object.freeze([
  {
    id: 1,
    text: "Hi! I'm your AI writing assistant. How can I help you create amazing content today?",
    sender: MessageSender.BOT,
    timestamp: new Date(),
  },
]);

// ============================================================================
// Mock Data - Demo Content
// ============================================================================

export const MOCK_DEMO_CONTENTS: readonly DemoContent[] = Object.freeze([
  {
    inputPrompt:
      'Write a professional email to introduce our new AI writing assistant to potential customers',
    outputContent: `Subject: Introducing WriteGenius - Your New AI Writing Partner

Dear [Customer Name],

I hope this email finds you well. I'm excited to share something revolutionary that will transform how you create content.

Meet WriteGenius, our advanced AI writing assistant that's helping thousands of businesses generate high-quality content 10x faster. Here's what makes it special:

✨ **Multiple AI Models**: Access to GPT-4 Turbo, Claude-3, and Gemini Pro
🎯 **Brand Voice Training**: AI learns your unique style and tone
🚀 **Lightning Fast**: Generate content in seconds, not hours
📊 **Built-in SEO**: Optimized for search engines automatically

Whether you need blog posts, marketing emails, social media content, or product descriptions, WriteGenius delivers professional results every time.

**Special Offer**: Start your free 14-day trial today and experience the future of content creation.

Best regards,
[Your Name]

P.S. Join over 50,000+ content creators who've already made the switch to AI-powered writing.`,
    metrics: Object.freeze({
      wordsGenerated: 156,
      timeToGenerate: 2.3,
      seoScore: 92 as Score,
      readabilityScore: 88 as Score,
    }),
    modelUsed: 'GPT-4 Turbo',
    generatedAt: new Date(),
  },
  {
    inputPrompt:
      'Write a compelling blog post about the future of AI in content creation',
    outputContent: `# The Future of AI in Content Creation: Revolutionizing How We Write

In an era where digital content reigns supreme, artificial intelligence is not just a buzzword—it's becoming the cornerstone of modern content creation. As businesses grapple with the ever-increasing demand for high-quality, engaging content, AI-powered writing tools are emerging as game-changers.

## The Current State of AI Writing

AI writing assistants have evolved from simple grammar checkers to sophisticated content generation platforms. Today's advanced models can understand context, maintain brand voice, and even adapt to different writing styles. But this is just the beginning.

## What's Next for AI Content Creation?

### 1. Hyper-Personalization
Future AI systems will analyze user behavior, preferences, and engagement patterns to create content that's not just relevant, but deeply personalized. Imagine blog posts that adapt their tone and examples based on your audience's demographics and interests.

### 2. Multi-Modal Content Generation
The next generation of AI will seamlessly combine text, images, videos, and audio. A single prompt could generate a complete social media campaign with accompanying visuals and voiceovers.

### 3. Real-Time Collaboration
AI will become an active participant in the creative process, suggesting improvements, generating multiple variations, and even mediating between team members with different creative visions.

### 4. Ethical AI Content
As AI becomes more prevalent, we'll see increased focus on ethical content creation—ensuring diversity, avoiding bias, and maintaining authenticity in AI-generated materials.

## The Human-AI Partnership

The future isn't about AI replacing human writers—it's about AI augmenting human creativity. The most successful content strategies will combine human insight and emotional intelligence with AI's speed and scalability.

Are you ready to embrace the future of content creation? The revolution is here, and it's powered by AI.`,
    metrics: Object.freeze({
      wordsGenerated: 387,
      timeToGenerate: 4.1,
      seoScore: 95 as Score,
      readabilityScore: 82 as Score,
    }),
    modelUsed: 'Claude-3',
    generatedAt: new Date(),
  },
  {
    inputPrompt:
      'Create an engaging social media post about our new AI image generation feature',
    outputContent: `🚀 Just dropped: AI-Powered Image Generation! 

Tired of spending hours searching for the perfect stock photo or hiring expensive designers? Our new AI image generation feature creates stunning, custom visuals in seconds! 

✨ What you get:
• Custom illustrations for your blog posts
• Eye-catching social media graphics  
• Professional product mockups
• Brand-consistent visual assets

Just describe what you need in plain English, and watch the magic happen! From "a futuristic office with diverse team members collaborating" to "an abstract representation of AI innovation," we've got you covered.

The future of content creation is visual AND textual. Try it now! 🎨✨

#AI #ContentCreation #Design #Marketing #Innovation`,
    metrics: Object.freeze({
      wordsGenerated: 142,
      timeToGenerate: 1.8,
      seoScore: 78 as Score,
      readabilityScore: 91 as Score,
    }),
    modelUsed: 'Gemini Pro',
    generatedAt: new Date(),
  },
  {
    inputPrompt:
      'Write a product description for a premium wireless headset',
    outputContent: `Premium Wireless Headset - Crystal Clear Audio Excellence

Experience audio perfection with our flagship wireless headset, engineered for professionals who demand the highest quality sound. Whether you're in back-to-back video calls, editing audio tracks, or simply enjoying your favorite music, these headphones deliver studio-grade performance in a sleek, comfortable design.

**Key Features:**
• **Active Noise Cancellation**: Block out distractions with advanced ANC technology that adapts to your environment
• **40mm Drivers**: Custom-designed drivers deliver rich, detailed sound across the entire frequency range
• **30-Hour Battery Life**: All-day power with quick charge technology (5 minutes = 3 hours of playback)
• **Premium Comfort**: Memory foam ear cushions and adjustable headband for extended wear
• **Multi-Device Connectivity**: Seamlessly switch between laptop, tablet, and phone
• **Built-in Microphone**: Crystal-clear voice capture with noise reduction for professional calls

**What's in the Box:**
• Premium Wireless Headset
• USB-C charging cable
• 3.5mm audio adapter
• Carrying case
• Quick start guide

Elevate your audio experience with technology that matches your professional standards. Available in Black, Silver, and Midnight Blue.`,
    metrics: Object.freeze({
      wordsGenerated: 198,
      timeToGenerate: 2.7,
      seoScore: 89 as Score,
      readabilityScore: 85 as Score,
    }),
    modelUsed: 'GPT-4 Turbo',
    generatedAt: new Date(),
  },
]);

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get feature by ID with type safety
 */
export const getFeatureById = (id: number): Feature | undefined =>
  MOCK_FEATURES.find((feature) => feature.id === id);

/**
 * Get pricing plan by ID with type safety
 */
export const getPricingPlanById = (id: number): PricingPlan | undefined =>
  MOCK_PRICING_PLANS.find((plan) => plan.id === id);

/**
 * Get popular pricing plan
 */
export const getPopularPricingPlan = (): PricingPlan | undefined =>
  MOCK_PRICING_PLANS.find((plan) => plan.popular);

/**
 * Get competitor by name
 */
export const getCompetitorByName = (name: string): Competitor | undefined =>
  MOCK_COMPETITORS.find((competitor) => competitor.name === name);

/**
 * Get our product from competitors list
 */
export const getOurProduct = (): Competitor | undefined =>
  MOCK_COMPETITORS.find((competitor) => competitor.isOurs);

/**
 * Calculate average competitor score for a metric
 */
export const getAverageScore = (metric: ComparisonMetric): number => {
  const scores = MOCK_COMPETITORS.map((c) => c.scores[metric]);
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

/**
 * Get testimonials by minimum rating
 */
export const getTestimonialsByRating = (minRating: Rating): readonly Testimonial[] =>
  MOCK_TESTIMONIALS.filter((testimonial) => testimonial.rating >= minRating);


