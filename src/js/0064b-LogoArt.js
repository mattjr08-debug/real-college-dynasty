// Hand-drawn logos for the other 20 schools (item 34), same shield and style as the first ten in LOGO_SHAPES.
// Each one is the shield plus a drawing of the mascot; colors come from the school (currentColor), white and the dark fill.
var LOGO_SH =
  '<path d="M50 3 L89 15 V49 C89 74 71 90 50 98 C29 90 11 74 11 49 V15 Z" fill="#11151d" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>';
Object.assign(LOGO_SHAPES, {
  appal:
    LOGO_SH +
    '<ellipse cx="50" cy="60" rx="15" ry="22" fill="currentColor"/><path d="M36 52 H64 M35 62 H65 M38 72 H62" stroke="#11151d" stroke-width="4"/><circle cx="50" cy="34" r="10" fill="currentColor"/><circle cx="46" cy="32" r="2.4" fill="#fff"/><circle cx="54" cy="32" r="2.4" fill="#fff"/><path d="M44 24 L38 14 M56 24 L62 14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M36 48 C20 34 18 56 32 62 Z M64 48 C80 34 82 56 68 62 Z" fill="#fff" opacity=".85"/><path d="M50 82 V90" stroke="#fff" stroke-width="4" stroke-linecap="round"/>',
  hdt:
    LOGO_SH +
    '<ellipse cx="46" cy="64" rx="15" ry="11" fill="currentColor"/><path d="M58 66 C78 66 82 44 70 32 C66 28 60 26 58 30" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round"/><path d="M58 28 L52 20 L66 22 Z" fill="#fff"/><path d="M34 58 C22 52 22 40 30 36 C30 44 36 46 40 52 Z M42 54 C38 44 42 34 50 34 C48 42 50 46 52 54 Z" fill="currentColor"/><path d="M34 72 L26 80 M46 75 V84 M58 72 L64 80" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="40" cy="62" r="2.2" fill="#fff"/><circle cx="50" cy="62" r="2.2" fill="#fff"/>',
  nplains:
    LOGO_SH +
    '<path d="M26 40 C10 36 8 18 18 12 C16 24 26 30 34 32 Z M74 40 C90 36 92 18 82 12 C84 24 74 30 66 32 Z" fill="#fff"/><path d="M24 40 C24 28 34 22 50 22 C66 22 76 28 76 40 L78 56 C78 72 66 86 50 90 C34 86 22 72 22 56 Z" fill="currentColor"/><path d="M26 34 C34 24 66 24 74 34 C66 40 60 36 50 44 C40 36 34 40 26 34 Z" fill="#11151d" opacity=".45"/><circle cx="39" cy="52" r="3.2" fill="#11151d"/><circle cx="61" cy="52" r="3.2" fill="#11151d"/><path d="M34 70 C34 64 66 64 66 70 C66 80 58 86 50 86 C42 86 34 80 34 70 Z" fill="#11151d" opacity=".6"/><circle cx="45" cy="75" r="2.2" fill="#fff"/><circle cx="55" cy="75" r="2.2" fill="#fff"/>',
  bayou:
    LOGO_SH +
    '<path d="M12 52 C22 40 40 34 58 36 C70 36 80 40 90 48 L86 56 L78 52 L72 60 L66 54 L60 62 L54 56 L48 64 L42 58 L34 64 L30 58 C22 60 16 58 12 52 Z" fill="currentColor"/><path d="M12 52 C22 66 44 78 70 72 C80 70 86 64 90 58 L86 56 C70 62 40 62 12 52 Z" fill="currentColor" opacity=".55"/><circle cx="52" cy="30" r="8" fill="currentColor"/><circle cx="52" cy="30" r="3" fill="#fff"/><path d="M66 30 L76 26" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M42 78 L50 86 L58 78" fill="none" stroke="#fff" stroke-width="3"/>',
  rmp:
    LOGO_SH +
    '<path d="M30 56 L20 36 M24 44 L12 42 M26 36 L18 24 M70 56 L80 36 M76 44 L88 42 M74 36 L82 24 M38 40 L34 20 M62 40 L66 20 M36 30 L26 24 M64 30 L74 24" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M34 44 C36 36 64 36 66 44 L62 70 C60 80 56 86 50 88 C44 86 40 80 38 70 Z" fill="currentColor"/><circle cx="43" cy="56" r="3" fill="#11151d"/><circle cx="57" cy="56" r="3" fill="#11151d"/><ellipse cx="50" cy="78" rx="7" ry="5" fill="#11151d"/>',
  hudson:
    LOGO_SH +
    '<path d="M52 18 C60 18 66 24 62 32 C58 36 52 36 50 42 C48 52 58 56 56 66 C54 74 48 76 46 82" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/><path d="M62 24 L80 28 L62 30 Z" fill="#fff"/><circle cx="57" cy="24" r="2" fill="#11151d"/><path d="M28 60 C36 54 50 56 58 62 C50 70 36 70 28 60 Z" fill="currentColor"/><path d="M46 82 L42 90 M46 82 L52 90" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><path d="M20 90 H80" stroke="#fff" stroke-width="2.5" opacity=".6"/>',
  piedmont:
    LOGO_SH +
    '<path d="M24 22 L66 70 M76 22 L34 70" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M60 64 L72 76 M40 64 L28 76" stroke="currentColor" stroke-width="9" stroke-linecap="round"/><path d="M22 24 L30 20 L26 30 Z M78 24 L70 20 L74 30 Z" fill="#fff"/><path d="M28 36 C28 22 72 22 72 36 L68 40 H32 Z" fill="currentColor"/><path d="M44 44 H56 V58 H44 Z" fill="currentColor"/><circle cx="50" cy="30" r="4" fill="#11151d"/>',
  basin:
    LOGO_SH +
    '<path d="M36 50 C26 34 28 14 38 12 C46 12 46 32 46 46 Z M64 50 C74 34 72 14 62 12 C54 12 54 32 54 46 Z" fill="currentColor"/><path d="M38 24 C40 22 42 26 41 36 C38 34 37 30 38 24 Z M62 24 C60 22 58 26 59 36 C62 34 63 30 62 24 Z" fill="#11151d" opacity=".5"/><ellipse cx="50" cy="64" rx="22" ry="20" fill="currentColor"/><circle cx="41" cy="58" r="3" fill="#11151d"/><circle cx="59" cy="58" r="3" fill="#11151d"/><path d="M46 68 H54 L50 73 Z" fill="#fff"/><path d="M50 73 V78 M42 76 L30 74 M58 76 L70 74" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
  tide:
    LOGO_SH +
    '<path d="M16 34 C26 16 74 16 84 34 C72 28 28 28 16 34 Z" fill="currentColor"/><path d="M22 30 C30 24 70 24 78 30 L74 40 H26 Z" fill="currentColor"/><circle cx="50" cy="32" r="4" fill="#fff"/><circle cx="50" cy="52" r="5" fill="none" stroke="#fff" stroke-width="3.5"/><path d="M50 57 V84 M38 64 H62 M30 74 C32 84 42 86 50 86 C58 86 68 84 70 74" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>',
  sierra:
    LOGO_SH +
    '<path d="M50 24 C62 24 66 36 60 46 C70 52 74 64 68 78 L50 88 L32 78 C26 64 30 52 40 46 C34 36 38 24 50 24 Z" fill="currentColor"/><path d="M34 54 C40 62 60 62 66 54 C64 66 58 72 50 72 C42 72 36 66 34 54 Z" fill="#fff"/><path d="M46 34 L58 36 L54 42 Z" fill="#fff"/><circle cx="48" cy="34" r="2" fill="#11151d"/><path d="M62 32 C70 30 74 34 72 40" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/>',
  ozark:
    LOGO_SH +
    '<circle cx="30" cy="30" r="11" fill="currentColor"/><circle cx="70" cy="30" r="11" fill="currentColor"/><circle cx="30" cy="30" r="5" fill="#11151d"/><circle cx="70" cy="30" r="5" fill="#11151d"/><ellipse cx="50" cy="52" rx="26" ry="24" fill="currentColor"/><ellipse cx="50" cy="62" rx="12" ry="9" fill="#fff"/><path d="M44 58 H56 L50 66 Z" fill="#11151d"/><circle cx="40" cy="46" r="3.2" fill="#11151d"/><circle cx="60" cy="46" r="3.2" fill="#11151d"/><path d="M50 66 V72 M44 72 Q50 76 56 72" stroke="#11151d" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
  rivers:
    LOGO_SH +
    '<ellipse cx="50" cy="46" rx="22" ry="20" fill="currentColor"/><circle cx="34" cy="30" r="6" fill="currentColor"/><circle cx="66" cy="30" r="6" fill="currentColor"/><ellipse cx="50" cy="54" rx="13" ry="9" fill="#fff"/><ellipse cx="50" cy="50" rx="5" ry="3.5" fill="#11151d"/><circle cx="41" cy="40" r="3" fill="#11151d"/><circle cx="59" cy="40" r="3" fill="#11151d"/><path d="M32 54 L18 50 M32 58 L18 60 M68 54 L82 50 M68 58 L82 60" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M14 78 C24 68 34 68 44 78 S64 88 74 78 S88 70 90 74" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>',
  crescent:
    LOGO_SH +
    '<path d="M58 14 C40 18 32 36 40 52 C26 44 24 24 38 12 C46 8 54 10 58 14 Z" fill="#fff" opacity=".85"/><path d="M20 62 C22 44 38 38 52 44 C62 48 66 56 62 62 L84 54 L66 70 C60 80 46 84 34 78 C26 74 22 70 20 62 Z" fill="currentColor"/><path d="M62 62 L88 56 L64 68 Z" fill="#fff"/><circle cx="46" cy="52" r="2.6" fill="#11151d"/><path d="M30 78 L28 88 M42 82 L44 90" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>',
  midwest:
    LOGO_SH +
    '<path d="M34 22 L46 30 L40 14 Z" fill="currentColor"/><path d="M30 38 C30 26 44 22 54 28 C64 30 70 40 66 52 C62 66 52 78 40 84 L40 72 C30 64 28 48 30 38 Z" fill="currentColor"/><path d="M60 40 L82 46 L62 52 Z" fill="#fff"/><circle cx="50" cy="38" r="3" fill="#fff"/><circle cx="50" cy="38" r="1.4" fill="#11151d"/><path d="M42 84 L58 94 M46 80 L66 86" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M36 50 C44 56 54 56 62 50" stroke="#11151d" stroke-width="2.4" fill="none"/>',
  alamo:
    LOGO_SH +
    '<path d="M12 22 C14 40 26 44 34 44 C30 36 26 28 12 22 Z M88 22 C86 40 74 44 66 44 C70 36 74 28 88 22 Z" fill="#fff"/><path d="M30 40 C32 32 68 32 70 40 L66 62 C64 74 58 84 50 88 C42 84 36 74 34 62 Z" fill="currentColor"/><circle cx="41" cy="52" r="3" fill="#11151d"/><circle cx="59" cy="52" r="3" fill="#11151d"/><circle cx="50" cy="76" r="9" fill="none" stroke="#fff" stroke-width="3.5"/><path d="M40 68 Q50 74 60 68" stroke="#11151d" stroke-width="2.4" fill="none"/>',
  emerald:
    LOGO_SH +
    '<path d="M12 62 C24 42 40 30 60 26 C58 36 62 46 76 52 C84 56 88 62 88 66 C78 62 70 62 62 66 C52 72 36 70 12 62 Z" fill="currentColor"/><path d="M52 26 L62 8 L72 38 Z" fill="currentColor"/><circle cx="34" cy="52" r="3" fill="#fff"/><path d="M42 58 L46 64 L50 58 L54 64 L58 58 L62 64" stroke="#fff" stroke-width="2.4" fill="none" stroke-linejoin="round"/><path d="M14 82 C26 74 36 74 46 82 S66 90 78 80 S86 78 88 80" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>',
  empire:
    LOGO_SH +
    '<path d="M30 20 C40 8 60 8 70 20 L70 28 C60 22 40 22 30 28 Z" fill="#fff"/><path d="M30 28 C30 26 70 26 70 28 L70 56 C70 72 62 82 50 88 C38 82 30 72 30 56 Z" fill="currentColor"/><path d="M44 28 H56 V68 H44 Z" fill="#11151d"/><path d="M36 50 H64 V58 H36 Z" fill="#11151d"/><path d="M46 28 V66 M54 28 V66" stroke="#fff" stroke-width="1.6"/>',
  golden:
    LOGO_SH +
    '<path d="M16 66 H84 L76 80 H24 Z" fill="currentColor"/><path d="M50 14 V66" stroke="#fff" stroke-width="4"/><path d="M52 18 C74 26 80 46 80 62 H52 Z" fill="currentColor"/><path d="M48 24 C36 32 30 44 28 60 H48 Z" fill="#fff"/><path d="M50 8 L56 14 L50 20 L44 14 Z" fill="#fff"/><path d="M16 88 C28 82 38 82 48 88 S68 94 84 86" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity=".7"/>',
  windy:
    LOGO_SH +
    '<g stroke="currentColor" stroke-width="6" stroke-linecap="round" fill="none"><path d="M50 16 V84 M20 33 L80 67 M20 67 L80 33"/></g><g stroke="#fff" stroke-width="3.5" stroke-linecap="round" fill="none"><path d="M50 26 L42 20 M50 26 L58 20 M50 74 L42 80 M50 74 L58 80 M28 38 L26 28 M28 38 L18 40 M72 62 L74 72 M72 62 L82 60 M28 62 L26 72 M28 62 L18 60 M72 38 L74 28 M72 38 L82 40"/></g><circle cx="50" cy="50" r="5" fill="#fff"/>',
  sunbelt:
    LOGO_SH +
    '<path d="M50 14 C58 28 74 34 72 54 C70 68 60 78 50 80 C40 78 30 68 28 54 C26 36 42 28 50 14 Z" fill="currentColor"/><path d="M50 44 C56 54 60 60 56 70 C50 74 42 70 42 62 C42 54 48 52 50 44 Z" fill="#fff"/><path d="M28 54 C14 48 10 34 14 24 C22 34 28 38 34 40 Z M72 54 C86 48 90 34 86 24 C78 34 72 38 66 40 Z" fill="currentColor" opacity=".8"/><path d="M42 82 L36 92 M50 84 V94 M58 82 L64 92" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>',
});
