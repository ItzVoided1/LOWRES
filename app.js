const state={games:[],category:"ALL",query:""};
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function boot(){
  const res=await fetch("games.json?ts="+Date.now(),{cache:"no-store"});
  const data=await res.json();
  state.games=data.games||[];
  $("#verified").textContent=(data.verifiedCount??state.games.filter(g=>g.playable).length)+" VERIFIED";
  $("#catalog").textContent=state.games.length+" CATALOGED";
  $("#updated").textContent="SYNC "+(data.generatedAt||"LOCAL");
  buildFilters(); render();
}
function buildFilters(){
  const cats=["ALL",...new Set(state.games.map(g=>g.category).filter(Boolean))];
  $("#filters").innerHTML=cats.map(c=>'<button class="chip '+(c==="ALL"?"active":"")+'" data-cat="'+esc(c)+'">'+esc(c)+"</button>").join("");
  $("#filters").onclick=e=>{const b=e.target.closest(".chip");if(!b)return;state.category=b.dataset.cat;document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x===b));render()};
}
function render(){
  const q=state.query.trim().toLowerCase();
  const list=state.games.filter(g=>(state.category==="ALL"||g.category===state.category)&&(!q||[g.title,g.description,g.category,...(g.tags||[])].join(" ").toLowerCase().includes(q)));
  $("#grid").innerHTML=list.map(card).join("");
  $("#empty").classList.toggle("hidden",list.length>0);
}
function card(g){
  const ok=!!g.playable&&!!g.playUrl;
  const badge=ok?'<span class="badge verified-badge">VERIFIED</span>':'<span class="badge">AWAITING SOURCE</span>';
  const button=ok?'<a class="play" href="'+esc(g.playUrl)+'">LAUNCH GAME →</a>':'<span class="play locked">SOURCE NOT VERIFIED</span>';
  return '<article class="card">'+badge+'<div><div class="tag">'+esc(g.category)+" // "+esc((g.tags||[]).slice(0,2).join(" // "))+'</div><h2>'+esc(g.title)+"</h2><p>"+esc(g.description||"")+"</p></div>"+button+"</article>";
}
$("#search").addEventListener("input",e=>{state.query=e.target.value;render()});
boot().catch(err=>{console.error(err);$("#updated").textContent="SYNC ERROR";$("#empty").textContent="COULD NOT LOAD games.json";$("#empty").classList.remove("hidden")});
