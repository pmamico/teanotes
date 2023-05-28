import re
from markdown.preprocessors import Preprocessor

class RatingPreprocessor(Preprocessor):
    def run(self, lines):
        print("RatingPreprocessor...")
        # A regular expression segítségével keresd meg az összes "Rating: x/y" sort
        pattern = r"Rating: (\d+)/(\d+)"
        for i, line in enumerate(lines):
            match = re.search(pattern, line)
            if match:
                # Kinyerjük a számokat a sorból
                rating, max_rating = match.groups()
                # Az ikonokat előállítjuk a megfelelő számok alapján
                full_stars = ":material-star: " * int(rating)
                empty_stars = ":material-star-outline: " * (int(max_rating) - int(rating))
                # Az eredeti sort kicseréljük az újra az ikonokkal
                new_line = f"{full_stars}{empty_stars}"
                lines[i] = re.sub(pattern, new_line, line)
        return lines