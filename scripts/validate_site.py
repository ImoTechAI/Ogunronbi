from pathlib import Path
from html.parser import HTMLParser
import re

root = Path(__file__).resolve().parents[1]
html = (root / "index.html").read_text(encoding="utf-8")
css = (root / "styles.css").read_text(encoding="utf-8")

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
        self.ids = set()
        self.title = False
        self.images = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        if tag == "title":
            self.title = True
        if tag == "img":
            self.images.append(a)
        for key in ("href", "src"):
            if key in a:
                self.refs.append(a[key])

page = PageParser()
page.feed(html)
assert page.title, "Missing document title"
assert all(name in page.ids for name in ("home", "about", "values", "contact")), "Missing page section"
assert len(page.images) >= 2, "Expected logo in header and hero"
assert "mailto:" not in html, "Unconfirmed email address present"
assert "hello@ogunronbi.com" not in html, "Placeholder email present"
assert "logo.png" in [img.get("src") for img in page.images], "Uploaded logo not used"
assert 'href="logo.png"' in html, "Favicon does not use uploaded logo"
assert "viewport" in html and "@media" in css, "Responsive rules missing"
for ref in page.refs:
    if ref.startswith("#"):
        assert ref[1:] in page.ids, f"Broken anchor: {ref}"
    elif not ref.startswith(("http:", "https:", "mailto:", "tel:", "data:")):
        assert (root / ref.split("?")[0]).is_file(), f"Missing local asset: {ref}"
print("PASS: HTML, assets, anchors, logo, favicon, contact and responsive CSS")
