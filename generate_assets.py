from pathlib import Path

root = Path('src/assets/images')

def write(folder, name, svg):
    path = root / folder / f'{name}.svg'
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(svg, encoding='utf-8')

def scene(title, c1, c2, motif='space'):
    base = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-label="{title}"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient><linearGradient id="glass" x2="0" y2="1"><stop stop-color="#ffffff" stop-opacity=".48"/><stop offset="1" stop-color="#ffffff" stop-opacity=".04"/></linearGradient></defs><rect width="1200" height="800" fill="url(#bg)"/><circle cx="970" cy="140" r="310" fill="#fff" opacity=".08"/><circle cx="970" cy="140" r="200" fill="none" stroke="#fff" opacity=".22"/><path d="M0 585 L1200 360 V800 H0" fill="#061f34" opacity=".32"/>'''
    if motif == 'space':
        base += '''<path d="M110 550V175l265-70 320 125v320z" fill="url(#glass)" stroke="#fff" stroke-opacity=".6" stroke-width="5"/><path d="M395 550V130m210 420V210M110 340h585" stroke="#fff" stroke-opacity=".42" stroke-width="5"/><path d="M695 550V260l245-75 115 70v295" fill="url(#glass)" stroke="#fff" stroke-opacity=".55" stroke-width="5"/><path d="M755 545V328l152-47v264" fill="#0b3450" opacity=".4"/>'''
    elif motif == 'car':
        base += '''<ellipse cx="610" cy="627" rx="450" ry="45" fill="#061a2d" opacity=".35"/><path d="M165 505l75-47 120-135q20-25 63-27h364q41 0 70 32l103 123 80 40q28 15 26 48l-8 57H149l-9-51q-7-28 25-40z" fill="#e7eef2" stroke="#b0c6d2" stroke-width="8"/><path d="M370 332h390q30 0 46 21l75 95H284z" fill="#244b66"/><path d="M555 333v116M245 466h705" stroke="#bfd2db" stroke-width="7"/><circle cx="335" cy="588" r="68" fill="#162736"/><circle cx="335" cy="588" r="33" fill="#8699a5"/><circle cx="872" cy="588" r="68" fill="#162736"/><circle cx="872" cy="588" r="33" fill="#8699a5"/><path d="M947 470l95 24-5 25h-73" fill="#ffdfb3"/>'''
    elif motif == 'abstract':
        base += '''<circle cx="535" cy="402" r="270" fill="none" stroke="#e7f5ff" stroke-width="95" opacity=".55"/><circle cx="535" cy="402" r="155" fill="none" stroke="#bed5e8" stroke-width="5"/><path d="M-40 710Q320 350 1220 700" fill="none" stroke="#fff" stroke-width="14" opacity=".6"/><path d="M-40 752Q400 400 1220 740" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>'''
    base += f'''<text x="80" y="730" fill="#fff" font-family="Arial,sans-serif" font-size="44" font-weight="700" letter-spacing="4">{title}</text></svg>'''
    return base

for name, title, colors in [
    ('goyang','GOYANG',('#295b78','#102c44')),('seoul','SEOUL',('#5c8296','#173850')),
    ('hanam','HANAM',('#537b83','#143a48')),('busan','BUSAN',('#35688b','#102b48')),
    ('beijing','BEIJING',('#607d93','#233f56')),('snow-park','SNOW PARK',('#8bb7cd','#2d6688'))]:
    write('locations', name, scene(title, *colors))
for name, title, colors in [
    ('gv80','GV80',('#668da4','#153b56')),('ioniq-5-n','IONIQ 5 N',('#5588a5','#113e62')),
    ('casper','CASPER',('#87a5b3','#25485b')),('g90','G90',('#4f7089','#101f35'))]:
    write('vehicles', name, scene(title, *colors, motif='car'))
for name, title, colors in [
    ('vehicle','VEHICLE EXHIBITION',('#627f94','#102d43')),('plastic','A NEW DISCOVERY',('#678f9b','#12404b')),
    ('heritage','RETRACING THE FIRST STEP',('#677d90','#20394e'))]:
    write('exhibitions', name, scene(title, *colors, motif='abstract'))
for name, title, colors in [('hydrogen','HYDROGEN ENERGY',('#3c87a3','#092e47')),('design','MOBILITY DESIGN',('#638ca3','#173d55'))]:
    write('programs', name, scene(title, *colors, motif='abstract'))
for name, title, colors in [('jacket-01','JACKET',('#657482','#24323e')),('pants-01','PANTS',('#8b9da8','#46545c'))]:
    write('products', name, scene(title, *colors, motif='abstract'))
for index, color in enumerate(['#293b4a','#d0dae0','#987d6b','#ba7865','#6a7983','#c4b8a3'], 1):
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="100" fill="#dce7ed"/><circle cx="100" cy="86" r="45" fill="{color}"/><path d="M25 190q10-65 75-65t75 65" fill="{color}"/><circle cx="84" cy="85" r="5" fill="#fff"/><circle cx="116" cy="85" r="5" fill="#fff"/><path d="M87 104q13 13 26 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>'''
    write('characters', f'character-0{index}', svg)
write('placeholders', 'product-fallback', scene('IMAGE NOT AVAILABLE','#8d9ba2','#50606b','abstract'))
write('common', 'logo-symbol', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#063452"/><path d="M14 40h52M40 14v52" stroke="#fff" stroke-width="8"/></svg>')
