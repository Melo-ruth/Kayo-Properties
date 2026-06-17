const menuBtn=document.querySelector('.hamb');const mobile=document.querySelector('.mobile-menu');if(menuBtn){menuBtn.onclick=()=>mobile.classList.toggle('open')}
const propertyData=[
 {title:'Clifftop Signature Residence',area:'Coastal Ridge',price:'From R 42,000,000',beds:5,baths:5,size:'780m²',tag:'Featured'},
 {title:'Modern City Penthouse',area:'Upper Avenue',price:'R 18,500,000',beds:3,baths:4,size:'310m²',tag:'Penthouse'},
 {title:'Private Family Villa',area:'Garden Estate',price:'R 11,950,000',beds:4,baths:4,size:'520m²',tag:'New'},
 {title:'Executive Rental Apartment',area:'Harbour Quarter',price:'R 42,000 / month',beds:2,baths:2,size:'140m²',tag:'To Let'},
 {title:'Student Living Studio',area:'Central Campus',price:'R 9,500 / month',beds:1,baths:1,size:'42m²',tag:'Student'}
];
function cards(targetId,filter='all'){const el=document.getElementById(targetId);if(!el)return;el.innerHTML=propertyData.slice(0,5).map(p=>`<article class="property-card"><div class="thumb"><span class="badge">${p.tag}</span></div><div class="property-body"><small>${p.area}</small><h3>${p.title}</h3><div class="meta"><span>${p.beds} Bed</span><span>${p.baths} Bath</span><span>${p.size}</span></div><div class="price">${p.price}</div></div></article>`).join('')}
cards('featured');cards('sale-list');cards('rental-list');cards('dev-list');
