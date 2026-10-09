/* ===== PARCHE COMPLETO · Carnicería San Judas =====
   Junta las 2 mejoras en un solo archivo:
   1) Pantalla Vender: barra Cobrar fija, lista corta con Frecuentes y categorías
   2) Sin "menudo", fin de semana (carnitas, chicharrón, cachete, dentros), catálogo nuevo,
      inventario con stock editable y asignar código al escanear
   3) Matanza: chanfaina y dentros separados, cabeza y espinazo (espinazo y chuleta no van juntos),
      chorizo fuera de la matanza con su propio apartado
   4) Pestaña Gastos (gasolina moto, desayuno, pago a trabajadores, otro) y resumen en Admin */

// --- Estilos de la pantalla Vender ---
(function(){const st=document.createElement('style');st.textContent=`
.chips{display:flex;gap:6px;overflow-x:auto;padding:4px 0}
.chip{flex:0 0 auto;padding:9px 14px;border:1px solid var(--borde);border-radius:20px;background:#fff;font-size:.9rem}
.chip.on{background:var(--rojo);color:#fff;border-color:var(--rojo)}
.lst{max-height:34vh;overflow-y:auto}
#t-venta{padding-bottom:100px}
#barra{position:fixed;left:0;right:0;bottom:calc(64px + env(safe-area-inset-bottom));background:#fff;border-top:2px solid var(--rojo);padding:8px 12px;display:flex;align-items:center;gap:10px;z-index:4}
#barra .tot{margin:0;font-size:1.3rem;flex:1;text-align:left}
#barra .big{width:55%;margin:0}
`;document.head.appendChild(st)})();

// --- Pantalla Vender mejorada ---
/* ===== PARCHE 2 · Carnicería San Judas =====
   Se carga después del programa principal y no borra nada de lo que ya hiciste.
   - Quita la categoría "menudo" (queda dentro de carne)
   - Fin de semana (preparados): carnitas, chicharrón, cachete y dentros
   - Agrega catálogo de abarrotes, cervezas y cortes de carne (solo los que no existan)
   - Inventario con buscador y stock editable directo
   - Si escaneas un código nuevo, te deja asignarlo a un producto
   Formato del catálogo:  nombre|precio|k   (k = se vende por kg; sin k = pieza) */

