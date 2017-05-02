$(document).ready(function(){

	function start_loader() {
		$('#surfTable').css( "visibility", "hidden" );
		$('#loader').css( "display", "block" );
	}

	function end_loader() {
		$('#surfTable').css( "visibility", "visible" );
		$('#loader').css( "display", "none" );
	}

	function request_surf() {
		$.ajax({
			type: "GET",
			url: '/waive/data',
			beforeSend: function() {
				start_loader();
			},
			success: function(data){
				end_loader();
				result = JSON.parse(data)
				// VARIABLES
				var rho = 1025;
				var g = 9.81; // gravity
				var Wd = 19; // water depth
				var D50 = 0.0004; // medium sand
				var Hs = result["Hs"] // 
				var Tz = result["Tz"] //
				var date = result["fdate"] // Date and time of data
				var Hmax = result["Hmax"] //
				var temp = parseFloat(result["SST"]) // Surface Sea Temperature
                var SST = temp.toFixed(2) // Formatted to two decimal places
				var Dir_Tp_TRUE = result["Dir_Tp_TRUE"] // 
				var Tp = result["Tp"] //
				var theta1 = Math.abs(Dir_Tp_TRUE-90) // Angle of incidence, 90 degrees is beach angle
				var Ndh=150 // the depth will be divided by this number to get the dh
				var tol = 0.001;
		        var L1 = dispRel(Wd,Tp,tol);
		        var k1 = 2*Math.PI/L1;
		        var L0 = g*Math.pow(Tp,2)/(2*Math.PI)
		        var fp = 1/Tp;
				var error = 'Corrupt data'

				// CALCULATIONS
				if (theta1>=0 && theta1<=90 && Hs>0 && Wd>0 && Tp>0) {
					// f and theta arrays --------------------------
		            var f = funLinSpaceArray(fp/3,fp*7,24);
		            var df=f[1]-f[0];

		            var theta = funLinSpaceArray(-90,90,19);
		            var dtheta = theta[1]-theta[0];
		            var dthetaRad = dtheta/180*Math.PI;
		            // ------------------- defining the spectrum Jonswap
		            var Sf = funFreqSpectrum(f,Hs,Tp,3.3);
		            Hm0 = 4.004*Math.pow(funSumArray(Sf)*df,0.5);
		            Sf=funMultScalar(Sf,Math.pow(Hs,2)/Math.pow(Hm0,2));

		            // Directional spectrum (start)
		            var R = funDispDirect(theta);
		            var Sft = funZerosArray(Sf.length,theta.length);
		            for (ii=0; ii<Sf.length; ii++) {
		                for (jj=0; jj<theta.length; jj++) {
		                    Sft[ii][jj] = Sf[ii]*R[jj];
		                }
		            }
		            // Directional spectrum (end)

		            // angle of incidence
		            var thetaInc=funSumArrays(theta,theta1);

		            // Starting with a depth no larger than 3 times Hs (start)
		            if (Wd/Hs>3) {
		                var hObj = Hs*3;
		            } else {
		                var hObj = Wd
		            }
		            // Starting with a depth no larger than 3 times Hs (end)

		            // initializing (Dean Profile)
		            var wD = 273*Math.pow(D50,1.1);
		            var AD = 0.51*Math.pow(wD,0.44);
		            var dh = hObj/Ndh;
		            var hD = funLinSpaceArray(hObj,0,Ndh+1);
		            hD[-1]=0;
		            console.log(hD[-1])
		            var xD = funZerosArray(hD.length,1);
		            var dx = funZerosArray(hD.length-1,1);
		            var beta1 = funZerosArray(hD.length-1,1);
		            for (ii=0; ii<hD.length; ii++) {
		                xD[ii]=Math.pow(hD[ii]/AD,3/2);
		                if (ii>0){
		                    dx[ii-1]=-(xD[ii]-xD[ii-1]);
		                    beta1[ii-1]=dh/dx[ii-1];
		                }
		            }

		            // First Hm (Kamphuis 1991)
		            var Hm = 0.095*Math.exp(4*beta1[0])*L1*tanh(k1*hObj);
		            Hm0Obj = Hs

		            // Loop until the Hm0Obj and Hm match 
		            var propOK=0 // Just to check if the propagation starts
		            var cont=0
		            while (Hm0Obj<Hm) {
		                hObj=hD[cont+1];
		                var kptetaObj = funmatrix(Wd,hObj,f,thetaInc);
		                var kp = kptetaObj.slice(0,f.length); 
		                var tetaObj = kptetaObj.slice(f.length,2*f.length);
		                var Hm0ObjComp = funZerosArray(f.length,theta.length);
		                for (ii=0; ii<f.length; ii++) {
		                    for (jj=0; jj<theta.length; jj++) {
		                        Hm0ObjComp[ii][jj] = Sft[ii][jj]*df*dthetaRad*Math.pow(kp[ii][jj],2);
		                    }
		                }
		                Hm0Obj = 4.004*Math.pow(funSumArray2Dim(Hm0ObjComp),0.5);
		                var LObj = dispRel(hObj,Tp,tol);
		                var kObj = 2*Math.PI/LObj;
		                var Hm = 0.095*Math.exp(4*beta1[cont])*LObj*tanh(kObj*hObj);
		                propOK=1;
		                cont=cont+1;
		            }

		            if (propOK>0) {
		                var thetamNumComp = funZerosArray(f.length,theta.length);
		                var thetamDenComp = funZerosArray(f.length,theta.length);
		                for (ii=0; ii<f.length; ii++) {
		                    for (jj=0; jj<theta.length; jj++) {
		                        thetamNumComp[ii][jj] = Math.sin(tetaObj[ii][jj]/180*Math.PI)*Sft[ii][jj]*Math.pow(kp[ii][jj],2);
		                        thetamDenComp[ii][jj] = Math.cos(tetaObj[ii][jj]/180*Math.PI)*Sft[ii][jj]*Math.pow(kp[ii][jj],2);
		                    }
		                }
		                var thetamNum = funSumArray2Dim(thetamNumComp);
		                var thetamDen = funSumArray2Dim(thetamDenComp);
		                var thetam = Math.atan(thetamNum/thetamDen)/Math.PI*180;

		                var Ir = beta1[cont]/Math.pow(Hm0Obj/L0,0.5)
		                if (Ir<0.4) {
		                    var breakType = 'Spilling'
		                } else if (Ir>=1.5 && Ir<2) {
		                    var breakType = 'Surging'
		                } else if (Ir>=0.4 && Ir<1.5) {
		                    var breakType = 'Plunging'
		                } else {
		                    var breakType = 'No breaking'
		                    errorMessage = 'No breaking, full reflection'
		                }
		            }   
		            if (Ir<2 && propOK>0){
		            	$('#breaking-wave-height').html(Hm0Obj.toFixed(2) + 'm')
		            	$('#breaking-wave-angle').html(thetam.toFixed(2) + '&#176')
		            	$('#water-depth').html(hObj.toFixed(2) + 'm')
		            	$('#breaking-type').html(breakType)
		            	$('#surface-temp').html(SST + '&#176C')
		            	$('#forecast-date').html(date)
		            }
		            else if (propOK>0 && Ir>=2) {
		            	$('#breaking-wave-height').html(error)
		            	$('#breaking-wave-angle').html(error)
		            	$('#water-depth').html(error)
		            	$('#breaking-type').html(error)
		            	$('#surface-temp').html(error)
                        $('#forecast-date').html(date)
		            }
		            else{
		               	$('#breaking-wave-height').html(error)
		            	$('#breaking-wave-angle').html(error)
		            	$('#water-depth').html(error)
		            	$('#breaking-type').html(error)
		            	$('#surface-temp').html(error)
                        $('#forecast-date').html(date)
		            }
		        }
		        else {
	        		$('#breaking-wave-height').html(error)
	            	$('#breaking-wave-angle').html(error)
	            	$('#water-depth').html(error)
	            	$('#breaking-type').html(error)
	            	$('#surface-temp').html(error)
                    $('#forecast-date').html(date)   
		        }
			}
			
		});
		return false;
	}

    request_surf()
});

