/* ===== PARCHE COMPLETO · Carnicería San Judas =====
   Junta las 2 mejoras en un solo archivo:
   1) Pantalla Vender: barra Cobrar fija, lista corta con Frecuentes y categorías
   2) Sin "menudo", fin de semana (carnitas, chicharrón, cachete, dentros), catálogo nuevo,
      inventario con stock editable y asignar código al escanear
   3) Matanza: chanfaina y dentros separados, cabeza y espinazo (espinazo y chuleta no van juntos),
      chorizo fuera de la matanza con su propio apartado
   4) Pestaña Gastos (gasolina moto, desayuno, pago a trabajadores, otro) y resumen en Admin
   5) Fin de semana: una sola opción "Chicharrón" (cachete y dentros se suman ahí)
   8) Ticket con cada compra (cambio, imprimir, compartir, reimprimir) y fin de semana en UNA opción (chicharrón, cachete, carnitas, dentros)
   7) Color verde y todo editable (puercos, chorizo, gastos, productos)
   6) Admin profesional: Resumen · Puercos (historial y detalle) · Seguridad (PIN con bloqueo, bitácora, login de nube) */

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
abarrotes:'Arroz|32|k;Frijol Negro|40|k;Frijol Pinto|40|k;Azúcar|32|k;Sal 1kg|14;Harina de Trigo|28|k;Maseca 1kg|24;Lentejas 500g|22;Garbanzo 500g|28;Avena 400g|22;Sopa de Pasta 200g|8;Spaghetti 200g|10;Aceite Vegetal 1L|45;Manteca de Cerdo|45|k;Café Soluble 50g|45;Café Molido 250g|75;Chocolate de Mesa 90g|28;Leche Entera 1L|28;Leche Deslactosada 1L|30;Crema 200ml|25;Queso Oaxaca|160|k;Queso Fresco|140|k;Queso Panela|150|k;Mantequilla 90g|18;Huevo Pieza|4;Salchicha 500g|55;Jamón 250g|45;Mayonesa 190g|28;Mostaza 105g|14;Catsup 200g|22;Salsa Valentina 370ml|20;Salsa Picante Botella|18;Chiles Chipotle Lata|20;Chiles Jalapeños Lata|22;Atún Lata|28;Sardina Lata|30;Frijoles Refritos Lata|28;Puré de Tomate Sobre|12;Consomé de Pollo Sobre|6;Sopa Instantánea Vaso|20;Cebolla|30|k;Jitomate|35|k;Tomate Verde|35|k;Limón|40|k;Papa|30|k;Aguacate|70|k;Chile Serrano|50|k;Chile Jalapeño|45|k;Ajo Cabeza|8;Cilantro Manojo|8;Pan de Caja 680g|45;Pan Dulce Pieza|8;Bolillo Pieza|3;Tostadas Bolsa|30;Galletas Marías|18;Galletas Emperador|15;Galletas Oreo|14;Papas Sabritas|19;Doritos|18;Cheetos|16;Ruffles|19;Takis Fuego|21;Churrumais|16;Cacahuates Bolsa|12;Gansito|19;Pingüinos|21;Pulparindo|8;Paleta Payaso|25;Chicles|14;Mazapán|8;Coca-Cola 355ml Lata|18;Coca-Cola 2L|36;Pepsi 600ml|18;Pepsi 2L|34;Fanta 600ml|18;Sprite 600ml|18;Sidral Mundet 600ml|18;Jarritos 600ml|18;Boing 500ml|16;Agua 600ml|12;Agua 1L|15;Garrafón 20L|40;Electrolit 625ml|32;Gatorade 600ml|24;Red Bull 250ml|42;Jugo Del Valle 413ml|18;Yakult|12;Hielo Bolsa 2kg|30;Carbón 3kg|45;Jabón Zote|22;Jabón de Tocador|18;Detergente 1kg|50;Cloro 1L|22;Fabuloso 1L|28;Papel Higiénico 4 rollos|38;Servilletas|18;Pasta Dental|24;Shampoo Sobre|4;Veladora|25;Pilas AA 2 pzas|20;Encendedor|18;Cerillos|5;Bolsas de Plástico|20;Plato Desechable 20 pzas|25;Vaso Desechable 25 pzas|25;Pimienta|8;Comino|8;Orégano|8;Chile en Polvo|10;Canela|10;Ajo en Polvo|8'
};

// Quita "menudo" de las categorías
(function(){const i=CATS.indexOf('menudo');if(i>-1)CATS.splice(i,1)})();

