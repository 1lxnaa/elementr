import * as Haptics from 'expo-haptics';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Linking, Platform } from 'react-native';
import { injectSpeedInsights } from "@vercel/speed-insights";
import ReactGA from 'react-ga4';

export default function ChemistryApp() {

  // Initialize Speed Insights only if on Web
  useEffect(() => {
    if (Platform.OS === 'web') {
      ReactGA.initialize("G-BH9T80GTRR");
      ReactGA.send("pageview");
      injectSpeedInsights();
    }
  }, []);

  const shuffleArray = (array) => {
    return [...array]
      .sort(() => Math.random() - 0.5)
      .map(question => ({
        ...question,
        options: [...question.options].sort(() => Math.random() - 0.5)
      }));
  };

  // --- STATE MANAGEMENT ---
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [screen, setScreen] = useState('home');
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const currentAccuracy = totalAnswered > 0 
    ? ((totalCorrect / totalAnswered) * 100).toFixed(1) 
    : "0.0";

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isPeriodicsVisible, setIsPeriodicsVisible] = useState(false);

  // --- EXTRACTED DATA ---
  const elementData = [
    { id: 0, quest: "H", row: 1, col: 1, options: ["Halogens", "Helium", "Mercury", "Hydrogen"], correct: "Hydrogen", hint: "Found in water" },
    { id: 1, quest: "He", row: 1, col: 18, options: ["Helium", "Hydrogen", "Hafnium", "Mercury"], correct: "Helium", hint: "Used in balloons" },
    { id: 2, quest: "Li", row: 2, col: 1, options: ["Lanthanum", "Livermorium", "Lithium", "Lutetium"], correct: "Lithium", hint: "Used in phone batteries" },
    { id: 3, quest: "Be", row: 2, col: 2, options: ["Barium", "Beryllium", "Bismuth", "Bromine"], correct: "Beryllium", hint: "Found in emeralds" },
    { id: 4, quest: "B", row: 2, col: 13, options: ["Beryllium", "Boron", "Bromine", "Bismuth"], correct: "Boron", hint: "Can be found in detergents" },
    { id: 5, quest: "C", row: 2, col: 14, options: ["Calcium", "Carbon", "Copper", "Cesium"], correct: "Carbon", hint: "We breathe this out" },
    { id: 6, quest: "N", row: 2, col: 15, options: ["Neon", "Sodium", "Nickel", "Nitrogen"], correct: "Nitrogen", hint: "Used to make dyes" },
    { id: 7, quest: "O", row: 2, col: 16, options: ["Osmium", "Oxygen", "Oganesson", "Iodine"], correct: "Oxygen", hint: "You breathe this in" },
    { id: 8, quest: "F", row: 2, col: 17, options: ["Francium", "Iron", "Flerovium", "Fluorine"], correct: "Fluorine", hint: "Used in toothpaste" },
    { id: 9, quest: "Ne", row: 2, col: 18, options: ["Nitrogen", "Neon", "Sodium", "Nickel"], correct: "Neon", hint: "Used in lighting" },
    { id: 10, quest: "Na", row: 3, col: 1, options: ["Sodium", "Nihonium", "Neon", "Nitrogen"], correct: "Sodium", hint: "Used to preserve food" },
    { id: 11, quest: "Mg", row: 3, col: 2, options: ["Manganese", "Meitnerium", "Magnesium", "Molybdenum"], correct: "Magnesium", hint: "Essential for health" },
    { id: 12, quest: "Al", row: 3, col: 13, options: ["Silver", "Arsenic", "Argon", "Aluminum"], correct: "Aluminum", hint: "Used to build cars" },
    { id: 13, quest: "Si", row: 3, col: 14, options: ["Silicon", "Selenium", "Tin", "Antimony"], correct: "Silicon", hint: "Used in semiconductor material in electronics" },
    { id: 14, quest: "P", row: 3, col: 15, options: ["Platinum", "Phosphorus", "Lead", "Palladium"], correct: "Phosphorus", hint: "Used in agriculture for fertilizers" },
    { id: 15, quest: "S", row: 3, col: 16, options: ["Silicon", "Scandium", "Tin", "Sulfur"], correct: "Sulfur", hint: "Used to control pests" },
    { id: 16, quest: "Cl", row: 3, col: 17, options: ["Chlorine", "Calcium", "Carbon", "Cobalt"], correct: "Chlorine", hint: "Eliminates bacteria" },
    { id: 17, quest: "Ar", row: 3, col: 18, options: ["Arsenic", "Silver", "Argon", "Astatine"], correct: "Argon", hint: "Protects metals from oxidation" },
    { id: 18, quest: "K", row: 4, col: 1, options: ["Krypton", "Xenon", "Kryptonite", "Potassium"], correct: "Potassium", hint: "Found in bananas" },
    { id: 19, quest: "Ca", row: 4, col: 2, options: ["Cobalt", "Calcium", "Copper", "Carbon"], correct: "Calcium", hint: "Makes up your bones" },
    { id: 20, quest: "Sc", row: 4, col: 3, options: ["Scandium", "Samarium", "Argon", "Astatine"], correct: "Scandium", hint: "Essential in high-intensity lighting" },
    { id: 21, quest: "Ti", row: 4, col: 4, options: ["Tin", "Thallium", "Tungsten", "Titanium"], correct: "Titanium", hint: "Lightweight yet has high-strength" },
    { id: 22, quest: "V", row: 4, col: 5, options: ["Yttrium", "Vanadium", "Ytterbium", "Uranium"], correct: "Vanadium", hint: "Strengthens steel alloys" },
    { id: 23, quest: "Cr", row: 4, col: 6, options: ["Chromium", "Copper", "Cerium", "Curium"], correct: "Chromium", hint: "Used to produce stainless steel" },
    { id: 24, quest: "Mn", row: 4, col: 7, options: ["Meitnerium", "Moscovium", "Magnesium", "Manganese"], correct: "Manganese", hint: "Essential for Modern Industry" },
    { id: 25, quest: "Fe", row: 4, col: 8, options: ["Iron", "Copper", "Gold", "Silver"], correct: "Iron", hint: "Used to make lasting tools" },
    { id: 26, quest: "Co", row: 4, col: 9, options: ["Copper", "Cobalt", "Chlorine", "Cadmium"], correct: "Cobalt", hint: "Found in lithium batteries" },
    { id: 27, quest: "Ni", row: 4, col: 10, options: ["Nitrogen", "Neon", "Sodium", "Nickel"], correct: "Nickel", hint: "a form of currency" },
    { id: 28, quest: "Cu", row: 4, col: 11, options: ["Cobalt", "Cerium", "Copper", "Curium"], correct: "Copper", hint: "Used for electrical wiring" },
    { id: 29, quest: "Zn", row: 4, col: 12, options: ["Zinc", "Thallium", "Zirconium", "Titanium"], correct: "Zinc", hint: "Essential for human health" },
    { id: 30, quest: "Ga", row: 4, col: 13, options: ["Germanium", "Gadolinium", "Gallium", "Garcon"], correct: "Gallium", hint: "Used to create semiconductors" },
    { id: 31, quest: "Ge", row: 4, col: 14, options: ["Gallium", "Garcon", "Germanium", "Gadolinium"], correct: "Germanium", hint: "In fiber-optic systems" },
    { id: 32, quest: "As", row: 4, col: 15, options: ["Argon", "Arsenic", "Aluminum", "Gold"], correct: "Arsenic", hint: "natural yet toxic chemical element" },
    { id: 33, quest: "Se", row: 4, col: 16, options: ["Silicon", "Selenide", "Antimony", "Selenium"], correct: "Selenium", hint: "Essential for human health" },
    { id: 34, quest: "Br", row: 4, col: 17, options: ["Bromine", "Bohrium", "Boron", "Bismuth"], correct: "Bromine", hint: "Used for water treatment in pools" },
    { id: 35, quest: "Kr", row: 4, col: 18, options: ["Potassium", "Kryptonite", "Krypton", "Xenon"], correct: "Krypton", hint: "Used in specialized lasers" },
    { id: 36, quest: "Rb", row: 5, col: 1, options: ["Rhodium", "Rubidium", "Rhenium", "Radium"], correct: "Rubidium", hint: "An Alkali Metal" },
    { id: 37, quest: "Sr", row: 5, col: 2, options: ["Silicon", "Selenide", "Tin", "Strontium"], correct: "Strontium", hint: "Creates the red in fireworks" },
    { id: 38, quest: "Y", row: 5, col: 3, options: ["Mercury", "Yttrium", "Uranium", "Ytterbium"], correct: "Yttrium", hint: "produces red phosphors for LEDs" },
    { id: 39, quest: "Zr", row: 5, col: 4, options: ["Zinc", "Sodium", "Zirconium", "Antimony"], correct: "Zirconium", hint: "Used in nuclear reactors for cladding fuel rods" },
    { id: 40, quest: "Nb", row: 5, col: 5, options: ["Nickel", "Sodium", "Nihonium", "Niobium"], correct: "Niobium", hint: "Used in automotive industries" },
    { id: 41, quest: "Mo", row: 5, col: 6, options: ["Manganese", "Molybdenum", "Mendelevium", "Meitnerium"], correct: "Molybdenum", hint: "Strengthens steel" },
    { id: 42, quest: "Tc", row: 5, col: 7, options: ["Technetium", "Titanium", "Tellurium", "Thallium"], correct: "Technetium", hint: "Used in nuclear medicine for imaging" },
    { id: 43, quest: "Ru", row: 5, col: 8, options: ["Rhodium", "Ruthenium", "Radon", "Rubidium"], correct: "Ruthenium", hint: "Hardens platinum and palladium alloys" },
    { id: 44, quest: "Rh", row: 5, col: 9, options: ["Rhodium", "Ruthenium", "Radon", "Rubidium"], correct: "Rhodium", hint: "Corrosion resistant metal" },
    { id: 45, quest: "Pd", row: 5, col: 10, options: ["Phosphorus", "Lead", "Platinum", "Palladium"], correct: "Palladium", hint: "Used primarily in catalytic converters" },
    { id: 46, quest: "Ag", row: 5, col: 11, options: ["Silver", "Copper", "Gold", "Emerald"], correct: "Silver", hint: "Used in electronics" },
    { id: 47, quest: "Cd", row: 5, col: 12, options: ["Calcium", "Caesium", "Cadmium", "Chromium"], correct: "Cadmium", hint: "Used in solar cells" },
    { id: 48, quest: "In", row: 5, col: 13, options: ["Indium", "Iridium", "Iodine", "Lithium"], correct: "Indium", hint: "Used for OLED displays" },
    { id: 49, quest: "Sn", row: 5, col: 14, options: ["Scandium", "Antimony", "Tin", "Samarium"], correct: "Tin", hint: "A component in solders" },
    { id: 50, quest: "Sb", row: 5, col: 15, options: ["Antimony", "Samarium", "Scandium", "Strontium"], correct: "Antimony", hint: "Used in flame retardants" },
    { id: 51, quest: "Te", row: 5, col: 16, options: ["Thallium", "Titanium", "Technetium", "Tellurium"], correct: "Tellurium", hint: "Used in solar panels" },
    { id: 52, quest: "I", row: 5, col: 17, options: ["Indium", "Iodine", "Lithium", "Iridium"], correct: "Iodine", hint: "Essential to produce thyroid hormones" },
    { id: 53, quest: "Xe", row: 5, col: 18, options: ["Xenon", "Potassium", "Krypton", "Neon"], correct: "Xenon", hint: "Used in specialized lighting" },
    { id: 54, quest: "Cs", row: 6, col: 1, options: ["Chlorine", "Cadmium", "Calcium", "Caesium"], correct: "Caesium", hint: "Used in high-precision atomic clocks" },
    { id: 55, quest: "Ba", row: 6, col: 2, options: ["Boron", "Bromine", "Barium", "Berkelium"], correct: "Barium", hint: "Medical contrast agent for x-rays" },
    { id: 56, quest: "La", row: 9, col: 3, options: ["Lanthanum", "Lithium", "Lutetium", "Lawrencium"], correct: "Lanthanum", hint: "Catalyst for petroleum cracking" },
    { id: 57, quest: "Ce", row: 9, col: 4, options: ["Carbon", "Cerium", "Chlorine", "Caesium"], correct: "Cerium", hint: "Alloy additive to improve metal" },
    { id: 58, quest: "Pr", row: 9, col: 5, options: ["Phosphorus", "Polonium", "Praseodymium", "Lead"], correct: "Praseodymium", hint: "Used in high strength magnets" },
    { id: 59, quest: "Nd", row: 9, col: 6, options: ["Niobium", "Nihonium", "Neodymium", "Sodium"], correct: "Neodymium", hint: "To create world's strongest magnets" },
    { id: 60, quest: "Pm", row: 9, col: 7, options: ["Promethium", "Praseodymium", "Palladium", "Lead"], correct: "Promethium", hint: "Has a radioactive glow" },
    { id: 61, quest: "Sm", row: 9, col: 8, options: ["Antimony", "Scandium", "Seaborgium", "Samarium"], correct: "Samarium", hint: "First element named after a person" },
    { id: 62, quest: "Eu", row: 9, col: 9, options: ["Iron", "Erbium", "Europium", "Einsteinium"], correct: "Europium", hint: "Used for banknote anti-counterfeiting" },
    { id: 63, quest: "Gd", row: 9, col: 10, options: ["Gadolinium", "Gallium", "Gadonium", "Germanium"], correct: "Gadolinium", hint: "Contrast agent in MRIs" },
    { id: 64, quest: "Tb", row: 9, col: 11, options: ["Terabyte", "Terabium", "Terbium", "Thulium"], correct: "Terbium", hint: "Intense green luminescence" },
    { id: 65, quest: "Dy", row: 9, col: 12, options: ["Darmstadtium", "Nihonium", "Neodymium", "Dysprosium"], correct: "Dysprosium", hint: "A soft silver" },
    { id: 66, quest: "Ho", row: 9, col: 13, options: ["Holmium", "Hassium", "Hafnium", "Helium"], correct: "Holmium", hint: "Strong magnetic properties" },
    { id: 67, quest: "Er", row: 9, col: 14, options: ["Erbium", "Europium", "Einsteinium", "Erium"], correct: "Erbium", hint: "Used in fiber optics" },
    { id: 68, quest: "Tm", row: 9, col: 15, options: ["Thulium", "Titanium", "Technetium", "Tellurium"], correct: "Thulium", hint: "Used in portable X-ray devices" },
    { id: 69, quest: "Yb", row: 9, col: 16, options: ["Ytterbium", "Yttrium", "Yttriumium", "Ytterium"], correct: "Ytterbium", hint: "Used in lasers" },
    { id: 70, quest: "Lu", row: 9, col: 17, options: ["Lutetium", "Lanthanum", "Lawrencium", "Lithium"], correct: "Lutetium", hint: "Used in PET scan detectors" },
    { id: 71, quest: "Hf", row: 6, col: 4, options: ["Hafnium", "Holmium", "Hassium", "Helium"], correct: "Hafnium", hint: "Used in nuclear control rods" },
    { id: 72, quest: "Ta", row: 6, col: 5, options: ["Tantalum", "Titanium", "Technetium", "Thallium"], correct: "Tantalum", hint: "Used in electronic capacitors" },
    { id: 73, quest: "W", row: 6, col: 6, options: ["Tungsten", "Tin", "Titanium", "Tantalum"], correct: "Tungsten", hint: "Highest melting point metal" },
    { id: 74, quest: "Re", row: 6, col: 7, options: ["Rhenium", "Radium", "Ruthenium", "Rhodium"], correct: "Rhenium", hint: "Used in jet engines" },
    { id: 75, quest: "Os", row: 6, col: 8, options: ["Osmium", "Oxygen", "Oganesson", "Osmiumium"], correct: "Osmium", hint: "Densest natural element" },
    { id: 76, quest: "Ir", row: 6, col: 9, options: ["Iridium", "Indium", "Iodine", "Iron"], correct: "Iridium", hint: "Very corrosion resistant" },
    { id: 77, quest: "Pt", row: 6, col: 10, options: ["Platinum", "Palladium", "Polonium", "Potassium"], correct: "Platinum", hint: "Used in jewelry and catalysts" },
    { id: 78, quest: "Au", row: 6, col: 11, options: ["Gold", "Silver", "Copper", "Aluminum"], correct: "Gold", hint: "Highly valuable precious metal" },
    { id: 79, quest: "Hg", row: 6, col: 12, options: ["Mercury", "Magnesium", "Manganese", "Meitnerium"], correct: "Mercury", hint: "Liquid metal at room temp" },
    { id: 80, quest: "Tl", row: 6, col: 13, options: ["Thallium", "Titanium", "Tellurium", "Tin"], correct: "Thallium", hint: "Highly toxic metal" },
    { id: 81, quest: "Pb", row: 6, col: 14, options: ["Lead", "Phosphorus", "Platinum", "Polonium"], correct: "Lead", hint: "Used in car batteries" },
    { id: 82, quest: "Bi", row: 6, col: 15, options: ["Bismuth", "Boron", "Barium", "Berkelium"], correct: "Bismuth", hint: "Used in medicines" },
    { id: 83, quest: "Po", row: 6, col: 16, options: ["Polonium", "Platinum", "Phosphorus", "Palladium"], correct: "Polonium", hint: "Highly radioactive" },
    { id: 84, quest: "At", row: 6, col: 17, options: ["Astatine", "Argon", "Arsenic", "Americium"], correct: "Astatine", hint: "Rarest naturally occurring element" },
    { id: 85, quest: "Rn", row: 6, col: 18, options: ["Radon", "Radium", "Ruthenium", "Rhenium"], correct: "Radon", hint: "Radioactive noble gas" },
    { id: 86, quest: "Fr", row: 7, col: 1, options: ["Francium", "Fermium", "Fluorine", "Flerovium"], correct: "Francium", hint: "Most reactive alkali metal" },
    { id: 87, quest: "Ra", row: 7, col: 2, options: ["Radium", "Rhenium", "Rubidium", "Rhodium"], correct: "Radium", hint: "Glows in the dark" },
    { id: 88, quest: "Ac", row: 10, col: 3, options: ["Actinium", "Americium", "Argon", "Arsenic"], correct: "Actinium", hint: "Highly radioactive metal" },
    { id: 89, quest: "Th", row: 10, col: 4, options: ["Thorium", "Thallium", "Titanium", "Technetium"], correct: "Thorium", hint: "Potential nuclear fuel" },
    { id: 90, quest: "Pa", row: 10, col: 5, options: ["Protactinium", "Palladium", "Platinum", "Polonium"], correct: "Protactinium", hint: "Very rare radioactive metal" },
    { id: 91, quest: "U", row: 10, col: 6, options: ["Uranium", "Ununium", "Uranite", "Uranus"], correct: "Uranium", hint: "Used in nuclear reactors" },
    { id: 92, quest: "Np", row: 10, col: 7, options: ["Neptunium", "Nickel", "Niobium", "Nitrogen"], correct: "Neptunium", hint: "First synthetic transuranium element" },
    { id: 93, quest: "Pu", row: 10, col: 8, options: ["Plutonium", "Polonium", "Palladium", "Platinum"], correct: "Plutonium", hint: "Used in nuclear weapons" },
    { id: 94, quest: "Am", row: 10, col: 9, options: ["Americium", "Aluminum", "Argon", "Actinium"], correct: "Americium", hint: "Used in smoke detectors" },
    { id: 95, quest: "Cm", row: 10, col: 10, options: ["Curium", "Calcium", "Cadmium", "Chromium"], correct: "Curium", hint: "Highly radioactive" },
    { id: 96, quest: "Bk", row: 10, col: 11, options: ["Berkelium", "Bismuth", "Boron", "Bromine"], correct: "Berkelium", hint: "Synthetic radioactive element" },
    { id: 97, quest: "Cf", row: 10, col: 12, options: ["Californium", "Copper", "Cobalt", "Carbon"], correct: "Californium", hint: "Used in neutron sources" },
    { id: 98, quest: "Es", row: 10, col: 13, options: ["Einsteinium", "Erbium", "Europium", "Erium"], correct: "Einsteinium", hint: "Named after Einstein" },
    { id: 99, quest: "Fm", row: 10, col: 14, options: ["Fermium", "Fluorine", "Francium", "Flerovium"], correct: "Fermium", hint: "Synthetic radioactive metal" },
    { id: 100, quest: "Md", row: 10, col: 15, options: ["Mendelevium", "Magnesium", "Molybdenum", "Meitnerium"], correct: "Mendelevium", hint: "Named after periodic table creator" },
    { id: 101, quest: "No", row: 10, col: 16, options: ["Nobelium", "Neon", "Nickel", "Niobium"], correct: "Nobelium", hint: "Named after Alfred Nobel" },
    { id: 102, quest: "Lr", row: 10, col: 17, options: ["Lawrencium", "Lanthanum", "Lutetium", "Lithium"], correct: "Lawrencium", hint: "Synthetic actinide element" },
    { id: 103, quest: "Rf", row: 7, col: 4, options: ["Rutherfordium", "Radium", "Rhenium", "Ruthenium"], correct: "Rutherfordium", hint: "Named after Rutherford" },
    { id: 104, quest: "Db", row: 7, col: 5, options: ["Dubnium", "Darmstadtium", "Dysprosium", "Deuterium"], correct: "Dubnium", hint: "Synthetic element" },
    { id: 105, quest: "Sg", row: 7, col: 6, options: ["Seaborgium", "Strontium", "Samarium", "Silicon"], correct: "Seaborgium", hint: "Named after Glenn Seaborg" },
    { id: 106, quest: "Bh", row: 7, col: 7, options: ["Bohrium", "Boron", "Bismuth", "Berkelium"], correct: "Bohrium", hint: "Named after Niels Bohr" },
    { id: 107, quest: "Hs", row: 7, col: 8, options: ["Hassium", "Holmium", "Hafnium", "Helium"], correct: "Hassium", hint: "Synthetic superheavy element" },
    { id: 108, quest: "Mt", row: 7, col: 9, options: ["Meitnerium", "Magnesium", "Manganese", "Molybdenum"], correct: "Meitnerium", hint: "Named after Lise Meitner" },
    { id: 109, quest: "Ds", row: 7, col: 10, options: ["Darmstadtium", "Dysprosium", "Dubnium", "Deuterium"], correct: "Darmstadtium", hint: "Synthetic element" },
    { id: 110, quest: "Rg", row: 7, col: 11, options: ["Roentgenium", "Rhodium", "Rhenium", "Radium"], correct: "Roentgenium", hint: "Named after Wilhelm Röntgen" },
    { id: 111, quest: "Cn", row: 7, col: 12, options: ["Copernicium", "Calcium", "Carbon", "Cadmium"], correct: "Copernicium", hint: "Named after Copernicus" },
    { id: 112, quest: "Nh", row: 7, col: 13, options: ["Nihonium", "Neon", "Nickel", "Niobium"], correct: "Nihonium", hint: "Named after Japan" },
    { id: 113, quest: "Fl", row: 7, col: 14, options: ["Flerovium", "Fluorine", "Fermium", "Francium"], correct: "Flerovium", hint: "Synthetic superheavy element" },
    { id: 114, quest: "Mc", row: 7, col: 15, options: ["Moscovium", "Magnesium", "Manganese", "Molybdenum"], correct: "Moscovium", hint: "Named after Moscow region" },
    { id: 115, quest: "Lv", row: 7, col: 16, options: ["Livermorium", "Lithium", "Lanthanum", "Lutetium"], correct: "Livermorium", hint: "Named after Livermore lab" },
    { id: 116, quest: "Ts", row: 7, col: 17, options: ["Tennessine", "Tin", "Titanium", "Tellurium"], correct: "Tennessine", hint: "Named after Tennessee" },
    { id: 117, quest: "Og", row: 7, col: 18, options: ["Oganesson", "Oxygen", "Osmium", "Osmiumium"], correct: "Oganesson", hint: "Heaviest noble gas" },
  ];

  const [shuffledData, setShuffledData] = useState(() => shuffleArray(elementData));
  const progress = shuffledData ? (currentLevel + 1) / shuffledData.length : 0;

  const [selectedElements, setSelectedElements] = useState(() => Array.from({ length: 118 }, (_, i) => i));

  const toggleElement = (id) => {
    if (selectedElements.includes(id)) {
      setSelectedElements(selectedElements.filter(item => item !== id));
    } else {
      setSelectedElements([...selectedElements, id]);
    }
  };

  const selectAll = () => setSelectedElements(Array.from({ length: 118 }, (_, i) => i));
  const deselectAll = () => setSelectedElements([]);

  const ProgressBar = ({ progress }) => {
    return (
      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    );
  };

  const startGame = () => {
    setShuffledData(shuffleArray(elementData.filter((element) => selectedElements.includes(element.id))));
    setCurrentLevel(0);
    setScore(0);
    setShowHint(false);
    setTotalAnswered(0);
    setTotalCorrect(0);
    setScreen('game');
  };

  const handleAnswer = (selectedId) => {
    if (selectedAnswer !== null) return;

    const correctElement = shuffledData[currentLevel].correct;
    const userIsCorrect = selectedId === correctElement;

    if (hapticsEnabled) {
      if (userIsCorrect) {
        Haptics.selectionAsync();
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }

    setSelectedAnswer(selectedId);
    setIsCorrect(userIsCorrect);

    setTotalAnswered(prev => prev + 1);
    if (userIsCorrect) {
      let points = showHint ? 0.5 : 1;
      setScore(prev => prev + points);
      setTotalCorrect(prev => prev + 1);
    } else {
      setScore(prev => prev - 1);
    }

    setTimeout(() => {
      if (currentLevel + 1 < shuffledData.length) {
        setCurrentLevel(currentLevel + 1);
        setShowHint(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setScreen('end');
        setShowHint(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }, 600);
  };

  // --- SCREEN RENDERING ---
  if (screen === 'home') {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.settingBtn}
          onPress={() => setIsSettingsVisible(true)}
        >
          <Text style={{ fontSize: 30 }}>⚙️</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Elementr</Text>

        <TouchableOpacity
          style={styles.elementLink}
          onPress={() => setIsPeriodicsVisible(true)}
        >
          <Text style={styles.buttonText}>Choose Elements</Text>
        </TouchableOpacity>

        {isPeriodicsVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose Elements</Text>
              <View style={styles.selectRow}>
                <TouchableOpacity style={styles.selectAllbtn} onPress={selectAll}>
                  <Text>Select All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deselectAllbtn} onPress={deselectAll}>
                  <Text>Deselect All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.tableContainer}>
                {elementData.map((element) => (
                  <TouchableOpacity
                    key={element.id}
                    onPress={() => toggleElement(element.id)}
                    style={[styles.tableCell, {
                      left: (element.col - 1) * 16,
                      top: (element.row - 1) * 16,
                      backgroundColor: selectedElements.includes(element.id) ? '#ADEBB3' : '#D3D3D3'
                    }]}
                  >
                    <Text style={{ fontSize: 9 }}>{element.quest}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setIsPeriodicsVisible(false)}>
                <Text style={styles.buttonText}>CLOSE</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.startBtn} onPress={startGame}>
          <Text style={styles.buttonText}>START</Text>
        </TouchableOpacity>

        {isSettingsVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Settings</Text>

              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setHapticsEnabled(!hapticsEnabled)}
              >
                <Text style={styles.modalText}>Vibrations</Text>
                <Text style={[styles.toggleStatus, { color: hapticsEnabled ? '#2ecc71' : '#e74c3c' }]}>
                  {hapticsEnabled ? "ON" : "OFF"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setIsSettingsVisible(false)}
              >
                <Text style={styles.buttonText}>CLOSE</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 1lxnaa. All Rights Reserved</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.notion.so/Elementr-Legal-314a61a077468081968ddebe33779c5a?source=copy_link')}
          >
            <Text style={styles.footerLinkText}>Privacy Policy & Terms</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (screen === 'end') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Well Done!</Text>
        <Text style={styles.scoreText}>Final Score: {totalCorrect + "/" + totalAnswered}</Text>
        <TouchableOpacity style={styles.startBtn} onPress={() => { setScore(0); setCurrentLevel(0); setScreen('home'); }}>
          <Text style={styles.buttonText}>PLAY AGAIN</Text>
        </TouchableOpacity>
        <Text style={styles.scoreText}>Accuracy: {currentAccuracy}%</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.question}>What is this element?</Text>
        <Text style={styles.elementName}>{shuffledData[currentLevel].quest}</Text>

        {showHint ? (
          <Text style={styles.hintBox}>💡 {shuffledData[currentLevel].hint}</Text>
        ) : (
          <TouchableOpacity onPress={() => setShowHint(true)}>
            <Text style={styles.hintLink}>Use Hint (-0.5 pts)</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.topHeader}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <ProgressBar progress={progress} />
      </View>

      <View style={styles.grid}>
        {shuffledData[currentLevel].options.map((optId) => {
          const isThisTheCorrectAnswer = optId === shuffledData[currentLevel].correct;
          const isThisTheUserSelection = selectedAnswer === optId;

          let buttonStyle = [styles.choiceBtn];

          if (selectedAnswer !== null) {
            if (isThisTheCorrectAnswer) {
              buttonStyle.push(styles.correctBtn);
            } else if (isThisTheUserSelection) {
              buttonStyle.push(styles.wrongBtn);
            }
          }

          return (
            <TouchableOpacity
              key={optId}
              style={buttonStyle}
              onPress={() => handleAnswer(optId)}
              disabled={selectedAnswer !== null}
            >
              <Text style={styles.buttonText}>{optId}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => {
          setScore(0);
          setCurrentLevel(0);
          setShuffledData(shuffleArray(elementData));
          setScreen('home');
        }}
      >
        <Text style={styles.homeText}>Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', padding: 20, paddingTop: 40 },
  title: { fontSize: 40, color: '#0c0d0d', fontWeight: 'bold', marginBottom: 50 },
  scoreText: { color: '#252525', fontSize: 24, fontWeight: 'bold' },
  card: { backgroundColor: '#ADEBB3', padding: 30, borderRadius: 20, width: '100%', alignItems: 'center', marginBottom: 40 },
  question: { color: '#0c0d0d', fontSize: 18 },
  elementName: { color: '#0c0d0d', fontSize: 48, fontWeight: 'bold', marginVertical: 10 },
  hintBox: { color: '#FFFFFF', fontSize: 18, marginTop: 10, fontStyle: 'italic' },
  hintLink: { color: '#3498db', marginTop: 15, textDecorationLine: 'underline' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  choiceBtn: { backgroundColor: '#ADEBB3', width: '44%', padding: 20, margin: '3%', borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#353839' },
  buttonText: { color: '#353839', fontSize: 16, fontWeight: 'bold' },
  startBtn: { backgroundColor: '#ADEBB3', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30 },
  footer: { position: 'absolute', bottom: 35, width: '100%', alignItems: 'center' },
  footerText: { fontSize: 10, color: '#000000', fontWeight: 'bold' },
  footerLinkText: { fontSize: 10, color: '#3498db', textDecorationLine: 'underline', marginTop: 5 },
  homeBtn: { backgroundColor: '#000000', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, marginTop: 100 },
  homeText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  progressBackground: { height: 20, width: '25%', backgroundColor: '#ddd', borderRadius: 10, overflow: 'hidden', marginVertical: 1 },
  progressFill: { height: '100%', backgroundColor: '#3498db', borderRadius: 10 },
  topHeader: { position: 'absolute', top: 45, height: 50, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15, zIndex: 1000 },
  correctBtn: { backgroundColor: '#2ecc71', borderColor: '#27ae60' },
  wrongBtn: { backgroundColor: '#e74c3c', borderColor: '#c0392b' },
  settingBtn: { position: 'absolute', top: 60, left: 30, zIndex: 10 },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  modalContent: { backgroundColor: '#FFFFFF', padding: 30, borderRadius: 25, width: '85%', alignItems: 'center', borderWidth: 2, borderColor: '#ADEBB3' },
  modalTitle: { fontSize: 28, fontWeight: 'bold', color: '#0c0d0d', marginBottom: 25 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20, backgroundColor: '#f8f8f8', borderRadius: 15, marginBottom: 25, borderWidth: 1, borderColor: '#ddd' },
  modalText: { fontSize: 18, fontWeight: '600', color: '#353839' },
  toggleStatus: { fontSize: 18, fontWeight: 'bold' },
  closeBtn: { backgroundColor: '#ADEBB3', paddingVertical: 15, borderRadius: 15, width: '100%', alignItems: 'center' },
  elementLink: { paddingVertical: 5, paddingHorizontal: 5, borderRadius: 40, alignItems: 'center', top: -5, marginBottom: 50, textDecorationLine: 'underline' },
  tableContainer: { width: 288, height: 160, position: 'relative' },
  tableCell: { position: 'absolute', width: 20, height: 20, justifyContent: 'center', alignItems: 'center', margin: -15 },
  selectRow: { flexDirection: 'row', width: '100%', margin: 20, justifyContent: 'space-around' },
  selectAllbtn: { padding: 8, borderRadius: 5 },
  deselectAllbtn: { padding: 8, borderRadius: 5 },
});