'use client';
import {createContext,useContext,useEffect,useRef,useState} from 'react';
import type {MouseEvent} from 'react';
import {motion,useScroll,useTransform} from 'framer-motion';
import {ArrowUpRight,ChevronRight,Dumbbell,MessageCircle,MapPin,Menu,Moon,Palette,Play,Sun,X,Zap} from 'lucide-react';

const programs=[
 {en:'STRENGTH',ar:'القوة',enDesc:'Progressive strength training.',arDesc:'تدريب قوة تدريجي لبناء الأداء والتحكم.',time:'45–60',levelEn:'HIGH',levelAr:'عالية'},
 {en:'BOXING',ar:'الملاكمة',enDesc:'Technique, conditioning and confidence.',arDesc:'تقنية ولياقة وثقة داخل الحلبة.',time:'50',levelEn:'HIGH',levelAr:'عالية'},
 {en:'SWIMMING',ar:'السباحة',enDesc:'Low-impact conditioning and performance.',arDesc:'لياقة وأداء بتأثير منخفض على المفاصل.',time:'45',levelEn:'MEDIUM',levelAr:'متوسطة'},
 {en:'CYCLING',ar:'الدراجات',enDesc:'High-energy endurance training.',arDesc:'تدريب تحمّل عالي الطاقة والإيقاع.',time:'45',levelEn:'HIGH',levelAr:'عالية'},
 {en:'HIIT',ar:'تمارين HIIT',enDesc:'Fast, functional and seriously effective.',arDesc:'تمارين وظيفية سريعة وعالية الفعالية.',time:'40',levelEn:'MAX',levelAr:'قصوى'}
];
const classes=[
 ['06:00','HIIT','تمارين HIIT','Performance Zone','منطقة الأداء'],
 ['08:30','MOBILITY','المرونة','Recovery Studio','استوديو التعافي'],
 ['17:30','BOXING','الملاكمة','Fight Studio','استوديو القتال'],
 ['19:00','CYCLING','الدراجات','Ride Studio','استوديو الدراجات']
];
const statItems=[
 {n:4,s:'+',en:'UAE LOCATIONS',ar:'فروع في الإمارات'},
 {n:8,s:'+',en:'PREMIUM SERVICES',ar:'خدمات متميزة'},
 {n:7,s:'+',en:'TRAINING EXPERIENCES',ar:'تجارب تدريبية'},
 {n:365,s:'',en:'DAYS TO GET STRONGER',ar:'يوماً لتصبح أقوى'}
];

type ThemeMode='dark'|'light'; type Accent='red'|'blue'|'orange'; type Language='en'|'ar';
const LanguageContext=createContext<Language>('en');
const useLanguage=()=>useContext(LanguageContext);
const tr=(lang:Language,en:string,ar:string)=>lang==='ar'?ar:en;
function Counter({to,suffix}:{to:number,suffix:string}){
  const ref=useRef<HTMLSpanElement>(null);
  const [n,setN]=useState(0);
  useEffect(()=>{
    const el=ref.current;if(!el)return;let raf=0;let lastRun=0;
    const run=()=>{
      const now=Date.now(); if(now-lastRun<700)return; lastRun=now;
      cancelAnimationFrame(raf); setN(0);
      const st=performance.now(),dur=1500;
      const tick=(t:number)=>{const p=Math.min((t-st)/dur,1);const e=1-Math.pow(1-p,3);setN(Math.round(to*e));if(p<1)raf=requestAnimationFrame(tick)};
      raf=requestAnimationFrame(tick);
    };
    const io=new IntersectionObserver(([entry])=>{if(entry.isIntersecting)run()},{threshold:.18});
    io.observe(el);
    if(el.getBoundingClientRect().top<window.innerHeight) run();
    return()=>{io.disconnect();cancelAnimationFrame(raf)};
  },[to]);
  return <span ref={ref}>{String(n).padStart(to<10?2:1,'0')}{suffix}</span>;
}