const NUEVOS={
cerveza:'Corona Extra Botella|26;Corona Light Botella|26;Corona Latón 473ml|30;Corona Caguama 940ml|56;Modelo Especial Botella|28;Modelo Especial Caguama 940ml|58;Negra Modelo Botella|30;Pacífico Botella|27;Pacífico Latón 473ml|30;Pacífico Caguama 940ml|54;Victoria Botella|25;Victoria Latón 473ml|28;Tecate Lata 355ml|24;Tecate Light Lata 355ml|24;Tecate Titanio Lata 355ml|25;Tecate Latón 473ml|28;Tecate Caguama 940ml|52;XX Lager Botella|27;XX Ámbar Botella|27;Indio Botella|25;Sol Botella|25;Carta Blanca Botella|25;Bohemia Clásica Botella|30;Heineken Botella|33;Stella Artois Botella|35;Michelob Ultra Lata 355ml|31;Estrella Botella|24;Barrilito Botella|23;Montejo Botella|26;León Botella|26;Superior Botella|24;Six Corona 6 pzas|145;Six Victoria 6 pzas|135;Six Modelo 6 pzas|155;Six Pacífico 6 pzas|145;Six Tecate Lata 6 pzas|130;Caja Victoria 24 pzas|520;Caja Corona 24 pzas|580;Caja Modelo 24 pzas|620',
carne:'Espinazo de Puerco|60|k;Chanfaina|45|k;Maciza de Puerco|130|k;Lomo de Puerco|140|k;Pierna de Puerco|115|k;Espaldilla de Puerco|110|k;Manitas de Puerco|50|k;Pata de Puerco|45|k;Cabeza de Puerco|70|k;Longaniza|120|k;Tocino|150|k;Bistec de Res|190|k;Carne Molida de Res|170|k;Arrachera|260|k;Carne para Asar|200|k;Milanesa de Res|210|k;Panza de Res (Menudo)|90|k;Hígado|80|k;Lengua|180|k;Pollo Entero|65|k;Pierna y Muslo de Pollo|65|k;Pechuga de Pollo|110|k',
preparados:'Cachete|180|k',
abarrotes:'Arroz|32|k;Frijol Negro|40|k;Frijol Pinto|40|k;Azúcar|32|k;Sal 1kg|14;Harina de Trigo|28|k;Maseca 1kg|24;Lentejas 500g|22;Garbanzo 500g|28;Avena 400g|22;Sopa de Pasta 200g|8;Spaghetti 200g|10;Aceite Vegetal 1L|45;Manteca de Cerdo|45|k;Café Soluble 50g|45;Café Molido 250g|75;Chocolate de Mesa 90g|28;Leche Entera 1L|28;Leche Deslactosada 1L|30;Crema 200ml|25;Queso Oaxaca|160|k;Queso Fresco|140|k;Queso Panela|150|k;Mantequilla 90g|18;Huevo Pieza|4;Salchicha 500g|55;Jamón 250g|45;Mayonesa 190g|28;Mostaza 105g|14;Catsup 200g|22;Salsa Valentina 370ml|20;Salsa Picante Botella|18;Chiles Chipotle Lata|20;Chiles Jalapeños Lata|22;Atún Lata|28;Sardina Lata|30;Frijoles Refritos Lata|28;Puré de Tomate Sobre|12;Consomé de Pollo Sobre|6;Sopa Instantánea Vaso|20;Cebolla|30|k;Jitomate|35|k;Tomate Verde|35|k;Limón|40|k;Papa|30|k;Aguacate|70|k;Chile Serrano|50|k;Chile Jalapeño|45|k;Ajo Cabeza|8;Cilantro Manojo|8;Pan de Caja 680g|45;Pan Dulce Pieza|8;Bolillo Pieza|3;Tostadas Bolsa|30;Galletas Marías|18;Galletas Emperador|15;Galletas Oreo|14;Papas Sabritas|19;Doritos|18;Cheetos|16;Ruffles|19;Takis Fuego|21;Churrumais|16;Cacahuates Bolsa|12;Gansito|19;Pingüinos|21;Pulparindo|8;Paleta Payaso|25;Chicles|14;Mazapán|8;Coca-Cola 355ml Lata|18;Coca-Cola 2L|36;Pepsi 600ml|18;Pepsi 2L|34;Fanta 600ml|18;Sprite 600ml|18;Sidral Mundet 600ml|18;Jarritos 600ml|18;Boing 500ml|16;Agua 600ml|12;Agua 1L|15;Garrafón 20L|40;Electrolit 625ml|32;Gatorade 600ml|24;Red Bull 250ml|42;Jugo Del Valle 413ml|18;Yakult|12;Hielo Bolsa 2kg|30;Carbón 3kg|45;Jabón Zote|22;Jabón de Tocador|18;Detergente 1kg|50;Cloro 1L|22;Fabuloso 1L|28;Papel Higiénico 4 rollos|38;Servilletas|18;Pasta Dental|24;Shampoo Sobre|4;Veladora|25;Pilas AA 2 pzas|20;Encendedor|18;Cerillos|5;Bolsas de Plástico|20;Plato Desechable 20 pzas|25;Vaso Desechable 25 pzas|25;Pimienta|8;Comino|8;Orégano|8;Chile en Polvo|10;Canela|10;Ajo en Polvo|8'
};

// Quita "menudo" de las categorías
(function(){const i=CATS.indexOf('menudo');if(i>-1)CATS.splice(i,1)})();

