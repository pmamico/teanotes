import unittest
from markdown import Markdown
from rating_extension import RatingExtension


class TestRatingPreprocessor(unittest.TestCase):
    def setUp(self):
        self.md = Markdown(extensions=[RatingExtension()])

    def test_rating_zero(self):
        input_text = "Rating: 0/2"
        expected_output = "<p>:material-star-outline:  :material-star-outline: </p>"
        output = self.md.convert(input_text)
        self.assertEqual(output, expected_output)

    def test_rating_half(self):
        input_text = "Rating: 0.5/2"
        expected_output = "<p>:material-star-half-full:  :material-star-outline: </p>"
        output = self.md.convert(input_text)
        self.assertEqual(output, expected_output)

    def test_rating_integer(self):
        input_text = "Rating: 3/5"
        expected_output = "<p>:material-star:  :material-star:  :material-star: " \
                          " :material-star-outline:  :material-star-outline: </p>"
        output = self.md.convert(input_text)
        self.assertEqual(output, expected_output)

    def test_rating_fraction(self):
        input_text = "Rating: 3.5/5"
        expected_output = "<p>:material-star:  :material-star:  :material-star: " \
                          " :material-star-half-full:  :material-star-outline: </p>"
        output = self.md.convert(input_text)
        self.assertEqual(output, expected_output)

    def test_rating_max(self):
        input_text = "Rating: 3/3"
        expected_output = "<p>:material-star:  :material-star:  :material-star: </p>"
        output = self.md.convert(input_text)
        self.assertEqual(output, expected_output)


if __name__ == '__main__':
    unittest.main()