// Migración: se puede repetir sin duplicar nada
function migra(){
  const nn=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  let ch=false;
  P.forEach(p=>{if(p.c=='menudo'){p.c='carne';ch=true}}); // menudo ya no existe
  // Fin de semana: UNA sola opción de venta (chicharrón, cachete, dentros y carnitas se suman aquí). Se marca con fs:true
  const NU='Chicharrón y Carnitas';
  const MZ=/^(chicharron|chicharron prensado|chicharron botanero|chicharron y carnitas|cachete|dentros|chanfaina\/dentros|carnitas|carnitas x kg)$/;
  let unico=P.find(p=>p.fs)||P.find(p=>nn(p.n)=='chicharron'||nn(p.n)=='chicharron y carnitas');
  const otros=P.filter(p=>p!==unico&&MZ.test(nn(p.n)));
  if(!unico){unico={id:'n_chicharron',n:NU,c:'preparados',cod:(otros.find(p=>p.cod)||{}).cod||'',p:260,cost:0,s:0,u:'kg',fs:true};P.push(unico);ch=true}
  if(!unico.fs){unico.fs=true;ch=true}
  if(nn(unico.n)=='chicharron'){unico.n=NU;ch=true} // solo cambia el nombre anterior; si tú le pusiste otro, no lo toca
  if(unico.c!='preparados'){unico.c='preparados';ch=true}
  if(otros.length){
    otros.forEach(p=>{unico.s=Math.round((unico.s+(+p.s||0))*1000)/1000;if(!unico.cod&&p.cod)unico.cod=p.cod});
    P=P.filter(p=>!otros.includes(p));ch=true;
  }
  const ya=new Set(P.map(p=>nn(p.n)));
  for(const c in NUEVOS)NUEVOS[c].split(';').forEach(t=>{
    const a=t.split('|'),k=nn(a[0]);if(!k||ya.has(k))return;ya.add(k);
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
  <div class="row"><button class="big" style="flex:2;width:auto" onclick="scan()">📷 Escanear</button><button class="big gris" style="flex:1;width:auto" onclick="ultimosT()">🧾 Tickets</button></div>
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

// ===== Matanza: cortes. [clave, producto que recibe el stock, etiqueta] =====
// Chicharrón, cachete, carnitas y dentros se capturan por separado pero se SUMAN en un solo producto (el marcado fs:true)
const nombreU=()=>{const p=P.find(x=>x.fs);return p?p.n:'Chicharrón y Carnitas'};
const cU=(k,l)=>{const a=[k,'',l];Object.defineProperty(a,1,{get:nombreU,enumerable:true});return a}; // el nombre se lee del producto, así puedes renombrarlo
CORTES.splice(0,CORTES.length,['costilla','Costilla de Puerco'],['chuleta','Chuleta'],['espinazo','Espinazo de Puerco'],
 ['pella','Pella'],['hueso','Hueso'],['tripa','Tripa Lavada'],['chanfaina','Chanfaina'],['cabeza','Cabeza de Puerco'],
 ['cuero','Cuero para Chicharrón'],cU('chicharron','Chicharrón'),cU('cachete','Cachete'),cU('carnitas','Carnitas'),cU('dentros','Dentros'));
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
  <div class="g2">${CORTES.map(c=>`<label>${c[2]||c[1]}<input id="m_${c[0]}" type="number" step="0.1" oninput="excl('${c[0]}')"></label>`).join('')}</div>
  <small>Chicharrón, cachete, carnitas y dentros se capturan por separado y se suman en una sola opción de venta: ${nombreU()}.<br>Espinazo y chuleta no van juntos: si capturas uno, el otro se bloquea.</small>
  <button class="big ok" onclick="regPuerco()">Registrar Puerco</button></div>`+
  (esAdmin()?histPuercos():'<p><small>El historial lo ve el administrador.</small></p>');
}
function excl(k){ // espinazo y chuleta se excluyen entre sí
  const par={espinazo:'chuleta',chuleta:'espinazo'}[k];if(!par)return;
  const a=$('m_'+k),b=$('m_'+par);
  if(+a.value>0){b.value='';b.disabled=true}else b.disabled=false;
}
function regPuerco(){
  const pu={id:Date.now(),f:new Date().toISOString(),peso:+$('m_peso').value||0,costo:+$('m_costo').value||0,cortes:{},precios:{},kg:0,
    quien:localStorage.getItem('pos_cajero')||(sesion()||{}).nombre||'Sin nombre'};
  CORTES.forEach(c=>{const v=+$('m_'+c[0]).value||0;pu.cortes[c[0]]=v;pu.kg+=v;const p=P.find(x=>x.n==c[1]);pu.precios[c[0]]=p?p.p:0});
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
   <b style="color:${g>=0?'#15803d':'#b91c1c'}">${m(g)}</b><br><button class="sm" onclick="editaChorizo(${c.id})">✏️ Editar</button><button class="sm del" onclick="borraChorizo(${c.id})">🗑 Borrar</button></div>`}).join('')||'<p>Sin registros</p>');
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
   ${adm?`<span><button class="sm" onclick="editaGasto('${g.id}')">✏️</button><button class="sm del" onclick="delGasto('${g.id}')">🗑</button></span>`:''}</div>`).join('')||'<p>Sin gastos</p>';
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
// ===== Panel Admin profesional: Resumen · Puercos · Seguridad =====
let admView='resumen',pF='';
function admV(v){admView=v;show('adm')}
const filaP=u=>{const r=[];for(const k in u.cortes){const v=u.cortes[k];if(!(v>0))continue;
  const c=CORTES.find(x=>x[0]==k)||[k,k=='chorizo'?'Chorizo Casero':k];
  const pr=(u.precios&&u.precios[k]!=null)?u.precios[k]:((P.find(x=>x.n==c[1])||{}).p||0);
  r.push({n:c[2]||c[1],kg:v,pr:pr,val:v*pr})}return r};
const valorP=u=>filaP(u).reduce((a,r)=>a+r.val,0);
const verde=g=>g>=0?'#15803d':'#b91c1c';
function cardP(u){const g=valorP(u)-u.costo;
  return`<div class="card"><div class="row"><b>${hora(u.f)}</b><button class="sm" onclick="admV('p:${u.id}')">Ver detalle ›</button></div>
  <small>${u.peso} kg vivo · ${u.kg.toFixed(1)} kg · ${u.peso?(u.kg/u.peso*100).toFixed(0)+'% rendimiento':'—'}${u.quien?' · '+esc(u.quien):''}</small><br>
  Costo ${m(u.costo)} · Ganancia est. <b style="color:${verde(g)}">${m(g)}</b></div>`}
function histPuercos(){ // resumen corto + botón al historial completo
  return'<h3>Historial de puercos</h3>'+([...PU].reverse().slice(0,3).map(cardP).join('')||'<p>Sin registros</p>')+
   '<button class="big gris" onclick="admV(\'puercos\')">📋 Ver historial completo</button>'}
function vistaPuercos(){
  const meses=[...new Set(PU.map(u=>dk(u.f).slice(0,7)))].sort().reverse();
  const L=PU.filter(u=>!pF||dk(u.f).slice(0,7)==pF),kg=L.reduce((a,u)=>a+u.kg,0),vivo=L.reduce((a,u)=>a+u.peso,0),
    cos=L.reduce((a,u)=>a+u.costo,0),gan=L.reduce((a,u)=>a+valorP(u)-u.costo,0);
  return`<h3>📋 Historial de puercos</h3><select onchange="pF=this.value;admV('puercos')"><option value="">Todos los meses</option>
  ${meses.map(x=>`<option ${x==pF?'selected':''}>${x}</option>`).join('')}</select>
  <div class="grid" style="margin-top:8px"><div class="kpi"><small>Puercos</small><div>${L.length}</div></div><div class="kpi"><small>Kg obtenidos</small><div>${kg.toFixed(0)}</div></div>
  <div class="kpi"><small>Costo total</small><div>${m(cos)}</div></div><div class="kpi"><small>Ganancia estimada</small><div style="color:${verde(gan)}">${m(gan)}</div></div></div>
  <p><small>Rendimiento promedio: ${vivo?(kg/vivo*100).toFixed(0)+'%':'—'}</small></p>${totCortes(L)}`+([...L].reverse().map(cardP).join('')||'<p>Sin registros</p>')}
function detalleP(id){
  const u=PU.find(x=>x.id==id);if(!u)return'<p>No se encontró el registro.</p>';
  const f=filaP(u),val=valorP(u),g=val-u.costo;
  return`<button class="sm" onclick="admV('puercos')">← Volver al historial</button><h3>🐖 Puerco del ${hora(u.f)}</h3>
  <div class="card">Registró: <b>${esc(u.quien||'—')}</b><br>Peso vivo: <b>${u.peso} kg</b> · Costo: <b>${m(u.costo)}</b>${u.peso?' ('+m(u.costo/u.peso)+' por kg vivo)':''}<br>
  Kg obtenidos: <b>${u.kg.toFixed(1)}</b>${u.peso?' · Rendimiento: <b>'+(u.kg/u.peso*100).toFixed(0)+'%</b>':''}</div>
  <div class="card"><div class="row"><b>Corte</b><b>kg · precio · valor</b></div>
  ${f.map(r=>`<div class="row"><span>${esc(r.n)}</span><span>${r.kg} kg · ${m(r.pr)} · <b>${m(r.val)}</b></span></div>`).join('')}<hr>
  <div class="row"><span>Valor si se vende todo</span><b>${m(val)}</b></div><div class="row"><span>Costo del puerco</span><b>− ${m(u.costo)}</b></div>
  <div class="row"><b>Ganancia estimada</b><b style="color:${verde(g)}">${m(g)}</b></div></div>
  <small>${u.precios?'Precios al momento del registro.':'Registro anterior: se usan los precios actuales.'}</small>${u.editado?'<br><small>Editado: '+hora(u.editado)+'</small>':''}
  <div class="row" style="margin-top:8px"><button class="big" onclick="editarP(${u.id})">✏️ Editar</button><button class="big gris" onclick="borraP(${u.id})">🗑 Borrar</button></div>`}
function indicadores(){
  const d0=dk(new Date()),d1=dk(Date.now()-864e5),vh=V.filter(v=>dk(v.f)==d0),th=sumV(vh),ty=sumV(V.filter(v=>dk(v.f)==d1));
  const top={};V.filter(v=>Date.now()-new Date(v.f)<7*864e5).forEach(v=>v.items.forEach(i=>top[i.n]=(top[i.n]||0)+i.p*i.q));
  const tp=Object.entries(top).sort((a,b)=>b[1]-a[1]).slice(0,5);
  return`<h3>📈 Indicadores</h3><div class="grid"><div class="kpi"><small>Hoy vs ayer</small><div>${m(th)}</div><small>${ty?((th-ty)/ty*100).toFixed(0)+'% vs ayer':'sin ventas ayer'}</small></div>
  <div class="kpi"><small>Ticket promedio hoy</small><div>${m(vh.length?th/vh.length:0)}</div><small>${vh.length} ventas</small></div></div>
  <div class="card"><b>Más vendidos de la semana</b>${tp.map(x=>`<div class="row"><span>${esc(x[0])}</span><b>${m(x[1])}</b></div>`).join('')||'<p>Sin ventas</p>'}</div>`}
const _rAdm=rAdm;
rAdm=function(){
  if(!esAdmin()){_rAdm();return}
  const t=$('t-adm'),act=admView.indexOf('p:')==0?'puercos':admView,mk='<h3>🧮 Corte de caja</h3>';
  const chips='<div class="chips">'+[['resumen','📊 Resumen'],['puercos','🐖 Puercos'],['seg','🔒 Seguridad']].map(c=>
    `<button class="chip ${act==c[0]?'on':''}" onclick="admV('${c[0]}')">${c[1]}</button>`).join('')+'</div>';
  if(admView=='resumen'){
    _rAdm();let h=t.innerHTML.replace("localStorage.removeItem('pos_session');rAdm()","salir()").replace('<h3>Ventas últimos 7 días</h3>',indicadores()+'<h3>Ventas últimos 7 días</h3>');
    t.innerHTML=chips+(h.includes(mk)?h.replace(mk,resumenGastos()+mk):h+resumenGastos());chart();return}
  t.innerHTML=`<div class="row"><b>👤 ${esc(sesion().nombre)}</b><button class="sm" onclick="salir()">Salir</button></div>${chips}`+
    (admView=='puercos'?vistaPuercos():admView=='seg'?vistaSeg():detalleP(admView.slice(2)));
};
// ===== Seguridad =====
const IDLE=10; // minutos sin usar antes de cerrar la sesión de administrador
let lastAct=Date.now(),AU=G('pos_auth',{key:'',rt:''}),TOK='',TOKT=0;
function bitacora(ev,q){const b=G('pos_bitacora',[]);b.push({f:new Date().toISOString(),ev:ev,quien:q||(sesion()||{}).nombre||''});S('pos_bitacora',b.slice(-300))}
function salir(){bitacora('Salida');localStorage.removeItem('pos_session');rAdm()}
function login(){ // PIN con bloqueo: 5 fallos = 5 minutos
  const b=G('pos_lock',{n:0,hasta:0});
  if(Date.now()<b.hasta)return alert('Acceso bloqueado. Intenta en '+Math.ceil((b.hasta-Date.now())/60000)+' min.');
  const v=$('pin').value;let nom='';
  if(v&&v==PIN.p1)nom='Patrón 1';else if(v&&v==PIN.p2)nom='Patrón 2';
  if(!nom){b.n++;if(b.n>=5){b.hasta=Date.now()+300000;b.n=0;bitacora('Bloqueo: 5 PIN incorrectos')}else bitacora('PIN incorrecto');S('pos_lock',b);return alert('PIN incorrecto')}
  S('pos_lock',{n:0,hasta:0});S('pos_session',{rol:'admin',nombre:nom});lastAct=Date.now();bitacora('Entrada',nom);
  show(document.querySelector('.tab.on').id.slice(2));
}
function cambiaPins(){
  const a=$('n1').value.trim(),b=$('n2').value.trim(),ok=x=>/^\d{4,8}$/.test(x)&&!['1234','5678','0000'].includes(x)&&!/^(\d)\1+$/.test(x);
  if((a&&!ok(a))||(b&&!ok(b)))return alert('PIN no válido: usa de 4 a 8 números, que no sean repetidos ni 1234 / 5678.');
  const n1=a||PIN.p1,n2=b||PIN.p2;if(n1==n2)return alert('Los dos PIN no pueden ser iguales');
  PIN.p1=n1;PIN.p2=n2;S('pos_admin_pin',PIN);bitacora('Cambio de PIN');alert('PINs guardados');
}
function chequeaIdle(){ // cierra la sesión admin por inactividad
  if(sesion()&&Date.now()-lastAct>IDLE*60000){bitacora('Sesión cerrada por inactividad');localStorage.removeItem('pos_session');
    const t=document.querySelector('.tab.on').id;if(t=='t-adm'||t=='t-prec')show('venta')}
}
['click','touchstart','keydown'].forEach(e=>document.addEventListener(e,()=>{lastAct=Date.now()},true));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)chequeaIdle()});
setInterval(chequeaIdle,30000);
function exportar(){ // el respaldo ya NO incluye los PIN
  const b=new Blob([JSON.stringify({pos_products:P,pos_puercos:PU,pos_ventas:V,pos_cierres:CI,pos_chorizo:CH,pos_gastos:GA})],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='respaldo-pos-'+dk(new Date())+'.json';a.click();
}
function vistaSeg(){
  const B=G('pos_bitacora',[]).slice(-30).reverse();
  return`<h3>🔒 Seguridad</h3><div class="card"><small>• La sesión de administrador se cierra sola a los ${IDLE} min sin usar.<br>• 5 PIN incorrectos bloquean el acceso 5 minutos.<br>
  • El respaldo ya no incluye los PIN.<br>• Los datos que llegan de la nube se revisan antes de usarse.</small></div>
  <h3>🔑 Cambiar PINs</h3><div class="g2"><input id="n1" placeholder="Nuevo PIN Patrón 1" inputmode="numeric"><input id="n2" placeholder="Nuevo PIN Patrón 2" inputmode="numeric"></div>
  <small>De 4 a 8 números. No uses 1234, 5678 ni números repetidos.</small><button class="big gris" onclick="cambiaPins()">Guardar PINs</button>
  <h3>☁️ Acceso a la nube</h3><div class="card"><small>${AU.rt?'✅ Esta sesión usa login de nube.':'Sin login de nube: tu base queda abierta para quien tenga la dirección. En Firebase activa Authentication → Correo/contraseña, crea un usuario, copia la Web API Key (Configuración del proyecto) y cambia las reglas a auth != null.'}</small>
  <input id="au_k" placeholder="Web API Key" value="${esc(AU.key)}"><input id="au_e" type="email" placeholder="Correo del usuario"><input id="au_p" type="password" placeholder="Contraseña">
  <button class="big" onclick="authLogin()">Iniciar sesión en la nube</button>${AU.rt?'<button class="big gris" onclick="authOut()">Cerrar sesión de nube</button>':''}</div>
  <h3>🧾 Bitácora de accesos</h3>`+(B.map(b=>`<div class="card row"><span>${esc(b.ev)}${b.quien?' · '+esc(b.quien):''}</span><small>${hora(b.f)}</small></div>`).join('')||'<p>Sin registros</p>');
}
// --- Login de Firebase (correo y contraseña) por REST ---
function tokenOk(){
  if(!AU.rt)return Promise.resolve('');
  if(TOK&&Date.now()<TOKT)return Promise.resolve(TOK);
  return _fetch('https://securetoken.googleapis.com/v1/token?key='+AU.key,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:'grant_type=refresh_token&refresh_token='+encodeURIComponent(AU.rt)}).then(r=>r.json()).then(d=>{
    if(!d.id_token)throw 0;TOK=d.id_token;TOKT=Date.now()+(+d.expires_in-120)*1000;if(d.refresh_token){AU.rt=d.refresh_token;S('pos_auth',AU)}return TOK}).catch(()=>'');
}
function authLogin(){
  const key=$('au_k').value.trim()||AU.key;
  _fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+key,{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email:$('au_e').value.trim(),password:$('au_p').value,returnSecureToken:true})}).then(r=>r.json()).then(d=>{
    if(!d.idToken)throw new Error((d.error&&d.error.message)||'sin respuesta');
    AU={key:key,rt:d.refreshToken};S('pos_auth',AU);TOK=d.idToken;TOKT=Date.now()+(+d.expiresIn-120)*1000;
    bitacora('Login de nube');alert('Sesión de nube iniciada');conecta();rAdm()}).catch(e=>alert('No se pudo entrar: '+e.message));
}
function authOut(){AU={key:AU.key,rt:''};S('pos_auth',AU);TOK='';bitacora('Logout de nube');conecta();rAdm()}
// --- Revisa los datos que llegan de la nube (evita ids o textos dañinos) ---
const SEG=/^[\w-]{1,80}$/,NODOS=['products','ventas','puercos','chorizo','gastos','cierres'];
function limpiaNodo(k,n){
  if(!n||typeof n!='object')return n;const o={};
  for(const id in n){const x=n[id];if(!x||typeof x!='object')continue;
    if(k!='cierres'&&!SEG.test(String(x.id!=null?x.id:id)))continue;
    if(k=='ventas'&&!Object.values(x.items||{}).every(i=>i&&SEG.test(String(i.id))))continue;
    o[id]=x}
  return o;
}
function limpia(d){if(!d||typeof d!='object')return d;const o={};NODOS.forEach(k=>{if(d[k])o[k]=limpiaNodo(k,d[k])});return o}
const _fetch=window.fetch.bind(window),_ES=window.EventSource;
window.fetch=function(u,o){ // agrega el login a las llamadas a Firebase y revisa lo que baja
  if(typeof u!='string'||!CL.url||u.indexOf(CL.url)!=0)return _fetch(u,o);
  const get=!o||!o.method,mm=u.slice(CL.url.length).match(/^\/([a-z]+)\.json/);
  return tokenOk().then(t=>_fetch(t?u+(u.includes('?')?'&':'?')+'auth='+t:u,o)).then(r=>{
    if(!get)return r;if(!r.ok)throw new Error('http '+r.status);
    return{ok:true,json:()=>r.json().then(d=>mm?limpiaNodo(mm[1],d):limpia(d))}});
};
window.EventSource=function(u,o){return new _ES(TOK?u+(u.includes('?')?'&':'?')+'auth='+TOK:u,o)};

// los gastos también viajan a la nube y entran al respaldo
const _pull2=pull,_pushAll2=pushAll;
pull=function(){_pull2();if(!CL.url)return;
  fetch(curl('gastos')).then(r=>r.json()).then(d=>{
    if(d){GA=Object.values(d).sort((a,b)=>a.f<b.f?-1:1);S('pos_gastos',GA);refresca()}
    else if(GA.length)pushPatch({gastos:obj(GA,x=>x.id)})}).catch(()=>{})};
pushAll=function(){_pushAll2();pushPatch({gastos:obj(GA,x=>x.id)})};

// ===== Todo editable: puercos, chorizo y gastos =====
function purga(){PU=PU.filter(u=>!u.borrado);CH=CH.filter(c=>!c.borrado)} // los borrados quedan marcados en la nube y se ocultan aquí
const _ref=refresca;refresca=function(){purga();_ref()};
function totCortes(L){
  const t={};L.forEach(u=>filaP(u).forEach(r=>t[r.n]=(t[r.n]||0)+r.kg));
  const ch=['Chicharrón','Cachete','Carnitas','Dentros'].reduce((a,k)=>a+(t[k]||0),0);
  return`<div class="card"><b>Kg por corte</b>${Object.keys(t).map(k=>`<div class="row"><span>${esc(k)}</span><b>${t[k].toFixed(1)} kg</b></div>`).join('')||'<p>Sin datos</p>'}<hr>
  <div class="row"><span>Fin de semana: chicharrón + cachete + carnitas + dentros (se vende junto)</span><b>${ch.toFixed(1)} kg</b></div></div>`;
}
const ajusta=(n,d)=>{const p=P.find(x=>x.n==n);if(p)p.s=Math.max(0,Math.round((p.s+d)*1000)/1000)};
function editarP(id){
  const u=PU.find(x=>x.id==id);if(!u)return;
  openM(`<h3>✏️ Editar puerco</h3><div class="g2"><label>Peso vivo (kg)<input id="e_peso" type="number" step="0.1" value="${u.peso}"></label>
  <label>Costo $<input id="e_costo" type="number" step="0.01" value="${u.costo}"></label></div>
  <div class="g2">${CORTES.map(c=>`<label>${c[2]||c[1]}<input id="e_${c[0]}" type="number" step="0.1" value="${u.cortes[c[0]]||''}"></label>`).join('')}</div>
  <small>Al guardar, el inventario se ajusta con la diferencia.</small>
  <button class="big ok" onclick="guardaEdP(${u.id})">Guardar cambios</button><button class="big gris" onclick="closeM()">Cancelar</button>`);
}
function guardaEdP(id){
  const u=PU.find(x=>x.id==id);if(!u)return;const n={};let kg=0;
  CORTES.forEach(c=>{const v=+$('e_'+c[0]).value||0;n[c[0]]=v;kg+=v});
  if(n.espinazo>0&&n.chuleta>0)return alert('Espinazo y chuleta no van juntos: deja solo uno.');
  CORTES.forEach(c=>ajusta(c[1],n[c[0]]-(u.cortes[c[0]]||0)));
  for(const k in u.cortes)if(!(k in n)){n[k]=u.cortes[k];kg+=u.cortes[k]} // cortes de registros viejos
  u.cortes=n;u.kg=kg;u.peso=+$('e_peso').value||0;u.costo=+$('e_costo').value||0;u.editado=new Date().toISOString();
  S('pos_puercos',PU);guardaP();pushPatch({['puercos/'+u.id]:u});bitacora('Puerco editado');closeM();admV('p:'+u.id);
}
function borraP(id){
  const u=PU.find(x=>x.id==id);if(!u||!confirm('¿Borrar este puerco? Sus kg se restan del inventario.'))return;
  CORTES.forEach(c=>ajusta(c[1],-(u.cortes[c[0]]||0)));
  u.borrado=true;pushPatch({['puercos/'+u.id]:u});bitacora('Puerco borrado');purga();S('pos_puercos',PU);guardaP();admV('puercos');
}
function editaChorizo(id){
  const c=CH.find(x=>x.id==id);if(!c)return;
  openM(`<h3>✏️ Editar chorizo</h3><label>Kg<input id="ec_kg" type="number" step="0.1" value="${c.kg}"></label>
  <label>Costo $<input id="ec_costo" type="number" step="0.01" value="${c.costo}"></label><label>Nota<input id="ec_nota" value="${esc(c.nota||'')}"></label>
  <button class="big ok" onclick="guardaEdC(${c.id})">Guardar cambios</button><button class="big gris" onclick="closeM()">Cancelar</button>`);
}
function guardaEdC(id){
  const c=CH.find(x=>x.id==id),kg=+$('ec_kg').value||0;if(!c||!kg)return alert('Captura los kg');
  ajusta('Chorizo Casero',kg-c.kg);c.kg=kg;c.costo=+$('ec_costo').value||0;c.nota=$('ec_nota').value.trim();
  S('pos_chorizo',CH);guardaP();pushPatch({['chorizo/'+c.id]:c});closeM();rMat();
}
function borraChorizo(id){
  const c=CH.find(x=>x.id==id);if(!c||!confirm('¿Borrar este lote? Sus kg se restan del inventario.'))return;
  ajusta('Chorizo Casero',-c.kg);c.borrado=true;pushPatch({['chorizo/'+c.id]:c});purga();S('pos_chorizo',CH);guardaP();rMat();
}
function editaGasto(id){
  const g=GA.find(x=>x.id==id);if(!g)return;
  openM(`<h3>✏️ Editar gasto</h3><label>Tipo<select id="eg_t">${TIPOS_G.map(t=>`<option ${t==g.tipo?'selected':''}>${t}</option>`).join('')}</select></label>
  <label>Monto $<input id="eg_m" type="number" step="0.01" value="${g.monto}"></label><label>Descripción<input id="eg_d" value="${esc(g.desc||'')}"></label>
  <button class="big ok" onclick="guardaEdG(${g.id})">Guardar cambios</button><button class="big gris" onclick="closeM()">Cancelar</button>`);
}
function guardaEdG(id){
  const g=GA.find(x=>x.id==id),mo=+$('eg_m').value||0;if(!g||mo<=0)return alert('Captura el monto');
  g.tipo=$('eg_t').value;g.monto=mo;g.desc=$('eg_d').value.trim();S('pos_gastos',GA);pushPatch({['gastos/'+g.id]:g});closeM();rGas();
}
// ===== Color verde (alertas de stock bajo siguen en rojo) =====
(function(){try{
  const st=document.createElement('style');
  st.textContent=':root{--rojo:#15803d;--rojo2:#14532d;--verde:#166534;--fondo:#f3f8f4;--borde:#d5e6da}.low{color:#b91c1c!important}.sm.del{color:#b91c1c}nav button.on{background:#e8f5ec}';
  document.head.appendChild(st);
  document.querySelector('meta[name=theme-color]').content='#15803d';
  const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');
  x.fillStyle='#15803d';x.fillRect(0,0,512,512);x.font='320px serif';x.textAlign='center';x.textBaseline='middle';x.fillText('🥩',256,276);
  const ico=c.toDataURL('image/png');
  document.querySelectorAll('link[rel=icon],link[rel=apple-touch-icon]').forEach(l=>l.href=ico);
  const old=document.querySelector('link[rel=manifest]');if(old)old.remove();
  const lm=document.createElement('link');lm.rel='manifest';
  lm.href=URL.createObjectURL(new Blob([JSON.stringify({name:'Carnicería San Judas',short_name:'San Judas',start_url:location.href.split('#')[0],display:'standalone',
    background_color:'#15803d',theme_color:'#15803d',icons:[{src:ico,sizes:'512x512',type:'image/png',purpose:'any'}]})],{type:'application/manifest+json'}));
  document.head.appendChild(lm);
}catch(e){console.log('Color:',e)}})();
function chart(){ // gráfica de 7 días en verde
  const c=$('cv');if(!c)return;const x=c.getContext('2d'),w=c.width=c.clientWidth,h=c.height=180;
  const d=[];for(let i=6;i>=0;i--){const t=new Date();t.setDate(t.getDate()-i);const k=dk(t);d.push([t.getDate()+'/'+(t.getMonth()+1),sumV(V.filter(v=>dk(v.f)==k))])}
  const mx=Math.max(1,...d.map(a=>a[1])),bw=w/7;
  d.forEach((a,i)=>{const bh=(h-45)*a[1]/mx;x.fillStyle='#15803d';x.fillRect(i*bw+8,h-20-bh,bw-16,bh);
    x.fillStyle='#333';x.font='11px sans-serif';x.textAlign='center';x.fillText(a[0],i*bw+bw/2,h-6);x.fillText('$'+Math.round(a[1]),i*bw+bw/2,h-24-bh)});
}

// ===== Ticket con cada compra: cobro con cambio, imprimir, compartir y reimprimir =====
(function(){try{const st=document.createElement('style');st.textContent='@media print{@page{margin:3mm}#ticket{width:100%}}';document.head.appendChild(st)}catch(e){}})();
const totalCart=()=>cart.reduce((a,l)=>{const p=P.find(x=>x.id==l.id);return a+(p?p.p*l.q:0)},0)+(dom&&cart.length?10:0);
const folioT=v=>v.folio||String(v.id).slice(-6);
function cobrar(){ // paso 1: cuánto recibiste y cuánto es el cambio
  if(!cart.length)return alert('Carrito vacío');
  const tot=totalCart(),ap=localStorage.getItem('pos_autoprint')=='1';
  openM(`<h3>💵 Cobrar</h3><div class="tot">${m(tot)}</div>
  <label>Recibido $ (opcional)<input id="rc" type="number" inputmode="decimal" oninput="cambio(${tot})"></label>
  <div class="chips">${[0,50,100,200,500].map(x=>`<button class="chip" onclick="$('rc').value=${x?x:tot};cambio(${tot})">${x?'$'+x:'Exacto'}</button>`).join('')}</div>
  <div class="tot" id="cb" style="color:#15803d"></div>
  <label><input type="checkbox" id="ap" ${ap?'checked':''} onchange="localStorage.setItem('pos_autoprint',this.checked?'1':'0')"> Imprimir ticket automáticamente</label>
  <button class="big ok" onclick="confirmaCobro(${tot})">✅ Cobrar</button><button class="big gris" onclick="closeM()">Cancelar</button>`);
  setTimeout(()=>{try{$('rc').focus()}catch(e){}},100);
}
function cambio(tot){const r=+$('rc').value||0;$('cb').textContent=r?(r>=tot?'Cambio: '+m(r-tot):'Faltan '+m(tot-r)):''}
function confirmaCobro(tot){const r=+$('rc').value||0;if(r&&r<tot)return alert('El monto recibido es menor al total');vende(r)}
function vende(rec){ // paso 2: guarda la venta, descuenta stock y muestra el ticket
  const items=cart.map(l=>{const p=P.find(x=>x.id==l.id);return{id:p.id,n:p.n,c:p.c,q:l.q,p:p.p,cost:p.cost||0,u:p.u}});
  const falta=items.filter(i=>P.find(x=>x.id==i.id).s<i.q).map(i=>i.n);
  if(falta.length&&!confirm('Stock insuficiente de: '+falta.join(', ')+'. ¿Cobrar de todos modos?'))return;
  const tot=items.reduce((a,i)=>a+i.p*i.q,0)+(dom?10:0),d=new Date();
  const v={id:Date.now(),f:d.toISOString(),total:tot,dom:dom,cajero:localStorage.getItem('pos_cajero')||'Sin nombre',items:items,
    folio:p2(d.getDate())+p2(d.getMonth()+1)+'-'+p2(d.getHours())+p2(d.getMinutes())+p2(d.getSeconds()),rec:rec||0,cambio:rec?rec-tot:0};
  items.forEach(i=>{const p=P.find(x=>x.id==i.id);p.s=Math.round((p.s-i.q)*1000)/1000});
  V.push(v);try{S('pos_ventas',V)}catch(e){alert('⚠️ Espacio lleno en el teléfono. Descarga un respaldo en Admin y avísame.')}
  guardaP();pushPatch({['ventas/'+v.id]:v});
  cart=[];dom=false;closeM();rVenta();verTicket(v);
  if(localStorage.getItem('pos_autoprint')=='1')setTimeout(()=>window.print(),400);
}
function ticketHTML(v){
  return`<center><b>🥩 CARNICERÍA SAN JUDAS</b><br>${hora(v.f)}<br>Folio ${folioT(v)} · Cajero: ${esc(v.cajero)}</center><hr>`+
   v.items.map(i=>`${esc(i.n)}<br>&nbsp;${i.q} ${i.u} x ${m(i.p)} = ${m(i.p*i.q)}<br>`).join('')+(v.dom?'Domicilio: $10.00<br>':'')+
   `<hr><b>TOTAL: ${m(v.total)}</b>`+(v.rec?`<br>Recibido: ${m(v.rec)}<br>Cambio: ${m(v.cambio)}`:'')+`<br><center>¡Gracias por su compra!</center>`;
}
function verTicket(v){
  if(!v)return;$('ticket').innerHTML=ticketHTML(v); // #ticket es lo que se imprime
  openM(`<h3>🧾 Ticket</h3><div class="card" style="font-family:monospace;font-size:13px">${ticketHTML(v)}</div>
  <button class="big" onclick="window.print()">🖨️ Imprimir</button><button class="big gris" onclick="compartirT(${v.id})">📤 Compartir / WhatsApp</button>
  <button class="big ok" onclick="closeM()">✅ Listo, nueva venta</button>`);
}
function compartirT(id){
  const v=V.find(x=>x.id==id);if(!v)return;
  const t=['🥩 CARNICERÍA SAN JUDAS',hora(v.f)+' · Folio '+folioT(v),''].concat(v.items.map(i=>i.n+' '+i.q+' '+i.u+' x '+m(i.p)+' = '+m(i.p*i.q)),
    v.dom?['Domicilio: $10.00']:[],['','TOTAL: '+m(v.total)],v.rec?['Recibido: '+m(v.rec),'Cambio: '+m(v.cambio)]:[],['','¡Gracias por su compra!']).join('\n');
  if(navigator.share)navigator.share({text:t}).catch(()=>{});else window.open('https://wa.me/?text='+encodeURIComponent(t),'_blank');
}
function ultimosT(){ // reimprimir o volver a ver tickets anteriores
  openM(`<h3>🧾 Últimos tickets</h3><div style="max-height:60vh;overflow-y:auto">${[...V].reverse().slice(0,30).map(v=>
   `<div class="card row"><div><b>${folioT(v)}</b> · ${m(v.total)}<br><small>${hora(v.f)} · ${esc(v.cajero)}</small></div>
   <button class="sm" onclick="verTicket(V.find(x=>x.id==${v.id}))">Ver</button></div>`).join('')||'<p>Sin ventas</p>'}</div>
  <button class="big gris" onclick="closeM()">Cerrar</button>`);
}

// ===== Activar =====
REND.venta=rVenta;REND.mat=rMat;REND.gas=rGas;REND.adm=rAdm;REND.inv=rInv;REND.prec=rPrec;
purga();migra();
show(document.querySelector('.tab.on').id.slice(2));
setTimeout(()=>{if(migra())refresca()},3000); // por si la nube trajo datos viejos
tokenOk().then(()=>conecta()); // abre la nube ya con el login
setInterval(()=>{TOK='';tokenOk().then(()=>conecta())},50*60000); // renueva el login cada 50 min
