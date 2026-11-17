"""Language coverage, continuous playback and failure-safe browser translation."""
import functools
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import os
from pathlib import Path
import shutil
import threading
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]

class Handler(SimpleHTTPRequestHandler):
    def log_message(self,*_): pass

server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/dist/'

try:
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
        context=browser.new_context(viewport={'width':1440,'height':1100},reduced_motion='reduce')
        errors=[]
        page=context.new_page()
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(base+'?lang=en')
        page.wait_for_selector('#role-list button')
        assert page.locator('script[src]').get_attribute('src').startswith('./app-')
        assert page.locator('link[rel=stylesheet]').get_attribute('href').startswith('./style-')
        assert page.locator('html').get_attribute('lang')=='en'
        assert page.locator('#guide-title').inner_text()=='An idea → a post'
        ids=['publication','reponse','reunion','comparatif','calque','coachos','eclipse','documentaire']
        for i,name in enumerate(ids):
            page.locator(f'[data-level="{i//2}"]').click()
            page.locator('#guide-picker').select_option(name,force=True)
            page.locator('#next').click()
            assert 'result' in page.locator('#document-label').inner_text()
            assert page.locator('#story-actors').inner_text().startswith('Who is working?')
        page.reload()
        page.wait_for_selector('#role-list button')
        assert page.locator('html').get_attribute('lang')=='en'
        assert page.locator('#step-status').inner_text()=='1/10 steps'
        page.locator('[data-language="fr"]').click()
        assert page.locator('#step-status').inner_text()=='1/10 étapes'
        assert page.locator('#document-label').inner_text().endswith('résultat')
        assert 'lang=fr' in page.url
        page.locator('[data-language="en"]').click()
        for width in [320,390,700,1024,1440]:
            page.set_viewport_size({'width':width,'height':1000})
            for language in ['en','fr']:
                page.locator(f'[data-language="{language}"]').click()
                for level in range(4):
                    page.locator(f'[data-level="{level}"]').click()
                    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),(width,language,level)
            if width==390: page.screenshot(path=str(ROOT/'test-results'/'mobile-readable.png'),full_page=True)
        # A real animated sequence moves directly from step 1 to step 2.
        page.emulate_media(reduced_motion='no-preference')
        page.locator('[data-level="0"]').click()
        page.locator('#replay').click()
        page.locator('#speed').select_option('2')
        map_top=page.locator('#world').evaluate('(el)=>el.getBoundingClientRect().top+scrollY')
        page.locator('#play').click()
        page.wait_for_function("document.getElementById('step-status').textContent === '1/3 étapes'",timeout=10000)
        assert page.locator('#play').get_attribute('aria-pressed')=='true'
        assert page.locator('#story-phase').inner_text()=='Transmission'
        assert abs(page.locator('#world').evaluate('(el)=>el.getBoundingClientRect().top+scrollY')-map_top)<1,'the scene must not move between captions'
        page.locator('[data-language="en"]').click()
        assert page.locator('#play').get_attribute('aria-pressed')=='true'
        assert page.locator('#step-status').inner_text()=='1/3 steps'
        role=page.locator('#role-list button').nth(1)
        role.focus();page.keyboard.press('Enter')
        assert role.evaluate('(el)=>document.activeElement===el'),'inspecting a role must keep keyboard focus'
        page.locator('#play').click()
        progress=page.locator('#progress').get_attribute('style')
        page.wait_for_timeout(500)
        assert page.locator('#progress').get_attribute('style')==progress
        assert page.locator('#map-caption').inner_text()=='Playback paused'
        page.locator('#play').click()
        page.wait_for_function("document.getElementById('next').textContent === 'Finish the guide'",timeout=10000)
        assert page.locator('#play').get_attribute('aria-pressed')=='false'
        page.screenshot(path=str(ROOT/'test-results'/'desktop-readable.png'),full_page=True)
        # Unsupported browsers keep both primary editions fully functional.
        page.evaluate("Object.defineProperty(window,'Translator',{value:undefined,configurable:true})")
        page.locator('#more-languages').click()
        assert 'does not provide' in page.locator('#translation-status').inner_text()
        page.locator('#translation-target').fill('es')
        page.locator('#generate-language').click()
        page.wait_for_function("!document.getElementById('generate-language').disabled")
        assert page.locator('html').get_attribute('lang')=='en'
        page.locator('#translation-target').fill('not a language!')
        page.locator('#generate-language').click()
        page.wait_for_function("document.getElementById('translation-status').textContent.includes('valid language code')")
        page.locator('#close-language').click()
        # Mocks test API handling, not translation quality or actual language support.
        page.evaluate("""window.mockCalls=0;Object.defineProperty(window,'Translator',{configurable:true,value:{availability:async()=> 'available',create:async()=>({translate:async text=>{window.mockCalls++;return 'T '+text},destroy:()=>{window.mockDestroyed=true}})}})""")
        page.locator('#more-languages').click()
        page.locator('#translation-target').fill('es')
        page.locator('#generate-language').click()
        page.wait_for_function("document.documentElement.lang==='es'",timeout=15000)
        assert page.locator('#automatic-warning').is_visible()
        assert page.locator('#step-status').inner_text().startswith('T ')
        assert page.evaluate('mockCalls>300 && mockDestroyed')
        assert '{step}' not in page.locator('#story-number').inner_text()
        page.locator('[data-language="en"]').click()
        page.evaluate("""Object.defineProperty(window,'Translator',{configurable:true,value:{availability:async()=> 'unavailable'}})""")
        page.locator('#more-languages').click()
        page.locator('#translation-target').fill('ko')
        page.locator('#generate-language').click()
        page.wait_for_function("document.getElementById('translation-status').textContent.includes('not supported')")
        assert page.locator('html').get_attribute('lang')=='en'
        page.locator('#close-language').click()
        # A partial failure must never activate a partially translated edition.
        page.evaluate("""window.mockCalls=0;Object.defineProperty(window,'Translator',{configurable:true,value:{availability:async()=> 'available',create:async()=>({translate:async text=>{if(++window.mockCalls===3)throw Error('model failed');return 'T '+text},destroy:()=>{}})}})""")
        page.locator('#more-languages').click()
        page.locator('#translation-target').fill('de')
        page.locator('#generate-language').click()
        page.wait_for_function("document.getElementById('translation-status').textContent.includes('did not finish')")
        assert page.locator('html').get_attribute('lang')=='en'
        assert page.locator('#play-text').inner_text()=='Play'
        page.locator('#close-language').click()
        # Cancellation discards late work and leaves the current language intact.
        page.evaluate("""Object.defineProperty(window,'Translator',{configurable:true,value:{availability:async()=> 'available',create:async()=>({translate:(text,{signal})=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>resolve('T '+text),200);signal.addEventListener('abort',()=>{clearTimeout(timer);reject(new DOMException('Aborted','AbortError'))},{once:true})}),destroy:()=>{}})}})""")
        page.locator('#more-languages').click()
        page.locator('#translation-target').fill('it')
        page.locator('#generate-language').click()
        page.locator('#cancel-translation').click()
        page.wait_for_timeout(350)
        assert page.locator('html').get_attribute('lang')=='en'
        assert not page.locator('#language-dialog').is_visible()
        # Generated RTL text changes direction without breaking the mobile layout.
        page.evaluate("""Object.defineProperty(window,'Translator',{configurable:true,value:{availability:async()=> 'available',create:async()=>({translate:async text=>'T '+text,destroy:()=>{}})}})""")
        page.locator('#more-languages').click()
        page.locator('#translation-target').fill('ar')
        page.locator('#generate-language').click()
        page.wait_for_function("document.documentElement.lang==='ar'",timeout=15000)
        assert page.locator('html').get_attribute('dir')=='rtl'
        page.set_viewport_size({'width':320,'height':900})
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        page.locator('[data-language="fr"]').click()
        assert page.locator('html').get_attribute('dir')=='ltr'
        assert not page.locator('#automatic-warning').is_visible()
        assert not errors,errors
        browser.close()
        print('OK: complete FR/EN, persistence, all responsive levels, uninterrupted playback, pause/resume, language switch during playback, safe automatic translation, unsupported/failed/cancelled translation and RTL layout.')
finally:
    server.shutdown()
