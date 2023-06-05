import html
import os

import markdown
import re
from markdown.preprocessors import Preprocessor
from markdown import Extension


class TreeChartExtension(Extension):
    def extendMarkdown(self, md):
        md.registerExtension(self)
        md.preprocessors.register(TreeChartProcessor(md), 'tree', 25)


class TreeChartProcessor(Preprocessor):
    PATTERN = pattern = re.compile(r'^\{\{\{TreeChart$')

    def run(self, lines):
        new_lines = []
        elements = []
        block = False
        for line in lines:
            match = self.PATTERN.match(line)
            if block and "}}}" == line:
                break
            elif block:
                elements.append(line)
            elif match:
                block = True
        if not block:
            return lines
        new_lines.append(head)
        new_lines.append(body.replace("{{{FIELDS}}}", str(elements)));
        return new_lines


with open('md_extensions/treechart_head.html', 'r') as file:
    head = file.read()

with open('md_extensions/treechart_body.html', 'r') as file:
    body = file.read()
