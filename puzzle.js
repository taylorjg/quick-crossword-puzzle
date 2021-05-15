// https://puzzles.telegraph.co.uk/print_crossword?id=44118
// QUICK CROSSWORD NO: 29,674
// Thu 13 May 21

const GRID = [
  'X....X...X...',
  'XX.X.X.X.X.X.',
  'X............',
  '.X.X.X.X.X.X.',
  '......X......',
  '.X.X.....XXX.',
  '....X.X.X....',
  '.XXX.....X.X.',
  '......X......',
  '.X.X.X.X.X.X.',
  '............X',
  '.X.X.X.X.X.XX',
  '...X...X....X',
]

const ACROSS_CLUES = [
  { no: 1, clue: 'Memo', length: 4, answer: 'note' },
  { no: 4, clue: 'Flushed', length: 3, answer: 'red' },
  { no: 6, clue: 'Limb', length: 3, answer: 'arm' },
  { no: 8, clue: 'Rude', length: 12, answer: 'discourteous' },
  { no: 10, clue: 'Cools', length: 6, answer: 'chills' },
  { no: 12, clue: 'Flee', length: 6, answer: 'escape' },
  { no: 13, clue: 'Brief', length: 5, answer: 'short' },
  { no: 14, clue: 'Matured', length: 4, answer: 'aged' },
  { no: 15, clue: 'Bubbles', length: 4, answer: 'foam' },
  { no: 17, clue: 'Reservoirs', length: 5, answer: 'sumps' },
  { no: 19, clue: 'Collision', length: 6, answer: 'impact' },
  { no: 21, clue: 'Dish', length: 6, answer: 'tureen' },
  { no: 23, clue: 'However', length: 12, answer: 'nevertheless' },
  { no: 24, clue: 'Lease', length: 3, answer: 'let' },
  { no: 25, clue: 'Excavate', length: 3, answer: 'dig' },
  { no: 26, clue: 'Necessity', length: 4, answer: 'need' }
]

const DOWN_CLUES = [
  { no: 2, clue: 'Opening', length: 7, answer: 'orifice' },
  { no: 3, clue: 'Shines', length: 6, answer: 'excels' },
  { no: 4, clue: 'Trounce', length: 4, answer: 'rout' },
  { no: 5, clue: 'Loathe', length: 6, answer: 'detest' },
  { no: 6, clue: 'Fragrance', length: 5, answer: 'aroma' },
  { no: 7, clue: 'Genius', length: 10, answer: 'mastermind' },
  { no: 9, clue: 'Periodic', length: 10, answer: 'occasional' },
  { no: 11, clue: 'Call', length: 5, answer: 'shout' },
  { no: 12, clue: 'Explode', length: 5, answer: 'erupt' },
  { no: 16, clue: 'Supervise', length: 7, answer: 'oversee' },
  { no: 17, clue: 'Afraid', length: 6, answer: 'scared' },
  { no: 18, clue: 'Sulky', length: 6, answer: 'sullen' },
  { no: 20, clue: 'Axis', length: 5, answer: 'pivot' },
  { no: 22, clue: 'Hooligan', length: 4, answer: 'thug' }
]

module.exports = {
  GRID,
  ACROSS_CLUES,
  DOWN_CLUES
}
