/* @ds-bundle: {"format":3,"namespace":"ElevationAthleticsDesignSystem_58666d","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"Carousel","sourcePath":"components/media/Carousel.jsx"},{"name":"Logo","sourcePath":"components/navigation/Logo.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"NewsletterForm","sourcePath":"components/navigation/NewsletterForm.jsx"},{"name":"FaqItem","sourcePath":"components/program/FaqItem.jsx"},{"name":"LocationCard","sourcePath":"components/program/LocationCard.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"c75fde89589c","components/core/Button.jsx":"75e94d6a1f74","components/core/Card.jsx":"b6b6dcdfb792","components/core/Input.jsx":"6d41d354c105","components/core/SectionHeading.jsx":"fd354febda21","components/media/Carousel.jsx":"e9f5445b2b05","components/navigation/Logo.jsx":"21a920598596","components/navigation/NavBar.jsx":"e79f1a747080","components/navigation/NewsletterForm.jsx":"76feaa119cd7","components/program/FaqItem.jsx":"18c61afba7d4","components/program/LocationCard.jsx":"7339ed1fe762","ui_kits/badminton/BadmintonHome.jsx":"3f5380463759","ui_kits/employment/EmploymentPage.jsx":"701913f494b0","ui_kits/pickleball/FaqScreen.jsx":"c9a431524e47","ui_kits/pickleball/PickleballHome.jsx":"e0d993267d22","ui_kits/pickleball/RegionScreen.jsx":"91cd580bd522","ui_kits/shared/KitIllustration.jsx":"f8ce9e396859"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ElevationAthleticsDesignSystem_58666d = window.ElevationAthleticsDesignSystem_58666d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Elevation Athletics — Badge / status chip.
 * Used for program status (open / limited / closed), counts, and filters.
 */
