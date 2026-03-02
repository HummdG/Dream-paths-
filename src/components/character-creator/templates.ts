// Template pixel art characters for inspiration
// Each template is a 16x16 grid of colors

export interface CharacterTemplate {
  id: string;
  name: string;
  category: "boy" | "girl" | "neutral";
  pixels: string[][];
  colors: string[]; // Palette used in this template
}

// Helper to create empty grid
const createEmptyGrid = (size: number): string[][] =>
  Array(size).fill(null).map(() => Array(size).fill("transparent"));

// === BOY TEMPLATES ===

const spaceExplorerPixels = createEmptyGrid(16);
// Space helmet and suit
// ===============================
// UPDATED "DETAILED" 16x16 SPRITES
// ===============================

// --- Space Explorer (helmet + visor + backpack + suit boots) ---
const spaceExplorerData = [
  "......####......",
  "....########....",
  "...##WWWWWW##...",
  "..##WKKKKKKW##..",
  "..#WKKWWWWKKW#..",
  "..#WKKWBBWKKW#..",
  "..#WKKWWWWKKW#..",
  "..##WKKKKKKW##..",
  "...###WWWW###...",
  "..##OO####OO##..",
  "..#OOOCCCCOOO#..",
  "..#OOCCCCCCOO#..",
  "...#OOCC##OO#...",
  "...#OCC##CCO#...",
  "...##C#..#C##...",
  "....#......#....",
];

// --- Robot Ranger (box head + screen face + antenna + bolts) ---
const robotBoyData = [
  ".......S........",
  "......SSS.......",
  "....########....",
  "...#SSSSSSSS#...",
  "..#SSGGSSGGSS#..",
  "..#SSRRSSRRSS#..",
  "..#SSSSSSSSSS#..",
  "...#SSS##SSS#...",
  "....########....",
  "...SSS####SSS...",
  "..SSSSS##SSSSS..",
  "..SSS######SSS..",
  "...SS##SS##SS...",
  "...SSSSSSSSSS...",
  "....SS....SS....",
  "...SSS....SSS...",
];

// --- Shadow Ninja (hood + eye slit + red scarf + belt) ---
const ninjaData = [
  "................",
  ".....######.....",
  "...##########...",
  "..##NNNNNNNN##..",
  "..#NNNNNNNNNN#..",
  "..#NNNWWWWNNN#..",
  "..#NNWBBBBWNN#..",
  "..#NNNWWWWNNN#..",
  "...#NNNRRNNN#...",
  "....#NNRRNN#....",
  "...##NNRRNN##...",
  "..#NNNN##NNNN#..",
  "..#NNN####NNN#..",
  "...#NN#..#NN#...",
  "...##N....N##...",
  "....##....##....",
];

// --- Thunder Hero (mask + cape + lightning chest) ---
const superHeroBoyData = [
  ".....######.....",
  "...##########...",
  "..##TTTTTTTT##..",
  "..#TFFFFBBFFTT#.",
  "..#TFBBFFFFBFT#.",
  "..#TFFFFBBFFTT#.",
  "...#TTTTTTTT#...",
  "....#RRRRRR#....",
  "...##RRYRRY##...",
  "..#RRRYYYYRRR#..",
  "..#RRR#YY#RRR#..",
  "...#RRYYYYRR#...",
  "...##RRRRRR##...",
  "....BB....BB....",
  "...BBB....BBB...",
  "..BBBB....BBBB..",
];

// --- Magic Wizard (big hat + robe + staff tip) ---
const wizardBoyData = [
  "......V..V......",
  ".....VVVVVV.....",
  "....VVVVVVVV....",
  "...VVVVVVVVVV...",
  "..VVVVV##VVVVV..",
  "...VVV####VVV...",
  "...VFFFFFBBFV...",
  "...VFFBBFFFFV...",
  "....VFFFFFVV....",
  ".....PPPPPP.....",
  "...PPPPPPPPPP...",
  "..PPP#PPPP#PPP..",
  "..PPPPPPPPPPPP..",
  "...PP.PP..PP....",
  "..PPP....PPP....",
  ".PPPP....PPPP...",
];

// ===============================
// GIRLS
// ===============================

// --- Star Princess (crown + blonde hair + pink dress) ---
const princessData = [
  "......Y..Y......",
  ".....YYYYYY.....",
  "....YY.YY.YY....",
  "...YYYYYYYYYY...",
  "...YYFFFFFFYY...",
  "..Y.PFBBFBBP.Y..",
  "..PPFFFFFFFPPP..",
  "...PPPPPPPPPP...",
  "....MMMPPMMM....",
  "...MMMMMMMMMM...",
  "..MMMMMMMMMMMM..",
  "..MMMMPMMMPMMM..",
  "...MMMMMMMMMM...",
  "....MMMMMMMM....",
  ".....MMMMMM.....",
  "......MMMM......",
];