// Migración: se puede repetir sin duplicar nada
function migra(){
  const nn=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  let ch=false;
  const d0=P.find(p=>nn(p.n)=='chanfaina/dentros'); // el producto junto se renombra a Dentros
  if(d0&&!P.some(p=>nn(p.n)=='dentros')){d0.n='Dentros';ch=true}
  const FS=/dentros|cachete/i; // lo de fin de semana
  P.forEach(p=>{const c=FS.test(p.n)?'preparados':(p.c=='menudo'?'carne':p.c);if(c!=p.c){p.c=c;ch=true}});
  const ya=new Set(P.map(p=>nn(p.n)));
  for(const c in NUEVOS)NUEVOS[c].split(';').forEach(t=>{
    const a=t.split('|'),k=nn(a[0]);if(ya.has(k))return;ya.add(k);
    P.push({id:'n_'+k.replace(/\W+/g,'_'),n:a[0],c:c,cod:'',p:+a[1],cost:0,s:20,u:a[2]=='k'?'kg':'pza'});ch=true;
  });
  if(ch)guardaP();
  return ch;
}

// ===== Inventario: buscador + stock editable directo (admin) =====
function rInv(){
  $('t-inv').innerHTML=(esAdmin()?'<button class="big" onclick="editP()">➕ Agregar producto</button>':'')+
   '<input id="qi" placeholder="🔍 Buscar en inventario" oninput="listaInv()"><div id="li"></div>';
  listaInv();
}
function listaInv(){
  const a=esAdmin(),q=($('qi').value||'').toLowerCase();
  $('li').innerHTML=CATS.map(c=>{
    const r=P.filter(p=>p.c==c&&(!q||p.n.toLowerCase().includes(q)||p.cod==q));if(!r.length)return'';
    return`<h3>${c=='preparados'?'FIN DE SEMANA':c.toUpperCase()}</h3>`+r.map(p=>`<div class="card row"><div><b>${esc(p.n)}</b><br>
     <small>${m(p.p)}/${p.u}${a?' · costo '+m(p.cost||0):''}</small></div><div style="text-align:right">`+
     (a?`<input type="number" step="0.1" value="${p.s}" class="${p.s<5?'low':''}" style="width:85px;margin:0" onchange="setS('${p.id}',this.value)"> ${p.u}<br>
       <button class="sm" onclick="editP('${p.id}')">✏️</button><button class="sm del" onclick="delP('${p.id}')">🗑</button>`
        :`<span class="${p.s<5?'low':''}">${p.s<5?'⚠️ ':''}${p.s} ${p.u}</span>`)+`</div></div>`).join('');
  }).join('')||'<p>Sin resultados</p>';
}
function setS(id,v){P.find(x=>x.id==id).s=+v||0;guardaP()}

// ===== Precios rápidos: carne y fin de semana =====
function rPrec(){
  if(!esAdmin()){$('t-prec').innerHTML=loginBox();return}
  $('t-prec').innerHTML='<h3>💲 Precios de carne y fin de semana</h3>'+P.filter(p=>p.c=='carne'||p.c=='preparados').map(p=>
   `<div class="card row"><b style="flex:1">${esc(p.n)}</b><span>$</span><input type="number" step="0.5" value="${p.p}" style="width:100px;font-size:1.2rem"
   onchange="P.find(x=>x.id=='${p.id}').p=+this.value||0;guardaP();this.style.background='#dcfce7'"></div>`).join('');
}

// ===== Código nuevo al escanear: asignarlo a un producto =====
let _cc='';
function buscaCod(c,esc2){
  c=String(c||'').trim();if(!c)return false;
  const p=P.find(x=>x.cod==c);
  if(p){add(p.id);if($('se'))$('se').textContent='✔ '+p.n+' agregado';if($('q')&&!esc2){$('q').value='';lista()}return true}
  asignaCod(c);return false;
}
function asignaCod(c){
  _cc=c;stopScan();
  openM(`<h3>Código nuevo</h3><p><b>${esc(c)}</b><br><small>Busca el producto y tócalo para guardarle este código. La próxima vez se agrega solo.</small></p>
  <input id="ac" placeholder="Buscar producto" oninput="listaAc()"><div id="acl" class="lst" style="max-height:40vh;overflow-y:auto"></div>
  <button class="big gris" onclick="closeM()">Cancelar</button>`);
  listaAc();
}
function listaAc(){
  const q=($('ac').value||'').toLowerCase();
  $('acl').innerHTML=P.filter(p=>!q||p.n.toLowerCase().includes(q)).slice(0,30).map(p=>
   `<button class="item" onclick="ponCod('${p.id}')"><span>${esc(p.n)}</span><small>${p.cod||'sin código'}</small></button>`).join('');
}
function ponCod(id){const p=P.find(x=>x.id==id);p.cod=_cc;guardaP();closeM();rVenta();add(id)}


