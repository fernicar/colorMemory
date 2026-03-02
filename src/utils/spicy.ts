const blocklist = [
  'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'cock', 'pussy', 'whore', 'slut',
  'fag', 'nigger', 'nigga', 'chink', 'spic', 'kike', 'gook', 'twat', 'wank', 'bastard',
  'crap', 'damn', 'prick', 'piss', 'cum', 'jizz', 'dyke', 'tranny', 'retard'
];

export function isSpicy(name: string): boolean {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return blocklist.some(word => normalized.includes(word));
}
