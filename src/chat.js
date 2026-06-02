const SK='uni-chat-history',MH=200;
export function loadHistory(){try{const r=localStorage.getItem(SK);if(!r)return[];const p=JSON.parse(r);return Array.isArray(p)?p.slice(-MH):[];}catch(_){return[];}}
export function saveHistory(h){try{localStorage.setItem(SK,JSON.stringify(h.slice(-MH)));}catch(_){}}
export function clearHistory(){try{localStorage.removeItem(SK);}catch(_){}}
export function createMessage(role,text,isError=false){return{role,text,timestamp:new Date().toISOString(),...(isError?{isError:true}:{})};}
export class ChatController{
  constructor(ui,apiFn,endpoint){this._ui=ui;this._apiFn=apiFn;this._endpoint=endpoint;this._history=[];this._isBusy=false;this._isOpen=false;}
  init(){this._history=loadHistory();this._restoreHistory();this._bindEvents();}
  _restoreHistory(){for(const m of this._history){const d=new Date(m.timestamp);this._ui.appendMessage(m.role==='user'?this._ui._createUserEl(m.text,d):this._ui._createBotEl(m.text,d,m.isError||false));}}
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
    catch(err){this._ui.removeTypingIndicator();const em=createMessage('bot',err.message||'Something went wrong.',true);this._history.push(em);this._ui.appendMessage(this._ui._createBotEl(em.text,new Date(em.timestamp),true));saveHistory(this._history.filter(m=>!m.isError));}
    finally{this._isBusy=false;this._ui.setInputEnabled(true);this._ui.input.focus();this._ui.sendBtn.disabled=this._ui.input.value.trim()==='';}
  }
}