let catSel='frec'; // categoría mostrada: frec = más vendidos
function rVenta(){
  $('t-venta').innerHTML=`
  <button class="big" onclick="scan()">📷 Escanear</button>
  <input id="q" placeholder="🔍 Buscar producto o código" oninput="lista()" onkeydown="if(event.key=='Enter')buscaCod(this.value)">
  <div id="cats" class="chips"></div><div id="lst" class="lst"></div>
  <h3>🧾 Carrito</h3><div id="cart"></div>
  <label><input type="checkbox" id="fd" ${finde?'checked':''} onchange="finde=this.checked;lista()"> Fin de semana (Preparados)</label>
  <label><input type="checkbox" id="dm" ${dom?'checked':''} onchange="dom=this.checked;rCart()"> Domicilio +$10</label>
  <div id="barra"><div class="tot" id="tot"></div><button class="big ok" onclick="cobrar()">💵 Cobrar</button></div>`;
  lista();rCart();
}
function lista(){
  const q=($('q').value||'').toLowerCase().trim();
  const vis=P.filter(p=>finde||p.c!='preparados');
  let r;
  if(q)r=vis.filter(p=>p.n.toLowerCase().includes(q)||p.cod==q);
  else if(catSel=='frec'){const n={};V.slice(-300).forEach(v=>v.items.forEach(i=>n[i.id]=(n[i.id]||0)+1));
    r=vis.slice().sort((a,b)=>(n[b.id]||0)-(n[a.id]||0)).slice(0,8)}
  else r=vis.filter(p=>p.c==catSel);
  $('cats').innerHTML=['frec',...CATS].filter(c=>finde||c!='preparados').map(c=>
    `<button class="chip ${c==catSel?'on':''}" onclick="catSel='${c}';$('q').value='';lista()">${c=='frec'?'⭐ Frecuentes':(c=='preparados'?'Fin de semana':c)}</button>`).join('');
  $('lst').innerHTML=r.map(p=>`<button class="item" onclick="add('${p.id}')"><span>${esc(p.n)}</span>
   <span>${m(p.p)}/${p.u} · <span class="${p.s<5?'low':''}">${p.s} ${p.u}</span></span></button>`).join('')||'<p>Sin resultados</p>';
}

// ===== Matanza: cortes nuevos (sin chorizo; chanfaina y dentros separados; cabeza y espinazo) =====
CORTES.splice(0,CORTES.length,['costilla','Costilla de Puerco'],['chuleta','Chuleta'],['espinazo','Espinazo de Puerco'],
 ['pella','Pella'],['hueso','Hueso'],['tripa','Tripa Lavada'],['chanfaina','Chanfaina'],['dentros','Dentros'],
 ['cabeza','Cabeza de Puerco'],['cuero','Cuero para Chicharrón']);