function Badge({
  children,
  tone = "info",
  dot = false,
  style = {},
  ...rest
}) {
  const tones = {
    info: {
      bg: "var(--ea-sky-soft)",
      fg: "#1B4E67"
    },
    success: {
      bg: "var(--ea-success-bg)",
      fg: "var(--ea-success)"
    },
    warning: {
      bg: "var(--ea-warning-bg)",
      fg: "var(--ea-warning)"
    },
    danger: {
      bg: "var(--ea-danger-bg)",
      fg: "var(--ea-danger)"
    },
    neutral: {
      bg: "var(--ea-neutral-bg)",
      fg: "var(--ea-muted)"
    },
    warm: {
      bg: "var(--ea-peach)",
      fg: "var(--ea-orange-dark)"
    }
  };
  const t = tones[tone] || tones.info;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "5px 12px",
      borderRadius: "var(--radius-badge)",
      background: t.bg,
      color: t.fg,
      fontFamily: "var(--font-body)",
      fontSize: 14,
      fontWeight: "var(--fw-semibold)",
      lineHeight: 1,
      letterSpacing: "var(--ls-body)",
      whiteSpace: "nowrap",
      verticalAlign: "middle",
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: t.fg,
      flex: "none"
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Elevation Athletics — Button
 * Primary action is a solid EA blue with 8px radius. Secondary is a white
 * pill-less button with a light-blue border. Ghost is text-only.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  as = "button",
  full = false,
  disabled = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "8px 16px",
      fontSize: 14
    },
    md: {
      padding: "12px 24px",
      fontSize: 16
    },
    lg: {
      padding: "16px 32px",
      fontSize: 18
    }
  };
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "var(--font-body)",
    fontWeight: "var(--fw-semibold)",
    letterSpacing: "var(--ls-body)",
    borderRadius: "var(--radius-button)",
    border: "0.5px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: "none",
    transition: "background .15s ease, color .15s ease, border-color .15s ease, transform .05s ease",
    width: full ? "100%" : "auto",
    opacity: 1,
    whiteSpace: "nowrap",
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: "var(--action-primary)",
      color: "var(--action-on-primary)"
    },
    secondary: {
      background: "var(--ea-white)",
      color: "var(--ea-teal-900)",
      borderColor: "var(--ea-line)",
      fontWeight: "var(--fw-bold)"
    },
    dark: {
      background: "var(--ea-teal-900)",
      color: "var(--ea-white)"
    },
    ghost: {
      background: "transparent",
      color: "var(--ea-navy)"
    }
  };
  const disabledStyle = disabled ? {
    background: "var(--ea-mist)",
    color: "var(--ea-muted)",
    borderColor: "var(--ea-line)",
    cursor: "not-allowed"
  } : {};
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    disabled: Tag === "button" ? disabled : undefined,
    style: {
      ...base,
      ...variants[variant],
      ...disabledStyle,
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = "scale(0.97)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "scale(1)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "scale(1)";
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Elevation Athletics — Card surface.
 * White, softly rounded (12px) with a low-contrast lift. `tone` recolors the
 * whole surface for the warm peach / sky / dark blocks used across the site.
 */
function Card({
  children,
  tone = "white",
  pad = 24,
  hover = false,
  style = {},
  ...rest
}) {
  const tones = {
    white: {
      background: "var(--surface-card)",
      color: "var(--text-body)",
      border: "1px solid var(--border-card)"
    },
    sky: {
      background: "var(--ea-sky)",
      color: "var(--ea-navy)",
      border: "none"
    },
    warm: {
      background: "var(--ea-peach)",
      color: "var(--ea-navy)",
      border: "none"
    },
    dark: {
      background: "var(--ea-teal-900)",
      color: "var(--ea-white)",
      border: "none"
    },
    wash: {
      background: "var(--ea-sky-soft)",
      color: "var(--ea-navy)",
      border: "none"
    }
  };
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => hover && setH(true),
    onMouseLeave: () => hover && setH(false),
    style: {
      borderRadius: "var(--radius-md)",
      padding: pad,
      boxShadow: h ? "var(--shadow-card-hover)" : "var(--shadow-card)",
      transition: "box-shadow .18s ease, transform .18s ease",
      transform: h ? "translateY(-2px)" : "none",
      ...tones[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Elevation Athletics — text input.
 * Soft 8px field; `icon` renders a leading glyph (used for the city search).
 */
function Input({
  icon = null,
  style = {},
  wrapStyle = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      width: "100%",
      ...wrapStyle
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 16,
      display: "flex",
      alignItems: "center",
      color: "var(--ea-link)",
      pointerEvents: "none"
    }
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    style: {
      width: "100%",
      padding: icon ? "14px 16px 14px 46px" : "14px 16px",
      fontFamily: "var(--font-body)",
      fontSize: 16,
      letterSpacing: "var(--ls-body)",
      color: "var(--text-body)",
      background: "var(--ea-white)",
      border: "1px solid var(--border-card)",
      borderRadius: "var(--radius-input)",
      outline: "none",
      transition: "border-color .15s ease, box-shadow .15s ease",
      ...style
    },
    onFocus: e => {
      e.target.style.borderColor = "var(--ea-blue)";
      e.target.style.boxShadow = "0 0 0 3px rgba(0,146,219,0.15)";
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      e.target.style.borderColor = "var(--border-card)";
      e.target.style.boxShadow = "none";
      rest.onBlur && rest.onBlur(e);
    }
  }, rest)));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Elevation Athletics — section / page heading.
 * Always BBH Bogle, uppercase. `level` sets the size step; `align` and `tone`
 * cover the dark-on-light and light-on-dark cases used across the site.
 */
function SectionHeading({
  children,
  level = "lg",
  align = "left",
  tone = "navy",
  as = "h2",
  style = {},
  ...rest
}) {
  const sizes = {
    xl: "clamp(48px, 6vw, 80px)",
    lg: "clamp(36px, 4.5vw, 64px)",
    md: "clamp(28px, 3vw, 48px)",
    sm: "clamp(22px, 2.4vw, 40px)",
    xs: "24px"
  };
  const tones = {
    navy: "var(--ea-navy)",
    teal: "var(--ea-teal-900)",
    white: "var(--ea-white)",
    blue: "var(--ea-blue)"
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--fw-regular)",
      textTransform: "uppercase",
      letterSpacing: "var(--ls-display)",
      lineHeight: "var(--lh-display)",
      fontSize: sizes[level],
      textAlign: align,
      color: tones[tone],
      margin: 0,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/media/Carousel.jsx
try { (() => {
/**
 * Elevation Athletics — image Carousel.
 * A simple swipeable image strip with EA dot pagination and optional arrows.
 * Matches the "drop-in" program poster pattern (image + dots beneath).
 */
function Carousel({
  images = [],
  alt = "",
  ratio = "3 / 4",
  arrows = true,
  autoPlay = false,
  interval = 4000,
  style = {}
}) {
  const [i, setI] = React.useState(0);
  const n = images.length;
  const go = React.useCallback(d => setI(p => (p + d + n) % n), [n]);
  React.useEffect(() => {
    if (!autoPlay || n < 2) return;
    const t = setInterval(() => setI(p => (p + 1) % n), interval);
    return () => clearInterval(t);
  }, [autoPlay, interval, n]);
  if (n === 0) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      aspectRatio: ratio,
      overflow: "hidden",
      background: "var(--ea-mist)"
    }
  }, images.map((src, k) => /*#__PURE__*/React.createElement("img", {
    key: k,
    src: src,
    alt: alt,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: k === i ? 1 : 0,
      transition: "opacity .4s ease"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, images.map((_, k) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => setI(k),
    "aria-label": `Slide ${k + 1}`,
    style: {
      width: 8,
      height: 8,
      padding: 0,
      border: "none",
      borderRadius: "var(--radius-pill)",
      cursor: "pointer",
      background: k === i ? "#8ac4e7" : "var(--ea-line-soft)",
      transition: "background .25s ease"
    }
  }))));
}
function Arrow({
  dir,
  onClick
}) {
  const left = dir === "left";
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    "aria-label": left ? "Previous" : "Next",
    style: {
      flex: "none",
      width: 40,
      height: 40,
      borderRadius: "50%",
      border: "1px solid var(--border-card)",
      background: "var(--ea-white)",
      boxShadow: "var(--shadow-card)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--ea-navy)",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: left ? "rotate(180deg)" : "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m9 18 6-6-6-6"
  })));
}
Object.assign(__ds_scope, { Carousel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/Carousel.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Elevation Athletics — Logo.
 * The mascot wordmark. EA brand rule: logos always sit on white and never
 * recolor. `variant` swaps to the sport-specific mascot (paddle, racquet, ball).
 * `base` is the path prefix to /assets/logos/ from the consuming page.
 */
const FILES = {
  master: {
    src: "ea-logo.svg",
    w: 503,
    h: 157
  },
  pickleball: {
    src: "pickleball-logo-stacked.png",
    w: 372,
    h: 372
  },
  badminton: {
    src: "badminton-logo-stacked.png",
    w: 372,
    h: 372
  },
  basketball: {
    src: "basketball-logo-stacked.png",
    w: 372,
    h: 372
  },
  stacked: {
    src: "ea-logo-stacked.png",
    w: 372,
    h: 372
  },
  // Horizontal sport lockups — used in each sport site's nav bar
  pickleballRow: {
    src: "pickleball-logo-horizontal.png",
    w: 755,
    h: 218
  },
  badmintonRow: {
    src: "badminton-logo-horizontal.png",
    w: 1006,
    h: 303
  },
  basketballRow: {
    src: "basketball-logo-horizontal.png",
    w: 1006,
    h: 284
  }
};
function Logo({
  variant = "master",
  height = 44,
  base = "assets/logos/",
  style = {},
  ...rest
}) {
  const f = FILES[variant] || FILES.master;
  return /*#__PURE__*/React.createElement("img", _extends({
    src: base + f.src,
    alt: "Elevation Athletics",
    width: Math.round(height * (f.w / f.h)),
    height: height,
    style: {
      display: "block",
      height,
      width: "auto",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Logo.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
/**
 * Elevation Athletics — top navigation bar.
 * White bar, mascot wordmark left, nav links center-right, a text link and a
 * primary CTA pinned right. Links with `caret` render a dropdown chevron.
 */
function Caret() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      marginLeft: 4
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }));
}
function NavBar({
  links = [{
    label: "Locations",
    caret: true
  }, {
    label: "Getting Started",
    caret: true
  }, {
    label: "Who We Are"
  }],
  secondaryLabel = "Connect with Us",
  ctaLabel = "Find a League Near You",
  onCta,
  base = "assets/logos/",
  logoVariant = "master",
  logoHeight = 48,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 40,
      height: "var(--nav-height)",
      padding: "0 40px",
      background: "var(--ea-white)",
      borderBottom: "1px solid var(--border-card)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: "flex",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: logoVariant,
    height: logoHeight,
    base: base
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 36
    }
  }, links.map((l, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: l.href || "#",
    style: {
      display: "inline-flex",
      alignItems: "center",
      fontFamily: "var(--font-body)",
      fontWeight: "var(--fw-semibold)",
      fontSize: 16,
      color: "var(--ea-navy)",
      textDecoration: "none",
      letterSpacing: "var(--ls-body)",
      whiteSpace: "nowrap"
    }
  }, l.label, l.caret && /*#__PURE__*/React.createElement(Caret, null)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: "var(--fw-medium)",
      fontSize: 16,
      color: "var(--ea-navy)",
      textDecoration: "none",
      whiteSpace: "nowrap"
    }
  }, secondaryLabel), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    onClick: onCta
  }, ctaLabel)));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NewsletterForm.jsx