// ------------------- functions ---------------------
function tanh(arg) {
  //  hyperbolic tangent (not included in javascript Math)
  return (Math.exp(arg) - Math.exp(-arg)) / (Math.exp(arg) + Math.exp(-arg));
}

function sinh(arg) {
  //  hyperbolic sine (not included in javascript Math)
  return (Math.exp(arg) - Math.exp(-arg)) / 2;
}

function cosh(arg) {
  //  hyperbolic cosine (not included in javascript Math)
  return (Math.exp(arg) + Math.exp(-arg)) / 2;
}

function dispRel(h,T,tol){
    // dispersion relationship
    // h = water depth
    // T = wave period
    // tolerance, maybe something about 0.001
    // return wave length
    var g = 9.81; // gravity
    var L0 = g*Math.pow(T,2)/(2*Math.PI); // deep water wave length
    var L1 = L0*tanh(2*Math.PI/L0*h);
    var L2 = L0*tanh(2*Math.PI/L1*h);
    while (Math.abs(L2-L1)/L2>tol){
        L1 = L2;
        L2 = L0*tanh(2*Math.PI/L1*h);
    }
    return L2
}

function funLinSpaceArray(a,b,len){
    // As linspace in matlab
  var A=[]
  var dA = (b-a)/(len-1)
  var dAtot=0
  var ii=0
  while (ii<len) {
    A[ii] = a+dAtot;
    dAtot = dAtot+dA;
    ii=ii+1;
    }
  return A;
}

function funSumArray(a){
    // Sum the elements of a 1D matrix
    var ii=0;
    var A = 0
    while (ii<a.length) {
        A = A+a[ii];
        ii=ii+1;
    }
    return A
}

function funSumArray2Dim(a){
    // Sum the elements of a 2D matrix
    var ii=0;
    var A = 0
    while (ii<a.length) {
        sumRow=funSumArray(a[ii])
        A = A+sumRow;
        ii=ii+1;
    }
    return A
}