let matSub='puerco',CH=G('pos_chorizo',[]); // CH = lotes de chorizo
function rMat(){
  const t=(k,x)=>`<button class="chip ${matSub==k?'on':''}" onclick="matSub='${k}';rMat()">${x}</button>`;
  $('t-mat').innerHTML=`<div class="chips">${t('puerco','🐖 Puerco')}${t('chorizo','🌶️ Chorizo')}</div>`+(matSub=='puerco'?formPuerco():formChorizo());
}
function formPuerco(){
  return`<h3>🐖 Registrar puerco</h3><div class="card">
  <div class="g2"><label>Peso vivo (kg)<input id="m_peso" type="number" step="0.1"></label>
  <label>Costo del puerco $<input id="m_costo" type="number" step="0.01"></label></div>
  <small>Fecha: ${hora(new Date())}</small><h4>Desglose (kg)</h4>
  <div class="g2">${CORTES.map(c=>`<label>${c[1]}<input id="m_${c[0]}" type="number" step="0.1" oninput="excl('${c[0]}')"></label>`).join('')}</div>
  <small>Espinazo y chuleta no van juntos: si capturas uno, el otro se bloquea.</small>
  <button class="big ok" onclick="regPuerco()">Registrar Puerco</button></div>`+
  (esAdmin()?histPuercos():'<p><small>El historial lo ve el administrador.</small></p>');
}
function excl(k){ // espinazo y chuleta se excluyen entre sí
  const par={espinazo:'chuleta',chuleta:'espinazo'}[k];if(!par)return;
  const a=$('m_'+k),b=$('m_'+par);
  if(+a.value>0){b.value='';b.disabled=true}else b.disabled=false;
}
function regPuerco(){
  const pu={id:Date.now(),f:new Date().toISOString(),peso:+$('m_peso').value||0,costo:+$('m_costo').value||0,cortes:{},kg:0};
  CORTES.forEach(c=>{const v=+$('m_'+c[0]).value||0;pu.cortes[c[0]]=v;pu.kg+=v});
  if(!pu.kg)return alert('Captura los kg de al menos un corte');
  if(pu.cortes.espinazo>0&&pu.cortes.chuleta>0)return alert('Espinazo y chuleta no van juntos: deja solo uno.');
  CORTES.forEach(c=>{const p=P.find(x=>x.n==c[1]);if(p)p.s=Math.round((p.s+pu.cortes[c[0]])*1000)/1000}); // suma al stock
  PU.push(pu);S('pos_puercos',PU);guardaP();pushPatch({['puercos/'+pu.id]:pu});
  alert('Puerco registrado. Stock actualizado.');rMat();
}
// ===== Chorizo: apartado independiente =====
function formChorizo(){
  return`<h3>🌶️ Elaboración de chorizo</h3><div class="card">
  <div class="g2"><label>Kg de chorizo<input id="c_kg" type="number" step="0.1"></label>
  <label>Costo total $ (carne y especias)<input id="c_costo" type="number" step="0.01"></label></div>
  <label>Nota (opcional)<input id="c_nota" placeholder="Ej. 20 kg de maciza + chile"></label>
  <small>Fecha: ${hora(new Date())}. Se suma al inventario de Chorizo Casero.</small>
  <button class="big ok" onclick="regChorizo()">Registrar Chorizo</button></div>`+
  (esAdmin()?histChorizo():'<p><small>El historial lo ve el administrador.</small></p>');
}
function histChorizo(){
  const p=P.find(x=>x.n=='Chorizo Casero'),pr=p?p.p:0;
  return'<h3>Historial de chorizo</h3>'+([...CH].reverse().map(c=>{const g=c.kg*pr-c.costo;
   return`<div class="card"><b>${hora(c.f)}</b> · ${c.kg} kg${c.nota?' · '+esc(c.nota):''}<br>Costo ${m(c.costo)} · Ganancia estimada
   <b style="color:${g>=0?'#15803d':'#b91c1c'}">${m(g)}</b></div>`}).join('')||'<p>Sin registros</p>');
}
function regChorizo(){
  const c={id:Date.now(),f:new Date().toISOString(),kg:+$('c_kg').value||0,costo:+$('c_costo').value||0,nota:$('c_nota').value.trim()};
  if(!c.kg)return alert('Captura los kg de chorizo');
  const p=P.find(x=>x.n=='Chorizo Casero');if(p)p.s=Math.round((p.s+c.kg)*1000)/1000;
  CH.push(c);S('pos_chorizo',CH);guardaP();pushPatch({['chorizo/'+c.id]:c});
  alert('Chorizo registrado. Stock actualizado.');rMat();
}
// el chorizo también viaja a la nube y entra al respaldo
const _pull=pull,_pushAll=pushAll;
pull=function(){_pull();if(!CL.url)return;
  fetch(curl('chorizo')).then(r=>r.json()).then(d=>{if(!d)return;const o=obj(CH,x=>x.id);Object.assign(o,d);
    CH=Object.values(o).sort((a,b)=>a.f<b.f?-1:1);S('pos_chorizo',CH)}).catch(()=>{})};
