
(function(){
  let slides = document.getElementsByClassName('slide');
  slides.forEach = Array.prototype.forEach;
  slides.forEach((slide,index) => slide.addEventListener('input', handleChangeSlide(index, false)));

  let inputFields = document.getElementsByClassName('iput_field');
  inputFields.forEach = Array.prototype.forEach;
  inputFields.forEach((field,index) => field.addEventListener('input', handleChangeSlide(index, true)));


  addHandlerSetColor('.RGB', handleSetColorRGB);
  addHandlerSetColor('.CMYK', handleSetColorCMYK);
  addHandlerSetColor('.HSL', handleSetColorHSL);
  addHandlerSetColor('.LUV', handleSetColorLUV);



  let mainContainer = document.getElementsByClassName('main_container')[0];

  cp = ColorPicker(document.getElementById('pcr'), document.getElementById('picker'),
  function(hex, hsv, rgb, mousePicker, mousepcr) {
  currentColor = hex;
       ColorPicker.positionIndicators(
       document.getElementById('pcr-indicator'),
       document.getElementById('picker-indicator'),
       mousepcr, mousePicker);

      //document.getElementById('hex').innerHTML = hex;
      //document.getElementById('rgb').innerHTML = 'rgb(' + rgb.r.toFixed() + ',' + rgb.g.toFixed() + ',' + rgb.b.toFixed() + ')';
      setColor(mainContainer, rgb.r.toFixed(), rgb.g.toFixed(), rgb.b.toFixed());
      //document.getElementById('hsv').innerHTML = 'hsv(' + hsv.h.toFixed() + ',' + hsv.s.toFixed(2) + ',' + hsv.v.toFixed(2) + ')';

    document.getElementById('pcr_bg').style.backgroundColor = hex;
  });
  cp.setHex('#D4EDFB');

})();


function addHandlerSetColor(className, handle) {
  let slides = document.querySelectorAll(className+' .slide');
  slides.forEach = Array.prototype.forEach;
  slides.forEach((slide,index) => slide.addEventListener('input', handle(index, false)));

  let inputFields = document.querySelectorAll(className+' .iput_field');
  inputFields.forEach = Array.prototype.forEach;
  inputFields.forEach((field,index) => field.addEventListener('input', handle(index, true)));
}

function handleChangeSlide(index, isField) {

  return function (e) {
    let mainContainer = document.getElementsByClassName('main_container')[0];
    let selector = isField ? 'slide' : 'iput_field';
    let inputField = document.getElementsByClassName(selector)[index];

    inputField.value = e.target.value;
  }
}


function handleSetColorRGB(index, isField) {
  return function (e) {
    let mainContainer = document.getElementsByClassName('main_container')[0];
    let color = window.getComputedStyle(mainContainer, null).getPropertyValue('background-color').slice(4, -1).split(', ');
    color[index] = e.target.value;
    setCMYK(RGBtoCMYK(color[0], color[1], color[2]));
    setHSL(RGBtoHSL(color[0], color[1], color[2]));
    setLUV(RGBtoLuv(color[0], color[1], color[2]));
    mainContainer.style.backgroundColor = 'rgb(' + color.join(', ') + ')';
    document.getElementById('pcr_bg').style.backgroundColor = 'rgb(' + color.join(', ') + ')';
  }
}

function handleSetColorCMYK(){
  return function () {
    let mainContainer = document.getElementsByClassName('main_container')[0];
    let  list = document.querySelectorAll('.CMYK .slide');
    let rgb = CMYKtoRGB([list[0].value, list[1].value, list[2].value, list[3].value]);
   //console.log("CMYK: to RGB:  " + rgb);
    setRGB(mainContainer, rgb[0], rgb[1], rgb[2]);
    setHSL(RGBtoHSL(rgb[0], rgb[1], rgb[2]));
    setLUV(RGBtoLuv(rgb[0], rgb[1], rgb[2]));
  }
}

