(function(){
    const DUR = 2000;

    var LFLE = d3.select('#p01-lf-left-eye');
    var LFRE = d3.select('#p01-lf-right-eye');
    var RFLE = d3.select('#p01-rf-left-eye');
    var RFRE = d3.select('#p01-rf-right-eye');
    
    // var LFLEbb = LFLE.node().getBBox();
    // var LFLEc = {x: LFLEbb.x + (LFLEbb.width/2), y: LFLEbb.y + (LFLEbb.height/2)};

    // var rFrom = 'rotate(' + 0  +',' + LFLEc.x +',' + LFLEc.y +')';
    // var rTo = 'rotate(' + 360  +',' + LFLEc.x +',' + LFLEc.y +')';

    LFLE.call(cycleRotate, 'cw');
    LFRE.call(cycleRotate, 'ccw');

    function cycleRotate(d, direction){
    var bb = d.node().getBBox();
    var cen = {x: bb.x + (bb.width/2), y: bb.y + (bb.height/2)};
    var rFrom = 'rotate(' + 0  +',' + cen.x +',' + cen.y +')';
    var rTo = 'rotate(' + ((direction=='cw')? 360 : -360)  +',' + cen.x +',' + cen.y +')';
        //rotate(angle, xCentroid, yCentroid)
        d
        .transition()
        .duration(DUR)
        .ease(d3.easeLinear)
        .attrTween('transform', function(){
                    return d3.interpolateString( rFrom, rTo );
        })
        .on('end', function(){ cycleRotate(d, direction) } );
    }

    RFLE.call(cycleRotate2);
    RFRE.call(cycleRotate2);

    function cycleRotate2(d, direction){
    var bb = d.node().getBBox();
    var cen = {x: bb.x + (bb.width/2), y: bb.y + (bb.height/2)};

    var r1 = 'rotate(-5,'+cen.x+','+cen.y+')';
    var r2 = 'rotate(5,'+cen.x+','+cen.y+')';
    var c = 0;
    
        c++;
        d.transition()
            .duration(DUR)
            .ease(d3.easeQuad)
            .attrTween("transform", function(){
                return d3.interpolateString( (c%2==0)?r1:r2, (c%2==0)?r2:r1 );
            } )
            .on('end', function(){ cycleRotate2(d) });

    
    }

})();