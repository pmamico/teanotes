import re

from markdown import Extension
from markdown.preprocessors import Preprocessor


class RatingExtension(Extension):
    def extendMarkdown(self, md):
        md.registerExtension(self)
        md.preprocessors.register(RatingPreprocessor(md), 'rating', 25)


class RatingPreprocessor(Preprocessor):
    PATTERN = re.compile(r'^Rating:\s*(\d+(\.\d)?)/(\d+)$')

    def run(self, lines):
        new_lines = []
        for line in lines:
            match = self.PATTERN.match(line)
            if match:
                rating, _, max_rating = match.groups()
                stars = int(float(rating))
                half_star = float(rating) - stars >= 0.5
                max_stars = int(max_rating)
                star_str = ' :material-star: ' * stars
                half_star_str = ' :material-star-half-full: ' if half_star else ''
                outline_str = ' :material-star-outline: ' * (max_stars - stars - (1 if half_star else 0))
                new_line = f'{star_str}{half_star_str}{outline_str}\n'
                new_lines.append(new_line)
            else:
                new_lines.append(line)
        return new_lines
