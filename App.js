import * as Haptics from 'expo-haptics';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Linking } from 'react-native';
import { injectSpeedInsights } from "@vercel/speed-insights";
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
  const [screen, setScreen] = useState('home'); // 'home', 'game', 'end'
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const currentAccuracy = totalAnswered > 0 
    ? ((totalCorrect / totalAnswered) * 100).toFixed(1) 
    : "0.0";

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  // --- EXTRACTED DATA ---
  const elementData = [
    { id: 0, quest: "H", options: ["Halogens", "Helium", "Mercury", "Hydrogen"], correct: "Hydrogen", hint: "Found in water" },
    { id: 1, quest: "He", options: ["Helium", "Hydrogen", "Hafnium", "Mercury"], correct: "Helium", hint: "Used in balloons" },
    { id: 2, quest: "Li", options: ["Lanthanum", "Livermorium", "Lithium", "Lutetium"], correct: "Lithium", hint: "Used in phone batteries" },
    { id: 3, quest: "Be", options: ["Barium", "Beryllium", "Bismuth", "Bromine"], correct: "Beryllium", hint: "Found in emeralds" },
    { id: 4, quest: "B", options: ["Beryllium", "Boron", "Bromine", "Bismuth"], correct: "Boron", hint: "Can be found in detergents" },
    { id: 5, quest: "C", options: [ "Calcium", "Carbon", "Copper", "Cesium"], correct: "Carbon", hint: "We breathe this out" },
    { id: 6, quest: "N", options: ["Neon", "Sodium", "Nickel", "Nitrogen"], correct: "Nitrogen", hint: "Used to make dyes" },
    { id: 7, quest: "O", options: ["Osmium", "Oxygen", "Oganesson", "Iodine"], correct: "Oxygen", hint: "You breathe this in"},
    { id: 8, quest: "F", options: ["Francium", "Iron", "Flerovium", "Fluorine"], correct: "Fluorine", hint: "Used in toothpaste"},
    { id: 9, quest: "Ne", options: ["Nitrogen", "Neon", "Sodium", "Nickel"], correct: "Neon", hint: "Used in lighting"},
    { id: 10, quest: "Na", options: ["Sodium", "Nihonium", "Neon", "Nitrogen"], correct: "Sodium", hint: "Used to preserve food"},
    { id: 11, quest: "Mg", options: ["Manganese", "Meitnerium", "Magnesium", "Molybdenum"], correct: "Magnesium", hint: "Essential for health"},
    { id: 12, quest: "Al", options: ["Silver", "Arsenic", "Argon", "Aluminum"], correct: "Aluminum", hint: "Used to build cars"},
    { id: 13, quest: "Si", options: ["Silicon", "Selenium", "Tin", "Antimony"], correct: "Silicon", hint: "Used in semiconductor material in electronics"},
    { id: 14, quest: "P", options: ["Platinum", "Phosphorus", "Lead", "Palladium"], correct: "Phosphorus", hint: "Used in agriculture for fertilizers"},
    { id: 15, quest: "S", options: ["Silicon", "Scandium", "Tin", "Sulfur"], correct: "Sulfur", hint: "Used to control pests"},
    { id: 16, quest: "Cl", options: ["Chlorine", "Calcium", "Carbon", "Cobalt"], correct: "Chlorine", hint: "Eliminates bacteria"},
    { id: 17, quest: "Ar", options: ["Arsenic", "Silver", "Argon", "Astatine"], correct: "Argon", hint: "Protects metals from oxidation"},
    { id: 18, quest: "K", options: ["Krypton", "Xenon", "Kryptonite", "Potassium"], correct: "Potassium", hint: "Found in bananas"},
    { id: 19, quest: "Ca", options: ["Cobalt", "Calcium", "Copper", "Carbon"], correct: "Calcium", hint: "Makes up your bones"},
    { id: 20, quest: "Sc", options: ["Scandium", "Samarium", "Argon", "Astatine"], correct: "Scandium", hint: "Essential in high-intensity lighting"},
    { id: 21, quest: "Ti", options: ["Tin", "Thallium", "Tungsten", "Titanium"], correct: "Titanium", hint: "Lightweight yet has high-strength"},
    { id: 22, quest: "V", options: ["Yttrium", "Vanadium", "Ytterbium", "Uranium"], correct: "Vanadium", hint: "Strengthens steel alloys"},
    { id: 23, quest: "Cr", options: ["Chromium", "Copper", "Cerium", "Curium"], correct: "Chromium", hint: "Used to produce stainless steel"},
    { id: 24, quest: "Mn", options: ["Meitnerium", "Moscovium", "Magnesium", "Manganese"], correct: "Manganese", hint: "Essential for Modern Industry"},
    { id: 25, quest: "Fe", options: ["Iron", "Copper", "Gold", "Silver"], correct: "Iron", hint: "Used to make lasting tools"},
    { id: 26, quest: "Co", options: ["Copper", "Cobalt", "Chlorine", "Cadmium"], correct: "Cobalt", hint: "Found in lithium batteries"},
    { id: 27, quest: "Ni", options: ["Nitrogen", "Neon", "Sodium", "Nickel"], correct: "Nickel", hint: "a form of currency"},
    { id: 28, quest: "Cu", options: ["Cobalt", "Cerium", "Copper", "Curium"], correct: "Copper", hint: "Used for electrical wiring"},
    { id: 29, quest: "Zn", options: ["Zinc", "Thallium", "Zirconium", "Titanium"], correct: "Zinc", hint: "Essential for human health"},
    { id: 30, quest: "Ga", options: ["Germanium", "Gadolinium", "Gallium", "Garcon"], correct: "Gallium", hint: "Used to create semiconductors"},
    { id: 31, quest: "Ge", options: ["Gallium", "Garcon", "Germanium", "Gadolinium"], correct: "Germanium", hint: "In fiber-optic systems"},
    { id: 32, quest: "As", options: ["Argon", "Arsenic", "Aluminum", "Gold"], correct: "Arsenic", hint: "natural yet toxic chemical element"},
    { id: 33, quest: "Se", options: ["Silicon", "Selenide", "Antimony", "Selenium"], correct: "Selenium", hint: "Essential for human health"},
    { id: 34, quest: "Br", options: ["Bromine", "Bohrium", "Boron", "Bismuth"], correct: "Bromine", hint: "Used for water treatment in pools"},
    { id: 35, quest: "Kr", options: ["Potassium", "Kryptonite", "Krypton", "Xenon"], correct: "Krypton", hint: "Used in specialized lasers"},
    { id: 36, quest: "Rb", options: ["Rhodium", "Rubidium", "Rhenium", "Radium"], correct: "Rubidium", hint: "An Alkali Metal"},
    { id: 37, quest: "Sr", options: ["Silicon", "Selenide", "Tin", "Strontium"], correct: "Strontium", hint: "Creates the red in fireworks"},
    { id: 38, quest: "Y", options: ["Mercury", "Yttrium", "Uranium", "Ytterbium"], correct: "Yttrium", hint: "produces red phosphors for LEDs"},
    { id: 39, quest: "Zr", options: ["Zinc", "Sodium", "Zirconium", "Antimony"], correct: "Zirconium", hint: "Used in nuclear reactors for cladding fuel rods"},
    { id: 40, quest: "Nb", options: ["Nickel", "Sodium", "Nihonium", "Niobium"], correct: "Niobium", hint: "Used in automotive industries"},
    { id: 41, quest: "Mo", options: ["Manganese", "Molybdenum", "Mendelevium", "Meitnerium"], correct: "Molybdenum", hint: "Strengthens steel"},
    { id: 42, quest: "Tc", options: ["Technetium", "Titanium", "Tellurium", "Thallium"], correct: "Technetium", hint: "Used in nuclear medicine for imaging"},
    { id: 43, quest: "Ru", options: ["Rhodium", "Ruthenium", "Radon", "Rubidium"], correct: "Ruthenium", hint: "Hardens platinum and palladium alloys"},
    { id: 44, quest: "Rh", options: ["Rhodium", "Ruthenium", "Radon", "Rubidium"], correct: "Rhodium", hint: "Corrosion resistant metal"},
    { id: 45, quest: "Pd", options: ["Phosphorus", "Lead", "Platinum", "Palladium"], correct: "Palladium", hint: "Used primarily in catalytic converters"},
    { id: 46, quest: "Ag", options: ["Silver", "Copper", "Gold", "Emerald"], correct: "Silver", hint: "Used in electronics"},
    { id: 47, quest: "Cd", options: ["Calcium", "Caesium", "Cadmium", "Chromium"], correct: "Cadmium", hint: "Used in solar cells"},
    { id: 48, quest: "In", options: ["Indium", "Iridium", "Iodine", "Lithium"], correct: "Indium", hint: "Used for OLED displays"},
    { id: 49, quest: "Sn", options: ["Scandium", "Antimony", "Tin", "Samarium"], correct: "Tin", hint: "A component in solders"},
    { id: 50, quest: "Sb", options: ["Antimony", "Samarium", "Scandium", "Strontium"], correct: "Antimony", hint: "Used in flame retardants"},
    { id: 51, quest: "Te", options: ["Thallium", "Titanium", "Technetium", "Tellurium"], correct: "Tellurium", hint: "Used in solar panels"},
    { id: 52, quest: "I", options: ["Indium", "Iodine", "Lithium", "Iridium"], correct: "Iodine", hint: "Essential to produce thyroid hormones"},
    { id: 53, quest: "Xe", options: ["Xenon", "Potassium", "Krypton", "Neon"], correct: "Xenon", hint: "Used in specialized lighting"},
    { id: 54, quest: "Cs", options: ["Chlorine", "Cadmium", "Calcium", "Caesium"], correct: "Caesium", hint: "Used in high-precision atomic clocks"},
    { id: 55, quest: "Ba", options: ["Boron", "Bromine", "Barium", "Berkelium"], correct: "Barium", hint: "Medical contrast agent for x-rays"},
    { id: 56, quest: "La", options: ["Lanthanum", "Lithium", "Lutetium", "Lawrencium"], correct: "Lanthanum", hint: "Catalyst for petroleum cracking"},
    { id: 57, quest: "Ce", options: ["Carbon", "Cerium", "Chlorine", "Caesium"], correct: "Cerium", hint: "Alloy additive to improve metal"},
    { id: 58, quest: "Pr", options: ["Phosphorus", "Polonium", "Praseodymium", "Lead"], correct: "Praseodymium", hint: "Used in high strength magnets"},
    { id: 59, quest: "Nd", options: ["Niobium", "Nihonium", "Neodymium", "Sodium"], correct: "Neodymium", hint: "To create world's strongest magnets"},
    { id: 60, quest: "Pm", options: ["Promethium", "Praseodymium", "Palladium", "Lead"], correct: "Promethium", hint: "Has a radioactive glow"},
    { id: 61, quest: "Sm", options: ["Antimony", "Scandium", "Seaborgium", "Samarium"], correct: "Samarium", hint: "First element named after a person"},
    { id: 62, quest: "Eu", options: ["Iron", "Erbium", "Europium", "Einsteinium"], correct: "Europium", hint: "Used for banknote anti-counterfeiting"},
    { id: 63, quest: "Gd", options: ["Gadolinium", "Gallium", "Gadonium", "Germanium"], correct: "Gadolinium", hint: "Contrast agent in MRIs"},
    { id: 64, quest: "Tb", options: ["Terabyte", "Terabium", "Terbium", "Thulium"], correct: "Terbium", hint: "Intense green luminescence"},
    { id: 65, quest: "Dy", options: ["Darmstadtium", "Nihonium", "Neodymium", "Dysprosium"], correct: "Dysprosium", hint: "A soft silver"},
    { id: 66, quest: "Ho", options: ["Holmium", "Hassium", "Hafnium", "Helium"], correct: "Holmium", hint: "Strong magnetic properties"},
    { id: 67, quest: "Er", options: ["Erbium", "Europium", "Einsteinium", "Erium"], correct: "Erbium", hint: "Used in fiber optics"},
    { id: 68, quest: "Tm", options: ["Thulium", "Titanium", "Technetium", "Tellurium"], correct: "Thulium", hint: "Used in portable X-ray devices"},
    { id: 69, quest: "Yb", options: ["Ytterbium", "Yttrium", "Yttriumium", "Ytterium"], correct: "Ytterbium", hint: "Used in lasers"},
    { id: 70, quest: "Lu", options: ["Lutetium", "Lanthanum", "Lawrencium", "Lithium"], correct: "Lutetium", hint: "Used in PET scan detectors"},
    { id: 71, quest: "Hf", options: ["Hafnium", "Holmium", "Hassium", "Helium"], correct: "Hafnium", hint: "Used in nuclear control rods"},
    { id: 72, quest: "Ta", options: ["Tantalum", "Titanium", "Technetium", "Thallium"], correct: "Tantalum", hint: "Used in electronic capacitors"},
    { id: 73, quest: "W", options: ["Tungsten", "Tin", "Titanium", "Tantalum"], correct: "Tungsten", hint: "Highest melting point metal"},
    { id: 74, quest: "Re", options: ["Rhenium", "Radium", "Ruthenium", "Rhodium"], correct: "Rhenium", hint: "Used in jet engines"},
    { id: 75, quest: "Os", options: ["Osmium", "Oxygen", "Oganesson", "Osmiumium"], correct: "Osmium", hint: "Densest natural element"},
    { id: 76, quest: "Ir", options: ["Iridium", "Indium", "Iodine", "Iron"], correct: "Iridium", hint: "Very corrosion resistant"},
    { id: 77, quest: "Pt", options: ["Platinum", "Palladium", "Polonium", "Potassium"], correct: "Platinum", hint: "Used in jewelry and catalysts"},
    { id: 78, quest: "Au", options: ["Gold", "Silver", "Copper", "Aluminum"], correct: "Gold", hint: "Highly valuable precious metal"},
    { id: 79, quest: "Hg", options: ["Mercury", "Magnesium", "Manganese", "Meitnerium"], correct: "Mercury", hint: "Liquid metal at room temp"},
    { id: 80, quest: "Tl", options: ["Thallium", "Titanium", "Tellurium", "Tin"], correct: "Thallium", hint: "Highly toxic metal"},
    { id: 81, quest: "Pb", options: ["Lead", "Phosphorus", "Platinum", "Polonium"], correct: "Lead", hint: "Used in car batteries"},
    { id: 82, quest: "Bi", options: ["Bismuth", "Boron", "Barium", "Berkelium"], correct: "Bismuth", hint: "Used in medicines"},
    { id: 83, quest: "Po", options: ["Polonium", "Platinum", "Phosphorus", "Palladium"], correct: "Polonium", hint: "Highly radioactive"},
    { id: 84, quest: "At", options: ["Astatine", "Argon", "Arsenic", "Americium"], correct: "Astatine", hint: "Rarest naturally occurring element"},
    { id: 85, quest: "Rn", options: ["Radon", "Radium", "Ruthenium", "Rhenium"], correct: "Radon", hint: "Radioactive noble gas"},
    { id: 86, quest: "Fr", options: ["Francium", "Fermium", "Fluorine", "Flerovium"], correct: "Francium", hint: "Most reactive alkali metal"},
    { id: 87, quest: "Ra", options: ["Radium", "Rhenium", "Rubidium", "Rhodium"], correct: "Radium", hint: "Glows in the dark"},
    { id: 88, quest: "Ac", options: ["Actinium", "Americium", "Argon", "Arsenic"], correct: "Actinium", hint: "Highly radioactive metal"},
    { id: 89, quest: "Th", options: ["Thorium", "Thallium", "Titanium", "Technetium"], correct: "Thorium", hint: "Potential nuclear fuel"},
    { id: 90, quest: "Pa", options: ["Protactinium", "Palladium", "Platinum", "Polonium"], correct: "Protactinium", hint: "Very rare radioactive metal"},
    { id: 91, quest: "U", options: ["Uranium", "Ununium", "Uranite", "Uranus"], correct: "Uranium", hint: "Used in nuclear reactors"},
    { id: 92, quest: "Np", options: ["Neptunium", "Nickel", "Niobium", "Nitrogen"], correct: "Neptunium", hint: "First synthetic transuranium element"},
    { id: 93, quest: "Pu", options: ["Plutonium", "Polonium", "Palladium", "Platinum"], correct: "Plutonium", hint: "Used in nuclear weapons"},
    { id: 94, quest: "Am", options: ["Americium", "Aluminum", "Argon", "Actinium"], correct: "Americium", hint: "Used in smoke detectors"},
    { id: 95, quest: "Cm", options: ["Curium", "Calcium", "Cadmium", "Chromium"], correct: "Curium", hint: "Highly radioactive"},
    { id: 96, quest: "Bk", options: ["Berkelium", "Bismuth", "Boron", "Bromine"], correct: "Berkelium", hint: "Synthetic radioactive element"},
    { id: 97, quest: "Cf", options: ["Californium", "Copper", "Cobalt", "Carbon"], correct: "Californium", hint: "Used in neutron sources"},
    { id: 98, quest: "Es", options: ["Einsteinium", "Erbium", "Europium", "Erium"], correct: "Einsteinium", hint: "Named after Einstein"},
    { id: 99, quest: "Fm", options: ["Fermium", "Fluorine", "Francium", "Flerovium"], correct: "Fermium", hint: "Synthetic radioactive metal"},
    { id: 100, quest: "Md", options: ["Mendelevium", "Magnesium", "Molybdenum", "Meitnerium"], correct: "Mendelevium", hint: "Named after periodic table creator"},
    { id: 101, quest: "No", options: ["Nobelium", "Neon", "Nickel", "Niobium"], correct: "Nobelium", hint: "Named after Alfred Nobel"},
    { id: 102, quest: "Lr", options: ["Lawrencium", "Lanthanum", "Lutetium", "Lithium"], correct: "Lawrencium", hint: "Synthetic actinide element"},
    { id: 103, quest: "Rf", options: ["Rutherfordium", "Radium", "Rhenium", "Ruthenium"], correct: "Rutherfordium", hint: "Named after Rutherford"},
    { id: 104, quest: "Db", options: ["Dubnium", "Darmstadtium", "Dysprosium", "Deuterium"], correct: "Dubnium", hint: "Synthetic element" },
    { id: 105, quest: "Sg", options: ["Seaborgium", "Strontium", "Samarium", "Silicon"], correct: "Seaborgium", hint: "Named after Glenn Seaborg"},
    { id: 106, quest: "Bh", options: ["Bohrium", "Boron", "Bismuth", "Berkelium"], correct: "Bohrium", hint: "Named after Niels Bohr"},
    { id: 107, quest: "Hs", options: ["Hassium", "Holmium", "Hafnium", "Helium"], correct: "Hassium", hint: "Synthetic superheavy element"},
    { id: 108, quest: "Mt", options: ["Meitnerium", "Magnesium", "Manganese", "Molybdenum"], correct: "Meitnerium", hint: "Named after Lise Meitner"},
    { id: 109, quest: "Ds", options: ["Darmstadtium", "Dysprosium", "Dubnium", "Deuterium"], correct: "Darmstadtium", hint: "Synthetic element"},
    { id: 110, quest: "Rg", options: ["Roentgenium", "Rhodium", "Rhenium", "Radium"], correct: "Roentgenium", hint: "Named after Wilhelm Röntgen"},
    { id: 111, quest: "Cn", options: ["Copernicium", "Calcium", "Carbon", "Cadmium"], correct: "Copernicium", hint: "Named after Copernicus"},
    { id: 112, quest: "Nh", options: ["Nihonium", "Neon", "Nickel", "Niobium"], correct: "Nihonium", hint: "Named after Japan"},
    { id: 113, quest: "Fl", options: ["Flerovium", "Fluorine", "Fermium", "Francium"], correct: "Flerovium", hint: "Synthetic superheavy element"},
    { id: 114, quest: "Mc", options: ["Moscovium", "Magnesium", "Manganese", "Molybdenum"], correct: "Moscovium", hint: "Named after Moscow region"},
    { id: 115, quest: "Lv", options: ["Livermorium", "Lithium", "Lanthanum", "Lutetium"], correct: "Livermorium", hint: "Named after Livermore lab"},
    { id: 116, quest: "Ts", options: ["Tennessine", "Tin", "Titanium", "Tellurium"], correct: "Tennessine", hint: "Named after Tennessee"},
    { id: 117, quest: "Og", options: ["Oganesson", "Oxygen", "Osmium", "Osmiumium"], correct: "Oganesson", hint: "Heaviest noble gas"}
  ];

  const [shuffledData, setShuffledData] = useState(() => shuffleArray(elementData));

  const progress = shuffledData ? (currentLevel + 1) / shuffledData.length : 0;
  
  const ProgressBar = ({ progress }) => {
    return (
      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    );
  };

  const startGame = () => {
    setShuffledData(shuffleArray(elementData));
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
          <Text style={{fontSize: 30}}>⚙️</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Elementr</Text>

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
                <Text style={[styles.toggleStatus, {color: hapticsEnabled ? '#2ecc71' : '#e74c3c'}]}>
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
        <Text style={styles.scoreText}>Final Score: {totalCorrect + "/118"}</Text>
        <TouchableOpacity style={styles.startBtn} onPress={() => {setScore(0); setCurrentLevel(0); setScreen('home');}}>
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
          // 1. Identify the correct answer for the current level
          const isThisTheCorrectAnswer = optId === shuffledData[currentLevel].correct;
          const isThisTheUserSelection = selectedAnswer === optId;

          let buttonStyle = [styles.choiceBtn];

          // 2. Only apply "glow" logic if the user has actually made a choice
          if (selectedAnswer !== null) {
            if (isThisTheCorrectAnswer) {
              // Always glow the correct one green once answered
              buttonStyle.push(styles.correctBtn);
            } else if (isThisTheUserSelection) {
              // If this was picked but isn't correct, glow it red
              buttonStyle.push(styles.wrongBtn);
            }
          }

          return (
            <TouchableOpacity
              key={optId}
              style={buttonStyle}
              onPress={() => handleAnswer(optId)}
              disabled={selectedAnswer !== null} // Disable other buttons after clicking
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
  title: { fontSize: 40, color: '#0c0d0d', fontWeight: 'bold', marginBottom: 30 },
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
});