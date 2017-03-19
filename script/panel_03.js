(function () {
    var p = [170, 470];
    var r1 = 'rotate(30,' + p[0] + ',' + p[1] + ')';
    var r2 = 'rotate(45,' + p[0] + ',' + p[1] + ')';
    var r3 = 'rotate(90,' + p[0] + ',' + p[1] + ')';
    var dur = 4000;

    var svg = d3.select('#svg-03');


    var sparkRight = svg.select('#p03-spark-right');
    var sparkLeft = svg.select('#p03-spark-left');

    sparkRight.call(cycle);


    var c = 0;
    var isZero = false;

    function cycle(d) {
        c++;
        sparkRight
            .transition()
            .delay(10)
            .duration(300)
            .attr("opacity", function(){
                isZero = !isZero;
                return isZero ? 1 : 0;
            })
            .on('end', cycle);



        sparkLeft.transition()
            .duration(dur)
            .ease(d3.easeSin)
            .attrTween("transform", function () {
                return d3.interpolateString((c % 2 == 0) ? r1 : r2, (c % 2 == 0) ? r2 : r1);
            })
            .on('end', cycle);

    }


//    function click(){
//
//        var r0 = card.attr('transform');
//
//        card
//            .interrupt()
//            .transition()
//            .duration(2000)
//            .ease(d3.easeBounce)
//            .attrTween("transform", function(){
//                return d3.interpolateString( r0, r3 );
//            } )
//            .on('end', cycle)
//        ;
//    }

})();