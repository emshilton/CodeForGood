(function(){

    var refX = 0;

    var svg = d3.select('#svg-02');
    var handG = d3.select('#p02-right-hand');
    var bg = d3.select('#p02-background').select('rect');


    handG
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragender)

        );

    function dragender(d) {
        handG.append("text")
            // .attr("y", function (d) {
            //     return d.children || d._children ? 50 : 18;
            // })
            // .attr("dy", ".35em")
            // .attr("text-anchor", "middle")
            .text(function (d) {

                // if (d.name == "SIFVolunteer")
                    return "Working Hand in Hand to Improve Education";
            })
            .attr("transform", function () {
                return "translate(" + -90 + "," + 350 + ")";
            })
            .style("font-size", "30px")
            .style("font-family", "MD")

        //.style("fill-opacity", 1e-6)
    }
    function dragstarted(d) {
        refX = d3.event.x; //mouse x position
    }

    function dragged(d) {
        var xy = d3.event.x - refX;
        if(xy >= 150) xy = 150;
        handG.attr('transform', 'translate(' + xy + ',' + xy + ')');

        var c = Math.floor(map_range(xy, 0,150,0,255));
        // var c = Math.floor(map_range(xy, 0,150,0,255));
        console.log('This is c:' + c);
        bg.attr('fill', 'rgb('+c+','+c+', '+c+')');

    }

    function dragended(d) {

        handG.transition()
            .duration(1500)
            .ease(d3.easeBounceOut)
            .attr('transform', 'translate(0,0)');

        bg.transition()
            .duration(1500)
            .ease(d3.easeLinear)
            .attr('fill', 'rgb('+0+','+0+','+0+')');

    }

    function map_range(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }

})();