function handleSetColorHSL(){
  return function () {
    let mainContainer = document.getElementsByClassName('main_container')[0];
    let  list = document.querySelectorAll('.HSL .slide');
    let rgb = HSLtoRGB(list[0].value, list[1].value, list[2].value);
    ////console.log("CMYK: to RGB:  " + rgb);
    setRGB(mainContainer, rgb[0], rgb[1], rgb[2]);
    setCMYK(RGBtoCMYK(rgb[0], rgb[1], rgb[2]));
    setLUV(RGBtoLuv(rgb[0], rgb[1], rgb[2]));
  }
}

function handleSetColorLUV(){
  return function () {
    let mainContainer = document.getElementsByClassName('main_container')[0];
    let  list = document.querySelectorAll('.LUV .slide');
    let rgb = LuvToRGB(list[0].value, list[1].value, list[2].value);
    console.log(list[0].value, list[1].value, list[2].value);
    console.log("LuvToRGB: to RGB:  " + rgb);
    setRGB(mainContainer, rgb[0], rgb[1], rgb[2]);
    setCMYK(RGBtoCMYK(rgb[0], rgb[1], rgb[2]));
    setHSL(RGBtoHSL(rgb[0], rgb[1], rgb[2]));
  }
}


function setColor(mainContainer, r, g, b) {
  let cmyk = RGBtoCMYK(r, g, b);
  setRGB(mainContainer, r, g, b);
  setCMYK(cmyk);
  setHSL(RGBtoHSL(r, g, b));
  setLUV(RGBtoLuv(r, g, b));
}

  function setRGB(mainContainer, r, g, b) {
    setRgbSelector(r, g, b, '.RGB .slide');
    setRgbSelector(r, g, b, '.RGB .iput_field');
    setBackgroundColor(mainContainer, r, g, b);
  };

  function setRgbSelector(r, g, b, selector) {
    let inputFields = document.querySelectorAll(selector);
    [].forEach.call(inputFields, (elem, index) => elem.value = arguments[index]);
  }


  function setBackgroundColor(mainContainer, r, g, b) {
    mainContainer.style.backgroundColor = 'rgb(' + [r, g, b].join(', ') + ')';
    document.getElementById('pcr_bg').style.backgroundColor = 'rgb(' + [r, g, b].join(', ') + ')';
  }

  function setCMYK(arrCMYK){
    setField(arrCMYK, '.CMYK .slide');
    setField(arrCMYK, '.CMYK .iput_field');
  }

  function setHSL(arrHSL) {
   //console.log('HSL: ' + arrHSL);
    setField(arrHSL, '.HSL .slide');
    setField(arrHSL, '.HSL .iput_field');
  }

  function setLUV(arrLUV) {
   //console.log('LUV: ' + arrLUV);
    setField(arrLUV, '.LUV .slide');
    setField(arrLUV, '.LUV .iput_field');
  }

  function setField(arr, selector) {
    let inputFields = document.querySelectorAll(selector);
    [].forEach.call(inputFields, (elem, index) => elem.value = arr[index]);
  }

  function RGBtoHSL(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    return [ h*100, s*100, l*100 ];
}

function HSLtoRGB(h, s, l) {
  var r, g, b;

  h/=100;
  s/=100;
  l/=100;
  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.floor( r * 255), Math.floor(g * 255), Math.floor(b * 255)];
}

function CMYKtoRGB(arrCMYK) {
  let r = Math.floor(255*(1-arrCMYK[0]/100)*(1-arrCMYK[3]/100));
  let g = Math.floor(255*(1-arrCMYK[1]/100)*(1-arrCMYK[3]/100));
  let b = Math.floor(255*(1-arrCMYK[2]/100)*(1-arrCMYK[3]/100));

  return [r, g, b];
}

function RGBtoCMYK(r, g, b){
  let k = Math.min(1-r/255, 1-g/255, 1-b/255);
  let c = (1-r/255-k)/(1-k);
  let m = (1-g/255-k)/(1-k);
  let y = (1-b/255-k)/(1-k);
 //console.log([c*100, m*100, y*100 ,k*100]);
  return [c*100, m*100, y*100 ,k*100];
}

