function genMetalog(data, iids,p50,p90) {
    var defaults = data
    // qShape = 90p/50p
    //let mu = 1;
    //let sigma = 0.5;
    // lognormals need the 90p and 50p OR or derive from mu sigma
    // let p90 = EXP(sigma*NORMSINV(0.9)+mu)
    // let p50 EXP(Input_mu)
    let qShape = p90 / p50;
    let seedPerDist = 1
    let numberOfTrials = 1000;
    // Find nearest lower and higher qShape value in array 
    result = data.reduce(function (r, a, i, aa) {
        return i && Math.abs(aa[r].qShape - qShape) < Math.abs(a.qShape - qShape) ? r : i;
    }, -1);
    let lowShape, highShape;
    let lowShapeIndex, highShapeIndex;
    let beta ,alpha;
    if (qShape == data[result].qShape) { // TODO keep position in array for lower and higher result
        // console.log("qShape is equal ", qShape, data[result].qShape);
        lowShape = data[result].qShape;
        highShape = data[result].qShape;
        lowShapeIndex = result;
        highShapeIndex = result;
    } else if (qShape > data[result].qShape) {
        lowShape = data[result].qShape;
        highShape = data[result + 1].qShape;
        lowShapeIndex = result;
        highShapeIndex = result + 1;
        // console.log("qShape is greater than ", qShape, data[result].qShape, lowShape, highShape);
    } else if (qShape < data[result].qShape) {
        lowShape = data[result - 1].qShape;
        highShape = data[result].qShape;
        lowShapeIndex = result - 1;
        highShapeIndex = result;
        // console.log("qShape is less than ", qShape, data[result].qShape, lowShape, highShape);
    }
    // Find nearest lower and higher numberOfIds in array
    function x(numIidsCols, qty) { // find lower key
        var prev = -1;
        var i;
        for (i in numIidsCols) {
            var n = parseInt(i);
            if ((prev != -1) && (qty < n)) {
                if (prev == qty) {
                    n = prev
                }
                const introp = [prev, n];
                return introp;
            } else
                prev = n;
        }
    }
    // console.log(x(data[0].data[0], iids), iids);
    const iidRange = x(data[0].data[0], iids)
    let lowNumberOfIds = iidRange[0]
    let highNumberOfIds = iidRange[1]
    // Get all 9 aCoeffs for each numberOfIds (lower and higher)
    let aCoeffLower = [
        [],
        []
    ];
    let aCoeffHighShape = [
        [],
        []
    ];
    for (let i = 0; i < data[result].data.length; i++) { 
        // foreach acoeff in table there are 9 total
        // find the key that matches the lowernumberOfIds and get value field
        aCoeffLower[0][i] = data[lowShapeIndex].data[i][lowNumberOfIds];
        aCoeffLower[1][i] = data[lowShapeIndex].data[i][highNumberOfIds];
        aCoeffHighShape[0][i] = data[highShapeIndex].data[i][lowNumberOfIds];
        aCoeffHighShape[1][i] = data[highShapeIndex].data[i][highNumberOfIds];
    }
    // console.log(aCoeffLower, aCoeffHighShape);
    try {
         beta = (iids - lowNumberOfIds) / (highNumberOfIds - lowNumberOfIds)
         if (isNaN(beta)) {
             beta = 1
          }
    } catch (err) {
      //  console.log('beta Not a Number!');
    } 
    try {
        alpha = (qShape - lowShape) / (highShape - lowShape)
   } catch (err) {
        alpha = 1
   }  

  //  console.log(`beta: ${beta}, alpha ${alpha}`)
    // interpolate aCoeffs =beta*L5#+(1-beta)*K5#
    let finalACoeffsTable = [
        [],
        []
    ];

    for (let i = 0; i < aCoeffLower[0].length; i++) { 
      //  console.log(aCoeffLower[1][i], aCoeffLower[0][i])
        finalACoeffsTable[0][i] = beta * aCoeffLower[1][i] + (1 - beta) * aCoeffLower[0][i];
    }
  //  console.log(finalACoeffsTable);

    for (let i = 0; i < aCoeffHighShape[0].length; i++) { 
      //  console.log(aCoeffHighShape[1][i], aCoeffHighShape[0][i])
        finalACoeffsTable[1][i] = beta * aCoeffHighShape[1][i] + (1 - beta) * aCoeffHighShape[0][i];
    };
  //  console.log(finalACoeffsTable);
    // final step =(alpha*$N14+(1-alpha)*$N5)
    let finalACoeffs = [];

    for (let i = 0; i < finalACoeffsTable[0].length; i++) { // TODO lowShapeIndex and highShapeIndex instead!! twice
      //  console.log(aCoeffHighShape[1][i], aCoeffHighShape[0][i])
        finalACoeffs[i] = alpha * finalACoeffsTable[1][i] + (1 - alpha) * finalACoeffsTable[0][i];
    };
    // this will be the acoeffs and shape to call metalog function with
    // console.log(finalACoeffs);
    // console.log(qShape);

    let trialsVector = [];
    var samples = [];

    for (var distTrials = 0; distTrials < numberOfTrials; distTrials++) {
        samples[distTrials] = HDRando(seedPerDist, distTrials);
    }
    for (let i = 0; i < samples.length; i++) {
        trialsVector[i] = iids * p50 * metalog(samples[i], finalACoeffs, 0)
    }
    // console.log("how did it go ", iids * p50 * metalog(samples[0], finalACoeffs, 0)); //lower bound 0 
    return trialsVector
}