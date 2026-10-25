"""Grabado de billete: convierte una foto en líneas de talla dulce + guilloché.

Uso: python3 grabado.py foto.jpg salida_prefijo [ancho]
Genera <prefijo>-claro.png (tinta sobre marfil) y <prefijo>-oscuro.png
(marfil sobre grafito). Las placas rojas pasan a lume (color selectivo).
"""
import sys
import numpy as np
import cv2

src, pref = sys.argv[1], sys.argv[2]
W = int(sys.argv[3]) if len(sys.argv) > 3 else 1400

img = cv2.imread(src)
h0, w0 = img.shape[:2]
H = int(h0 * W / w0)
img = cv2.resize(img, (W, H), interpolation=cv2.INTER_AREA)

# ---- luminancia con contraste local ----
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
clahe = cv2.createCLAHE(clipLimit=2.2, tileGridSize=(8, 8))
g = clahe.apply(gray).astype(np.float32) / 255.0
g = cv2.GaussianBlur(g, (0, 0), 1.2)
g = np.clip((g - 0.04) / 0.9, 0, 1)
g = 1 / (1 + np.exp(-(g - 0.5) * 7.5))            # contraste en S
g = (g - g.min()) / (g.max() - g.min())

# ---- máscara de color selectivo: rojos/naranjas (las placas) ----
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.float32)
hue, sat, val = hsv[..., 0], hsv[..., 1] / 255, hsv[..., 2] / 255
rojo = (((hue < 9) | (hue > 172)) & (sat > 0.62) & (val > 0.32)).astype(np.uint8)
rojo = cv2.morphologyEx(rojo, cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))
rojo = cv2.morphologyEx(rojo, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
n, lab, stats, cent = cv2.connectedComponentsWithStats(rojo)
keep = np.zeros_like(rojo)
for i in range(1, n):
    if stats[i, cv2.CC_STAT_AREA] > 0.004 * W * H and cent[i][1] > 0.5 * H:
        keep[lab == i] = 1
rojo = keep.astype(np.float32)
rojo = cv2.GaussianBlur(rojo, (0, 0), 3)

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
blur_big = cv2.GaussianBlur(g, (0, 0), 14)


def lineas(valor, angulo, paso, desplaz, ondas=0.0, ancho_max=0.62, fase0=0.0):
    """Familia de líneas paralelas, curvadas por la forma (desplazamiento por
    luminancia) y con grosor proporcional a `valor` (0..1)."""
    a = np.deg2rad(angulo)
    u = xx * np.cos(a) + yy * np.sin(a)
    v = -xx * np.sin(a) + yy * np.cos(a)
    fase = (v + desplaz * blur_big * paso + ondas * np.sin(u / 55.0) * paso) / paso + fase0
    d = np.abs(fase - np.round(fase)) * paso            # distancia al centro de la línea, en px
    media = np.clip(valor, 0, 1) * ancho_max * paso / 2  # medio ancho de la línea
    return np.clip(media - d + 0.6, 0, 1) * np.clip(media * 1.6, 0, 1)  # antialias; sin línea si no hay tinta


def guilloche(paso=6.0):
    """Malla de ondas entrelazadas, como el fondo de un billete."""
    out = np.zeros_like(g)
    for k, (amp, lam, ang) in enumerate([(9, 61, 0), (9, 61, 180), (7, 43, 90)]):
        a = np.deg2rad(ang)
        u = xx * np.cos(a) + yy * np.sin(a)
        v = -xx * np.sin(a) + yy * np.cos(a)
        fase = (v + amp * np.sin(u / lam * 2 * np.pi / 6 + k)) / paso
        d = np.abs(fase - np.round(fase)) * paso
        out = np.maximum(out, np.clip(0.42 - d + 0.5, 0, 1))
    return out


def grabar(valor, malla=0.6):
    """valor: cuánta tinta pide cada píxel (0..1)."""
    l1 = lineas(valor * 1.1, 18, 7.0, 4.5, ondas=0.45, ancho_max=0.78)
    l2 = lineas((valor - 0.58) / 0.42, -50, 7.5, 3.0, ondas=0.3, ancho_max=0.6)
    l3 = lineas((valor - 0.84) / 0.16, 80, 8.0, 2.0, ancho_max=0.5)
    tinta = np.maximum.reduce([l1, l2, l3])
    # guilloché en las zonas casi sin tinta (el "cielo")
    gl = guilloche(7.0) * np.clip((0.2 - valor) / 0.2, 0, 1) * malla
    tinta = np.maximum(tinta, gl)
    # bordes finos para sostener el dibujo
    bordes = cv2.Canny((g * 255).astype(np.uint8), 40, 110).astype(np.float32) / 255
    bordes = cv2.GaussianBlur(bordes, (0, 0), 0.7) * 0.35
    return np.clip(np.maximum(tinta, bordes), 0, 1)


def pintar(tinta, papel, color_tinta, color_sel):
    col = (1 - rojo[..., None]) * np.array(color_tinta, np.float32) + rojo[..., None] * np.array(color_sel, np.float32)
    out = (1 - tinta[..., None]) * np.array(papel, np.float32) + tinta[..., None] * col
    return np.clip(out, 0, 255).astype(np.uint8)


# Claro: la tinta es la sombra. Papel marfil (ivory-100), tinta ivory-900, placas en oliva (lume-800).
t_claro = grabar((1 - g) ** 1.3 * 0.95)
claro = pintar(t_claro, (230, 240, 238), (17, 21, 20), (10, 106, 79))   # BGR
# Oscuro: la tinta es la luz. Papel grafito (graphite-900), trazo graphite-100, placas en lume-500.
t_osc = grabar(g ** 1.15 * 0.88, malla=0.22)
oscuro = pintar(t_osc, (10, 9, 8), (235, 240, 241), (95, 226, 201))    # BGR

cv2.imwrite(f'{pref}-claro.png', claro)
cv2.imwrite(f'{pref}-oscuro.png', oscuro)
print('ok', W, H)
