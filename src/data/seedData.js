import { generateId } from '../utils/generateId';

export const initializeSeedData = () => {
  const usersExist = localStorage.getItem('inkwell_users');
  const postsExist = localStorage.getItem('inkwell_posts');

  if (!usersExist || !postsExist) {
    const users = [
      {
        id: generateId(),
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        bio: 'Tech enthusiast and software engineer exploring the nuances of modern web development.',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alice%20Johnson',
        joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'password123',
        bio: 'Avid traveler and amateur photographer sharing stories from around the globe.',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Bob%20Smith',
        joinDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        name: 'Dr. Clara Hue',
        email: 'clara@example.com',
        password: 'password123',
        bio: 'Neuroscientist passionate about mental health, psychology, and cognitive science.',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Clara%20Hue',
        joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];

    const posts = [
      {
        id: generateId(),
        title: 'The Future of Functional React',
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
        excerpt: 'Exploring the new paradigms in React 18, concurrent features, and how functional programming principles are taking over UI development.',
        content: '<p>React has come a long way since class components. With the introduction of Hooks, we saw a massive shift towards functional programming in the React ecosystem. Now, with React 18 and server components, that shift is accelerating.</p><h2>The Shift to Concurrency</h2><p>Concurrent rendering is a fundamental change to Reacts core rendering model...</p>',
        tags: ['technology', 'react', 'frontend'],
        authorId: users[0].id,
        authorName: users[0].name,
        authorAvatar: users[0].avatar,
        status: 'published',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        likes: [users[1].id, users[2].id],
        comments: [
          { id: generateId(), authorId: users[1].id, authorName: users[1].name, authorAvatar: users[1].avatar, content: 'Great insights on React 18!', date: new Date().toISOString() }
        ]
      },
      {
        id: generateId(),
        title: 'Finding Peace in a Commotion',
        coverImage: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&q=80',
        excerpt: 'How to practice mindfulness in the modern age, avoiding burnout, and protecting your mental health.',
        content: '<p>In an era defined by endless notifications and perpetual connectivity, finding moments of genuine quiet can feel like a radical act.</p><h2>The Cost of Connectivity</h2><p>Our brains were never evolved to handle the sheer volume of information we process daily...</p>',
        tags: ['mental health', 'psychology'],
        authorId: users[2].id,
        authorName: users[2].name,
        authorAvatar: users[2].avatar,
        status: 'published',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        likes: [users[0].id],
        comments: []
      },
      {
        id: generateId(),
        title: 'Backpacking Through PATAGONIA',
        coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
        excerpt: 'A 14-day itinerary across the breathtaking landscapes of Patagonia. Tips on gear, weather, and the best trails.',
        content: '<p>Patagonia is not a place you simply visit; it’s an environment you survive and eventually venerate. The winds howl with a ferocity that demands respect, and the mountains pierce the sky with terrifying beauty.</p><h2>Preparing for the elements</h2><p>Don’t underestimate the changing weather. Layers are your best friend here.</p>',
        tags: ['travel', 'adventure', 'nature'],
        authorId: users[1].id,
        authorName: users[1].name,
        authorAvatar: users[1].avatar,
        status: 'published',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        likes: [users[0].id, users[1].id, users[2].id],
        comments: []
      },
      {
        id: generateId(),
        title: 'Demystifying Black Holes',
        coverImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
        excerpt: 'What happens when gravity becomes so severe that not even light can escape? A deep dive into the physics of black holes.',
        content: '<p>Black holes remain one of the most fascinating objects in the universe. Born from the death of massive stars, their gravitational pull warps spacetime itself.</p><h2>The Event Horizon</h2><p>This is the point of no return. Once you cross this boundary, escaping is physically impossible according to our current understanding of physics.</p>',
        tags: ['science', 'space', 'physics'],
        authorId: users[2].id,
        authorName: users[2].name,
        authorAvatar: users[2].avatar,
        status: 'published',
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        likes: [users[1].id],
        comments: []
      },
      {
        id: generateId(),
        title: 'Review: Dune by Frank Herbert',
        coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80',
        excerpt: 'A retrospective look at the sci-fi masterpiece that shaped the genre and created an unforgettable universe.',
        content: '<p>Frank Herberts <em>Dune</em> is more than just a sci-fi novel; it’s an ecological and political treatise disguised as an interstellar epic. Arrakis is not simply a setting, it is a character with its own motivations.</p><h2>Themes that resonate today</h2><p>The lessons on resource scarcity and political maneuvering are surprisingly relevant in the 21st century.</p>',
        tags: ['book reviews', 'sci-fi', 'literature'],
        authorId: users[0].id,
        authorName: users[0].name,
        authorAvatar: users[0].avatar,
        status: 'published',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        likes: [users[2].id],
        comments: []
      },
      {
        id: generateId(),
        title: 'The Art of Writing Clean Code',
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
        excerpt: 'Readability matters. Learn techniques for writing code that humans can read and computers can execute.',
        content: '<p>We spend more time reading code than writing it. Therefore, optimizing for readability is not a luxury, it is a necessity for long-term project survival.</p><h2>Naming Conventions</h2><p>Choose descriptive, unambiguous names. A function should do exactly what its name suggests.</p>',
        tags: ['technology', 'programming', 'software engineering'],
        authorId: users[0].id,
        authorName: users[0].name,
        authorAvatar: users[0].avatar,
        status: 'published',
        date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        likes: [users[1].id, users[2].id],
        comments: []
      },
      {
        id: generateId(),
        title: 'A Guide to Street Photography',
        coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
        excerpt: 'Capturing the raw, unfiltered essence of city life. Equipment, legality, and finding the decisive moment.',
        content: '<p>Street photography is about documenting the human condition in public spaces. It requires patience, anticipation, and an eye for the extraordinary in the mundane.</p><h2>Gear Doesn’t Matter</h2><p>The best camera is the one you have with you. Focus on composition and lighting, not megapixels.</p>',
        tags: ['art', 'photography', 'travel'],
        authorId: users[1].id,
        authorName: users[1].name,
        authorAvatar: users[1].avatar,
        status: 'published',
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        likes: [users[0].id],
        comments: []
      },
      {
        id: generateId(),
        title: 'Understanding Cognitive Behavioral Therapy',
        coverImage: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80',
        excerpt: 'An overview of CBT techniques and how they can be used to reframe negative thought patterns.',
        content: '<p>Cognitive Behavioral Therapy (CBT) revolves around the idea that our thoughts, feelings, and behaviors are interconnected. By changing negative thought patterns, we can alter our emotional state.</p><h2>Identifying Cognitive Distortions</h2><p>Recognizing patterns like black-and-white thinking or catastrophizing is the first step toward change.</p>',
        tags: ['mental health', 'psychology', 'therapy'],
        authorId: users[2].id,
        authorName: users[2].name,
        authorAvatar: users[2].avatar,
        status: 'published',
        date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
        likes: [users[0].id, users[1].id],
        comments: []
      },
      {
        id: generateId(),
        title: 'The Golden Age of Podcasts',
        coverImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80',
        excerpt: 'Why audio storytelling is experiencing a renaissance and a list of 5 must-listen narrative podcasts.',
        content: '<p>The intimacy of audio storytelling has catapulted podcasts into mainstream cultural relevance. It’s a medium where nuance and long-form discussion thrive.</p><h2>Top Recommendations</h2><p>From investigative journalism to serialized fiction, the quality of production has never been higher.</p>',
        tags: ['media', 'entertainment', 'technology'],
        authorId: users[0].id,
        authorName: users[0].name,
        authorAvatar: users[0].avatar,
        status: 'published',
        date: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
        likes: [],
        comments: []
      },
      {
        id: generateId(),
        title: 'Hidden Gems of Tokyo',
        coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80',
        excerpt: 'Venture beyond Shibuya and Shinjuku to discover the quiet, atmospheric neighborhoods of Japans capital.',
        content: '<p>Tokyo is often characterized by neon lights and bustling crowds, but its true charm lies in the quiet winding alleyways of Shimokitazawa and Yanaka.</p><h2>Yanaka Ginza: A Step Back in Time</h2><p>This old-fashioned shopping district offers a glimpse into Tokyo’s post-war era, famed for its street food and artisan shops.</p>',
        tags: ['travel', 'japan', 'culture'],
        authorId: users[1].id,
        authorName: users[1].name,
        authorAvatar: users[1].avatar,
        status: 'published',
        date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        likes: [users[0].id, users[2].id],
        comments: []
      }
    ];

    if (!usersExist) localStorage.setItem('inkwell_users', JSON.stringify(users));
    if (!postsExist) localStorage.setItem('inkwell_posts', JSON.stringify(posts));
  }
};
