import os

from PIL import Image
from markdown import Extension
from markdown.preprocessors import Preprocessor


class GalleryExtension(Extension):
    def extendMarkdown(self, md):
        md.registerExtension(self)
        md.preprocessors.register(GalleryProcessor(md), 'gallery', 25)


def process_image(image_path):
    with Image.open(image_path) as img:
        return {"path": image_path.replace("./docs", ""), "width": str(img.width), "height": str(img.height)}


def process_gallery(gallery_path):
    images = []
    for filename in os.listdir("./docs" + gallery_path):
        if filename.endswith((".jpg", ".jpeg", ".png")):
            image_path = os.path.join("./docs" + gallery_path, filename)
            images.append(process_image(image_path))
    return images


def generate_html(gallery: []):
    body = ""
    first = True
    for image in gallery:
        body_part = figure.replace("{{SRC}}", image["path"]) \
            .replace("{{WIDTH}}", image["width"]) \
            .replace("{{HEIGHT}}", image["height"])
        if first:
            body_part = body_part.replace("display: none", "")
            first = False
        body += body_part
    return base + body + footer


class GalleryProcessor(Preprocessor):

    def run(self, lines):
        new_lines = []
        for line in lines:
            if line.startswith("Gallery:"):
                gallery_path = line.split(":")[1].strip()
                gallery = process_gallery(gallery_path)
                html = generate_html(gallery)
                new_lines.append(html)
                continue
            new_lines.append(line)
        return new_lines


base = """
<div class="container">
    <div class="row">
      <div class="col-sm-8 col-sm-offset-2">
        <h1 class="text-center">
          <small><em>Gallery</em></small>
        </h1>
        <div id="my-gallery" class="pswp-gallery pswp-gallery--single-column">
"""
figure = """
        <a href="{{SRC}}" data-caption="" 
            data-pswp-width="{{WIDTH}}" 
            data-pswp-height="{{HEIGHT}}" 
            target="_blank"
            style="display: none">
          <img src="{{SRC}}" alt="">
        </a>
"""
footer = """
    <script type="module">
        import PhotoSwipeLightbox from '/javascript/photoswipe/dist/photoswipe-lightbox.esm.js';
        const lightbox = new PhotoSwipeLightbox({
          gallery: '#my-gallery',
          children: 'a',
          pswpModule: () => import('/javascript/photoswipe/dist/photoswipe.esm.js')
        });
        lightbox.init();
    </script>
        </div>
      </div>
    </div>
  </div>
"""
