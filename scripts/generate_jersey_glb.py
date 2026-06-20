"""
Generate a Vancouver 2026 jersey GLB from the design sheet PNG.
The design image has the front jersey on the left half and the back on the right half.
We crop each panel, clean them up as textures, build a jersey mesh with proper UVs,
and export as a GLB loadable by Three.js GLTFLoader.
"""

import struct, json, base64, math
from pathlib import Path
from PIL import Image
import numpy as np

SRC = Path("/mnt/c/Users/Owner/Downloads/cherryblossom_design.png")
OUT_DIR = Path("/home/osha/interactive-3d-devin-worldcup-model/public")
OUT_GLB  = OUT_DIR / "jersey.glb"
OUT_FRONT = OUT_DIR / "jersey_front.png"
OUT_BACK  = OUT_DIR / "jersey_back.png"

# ── 1. Crop jersey panels from the design sheet ────────────────────────────────
img = Image.open(SRC).convert("RGBA")
W, H = img.size
print(f"Design sheet: {W}x{H}")

# The two jerseys sit roughly in the left-centre of the sheet.
# From inspection: front jersey occupies ~x 175-530, back ~x 545-900 (out of 1366px wide).
# We'll crop generously and let the texture map cover the mesh naturally.
front_crop = img.crop((263, 28, 545, 488))
back_crop  = img.crop((578, 10, 862, 490))

# Resize to power-of-2 for GPU compatibility
TEX_W, TEX_H = 1024, 1024
front_img = front_crop.resize((TEX_W, TEX_H), Image.LANCZOS)
back_img  = back_crop.resize((TEX_W, TEX_H), Image.LANCZOS)

front_img.save(OUT_FRONT)
back_img.save(OUT_BACK)
print(f"Saved textures: {OUT_FRONT}, {OUT_BACK}")

# ── 2. Build jersey geometry ───────────────────────────────────────────────────
# We build a parametric jersey body (front face + back face as separate meshes)
# plus two sleeves, all combined into a single GLB with two primitives sharing
# the same node so Three.js can load them as one object.

def jersey_half_width(t):
    """Half-width of jersey body at normalised vertical position t (0=top, 1=bottom)."""
    if t < 0.10: return 0.30 + t * 2.0   # shoulder taper in
    if t < 0.28: return 0.50 - (t - 0.10) * 0.20
    if t < 0.70: return 0.47 - (t - 0.28) * 0.03
    return 0.45 + (t - 0.70) * 0.12       # slight flare at hem

def jersey_depth(t):
    """Z-depth (front-to-back thickness) at position t."""
    return 0.055 * math.sin(t * math.pi)

SEGS_W = 36
SEGS_H = 54

def build_face(front=True):
    """Build one face (front or back) of the jersey body as a flat-ish curved panel."""
    verts = []
    uvs   = []
    tris  = []
    z_sign = 1.0 if front else -1.0

    for row in range(SEGS_H + 1):
        t = row / SEGS_H
        y = 1.35 - t * 2.7
        hw = jersey_half_width(t)
        dz = jersey_depth(t) * z_sign

        for col in range(SEGS_W + 1):
            s = col / SEGS_W
            x = (s - 0.5) * hw * 2
            # slight edge curve for 3D feel
            edge = -0.06 * (2 * s - 1) ** 2
            verts.append([x, y, dz + edge * z_sign + 0.07 * z_sign])
            uvs.append([s, 1.0 - t])

    for row in range(SEGS_H):
        for col in range(SEGS_W):
            a = row * (SEGS_W + 1) + col
            b = a + 1
            c = a + (SEGS_W + 1)
            d = c + 1
            if front:
                tris += [a, c, b, b, c, d]
            else:
                tris += [a, b, c, b, d, c]

    return verts, uvs, tris


def build_sleeve(side=1, front=True):
    """Build a sleeve as a tapered cylinder."""
    SEGS_R = 14
    SEGS_L = 10
    verts, uvs, tris = [], [], []
    z_sign = 1.0 if front else -1.0

    for row in range(SEGS_L + 1):
        t = row / SEGS_L
        cx = side * (0.58 + t * 0.38)
        cy = 1.05 - t * 0.50
        r  = 0.16 - t * 0.06
        for seg in range(SEGS_R + 1):
            angle = (seg / SEGS_R) * math.pi * 2
            verts.append([
                cx + math.cos(angle) * r,
                cy + math.sin(angle) * r * 0.65,
                0.02 + math.sin(angle) * r * 0.35
            ])
            uvs.append([seg / SEGS_R, 1.0 - t])

    for row in range(SEGS_L):
        for seg in range(SEGS_R):
            a = row * (SEGS_R + 1) + seg
            b = a + 1
            c = a + (SEGS_R + 1)
            d = c + 1
            tris += [a, c, b, b, c, d]

    return verts, uvs, tris