try { (() => {
/**
 * Elevation Athletics — newsletter sign-up.
 * Centered heading + supporting line over a joined email field and Subscribe
 * button. The email field and button visually butt together (shared 8px radius).
 */
function NewsletterForm({
  heading = "Join Our Newsletter!",
  blurb = "Stay updated on upcoming training sessions, leagues, and tournaments in your area.",
  ctaLabel = "Subscribe",
  onSubmit,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      maxWidth: 520,
      margin: "0 auto",
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, {
    level: "sm",
    align: "center"
  }, heading), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 12,
      fontFamily: "var(--font-body)",
      fontSize: 16,
      color: "var(--text-body)",
      lineHeight: "var(--lh-body)"
    }
  }, blurb), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onSubmit && onSubmit(e);
    },
    style: {
      marginTop: 20,
      display: "flex",
      gap: 0,
      background: "var(--ea-white)",
      borderRadius: "var(--radius-input)",
      boxShadow: "var(--shadow-card)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Input, {
    placeholder: "Your Email",
    type: "email",
    style: {
      border: "none",
      boxShadow: "none",
      borderRadius: 0
    },
    onFocus: e => {
      e.target.style.boxShadow = "none";
      e.target.style.borderColor = "transparent";
    },
    onBlur: e => {
      e.target.style.boxShadow = "none";
      e.target.style.borderColor = "transparent";
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    type: "submit",
    style: {
      borderRadius: 0,
      flex: "none"
    }
  }, ctaLabel)));
}
Object.assign(__ds_scope, { NewsletterForm });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NewsletterForm.jsx", error: String((e && e.message) || e) }); }

