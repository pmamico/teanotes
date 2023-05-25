 <div class="container">
    <div class="row">
      <div class="col-sm-8 col-sm-offset-2">
        <h1 class="text-center">
          <small><em>Gallery</em></small>
        </h1>
        <!-- Galley wrapper that contains all items -->
        <div id="gallery" class="gallery" itemscope itemtype="http://schema.org/ImageGallery">
          <!-- Use figure for a more semantic html -->
          <figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
            <!-- Link to the big image, not mandatory, but usefull when there is no JS -->
            <a href="/img/gallery/winter_window.jpeg" data-caption="" data-width="600" data-height="480" itemprop="contentUrl">
              <!-- Thumbnail -->
              <img src="/img/gallery/winter_window.jpeg" itemprop="thumbnail" alt="Image description">
            </a>
          </figure>
          <figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
            <a href="/img/gallery/hanafuda.jpeg" data-caption="" data-width="600" data-height="480" itemprop="contentUrl">
              <img src="/img/gallery/hanafuda.jpeg" itemprop="thumbnail" alt="Image description">
            </a>
          </figure>
          <figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
            <a href="/img/gallery/beengcha_vinyl.jpeg" data-caption="" data-width="600" data-height="480" itemprop="contentUrl">
              <img src="/img/gallery/beengcha_vinyl.jpeg" itemprop="thumbnail" alt="Image description">
            </a>
          </figure>
          <figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
            <a href="/img/gallery/japankert.jpeg" data-caption="" data-width="600" data-height="480" itemprop="contentUrl">
              <img src="/img/gallery/japankert.jpeg" itemprop="thumbnail" alt="Image description">
            </a>
          </figure>
          <figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
            <a href="/img/gallery/kanna.jpeg" data-caption="" data-width="600" data-height="480" itemprop="contentUrl">
              <img src="/img/gallery/kanna.jpeg" itemprop="thumbnail" alt="Image description">
            </a>
          </figure>
          <figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
            <a href="/img/gallery/puerh_zoom.jpeg" data-caption="" data-width="600" data-height="480" itemprop="contentUrl">
              <img src="/img/gallery/puerh_zoom.jpeg" itemprop="thumbnail" alt="Image description">
            </a>
          </figure>
          <figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
            <a href="/img/gallery/allo_keszlet.jpeg" data-caption="" data-width="480" data-height="600" itemprop="contentUrl">
              <img src="/img/gallery/allo_keszlet.jpeg" itemprop="thumbnail" alt="Image description">
            </a>
          </figure>
          <figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
            <a href="/img/gallery/napfeny.jpeg" data-caption="" data-width="600" data-height="480" itemprop="contentUrl">
              <img src="/img/gallery/napfeny.jpeg" itemprop="thumbnail" alt="Image description">
            </a>
          </figure>
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