function Loader({active}:{active:boolean}){
  if(!active)return null;
  return <motion.div className="gymLoader" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
    <div className="loaderPlate"><b>20</b><span>KG</span></div>
    <div className="loaderBar"><i/><Dumbbell/><i/></div>
    <p>FITNESS TIME</p><small>PREPARING YOUR TRAINING FLOOR</small>
  </motion.div>;
}
function Header({mode,setMode,accent,setAccent,triggerLoader,lang,setLang}:{mode:ThemeMode,setMode:(m:ThemeMode)=>void,accent:Accent,setAccent:(a:Accent)=>void,triggerLoader:()=>void,lang:Language,setLang:(l:Language)=>void}){
  const [colors,setColors]=useState(false); const [menu,setMenu]=useState(false);
  const go=()=>{setMenu(false);triggerLoader()};
  return <>
    <div className="utilityDock mobileUtilityDock">
      <button className="iconBtn themeBtn" onClick={()=>setMode(mode==='dark'?'light':'dark')} aria-label={tr(lang,"Toggle light mode","تبديل الوضع")} title={tr(lang,"Light / dark","فاتح / داكن")}>{mode==='dark'?<Sun/>:<Moon/>}</button>
      <div className="paletteWrap"><button className="iconBtn" onClick={()=>setColors(!colors)} aria-label={tr(lang,"Choose theme colour","اختر لون الواجهة")}><Palette/></button>{colors&&<div className="colorPicker"><button className="swatch redSw" onClick={()=>setAccent('red')}/><button className="swatch blueSw" onClick={()=>setAccent('blue')}/><button className="swatch orangeSw" onClick={()=>setAccent('orange')}/></div>}</div>
      <button className="iconBtn globeBtn" onClick={()=>setLang(lang==='en'?'ar':'en')} aria-label={tr(lang,"Switch to Arabic","التبديل إلى الإنجليزية")}><span>◎</span></button>
      <button className="utilityLang" onClick={()=>setLang(lang==='en'?'ar':'en')}>{lang==='en'?'العربية':'EN'}</button>
    </div>
    <header className="header">
      <a href="#" className="logoWrap" onClick={go}><img src="/fitness-time-logo.webp" alt="Fitness Time"/></a>
      <nav><a href="#experience">{tr(lang,"Experience","التجربة")}</a><a href="#classes">{tr(lang,"Classes","الحصص")}</a><a href="#trainers">{tr(lang,"Trainers","المدربون")}</a><a href="#membership">{tr(lang,"Membership","العضوية")}</a><a href="#clubs">{tr(lang,"Clubs","الفروع")}</a></nav>
      <div className="headActions">
        <div className="desktopTools">
          <button className="iconBtn themeBtn" onClick={()=>setMode(mode==='dark'?'light':'dark')} aria-label={tr(lang,"Toggle light mode","تبديل الوضع")}>{mode==='dark'?<Sun/>:<Moon/>}</button>
          <div className="paletteWrap"><button className="iconBtn" onClick={()=>setColors(!colors)} aria-label={tr(lang,"Choose theme colour","اختر لون الواجهة")}><Palette/></button>{colors&&<div className="colorPicker"><button className="swatch redSw" onClick={()=>setAccent('red')}/><button className="swatch blueSw" onClick={()=>setAccent('blue')}/><button className="swatch orangeSw" onClick={()=>setAccent('orange')}/></div>}</div>
          <button className="iconBtn globeBtn" onClick={()=>setLang(lang==='en'?'ar':'en')} aria-label={tr(lang,"Switch language","تبديل اللغة")}><span>◎</span></button>
          <button className="utilityLang" onClick={()=>setLang(lang==='en'?'ar':'en')}>{lang==='en'?'العربية':'EN'}</button>
        </div>
        <a className="mobilePhone" href="tel:0567470886">0567470886</a>
        <a className="pill primary" href="#membership" onClick={go}>{tr(lang,"JOIN NOW","انضم الآن")} <ArrowUpRight size={16}/></a>
        <button className="mobileMenuBtn" onClick={()=>setMenu(v=>!v)} aria-label={tr(lang,"Open menu","فتح القائمة")}>{menu?<X/>:<Menu/>}</button>
      </div>
    </header>
    <div className={`mobileDrawer ${menu?'show':''}`}>
      <div className="mobileDrawerTop"><b>{tr(lang,"MENU","القائمة")}</b><button onClick={()=>setMenu(false)}><X/></button></div>
      <a href="#experience" onClick={go}>{tr(lang,"Experience","التجربة")} <ArrowUpRight/></a>
      <a href="#classes" onClick={go}>{tr(lang,"Classes","الحصص")} <ArrowUpRight/></a>
      <a href="#trainers" onClick={go}>{tr(lang,"Trainers","المدربون")} <ArrowUpRight/></a>
      <a href="#membership" onClick={go}>{tr(lang,"Membership","العضوية")} <ArrowUpRight/></a>
      <a href="#clubs" onClick={go}>{tr(lang,"Clubs","الفروع")} <ArrowUpRight/></a>
      <div className="mobileTools"><button onClick={()=>setMode(mode==='dark'?'light':'dark')}>{mode==='dark'?<Sun/>:<Moon/>} {tr(lang,mode==='dark'?'LIGHT MODE':'DARK MODE',mode==='dark'?'الوضع الفاتح':'الوضع الداكن')}</button><button onClick={()=>setColors(!colors)}><Palette/> {tr(lang,"THEME","لون الواجهة")}</button><button onClick={()=>setLang(lang==='en'?'ar':'en')}>◎ {lang==='en'?'العربية':'ENGLISH'}</button></div>
      {colors&&<div className="mobileSwatches"><button className="swatch redSw" onClick={()=>setAccent('red')}/><button className="swatch blueSw" onClick={()=>setAccent('blue')}/><button className="swatch orangeSw" onClick={()=>setAccent('orange')}/></div>}
      <a className="mobileCall" href="tel:0567470886">{tr(lang,"CALL 0567470886","اتصل 0567470886")}</a>
    </div>
  </>
}
function BrandIcon({name}:{name:string}){if(name==='ig')return <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.7" r="1" className="fill"/></svg>;if(name==='fb')return <svg viewBox="0 0 24 24"><path className="fill" d="M13.7 22v-8h2.7l.4-3.1h-3.1V9c0-.9.3-1.5 1.6-1.5H17V4.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2H7.5V14h2.8v8h3.4Z"/></svg>;if(name==='tt')return <svg viewBox="0 0 24 24"><path className="fill" d="M15.5 3c.3 1.9 1.4 3.4 3.5 3.8v3.1c-1.4 0-2.6-.4-3.5-1v6.2c0 4-3.1 6.4-6.1 5.8-2.4-.5-4.3-2.5-4.4-5-.2-3.5 2.6-6.3 6-6.3.3 0 .6 0 .9.1v3.2a3 3 0 0 0-1.1-.2c-1.6 0-2.8 1.3-2.7 2.9.1 1.2 1 2.2 2.2 2.4 1.8.3 3.3-1.1 3.3-2.8V3h1.9Z"/></svg>;return <svg viewBox="0 0 24 24"><path className="fill" d="M22 12s0-3.1-.4-4.6a2.8 2.8 0 0 0-2-2C18.1 5 12 5 12 5s-6.1 0-7.6.4a2.8 2.8 0 0 0-2 2C2 8.9 2 12 2 12s0 3.1.4 4.6a2.8 2.8 0 0 0 2 2C5.9 19 12 19s6.1 0 7.6-.4a2.8 2.8 0 0 0 2-2C22 15.1 22 12 22 12Zm-12 3.2V8.8l5.5 3.2-5.5 3.2Z"/></svg>}
function SocialRail(){const [open,setOpen]=useState(true);useEffect(()=>{let closeTimer:number;const cycle=()=>{setOpen(true);closeTimer=window.setTimeout(()=>setOpen(false),5000)};cycle();const repeat=window.setInterval(cycle,10000);return()=>{clearTimeout(closeTimer);clearInterval(repeat)}},[]);const socials=[['Instagram','/instagram.jpg','#'],['Facebook','/facebook.png','#'],['X','/x.png','#'],['YouTube','/youtube.png','#']];return <aside className={`socialDock ${open?'open':''}`}><div className="socialLinks">{socials.map(([label,img,url])=><a key={label} href={url} aria-label={label} title={label}><img src={img} alt=""/></a>)}</div><span className="socialLine"/><button className="socialTrigger" onClick={()=>setOpen(v=>!v)} aria-label="Social media">+</button><small>{useLanguage()==='ar'?'تواصل':'CONNECT'}</small></aside>}
function FloatActions({triggerLoader}:{triggerLoader:()=>void}){
  const [kind,setKind]=useState<'wa'|'join'>('wa');
  const [wide,setWide]=useState(true);
  useEffect(()=>{const id=window.setInterval(()=>{setWide(false);window.setTimeout(()=>{setKind(k=>k==='wa'?'join':'wa');setWide(true)},420)},4300);return()=>clearInterval(id)},[]);
  const isWa=kind==='wa';
  return <div className="floatActions single">
    <motion.a key={kind} className={`action smartAction ${isWa?'wa':'joinFloat'}`} initial={{width:52}} animate={{width:wide?154:52}} href={isWa?'https://wa.me/971567470886':'#membership'} target={isWa?'_blank':undefined} rel={isWa?'noreferrer':undefined} onClick={triggerLoader}>
      {isWa?<MessageCircle/>:<Dumbbell/>}<b className={wide?'show':''}>{isWa?'WhatsApp':'JOIN NOW'}</b>
    </motion.a>
  </div>;
}
function PaymentWidget(){const methods=[{name:'VISA',img:'/visa.png'},{name:'MASTERCARD',img:'/mastercard.png'}];const [index,setIndex]=useState(0);const [open,setOpen]=useState(true);useEffect(()=>{let swap:number;const cycle=()=>{setOpen(false);swap=window.setTimeout(()=>{setIndex(i=>(i+1)%methods.length);setOpen(true)},650)};const id=window.setInterval(cycle,3000);return()=>{clearInterval(id);clearTimeout(swap)}},[]);const m=methods[index];return <aside className={`paymentDock ${open?'open':''}`} aria-label="Accepted payment methods"><div className="paymentLogo"><img src={m.img} alt={m.name}/></div><div className="paymentText"><small>WE ACCEPT</small><b>{m.name}</b></div></aside>}
function Offer({close}:{close:()=>void}){const lang=useLanguage();return <motion.div className="offerBack" initial={{opacity:0}} animate={{opacity:1}}><motion.div className="offer" initial={{y:40,scale:.94}} animate={{y:0,scale:1}}><button className="close" onClick={close}><X/></button><small>{tr(lang,"LIMITED ACCESS","عرض لفترة محدودة")}</small><h2>{tr(lang,"CLAIM YOUR","احصل على")}<br/><i>{tr(lang,"FREE CLUB PASS.","تجربة مجانية للنادي.")}</i></h2><p>{tr(lang,"Experience the club before you choose your membership.","جرّب النادي والمرافق قبل اختيار عضويتك.")}</p><div className="offerInput"><input placeholder={tr(lang,"Email or mobile number","البريد الإلكتروني أو رقم الهاتف")}/><button>{tr(lang,"GET MY PASS","احصل على التجربة")} <ArrowUpRight/></button></div></motion.div></motion.div>}
function Hero(){const lang=useLanguage();const {scrollY}=useScroll();const y=useTransform(scrollY,[0,900],[0,150]);return <section className="hero"><motion.div className="heroBg" style={{y}}/><div className="noise"/><div className="heroGrid"><motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}><div className="eyebrow"><span/> {tr(lang,"PREMIUM FITNESS • UAE","لياقة متميزة • الإمارات")}</div><h1>{tr(lang,"YOUR TIME.","وقتك.")}<br/><span>{tr(lang,"YOUR POWER.","قوتك.")}</span><br/><i>{tr(lang,"YOUR MOVE.","حركتك.")}</i></h1><p>{tr(lang,"Train with purpose in a high-performance environment built around expert coaching, premium facilities and a community that keeps moving.","تدرّب بهدف في بيئة عالية الأداء تجمع بين التدريب الاحترافي والمرافق المتميزة ومجتمع رياضي نابض بالحركة.")}</p><div className="heroBtns"><a className="pill primary" href="#membership">{tr(lang,"GET FREE PASS","احصل على تجربة مجانية")} <ArrowUpRight/></a><a className="circlePlay" href="#experience"><Play/> {tr(lang,"EXPLORE CLUB","استكشف النادي")}</a></div></motion.div><motion.div className="today" initial={{opacity:0,x:50}} animate={{opacity:1,x:0}}><small><Zap size={14}/> {tr(lang,"TODAY AT FITNESS TIME","اليوم في فتنس تايم")}</small><strong>18</strong><span>{tr(lang,"CLASSES TODAY","حصة اليوم")}</span><hr/><p>{tr(lang,"NEXT UP","الحصة التالية")}</p><b>{tr(lang,"HIIT PERFORMANCE","أداء HIIT")}</b><em>{tr(lang,"5:30 PM • 45 MIN","5:30 م • 45 دقيقة")}</em><a href="#classes">{tr(lang,"VIEW SCHEDULE","عرض الجدول")} <ChevronRight/></a></motion.div></div><div className="scrollHint">{tr(lang,"SCROLL TO TRAIN ↓","مرّر لاكتشاف التدريب ↓")}</div></section>}
function Stats(){const lang=useLanguage();return <section className="stats"><div className="sectionTag">{tr(lang,"01 — IMPACT","01 — الأثر")}</div><div className="statGrid">{statItems.map((x,i)=><motion.div className="stat" key={x.en} initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{amount:.35}} transition={{delay:i*.08}}><strong><Counter to={x.n} suffix={x.s}/></strong><span>{tr(lang,x.en,x.ar)}</span><div className="meter"><motion.i initial={{width:0}} whileInView={{width:`${66+i*8}%`}} viewport={{amount:.3}} transition={{duration:1,delay:.2+i*.1}}/></div></motion.div>)}</div><div className="barbell"><span/><b><Dumbbell/></b><span/></div></section>}
function Programs(){const lang=useLanguage();const [active,setActive]=useState(0);return <section id="experience" className="programSec"><div className="sectionHead"><div><div className="sectionTag">{tr(lang,"02 — CHOOSE YOUR TRAINING","02 — اختر تدريبك")}</div><h2>{tr(lang,"FIND YOUR","اكتشف")}<br/><i>{tr(lang,"INTENSITY.","شدّتك.")}</i></h2></div><p>{tr(lang,"Training experiences built around performance, technique and the club environment.","تجارب تدريبية مصممة حول الأداء والتقنية وبيئة النادي المتميزة.")}</p></div><div className="programs">{programs.map((x,i)=><article onMouseEnter={()=>setActive(i)} onClick={()=>setActive(i)} className={active===i?'active':''} key={x.en}><div className={`programImg p${i}`}/><div className="programShade"/><span>0{i+1}</span><h3>{tr(lang,x.en,x.ar)}</h3><div className="programInfo"><p>{tr(lang,x.enDesc,x.arDesc)}</p><small>{x.time} {tr(lang,"MIN","دقيقة")} • {tr(lang,x.levelEn,x.levelAr)} {tr(lang,"INTENSITY","الشدة")}</small><button>{tr(lang,"VIEW CLASS","عرض الحصة")} <ArrowUpRight/></button></div></article>)}</div></section>}
function Schedule(){const lang=useLanguage();const days=lang==='ar'?['الإثنين 15','الثلاثاء 16','الأربعاء 17','الخميس 18','الجمعة 19']:['MON 15','TUE 16','WED 17','THU 18','FRI 19'];return <section id="classes" className="schedule"><div className="scheduleTitle"><div className="sectionTag">{tr(lang,"03 — LIVE SCHEDULE","03 — جدول الحصص")}</div><h2>{tr(lang,"MAKE TIME.","خصص وقتك.")}<br/><i>{tr(lang,"MAKE IT COUNT.","واجعله مؤثراً.")}</i></h2><div className="days">{days.map((d,i)=><button key={d} className={i===0?'on':''}>{d}</button>)}</div></div><div className="classList">{classes.map((c,i)=><motion.div key={`${c[0]}-${c[1]}`} whileHover={{x:lang==='ar'?-8:8}} className="classRow"><strong>{c[0]}</strong><div><b>{tr(lang,c[1],c[2])}</b><span>{tr(lang,c[3],c[4])}</span></div><span className="spots">{i===2?tr(lang,'3 SPOTS','3 أماكن'):tr(lang,'AVAILABLE','متاح')}</span><button aria-label={tr(lang,"View class","عرض الحصة")}><ArrowUpRight/></button></motion.div>)}</div></section>}
function TrainerCard({t,i}:{t:{name:string,role:string,years:number,specialty:string,lang:string,img:string},i:number}){
  const [flipped,setFlipped]=useState(false);
  const swipeStartX=useRef<number|null>(null);
  const swipeStartY=useRef<number|null>(null);

  return <motion.article
    className={`trainerCard flipCard ${flipped?'isFlipped':''}`}
    initial={{opacity:0,y:40}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:true,amount:.2}}
    transition={{delay:i*.08}}
    onMouseEnter={(e)=>{if(window.matchMedia('(hover:hover) and (pointer:fine)').matches)setFlipped(true)}}
    onMouseLeave={(e)=>{if(window.matchMedia('(hover:hover) and (pointer:fine)').matches)setFlipped(false)}}
  >
    <button
      className="trainerFlipButton"
      onPointerDown={(e)=>{e.stopPropagation();if(e.pointerType==='touch'||e.pointerType==='pen'){swipeStartX.current=e.clientX;swipeStartY.current=e.clientY}}}
      onPointerUp={(e)=>{
        e.stopPropagation();
        if(e.pointerType==='touch'||e.pointerType==='pen'){
          const sx=swipeStartX.current, sy=swipeStartY.current;
          swipeStartX.current=null; swipeStartY.current=null;
          if(sx===null||sy===null){setFlipped(v=>!v);return}
          const dx=e.clientX-sx, dy=e.clientY-sy;
          if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.2){return}
          if(Math.abs(dx)<12&&Math.abs(dy)<12)setFlipped(v=>!v);
        }
      }}
      onClick={(e)=>{e.stopPropagation();if(window.matchMedia('(hover:hover) and (pointer:fine)').matches)setFlipped(v=>!v)}}
      onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setFlipped(v=>!v)}}}
      aria-label={`${flipped?'Show photo of':'Show experience for'} ${t.name}`}
      aria-expanded={flipped}
    >
      <span className="trainerFlipInner">
        <span className="trainerFace trainerFront">
          <span className="trainerPhoto" style={{backgroundImage:`linear-gradient(180deg,transparent 38%,rgba(0,0,0,.92) 100%),url(${t.img})`}}>
            <span className="trainerNo">0{i+1}</span>
            <span className="trainerTap">
              <span className="trainerDesktopHint">HOVER FOR EXPERIENCE ↗</span>
              <span className="trainerMobileHint">TAP FOR DETAILS ↗</span>
            </span>
            <span className="trainerOverlay"><small>{t.role}</small><strong>{t.name}</strong></span>
          </span>
        </span>

        <span className="trainerFace trainerBack">
          <span className="trainerBackTop">
            <span className="trainerMiniPhoto" style={{backgroundImage:`url(${t.img})`}}/>
            <span><small>{t.role}</small><strong>{t.name}</strong></span>
          </span>
          <span className="trainerYears"><b><Counter to={t.years} suffix="+"/></b><em>{tr(useLanguage(),'YEARS OF EXPERIENCE','سنوات من الخبرة')}</em></span>
          <span className="trainerBackLine"/>
          <span className="trainerSpecLabel">{tr(useLanguage(),"SPECIALTIES","التخصصات")}</span>
          <span className="trainerSpecialty">{t.specialty}</span>
          <span className="trainerSpecLabel">{tr(useLanguage(),"LANGUAGES","اللغات")}</span>
          <span className="trainerLanguages">{t.lang}</span>
          <span className="trainerBackHint">
            <span className="trainerDesktopHint">{tr(useLanguage(),"MOVE AWAY TO RETURN ↩","ابتعد للعودة ↩")}</span>
            <span className="trainerMobileHint">{tr(useLanguage(),"TAP PHOTO TO CLOSE ↑","اضغط على الصورة للإغلاق ↑")}</span>
          </span>
        </span>
      </span>
    </button>

    <div className="trainerMobileDetails">
      <div className="trainerMobileTop">
        <div><small>{t.role}</small><strong>{t.name}</strong></div>
        <div className="trainerMobileYears"><b>{t.years}+</b><span>{tr(useLanguage(),"YEARS","سنوات")}<br/>{tr(useLanguage(),"EXPERIENCE","خبرة")}</span></div>
      </div>
      <div className="trainerMobileInfo">
        <div><small>{tr(useLanguage(),"SPECIALTIES","التخصصات")}</small><b>{t.specialty}</b></div>
        <div><small>{tr(useLanguage(),"LANGUAGES","اللغات")}</small><b>{useLanguage()==="ar"?"العربية • الإنجليزية":t.lang}</b></div>
      </div>
    </div>

    <a className="trainerBook" href="https://wa.me/971567470886" target="_blank" rel="noreferrer">
      {tr(useLanguage(),"BOOK TRAINER","احجز مع المدرب")} <ArrowUpRight/>
    </a>
  </motion.article>
}
function Trainers(){const lang=useLanguage();const trainers=[
  {name:'ADAM R.',role:'STRENGTH & CONDITIONING',years:8,specialty:'Strength • Performance • Mobility',lang:'English • Arabic',img:'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=85'},
  {name:'MAYA K.',role:'HIIT & FUNCTIONAL',years:6,specialty:'HIIT • Fat Loss • Conditioning',lang:'English • Arabic',img:'https://images.unsplash.com/photo-1609899537878-88d5ba429bdb?auto=format&fit=crop&w=1000&q=85'},
  {name:'OMAR S.',role:'BOXING COACH',years:10,specialty:'Boxing • Cardio • Technique',lang:'Arabic • English',img:'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1000&q=85'},
  {name:'LINA M.',role:'MOBILITY & WELLNESS',years:7,specialty:'Mobility • Recovery • Core',lang:'English • Arabic',img:'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=1000&q=85'}
];return <section id="trainers" className="trainers"><div className="trainerHead"><div><div className="sectionTag">{tr(lang,"04 — COACHES","04 — المدربون")}</div><h2>{tr(lang,"MEET YOUR","تعرّف على")}<br/><i>{tr(lang,"COACH.","مدربك.")}</i></h2></div><p>{tr(lang,"Hover over a coach to reveal experience; move away to return to the photo.","مرّر المؤشر فوق المدرب لعرض الخبرة، وابتعد للعودة إلى الصورة.")}</p></div><div className="trainerTrack">{trainers.map((t,i)=><TrainerCard key={t.name} t={t} i={i}/>)}</div><div className="trainerSwipe">{tr(lang,"← SWIPE TO VIEW COACHES →","← اسحب لعرض المدربين →")}</div></section>}
function Membership(){const lang=useLanguage();const plans=[
 {en:'STARTER',ar:'البداية',months:1},
 {en:'PERFORMANCE',ar:'الأداء',months:6},
 {en:'COMMITTED',ar:'الالتزام',months:12}
];return <section id="membership" className="membership"><div className="sectionTag">{tr(lang,"05 — MEMBERSHIP","05 — العضوية")}</div><div className="memberTop"><h2>{tr(lang,"COMMIT TO","التزم من أجل")}<br/><i>{tr(lang,"YOURSELF.","نفسك.")}</i></h2><div className="toggle"><button className="on">{tr(lang,"MONTHLY","شهري")}</button><button>{tr(lang,"ANNUAL","سنوي")}</button></div></div><div className="plans">{plans.map((x,i)=><div key={x.en} className={`plan ${i===1?'featured':''}`}>{i===1&&<div className="badge">{tr(lang,"MOST POPULAR","الأكثر طلباً")}</div>}<small>{tr(lang,x.en,x.ar)}</small><h3>{lang==='ar'?`${x.months} ${x.months===1?'شهر':'أشهر'}`:`${x.months} ${x.months===1?'MONTH':'MONTHS'}`}</h3><p>{tr(lang,"Premium club access designed around your training rhythm.","دخول متميز للنادي مصمم ليناسب إيقاع تدريبك وأهدافك.")}</p><ul><li>{tr(lang,"Gym access","دخول النادي")}</li><li>{tr(lang,"Group classes","الحصص الجماعية")}</li><li>{tr(lang,"Club facilities","مرافق النادي")}</li></ul><button>{i===1?tr(lang,'JOIN NOW','انضم الآن'):tr(lang,'ENQUIRE','استفسر')} <ArrowUpRight/></button></div>)}</div></section>}
function Reviews(){const lang=useLanguage();return <section className="reviews"><div><div className="sectionTag">{tr(lang,"06 — COMMUNITY","06 — المجتمع")}</div><h2>{tr(lang,"REAL PEOPLE.","أشخاص حقيقيون.")}<br/><i>{tr(lang,"REAL ENERGY.","طاقة حقيقية.")}</i></h2></div><div className="reviewCard"><div className="stars">★★★★★</div><blockquote>{tr(lang,"“A premium training environment should feel motivating before the workout even starts.”","«بيئة التدريب المتميزة يجب أن تمنحك الدافع حتى قبل أن يبدأ التمرين.»")}</blockquote><small>{tr(lang,"Demo review — replace with a verified customer review.","مراجعة تجريبية — تُستبدل لاحقاً بمراجعة عميل موثقة.")}</small></div><div className="reviewScore"><strong>4.9</strong><span>★★★★★</span><small>{tr(lang,"REVIEW DISPLAY","تقييم تجريبي")}</small></div></section>}
function Footer(){const lang=useLanguage();return <footer id="clubs"><div className="footerLogo"><img src="/fitness-time-logo.webp" alt="Fitness Time"/><p>{tr(lang,"Train harder. Recover smarter. Live stronger.","تدرّب بقوة. تعافَ بذكاء. عش أقوى.")}</p></div><div><b>{tr(lang,"EXPLORE","استكشف")}</b><a>{tr(lang,"Classes","الحصص")}</a><a>{tr(lang,"Personal Training","التدريب الشخصي")}</a><a>{tr(lang,"Membership","العضوية")}</a><a>{tr(lang,"Locations","الفروع")}</a></div><div><b>{tr(lang,"VISIT","تواصل")}</b><a><MapPin size={15}/> {tr(lang,"UAE Clubs","فروع الإمارات")}</a><a>{tr(lang,"Contact","اتصل بنا")}</a><a>{tr(lang,"Careers","الوظائف")}</a></div><div className="footerCta"><small>{tr(lang,"READY?","مستعد؟")}</small><h3>{tr(lang,"MAKE","ابدأ")}<br/>{tr(lang,"YOUR MOVE.","خطوتك.")}</h3><button>{tr(lang,"JOIN FITNESS TIME","انضم إلى فتنس تايم")} <ArrowUpRight/></button></div></footer>}
export default function Page(){
  const [offer,setOffer]=useState(false);
  const [mode,setMode]=useState<ThemeMode>('dark');
  const [lang,setLang]=useState<Language>('en');
  const [accent,setAccent]=useState<Accent>('red');
  const [loading,setLoading]=useState(true);
  const loaderTimer=useRef<number|undefined>(undefined);
  const triggerLoader=()=>{setLoading(true);if(loaderTimer.current)clearTimeout(loaderTimer.current);loaderTimer.current=window.setTimeout(()=>setLoading(false),900)};
  useEffect(()=>{loaderTimer.current=window.setTimeout(()=>setLoading(false),1650);const t=window.setTimeout(()=>setOffer(true),7000);return()=>{clearTimeout(t);if(loaderTimer.current)clearTimeout(loaderTimer.current)}},[]);
  const clickCapture=(e:MouseEvent<HTMLElement>)=>{
    if ((e.target as HTMLElement)?.closest?.('.trainerCard')) return;const target=e.target as HTMLElement;const hit=target.closest('a,button');if(!hit)return;if(hit.closest('.offerBack'))return;triggerLoader()};
  return <LanguageContext.Provider value={lang}><main lang={lang} dir={lang==='ar'?'rtl':'ltr'} className={`site ${mode} accent-${accent} ${lang==='ar'?'rtl':''}`} onClickCapture={clickCapture}>
    <Loader active={loading}/><Header mode={mode} setMode={setMode} accent={accent} setAccent={setAccent} triggerLoader={triggerLoader} lang={lang} setLang={setLang}/><SocialRail/><PaymentWidget/><FloatActions triggerLoader={triggerLoader}/><Hero/>
    <div className="marquee"><div>{tr(lang,"STRENGTH ◆ BOXING ◆ CYCLING ◆ RECOVERY ◆ SWIMMING ◆ PERSONAL TRAINING ◆ HIIT ◆ STRENGTH ◆ BOXING ◆ CYCLING ◆ RECOVERY ◆","القوة ◆ الملاكمة ◆ الدراجات ◆ التعافي ◆ السباحة ◆ التدريب الشخصي ◆ HIIT ◆ القوة ◆ الملاكمة ◆ الدراجات ◆ التعافي ◆")}</div></div>
    <Stats/><Programs/><Schedule/><Trainers/><Membership/><Reviews/><Footer/>{offer&&<Offer close={()=>setOffer(false)}/>}
  </main></LanguageContext.Provider>;
}
