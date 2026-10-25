import re, math, sys
A = sys.argv[1]; OUT = sys.argv[2]
src = open(A + '/tokens.css').read()

def lin(c):
    c /= 255
    return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055)**2.4
def oklch(r, g, b, a=1.0):
    r, g, b = lin(r), lin(g), lin(b)
    l = 0.4122214708*r + 0.5363325363*g + 0.0514459929*b
    m = 0.2119034982*r + 0.6806995451*g + 0.1073969566*b
    s = 0.0883024619*r + 0.2817188376*g + 0.6299787005*b
    l, m, s = [math.copysign(abs(x)**(1/3), x) for x in (l, m, s)]
    L = 0.2104542553*l + 0.7936177850*m - 0.0040720468*s
    A_ = 1.9779984951*l - 2.4285922050*m + 0.4505937099*s
    B = 0.0259040371*l + 0.7827717662*m - 0.8086757660*s
    C = math.hypot(A_, B); H = math.degrees(math.atan2(B, A_)) % 360
    if C < 0.0005: C, H = 0, 0
    Ls = f"{L*100:.2f}".rstrip('0').rstrip('.') + '%'
    Cs = f"{C:.4f}".rstrip('0').rstrip('.') or '0'
    Hs = f"{H:.1f}".rstrip('0').rstrip('.') or '0'
    al = '' if a >= 1 else f" / {a:g}"
    return f"oklch({Ls} {Cs} {Hs}{al})"
def hexrep(m):
    h = m.group(1)
    if len(h) == 3: h = ''.join(c*2 for c in h)
    return oklch(int(h[0:2],16), int(h[2:4],16), int(h[4:6],16))
def rgbrep(m):
    p = [float(x) for x in re.split(r'[,\s/]+', m.group(1).strip()) if x]
    return oklch(p[0], p[1], p[2], p[3] if len(p) > 3 else 1)
def conv(t):
    t = re.sub(r'#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b', hexrep, t)
    t = re.sub(r'rgba?\(([^)]*)\)', rgbrep, t)
    return t.replace('in srgb', 'in oklch')

# bloques del tokens.css generado
dark = re.search(r':root, \[data-theme="dark"\] \{(.*?)\n\}', src, re.S).group(1)
light = re.search(r'\[data-theme="light"\] \{(.*?)\n\}', src, re.S).group(1)
base = re.search(r'\n:root \{(.*?)\n\}', src, re.S).group(1)
faces = '\n'.join(re.findall(r'@font-face \{.*?\}', src))
faces = faces.replace('url("fonts/', 'url("../../fonts/')
dark, light, base = conv(dark), conv(light), conv(base)

