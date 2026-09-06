"""Generate production favicon pack from the BLM 4-color mark (matches public/favicon.svg)."""
from __future__ import annotations

import struct
from pathlib import Path

from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parents[1] / "public"

BG = (0xF4, 0xF1, 0xEA, 255)
CORAL = (0xE8, 0xB8, 0x9A, 255)
BUTTER = (0xE6, 0xC9, 0x4B, 255)
LAVENDER = (0xC4, 0xBC, 0xE8, 255)
MINT = (0x9F, 0xCF, 0xB8, 255)


def draw_mark(size: int) -> Image.Image:
    """Recreate public/favicon.svg at arbitrary size (viewBox 0 0 40 40)."""
    s = size / 40.0
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    def rrect(xy, fill, radius):
        d.rounded_rectangle(xy, radius=max(1, round(radius * s)), fill=fill)

    rrect([0, 0, size - 1, size - 1], BG, 10)
    tiles = [
        (3, 3, CORAL),
        (22, 3, BUTTER),
        (3, 22, LAVENDER),
        (22, 22, MINT),
    ]
    for x, y, color in tiles:
        x0, y0 = round(x * s), round(y * s)
        x1, y1 = round((x + 15) * s) - 1, round((y + 15) * s) - 1
        rrect([x0, y0, x1, y1], color, 5)
    return img


def png_bytes(img: Image.Image) -> bytes:
    from io import BytesIO

    buf = BytesIO()
    img.save(buf, format="PNG", optimize=True)
    return buf.getvalue()


def write_ico(path: Path, images: list[Image.Image]) -> None:
    """Write a multi-size ICO with PNG-compressed entries (Windows Vista+)."""
    entries: list[tuple[int, int, bytes]] = []
    for img in images:
        raw = png_bytes(img)
        w, h = img.size
        entries.append((w if w < 256 else 0, h if h < 256 else 0, raw))

    # Header: reserved, type=1, count
    header = struct.pack("<HHH", 0, 1, len(entries))
    offset = 6 + 16 * len(entries)
    directory = b""
    payloads = b""
    for w, h, raw in entries:
        directory += struct.pack("<BBBBHHII", w, h, 0, 0, 1, 32, len(raw), offset)
        payloads += raw
        offset += len(raw)
    path.write_bytes(header + directory + payloads)


def inspect_ico(path: Path) -> None:
    data = path.read_bytes()
    reserved, itype, count = struct.unpack_from("<HHH", data, 0)
    print(f"ICO type={itype} count={count} bytes={len(data)}")
    offset = 6
    for i in range(count):
        w, h, _c, _r, planes, bpp, size, off = struct.unpack_from("<BBBBHHII", data, offset)
        print(f"  {i}: {w or 256}x{h or 256} bpp={bpp} size={size}")
        offset += 16


def main() -> None:
    sizes = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "apple-touch-icon.png": 180,
        "icon-192.png": 192,
        "icon-512.png": 512,
    }
    for name, sz in sizes.items():
        draw_mark(sz).save(OUT / name, optimize=True)
        print(f"wrote {name} ({sz})")

    write_ico(OUT / "favicon.ico", [draw_mark(16), draw_mark(32), draw_mark(48)])
    print("wrote favicon.ico")
    inspect_ico(OUT / "favicon.ico")


if __name__ == "__main__":
    main()