# ── 3. Assemble all geometry into flat arrays ──────────────────────────────────
def merge_meshes(meshes):
    """Merge list of (verts, uvs, tris) into single flat arrays with index offset."""
    all_pos, all_uv, all_idx = [], [], []
    offset = 0
    for verts, uvs, tris in meshes:
        all_pos.extend(verts)
        all_uv.extend(uvs)
        all_idx.extend(t + offset for t in tris)
        offset += len(verts)
    return all_pos, all_uv, all_idx


front_body_v, front_body_uv, front_body_t = build_face(front=True)
back_body_v,  back_body_uv,  back_body_t  = build_face(front=False)
sleeve_l_v, sleeve_l_uv, sleeve_l_t = build_sleeve(side=-1)
sleeve_r_v, sleeve_r_uv, sleeve_r_t = build_sleeve(side=1)

# Front mesh = front body + sleeves
front_pos, front_uv, front_idx = merge_meshes([
    (front_body_v, front_body_uv, front_body_t),
    (sleeve_l_v,   sleeve_l_uv,   sleeve_l_t),
    (sleeve_r_v,   sleeve_r_uv,   sleeve_r_t),
])

# Back mesh = back body only (no separate sleeves for back — sleeves are double-sided)
back_pos, back_uv, back_idx = merge_meshes([
    (back_body_v, back_body_uv, back_body_t),
])


def compute_bounds(positions):
    xs = [p[0] for p in positions]
    ys = [p[1] for p in positions]
    zs = [p[2] for p in positions]
    return (
        [min(xs), min(ys), min(zs)],
        [max(xs), max(ys), max(zs)]
    )


# ── 4. Pack binary data & build GLB ───────────────────────────────────────────
def pack_floats(data_list):
    flat = [x for item in data_list for x in (item if hasattr(item,'__iter__') else [item])]
    return struct.pack(f'{len(flat)}f', *flat)

def pack_uint32(data_list):
    return struct.pack(f'{len(data_list)}I', *data_list)

def img_to_png_bytes(path):
    with open(path, 'rb') as f:
        return f.read()

# Build binary buffer: [front_pos | front_uv | front_idx | back_pos | back_uv | back_idx | front_tex | back_tex]
def align4(n):
    return (n + 3) & ~3

segments = {}

def add_segment(name, data: bytes):
    start = sum(len(v) for v in segments.values()) if segments else 0
    # pad to 4-byte alignment
    padded = data + b'\x00' * (align4(len(data)) - len(data))
    segments[name] = padded
    return start, len(data), len(padded)

fp_bytes  = pack_floats(front_pos)
fuv_bytes = pack_floats(front_uv)
fi_bytes  = pack_uint32(front_idx)
bp_bytes  = pack_floats(back_pos)
buv_bytes = pack_floats(back_uv)
bi_bytes  = pack_uint32(back_idx)
front_png = img_to_png_bytes(OUT_FRONT)
back_png  = img_to_png_bytes(OUT_BACK)

all_data = [fp_bytes, fuv_bytes, fi_bytes, bp_bytes, buv_bytes, bi_bytes, front_png, back_png]
labels   = ['fp','fuv','fi','bp','buv','bi','ftex','btex']

offsets = []
cursor  = 0
padded_chunks = []
for data in all_data:
    padded = data + b'\x00' * (align4(len(data)) - len(data))
    offsets.append(cursor)
    padded_chunks.append(padded)
    cursor += len(padded)

buffer_data = b''.join(padded_chunks)
buffer_len  = len(buffer_data)

# ── 5. Build glTF JSON ─────────────────────────────────────────────────────────
fmin, fmax = compute_bounds(front_pos)
bmin, bmax = compute_bounds(back_pos)

n_fp  = len(front_pos)
n_bp  = len(back_pos)
n_fi  = len(front_idx)
n_bi  = len(back_idx)

raw_lens = [len(d) for d in all_data]

