import {respond, newSession, quickPrompts} from './engine.mjs';
const $ = id=>document.getElementById(id);
let session=newSession();let busy=false;let generation=0;
const messages=$('messages'),composer=$('composer'),input=$('messageInput'),send=$('sendBtn');
const safeText=(tag,cls,text)=>{const el=document.createElement(tag);el.className=cls;el.textContent=text;return el};
function addBubble(who,body){
  const item=safeText('article',`message ${who}`, '');
  const avatar=safeText('div','avatar',who==='bot'?'✦':'Y');
  avatar.setAttribute('aria-hidden','true');
  const content=safeText('div','bubble-group','');
  content.append(safeText('span','sender',who==='bot'?'RuleFlow':'You'));
  content.append(safeText('p','bubble',body));
  content.append(safeText('small','time',new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})));
  item.append(avatar,content);messages.append(item);messages.scrollTop=messages.scrollHeight;
  return item;
}
function autoSize(){input.style.height='auto';input.style.height=Math.min(140,input.scrollHeight)+'px'}
function sendMessage(text){
  const msg=String(text).trim();if(!msg||busy)return;
  busy=true;send.disabled=true;input.disabled=true;
  addBubble('user',msg);input.value='';autoSize();
  const typing=addBubble('bot','Typing…');typing.classList.add('typing');
  const response=respond(msg,session);const thisGeneration=generation;
  setTimeout(()=>{if(thisGeneration!==generation)return;typing.remove();addBubble('bot',response.reply);busy=false;send.disabled=false;input.disabled=false;input.focus();$('sessionCount').textContent=String(session.exchanges);},210);
}
composer.addEventListener('submit',e=>{e.preventDefault();sendMessage(input.value)});
input.addEventListener('input',autoSize);
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage(input.value)}});
function makePrompts(){
  for(const prompt of quickPrompts){
    const b=safeText('button','quick-prompt',prompt);b.type='button';
    b.addEventListener('click',()=>sendMessage(prompt));$('promptList').append(b);
  }
}
$('resetBtn').addEventListener('click',()=>{
  generation++;session=newSession();busy=false;messages.replaceChildren();input.disabled=false;send.disabled=false;input.value='';autoSize();$('sessionCount').textContent='0';
  addBubble('bot',"Welcome to RuleFlow! I'm a transparent, rule-based study assistant. Choose a prompt or type a message to get started.");input.focus();
});
makePrompts();addBubble('bot',"Welcome to RuleFlow! I'm a transparent, rule-based study assistant. Choose a prompt or type a message to get started.");
