'use client';
import {createContext,useContext,useEffect,useRef,useState} from 'react';
import type {MouseEvent} from 'react';
import {motion,useScroll,useTransform} from 'framer-motion';
import {ArrowUpRight,ChevronRight,Dumbbell,MessageCircle,Phone,MapPin,Menu,Moon,Palette,Play,Sun,X,Zap} from 'lucide-react';

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
    <img className="nexoraLoaderLogo" src="/nexora-gym-logo.png" alt="NEXORA GYM — Stronger Together" width={2048} height={682}/>
    <div className="nexoraLoaderProgress" aria-hidden="true"><i/></div>
    <p>STRONGER TOGETHER</p><small>PREPARING YOUR TRAINING FLOOR</small>
  </motion.div>;
}
function Header({mode,setMode,lang,setLang}:{mode:ThemeMode,setMode:(m:ThemeMode)=>void,lang:Language,setLang:(l:Language)=>void}){
 const [menu,setMenu]=useState(false);
 const links=[['membership','Memberships','العضويات'],['experience','Training','التدريب'],['trainers','Trainers','المدربون'],['clubs','Visit us','زرنا']];
 return <header className="header nexoraHeader"><a href="#home" className="logoWrap" aria-label="NEXORA GYM home"><img src="/nexora-gym-logo.png" alt="NEXORA GYM" width={2048} height={682}/></a><nav aria-label={tr(lang,'Main navigation','التنقل الرئيسي')}>{links.map(([id,en,ar])=><a key={id} href={'#'+id}>{tr(lang,en,ar)}</a>)}</nav><div className="headActions"><button className="iconBtn themeBtn" aria-pressed={mode==='light'} onClick={()=>setMode(mode==='dark'?'light':'dark')} aria-label={tr(lang,'Switch colour mode','تغيير المظهر')}>{mode==='dark'?<Sun/>:<Moon/>}</button><button className="utilityLang" onClick={()=>setLang(lang==='en'?'ar':'en')}>{lang==='en'?'العربية':'EN'}</button><a className="pill primary" href="#enquiry">{tr(lang,'BOOK A VISIT','احجز زيارة')}<ArrowUpRight size={16}/></a><button className="mobileMenuBtn" aria-expanded={menu} aria-controls="gym-mobile-nav" aria-label={tr(lang,'Toggle navigation','فتح القائمة')} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div>{menu&&<div id="gym-mobile-nav" className="nexoraMobileNav">{links.map(([id,en,ar])=><a key={id} href={'#'+id} onClick={()=>setMenu(false)}>{tr(lang,en,ar)}</a>)}<a href="#enquiry" onClick={()=>setMenu(false)}>{tr(lang,'Book a visit','احجز زيارة')}</a></div>}</header>;
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
function Hero(){const lang=useLanguage();return <section id="home" className="hero nexoraHero"><div className="heroBg"/><div className="noise"/><div className="heroGrid"><div><div className="eyebrow"><span/>{tr(lang,'NEXORA GYM · STRONGER TOGETHER','نكسورا جيم · أقوى معاً')}</div><h1>{tr(lang,'BUILD YOUR','ابنِ')}<br/><span>{tr(lang,'STRONGER','قوتك')}</span><br/>{tr(lang,'EVERY DAY.','كل يوم.')}</h1><p>{tr(lang,'Find your rhythm, explore your training options and take the first step towards your next chapter.','اكتشف أسلوب تدريبك وخياراتك الرياضية، وابدأ خطوتك الأولى نحو مرحلة جديدة.')}</p><div className="heroBtns"><a className="pill primary" href="#membership">{tr(lang,'EXPLORE MEMBERSHIPS','اكتشف العضويات')}<ArrowUpRight/></a><a className="pill nexoraOutline" href="#enquiry">{tr(lang,'BOOK A VISIT','احجز زيارة')}<ArrowUpRight/></a></div><div className="heroNotes"><span>{tr(lang,'Your goals. Your pace.','أهدافك. إيقاعك.')}</span><span>{tr(lang,'English & Arabic support','دعم بالعربية والإنجليزية')}</span></div></div><aside className="nexoraHeroCard"><small>{tr(lang,'YOUR NEXT STEP','خطوتك التالية')}</small><h2>{tr(lang,'Start with a conversation.','ابدأ بالتواصل.')}</h2><p>{tr(lang,'Ask about plans, training and arranging your first visit.','استفسر عن العضويات والتدريب وترتيب زيارتك الأولى.')}</p><a href="#enquiry">{tr(lang,'LET’S FIND YOUR FIT','لنجد ما يناسبك')}<ArrowUpRight/></a></aside></div></section>}
function Stats(){const lang=useLanguage();return <section className="stats"><div className="sectionTag">{tr(lang,"01 — IMPACT","01 — الأثر")}</div><div className="statGrid">{statItems.map((x,i)=><motion.div className="stat" key={x.en} initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{amount:.35}} transition={{delay:i*.08}}><strong><Counter to={x.n} suffix={x.s}/></strong><span>{tr(lang,x.en,x.ar)}</span><div className="meter"><motion.i initial={{width:0}} whileInView={{width:`${66+i*8}%`}} viewport={{amount:.3}} transition={{duration:1,delay:.2+i*.1}}/></div></motion.div>)}</div><div className="barbell"><span/><b><Dumbbell/></b><span/></div></section>}
function Programs(){const lang=useLanguage();const [active,setActive]=useState(0);return <section id="experience" className="programSec"><div className="sectionHead"><div><div className="sectionTag">{tr(lang,"02 — CHOOSE YOUR TRAINING","02 — اختر تدريبك")}</div><h2>{tr(lang,"FIND YOUR","اكتشف")}<br/><i>{tr(lang,"INTENSITY.","شدّتك.")}</i></h2></div><p>{tr(lang,"Training experiences built around performance, technique and the club environment.","تجارب تدريبية مصممة حول الأداء والتقنية وبيئة النادي المتميزة.")}</p></div><div className="programs">{programs.map((x,i)=><article onMouseEnter={()=>setActive(i)} onClick={()=>setActive(i)} className={active===i?'active':''} key={x.en}><div className={`programImg p${i}`}/><div className="programShade"/><span>0{i+1}</span><h3>{tr(lang,x.en,x.ar)}</h3><div className="programInfo"><p>{tr(lang,x.enDesc,x.arDesc)}</p><small>{x.time} {tr(lang,"MIN","دقيقة")} • {tr(lang,x.levelEn,x.levelAr)} {tr(lang,"INTENSITY","الشدة")}</small><a href="#enquiry">{tr(lang,"ASK ABOUT TRAINING","استفسر عن التدريب")} <ArrowUpRight/></a></div></article>)}</div></section>}
function Schedule(){const lang=useLanguage();const days=lang==='ar'?['الإثنين 15','الثلاثاء 16','الأربعاء 17','الخميس 18','الجمعة 19']:['MON 15','TUE 16','WED 17','THU 18','FRI 19'];return <section id="classes" className="schedule"><div className="scheduleTitle"><div className="sectionTag">{tr(lang,"SAMPLE CLASS TIMETABLE","نموذج جدول الحصص")}</div><h2>{tr(lang,"MAKE TIME.","خصص وقتك.")}<br/><i>{tr(lang,"MAKE IT COUNT.","واجعله مؤثراً.")}</i></h2><p>{tr(lang,"Illustrative timetable. Contact us for current dates and class availability.","جدول توضيحي. تواصل معنا لمعرفة المواعيد والحصص المتاحة.")}</p></div><div className="classList">{classes.map((c,i)=><motion.div key={`${c[0]}-${c[1]}`} whileHover={{x:lang==='ar'?-8:8}} className="classRow"><strong>{c[0]}</strong><div><b>{tr(lang,c[1],c[2])}</b><span>{tr(lang,c[3],c[4])}</span></div><span className="spots">{tr(lang,'CONFIRM TIMES','تأكد من المواعيد')}</span><a href="#enquiry" aria-label={tr(lang,"Enquire about class","استفسر عن الحصة")}><ArrowUpRight/></a></motion.div>)}</div></section>}
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
];return <section id="trainers" className="trainers"><div className="trainerHead"><div><div className="sectionTag">{tr(lang,"04 — COACHES","04 — المدربون")}</div><h2>{tr(lang,"MEET YOUR","تعرّف على")}<br/><i>{tr(lang,"COACH.","مدربك.")}</i></h2></div><p>{tr(lang,"Sample trainer profiles. Contact us to confirm the current coaching team.","نماذج تعريفية للمدربين. تواصل معنا للتأكد من فريق التدريب الحالي.")}</p></div><div className="trainerTrack">{trainers.map((t,i)=><TrainerCard key={t.name} t={t} i={i}/>)}</div><div className="trainerSwipe">{tr(lang,"← SWIPE TO VIEW COACHES →","← اسحب لعرض المدربين →")}</div></section>}
function Membership(){const lang=useLanguage();const plans=[{months:1,en:'STARTER',ar:'البداية',desc:'A shorter commitment to start your routine.',arDesc:'التزام قصير لبدء روتينك الرياضي.'},{months:6,en:'PERFORMANCE',ar:'الأداء',desc:'Build consistency with a longer training journey.',arDesc:'ابنِ الاستمرارية مع رحلة تدريب أطول.'},{months:12,en:'COMMITTED',ar:'الالتزام',desc:'Make training part of your year.',arDesc:'اجعل التدريب جزءاً من عامك.'}];return <section id="membership" className="membership"><div className="sectionTag">{tr(lang,'01 — FIND YOUR MEMBERSHIP','01 — اختر عضويتك')}</div><div className="memberTop"><h2>{tr(lang,'A PLAN FOR','خطة تناسب')}<br/><i>{tr(lang,'YOUR NEXT CHAPTER.','خطوتك القادمة.')}</i></h2><p>{tr(lang,'Demo memberships and prices for presentation purposes. Contact us to confirm actual offers.','عضويات وأسعار تجريبية لأغراض العرض. تواصل معنا لتأكيد العروض الفعلية.')}</p></div><div className="plans">{plans.map((x,i)=><div key={x.months} className={`plan ${i===1?'featured':''}`}><small>{tr(lang,x.en,x.ar)}</small><h3>{x.months} {tr(lang,x.months===1?'MONTH':'MONTHS',x.months===1?'شهر':'أشهر')}</h3><p>{tr(lang,x.desc,x.arDesc)}</p><div className="planPrice">AED {({1:149,6:749,12:1299} as Record<number,number>)[x.months].toLocaleString('en-AE')} <small>{tr(lang,'TOTAL · DEMO PRICE','الإجمالي · سعر تجريبي')}</small></div><p className="planTerms">{tr(lang,'Demo includes gym access and group classes. Actual inclusions, fees and joining terms require confirmation.','يشمل النموذج دخول النادي والحصص الجماعية. تتطلب المزايا والرسوم وشروط الاشتراك الفعلية التأكيد.')}</p><a className="planEnquire" href={'#enquiry'} onClick={()=>window.dispatchEvent(new CustomEvent('gym-plan',{detail:`${x.months}-month membership`}))}>{tr(lang,'ENQUIRE ABOUT THIS PLAN','استفسر عن هذه العضوية')}<ArrowUpRight/></a></div>)}</div></section>}
function Enquiry(){const lang=useLanguage();const [plan,setPlan]=useState('Gym visit');const [prepared,setPrepared]=useState(false);useEffect(()=>{const select=(e:Event)=>{setPlan((e as CustomEvent<string>).detail);setPrepared(false)};window.addEventListener('gym-plan',select);return()=>window.removeEventListener('gym-plan',select)},[]);return <section id="enquiry" className="nexoraEnquiry"><div><div className="sectionTag">{tr(lang,'LET’S GET STARTED','لنبدأ')}</div><h2>{tr(lang,'Your next chapter starts here.','خطوتك القادمة تبدأ هنا.')}</h2><p>{tr(lang,'Tell us what you’re interested in. Continue to WhatsApp to send your enquiry and arrange the details.','أخبرنا بما يهمك، ثم انتقل إلى واتساب لإرسال استفسارك وتنسيق التفاصيل.')}</p><a href="tel:+971567470886">+971 56 747 0886</a></div><form onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);const message=`NEXORA GYM enquiry\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nInterest: ${plan}\nMessage: ${data.get('message')||''}`;window.open('https://wa.me/971567470886?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');setPrepared(true)}}><label>{tr(lang,'Your name','الاسم')}<input name="name" required maxLength={80} autoComplete="name"/></label><label>{tr(lang,'Mobile number','رقم الهاتف')}<input name="phone" type="tel" required pattern="[+0-9() .-]{7,25}" autoComplete="tel" dir="ltr"/></label><label>{tr(lang,'I’m interested in','أرغب في')}<select value={plan} onChange={e=>{setPlan(e.target.value);setPrepared(false)}}><option value="Gym visit">{tr(lang,'Arrange a gym visit','ترتيب زيارة للنادي')}</option>{[1,6,12].map(n=><option key={n} value={`${n}-month membership`}>{n} {tr(lang,'month membership','أشهر عضوية')}</option>)}<option value="Personal training">{tr(lang,'Personal training','تدريب شخصي')}</option></select></label><label>{tr(lang,'Your message (optional)','رسالتك (اختياري)')}<textarea name="message" rows={3} maxLength={1000}/></label><button className="pill primary" type="submit">{tr(lang,'CONTINUE TO WHATSAPP','المتابعة إلى واتساب')}<ArrowUpRight/></button><small>{tr(lang,'Your enquiry is sent only when you press Send in WhatsApp. This does not confirm a booking.','يُرسل الاستفسار عند الضغط على إرسال في واتساب. هذه الخطوة لا تؤكد الحجز.')}</small>{prepared&&<p role="status">{tr(lang,'Your message is ready in WhatsApp. Review it and press Send.','رسالتك جاهزة في واتساب. راجعها واضغط إرسال.')}</p>}</form></section>}
const demoBranches=[
 {id:'ajman',city:'Ajman',cityAr:'عجمان',name:'Al Nuaimiya',nameAr:'النعيمية',address:'Al Nuaimiya, Ajman, UAE',addressAr:'النعيمية، عجمان، الإمارات',lat:25.389,lng:55.447,img:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',hours:'5:00 AM–12:00 midnight',hoursAr:'5 صباحاً–12 منتصف الليل'},
 {id:'sharjah',city:'Sharjah',cityAr:'الشارقة',name:'Al Majaz',nameAr:'المجاز',address:'Al Majaz, Sharjah, UAE',addressAr:'المجاز، الشارقة، الإمارات',lat:25.323,lng:55.386,img:'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=900&q=80',hours:'6:00 AM–11:00 PM',hoursAr:'6 صباحاً–11 مساءً'},
 {id:'dubai',city:'Dubai',cityAr:'دبي',name:'Al Barsha',nameAr:'البرشاء',address:'Al Barsha, Dubai, UAE',addressAr:'البرشاء، دبي، الإمارات',lat:25.108,lng:55.2,img:'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=80',hours:'5:00 AM–12:00 midnight',hoursAr:'5 صباحاً–12 منتصف الليل'}
];
function Location(){
 const lang=useLanguage();const [city,setCity]=useState('all');const [selected,setSelected]=useState('ajman');const [geoStatus,setGeoStatus]=useState('');const [locating,setLocating]=useState(false);const [showInfo,setShowInfo]=useState(true);
 const branch=demoBranches.find(b=>b.id===selected)!;const visible=demoBranches.filter(b=>city==='all'||b.id===city);
 const locate=()=>{if(!navigator.geolocation){setGeoStatus(tr(lang,'Location is not supported. Choose a city.','الموقع غير مدعوم. اختر مدينة.'));return;}setLocating(true);setGeoStatus(tr(lang,'Finding the nearest demo area…','جارٍ البحث عن أقرب منطقة تجريبية…'));navigator.geolocation.getCurrentPosition(position=>{const radians=(n:number)=>n*Math.PI/180;const distance=(b:typeof demoBranches[number])=>{const dLat=radians(b.lat-position.coords.latitude),dLng=radians(b.lng-position.coords.longitude);return Math.sin(dLat/2)**2+Math.cos(radians(position.coords.latitude))*Math.cos(radians(b.lat))*Math.sin(dLng/2)**2};const nearest=[...demoBranches].sort((a,b)=>distance(a)-distance(b))[0];setCity('all');setSelected(nearest.id);setShowInfo(true);setGeoStatus(tr(lang,'Nearest demo area: '+nearest.name,'أقرب منطقة تجريبية: '+nearest.nameAr));setLocating(false)},()=>{setGeoStatus(tr(lang,'Could not access your location. Choose a city instead.','تعذر الوصول إلى موقعك. اختر مدينة.'));setLocating(false)},{enableHighAccuracy:false,timeout:10000,maximumAge:60000})};
 const mapUrl=`https://www.openstreetmap.org/export/embed.html?bbox=${branch.lng-.025},${branch.lat-.018},${branch.lng+.025},${branch.lat+.018}&layer=mapnik&marker=${branch.lat},${branch.lng}`;
 return <section id="clubs" className="branchSection"><div className="branchHeading"><div><div className="sectionTag">{tr(lang,'03 — FIND YOUR NEXORA','03 — اعثر على نكسورا')}</div><h2>{tr(lang,'THREE LOCATIONS.','ثلاثة مواقع.')}<br/><span>{tr(lang,'ONE STRONGER YOU.','نسخة أقوى منك.')}</span></h2></div><p>{tr(lang,'Explore three fictional UAE branches. Photos are illustrative and map pins mark approximate neighbourhoods, not operating gyms.','استكشف ثلاثة فروع افتراضية في الإمارات. الصور توضيحية ودبابيس الخريطة تشير إلى مناطق تقريبية وليست أندية قائمة.')}</p></div><div className="branchFinder"><div className="branchListPanel"><div className="branchFilters"><span className="branchCountry">{tr(lang,'UNITED ARAB EMIRATES','الإمارات العربية المتحدة')}</span><label htmlFor="branch-city">{tr(lang,'Choose your city','اختر مدينتك')}</label><div className="branchFilterRow"><select id="branch-city" value={city} onChange={e=>{const v=e.target.value;setCity(v);setSelected(v==='all'?'ajman':v);setShowInfo(true);setGeoStatus('')}}><option value="all">{tr(lang,'All cities · 3 demo branches','جميع المدن · 3 فروع تجريبية')}</option>{demoBranches.map(b=><option key={b.id} value={b.id}>{tr(lang,b.city,b.cityAr)}</option>)}</select><button onClick={()=>{setCity('all');setSelected('ajman');setShowInfo(true);setGeoStatus('')}}>{tr(lang,'CLEAR','مسح')}</button></div><button className="branchLocate" onClick={locate} disabled={locating}><MapPin size={17}/>{locating?tr(lang,'LOCATING…','جارٍ التحديد…'):tr(lang,'USE CURRENT LOCATION','استخدم موقعي الحالي')}</button><p role="status">{geoStatus}</p><p aria-live="polite">{visible.length} {tr(lang,'demo branches shown','فروع تجريبية معروضة')}</p></div><div className="branchCards">{visible.map(b=><article key={b.id} className={`branchCard ${selected===b.id?'selected':''}`} style={{backgroundImage:`linear-gradient(0deg,rgba(0,0,0,.94),rgba(0,0,0,.25)),url("${b.img}")`}}><span className="branchDemoTag">{tr(lang,'DEMO BRANCH','فرع تجريبي')}</span><button className="branchSelect" onClick={()=>{setSelected(b.id);setShowInfo(true)}} aria-pressed={selected===b.id}><h3>{tr(lang,b.name,b.nameAr)}</h3><span><MapPin size={15}/>{tr(lang,b.address,b.addressAr)}</span></button><p>{tr(lang,'Daily','يومياً')} · {tr(lang,b.hours,b.hoursAr)}</p><div className="branchCardActions"><a href={'https://wa.me/971567470886?text='+encodeURIComponent(`I would like to enquire about the demo NEXORA ${b.name}, ${b.city} branch.`)} target="_blank" rel="noreferrer">{tr(lang,'ENQUIRE','استفسر')}<ArrowUpRight size={14}/></a><button onClick={()=>{setSelected(b.id);setShowInfo(true)}} aria-label={tr(lang,`Show ${b.name} information`,`عرض معلومات ${b.nameAr}`)}>{tr(lang,'GYM INFO','معلومات النادي')}</button></div></article>)}</div></div><div className="branchMapPanel"><div className={`branchMapSummary ${showInfo?'':'collapsed'}`} aria-live="polite"><button className="branchMapClose" onClick={()=>setShowInfo(false)} aria-label={tr(lang,'Close branch details','إغلاق معلومات الفرع')}><X size={18}/></button><small>{tr(lang,'SELECTED DEMO LOCATION','الموقع التجريبي المحدد')}</small><h3>{tr(lang,branch.name,branch.nameAr)}</h3><p>{tr(lang,branch.address,branch.addressAr)}</p><span>{tr(lang,'Daily','يومياً')} · {tr(lang,branch.hours,branch.hoursAr)}</span><a className="branchMapEnquire" href={'https://wa.me/971567470886?text='+encodeURIComponent(`Enquiry about NEXORA demo branch: ${branch.name}, ${branch.city}`)} target="_blank" rel="noreferrer">{tr(lang,'ENQUIRE ABOUT THIS BRANCH','استفسر عن هذا الفرع')}<ArrowUpRight size={14}/></a></div><iframe key={branch.id} title={tr(lang,`Approximate demo area: ${branch.address}`,`المنطقة التجريبية التقريبية: ${branch.addressAr}`)} src={mapUrl} loading="lazy" referrerPolicy="no-referrer"/><div className="branchMapFooter"><span>{tr(lang,'Approximate area · demo only','منطقة تقريبية · للعرض فقط')}</span><a href={`https://www.openstreetmap.org/?mlat=${branch.lat}&mlon=${branch.lng}#map=15/${branch.lat}/${branch.lng}`} target="_blank" rel="noreferrer">{tr(lang,'OPEN MAP','افتح الخريطة')}<ArrowUpRight size={15}/></a></div></div></div></section>;
}
function Reviews(){const lang=useLanguage();return <section className="reviews"><div><div className="sectionTag">{tr(lang,"06 — COMMUNITY","06 — المجتمع")}</div><h2>{tr(lang,"REAL PEOPLE.","أشخاص حقيقيون.")}<br/><i>{tr(lang,"REAL ENERGY.","طاقة حقيقية.")}</i></h2></div><div className="reviewCard"><div className="stars">★★★★★</div><blockquote>{tr(lang,"“A premium training environment should feel motivating before the workout even starts.”","«بيئة التدريب المتميزة يجب أن تمنحك الدافع حتى قبل أن يبدأ التمرين.»")}</blockquote><small>{tr(lang,"Demo review — replace with a verified customer review.","مراجعة تجريبية — تُستبدل لاحقاً بمراجعة عميل موثقة.")}</small></div><div className="reviewScore"><strong>4.9</strong><span>★★★★★</span><small>{tr(lang,"REVIEW DISPLAY","تقييم تجريبي")}</small></div></section>}
function Footer(){const lang=useLanguage();return <footer><div className="footerLogo"><img src="/nexora-gym-logo.png" alt="NEXORA GYM" width={2048} height={682}/><p>{tr(lang,"Train harder. Recover smarter. Live stronger.","تدرّب بقوة. تعافَ بذكاء. عش أقوى.")}</p></div><div><b>{tr(lang,"EXPLORE","استكشف")}</b><a href="#classes">{tr(lang,"Classes","الحصص")}</a><a href="#trainers">{tr(lang,"Personal Training","التدريب الشخصي")}</a><a href="#membership">{tr(lang,"Membership","العضوية")}</a><a href="#clubs">{tr(lang,"Locations","الفروع")}</a></div><div><b>{tr(lang,"VISIT","تواصل")}</b><a href="#clubs"><MapPin size={15}/> {tr(lang,"UAE Clubs","فروع الإمارات")}</a><a href="#enquiry">{tr(lang,"Contact","اتصل بنا")}</a></div><div className="footerCta"><small>{tr(lang,"READY?","مستعد؟")}</small><h3>{tr(lang,"MAKE","ابدأ")}<br/>{tr(lang,"YOUR MOVE.","خطوتك.")}</h3><a className="pill primary" href="#enquiry">{tr(lang,"CONTACT NEXORA GYM","تواصل مع نكسورا جيم")} <ArrowUpRight/></a></div></footer>}
export default function Page(){
 const [mode,setMode]=useState<ThemeMode>('dark');const [lang,setLang]=useState<Language>('en');
 return <LanguageContext.Provider value={lang}><main lang={lang} dir={lang==='ar'?'rtl':'ltr'} className={`site ${mode} accent-gold ${lang==='ar'?'rtl':''}`}><Header mode={mode} setMode={setMode} lang={lang} setLang={setLang}/><Hero/><Membership/><Programs/><Schedule/><Trainers/><Location/><Enquiry/><Footer/><div className="nexoraContactDock" aria-label={tr(lang,'Contact options','خيارات التواصل')}><a className="contactCall" href="tel:+971567470886" aria-label={tr(lang,'Call NEXORA GYM','اتصل بنكسورا جيم')}><Phone aria-hidden="true"/><span className="contactTip">{tr(lang,'Call us','اتصل بنا')}</span></a><a className="contactWhatsApp" href="https://wa.me/971567470886" target="_blank" rel="noreferrer" aria-label={tr(lang,'Message NEXORA GYM on WhatsApp','راسل نكسورا جيم عبر واتساب')}><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.47 0 .11 5.35.1 11.93c0 2.1.55 4.16 1.6 5.98L0 24l6.25-1.64a11.9 11.9 0 0 0 5.8 1.48h.01c6.58 0 11.94-5.35 11.94-11.93 0-3.19-1.24-6.18-3.48-8.43ZM12.06 21.82c-1.78 0-3.53-.48-5.05-1.38l-.36-.21-3.71.97.99-3.62-.23-.37a9.88 9.88 0 0 1-1.51-5.28C2.2 6.47 6.62 2.04 12.07 2.04c2.64 0 5.12 1.03 6.98 2.9a9.8 9.8 0 0 1 2.9 6.98c0 5.45-4.43 9.9-9.89 9.9Zm5.43-7.4c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.18.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.48-1.77-1.65-2.07-.18-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.62-.93-2.22-.24-.58-.49-.5-.68-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.48.71.31 1.27.49 1.7.63.72.23 1.38.2 1.9.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z"/></svg><span className="messageDots" aria-hidden="true"><i/><i/><i/></span><span className="contactTip">{tr(lang,'Message us','راسلنا')}</span></a></div></main></LanguageContext.Provider>;
}