gltf = {
    "asset": {"version": "2.0", "generator": "DevinJerseyGen"},
    "scene": 0,
    "scenes": [{"nodes": [0]}],
    "nodes": [{"mesh": 0, "name": "Jersey"}],
    "meshes": [{
        "name": "Jersey",
        "primitives": [
            {
                "attributes": {"POSITION": 0, "TEXCOORD_0": 1},
                "indices": 2,
                "material": 0,
                "mode": 4
            },
            {
                "attributes": {"POSITION": 3, "TEXCOORD_0": 4},
                "indices": 5,
                "material": 1,
                "mode": 4
            }
        ]
    }],
    "materials": [
        {
            "name": "JerseyFront",
            "pbrMetallicRoughness": {
                "baseColorTexture": {"index": 0},
                "metallicFactor": 0.05,
                "roughnessFactor": 0.75
            },
            "doubleSided": False
        },
        {
            "name": "JerseyBack",
            "pbrMetallicRoughness": {
                "baseColorTexture": {"index": 1},
                "metallicFactor": 0.05,
                "roughnessFactor": 0.75
            },
            "doubleSided": False
        }
    ],
    "textures": [
        {"source": 0, "sampler": 0},
        {"source": 1, "sampler": 0}
    ],
    "images": [
        {"bufferView": 6, "mimeType": "image/png"},
        {"bufferView": 7, "mimeType": "image/png"}
    ],
    "samplers": [{"magFilter": 9729, "minFilter": 9987, "wrapS": 33071, "wrapT": 33071}],
    "bufferViews": [
        # 0: front position floats  (vec3, 12 bytes each)
        {"buffer": 0, "byteOffset": offsets[0], "byteLength": raw_lens[0], "byteStride": 12, "target": 34962},
        # 1: front UV floats        (vec2, 8 bytes each)
        {"buffer": 0, "byteOffset": offsets[1], "byteLength": raw_lens[1], "byteStride": 8,  "target": 34962},
        # 2: front indices          (uint32)
        {"buffer": 0, "byteOffset": offsets[2], "byteLength": raw_lens[2], "target": 34963},
        # 3: back position floats
        {"buffer": 0, "byteOffset": offsets[3], "byteLength": raw_lens[3], "byteStride": 12, "target": 34962},
        # 4: back UV floats
        {"buffer": 0, "byteOffset": offsets[4], "byteLength": raw_lens[4], "byteStride": 8,  "target": 34962},
        # 5: back indices
        {"buffer": 0, "byteOffset": offsets[5], "byteLength": raw_lens[5], "target": 34963},
        # 6: front texture PNG
        {"buffer": 0, "byteOffset": offsets[6], "byteLength": raw_lens[6]},
        # 7: back texture PNG
        {"buffer": 0, "byteOffset": offsets[7], "byteLength": raw_lens[7]},
    ],
    "accessors": [
        # 0: front positions
        {"bufferView": 0, "byteOffset": 0, "componentType": 5126, "count": n_fp, "type": "VEC3", "min": fmin, "max": fmax},
        # 1: front UVs
        {"bufferView": 1, "byteOffset": 0, "componentType": 5126, "count": n_fp, "type": "VEC2"},
        # 2: front indices
        {"bufferView": 2, "byteOffset": 0, "componentType": 5125, "count": n_fi, "type": "SCALAR"},
        # 3: back positions
        {"bufferView": 3, "byteOffset": 0, "componentType": 5126, "count": n_bp, "type": "VEC3", "min": bmin, "max": bmax},
        # 4: back UVs
        {"bufferView": 4, "byteOffset": 0, "componentType": 5126, "count": n_bp, "type": "VEC2"},
        # 5: back indices
        {"bufferView": 5, "byteOffset": 0, "componentType": 5125, "count": n_bi, "type": "SCALAR"},
    ],
    "buffers": [{"byteLength": buffer_len}]
}

# ── 6. Write GLB ───────────────────────────────────────────────────────────────
json_str  = json.dumps(gltf, separators=(',', ':'))
json_bytes = json_str.encode('utf-8')
# JSON chunk must be padded to 4-byte boundary with spaces (0x20)
json_pad  = (align4(len(json_bytes)) - len(json_bytes))
json_chunk = json_bytes + b' ' * json_pad

# GLB header: magic, version, total_length
total_len = 12 + 8 + len(json_chunk) + 8 + len(buffer_data)
header = struct.pack('<III', 0x46546C67, 2, total_len)   # 'glTF', 2, length
json_header = struct.pack('<II', len(json_chunk), 0x4E4F534A)  # length, 'JSON'
bin_header  = struct.pack('<II', len(buffer_data), 0x004E4942)  # length, 'BIN\0'

with open(OUT_GLB, 'wb') as f:
    f.write(header)
    f.write(json_header)
    f.write(json_chunk)
    f.write(bin_header)
    f.write(buffer_data)

print(f"Written GLB: {OUT_GLB} ({OUT_GLB.stat().st_size/1024:.1f} KB)")
print(f"  Front mesh: {n_fp} verts, {n_fi//3} tris")
print(f"  Back mesh:  {n_bp} verts, {n_bi//3} tris")
