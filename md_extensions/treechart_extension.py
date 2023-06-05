import html

import markdown
import re
from markdown.preprocessors import Preprocessor
from markdown import Extension


class TreeChartExtension(Extension):
    def extendMarkdown(self, md):
        md.registerExtension(self)
        md.preprocessors.register(TreeChartProcessor(md), 'rating', 25)


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


head = """
<style>
    .node circle {
        fill: #fff;
        stroke: steelblue;
        stroke-width: 3px;
    }

    .node text {
        font: 12px sans-serif;
    }

    .link {
        fill: none;
        stroke: #ccc;
        stroke-width: 2px;
    }
</style>
<div id="map"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.5/lodash.js"></script>
"""

body = """
<script>
	var fields =  {{{FIELDS}}};

	var key = "a.b.c";

	const buildTree = (fields) => {
		let tree = {
			"name": "Tea",
			"children": []
		};

		const addNodes = (tag) => {
			for (let i = 0; i < root.children.length; i++) {
				if (tag === root.children[i].name) {
					root = root.children[i];
					return;
				}
			}
			root.children.push({
				'name': tag,
				children: []
			});
			root = root.children[root.children.length-1]
		};

		fields.forEach((field) => {
			tags = field.split('.');
			root = tree;
			tags.forEach(addNodes)
		})
		return tree;
	}

	var treeData = buildTree(fields)

	// Set the dimensions and margins of the diagram
	var margin = {top: 20, right: 0, bottom: 30, left: 70},
		width = window.innerWidth - margin.left - margin.right,
		height = 700 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	// appends a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg = d3.select("div.md-content").append("svg")
		.attr("id", "svg")
		//.attr("width", width + margin.right + margin.left)
		//.attr("height", height + margin.top + margin.bottom)
		// .attr("preserveAspectRatio", "xMinYMin meet")
		   .attr("viewBox", `0 0 ${width} ${height}`)
		.append("g")
		.attr("transform", "translate("
			+ margin.left + "," + margin.top + ")");



	// declares a tree layout and assigns the size
	var treemap = d3.tree().size([height, width]);
	var i = 0,
		duration = 750,
		root;
	// Assigns parent, children, height, depth
	root = d3.hierarchy(treeData, function(d) { return d.children; });
	root.x0 = height / 2;
	root.y0 = 0;

	// Collapse after the second level
	// root.children.forEach(collapse);

	// collapse all
	collapse(root)
	expandOnKey(key, root);
	update(root);

	//Expand the tree based on key
	function expandOnKey(key, root) {
		var node = root;
		var tags = key.split(".");
		while (tags.length > 0) {
			var found = false;
			var next = tags[0]
			if (node._children) {
				node._children.forEach((child) => {
					if (child.data.name === next) {
						// expand this node
						node.children = node._children;
						node._children = null;
						node = child;
						found = true;
					}
				})
			}
			if (found) {
				tags.shift()
			} else {
				return;
			}
		}
	}


	// Collapse the node and all it's children
	function collapse(d) {
		if(d.children) {
			d._children = d.children
			d._children.forEach(collapse)
			d.children = null
		}
	}
	function getHeight(root) {
		if (!root) {
			return 0
		}
		let expandChildren = [0]
		if (root.children) { // if has expanded children
			expandChildren = root.children.map(ea => getHeight(ea))
		}
		const max = expandChildren.reduce((a, b) => Math.max(a,b))
		return 1 + max
	}

	function update(source) {
		var currentHeight = getHeight(root);
		var newWidth = window.innerWidth;
		document.getElementById("svg").style.width = newWidth - 500;
		// Assigns the x and y position for the nodes
		var treeData = treemap(root);

		// Compute the new tree layout.
		var nodes = treeData.descendants(),
			links = treeData.descendants().slice(1);

		// Normalize for current-depth.
		nodes.forEach(function(d){ d.y = d.depth * window.innerWidth / (currentHeight+ Math.log(currentHeight-1))});
		// ****************** Nodes section ***************************
		// create tip for nodes
		// var tip = d3.tip()
		//   .attr('class', 'd3-tip')
		//   .offset([-10, 0])
		//   .html(function(d) {
		//     return getPath(d)
		//   })

		// Update the nodes...
		var node = svg.selectAll('g.node')
			.data(nodes, function(d) {return d.id || (d.id = ++i);    });



		// Enter any new modes at the parent's previous position.
		var nodeEnter = node.enter().append('g')
			.attr('class', 'node')
			.attr("transform", function(d) {
				return "translate(" + source.y0 + "," + source.x0 + ")";
			})
			.on('click', click);
		// nodeEnter.call(tip);
		// Add Circle for the nodes
		nodeEnter.append('circle')
			.attr('class', 'node')
			.attr('r', 1e-6)
			.style("fill", function(d) {
				return d._children ? "lightsteelblue" : "#fff";
			})
		// .on('mouseover', tip.show) // add tip
		// .on('mouseout', tip.hide);

		// Add labels for the nodes
		nodeEnter.append('text')
			.attr("dy", ".35em")
			.attr("x", function(d) {
				return d.children || d._children ? -13 : 13;
			})
			.attr("text-anchor", function(d) {
				return d.children || d._children ? "end" : "start";
			})
			.text(function(d) { return d.data.name; });

		// UPDATE
		var nodeUpdate = nodeEnter.merge(node);
		// Transition to the proper position for the node
		nodeUpdate.transition()
			.duration(duration)
			.attr("transform", function(d) {
				return "translate(" + d.y + "," + d.x + ")";
			});

		// Update the node attributes and style
		nodeUpdate.select('circle.node')
			.attr('r', 10)
			.style("fill", function(d) {
				if (getPath(d) === key) {
					// clicked leaf node
					return '#F88C36';
				}
				return d._children ? "lightsteelblue" : "#fff";
			})
			.attr('cursor', 'pointer');


		// Remove any exiting nodes
		var nodeExit = node.exit().transition()
			.duration(duration)
			.attr("transform", function(d) {
				return "translate(" + source.y + "," + source.x + ")";
			})
			.remove();

		// On exit reduce the node circles size to 0
		nodeExit.select('circle')
			.attr('r', 1e-6);

		// On exit reduce the opacity of text labels
		nodeExit.select('text')
			.style('fill-opacity', 1e-6);

		// ****************** links section ***************************

		// Update the links...
		var link = svg.selectAll('path.link')
			.data(links, function(d) { return d.id; });

		// Enter any new links at the parent's previous position.
		var linkEnter = link.enter().insert('path', "g")
			.attr("class", "link")
			.attr('d', function(d){
				var o = {x: source.x0, y: source.y0}
				return diagonal(o, o)
			});

		// UPDATE
		var linkUpdate = linkEnter.merge(link);

		// Transition back to the parent element position
		linkUpdate.transition()
			.duration(duration)
			.attr('d', function(d){ return diagonal(d, d.parent) });

		// Remove any exiting links
		var linkExit = link.exit().transition()
			.duration(duration)
			.attr('d', function(d) {
				var o = {x: source.x, y: source.y}
				return diagonal(o, o)
			})
			.remove();

		// Store the old positions for transition.
		nodes.forEach(function(d){
			d.x0 = d.x;
			d.y0 = d.y;
		});

		// Creates a curved (diagonal) path from parent to the child nodes
		function diagonal(s, d) {

			var path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

			return path;
		}

		// Toggle children on click.
		function click(d) {
			console.log(d)
			//d.children is expanded children
			//d._children is collapes children
			if (d.children) {
				d._children = d.children;
				d.children = null;
			} else {
				d.children = d._children;
				d._children = null;
			}
			update(d);
		}
		// return the path from root to this node
		function getPath(d) {
			var path = [];
			while (d.parent !== null) {
				path.unshift(d.data.name)
				d=d.parent
			}
			return path.join('.')
		}
	}

	window.addEventListener('resize', _.debounce(function(){
		update(root)
	}, 500));
</script>
"""
