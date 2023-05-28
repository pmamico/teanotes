import os
import re

from PIL import Image
from markdown import Extension
from markdown.preprocessors import Preprocessor


class GalleryExtension(Extension):
    def extendMarkdown(self, md):
        md.registerExtension(self)
        md.preprocessors.register(GalleryProcessor(md), 'gallery', 25)


def process_image(image_path):
    with Image.open(image_path) as img:
        return {"path": image_path.replace("./docs", ""), "width": img.width, "height": img.height}


def process_gallery(gallery_path):
    images = []
    for filename in os.listdir("./docs"+gallery_path):
        print(filename)
        if filename.endswith((".jpg", ".jpeg", ".png")):
            image_path = os.path.join("./docs"+gallery_path, filename)
            images.append(process_image(image_path))
    return images

def generate_html(gallery: []):
    for image in gallery:
        print(image['path'])
    return ""


class GalleryProcessor(Preprocessor):

    def run(self, lines):
        new_lines = []
        for line in lines:
            if line.startswith("Gallery:"):
                gallery_path = line.split(":")[1].strip()
                print("Gallery: "+gallery_path)
                # fajlok listazasa
                gallery = process_gallery(gallery_path)

                generate_html(gallery)
                continue
            new_lines.append(line)
        return new_lines

base="""
<div class="container">
    <div class="row">
      <div class="col-sm-8 col-sm-offset-2">
        <h1 class="text-center">
          <small><em>Gallery</em></small>
        </h1>
        <div id="gallery" class="gallery" itemscope itemtype="http://schema.org/ImageGallery">
"""
figure="""
    <figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
        <a href="{{SRC}}" data-caption="" data-width="{{WIDTH}}" data-height="{{HEIGHT}}" itemprop="contentUrl" style="display: none">
          <img src="{{SRC}}" itemprop="thumbnail" alt="">
        </a>
    </figure>
"""
footer="""
        </div>
      </div>
    </div>
  </div>

  <!-- Some spacing 😉 -->
  <div class="spacer"></div>


  <!-- Root element of PhotoSwipe. Must have class pswp. -->
  <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
      <!-- Background of PhotoSwipe. 
           It's a separate element as animating opacity is faster than rgba(). -->
      <div class="pswp__bg"></div>
      <!-- Slides wrapper with overflow:hidden. -->
      <div class="pswp__scroll-wrap">
          <!-- Container that holds slides. 
              PhotoSwipe keeps only 3 of them in the DOM to save memory.
              Don't modify these 3 pswp__item elements, data is added later on. -->
          <div class="pswp__container">
              <div class="pswp__item"></div>
              <div class="pswp__item"></div>
              <div class="pswp__item"></div>
          </div>
          <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
          <div class="pswp__ui pswp__ui--hidden">
              <div class="pswp__top-bar">
                  <!--  Controls are self-explanatory. Order can be changed. -->
                  <div class="pswp__counter"></div>
                  <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
                  <button class="pswp__button pswp__button--share" title="Share"></button>
                  <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
                  <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
                  <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
                  <!-- element will get class pswp__preloader--active when preloader is running -->
                  <div class="pswp__preloader">
                      <div class="pswp__preloader__icn">
                        <div class="pswp__preloader__cut">
                          <div class="pswp__preloader__donut"></div>
                        </div>
                      </div>
                  </div>
              </div>
              <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                  <div class="pswp__share-tooltip"></div> 
              </div>
              <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
              </button>
              <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
              </button>
              <div class="pswp__caption">
                  <div class="pswp__caption__center"></div>
              </div>
          </div>
      </div>
  </div>

  <!-- Import jQuery and PhotoSwipe Scripts -->
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.0/photoswipe.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.0/photoswipe-ui-default.min.js"></script>

  <script>
    'use strict';

    /* global jQuery, PhotoSwipe, PhotoSwipeUI_Default, console */

    (function($){

      // Init empty gallery array
      var container = [];

      // Loop over gallery items and push it to the array
      $('#gallery').find('figure').each(function(){
        var $link = $(this).find('a'),
            item = {
              src: $link.attr('href'),
              w: $link.data('width'),
              h: $link.data('height'),
              title: $link.data('caption')
            };
        container.push(item);
      });

      // Define click event on gallery item
      $('a').click(function(event){

        // Prevent location change
        event.preventDefault();

        // Define object and gallery options
        var $pswp = $('.pswp')[0],
            options = {
              index: $(this).parent('figure').index(),
              bgOpacity: 0.85,
              showHideOpacity: true
            };

        // Initialize PhotoSwipe
        var gallery = new PhotoSwipe($pswp, PhotoSwipeUI_Default, container, options);
        gallery.init();
      });

    }(jQuery));
  </script>

"""



