import cssText from './styles.css?raw';
const IC = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
const IX = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const IS = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
function fmt(d){return d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
function esc(t){const d=document.createElement('div');d.textContent=t;return d.innerHTML}
function tmpl(title){return'<style>'+cssText+'</style>'+
  '<button class="uni-chat-launcher" id="uni-chat-launcher" aria-label="Open chat" aria-expanded="false">'+
    '<span class="uni-chat-icon-chat">'+IC+'</span>'+
    '<span class="uni-chat-icon-close">'+IX+'</span>'+
  '</button>'+
  '<div class="uni-chat-window uni-chat-hidden" id="uni-chat-window" role="dialog" aria-modal="true">'+
    '<div class="uni-chat-header">'+
      '<div class="uni-chat-header-info">'+
        '<div class="uni-chat-header-title">'+esc(title)+'</div>'+
        '<div class="uni-chat-header-status"><span class="uni-chat-status-dot"></span>Onlayn d\u0259st\u0259k</div>'+
      '</div>'+
      '<button class="uni-chat-clear-btn" id="uni-chat-clear-btn">T\u0259mizl\u0259</button>'+
    '</div>'+
    '<div class="uni-chat-messages" id="uni-chat-messages" role="log" aria-live="polite">'+
      '<div class="uni-chat-empty" id="uni-chat-empty">'+
        '<h3>Siz\u0259 nec\u0259 k\u00f6m\u0259k ed\u0259 bil\u0259r\u0259m?</h3>'+
        '<p>Sual\u0131n\u0131z\u0131 yaz\u0131n \u2014 universitet haqq\u0131nda m\u0259lumat \u00fc\u00e7\u00fcn buraday\u0131q.</p>'+
      '</div>'+
    '</div>'+
    '<div class="uni-chat-footer">'+
      '<div class="uni-chat-input-row">'+
        '<textarea class="uni-chat-input" id="uni-chat-input" placeholder="Mesaj\u0131n\u0131z\u0131 yaz\u0131n\u2026" rows="1"></textarea>'+
        '<button class="uni-chat-send-btn" id="uni-chat-send-btn" disabled>'+IS+'</button>'+
      '</div>'+
      '<p class="uni-chat-footer-note">AzM\u0130U \u2014 R\u0259smi d\u0259st\u0259k xidm\u0259ti</p>'+
    '</div>'+
  '</div>';}
export function createUserMessageEl(t,ts=new Date()){
  const w=document.createElement('div');w.className='uni-chat-msg uni-chat-msg-user';
  w.innerHTML='<div class="uni-chat-msg-row"><div class="uni-chat-msg-bubble">'+esc(t)+'</div></div><time class="uni-chat-msg-time" datetime="'+ts.toISOString()+'">'+fmt(ts)+'</time>';
  return w;}
export function createBotMessageEl(t,ts=new Date(),kind=false){
  const k=kind===true?'error':(kind||'normal');
  const cls=k==='error'?' uni-chat-msg-error':(k==='notice'?' uni-chat-msg-notice':'');
  const w=document.createElement('div');w.className='uni-chat-msg uni-chat-msg-bot'+cls;
  w.innerHTML='<div class="uni-chat-msg-row"><div class="uni-chat-msg-bubble">'+esc(t)+'</div></div><time class="uni-chat-msg-time" datetime="'+ts.toISOString()+'">'+fmt(ts)+'</time>';
  return w;}
export function createTypingIndicatorEl(){
  const el=document.createElement('div');el.className='uni-chat-typing';el.id='uni-chat-typing';
  el.innerHTML='<div class="uni-chat-typing-dots"><span></span><span></span><span></span></div>';
  return el;}
export class UIController{
  constructor(title){this._title=title||'Chat Assistant';this.launcher=null;this.window=null;this.messages=null;this.input=null;this.sendBtn=null;this.clearBtn=null;this.emptyState=null;}
  mount(){const h=document.createElement('div');h.id='uni-chat-root';const s=h.attachShadow({mode:'closed'});s.innerHTML=tmpl(this._title);document.body.appendChild(h);this.launcher=s.getElementById('uni-chat-launcher');this.window=s.getElementById('uni-chat-window');this.messages=s.getElementById('uni-chat-messages');this.input=s.getElementById('uni-chat-input');this.sendBtn=s.getElementById('uni-chat-send-btn');this.clearBtn=s.getElementById('uni-chat-clear-btn');this.emptyState=s.getElementById('uni-chat-empty');}
  _createUserEl(t,d){return createUserMessageEl(t,d);}
  _createBotEl(t,d,e){return createBotMessageEl(t,d,e);}
  appendMessage(el){if(this.emptyState&&this.emptyState.parentNode===this.messages)this.emptyState.remove();this.messages.appendChild(el);this.scrollToBottom();}
  removeTypingIndicator(){const e=this.messages.querySelector('#uni-chat-typing');if(e)e.remove();}
  showTypingIndicator(){this.removeTypingIndicator();this.messages.appendChild(createTypingIndicatorEl());this.scrollToBottom();}
  scrollToBottom(){this.messages.scrollTop=this.messages.scrollHeight;}
  clearMessages(){this.messages.innerHTML='';this.messages.appendChild(this.emptyState);}
  resizeInput(){const el=this.input;el.style.height='auto';el.style.height=el.scrollHeight+'px';}
  setOpen(open){if(open){this.window.classList.remove('uni-chat-hidden');this.window.classList.add('uni-chat-visible');this.launcher.classList.add('uni-chat-open');this.launcher.setAttribute('aria-expanded','true');this.launcher.setAttribute('aria-label','Close chat');requestAnimationFrame(()=>this.input.focus());}else{this.window.classList.remove('uni-chat-visible');this.window.classList.add('uni-chat-hidden');this.launcher.classList.remove('uni-chat-open');this.launcher.setAttribute('aria-expanded','false');this.launcher.setAttribute('aria-label','Open chat');}}
  setInputEnabled(en){this.input.disabled=!en;this.sendBtn.disabled=!en;}
}
