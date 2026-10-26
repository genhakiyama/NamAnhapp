import React from 'react';

export default function BackgroundDecorations({ customBgUrl }) {
  const bgImage = customBgUrl || '/background.jpg';

  return (
    <>
      {/* Background SVG with German Landmarks & Architectural Art */}
      <svg
        id="bg"
        viewBox="0 0 576 1024"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      >
        <defs>
          <filter id="ls" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#6b1f4a" floodOpacity=".45" />
          </filter>
          <radialGradient id="hg" cx=".35" cy=".3" r=".9">
            <stop offset="0" stopColor="#ff7d8f" />
            <stop offset=".45" stopColor="#d4132f" />
            <stop offset="1" stopColor="#5a0014" />
          </radialGradient>
          <filter id="sh">
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#500" floodOpacity=".5" />
          </filter>
        </defs>

        <image href={bgImage} width="576" height="1024" preserveAspectRatio="xMidYMid slice" />

        <g filter="url(#ls)" stroke="#fff" strokeWidth=".8" strokeLinejoin="round">
          {/* Köln Dom */}
          <g transform="translate(105 635) scale(1.25)">
            <rect x="8" y="52" width="86" height="48" fill="#a7a0c9" />
            <rect x="14" y="30" width="22" height="70" fill="#b9b2d8" />
            <rect x="66" y="30" width="22" height="70" fill="#b9b2d8" />
            <path d="M12 30L25 -22 38 30ZM64 30L77 -22 90 30Z" fill="#8f87b8" />
            <path d="M25 -22v-8M77 -22v-8" stroke="#8f87b8" strokeWidth="2" />
            <path d="M36 52L51 22 66 52Z" fill="#9a92c2" />
            <g fill="#5b4b8a">
              <path d="M20 62h10v18a5 5 0 0 1-10 0zM72 62h10v18a5 5 0 0 1-10 0zM46 66h10v22a5 5 0 0 1-10 0z" />
            </g>
            <g fill="#fff" opacity=".8">
              <rect x="22" y="38" width="6" height="10" rx="3" />
              <rect x="74" y="38" width="6" height="10" rx="3" />
            </g>
          </g>

          {/* Brandenburger Tor */}
          <g transform="translate(245 697) scale(1.25)">
            <rect x="0" y="42" width="110" height="8" fill="#e8d8b4" />
            <rect x="-4" y="4" width="118" height="12" fill="#f0e2bf" />
            <rect x="2" y="16" width="106" height="8" fill="#e8d8b4" />
            <g fill="#f6ebcf">
              <rect x="6" y="24" width="10" height="18" />
              <rect x="26" y="24" width="10" height="18" />
              <rect x="46" y="24" width="10" height="18" />
              <rect x="66" y="24" width="10" height="18" />
              <rect x="86" y="24" width="10" height="18" />
              <rect x="100" y="24" width="8" height="18" />
            </g>
            <rect x="36" y="-8" width="38" height="12" fill="#e8d8b4" />
            <path d="M38 -8l8-14 8 14zM54 -8l8-18 8 18z" fill="#c9a84a" />
            <circle cx="55" cy="-26" r="3" fill="#c9a84a" />
          </g>

          {/* Mathildenhöhe: Hochzeitsturm */}
          <g transform="translate(395 610) scale(1.25)">
            <rect x="12" y="30" width="46" height="90" fill="#d98a63" />
            <rect x="8" y="22" width="54" height="10" fill="#c97452" />
            <path d="M8 22L12 -4 22 14 28 -10 35 12 42 -10 48 14 58 -4 62 22Z" fill="#4fa391" />
            <g fill="#fff" opacity=".85">
              <rect x="20" y="44" width="8" height="14" rx="4" />
              <rect x="42" y="44" width="8" height="14" rx="4" />
              <rect x="31" y="74" width="8" height="14" rx="4" />
            </g>
            <rect x="0" y="92" width="14" height="28" fill="#e8a37c" />
          </g>
        </g>

        <g fontFamily="Quicksand,sans-serif" fontSize="12" fontWeight="700" fill="#fff" stroke="#b03070" strokeWidth=".6" paintOrder="stroke">
          <text x="167" y="790" textAnchor="middle">Köln Dom</text>
          <text x="315" y="790" textAnchor="middle">Brandenburger Tor</text>
          <text x="432" y="790" textAnchor="middle">Mathildenhöhe</text>
        </g>
      </svg>

      {/* Floating Beating Heart Decoration */}
      <svg className="deco beat" style={{ left: '6%', top: '14%', width: '62px' }} viewBox="0 0 100 92">
        <path filter="url(#sh)" fill="url(#hg)" d="M50 88C20 66 3 48 3 28 3 13 14 3 28 3c9 0 18 5 22 13C54 8 63 3 72 3c14 0 25 10 25 25 0 20-17 38-47 60z" />
        <ellipse cx="30" cy="22" rx="12" ry="7" fill="#fff" opacity=".55" transform="rotate(-30 30 22)" />
        <ellipse cx="68" cy="18" rx="5" ry="3" fill="#fff" opacity=".3" />
      </svg>

      {/* Headphone Deco */}
      <svg className="deco" style={{ right: '5%', top: '20%', width: '78px', animationDelay: '1s' }} viewBox="0 0 100 100">
        <path d="M18 60V48a32 32 0 0 1 64 0v12" fill="none" stroke="#3a3a4a" strokeWidth="7" strokeLinecap="round" />
        <rect x="8" y="54" width="20" height="32" rx="9" fill="#e8619a" />
        <rect x="72" y="54" width="20" height="32" rx="9" fill="#e8619a" />
        <rect x="12" y="60" width="8" height="20" rx="4" fill="#fff" opacity=".4" />
        <rect x="76" y="60" width="8" height="20" rx="4" fill="#fff" opacity=".4" />
      </svg>

      {/* German Book Notebook Deco */}
      <svg className="deco" style={{ left: '4%', top: '56%', width: '78px', animationDelay: '2s' }} viewBox="0 0 100 110">
        <rect x="14" y="6" width="76" height="98" rx="6" fill="#2d3f7a" />
        <g fill="#d8dbe8">
          <circle cx="14" cy="22" r="4" />
          <circle cx="14" cy="42" r="4" />
          <circle cx="14" cy="62" r="4" />
          <circle cx="14" cy="82" r="4" />
        </g>
        <rect x="30" y="22" width="48" height="30" rx="3" fill="#fff8e6" />
        <text x="54" y="42" fontSize="12" fontWeight="700" textAnchor="middle" fill="#2d3f7a" fontFamily="sans-serif">Deutsch</text>
        <rect x="30" y="64" width="48" height="5" fill="#222" />
        <rect x="30" y="69" width="48" height="5" fill="#d3262e" />
        <rect x="30" y="74" width="48" height="5" fill="#f6c52b" />
      </svg>

      {/* Floating Animated Musical Notes */}
      <span className="note" style={{ left: '12%', animationDelay: '0s' }}>♪</span>
      <span className="note" style={{ left: '30%', animationDelay: '2s' }}>♫</span>
      <span className="note" style={{ left: '62%', animationDelay: '4s' }}>♪</span>
      <span className="note" style={{ left: '82%', animationDelay: '1s' }}>♬</span>

      {/* Two Cute Animated Pets: Dalmatian & Golden Dog in Grad Hat */}
      <svg id="dogs" viewBox="0 0 260 130" aria-hidden="true">
        {/* Chó đốm */}
        <g>
          <ellipse cx="82" cy="104" rx="46" ry="24" fill="#fff" />
          <ellipse cx="58" cy="108" rx="14" ry="12" fill="#6b4a32" />
          <ellipse cx="108" cy="100" rx="9" ry="10" fill="#222" />
          <g fill="#fff" stroke="#e5e0e0">
            <rect x="52" y="116" width="13" height="12" rx="6" />
            <rect x="92" y="116" width="13" height="12" rx="6" />
          </g>
          <circle cx="100" cy="62" r="29" fill="#fff" stroke="#eee" />
          <path d="M100 36a29 29 0 0 1 24 20c-10-8-20-8-30-6z" fill="#222" />
          <ellipse cx="78" cy="58" rx="9" ry="19" fill="#7a5238" transform="rotate(14 78 58)" />
          <circle cx="98" cy="62" r="3.4" fill="#222" />
          <circle cx="116" cy="62" r="3.4" fill="#222" />
          <ellipse cx="109" cy="74" rx="8" ry="5.5" fill="#222" />
          <path d="M117 78q14 6 24 -2l-2 10q-14 6-24-2z" fill="#ff8fa8" />
        </g>
        {/* Chó vàng đội mũ cử nhân */}
        <g>
          <ellipse cx="190" cy="106" rx="38" ry="21" fill="#fbeab5" />
          <g fill="#fbeab5" stroke="#efd993">
            <rect x="164" y="116" width="13" height="12" rx="6" />
            <rect x="198" y="116" width="13" height="12" rx="6" />
          </g>
          <ellipse cx="226" cy="108" rx="9" ry="6" fill="#fbeab5" transform="rotate(-25 226 108)" />
          <ellipse cx="160" cy="74" rx="10" ry="23" fill="#f0d68e" transform="rotate(8 160 74)" />
          <ellipse cx="220" cy="74" rx="10" ry="23" fill="#f0d68e" transform="rotate(-8 220 74)" />
          <circle cx="190" cy="68" r="30" fill="#fbeab5" stroke="#efd993" />
          <circle cx="180" cy="68" r="3.4" fill="#222" />
          <circle cx="200" cy="68" r="3.4" fill="#222" />
          <ellipse cx="190" cy="78" rx="6" ry="4.5" fill="#333" />
          <path d="M184 84q6 5 12 0" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="172" cy="78" rx="5" ry="3" fill="#f8b0a0" opacity=".6" />
          <ellipse cx="208" cy="78" rx="5" ry="3" fill="#f8b0a0" opacity=".6" />
          {/* Mũ tốt nghiệp */}
          <path d="M190 28l-34 11 34 12 34-12z" fill="#20243a" />
          <path d="M172 46v10q18 8 36 0V46" fill="#2c3150" />
          <path d="M190 39l30 5v18" fill="none" stroke="#f6c52b" strokeWidth="2" />
          <circle cx="220" cy="64" r="3" fill="#f6c52b" />
        </g>
      </svg>
    </>
  );
}