pushAll=function(){_pushAll();pushPatch({chorizo:obj(CH,x=>x.id)})};
function exportar(){
  const b=new Blob([JSON.stringify({pos_products:P,pos_puercos:PU,pos_ventas:V,pos_admin_pin:PIN,pos_cierres:CI,pos_chorizo:CH,pos_gastos:GA})],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='respaldo-pos-'+dk(new Date())+'.json';a.click();
}
function importar(inp){
  const f=inp.files[0];if(!f)return;const r=new FileReader();
  r.onload=()=>{try{const d=JSON.parse(r.result);if(!confirm('Esto reemplaza los datos actuales. ¿Continuar?'))return;
    S('pos_products',d.pos_products||[]);S('pos_puercos',d.pos_puercos||[]);S('pos_ventas',d.pos_ventas||[]);
    S('pos_admin_pin',d.pos_admin_pin||PIN);S('pos_cierres',d.pos_cierres||[]);S('pos_chorizo',d.pos_chorizo||[]);S('pos_gastos',d.pos_gastos||[]);location.reload()}catch(e){alert('Archivo inválido')}};
  r.readAsText(f);
}

// ===== Gastos: gasolina moto, desayuno, pago a trabajadores =====
const TIPOS_G=['Gasolina moto','Desayuno','Pago a trabajadores','Otro'];
let GA=G('pos_gastos',[]); // lista de gastos
const sumG=a=>a.reduce((s,g)=>s+g.monto,0);
(function(){ // crea la pestaña Gastos en la barra de abajo
  try{
    const sec=document.createElement('section');sec.id='t-gas';sec.className='tab';document.querySelector('main').appendChild(sec);
    const b=document.createElement('button');b.dataset.t='gas';b.innerHTML='<b>💸</b>Gastos';b.onclick=()=>show('gas');
    const nav=$('nav');nav.insertBefore(b,nav.lastElementChild);
    const st=document.createElement('style');st.textContent='nav button{font-size:.64rem}';document.head.appendChild(st);
  }catch(e){console.log('Gastos:',e)}
})();
function listaG(a,adm){
  return a.map(g=>`<div class="card row"><div><b>${esc(g.tipo)}</b> · ${m(g.monto)}<br>
   <small>${hora(g.f)} · ${esc(g.quien)}${g.desc?' · '+esc(g.desc):''}</small></div>
   ${adm?`<button class="sm del" onclick="delGasto('${g.id}')">🗑</button>`:''}</div>`).join('')||'<p>Sin gastos</p>';
}
function rGas(){
  const hoy=dk(new Date()),gh=GA.filter(g=>dk(g.f)==hoy),a=esAdmin();
  $('t-gas').innerHTML=`<h3>💸 Registrar gasto</h3><div class="card">
   <label>Tipo<select id="g_t">${TIPOS_G.map(t=>`<option>${t}</option>`).join('')}</select></label>
   <label>Monto $<input id="g_m" type="number" step="0.01" inputmode="decimal"></label>
   <label>Descripción<input id="g_d" placeholder="Ej. Moto de Juan, pago de la semana…"></label>
   <button class="big ok" onclick="regGasto()">Guardar gasto</button></div>
   <h3>Gastos de hoy: ${m(sumG(gh))}</h3>`+listaG([...gh].reverse(),a)+
   (a?'<h3>Historial (últimos 60)</h3>'+listaG([...GA].reverse().slice(0,60),true):'');
}
function regGasto(){
  const g={id:Date.now(),f:new Date().toISOString(),tipo:$('g_t').value,monto:+$('g_m').value||0,
    desc:$('g_d').value.trim(),quien:localStorage.getItem('pos_cajero')||(sesion()||{}).nombre||'Sin nombre'};
  if(g.monto<=0)return alert('Captura el monto del gasto');
  GA.push(g);S('pos_gastos',GA);pushPatch({['gastos/'+g.id]:g});
  alert('Gasto guardado');rGas();
}
function delGasto(id){
  if(!esAdmin()||!confirm('¿Borrar este gasto?'))return;
  GA=GA.filter(g=>g.id!=id);S('pos_gastos',GA);pushPatch({['gastos/'+id]:null});rGas();
}
function resumenGastos(){ // bloque que se agrega al panel Admin, antes del corte de caja
  const hoy=dk(new Date()),ult=CI.length?CI[CI.length-1].f:'';
  const gh=sumG(GA.filter(g=>dk(g.f)==hoy)),gs=sumG(GA.filter(g=>(Date.now()-new Date(g.f))<7*864e5));
  const gcs=GA.filter(g=>g.f>ult),gc=sumG(gcs),vc=sumV(V.filter(v=>v.f>ult));
  const costoH=PU.filter(u=>dk(u.f)==hoy).reduce((a,u)=>a+u.costo,0),vh=sumV(V.filter(v=>dk(v.f)==hoy));
  const por={};gcs.forEach(g=>por[g.tipo]=(por[g.tipo]||0)+g.monto);
  return`<h3>💸 Gastos</h3><div class="card"><div class="grid"><div class="kpi"><small>Gastos hoy</small><div>${m(gh)}</div></div>
   <div class="kpi"><small>Gastos de la semana</small><div>${m(gs)}</div></div></div>
   <div class="row" style="margin-top:8px"><span>Ganancia hoy después de gastos</span><b>${m(vh-costoH-gh)}</b></div><hr>
   ${Object.keys(por).map(k=>`<div class="row"><span>${esc(k)}</span><b>${m(por[k])}</b></div>`).join('')}
   <div class="row"><span>Ventas desde el último corte</span><b>${m(vc)}</b></div>
   <div class="row"><span>Gastos desde el último corte</span><b>− ${m(gc)}</b></div>
   <div class="row"><b>Efectivo neto en caja</b><b style="font-size:1.3rem">${m(vc-gc)}</b></div></div>`;
}
const _rAdm=rAdm; // el panel Admin original + resumen de gastos
rAdm=function(){
  _rAdm();if(!esAdmin())return;
  const t=$('t-adm'),mk='<h3>🧮 Corte de caja</h3>';
  t.innerHTML=t.innerHTML.includes(mk)?t.innerHTML.replace(mk,resumenGastos()+mk):t.innerHTML+resumenGastos();
  chart();
};
// los gastos también viajan a la nube y entran al respaldo
const _pull2=pull,_pushAll2=pushAll;
pull=function(){_pull2();if(!CL.url)return;
  fetch(curl('gastos')).then(r=>r.json()).then(d=>{
    if(d){GA=Object.values(d).sort((a,b)=>a.f<b.f?-1:1);S('pos_gastos',GA);refresca()}
    else if(GA.length)pushPatch({gastos:obj(GA,x=>x.id)})}).catch(()=>{})};
pushAll=function(){_pushAll2();pushPatch({gastos:obj(GA,x=>x.id)})};

// ===== Activar =====
REND.venta=rVenta;REND.mat=rMat;REND.gas=rGas;REND.adm=rAdm;REND.inv=rInv;REND.prec=rPrec;
migra();
show(document.querySelector('.tab.on').id.slice(2));
setTimeout(()=>{if(migra())refresca()},3000); // por si la nube trajo datos viejos
if(CL.url)pull(); // baja chorizo y gastos de la nube
