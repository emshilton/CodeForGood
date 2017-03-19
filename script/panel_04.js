// References
// https://bl.ocks.org/mbostock/4339083
// http://www.d3noob.org/2014/01/tree-diagrams-in-d3js_11.html
(function () {
    console.log("hello ");

    var margin = {top: 50, right: 10, bottom: 20, left: 10},
        width = 600 - margin.right - margin.left,
        height = 600 - margin.top - margin.bottom;

    var i = 0,
        duration = 750,
        root;

    var tree = d3.layout.tree()
        .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.x, d.y];
        });

    var svg = d3.select('#svg-04')
        .append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json("./data/panel_04.json", function (error, SIFVolunteer) {
        if (error) throw error;

        root = SIFVolunteer;
        root.x0 = height / 2;
        root.y0 = 0;

        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }

        root.children.forEach(collapse);
        init(root);
    });

    d3.select(self.frameElement).style("height", "600px");

    function init(source) {

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function (d) {
            d.y = d.depth * 100;
        });

        // Update the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + source.x0 + "," + source.y0 + ")";
            })
            //            .on("click", click);
            // Expand on click
            .on("click", function (d) {
                console.log("onclick");
                function expand(d) {
                    console.log("in expand");
                    if (d._children) {
                        d.children = d._children;
                        d.children.forEach(expand);
                        d._children = null;
                    }
                }

                root.children.forEach(expand);
                update(root);
//                console.log(root);
//                console.log(root.children[0]);
//                var educatorZero = root.children[0];
//                educatorZero._children.forEach(expand);
//                update(educatorZero);
            });

        nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });


//        nodeEnter
//            .append("svg:image")
//            .attr("xlink:href", "http://www.e-pint.com/epint.jpg")
//            .attr("width", 15)
//            .attr("height", 20)
//            .attr();


        nodeEnter
            .append("svg:image")
            .attr("xlink:href", function (d) {
                var imgLink;
                console.log("name: " + d.name);
                console.log("d.x0: " + d.x0);
                console.log("d.y0: " + d.y0);
                console.log("d.x: " + d.x);
                console.log("d.y: " + d.y);
                console.log("d.depth: " + d.depth);
                console.log("source: " + source.x0 + " " + source.y0);
                switch (d.name) {
                    case "SIFVolunteer":
                        imgLink = "./img/volunteer.png";
                        break;
                    case "Principal":
                        imgLink = "./img/principal.png";
                        break;
                    case "Teacher":
                        imgLink = "./img/teacher.png";
                        break;
                    case "Kid":
                        imgLink = "./img/pupil1.png";
                        break;
                    default:
                        imgLink = "./img/teacher.png";
                }
                return imgLink;

            })
            .attr("width", 60)
            .attr("height", 80)
            .attr("transform", function (d) {
                return "translate(" + -25 + "," + 0 + ")";
            })
            .attr("y", function (d) {
                return -25;
//                return d.children || d._children ? -18 : 18;
            });


        nodeEnter.append("text")
            .attr("y", function (d) {
                return d.children || d._children ? 15 : 18;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function (d) {

                if (d.name == "SIFVolunteer")
                    return "SIF Volunteer";
            })
            .attr("transform", function () {
                return "translate(" + 120 + "," + 0 + ")";
            })
            .style("font-size", "30px")
            .style("font-family", "MD")
            .style("fill-opacity", 1e-6)



        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        nodeUpdate.select("circle")
            .attr("r", 4.5)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        updateLinks(nodes, links, source);

    }

    function updateLinks(nodes, links, source) {

        console.log("in update links");

        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function (d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function (d) {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

    }


    function update(source) {

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        console.log("nodes");
        // Normalize for fixed-depth.
        nodes.forEach(function (d) {

            d.y = d.depth * 100;
        });

        // Update the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function (d) {
                console.log("in update the nodes");
                return d.id || (d.id = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                console.log("in var nodeEnter");
                return "translate(" + source.x0 + "," + source.y0 + ")";
            });
//            .on("click", click);

        nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("fill", function (d) {
                console.log("in var nodeEnter.append circle");
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeEnter
            .append("svg:image")
            .attr("xlink:href", function (d) {
                var imgLink;
                console.log("name: " + d.name);
                console.log("d.x: " + d.x);
                console.log("d.y: " + d.y);
                console.log("d.depth: " + d.depth);
                console.log("source: " + source.x0 + " " + source.y0);
                switch (d.name) {
                    case "SIFVolunteer":
                        imgLink = "./img/volunteer.png";
                        break;
                    case "Principal":
                        imgLink = "./img/principal.png";
                        break;
                    case "Teacher":
                        imgLink = "./img/teacher.png";
                        break;
                    case "Kid":
                        imgLink = "./img/pupil1.png";
                        break;
                    default:
                        imgLink = "./img/teacher.png";
                }
                return imgLink;

            })
            .attr("width", 45)
            .attr("height", 60)
            .attr("transform", function (d) {
                return "translate(" + -25 + "," + 0 + ")";
            })
            .attr("y", function (d) {
                return -20;
//                return d.children || d._children ? -18 : 18;
            });



        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) {
                console.log("in var nodeUpdate");
                return "translate(" + d.x + "," + d.y + ")";
            });

        nodeUpdate.select("circle")
            .attr("r", 4.5)
            .style("fill", function (d) {
                console.log("nodeUpdate.select circle");
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + source.x + "," + source.y + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function (d) {
                console.log("in var link");
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function (d) {
                console.log("in link.enter");
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

// Toggle children on click.
//    function click(d) {
//        console.log("in click");
//        console.log("=== for each ==");
//        console.log(d);
//        console.log("d " + JSON.stringify(d._children));
//            if (d.children) {
//                d._children = d.children;
//                d.children = null;
//            } else {
//                d.children = d._children;
//                d._children.forEach(function (d) {
//                    console.log("after update");
//                    console.log(d);
//                    if (d._children)
//                        click(d);
//                });
//                d._children = null;
//
//            }
//        update(d);
//    }

//    original
//    function click(d) {
//        console.log(d);
//        if (d.children) {
//            d._children = d.children;
//            d.children = null;
//        } else {
//            d.children = d._children;
//            d._children = null;
//        }
//        update(d);
//    }

//    function click(d) {
//        console.log(d);
//        d3
//            .select(this)
//            .each(unfurl);
//    }
//
//    function unfurl(d) {
//        console.log("in unfurl");
//        console.log(d);
//
//        if (d.children) {
//            d._children = d.children;
//            d.children = null;
//        } else {
//            d.children = d._children;
//            d._children = null;
//        }
//        update(d);
//    }

})();