// --- Forest Fairy (big wings + wand + dress) ---
const fairyData = [
  "....C........C..",
  "...CCC......CCC.",
  "..CCCCC....CCCCC",
  "...CCC......CCC.",
  ".....Y..Y.......",
  "....YFFFFY......",
  "....YFBBFY..C...",
  ".....YFFFY.CC...",
  "......PPPPCC....",
  ".....PPPPPP.....",
  "...PPPPPPPPPP...",
  "..PPPPPPPPPPPP..",
  "...PP..PP..PP...",
  "...GG..GG..GG...",
  "....G......G....",
  "................",
];

// --- Galaxy Girl (helmet + pink accents + suit + boots) ---
const astronautGirlData = [
  "......####......",
  "....########....",
  "...##WWWWWW##...",
  "..##WKKKKKKW##..",
  "..#WPPWWWWPPW#..",
  "..#WPFFBBFFPW#..",
  "..#WPFFBBFFPW#..",
  "..#WPPWWWWPPW#..",
  "..##WKKKKKKW##..",
  "...###WWWW###...",
  "..##CCCC##CCCC..",
  "..#CCCCCCCCCC#..",
  "...#CC##CC##C#..",
  "...#CC######C#..",
  "....CC....CC....",
  "...##C....C##...",
];

// --- Mystic Cat (ears + eyes + tail + bodysuit) ---
const catGirlData = [
  "..VV......VV....",
  ".VVVV....VVVV...",
  "VVVVVVVVVVVVVV..",
  "VVVWWVVVVWWVVV..",
  "VVWBBBBBBBBWVV..",
  ".VVWBBBBBBWVVV..",
  "..VVWBBBBWVV....",
  "...VVWWWWVV.....",
  "...MMMMMMMM.....",
  "..MMMMMMMMMM....",
  "..MMMMMMMMMM....",
  "..MM.MMMM.MM....",
  "...MMMMMMMM.....",
  "...MM....MM.....",
  "..MMM....MMM....",
  ".MMMM..MM.MMMM..",
];

// --- Power Star (mask + cape + star badge) ---
const superHeroGirlData = [
  ".....PPPPPP.....",
  "...PPPPPPPPPP...",
  "..PP########PP..",
  "..P#PFFFFFBB#P..",
  "..P#PFBBFFFF#P..",
  "..P#PFFFFFBB#P..",
  "...PP######PP...",
  "....#RRRRRR#....",
  "...##CCYCC##....",
  "..#CCCCYCCCCC#..",
  "..#CCCCCCCCCC#..",
  "...#CC.##.CC#...",
  "...##CCCCCCCC#..",
  "....BB....BB....",
  "...BBB....BBB...",
  "..BBBB....BBBB..",
];

// ===============================
// NEUTRAL
// ===============================

// --- Cosmic Friend (big head + eyes + belly glow) ---
const alienData = [
  "................",
  ".....GGGGGG.....",
  "...GGGGGGGGGG...",
  "..GGG######GGG..",
  "..GG#KGGGGK#GG..",
  "..GG#KBBBBK#GG..",
  "..GG#KGGGGK#GG..",
  "...GG######GG...",
  "....GGGLLGGG....",
  ".....GLLLLG.....",
  "....LLLLLLLL....",
  "...LLL.LL.LLL...",
  "...LLLLLLLLLL...",
  "....LL....LL....",
  "...LLL....LLL...",
  "................",
];

// --- Pixel Dragon (head + wing + belly + tail tip) ---
const dragonData = [
  "................",
  "....OOO.........",
  "...OOOOO........",
  "..OO#####O......",
  "..O#WWBWW#O.....",
  "..O#WBBBW#O.....",
  "...O#####O......",
  "....OOOO........",
  "...RRRRR........",
  "..RRR#RRR.......",
  ".RRR###RRR......",
  ".RRR#OO#RRR.....",
  "..RRR###RR......",
  "...RRR#RR.......",
  "....OO.OO.......",
  ".....O..O.......",
];

// Color mapping legend
const colorMap: Record<string, string> = {
  ".": "transparent",
  "W": "#FFFFFF", // White
  "B": "#1a1a1a", // Black (eyes)
  "F": "#FFD9B3", // Flesh/Skin
  "O": "#FF8C42", // Orange
  "G": "#4ADE80", // Green
  "S": "#94A3B8", // Silver/Gray
  "R": "#EF4444", // Red
  "N": "#374151", // Dark Gray/Ninja
  "P": "#FFB4D1", // Pink
  "Y": "#FACC15", // Yellow/Gold
  "M": "#D946EF", // Magenta
  "V": "#8B5CF6", // Violet
  "T": "#10B981", // Teal
  "K": "#60A5FA", // Sky Blue
  "L": "#A3E635", // Lime
  "C": "#06B6D4", // Cyan
  "#": "#374151", // Dark Gray (details)
};

