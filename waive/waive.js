jQuery(document).ready(function(){
    // Linear wave calculator --------------------------------------------------
    jQuery('#button').click(function(){
    	var rho = 1025;
    	var g = 9.81;
        var h = jQuery('input[name=WD]').val();
        var Tp = jQuery('input[name=Per]').val();
        var Hei = jQuery('input[name=Hei]').val();
        var Hrms = Hei/1.416
        var Tm = Tp*0.86
        var tol = 0.001;
        var L = dispRel(h,Tm,tol);
        var k = 2*Math.PI/L;
        var om = 2*Math.PI/Tm;
        var c = L/Tm;
        var n = 0.5*(1+2*k*h/(sinh(2*k*h)));
        var cg = c*n;
        var errorMessage = 'Check the parameters'

        
        relDepth = h/L;
        if (relDepth<0.05) {
        	var depthRegime = 'Shallow waters'
        } else if (relDepth>0.5) {
        	var depthRegime = 'Deep waters'
        } else {
        	var depthRegime = 'Intermediate waters'
        };
        
        if (Hei>0 && h>0 && Tp>0 && Hrms/L<0.142 && Hrms/h<0.8) {
        	var u = Hrms/2*om*cosh(k*h)/sinh(k*h);
        	var w = Hrms/2*om;
        	var E = 1/8*rho*g*Math.pow(Hrms,2);
        	var Mf = E/c;
        	var Sxx = E*(2*n-0.5);
        	var F = E*cg;
            jQuery('#item0').html('<td id="item0"> Mean Wave Length  = ' + L.toFixed(2) + ' m<br>Wave Celerity  = ' + c.toFixed(2) + ' m/s<br>Group Celerity = '+cg.toFixed(2)+' m/s<br>Relative Depth = '+relDepth.toFixed(2)+'<br>Regime = '+depthRegime+' <br>Max. Horizontal Velocity = '+u.toFixed(2)+' m/s<br>Max. Vertical Velocity = '+w.toFixed(2)+' m/s<br>Mass Flux = '+Mf.toFixed(2)+' kg/(ms)<br>Radiation Stress = '+Sxx.toFixed(2)+' N/m<br>Energy Flux = '+F.toFixed(2)+' W/m</td>');
        }
        else if (Hei.length==0 && h>0 && Tp>0 && Hrms/L<0.142 && Hrms/h<0.8)  {
        	jQuery('#item0').html('<td id="item0"> Mean Wave Length  = ' + L.toFixed(2) + ' m<br>Wave Celerity  = ' + c.toFixed(2) + ' m/s<br>Group Celerity = '+cg.toFixed(2)+' m/s<br>Relative Depth = '+relDepth.toFixed(2)+'<br>Regime = '+depthRegime+' <br>Max. Horizontal Velocity = ...<br>Max. Vertical Velocity = ...<br>Mass Flux = ...<br>Radiation Stress = ...<br>Energy Flux = ...</td>');
        }
        else {
            jQuery('#item0').html('<td id="item0"> Mean Wave Length  = ' + errorMessage + ' <br>Wave Celerity  = ' + errorMessage + ' <br>Group Celerity = '+errorMessage+' <br>Relative Depth = '+errorMessage+'<br>Regime = '+errorMessage+' <br>Max. Horizontal Velocity = '+errorMessage+'<br>Max. Vertical Velocity = '+errorMessage+'<br>Mass Flux = '+errorMessage+'<br>Radiation Stress = '+errorMessage+'<br>Energy Flux = '+errorMessage+'</td>');
        }


    });

    // Surf Wave Calculator ------------------------------------------------------
    jQuery('#buttonSurf').click(function(){
    	var rho = 1025;
    	var g = 9.81;
        var h1 = jQuery('input[name=WDS]').val();
        var tp = jQuery('input[name=PerS]').val();
        var Hs = jQuery('input[name=HeiS]').val();
        var theta1 = jQuery('input[name=IncS]').val();
        var y = jQuery("#mySelectSedSizeS").val();
        var D50
        switch(y){
            case "1": 
                D50 = 0.0002;
            break;
            case "2":
                D50 = 0.0004;
            break;
            case "3":
                D50 = 0.001;
            break;
            case "4":
                D50 = 0.003;
            break;
            default:
                D50 = 0.0002;
        }
        var Ndh=150 // the depth will be divided by this number to get the dh
        var tol = 0.001;
        var L1 = dispRel(h1,tp,tol);
        var k1 = 2*Math.PI/L1;
        var L0 = g*Math.pow(tp,2)/(2*Math.PI)
        var fp = 1/tp;
        var errorMessage = 'Check the parameters'
        if (theta1>=0 && theta1<=90 && Hs>0 && h1>0 && tp>0) {

            // f and theta arrays --------------------------
            var f = funLinSpaceArray(fp/3,fp*7,24);
            var df=f[1]-f[0];

            var theta = funLinSpaceArray(-90,90,19);
            var dtheta = theta[1]-theta[0];
            var dthetaRad = dtheta/180*Math.PI;
            // ------------------- defining the spectrum Jonswap
            var Sf = funFreqSpectrum(f,Hs,tp,3.3);
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
            if (h1/Hs>3) {
                var hObj = Hs*3;
            } else {
                var hObj = h1
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
                var kptetaObj = funmatrix(h1,hObj,f,thetaInc);
                var kp = kptetaObj.slice(0,f.length); 
                var tetaObj = kptetaObj.slice(f.length,2*f.length);
                var Hm0ObjComp = funZerosArray(f.length,theta.length);
                for (ii=0; ii<f.length; ii++) {
                    for (jj=0; jj<theta.length; jj++) {
                        Hm0ObjComp[ii][jj] = Sft[ii][jj]*df*dthetaRad*Math.pow(kp[ii][jj],2);
                    }
                }
                Hm0Obj = 4.004*Math.pow(funSumArray2Dim(Hm0ObjComp),0.5);
                var LObj = dispRel(hObj,tp,tol);
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
                jQuery('#item10').html('<td id="item10"> Breaking Wave Height  = ' + Hm0Obj.toFixed(2) + ' m<br>Breaking Wave Angle of Incidence  = ' + thetam.toFixed(2) + ' degrees<br>Breaking Water Depth = '+hObj.toFixed(2)+' m<br>Iribarren Number = '+Ir.toFixed(2)+'<br>Breaking Type = '+breakType+' </td>');
            }
            else if (propOK>0 && Ir>=2) {
                jQuery('#item10').html('<td id="item10"> Breaking Wave Height  = ' + errorMessage + ' <br>Breaking Wave Angle of Incidence  = ' + errorMessage + ' <br>Breaking Water Depth = '+errorMessage+' <br>Iribarren Number = '+errorMessage+'<br>Breaking Type = '+errorMessage+' </td>');
            }
            else{
                jQuery('#item10').html('<td id="item10"> Breaking Wave Height  = ' + errorMessage + ' <br>Breaking Wave Angle of Incidence  = ' + errorMessage + ' <br>Breaking Water Depth = '+errorMessage+' <br>Iribarren Number = '+errorMessage+'<br>Breaking Type = '+errorMessage+' </td>');
            }
        }
        else {
            jQuery('#item10').html('<td id="item10"> Breaking Wave Height  = ' + errorMessage + ' <br>Breaking Wave Angle of Incidence  = ' + errorMessage + ' <br>Breaking Water Depth = '+errorMessage+' <br>Iribarren Number = '+errorMessage+'<br>Breaking Type = '+errorMessage+' </td>');
        }
    });

    // Wave Generation Calculator ---------------------------------------------
    jQuery('#buttonSPM').click(function(){
        var g = 9.81;
        var U = jQuery('input[name=Wind]').val()*1852/3600; // from knots to m/s
        var X = jQuery('input[name=Fet]').val()*1000; // from km to m
        var t = jQuery('input[name=Dur]').val()*3600; // from h to s
        var errorMessage = 'Check the parameters'
        var Ua = 0.71*Math.pow(U,1.23) // U from SPM

        var Hm0F = 1.6*Math.pow(10,-3)*Math.pow(g*X/Math.pow(Ua,2),0.5)*Math.pow(Ua,2)/g
        var TpF = 0.286*Math.pow(g*X/Math.pow(Ua,2),0.33)*Ua/g

        var Hm0t = 8.033*Math.pow(10,-5)*Math.pow(g*t/Ua,5/7)*Math.pow(Ua,2)/g
        var Tpt = 5.95*Math.pow(10,-2)*Math.pow(g*t/Ua,3/7)*Ua/g

        var Hm0Max = 0.243*Math.pow(Ua,2)/g
        var TpMax = 8.134*Ua/g

        if (U>0 && X>0 && t>0) {
            if (Hm0t<Hm0F) {
                if (Hm0Max<Hm0t){
                    jQuery('#item17').html('<td id="item17"> Significant Wave Height  = ' + Hm0Max.toFixed(2) + ' m<br>Peak Wave Period  = ' + Math.min(Tpt,TpMax).toFixed(2) + ' s<br>Wave growth limited by: fully developed sea</td>');
                }
                else {
                    jQuery('#item17').html('<td id="item17"> Significant Wave Height  = ' + Hm0t.toFixed(2) + ' m<br>Peak Wave Period  = ' + Math.min(Tpt,TpF).toFixed(2) + ' s<br>Wave growth limited by: duration</td>');
                }
            }
            else{ 
                if (Hm0Max<Hm0F){
                    jQuery('#item17').html('<td id="item17"> Significant Wave Height  = ' + Hm0Max.toFixed(2) + ' m<br>Peak Wave Period  = ' + Math.min(TpF,TpMax).toFixed(2) + ' s<br>Wave growth limited by: fully developed sea</td>');
                }
                else {
                   jQuery('#item17').html('<td id="item17"> Significant Wave Height  = ' + Hm0F.toFixed(2) + ' m<br>Peak Wave Period  = ' + Math.min(Tpt,TpF).toFixed(2) + ' s<br>Wave growth limited by: fetch</td>');
                }
            }
        } 
        else{
            jQuery('#item17').html('<td id="item17"> Significant Wave Height  = ' + errorMessage + '<br>Peak Wave Period  = ' + errorMessage + '<br>Wave growth limited by: '+ errorMessage +'</td>');
        }  
    });

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
