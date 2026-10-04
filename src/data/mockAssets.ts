// High-fidelity SVG Data URIs matching actual warehouse inspections
export const MOCK_EVIDENCES: Record<string, string> = {
  // 1. Inside Container Empty (Corrugated metal walls & wooden floor - exact like screenshot)
  kontainer_kosong: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <defs>
      <linearGradient id="wallL" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%238492a6"/><stop offset="100%" stop-color="%23475569"/></linearGradient>
      <linearGradient id="wallR" x1="1" y1="0" x2="0" y2="0"><stop offset="0%" stop-color="%2364748b"/><stop offset="100%" stop-color="%23334155"/></linearGradient>
      <linearGradient id="floor" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="%235c4033"/><stop offset="100%" stop-color="%231e293b"/></linearGradient>
    </defs>
    <rect width="600" height="600" fill="%230f172a"/>
    <!-- End wall -->
    <rect x="200" y="160" width="200" height="240" fill="%231e293b" stroke="%23334155" stroke-width="2"/>
    <!-- Floor -->
    <polygon points="0,600 600,600 400,400 200,400" fill="url(%23floor)"/>
    <!-- Left wall with corrugation ridges -->
    <polygon points="0,0 200,160 200,400 0,600" fill="url(%23wallL)"/>
    <line x1="30" y1="24" x2="30" y2="570" stroke="%2364748b" stroke-width="6"/>
    <line x1="70" y1="56" x2="70" y2="530" stroke="%2364748b" stroke-width="6"/>
    <line x1="110" y1="88" x2="110" y2="490" stroke="%2364748b" stroke-width="6"/>
    <line x1="150" y1="120" x2="150" y2="450" stroke="%2364748b" stroke-width="6"/>
    <!-- Right wall with corrugation -->
    <polygon points="600,0 400,160 400,400 600,600" fill="url(%23wallR)"/>
    <line x1="570" y1="24" x2="570" y2="570" stroke="%23475569" stroke-width="6"/>
    <line x1="530" y1="56" x2="530" y2="530" stroke="%23475569" stroke-width="6"/>
    <line x1="490" y1="88" x2="490" y2="490" stroke="%23475569" stroke-width="6"/>
    <line x1="450" y1="120" x2="450" y2="450" stroke="%23475569" stroke-width="6"/>
    <!-- Ceiling -->
    <polygon points="0,0 600,0 400,160 200,160" fill="%2394a3b8"/>
    <!-- Watermark -->
    <rect x="20" y="535" width="280" height="42" rx="6" fill="%23000000" opacity="0.8"/>
    <text x="30" y="562" fill="%2322c55e" font-family="monospace" font-size="14" font-weight="bold">✓ KONTAINER KOSONG (BERSIH)</text>
  </svg>`,

  // 2. Kontainer Terisi Setengah (50% Stacking in progress)
  kontainer_setengah: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="%230f172a"/>
    <!-- Container background -->
    <polygon points="0,600 600,600 400,400 200,400" fill="%23334155"/>
    <polygon points="0,0 200,160 200,400 0,600" fill="%23475569"/>
    <polygon points="600,0 400,160 400,400 600,600" fill="%23334155"/>
    <!-- Half-filled stack of cargo boxes / pallets at inner section -->
    <rect x="180" y="240" width="240" height="200" fill="%23d97706" stroke="%23b45309" stroke-width="3"/>
    <!-- Cardboard box grid lines -->
    <line x1="180" y1="290" x2="420" y2="290" stroke="%2378350f" stroke-width="2"/>
    <line x1="180" y1="340" x2="420" y2="340" stroke="%2378350f" stroke-width="2"/>
    <line x1="180" y1="390" x2="420" y2="390" stroke="%2378350f" stroke-width="2"/>
    <line x1="260" y1="240" x2="260" y2="440" stroke="%2378350f" stroke-width="2"/>
    <line x1="340" y1="240" x2="340" y2="440" stroke="%2378350f" stroke-width="2"/>
    <!-- Pallet bottom wood -->
    <rect x="175" y="440" width="250" height="22" fill="%2378350f"/>
    <!-- Half way badge -->
    <rect x="20" y="535" width="290" height="42" rx="6" fill="%23000000" opacity="0.85"/>
    <text x="30" y="562" fill="%23fbbf24" font-family="monospace" font-size="14" font-weight="bold">⏳ PROSES MUAT SETENGAH (50%)</text>
  </svg>`,

  // 3. Kontainer Terisi Penuh (100% Full cargo)
  kontainer_penuh: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="%231e293b"/>
    <!-- Full wall of stacked export boxes -->
    <rect x="60" y="100" width="480" height="430" rx="6" fill="%23b45309" stroke="%2378350f" stroke-width="4"/>
    <!-- Box grid -->
    <line x1="60" y1="180" x2="540" y2="180" stroke="%23451a03" stroke-width="3"/>
    <line x1="60" y1="260" x2="540" y2="260" stroke="%23451a03" stroke-width="3"/>
    <line x1="60" y1="340" x2="540" y2="340" stroke="%23451a03" stroke-width="3"/>
    <line x1="60" y1="420" x2="540" y2="420" stroke="%23451a03" stroke-width="3"/>
    <line x1="180" y1="100" x2="180" y2="530" stroke="%23451a03" stroke-width="3"/>
    <line x1="300" y1="100" x2="300" y2="530" stroke="%23451a03" stroke-width="3"/>
    <line x1="420" y1="100" x2="420" y2="530" stroke="%23451a03" stroke-width="3"/>
    <!-- Airbag dunnage / safety strapping -->
    <line x1="60" y1="100" x2="540" y2="530" stroke="%23fbbf24" stroke-width="4" stroke-dasharray="12,12"/>
    <line x1="540" y1="100" x2="60" y2="530" stroke="%23fbbf24" stroke-width="4" stroke-dasharray="12,12"/>
    <!-- Badge -->
    <rect x="20" y="535" width="280" height="42" rx="6" fill="%23000000" opacity="0.9"/>
    <text x="30" y="562" fill="%2322c55e" font-family="monospace" font-size="14" font-weight="bold">✓ TERISI PENUH 100% (52 BOK)</text>
  </svg>`,

  // 4. Serrico Bagian Luar - Sebelum Proses (Pest Monitoring Trap Exterior)
  serrico_luar_sebelum: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="%231e293b"/>
    <!-- Outer wall bracket near container door -->
    <rect x="80" y="100" width="440" height="420" rx="16" fill="%23334155" stroke="%23475569" stroke-width="4"/>
    <!-- Serrico Orange/White Card Trap mounted -->
    <rect x="180" y="130" width="240" height="340" rx="10" fill="%23ea580c" stroke="%23c2410c" stroke-width="4"/>
    <circle cx="300" cy="160" r="10" fill="%23ffffff"/>
    <rect x="205" y="190" width="190" height="200" fill="%23ffffff" rx="6"/>
    <rect x="215" y="205" width="170" height="24" fill="%237c2d12"/>
    <text x="240" y="222" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="12">SERRICO TRAP EXT</text>
    <!-- Barcode & QR -->
    <rect x="230" y="240" width="140" height="20" fill="%23000000"/>
    <rect x="260" y="275" width="80" height="80" fill="%230f172a"/>
    <rect x="270" y="285" width="25" height="25" fill="%23ffffff"/>
    <!-- Badge -->
    <rect x="20" y="535" width="360" height="42" rx="6" fill="%23000000" opacity="0.9"/>
    <text x="30" y="562" fill="%2338bdf8" font-family="monospace" font-size="13" font-weight="bold">SERRICO LUAR - SEBELUM PROSES</text>
  </svg>`,

  // 5. Serrico Bagian Luar - Sesudah Proses
  serrico_luar_sesudah: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="%231e293b"/>
    <rect x="80" y="100" width="440" height="420" rx="16" fill="%23334155" stroke="%23475569" stroke-width="4"/>
    <rect x="180" y="130" width="240" height="340" rx="10" fill="%23ea580c" stroke="%23c2410c" stroke-width="4"/>
    <rect x="205" y="190" width="190" height="200" fill="%23ffffff" rx="6"/>
    <rect x="215" y="205" width="170" height="24" fill="%2316a34a"/>
    <text x="235" y="222" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="12">SERRICO EXT - PASCA</text>
    <!-- Inspection stamp -->
    <circle cx="300" cy="300" r="45" fill="none" stroke="%2316a34a" stroke-width="4"/>
    <text x="265" y="305" fill="%2316a34a" font-family="sans-serif" font-weight="bold" font-size="12">INSPECTED</text>
    <!-- Badge -->
    <rect x="20" y="535" width="360" height="42" rx="6" fill="%23000000" opacity="0.9"/>
    <text x="30" y="562" fill="%2322c55e" font-family="monospace" font-size="13" font-weight="bold">✓ SERRICO LUAR - SESUDAH PROSES</text>
  </svg>`,

  // 6. Serrico Bagian Dalam - Sebelum Proses (Pest Monitoring Interior)
  serrico_dalam_sebelum: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="%230f172a"/>
    <!-- Corrugated container interior wall in background -->
    <line x1="100" y1="0" x2="100" y2="600" stroke="%23334155" stroke-width="12"/>
    <line x1="200" y1="0" x2="200" y2="600" stroke="%23334155" stroke-width="12"/>
    <line x1="400" y1="0" x2="400" y2="600" stroke="%23334155" stroke-width="12"/>
    <line x1="500" y1="0" x2="500" y2="600" stroke="%23334155" stroke-width="12"/>
    <!-- Hanging Serrico Pheromone Beetle Trap -->
    <polygon points="300,80 340,160 260,160" fill="%23f97316"/>
    <rect x="200" y="160" width="200" height="300" rx="8" fill="%23ffffff" stroke="%23ea580c" stroke-width="4"/>
    <rect x="215" y="180" width="170" height="30" fill="%23ea580c"/>
    <text x="230" y="200" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="11">SERRICO INT BEETLE TRAP</text>
    <!-- Pheromone lure pill -->
    <circle cx="300" cy="270" r="18" fill="%23eab308" stroke="%23ca8a04" stroke-width="3"/>
    <text x="280" y="275" fill="%23000000" font-weight="bold" font-size="10">LURE</text>
    <!-- Grid -->
    <line x1="220" y1="320" x2="380" y2="320" stroke="%23cbd5e1" stroke-width="2"/>
    <line x1="220" y1="360" x2="380" y2="360" stroke="%23cbd5e1" stroke-width="2"/>
    <line x1="220" y1="400" x2="380" y2="400" stroke="%23cbd5e1" stroke-width="2"/>
    <!-- Badge -->
    <rect x="20" y="535" width="370" height="42" rx="6" fill="%23000000" opacity="0.9"/>
    <text x="30" y="562" fill="%2338bdf8" font-family="monospace" font-size="13" font-weight="bold">SERRICO DALAM - SEBELUM PROSES</text>
  </svg>`,

  // 7. Serrico Bagian Dalam - Sesudah Proses
  serrico_dalam_sesudah: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="%230f172a"/>
    <rect x="200" y="160" width="200" height="300" rx="8" fill="%23ffffff" stroke="%2316a34a" stroke-width="4"/>
    <rect x="215" y="180" width="170" height="30" fill="%2316a34a"/>
    <text x="235" y="200" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="11">SERRICO INT - SELESAI</text>
    <!-- Clean trap signoff -->
    <circle cx="300" cy="270" r="18" fill="%23eab308" stroke="%23ca8a04" stroke-width="3"/>
    <rect x="220" y="330" width="160" height="60" rx="6" fill="%23f0fdf4" stroke="%2386efac"/>
    <text x="235" y="355" fill="%2315803d" font-weight="bold" font-size="12">CLEAN &amp; PASSED</text>
    <text x="245" y="375" fill="%23166534" font-size="10">Pest Free Audit</text>
    <!-- Badge -->
    <rect x="20" y="535" width="370" height="42" rx="6" fill="%23000000" opacity="0.9"/>
    <text x="30" y="562" fill="%2322c55e" font-family="monospace" font-size="13" font-weight="bold">✓ SERRICO DALAM - SESUDAH PROSES</text>
  </svg>`,

  // 8. Ban Terganjal 2 (Wheel Chock)
  ban_terganjal: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="%23374151"/>
    <rect x="0" y="430" width="600" height="170" fill="%231f2937"/>
    <line x1="0" y1="430" x2="600" y2="430" stroke="%234b5563" stroke-width="4"/>
    <circle cx="260" cy="300" r="180" fill="%23111827" stroke="%23374151" stroke-width="8"/>
    <circle cx="260" cy="300" r="110" fill="%234b5563"/>
    <circle cx="260" cy="300" r="50" fill="%231f2937"/>
    <polygon points="410,430 490,430 460,330 410,380" fill="%23eab308" stroke="%23ca8a04" stroke-width="4"/>
    <line x1="425" y1="430" x2="450" y2="360" stroke="%23000000" stroke-width="8"/>
    <line x1="455" y1="430" x2="475" y2="370" stroke="%23000000" stroke-width="8"/>
    <rect x="30" y="30" width="280" height="50" rx="8" fill="%23000000" opacity="0.8"/>
    <text x="45" y="60" fill="%2322c55e" font-family="sans-serif" font-weight="bold" font-size="16">✓ SAFETY: BAN TERGANJAL 2</text>
  </svg>`,

  // 9. Kunci Kontak Tercabut
  kunci_tercabut: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="%231e293b"/>
    <rect x="80" y="100" width="440" height="400" rx="20" fill="%23334155" stroke="%23475569" stroke-width="6"/>
    <circle cx="300" cy="220" r="60" fill="%230f172a" stroke="%2364748b" stroke-width="6"/>
    <rect x="295" y="195" width="10" height="50" fill="%2394a3b8" rx="2"/>
    <text x="280" y="145" fill="%23cbd5e1" font-family="sans-serif" font-size="14" font-weight="bold">LOCK / OFF</text>
    <g transform="translate(180, 360)">
      <circle cx="80" cy="50" r="28" fill="%23d97706" stroke="%2392400e" stroke-width="4"/>
      <circle cx="80" cy="50" r="10" fill="%23334155"/>
      <rect x="108" y="44" width="70" height="12" fill="%2394a3b8" rx="3"/>
      <rect x="150" y="44" width="8" height="20" fill="%2394a3b8"/>
      <rect x="165" y="44" width="8" height="16" fill="%2394a3b8"/>
    </g>
    <rect x="30" y="30" width="280" height="50" rx="8" fill="%23000000" opacity="0.8"/>
    <text x="45" y="60" fill="%2322c55e" font-family="sans-serif" font-weight="bold" font-size="16">✓ SAFETY: KUNCI TERCABUT</text>
  </svg>`,

  // 10. Rem Tangan Aktif
  rem_tangan: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="%23111827"/>
    <rect x="120" y="80" width="360" height="460" rx="24" fill="%231f2937" stroke="%23374151" stroke-width="4"/>
    <g transform="rotate(-30 300 420)">
      <rect x="285" y="160" width="30" height="260" rx="10" fill="%234b5563"/>
      <circle cx="300" cy="150" r="30" fill="%23dc2626" stroke="%23991b1b" stroke-width="4"/>
      <text x="288" y="156" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="bold">(!)</text>
    </g>
    <circle cx="300" cy="110" r="18" fill="%23ef4444" stroke="%23b91c1c" stroke-width="3"/>
    <text x="330" y="116" fill="%23ef4444" font-family="sans-serif" font-size="14" font-weight="bold">PARK BRAKE ON</text>
    <rect x="30" y="30" width="280" height="50" rx="8" fill="%23000000" opacity="0.8"/>
    <text x="45" y="60" fill="%2322c55e" font-family="sans-serif" font-weight="bold" font-size="16">✓ SAFETY: REM TANGAN AKTIF</text>
  </svg>`,

  // 11. Truck Front (Nopol)
  tampak_depan: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="%230f172a"/>
    <rect x="100" y="120" width="400" height="340" rx="20" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="4"/>
    <rect x="130" y="150" width="340" height="150" rx="10" fill="%2338bdf8" opacity="0.75" stroke="%230284c7" stroke-width="3"/>
    <rect x="180" y="330" width="240" height="70" fill="%23334155" rx="6"/>
    <rect x="210" y="420" width="180" height="45" rx="4" fill="%23000000" stroke="%23ffffff" stroke-width="3"/>
    <text x="230" y="450" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="20" letter-spacing="2">B 9522 SEI</text>
    <rect x="30" y="530" width="220" height="40" rx="6" fill="%23000000" opacity="0.8"/>
    <text x="45" y="555" fill="%2338bdf8" font-family="sans-serif" font-weight="bold" font-size="14">TAMPAK DEPAN NOPOL</text>
  </svg>`,

  // 12. Sisi Truk
  sisi_truk: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="%231e293b"/>
    <rect x="60" y="160" width="480" height="260" rx="10" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="4"/>
    <circle cx="160" cy="440" r="50" fill="%23111827"/>
    <circle cx="440" cy="440" r="50" fill="%23111827"/>
    <text x="180" y="300" fill="%230284c7" font-weight="bold" font-size="28">ASSA LOGISTIK</text>
    <rect x="30" y="530" width="220" height="40" rx="6" fill="%23000000" opacity="0.8"/>
    <text x="45" y="555" fill="%2338bdf8" font-family="sans-serif" font-weight="bold" font-size="14">SISI SAMPING TRUK</text>
  </svg>`,

  // 13. Surat Jalan / DO
  surat_jalan: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="%23475569"/>
    <rect x="90" y="50" width="420" height="500" rx="4" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/>
    <text x="130" y="100" fill="%230f172a" font-family="sans-serif" font-size="18" font-weight="bold">SURAT JALAN &amp; DELIVERY ORDER</text>
    <text x="130" y="125" fill="%2364748b" font-family="sans-serif" font-size="12">NO: DO-HMS-2026/09/30-0089</text>
    <line x1="130" y1="140" x2="470" y2="140" stroke="%230f172a" stroke-width="2"/>
    <text x="130" y="170" fill="%23334155" font-family="sans-serif" font-size="12">Project       : PT HMS</text>
    <text x="130" y="195" fill="%23334155" font-family="sans-serif" font-size="12">Ritase        : RIT 7</text>
    <text x="130" y="220" fill="%23334155" font-family="sans-serif" font-size="12">No. Polisi    : B 9522 SEI</text>
    <text x="130" y="245" fill="%23334155" font-family="sans-serif" font-size="12">Muatan        : 52 BOK</text>
    <rect x="130" y="270" width="340" height="120" fill="%23f8fafc" stroke="%23cbd5e1"/>
    <text x="145" y="325" fill="%23334155" font-size="12">TOBACCO PRODUCT HMS-BOK</text>
    <text x="400" y="325" fill="%23334155" font-size="12">52 BOK</text>
    <g transform="rotate(-15 360 460)">
      <circle cx="360" cy="460" r="45" fill="none" stroke="%23dc2626" stroke-width="3" stroke-dasharray="8,4"/>
      <text x="330" y="455" fill="%23dc2626" font-family="sans-serif" font-weight="bold" font-size="11">LOGISTIK</text>
      <text x="335" y="475" fill="%23dc2626" font-family="sans-serif" font-weight="bold" font-size="10">APPROVED</text>
    </g>
  </svg>`,

  // 14. Segel Terpasang (Seal No. 01572033)
  segel_terpasang: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="%231e293b"/>
    <rect x="250" y="50" width="30" height="500" fill="%2394a3b8" stroke="%2364748b" stroke-width="4"/>
    <rect x="235" y="260" width="60" height="90" rx="8" fill="%23475569" stroke="%23334155" stroke-width="4"/>
    <rect x="255" y="220" width="20" height="150" fill="%230284c7" stroke="%230369a1" stroke-width="3"/>
    <circle cx="265" cy="225" r="16" fill="%23eab308" stroke="%23ca8a04" stroke-width="3"/>
    <circle cx="265" cy="370" r="18" fill="%230284c7" stroke="%230369a1" stroke-width="3"/>
    <rect x="330" y="250" width="220" height="60" rx="8" fill="%23000000" opacity="0.85"/>
    <text x="345" y="275" fill="%23fbbf24" font-family="monospace" font-size="12">NO. SEGEL RESMI:</text>
    <text x="345" y="298" fill="%23ffffff" font-family="monospace" font-size="18" font-weight="bold">01572033</text>
  </svg>`,

  // 15. SIM Driver
  sim_driver: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="%23334155"/>
    <rect x="80" y="140" width="440" height="280" rx="16" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="4"/>
    <rect x="80" y="140" width="440" height="50" rx="16" fill="%23dc2626"/>
    <text x="120" y="172" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="16">SURAT IZIN MENGEMUDI (SIM BII UMUM)</text>
    <rect x="110" y="210" width="90" height="110" fill="%23e2e8f0" stroke="%2394a3b8"/>
    <text x="220" y="235" fill="%230f172a" font-weight="bold" font-size="14">NAMA: WAWAN</text>
    <text x="220" y="260" fill="%23475569" font-size="12">NO SIM: 8812-7364-9912</text>
    <text x="220" y="310" fill="%2316a34a" font-weight="bold" font-size="12">STATUS: VALID &amp; AKTIF</text>
  </svg>`,

  // 16. KIR Truk
  kir_truk: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="%23334155"/>
    <rect x="90" y="130" width="420" height="300" rx="12" fill="%230284c7" stroke="%230369a1" stroke-width="4"/>
    <rect x="110" y="150" width="380" height="260" rx="8" fill="%23ffffff"/>
    <text x="140" y="190" fill="%230369a1" font-weight="bold" font-size="16">KARTU UJI KELAIKAN (KIR)</text>
    <text x="140" y="265" fill="%231e293b" font-size="13">No. Kendaraan: B 9522 SEI</text>
    <text x="140" y="335" fill="%2316a34a" font-weight="bold" font-size="14">STATUS: LULUS UJI KELAIKAN</text>
  </svg>`
};
