const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  'hot-stock', 'lm2500', 'lm6000', 'lm9000', 'lms100', 'lm500', 'lm1600', 'lm-series',
  'ge-frame-5-6-7-9', 'siemens', 'alstom', 'ansaldo', 'solar-turbines', 'bently-nevada', 'ge-modules',
  'blades-nozzles', 'combustion', 'fuel-systems', 'control-systems', 'bearings-seals', 'sensors', 'accessories'
];

const CONDITIONS = ['New', 'Used', 'Refurbished', 'Overhauled'];
const STOCK_STATUSES = ['In Stock', 'On Order', 'Obsolete', 'Limited'];

const MANUFACTURER_MAP = {
  'lm2500': 'GE Aviation',
  'lm6000': 'GE Aviation',
  'lm9000': 'GE Aviation',
  'lms100': 'GE Power',
  'lm500': 'GE Aviation',
  'lm1600': 'GE Aviation',
  'lm-series': 'GE Aviation',
  'ge-frame-5-6-7-9': 'GE Power Services',
  'siemens': 'Siemens Energy',
  'alstom': 'Alstom Power',
  'ansaldo': 'Ansaldo Energia',
  'solar-turbines': 'Solar Turbines (CAT)',
  'bently-nevada': 'Bently Nevada (Baker Hughes)',
  'ge-modules': 'GE Digital / GE Vernova',
  'hot-stock': 'Various',
  'blades-nozzles': 'Various',
  'combustion': 'Various',
  'fuel-systems': 'Various',
  'control-systems': 'Various',
  'bearings-seals': 'Various',
  'sensors': 'Various',
  'accessories': 'Various'
};

const CATEGORY_FSG = {
  'hot-stock': '28', 'lm2500': '28', 'lm6000': '28', 'lm9000': '28', 'lms100': '28', 'lm500': '28', 'lm1600': '28',
  'lm-series': '28', 'ge-frame-5-6-7-9': '28', 'siemens': '28', 'alstom': '28', 'ansaldo': '28', 'solar-turbines': '28',
  'bently-nevada': '66', 'ge-modules': '61',
  'blades-nozzles': '28', 'combustion': '28', 'fuel-systems': '29', 'control-systems': '61',
  'bearings-seals': '31', 'sensors': '66', 'accessories': '28'
};

const CATEGORY_FSC = {
  'hot-stock': '2835', 'lm2500': '2840', 'lm6000': '2840', 'lm9000': '2840', 'lms100': '2840',
  'lm500': '2840', 'lm1600': '2840', 'lm-series': '2840',
  'ge-frame-5-6-7-9': '2835', 'siemens': '2835', 'alstom': '2835', 'ansaldo': '2835', 'solar-turbines': '2835',
  'bently-nevada': '6680', 'ge-modules': '6110',
  'blades-nozzles': '2840', 'combustion': '2835', 'fuel-systems': '2915', 'control-systems': '6110',
  'bearings-seals': '3120', 'sensors': '6685', 'accessories': '2840'
};

const PART_PREFIX = {
  'hot-stock': ['HS', 'HOT', 'STK'],
  'lm2500': ['LM2K', 'LM25', 'L250'],
  'lm6000': ['LM6K', 'LM60', 'L600'],
  'lm9000': ['LM9K', 'LM90', 'L900'],
  'lms100': ['LMS', 'LS10', 'L100'],
  'lm500': ['LM5H', 'LM50', 'L500'],
  'lm1600': ['LM16', 'L160', 'LM1K'],
  'lm-series': ['LMSR', 'LMSX', 'LMA'],
  'ge-frame-5-6-7-9': ['GEF', 'GFR', 'GEH'],
  'siemens': ['SGT', 'SIE', 'SGA'],
  'alstom': ['ALS', 'ALM', 'ALT'],
  'ansaldo': ['ANS', 'AEV', 'AND'],
  'solar-turbines': ['SOL', 'STR', 'STM'],
  'bently-nevada': ['BNV', 'BNT', 'BEN'],
  'ge-modules': ['GEM', 'GDC', 'MKD'],
  'blades-nozzles': ['BLD', 'NOZ', 'BAN'],
  'combustion': ['CMB', 'CBT', 'CCP'],
  'fuel-systems': ['FSY', 'FUE', 'FLS'],
  'control-systems': ['CTL', 'CON', 'MKS'],
  'bearings-seals': ['BRS', 'SEL', 'BNS'],
  'sensors': ['SNS', 'SRT', 'TRD'],
  'accessories': ['ACC', 'ACP', 'AXY']
};