// components/program/FaqItem.jsx
try { (() => {
/**
 * Elevation Athletics — FAQ accordion item.
 * White rounded card; the question sits in Inclusive Sans bold navy with a
 * chevron that points down when collapsed and up/left when open. Links inside
 * the answer use the EA highlight blue.
 */
function FaqItem({
  question,
  children,
  defaultOpen = false,
  style = {}
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--ea-white)",
      border: "1px solid var(--border-card)",
      borderRadius: "var(--radius-faq)",
      boxShadow: "var(--shadow-faq)",
      padding: "20px 28px",
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      all: "unset",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      width: "100%",
      cursor: "pointer",
      boxSizing: "border-box"
    },
    "aria-expanded": open
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: "var(--fw-bold)",
      fontSize: 20,
      color: "var(--ea-navy)",
      letterSpacing: "var(--ls-body)"
    }
  }, question), /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--ea-navy)",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none",
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform .2s ease"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontFamily: "var(--font-body)",
      fontSize: 18,
      lineHeight: "var(--lh-body)",
      color: "var(--ea-ink)"
    }
  }, children));
}
Object.assign(__ds_scope, { FaqItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/program/FaqItem.jsx", error: String((e && e.message) || e) }); }

// components/program/LocationCard.jsx
try { (() => {
/**
 * Elevation Athletics — Location / program card.
 * The repeating tile on the "Play Pickleball in <region>" pages: city name,
 * a status dot, count + status badges, a lessons/leagues meta line, and a
 * Subscribe affordance.
 */
function MailIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "5",
    width: "18",
    height: "14",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m3 7 9 6 9-6"
  }));
}
const STATUS = {
  open: {
    dot: "var(--ea-success)",
    tone: "success",
    label: "Enrolment Open"
  },
  limited: {
    dot: "var(--ea-warning)",
    tone: "warning",
    label: "Limited Spots Remaining"
  },
  closed: {
    dot: "var(--ea-neutral)",
    tone: "neutral",
    label: "Enrolment Closed"
  }
};
function LocationCard({
  city,
  programs = 0,
  status = "open",
  lessons = 0,
  leagues = 0,
  onSubscribe,
  style = {}
}) {
  const s = STATUS[status] || STATUS.open;
  const dim = status === "closed";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--ea-white)",
      border: "1px solid var(--border-card)",
      borderRadius: "var(--radius-location-card)",
      boxShadow: "var(--shadow-card)",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: "var(--fw-bold)",
      fontSize: 22,
      color: dim ? "var(--ea-muted)" : "var(--ea-teal-800)",
      margin: 0,
      textTransform: "none",
      letterSpacing: "var(--ls-body)"
    }
  }, city), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: s.dot,
      flex: "none",
      marginTop: 6
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: dim ? "neutral" : "info"
  }, programs, " Active Programs"), /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: s.tone,
    dot: !dim
  }, s.label)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 16,
      color: "var(--ea-slate)",
      margin: 0
    }
  }, lessons, " Lessons \xB7 ", leagues, " Leagues"), /*#__PURE__*/React.createElement("button", {
    onClick: onSubscribe,
    style: {
      alignSelf: "flex-start",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 12px",
      background: "var(--ea-mist)",
      color: "var(--ea-slate)",
      border: "none",
      borderRadius: "var(--radius-button)",
      fontFamily: "var(--font-body)",
      fontSize: 15,
      fontWeight: "var(--fw-medium)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(MailIcon, null), " Subscribe"));
}
Object.assign(__ds_scope, { LocationCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/program/LocationCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/badminton/BadmintonHome.jsx
try { (() => {
const EAB = window.ElevationAthleticsDesignSystem_58666d;
const {
  NavBar,
  SectionHeading,
  Button,
  Card,
  LocationCard,
  NewsletterForm
} = EAB;
const BD_BASE = "../../assets/logos/";
const BD_PHOTO = "../../assets/photos/";
function BadmintonHome() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff"
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    base: BD_BASE,
    logoVariant: "badmintonRow",
    logoHeight: 52,
    links: [{
      label: "Lessons & Leagues",
      caret: true
    }, {
      label: "Camps",
      caret: true
    }],
    ctaLabel: "Book Your Free Trial"
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      textAlign: "center",
      padding: "60px 24px 36px",
      maxWidth: 720,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "lg",
    align: "center",
    as: "h1"
  }, "Badminton Starts Here"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      color: "var(--ea-ink)",
      lineHeight: 1.5,
      margin: "16px auto 0",
      maxWidth: 540
    }
  }, "We offer badminton programs for children of all ages and skill levels. With experienced coaches, small group sessions, and a focus on fun and improvement."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      justifyContent: "center",
      marginTop: 26,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Book Your Free Trial"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg"
  }, "Find Lessons & Leagues"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1184,
      margin: "0 auto",
      padding: "0 32px"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/illustrations/badminton-hero.png",
    alt: "Badminton court",
    style: {
      width: "100%",
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 56
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "md"
  }, "Our Active Programs"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16,
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(LocationCard, {
    city: "Richmond Hill",
    programs: 10,
    status: "open",
    lessons: 2,
    leagues: 8,
    onSubscribe: () => {}
  }), /*#__PURE__*/React.createElement(LocationCard, {
    city: "Vaughan",
    programs: 10,
    status: "open",
    lessons: 2,
    leagues: 8,
    onSubscribe: () => {}
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 80,
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 20,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingRight: 12
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "md"
  }, "Spotlight Section"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      color: "var(--ea-ink)",
      lineHeight: 1.5,
      marginTop: 16
    }
  }, "Small group coaching that meets every player where they are. Our sessions build skills, confidence, and a love of the game."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Call To Action"))), /*#__PURE__*/React.createElement("img", {
    src: BD_PHOTO + "community-ribbon.png",
    alt: "",
    style: {
      width: "100%",
      aspectRatio: "1/1",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/illustrations/birdie.png",
    alt: "Shuttlecock",
    style: {
      width: "100%",
      aspectRatio: "1/1",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: BD_PHOTO + "clinic-1.png",
    alt: "",
    style: {
      width: "100%",
      aspectRatio: "1/1",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: BD_PHOTO + "community-ribbon.png",
    alt: "",
    style: {
      width: "100%",
      aspectRatio: "1/1",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/illustrations/net.png",
    alt: "Net",
    style: {
      width: "100%",
      aspectRatio: "1/1",
      objectFit: "cover"
    }
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 80
    }
  }, /*#__PURE__*/React.createElement(Card, {
    tone: "sky",
    pad: 36,
    style: {
      borderRadius: "var(--radius-lg)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "md"
  }, "Want to be a part of the community?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      color: "var(--ea-navy)",
      lineHeight: 1.5,
      marginTop: 14,
      maxWidth: 620
    }
  }, "From first-timers to future champions, Elevation Athletics badminton is built around fun, inclusive play for every family.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 24,
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(BdCommunityCard, {
    tone: "var(--ea-sky)",
    title: "Community Partnerships",
    cta: "Learn More"
  }), /*#__PURE__*/React.createElement(BdCommunityCard, {
    tone: "var(--ea-peach)",
    title: "Become a Community Leader",
    cta: "Apply Today"
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 80,
      padding: "64px 24px 80px",
      background: "var(--ea-white)"
    }
  }, /*#__PURE__*/React.createElement(NewsletterForm, {
    blurb: "Stay updated on upcoming lessons and leagues for badminton in your area.",
    onSubmit: () => {}
  })));
}
function BdCommunityCard({
  tone,
  title,
  cta
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: tone,
      borderRadius: "var(--radius-lg)",
      padding: 28,
      paddingTop: 120
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      borderRadius: "var(--radius-md)",
      padding: "24px 28px",
      textAlign: "center",
      boxShadow: "var(--shadow-card)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "xs",
    align: "center",
    as: "h3"
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: "var(--ea-ink)",
      lineHeight: 1.5,
      margin: "12px 0 18px"
    }
  }, "Help bring inclusive, low-cost badminton to your township. We'll set you up with courts, coaching, and leagues."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, cta)));
}
window.BadmintonHome = BadmintonHome;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/badminton/BadmintonHome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/employment/EmploymentPage.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const EAE = window.ElevationAthleticsDesignSystem_58666d;
const {
  NavBar,
  SectionHeading,
  Button,
  Badge,
  Card,
  NewsletterForm
} = EAE;
const BASE = "../../assets/logos/";
const ROLES = ["Coaching", "General Admin", "Camp Counselor"];
const SPORTS = ["Pickleball", "Basketball", "Badminton", "Soccer", "Volleyball"];
const CERTS = ["Valid First Aid / CPR", "Valid Vulnerable Sector Check", "Valid Drivers Licence", "None"];
const PROVINCES = ["Ontario", "British Columbia", "Nova Scotia", "Saskatchewan", "Manitoba", "Alberta"];
const EXPERIENCES = ["Current EA Athlete", "EA Alum", "Played and Love Sports", "New and want to be part of the EA Family!"];
function Checkbox({
  label,
  name,
  checked,
  onChange
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      cursor: "pointer",
      fontFamily: "var(--font-body)",
      fontSize: 16,
      color: "var(--ea-ink)",
      userSelect: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      border: "2px solid " + (checked ? "var(--ea-blue)" : "var(--ea-line-soft)"),
      borderRadius: 4,
      background: checked ? "var(--ea-blue)" : "#fff",
      flex: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all .15s ease"
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 6l3 3 5-5",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), label);
}
function Radio({
  label,
  name,
  checked,
  onChange
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      cursor: "pointer",
      fontFamily: "var(--font-body)",
      fontSize: 16,
      color: "var(--ea-ink)",
      userSelect: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      border: "2px solid " + (checked ? "var(--ea-blue)" : "var(--ea-line-soft)"),
      borderRadius: "50%",
      background: "#fff",
      flex: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all .15s ease"
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: "var(--ea-blue)"
    }
  })), label);
}
function FieldLabel({
  children,
  required
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: 700,
      fontSize: 15,
      color: "var(--ea-navy)",
      marginBottom: 8
    }
  }, children, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ea-blue)",
      marginLeft: 3
    }
  }, "*"));
}
function FieldGroup({
  children,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      ...style
    }
  }, children);
}
function StyledInput({
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    style: {
      width: "100%",
      padding: "12px 14px",
      fontFamily: "var(--font-body)",
      fontSize: 16,
      color: "var(--ea-ink)",
      background: "#fff",
      border: "1px solid var(--ea-line-soft)",
      borderRadius: "var(--radius-input)",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color .15s ease, box-shadow .15s ease",
      ...style
    },
    onFocus: e => {
      e.target.style.borderColor = "var(--ea-blue)";
      e.target.style.boxShadow = "0 0 0 3px rgba(0,146,219,.12)";
    },
    onBlur: e => {
      e.target.style.borderColor = "var(--ea-line-soft)";
      e.target.style.boxShadow = "none";
    }
  }, rest));
}
function StyledSelect({
  children,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("select", _extends({
    style: {
      width: "100%",
      padding: "12px 14px",
      fontFamily: "var(--font-body)",
      fontSize: 16,
      color: "var(--ea-ink)",
      background: "#fff",
      border: "1px solid var(--ea-line-soft)",
      borderRadius: "var(--radius-input)",
      outline: "none",
      boxSizing: "border-box",
      appearance: "none",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2347636B' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 14px center",
      transition: "border-color .15s ease",
      ...style
    }
  }, rest), children);
}
function EmploymentPage() {
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    province: "",
    experience: "",
    role: "",
    sports: {},
    certs: {},
    consent: false
  });
  const [submitted, setSubmitted] = React.useState(false);
  const toggle = (field, key) => setForm(f => ({
    ...f,
    [field]: {
      ...f[field],
      [key]: !f[field][key]
    }
  }));
  const set = (key, val) => setForm(f => ({
    ...f,
    [key]: val
  }));
  if (submitted) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        padding: "120px 24px"
      }
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      level: "md",
      align: "center"
    }, "Application Received!"), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: 16,
        fontSize: 18,
        color: "var(--ea-ink)"
      }
    }, "Thank you \u2014 we'll be in touch soon."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 32
      }
    }, /*#__PURE__*/React.createElement(Button, {
      onClick: () => setSubmitted(false)
    }, "Submit Another")));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff"
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    base: BASE,
    logoVariant: "master",
    logoHeight: 48
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--ea-peach)",
      padding: "64px 24px 56px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: 48,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    tone: "warm",
    style: {
      marginBottom: 16
    }
  }, "Summer 2026"), /*#__PURE__*/React.createElement(SectionHeading, {
    level: "lg",
    as: "h1"
  }, "EA Youth Leadership Development Program"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 18,
      lineHeight: 1.6,
      color: "var(--ea-teal-900)",
      marginTop: 20,
      maxWidth: 560
    }
  }, "A 2\u20134 month paid opportunity (May\u2013August) open to high school students, university/college students, and recent graduates. Build leadership, teamwork, and communication skills through hands-on roles within our organization."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginTop: 24,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://docs.google.com/document/d/18rCD-mAbleXNDGsfRLVGLgoBP1a6Hqw1GOhx2A70qH8/edit?usp=sharing",
    target: "_blank",
    rel: "noreferrer"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Camp Counselor Job Description")), /*#__PURE__*/React.createElement("a", {
    href: "https://docs.google.com/document/d/1GYw2IJ3T07MTqodzLoCS5vbQL7QZQV6nQRSYFQ4ulSE/edit?usp=sharing",
    target: "_blank",
    rel: "noreferrer"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary"
  }, "Coach Job Description")))), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/ea-logo-stacked.png",
    alt: "",
    style: {
      height: 180,
      width: "auto",
      flex: "none",
      display: "block"
    }
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 900,
      margin: "0 auto",
      padding: "64px 24px 96px"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "sm",
    as: "h2",
    style: {
      marginBottom: 40
    }
  }, "Apply Now"), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSubmitted(true);
    },
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement(FieldGroup, null, /*#__PURE__*/React.createElement(FieldLabel, {
    required: true
  }, "Your Name"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StyledInput, {
    placeholder: "First",
    value: form.firstName,
    onChange: e => set("firstName", e.target.value)
  }), /*#__PURE__*/React.createElement(StyledInput, {
    placeholder: "Last",
    value: form.lastName,
    onChange: e => set("lastName", e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(FieldGroup, null, /*#__PURE__*/React.createElement(FieldLabel, {
    required: true
  }, "Your Email"), /*#__PURE__*/React.createElement(StyledInput, {
    type: "email",
    placeholder: "you@email.com",
    value: form.email,
    onChange: e => set("email", e.target.value)
  })), /*#__PURE__*/React.createElement(FieldGroup, null, /*#__PURE__*/React.createElement(FieldLabel, {
    required: true
  }, "Your Phone Number"), /*#__PURE__*/React.createElement(StyledInput, {
    type: "tel",
    placeholder: "(416) 555-0100",
    value: form.phone,
    onChange: e => set("phone", e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(FieldGroup, null, /*#__PURE__*/React.createElement(FieldLabel, null, "Province"), /*#__PURE__*/React.createElement(StyledSelect, {
    value: form.province,
    onChange: e => set("province", e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select Province"), PROVINCES.map(p => /*#__PURE__*/React.createElement("option", {
    key: p,
    value: p
  }, p)))), /*#__PURE__*/React.createElement(FieldGroup, null, /*#__PURE__*/React.createElement(FieldLabel, {
    required: true
  }, "Sports Experience"), /*#__PURE__*/React.createElement(StyledSelect, {
    value: form.experience,
    onChange: e => set("experience", e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select your experience"), EXPERIENCES.map(x => /*#__PURE__*/React.createElement("option", {
    key: x,
    value: x
  }, x))))), /*#__PURE__*/React.createElement(FieldGroup, null, /*#__PURE__*/React.createElement(FieldLabel, {
    required: true
  }, "What Role Are You Interested In?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, ROLES.map(r => /*#__PURE__*/React.createElement(Radio, {
    key: r,
    label: r,
    checked: form.role === r,
    onChange: () => set("role", r)
  })))), /*#__PURE__*/React.createElement(FieldGroup, null, /*#__PURE__*/React.createElement(FieldLabel, {
    required: true
  }, "Select the sports program(s) you'd like to lead"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, SPORTS.map(s => /*#__PURE__*/React.createElement(Checkbox, {
    key: s,
    label: s,
    checked: !!form.sports[s],
    onChange: () => toggle("sports", s)
  })))), /*#__PURE__*/React.createElement(FieldGroup, null, /*#__PURE__*/React.createElement(FieldLabel, {
    required: true
  }, "Do you currently have any of the following?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, CERTS.map(c => /*#__PURE__*/React.createElement(Checkbox, {
    key: c,
    label: c,
    checked: !!form.certs[c],
    onChange: () => toggle("certs", c)
  })))), /*#__PURE__*/React.createElement(FieldGroup, null, /*#__PURE__*/React.createElement(FieldLabel, {
    required: true
  }, "Upload Your Resume"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "32px 24px",
      border: "2px dashed var(--ea-line-soft)",
      cursor: "pointer",
      fontFamily: "var(--font-body)",
      color: "var(--ea-slate)",
      fontSize: 15
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "32",
    height: "32",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--ea-blue)",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "17 8 12 3 7 8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "3",
    x2: "12",
    y2: "15"
  })), /*#__PURE__*/React.createElement("span", null, "Drag & Drop or ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ea-blue)",
      fontWeight: 600
    }
  }, "Choose File")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--ea-muted)"
    }
  }, "PDF, DOC, DOCX"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".pdf,.doc,.docx",
    style: {
      display: "none"
    }
  }))), /*#__PURE__*/React.createElement(FieldGroup, null, /*#__PURE__*/React.createElement(FieldLabel, {
    required: true
  }, "Privacy Consent"), /*#__PURE__*/React.createElement(Checkbox, {
    label: "By submitting this application, I consent to Elevation Athletics retaining my information for the purpose of evaluating my candidacy and contacting me about current or future opportunities.",
    checked: form.consent,
    onChange: () => set("consent", !form.consent)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    type: "submit"
  }, "Submit Application")))), /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--ea-teal-900)",
      color: "var(--ea-white)",
      padding: "56px 40px 40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1184,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr 1fr",
      gap: 48,
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: BASE + "ea-logo.svg",
    alt: "Elevation Athletics",
    style: {
      height: 48,
      width: "auto",
      background: "#fff",
      padding: "6px 10px",
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      fontSize: 15,
      lineHeight: 1.6,
      color: "rgba(255,255,255,.7)",
      maxWidth: 280
    }
  }, "Elevation Athletics delivers inclusive, high-quality sport programming that helps young athletes grow with confidence.")), [{
    heading: "Basketball",
    links: ["EA Private Programs", "House League", "1-on-1 Training", "Rep Teams", "Rep Development"]
  }, {
    heading: "EA Programs",
    links: ["Pickleball", "Badminton", "Soccer", "Camps", "Community Partnerships"]
  }, {
    heading: "Join & Connect",
    links: ["Join Our Team", "Instagram", "Facebook", "YouTube"]
  }].map(col => /*#__PURE__*/React.createElement("div", {
    key: col.heading
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-display)",
      textTransform: "uppercase",
      fontSize: 18,
      letterSpacing: ".02em",
      color: "#fff",
      margin: "0 0 16px"
    }
  }, col.heading), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, col.links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      color: "rgba(255,255,255,.65)",
      fontSize: 15,
      fontFamily: "var(--font-body)",
      textDecoration: "none",
      fontWeight: 400
    }
  }, l)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid rgba(255,255,255,.12)",
      paddingTop: 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "rgba(255,255,255,.5)",
      fontFamily: "var(--font-body)"
    }
  }, "\xA9 Elevation Athletics. All rights reserved."), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 380,
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement(NewsletterForm, {
    heading: "",
    blurb: "",
    ctaLabel: "Subscribe",
    onSubmit: () => {},
    style: {
      margin: 0
    }
  }))))));
}
window.EmploymentPage = EmploymentPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/employment/EmploymentPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pickleball/FaqScreen.jsx
try { (() => {
const EAF = window.ElevationAthleticsDesignSystem_58666d;
const FAQS = [{
  q: "How do i join a weekly league?",
  a: /*#__PURE__*/React.createElement(React.Fragment, null, "We have leagues across Canada! To find one near you, go to our ", /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "league hub"), " and find your town or a nearby area. From there, check if any programs are currently open and register directly through the link on your town's page."),
  open: true
}, {
  q: "What are EA weekly pickleball leagues?",
  a: "The EA Weekly Pickleball Leagues are development doubles leagues. You don't need a registered partner—each week you'll be assigned to play with three other league members, earning individual points. EA Coaches tally points and rank players in the league standings, and you'll play against a different set of players each week.",
  open: true
}, {
  q: "Do I need my own equipment?",
  a: "Nope! Paddles and balls are provided at every drop-in and league session. Just bring court shoes and water—though you're always welcome to bring your own paddle once you find one you love."
}, {
  q: "What skill level are the programs for?",
  a: "All of them! We run beginner clinics, intermediate development leagues, and competitive play. New players are matched with others at a similar level so everyone has fun and improves."
}, {
  q: "How much does it cost to play?",
  a: "We keep things low-cost on purpose. Most drop-ins are around $7 per session, and league fees vary by town. Pricing is always listed on your town's program page."
}, {
  q: "Where are sessions held?",
  a: "In community gyms, curling clubs, and recreation centres—especially in smaller and underserviced townships across Canada. Check the league hub for the venue nearest you."
}];
function FaqScreen({
  onNav
}) {
  const {
    NavBar,
    SectionHeading,
    FaqItem
  } = EAF;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      minHeight: "100vh"
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    base: "../../assets/logos/",
    logoVariant: "pickleballRow",
    logoHeight: 52,
    onCta: () => onNav("region")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1184,
      margin: "0 auto",
      padding: "48px 32px 96px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 40,
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "lg",
    tone: "teal",
    as: "h1"
  }, "Frequently Asked Questions"), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/pickleball-logo-stacked.png",
    alt: "",
    style: {
      height: 150,
      width: "auto",
      flex: "none"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, FAQS.map((f, i) => /*#__PURE__*/React.createElement(FaqItem, {
    key: i,
    question: f.q,
    defaultOpen: !!f.open
  }, f.a)))));
}
window.FaqScreen = FaqScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pickleball/FaqScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pickleball/PickleballHome.jsx
try { (() => {
const EA = window.ElevationAthleticsDesignSystem_58666d;
const {
  NavBar,
  SectionHeading,
  Button,
  Badge,
  Card,
  LocationCard,
  NewsletterForm,
  Carousel
} = EA;
const PB_BASE = "../../assets/logos/";
const PHOTO = "../../assets/photos/";
function PickleballHome({
  onNav
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff"
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    base: PB_BASE,
    logoVariant: "pickleballRow",
    logoHeight: 52,
    onCta: () => onNav("region")
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      textAlign: "center",
      padding: "64px 24px 40px",
      maxWidth: 760,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "lg",
    align: "center",
    as: "h1"
  }, "Play Pickleball in Ontario"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      color: "var(--ea-ink)",
      lineHeight: 1.5,
      margin: "16px auto 0",
      maxWidth: 560
    }
  }, "Join Canada's most exciting and fastest-growing pickleball community! We welcome players of all skill levels onto the court."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      justifyContent: "center",
      marginTop: 28,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: () => onNav("region")
  }, "Find a League Near You"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    onClick: () => onNav("faq")
  }, "New to Pickleball? Start Here"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1184,
      margin: "0 auto",
      padding: "0 32px"
    }
  }, /*#__PURE__*/React.createElement(KitIllustration, {
    component: window.Frame50,
    nativeW: 1310,
    nativeH: 503
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 32,
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr",
      gap: 24,
      alignItems: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    tone: "sky",
    pad: 36,
    style: {
      borderRadius: "var(--radius-lg)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "md"
  }, "Check out our new programs!"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      color: "var(--ea-navy)",
      lineHeight: 1.5,
      marginTop: 14,
      maxWidth: 460
    }
  }, "Drop-in sessions, weekly leagues, and beginner clinics are opening across the country this season."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => onNav("region")
  }, "See What's New"))), /*#__PURE__*/React.createElement(Carousel, {
    images: [PHOTO + "clinic-1.png", PHOTO + "community-ribbon.png", PHOTO + "clinic-2.png"],
    ratio: "3 / 4",
    autoPlay: true
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 72,
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 20,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingRight: 12
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "md"
  }, "Spotlight Section"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      color: "var(--ea-ink)",
      lineHeight: 1.5,
      marginTop: 16
    }
  }, "Real clinics, real communities. Every week our coaches run beginner-friendly sessions in gyms and curling clubs across the country."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Call To Action"))), /*#__PURE__*/React.createElement("img", {
    src: PHOTO + "community-ribbon.png",
    alt: "Community ribbon cutting",
    style: {
      width: "100%",
      height: 240,
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--ea-peach)",
      height: 240,
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--ea-blue-court)",
      clipPath: "polygon(0 0, 60% 0, 0 60%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 24,
      bottom: 24,
      width: 70,
      height: 70,
      borderRadius: "50%",
      background: "var(--ea-orange)",
      border: "3px solid var(--ea-orange-dark)"
    }
  })), /*#__PURE__*/React.createElement("img", {
    src: PHOTO + "clinic-1.png",
    alt: "Clinic",
    style: {
      width: "100%",
      height: 220,
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--ea-blue-court)",
      height: 220
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: PHOTO + "clinic-2.png",
    alt: "Clinic",
    style: {
      width: "100%",
      height: 220,
      objectFit: "cover"
    }
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 80
    }
  }, /*#__PURE__*/React.createElement(Card, {
    tone: "sky",
    pad: 36,
    style: {
      borderRadius: "var(--radius-lg)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "md"
  }, "Want to be a part of the community?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      color: "var(--ea-navy)",
      lineHeight: 1.5,
      marginTop: 14,
      maxWidth: 620
    }
  }, "Whether you're picking up a paddle for the first time or organizing play in your township, there's a place for you at Elevation Athletics.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 24,
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(CommunityCard, {
    tone: "var(--ea-sky)",
    title: "Community Partnerships",
    cta: "Learn More"
  }), /*#__PURE__*/React.createElement(CommunityCard, {
    tone: "var(--ea-peach)",
    title: "Become a Community Leader",
    cta: "Apply Today",
    ctaVariant: "primary"
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 80
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "md"
  }, "Follow us on Instagram @EAPickleball"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(5,1fr)",
      gap: 16,
      marginTop: 24
    }
  }, [PHOTO + "clinic-1.png", PHOTO + "community-ribbon.png", PHOTO + "clinic-2.png", PHOTO + "clinic-1.png", PHOTO + "community-ribbon.png"].map((src, i) => /*#__PURE__*/React.createElement("img", {
    key: i,
    src: src,
    alt: "",
    style: {
      width: "100%",
      aspectRatio: "1/1",
      objectFit: "cover",
      borderRadius: "var(--radius-md)"
    }
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 80,
      padding: "64px 24px 80px",
      background: "var(--ea-white)"
    }
  }, /*#__PURE__*/React.createElement(NewsletterForm, {
    onSubmit: () => {}
  })));
}
function CommunityCard({
  tone,
  title,
  cta,
  ctaVariant = "primary"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: tone,
      borderRadius: "var(--radius-lg)",
      padding: 28,
      paddingTop: 120
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      borderRadius: "var(--radius-md)",
      padding: "24px 28px",
      textAlign: "center",
      boxShadow: "var(--shadow-card)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "xs",
    align: "center",
    as: "h3"
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: "var(--ea-ink)",
      lineHeight: 1.5,
      margin: "12px 0 18px"
    }
  }, "Bring inclusive, low-cost play to your community. We'll help you set up courts, coaching, and leagues."), /*#__PURE__*/React.createElement(Button, {
    variant: ctaVariant
  }, cta)));
}
window.PickleballHome = PickleballHome;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pickleball/PickleballHome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pickleball/RegionScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const EAR = window.ElevationAthleticsDesignSystem_58666d;
function SearchIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 21-4.3-4.3"
  }));
}
const BC_DATA = [{
  city: "Victoria, BC",
  programs: 10,
  status: "open",
  lessons: 2,
  leagues: 8
}, {
  city: "Squamish, BC",
  programs: 10,
  status: "open",
  lessons: 0,
  leagues: 10
}, {
  city: "Surrey, BC",
  programs: 10,
  status: "limited",
  lessons: 2,
  leagues: 8
}, {
  city: "Prince George, BC",
  programs: 4,
  status: "limited",
  lessons: 2,
  leagues: 2
}, {
  city: "Kelowna, BC",
  programs: 10,
  status: "closed",
  lessons: 2,
  leagues: 8
}, {
  city: "Nanaimo, BC",
  programs: 10,
  status: "closed",
  lessons: 2,
  leagues: 8
}, {
  city: "Richmond, BC",
  programs: 0,
  status: "closed",
  lessons: 0,
  leagues: 0
}, {
  city: "Vernon, BC",
  programs: 0,
  status: "closed",
  lessons: 0,
  leagues: 0
}];
const FILTERS = [{
  key: "open",
  label: "Enrolment Open",
  tone: "success"
}, {
  key: "limited",
  label: "Limited Spots Remaining",
  tone: "warning"
}, {
  key: "closed",
  label: "Enrolment Closed",
  tone: "neutral"
}];
function RegionScreen({
  onNav
}) {
  const {
    NavBar,
    SectionHeading,
    Input,
    Badge,
    LocationCard
  } = EAR;
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState({
    open: true,
    limited: true,
    closed: true
  });
  const rows = BC_DATA.filter(d => d.city.toLowerCase().includes(q.toLowerCase()) && active[d.status]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      minHeight: "100vh"
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    base: "../../assets/logos/",
    logoVariant: "pickleballRow",
    logoHeight: 52,
    onCta: () => onNav("home")
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      textAlign: "center",
      padding: "56px 24px 40px"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "xl",
    align: "center",
    tone: "teal",
    as: "h1"
  }, "Play Pickleball in BC"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 22,
      color: "var(--ea-teal-900)",
      marginTop: 12
    }
  }, "Spring and Summer Registration Now Open!")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1184,
      margin: "0 auto",
      padding: "0 32px 80px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 24
    }
  }, ["var(--ea-blue-court)", "var(--ea-blue-court)", "var(--ea-blue-court)"].map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: c,
      borderRadius: "var(--radius-md)",
      height: 300
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "md"
  }, "British Columbia Programs"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search by City",
    icon: /*#__PURE__*/React.createElement(SearchIcon, null),
    value: q,
    onChange: e => setQ(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginTop: 16,
      flexWrap: "wrap",
      border: "1px solid var(--ea-line)",
      borderRadius: "var(--radius-sm)",
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      color: "var(--ea-slate)",
      fontWeight: 600,
      fontSize: 15
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 4h18l-7 9v6l-4 2v-8z"
  })), "Active Filters:"), FILTERS.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.key,
    onClick: () => setActive(a => ({
      ...a,
      [f.key]: !a[f.key]
    })),
    style: {
      all: "unset",
      cursor: "pointer",
      opacity: active[f.key] ? 1 : 0.4
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: f.tone,
    dot: active[f.key]
  }, f.label, " ", active[f.key] ? "✓" : "")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16,
      marginTop: 24
    }
  }, rows.map(d => /*#__PURE__*/React.createElement(LocationCard, _extends({
    key: d.city
  }, d, {
    onSubscribe: () => {}
  }))), rows.length === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--ea-slate)",
      fontSize: 16
    }
  }, "No locations match your search.")))));
}
window.RegionScreen = RegionScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pickleball/RegionScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shared/KitIllustration.jsx
try { (() => {
// Shared UI-kit helper: scales a fixed-size bundle illustration to fill its
// container width while preserving aspect ratio. Loaded by both website kits.
function KitIllustration({
  component,
  nativeW,
  nativeH,
  style = {},
  rounded = false
}) {
  const ref = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / nativeW));
    ro.observe(el);
    return () => ro.disconnect();
  }, [nativeW]);
  const Comp = component;
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: "relative",
      width: "100%",
      height: nativeH * scale,
      overflow: "hidden",
      borderRadius: rounded ? "var(--radius-lg)" : 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: nativeW,
      height: nativeH,
      transform: `scale(${scale})`,
      transformOrigin: "top left"
    }
  }, /*#__PURE__*/React.createElement(Comp, null)));
}
window.KitIllustration = KitIllustration;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shared/KitIllustration.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Carousel = __ds_scope.Carousel;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.NewsletterForm = __ds_scope.NewsletterForm;

__ds_ns.FaqItem = __ds_scope.FaqItem;

__ds_ns.LocationCard = __ds_scope.LocationCard;

})();