function parseTemplateData(data: string[]): string[][] {
  return data.map((row) =>
    row.split("").map((char) => colorMap[char] || "transparent")
  );
}

export const characterTemplates: CharacterTemplate[] = [
  // Boy templates
  {
    id: "space-explorer",
    name: "Space Explorer",
    category: "boy",
    pixels: parseTemplateData(spaceExplorerData),
    colors: ["#FF8C42", "#FFFFFF", "#FFD9B3", "#1a1a1a", "#374151"],
  },
  {
    id: "robot-boy",
    name: "Robot Ranger",
    category: "boy",
    pixels: parseTemplateData(robotBoyData),
    colors: ["#4ADE80", "#94A3B8", "#EF4444", "#374151"],
  },
  {
    id: "ninja",
    name: "Shadow Ninja",
    category: "boy",
    pixels: parseTemplateData(ninjaData),
    colors: ["#374151", "#FFFFFF", "#1a1a1a", "#EF4444"],
  },
  {
    id: "superhero-boy",
    name: "Thunder Hero",
    category: "boy",
    pixels: parseTemplateData(superHeroBoyData),
    colors: ["#10B981", "#FFD9B3", "#1a1a1a", "#EF4444", "#FACC15", "#60A5FA"],
  },
  {
    id: "wizard-boy",
    name: "Magic Wizard",
    category: "boy",
    pixels: parseTemplateData(wizardBoyData),
    colors: ["#8B5CF6", "#FFD9B3", "#1a1a1a", "#FFB4D1"],
  },

  // Girl templates
  {
    id: "princess",
    name: "Star Princess",
    category: "girl",
    pixels: parseTemplateData(princessData),
    colors: ["#FACC15", "#FFB4D1", "#FFD9B3", "#D946EF"],
  },
  {
    id: "fairy",
    name: "Forest Fairy",
    category: "girl",
    pixels: parseTemplateData(fairyData),
    colors: ["#06B6D4", "#FFB4D1", "#FFD9B3", "#1a1a1a", "#4ADE80"],
  },
  {
    id: "astronaut-girl",
    name: "Galaxy Girl",
    category: "girl",
    pixels: parseTemplateData(astronautGirlData),
    colors: ["#374151", "#FFB4D1", "#FFD9B3", "#1a1a1a", "#06B6D4"],
  },
  {
    id: "cat-girl",
    name: "Mystic Cat",
    category: "girl",
    pixels: parseTemplateData(catGirlData),
    colors: ["#8B5CF6", "#FFD9B3", "#1a1a1a", "#D946EF"],
  },
  {
    id: "superhero-girl",
    name: "Power Star",
    category: "girl",
    pixels: parseTemplateData(superHeroGirlData),
    colors: ["#FFB4D1", "#FFD9B3", "#1a1a1a", "#06B6D4", "#FACC15", "#60A5FA"],
  },

  // Neutral templates
  {
    id: "alien",
    name: "Cosmic Friend",
    category: "neutral",
    pixels: parseTemplateData(alienData),
    colors: ["#4ADE80", "#1a1a1a", "#A3E635"],
  },
  {
    id: "dragon",
    name: "Pixel Dragon",
    category: "neutral",
    pixels: parseTemplateData(dragonData),
    colors: ["#FF8C42", "#EF4444", "#FFFFFF", "#1a1a1a"],
  },
];

// Default color palette for the editor
export const defaultPalette = [
  // Skin tones
  "#FFD9B3",
  "#E8B896",
  "#C68A5C",
  "#8D5524",
  // Hair colors
  "#1a1a1a",
  "#4A3728",
  "#8B4513",
  "#FFD700",
  "#FF4500",
  "#8B5CF6",
  "#FFB4D1",
  "#60A5FA",
  // Primary colors
  "#EF4444",
  "#F97316",
  "#FACC15",
  "#22C55E",
  "#06B6D4",
  "#3B82F6",
  "#A855F7",
  "#EC4899",
  // Grays & basics
  "#FFFFFF",
  "#E5E7EB",
  "#9CA3AF",
  "#4B5563",
  "#1F2937",
  "#000000",
  // Extra fun colors
  "#A3E635",
  "#F472B6",
  "#38BDF8",
  "#FB923C",
  "#D946EF",
  "#14B8A6",
];