const DESCRIPTIONS = {
  'hot-stock': [
    'High-demand turbine blade assembly, immediate dispatch',
    'Hot section nozzle segment, ready for shipping',
    'Urgent requirement — combustion liner assembly in stock',
    'Fuel nozzle assembly, available for instant dispatch',
    'Turbine rotor blade set, high-turnover item',
    'Exhaust diffuser section, rapid dispatch available',
    'Compressor stator vane ring, fast-track shipping',
    'Bearing housing assembly, hot stock item',
    'Cooling insert for stage 1 nozzle, in stock now',
    'Transition piece, high-demand gas turbine part'
  ],
  'lm2500': [
    'LM2500 gas generator turbine blade',
    'LM2500 power turbine nozzle assembly',
    'LM2500 compressor stator vane',
    'LM2500 fuel manifold assembly',
    'LM2500 bearing housing assembly',
    'LM2500 lube oil pump module',
    'LM2500 combustion chamber liner',
    'LM2500 fuel nozzle assembly',
    'LM2500 turbine disk assembly',
    'LM2500 air seal ring segment'
  ],
  'lm6000': [
    'LM6000 gas generator blade set',
    'LM6000 power turbine vane assembly',
    'LM6000 compressor rotor blade',
    'LM6000 fuel metering unit',
    'LM6000 bearing assembly',
    'LM6000 lube oil cooler core',
    'LM6000 combustion section assembly',
    'LM6000 fuel nozzle adapter',
    'LM6000 turbine shroud segment',
    'LM6000 air diffuser assembly'
  ],
  'lm9000': [
    'LM9000 stage 1 turbine blade',
    'LM9000 combustion section liner',
    'LM9000 compressor discharge seal',
    'LM9000 fuel injection nozzle',
    'LM9000 turbine exhaust frame',
    'LM9000 bearing support assembly',
    'LM9000 lube oil scavenge pump',
    'LM9000 variable guide vane actuator',
    'LM9000 thermocouple harness assembly',
    'LM9000 air bleed valve assembly'
  ],
  'lms100': [
    'LMS100 intercooler core assembly',
    'LMS100 power turbine blade set',
    'LMS100 compressor bell mouth',
    'LMS100 fuel control valve assembly',
    'LMS100 bearing housing kit',
    'LMS100 lube oil filter element',
    'LMS100 combustion can assembly',
    'LMS100 fuel distribution block',
    'LMS100 turbine inlet temperature sensor',
    'LMS100 interstage seal assembly'
  ],
  'lm500': [
    'LM500 marine gas turbine blade',
    'LM500 compressor impeller assembly',
    'LM500 fuel nozzle assembly',
    'LM500 oil sump seal kit',
    'LM500 turbine nozzle ring',
    'LM500 reduction gear bearing set',
    'LM500 lube oil pump seal',
    'LM500 combustion chamber segment',
    'LM500 fuel control actuator',
    'LM500 exhaust collector assembly'
  ],
  'lm1600': [
    'LM1600 compressor blade set',
    'LM1600 turbine vane assembly',
    'LM1600 fuel manifold assembly',
    'LM1600 bearing assembly journal',
    'LM1600 lube oil strainer element',
    'LM1600 combustion section seal ring',
    'LM1600 fuel injection nozzle assembly',
    'LM1600 air seal kit',
    'LM1600 turbine disk retaining nut',
    'LM1600 accessory gearbox assembly'
  ],
  'lm-series': [
    'LM series universal fuel nozzle',
    'LM series compressor bleed valve',
    'LM series bearing adapter assembly',
    'LM series lube oil filter assembly',
    'LM series combustion chamber gasket',
    'LM series fuel line coupling assembly',
    'LM series turbine tip seal segment',
    'LM series air starter adapter',
    'LM series vibration sensor adapter',
    'LM series sump pressurization valve'
  ],
  'ge-frame-5-6-7-9': [
    'GE Frame 5 stage 1 bucket assembly',
    'GE Frame 6 combustion liner set',
    'GE Frame 7 transition piece assembly',
    'GE Frame 9 turbine blade row 1',
    'GE Frame 5 compressor rotor blade',
    'GE Frame 6 fuel nozzle assembly',
    'GE Frame 7 cross-fire tube assembly',
    'GE Frame 9 exhaust diffuser section',
    'GE Frame 5 bearing housing assembly',
    'GE Frame 6 inlet guide vane assembly'
  ],
  'siemens': [
    'Siemens SGT-400 combustion liner',
    'Siemens SGT-600 fuel nozzle assembly',
    'Siemens SGT-700 turbine blade set',
    'Siemens SGT-800 compressor vane',
    'Siemens SGT-A45 power turbine disc',
    'Siemens SGT-PAC air intake filter',
    'Siemens SGT-100 bearing assembly',
    'Siemens SGT-200 lube oil cooler',
    'Siemens SGT-300 fuel control valve',
    'Siemens SGT-500 thermocouple assembly'
  ],
  'alstom': [
    'Alstom GT13E2 combustion chamber',
    'Alstom GT11N2 turbine blade set',
    'Alstom GT8C2 fuel nozzle assembly',
    'Alstom GT24 compressor stator vane',
    'Alstom GT26 turbine inlet casing',
    'Alstom KA24 heat recovery section',
    'Alstom GT8C2 bearing assembly',
    'Alstom GT13E2 burner assembly',
    'Alstom GT11N2 exhaust diffuser',
    'Alstom GT26 fuel lance assembly'
  ],
  'ansaldo': [
    'Ansaldo AE64.3A combustion liner',
    'Ansaldo AE94.2 turbine blade assembly',
    'Ansaldo AE64.3A fuel nozzle set',
    'Ansaldo AE94.3A compressor stator',
    'Ansaldo AE64.3A bearing housing',
    'Ansaldo AE94.2 lube oil module',
    'Ansaldo AE64.3A transition piece',
    'Ansaldo AE94.3A inlet guide vane',
    'Ansaldo AE64.3A exhaust frame',
    'Ansaldo AE94.2 cooling air seal'
  ],
  'solar-turbines': [
    'Solar Taurus 60 combustion liner',
    'Solar Titan 130 turbine blade set',
    'Solar Mars 100 fuel nozzle assembly',
    'Solar Taurus 70 compressor rotor',
    'Solar Titan 250 bearing housing',
    'Solar Mars 90 lube oil pump',
    'Solar Taurus 60 fuel control module',
    'Solar Saturn 20 turbine nozzle ring',
    'Solar Titan 130 air seal assembly',
    'Solar Mars 100 exhaust collector'
  ],
  'bently-nevada': [
    'Bently Nevada 3300 XL proximity probe',
    'Bently Nevada 3500/42M vibration monitor',
    'Bently Nevada 330930-14-00-05 probe assembly',
    'Bently Nevada 3500/20 interface module',
    'Bently Nevada 330780-50-00 seal assembly',
    'Bently Nevada 3500/40M position monitor',
    'Bently Nevada 330101-12-02-01 extension cable',
    'Bently Nevada 3500/15 power supply module',
    'Bently Nevada 330876-01-05-01 velocity sensor',
    'Bently Nevada 3500/61 temperature monitor'
  ],
  'ge-modules': [
    'GE Mark V IS200AEPAH1B I/O processor',
    'GE Mark VI IS210BPPBH2B power supply',
    'GE Mark VIe IS220PAICH2A analog I/O',
    'GE Mark V IS215UCVEM10 controller',
    'GE Mark VI IS230TAIH2C terminal board',
    'GE Mark VIe IS420UCSCH1C controller',
    'GE EX2100 IS200EXTSG1A exciter board',
    'GE Mark V IS200JPDGH2A servo driver',
    'GE Mark VI IS210MACCH2A relay module',
    'GE Mark VIe IS430PPICH2A pulse processor'
  ],
  'blades-nozzles': [
    'Stage 1 turbine blade — cobalt alloy',
    'Stage 2 nozzle guide vane assembly',
    'Stage 3 turbine blade — Inconel 738',
    'Stage 1 nozzle segment assembly',
    'Stage 4 turbine blade set',
    'Stage 2 turbine blade — directionally solidified',
    'Stage 3 nozzle guide vane segment',
    'Stage 1 blade shroud assembly',
    'Stage 4 nozzle ring segment',
    'Turbine blade damper assembly'
  ],
  'combustion': [
    'Combustion liner assembly — stainless steel',
    'Cross-fire tube assembly',
    'End cap combustion cover',
    'Fuel nozzle tip assembly',
    'Combustion basket assembly',
    'Primary combustion zone liner',
    'Secondary combustion liner segment',
    'Spark plug igniter assembly',
    'Flame detector sensor assembly',
    'Combustion casing seal ring'
  ],
  'fuel-systems': [
    'Fuel pump assembly — high pressure',
    'Fuel metering valve assembly',
    'Fuel manifold distribution block',
    'Fuel nozzle adapter gasket',
    'Fuel pressure regulator assembly',
    'Fuel filter element — duplex',
    'Fuel line coupling assembly',
    'Fuel shut-off valve actuator',
    'Fuel flow divider assembly',
    'Fuel injection manifold assembly'
  ],
  'control-systems': [
    'Mark V speedtronic control card',
    'Mark VI turbine controller module',
    'Mark VIe safety over-ride board',
    'EX2100 excitation control module',
    'Speedtronic I/O processor card',
    'Mark V servo valve driver board',
    'Mark VI relay output module',
    'Mark VIe analog input module',
    'Turbine control power supply unit',
    'Turbine protection system module'
  ],
  'bearings-seals': [
    'Journal bearing assembly — tilting pad',
    'Thrust bearing assembly — tapered land',
    'Carbon seal ring assembly',
    'Labyrinth seal segment set',
    'Bearing housing o-ring kit',
    'Oil deflector seal assembly',
    'Bearing isolator seal ring',
    'Float carbon seal assembly',
    'Babbitt-lined bearing shell',
    'Ball bearing assembly — angular contact'
  ],
  'sensors': [
    'RTD temperature sensor — exhaust gas',
    'Pressure transmitter assembly',
    'Speed pick-up sensor assembly',
    'Flame scanner sensor assembly',
    'Vibration accelerometer probe',
    'Thermocouple harness assembly',
    'Level transmitter assembly',
    'Flow meter sensor assembly',
    'Gas detector sensor head',
    'Position feedback sensor assembly'
  ],
  'accessories': [
    'Gasket set — turbine access cover',
    'Oil cooler core assembly',
    'Air intake filter element',
    'Coupling hub assembly',
    'Flex hose assembly',
    'Drain valve assembly',
    'Access door hinge assembly',
    'Filter element — hydraulic return',
    'Mounting bracket — sensor adapter',
    'Drain pan assembly'
  ]
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateNSN(index) {
  const groups = [
    String(randomInt(10, 99)).padStart(2, '0'),
    String(randomInt(100, 999)).padStart(3, '0'),
    String(randomInt(1000, 9999)).padStart(4, '0'),
    String(randomInt(1000, 9999)).padStart(4, '0')
  ];
  return groups.join('-');
}

function generateCAGE() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateId(index) {
  return `prod-${String(1000 + index).padStart(5, '0')}`;
}

function generateDatasheetUrl(partNumber) {
  return partNumber ? `/datasheets/${partNumber.toLowerCase()}.pdf` : undefined;
}

function generateSpecifications(category) {
  const specs = {
    material: randomElement(['Inconel 718', 'Inconel 738', 'Hastelloy X', 'Stainless 321', 'Stainless 347', 'Cobalt L605', 'Waspaloy', 'Titanium 6Al-4V', 'Nitronic 50', 'A286 SS']),
    weight: `${(Math.random() * 50 + 0.5).toFixed(1)} lbs`,
    dimensions: `${randomInt(10, 500)}x${randomInt(10, 500)}x${randomInt(5, 200)} mm`,
    operatingTemp: `${randomInt(500, 2200)}°F`,
    certifications: [randomElement(['AS9120', 'ISO 9001', 'MIL-I-45208', 'AMS 2750', 'AS9100'])]
  };
  return specs;
}

function generateTags(category, manufacturer) {
  const base = [category, manufacturer.toLowerCase().replace(/\s+/g, '-'), 'gas-turbine', 'spare-parts'];
  if (category.includes('lm')) base.push('aero-derivative');
  if (category.includes('frame')) base.push('heavy-duty');
  if (category === 'hot-stock') base.push('quick-ship');
  return base;
}

console.log('Generating product data...');

const products = [];
let idCounter = 0;

for (const category of CATEGORIES) {
  const manufacturer = MANUFACTURER_MAP[category];
  const fsg = CATEGORY_FSG[category];
  const fsc = CATEGORY_FSC[category];
  const prefixes = PART_PREFIX[category];
  const descs = DESCRIPTIONS[category];

  for (let i = 0; i < 100; i++) {
    idCounter++;
    const prefix = randomElement(prefixes);
    const partNum = `${prefix}-${String(randomInt(1000, 9999)).padStart(4, '0')}${String.fromCharCode(65 + randomInt(0, 5))}`;
    const desc = descs[i % descs.length];
    const shortDesc = desc;
    const condition = randomElement(CONDITIONS);
    const stockStatus = randomElement(STOCK_STATUSES);

    products.push({
      id: generateId(idCounter),
      nsn: generateNSN(idCounter),
      cage: generateCAGE(),
      partNumber: partNum,
      description: `${desc}. OEM specification compliant. Full material traceability available. Suitable for gas turbine maintenance and overhaul applications.`,
      shortDescription: shortDesc,
      fsg,
      fsc,
      category,
      manufacturer,
      condition,
      stockStatus,
      quantityAvailable: stockStatus === 'In Stock' ? randomInt(1, 250) : stockStatus === 'Limited' ? randomInt(1, 10) : 0,
      unitPrice: randomInt(150, 95000),
      currency: 'USD',
      datasheetUrl: generateDatasheetUrl(partNum),
      imageUrl: undefined,
      crossReferences: [
        `${prefix}${randomInt(1000, 9999)}`,
        `${randomElement(prefixes)}-${randomInt(1000, 9999)}`
      ],
      specifications: generateSpecifications(category),
      tags: generateTags(category, manufacturer),
      createdAt: new Date(Date.now() - randomInt(0, 365 * 3) * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - randomInt(0, 90) * 86400000).toISOString()
    });
  }
}

const outputPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
console.log(`✅ Generated ${products.length} products across ${CATEGORIES.length} categories`);
console.log(`   File written to: ${outputPath}`);