out = f'''/* ============================================================
   FRENCIA WEB · tokens exportables (Lume)
   Mismos nombres semánticos que tokens.json / la app iOS. Todos los
   colores en oklch. Generado desde tokens.json: si cambia un valor,
   se regenera este archivo; no se edita a mano.

   Tema:
   - <html data-theme="dark">   fuerza oscuro
   - <html data-theme="light">  fuerza claro
   - <html data-theme="system"> o sin atributo: sigue al sistema
     (prefers-color-scheme). Es el valor por defecto de la cuenta
     (profiles.tema = 'sistema').
   El cambio de tema sobreescribe colores, sombras/halos y la ganancia
   de las luces del fondo (--fondo-ganancia).
   ============================================================ */

{faces}

/* ---- Constantes: no dependen del tema ---- */
:root {{{base}

  /* ---- Web: anchos de la variable (eje wdth de Instrument Sans) ---- */
  --vs-condensed: "wdth" 78;
  --vs-semi: "wdth" 88;
  --vs-normal: "wdth" 100;

  /* ---- Roles de texto (font shorthand), iguales a la app ---- */
  --text-hero: var(--fw-medium) var(--fs-display-2xl)/var(--lh-tight) var(--font-display);
  --text-display: var(--fw-medium) var(--fs-display-md)/1.08 var(--font-display);
  --text-title: var(--fw-semibold) var(--fs-title-lg)/var(--lh-snug) var(--font-sans);
  --text-subtitle: var(--fw-semibold) var(--fs-title-md)/var(--lh-heading) var(--font-sans);
  --text-body: var(--fw-regular) var(--fs-body-lg)/var(--lh-body) var(--font-sans);
  --text-body-sm: var(--fw-regular) var(--fs-body-md)/1.45 var(--font-sans);
  --text-data: var(--fw-medium) 15px/1.2 var(--font-sans);
  --text-label: var(--fw-semibold) var(--fs-label-md)/1.25 var(--font-sans);
  --text-meta: var(--fw-regular) var(--fs-label-md)/1.3 var(--font-mono);

  /* ---- Vidrio real: backdrop-filter ---- */
  --glass-filter: blur(var(--blur-glass)) saturate(1.5);
  --sheet-filter: blur(var(--blur-sheet)) saturate(1.5);

  /* ---- Movimiento: preciso, sin rebote ---- */
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-fast: 110ms;
  --dur-base: 180ms;
  --dur-slow: 280ms;
  --dur-fundido: 420ms;
  --press-scale: 0.985;

  /* ---- Web: estructura de escritorio ---- */
  --nav-w: 248px;            /* navegación lateral expandida */
  --nav-w-rail: 76px;        /* riel: pantallas medianas o colapsada */
  --contenido-max: 1200px;   /* ancho máximo del contenido de una página */
  --pad-pagina: 40px;        /* margen lateral del contenido (32px en mediana) */
  --barra-h: 64px;           /* barra superior del constructor */
  --catalogo-w: 340px;       /* catálogo del constructor (296px en mediana) */
  --panel-w: 400px;          /* panel lateral de configuración */
  --columna-dia-w: 300px;    /* columna de un día en el constructor */
  --modal-w-sm: 440px;
  --modal-w-md: 560px;
  --foco-w: 2px;             /* anillo de foco de teclado */
  --foco-offset: 2px;
  --z-nav: 20; --z-panel: 30; --z-arrastre: 40; --z-modal: 50; --z-toast: 60; --z-tooltip: 70;
  /* Breakpoints (para @media, documentados acá; CSS no los lee como var):
     mínimo 1024 · mediana 1024–1279 · grande 1280–1599 · amplia ≥ 1600 */
}}

/* ---- Lume oscuro (por defecto) ---- */
:root, [data-theme="dark"] {{{dark}
  --fondo-ganancia: 1;
  --drop-shadow-lg: drop-shadow(0 10px 20px oklch(0% 0 0 / 0.55));
  color-scheme: dark;
}}

/* ---- Lume claro ---- */
[data-theme="light"] {{{light}
  --fondo-ganancia: 1.7;
  --drop-shadow-lg: drop-shadow(0 1px 2px oklch(19.3% 0.008 118.6 / 0.06)) drop-shadow(0 10px 20px oklch(19.3% 0.008 118.6 / 0.1));
  color-scheme: light;
}}

/* ---- Seguir al sistema ---- */
@media (prefers-color-scheme: light) {{
  :root:not([data-theme="dark"]):not([data-theme="light"]), [data-theme="system"] {{{light}
    --fondo-ganancia: 1.7;
    --drop-shadow-lg: drop-shadow(0 1px 2px oklch(19.3% 0.008 118.6 / 0.06)) drop-shadow(0 10px 20px oklch(19.3% 0.008 118.6 / 0.1));
    color-scheme: light;
  }}
}}

/* ---- Accesibilidad: reducir transparencia (prefers-reduced-transparency
   y el ajuste "Reducir transparencia" de Configuración) ---- */
[data-transparencia="reducida"] {{
  --surface-card: var(--surface-card-opaco);
  --surface-card-elevated: var(--surface-card-elevated-opaco);
  --surface-raised: var(--surface-raised-opaco);
  --glass-filter: none;
  --sheet-filter: none;
  --fondo-ganancia: 0.45;
}}
@media (prefers-reduced-transparency: reduce) {{
  :root {{
    --surface-card: var(--surface-card-opaco);
    --surface-card-elevated: var(--surface-card-elevated-opaco);
    --surface-raised: var(--surface-raised-opaco);
    --glass-filter: none;
    --sheet-filter: none;
    --fondo-ganancia: 0.45;
  }}
}}
'''
open(OUT, 'w').write(out)
bad = re.findall(r'#[0-9a-fA-F]{3,6}\b|rgba?\(|hsla?\(', out)
print('restos no-oklch:', bad)
