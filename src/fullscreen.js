export class SceneFullscreen{
  constructor(element,button,labels){
    this.element=element;this.button=button;this.labels=labels;this.previousFocus=null;this.scroll=0;
    button.addEventListener('click',()=>this.toggle());
    document.addEventListener('fullscreenchange',()=>this.sync());
    document.addEventListener('keydown',e=>{
      if(!this.active)return;
      if(e.key==='Escape'){e.preventDefault();void this.exit();}
      if(e.key==='Tab'&&!document.fullscreenElement){
        const items=[...element.querySelectorAll('button,select,a[href],input,summary')].filter(el=>!el.disabled&&el.getClientRects().length);
        const first=items[0],last=items.at(-1);if(!first)return;
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    });
    this.sync();
  }
  get active(){return this.element.classList.contains('scene-fullscreen');}
  sync(){
    if(this.native&&!document.fullscreenElement){this.native=false;this.restore();}
    const label=this.active?this.labels().exitFullscreen:this.labels().enterFullscreen;
    this.button.textContent=label;this.button.setAttribute('aria-label',label);this.button.setAttribute('aria-pressed',String(this.active));
  }
  async toggle(){if(this.active){await this.exit();return;}this.previousFocus=document.activeElement;this.scroll=window.scrollY;this.element.classList.add('scene-fullscreen');document.body.classList.add('fullscreen-open');this.sync();
    if(this.element.requestFullscreen&&document.fullscreenEnabled){try{await this.element.requestFullscreen();this.native=!!document.fullscreenElement;}catch{/* The same keyboard-accessible expanded view remains usable. */}}
    this.button.focus();
  }
  restore(){this.element.classList.remove('scene-fullscreen');document.body.classList.remove('fullscreen-open');this.sync();window.scrollTo(0,this.scroll);if(this.previousFocus?.isConnected)this.previousFocus.focus();}
  async exit(){if(document.fullscreenElement===this.element){try{await document.exitFullscreen();}catch{}}
    this.native=false;this.restore();
  }
}
