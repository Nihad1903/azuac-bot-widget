const SK='uni-chat-history',MH=200;
export const OFFLINE_MESSAGE='S\u00fcni intellekt \u0259sasl\u0131 d\u0259st\u0259k hal-haz\u0131rda \u0259l\u00e7atan deyil. Sistem \u00fcz\u0259rind\u0259 texniki i\u015fl\u0259r aparilir. Z\u0259hm\u0259t olmasa, bir qad\u0259r sonra yenid\u0259n c\u0259hd edin.';
export function loadHistory(){try{const r=localStorage.getItem(SK);if(!r)return[];const p=JSON.parse(r);return Array.isArray(p)?p.slice(-MH):[];}catch(_){return[];}}
export function saveHistory(h){try{localStorage.setItem(SK,JSON.stringify(h.slice(-MH)));}catch(_){}}
export function clearHistory(){try{localStorage.removeItem(SK);}catch(_){}}
export function createMessage(role,text,kind){return{role,text,timestamp:new Date().toISOString(),...(kind?{kind}:{})};}
export class ChatController{
  constructor(ui,apiFn,endpoint,offlineMessage){this._ui=ui;this._apiFn=apiFn;this._endpoint=endpoint;this._offline=offlineMessage||OFFLINE_MESSAGE;this._history=[];this._isBusy=false;this._isOpen=false;}
  init(){this._history=loadHistory();this._restoreHistory();this._bindEvents();}
  _restoreHistory(){for(const m of this._history){const d=new Date(m.timestamp);const kind=m.kind||(m.isError?'error':false);this._ui.appendMessage(m.role==='user'?this._ui._createUserEl(m.text,d):this._ui._createBotEl(m.text,d,kind));}}
  _bindEvents(){const{launcher,input,sendBtn,clearBtn}=this._ui;launcher.addEventListener('click',()=>this._toggleOpen());document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&this._isOpen)this._close();});input.addEventListener('input',()=>{this._ui.resizeInput();sendBtn.disabled=input.value.trim()===''||this._isBusy;});input.addEventListener('keydown',(e)=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();if(!sendBtn.disabled)this._sendMessage();}});sendBtn.addEventListener('click',()=>{if(!sendBtn.disabled)this._sendMessage();});clearBtn.addEventListener('click',()=>{this._history=[];clearHistory();this._ui.clearMessages();});}
  _toggleOpen(){this._isOpen?this._close():this._open();}
  _open(){this._isOpen=true;this._ui.setOpen(true);}
  _close(){this._isOpen=false;this._ui.setOpen(false);}
  async _sendMessage(){
    const text=this._ui.input.value.trim();if(!text||this._isBusy)return;
    this._ui.input.value='';this._ui.resizeInput();this._ui.setInputEnabled(false);this._isBusy=true;
    const um=createMessage('user',text);this._history.push(um);this._ui.appendMessage(this._ui._createUserEl(text,new Date(um.timestamp)));
    this._ui.showTypingIndicator();
    try{const a=await this._apiFn(this._endpoint,text);this._ui.removeTypingIndicator();const bm=createMessage('bot',a);this._history.push(bm);this._ui.appendMessage(this._ui._createBotEl(a,new Date(bm.timestamp),false));saveHistory(this._history);}
    catch(err){this._ui.removeTypingIndicator();const nm=createMessage('bot',this._offline,'notice');this._history.push(nm);this._ui.appendMessage(this._ui._createBotEl(nm.text,new Date(nm.timestamp),'notice'));saveHistory(this._history.filter(m=>m.kind!=='notice'));}
    finally{this._isBusy=false;this._ui.setInputEnabled(true);this._ui.input.focus();this._ui.sendBtn.disabled=this._ui.input.value.trim()==='';}
  }
}