function RGBtoLuv(r, g, b) {
  let xyz = RGBtoXYZ(r, g, b);
  return XYZtoLuv(xyz[0], xyz[1], xyz[2]);
}

function LuvToRGB(L, u, v) {
  let xyz = LuvToXYZ(L, u, v);

  let [r, g, b] = XYZtoRGB(xyz[0], xyz[1], xyz[2]);
  return [Math.round(r), Math.round(g), Math.round(b)];
}

function RGBtoXYZ(R, G, B)
{
    var r = parseFloat( R / 255 )        //R from 0 to 255
    var g = parseFloat( G / 255 )        //G from 0 to 255
    var b = parseFloat( B / 255 )        //B from 0 to 255

    if ( r > 0.04045 ) r = Math.pow( ( ( r + 0.055 ) / 1.055 ), 2.4);
    else                   r = r / 12.92
    if ( g > 0.04045 ) g = Math.pow(( ( g + 0.055 ) / 1.055 ), 2.4);
    else                   g = g / 12.92
    if ( b > 0.04045 ) b = Math.pow(( ( b + 0.055 ) / 1.055 ), 2.4);
    else                   b = b / 12.92

    r = r * 100
    g = g * 100
    b = b * 100

    //Observer. = 2°, Illuminant = D65
    let X = r * 0.4124 + g * 0.3576 + b * 0.1805
    let Y = r * 0.2126 + g * 0.7152 + b * 0.0722
    let Z = r * 0.0193 + g * 0.1192 + b * 0.9505
    return [X, Y, Z]
}

function XYZtoRGB(x, y, z) {
  let Rn = 3.2406*x/100 - 1.5372*y/100 - 0.4986*z/100;
  let Gn = -0.9689*x/100 + 1.8758*y/100 + 0.0415*z/100;
  let Bn = 0.0557*x/100 - 0.2040*y/100 + 1.0570*z/100;
  
  return [fXYZ(Rn), fXYZ(Gn), fXYZ(Bn)];
}

function fXYZ(x) {
  if(x >= 0.0031308){
    return 1.055*Math.pow(x, 1/2.4) - 0.055;
  } else {
    return 12.92 * x;
  }
}

function XYZtoLuv(x, y, z) {
  let Xw = 95.047;
  let Yw = 100;
  let Zw = 108.883;

  let u1 = 4*x/(x+15*y+3*z);
  let v1 = 9*y/(x+15*y+3*z);

  let u2 = 4*Xw/(Xw+15*Yw+3*Zw);
  let v2 = 9*Yw/(Xw+15*Yw+3*Zw);

  let L = 116*fXYZtoLuv(y/Yw) -16;
  let u = 13*L*(u1 - u2);
  let v = 13*L*(v1 - v2);

  return [L, u, v];
}

function fXYZtoLuv(x) {
  if(x >= 0.008856){
    return Math.pow(x, 1/3);
  } else {
    return 7.787*x + 16/116;
  }
}

function LuvToXYZ(L, u, v){
  let Xw = 95.047;
  let Yw = 100;
  let Zw = 108.883;

  let u2 = 4*Xw/(Xw+15*Yw+3*Zw);
  let v2 = 9*Yw/(Xw+15*Yw+3*Zw);

  let u1 = u/(13*L) + u2;
  let v1 = v/(13*L) + v2;

  let y = 1/fLuvToXYZ((L+16)/116)*Yw;
  let x = -(9*y*u1)/((u1-4)*v1 - u1*v1);
  let z = (9*y - (15*v1*y) - (v1*x))/3*v1;

  return [x, y, z];
}

function fLuvToXYZ(x) {
  let x3 = Math.pow(x, 3);
  return x3 >= 0.008856 ? x3 : (x - 16/116)/7.787; 
}