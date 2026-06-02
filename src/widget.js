import{UIController}from'./ui.js';import{ChatController}from'./chat.js';import{sendMessage}from'./api.js';
(function(){'use strict';if(window.__UNI_CHAT_LOADED__)return;window.__UNI_CHAT_LOADED__=true;
const cfg=window.CHATBOT_CONFIG||{};
const endpoint=(typeof cfg.endpoint==='string'&&cfg.endpoint.trim())?cfg.endpoint.trim():'';
const title=(typeof cfg.title==='string'&&cfg.title.trim())?cfg.title.trim():'AzM\u0130U S\u00fcni \u0130ntellekt \u018fsasl\u0131 D\u0259st\u0259k';
const offlineMessage=(typeof cfg.offlineMessage==='string'&&cfg.offlineMessage.trim())?cfg.offlineMessage.trim():'';
if(!endpoint)console.warn('[AZUAC] endpoint not set.');
function init(){const ui=new UIController(title);ui.mount();new ChatController(ui,sendMessage,endpoint,offlineMessage).init();}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init,{once:true});}else{init();}
})();
