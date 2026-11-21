const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const state = { service: 'Wake Surfing', guests: 1, date: null, time: '12:30 PM', month: new Date().getMonth(), year: new Date().getFullYear() };
const today = new Date(); today.setHours(0,0,0,0);
const guestFields = $('#guest-fields');
const toast = $('#toast');

function showToast(message){ toast.textContent=message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>toast.classList.remove('show'),2600); }
function setService(service){
  state.service=service;
  $$('.service-option').forEach(b=>b.classList.toggle('selected',b.dataset.service===service));
}
function renderGuests(){
  $('#guest-count').textContent=state.guests;
  guestFields.innerHTML='';
  for(let i=1;i<=state.guests;i++){
    const row=document.createElement('div'); row.className='guest-row';
    row.innerHTML=`<label>Guest ${i} full name<input type="text" name="guest-name-${i}" placeholder="Full name" autocomplete="name" required></label><label>Guest ${i} phone number<input type="tel" name="guest-phone-${i}" placeholder="Phone number" autocomplete="tel" required></label>`;
    guestFields.appendChild(row);
  }
}
function renderCalendar(){
  const first=new Date(state.year,state.month,1);
  const last=new Date(state.year,state.month+1,0);
  $('#calendar-month').textContent=first.toLocaleDateString('en-US',{month:'long',year:'numeric'});
  const days=$('#calendar-days'); days.innerHTML='';
  for(let i=0;i<first.getDay();i++){const blank=document.createElement('span');days.appendChild(blank);}
  for(let n=1;n<=last.getDate();n++){
    const date=new Date(state.year,state.month,n); date.setHours(0,0,0,0);
    const btn=document.createElement('button'); btn.type='button'; btn.className='calendar-day'; btn.textContent=n;
    const key=`${state.year}-${String(state.month+1).padStart(2,'0')}-${String(n).padStart(2,'0')}`;
    if(date<today)btn.disabled=true;
    if(state.date===key)btn.classList.add('selected');
    btn.addEventListener('click',()=>{state.date=key;renderCalendar();});
    days.appendChild(btn);
  }
}
function showStep(number){
  $$('.booking-step').forEach((el,i)=>el.classList.toggle('hidden',i!==number-1));
  $$('.form-progress span').forEach((el,i)=>el.classList.toggle('progress-active',i<number));
  if(number===2)renderCalendar();
  if(number===3)renderSummary();
}
function readGuestData(){
  const guests=[];
  for(let i=1;i<=state.guests;i++){
    const name=$(`[name="guest-name-${i}"]`)?.value.trim()||'';
    const phone=$(`[name="guest-phone-${i}"]`)?.value.trim()||'';
    if(!name||!phone)return null;
    guests.push({name,phone});
  }
  return guests;
}
function renderSummary(){
  const data=readGuestData()||[];
  const date=state.date?new Date(`${state.date}T12:00:00`).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'}):'Not selected';
  const people=data.map((g,i)=>`<div>Guest ${i+1}: ${escapeHTML(g.name)} · ${escapeHTML(g.phone)}</div>`).join('');
  $('#booking-summary').innerHTML=`<div class="summary-row"><span>Experience</span><strong>${escapeHTML(state.service)}</strong></div><div class="summary-row"><span>Duration</span><strong>2 hours</strong></div><div class="summary-row"><span>Date</span><strong>${date}</strong></div><div class="summary-row"><span>Session</span><strong>${state.time}</strong></div><div class="summary-row"><span>People</span><strong>${state.guests}</strong></div><div class="summary-row summary-total"><span>Booking price</span><strong>$350.00</strong></div><div class="summary-guests">${people}</div>`;
}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

$$('.service-option').forEach(btn=>btn.addEventListener('click',()=>setService(btn.dataset.service)));
$$('.choose-service').forEach(btn=>btn.addEventListener('click',()=>{setService(btn.dataset.service);$('#booking').scrollIntoView({behavior:'smooth'});showStep(1);}));
$('#minus-guests').addEventListener('click',()=>{if(state.guests>1){state.guests--;renderGuests();}});
$('#plus-guests').addEventListener('click',()=>{if(state.guests<10){state.guests++;renderGuests();}else showToast('For groups larger than 10, please contact the team.');});
$('#to-step-two').addEventListener('click',()=>{if(!readGuestData()){showToast('Please enter each guest’s name and phone number.');return;}showStep(2);});
$('#back-step-one').addEventListener('click',()=>showStep(1));
$('#back-step-two').addEventListener('click',()=>showStep(2));
$('#prev-month').addEventListener('click',()=>{state.month--;if(state.month<0){state.month=11;state.year--;}renderCalendar();});
$('#next-month').addEventListener('click',()=>{state.month++;if(state.month>11){state.month=0;state.year++;}renderCalendar();});
$$('.time-option').forEach(btn=>btn.addEventListener('click',()=>{state.time=btn.dataset.time;$$('.time-option').forEach(b=>b.classList.toggle('selected',b===btn));}));
$('#to-step-three').addEventListener('click',()=>{if(!state.date){showToast('Please choose an experience date.');return;}showStep(3);});
$('#checkout-button').addEventListener('click',()=>{
  if(!$('#agree').checked){showToast('Please confirm the booking terms to continue.');return;}
  $('#success-message').classList.remove('hidden');
  $('#checkout-button').disabled=true;
  $('#checkout-button').textContent='Request prepared';
  // Production handoff: submit validated booking data to a secure backend and create a Stripe Checkout Session.
  const payload={service:state.service,guests:readGuestData(),date:state.date,time:state.time,displayedPrice:350,currency:'USD'};
  console.info('Demo booking payload (not submitted):',payload);
});
const menuToggle=$('.menu-toggle');
menuToggle.addEventListener('click',()=>{const open=$('.nav').classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));});
$$('.nav a').forEach(a=>a.addEventListener('click',()=>{$('.nav').classList.remove('open');menuToggle.setAttribute('aria-expanded','false');}));
$('#year').textContent=new Date().getFullYear();
renderGuests();renderCalendar();


// Reveal the curated image strip when the hero video reaches its end.
(() => {
  const video = document.getElementById('hero-video');
  const gallery = document.getElementById('hero-end-gallery');
  const hero = document.querySelector('.hero');
  if (!video || !gallery || !hero) return;

  let galleryShown = false;
  const revealGallery = () => {
    if (galleryShown) return;
    galleryShown = true;
    gallery.classList.add('is-visible');
    hero.classList.add('gallery-active');
  };

  video.addEventListener('ended', revealGallery);
  // Fallback for browsers that do not dispatch `ended` reliably.
  video.addEventListener('timeupdate', () => {
    if (Number.isFinite(video.duration) && video.duration > 0 &&
        video.currentTime >= video.duration - 0.25) revealGallery();
  });
  video.addEventListener('error', () => {
    console.warn('Hero video could not be loaded. Showing the image gallery instead.');
    revealGallery();
  });

  const startVideo = () => {
    video.muted = true;
    video.play().catch(error => console.warn('Hero video autoplay was blocked:', error));
  };
  if (video.readyState >= 2) startVideo();
  else video.addEventListener('canplay', startVideo, { once: true });
})();
