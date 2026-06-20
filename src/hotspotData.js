export const HOTSPOT_DATA = {
  shorts_blossom: {
    eyebrow: 'Signature Motif', title: 'Cherry Blossom Detail',
    desc: 'A cascade of sakura blossoms blooms from the lower-left corner of the shorts, echoing the jersey\'s shoulder motif and unifying the full kit.',
    specs: [['Placement','Lower left leg'],['Technique','Sublimation print'],['Colors','Sakura Pink + Gold accent']],
    swatches: ['#F0B8C8','#E898B0','#C9A86A','#0A1E42'],
    svgPreview: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="80" fill="#0A1E42" rx="8"/><g opacity="0.9"><ellipse cx="80" cy="45" rx="9" ry="6" fill="#F0B8C8" transform="rotate(-20,80,45)"/><ellipse cx="92" cy="38" rx="8" ry="5.5" fill="#E898B0" transform="rotate(15,92,38)"/><ellipse cx="74" cy="52" rx="8" ry="5" fill="#F5C5D0" transform="rotate(-45,74,52)"/><circle cx="83" cy="45" r="3" fill="#C9A86A"/></g><line x1="55" y1="65" x2="82" y2="43" stroke="#7A4858" stroke-width="1.8" opacity="0.8"/></svg>`
  },
  shorts_number: {
    eyebrow: 'Kit Numbering', title: 'Squad Number "26"',
    desc: 'Bold gold "26" marking the FIFA World Cup 2026 edition. Positioned at the lower-left thigh in traditional football kit style.',
    specs: [['Year','FIFA World Cup 2026'],['Font','Custom athletic bold'],['Color','Gold — #C9A86A'],['Position','Lower left thigh']],
    swatches: ['#C9A86A','#B8973A','#0A1E42','#162D5A'],
    svgPreview: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="80" fill="#0A1E42" rx="8"/><text x="100" y="58" text-anchor="middle" fill="#C9A86A" font-size="46" font-weight="bold" font-family="system-ui">26</text></svg>`
  },
  shorts_waves: {
    eyebrow: 'Textile Detail', title: 'Topographic Wave Lines',
    desc: 'Gold wave lines ripple across the shorts lower half, mirroring the ocean current patterns on the jersey. Subtle tone-on-tone at a distance, glowing gold in low light.',
    specs: [['Technique','Gold thread jacquard'],['Pattern','Pacific tidal currents'],['Visibility','Reflective in low light']],
    swatches: ['#C9A86A','#B8973A','#0A1E42','#0D2550'],
    svgPreview: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="80" fill="#0A1E42" rx="8"/><path d="M10,22 Q40,15 70,22 Q100,29 130,22 Q160,15 190,22" fill="none" stroke="#C9A86A" stroke-width="1.5" opacity="0.9"/><path d="M5,40 Q38,33 72,40 Q106,47 136,40 Q162,33 195,40" fill="none" stroke="#C9A86A" stroke-width="1.2" opacity="0.7"/><path d="M12,58 Q48,51 84,58 Q120,65 152,58 Q172,51 195,58" fill="none" stroke="#C9A86A" stroke-width="0.9" opacity="0.5"/></svg>`
  },
  shorts_hem: {
    eyebrow: 'Safety Feature', title: 'Reflective Hem Band',
    desc: 'Retroreflective hem band matching the jersey — activated in low-light for full-kit 360° player visibility. Gold accent stripe unifies the kit in daylight.',
    specs: [['Material','Retroreflective tape'],['Activation','0.1 lux threshold'],['Width','8mm continuous band']],
    swatches: ['#DDEEFF','#EEF4FF','#C9A86A','#0A1E42'],
    svgPreview: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="80" fill="#0A1E42" rx="8"/><rect x="10" y="46" width="180" height="14" fill="rgba(220,230,245,0.35)" rx="2"/><rect x="10" y="46" width="180" height="5" fill="rgba(255,255,255,0.8)" rx="2"/><rect x="10" y="59" width="180" height="3" fill="#C9A86A" opacity="0.9"/></svg>`
  },
  shorts_maple: {
    eyebrow: 'National Symbol', title: 'Back Maple Leaf',
    desc: 'Gold maple leaf centred on the back waistband — Canada\'s emblem anchoring the rear of the kit and complementing the jersey\'s chest emblem.',
    specs: [['Technique','Gold embroidery'],['Size','32mm'],['Position','Back centre waistband']],
    swatches: ['#C9A86A','#B8973A','#0A1E42','#162D5A'],
    svgPreview: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="80" fill="#0A1E42" rx="8"/><g transform="translate(100,40) scale(2.0)"><path d="M0,-18 L2.5,-8 L10,-9 L6.5,0 L14,7 L7,5.5 L8.5,14 L0,10 L-8.5,14 L-7,5.5 L-14,7 L-6.5,0 L-10,-9 L-2.5,-8 Z" fill="#C9A86A"/></g></svg>`
  },
  blossom: {
    eyebrow: 'Signature Motif', title: 'Cherry Blossoms',
    desc: 'Scattered sakura petals cascade across the upper left shoulder, symbolizing renewal, community, and the fleeting beauty of spring in Vancouver.',
    specs: [['Placement','Left shoulder cascade'],['Technique','Sublimation print'],['Colors','Sakura Pink + Gold accent']],
    swatches: ['#E7C7D3','#EDA0B5','#C9A96A','#F2F3F0'],
    imgPreview: 'images/cherryblossoms.png',
  },
  maple: {
    eyebrow: 'National Symbol', title: 'Embroidered Maple Leaf',
    desc: 'Gold embroidered maple leaf at the chest — Canada\'s icon. Gold thread catches light during play for a subtle shimmer effect.',
    specs: [['Technique','Gold thread embroidery'],['Size','38mm'],['Position','Left chest, 80mm from collar']],
    swatches: ['#C9A96A','#B8973A','#8C7228','#F2F3F0'],
    svgPreview: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="80" fill="#1a1a1a" rx="8"/><g transform="translate(100,40) scale(2.2)"><path d="M0,-18 L3,-8 L13,-10 L8,0 L16,8 L8,6 L10,16 L0,12 L-10,16 L-8,6 L-16,8 L-8,0 L-13,-10 L-3,-8 Z" fill="#C9A96A"/></g></svg>`
  },
  collar: {
    eyebrow: 'Cut & Construction', title: 'V-Collar Insert',
    desc: 'Modern V-insert collar with gold trim. Cut for athletic movement with gold edge detailing that ties the design language across all kit elements.',
    specs: [['Style','V-insert with trim'],['Material','Stretch woven'],['Accent','Gold satin edge tape']],
    swatches: ['#E8E9E5','#C9A96A','#F2F3F0','#0A2A5E'],
    svgPreview: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="80" fill="#e8e9e5" rx="8"/><path d="M70,10 L100,50 L130,10" fill="none" stroke="#C9A96A" stroke-width="3" stroke-linecap="round"/><path d="M70,10 Q100,5 130,10" fill="#d8d9d5" stroke="rgba(200,169,106,0.5)" stroke-width="1"/></svg>`
  },
  mountains: {
    eyebrow: 'Landscape Layer', title: 'Coast Mountains',
    desc: 'Topographic silhouettes of the Coast Mountains gradient from misty grey to deep navy. Three depth layers reflect the literal geography defining Vancouver\'s skyline.',
    specs: [['Technique','Tone-on-tone sublimation'],['Layers','3-depth parallax gradient'],['Colors','Fog White → Coast Grey → Pacific Blue']],
    swatches: ['#F2F3F5','#8B9AB0','#4A6A8A','#0A2A5E'],
    svgPreview: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7B8FA8" stop-opacity="0.5"/><stop offset="100%" stop-color="#0A2A5E"/></linearGradient></defs><rect width="200" height="80" fill="#BBC3CF" rx="8"/><path d="M0,55 L20,30 L40,42 L60,22 L80,38 L100,18 L120,30 L140,20 L160,34 L180,22 L200,30 L200,80 L0,80 Z" fill="url(#mg)"/><path d="M0,65 L25,48 L50,55 L75,42 L100,50 L125,40 L150,52 L175,44 L200,50 L200,80 L0,80 Z" fill="#0A2A5E" opacity="0.9"/></svg>`
  },
  waves: {
    eyebrow: 'Textile Detail', title: 'Ocean Wave Lines',
    desc: 'Fine gold thread weaves Pacific tidal current patterns across the lower jersey. Visible as topographic print in direct light.',
    specs: [['Technique','Gold thread jacquard'],['Pattern','Pacific tidal current flow'],['Visibility','Tone-on-tone + low-light glow']],
    swatches: ['#C9A96A','#B8973A','#0A2A5E','#061830'],
    svgPreview: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="80" fill="#0A2A5E" rx="8"/><path d="M10,20 Q40,13 70,20 Q100,27 130,20 Q160,13 190,20" fill="none" stroke="#C9A96A" stroke-width="1.5" opacity="0.9"/><path d="M5,38 Q38,31 72,38 Q106,45 136,38 Q162,31 195,38" fill="none" stroke="#C9A96A" stroke-width="1.2" opacity="0.7"/><path d="M12,56 Q48,49 84,56 Q120,63 152,56 Q172,49 195,56" fill="none" stroke="#C9A96A" stroke-width="0.9" opacity="0.5"/></svg>`
  },
  hem: {
    eyebrow: 'Safety Feature', title: 'Reflective Hem Band',
    desc: 'Retroreflective band running the full hem perimeter — activated in low-light for player visibility. Integrates with the gold accent stripe in daylight.',
    specs: [['Material','Retroreflective tape'],['Activation','0.1 lux threshold'],['Width','8mm continuous band']],
    swatches: ['#DDEEFF','#EEF4FF','#C9A96A','#0A2A5E'],
    svgPreview: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="80" fill="#061830" rx="8"/><rect x="10" y="45" width="180" height="14" fill="rgba(220,230,245,0.35)" rx="2"/><rect x="10" y="45" width="180" height="5" fill="rgba(255,255,255,0.8)" rx="2"/><rect x="10" y="59" width="180" height="3" fill="#C9A96A" opacity="0.9"/></svg>`
  },
  spine: {
    eyebrow: 'Reflective Detail', title: 'Spine Reflective Strip',
    desc: 'Full-length retroreflective strip down the centre back spine. 360° visibility at night, doubles as the Sea to Sky route line design motif.',
    specs: [['Length','Full torso ~350mm'],['Material','Retroreflective weave'],['Dual purpose','Safety + route line motif']],
    swatches: ['#DDEEFF','#EEF4FF','#C9A96A','#0A2A5E'],
    imgPreview: 'images/back.png',
  },
  mesh: {
    eyebrow: 'Construction Detail', title: 'Underarm Mesh Panel',
    desc: 'Breathable engineered mesh panels at the underarm and side seams allow airflow during high-intensity play, keeping the kit cool and lightweight.',
    specs: [['Material','Open-weave polyester mesh'],['Placement','Underarm & side panels'],['Function','Active ventilation']],
    swatches: ['#F2F3F0','#C9A96A','#0A2A5E','#8B9AB0'],
    imgPreview: 'images/mesh.png',
  },
  fabric: {
    eyebrow: 'Performance Material', title: 'Performance Knit',
    desc: 'Ultra-lightweight performance knit construction — moisture-wicking, four-way stretch, and designed to maintain shape through 90 minutes of play.',
    specs: [['Weight','120 gsm'],['Stretch','4-way'],['Tech','Moisture-wicking DryFit']],
    swatches: ['#F2F3F0','#C9A96A','#0A2A5E','#061830'],
    imgPreview: 'images/material.png',
  },
  tag: {
    eyebrow: 'Care & Edition', title: 'Care & Edition Tag',
    desc: 'Woven care label on the lower left interior hem — includes FIFA World Cup 2026 edition number, care instructions, and the Vancouver host city mark.',
    specs: [['Edition','FIFA World Cup 2026'],['Location','Lower left interior hem'],['Detail','Host city mark + care icons']],
    swatches: ['#C9A96A','#0A2A5E','#fff','#1a1a1a'],
    imgPreview: 'images/tag.png',
  },
  route: {
    eyebrow: 'Narrative Line', title: 'Sea to Sky Route',
    desc: 'Dashed gold line tracing the Sea to Sky Highway from Vancouver through Squamish to Whistler. Glows in low light as a reflective element.',
    specs: [['Route','Vancouver → Squamish → Whistler'],['Length','~120km mapped to 280mm'],['Effect','Reflective glow at night']],
    swatches: ['#C9A96A','#B8973A','#fff','#0A2A5E'],
    svgPreview: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="80" fill="#061830" rx="8"/><path d="M100,8 Q103,28 99,48 Q97,60 100,72" fill="none" stroke="#C9A96A" stroke-width="2.5" stroke-dasharray="6,5"/><circle cx="100" cy="10" r="4" fill="#C9A96A"/><text x="110" y="14" fill="#C9A96A" font-size="8">WHISTLER</text><circle cx="99" cy="46" r="3.5" fill="#C9A96A"/><text x="108" y="50" fill="#C9A96A" font-size="7">SQUAMISH</text><circle cx="100" cy="72" r="4" fill="#C9A96A"/><text x="62" y="76" fill="#C9A96A" font-size="7">VANCOUVER</text></svg>`
  },
  coords: {
    eyebrow: 'Woven Label', title: 'Coordinate Tag',
    desc: 'Custom woven label on the inner back hem: 49.2827° N, 123.1207° W — the exact GPS coordinates of Vancouver city centre.',
    specs: [['Coordinates','49.2827° N / 123.1207° W'],['Technique','Woven jacquard label'],['Location','Inner back hem']],
    swatches: ['#C9A96A','#0A2A5E','#fff','#1a1a1a'],
    svgPreview: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="80" fill="#1a1a1a" rx="8"/><rect x="55" y="8" width="90" height="64" rx="6" fill="#0A2A5E" stroke="#C9A96A" stroke-width="0.8"/><g transform="translate(100,32) scale(0.9)"><path d="M0,-12 L2,-5 L9,-7 L5,0 L11,5 L5,4 L7,11 L0,8 L-7,11 L-5,4 L-11,5 L-5,0 L-9,-7 L-2,-5 Z" fill="#C9A96A"/></g><text x="100" y="54" text-anchor="middle" fill="#fff" font-size="7">49.2827° N</text><text x="100" y="65" text-anchor="middle" fill="#C9A96A" font-size="7">123.1207° W</text></svg>`
  },
}
