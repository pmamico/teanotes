import unittest
from markdown import Markdown
from gallery_extension import GalleryExtension


class TestGalleryPreprocessor(unittest.TestCase):
    def setUp(self):
        self.md = Markdown(extensions=[GalleryExtension()])

    def test_gallery(self):
        input_text = "Gallery: /img/gallery"
        expected_output = ""
        output = self.md.convert(input_text)
        print(output)
        self.assertEqual(output, expected_output)


if __name__ == '__main__':
    unittest.main()
