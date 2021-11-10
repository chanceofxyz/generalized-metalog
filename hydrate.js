// Version: 0.1
// Author: KMac
// Date: Nov 9, 2021
// TODO replace HDRando and use npm i hdr2, make sure seeds are used properly


function metalog(y, a, bl = "", bu = "") {
    // y = array of unis, a = aacoeffs
    //km console.log("how many of aCoeffs ", a.length);
    function convert_to_float(a) {
        // Using parseFloat() method
        var floatValue = parseFloat(a);
        // Return float value
        return floatValue;
    }
  let vector = [];
     let np_a = a; 
    for (let index = 1; index < (a.length + 1); ++index) { //cant start with 0 coeeffs for each aCoeff
        vector.push(basis(y, index));
    }
    let wrappedVector = [vector];
    let wrappedNp_x = [np_a];
    let wrappedNp_a = wrappedNp_x[0].map(e => [e])
    let mky = multiply(wrappedVector, wrappedNp_a);
    // console.log("mm array of unis with acoeffs HERE ", mky); // Important check point

    // Unbounded
    if (typeof (bl) == String && typeof (bu) == String) {
        return mky; // working
    }
    if (
        (typeof bl === "string" || bl instanceof String) &&
        (typeof bu === "string" || bu instanceof String)
    ) {
        return mky; // TODO not tested!! may not be needed for hackathon
    }
    // Bounded lower
    else if (typeof bl !== "string" && typeof bu == "string") {
        convert_to_float(bl);
        return bl + Math.exp(mky); // TODO not tested!! may not be needed for hackathon
    }
    // Bounded upper
    else if (typeof bl == "string" && typeof bu != "string") {
        convert_to_float(bu);
        return bu - Math.exp(-mky); // TODO not tested!! may not be needed for hackathon
    }
    // Bounded
    else if (typeof bl != "string" && typeof bu != "string") {
        return bl + (bu * Math.exp(mky)) / (1 + Math.exp(mky)); // TODO not tested!! may not be needed for hackathon
    }
}

function basis(y, t) { // y must be uniform 0-1
    // console.log("aCoeff position in basis ", t, y);
    //console.log("y in basis ", y);
    let ret = 0;
    if (t === 1) {
        ret = 1;
    } else if (t === 2) {
        ret = Math.log(y / (1 - y));
        if (isNaN(ret)) {
        }
    } else if (t === 3) {
        ret = (y - 0.5) * Math.log(y / (1 - y));
        if (isNaN(ret)) {
            console.log("ret when t3 ", y, ret);
        }
    } else if (t === 4) {
        ret = y - 0.5;
        if (isNaN(ret)) {
        }
    } else if (t >= 5 && t % 2 === 1) {
        ret = Math.pow(y - 0.5, Math.floor((t - 1) / 2));
        if (isNaN(ret)) {
        }
    } // requires js int division
    else if (t >= 6 && t % 2 === 0) {
        ret = Math.pow(y - 0.5, Math.floor((t - 1) / 2)) * Math.log(y / (1 - y));
        if (isNaN(ret)) {
        }
    } // requires js int division need to check if this is correct
    return ret;
}
// TODO IMPORTANT - update this to use hdr2 see nmp i hdr2
// hubbardresearch.com for more info. This is a function that generates the random numbers with seeds.
// TODO update this to use all the seeds from the U01/RNG ie use HRDv2. Move into own package?
function HDRando(seed, PM_Index) {
    const largePrime = 2147483647;
    const million = 1000000;
    const tenMillion = 10000000;
    // We need this in js unles we find a modulo function
    function MOD(n, m) {
        var remain = n % m;
        return Math.floor(remain >= 0 ? remain : remain + m);
    }
    let randi =
        (MOD(
                (MOD(
                        (seed + million) ^ (2 + (seed + million) * (PM_Index + tenMillion)),
                        99999989
                    ) +
                    1000007) *
                (MOD(
                        (PM_Index + tenMillion) ^
                        (2 +
                            (PM_Index + tenMillion) *
                            MOD(
                                (seed + million) ^
                                (2 + (seed + million) * (PM_Index + tenMillion)),
                                99999989
                            )),
                        99999989
                    ) +
                    1000013),
                largePrime
            ) +
            0.5) /
        largePrime;
    return randi;
}
// HELPER FUNCTIONS: Removed need for jstat


function multiply(a, b) {
    //console.log("a ", a, "b", b);
    var aNumRows = a.length,
        aNumCols = a[0].length || 0, // if a is a vector
        bNumRows = b.length,
        bNumCols = b[0].length || 0,
        m = new Array(aNumRows); // initialize array of rows
    //console.log("aNumRows ", aNumRows, "aNumCols ", aNumCols,"bNumCols",bNumCols,"bNumCols",bNumCols);
    for (var r = 0; r < aNumRows; ++r) {
        m[r] = new Array(bNumCols); // initialize the current row
        for (var c = 0; c < bNumCols; ++c) {
            //console.log("r ", r, "c ", c);
            m[r][c] = 0; // initialize the current cell
            for (var i = 0; i < aNumCols; ++i) {
                m[r][c] += a[r][i] * b[i][c];
                // console.log("a[r][i] ", a[r][i]);
            }
        }
    }
    return m;
}


