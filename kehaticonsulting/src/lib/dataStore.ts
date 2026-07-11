import { User, Screening, Booking, MailboxMessage, Article } from './types';
import { mockUsers, mockScreenings, mockBookings, mockMailbox, mockArticles } from './mockData';

// Generate a random ID
export const generateId = (prefix: string) => {
  return `${prefix}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};

// --- USER ---
export const getLocalUsers = (): User[] => {
  if (typeof window === 'undefined') return mockUsers;
  const local = localStorage.getItem('app_users');
  let allUsers = mockUsers;
  if (local) {
    try {
      const parsed = JSON.parse(local);
      const localIds = new Set(parsed.map((u: any) => u.id));
      const filteredMock = mockUsers.filter(u => !localIds.has(u.id));
      allUsers = [...parsed, ...filteredMock];
    } catch (e) {
      console.error(e);
    }
  }
  return allUsers;
};

export const saveUsers = (usersList: User[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('app_users', JSON.stringify(usersList));
};

export const saveUser = (user: User) => {
  if (typeof window === 'undefined') return;
  const users = getLocalUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.unshift(user);
  }
  saveUsers(users);
};

// --- SCREENING ---
export const getLocalScreenings = (): Screening[] => {
  if (typeof window === 'undefined') return mockScreenings;
  const local = localStorage.getItem('app_screenings');
  const deletedStr = localStorage.getItem('app_deleted_screenings') || '[]';
  let deletedList: string[] = [];
  try {
    deletedList = JSON.parse(deletedStr);
  } catch (e) {
    console.error(e);
  }

  let allScreenings = mockScreenings;
  if (local) {
    try {
      const parsed = JSON.parse(local);
      allScreenings = [...parsed, ...mockScreenings];
    } catch (e) {
      console.error(e);
    }
  }
  return allScreenings.filter(s => !deletedList.includes(s.id));
};

export const saveScreening = (screening: Screening) => {
  if (typeof window === 'undefined') return;
  const local = localStorage.getItem('app_screenings');
  let parsed: Screening[] = [];
  if (local) {
    try {
      parsed = JSON.parse(local);
    } catch (e) {
      console.error(e);
    }
  }
  
  if (parsed.find(s => s.id === screening.id)) return;
  
  parsed.unshift(screening);
  localStorage.setItem('app_screenings', JSON.stringify(parsed));
};

export const deleteScreening = (id: string) => {
  if (typeof window === 'undefined') return;
  const deletedStr = localStorage.getItem('app_deleted_screenings') || '[]';
  try {
    const deletedList: string[] = JSON.parse(deletedStr);
    if (!deletedList.includes(id)) {
      deletedList.push(id);
      localStorage.setItem('app_deleted_screenings', JSON.stringify(deletedList));
    }
  } catch (e) {
    console.error(e);
  }

  const local = localStorage.getItem('app_screenings');
  if (local) {
    try {
      let parsed: Screening[] = JSON.parse(local);
      parsed = parsed.filter(s => s.id !== id);
      localStorage.setItem('app_screenings', JSON.stringify(parsed));
    } catch (e) {
      console.error(e);
    }
  }
};

// --- BOOKING ---
export const getLocalBookings = (): Booking[] => {
  if (typeof window === 'undefined') return mockBookings;
  const local = localStorage.getItem('app_bookings');
  const deletedStr = localStorage.getItem('app_deleted_bookings') || '[]';
  let deletedList: string[] = [];
  try {
    deletedList = JSON.parse(deletedStr);
  } catch (e) {
    console.error(e);
  }

  let allBookings = mockBookings;
  if (local) {
    try {
      const parsed = JSON.parse(local);
      allBookings = [...parsed, ...mockBookings];
    } catch (e) {
      console.error(e);
    }
  }
  return allBookings.filter(b => !deletedList.includes(b.id));
};

export const saveBooking = (booking: Booking) => {
  if (typeof window === 'undefined') return;
  const local = localStorage.getItem('app_bookings');
  let parsed: Booking[] = [];
  if (local) {
    try {
      parsed = JSON.parse(local);
    } catch (e) {
      console.error(e);
    }
  }
  
  if (parsed.find(b => b.id === booking.id)) {
    parsed = parsed.map(b => b.id === booking.id ? booking : b);
  } else {
    parsed.unshift(booking);
  }
  localStorage.setItem('app_bookings', JSON.stringify(parsed));
};

export const deleteBooking = (id: string) => {
  if (typeof window === 'undefined') return;
  const deletedStr = localStorage.getItem('app_deleted_bookings') || '[]';
  try {
    const deletedList: string[] = JSON.parse(deletedStr);
    if (!deletedList.includes(id)) {
      deletedList.push(id);
      localStorage.setItem('app_deleted_bookings', JSON.stringify(deletedList));
    }
  } catch (e) {
    console.error(e);
  }

  const local = localStorage.getItem('app_bookings');
  if (local) {
    try {
      let parsed: Booking[] = JSON.parse(local);
      parsed = parsed.filter(b => b.id !== id);
      localStorage.setItem('app_bookings', JSON.stringify(parsed));
    } catch (e) {
      console.error(e);
    }
  }
};

export const cancelLocalBooking = (id: string) => {
  if (typeof window === 'undefined') return;
  const bookings = getLocalBookings();
  const b = bookings.find(item => item.id === id);
  if (b) {
    const updated = { ...b, status: 'cancelled' as const };
    saveBooking(updated);
  }
};

// --- MAILBOX ---
export const getLocalMailbox = (): MailboxMessage[] => {
  if (typeof window === 'undefined') return mockMailbox;
  const local = localStorage.getItem('app_mailbox');
  if (local) {
    try {
      const parsed = JSON.parse(local);
      return [...parsed, ...mockMailbox];
    } catch (e) {
      console.error(e);
      return mockMailbox;
    }
  }
  return mockMailbox;
};

export const saveMailboxMessage = (msg: MailboxMessage) => {
  if (typeof window === 'undefined') return;
  const local = localStorage.getItem('app_mailbox');
  let parsed: MailboxMessage[] = [];
  if (local) {
    try {
      parsed = JSON.parse(local);
    } catch (e) {
      console.error(e);
    }
  }
  
  if (parsed.find(m => m.id === msg.id)) return;
  
  parsed.unshift(msg);
  localStorage.setItem('app_mailbox', JSON.stringify(parsed));
};

export const markMailboxMessageAsRead = (id: string) => {
  if (typeof window === 'undefined') return;
  const local = localStorage.getItem('app_mailbox');
  if (local) {
    try {
      let parsed: MailboxMessage[] = JSON.parse(local);
      parsed = parsed.map(m => m.id === id ? { ...m, is_read: true } : m);
      localStorage.setItem('app_mailbox', JSON.stringify(parsed));
    } catch (e) {
      console.error(e);
    }
  }
};

// --- ARTICLES ---
export const getLocalArticles = (): Article[] => {
  if (typeof window === 'undefined') return mockArticles;
  const local = localStorage.getItem('app_articles');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error(e);
      return mockArticles;
    }
  }
  // Initialize localStorage with mock data on first load
  localStorage.setItem('app_articles', JSON.stringify(mockArticles));
  return mockArticles;
};

export const saveArticle = (article: Article) => {
  if (typeof window === 'undefined') return;
  let articles = getLocalArticles();
  const idx = articles.findIndex(a => a.id === article.id);
  if (idx >= 0) {
    articles[idx] = article;
  } else {
    articles.unshift(article);
  }
  localStorage.setItem('app_articles', JSON.stringify(articles));
};

export const deleteArticle = (id: string) => {
  if (typeof window === 'undefined') return;
  let articles = getLocalArticles();
  articles = articles.filter(a => a.id !== id);
  localStorage.setItem('app_articles', JSON.stringify(articles));
};
