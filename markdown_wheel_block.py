from markdown.extensions import Extension
from markdown.blockprocessors import BlockProcessor
import xml.etree.ElementTree as etree
import re


class WheelBlockProcessor(BlockProcessor):
    START = re.compile(r'^{{{wheel')
    END = re.compile(r'^}}}$', re.MULTILINE)

    def test(self, parent, block):
        return bool(self.START.match(block))

    def run(self, parent, blocks):
        block = blocks.pop(0)
        match = self.START.search(block)

        block = block[match.end():]  # Remove the starting indicator from the block.



        match2 = self.END.search(block)
        # Ha találtunk második egyezést, akkor levágjuk a string végétől a match elejéig tartó részt
        if match2:
            block = block[:match2.start()]


        print(block)

        url_param = '&'.join([f"{key}={value}" for key, value in [line.split(': ') for line in block.split('\n') if line]])

        src = "http://209.38.240.42:8080/?"+url_param

        content_blocks = []

        iframe = etree.SubElement(parent, 'iframe')
        iframe.set('src', src)

        iframe.set('id', 'scaled-frame')


        self.parser.parseBlocks(iframe, content_blocks)
        #
        # if blocks:
        #     # If there are any blocks remaining, reinsert the first one into the
        #     # blocks list so it can be processed by the appropriate processor.
        #     blocks.insert(0, block)


class WheelExtension(Extension):
    def extendMarkdown(self, md):
        md.registerExtension(self)
        md.parser.blockprocessors.register(WheelBlockProcessor(md.parser), 'wheel_block', 175)
