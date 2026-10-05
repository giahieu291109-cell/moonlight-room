const room = document.getElementById("room");
const intro = document.getElementById("intro");
const enter = document.getElementById("enter");
const lamp = document.getElementById("lamp");
const lampBtn = document.getElementById("lampBtn");
const note = document.getElementById("note");
const noteBtn = document.getElementById("noteBtn");
const soundBtn = document.getElementById("soundBtn");
const toast = document.getElementById("toast");
const curtainLeft = document.getElementById("curtainLeft");
const curtainRight = document.getElementById("curtainRight");
const dust = document.getElementById("dust");
const sleepOverlay = document.getElementById("sleepOverlay");
const stars = document.getElementById("stars");

let audioCtx = null, ambience = null, audioOn = false;

function makeStars(){
  for(let i=0;i<55;i++){
    const s=document.createElement("i");
    s.className="star";
    s.style.left=Math.random()*100+"%";
    s.style.top=Math.random()*85+"%";
    s.style.opacity=(.2+Math.random()*.65).toFixed(2);
    s.style.animationDelay=(Math.random()*4).toFixed(2)+"s";
    s.style.animationDuration=(2+Math.random()*4).toFixed(2)+"s";
    stars.appendChild(s);
  }
}
function makeDust(){
  for(let i=0;i<30;i++){
    const d=document.createElement("i");
    d.style.left=(5+Math.random()*90)+"%";
    d.style.top=(25+Math.random()*65)+"%";
    d.style.animationDelay=(Math.random()*6)+"s";
    d.style.animationDuration=(4+Math.random()*5)+"s";
    dust.appendChild(d);
  }
}
makeStars(); makeDust();

function showToast(msg){
  toast.textContent=msg; toast.classList.add("show");
  clearTimeout(showToast.t); showToast.t=setTimeout(()=>toast.classList.remove("show"),1900);
}

function toggleLamp(){
  room.classList.toggle("lamp-on");
  lampBtn.classList.toggle("active",room.classList.contains("lamp-on"));
  showToast(room.classList.contains("lamp-on")?"Đèn ngủ sáng lên rồi ✦":"Để trăng soi phòng nhé 🌙");
}
lamp.addEventListener("click",toggleLamp);
lamp.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" ")toggleLamp()});
lampBtn.addEventListener("click",toggleLamp);

function toggleCurtains(){
  room.classList.toggle("open-curtains");
  showToast(room.classList.contains("open-curtains")?"Kéo rèm ra, nhìn trăng một chút 🌙":"Khép rèm lại cho căn phòng yên hơn.");
}
curtainLeft.addEventListener("click",toggleCurtains);
curtainRight.addEventListener("click",toggleCurtains);

function toggleNote(){
  note.classList.toggle("show");
  noteBtn.classList.toggle("active",note.classList.contains("show"));
}
noteBtn.addEventListener("click",toggleNote);

enter.addEventListener("click",()=>{
  intro.classList.add("hide");
  setTimeout(()=>{room.classList.add("open-curtains"); showToast("Chào mừng vào căn phòng lúc nửa đêm 🌙")},500);
});

function startAmbience(){
  if(audioOn) return;
  try{
    audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    const gain=audioCtx.createGain(); gain.gain.value=.018; gain.connect(audioCtx.destination);
    const osc=audioCtx.createOscillator(); osc.type="sine"; osc.frequency.value=196; osc.connect(gain); osc.start();
    const lfo=audioCtx.createOscillator(), lfoGain=audioCtx.createGain();
    lfo.frequency.value=.08; lfoGain.gain.value=3; lfo.connect(lfoGain); lfoGain.connect(osc.frequency); lfo.start();
    ambience={osc,gain,lfo}; audioOn=true; soundBtn.classList.add("active");
    showToast("Âm thanh đêm nhẹ đã bật ♪");
  }catch(e){showToast("Trình duyệt không cho phát âm thanh.");}
}
function stopAmbience(){
  if(!audioOn)return;
  try{ambience.osc.stop(); ambience.lfo.stop(); ambience.gain.disconnect()}catch(e){}
  ambience=null; audioOn=false; soundBtn.classList.remove("active"); showToast("Đã tắt âm thanh.");
}
soundBtn.addEventListener("click",()=>audioOn?stopAmbience():startAmbience());

let idleTimer;
function idle(){
  clearTimeout(idleTimer);
  idleTimer=setTimeout(()=>{
    if(!note.classList.contains("show") && !intro.classList.contains("hide")){
      return;
    }
    sleepOverlay.classList.add("show");
    setTimeout(()=>sleepOverlay.classList.remove("show"),5200);
  }, 30000);
}
["pointermove","pointerdown","touchstart","keydown"].forEach(e=>window.addEventListener(e,idle,{passive:true}));
idle();

document.addEventListener("dblclick",e=>{
  if(e.target.closest(".controls,.intro,.note")) return;
  room.classList.toggle("lamp-on");
  lampBtn.classList.toggle("active",room.classList.contains("lamp-on"));
});
