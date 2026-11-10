/* Reuse the existing Back operation. No answer storage, network or tracking. */
(() => {
 const root=document.querySelector('[data-lp-scenario-chat="1"]');
 if(!root)return;
 const stage=root.querySelector('#abc-stage'),back=root.querySelector('[data-lp-chat-action="back"]');
 let navigating=false;
 root.addEventListener('click',event=>{
  const button=event.target instanceof Element?event.target.closest('[data-lp-chat-rechoose]'):null;
  if(!button||!root.contains(button)||navigating||stage.getAttribute('aria-busy')==='true')return;
  event.preventDefault();navigating=true;button.disabled=true;root.dataset.choiceNavigation='working';
  const target=button.dataset.lpChatRechoose;
  let attempts=0,observer,timer;
  const finish=status=>{navigating=false;button.disabled=false;observer.disconnect();clearTimeout(timer);root.dataset.choiceNavigation=status;};
  const advance=()=>{
   if(stage.getAttribute('aria-busy')==='true')return;
   const question=root.querySelector('[data-lp-chat-step="'+target+'"]'),panel=question?.querySelector('[data-lp-chat-unanswered="'+target+'"]');
   if(question&&!question.hidden&&panel&&!panel.hidden){finish('done');return;}
   if(!back||back.disabled||back.hidden||attempts++>=20){finish('unavailable');return;}
   back.click();
  };
  observer=new MutationObserver(advance);
  observer.observe(root,{subtree:true,attributes:true,attributeFilter:['hidden','aria-busy','disabled']});
  timer=setTimeout(()=>finish('timeout'),6000);
  advance();
 });
})();
