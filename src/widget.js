import{UIController}from'./ui.js';import{ChatController}from'./chat.js';import{sendMessage}from'./api.js';
(function(){'use strict';if(window.__UNI_CHAT_LOADED__)return;window.__UNI_CHAT_LOADED__=true;
const cfg=window.CHATBOT_CONFIG||{};
const endpoint=(typeof cfg.endpoint==='string'&&cfg.endpoint.trim())?cfg.endpoint.trim():'';
const title=(typeof cfg.title==='string'&&cfg.title.trim())?cfg.title.trim():'Chat Assistant';
if(!endpoint)console.warn('[AZUAC] endpoint not set.');
function init(){const ui=new UIController(title);ui.mount();new ChatController(ui,sendMessage,endpoint).init();}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init,{once:true});}else{init();}
})();