function funMultArray(a,b){
    // Element-wise multiplication between 1D arrays
    var ii=0;
    var c = [];
    while (ii<a.length){
        c[ii] = a[ii]*b[ii];
        ii=ii+1;
    }
    return c
}

function funSumArrays(a,b){
    // Sum a scalar to a 1D array 
    var ii=0;
    var c = [];
    while (ii<a.length){
        c[ii] = Number(a[ii])+Number(b);
        ii=ii+1;
    }
    return c
}

function funMultScalar(a,b){
    // Multiply a 1D array to a scalar 
    var ii=0;
    var c = [];
    while (ii<a.length){
        c[ii] = a[ii]*b;
        ii=ii+1;
    }
    return c
}

function funDivideScalar(a,b){
    // Divide a 1D array by a scalar
    var ii=0;
    var c = [];
    while (ii<b.length){
        c[ii] = a/b[ii];
        ii=ii+1;
    }
    return c
}

function funDivideArray(a,b) {
    // Element-wise division
    var ii=0;
    var c= [];
    while (ii<a.length){
        c[ii] = a[ii]/b[ii];
        ii=ii+1;
    }
    return c
}

function funZerosArray(a,b) {
    // Create a zero array with dimension a and b
    var ii=0;
    var c = [];
    while (ii<a){
        var jj=0;
        var row = [];
        while (jj<b){
            row[jj] = 0;
            jj=jj+1;   
        }
        c[ii]=row
        ii=ii+1; 
    }
    return c 
}

function funFreqSpectrum(f,Hs,Tp,gamma) {
    // JONSWAP spectrum
    var g = 9.81;
    var sa = 0.07;
    var sb = 0.09;
    var fp = 1/Tp;
    var bj =  0.0624/(0.230+0.0336*gamma-0.185*Math.pow(1.9+gamma,-1))*(1.094-0.01915*Math.log(gamma));
    var s = [];
    var f1= [];
    var f2 = [];
    var S = [];
    var ii=0;
    while (ii < f.length) { 
        if (f[ii]<fp){
            s[ii]=sa;
        } else {
            s[ii]=sb;
        }
        f1[ii] = Math.pow(Hs,2)/(Math.pow(Tp,4)*Math.pow(f[ii],5))*Math.exp(-1.25*Math.pow(Tp*f[ii],-4));
        f2[ii] = Math.pow(gamma,Math.exp(-Math.pow(Tp*f[ii]-1,2)/(2*Math.pow(s[ii],2))));
        S[ii] = bj*f1[ii]*f2[ii];
        ii=ii+1;
    }
    return S
}

function funDispDirect(teta){
    // Directional spectrum cosine
    var ii = 0;
    var R = [];
    while (ii<teta.length){
        R[ii] = 2/Math.PI*Math.pow(Math.cos(teta[ii]/180*Math.PI),2);
        ii=ii+1;
    }
    return R
}


function funmatrix(h1,hObj,f,tetaInc) {
    // Propagate the spectrum with frequency vector f and angle vector tetaInc from h1 to hObj
    var T = funDivideScalar(1,f);
    var kp = funZerosArray(T.length,tetaInc.length);
    var tetaObj = funZerosArray(T.length,tetaInc.length);
    var kptetaObj = kp.concat(tetaObj)
    var contT=0;
    for (ii=0; ii<T.length; ii++) {
        var ti= T[ii];
        var contTeta=0;
        for (jj=0; jj<tetaInc.length; jj++) {
            var tetai=tetaInc[jj];
            if (Math.abs(tetai)<90){
                kt = funProp(h1,hObj,ti,tetai);
                kp[ii][jj] = kt[0];
                tetaObj[ii][jj] = kt[1]
            }
        }
    }
    var kptetaObj=kp.concat(tetaObj);
    return kptetaObj
}

function funProp(h1,hObj,tp,teta1){
    // Propagate the component with period tp and angle teta1 from h1 to hObj
    var tol=0.001;
    // start point
    var L1=dispRel(h1,tp,tol)
    var k1=2*Math.PI/L1
    var c1=L1/tp;
    var n1 = 0.5*(1+2*k1*h1/(sinh(2*k1*h1)));
    var cg1 = c1*n1;
    // reference point
    var L=dispRel(hObj,tp,tol)
    var k=2*Math.PI/L
    var c=L/tp;
    var n = 0.5*(1+2*k*hObj/(sinh(2*k*hObj)));
    var cg = c*n;

    var teta1Abs = Math.abs(teta1);
    var ks = Math.pow(cg1/cg,0.5);
    var teta1Rad = teta1Abs/180*Math.PI;
    var tetaRad = Math.asin(Math.sin(teta1Rad)*c/c1);
    var kr = Math.pow(Math.cos(teta1Rad)/Math.cos(tetaRad),0.5)
    var teta = tetaRad/Math.PI*180;
    var kp = kr*ks;

    if (teta1<0){
        var tetaTrue=-teta;
    } else{
        var tetaTrue=teta
    }
    
    var kptetaTrue = []
    kptetaTrue[0] = kp
    kptetaTrue[1] = tetaTrue
    return kptetaTrue
}
