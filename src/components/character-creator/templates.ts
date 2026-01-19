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
const spaceExplorerData = [
  "......####......",
  ".....######.....",
  "....##WWWW##....",
  "....#WWBBWW#....",
  "....#WBFFBW#....",
  "....#WBFFBW#....",
  "....##WWWW##....",
  ".....#OOOO#.....",
  "....##OOOO##....",
  "...#OOOOOOOO#...",
  "...#OOOO OOOO#...",
  "...#OO#OO#OO#...",
  "....##.##.##....",
  "....#O.OO.O#....",
  "....#O....O#....",
  "...##......##...",
];

const robotBoyPixels = createEmptyGrid(16);
const robotBoyData = [
  "................",
  ".....GGGGGG.....",
  "....GGGGGGGG....",
  "...GG##GG##GG...",
  "...GGRRGGRRGG...",
  "...GGGGGGGGGG...",
  "....GGGGGGGG....",
  ".....#SSSS#.....",
  "....SSSSSSSS....",
  "...SS#SSSS#SS...",
  "...SSSSSSSSSS...",
  "...SS.SSSS.SS...",
  "....SS.SS.SS....",
  ".....SSSSSS.....",
  "....SS....SS....",
  "...SSS....SSS...",
];

const ninjaPixels = createEmptyGrid(16);
const ninjaData = [
  "................",
  ".....NNNNNN.....",
  "....NNNNNNNN....",
  "...NNNNNNNNNN...",
  "...NNNWWWWNNN...",
  "...NNNWKKWNNN...",
  "...NNNNNNNNNN...",
  "....NNNNNNNN....",
  ".....NRRRN#.....",
  "....NNRRRNN.....",
  "...NNNRRRRNNN...",
  "...NN.NRRN.NN...",
  "....NNNNNNNN....",
  ".....NN..NN.....",
  "....NNN..NNN....",
  "...NNNN..NNNN...",
];

const superHeroBoyPixels = createEmptyGrid(16);
const superHeroBoyData = [
  "................",
  ".....TTTTTT.....",
  "....TTTTTTTT....",
  "...TT.TTTT.TT...",
  "...TT.FBFB.TT...",
  "....TT.TT.TT....",
  ".....TTTTTT.....",
  ".....RRRRRR.....",
  "...RRBRRRRBRR...",
  "...RRRRYYRRRR...",
  "...RRR.RR.RRR...",
  "...RR.RRRR.RR...",
  "....RRRRRRRR....",
  ".....BB..BB.....",
  "....BBB..BBB....",
  "...BBBB..BBBB...",
];

const wizardBoyPixels = createEmptyGrid(16);
const wizardBoyData = [
  "......V.........",
  ".....VVV........",
  "....VVVVV.......",
  "...VVVVVVV......",
  "..VVVVVVVVV.....",
  "...VFFFFVVV.....",
  "...VFBBFVVV.....",
  "...VFFFFVVV.....",
  "....PPPPPP......",
  "...PPPPPPPP.....",
  "..PPP#PP#PPP....",
  "..PPPPPPPPPP....",
  "...PP.PP.PP.....",
  "...PP.PP.PP.....",
  "..PPP....PPP....",
  ".PPPP....PPPP...",
];

// === GIRL TEMPLATES ===

const princessPixels = createEmptyGrid(16);
const princessData = [
  "......YYY.......",
  ".....YYYYY......",
  "....YYYY.YY.....",
  "...PP.PPP.PP....",
  "...PPFPPFPP.....",
  "....PPFFFPP.....",
  ".....PPPPP......",
  "....MMMMMMM.....",
  "...MMMMMMMMM....",
  "..MMMMMMMMMMM...",
  "..MMMM.M.MMMM...",
  "..MMM.MMM.MMM...",
  "...MMMMMMMMM....",
  "....MMMMMMM.....",
  ".....MMMMM......",
  "......MMM.......",
];

const fairyPixels = createEmptyGrid(16);
const fairyData = [
  "................",
  ".CC...PPPP...CC.",
  "CCCC.PPPPPP.CCCC",
  ".CC..PPPPPP..CC.",
  ".....PFFPP......",
  ".....PFBFP......",
  "......PFPP......",
  ".......GG.......",
  "......GGGG......",
  ".....GGGGGG.....",
  "....GGG..GGG....",
  "....GG....GG....",
  ".....GG..GG.....",
  ".....GG..GG.....",
  "......G..G......",
  "................",
];

const astronautGirlPixels = createEmptyGrid(16);
const astronautGirlData = [
  "......####......",
  ".....######.....",
  "....##PPPP##....",
  "....#PPFFPP#....",
  "....#PFBBFP#....",
  "....#PPFFPP#....",
  "....##PPPP##....",
  ".....#CCCC#.....",
  "....##CCCC##....",
  "...#CCCCCCCC#...",
  "...#CCCCCCCC#...",
  "...#CC#CC#CC#...",
  "....##.##.##....",
  "....#C.CC.C#....",
  "....#C....C#....",
  "...##......##...",
];

const catGirlPixels = createEmptyGrid(16);
const catGirlData = [
  "..VV......VV....",
  "..VVV....VVV....",
  "..VVVVVVVVVV....",
  "..VVFFVVFFVV....",
  "..VVFBFBFBVV....",
  "...VVFFFFVV.....",
  "....VV.TVV......",
  ".....VVVV.......",
  "....MMMMMM......",
  "...MMMMMMMM.....",
  "...MMMMMMMM.....",
  "...MM.MM.MM.....",
  "....MMMMMM......",
  "....MM..MM......",
  "...MMM..MMM.....",
  "..MMMM..MMMM..VV",
];

const superHeroGirlPixels = createEmptyGrid(16);
const superHeroGirlData = [
  "................",
  "...PPPPPPPP.....",
  "..PPPPPPPPPP....",
  "..PP.PPPP.PP....",
  "..PP.FBBF.PP....",
  "...PP.FF.PP.....",
  "....PPPPPP......",
  "....CCCCCC......",
  "...CCYCCYCC.....",
  "...CCCCCCCC.....",
  "...CC.CC.CC.....",
  "...C.CCCC.C.....",
  "....CCCCCC......",
  ".....BB..BB.....",
  "....BBB..BBB....",
  "...BBBB..BBBB...",
];

// === NEUTRAL TEMPLATES ===

const alienPixels = createEmptyGrid(16);
const alienData = [
  "................",
  "....GGGGGGGG....",
  "...GGGGGGGGGG...",
  "..GGGG.GG.GGGG..",
  "..GGGGKGGKGGGG..",
  "..GGGGGGGGGGGG..",
  "...GGGGGGGGGG...",
  "....GGLLGGGG....",
  "......LLLL......",
  ".....LLLLLL.....",
  "....LL.LL.LL....",
  "....LLLLLLLL....",
  ".....L.LL.L.....",
  "....LL....LL....",
  "...LLL....LLL...",
  "..LLLL....LLLL..",
];

const dragonPixels = createEmptyGrid(16);
const dragonData = [
  ".OO.............",
  ".OOO..OOOOOO....",
  "..OOOOOOOOOOO...",
  "...OO.OWOW.OO...",
  "...OOOOOOOOOO...",
  "....OOOOOOO.....",
  ".....RRRRR......",
  "....RRRRRRRR....",
  "...RROORROORR...",
  "OOO.RRRRRRRR.OOO",
  "..OORRRRRRRRO...",
  "....RRRRRRRR....",
  "....RR.RR.RR....",
  "....RR.RR.RR....",
  "...RRR.RR.RRR...",
  "..RRRR....RRRR..",
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

